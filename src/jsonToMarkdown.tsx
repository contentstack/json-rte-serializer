import {IJsonToMarkdownElementTags, IJsonToMarkdownTextTags} from './types'
import kebbab from 'lodash.kebabcase'
import {Node} from 'slate'

const ELEMENT_TYPES: IJsonToMarkdownElementTags = {
  'blockquote': (attrs: string, child: string) => {
    return `

> ${child}${attrs}`
  },
  'h1': (attrs: any, child: string) => {
    return `

#${child}#`
  },
  'h2': (attrs: any, child: any) => {
    return `

##${child}##`
  },
  'h3': (attrs: any, child: any) => {
    return `

###${child}###`
  },
  'h4': (attrs: any, child: any) => {
    return `

####${child}####`
  },
  'h5': (attrs: any, child: any) => {
    return `
    
#####${child}#####`
  },
  'h6': (attrs: any, child: any) => {
    return `
    
######${child}######`
  },
  img: (attrs: any, child: any, attrsJson: any, figureStyles: any) => {
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
  p: (attrs: any, child: any) => {
    return `
    
${child}`
  },
  code: (attrs: any, child: any) => {
    return `
    
    ${child}    `
  },
  ol: (attrs: any, child: any) => {    
    return `${child}`
  },
  ul: (attrs: any, child: any) => {
    return `${child}`
  },
  li: (attrs: any, child: any) => {
    return `${child}`
  },
  a: (attrs: any, child: any, attrsJson: any) => {
    return `[${child}](${attrsJson.href})`
  },
  hr: (attrs: any, child: any) => {
    return `
  
----------`
  },
  span: (attrs: any, child: any) => {
    return `${child}`
  },
  div: (attrs: any, child: any) => {
    return `<div${attrs}>${child}</div>`
  },
  reference: (attrs: any, child: any, attrsJson: any, extraAttrs: any): any  => {
    if(extraAttrs?.displayType === 'display') {
      if(attrsJson) {
        let assetAlt = attrsJson?.alt ? attrsJson.alt : 'enter image description here'
      let assetURL = attrsJson?.['data-sys-asset-filelink'] ? attrsJson['data-sys-asset-filelink'] : ''
      return `
      
![${assetAlt}]
(${assetURL})`
      }
    }
    else if(extraAttrs?.displayType === 'link') {
      if(attrsJson) {
        return `[${child}](${attrsJson?.['href'] ? attrsJson['href'] : "#"})`
      }
    }
  },
  fragment: (attrs: any, child: any) => {
    return child
  },
}
const TEXT_WRAPPERS: IJsonToMarkdownTextTags = {
  'bold': (child: any, value: any) => {
    return `**${child}**`;
  },
  'italic': (child: any, value: any) => {
    return `*${child}*`;
  },
  // 'underline': (child: any, value: any) => {
  //   return `<u>${child}</u>`;
  // }, underline is not supported in markdown
  'strikethrough': (child: any, value: any) => {
    return `~~${child}~~`;
  },
  'superscript': (child: any, value: any) => {
    return `^${child}^`;
  },
  'subscript': (child: any, value: any) => {
    return `~${child}~`;
  },
  'inlineCode': (child: any, value: any) => {
    return `\`${child}\``
  },
}

const getOLOrULStringFromJson = (value: any) => {
  if(value.type === 'ol'){
    let child = ''
  let start = parseInt(value?.attrs?.start || 1)
  Array.from(value.children).forEach((val: any, index) => { 
    child += `${index + start}. ${Node.string(val)}\n`
  })
  return `
  
${child}`
  }
  if(value.type === 'ul') {
    let child = ''
    let symbol = value?.attrs?.listStyleType || '- '
    Array.from(value.children).forEach((val: any, index) => {
      child += `${symbol}${Node.string(val)}\n`
    })
    return `
    
${child}`
  }
}

export const jsonToMarkdownSerializer = (jsonValue: any): string => {
  if (jsonValue.hasOwnProperty('text')) {
    let text = jsonValue['text'].replace(/</g, '&lt;').replace(/>/g, '&gt;')
    if (jsonValue['break']) {
      text += `<br/>`
    }
    if (jsonValue['classname'] || jsonValue['id']) {
      if (jsonValue['classname'] && jsonValue['id']) {
        text = `<span class=${jsonValue['classname']} id=${jsonValue['id']}>${text}</span>`
      }
      else if (jsonValue['classname'] && !jsonValue['id']) {
        text = `<span class=${jsonValue['classname']}>${text}</span>`
      }
      else if (jsonValue['id'] && !jsonValue['classname']) {
        text = `<span id=${jsonValue['id']}>${text}</span>`
      }
    }
    if (jsonValue.text.includes('\n') && !jsonValue['break']) {
      text = text.replace(/\n/g, '<br/>')
    }
    Object.entries(jsonValue).forEach(([key, value]) => {
      if (TEXT_WRAPPERS.hasOwnProperty(key)) {
        text = TEXT_WRAPPERS[key](text, value)
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
  if (jsonValue.children) {
    children = Array.from(jsonValue.children).map((child) => jsonToMarkdownSerializer(child))
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

  if (ELEMENT_TYPES[jsonValue['type']]) {
    let attrs = ''
    let attrsJson: { [key: string]: any } = {}
    let orgType
    let figureStyles: any = {
      fieldsEdited: []
    }
    if (jsonValue.attrs) {
      
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
            (attrsJson["style"] && typeof attrsJson["style"] === 'string')
              ? (attrsJson["style"] += getStyleStringFromObject(styleObj)) :
            (attrsJson["style"] = getStyleStringFromObject(styleObj));
          }
          delete attrsJson['display-type']
        }
      }
      if (jsonValue['type'] === "style") {
        delete attrsJson['style-text']
      }

      delete attrsJson['redactor-attributes']
      Object.entries(attrsJson).forEach((key) => {
        return key[1] ? (key[1] !== '' ? (attrs += `${key[0]}="${key[1]}" `) : '') : ''
      })
      attrs = (attrs.trim() ? ' ' : '') + attrs.trim()
    }

    if(jsonValue['type'] === 'ol' || jsonValue['type'] === 'ul') {
      //@ts-ignore
      return getOLOrULStringFromJson(jsonValue)
    }

    if (jsonValue['type'] === 'reference') {
      figureStyles.displayType = jsonValue?.attrs?.["display-type"]
    }

    if (jsonValue['type'] === 'span' && jsonValue.children.length === 1 && jsonValue.children[0].type === 'span') {
      if (Object.keys(jsonValue.attrs).length === 0) {
        return children
      }
    }

    attrs = (attrs.trim() ? ' ' : '') + attrs.trim()

    return ELEMENT_TYPES[orgType || jsonValue['type']](attrs, children, attrsJson, figureStyles)
  }
  return children
}


function getStyleStringFromObject(styleObj: { [key: string]: string }) {
  return Object.keys(styleObj)
    .map((key) => `${key}: ${styleObj[key]}`)
    .join("; ");
}