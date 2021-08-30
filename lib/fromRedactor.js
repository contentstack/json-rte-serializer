"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromRedactor = void 0;
const tslib_1 = require("tslib");
const slate_hyperscript_1 = require("slate-hyperscript");
const uuid_1 = require("uuid");
const kebabCase_1 = (0, tslib_1.__importDefault)(require("lodash/kebabCase"));
const isEmpty_1 = (0, tslib_1.__importDefault)(require("lodash/isEmpty"));
const flatten_1 = (0, tslib_1.__importDefault)(require("lodash/flatten"));
const isObject_1 = (0, tslib_1.__importDefault)(require("lodash/isObject"));
const cloneDeep_1 = (0, tslib_1.__importDefault)(require("lodash/cloneDeep"));
const isUndefined_1 = (0, tslib_1.__importDefault)(require("lodash/isUndefined"));
const generateId = () => (0, uuid_1.v4)().split('-').join('');
const isInline = ['span', 'a', 'inlineCode', 'reference'];
const isVoid = ['img', 'embed'];
const ELEMENT_TAGS = {
    A: (el) => ({
        type: 'a',
        attrs: {
            url: el.getAttribute('href') ? el.getAttribute('href') : '#'
        }
    }),
    BLOCKQUOTE: () => ({ type: 'blockquote', attrs: {} }),
    H1: () => ({ type: 'h1', attrs: {} }),
    H2: () => ({ type: 'h2', attrs: {} }),
    H3: () => ({ type: 'h3', attrs: {} }),
    H4: () => ({ type: 'h4', attrs: {} }),
    H5: () => ({ type: 'h5', attrs: {} }),
    H6: () => ({ type: 'h6', attrs: {} }),
    IMG: (el) => {
        var _a;
        let imageUrl = ((_a = el.getAttribute('src')) === null || _a === void 0 ? void 0 : _a.split(".")) || ["png"];
        let imageType = imageUrl[(imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.length) - 1];
        return { type: 'reference', attrs: { "asset-link": el.getAttribute('src'), default: true, "asset-type": `image/${imageType}`, "display-type": "display", "type": "asset" } };
    },
    LI: () => ({ type: 'li', attrs: {} }),
    OL: () => ({ type: 'ol', attrs: {} }),
    P: () => ({ type: 'p', attrs: {} }),
    PRE: () => ({ type: 'code', attrs: {} }),
    UL: () => ({ type: 'ul', attrs: {} }),
    IFRAME: (el) => ({ type: 'embed', attrs: { src: el.getAttribute('src') } }),
    TABLE: (el) => ({ type: 'table', attrs: {} }),
    THEAD: (el) => ({ type: 'thead', attrs: {} }),
    TBODY: (el) => ({ type: 'tbody', attrs: {} }),
    TR: (el) => ({ type: 'tr', attrs: {} }),
    TD: (el) => ({ type: 'td', attrs: {} }),
    TH: (el) => ({ type: 'th', attrs: {} }),
    FIGURE: (el) => ({ type: 'reference', attrs: { default: true, "display-type": "display", "type": "asset" } }),
    SPAN: (el) => {
        return { type: 'span', attrs: {} };
    },
    DIV: (el) => {
        return { type: 'div', attrs: {} };
    },
    STYLE: (el) => {
        return { type: 'style', attrs: { "style-text": el.textContent } };
    },
    SCRIPT: (el) => {
        return { type: 'script', attrs: {} };
    }
};
const TEXT_TAGS = {
    CODE: () => ({ code: true }),
    DEL: () => ({ strikethrough: true }),
    EM: () => ({ italic: true }),
    I: () => ({ italic: true }),
    S: () => ({ strikethrough: true }),
    STRONG: () => ({ bold: true }),
    U: () => ({ underline: true }),
    SUP: () => ({ superscript: true }),
    SUB: () => ({ subscript: true })
};
const trimChildString = (child) => {
    if (typeof child === 'string') {
        return child.trim() !== '';
    }
    return true;
};
const getDomAttributes = (child) => {
    return {
        [child.nodeName]: child.nodeValue
    };
};
const generateFragment = (child) => {
    return { type: "fragment", attrs: {}, uid: generateId(), children: [child] };
};
const traverseChildAndModifyChild = (element, attrsForChild) => {
    var _a, _b;
    if (element.hasOwnProperty('text')) {
        let attrsForChildCopy = (0, cloneDeep_1.default)(attrsForChild);
        delete attrsForChildCopy.style;
        let style = { ...(_a = attrsForChild === null || attrsForChild === void 0 ? void 0 : attrsForChild.attrs) === null || _a === void 0 ? void 0 : _a.style, ...(_b = element === null || element === void 0 ? void 0 : element.attrs) === null || _b === void 0 ? void 0 : _b.style };
        if (element === null || element === void 0 ? void 0 : element.attrs) {
            element.attrs.style = style;
        }
        else {
            element.attrs = { style: style };
        }
        Object.entries(attrsForChildCopy).forEach(([key, value]) => {
            element[key] = value;
        });
        return;
    }
    Array.from(element.children || []).map((el) => traverseChildAndModifyChild(el, attrsForChild)).flat();
    return;
};
const traverseChildAndWarpChild = (children) => {
    let inlineElementIndex = [];
    let hasBlockElement = false;
    let childrenCopy = (0, cloneDeep_1.default)(children);
    Array.from(children).forEach((child, index) => {
        if (child.hasOwnProperty('text')) {
            inlineElementIndex.push(index);
            return;
        }
        if (child.hasOwnProperty('type')) {
            if (isInline.includes(child.type)) {
                if (child.type === "reference") {
                    if (child.attrs && (child.attrs['display-type'] === "inline" || child.attrs['display-type'] === "link")) {
                        inlineElementIndex.push(index);
                    }
                    else {
                        hasBlockElement = true;
                    }
                }
                else {
                    inlineElementIndex.push(index);
                }
            }
            else {
                hasBlockElement = true;
            }
        }
        else {
            childrenCopy[index] = (0, slate_hyperscript_1.jsx)("text", {}, child);
            inlineElementIndex.push(index);
        }
    });
    if (hasBlockElement && !(0, isEmpty_1.default)(inlineElementIndex)) {
        Array.from(inlineElementIndex).forEach((child) => {
            children[child] = generateFragment(childrenCopy[child]);
        });
        // console.log("modified children", children)
    }
    return children;
};
const whiteCharPattern = /^[\s ]{2,}$/;
const fromRedactor = (el, allowExtraTags) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32;
    if (el.nodeType === 3) {
        if (whiteCharPattern.test(el.textContent))
            return null;
        if (el.textContent === '\n') {
            return null;
        }
        if (el.parentNode.nodeName === 'SPAN') {
            let attrs = { style: {} };
            if ((_a = el.parentNode.style) === null || _a === void 0 ? void 0 : _a.color) {
                attrs = {
                    ...attrs,
                    style: {
                        ...attrs.style,
                        color: el.parentNode.style.color
                    }
                };
            }
            if ((_b = el.parentNode.style) === null || _b === void 0 ? void 0 : _b['font-family']) {
                attrs = {
                    ...attrs,
                    style: {
                        ...attrs.style,
                        'font-family': el.parentNode.style['font-family']
                    }
                };
            }
            if ((_c = el.parentNode.style) === null || _c === void 0 ? void 0 : _c['font-size']) {
                attrs = {
                    ...attrs,
                    style: {
                        ...attrs.style,
                        'font-size': el.parentNode.style['font-size']
                    }
                };
            }
            return (0, slate_hyperscript_1.jsx)('text', { attrs: attrs }, el.textContent);
        }
        return el.textContent;
    }
    else if (el.nodeType !== 1) {
        return null;
    }
    else if (el.nodeName === 'BR') {
        return { text: ' ', break: true, separaterId: generateId() };
    }
    else if (el.nodeName === 'META') {
        return null;
    }
    else if (el.nodeName === 'COLGROUP') {
        return null;
    }
    const { nodeName } = el;
    let parent = el;
    let children = (0, flatten_1.default)(Array.from(parent.childNodes).map((child) => (0, exports.fromRedactor)(child, allowExtraTags)));
    children = children.filter((child) => child !== null);
    children = traverseChildAndWarpChild(children);
    if (children.length === 0) {
        children = [{ text: '' }];
    }
    if (el.nodeName === 'BODY') {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
            return (0, slate_hyperscript_1.jsx)('element', { type: "doc", uid: generateId(), attrs: {} }, [{ type: 'p', attrs: {}, uid: generateId(), children: [{ text: el.childNodes[0].textContent }] }]);
        }
        if (el.childNodes.length === 0) {
            return (0, slate_hyperscript_1.jsx)('element', { type: "doc", uid: generateId(), attrs: {} }, [{ type: 'p', attrs: {}, children: [{ text: '' }], uid: generateId() }]);
        }
        return (0, slate_hyperscript_1.jsx)('element', { type: "doc", uid: generateId(), attrs: {} }, children);
    }
    if (nodeName === "STYLE" && (allowExtraTags === null || allowExtraTags === void 0 ? void 0 : allowExtraTags.style) !== true) {
        return children;
    }
    if (nodeName === "SCRIPT" && (allowExtraTags === null || allowExtraTags === void 0 ? void 0 : allowExtraTags.script) !== true) {
        return children;
    }
    const isEmbedEntry = (_d = el.attributes['data-sys-entry-uid']) === null || _d === void 0 ? void 0 : _d.value;
    const type = (_e = el.attributes['type']) === null || _e === void 0 ? void 0 : _e.value;
    if (isEmbedEntry && type === "entry") {
        const entryUid = (_f = el.attributes['data-sys-entry-uid']) === null || _f === void 0 ? void 0 : _f.value;
        const contentTypeUid = (_g = el.attributes['data-sys-content-type-uid']) === null || _g === void 0 ? void 0 : _g.value;
        const displayType = (_h = el.attributes['sys-style-type']) === null || _h === void 0 ? void 0 : _h.value;
        const locale = (_j = el.attributes['data-sys-entry-locale']) === null || _j === void 0 ? void 0 : _j.value;
        if (entryUid && contentTypeUid && displayType && locale) {
            let elementAttrs = { attrs: { style: {} } };
            const attributes = el.attributes;
            const attribute = Array.from(attributes).map(getDomAttributes);
            const redactor = Object.assign({}, ...attribute);
            if (redactor['id']) {
                elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], id: redactor['id'] } };
                delete redactor['id'];
            }
            if (redactor['class']) {
                elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], "class-name": redactor['class'] } };
                delete redactor['class'];
            }
            if (redactor['data-sys-entry-uid']) {
                delete redactor['data-sys-entry-uid'];
            }
            if (redactor['data-sys-content-type-uid']) {
                delete redactor['data-sys-content-type-uid'];
            }
            if (redactor['sys-style-type']) {
                delete redactor['sys-style-type'];
            }
            if (redactor['data-sys-entry-locale']) {
                delete redactor['data-sys-entry-locale'];
            }
            if (el.style) {
                delete redactor['style'];
                let allStyleAttrs = {};
                Array.from({ length: el.style.length }).forEach((child, index) => {
                    let property = el.style.item(index);
                    allStyleAttrs[(0, kebabCase_1.default)(property)] = el.style.getPropertyValue(property);
                });
                elementAttrs = {
                    ...elementAttrs,
                    attrs: { ...elementAttrs['attrs'], style: { ...elementAttrs.attrs['style'], ...allStyleAttrs } }
                };
            }
            if (displayType === "link") {
                elementAttrs.attrs.href = redactor['href'];
                delete redactor['href'];
            }
            elementAttrs.attrs["redactor-attributes"] = redactor;
            return (0, slate_hyperscript_1.jsx)('element', { attrs: { ...elementAttrs === null || elementAttrs === void 0 ? void 0 : elementAttrs.attrs, "type": type, "entry-uid": entryUid, "content-type-uid": contentTypeUid, "display-type": displayType, locale }, type: "reference", uid: generateId() }, children);
        }
    }
    const isEmbedAsset = (_k = el.attributes['data-sys-asset-uid']) === null || _k === void 0 ? void 0 : _k.value;
    if (isEmbedAsset && type === "asset") {
        const fileLink = (_l = el.attributes['data-sys-asset-filelink']) === null || _l === void 0 ? void 0 : _l.value;
        const uid = (_m = el.attributes['data-sys-asset-uid']) === null || _m === void 0 ? void 0 : _m.value;
        const fileName = (_o = el.attributes['data-sys-asset-filename']) === null || _o === void 0 ? void 0 : _o.value;
        const contentType = (_p = el.attributes['data-sys-asset-contenttype']) === null || _p === void 0 ? void 0 : _p.value;
        const displayType = (_q = el.attributes['sys-style-type']) === null || _q === void 0 ? void 0 : _q.value;
        const caption = (_r = el.attributes['data-sys-asset-caption']) === null || _r === void 0 ? void 0 : _r.value;
        const alt = (_s = el.attributes['data-sys-asset-alt']) === null || _s === void 0 ? void 0 : _s.value;
        const link = (_t = el.attributes['data-sys-asset-link']) === null || _t === void 0 ? void 0 : _t.value;
        const position = (_u = el.attributes['data-sys-asset-position']) === null || _u === void 0 ? void 0 : _u.value;
        const target = ((_v = el.attributes['data-sys-asset-isnewtab']) === null || _v === void 0 ? void 0 : _v.value) ? "_blank" : "_self";
        const contentTypeUid = ((_w = el.attributes['content-type-uid']) === null || _w === void 0 ? void 0 : _w.value) || 'sys_assets';
        if (fileLink && uid && fileName && contentType) {
            let elementAttrs = { attrs: { style: {} } };
            const attributes = el.attributes;
            const attribute = Array.from(attributes).map(getDomAttributes);
            const redactor = Object.assign({}, ...attribute);
            if (redactor['id']) {
                elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], id: redactor['id'] } };
                delete redactor['id'];
            }
            if (redactor['class']) {
                elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], "class-name": redactor['class'] } };
                delete redactor['class'];
            }
            if (redactor['data-sys-asset-filelink']) {
                delete redactor['data-sys-asset-filelink'];
            }
            if (redactor['data-sys-asset-uid']) {
                delete redactor['data-sys-asset-uid'];
            }
            if (redactor['data-sys-asset-filename']) {
                delete redactor['data-sys-asset-filename'];
            }
            if (redactor['data-sys-asset-contenttype']) {
                delete redactor['data-sys-asset-contenttype'];
            }
            if (redactor['width']) {
                let width = parseFloat(redactor['width']);
                if (isNaN(width)) {
                    width = 100;
                }
                elementAttrs.attrs.width = width;
                delete redactor['width'];
            }
            if (redactor['content-type-uid']) {
                delete redactor['content-type-uid'];
            }
            if (redactor['data-sys-asset-caption']) {
                delete redactor['data-sys-asset-caption'];
            }
            if (redactor['data-sys-asset-alt']) {
                delete redactor['data-sys-asset-alt'];
            }
            if (redactor['data-sys-asset-link']) {
                delete redactor['data-sys-asset-link'];
            }
            if (redactor['data-sys-asset-position']) {
                delete redactor['data-sys-asset-position'];
            }
            if (redactor['data-sys-asset-isnewtab']) {
                delete redactor['data-sys-asset-isnewtab'];
            }
            if (el.style) {
                delete redactor['style'];
                let allStyleAttrs = {};
                Array.from({ length: el.style.length }).forEach((child, index) => {
                    let property = el.style.item(index);
                    allStyleAttrs[(0, kebabCase_1.default)(property)] = el.style.getPropertyValue(property);
                });
                elementAttrs = {
                    ...elementAttrs,
                    attrs: { ...elementAttrs['attrs'], style: { ...elementAttrs.attrs['style'], ...allStyleAttrs } }
                };
            }
            elementAttrs.attrs["redactor-attributes"] = redactor;
            return (0, slate_hyperscript_1.jsx)('element', { attrs: { ...elementAttrs === null || elementAttrs === void 0 ? void 0 : elementAttrs.attrs, type, "asset-caption": caption, "link": link, "asset-alt": alt, target, position, "asset-link": fileLink, "asset-uid": uid, "display-type": displayType, "asset-name": fileName, "asset-type": contentType, "content-type-uid": contentTypeUid }, type: "reference", uid: generateId() }, children);
        }
    }
    if (nodeName === 'FIGCAPTION') {
        return null;
    }
    if (nodeName === 'DIV') {
        const dataType = (_x = el.attributes['data-type']) === null || _x === void 0 ? void 0 : _x.value;
        if (dataType === 'row') {
            const attrs = {
                type: 'row',
                uid: generateId()
            };
            return (0, slate_hyperscript_1.jsx)('element', attrs, children);
        }
        if (dataType === 'column') {
            const { width } = el.attributes;
            const attrs = {
                type: 'column',
                uid: generateId(),
                meta: {
                    width: Number(width.value)
                }
            };
            return (0, slate_hyperscript_1.jsx)('element', attrs, children);
        }
        if (dataType === 'grid-container') {
            const gutter = (_z = (_y = el.attributes) === null || _y === void 0 ? void 0 : _y['gutter']) === null || _z === void 0 ? void 0 : _z.value;
            const attrs = {
                type: 'grid-container',
                attrs: {
                    gutter
                }
            };
            return (0, slate_hyperscript_1.jsx)('element', attrs, children);
        }
        if (dataType === 'grid-child') {
            const gridRatio = (_1 = (_0 = el.attributes) === null || _0 === void 0 ? void 0 : _0['grid-ratio']) === null || _1 === void 0 ? void 0 : _1.value;
            const attrs = {
                type: 'grid-child',
                attrs: {
                    gridRatio
                }
            };
            return (0, slate_hyperscript_1.jsx)('element', attrs, children);
        }
        if (dataType === 'hr') {
            return (0, slate_hyperscript_1.jsx)('element', {
                type: 'hr',
                uid: generateId()
            }, [
                {
                    text: ''
                }
            ]);
        }
    }
    if (ELEMENT_TAGS[nodeName]) {
        if (el.nodeName === 'P') {
            children = children.map((child) => {
                if (typeof child === 'string') {
                    return child.replace(/\n/g, ' ');
                }
                return child;
            });
        }
        if (el.parentNode.nodeName === 'PRE') {
            return el.outerHTML;
        }
        if (el.closest('pre') && el.nodeName !== 'PRE') {
            return null;
        }
        let elementAttrs = ELEMENT_TAGS[nodeName](el);
        const attributes = el.attributes;
        if (attributes.length !== 0) {
            const attribute = Array.from(attributes).map(getDomAttributes);
            const redactor = Object.assign({}, ...attribute);
            if (redactor['id']) {
                elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], id: redactor['id'] } };
            }
            if (redactor['class']) {
                elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], "class-name": redactor['class'] } };
            }
            if (el.style) {
                let allStyleAttrs = {};
                Array.from({ length: el.style.length }).forEach((child, index) => {
                    let property = el.style.item(index);
                    allStyleAttrs[(0, kebabCase_1.default)(property)] = el.style.getPropertyValue(property);
                });
                elementAttrs = {
                    ...elementAttrs,
                    attrs: { ...elementAttrs['attrs'], style: { ...elementAttrs.attrs['style'], ...allStyleAttrs } }
                };
            }
            if (el.style && (el.style.getPropertyValue('text-align') || el.style.getPropertyValue('float'))) {
                const alignStyle = el.style.getPropertyValue('text-align')
                    ? el.style.getPropertyValue('text-align')
                    : el.style.getPropertyValue('float');
                elementAttrs = {
                    ...elementAttrs,
                    attrs: { ...elementAttrs['attrs'], style: { ...elementAttrs.attrs['style'], "text-align": alignStyle } }
                };
            }
            if (redactor['data-sys-asset-uid']) {
                elementAttrs = {
                    ...elementAttrs,
                    attrs: { ...elementAttrs['attrs'], 'data-sys-asset-uid': redactor['data-sys-asset-uid'] }
                };
            }
            elementAttrs = { ...elementAttrs, attrs: { ...elementAttrs['attrs'], "redactor-attributes": redactor } };
        }
        if (!elementAttrs['uid']) {
            elementAttrs['uid'] = generateId();
        }
        if (nodeName === 'FIGURE') {
            let newChildren = children.filter(trimChildString);
            // this is required because redactor often has blank space between tags
            // which is interpreted as children in our code
            let { style } = elementAttrs.attrs;
            let extraAttrs = {
                position: null
            };
            if (style && style["text-align"]) {
                extraAttrs.position = style["text-align"];
            }
            let sizeAttrs = {
                width: "auto"
            };
            if ((_2 = el.style) === null || _2 === void 0 ? void 0 : _2.width) {
                sizeAttrs.width = el.style.width;
                if (sizeAttrs.width[sizeAttrs.width.length - 1] === '%') {
                    sizeAttrs.width = Number(sizeAttrs.width.slice(0, sizeAttrs.width.length - 1));
                }
                else if (sizeAttrs.width.slice(sizeAttrs.width.length - 2) === 'px') {
                    sizeAttrs.width = (Number(sizeAttrs.width.slice(0, sizeAttrs.width.length - 2)) / ((_3 = window === null || window === void 0 ? void 0 : window.screen) === null || _3 === void 0 ? void 0 : _3.width) || 1920) * 100;
                }
            }
            if ((_4 = el.style) === null || _4 === void 0 ? void 0 : _4['max-width']) {
                sizeAttrs['max-width'] = el.style['max-width'];
                if (sizeAttrs['max-width'][sizeAttrs['max-width'].length - 1] === '%') {
                    sizeAttrs['max-width'] = Number(sizeAttrs['max-width'].slice(0, sizeAttrs['max-width'].length - 1));
                }
                else if (sizeAttrs['max-width'].slice(sizeAttrs['max-width'].length - 2) === 'px') {
                    sizeAttrs['max-width'] =
                        (Number(sizeAttrs['max-width'].slice(0, sizeAttrs['max-width'].length - 2)) / ((_5 = window === null || window === void 0 ? void 0 : window.screen) === null || _5 === void 0 ? void 0 : _5.width) || 1920) * 100;
                }
            }
            let captionElements = el.getElementsByTagName("FIGCAPTION");
            //console.log("captionElement", captionElements?.[0]?.textContent)
            if ((_6 = captionElements === null || captionElements === void 0 ? void 0 : captionElements[0]) === null || _6 === void 0 ? void 0 : _6.textContent) {
                extraAttrs['asset-caption'] = (_7 = captionElements === null || captionElements === void 0 ? void 0 : captionElements[0]) === null || _7 === void 0 ? void 0 : _7.textContent;
            }
            if (((_8 = newChildren[0]) === null || _8 === void 0 ? void 0 : _8.type) === 'a') {
                const { link, target } = (_9 = newChildren[0].attrs) === null || _9 === void 0 ? void 0 : _9["redactor-attributes"];
                extraAttrs['link'] = link;
                if (target && target !== '') {
                    extraAttrs['target'] = true;
                }
                const imageAttrs = newChildren[0].children[0];
                elementAttrs = getImageAttributes(elementAttrs, imageAttrs.attrs || {}, { ...extraAttrs, ...sizeAttrs });
            }
            if (((_10 = newChildren[0]) === null || _10 === void 0 ? void 0 : _10.type) === 'reference' && ((_12 = (_11 = newChildren[0]) === null || _11 === void 0 ? void 0 : _11.attrs) === null || _12 === void 0 ? void 0 : _12.default)) {
                elementAttrs = getImageAttributes(elementAttrs, { ...newChildren[0].attrs, ...sizeAttrs }, { ...extraAttrs, ...sizeAttrs });
            }
            //console.log("elementAttrs", elementAttrs)
            return (0, slate_hyperscript_1.jsx)('element', elementAttrs, [{ text: '' }]);
        }
        if (nodeName === 'A') {
            let newChildren = children.filter(trimChildString);
            if (((_13 = newChildren[0]) === null || _13 === void 0 ? void 0 : _13.type) === 'reference' && ((_15 = (_14 = newChildren[0]) === null || _14 === void 0 ? void 0 : _14.attrs) === null || _15 === void 0 ? void 0 : _15.default)) {
                let extraAttrs = {};
                const { href, target } = (_16 = elementAttrs.attrs) === null || _16 === void 0 ? void 0 : _16["redactor-attributes"];
                extraAttrs['link'] = href || el.getAttribute('href');
                if (target && target !== '') {
                    extraAttrs['target'] = true;
                }
                const imageAttrs = newChildren[0];
                elementAttrs = getImageAttributes(imageAttrs, imageAttrs.attrs || {}, extraAttrs);
                return (0, slate_hyperscript_1.jsx)('element', elementAttrs, [{ text: '' }]);
            }
        }
        if (nodeName === 'IMG' || nodeName === 'IFRAME') {
            if ((_18 = (_17 = elementAttrs === null || elementAttrs === void 0 ? void 0 : elementAttrs.attrs) === null || _17 === void 0 ? void 0 : _17["redactor-attributes"]) === null || _18 === void 0 ? void 0 : _18.width) {
                let width = elementAttrs.attrs["redactor-attributes"].width;
                if (width.slice(width.length - 1) === '%') {
                    elementAttrs.attrs.width = parseFloat(width.slice(0, width.length - 1));
                }
                else if (width.slice(width.length - 2) === 'px') {
                    elementAttrs.attrs.width = 100;
                }
                else {
                    elementAttrs.attrs.width = parseFloat(width);
                }
            }
            if ((_20 = (_19 = elementAttrs === null || elementAttrs === void 0 ? void 0 : elementAttrs.attrs) === null || _19 === void 0 ? void 0 : _19["redactor-attributes"]) === null || _20 === void 0 ? void 0 : _20.inline) {
                elementAttrs.attrs.inline = Boolean((_22 = (_21 = elementAttrs === null || elementAttrs === void 0 ? void 0 : elementAttrs.attrs) === null || _21 === void 0 ? void 0 : _21["redactor-attributes"]) === null || _22 === void 0 ? void 0 : _22.inline);
            }
            return (0, slate_hyperscript_1.jsx)('element', elementAttrs, [{ text: '' }]);
        }
        if (nodeName === 'BLOCKQUOTE') {
            children = Array.from(children).map((child) => {
                if (child['break']) {
                    return { text: '\n', break: true };
                }
                return child;
            });
        }
        if (nodeName === 'TABLE') {
            let row = 0;
            let table_child = ['THEAD', 'TBODY'];
            let cell_type = ['TH', 'TD'];
            let col = 0;
            Array.from(el.childNodes).forEach((child) => {
                if (table_child.includes(child.nodeName)) {
                    row += child.childNodes.length;
                }
            });
            let rowElement = el.getElementsByTagName('TR')[0];
            if (rowElement)
                Array.from(rowElement.childNodes).forEach((child) => {
                    if (cell_type.includes(child.nodeName)) {
                        col += 1;
                    }
                });
            let colWidths = Array.from({ length: col }).fill(250);
            if (((_24 = (_23 = el === null || el === void 0 ? void 0 : el.childNodes) === null || _23 === void 0 ? void 0 : _23[0]) === null || _24 === void 0 ? void 0 : _24.nodeName) === 'COLGROUP') {
                let colGroupWidth = [];
                let totalWidth = parseFloat(el.childNodes[0].getAttribute('data-width')) || col * 250;
                Array.from(el.childNodes[0].childNodes).forEach((child) => {
                    var _a;
                    let width = ((_a = child === null || child === void 0 ? void 0 : child.style) === null || _a === void 0 ? void 0 : _a.width) || '250px';
                    if (width.slice(width.length - 1) === '%') {
                        colGroupWidth.push((parseFloat(width.slice(0, width.length - 1)) * totalWidth) / 100);
                    }
                    else if (width.slice(width.length - 2) === 'px') {
                        colGroupWidth.push(parseFloat(width.slice(0, width.length - 2)));
                    }
                });
                colWidths = colGroupWidth;
            }
            elementAttrs = {
                ...elementAttrs,
                attrs: {
                    ...elementAttrs.attrs,
                    rows: row,
                    cols: col,
                    colWidths: colWidths
                }
            };
        }
        if (nodeName === 'P') {
            if (((_26 = (_25 = elementAttrs === null || elementAttrs === void 0 ? void 0 : elementAttrs.attrs) === null || _25 === void 0 ? void 0 : _25["redactor-attributes"]) === null || _26 === void 0 ? void 0 : _26['data-checked']) &&
                ((_28 = (_27 = elementAttrs === null || elementAttrs === void 0 ? void 0 : elementAttrs.attrs) === null || _27 === void 0 ? void 0 : _27["redactor-attributes"]) === null || _28 === void 0 ? void 0 : _28['data-type'])) {
                elementAttrs.type = 'check-list';
                elementAttrs.checked = elementAttrs.attrs["redactor-attributes"]['data-checked'] === 'true';
                delete elementAttrs.attrs["redactor-attributes"]['data-checked'];
                delete elementAttrs.attrs["redactor-attributes"]['data-type'];
            }
        }
        if (nodeName === 'SPAN') {
            if (((_30 = (_29 = elementAttrs === null || elementAttrs === void 0 ? void 0 : elementAttrs.attrs) === null || _29 === void 0 ? void 0 : _29["redactor-attributes"]) === null || _30 === void 0 ? void 0 : _30['data-type']) === 'inlineCode') {
                let attrsStyle = { attrs: { style: {} }, inlineCode: true };
                if ((0, isEmpty_1.default)(children)) {
                    children = [{ text: "" }];
                }
                return children.map((child) => (0, slate_hyperscript_1.jsx)('text', attrsStyle, child));
            }
            if ((_32 = (_31 = elementAttrs === null || elementAttrs === void 0 ? void 0 : elementAttrs.attrs) === null || _31 === void 0 ? void 0 : _31["redactor-attributes"]) === null || _32 === void 0 ? void 0 : _32.style) {
                return children;
            }
            if (nodeName === 'SPAN') {
                Array.from(children).forEach((child) => {
                    if (child.type) {
                        if (!isInline.includes(child.type) && !isVoid.includes(child.type)) {
                            elementAttrs = {
                                type: 'div',
                                attrs: {
                                    orgType: 'span'
                                },
                                uid: generateId()
                            };
                        }
                    }
                });
            }
            let noOfInlineElement = 0;
            Array.from(el.parentNode.childNodes).forEach((child) => {
                if (child.nodeType === 3 || child.nodeName === 'SPAN' || child.nodeName === 'A') {
                    noOfInlineElement += 1;
                }
            });
            if (noOfInlineElement !== el.parentNode.childNodes.length) {
                elementAttrs = {
                    type: 'div',
                    attrs: {
                        orgType: 'span'
                    },
                    uid: generateId()
                };
            }
        }
        if (children.length === 0) {
            children = [{ text: '' }];
        }
        return (0, slate_hyperscript_1.jsx)('element', elementAttrs, children);
    }
    if (TEXT_TAGS[nodeName]) {
        const attrs = TEXT_TAGS[nodeName](el);
        let attrsStyle = { attrs: { style: {} }, ...attrs };
        //console.log("child", children)
        let newChildren = children.map((child) => {
            if ((0, isObject_1.default)(child)) {
                traverseChildAndModifyChild(child, attrsStyle);
                //console.log("child", child)
                return child;
            }
            else {
                return (0, slate_hyperscript_1.jsx)('text', attrsStyle, child);
            }
        });
        return (0, slate_hyperscript_1.jsx)('fragment', {}, newChildren);
    }
    if (children.length === 0) {
        children = [{ text: '' }];
    }
    return children;
};
exports.fromRedactor = fromRedactor;
const getImageAttributes = (elementAttrs, childAttrs, extraAttrs) => {
    var _a, _b, _c, _d;
    elementAttrs = {
        ...elementAttrs,
        attrs: {
            ...elementAttrs.attrs,
            ...childAttrs,
            "redactor-attributes": {
                ...childAttrs === null || childAttrs === void 0 ? void 0 : childAttrs["redactor-attributes"],
                ...extraAttrs
            },
            "asset-caption": extraAttrs["asset-caption"],
            "link": extraAttrs.link
        }
    };
    if ((_b = (_a = elementAttrs === null || elementAttrs === void 0 ? void 0 : elementAttrs.attrs) === null || _a === void 0 ? void 0 : _a["redactor-attributes"]) === null || _b === void 0 ? void 0 : _b.link) {
        elementAttrs.attrs.link = elementAttrs.attrs.link || ((_d = (_c = elementAttrs === null || elementAttrs === void 0 ? void 0 : elementAttrs.attrs) === null || _c === void 0 ? void 0 : _c["redactor-attributes"]) === null || _d === void 0 ? void 0 : _d.link);
    }
    if ((0, isUndefined_1.default)(elementAttrs.attrs["asset-caption"])) {
        delete elementAttrs.attrs["asset-caption"];
    }
    if ((0, isUndefined_1.default)(elementAttrs.attrs["link"])) {
        delete elementAttrs.attrs["link"];
    }
    return elementAttrs;
};
