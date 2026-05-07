import kebbab from 'lodash.kebabcase'
import isEmpty from 'lodash.isempty'
import {IJsonToHtmlTextTags, IJsonToHtmlAllowedEmptyAttributes, IJsonToHtmlAsyncElementTags} from './types'
import isPlainObject from 'lodash.isplainobject'
import {replaceHtmlEntities, forbiddenAttrChars } from './utils'
import { HTML_ELEMENT_TYPES, HTML_TEXT_WRAPPERS, ALLOWED_EMPTY_ATTRIBUTES } from './constants'

export interface ILocals {
  localTextWrappers: IJsonToHtmlTextTags
  localElementTypes: IJsonToHtmlAsyncElementTags
  localAllowedEmptyAttributes: IJsonToHtmlAllowedEmptyAttributes
  addNbspForEmptyBlocks: boolean
}

/** Set up local handler maps from options. Shared by sync and async paths. */
export function initLocals(options?: {
  customElementTypes?: IJsonToHtmlAsyncElementTags
  customTextWrapper?: IJsonToHtmlTextTags
  allowedEmptyAttributes?: IJsonToHtmlAllowedEmptyAttributes
  addNbspForEmptyBlocks?: boolean
}): ILocals {
  let localTextWrappers: IJsonToHtmlTextTags = HTML_TEXT_WRAPPERS
  let localAllowedEmptyAttributes: IJsonToHtmlAllowedEmptyAttributes = ALLOWED_EMPTY_ATTRIBUTES
  let localElementTypes: IJsonToHtmlAsyncElementTags = HTML_ELEMENT_TYPES

  if (options?.customTextWrapper && !isEmpty(options.customTextWrapper)) {
    localTextWrappers = { ...localTextWrappers, ...options.customTextWrapper }
  }
  if (options?.allowedEmptyAttributes && !isEmpty(options.allowedEmptyAttributes)) {
    localAllowedEmptyAttributes = { ...ALLOWED_EMPTY_ATTRIBUTES }
    Object.keys(options.allowedEmptyAttributes).forEach(key => {
      localAllowedEmptyAttributes[key] = [
        ...(localAllowedEmptyAttributes[key] ?? []),
        ...(options.allowedEmptyAttributes?.[key] || [])
      ]
    })
  }
  if (options?.customElementTypes && !isEmpty(options.customElementTypes)) {
    localElementTypes = { ...localElementTypes, ...options.customElementTypes }
  }

  return {
    localTextWrappers,
    localElementTypes,
    localAllowedEmptyAttributes,
    addNbspForEmptyBlocks: options?.addNbspForEmptyBlocks ?? false,
  }
}

/** Process a text leaf node. Returns the serialized HTML string. */
export function processTextNode(jsonValue: any, localTextWrappers: IJsonToHtmlTextTags): string {
  let text = jsonValue['text'].replace(/</g, '&lt;').replace(/>/g, '&gt;')
  if (jsonValue['break']) {
    text = text.replace(/\n/g, '<br/>')
  }
  if (jsonValue['classname'] || jsonValue['id']) {
    if (jsonValue['classname'] && jsonValue['id']) {
      text = `<span class="${jsonValue['classname']}" id="${jsonValue['id']}">${text}</span>`
    } else if (jsonValue['classname'] && !jsonValue['id']) {
      text = `<span class="${jsonValue['classname']}">${text}</span>`
    } else if (jsonValue['id'] && !jsonValue['classname']) {
      text = `<span id="${jsonValue['id']}">${text}</span>`
    }
  }
  if (jsonValue.text.includes('\n') && !jsonValue['break']) {
    text = text.replace(/\n/g, '<br/>')
  }
  Object.entries(jsonValue).forEach(([key, value]) => {
    if (localTextWrappers.hasOwnProperty(key)) {
      text = localTextWrappers[key](text, value)
    }
  })
  if (jsonValue['attrs']) {
    const { style } = jsonValue['attrs']
    if (style) {
      let attrsStyle = ''
      if (style.color) {
        attrsStyle = `color:${style.color};`
      }
      if (style["font-family"]) {
        attrsStyle += `font-family:"${style.fontFamily}";`
      }
      if (style["font-size"]) {
        attrsStyle += `font-size: ${style.fontSize};`
      }
      if (attrsStyle !== '') {
        text = `<span style='${attrsStyle}'>${text}</span>`
      }
    }
  }
  return text
}

