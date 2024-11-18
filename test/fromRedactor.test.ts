// @ts-nocheck
import { ELEMENT_TAGS, fromRedactor, getNestedValueIfAvailable } from "../src/fromRedactor"
import { JSDOM } from "jsdom"
import isEqual from "lodash.isequal"
import omitdeep from "omit-deep-lodash"
import expectedValue from "./expectedJson"
import { IHtmlToJsonOptions } from "../src/types"

const docWrapper = (children: any) => {
    return {
        "type": "doc",
        "attrs": {},
        children
    }
}
const compareValue = (json1,json2) => {
    return isEqual(JSON.stringify(omitdeep(json1, "uid")), JSON.stringify(omitdeep(docWrapper(json2), "uid")))
}

jest.mock('uuid', () => ({ v4: () => 'uid' }));
describe("Testing html to json conversion", () => {
    it("paragraph conversion", () => {
        let html = "<p>This is test</p>"
        const dom = new JSDOM(html)
        let htmlDoc = dom.window.document.querySelector('body')
        let jsonValue = fromRedactor(htmlDoc)
        let testResult = isEqual(omitdeep(jsonValue, "uid"), docWrapper([{ "attrs": {}, "children": [{ "text": "This is test" }], "type": "p" }]))
        expect(testResult).toBe(true)
    })

    it("heading conversion", () => {
        let html = expectedValue[2].html
        const dom = new JSDOM(html)
        let htmlDoc = dom.window.document.querySelector('body')
        let jsonValue = fromRedactor(htmlDoc)
        let testResult = isEqual(omitdeep(jsonValue, "uid"), omitdeep(docWrapper(expectedValue[2].json), "uid"))
        expect(testResult).toBe(true)
    })
    it("table conversion", () => {
        let html = expectedValue[3].html
        const dom = new JSDOM(html)
        let htmlDoc = dom.window.document.querySelector('body')
        let jsonValue = fromRedactor(htmlDoc)
        let testResult = isEqual(omitdeep(jsonValue, "uid"), omitdeep(docWrapper(expectedValue[3].json), "uid"))
        expect(testResult).toBe(true)
    })
    it("basic formating, block and code conversion", () => {
        let html = expectedValue[4].html
        const dom = new JSDOM(html)
        let htmlDoc = dom.window.document.querySelector('body')
        let jsonValue = fromRedactor(htmlDoc)
        let testResult = isEqual(omitdeep(jsonValue, "uid"), omitdeep(docWrapper(expectedValue[4].json), "uid"))
        expect(testResult).toBe(true)
    })
    it("List and alignment conversion", () => {
        let html = expectedValue[5].html
        const dom = new JSDOM(html)
        let htmlDoc = dom.window.document.querySelector('body')
        let jsonValue = fromRedactor(htmlDoc)
        let testResult = isEqual(omitdeep(jsonValue, "uid"), omitdeep(docWrapper(expectedValue[5].json), "uid"))
        expect(testResult).toBe(true)
    })
    it("Link ,divider and property conversion", () => {
        let html = expectedValue[7].html
        const dom = new JSDOM(html)
        let htmlDoc = dom.window.document.querySelector('body')
        let jsonValue = fromRedactor(htmlDoc)
        let testResult = isEqual(omitdeep(jsonValue, "uid"), omitdeep(docWrapper(expectedValue[7].json), "uid"))
        expect(testResult).toBe(true)
    })

    it("Embedded entry as link", () => {
        let html = expectedValue[8].html
        const dom = new JSDOM(html)
        let htmlDoc = dom.window.document.querySelector('body')
        let jsonValue = fromRedactor(htmlDoc)
        let testResult = isEqual(JSON.stringify(omitdeep(jsonValue, "uid"), null, 2), JSON.stringify(omitdeep(docWrapper(expectedValue[8].json), "uid"), null, 2))
        expect(testResult).toBe(true)
    })
    it("Embedded entry as inline block", () => {
        let html = expectedValue[9].html
        const dom = new JSDOM(html)
        let htmlDoc = dom.window.document.querySelector('body')
        let jsonValue = fromRedactor(htmlDoc)
        let testResult = isEqual(omitdeep(jsonValue, "uid"), omitdeep(docWrapper(expectedValue[9].json), "uid"))
        expect(testResult).toBe(true)
    })

    it("Embedded entry as block", () => {
        let html = expectedValue[10].html
        const dom = new JSDOM(html)
        let htmlDoc = dom.window.document.querySelector('body')

        let jsonValue = fromRedactor(htmlDoc)
        let testResult = isEqual(omitdeep(jsonValue, "uid"), omitdeep(docWrapper(expectedValue[10].json), "uid"))
        expect(testResult).toBe(true)
    })

    it("Basic Scenarios", () => {
        let cases = ["12","13", "14"]
        cases.forEach((index:any) => {
            let html = expectedValue[index]?.html
            const dom = new JSDOM(html)
            let htmlDoc = dom.window.document.querySelector('body')
            let jsonValue = fromRedactor(htmlDoc)
            //console.log(JSON.stringify(omitdeep(jsonValue.children, "uid"), null, 2))
            let testResult = compareValue(jsonValue,expectedValue[index].json)
            if(!testResult){
                //console.log(JSON.stringify(omitdeep(jsonValue, "uid")))
                //console.log(JSON.stringify(omitdeep(expectedValue[index].json, "uid")))
            }
            expect(testResult).toBe(true)
        })
    })
    it("Custom ELEMENT_TAGS",()=>{
        let cases = ["15","16","18"]
        cases.forEach((index:any) => {
            let html = expectedValue[index]?.html
            const dom = new JSDOM(html)
            let htmlDoc = dom.window.document.querySelector('body')
            let jsonValue = fromRedactor(htmlDoc,{customElementTags:expectedValue[index].customElementTags})
            //console.log(JSON.stringify(omitdeep(jsonValue.children, "uid"), null, 2))
            let testResult = compareValue(jsonValue,expectedValue[index].json)
            expect(testResult).toBe(true)
        })
    })
    it("Custom TEXT_TAGS",()=>{
        let cases = ["17"]
        cases.forEach((index:any) => {
            let html = expectedValue[index]?.html
            const dom = new JSDOM(html)
            let htmlDoc = dom.window.document.querySelector('body')
            let jsonValue = fromRedactor(htmlDoc,{customTextTags:expectedValue[index].customTextTags})
            //console.log(JSON.stringify(omitdeep(jsonValue.children, "uid"), null, 2))
            let testResult = compareValue(jsonValue,expectedValue[index].json)
            expect(testResult).toBe(true)
        })
    })
    it("Conversion with allowNonStandardTags", () => {
        let cases = ["19","20"]
        cases.forEach((index:any) => {
            const mockFunction = jest.fn();
            console.warn = mockFunction
            let html = expectedValue[index]?.html
            const dom = new JSDOM(html)
            let htmlDoc = dom.window.document.querySelector('body')
            let jsonValue = fromRedactor(htmlDoc,{allowNonStandardTags:true,customTextTags:expectedValue[index].customTextTags})
            let testResult = compareValue(jsonValue,expectedValue[index].json)
            if(!testResult){
                //console.log(JSON.stringify(omitdeep(jsonValue, "uid")))
                //console.log(JSON.stringify(omitdeep(expectedValue[index].json, "uid")))
            }
            expect(testResult).toBe(true)
            expect(mockFunction).toHaveBeenCalledTimes(expectedValue[index].nonStandardTags)
        })
    })

    it('Image conversion to image or reference', () => {
        let cases = ['image-to-image', "image-to-reference"]
        cases.forEach((index:any) => {
            const {json: expectedJson, html } =  expectedValue[index]
            
            const dom = new JSDOM(html)
            const json = fromRedactor(dom.window.document.querySelector('body'))
            expect(omitdeep(json, 'uid')).toStrictEqual(omitdeep(expectedJson, 'uid'))
        })
    })

    test("image, asset image should have caption", () => {
        let cases = ['image-caption', 'reference-caption']

        cases.forEach((index:any) => {
            const {json: expectedJson, html } =  expectedValue[index]
            
            const dom = new JSDOM(html)
            const json = fromRedactor(dom.window.document.querySelector('body'))
            expect(omitdeep(json, 'uid')).toStrictEqual(omitdeep(expectedJson, 'uid'))
        })
    })
    test("image and asset should maintain width with caption ", () => {
        let cases = ['image-caption-width', 'reference-caption-width']

        cases.forEach((index:any) => {
            const {json: expectedJson, html } =  expectedValue[index]
            
            const dom = new JSDOM(html)
            const json = fromRedactor(dom.window.document.querySelector('body'))
            expect(omitdeep(json, 'uid')).toStrictEqual(omitdeep(expectedJson, 'uid'))
        })
    })
    test("image and asset image should maintain position with caption", () => {
        let cases = ['image-caption-position', 'reference-caption-position']

        cases.forEach((index:any) => {
            const {json: expectedJson, html } =  expectedValue[index]
            
            const dom = new JSDOM(html)
            const json = fromRedactor(dom.window.document.querySelector('body'))
            expect(omitdeep(json, 'uid')).toStrictEqual(omitdeep(expectedJson, 'uid'))
        })
    })

    test("image and asset image as links should maintain caption, width, position along with link target", () => {
        let cases = ['anchor-image-width-position-caption', 'anchor-reference-width-position-caption']

        cases.forEach((index:any) => {
            const {json: expectedJson, html } =  expectedValue[index]
            
            const dom = new JSDOM(html)
            const json = fromRedactor(dom.window.document.querySelector('body'))
            expect(omitdeep(json, 'uid')).toStrictEqual(omitdeep(expectedJson, 'uid'))
        })
    })

    test("<br/> converted to '\n'", () => {
        let html = "<p>This is test for break element<br/>This is text on the next line.</p>"
        const dom = new JSDOM(html)
        let htmlDoc = dom.window.document.querySelector('body')
        let jsonValue = fromRedactor(htmlDoc)
        let testResult = isEqual(omitdeep(jsonValue, "uid", "separaterId") ,docWrapper([{ "attrs": {}, "children": [
            { text: 'This is test for break element' },
            {
              text: '\n',
              break: false
            },
            { text: 'This is text on the next line.' }
          ], "type": "p" }]))
        expect(testResult).toBe(true)
    })

    describe("Nested attrs", () =>{

    test("should convert stringified attrs to proper nested JSON attrs", () => {
      for (const testCase of expectedValue["nested-attrs"]) {
        const { json, html } = testCase;
        const dom = new JSDOM(html);
        let htmlDoc = dom.window.document.querySelector("body");
        const jsonValue = fromRedactor(htmlDoc, { allowNonStandardTags: true });
        expect(jsonValue).toStrictEqual(json);
      }
    });

    test("should not convert stringify attrs when `allowNonStandardTags` is not true", () => {
        const html = `<p><span from="Paul, Addy" to="[object Object]">Hi There!</span></p>`;
        const json = {"attrs": {}, "children": [{"attrs": {}, "children": [{"attrs": {"redactor-attributes": {"from": "Paul, Addy", "to": "[object Object]"}, "style": {}}, "children": [{"text": "Hi There!"}], "type": "span", "uid": "uid"}], "type": "p", "uid": "uid"}], "type": "doc", "uid": "uid"};
  
        const dom = new JSDOM(html);
        let htmlDoc = dom.window.document.querySelector("body");
        const jsonValue = fromRedactor(htmlDoc);
        expect(jsonValue).toStrictEqual(json);
      });
    })

    describe("SPAN", () => {
        
        test("should properly convert inline properties id and class to json", () => {
            let html =`<p dir="ltr">Hello <span class="class" id="id">World</span></p>`
            const json = htmlToJson(html)
            expect(json).toStrictEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"p","attrs":{"style":{},"redactor-attributes":{"dir":"ltr"}},"uid":"uid","children":[{"text":"Hello "},{"text":"World","id":"id","classname":"class"}]}]})
        })

        test("should skip span if other element are inline and it does not have any attributes", () => {
            let html =`<p dir="ltr">Hello <span>World</span></p>`
            const json = htmlToJson(html)
            expect(json).toStrictEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"p","attrs":{"style":{},"redactor-attributes":{"dir":"ltr"}},"uid":"uid","children":[{"text":"Hello "},{"text":"World"}]}]})
        })

        test("should not skip span if other element are inline and it does have any attribute", () => {
            let html =`<p dir="ltr">Hello <span data-test="test">World</span></p>`
            const json = htmlToJson(html)
            expect(json).toStrictEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"p","attrs":{"style":{},"redactor-attributes":{"dir":"ltr"}},"uid":"uid","children":[{"text":"Hello "},{"type":"span","attrs":{"style":{},"redactor-attributes":{"data-test":"test"}},"uid":"uid","children":[{"text":"World"}]}]}]})
        })

        test("should consider the non standard elements as inline if it has attribute of inline with the span tag", () => {
            let html = `<p><unknown inline="true"></unknown>Being an absolute <span>tropical</span> stunner</p>`
            let jsonValue = htmlToJson(html, { allowNonStandardTags: true })
            expect(jsonValue).toStrictEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"p","attrs":{},"uid":"uid","children":[{"type":"unknown","attrs":{"inline":"true"},"children":[{"text":""}]},{"text":"Being an absolute "},{"text":"tropical"},{"text":" stunner"}]}]            })
        })
    })

    test("should consider the non standard elements as inline if it has attribute of inline", () => {
        let html = `<p><unknown inline="true"></unknown>Being an absolute <a href="https://chess.com">tropical</a> stunner</p>`
        let jsonValue = htmlToJson(html, { allowNonStandardTags: true })
        expect(jsonValue).toStrictEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"p","attrs":{},"uid":"uid","children":[{"type":"unknown","attrs":{"inline":"true"},"children":[{"text":""}]},{"text":"Being an absolute "},{"type":"a","attrs":{"url":"https://chess.com","style":{},"redactor-attributes":{"href":"https://chess.com"}},"uid":"uid","children":[{"text":"tropical"}]},{"text":" stunner"}]}]        })
    })

    
    test("should convert asset to reference", () => {
          const html  = `<figure style="margin: 0; text-align: right">
          <div style="display: inline-block"><a href="ss.com" target="_blank"><img src="***REMOVED***200" height="141" alt="image_(9).png" caption="ss" anchorLink="ss.com" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="image_(9).png" width="148" max-height="141" max-width="148" style="max-height: 141px; height: 141px; text-align: right; max-width: 148px; width: auto" data-sys-asset-filelink="***REMOVED***200" data-sys-asset-uid="blt137d845621ef8168" data-sys-asset-filename="image_(9).png" data-sys-asset-contenttype="image/png" data-sys-asset-caption="ss" data-sys-asset-alt="image_(9).png" data-sys-asset-link="ss.com" data-sys-asset-position="right" data-sys-asset-isnewtab="true" sys-style-type="display" /></a>
            <figcaption style="text-align:center">ss</figcaption>
          </div>
        </figure>
        <p></p>`
        const json = htmlToJson(html)
        expect(json).toStrictEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"reference","attrs":{"style":{"text-align":"right"},"redactor-attributes":{"src":"***REMOVED***200","height":"141","alt":"image_(9).png","caption":"ss","type":"asset","asset-alt":"image_(9).png","max-height":"141","max-width":"148","sys-style-type":"display","position":"right","captionAttrs":{"style":"text-align:center"},"anchorLink":"ss.com","target":true,"asset-caption":"ss"},"class-name":"embedded-asset","width":148,"type":"asset","asset-caption":"ss","link":"ss.com","asset-alt":"image_(9).png","target":"_blank","position":"right","asset-link":"***REMOVED***200","asset-uid":"blt137d845621ef8168","display-type":"display","asset-name":"image_(9).png","asset-type":"image/png","content-type-uid":"sys_assets"},"uid":"uid","children":[{"text":""}]},{"type":"p","attrs":{},"uid":"uid","children":[{"text":""}]}]        })
    })
    test("should convert asset to reference with non standard tags", () => {
          const html  = `<figure style="margin: 0; text-align: right">
          <div style="display: inline-block"><a href="ss.com" target="_blank"><img src="***REMOVED***200" height="141" alt="image_(9).png" caption="ss" anchorLink="ss.com" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="image_(9).png" width="148" max-height="141" max-width="148" style="max-height: 141px; height: 141px; text-align: right; max-width: 148px; width: auto" data-sys-asset-filelink="***REMOVED***200" data-sys-asset-uid="blt137d845621ef8168" data-sys-asset-filename="image_(9).png" data-sys-asset-contenttype="image/png" data-sys-asset-caption="ss" data-sys-asset-alt="image_(9).png" data-sys-asset-link="ss.com" data-sys-asset-position="right" data-sys-asset-isnewtab="true" sys-style-type="display" /></a>
            <figcaption style="text-align:center">ss</figcaption>
          </div>
        </figure>
        <p></p>`
        const json = htmlToJson(html, { allowNonStandardTags: true })
        expect(json).toStrictEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"reference","attrs":{"style":{"text-align":"right"},"redactor-attributes":{"src":"***REMOVED***200","height":"141","alt":"image_(9).png","caption":"ss","type":"asset","asset-alt":"image_(9).png","max-height":"141","max-width":"148","sys-style-type":"display","position":"right","captionAttrs":{"style":"text-align:center"},"anchorLink":"ss.com","target":true,"asset-caption":"ss"},"class-name":"embedded-asset","width":148,"type":"asset","asset-caption":"ss","link":"ss.com","asset-alt":"image_(9).png","target":"_blank","position":"right","asset-link":"***REMOVED***200","asset-uid":"blt137d845621ef8168","display-type":"display","asset-name":"image_(9).png","asset-type":"image/png","content-type-uid":"sys_assets"},"uid":"uid","children":[{"text":""}]},{"type":"p","attrs":{},"uid":"uid","children":[{"text":""}]}]        })
    })
    test("should convert inline asset reference HTML to proper JSON", () => {
        let html = `<p></p><div style="overflow: hidden"><span><figure style="margin: 0; float: right"><img src="http://localhost:8001/v3/assets/blt77b66f7ca0622ce9/bltc1b32227100685b6/66c81798d5c529eebeabd447/image_(7).png" height="86" alt="image (7).png" inline="true" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="image (7).png" width="168" max-height="86" max-width="168" style="max-height: 86px; height: 86px; text-align: right; max-width: 168px; width: auto" data-sys-asset-filelink="http://localhost:8001/v3/assets/blt77b66f7ca0622ce9/bltc1b32227100685b6/66c81798d5c529eebeabd447/image_(7).png" data-sys-asset-uid="bltc1b32227100685b6" data-sys-asset-filename="image (7).png" data-sys-asset-contenttype="image/png" data-sys-asset-alt="image (7).png" data-sys-asset-position="right" sys-style-type="display"/></figure>dasdasdasdasdasdasddaasdasdasdas<br/>Hello<br/>World</span></div>`
        const json = htmlToJson(html)
        expect(json).toEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"p","attrs":{},"uid":"uid","children":[{"text":""}]},{"type":"p","attrs":{},"uid":"uid","children":[{"type":"reference","attrs":{"style":{"text-align":"right"},"redactor-attributes":{"src":"http://localhost:8001/v3/assets/blt77b66f7ca0622ce9/bltc1b32227100685b6/66c81798d5c529eebeabd447/image_(7).png","height":"86","alt":"image (7).png","type":"asset","asset-alt":"image (7).png","max-height":"86","max-width":"168","sys-style-type":"display","position":"right"},"class-name":"embedded-asset","width":168,"type":"asset","asset-alt":"image (7).png","position":"right","asset-link":"http://localhost:8001/v3/assets/blt77b66f7ca0622ce9/bltc1b32227100685b6/66c81798d5c529eebeabd447/image_(7).png","asset-uid":"bltc1b32227100685b6","display-type":"display","asset-name":"image (7).png","asset-type":"image/png","content-type-uid":"sys_assets","inline":true},"uid":"uid","children":[{"text":""}]},{"text":"dasdasdasdasdasdasddaasdasdasdas"},{"text":"\n","break":false,"separaterId":"uid"},{"text":"Hello"},{"text":"\n","break":false,"separaterId":"uid"},{"text":"World"}]}]})
    })
    test("should convert social embed to proper social embed json", () => {
        let html = `<iframe src="https://www.***REMOVED***.com/embed/3V-Sq7_uHXQ" data-type="social-embeds"></iframe>`
        const json = htmlToJson(html)
        expect(json).toEqual({ type: "doc", attrs: {}, uid: "uid", children:[{ type: "social-embeds", uid: 'uid', attrs: { src: "https://www.***REMOVED***.com/embed/3V-Sq7_uHXQ" }, children: [{ text: ""}] }]})
    })

    test("should replace all instances of <b> and <i> proper json marks", () => {
        const html = `<p><b>Hello</b><i>Test2</i><b>World</b></p>`
        const json = htmlToJson(html)
        expect(json).toStrictEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"p","attrs":{},"uid":"uid","children":[{"text":"Hello","attrs":{"style":{}},"bold":true},{"text":"Test2","attrs":{"style":{}},"italic":true},{"text":"World","attrs":{"style":{}},"bold":true}]}]})
    })

    test("should not add fragment for html containing a text tag and span tag", () => {
        const html = `<p><strong>Hello</strong><span> Hii</span></p>`
        const json = htmlToJson(html)
        expect(json).toStrictEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"p","attrs":{},"uid":"uid","children":[{"text":"Hello","attrs":{"style":{}},"bold":true},{"text":" Hii"}]}]})
    
    })
})


