import { jsx } from 'slate-hyperscript'
import { v4 } from 'uuid'
import kebabCase from "lodash/kebabCase"
import isEmpty from "lodash/isEmpty"
import flatten from "lodash/flatten"
import isObject from "lodash/isObject"
import cloneDeep from "lodash/cloneDeep"
import isUndefined from "lodash/isUndefined"

import {IHtmlToJsonElementTags,IHtmlToJsonOptions, IHtmlToJsonTextTags, IAnyObject} from './types'

const generateId = () => v4().split('-').join('')
const isInline = ['span', 'a', 'inlineCode', 'reference']
const isVoid = ['img', 'embed']


const ELEMENT_TAGS: IHtmlToJsonElementTags = {
  A: (el: HTMLElement) => ({
    type: 'a',
    attrs: {
      url:
        el.getAttribute('href') ? el.getAttribute('href') : '#'
    }
  }),
  BLOCKQUOTE: () => ({ type: 'blockquote', attrs: {} }),
  H1: () => ({ type: 'h1', attrs: {} }),
  H2: () => ({ type: 'h2', attrs: {} }),
  H3: () => ({ type: 'h3', attrs: {} }),
  H4: () => ({ type: 'h4', attrs: {} }),
  H5: () => ({ type: 'h5', attrs: {} }),
  H6: () => ({ type: 'h6', attrs: {} }),
  IMG: (el: HTMLElement) => {
    let imageUrl = el.getAttribute('src')?.split(".") || ["png"]
    let imageType = imageUrl[imageUrl?.length - 1]
    const assetUid = el.getAttribute('asset_uid')
    if(assetUid){

        const splittedUrl =  el.getAttribute('src')?.split('/')! || [null]
        const assetName = splittedUrl[splittedUrl?.length - 1]
        return { type: 'reference', attrs: { "asset-name": assetName,"content-type-uid" : "sys_assets", "asset-link": el.getAttribute('src'), "asset-type": `image/${imageType}`, "display-type": "display", "type": "asset", "asset-uid": assetUid } }
    }
    return { type: 'img', attrs: { url: el.getAttribute('src') } }
  },
  LI: () => ({ type: 'li', attrs: {} }),
  OL: () => ({ type: 'ol', attrs: {} }),
  P: () => ({ type: 'p', attrs: {} }),
  PRE: () => ({ type: 'code', attrs: {} }),
  UL: () => ({ type: 'ul', attrs: {} }),
  IFRAME: (el: HTMLElement) => ({ type: 'embed', attrs: { src: el.getAttribute('src') } }),
  TABLE: (el: HTMLElement) => ({ type: 'table', attrs: {} }),
  THEAD: (el: HTMLElement) => ({ type: 'thead', attrs: {} }),
  TBODY: (el: HTMLElement) => ({ type: 'tbody', attrs: {} }),
  TR: (el: HTMLElement) => ({ type: 'tr', attrs: {} }),
  TD: (el: HTMLElement) => ({ type: 'td', attrs: {} }),
  TH: (el: HTMLElement) => ({ type: 'th', attrs: {} }),
  // FIGURE: (el: HTMLElement) => ({ type: 'reference', attrs: { default: true, "display-type": "display", "type": "asset" } }),
  
  FIGURE: (el: HTMLElement) => {
    if (el.lastChild && el.lastChild.nodeName === 'P') {
      return { type: 'figure', attrs: {} }
    }
    else {
      return { type: 'img', attrs: {} }
    }

  },
  SPAN: (el: HTMLElement) => {
    return { type: 'span', attrs: {} }
  },
  DIV: (el: HTMLElement) => {
    return { type: 'div', attrs: {} }
  },
  STYLE: (el: HTMLElement) => {
    return { type: 'style', attrs: { "style-text": el.textContent } }
  },
  SCRIPT: (el: HTMLElement) => {
    return { type: 'script', attrs: {} }
  },
  HR: () => ({ type: 'hr', attrs: {} })
}

