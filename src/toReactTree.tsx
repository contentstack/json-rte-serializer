import React, { ReactNode } from 'react'
import { IJsonToReactOptions, IJsonToReactElementHandler, IJsonToReactTextHandler } from './types'

// ---------------------------------------------------------------------------
// Default text mark wrappers (bold → <strong>, italic → <em>, etc.)
// ---------------------------------------------------------------------------
const DEFAULT_TEXT_MARKS: Record<string, IJsonToReactTextHandler> = {
  bold: (children) => <strong>{children}</strong>,
  italic: (children) => <em>{children}</em>,
  underline: (children) => <u>{children}</u>,
  strikethrough: (children) => <del>{children}</del>,
  superscript: (children) => <sup>{children}</sup>,
  subscript: (children) => <sub>{children}</sub>,
  inlineCode: (children) => <span data-type="inlineCode">{children}</span>,
}

// ---------------------------------------------------------------------------
// Default element handlers — produce standard HTML elements
// ---------------------------------------------------------------------------
const DEFAULT_ELEMENT_TYPES: Record<string, IJsonToReactElementHandler> = {
  p: (_jsonBlock, children) => <p>{children}</p>,
  h1: (_jsonBlock, children) => <h1>{children}</h1>,
  h2: (_jsonBlock, children) => <h2>{children}</h2>,
  h3: (_jsonBlock, children) => <h3>{children}</h3>,
  h4: (_jsonBlock, children) => <h4>{children}</h4>,
  h5: (_jsonBlock, children) => <h5>{children}</h5>,
  h6: (_jsonBlock, children) => <h6>{children}</h6>,
  blockquote: (_jsonBlock, children) => <blockquote>{children}</blockquote>,
  code: (_jsonBlock, children) => <pre>{children}</pre>,
  ol: (_jsonBlock, children) => <ol>{children}</ol>,
  ul: (_jsonBlock, children) => <ul>{children}</ul>,
  li: (_jsonBlock, children) => <li>{children}</li>,
  a: (jsonBlock, children) => {
    const { url, target } = jsonBlock.attrs || {}
    return <a href={url} target={target || undefined}>{children}</a>
  },
  img: (jsonBlock) => {
    const attrs = jsonBlock.attrs || {}
    const src = attrs['redactor-attributes']?.['asset-link'] || attrs.url || attrs.src
    const alt = attrs['redactor-attributes']?.alt || attrs.alt || ''
    return <img src={src} alt={alt} />
  },
  embed: (jsonBlock) => {
    const src = jsonBlock.attrs?.src
    return <iframe src={src} />
  },
  'social-embeds': (jsonBlock) => {
    const src = jsonBlock.attrs?.src
    return <iframe src={src} data-type="social-embeds" />
  },
  hr: () => <hr />,
  table: (_jsonBlock, children) => <table>{children}</table>,
  thead: (_jsonBlock, children) => <thead>{children}</thead>,
  tbody: (_jsonBlock, children) => <tbody>{children}</tbody>,
  tr: (_jsonBlock, children) => <tr>{children}</tr>,
  td: (_jsonBlock, children) => <td>{children}</td>,
  th: (_jsonBlock, children) => <th>{children}</th>,
  trgrp: (_jsonBlock, children) => <>{children}</>,
  span: (_jsonBlock, children) => <span>{children}</span>,
  div: (_jsonBlock, children) => <div>{children}</div>,
  fragment: (_jsonBlock, children) => <>{children}</>,
  'check-list': (_jsonBlock, children) => <p>{children}</p>,
  row: (_jsonBlock, children) => <div style={{ maxWidth: '100%', display: 'flex' }}>{children}</div>,
  column: (jsonBlock, children) => {
    const width = jsonBlock?.meta?.width
    return <div style={{ flexGrow: 0, flexShrink: 0, position: 'relative', width: width ? `${width * 100}%` : undefined, margin: '0 0.25rem' }}>{children}</div>
  },
  'grid-container': (jsonBlock, children) => {
    const gutter = jsonBlock.attrs?.gutter
    return <div style={{ display: 'flex', width: '100%', gap: gutter ? `${gutter}px` : undefined }}>{children}</div>
  },
  'grid-child': (jsonBlock, children) => {
    const gridRatio = jsonBlock.attrs?.gridRatio
    return <div style={{ flex: gridRatio }}>{children}</div>
  },
  reference: (_jsonBlock, children) => <div>{children}</div>,
  style: (_jsonBlock, children) => <style>{children}</style>,
  script: (_jsonBlock, children) => <script>{children}</script>,
}

