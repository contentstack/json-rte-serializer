# JSON RTE SERIALIZER
Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read more](https://www.contentstack.com/docs/).

This package helps the user convert JSON-based data of the JSON Rich Text Editor field to HTML format and vice versa.


## Installation

To get started with JavaScript, you will need the following:

* Node.js 10 or later

Install json-rte-serializer with npm

```bash
  npm install @contentstack/json-rte-serializer
```

## Usage/Examples

Convert value of the JSON RTE field into HTML format:

```javascript
import Component from 'my-project'
import { jsonToHtml } from "@contentstack/json-rte-serializer"
function App() {
    const htmlValue = jsonToHtml({ JSON Value})
    return <Component />
}
```

Convert HTML value of the Rich Text Editor field into JSON to support rendering of JSON RTE field data:

```javascript
import Component from 'my-project'
import { htmlToJson } from "@contentstack/json-rte-serializer"
function App() {
    const htmlDomBody = new DOMParser().parseFromString("<p>This is Html Value</p>", 'text/html').body
    const jsonValue = htmlToJson(htmlDomBody)
    return <Component />
}
```

Example of conversion:
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

```HTML
    <p>hello world</p>
```

### Documentation:
Please refer to our JSON Rich Text Editor [documentation](https://www.contentstack.com/docs/developers/create-content-types/json-rich-text-editor/) for more information.

### The MIT License (MIT)
