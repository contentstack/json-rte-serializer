import React, { ReactNode, isValidElement } from 'react'
import { jsonToReact, reactPrimitives, defaultElementTypes, defaultTextMarks } from '../src/react'

// ---------------------------------------------------------------------------
// Helpers — inspect ReactNode tree without react-dom
// ---------------------------------------------------------------------------

/** Recursively collect text content from a ReactNode tree. */
function textContent(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textContent).join('')
  if (isValidElement(node)) {
    return textContent(node.props.children)
  }
  return ''
}

/** Get the outermost element type (tag name) from a ReactNode. */
function rootType(node: ReactNode): string | null {
  if (isValidElement(node)) return node.type as string
  return null
}

/** Get props from the outermost element. */
function rootProps(node: ReactNode): Record<string, any> | null {
  if (isValidElement(node)) return node.props
  return null
}

// ---------------------------------------------------------------------------
// reactPrimitives
// ---------------------------------------------------------------------------

describe('reactPrimitives', () => {
  it('createText returns a string', () => {
    expect(reactPrimitives.createText('hello')).toBe('hello')
  })

  it('createLineBreak returns <br/> with key', () => {
    const br = reactPrimitives.createLineBreak('k1')
    expect(isValidElement(br)).toBe(true)
    expect(rootType(br)).toBe('br')
    expect((br as React.ReactElement).key).toBe('k1')
  })

  it('combineChildren returns a fragment', () => {
    const result = reactPrimitives.combineChildren(['a', 'b'])
    expect(isValidElement(result)).toBe(true)
    expect(rootType(result)).toBe(React.Fragment)
  })

  it('wrapTextAttrs wraps in span with className and id', () => {
    const result = reactPrimitives.wrapTextAttrs('text', { classname: 'cls', id: 'myid' })
    expect(rootType(result)).toBe('span')
    expect(rootProps(result)?.className).toBe('cls')
    expect(rootProps(result)?.id).toBe('myid')
  })

  it('wrapTextStyle wraps in span with inline styles', () => {
    const result = reactPrimitives.wrapTextStyle('text', { color: 'red', fontFamily: 'Arial', fontSize: '16px' })
    expect(rootType(result)).toBe('span')
    expect(rootProps(result)?.style).toEqual({ color: 'red', fontFamily: 'Arial', fontSize: '16px' })
  })

  it('wrapTextStyle omits undefined style properties', () => {
    const result = reactPrimitives.wrapTextStyle('text', { color: 'blue' })
    expect(rootProps(result)?.style).toEqual({ color: 'blue' })
  })

  it('keyElement assigns key to valid element', () => {
    const el = React.createElement('p', null, 'hi')
    const keyed = reactPrimitives.keyElement(el, 'mykey')
    expect(isValidElement(keyed)).toBe(true)
    expect((keyed as React.ReactElement).key).toBe('mykey')
  })

  it('keyElement returns non-elements unchanged', () => {
    expect(reactPrimitives.keyElement('text', 'k')).toBe('text')
  })
})

// ---------------------------------------------------------------------------
// defaultTextMarks
// ---------------------------------------------------------------------------

describe('defaultTextMarks', () => {
  const cases: [string, string][] = [
    ['bold', 'strong'],
    ['italic', 'em'],
    ['underline', 'u'],
    ['strikethrough', 'del'],
    ['superscript', 'sup'],
    ['subscript', 'sub'],
  ]

  it.each(cases)('%s wraps in <%s>', (mark, tag) => {
    const result = defaultTextMarks[mark]('text')
    expect(rootType(result)).toBe(tag)
    expect(textContent(result)).toBe('text')
  })

  it('inlineCode wraps in span with data-type', () => {
    const result = defaultTextMarks.inlineCode('code')
    expect(rootType(result)).toBe('span')
    expect(rootProps(result)?.['data-type']).toBe('inlineCode')
  })
})

// ---------------------------------------------------------------------------
// defaultElementTypes
// ---------------------------------------------------------------------------

