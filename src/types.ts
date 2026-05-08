import { ReactNode } from 'react'

export interface IAnyObject {[key:string]:any}
export interface IHtmlToJsonOptions {
    allowNonStandardTags?: boolean,
    customElementTags?: IHtmlToJsonElementTags,
    customTextTags?: IHtmlToJsonTextTags,
    addNbspForEmptyBlocks?: boolean
}
export interface IHtmlToJsonElementTagsAttributes {
    type:string,
    attrs:IAnyObject,
    uid?:string,
}
export interface IHtmlToJsonTextTags { [key: string]: (el:HTMLElement) => IAnyObject }
export interface IHtmlToJsonElementTags { [key: string]: (el:HTMLElement) => IHtmlToJsonElementTagsAttributes }

export interface IJsonToHtmlTextTags { [key: string]: (child:any, value:any) => string }
export interface IJsonToHtmlElementTags { [key: string]: (attrs:string,child:string,jsonBlock:IAnyObject,extraProps?:object) => string }
export interface IJsonToHtmlAsyncElementTags { [key: string]: (attrs:string,child:string,jsonBlock:IAnyObject,extraProps?:object) => string | Promise<string> }
export interface IJsonToHtmlAllowedEmptyAttributes { [key: string]: string[]; }
export interface IJsonToMarkdownElementTags{[key: string]: (attrsJson:IAnyObject,child:string) => string}
export interface IJsonToMarkdownTextTags{ [key: string]: (child:any, value:any) => string }
export interface IJsonToHtmlOptions {
    customElementTypes?: IJsonToHtmlElementTags,
    customTextWrapper?: IJsonToHtmlTextTags,
    allowNonStandardTypes?: boolean,
    allowedEmptyAttributes?: IJsonToHtmlAllowedEmptyAttributes,
    addNbspForEmptyBlocks?: boolean
}
export interface IJsonToHtmlAsyncOptions {
    customElementTypes?: IJsonToHtmlAsyncElementTags,
    customTextWrapper?: IJsonToHtmlTextTags,
    allowNonStandardTypes?: boolean,
    allowedEmptyAttributes?: IJsonToHtmlAllowedEmptyAttributes,
    addNbspForEmptyBlocks?: boolean
}

// --- React tree output mode ---

/** Handler for element nodes. Receives the full JSON block and pre-rendered children. */
export type IJsonToReactElementHandler = (jsonBlock: IAnyObject, children: ReactNode) => ReactNode

/** Handler for text marks (bold, italic, etc.). Wraps children in a mark element. */
export type IJsonToReactTextHandler = (children: ReactNode, value?: any) => ReactNode

export interface IJsonToReactOptions {
    /** Override or extend element type handlers. */
    customElementTypes?: Record<string, IJsonToReactElementHandler>,
    /** Override or extend text mark handlers (bold, italic, etc.). */
    customTextMarks?: Record<string, IJsonToReactTextHandler>,
}
