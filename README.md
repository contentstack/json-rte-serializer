# JSON RTE Serializer

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read more](https://www.contentstack.com/docs/).

The JSON RTE Serializer package helps you convert the data inside your JSON Rich Text Editor field from JSON to HTML format and vice versa.

# Installation

To use JSON RTE Serializer with Node.js-based applications, you will need the following prerequisites:

-   Node.js 10 or later

Install the json-rte-serializer package via npm using the following command:

```bash
  npm install @contentstack/json-rte-serializer
```

# Use Cases for JSON RTE Serializer

Let's look at a few code samples that display how we can convert data present in JSON format to HTML and vice versa.

## Standard Conversion

For standard conversion scenarios, JSON RTE Serializer supports only the standard tags available in the JSON Rich Text Editor field. To use custom tags of your own, you can follow the [Custom Conversion](#custom-conversion) examples provided below.

### JSON to HTML Conversion Code

You can use the following JSON RTE Serializer code to convert your JSON RTE field data into HTML format.

```javascript
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
            children: [{ text: "This is HTML-formatted content." }],
        },
    ],
});

console.log(htmlValue);
```

### Result of Conversion

The resulting HTML data will look as follows:

```HTML
<p>This is HTML-formatted content.</p>
```

### HTML to JSON Conversion Code

You can use the following JSON RTE Serializer code to convert HTML field data into JSON format.

```javascript
import { htmlToJson } from "@contentstack/json-rte-serializer";
const htmlDomBody = new DOMParser().parseFromString(
    "<p>This is HTML-formatted content.</p>",
    "text/html"
).body;
const jsonValue = htmlToJson(htmlDomBody);

console.log(jsonValue);
```

### Result of Conversion

The resulting JSON-formatted data will look as follows:

```JSON
{
    "type":"doc",
    "attrs":{},
    "uid":"547a479c68824767ce1d9725852f042b",
    "children":[{
        "uid":"767a479c6882471d9725852f042b67ce",
        "type": "p",
        "attrs":{},
        "children" : [{"text": "This is HTML-formatted content."}]
    }]
}
```

## Custom Conversion

For customized conversion scenarios, you can customize your JSON RTE Serializer code to allow the support for additional tags or element types in the JSON Rich Text Editor field. Pass an `options` field (optional) within the `jsonToHtml` or `htmlToJson` method to manipulate the working of the JSON RTE Serializer package as per your requirements.

### Convert JSON to HTML

You can pass a custom parser method that will convert data for the mentioned JSON element type (e.g., social embed) to HTML format. Within the parsed options, the `customElementTypes` object parses block-level and inline elements (e.g., info panel), while the `customTextWrapper` object parses text formatting elements (e.g., bold, italics, font color, etc.). These options would take an object whose keys are types of elements and values are the parser functions that will be executed for that type.

The `customElementTypes` parser function provides the following arguments:

-   `attrs`: The attributes that are passed against the node
-   `child`: The nested elements of the current node
-   `jsonBlock`: The entire JSON object that is currently being parsed

On the other hand, the `customTextWrapper` parser function provides the following arguments:

-   `child`: The HTML string that specifies the child element
-   `value`: The value passed against the child element

You can use the following customized JSON RTE Serializer code to convert your JSON RTE field data into HTML format.

```javascript
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
                { text: " text." },
            ],
        },
    ],
};
const htmlValue = jsonToHtml(
    jsonValue,
    // parser options
    {
        customElementTypes: {
            "social-embed": (attrs, child, jsonBlock) => {
                return `<social-embed${attrs}>${child}</social-embed>`;
            },
        },
        customTextWrapper: {
            color: (child, value) => {
                return `<color data-color="${value}">${child}</color>`;
            },
        },
    }
);

console.log(htmlValue);
```

**Note**: The specified custom parser's key must exactly match the element type. This includes the casing of the text.

### Result of Conversion

The resulting HTML data will look as follows:

```HTML
<p><social-embed url="https://twitter.com/Contentstack/status/1508911909038436365?cxt=HHwWmsC9-d_Y3fApAAAA"></social-embed></p><p>This <color data-color="red">is</color> text.</p>
```

### Convert HTML to JSON

You can pass a custom parser method that will convert data for the mentioned HTML element type (e.g., `<social-embed>`) to JSON format. Within the parsed options, the `customElementTags` object parses block-level and inline elements (e.g., info panel), while the `customTextTags` object parses text formatting elements (e.g., bold, italics, font color, etc.). These options would take an object whose keys are types of elements and values are the parser functions that will be executed for that type.

The parser function provides the `el` argument that references the element of the HTML node.

You can use the following customized JSON RTE Serializer code to convert your HTML RTE field data into JSON format.

```javascript
import Component from "my-project";
import { htmlToJson } from "@contentstack/json-rte-serializer";
const htmlDomBody = new DOMParser().parseFromString(
    `<p><social-embed url="https://twitter.com/Contentstack/status/1508911909038436365?cxt=HHwWmsC9-d_Y3fApAAAA"></social-embed></p><p>This <color data-color="red">is</color> text.</p>`,
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
        COLOR: (el) => {
            return {
                color: el.getAttribute("data-color"),
            };
        },
    },
});

console.log(jsonValue);
```

**Note**: The custom parser's key must always be capitalized and exactly match the custom HTML tag.

### Result of conversion

The resulting JSON-formatted data will look as follows:

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
                    "text": " text."
                }
            ]
        }
    ]
}
```

# Documentation

Refer to our [JSON Rich Text Editor](https://www.contentstack.com/docs/developers/json-rich-text-editor/) documentation for more information.

# License

This project uses an MIT license. Refer to the [LICENSE](LICENSE) file for more information.
