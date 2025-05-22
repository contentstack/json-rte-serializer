export default [
    {
        "title": "Inline Element Conversion",
        "json": [{
            "type": "doc",
            "attrs": {},
            "uid": "08560d5073684e608977ef6d332cf02d",
            "children": [{
                "type": "p",
                "attrs": {},
                "uid": "c914a0768a1e4ade85f3a9a3aa74d962",
                "children": [
                    {
                        "text": "Hello world this is a good day. I have some "
                    },
                    {
                        "text": "Bold",
                        "bold": true
                    },
                    {
                        "text": " text, some "
                    },
                    {
                        "text": "Italic",
                        "italic": true
                    },
                    {
                        "text": " text, some "
                    },
                    {
                        "text": "underlined",
                        "underline": true
                    },
                    {
                        "text": " text."
                    }
                ]
            },
            {
                "uid": "1fc3e96a71a94d56824997623d078835",
                "type": "p",
                "children": [
                    {
                        "text": "Also, I have "
                    },
                    {
                        "text": "sup",
                        "superscript": true
                    },
                    {
                        "text": "superscript, "
                    },
                    {
                        "text": "sub",
                        "subscript": true
                    },
                    {
                        "text": "subscript and a line break\nand after a linebreak, we have a "
                    },
                    {
                        "text": "strikethrough",
                        "strikethrough": true
                    },
                    {
                        "text": "."
                    }
                ],
                "attrs": {}
            },
            {
                "uid": "5ead7fa9afe6497098827eda3a9f3667",
                "type": "p",
                "children": [
                    {
                        "text": "This is a paragraph with "
                    },
                    {
                        "text": "inline code",
                        "inlineCode": true
                    },
                    {
                        "text": "."
                    }
                ],
                "attrs": {}
            }]
        }],
        "markdown": `
    
Hello world this is a good day. I have some **Bold** text, some *Italic* text, some underlined text.
    
Also, I have supsuperscript, subsubscript and a line break<br/>and after a linebreak, we have a ~~strikethrough~~.
    
This is a paragraph with \`inline code\`.`

    },
    {
        "title": "Heading Conversion",
        "json": [{
            "type": "doc",
            "attrs": {},
            "uid": "08560d5073684e608977ef6d332cf02d",
            "children": [ {
                "uid": "cdfd3344c6314ee3835a7e6c5617de50",
                "type": "h1",
                "children": [
                    {
                        "text": "Heading 1"
                    }
                ],
                "attrs": {}
            },
            {
                "uid": "32e6564f1b1d41328698cb57b1bf47ed",
                "type": "h2",
                "children": [
                    {
                        "text": "Heading 2"
                    }
                ],
                "attrs": {}
            },
            {
                "uid": "984f55b404254e5d9ee08b67a9b63cc4",
                "type": "h3",
                "children": [
                    {
                        "text": "Heading 3"
                    }
                ],
                "attrs": {}
            },
            {
                "uid": "53d56e38f5e04bcf894b6544e82d1df2",
                "type": "h4",
                "children": [
                    {
                        "text": "Heading 4"
                    }
                ],
                "attrs": {}
            },
            {
                "uid": "31264ba132284ae189b70aa18db7a6d4",
                "type": "h5",
                "children": [
                    {
                        "text": "Heading 5"
                    }
                ],
                "attrs": {}
            },
            {
                "uid": "c0a6defec7c14978b6f9da2400a5beba",
                "type": "h6",
                "children": [
                    {
                        "text": "Heading 6"
                    }
                ],
                "attrs": {}
            }]
        }],
        "markdown": `

# Heading 1 #

## Heading 2 ##

### Heading 3 ###

#### Heading 4 ####
    
##### Heading 5 #####
    
###### Heading 6 ######`
}, 
{
    "title": "Block Quote Conversion",
    "json": [{
        "type": "doc",
        "attrs": {},
        "uid": "08560d5073684e608977ef6d332cf02d",
        "children": [{
            "uid": "ed1bb8de67eb437da903bae0aa9242b5",
            "type": "blockquote",
            "children": [
                {
                    "text": "Block Quote"
                }
            ],
            "attrs": {}
        }]
    }],
    "markdown": `

> Block Quote`
},
{
    "title": "Code Block Conversion",
    "json": [{
        "type": "doc",
        "attrs": {},
        "uid": "08560d5073684e608977ef6d332cf02d",
        "children": [{
            "uid": "303de6b72d994df99e396abc1f87d3c0",
            "type": "code",
            "children": [
                {
                    "text": "Code Block"
                }
            ],
            "attrs": {
                "language": "html"
            }
        }]
    }],
    "markdown": `
    
    Code Block    `
}, 
{
    "title": "Divider Conversion",
    "json": [{
        "type": "doc",
        "attrs": {},
        "uid": "08560d5073684e608977ef6d332cf02d",
        "children": [
        {
            "uid": "f4b1d34cdd3a46519844232052f3aad6",
            "type": "hr",
            "children": [
                {
                    "text": ""
                }
            ],
            "attrs": {}
        }]
    }],
    "markdown": `
  
----------`
}, 
{
    "title": "Reference Conversion",
    "json": [ {
        "uid": "6e24d3bb8d5f43e7ba1aef4faba22986",
        "type": "p",
        "attrs": {},
        "children": [
            {
                "text": ""
            },
            {
                "uid": "9d496b31bfa64f0fbf4beb9859bef8de",
                "type": "reference",
                "attrs": {
                    "display-type": "display",
                    "asset-uid": "blt3108327519cf8663",
                    "content-type-uid": "sys_assets",
                    "asset-link": "./image.jpeg",
                    "asset-name": "test-base-64.jpeg",
                    "asset-type": "image/jpeg",
                    "type": "asset",
                    "class-name": "embedded-asset",
                    "alt": "test-base-64.jpeg",
                    "asset-alt": "test-base-64.jpeg",
                    "inline": true,
                    "redactor-attributes": {
                        "alt": "test-base-64.jpeg",
                        "position": "none",
                        "inline": true
                    },
                    "style": {},
                    "position": "none"
                },
                "children": [
                    {
                        "text": ""
                    }
                ]
            },
            {
                "text": ""
            }
        ]
    }],
    "markdown": `
    

      
![test-base-64.jpeg]
(./image.jpeg)`
}, 
{
    "title": "Anchor Link Conversion",
    "json": [{
        "type": "doc",
        "attrs": {},
        "uid": "08560d5073684e608977ef6d332cf02d",
        "children": [
            {
                "uid": "00ee249466604fe3bc1e9bc9c360c0c9",
                "type": "p",
                "children": [
                    {
                        "text": "Some Paragraph and adding a "
                    },
                    {
                        "uid": "2aef414d0d5d49038d472c2e59660941",
                        "type": "a",
                        "attrs": {
                            "url": "www.google.com",
                            "target": "_self"
                        },
                        "children": [
                            {
                                "text": "link"
                            }
                        ]
                    },
                    {
                        "text": " in the middle."
                    }
                ],
                "attrs": {}
            }]
    }],
    "markdown": `
    
Some Paragraph and adding a [link](www.google.com) in the middle.`
}, 
{
    "title": "Asset as Link Conversion",
    "json": [{
        "type": "doc",
        "attrs": {},
        "uid": "08560d5073684e608977ef6d332cf02d",
        "children": [
            {
                "uid": "67a215fc034f4daf867ebc393fe7fd45",
                "type": "p",
                "children": [
                    {
                        "text": "Also adding an asset as a link here. Here are the "
                    },
                    {
                        "uid": "edaaa544ae9842d9b2ecd6d773b1a815",
                        "type": "reference",
                        "attrs": {
                            "display-type": "link",
                            "type": "asset",
                            "class-name": "embedded-entry redactor-component undefined-entry",
                            "asset-uid": "blt6a5e908abbd88573",
                            "content-type-uid": "sys_assets",
                            "target": "_self",
                            "href": "***REMOVED***200/300"
                        },
                        "children": [
                            {
                                "text": "Penguins."
                            }
                        ]
                    },
                    {
                        "text": " Enjoy!"
                    }
                ],
                "attrs": {}
            }]
    }],
    "markdown": `
    
Also adding an asset as a link here. Here are the [Penguins.](***REMOVED***200/300) Enjoy!`
},
{
    "title": "Ordered List Conversion",
    "json": [{
        "type": "doc",
        "attrs": {},
        "uid": "08560d5073684e608977ef6d332cf02d",
        "children": [
            {
                "uid": "de365962da4a4c9eb2121d7face56b1d",
                "type": "ol",
                "children": [
                    {
                        "uid": "1edc6c9df32747ca84aa16a6258d9b94",
                        "type": "li",
                        "children": [
                            {
                                "text": "One"
                            }
                        ],
                        "attrs": {}
                    },
                    {
                        "uid": "fa667acc02734b24bb4fb0eb4391e5f7",
                        "type": "ol",
                        "attrs": {},
                        "children": [
                            {
                                "uid": "d25d22e6485742b3a28816b84015522d",
                                "type": "li",
                                "children": [
                                    {
                                        "text": "Nested One"
                                    }
                                ],
                                "attrs": {}
                            },
                            {
                                "uid": "d2ae3bacc14440c5b58656d6eebd1d29",
                                "type": "li",
                                "children": [
                                    {
                                        "text": "Nested Two"
                                    }
                                ],
                                "attrs": {}
                            }
                        ]
                    },
                    {
                        "uid": "1daeae84b7504a9bb0ae3649d53e4731",
                        "type": "li",
                        "children": [
                            {
                                "text": "Two"
                            }
                        ],
                        "attrs": {}
                    },
                    {
                        "uid": "13d19bda8d6c4d889ad185b38961d5aa",
                        "type": "li",
                        "children": [
                            {
                                "text": "Three"
                            }
                        ],
                        "attrs": {}
                    }
                ],
                "id": "e28ec771d8114561a3b7816370340166",
                "attrs": {}
            }]
    }],
    "markdown": `

1. One
  1. Nested One
  2. Nested Two
2. Two
3. Three
`
},
{
    "title": "Unordered List Conversion",
    "json": [{
        "type": "doc",
        "attrs": {},
        "uid": "08560d5073684e608977ef6d332cf02d",
        "children": [
            {
                "uid": "aff3137e07be4d9b9684b5afb59d6a91",
                "type": "ul",
                "children": [
                    {
                        "uid": "f2d239cc5bf043ecaf3e24cf68f894e9",
                        "type": "li",
                        "children": [
                            {
                                "text": "UL One"
                            }
                        ],
                        "attrs": {}
                    },
                    {
                        "uid": "98619c145a5145c6b5400a6dd38da02e",
                        "type": "li",
                        "children": [
                            {
                                "text": "UL Two"
                            }
                        ],
                        "attrs": {}
                    },
                    {
                        "uid": "7116006cfa0348eb93925bb3f8734631",
                        "type": "ul",
                        "attrs": {},
                        "children": [
                            {
                                "uid": "2856e1550cfb448380ac4fe1199e2d7c",
                                "type": "li",
                                "children": [
                                    {
                                        "text": "nested ul one"
                                    }
                                ],
                                "attrs": {}
                            }
                        ]
                    },
                    {
                        "uid": "d1ebffb3bead4a18bc909b7217c335d6",
                        "type": "li",
                        "children": [
                            {
                                "text": "UL Three"
                            }
                        ],
                        "attrs": {}
                    }
                ],
                "id": "e38afd21166441b984173ffd1b7d0b89",
                "attrs": {}
            }]
    }],
    "markdown": `

- UL One
- UL Two
  - nested ul one
- UL Three
`
},
{
    "title": "Table Conversion",
    "json": [{
        "type": "doc",
        "attrs": {},
        "uid": "08560d5073684e608977ef6d332cf02d",
        "children": [
            {
                "uid": "ae13dae85fd04e4584e1f677dcc03828",
                "type": "table",
                "attrs": {
                    "rows": 2,
                    "cols": 2,
                    "colWidths": [
                        250,
                        250
                    ],
                    "disabledCols": [
                        0,
                        1
                    ]
                },
                "children": [
                    {
                        "type": "tbody",
                        "attrs": {},
                        "children": [
                            {
                                "type": "tr",
                                "attrs": {},
                                "children": [
                                    {
                                        "type": "td",
                                        "attrs": {},
                                        "children": [
                                            {
                                                "type": "p",
                                                "attrs": {},
                                                "children": [
                                                    {
                                                        "text": "Cell 1"
                                                    }
                                                ],
                                                "uid": "9f2a19d96b1e4ce4b7fa6e65a04b5809"
                                            }
                                        ],
                                        "uid": "acf20185ccba45729315fa6c2ebedf89"
                                    },
                                    {
                                        "type": "td",
                                        "attrs": {},
                                        "children": [
                                            {
                                                "type": "p",
                                                "attrs": {},
                                                "children": [
                                                    {
                                                        "text": "Cell 2"
                                                    }
                                                ],
                                                "uid": "058aba304d084b76a048d2b3b4591029"
                                            }
                                        ],
                                        "uid": "3b99a891f8ae408199b73ad1fd0e2326"
                                    }
                                ],
                                "uid": "597ccff75f4d4587882cdbdfaa43d2db"
                            },
                            {
                                "type": "tr",
                                "attrs": {},
                                "children": [
                                    {
                                        "type": "td",
                                        "attrs": {
                                            "colSpan": 2,
                                            "redactor-attributes": {
                                                "colspan": 2
                                            }
                                        },
                                        "children": [
                                            {
                                                "type": "p",
                                                "attrs": {},
                                                "children": [
                                                    {
                                                        "text": "Cell 3"
                                                    }
                                                ],
                                                "uid": "d3a7b3cc7419402bac83adc91f3bddaa"
                                            }
                                        ],
                                        "uid": "0504ac4bc6db4b7e848912e76aa04d6c"
                                    },
                                    {
                                        "uid": "17e95a5eb8e740f58e3034530b1227ef",
                                        "type": "td",
                                        "attrs": {
                                            "void": true
                                        },
                                        "children": [
                                            {
                                                "text": ""
                                            }
                                        ]
                                    }
                                ],
                                "uid": "eb9515fa140f484b92a61b1ed9b06063"
                            }
                        ],
                        "uid": "a3e2a861a2e1486e9c3a7c2a3882c449"
                    }
                ]
            }]
    }],
    "markdown": `|       |       |       
| ----- | ----- |
|  Cell 1 | Cell 2 |
|  Cell 3 |  |
`
}, 
]