import kebbab from 'lodash.kebabcase'
import isEmpty from 'lodash.isempty'

import {IJsonToHtmlElementTags, IJsonToHtmlOptions, IJsonToHtmlTextTags} from './types'
import isPlainObject from 'lodash.isplainobject'

const ELEMENT_TYPES: IJsonToHtmlElementTags = {
  'blockquote': (attrs: string, child: string) => {
    return `<blockquote${attrs}>${child}</blockquote>`
  },
  'h1': (attrs, child) => {
    return `<h1${attrs}>${child}</h1>`
  },
  'h2': (attrs: any, child: any) => {
    return `<h2${attrs}>${child}</h2>`
  },
  'h3': (attrs: any, child: any) => {
    return `<h3${attrs}>${child}</h3>`
  },
  'h4': (attrs: any, child: any) => {
    return `<h4${attrs}>${child}</h4>`
  },
  'h5': (attrs: any, child: any) => {
    return `<h5${attrs}>${child}</h5>`
  },
  'h6': (attrs: any, child: any) => {
    return `<h6${attrs}>${child}</h6>`
  },
  img: (attrs: any, child: any,jsonBlock: any, figureStyles: any) => {
    if (figureStyles.fieldsEdited.length === 0) {
      return `<img${attrs}/>`
    }
    let img = figureStyles.anchorLink ? `<a ${figureStyles.anchorLink}><img${attrs}/></a>` : `<img${attrs} />`
    let caption = figureStyles.caption
      ? figureStyles.alignment === 'center'
        ? `<figcaption  style = "text-align: center;">${figureStyles.caption}</figcaption>`
        : `<figcaption>${figureStyles.caption}</figcaption>`
      : ''
    let align = figureStyles.position
      ? `<figure ${figureStyles.position}>${img}${caption}</figure>`
      : figureStyles.caption
        ? `<figure>${img}${caption}</figure>`
        : `${img}`

    return `${align}`
  },

  embed: (attrs: any, child: any) => {
    return `<iframe${attrs}></iframe>`
  },
  p: (attrs: any, child: any) => {
    if(child.includes("<figure"))
    return `<div${attrs} style="overflow: hidden"><span>${child}</span></div>`
    return `<p${attrs}>${child}</p>`
  },
  ol: (attrs: any, child: any) => {
    return `<ol${attrs}>${child}</ol>`
  },
  ul: (attrs: any, child: any) => {
    return `<ul${attrs}>${child}</ul>`
  },
  code: (attrs: any, child: any) => {
    return `<pre${attrs}>${child}</pre>`
  },
  li: (attrs: any, child: any) => {
    return `<li${attrs}>${child}</li>`
  },
  a: (attrs: any, child: any) => {
    return `<a${attrs}>${child}</a>`
  },
  table: (attrs: any, child: any) => {
    return `<table${attrs}>${child}</table>`
  },
  tbody: (attrs: any, child: any) => {
    return `<tbody${attrs}>${child}</tbody>`
  },
  thead: (attrs: any, child: any) => {
    return `<thead${attrs}>${child}</thead>`
  },
  tr: (attrs: any, child: any) => {
    return `<tr${attrs}>${child}</tr>`
  },
  trgrp: (attrs: any, child: any) => {
    return child
  },
  td: (attrs: any, child: any) => {
    return `<td${attrs}>${child}</td>`
  },
  th: (attrs: any, child: any) => {
    return `<th${attrs}>${child}</th>`
  },
  'check-list': (attrs: any, child: any) => {
    return `<p${attrs}>${child}</p>`
  },
  row: (attrs: any, child: any) => {
    return `<div${attrs}>${child}</div>`
  },
  column: (attrs: any, child: any) => {
    return `<div${attrs}>${child}</div>`
  },
  'grid-container': (attrs: any, child: any) => {
    return `<div${attrs}>${child}</div>`
  },
  'grid-child': (attrs: any, child: any) => {
    return `<div${attrs}>${child}</div>`
  },
  hr: (attrs: any, child: any) => {
    return `<div data-type='hr' style='border-top: 3px solid #bbb'></div>`
  },
  span: (attrs: any, child: any) => {
    return `<span${attrs}>${child}</span>`
  },
  div: (attrs: any, child: any) => {
    return `<div${attrs}>${child}</div>`
  },
  reference: (attrs: any, child: any, jsonBlock: any, extraAttrs: any) => {
    if (extraAttrs?.displayType === 'inline') {
      return `<span${attrs}>${child}</span>`
    } else if (extraAttrs?.displayType === 'block') {
      return `<div${attrs}>${child}</div>`
    } else if (extraAttrs?.displayType === 'link') {
      return `<a${attrs}>${child}</a>`
    } else if (extraAttrs?.displayType === 'asset') {
      return `<figure${attrs}>${child}</figure>`
    }
     
    else if (extraAttrs?.displayType === "display") {
      const anchor = jsonBlock?.["attrs"]?.["link"];

      const caption = jsonBlock?.["attrs"]?.["asset-caption"];
      const position = jsonBlock?.["attrs"]?.["position"];
      const inline = jsonBlock?.["attrs"]?.["inline"]
      let figureAttrs = ""
      const figureStyles = {
        margin: "0",
      };
      attrs = ` src="${jsonBlock?.["attrs"]?.["asset-link"]}"` + attrs;
      let img = `<img${attrs}/>`;

      if (anchor) {
        const target = jsonBlock?.["attrs"]?.["target"];
        let anchorAttrs = `href="${anchor}"`;
        if (target) {
          anchorAttrs = `${anchorAttrs} target="${target}"`;
        }
        img = `<a ${anchorAttrs}>${img}</a>`;
      }

      if (caption || (position && position !== "none")) {
        const figcaption = caption
          ? `<figcaption style="text-align:center">${caption}</figcaption>`
          : "";
        
        if (inline && position !== "right" && position !== "left") {
          figureStyles["display"] = "inline-block";
        }
        if (position && position !== "none") {
          figureStyles[inline ? "float" : "text-align"] = position;
        }
        
        if(figcaption){
          img = `<div style="display: inline-block">${img}${figcaption}</div>`;
        }
      }
      if(!isEmpty(figureStyles)){
        figureAttrs = ` style="${getStyleStringFromObject(figureStyles)}"`
      }
      if(inline && !caption && (!position ||position==='none')){
        return img
      }
      return `<figure${figureAttrs ? figureAttrs : ""}>${img}</figure>`;
    }
    return `<span${attrs}>${child}</span>`
  },
  inlineCode: (attrs: any, child: any) => {
    return ""
  },
  fragment: (attrs: any, child: any) => {
    return child
  },
  style: (attrs: any, child: any) => {
    return `<style ${attrs}>${child}</style>`
  },
  script: (attrs: any, child: any) => {
    return `<script ${attrs}>${child}</script>`
  }
}
const TEXT_WRAPPERS: IJsonToHtmlTextTags = {
  'bold': (child: any, value:any) => {
    return `<strong>${child}</strong>`;
  },
  'italic': (child: any, value:any) => {
    return `<em>${child}</em>`;
  },
  'underline': (child: any, value:any) => {
    return `<u>${child}</u>`;
  },
  'strikethrough': (child: any, value:any) => {
    return `<del>${child}</del>`;
  },
  'superscript': (child: any, value:any) => {
    return `<sup>${child}</sup>`;
  },
  'subscript': (child: any, value:any) => {
    return `<sub>${child}</sub>`;
  },
  'inlineCode': (child: any, value:any) => {
    return `<span data-type='inlineCode'>${child}</span>`
  },
}
export const toRedactor = (jsonValue: any,options?:IJsonToHtmlOptions) : string => {
  //TODO: optimize assign once per function call
  if(options?.customTextWrapper && !isEmpty(options.customTextWrapper)){
    Object.assign(TEXT_WRAPPERS,options.customTextWrapper)
  }
  if (jsonValue.hasOwnProperty('text')) {
    let text = jsonValue['text'].replace(/</g, '&lt;').replace(/>/g, '&gt;')
    if (jsonValue['break']) {
      text += `<br/>`
    }
    if(jsonValue['classname'] || jsonValue['id']){
      if(jsonValue['classname'] && jsonValue['id']){
        text = `<span class=${jsonValue['classname']} id=${jsonValue['id']}>${text}</span>`
      }
      else if(jsonValue['classname'] && !jsonValue['id']){
        text = `<span class=${jsonValue['classname']}>${text}</span>`
      }
      else if(jsonValue['id'] && !jsonValue['classname']){
        text = `<span id=${jsonValue['id']}>${text}</span>`
      }
    }
    if (jsonValue.text.includes('\n')) {
      text = text.replace(/\n/g, '<br/>')
    }
    Object.entries(jsonValue).forEach(([key, value]) => {
      if(TEXT_WRAPPERS.hasOwnProperty(key)){
        text = TEXT_WRAPPERS[key](text,value)
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
  let children: any = ''
  if (options?.customElementTypes && !isEmpty(options.customElementTypes)) {
    Object.assign(ELEMENT_TYPES, options.customElementTypes)
  }
  if (jsonValue.children) {
    children = Array.from(jsonValue.children).map((child) => toRedactor(child,options))
    if (jsonValue['type'] === 'blockquote') {
      children = children.map((child: any) => {
        if (child === '\n') {
          return '<br/>'
        }
        return child
      })
    }
    children = children.join('')
  }
  if (options?.allowNonStandardTypes && !Object.keys(ELEMENT_TYPES).includes(jsonValue['type']) && jsonValue['type'] !== 'doc') {
    let attrs = ''
    Object.entries(jsonValue?.attrs|| {}).forEach(([key, val]) => {
      if(isPlainObject(val)){
        val = JSON.stringify(val)
        attrs += ` ${key}='${val}'` 
      }
      else{
        attrs += val ? ` ${key}="${val}"` : ` ${key}`;
      }
    })
    attrs = (attrs.trim() ? ' ' : '') + attrs.trim()
    console.warn(`${jsonValue['type']} is not a valid element type.`)
    return `<${jsonValue['type'].toLowerCase()}${attrs}>${children}</${jsonValue['type'].toLowerCase()}>`
  }
  if (ELEMENT_TYPES[jsonValue['type']]) {
    let attrs = ''
    let orgType
    let figureStyles: any = {
      fieldsEdited: []
    }
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
        if (width.slice(width.length - 1) === '%') {
          style = `width: ${allattrs['width']}; height: ${attrsJson['height'] ? attrsJson['height'] : 'auto'};`
        } else {
          style = `width: ${allattrs['width'] + '%'}; height: ${attrsJson['height'] ? attrsJson['height'] : 'auto'};`
        }
      } else {
        if (allattrs['width']) {
          let width = String(allattrs['width'])

          if (width.slice(width.length - 1) === '%') {
            allattrs['width'] = String(allattrs['width'])
          } else {
            allattrs['width'] = allattrs['width'] + '%'
          }
          // style = `width: ${allattrs['width']}; height: auto;`
        }
      }
      if (allattrs['style'] && jsonValue['type'] !== 'img') {
        Object.keys(allattrs['style']).forEach((key) => {
          style += `${kebbab(key)}: ${allattrs.style[key]};`
        })
        delete allattrs['style']
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
        } 
        
        else if (attrsJson['type'] === "asset") {
          attrsJson['data-sys-asset-filelink'] = allattrs['asset-link']
          delete attrsJson['asset-link']
          attrsJson['data-sys-asset-uid'] = allattrs['asset-uid']
          delete attrsJson['asset-uid']
          attrsJson['data-sys-asset-filename'] = allattrs['asset-name']
          delete attrsJson['asset-name']
          attrsJson['data-sys-asset-contenttype'] = allattrs['asset-type']
          delete attrsJson['asset-type']
          //
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
            const styleObj = jsonValue?.["attrs"]?.["style"] ?? {};
            if (!styleObj["width"]) {
              styleObj["width"] = "auto";
            }
            delete styleObj["float"];
            // (attrsJson["style"] && typeof attrsJson["style"] === 'string')
            //   ? (attrsJson["style"] += getStyleStringFromObject(styleObj)) :
            (attrsJson["style"] = getStyleStringFromObject(styleObj));
          }
          delete attrsJson['display-type']
        }
      }
      if (jsonValue['type'] === "style") {
        delete attrsJson['style-text']
      }
      if(!(options?.customElementTypes && !isEmpty(options.customElementTypes) && options.customElementTypes[jsonValue['type']])) {
        delete attrsJson['url']
      }
      delete attrsJson['redactor-attributes']
      Object.entries(attrsJson).forEach((key) => {
        return key[1] ? (key[1] !== '' ? (attrs += `${key[0]}="${key[1]}" `) : '') : ''
      })
      attrs = (attrs.trim() ? ' ' : '') + attrs.trim()
    }
    if (jsonValue['type'] === 'table') {
      let colWidths = jsonValue.attrs.colWidths
      let totalWidth = colWidths.reduce((a: any, b: any) => a + b, 0)
      var setCol = new Set(colWidths)
      if (!(setCol.size === 1 && jsonValue.attrs.cols * setCol.values().next().value === totalWidth)) {
        let col = ''
        Array.from(colWidths).forEach(
          (colWidth, index) => {
            const width = (colWidth as number / totalWidth) * 100
            col += `<col style="width:${width}%"/>`
          }
        )
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
      attrs = `data-type='column' width="${width}" style="flex-grow: 0;flex-shrink: 0;position: relative;width:${width * 100
        }%; margin: 0 0.25rem;"`
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
        return children
      }
    }

    if(['td','th'].includes(jsonValue['type'])){
      if(jsonValue?.['attrs']?.['void']) return ''
    }

    attrs = (attrs.trim() ? ' ' : '') + attrs.trim()

    return ELEMENT_TYPES[orgType || jsonValue['type']](attrs, children,jsonValue, figureStyles)
  }

  return children
}


function getStyleStringFromObject(styleObj: { [key: string]: string }) {
  return Object.keys(styleObj)
    .map((key) => `${key}: ${styleObj[key]}`)
    .join("; ");
}