import { fromRedactor } from "../src/fromRedactor"
import { JSDOM } from "jsdom"
import { isEqual } from "lodash"
import omitdeep from "omit-deep-lodash"
import expectedValue from "./expectedJson.json"

const docWrapper = (children: any) => {
    return {
        "type": "doc",
        "attrs": {},
        children
    }
}
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
    it("Image and iframe conversion", () => {
        let html = expectedValue[6].html
        const dom = new JSDOM(html)
        let htmlDoc = dom.window.document.querySelector('body')
        let jsonValue = fromRedactor(htmlDoc)
        let testResult = isEqual(omitdeep(jsonValue, "uid"), omitdeep(docWrapper(expectedValue[6].json), "uid"))
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


})