describe('defaultElementTypes', () => {
  const simpleTags: [string, string][] = [
    ['p', 'p'],
    ['h1', 'h1'], ['h2', 'h2'], ['h3', 'h3'],
    ['h4', 'h4'], ['h5', 'h5'], ['h6', 'h6'],
    ['blockquote', 'blockquote'],
    ['code', 'pre'],
    ['ol', 'ol'], ['ul', 'ul'], ['li', 'li'],
    ['table', 'table'], ['thead', 'thead'], ['tbody', 'tbody'],
    ['tr', 'tr'], ['td', 'td'], ['th', 'th'],
    ['span', 'span'], ['div', 'div'],
  ]

  it.each(simpleTags)('%s renders as <%s>', (type, tag) => {
    const result = defaultElementTypes[type]({}, 'child')
    expect(rootType(result)).toBe(tag)
  })

  it('hr renders self-closing', () => {
    const result = defaultElementTypes.hr({}, null)
    expect(rootType(result)).toBe('hr')
  })

  it('a renders with href and target', () => {
    const result = defaultElementTypes.a({ attrs: { url: 'https://x.com', target: '_blank' } }, 'link')
    expect(rootType(result)).toBe('a')
    expect(rootProps(result)?.href).toBe('https://x.com')
    expect(rootProps(result)?.target).toBe('_blank')
  })

  it('a omits target when not set', () => {
    const result = defaultElementTypes.a({ attrs: { url: 'https://x.com' } }, 'link')
    expect(rootProps(result)?.target).toBeUndefined()
  })

  it('img uses redactor-attributes asset-link for src', () => {
    const result = defaultElementTypes.img({
      attrs: { 'redactor-attributes': { 'asset-link': 'http://img.jpg' }, alt: 'pic' },
    }, null)
    expect(rootType(result)).toBe('img')
    expect(rootProps(result)?.src).toBe('http://img.jpg')
  })

  it('img falls back to url then src', () => {
    const r1 = defaultElementTypes.img({ attrs: { url: 'http://url.jpg' } }, null)
    expect(rootProps(r1)?.src).toBe('http://url.jpg')

    const r2 = defaultElementTypes.img({ attrs: { src: 'http://src.jpg' } }, null)
    expect(rootProps(r2)?.src).toBe('http://src.jpg')
  })

  it('embed renders iframe with src', () => {
    const result = defaultElementTypes.embed({ attrs: { src: 'http://vid.com' } }, null)
    expect(rootType(result)).toBe('iframe')
    expect(rootProps(result)?.src).toBe('http://vid.com')
  })

  it('social-embeds renders iframe with data-type', () => {
    const result = defaultElementTypes['social-embeds']({ attrs: { src: 'http://x.com' } }, null)
    expect(rootType(result)).toBe('iframe')
    expect(rootProps(result)?.['data-type']).toBe('social-embeds')
  })

  it('row renders flex div', () => {
    const result = defaultElementTypes.row({}, 'child')
    expect(rootProps(result)?.style).toEqual({ maxWidth: '100%', display: 'flex' })
  })

  it('column renders with width', () => {
    const result = defaultElementTypes.column({ meta: { width: 0.5 } }, 'child')
    expect(rootProps(result)?.style?.width).toBe('50%')
  })

  it('grid-container renders with gap', () => {
    const result = defaultElementTypes['grid-container']({ attrs: { gutter: 16 } }, 'child')
    expect(rootProps(result)?.style?.gap).toBe('16px')
  })

  it('grid-child renders with flex ratio', () => {
    const result = defaultElementTypes['grid-child']({ attrs: { gridRatio: 2 } }, 'child')
    expect(rootProps(result)?.style?.flex).toBe(2)
  })

  it('fragment and trgrp render children directly', () => {
    for (const type of ['fragment', 'trgrp']) {
      const result = defaultElementTypes[type]({}, 'child')
      expect(rootType(result)).toBe(React.Fragment)
    }
  })

  it('reference renders div', () => {
    const result = defaultElementTypes.reference({}, 'child')
    expect(rootType(result)).toBe('div')
  })
})

// ---------------------------------------------------------------------------
// jsonToReact (convenience wrapper)
// ---------------------------------------------------------------------------

describe('jsonToReact', () => {
  it('renders a simple paragraph', () => {
    const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'hello' }] }] }
    const result = jsonToReact(json)
    expect(rootType(result)).toBe('p')
    expect(textContent(result)).toBe('hello')
  })

  it('applies text marks', () => {
    const json = {
      type: 'doc',
      children: [{ type: 'p', children: [{ text: 'bold', bold: true }] }],
    }
    const result = jsonToReact(json)
    expect(textContent(result)).toBe('bold')
    // The <p> should contain a <strong>
    const pChildren = rootProps(result)?.children
    expect(rootType(pChildren)).toBe('strong')
  })

  it('handles line breaks', () => {
    const json = {
      type: 'doc',
      children: [{ type: 'p', children: [{ text: 'a\nb' }] }],
    }
    const result = jsonToReact(json)
    // Should contain text "a", a <br/>, and text "b"
    expect(textContent(result)).toBe('ab') // text-only content excludes <br>
  })

  it('renders nested structure', () => {
    const json = {
      type: 'doc',
      children: [
        {
          type: 'ul',
          children: [
            { type: 'li', children: [{ text: 'item1' }] },
            { type: 'li', children: [{ text: 'item2' }] },
          ],
        },
      ],
    }
    const result = jsonToReact(json)
    expect(rootType(result)).toBe('ul')
    expect(textContent(result)).toBe('item1item2')
  })

  it('returns null for empty doc', () => {
    const json = { type: 'doc', children: [] }
    expect(jsonToReact(json)).toBeNull()
  })

  it('supports customElementTypes override', () => {
    const json = {
      type: 'doc',
      children: [{ type: 'p', children: [{ text: 'custom' }] }],
    }
    const result = jsonToReact(json, {
      customElementTypes: {
        p: (_, ch) => React.createElement('div', { className: 'custom-p' }, ch),
      },
    })
    expect(rootType(result)).toBe('div')
    expect(rootProps(result)?.className).toBe('custom-p')
  })

  it('supports customTextMarks override', () => {
    const json = {
      type: 'doc',
      children: [{ type: 'p', children: [{ text: 'highlighted', bold: true }] }],
    }
    const result = jsonToReact(json, {
      customTextMarks: {
        bold: (ch) => React.createElement('b', { className: 'custom-bold' }, ch),
      },
    })
    const pChild = rootProps(result)?.children
    expect(rootType(pChild)).toBe('b')
    expect(rootProps(pChild)?.className).toBe('custom-bold')
  })

  it('renders classname/id on text', () => {
    const json = {
      type: 'doc',
      children: [
        {
          type: 'p',
          children: [{ text: 'classed', classname: 'my-class', id: 'my-id' }],
        },
      ],
    }
    const result = jsonToReact(json)
    const span = rootProps(result)?.children
    expect(rootType(span)).toBe('span')
    expect(rootProps(span)?.className).toBe('my-class')
    expect(rootProps(span)?.id).toBe('my-id')
  })

  it('renders inline text styles', () => {
    const json = {
      type: 'doc',
      children: [
        {
          type: 'p',
          children: [{ text: 'red', attrs: { style: { color: 'red' } } }],
        },
      ],
    }
    const result = jsonToReact(json)
    const span = rootProps(result)?.children
    expect(rootType(span)).toBe('span')
    expect(rootProps(span)?.style).toEqual({ color: 'red' })
  })
})
