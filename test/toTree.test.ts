import { toTree, IJsonToTreeOptions } from '../src/toTree'

/**
 * String-based primitives for testing the generic walker
 * without any framework dependency.
 */
const stringOpts: IJsonToTreeOptions<string> = {
  elementTypes: {
    p: (_, ch) => `<p>${ch ?? ''}</p>`,
    h1: (_, ch) => `<h1>${ch ?? ''}</h1>`,
    h2: (_, ch) => `<h2>${ch ?? ''}</h2>`,
    blockquote: (_, ch) => `<blockquote>${ch ?? ''}</blockquote>`,
    ol: (_, ch) => `<ol>${ch ?? ''}</ol>`,
    ul: (_, ch) => `<ul>${ch ?? ''}</ul>`,
    li: (_, ch) => `<li>${ch ?? ''}</li>`,
    a: (jb, ch) => `<a href="${jb.attrs?.url ?? '#'}">${ch ?? ''}</a>`,
    img: (jb) => `<img src="${jb.attrs?.url ?? ''}" />`,
    hr: () => '<hr/>',
    code: (_, ch) => `<pre>${ch ?? ''}</pre>`,
    table: (_, ch) => `<table>${ch ?? ''}</table>`,
    tr: (_, ch) => `<tr>${ch ?? ''}</tr>`,
    td: (_, ch) => `<td>${ch ?? ''}</td>`,
    span: (_, ch) => `<span>${ch ?? ''}</span>`,
    div: (_, ch) => `<div>${ch ?? ''}</div>`,
    reference: (_, ch) => `<div>${ch ?? ''}</div>`,
  },
  textMarks: {
    bold: (ch) => `<strong>${ch}</strong>`,
    italic: (ch) => `<em>${ch}</em>`,
    underline: (ch) => `<u>${ch}</u>`,
    strikethrough: (ch) => `<del>${ch}</del>`,
    superscript: (ch) => `<sup>${ch}</sup>`,
    subscript: (ch) => `<sub>${ch}</sub>`,
    inlineCode: (ch) => `<code>${ch}</code>`,
  },
  createText: (text) => text,
  createLineBreak: () => '<br/>',
  combineChildren: (children) => children.join(''),
  wrapTextAttrs: (node, attrs) => {
    const parts: string[] = []
    if (attrs.classname) parts.push(`class="${attrs.classname}"`)
    if (attrs.id) parts.push(`id="${attrs.id}"`)
    return `<span ${parts.join(' ')}>${node}</span>`
  },
  wrapTextStyle: (node, style) => {
    const parts: string[] = []
    if (style.color) parts.push(`color:${style.color}`)
    if (style.fontFamily) parts.push(`font-family:${style.fontFamily}`)
    if (style.fontSize) parts.push(`font-size:${style.fontSize}`)
    return `<span style="${parts.join(';')}">${node}</span>`
  },
}

