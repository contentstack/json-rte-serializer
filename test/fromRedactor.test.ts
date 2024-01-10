// @ts-nocheck
import { fromRedactor, getNestedValueIfAvailable } from "../src/fromRedactor"
import { JSDOM } from "jsdom"
import isEqual from "lodash.isequal"
import omitdeep from "omit-deep-lodash"
import expectedValue from "./expectedJson"

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
        const json = {"attrs": {}, "children": [{"attrs": {}, "children": [{"attrs": {"redactor-attributes": {"from": "Paul, Addy", "to": "[object Object]"}, "style": {}}, "children": [{"attrs": {"style": {}}, "text": "Hi There!"}], "type": "span", "uid": "uid"}], "type": "p", "uid": "uid"}], "type": "doc", "uid": "uid"};
  
        const dom = new JSDOM(html);
        let htmlDoc = dom.window.document.querySelector("body");
        const jsonValue = fromRedactor(htmlDoc);
        expect(jsonValue).toStrictEqual(json);
      });
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

function htmlToJson (html, options) {
    const dom = new JSDOM(html);
    let htmlDoc = dom.window.document.querySelector("body");
   return fromRedactor(htmlDoc, options);

}

test("test", () => {
   console.log("%j", htmlToJson(`<table></table>`))
})