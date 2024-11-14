import "array-flat-polyfill"
import { fromRedactor, replaceNonSemanticTags } from "./fromRedactor"
import { toRedactor } from "./toRedactor"
import {jsonToMarkdownSerializer} from './jsonToMarkdown'
import { IHtmlToJsonOptions } from "./types"
export * from "./types"
export { toRedactor as jsonToHtml, jsonToMarkdownSerializer as jsonToMarkdown }

export const htmlToJson = (el: any, options?:IHtmlToJsonOptions) => {
    replaceNonSemanticTags(el)
    return fromRedactor(el, options)
}