describe('getNestedValueIfAvailable', () => {

    it('should return the input value when it\'s not a string containing JSON', () => {
      expect(getNestedValueIfAvailable(10)).toBe(10);
      expect(getNestedValueIfAvailable(null)).toBeNull();
      expect(getNestedValueIfAvailable('{ "name": "John", "age": }')).toBe('{ "name": "John", "age": }');
      expect(getNestedValueIfAvailable({ "name": "John", "age": 30})).toStrictEqual({ "name": "John", "age": 30});
      expect(getNestedValueIfAvailable('[Object Object]')).toBe('[Object Object]');
    });

    it('should return the parsed JSON when the input value is a string containing JSON', () => {
      const value = '{ "name": "John", "age": 30 }';
      const result = getNestedValueIfAvailable(value);
      expect(result).toEqual({ name: "John", age: 30 });
    });

});
describe("CS-41001", () =>{
    test("should not add fragment for text nodes having white spaces", () => {
        const dom = new JSDOM();
        const document = dom.window.document;
        const body = document.createElement("body");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const tr = document.createElement("tr");
        const text = document.createTextNode(` `)
        td1.textContent = "Hello";
        td2.textContent = "World";
        tr.appendChild(td1);
        tr.append(text)
        tr.appendChild(td2);
        body.append(tr)
        const jsonValue = fromRedactor(body);
        expect(jsonValue).toStrictEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"tr","attrs":{},"uid":"uid","children":[{"type":"td","attrs":{},"uid":"uid","children":[{"text":"Hello"}]},{"type":"td","attrs":{},"uid":"uid","children":[{"text":"World"}]}]}]})
    })
    test("should add fragment for text nodes between block nodes", () => {
        const dom = new JSDOM();
        const document = dom.window.document;
        const body = document.createElement("body");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        const text = document.createTextNode(` beautiful `)
        p1.textContent = "Hello";
        p2.textContent = "World";
        body.appendChild(p1);
        body.append(text)
        body.appendChild(p2);
        const jsonValue = fromRedactor(body);
        expect(jsonValue).toStrictEqual({"type":"doc","uid":"uid","attrs":{},"children":[{"type":"p","attrs":{},"uid":"uid","children":[{"text":"Hello"}]},{"type":"fragment","attrs":{},"uid":"uid","children":[{"text":" beautiful "}]},{"type":"p","attrs":{},"uid":"uid","children":[{"text":"World"}]}]})
    })
    test("should convert video tag into embed", () => {
        expectedValue['video-tag'].forEach((testCase) => {
            const dom = new JSDOM(testCase.html);
            let htmlDoc = dom.window.document.querySelector("body");
            const jsonValue = fromRedactor(htmlDoc);
            expect(omitdeep(jsonValue, "uid")).toStrictEqual( omitdeep(testCase.json, "uid"))
        })
    })

    test('table JSON should have proper structure with rowspan and colspan', () => {
        const testCases = ['table-rowspan-colspan', 'table-rowspan-colspan-2', 'table-rowspan-colspan-3']
        testCases.forEach(testCase => {
          try {
            const { html, expectedJson } = expectedValue[testCase]
            const json = htmlToJson(html)
            expect(json).toStrictEqual(expectedJson)
          }
          catch (e) {
            throw new Error(`Test failed for ${testCase} - ${e}`)
          }
        })
      })
})

describe("ELEMENT_TAGS", () => {
    test("should have FIGCAPTION as a standard element tag", () => {
        const standardElementTags = Object.keys(ELEMENT_TAGS);
        expect(standardElementTags).toContain("FIGCAPTION");
    })
})

function htmlToJson (html: string, options: IHtmlToJsonOptions) {
    const dom = new JSDOM(html);
    let htmlDoc = dom.window.document.querySelector("body");
   return fromRedactor(htmlDoc, options);

}