const TEXT_TAGS: IHtmlToJsonTextTags = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
  SUP: () => ({ superscript: true }),
  SUB: () => ({ subscript: true })
}
const trimChildString = (child: any) => {
  if (typeof child === 'string') {
    return child.trim() !== ''
  }
  return true
}
const getDomAttributes = (child: any) => {
  return {
    [child.nodeName]: child.nodeValue
  }
}
const generateFragment = (child: any) => {
  return { type: "fragment", attrs: {}, uid: generateId(), children: [child] }
}
const traverseChildAndModifyChild = (element: any, attrsForChild: any) => {
  if (element.hasOwnProperty('text')) {
    let attrsForChildCopy = cloneDeep(attrsForChild)
    delete attrsForChildCopy.style
    let style = { ...attrsForChild?.attrs?.style, ...element?.attrs?.style }
    if (element?.attrs) {
      element.attrs.style = style
    } else {
      element.attrs = { style: style }
    }
    Object.entries(attrsForChildCopy).forEach(([key, value]) => {
      element[key] = value
    })
    return
  }
  Array.from(element.children || []).map((el) => traverseChildAndModifyChild(el, attrsForChild)).flat()
  return
}
const traverseChildAndWarpChild = (children: Array<Object>) => {
  let inlineElementIndex: Array<number> = []
  let hasBlockElement = false
  let childrenCopy = cloneDeep(children)
  Array.from(children).forEach((child: any, index) => {
    if (child.hasOwnProperty('text')) {
      inlineElementIndex.push(index)
      return
    }
    if (child.hasOwnProperty('type')) {
      if (isInline.includes(child.type)) {
        if (child.type === "reference") {
          if (child.attrs && (child.attrs['display-type'] === "inline" || child.attrs['display-type'] === "link")) {
            inlineElementIndex.push(index)
          } else {
            hasBlockElement = true
          }
        } else {
          inlineElementIndex.push(index)
        }
      } else {
        hasBlockElement = true
      }
    } else {
      childrenCopy[index] = jsx("text", {}, child)
      inlineElementIndex.push(index)
    }
  })
  if (hasBlockElement && !isEmpty(inlineElementIndex)) {
    Array.from(inlineElementIndex).forEach((child) => {
      children[child] = generateFragment(childrenCopy[child])
    })
  }
  return children
}

