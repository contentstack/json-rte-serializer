import isEmpty from 'lodash.isempty'
import { IJsonToMarkdownElementTags, IJsonToMarkdownTextTags, IHtmlToJsonElementTags, IHtmlToJsonTextTags, IJsonToHtmlElementTags, IJsonToHtmlTextTags, IJsonToHtmlAllowedEmptyAttributes } from '../types'

export const listTypes = ['ol', 'ul'];

export const elementsToAvoidWithinMarkdownTable = [
  'ol',
  'ul',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'code',
  'reference',
  'img',
  'fragment'
];

export const ELEMENT_TYPES: IJsonToMarkdownElementTags = {
  'blockquote': (attrs: any, child: any) => {
    return `

> ${child}`
  },
  'h1': (attrs: any, child: string) => {
    return `

# ${child} #`
  },
  'h2': (attrs: any, child: any) => {
    return `

## ${child} ##`
  },
  'h3': (attrs: any, child: any) => {
    return `

### ${child} ###`
  },
  'h4': (attrs: any, child: any) => {
    return `

#### ${child} ####`
  },
  'h5': (attrs: any, child: any) => {
    return `
    
##### ${child} #####`
  },
  'h6': (attrs: any, child: any) => {
    return `
    
###### ${child} ######`
  },
  img: (attrsJson: any, child: any) => {
    if(attrsJson) {
      let imageAlt = attrsJson?.['alt'] ? attrsJson['alt'] : 'enter image description here'
    let imageURL = attrsJson?.['url'] ? attrsJson['url'] : ''
    return `
    
![${imageAlt}]
(${imageURL})`
    }
    return ''
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
  a: (attrsJson: any, child: any) => {
    return `[${child}](${attrsJson.url})`
  },
  hr: (attrs: any, child: any) => {
    return `
  
----------`
  },
  span: (attrs: any, child: any) => {
    return `${child}`
  },
  reference: (attrsJson: any, child: any): any  => {       
    if(attrsJson?.['display-type'] === 'display') {
      if(attrsJson) {
        let assetName = attrsJson?.['asset-name'] ? attrsJson['asset-name'] : 'enter image description here'
      let assetURL = attrsJson?.['asset-link'] ? attrsJson['asset-link'] : ''
      return `
      
![${assetName}]
(${assetURL})`
      }
    }
    else if(attrsJson?.['display-type'] === 'link') {
      if(attrsJson) {
        return `[${child}](${attrsJson?.['href'] ? attrsJson['href'] : "#"})`
      }
    }
  },
  fragment: (attrs: any, child: any) => {
    return child
  },
  table: (attrs: any, child: any) => {
    return `${child}`
  },
  tbody: (attrs: any, child: any) => {    
    return `${child}`
  },
  thead: (attrs: any, child: any) => {     
    let tableBreak = '|'
    if(attrs.cols) {
        if(attrs.addEmptyThead) {
          let tHeadChildren = '|       '
        for(let i = 0; i < attrs.cols; i++) {
          tHeadChildren += '|       '
          tableBreak += ' ----- |'
        }
        return `${tHeadChildren}\n${tableBreak}\n`  
        }
        else{
          for(let i = 0; i < attrs.cols; i++) {
            tableBreak += ' ----- |'
          }
          return `${child}\n${tableBreak}\n`
        }
    }
    
    return `${child}`
  },
  tr: (attrs: any, child: any) => {
    return `| ${child}\n`
  },
  td: (attrs: any, child: any) => {
    return ` ${child.trim()} |`
  },
  th: (attrs: any, child: any) => {
    return ` ${child.trim()} |`
  }
};

export const TEXT_WRAPPERS: IJsonToMarkdownTextTags = {
  'bold': (child: any, value: any) => {
    return `**${child}**`;
  },
  'italic': (child: any, value: any) => {
    return `*${child}*`;
  },
  'strikethrough': (child: any, value: any) => {
    return `~~${child}~~`;
  },
  'inlineCode': (child: any, value: any) => {
    return `\`${child}\``
  },
};

export const ELEMENT_TAGS: IHtmlToJsonElementTags = {
  A: (el: HTMLElement) => {
    const attrs: Record<string, string> = {}
    const target = el.getAttribute('target');
    const href = el.getAttribute('href');
    const title = el.getAttribute('title');

    attrs.url = href ? href : '#';
    
    if(target && target !== '') {
      attrs.target = target; 
    }
    if(title && title !== '') {
      attrs.title = title; 
    }

    return {
      type: "a",
      attrs: attrs,
    };
  },
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
    const imageAttrs : any = { type: 'img', attrs: { url: el.getAttribute('src') } }
    if (el.getAttribute('width')) {
      imageAttrs.attrs['width'] = el.getAttribute('width')
    }
    return imageAttrs
  },
  LI: () => ({ type: 'li', attrs: {} }),
  OL: () => ({ type: 'ol', attrs: {} }),
  P: () => ({ type: 'p', attrs: {} }),
  PRE: () => ({ type: 'code', attrs: {} }),
  UL: () => ({ type: 'ul', attrs: {} }),
  IFRAME: (el: HTMLElement) => {
    if(el.getAttribute('data-type') === "social-embeds") {
      const src = el.getAttribute('src')
      el.removeAttribute('data-type')
      el.removeAttribute('src')
      return { type: 'social-embeds', attrs: { src } }
    }
    return { type: 'embed', attrs: { src: el.getAttribute('src') } }
  },
  TABLE: (el: HTMLElement) => ({ type: 'table', attrs: {} }),
  THEAD: (el: HTMLElement) => ({ type: 'thead', attrs: {} }),
  TBODY: (el: HTMLElement) => ({ type: 'tbody', attrs: {} }),
  TR: (el: HTMLElement) => ({ type: 'tr', attrs: {} }),
  TD: (el: HTMLElement) => ({ type: 'td', attrs: { ...spanningAttrs(el) } }),
  TH: (el: HTMLElement) => ({ type: 'th', attrs: { ...spanningAttrs(el) } }),
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
  VIDEO: (el: HTMLElement) => {
    const srcArray = Array.from(el.querySelectorAll("source")).map((source) =>
      source.getAttribute("src")
    );

    return {
      type: 'embed',
      attrs: {
        src: srcArray.length > 0 ? srcArray[0] : null,
      },
    }
  },
  STYLE: (el: HTMLElement) => {
    return { type: 'style', attrs: { "style-text": el.textContent } }
  },
  SCRIPT: (el: HTMLElement) => {
    return { type: 'script', attrs: {} }
  },
  HR: () => ({ type: 'hr', attrs: {} }),
  FIGCAPTION: () => ({ type: 'figcaption', attrs: {} }),
}

