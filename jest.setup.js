const { TextDecoder, TextEncoder } = require("util");

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
