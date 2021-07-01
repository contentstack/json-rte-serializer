# JSON RTE SERIALIZER
Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. Read More.

This package helps the user convert JSON-based data of the JSON Rich Text Editor field to HTML format and vice versa.


## Installation

To get started with JavaScript, you will need the following:

* Node.js 10 or later

Install json-rte-serializer with npm

```bash
  npm install json-rte-serializer
```

## Usage/Examples

Convert value of the JSON RTE field into HTML format:

```javascript
import Component from 'my-project'
import { jsonToHtml } from "json-rte-serializer"
function App() {
    const htmlValue = jsonToHtml({ JSON Value})
    return <Component />
}
```

Convert HTML value of the Rich Text Editor field into JSON to support rendering of JSON RTE field data:

```javascript
import Component from 'my-project'
import { htmlToJson } from "json-rte-serializer"
function App() {
    const htmlDomBody = new DOMParser().parseFromString("<p>This is Html Value</p>", 'text/html').body
    const jsonValue = htmlToJson(htmlDomBody)
    return <Component />
}
```

Example of conversion:
```JSON
    {
        "uid":"767a479c6882471d9725852f042b67ce",
        "type": "p",
        "attrs":{},
        "children" : [{"text": "hello world"}]
    }
```

```HTML
    <p>hello world</p>
```

### The MIT License (MIT)

Copyright © 2021 [Contentstack](https://www.contentstack.com/). All Rights Reserved

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.