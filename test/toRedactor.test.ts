import { toRedactor } from "../src/toRedactor"
import isEqual from "lodash.isequal"

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

    test("should convert rowspan and colspan tables to proper html", () => {
      
        const { html: expectedHtml, expectedJson: json } = {
          html: `<p></p><table style="text-align: center;"><colgroup data-width='444.99982'><col style="width:26.2921%"/><col style="width:24.494399999999995%"/><col style="width:25.617999999999995%"/><col style="width:23.5955%"/></colgroup><thead style="text-align: center;"><tr style="text-align: center;"><th colspan="4" style="text-align: center;">h1</th></tr></thead><tbody><tr><td rowspan="2" colspan="2">1</td><td colspan="2">2</td></tr><tr><td>3</td><td rowspan="4">4</td></tr><tr><td rowspan="3">5</td><td>6</td><td>7</td></tr><tr><td colspan="2">8</td></tr><tr><td>9</td><td>10</td></tr><tr><td>11</td><td>12</td><td>13</td><td>14</td></tr></tbody></table><p></p>`,
          expectedJson: [{ "type": "p", "attrs": {}, "uid": "uid", "children": [{ "text": "" }] }, { "type": "table", "attrs": { "style": { "text-align": "center" }, "redactor-attributes": { "style": "text-align: center;" }, "rows": 7, "cols": 4, "colWidths": [116.99979767422, 109.00003591007999, 114.00005388759998, 104.9999325281], "disabledCols": [0, 1, 2, 3] }, "uid": "uid", "children": [{ "type": "thead", "attrs": { "style": { "text-align": "center" }, "redactor-attributes": { "style": "text-align: center;" } }, "uid": "uid", "children": [{ "type": "tr", "attrs": { "style": { "text-align": "center" }, "redactor-attributes": { "style": "text-align: center;" } }, "uid": "uid", "children": [{ "type": "th", "attrs": { "colSpan": 4, "style": { "text-align": "center" }, "redactor-attributes": { "colspan": "4", "style": "text-align: center;" } }, "uid": "uid", "children": [{ "text": "h1" }] }, { "type": "th", "attrs": { "void": true }, "children": [{ "text": "" }] }, { "type": "th", "attrs": { "void": true }, "children": [{ "text": "" }] }, { "type": "th", "attrs": { "void": true }, "children": [{ "text": "" }] }] }] }, { "type": "tbody", "attrs": {}, "uid": "uid", "children": [{ "type": "trgrp", "children": [{ "type": "tr", "attrs": {}, "uid": "uid", "children": [{ "type": "td", "attrs": { "rowSpan": 2, "colSpan": 2, "redactor-attributes": { "rowspan": "2", "colspan": "2" } }, "uid": "uid", "children": [{ "text": "1" }] }, { "type": "td", "attrs": { "void": true }, "children": [{ "text": "" }] }, { "type": "td", "attrs": { "colSpan": 2, "redactor-attributes": { "colspan": "2" } }, "uid": "uid", "children": [{ "text": "2" }] }, { "type": "td", "attrs": { "void": true }, "children": [{ "text": "" }] }] }, { "type": "tr", "attrs": {}, "uid": "uid", "children": [{ "type": "td", "attrs": { "void": true }, "children": [{ "text": "" }] }, { "type": "td", "attrs": { "void": true }, "children": [{ "text": "" }] }, { "type": "td", "attrs": {}, "uid": "uid", "children": [{ "text": "3" }] }, { "type": "td", "attrs": { "rowSpan": 4, "redactor-attributes": { "rowspan": "4" } }, "uid": "uid", "children": [{ "text": "4" }] }] }, { "type": "tr", "attrs": {}, "uid": "uid", "children": [{ "type": "td", "attrs": { "rowSpan": 3, "redactor-attributes": { "rowspan": "3" } }, "uid": "uid", "children": [{ "text": "5" }] }, { "type": "td", "attrs": {}, "uid": "uid", "children": [{ "text": "6" }] }, { "type": "td", "attrs": {}, "uid": "uid", "children": [{ "text": "7" }] }, { "type": "td", "attrs": { "void": true }, "children": [{ "text": "" }] }] }, { "type": "tr", "attrs": {}, "uid": "uid", "children": [{ "type": "td", "attrs": { "void": true }, "children": [{ "text": "" }] }, { "type": "td", "attrs": { "colSpan": 2, "redactor-attributes": { "colspan": "2" } }, "uid": "uid", "children": [{ "text": "8" }] }, { "type": "td", "attrs": { "void": true }, "children": [{ "text": "" }] }, { "type": "td", "attrs": { "void": true }, "children": [{ "text": "" }] }] }, { "type": "tr", "attrs": {}, "uid": "uid", "children": [{ "type": "td", "attrs": { "void": true }, "children": [{ "text": "" }] }, { "type": "td", "attrs": {}, "uid": "uid", "children": [{ "text": "9" }] }, { "type": "td", "attrs": {}, "uid": "uid", "children": [{ "text": "10" }] }, { "type": "td", "attrs": { "void": true }, "children": [{ "text": "" }] }] }] }, { "type": "tr", "attrs": {}, "uid": "uid", "children": [{ "type": "td", "attrs": {}, "uid": "uid", "children": [{ "text": "11" }] }, { "type": "td", "attrs": {}, "uid": "uid", "children": [{ "text": "12" }] }, { "type": "td", "attrs": {}, "uid": "uid", "children": [{ "text": "13" }] }, { "type": "td", "attrs": {}, "uid": "uid", "children": [{ "text": "14" }] }] }] }] }, { "type": "p", "attrs": {}, "uid": "uid", "children": [{ "text": "" }] }]
        }
        const html = toRedactor({
          type: 'docs',
          children: json
        })
        expect(html).toStrictEqual(expectedHtml)
    })
    
    test("should not add duplicate <br/> when we have both break and \n together", () => {
      let jsonValue = expectedValue["fix_EB-745"].expectedJson

      let htmlValue = toRedactor(jsonValue)
      console.log("🚀 ~ test ~ htmlValue:", htmlValue)
      console.log(expectedValue["fix_EB-745"].html);
      
      let testResult = isEqual(htmlValue, expectedValue["fix_EB-745"].html)
      expect(testResult).toBe(true)
    })
    
})