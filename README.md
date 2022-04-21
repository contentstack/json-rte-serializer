# JSON RTE SERIALIZER

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read more](https://www.contentstack.com/docs/).

This package helps the user convert of the JSON Rich Text Editor field to HTML format and vice versa.

# Installation

To get started with JavaScript, you will need the following:

-   Node.js 10 or later

Install json-rte-serializer with npm

```bash
  npm install @contentstack/json-rte-serializer
```

# Usage/Examples

## Standard conversion

### JSON to HTML

```javascript
import Component from "my-project";
import { jsonToHtml } from "@contentstack/json-rte-serializer";

const htmlValue = jsonToHtml({
    type: "doc",
    attrs: {},
    uid: "547a479c68824767ce1d9725852f042b",
    children: [
        {
            uid: "767a479c6882471d9725852f042b67ce",
            type: "p",
            attrs: {},
            children: [{ text: "This is Html Value" }],
        },
    ],
});

console.log(htmlValue);
```

Result of conversion

```HTML
<p>hello world</p>
```

### HTML to JSON

```javascript
import Component from "my-project";
import { htmlToJson } from "@contentstack/json-rte-serializer";
const htmlDomBody = new DOMParser().parseFromString(
    "<p>This is Html Value</p>",
    "text/html"
).body;
const jsonValue = htmlToJson(htmlDomBody);

console.log(jsonValue);
```

Result of conversion:

```JSON
{
    "type":"doc",
    "attrs":{},
    "uid":"547a479c68824767ce1d9725852f042b",
    "children":[{
        "uid":"767a479c6882471d9725852f042b67ce",
        "type": "p",
        "attrs":{},
        "children" : [{"text": "This is Html Value"}]
    }]
}
```

## Custom conversion

We can pass an optional options field to manipulate the working of the serializer.

### Converting JSON to HTML

We can pass the the custom parser that will execute for mentioned json-type. The `customElementTypes` will parse the block level elements while `customTextWrapper` will parse the inline elements. These options would take an object whose keys are the type of the element and the value is a parser function that will be executed for that type.

The parser function would provide the following arguments:
`attrs`: The attributes that are passed to the node.
`child`: The Nested elements of the current node.
`jsonBlock`: The entire JSON object which is currently being parsed.

```javascript
import Component from "my-project";
import { jsonToHtml } from "@contentstack/json-rte-serializer";
const jsonValue = {
    type: "doc",
    uid: "cfe8176d1ca04cc0b42f60b3047f611d",
    attrs: {},
    children: [
        {
            type: "p",
            attrs: {},
            uid: "6eae3c5bd7624bf39966c855543d954b",
            children: [
                {
                    type: "social-embed",
                    attrs: {
                        url: "https://twitter.com/Contentstack/status/1508911909038436365?cxt=HHwWmsC9-d_Y3fApAAAA",
                        style: {},
                        "redactor-attributes": {
                            url: "https://twitter.com/Contentstack/status/1508911909038436365?cxt=HHwWmsC9-d_Y3fApAAAA",
                        },
                    },
                    uid: "8d8482d852b84822a9b66e55ffd0e57c",
                    children: [{ text: "" }],
                },
            ],
        },
        {
            type: "p",
            attrs: {},
            uid: "54a7340da87846dda28aaf622069559a",
            children: [
                { text: "This " },
                { text: "is", attrs: { style: {} }, color: "red" },
                { text: " test" },
            ],
        },
    ],
};
const htmlValue = jsonToHtml(
    jsonValue,
    // parser options
    {
        customElement: {
            "social-embed": (attrs, child, jsonBlock) => {
                return `<social-embed${attrs}>${child}</social-embed>`;
            },
        },
        customTextWrapper: {
            "color": (child, value) => {
                return `<color data-color="${value}">${child}</color>`;
            },
        },
    }
);

console.log(htmlValue);
```

> NOTE: the custom parser's key must match exactly with the json-type. This includes the case of the text.

Result of conversion:

```HTML
<p><social-embed url="https://twitter.com/Contentstack/status/1508911909038436365?cxt=HHwWmsC9-d_Y3fApAAAA"></social-embed></p><p>This <color data-color="red">is</color> <wrapper>test</wrapper></p>
```

### Converting HTML to JSON:

We can pass the custom parser that will execute for mentioned html-type. The `customElementTags` will parse the block level elements while `customTextTags` will parse the inline elements. These functions would take an object whose keys are the type of the element and the value is a parser function that will be executed for that type.

The parser function would provide the following arguments:
`el`: Rhe reference to the element of the HTML Node.

```javascript
import Component from "my-project";
import { htmlToJson } from "@contentstack/json-rte-serializer";
const htmlDomBody = new DOMParser().parseFromString(
    `<p><social-embed url="https://twitter.com/Contentstack/status/1508911909038436365?cxt=HHwWmsC9-d_Y3fApAAAA"></social-embed></p><p>This <color data-color="red">is</color> test</p>`,
    "text/html"
).body;
const jsonValue = htmlToJson(htmlDomBody, {
    customElementTags: {
        "SOCIAL-EMBED": (el) => ({
            type: "social-embed",
            attrs: {
                url: el.getAttribute("url") || null,
            },
        }),
    },
    customTextTags: {
        "COLOR": (el) => {
            return {
                color: el.getAttribute("data-color"),
            };
        },
    },
});

console.log(jsonValue);
```

> NOTE: the custom parser's key must be capitalized and match the custom HTML tag.

Result of conversion

```JSON
{
    "type": "doc",
    "uid": "cfe8176d1ca04cc0b42f60b3047f611d",
    "attrs": {},
    "children": [
        {
            "type": "p",
            "attrs": {},
            "uid": "6eae3c5bd7624bf39966c855543d954b",
            "children": [
                {
                    "type": "social-embed",
                    "attrs": {
                        "url": "https://twitter.com/Contentstack/status/1508911909038436365?cxt=HHwWmsC9-d_Y3fApAAAA",
                        "style": {},
                        "redactor-attributes": {
                            "url": "https://twitter.com/Contentstack/status/1508911909038436365?cxt=HHwWmsC9-d_Y3fApAAAA"
                        }
                    },
                    "uid": "8d8482d852b84822a9b66e55ffd0e57c",
                    "children": [
                        {
                            "text": ""
                        }
                    ]
                }
            ]
        },
        {
            "type": "p",
            "attrs": {},
            "uid": "54a7340da87846dda28aaf622069559a",
            "children": [
                {
                    "text": "This "
                },
                {
                    "text": "is",
                    "attrs": {
                        "style": {}
                    },
                    "color": "red"
                },
                {
                    "text": " test"
                }
            ]
        }
    ]
}

```

## Documentation:

Please refer to our JSON Rich Text Editor [documentation](https://www.contentstack.com/docs/developers/create-content-types/json-rich-text-editor/) for more information.

## License

This project uses MIT license. Refer to the [LICENSE](LICENSE) file for more information.
