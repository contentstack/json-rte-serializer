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
