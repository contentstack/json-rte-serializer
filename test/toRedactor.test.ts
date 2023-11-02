import { toRedactor } from "../src/toRedactor"
import { isEqual } from "lodash"

import expectedValue from "./expectedJson"
import { imageAssetData } from "./testingData"

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
    it('"\n" to <br/> conversion', () => {
        let jsonValue = expectedValue["'\n' to <br>"].json
        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        let testResult = isEqual(htmlValue, expectedValue["'\n' to <br>"].html)
        expect(testResult).toBe(true)
    })

    it("Inline classname and id", () => {
        let jsonValue = expectedValue["inline-classname-and-id"].json
        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        let testResult = isEqual(htmlValue, expectedValue["inline-classname-and-id"].html)
        expect(testResult).toBe(true)
    })

    describe("Nested attrs", () => {

        test("should have stringified attrs for nested json", () => {
            for (const testCase of expectedValue["nested-attrs"]) {
                const { json, html } = testCase;
                const htmlValue = toRedactor(json, { allowNonStandardTypes: true });
                expect(htmlValue).toBe(html);
            }
        });

        test("should not convert to stringify attrs when `allowNonStandardTypes` is not true", () => {
          const html = `This is HTML-formatted content.`
          const json = {"type":"doc","attrs":{}, "children":[{"type":"aprimo","attrs":{ nestedAttrs: { "k1" : "v1"} },"children":[{"text":"This is HTML-formatted content."}]}]};

          const htmlValue = toRedactor(json);
          expect(htmlValue).toBe(html);
        });
    })
    describe("Image Type Asset", () => {
      describe("Block", () => {
        let f = "";
        it("should convert to <figure><img/></figure> (base case)", () => {
          const { value, expectedHtml } = imageAssetData["base"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure><img alt/></figure> (alt)", () => {
          const { value, expectedHtml } = imageAssetData["alt"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure><img/><figcaption/></figure> (caption)", () => {
          const { value, expectedHtml } = imageAssetData["caption"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure style><img/></figure> (alignment)", () => {
          const { value, expectedHtml } = imageAssetData["alignment"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure><a><img/></a></figure> (anchor)", () => {
          const { value, expectedHtml } = imageAssetData["anchor"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure><a target><img/></a></figure> (anchor and target)", () => {
          const { value, expectedHtml } = imageAssetData["anchor-target"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure><a target><img alt/></a></figure> (anchor alignment target alt caption)", () => {
          const { value, expectedHtml } =
            imageAssetData["anchor-alignment-target-alt-caption"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
      });
  
      describe("Inline", () => {
        it("should convert to <figure><img/></figure> (base case)", () => {
          const { value, expectedHtml } = imageAssetData["inline-base"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure><img alt/></figure> (alt)", () => {
          const { value, expectedHtml } = imageAssetData["inline-alt"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure><img/><figcaption/></figure> (caption)", () => {
          const { value, expectedHtml } = imageAssetData["inline-caption"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure style><img/></figure> (alignment)", () => {
          const { value, expectedHtml } = imageAssetData["inline-alignment"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure><a><img/></a></figure> (anchor)", () => {
          const { value, expectedHtml } = imageAssetData["inline-anchor"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure><a target><img/></a></figure> (anchor and target)", () => {
          const { value, expectedHtml } = imageAssetData["inline-anchor-target"];
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
        it("should convert to <figure><a target><img alt/></a></figure> (anchor alignment target alt caption)", () => {
          const { value, expectedHtml } =
            imageAssetData["inline-anchor-alignment-target-alt-caption"];
  
          const html = toRedactor(value);
          expect(html).toBe(expectedHtml);
        });
      });
    });
})