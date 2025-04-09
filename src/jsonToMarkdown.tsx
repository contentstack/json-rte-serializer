import {IJsonToMarkdownElementTags, IJsonToMarkdownTextTags} from './types'
import {cloneDeep} from 'lodash'
import {Node} from 'slate'

let listTypes = ['ol', 'ul']
const elementsToAvoidWithinMarkdownTable = ['ol', 'ul', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'reference', 'img', 'fragment']

const ELEMENT_TYPES: IJsonToMarkdownElementTags = {
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
}
const TEXT_WRAPPERS: IJsonToMarkdownTextTags = {
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
}

const getOLOrULStringFromJson = (value: any) => {
  let child = ''
  let nestedListFound = false
  if(listTypes.includes(value.type)){
  let start = parseInt(value?.attrs?.start || 1)
  let symbol = value?.attrs?.listStyleType || '- '
  Array.from(value.children).forEach((val: any, index) => { 
    if(val.hasOwnProperty('type') && val.type === 'li' && value.children[index + 1] && value.children[index + 1]?.type && listTypes.includes(value.children[index + 1].type)){
      let liChildren = jsonToMarkdownSerializer(val)
      let nestedListChildren = getOLOrULStringFromJson(value.children[index + 1])
      let indentedNestedListChildren = nestedListChildren.split('\n').filter((child) => child.length).map((child) => `  ${child}`).join('\n')
      if(value.type === 'ol') {
        child += `${index + start}. ${liChildren}\n${indentedNestedListChildren}\n`
        nestedListFound = true
      }
      if(value.type === 'ul') child += `${symbol}${liChildren}\n${indentedNestedListChildren}\n`
    }
    else if(val.hasOwnProperty('type') && !listTypes.includes(val.type)){
      let liChildren = jsonToMarkdownSerializer(val) 
      if(value.type === 'ol') child += `${nestedListFound ? (index + start - 1): index + start}. ${liChildren}\n`
      if(value.type === 'ul') child += `${symbol}${liChildren}\n`
    }
  })
  }
  return `

${child}`
}

export const jsonToMarkdownSerializer = (jsonValue: any): string => {
  if (jsonValue.hasOwnProperty('text')) {
    let text = jsonValue['text'].replace(/</g, '&lt;').replace(/>/g, '&gt;')
    if (jsonValue['break']) {
      text += `<br/>`
    }
    if (jsonValue.text.includes('\n') && !jsonValue['break']) {
      text = text.replace(/\n/g, '<br/>')
    }
    Object.entries(jsonValue).forEach(([key, value]) => {
      if (TEXT_WRAPPERS.hasOwnProperty(key)) {
        text = TEXT_WRAPPERS[key](text, value)
      }
    })
    return text
  }
  let children: any = ''
  if(!jsonValue['type']) return children
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
    let tableAttrs = {}
    if(jsonValue['type'] === 'ol' || jsonValue['type'] === 'ul') {
      //@ts-ignore  
      return getOLOrULStringFromJson(jsonValue)
    }
    if(jsonValue['type'] === 'table') {
      tableAttrs = cloneDeep(jsonValue['attrs'])
      let thead = Array.from(jsonValue['children']).find((child: any) => child.type && child.type === 'thead')
      if(!thead) {
        tableAttrs['addEmptyThead'] = true
        let emptyTableHead = ELEMENT_TYPES['thead'](tableAttrs, children)
        if(emptyTableHead) children = emptyTableHead + children
      }
    }
    if(jsonValue['type'] === 'td' || jsonValue['type'] === 'th') {
      let NonAllowedTableChild = Array.from(jsonValue['children']).find((child: any) => elementsToAvoidWithinMarkdownTable.includes(child.type))
      if(NonAllowedTableChild) children = Node.string(jsonValue)
    }
    return ELEMENT_TYPES[jsonValue['type']](jsonValue['attrs'], children)
  }  
  return children
}