const spanningAttrs = (el: HTMLElement) => {
  const attrs = {}
  const rowSpan = parseInt(el.getAttribute('rowspan') ?? '1')
  const colSpan = parseInt(el.getAttribute('colspan') ?? '1')
  if (rowSpan > 1) attrs['rowSpan'] = rowSpan
  if (colSpan > 1) attrs['colSpan'] = colSpan

  return attrs
}

export const TEXT_TAGS: IHtmlToJsonTextTags = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  B: () => ({ bold: true }),
  U: () => ({ underline: true }),
  SUP: () => ({ superscript: true }),
  SUB: () => ({ subscript: true })
}

export const HTML_ELEMENT_TYPES: IJsonToHtmlElementTags = {
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
    return `<pre${attrs}>${child.replace(/<br\/?>/g, '\n')}</pre>`
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
    return `<hr>`
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
      const anchor = jsonBlock?.["attrs"]?.["link"] ?? jsonBlock?.["attrs"]?.["anchorLink"];

      const caption = jsonBlock?.["attrs"]?.["asset-caption"];
      const position = jsonBlock?.["attrs"]?.["position"];
      const inline = jsonBlock?.["attrs"]?.["inline"]
      let figureAttrs = ""
      const figureStyles: { [key: string]: string } = {
        margin: "0",
      };
      if(!attrs.includes(`src="${jsonBlock?.["attrs"]?.["asset-link"]}`)){
        attrs = ` src="${jsonBlock?.["attrs"]?.["asset-link"]}"` + attrs;
      }
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
        figureAttrs = ` style="${Object.keys(figureStyles).map((key) => `${key}: ${figureStyles[key]}`).join("; ")}"`
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
  },
  "social-embeds": (attrs: any, child: any) => {
    return `<iframe${attrs} data-type="social-embeds" ></iframe>`
  }
}

export const HTML_TEXT_WRAPPERS: IJsonToHtmlTextTags = {
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

export const ALLOWED_EMPTY_ATTRIBUTES: IJsonToHtmlAllowedEmptyAttributes = {
  img: ['alt'],
  reference: ['alt']
}

export const isInline = ['span', 'a', 'inlineCode', 'reference']
export const isVoid = ['img', 'embed']

export const whiteCharPattern = /^[\s ]{2,}$/