describe('toTree (generic walker)', () => {
  describe('text nodes', () => {
    it('renders plain text', () => {
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'hello' }] }] }
      expect(toTree(json, stringOpts)).toBe('<p>hello</p>')
    })

    it('preserves empty string text', () => {
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: '' }] }] }
      expect(toTree(json, stringOpts)).toBe('<p></p>')
    })

    it('returns null for undefined/null text', () => {
      expect(toTree({ text: undefined }, stringOpts)).toBeNull()
      expect(toTree({ text: null }, stringOpts)).toBeNull()
    })

    it('converts \\n to line breaks', () => {
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'line1\nline2' }] }] }
      expect(toTree(json, stringOpts)).toBe('<p>line1<br/>line2</p>')
    })

    it('handles multiple consecutive \\n', () => {
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'a\n\nb' }] }] }
      expect(toTree(json, stringOpts)).toBe('<p>a<br/><br/>b</p>')
    })

    it('handles break flag with \\n', () => {
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: '\n', break: true }] }] }
      expect(toTree(json, stringOpts)).toBe('<p><br/></p>')
    })
  })

  describe('text marks', () => {
    it('applies bold', () => {
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'bold', bold: true }] }] }
      expect(toTree(json, stringOpts)).toBe('<p><strong>bold</strong></p>')
    })

    it('applies italic', () => {
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'em', italic: true }] }] }
      expect(toTree(json, stringOpts)).toBe('<p><em>em</em></p>')
    })

    it('stacks multiple marks', () => {
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'x', bold: true, italic: true }] }] }
      const result = toTree(json, stringOpts)!
      expect(result).toContain('<strong>')
      expect(result).toContain('<em>')
      expect(result).toContain('x')
    })

    it('applies underline, strikethrough, super, sub, inlineCode', () => {
      const marks = [
        { mark: 'underline', tag: 'u' },
        { mark: 'strikethrough', tag: 'del' },
        { mark: 'superscript', tag: 'sup' },
        { mark: 'subscript', tag: 'sub' },
        { mark: 'inlineCode', tag: 'code' },
      ]
      for (const { mark, tag } of marks) {
        const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'txt', [mark]: true }] }] }
        expect(toTree(json, stringOpts)).toBe(`<p><${tag}>txt</${tag}></p>`)
      }
    })
  })

  describe('text attributes', () => {
    it('wraps text with classname', () => {
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'classed', classname: 'foo' }] }] }
      expect(toTree(json, stringOpts)).toBe('<p><span class="foo">classed</span></p>')
    })

    it('wraps text with id', () => {
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'ided', id: 'bar' }] }] }
      expect(toTree(json, stringOpts)).toBe('<p><span id="bar">ided</span></p>')
    })

    it('wraps text with inline styles', () => {
      const json = {
        type: 'doc',
        children: [{ type: 'p', children: [{ text: 'styled', attrs: { style: { color: 'red' } } }] }],
      }
      expect(toTree(json, stringOpts)).toBe('<p><span style="color:red">styled</span></p>')
    })

    it('skips style wrap when no relevant properties', () => {
      const json = {
        type: 'doc',
        children: [{ type: 'p', children: [{ text: 'plain', attrs: { style: { 'text-align': 'center' } } }] }],
      }
      expect(toTree(json, stringOpts)).toBe('<p>plain</p>')
    })
  })

  describe('element types', () => {
    it('renders headings', () => {
      const json = { type: 'doc', children: [{ type: 'h1', children: [{ text: 'Title' }] }] }
      expect(toTree(json, stringOpts)).toBe('<h1>Title</h1>')
    })

    it('renders links with attrs', () => {
      const json = {
        type: 'doc',
        children: [{ type: 'a', attrs: { url: 'https://x.com' }, children: [{ text: 'click' }] }],
      }
      expect(toTree(json, stringOpts)).toBe('<a href="https://x.com">click</a>')
    })

    it('renders void elements (hr)', () => {
      const json = { type: 'doc', children: [{ type: 'hr', children: [{ text: '' }] }] }
      expect(toTree(json, stringOpts)).toBe('<hr/>')
    })

    it('renders nested lists', () => {
      const json = {
        type: 'doc',
        children: [
          {
            type: 'ul',
            children: [
              { type: 'li', children: [{ text: 'a' }] },
              { type: 'li', children: [{ text: 'b' }] },
            ],
          },
        ],
      }
      expect(toTree(json, stringOpts)).toBe('<ul><li>a</li><li>b</li></ul>')
    })

    it('renders tables', () => {
      const json = {
        type: 'doc',
        children: [
          {
            type: 'table',
            children: [
              {
                type: 'tr',
                children: [
                  { type: 'td', children: [{ text: '1' }] },
                  { type: 'td', children: [{ text: '2' }] },
                ],
              },
            ],
          },
        ],
      }
      expect(toTree(json, stringOpts)).toBe('<table><tr><td>1</td><td>2</td></tr></table>')
    })
  })

  describe('doc root handling', () => {
    it('unwraps doc type', () => {
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'hi' }] }] }
      expect(toTree(json, stringOpts)).toBe('<p>hi</p>')
    })

    it('unwraps missing type', () => {
      const json = { children: [{ type: 'p', children: [{ text: 'hi' }] }] }
      expect(toTree(json, stringOpts)).toBe('<p>hi</p>')
    })

    it('returns null for empty doc', () => {
      expect(toTree({ type: 'doc', children: [] }, stringOpts)).toBeNull()
    })
  })

  describe('unknown types', () => {
    it('passes children through for unknown element types', () => {
      const json = { type: 'doc', children: [{ type: 'unknown-thing', children: [{ text: 'content' }] }] }
      expect(toTree(json, stringOpts)).toBe('content')
    })
  })

  describe('keyElement callback', () => {
    it('calls keyElement on each element', () => {
      const keys: string[] = []
      const opts: IJsonToTreeOptions<string> = {
        ...stringOpts,
        keyElement: (el, key) => {
          keys.push(key)
          return el
        },
      }
      const json = {
        type: 'doc',
        children: [
          { type: 'p', children: [{ text: 'a' }] },
          { type: 'p', children: [{ text: 'b' }] },
        ],
      }
      toTree(json, opts)
      expect(keys).toEqual(['rte-0', 'rte-1'])
    })
  })

  describe('complex documents', () => {
    it('renders mixed inline content', () => {
      const json = {
        type: 'doc',
        children: [
          {
            type: 'p',
            children: [
              { text: 'normal ' },
              { text: 'bold', bold: true },
              { text: ' and ' },
              { text: 'italic', italic: true },
            ],
          },
        ],
      }
      expect(toTree(json, stringOpts)).toBe('<p>normal <strong>bold</strong> and <em>italic</em></p>')
    })

    it('renders multiple sibling paragraphs', () => {
      const json = {
        type: 'doc',
        children: [
          { type: 'p', children: [{ text: 'first' }] },
          { type: 'p', children: [{ text: 'second' }] },
        ],
      }
      expect(toTree(json, stringOpts)).toBe('<p>first</p><p>second</p>')
    })

    it('handles deeply nested structure', () => {
      const json = {
        type: 'doc',
        children: [
          {
            type: 'blockquote',
            children: [
              {
                type: 'p',
                children: [{ text: 'quoted ', bold: true }, { text: 'text' }],
              },
            ],
          },
        ],
      }
      expect(toTree(json, stringOpts)).toBe('<blockquote><p><strong>quoted </strong>text</p></blockquote>')
    })
  })

  describe('edge cases', () => {
    it('handles node with no children array', () => {
      const json = { type: 'p' }
      expect(toTree(json, stringOpts)).toBe('<p></p>')
    })

    it('handles children with all-null results', () => {
      const json = {
        type: 'doc',
        children: [{ type: 'p', children: [{ text: undefined }] }],
      }
      expect(toTree(json, stringOpts)).toBe('<p></p>')
    })

    it('works with no textMarks provided', () => {
      const opts: IJsonToTreeOptions<string> = {
        elementTypes: { p: (_, ch) => `<p>${ch ?? ''}</p>` },
        createText: (t) => t,
        createLineBreak: () => '<br/>',
        combineChildren: (ch) => ch.join(''),
      }
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'hi', bold: true }] }] }
      // bold mark is ignored since no textMarks provided
      expect(toTree(json, opts)).toBe('<p>hi</p>')
    })

    it('works without optional callbacks', () => {
      const opts: IJsonToTreeOptions<string> = {
        elementTypes: { p: (_, ch) => `<p>${ch ?? ''}</p>` },
        createText: (t) => t,
        createLineBreak: () => '<br/>',
        combineChildren: (ch) => ch.join(''),
      }
      // classname/id should be ignored when wrapTextAttrs is not provided
      const json = { type: 'doc', children: [{ type: 'p', children: [{ text: 'hi', classname: 'x' }] }] }
      expect(toTree(json, opts)).toBe('<p>hi</p>')
    })
  })
})
