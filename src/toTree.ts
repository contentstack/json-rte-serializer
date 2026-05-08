/**
 * Generic JSON RTE tree walker.
 *
 * Converts a Contentstack JSON RTE document into an arbitrary output type `T`
 * by delegating all construction to caller-provided callbacks. The walker owns
 * the recursion logic; the caller owns the output format (React elements,
 * HTML strings, Preact vnodes, etc.).
 */

export interface IJsonToTreeOptions<T> {
  /** Map element type → handler. Receives (jsonBlock, children) and returns T. */
  elementTypes: Record<string, (jsonBlock: any, children: T | null) => T>
  /** Map text mark name → handler. Wraps already-built children in a mark. */
  textMarks?: Record<string, (children: T, value?: any) => T>
  /** Convert a raw text string to T. */
  createText: (text: string) => T
  /** Create a line break. */
  createLineBreak: (key: string) => T
  /** Combine an array of children into a single T. */
  combineChildren: (children: T[]) => T
  /** Wrap a text node with classname/id metadata. */
  wrapTextAttrs?: (node: T, attrs: { classname?: string; id?: string }) => T
  /** Wrap a text node with inline styles. */
  wrapTextStyle?: (node: T, style: { color?: string; fontFamily?: string; fontSize?: string }) => T
  /** Assign a stable key/identifier to an element (React: cloneElement with key; strings: no-op). */
  keyElement?: (element: T, key: string) => T
}

// ---------------------------------------------------------------------------
// Text node processing
// ---------------------------------------------------------------------------
function processTextNode<T>(
  jsonValue: any,
  opts: IJsonToTreeOptions<T>,
  parentKey: string,
): T {
  const textMarks = opts.textMarks ?? {}

  // Start with raw text
  let node: T

  // Handle line breaks
  if (jsonValue.break || (jsonValue.text && jsonValue.text.includes('\n'))) {
    const parts = String(jsonValue.text).split('\n')
    const pieces: T[] = []
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) pieces.push(opts.createLineBreak(`${parentKey}-br-${i}`))
      if (parts[i]) pieces.push(opts.createText(parts[i]))
    }
    node = pieces.length === 1 ? pieces[0] : opts.combineChildren(pieces)
  } else {
    node = opts.createText(jsonValue.text)
  }

  // Apply text marks (bold, italic, etc.)
  for (const [mark, handler] of Object.entries(textMarks)) {
    if (jsonValue[mark]) {
      node = handler(node, jsonValue[mark])
    }
  }

  // Handle classname/id wrapping
  if ((jsonValue.classname || jsonValue.id) && opts.wrapTextAttrs) {
    node = opts.wrapTextAttrs(node, {
      classname: jsonValue.classname || undefined,
      id: jsonValue.id || undefined,
    })
  }

  // Handle inline styles on text
  if (jsonValue.attrs?.style && opts.wrapTextStyle) {
    const { color, 'font-family': fontFamily, 'font-size': fontSize } = jsonValue.attrs.style
    if (color || fontFamily || fontSize) {
      node = opts.wrapTextStyle(node, { color, fontFamily, fontSize })
    }
  }

  return node
}

// ---------------------------------------------------------------------------
// Recursive tree walker
// ---------------------------------------------------------------------------
function walkNode<T>(
  jsonValue: any,
  opts: IJsonToTreeOptions<T>,
  key: string,
): T | null {
  // Text leaf node
  if (jsonValue.hasOwnProperty('text')) {
    if (!jsonValue.text && jsonValue.text !== '') return null
    return processTextNode(jsonValue, opts, key)
  }

  // Recursively render children
  let children: T | null = null
  if (jsonValue.children && Array.isArray(jsonValue.children)) {
    const childNodes: T[] = []
    for (let i = 0; i < jsonValue.children.length; i++) {
      const child = walkNode(jsonValue.children[i], opts, `${key}-${i}`)
      if (child != null) childNodes.push(child)
    }
    if (childNodes.length === 1) {
      children = childNodes[0]
    } else if (childNodes.length > 1) {
      children = opts.combineChildren(childNodes)
    }
  }

  // Doc root — just return children
  if (jsonValue.type === 'doc' || !jsonValue.type) {
    return children
  }

  // Look up handler
  const handler = opts.elementTypes[jsonValue.type]
  if (handler) {
    const element = handler(jsonValue, children)
    // Assign key if the caller provided a keyElement callback
    if (opts.keyElement) {
      return opts.keyElement(element, key)
    }
    return element
  }

  // Fallback: unknown type — pass children through
  return children
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Convert a Contentstack JSON RTE document into an arbitrary output type `T`.
 *
 * The walker handles recursion; the caller provides all construction callbacks
 * via `options`. This makes the function agnostic to the output format —
 * React elements, Preact vnodes, HTML strings, or anything else.
 */
export function toTree<T>(jsonValue: any, options: IJsonToTreeOptions<T>): T | null {
  return walkNode(jsonValue, options, 'rte')
}
