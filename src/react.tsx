/**
 * React primitives for toTree<ReactNode>.
 *
 * Import from '@contentstack/json-rte-serializer/react' to get:
 * - jsonToReact()        — convenience wrapper around toTree<ReactNode>
 * - reactPrimitives      — createText, createLineBreak, combineChildren, etc.
 * - defaultElementTypes   — p→<p>, h1→<h1>, a→<a>, etc.
 * - defaultTextMarks      — bold→<strong>, italic→<em>, etc.
 *
 * These are the building blocks. Use them directly, spread/override them,
 * or ignore them and build your own IJsonToTreeOptions<ReactNode> from scratch.
 */

import React, { ReactNode } from 'react'
import { toTree, IJsonToTreeOptions } from './toTree'

// ---------------------------------------------------------------------------
// Primitives — the low-level callbacks for toTree<ReactNode>
// ---------------------------------------------------------------------------

export const reactPrimitives = {
  createText: (text: string): ReactNode => text,
  createLineBreak: (key: string): ReactNode => <br key={key} />,
  combineChildren: (children: ReactNode[]): ReactNode => <>{children}</>,
  wrapTextAttrs: (node: ReactNode, attrs: { classname?: string; id?: string }): ReactNode => (
    <span className={attrs.classname} id={attrs.id}>{node}</span>
  ),
  wrapTextStyle: (node: ReactNode, style: { color?: string; fontFamily?: string; fontSize?: string }): ReactNode => {
    const cssStyle: React.CSSProperties = {}
    if (style.color) cssStyle.color = style.color
    if (style.fontFamily) cssStyle.fontFamily = style.fontFamily
    if (style.fontSize) cssStyle.fontSize = style.fontSize
    return <span style={cssStyle}>{node}</span>
  },
  keyElement: (element: ReactNode, key: string): ReactNode => {
    if (React.isValidElement(element)) {
      return React.cloneElement(element, { key })
    }
    return element
  },
} as const satisfies Omit<IJsonToTreeOptions<ReactNode>, 'elementTypes' | 'textMarks'>

// ---------------------------------------------------------------------------
// Default text mark handlers
// ---------------------------------------------------------------------------

export const defaultTextMarks: Record<string, (children: ReactNode, value?: any) => ReactNode> = {
  bold: (children) => <strong>{children}</strong>,
  italic: (children) => <em>{children}</em>,
  underline: (children) => <u>{children}</u>,
  strikethrough: (children) => <del>{children}</del>,
  superscript: (children) => <sup>{children}</sup>,
  subscript: (children) => <sub>{children}</sub>,
  inlineCode: (children) => <span data-type="inlineCode">{children}</span>,
}

// ---------------------------------------------------------------------------
// HTML content model helpers
// ---------------------------------------------------------------------------

/**
 * JSON RTE types whose rendered output is phrasing (inline) content.
 * Text nodes (which have no `type`) are implicitly phrasing.
 * Any child type NOT in this set is assumed to produce block-level output
 * and will cause phrasing-only parents (p, h1–h6) to upgrade to <div>.
 *
 * This is a whitelist — unknown/custom types default to block-level,
 * which is the safe choice for valid HTML nesting.
 */
const PHRASING_TYPES: ReadonlySet<string> = new Set([
  'a', 'span', 'img', 'fragment',
  'embed', 'social-embeds',
])

/**
 * Check whether a JSON RTE node contains any children that would produce
 * block-level HTML output. Text nodes (no `type` property) are always safe.
 */
function hasBlockChild(jsonBlock: any): boolean {
  return jsonBlock.children?.some(
    (child: any) => child.type && !PHRASING_TYPES.has(child.type),
  ) ?? false
}

/**
 * Wrap children in a phrasing-only element (p, h1–h6), auto-upgrading to
 * <div> with a CSS class when block-level children are present.
 * This prevents invalid HTML nesting (e.g. <div> inside <p>) that causes
 * hydration mismatches in React SSR.
 */
function phrasingContainer(tag: string, jsonBlock: any, children: ReactNode | null): ReactNode {
  if (hasBlockChild(jsonBlock)) {
    return <div className={`rte-${tag}`}>{children}</div>
  }
  return React.createElement(tag, null, children)
}

// ---------------------------------------------------------------------------
// Default element type handlers
// ---------------------------------------------------------------------------

