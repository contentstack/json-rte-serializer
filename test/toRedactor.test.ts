import { toRedactor } from "../src/toRedactor"
import isEqual from "lodash.isequal"

import expectedValue from "./expectedJson"
import { imageAssetData } from "./testingData"
import exp from "constants"

describe("Testing json to html conversion", () => {
    it("heading conversion", () => {
        let jsonValue = expectedValue["2"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        expect(htmlValue).toBe(expectedValue['2'].html)
    })
    it("table conversion", () => {
        let jsonValue = expectedValue["3"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        expect(htmlValue).toBe(expectedValue['3'].html)
    })
    it("basic formating, block and code conversion", () => {
        let jsonValue = expectedValue["4"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        expect(htmlValue).toBe(expectedValue['4'].html)
    })
    it("List and alignment conversion", () => {
        let jsonValue = expectedValue["5"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        expect(htmlValue).toBe(expectedValue['5'].html)
    })
    it.each(["6", "RT-154"])("Image and iframe conversion", (index) => {
      let jsonValue = expectedValue[index].json
      let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
      expect(htmlValue).toBe(expectedValue[index].htmlUpdated)
    })
    it("Link ,divider and property conversion", () => {
        let jsonValue = expectedValue["7"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })

        expect(htmlValue).toBe(expectedValue['7'].html)
    })
    it("Embed entry as link", () => {
        let jsonValue = expectedValue["8"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })


        expect(htmlValue).toBe(expectedValue['8'].htmlUpdated)
    })
    it("Embedded entry as inline block", () => {
        let jsonValue = expectedValue["9"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        expect(htmlValue).toBe(expectedValue['9'].htmlUpdated)
    })
    it("Embedded entry as block", () => {
        let jsonValue = expectedValue["10"].json

        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        expect(htmlValue).toBe(expectedValue['10'].htmlValue)
    })
    it("Custom ELEMENT_TYPES",() => {
        let cases = ["15","16","18"]
        cases.forEach((index:any) => {
            let json = expectedValue[index]?.json
            let htmlValue = toRedactor({ type: "doc", attrs: {}, children: json },{customElementTypes:expectedValue[index].customElementTypes})
            //console.log(htmlValue)
            //console.log(expectedValue[index].html)
            expect(htmlValue).toBe(expectedValue[index].html)
        })
    })
    it("Custom TEXT_WRAPPER",() => {
        let cases = ["17"]
        cases.forEach((index:any) => {
            let json = expectedValue[index]?.json
            let htmlValue = toRedactor({ type: "doc", attrs: {}, children: json },{customTextWrapper:expectedValue[index].customTextWrapper})
            //console.log(htmlValue)
            //console.log(expectedValue[index].html)
            expect(htmlValue).toBe(expectedValue[index].html)
        })
    })
    it("Conversion with allowNonStandardTags", () => {
        let cases = ["19","20"]
        cases.forEach((index:any) => {
            const mockFunction = jest.fn();
            console.warn = mockFunction
            let json = expectedValue[index]?.json
            let htmlValue = toRedactor({ type: "doc", attrs: {}, children: json },{allowNonStandardTypes:true,customTextWrapper:expectedValue[index].customTextWrapper})
            expect(htmlValue).toBe(expectedValue[index].html)
            expect(mockFunction).toHaveBeenCalledTimes(expectedValue[index].nonStandardTags)

        })
    })
    it('"\n" to <br/> conversion', () => {
        let jsonValue = expectedValue["'\n' to <br>"].json
        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        expect(htmlValue).toBe(expectedValue["'\n' to <br>"].html)
    })

    it("Inline classname and id", () => {
        let jsonValue = expectedValue["inline-classname-and-id"].json
        let htmlValue = toRedactor({ type: "doc", attrs: {}, children: jsonValue })
        expect(htmlValue).toBe(expectedValue["inline-classname-and-id"].html)
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
      expect(htmlValue).toBe(expectedValue["fix_EB-745"].html)
    })

    test("RT-253 - should convert to proper HTML image code", () => {
      const json = {"type":"doc","attrs":{},"children":[{"type":"img","attrs":{"url":"***REMOVED***200","width":100},"children":[{"text":""}]}],"_version":3      }
      const html = toRedactor(json);
      expect(html).toBe('<img width="100" src="***REMOVED***200" />');
    });
    
    test("RT-264 - reference asset should have proper unit in the converted image", () => {
      const json = {"type":"doc","attrs":{},"uid":"6a547ebccbd74c0c9a521ee95acfb223","children":[{"uid":"942be31c040145b6a7541ec4f73754c5","type":"reference","attrs":{"display-type":"display","asset-uid":"bltcbce74d3891aaa9d","content-type-uid":"sys_assets","asset-link":"***REMOVED***200","asset-name":"MATHERAN.jpg","asset-type":"image/jpeg","type":"asset","class-name":"embedded-asset","width":"192","style":{"max-height":"144px","height":"144px","text-align":"right","max-width":"192px","width":"auto"},"redactor-attributes":{"height":"144","position":"right"},"max-height":"144","height":"144","position":"right","max-width":"192"},"children":[{"text":""}]}],"_version":1    }
      const html = toRedactor(json);
      expect(html).toBe(`<figure style="margin: 0; text-align: right"><img src="***REMOVED***200" height="144" class="embedded-asset" content-type-uid="sys_assets" type="asset" width="192" max-height="144" max-width="192" style="max-height: 144px; height: 144px; text-align: right; max-width: 192px; width: auto" data-sys-asset-filelink="***REMOVED***200" data-sys-asset-uid="bltcbce74d3891aaa9d" data-sys-asset-filename="MATHERAN.jpg" data-sys-asset-contenttype="image/jpeg" data-sys-asset-position="right" sys-style-type="display"/></figure>`);
    })

    test("RT-292", () => {
      const json = {"type":"doc","uid":"41870a48806348eb866c1944d37d3a5d","attrs":{},"children":[{"type":"img","attrs":{"url":"***REMOVED***536/354","style":{},"redactor-attributes":{"position":"none","caption":"caption","inline":"true","width":"243","dirty":"true","max-width":"243","src":"***REMOVED***536/354","alt":"alt","anchorLink":"link","target":true},"width":"217","inline":"true","caption":"caption","alt":"alt","anchorLink":"link","target":"_blank"},"uid":"bedc4931f5aa4fd59fd6411665f931e2","children":[{"text":""}]}]    }
      const html = toRedactor(json);
      expect(html).toBe(`<figure><a href="link" target="_blank"><img position="none" caption="caption" inline="true" width="217" dirty="true" max-width="243" src="***REMOVED***536/354" alt="alt" anchorLink="link" target="_blank" style="width: 217; height: auto;"/></a><figcaption>caption</figcaption></figure>`)
    })

    test("should have proper HTML for social-embeds", () => {
      const json = {"type":"doc","attrs":{},"uid":"18396bf67f1f4b0a9da57643ac0542ca","children":[{"uid":"45a850acbeb949db86afe415625ad1ce","type":"social-embeds","attrs":{"src":"https://www.***REMOVED***.com/embed/3V-Sq7_uHXQ","width":560,"height":320},"children":[{"text":""}]}],"_version":1    }
      const html = toRedactor(json);
      expect(html).toBe(`<iframe src="https://www.***REMOVED***.com/embed/3V-Sq7_uHXQ" width="560" height="320" data-type="social-embeds" ></iframe>`);
    })

    describe("RT-360", () =>{
      it("should encode and not render invalid src urls", () => {
        const json = expectedValue["RT-360"].json[0]
        const html = toRedactor(json);
        expect(html).toBe(expectedValue["RT-360"].html[0]);
      })

      it("should handle undefined or null cases",()=>{
        const json = expectedValue["RT-360"].json[1]
        const html = toRedactor(json);
        expect(html).toBe(expectedValue["RT-360"].html[1]);
      })

      it("should handle src urls without protocol",()=>{
        const json = expectedValue["RT-360"].json[2]
        const html = toRedactor(json);
        expect(html).toBe(expectedValue["RT-360"].html[2]);
      })

      it("should work only for valid embed urls",()=>{
        const json = expectedValue["RT-360"].json[3]
        const html = toRedactor(json);
        expect(html).toBe(expectedValue["RT-360"].html[3]);
      })

      it("should escape html entities in attribute values",()=>{
        const json = expectedValue["RT-360"].json[4]
        const html = toRedactor(json);
        expect(html).toBe(expectedValue["RT-360"].html[4]);
      })

      it("should drop invalid attribute names",()=>{
        const json = expectedValue["RT-360"].json[5]
        const html = toRedactor(json);
        expect(html).toBe(expectedValue["RT-360"].html[5]);
      })
    })

    test('should convert numeric width to string', () => {
      const json = {"type":"doc","uid":"0ebe9a3b835d413595885c44d9527b72","attrs":{},"children":[{"type":"img","attrs":{"style":{"text-align":"center"},"redactor-attributes":{"alt":"Infographic showing 3 results from Forrester study of Contentstack CMS: $3M increase in profit, $507.3K productivity savings and $2.0M savings due to reduced time to publish.","src":"https://images.contentstack.io/v3/assets/blt7359e2a55efae483/bltea2a11144a2c68b5/63c08b7f438f80612c397994/CS_Infographics_ForresterReport_Data_3_1200x628_(1).png","position":"center","width":641},"url":"https://images.contentstack.io/v3/assets/blt7359e2a55efae483/bltea2a11144a2c68b5/63c08b7f438f80612c397994/CS_Infographics_ForresterReport_Data_3_1200x628_(1).png","width":641},"uid":"15516d511e7a4e28b418e49bdba0464d","children":[{"text":""}]}]    }
    const html = toRedactor(json);
    expect(html).toBe(`<img alt="Infographic showing 3 results from Forrester study of Contentstack CMS: $3M increase in profit, $507.3K productivity savings and $2.0M savings due to reduced time to publish." src="https://images.contentstack.io/v3/assets/blt7359e2a55efae483/bltea2a11144a2c68b5/63c08b7f438f80612c397994/CS_Infographics_ForresterReport_Data_3_1200x628_(1).png" position="center" width="641" style="width: 641; height: auto;" />`)
    })

    test(' should retain empty string value for alt attribute', () => {
       const json = expectedValue['RT-268'].json;
       const html = toRedactor(json);
       expect(html).toBe(expectedValue['RT-268'].html);
    })
})

