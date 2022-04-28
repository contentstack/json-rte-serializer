interface anyObject {[key:string]:any}
export interface IHtmlToJsonOptions {
    allowNonStandardTags?: boolean,
    customElementTags?: IHtmlToJsonElementTags,
    customTextTags?: IHtmlToJsonTextTags
}
export interface IHtmlToJsonElementTagsAttributes {
    type:string,
    attrs:anyObject,
    uid?:string,
}
export interface IHtmlToJsonTextTags { [key: string]: (el:HTMLElement) => anyObject }
export interface IHtmlToJsonElementTags { [key: string]: (el:HTMLElement) => IHtmlToJsonElementTagsAttributes }

export interface IJsonToHtmlTextTags { [key: string]: (child:any, value:any) => string }
export interface IJsonToHtmlElementTags { [key: string]: (attrs:string,child:string,jsonBlock:anyObject,extraProps?:object) => string | void }
export interface IJsonToHtmlOptions {
    customElementTypes?: IJsonToHtmlElementTags,
    customTextWrapper?: IJsonToHtmlTextTags,
    allowNonStandardTypes?: boolean,
}