/** Handle allowNonStandardTypes fallback. Returns HTML string or null if not applicable. */
export function processNonStandardType(
  jsonValue: any,
  children: string,
  localElementTypes: IJsonToHtmlAsyncElementTags,
  allowNonStandardTypes?: boolean,
): string | null {
  if (!allowNonStandardTypes || Object.keys(localElementTypes).includes(jsonValue['type']) || jsonValue['type'] === 'doc') {
    return null
  }
  let attrs = ''
  Object.entries(jsonValue?.attrs || {}).forEach(([key, val]) => {
    if (isPlainObject(val)) {
      val = JSON.stringify(val)
      attrs += ` ${key}='${val}'`
    } else {
      attrs += val ? ` ${key}="${val}"` : ` ${key}`
    }
  })
  attrs = (attrs.trim() ? ' ' : '') + attrs.trim()
  console.warn(`${jsonValue['type']} is not a valid element type.`)
  return `<${jsonValue['type'].toLowerCase()}${attrs}>${children}</${jsonValue['type'].toLowerCase()}>`
}

export type ElementProcessResult =
  | { earlyReturn: string }
  | { attrs: string; orgType: string | undefined; figureStyles: any; children: string }

/**
 * Process an element node's attrs, type-specific logic, and children modifications.
 * Returns either an early return value or the computed attrs/orgType/figureStyles
 * needed for the final handler call.
 */