// ---------------------------------------------------------------------------
// Text node processing — applies marks as wrapping React elements
// ---------------------------------------------------------------------------
function processTextNodeReact(
  jsonValue: any,
  textMarks: Record<string, IJsonToReactTextHandler>,
): ReactNode {
  if (!jsonValue.text && jsonValue.text !== '') return null

  // Start with raw text
  let node: ReactNode = jsonValue.text

  // Handle line breaks
  if (jsonValue.break || jsonValue.text.includes('\n')) {
    const parts = String(jsonValue.text).split('\n')
    node = parts.reduce<ReactNode[]>((acc, part, i) => {
      if (i > 0) acc.push(<br key={`br-${i}`} />)
      if (part) acc.push(part)
      return acc
    }, [])
    if (Array.isArray(node) && node.length === 1) node = node[0]
  }

  // Apply text marks (bold, italic, etc.)
  for (const [mark, handler] of Object.entries(textMarks)) {
    if (jsonValue[mark]) {
      node = handler(node, jsonValue[mark])
    }
  }

  // Handle classname/id wrapping
  if (jsonValue.classname || jsonValue.id) {
    node = <span className={jsonValue.classname || undefined} id={jsonValue.id || undefined}>{node}</span>
  }

  // Handle inline styles on text
  if (jsonValue.attrs?.style) {
    const { color, 'font-family': fontFamily, 'font-size': fontSize } = jsonValue.attrs.style
    const style: React.CSSProperties = {}
    if (color) style.color = color
    if (fontFamily) style.fontFamily = fontFamily
    if (fontSize) style.fontSize = fontSize
    if (Object.keys(style).length > 0) {
      node = <span style={style}>{node}</span>
    }
  }

  return node
}

// ---------------------------------------------------------------------------
// Main recursive tree walker
// ---------------------------------------------------------------------------
function walkNode(
  jsonValue: any,
  elementTypes: Record<string, IJsonToReactElementHandler>,
  textMarks: Record<string, IJsonToReactTextHandler>,
  key: string,
): ReactNode {
  // Text leaf node
  if (jsonValue.hasOwnProperty('text')) {
    return processTextNodeReact(jsonValue, textMarks)
  }

  // Recursively render children
  let children: ReactNode = null
  if (jsonValue.children && Array.isArray(jsonValue.children)) {
    const childNodes = jsonValue.children.map((child: any, i: number) =>
      walkNode(child, elementTypes, textMarks, `${key}-${i}`)
    )
    // Flatten single-element arrays for cleaner output
    children = childNodes.length === 1 ? childNodes[0] : childNodes
  }

  // Doc root — just return children
  if (jsonValue.type === 'doc' || !jsonValue.type) {
    return children
  }

  // Look up handler
  const handler = elementTypes[jsonValue.type]
  if (handler) {
    const element = handler(jsonValue, children)
    // Add key if it's a valid element
    if (React.isValidElement(element)) {
      return React.cloneElement(element, { key })
    }
    return element
  }

  // Fallback: render as-is (unknown type)
  return children
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Convert a Contentstack JSON RTE document to a React element tree.
 *
 * Unlike jsonToHtml (which serializes to an HTML string), this returns real
 * React elements. Custom handlers receive the JSON block and pre-rendered
 * children, and return ReactNode directly — no renderToStaticMarkup needed.
 *
 * Components returned from handlers are live React elements that participate
 * in the normal React lifecycle (hooks, context, Suspense, etc.).
 */
export function toReactTree(jsonValue: any, options?: IJsonToReactOptions): ReactNode {
  const elementTypes: Record<string, IJsonToReactElementHandler> = {
    ...DEFAULT_ELEMENT_TYPES,
    ...options?.customElementTypes,
  }
  const textMarks: Record<string, IJsonToReactTextHandler> = {
    ...DEFAULT_TEXT_MARKS,
    ...options?.customTextMarks,
  }

  return walkNode(jsonValue, elementTypes, textMarks, 'rte')
}
