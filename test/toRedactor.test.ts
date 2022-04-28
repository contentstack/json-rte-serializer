import { toRedactor } from "../src/toRedactor"
import { isEqual } from "lodash"

import expectedValue from "./expectedJson"

describe("Testing json to html conversion", () => {
    it("heading conversion", () => {
        let jsonValue = expectedValue["2"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        let testResult = isEqual(htmlValue, expectedValue['2'].html)
        expect(testResult).toBe(true)
    })
    it("table conversion", () => {
        let jsonValue = expectedValue["3"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        let testResult = isEqual(htmlValue, expectedValue['3'].html)
        expect(testResult).toBe(true)
    })
    it("basic formating, block and code conversion", () => {
        let jsonValue = expectedValue["4"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        let testResult = isEqual(htmlValue, expectedValue['4'].html)
        expect(testResult).toBe(true)
    })
    it("List and alignment conversion", () => {
        let jsonValue = expectedValue["5"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        let testResult = isEqual(htmlValue, expectedValue['5'].html)
        expect(testResult).toBe(true)
    })
    it("Image and iframe conversion", () => {
        let jsonValue = expectedValue["6"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        let testResult = isEqual(htmlValue, expectedValue['6'].htmlUpdated)
        expect(testResult).toBe(true)
    })
    it("Link ,divider and property conversion", () => {
        let jsonValue = expectedValue["7"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })

        let testResult = isEqual(htmlValue, expectedValue['7'].html)
        expect(testResult).toBe(true)
    })
    it("Embed entry as link", () => {
        let jsonValue = expectedValue["8"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })


        let testResult = isEqual(htmlValue, expectedValue['8'].htmlUpdated)
        expect(testResult).toBe(true)
    })
    it("Embedded entry as inline block", () => {
        let jsonValue = expectedValue["9"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        let testResult = isEqual(htmlValue, expectedValue['9'].htmlUpdated)
        expect(testResult).toBe(true)
    })
    it("Embedded entry as block", () => {
        let jsonValue = expectedValue["10"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        let testResult = isEqual(htmlValue, expectedValue['10'].htmlValue)
        expect(testResult).toBe(true)
    })
    it("Custom ELEMENT_TYPES",() => {
        let cases = ["15","16","18"]
        cases.forEach((index:any) => {
            let json = expectedValue[index]?.json
            let htmlValue = toRedactor({ type: "doc", attrs: {}, children: json },{customElementTypes:expectedValue[index].customElementTypes})
            //console.log(htmlValue)
            //console.log(expectedValue[index].html)
            let testResult = isEqual(htmlValue, expectedValue[index].html)
            expect(testResult).toBe(true)
        })
    })
    it("Custom TEXT_WRAPPER",() => {
        let cases = ["17"]
        cases.forEach((index:any) => {
            let json = expectedValue[index]?.json
            let htmlValue = toRedactor({ type: "doc", attrs: {}, children: json },{customTextWrapper:expectedValue[index].customTextWrapper})
            //console.log(htmlValue)
            //console.log(expectedValue[index].html)
            let testResult = isEqual(htmlValue, expectedValue[index].html)
            expect(testResult).toBe(true)
        })
    })
    it("Conversion with allowNonStandardTags", () => {
        let cases = ["19","20"]
        cases.forEach((index:any) => {
            const mockFunction = jest.fn();
            console.warn = mockFunction
            let json = expectedValue[index]?.json
            let htmlValue = toRedactor({ type: "doc", attrs: {}, children: json },{allowNonStandardTypes:true,customTextWrapper:expectedValue[index].customTextWrapper})
            let testResult = isEqual(htmlValue, expectedValue[index].html)
            if(!testResult){
                //console.log(htmlValue)
                //console.log(expectedValue[index].html)
            }
            expect(testResult).toBe(true)
            expect(mockFunction).toHaveBeenCalledTimes(expectedValue[index].nonStandardTags)

        })
    })
})