const whiteCharPattern = /^[\s ]{2,}$/
export const fromRedactor = (el: any, options?:IHtmlToJsonOptions) : IAnyObject | null => {
  // If node is text node
  if (el.nodeType === 3) {
    if (whiteCharPattern.test(el.textContent)) return null
    if (["TABLE", "THEAD", "TBODY", "TR"].includes(el?.parentElement?.nodeName ?? "") && (el.textContent as string).trim().length === 0) return null
    if (el.textContent === '\n') {
      return null
    }
    if (el.parentNode.nodeName === 'SPAN') {
      let attrs = { style: {} }
      if (el.parentNode.style?.color) {
        attrs = {
          ...attrs,
          style: {
            ...attrs.style,
            color: el.parentNode.style.color
          }
        }
      }
      if (el.parentNode.style?.['font-family']) {
        attrs = {
          ...attrs,
          style: {
            ...attrs.style,
            'font-family': el.parentNode.style['font-family']
          }
        }
      }
      if (el.parentNode.style?.['font-size']) {
        attrs = {
          ...attrs,
          style: {
            ...attrs.style,
            'font-size': el.parentNode.style['font-size']
          }
        }
      }
      return jsx('text', { attrs: attrs }, el.textContent)
    }
    return el.textContent
  } else if (el.nodeType !== 1) {
    return null
  } else if (el.nodeName === 'BR') {
    return { text: '\n', break: false, separaterId: generateId() }
  } else if (el.nodeName === 'META') {
    return null
  } else if (el.nodeName === 'COLGROUP') {
    return null
  }
  const { nodeName } = el
  let parent = el
  if(el.nodeName === "BODY"){
    if(options?.customElementTags && !isEmpty(options.customElementTags)){
      Object.assign(ELEMENT_TAGS, options.customElementTags)
    }
    if(options?.customTextTags && !isEmpty(options.customTextTags)) {
      Object.assign(TEXT_TAGS, options.customTextTags)
    }
  }
  let children: any = flatten(Array.from(parent.childNodes).map((child) => fromRedactor(child, options)))
  children = children.filter((child: any) => child !== null)
  children = traverseChildAndWarpChild(children)
  if (children.length === 0) {
    children = [{ text: '' }]
  }
  if (el.nodeName === 'BODY') {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
      return jsx('element', { type: "doc", uid: generateId(), attrs: {} }, [{ type: 'p', attrs: {}, uid: generateId(), children: [{ text: el.childNodes[0].textContent }] }])
    }
    if (el.childNodes.length === 0) {
      return jsx('element', { type: "doc", uid: generateId(), attrs: {} }, [{ type: 'p', attrs: {}, children: [{ text: '' }], uid: generateId() }])
    }
    return jsx('element', { type: "doc", uid: generateId(), attrs: {} }, children)
  }
  if (options?.allowNonStandardTags && !Object.keys(ELEMENT_TAGS).includes(nodeName) && !Object.keys(TEXT_TAGS).includes(nodeName)) {
    const attributes = (el as HTMLElement).attributes
    const attributeMap = {}
    Array.from(attributes).forEach((attribute) => {
      let { nodeName, nodeValue } = attribute;
      if (typeof nodeValue === "string") {
        nodeValue = getNestedValueIfAvailable(nodeValue);
      }
      attributeMap[nodeName] = nodeValue;
    });
    console.warn(`${nodeName} is not a standard tag of JSON RTE.`)
    return jsx('element', { type: nodeName.toLowerCase(), attrs: { ...attributeMap } }, children)
  }
  const isEmbedEntry = el.attributes['data-sys-entry-uid']?.value
  const type = el.attributes['type']?.value
  if (isEmbedEntry && type === "entry") {
    const entryUid = el.attributes['data-sys-entry-uid']?.value
    const contentTypeUid = el.attributes['data-sys-content-type-uid']?.value
    const displayType = el.attributes['sys-style-type']?.value
    const locale = el.attributes['data-sys-entry-locale']?.value
    if (entryUid && contentTypeUid && displayType && locale) {
      let elementAttrs: any = { attrs: { style: {} } }
      const attributes = el.attributes
      const attribute = Array.from(attributes).map(getDomAttributes)
      const redactor = Object.assign({}, ...attribute)
      if (redactor['id']) {
        elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], id: redactor['id'] } }
        delete redactor['id']
      }
      if (redactor['class']) {
        elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], "class-name": redactor['class'] } }
        delete redactor['class']
      }
      if (redactor['data-sys-entry-uid']) {
        delete redactor['data-sys-entry-uid']
      }
      if (redactor['data-sys-content-type-uid']) {
        delete redactor['data-sys-content-type-uid']
      }
      if (redactor['sys-style-type']) {
        delete redactor['sys-style-type']
      }
      if (redactor['data-sys-entry-locale']) {
        delete redactor['data-sys-entry-locale']
      }
      if (el.style) {
        delete redactor['style']
        let allStyleAttrs: { [key: string]: any } = {}
        Array.from({ length: el.style.length }).forEach((child, index) => {
          let property = el.style.item(index)
          allStyleAttrs[kebabCase(property)] = el.style.getPropertyValue(property)
        })
        elementAttrs = {
          ...elementAttrs,
          attrs: { ...elementAttrs['attrs'], style: { ...elementAttrs.attrs['style'], ...allStyleAttrs } }
        }
      }
      if (displayType === "link") {
        elementAttrs.attrs.href = redactor['href']
        delete redactor['href']
      }
      elementAttrs.attrs["redactor-attributes"] = redactor
      return jsx('element', { attrs: { ...elementAttrs?.attrs, "type": type, "entry-uid": entryUid, "content-type-uid": contentTypeUid, "display-type": displayType, locale }, type: "reference", uid: generateId() }, children)
    }
  }
  const isEmbedAsset = el.attributes['data-sys-asset-uid']?.value
  if (isEmbedAsset && type === "asset") {
    const fileLink = el.attributes['data-sys-asset-filelink']?.value
    const uid = el.attributes['data-sys-asset-uid']?.value
    const fileName = el.attributes['data-sys-asset-filename']?.value
    const contentType = el.attributes['data-sys-asset-contenttype']?.value
    const displayType = el.attributes['sys-style-type']?.value
    const caption = el.attributes['data-sys-asset-caption']?.value
    const alt = el.attributes['data-sys-asset-alt']?.value
    const link = el.attributes['data-sys-asset-link']?.value
    const position = el.attributes['data-sys-asset-position']?.value
    const target = el.attributes['data-sys-asset-isnewtab']?.value ? "_blank" : "_self"
    const contentTypeUid = el.attributes['content-type-uid']?.value || 'sys_assets'
    if (fileLink && uid && fileName && contentType) {
      let elementAttrs: any = { attrs: { style: {} } }
      const attributes = el.attributes
      const attribute = Array.from(attributes).map(getDomAttributes)
      const redactor = Object.assign({}, ...attribute)
      if (redactor['id']) {
        elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], id: redactor['id'] } }
        delete redactor['id']
      }
      if (redactor['class']) {
        elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], "class-name": redactor['class'] } }
        delete redactor['class']
      }
      if (redactor['data-sys-asset-filelink']) {
        delete redactor['data-sys-asset-filelink']
      }
      if (redactor['data-sys-asset-uid']) {
        delete redactor['data-sys-asset-uid']
      }
      if (redactor['data-sys-asset-filename']) {
        delete redactor['data-sys-asset-filename']
      }
      if (redactor['data-sys-asset-contenttype']) {
        delete redactor['data-sys-asset-contenttype']
      }
      if (redactor['width']) {
        let width = parseFloat(redactor['width'])
        if (isNaN(width)) {
          width = 100
        }
        elementAttrs.attrs.width = width
        delete redactor['width']
      }
      if (redactor['content-type-uid']) {
        delete redactor['content-type-uid']
      }
      if (redactor['data-sys-asset-caption']) {
        delete redactor['data-sys-asset-caption']
      }
      if (redactor['data-sys-asset-alt']) {
        delete redactor['data-sys-asset-alt']
      }
      if (redactor['data-sys-asset-link']) {
        delete redactor['data-sys-asset-link']
      }
      if (redactor['data-sys-asset-position']) {
        delete redactor['data-sys-asset-position']
      }
      if (redactor['data-sys-asset-isnewtab']) {
        delete redactor['data-sys-asset-isnewtab']
      }
      if (el.style) {
        delete redactor['style']
        let allStyleAttrs: { [key: string]: any } = {}
        Array.from({ length: el.style.length }).forEach((child, index) => {
          let property = el.style.item(index)
          allStyleAttrs[kebabCase(property)] = el.style.getPropertyValue(property)
        })
        elementAttrs = {
          ...elementAttrs,
          attrs: { ...elementAttrs['attrs'], style: { ...elementAttrs.attrs['style'], ...allStyleAttrs } }
        }
      }
      elementAttrs.attrs["redactor-attributes"] = redactor
      return jsx('element', { attrs: { ...elementAttrs?.attrs, type, "asset-caption": caption, "link": link, "asset-alt": alt, target, position, "asset-link": fileLink, "asset-uid": uid, "display-type": displayType, "asset-name": fileName, "asset-type": contentType, "content-type-uid": contentTypeUid }, type: "reference", uid: generateId() }, children)
    }
  }
  if (nodeName === 'FIGCAPTION') {
    return null
  }
  if (nodeName === 'DIV') {
    const dataType = el.attributes['data-type']?.value
    if (dataType === 'row') {
      const attrs = {
        type: 'row',
        uid: generateId()
      }
      return jsx('element', attrs, children)
    }
    if (dataType === 'column') {
      const { width } = el.attributes
      const attrs = {
        type: 'column',
        uid: generateId(),
        meta: {
          width: Number(width.value)
        }
      }
      return jsx('element', attrs, children)
    }
    if (dataType === 'grid-container') {
      const gutter = el.attributes?.['gutter']?.value
      const attrs = {
        type: 'grid-container',
        attrs: {
          gutter  
        }
      }
      return jsx('element', attrs, children)
    }
    if (dataType === 'grid-child') {
      const gridRatio = el.attributes?.['grid-ratio']?.value
      const attrs = {
        type: 'grid-child',
        attrs: {
          gridRatio
        }
      }
      return jsx('element', attrs, children)
    }
    if (dataType === 'hr') {
      return jsx(
        'element',
        {
          type: 'hr',
          uid: generateId()
        },
        [
          {
            text: ''
          }
        ]
      )
    }
  }

  if (ELEMENT_TAGS[nodeName]) {
    if (el.nodeName === 'P') {
      children = children.map((child: any) => {
        if (typeof child === 'string') {
          return child.replace(/\n/g, ' ')
        }
        return child
      })
    }

    if (el.parentNode?.nodeName === 'PRE') {
      return el.outerHTML
    }

    if (el.closest('pre') && el.nodeName !== 'PRE') {
      return null
    }

    let elementAttrs = ELEMENT_TAGS[nodeName](el)
    const attributes = el.attributes
    if (attributes.length !== 0) {
      const attribute = Array.from(attributes).map(getDomAttributes)
      const redactor = Object.assign({}, ...attribute)
      if (redactor['id']) {
        elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], id: redactor['id'] } }
      }
      if (redactor['class']) {
        elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], "class-name": redactor['class'] } }
      }
      if (el.style) {
        let allStyleAttrs: { [key: string]: any } = {}
        Array.from({ length: el.style.length }).forEach((child, index) => {
          let property = el.style.item(index)
          allStyleAttrs[kebabCase(property)] = el.style.getPropertyValue(property)
        })
        elementAttrs = {
          ...elementAttrs,
          attrs: { ...elementAttrs['attrs'], style: { ...elementAttrs.attrs['style'], ...allStyleAttrs } }
        }
      }
      if (el.style && (el.style.getPropertyValue('text-align') || el.style.getPropertyValue('float'))) {
        const alignStyle = el.style.getPropertyValue('text-align')
          ? el.style.getPropertyValue('text-align')
          : el.style.getPropertyValue('float')
        elementAttrs = {
          ...elementAttrs,
          attrs: { ...elementAttrs['attrs'], style: { ...elementAttrs.attrs['style'], "text-align": alignStyle } }
        }
      }
      if (redactor['data-sys-asset-uid']) {
        elementAttrs = {
          ...elementAttrs,
          attrs: { ...elementAttrs['attrs'], 'data-sys-asset-uid': redactor['data-sys-asset-uid'] }
        }
      }

      elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], "redactor-attributes": redactor } }
    }
    if (!elementAttrs['uid']) {
      elementAttrs['uid'] = generateId()
    }
    if (nodeName === 'FIGURE') {
      let newChildren = children.filter(trimChildString)
      // this is required because redactor often has blank space between tags
      // which is interpreted as children in our code
      let { style } = elementAttrs.attrs
      let extraAttrs: { [key: string]: any } = {
        position: null
      }
      if (style && style["text-align"]) {
        extraAttrs.position = style["text-align"]
      }
      let sizeAttrs: { [key: string]: any } = {
        width: "auto"
      }
      if (el.style?.width) {
        sizeAttrs.width = el.style.width
        if (sizeAttrs.width[sizeAttrs.width.length - 1] === '%') {
          sizeAttrs.width = Number(sizeAttrs.width.slice(0, sizeAttrs.width.length - 1))
        } 
        
        else if (sizeAttrs.width.slice(sizeAttrs.width.length - 2) === 'px') {
          sizeAttrs.width = Number(sizeAttrs.width.slice(0, sizeAttrs.width.length - 2))
        }
      }
      if (el.style?.['max-width']) {
        sizeAttrs['max-width'] = el.style['max-width']
        if (sizeAttrs['max-width'][sizeAttrs['max-width'].length - 1] === '%') {
          sizeAttrs['max-width'] = Number(sizeAttrs['max-width'].slice(0, sizeAttrs['max-width'].length - 1))
        } 
        
        else if (sizeAttrs['max-width'].slice(sizeAttrs['max-width'].length - 2) === 'px') {
          sizeAttrs['max-width'] =
            Number(sizeAttrs['max-width'].slice(0, sizeAttrs['max-width'].length - 2))
        }
      }
      let captionElements = el.getElementsByTagName("FIGCAPTION")
      
      if (captionElements?.[0]) {
        let caption = captionElements[0]
        const captionElementsAttrs = caption.attributes
        const captionAttrs = {}
        if (captionElementsAttrs) {
          Array.from(captionElementsAttrs).forEach((child: any) => {
            captionAttrs[child.nodeName] = child.nodeValue
          })
        }
        extraAttrs['captionAttrs'] = captionAttrs
        extraAttrs['caption'] = captionElements?.[0]?.textContent

      }
      if (newChildren[0]?.type === 'img') {
        elementAttrs = getFinalImageAttributes({elementAttrs, newChildren, extraAttrs, sizeAttrs})
      }
      if (newChildren[0]?.type === 'reference') {
        elementAttrs = getReferenceAttributes({elementAttrs, newChildren, extraAttrs, sizeAttrs})
      }
      if (newChildren[0]?.type === 'a') {
        const { href, target } = newChildren[0].attrs?.["redactor-attributes"]
        extraAttrs['anchorLink'] = href;
        if (target && target !== '') {
            extraAttrs['target'] = true;
        }
        const imageAttrs = newChildren[0].children;

        if(imageAttrs[0].type === 'img'){
        elementAttrs = getFinalImageAttributes({elementAttrs, newChildren : imageAttrs, extraAttrs, sizeAttrs})

        }
        if(imageAttrs[0].type === 'reference'){
        elementAttrs = getReferenceAttributes({elementAttrs, newChildren: imageAttrs, extraAttrs, sizeAttrs})
        }
      }
      
      return jsx('element', elementAttrs, [{ text: '' }])
    }

    if (nodeName === 'A') {
      let newChildren = children.filter(trimChildString)
      if (newChildren[0]?.type === 'reference' && newChildren[0]?.attrs?.default) {
        let extraAttrs: { [key: string]: any } = {}
        const { href, target } = elementAttrs.attrs?.["redactor-attributes"]
        extraAttrs['link'] = href || el.getAttribute('href')
        if (target && target !== '') {
          extraAttrs['target'] = true
        }
        const imageAttrs = newChildren[0]
        elementAttrs = getImageAttributes(imageAttrs, imageAttrs.attrs || {}, extraAttrs)
        return jsx('element', elementAttrs, [{ text: '' }])
      }
    }
    if (nodeName === 'IMG' || nodeName === 'IFRAME') {
      if (elementAttrs?.attrs?.["redactor-attributes"]?.width) {
        let width = elementAttrs.attrs["redactor-attributes"].width
        if (width.slice(width.length - 1) === '%') {
          elementAttrs.attrs.width = parseFloat(width.slice(0, width.length - 1))
        } else if (width.slice(width.length - 2) === 'px') {
          elementAttrs.attrs.width = 100
        } else {
          elementAttrs.attrs.width = parseFloat(width)
        }
      }
      if (elementAttrs?.attrs?.["redactor-attributes"]?.inline) {
        elementAttrs.attrs.inline = Boolean(elementAttrs?.attrs?.["redactor-attributes"]?.inline)
      }
      return jsx('element', elementAttrs, [{ text: '' }])
    }
    if (nodeName === 'BLOCKQUOTE') {
      children = Array.from(children).map((child: any) => {
        if (child['break']) {
          return { text: '\n', break: true }
        }
        return child
      })
    }
    if (nodeName === 'TABLE') {
      let row = 0
      let table_child = ['THEAD', 'TBODY']
      let cell_type = ['TH', 'TD']
      let col = 0
      Array.from(el.childNodes).forEach((child: any) => {
        if (table_child.includes(child.nodeName)) {
          row += child.childNodes.length
        }
      })
      let rowElement = el.getElementsByTagName('TR')[0]
      if (rowElement)
        Array.from(rowElement.childNodes).forEach((child: any) => {
          if (cell_type.includes(child.nodeName)) {
            col += 1
          }
        })
      let colWidths: Array<any> = Array.from({ length: col }).fill(250)
      if (el?.childNodes?.[0]?.nodeName === 'COLGROUP') {
        let colGroupWidth: Array<any> = []
        let totalWidth = parseFloat(el.childNodes[0].getAttribute('data-width')) || col * 250
        Array.from(el.childNodes[0].childNodes).forEach((child: any) => {
          let width = child?.style?.width || '250px'
          if (width.slice(width.length - 1) === '%') {
            colGroupWidth.push((parseFloat(width.slice(0, width.length - 1)) * totalWidth) / 100)
          } else if (width.slice(width.length - 2) === 'px') {
            colGroupWidth.push(parseFloat(width.slice(0, width.length - 2)))
          }
        })
        colWidths = colGroupWidth
      }
      elementAttrs = {
        ...elementAttrs,
        attrs: {
          ...elementAttrs.attrs,
          rows: row,
          cols: col,
          colWidths: colWidths
        }
      }
    }
    if (nodeName === 'P') {
      if (
        elementAttrs?.attrs?.["redactor-attributes"]?.['data-checked'] &&
        elementAttrs?.attrs?.["redactor-attributes"]?.['data-type']
      ) {
        elementAttrs.type = 'check-list'
        elementAttrs.attrs.checked = elementAttrs.attrs["redactor-attributes"]['data-checked'] === 'true'
        delete elementAttrs.attrs["redactor-attributes"]['data-checked']
        delete elementAttrs.attrs["redactor-attributes"]['data-type']
      }
    }
    if (nodeName === 'SPAN') {
      if (elementAttrs?.attrs?.["redactor-attributes"]?.['data-type'] === 'inlineCode') {
        let attrsStyle = { attrs: { style: {} }, inlineCode: true }
        if (isEmpty(children)) {
          children = [{ text: "" }]
        }
        return children.map((child: any) => jsx('text', attrsStyle, child))
      }
      if (elementAttrs?.attrs?.["redactor-attributes"]?.style) {
        return children
      }
      if (nodeName === 'SPAN') {
        Array.from(children).forEach((child: any) => {
          if (child.type) {
            if (!isInline.includes(child.type) && !isVoid.includes(child.type)) {
              elementAttrs = {
                type: 'div',
                attrs: {
                  orgType: 'span'
                },
                uid: generateId()
              }
            }
          }
        })
      }
      let noOfInlineElement = 0
      Array.from(el.parentNode?.childNodes || []).forEach((child: any) => {
        if (child.nodeType === 3 || child.nodeName === 'SPAN' || child.nodeName === 'A') {
          noOfInlineElement += 1
        }
      })
      if (noOfInlineElement !== el.parentNode?.childNodes.length) {
        elementAttrs = {
          type: 'div',
          attrs: {
            orgType: 'span'
          },
          uid: generateId()
        }
      }
    }

    if (children.length === 0) {
      children = [{ text: '' }]
    }
    return jsx('element', elementAttrs, children)
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el)
    let attrsStyle = { attrs: { style: {} }, ...attrs }

    let newChildren = children.map((child: any) => {
      if (isObject(child)) {
        traverseChildAndModifyChild(child, attrsStyle)
        return child
      } else {
        return jsx('text', attrsStyle, child)
      }
    })
    return jsx('fragment', {}, newChildren)
  }
  if (children.length === 0) {
    children = [{ text: '' }]
  }
  return children
}

