#!/bin/sh
# Secret scan with trufflehog, used by the husky pre-commit and pre-push hooks.
#
# Usage: scripts/trufflehog-scan.sh [hook-name]
#
# Scans the CURRENT FILESYSTEM only — never git history. The scanned set is
# tracked + untracked files that are not gitignored, mirrored into a temp tree
# so gitignored local files (e.g. an .npmrc auth token) cannot fail the hook.
# Paths in scripts/trufflehog-exclude.txt are skipped.
set -e

HOOK="${1:-trufflehog}"
PAD=$(printf '%*s' ${#HOOK} '')

# GUI git clients (VSCode Source Control, GitHub Desktop, Tower, Fork...) often
# launch git from a process tree rooted at Finder, which never sourced the
# user's login shell profile. Homebrew's bin dir is therefore missing from PATH
# and trufflehog looks uninstalled even when it is not. Add the standard
# Homebrew locations for Apple Silicon and Intel before looking it up.
PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export PATH

if ! command -v trufflehog >/dev/null 2>&1; then
  echo "$HOOK: trufflehog not found in PATH — cannot verify there are no secrets."
  echo "$PAD  install it with: brew install trufflehog"
  echo "$PAD  aborting: an unverifiable tree is treated as a failure, not a pass."
  exit 1
fi

REPO_ROOT=$(git rev-parse --show-toplevel)

TMPDIR_SCAN=$(mktemp -d)
trap 'rm -rf "$TMPDIR_SCAN"' EXIT

# Build the file list first so a git failure aborts instead of silently
# producing an empty (and therefore trivially "clean") scan set.
FILE_LIST="$TMPDIR_SCAN.files"
if ! git -C "$REPO_ROOT" ls-files --cached --others --exclude-standard -z > "$FILE_LIST"; then
  echo "$HOOK: failed to list repository files. Aborting."
  rm -f "$FILE_LIST"
  exit 1
fi

# rsync copies the NUL-delimited list in one pass and creates parent dirs for
# us. Deliberately not a `read -d ''` loop: that is a bashism, and this script
# runs under /bin/sh, which is dash on CI runners.
if ! command -v rsync >/dev/null 2>&1; then
  echo "$HOOK: rsync not found in PATH — cannot assemble the scan set. Aborting."
  rm -f "$FILE_LIST"
  exit 1
fi

if ! rsync -a --files-from="$FILE_LIST" --from0 "$REPO_ROOT/" "$TMPDIR_SCAN/"; then
  echo "$HOOK: failed to copy files for scanning. Aborting."
  rm -f "$FILE_LIST"
  exit 1
fi
rm -f "$FILE_LIST"

# trufflehog exits 0 on a path it cannot read, so an empty scan set would look
# clean. Refuse to pass in that case.
if [ -z "$(find "$TMPDIR_SCAN" -type f -print -quit)" ]; then
  echo "$HOOK: no files were collected to scan. Aborting rather than passing."
  exit 1
fi

echo "$HOOK: scanning current filesystem for secrets..."
set +e
trufflehog filesystem "$TMPDIR_SCAN" \
  --exclude-paths "$REPO_ROOT/scripts/trufflehog-exclude.txt" \
  --results=verified,unknown,unverified \
  --no-update --fail
SCAN_STATUS=$?
set -e

# 183 is trufflehog's --fail code for "secrets found"; anything else non-zero
# means the scan itself broke. Both block: never pass on an unverified tree.
if [ "$SCAN_STATUS" = "183" ]; then
  echo ""
  echo "$HOOK: potential secrets found. Aborted."
  echo "$PAD  remove them, or re-run with --no-verify if this is a false positive."
  exit 1
elif [ "$SCAN_STATUS" != "0" ]; then
  echo ""
  echo "$HOOK: trufflehog exited with status $SCAN_STATUS (scan failed). Aborted."
  echo "$PAD  the tree could not be verified, so this is treated as a failure."
  exit 1
fi

echo "$HOOK: no secrets found."