export function processElementNode(
  jsonValue: any,
  children: string,
  options: { customElementTypes?: IJsonToHtmlAsyncElementTags } | undefined,
  localElementTypes: IJsonToHtmlAsyncElementTags,
  localAllowedEmptyAttributes: IJsonToHtmlAllowedEmptyAttributes,
): ElementProcessResult {
  let attrs = ''
  let orgType: string | undefined
  let figureStyles: any = { fieldsEdited: [] }

  if (jsonValue.attrs) {
    let attrsJson: { [key: string]: any } = {}
    let allattrs = JSON.parse(JSON.stringify(jsonValue.attrs))
    let style = ''
    if (jsonValue.attrs["redactor-attributes"]) {
      attrsJson = { ...allattrs["redactor-attributes"] }
    }
    if (jsonValue['type'] === 'reference' && jsonValue?.attrs?.default) {
      orgType = "img"
      let inline = ''
      if (attrsJson['asset-link']) {
        attrsJson['src'] = attrsJson['asset-link']
        delete attrsJson['asset-link']
        delete allattrs['asset-link']
      }
      if (attrsJson['inline']) {
        inline = `display: flow-root;margin:0`
        delete attrsJson['width']
        delete attrsJson['style']
      }
      if (attrsJson['position']) {
        figureStyles.position =
          attrsJson['position'] === 'center'
            ? `style = "margin: auto; text-align: center;width: ${allattrs['width'] ? allattrs['width'] + '%' : 100 + '%'
            };"`
            : `style = "float: ${attrsJson['position']};${inline};width: ${allattrs['width'] ? allattrs['width'] + '%' : 100 + '%'
            };max-width:${allattrs['max-width'] ? allattrs['max-width'] + '%' : 100 + '%'};"`
        figureStyles.alignment = attrsJson['position']
        figureStyles.fieldsEdited.push(figureStyles.position)
        delete attrsJson['position']
        attrsJson['width'] && delete attrsJson['width']
        attrsJson['style'] && delete attrsJson['style']
        attrsJson['height'] && delete attrsJson['height']
        attrsJson['max-width'] && delete attrsJson['max-width']
        allattrs['max-width'] && delete allattrs['max-width']
        allattrs['width'] && delete allattrs['width']
        if (allattrs["redactor-attributes"]) {
          allattrs["redactor-attributes"]['width'] && delete allattrs["redactor-attributes"]['width']
          allattrs?.["redactor-attributes"]?.['style'] && delete allattrs["redactor-attributes"]['style']
          allattrs?.["redactor-attributes"]?.['max-width'] && delete allattrs["redactor-attributes"]['max-width']
        }
      }
      if (attrsJson['asset-caption']) {
        figureStyles.caption = attrsJson['asset-caption']
        figureStyles.fieldsEdited.push(figureStyles.caption)
        delete attrsJson['asset-caption']
        delete allattrs['asset-caption']
      }
      if (attrsJson['link']) {
        let anchor = ''
        anchor = `href="${attrsJson['link']}"`
        if (attrsJson['target']) {
          anchor += ' target="_blank"'
        }
        figureStyles.anchorLink = `${anchor}`
        figureStyles.fieldsEdited.push(figureStyles.anchorLink)
        delete attrsJson['link']
        delete allattrs['link']
      }
      delete allattrs['default']
      delete attrsJson['default']
      delete attrsJson['target']
      delete allattrs['asset-link']
      delete allattrs['asset-type']
      delete allattrs['display-type']
    }
    if (jsonValue['type'] === 'a') {
      attrsJson['href'] = allattrs['url']
    }
    if (allattrs['orgType']) {
      orgType = allattrs['orgType']
      delete allattrs['orgType']
    }
    if (allattrs['class-name']) {
      attrsJson['class'] = allattrs['class-name']
      delete allattrs['class-name']
    }
    if (attrsJson['width']) {
      let width = attrsJson['width']
      if (typeof width === 'number') {
        width = width.toString()
      }
      if (width.slice(width.length - 1) === '%') {
        style = `width: ${allattrs['width'] + '%'}; height: ${attrsJson['height'] ? attrsJson['height'] : 'auto'};`
      } else {
        style = `width: ${allattrs['width']}; height: ${attrsJson['height'] ? attrsJson['height'] : 'auto'};`
      }
    } else {
      if (allattrs['width']) {
        let width = String(allattrs['width'])
        if (width.slice(width.length - 1) === '%') {
          allattrs['width'] = allattrs['width'] + '%'
        } else {
          allattrs['width'] = String(allattrs['width'])
        }
      }
    }
    if (allattrs['style'] && jsonValue['type'] !== 'img') {
      Object.keys(allattrs['style']).forEach((key) => {
        if (allattrs['data-indent-level'] && kebbab(key) === 'margin-left') {
          return
        }
        style += `${kebbab(key)}: ${allattrs.style[key]};`
      })
      delete allattrs['style']
    }
    if (allattrs['data-indent-level']) {
      const indentLevel = Number(allattrs['data-indent-level'])
      if (!isNaN(indentLevel) && indentLevel > 0) {
        style += `margin-left: ${indentLevel * 30}px;`
      }
    }
    if (allattrs['rows'] && allattrs['cols'] && allattrs['colWidths']) {
      delete allattrs['rows']
      delete allattrs['cols']
      delete allattrs['colWidths']
    }
    if (allattrs['disabledCols']) {
      delete allattrs['disabledCols']
    }
    if (allattrs['colSpan']) {
      delete allattrs['colSpan']
    }
    if (allattrs['rowSpan']) {
      delete allattrs['rowSpan']
    }

    attrsJson = { ...attrsJson, ...allattrs, style: style }
    if (jsonValue['type'] === 'reference') {
      if (attrsJson['type'] === "entry") {
        attrsJson['data-sys-entry-uid'] = allattrs['entry-uid']
        delete attrsJson['entry-uid']
        attrsJson['data-sys-entry-locale'] = allattrs['locale']
        delete attrsJson['locale']
        attrsJson['data-sys-content-type-uid'] = allattrs['content-type-uid']
        delete attrsJson['content-type-uid']
        attrsJson['sys-style-type'] = allattrs['display-type']
        delete attrsJson['display-type']
      } else if (attrsJson['type'] === "asset") {
        attrsJson['data-sys-asset-filelink'] = allattrs['asset-link']
        delete attrsJson['asset-link']
        attrsJson['data-sys-asset-uid'] = allattrs['asset-uid']
        delete attrsJson['asset-uid']
        attrsJson['data-sys-asset-filename'] = allattrs['asset-name']
        delete attrsJson['asset-name']
        attrsJson['data-sys-asset-contenttype'] = allattrs['asset-type']
        delete attrsJson['asset-type']
        if (allattrs['asset-caption']) {
          attrsJson['data-sys-asset-caption'] = allattrs['asset-caption']
          delete attrsJson['asset-caption']
        }
        if (allattrs['asset-alt']) {
          attrsJson['data-sys-asset-alt'] = allattrs['asset-alt']
          delete attrsJson['aasset-alt']
        }
        if (allattrs['link']) {
          attrsJson['data-sys-asset-link'] = allattrs['link']
          delete attrsJson['link']
        }
        if (allattrs['position']) {
          attrsJson['data-sys-asset-position'] = allattrs['position']
          delete attrsJson['position']
        }
        if (allattrs['target']) {
          attrsJson['data-sys-asset-isnewtab'] = allattrs['target'] === "_blank"
          delete attrsJson['target']
        }
        if (!attrsJson['sys-style-type']) {
          attrsJson['sys-style-type'] = String(allattrs['asset-type']).indexOf('image') > -1 ? 'display' : 'download'
        }
        if (attrsJson?.["display-type"] === "display") {
          const styleObj = jsonValue?.["attrs"]?.["style"] ?? {}
          if (!styleObj["width"]) {
            styleObj["width"] = "auto"
          }
          delete styleObj["float"]
          attrsJson["style"] = getStyleStringFromObject(styleObj)
        }
        delete attrsJson['display-type']
      }
    }
    if (jsonValue['type'] === "style") {
      delete attrsJson['style-text']
    }
    if (jsonValue['type'] === 'img') {
      attrsJson['src'] = allattrs['url']
      if (allattrs['caption']) figureStyles.caption = allattrs['caption']
      if (allattrs['position']) figureStyles.position = allattrs['position']
      if (allattrs['anchorLink']) figureStyles.anchorLink = `href="${allattrs['anchorLink']}"`
      if (allattrs['target']) {
        figureStyles.anchorLink += ` target="${allattrs['target']}"`
      }
      figureStyles.fieldsEdited.push(figureStyles.caption)
    }

    if (jsonValue['type'] === 'social-embeds' || jsonValue['type'] === 'embed') {
      attrsJson['src'] = encodeURI(allattrs['src'])
    }

    if (!(options?.customElementTypes && !isEmpty(options.customElementTypes) && options.customElementTypes[jsonValue['type']])) {
      delete attrsJson['url']
    }
    delete attrsJson['redactor-attributes']

    Object.entries(attrsJson).forEach((item) => {
      if (forbiddenAttrChars.some(char => item[0].includes(char))) {
        return
      }
      if (localAllowedEmptyAttributes.hasOwnProperty(jsonValue['type']) && localAllowedEmptyAttributes[jsonValue['type']].includes(item[0])) {
        attrs += `${item[0]}="${replaceHtmlEntities(item[1])}" `
        return
      }
      return item[1] ? (item[1] !== '' ? (attrs += `${item[0]}="${replaceHtmlEntities(item[1])}" `) : '') : ''
    })

    attrs = (attrs.trim() ? ' ' : '') + attrs.trim()
  }

  // Table colgroup
  if (jsonValue['type'] === 'table') {
    let colWidths = jsonValue.attrs.colWidths
    let totalWidth = colWidths.reduce((a: any, b: any) => a + b, 0)
    var setCol = new Set(colWidths)
    if (!(setCol.size === 1 && jsonValue.attrs.cols * setCol.values().next().value === totalWidth)) {
      let col = ''
      Array.from(colWidths).forEach((colWidth, index) => {
        const width = (colWidth as number / totalWidth) * 100
        col += `<col style="width:${width}%"/>`
      })
      let colgroup = `<colgroup data-width='${totalWidth}'>${col}</colgroup>`
      children = colgroup + children
    }
  }
  if (jsonValue['type'] === 'check-list') {
    attrs = `data-checked='${jsonValue.checked}' data-type='checked'`
  }
  if (jsonValue['type'] === 'row') {
    attrs = `data-type='row' style="max-width:100%;display:flex;"`
  }
  if (jsonValue['type'] === 'column') {
    const { width } = jsonValue?.meta || {}
    attrs = `data-type='column' width="${width}" style="flex-grow: 0;flex-shrink: 0;position: relative;width:${width * 100}%; margin: 0 0.25rem;"`
  }
  if (jsonValue['type'] === 'grid-container') {
    const { gutter } = jsonValue.attrs
    attrs = `data-type='grid-container' gutter="${gutter}" style="display: flex; width: 100%; gap: ${gutter}px"`
  }
  if (jsonValue['type'] === 'grid-child') {
    const { gridRatio } = jsonValue.attrs
    attrs = `data-type='grid-child' grid-ratio="${gridRatio}" style="flex: ${gridRatio}"`
  }
  if (jsonValue['type'] === 'reference') {
    figureStyles.displayType = jsonValue?.attrs?.["display-type"]
  }
  if (jsonValue['type'] === 'span' && jsonValue.children.length === 1 && jsonValue.children[0].type === 'span') {
    if (Object.keys(jsonValue.attrs).length === 0) {
      return { earlyReturn: children }
    }
  }
  if (['td', 'th'].includes(jsonValue['type'])) {
    if (jsonValue?.['attrs']?.['void']) return { earlyReturn: '' }
  }

  attrs = (attrs.trim() ? ' ' : '') + attrs.trim()

  return { attrs, orgType, figureStyles, children }
}

function getStyleStringFromObject(styleObj: { [key: string]: string }) {
  return Object.keys(styleObj)
    .map((key) => `${key}: ${styleObj[key]}`)
    .join("; ")
}
