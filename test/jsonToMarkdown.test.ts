import { jsonToMarkdownSerializer } from "../src/jsonToMarkdown"
import expectedMarkdown from "./expectedMarkdown"

describe("Testing json to markdown conversion", () => {
    for (const testCase of [...expectedMarkdown]) {
        it(testCase.title, () => {
            let jsonValue = testCase.json
            let markdownValue = jsonToMarkdownSerializer(jsonValue[0])
            expect(markdownValue).toEqual(testCase.markdown)
        })
    }
})