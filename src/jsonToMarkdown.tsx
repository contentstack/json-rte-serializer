import {IJsonToMarkdownElementTags, IJsonToMarkdownTextTags} from './types'
import {cloneDeep} from 'lodash'
import {Node} from 'slate'
import { listTypes, elementsToAvoidWithinMarkdownTable, ELEMENT_TYPES, TEXT_WRAPPERS } from './constants'

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