export const defaultElementTypes: Record<string, (jsonBlock: any, children: ReactNode | null) => ReactNode> = {
  p: (jb, ch) => phrasingContainer('p', jb, ch),
  h1: (jb, ch) => phrasingContainer('h1', jb, ch),
  h2: (jb, ch) => phrasingContainer('h2', jb, ch),
  h3: (jb, ch) => phrasingContainer('h3', jb, ch),
  h4: (jb, ch) => phrasingContainer('h4', jb, ch),
  h5: (jb, ch) => phrasingContainer('h5', jb, ch),
  h6: (jb, ch) => phrasingContainer('h6', jb, ch),
  blockquote: (_, ch) => <blockquote>{ch}</blockquote>,
  code: (_, ch) => <pre>{ch}</pre>,
  ol: (_, ch) => <ol>{ch}</ol>,
  ul: (_, ch) => <ul>{ch}</ul>,
  li: (_, ch) => <li>{ch}</li>,
  a: (jb, ch) => {
    const { url, target } = jb.attrs || {}
    return <a href={url} target={target || undefined}>{ch}</a>
  },
  img: (jb) => {
    const attrs = jb.attrs || {}
    const src = attrs['redactor-attributes']?.['asset-link'] || attrs.url || attrs.src
    const alt = attrs['redactor-attributes']?.alt || attrs.alt || ''
    return <img src={src} alt={alt} />
  },
  embed: (jb) => <iframe src={jb.attrs?.src} />,
  'social-embeds': (jb) => <iframe src={jb.attrs?.src} data-type="social-embeds" />,
  hr: () => <hr />,
  table: (_, ch) => <table>{ch}</table>,
  thead: (_, ch) => <thead>{ch}</thead>,
  tbody: (_, ch) => <tbody>{ch}</tbody>,
  tr: (_, ch) => <tr>{ch}</tr>,
  td: (_, ch) => <td>{ch}</td>,
  th: (_, ch) => <th>{ch}</th>,
  trgrp: (_, ch) => <>{ch}</>,
  span: (_, ch) => <span>{ch}</span>,
  div: (_, ch) => <div>{ch}</div>,
  fragment: (_, ch) => <>{ch}</>,
  'check-list': (jb, ch) => phrasingContainer('p', jb, ch),
  row: (_, ch) => <div style={{ maxWidth: '100%', display: 'flex' }}>{ch}</div>,
  column: (jb, ch) => {
    const width = jb?.meta?.width
    return <div style={{ flexGrow: 0, flexShrink: 0, position: 'relative', width: width ? `${width * 100}%` : undefined, margin: '0 0.25rem' }}>{ch}</div>
  },
  'grid-container': (jb, ch) => {
    const gutter = jb.attrs?.gutter
    return <div style={{ display: 'flex', width: '100%', gap: gutter ? `${gutter}px` : undefined }}>{ch}</div>
  },
  'grid-child': (jb, ch) => {
    const gridRatio = jb.attrs?.gridRatio
    return <div style={{ flex: gridRatio }}>{ch}</div>
  },
  reference: (_, ch) => <div>{ch}</div>,
  style: (_, ch) => <style>{ch}</style>,
  script: (_, ch) => <script>{ch}</script>,
}

// ---------------------------------------------------------------------------
// Convenience wrapper
// ---------------------------------------------------------------------------

export type IJsonToReactOptions = {
  /** Override or add element type handlers. Merged on top of defaultElementTypes. */
  customElementTypes?: Record<string, (jsonBlock: any, children: ReactNode | null) => ReactNode>
  /** Override or add text mark handlers. Merged on top of defaultTextMarks. */
  customTextMarks?: Record<string, (children: ReactNode, value?: any) => ReactNode>
}

/**
 * Convert a Contentstack JSON RTE document to a React element tree.
 *
 * This is a convenience wrapper around `toTree<ReactNode>()` that pre-applies
 * the React primitives and default handlers. Pass `customElementTypes` and/or
 * `customTextMarks` to override specific types.
 */
export function jsonToReact(jsonValue: any, options?: IJsonToReactOptions): ReactNode {
  const treeOptions: IJsonToTreeOptions<ReactNode> = {
    ...reactPrimitives,
    elementTypes: { ...defaultElementTypes, ...options?.customElementTypes },
    textMarks: { ...defaultTextMarks, ...options?.customTextMarks },
  }
  return toTree(jsonValue, treeOptions)
}
