"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRedactor = void 0;
const tslib_1 = require("tslib");
const kebabCase_1 = (0, tslib_1.__importDefault)(require("lodash/kebabCase"));
const isEmpty_1 = (0, tslib_1.__importDefault)(require("lodash/isEmpty"));
const ELEMENT_TYPES = {
    'blockquote': (attrs, child) => {
        return `<blockquote${attrs}>${child}</blockquote>`;
    },
    'h1': (attrs, child) => {
        return `<h1${attrs}>${child}</h1>`;
    },
    'h2': (attrs, child) => {
        return `<h2${attrs}>${child}</h2>`;
    },
    'h3': (attrs, child) => {
        return `<h3${attrs}>${child}</h3>`;
    },
    'h4': (attrs, child) => {
        return `<h4${attrs}>${child}</h4>`;
    },
    'h5': (attrs, child) => {
        return `<h5${attrs}>${child}</h5>`;
    },
    'h6': (attrs, child) => {
        return `<h6${attrs}>${child}</h6>`;
    },
    img: (attrs, child, jsonBlock, figureStyles) => {
        if (figureStyles.fieldsEdited.length === 0) {
            return `<img${attrs}/>`;
        }
        let img = figureStyles.anchorLink ? `<a ${figureStyles.anchorLink}><img${attrs}/></a>` : `<img${attrs} />`;
        let caption = figureStyles.caption
            ? figureStyles.alignment === 'center'
                ? `<figcaption  style = "text-align: center;">${figureStyles.caption}</figcaption>`
                : `<figcaption>${figureStyles.caption}</figcaption>`
            : '';
        let align = figureStyles.position
            ? `<figure ${figureStyles.position}>${img}${caption}</figure>`
            : figureStyles.caption
                ? `<figure>${img}${caption}</figure>`
                : `${img}`;
        return `${align}`;
    },
    embed: (attrs, child) => {
        return `<iframe${attrs}></iframe>`;
    },
    p: (attrs, child) => {
        return `<p${attrs}>${child}</p>`;
    },
    ol: (attrs, child) => {
        return `<ol${attrs}>${child}</ol>`;
    },
    ul: (attrs, child) => {
        return `<ul${attrs}>${child}</ul>`;
    },
    code: (attrs, child) => {
        return `<pre${attrs}>${child}</pre>`;
    },
    li: (attrs, child) => {
        return `<li${attrs}>${child}</li>`;
    },
    a: (attrs, child) => {
        return `<a${attrs}>${child}</a>`;
    },
    table: (attrs, child) => {
        return `<table${attrs}>${child}</table>`;
    },
    tbody: (attrs, child) => {
        return `<tbody${attrs}>${child}</tbody>`;
    },
    thead: (attrs, child) => {
        return `<thead${attrs}>${child}</thead>`;
    },
    tr: (attrs, child) => {
        return `<tr${attrs}>${child}</tr>`;
    },
    td: (attrs, child) => {
        return `<td${attrs}>${child}</td>`;
    },
    th: (attrs, child) => {
        return `<th${attrs}>${child}</th>`;
    },
    'check-list': (attrs, child) => {
        return `<p${attrs}>${child}</p>`;
    },
    row: (attrs, child) => {
        return `<div${attrs}>${child}</div>`;
    },
    column: (attrs, child) => {
        return `<div${attrs}>${child}</div>`;
    },
    'grid-container': (attrs, child) => {
        return `<div${attrs}>${child}</div>`;
    },
    'grid-child': (attrs, child) => {
        return `<div${attrs}>${child}</div>`;
    },
    hr: (attrs, child) => {
        return `<div data-type='hr' style='border-top: 3px solid #bbb'></div>`;
    },
    span: (attrs, child) => {
        return `<span${attrs}>${child}</span>`;
    },
    div: (attrs, child) => {
        return `<div${attrs}>${child}</div>`;
    },
    reference: (attrs, child, jsonBlock, extraAttrs) => {
        if ((extraAttrs === null || extraAttrs === void 0 ? void 0 : extraAttrs.displayType) === 'inline') {
            return `<span${attrs}>${child}</span>`;
        }
        else if ((extraAttrs === null || extraAttrs === void 0 ? void 0 : extraAttrs.displayType) === 'block') {
            return `<div${attrs}>${child}</div>`;
        }
        else if ((extraAttrs === null || extraAttrs === void 0 ? void 0 : extraAttrs.displayType) === 'link') {
            return `<a${attrs}>${child}</a>`;
        }
        else if ((extraAttrs === null || extraAttrs === void 0 ? void 0 : extraAttrs.displayType) === 'asset') {
            return `<figure${attrs}>${child}</figure>`;
        }
        return `<span${attrs}>${child}</span>`;
    },
    inlineCode: (attrs, child) => {
        return;
    },
    fragment: (attrs, child) => {
        return child;
    },
    style: (attrs, child) => {
        return `<style ${attrs}>${child}</style>`;
    },
    script: (attrs, child) => {
        return `<script ${attrs}>${child}</script>`;
    }
};
const TEXT_WRAPPERS = {
    'bold': (child, value) => {
        return `<strong>${child}</strong>`;
    },
    'italic': (child, value) => {
        return `<em>${child}</em>`;
    },
    'underline': (child, value) => {
        return `<u>${child}</u>`;
    },
    'strikethrough': (child, value) => {
        return `<del>${child}</del>`;
    },
    'superscript': (child, value) => {
        return `<sup>${child}</sup>`;
    },
    'subscript': (child, value) => {
        return `<sub>${child}</sub>`;
    },
    'inlineCode': (child, value) => {
        return `<span data-type='inlineCode'>${child}</span>`;
    }
};
const toRedactor = (jsonValue, options) => {
    var _a, _b, _c, _d;
    //TODO: optimize assign once per function call
    if ((options === null || options === void 0 ? void 0 : options.customTextWrapper) && !(0, isEmpty_1.default)(options.customTextWrapper)) {
        Object.assign(TEXT_WRAPPERS, options.customTextWrapper);
    }
    if (jsonValue.hasOwnProperty('text')) {
        let text = jsonValue['text'].replace(/</g, '&lt;').replace(/>/g, '&gt;');
        if (jsonValue['break']) {
            text += `<br/>`;
        }
        Object.entries(jsonValue).forEach(([key, value]) => {
            if (TEXT_WRAPPERS.hasOwnProperty(key)) {
                text = TEXT_WRAPPERS[key](text, value);
            }
        });
        if (jsonValue['attrs']) {
            const { style } = jsonValue['attrs'];
            if (style) {
                let attrsStyle = '';
                if (style.color) {
                    attrsStyle = `color:${style.color};`;
                }
                if (style["font-family"]) {
                    attrsStyle += `font-family:"${style.fontFamily}";`;
                }
                if (style["font-size"]) {
                    attrsStyle += `font-size: ${style.fontSize};`;
                }
                if (attrsStyle !== '') {
                    text = `<span style='${attrsStyle}'>${text}</span>`;
                }
            }
        }
        return text;
    }
    let children = '';
    if ((options === null || options === void 0 ? void 0 : options.customElementTypes) && !(0, isEmpty_1.default)(options.customElementTypes)) {
        Object.assign(ELEMENT_TYPES, options.customElementTypes);
    }
    if (jsonValue.children) {
        children = Array.from(jsonValue.children).map((child) => (0, exports.toRedactor)(child, options));
        if (jsonValue['type'] === 'blockquote') {
            children = children.map((child) => {
                if (child === '\n') {
                    return '<br/>';
                }
                return child;
            });
        }
        children = children.join('');
    }
    if (ELEMENT_TYPES[jsonValue['type']]) {
        let attrs = '';
        let orgType;
        let figureStyles = {
            fieldsEdited: []
        };
        if (jsonValue.attrs) {
            let attrsJson = {};
            let allattrs = JSON.parse(JSON.stringify(jsonValue.attrs));
            let style = '';
            if (jsonValue.attrs["redactor-attributes"]) {
                attrsJson = { ...allattrs["redactor-attributes"] };
            }
            if (jsonValue['type'] === 'reference' && ((_a = jsonValue === null || jsonValue === void 0 ? void 0 : jsonValue.attrs) === null || _a === void 0 ? void 0 : _a.default)) {
                orgType = "img";
                let inline = '';
                if (attrsJson['asset-link']) {
                    attrsJson['src'] = attrsJson['asset-link'];
                    delete attrsJson['asset-link'];
                    delete allattrs['asset-link'];
                }
                if (attrsJson['inline']) {
                    inline = `display: flow-root;margin:0`;
                    delete attrsJson['width'];
                    delete attrsJson['style'];
                }
                if (attrsJson['position']) {
                    figureStyles.position =
                        attrsJson['position'] === 'center'
                            ? `style = "margin: auto; text-align: center;width: ${allattrs['width'] ? allattrs['width'] + '%' : 100 + '%'};"`
                            : `style = "float: ${attrsJson['position']};${inline};width: ${allattrs['width'] ? allattrs['width'] + '%' : 100 + '%'};max-width:${allattrs['max-width'] ? allattrs['max-width'] + '%' : 100 + '%'};"`;
                    figureStyles.alignment = attrsJson['position'];
                    figureStyles.fieldsEdited.push(figureStyles.position);
                    delete attrsJson['position'];
                    attrsJson['width'] && delete attrsJson['width'];
                    attrsJson['style'] && delete attrsJson['style'];
                    attrsJson['height'] && delete attrsJson['height'];
                    attrsJson['max-width'] && delete attrsJson['max-width'];
                    allattrs['max-width'] && delete allattrs['max-width'];
                    allattrs['width'] && delete allattrs['width'];
                    if (allattrs["redactor-attributes"]) {
                        allattrs["redactor-attributes"]['width'] && delete allattrs["redactor-attributes"]['width'];
                        ((_b = allattrs === null || allattrs === void 0 ? void 0 : allattrs["redactor-attributes"]) === null || _b === void 0 ? void 0 : _b['style']) && delete allattrs["redactor-attributes"]['style'];
                        ((_c = allattrs === null || allattrs === void 0 ? void 0 : allattrs["redactor-attributes"]) === null || _c === void 0 ? void 0 : _c['max-width']) && delete allattrs["redactor-attributes"]['max-width'];
                    }
                }
                if (attrsJson['asset-caption']) {
                    figureStyles.caption = attrsJson['asset-caption'];
                    figureStyles.fieldsEdited.push(figureStyles.caption);
                    delete attrsJson['asset-caption'];
                    delete allattrs['asset-caption'];
                }
                if (attrsJson['link']) {
                    let anchor = '';
                    anchor = `href="${attrsJson['link']}"`;
                    if (attrsJson['target']) {
                        anchor += ' target="_blank"';
                    }
                    figureStyles.anchorLink = `${anchor}`;
                    figureStyles.fieldsEdited.push(figureStyles.anchorLink);
                    delete attrsJson['link'];
                    delete allattrs['link'];
                }
                delete allattrs['default'];
                delete attrsJson['default'];
                delete attrsJson['target'];
                delete allattrs['asset-link'];
                delete allattrs['asset-type'];
                delete allattrs['display-type'];
            }
            if (jsonValue['type'] === 'a') {
                attrsJson['href'] = allattrs['url'];
            }
            if (allattrs['orgType']) {
                orgType = allattrs['orgType'];
                delete allattrs['orgType'];
            }
            if (allattrs['class-name']) {
                attrsJson['class'] = allattrs['class-name'];
                delete allattrs['class-name'];
            }
            if (attrsJson['width']) {
                let width = attrsJson['width'];
                if (width.slice(width.length - 1) === '%') {
                    style = `width: ${allattrs['width']}; height: ${attrsJson['height'] ? attrsJson['height'] : 'auto'};`;
                }
                else {
                    style = `width: ${allattrs['width'] + '%'}; height: ${attrsJson['height'] ? attrsJson['height'] : 'auto'};`;
                }
            }
            else {
                if (allattrs['width']) {
                    let width = String(allattrs['width']);
                    if (width.slice(width.length - 1) === '%') {
                        allattrs['width'] = String(allattrs['width']);
                    }
                    else {
                        allattrs['width'] = allattrs['width'] + '%';
                    }
                    // style = `width: ${allattrs['width']}; height: auto;`
                }
            }
            if (allattrs['style'] && jsonValue['type'] !== 'img') {
                Object.keys(allattrs['style']).forEach((key) => {
                    style += `${(0, kebabCase_1.default)(key)}: ${allattrs.style[key]};`;
                });
                delete allattrs['style'];
            }
            if (allattrs['rows'] && allattrs['cols'] && allattrs['colWidths']) {
                delete allattrs['rows'];
                delete allattrs['cols'];
                delete allattrs['colWidths'];
            }
            attrsJson = { ...attrsJson, ...allattrs, style: style };
            if (jsonValue['type'] === 'reference') {
                if (attrsJson['type'] === "entry") {
                    attrsJson['data-sys-entry-uid'] = allattrs['entry-uid'];
                    delete attrsJson['entry-uid'];
                    attrsJson['data-sys-entry-locale'] = allattrs['locale'];
                    delete attrsJson['locale'];
                    attrsJson['data-sys-content-type-uid'] = allattrs['content-type-uid'];
                    delete attrsJson['content-type-uid'];
                    attrsJson['sys-style-type'] = allattrs['display-type'];
                    delete attrsJson['display-type'];
                }
                else if (attrsJson['type'] === "asset") {
                    attrsJson['data-sys-asset-filelink'] = allattrs['asset-link'];
                    delete attrsJson['asset-link'];
                    attrsJson['data-sys-asset-uid'] = allattrs['asset-uid'];
                    delete attrsJson['asset-uid'];
                    attrsJson['data-sys-asset-filename'] = allattrs['asset-name'];
                    delete attrsJson['asset-name'];
                    attrsJson['data-sys-asset-contenttype'] = allattrs['asset-type'];
                    delete attrsJson['asset-type'];
                    //
                    if (allattrs['asset-caption']) {
                        attrsJson['data-sys-asset-caption'] = allattrs['asset-caption'];
                        delete attrsJson['asset-caption'];
                    }
                    if (allattrs['asset-alt']) {
                        attrsJson['data-sys-asset-alt'] = allattrs['asset-alt'];
                        delete attrsJson['aasset-alt'];
                    }
                    if (allattrs['link']) {
                        attrsJson['data-sys-asset-link'] = allattrs['link'];
                        delete attrsJson['link'];
                    }
                    if (allattrs['position']) {
                        attrsJson['data-sys-asset-position'] = allattrs['position'];
                        delete attrsJson['position'];
                    }
                    if (allattrs['target']) {
                        attrsJson['data-sys-asset-isnewtab'] = allattrs['target'] === "_blank";
                        delete attrsJson['target'];
                    }
                    if (!attrsJson['sys-style-type']) {
                        attrsJson['sys-style-type'] = String(allattrs['asset-type']).indexOf('image') > -1 ? 'display' : 'download';
                    }
                    delete attrsJson['display-type'];
                }
            }
            if (jsonValue['type'] === "style") {
                delete attrsJson['style-text'];
            }
            if ((options === null || options === void 0 ? void 0 : options.customElementTypes) && !(0, isEmpty_1.default)(options.customElementTypes) && options.customElementTypes[jsonValue['type']]) {
            }
            else {
                delete attrsJson['url'];
            }
            delete attrsJson['redactor-attributes'];
            Object.entries(attrsJson).forEach((key) => {
                return key[1] ? (key[1] !== '' ? (attrs += `${key[0]}="${key[1]}" `) : '') : '';
            });
            attrs = (attrs.trim() ? ' ' : '') + attrs.trim();
        }
        if (jsonValue['type'] === 'table') {
            let colWidths = jsonValue.attrs.colWidths;
            let totalWidth = colWidths.reduce((a, b) => a + b, 0);
            var setCol = new Set(colWidths);
            if (!(setCol.size === 1 && jsonValue.attrs.cols * setCol.values().next().value === totalWidth)) {
                let col = '';
                Array.from(colWidths).forEach((child, index) => (col += `<col style="width:${(colWidths[index] / totalWidth) * 100}%"/>`));
                let colgroup = `<colgroup data-width='${totalWidth}'>${col}</colgroup>`;
                children = colgroup + children;
            }
        }
        if (jsonValue['type'] === 'check-list') {
            attrs = `data-checked='${jsonValue.checked}' data-type='checked'`;
        }
        if (jsonValue['type'] === 'row') {
            attrs = `data-type='row' style="max-width:100%;display:flex;"`;
        }
        if (jsonValue['type'] === 'column') {
            const { width } = (jsonValue === null || jsonValue === void 0 ? void 0 : jsonValue.meta) || {};
            attrs = `data-type='column' width="${width}" style="flex-grow: 0;flex-shrink: 0;position: relative;width:${width * 100}%; margin: 0 0.25rem;"`;
        }
        if (jsonValue['type'] === 'grid-container') {
            const { gutter } = jsonValue.attrs;
            attrs = `data-type='grid-container' gutter="${gutter}" style="display: flex; width: 100%; gap: ${gutter}px"`;
        }
        if (jsonValue['type'] === 'grid-child') {
            const { gridRatio } = jsonValue.attrs;
            attrs = `data-type='grid-child' grid-ratio="${gridRatio}" style="flex: ${gridRatio}"`;
        }
        if (jsonValue['type'] === 'reference') {
            figureStyles.displayType = (_d = jsonValue === null || jsonValue === void 0 ? void 0 : jsonValue.attrs) === null || _d === void 0 ? void 0 : _d["display-type"];
        }
        if (jsonValue['type'] === 'span' && jsonValue.children.length === 1 && jsonValue.children[0].type === 'span') {
            if (Object.keys(jsonValue.attrs).length === 0) {
                return children;
            }
        }
        attrs = (attrs.trim() ? ' ' : '') + attrs.trim();
        return ELEMENT_TYPES[orgType || jsonValue['type']](attrs, children, jsonValue, figureStyles);
    }
    return children;
};
exports.toRedactor = toRedactor;
