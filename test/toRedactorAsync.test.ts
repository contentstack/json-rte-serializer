import { toRedactorAsync } from "../src/toRedactorAsync"
import { toRedactor } from "../src/toRedactor"
import expectedValue from "./expectedJson"

describe("toRedactorAsync", () => {
    describe("parity with sync toRedactor", () => {
        it("heading conversion", async () => {
            let jsonValue = expectedValue["2"].json
            let htmlValue = await toRedactorAsync({ type: "doc", attrs: {}, children: jsonValue })
            expect(htmlValue).toBe(expectedValue['2'].html)
        })

        it("table conversion", async () => {
            let jsonValue = expectedValue["3"].json
            let htmlValue = await toRedactorAsync({ type: "doc", attrs: {}, children: jsonValue })
            expect(htmlValue).toBe(expectedValue['3'].html)
        })

        it("basic formatting, block and code conversion", async () => {
            let jsonValue = expectedValue["4"].json
            let htmlValue = await toRedactorAsync({ type: "doc", attrs: {}, children: jsonValue })
            expect(htmlValue).toBe(expectedValue['4'].html)
        })

        it("list and alignment conversion", async () => {
            let jsonValue = expectedValue["5"].json
            let htmlValue = await toRedactorAsync({ type: "doc", attrs: {}, children: jsonValue })
            expect(htmlValue).toBe(expectedValue['5'].html)
        })

        it("link, divider and property conversion", async () => {
            let jsonValue = expectedValue["7"].json
            let htmlValue = await toRedactorAsync({ type: "doc", attrs: {}, children: jsonValue })
            expect(htmlValue).toBe(expectedValue['7'].html)
        })

        it("custom ELEMENT_TYPES (sync handlers)", async () => {
            let cases = ["15", "16", "18"]
            for (const index of cases) {
                let json = expectedValue[index]?.json
                let htmlValue = await toRedactorAsync(
                    { type: "doc", attrs: {}, children: json },
                    { customElementTypes: expectedValue[index].customElementTypes },
                )
                expect(htmlValue).toBe(expectedValue[index].html)
            }
        })

        it("custom TEXT_WRAPPER", async () => {
            let cases = ["17"]
            for (const index of cases) {
                let json = expectedValue[index]?.json
                let htmlValue = await toRedactorAsync(
                    { type: "doc", attrs: {}, children: json },
                    { customTextWrapper: expectedValue[index].customTextWrapper },
                )
                expect(htmlValue).toBe(expectedValue[index].html)
            }
        })

        it("produces identical output to sync version for all standard test cases", async () => {
            const testCases = ["2", "3", "4", "5", "7"]
            for (const index of testCases) {
                const json = { type: "doc", attrs: {}, children: expectedValue[index].json }
                const syncHtml = toRedactor(json)
                const asyncHtml = await toRedactorAsync(json)
                expect(asyncHtml).toBe(syncHtml)
            }
        })
    })

    describe("async customElementTypes", () => {
        it("supports async element type handlers", async () => {
            const json = {
                type: "doc",
                attrs: {},
                children: [
                    {
                        type: "p",
                        attrs: {},
                        children: [{ text: "before" }],
                    },
                    {
                        type: "custom-widget",
                        attrs: { id: "widget-1" },
                        children: [{ text: "" }],
                    },
                    {
                        type: "p",
                        attrs: {},
                        children: [{ text: "after" }],
                    },
                ],
            }

            const htmlValue = await toRedactorAsync(json, {
                allowNonStandardTypes: true,
                customElementTypes: {
                    "custom-widget": async (attrs, child, jsonBlock) => {
                        // Simulate async operation (e.g. dynamic import, API call)
                        await new Promise((resolve) => setTimeout(resolve, 10))
                        return `<div class="widget" data-id="${jsonBlock.attrs.id}">loaded</div>`
                    },
                },
            })

            expect(htmlValue).toBe(
                '<p>before</p><div class="widget" data-id="widget-1">loaded</div><p>after</p>',
            )
        })

        it("supports mixed sync and async handlers", async () => {
            const json = {
                type: "doc",
                attrs: {},
                children: [
                    {
                        type: "sync-type",
                        attrs: {},
                        children: [{ text: "sync content" }],
                    },
                    {
                        type: "async-type",
                        attrs: {},
                        children: [{ text: "async content" }],
                    },
                ],
            }

            const htmlValue = await toRedactorAsync(json, {
                allowNonStandardTypes: true,
                customElementTypes: {
                    "sync-type": (attrs, child) => `<div class="sync">${child}</div>`,
                    "async-type": async (attrs, child) => {
                        await new Promise((resolve) => setTimeout(resolve, 10))
                        return `<div class="async">${child}</div>`
                    },
                },
            })

            expect(htmlValue).toBe(
                '<div class="sync">sync content</div><div class="async">async content</div>',
            )
        })

        it("resolves children before passing to async handler", async () => {
            const json = {
                type: "doc",
                attrs: {},
                children: [
                    {
                        type: "async-wrapper",
                        attrs: {},
                        children: [
                            {
                                type: "p",
                                attrs: {},
                                children: [{ text: "nested content" }],
                            },
                        ],
                    },
                ],
            }

            const htmlValue = await toRedactorAsync(json, {
                allowNonStandardTypes: true,
                customElementTypes: {
                    "async-wrapper": async (attrs, child) => {
                        // child should already be resolved HTML
                        expect(child).toBe("<p>nested content</p>")
                        await new Promise((resolve) => setTimeout(resolve, 10))
                        return `<section>${child}</section>`
                    },
                },
            })

            expect(htmlValue).toBe("<section><p>nested content</p></section>")
        })

        it("handles multiple concurrent async handlers", async () => {
            const json = {
                type: "doc",
                attrs: {},
                children: [
                    {
                        type: "async-a",
                        attrs: {},
                        children: [{ text: "" }],
                    },
                    {
                        type: "async-b",
                        attrs: {},
                        children: [{ text: "" }],
                    },
                    {
                        type: "async-c",
                        attrs: {},
                        children: [{ text: "" }],
                    },
                ],
            }

            const order: string[] = []

            const htmlValue = await toRedactorAsync(json, {
                allowNonStandardTypes: true,
                customElementTypes: {
                    "async-a": async () => {
                        await new Promise((resolve) => setTimeout(resolve, 30))
                        order.push("a")
                        return "<div>a</div>"
                    },
                    "async-b": async () => {
                        await new Promise((resolve) => setTimeout(resolve, 10))
                        order.push("b")
                        return "<div>b</div>"
                    },
                    "async-c": async () => {
                        await new Promise((resolve) => setTimeout(resolve, 20))
                        order.push("c")
                        return "<div>c</div>"
                    },
                },
            })

            // Output order should be correct regardless of resolution order
            expect(htmlValue).toBe("<div>a</div><div>b</div><div>c</div>")
            // Handlers should resolve concurrently (b finishes first)
            expect(order).toEqual(["b", "c", "a"])
        })

        it("propagates errors from async handlers", async () => {
            const json = {
                type: "doc",
                attrs: {},
                children: [
                    {
                        type: "failing-type",
                        attrs: {},
                        children: [{ text: "" }],
                    },
                ],
            }

            await expect(
                toRedactorAsync(json, {
                    allowNonStandardTypes: true,
                    customElementTypes: {
                        "failing-type": async () => {
                            throw new Error("Component failed to load")
                        },
                    },
                }),
            ).rejects.toThrow("Component failed to load")
        })
    })
})