const getImageAttributes = (elementAttrs: any, childAttrs: any, extraAttrs: any) => {
  elementAttrs = {
    ...elementAttrs,
    attrs: {
      ...elementAttrs.attrs,
      ...childAttrs,
      "redactor-attributes": {
        ...childAttrs?.["redactor-attributes"],
        ...extraAttrs
      },
      "asset-caption": extraAttrs["asset-caption"],
      "link": extraAttrs.link
    }
  }
  if (elementAttrs?.attrs?.["redactor-attributes"]?.link) {
    elementAttrs.attrs.link = elementAttrs.attrs.link || elementAttrs?.attrs?.["redactor-attributes"]?.link
  }
  if (isUndefined(elementAttrs.attrs["asset-caption"])) {
    delete elementAttrs.attrs["asset-caption"]
  }
  if (isUndefined(elementAttrs.attrs["link"])) {
    delete elementAttrs.attrs["link"]
  }
  return elementAttrs
}

const getReferenceAttributes = ({elementAttrs, newChildren, extraAttrs, sizeAttrs} : any) => {

  let { style } = elementAttrs.attrs;
  
  extraAttrs['asset-caption'] = extraAttrs['caption'];

  const childAttrs = { ...newChildren[0].attrs, ...sizeAttrs, style: { 'text-align': style['text-align'] }, position: extraAttrs.position }
  extraAttrs = { ...extraAttrs, ...sizeAttrs }

  if (!childAttrs.position) {
    delete childAttrs.position
  }

  const referenceAttrs = getImageAttributes(elementAttrs, childAttrs, extraAttrs);

  referenceAttrs.type = "reference";

  return referenceAttrs
}

const getFinalImageAttributes = ({elementAttrs, newChildren, extraAttrs, sizeAttrs} : any) => {

  let { style } = elementAttrs.attrs;

  if (newChildren[0].attrs.width) {
      sizeAttrs.width = newChildren[0].attrs.width.toString();
  }

  const childAttrs = { ...newChildren[0].attrs, ...sizeAttrs, style: { 'text-align': style?.['text-align'] }, caption: extraAttrs['caption'] }
  extraAttrs = { ...extraAttrs, ...sizeAttrs }

  if (!childAttrs.caption) {
    delete childAttrs.caption
  }

  const imageAttrs = getImageAttributes(elementAttrs, childAttrs, extraAttrs);

  return imageAttrs
}

export const getNestedValueIfAvailable = (value: string) => {
  try {
    if (typeof value === "string" && value.trim().match(/^{|\[/i)) {
      return JSON.parse(value);
    }
    return value
  } catch {
    return value;
  }
};
