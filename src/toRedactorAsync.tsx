import {IJsonToHtmlAsyncOptions} from './types'
import { initLocals, ILocals, processTextNode, processNonStandardType, processElementNode } from './toRedactorHelpers'

export const toRedactorAsync = async (jsonValue: any, options?: IJsonToHtmlAsyncOptions): Promise<string> => {
  const locals = initLocals(options)
  return _toRedactorAsync(jsonValue, options, locals)
}

async function _toRedactorAsync(jsonValue: any, options: IJsonToHtmlAsyncOptions | undefined, locals: ILocals): Promise<string> {
  const { localTextWrappers, localElementTypes, localAllowedEmptyAttributes, addNbspForEmptyBlocks } = locals

  if (jsonValue.hasOwnProperty('text')) {
    return processTextNode(jsonValue, localTextWrappers)
  }

  let children: string = ''
  if (jsonValue.children) {
    let mapped = await Promise.all(Array.from(jsonValue.children).map((child) => _toRedactorAsync(child, options, locals)))
    if (jsonValue['type'] === 'blockquote') {
      mapped = mapped.map((child: any) => child === '\n' ? '<br/>' : child)
    }
    children = mapped.join('')
  }

  const nonStandard = processNonStandardType(jsonValue, children, localElementTypes, options?.allowNonStandardTypes)
  if (nonStandard !== null) return nonStandard

  if (localElementTypes[jsonValue['type']]) {
    const result = processElementNode(jsonValue, children, options, localElementTypes, localAllowedEmptyAttributes)
    if ('earlyReturn' in result) return result.earlyReturn

    const { attrs, orgType, figureStyles, children: finalChildren } = result
    return await localElementTypes[orgType || jsonValue['type']](
      attrs,
      addNbspForEmptyBlocks && !finalChildren ? '&nbsp;' : finalChildren,
      jsonValue,
      figureStyles,
    )
  }

  return children
}
