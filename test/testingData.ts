export const imageAssetData = {
  base: {
    value: getDoc([
      {
        uid: "0b1d2b71639f4b83a9daeb082e1bd52c",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          inline: false,
        },
        children: [
          {
            text: "",
          },
        ],
      },
    ]),
    expectedHtml: `<figure style="margin: 0"><img src="https://picsum.photos/200/300" class="embedded-asset" content-type-uid="sys_assets" type="asset" style="width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" sys-style-type="display"/></figure>`,
  },
  alt: {
    value: getDoc([
      {
        uid: "c867e74ab2bc463aa3642bf66c7cb3b7",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          "redactor-attributes": {
            alt: "I am BATMAN",
            position: "none",
          },
          style: {},
          "asset-alt": "I am BATMAN",
          position: "none",
        },
        children: [
          {
            text: "",
          },
        ],
      },
    ]),
    expectedHtml: `<figure style="margin: 0"><img src="https://picsum.photos/200/300" alt="I am BATMAN" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="I am BATMAN" style="width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-alt="I am BATMAN" data-sys-asset-position="none" sys-style-type="display"/></figure>`,
  },
  caption: {
    value: getDoc([
      {
        uid: "1f19dba931004b0cb96c7f9d290b160f",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          "redactor-attributes": {
            position: "none",
            caption: "BATMAN",
          },
          style: {},
          position: "none",
          "asset-caption": "BATMAN",
        },
        children: [
          {
            text: "",
          },
        ],
      },
    ]),
    expectedHtml: `<figure style="margin: 0"><div style="display: inline-block"><img src="https://picsum.photos/200/300" caption="BATMAN" class="embedded-asset" content-type-uid="sys_assets" type="asset" style="width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-caption="BATMAN" data-sys-asset-position="none" sys-style-type="display"/><figcaption style="text-align:center">BATMAN</figcaption></div></figure>`,
  },
  alignment: {
    value: getDoc([
      {
        uid: "21f67557c705485890272fb9ecbaf32b",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          "redactor-attributes": {
            position: "left",
          },
          style: {
            "text-align": "left",
            "max-width": "undefinedpx",
            float: "left",
          },
          position: "left",
        },
        children: [
          {
            text: "",
          },
        ],
      },

      {
        uid: "b917e3fbe6004de9880749bbc5f435d7",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          "redactor-attributes": {
            position: "right",
          },
          style: {
            "text-align": "right",
            "max-width": "undefinedpx",
            float: "right",
          },
          position: "right",
        },
        children: [
          {
            text: "",
          },
        ],
      },
      {
        uid: "253bddc12f0946f2a0bea2cb243ec6e1",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          "redactor-attributes": {
            position: "center",
          },
          style: {
            "text-align": "center",
          },
          position: "center",
        },
        children: [
          {
            text: "",
          },
        ],
      },
    ]),
    expectedHtml: `<figure style="margin: 0; text-align: left"><img src="https://picsum.photos/200/300" class="embedded-asset" content-type-uid="sys_assets" type="asset" style="text-align: left; max-width: undefinedpx; width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-position="left" sys-style-type="display"/></figure><figure style="margin: 0; text-align: right"><img src="https://picsum.photos/200/300" class="embedded-asset" content-type-uid="sys_assets" type="asset" style="text-align: right; max-width: undefinedpx; width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-position="right" sys-style-type="display"/></figure><figure style="margin: 0; text-align: center"><img src="https://picsum.photos/200/300" class="embedded-asset" content-type-uid="sys_assets" type="asset" style="text-align: center; width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-position="center" sys-style-type="display"/></figure>`,
  },
  anchor: {
    value: getDoc([
      {
        uid: "00630ce6eacc458d9016ae7a2797f537",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          "redactor-attributes": {
            position: "left",
            anchorLink: "https://www.batman.com",
          },
          style: {},
          position: "none",
          link: "https://www.batman.com",
          dir: "ltr",
        },
        children: [
          {
            text: "",
          },
        ],
      },
    ]),
    expectedHtml: `<figure style="margin: 0"><a href="https://www.batman.com"><img src="https://picsum.photos/200/300" anchorLink="https://www.batman.com" class="embedded-asset" content-type-uid="sys_assets" type="asset" dir="ltr" style="width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-link="https://www.batman.com" data-sys-asset-position="none" sys-style-type="display"/></a></figure>`,
  },
  "anchor-target": {
    value: getDoc([
      {
        uid: "609354a1bba14e82b7b5f1f3364e38eb",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          "redactor-attributes": {
            position: "none",
            anchorLink: "https://www.batman.com",
            target: true,
          },
          style: {},
          position: "none",
          link: "https://www.batman.com",
          target: "_blank",
        },
        children: [
          {
            text: "",
          },
        ],
      },
    ]),
    expectedHtml: `<figure style="margin: 0"><a href="https://www.batman.com" target="_blank"><img src="https://picsum.photos/200/300" anchorLink="https://www.batman.com" class="embedded-asset" content-type-uid="sys_assets" type="asset" style="width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-link="https://www.batman.com" data-sys-asset-position="none" data-sys-asset-isnewtab="true" sys-style-type="display"/></a></figure>`,
  },
  "anchor-alignment-target-alt-caption": {
    value: getDoc([
      {
        uid: "e28bbdda490b48a6b1a6f88a2eaf1201",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          "redactor-attributes": {
            alt: "I am BATMAN",
            position: "none",
            caption: "BATMAN",
            anchorLink: "https://www.batman.com",
            target: true,
          },
          style: {},
          "asset-alt": "I am BATMAN",
          position: "none",
          "asset-caption": "BATMAN",
          link: "https://www.batman.com",
          target: "_blank",
        },
        children: [
          {
            text: "",
          },
        ],
      },
      {
        uid: "7df91929ac78495f90b230d174a516c8",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          "redactor-attributes": {
            alt: "I am BATMAN",
            position: "left",
            caption: "BATMAN",
            anchorLink: "https://www.batman.com",
            target: true,
          },
          style: {
            "text-align": "left",
            "max-width": "undefinedpx",
            float: "left",
          },
          "asset-alt": "I am BATMAN",
          position: "left",
          "asset-caption": "BATMAN",
          link: "https://www.batman.com",
          target: "_blank",
        },
        children: [
          {
            text: "",
          },
        ],
      },
      {
        uid: "d2c713568e69437ab6508cc269536613",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          "redactor-attributes": {
            alt: "I am BATMAN",
            position: "center",
            caption: "BATMAN",
            anchorLink: "https://www.batman.com",
            target: true,
          },
          style: {
            "text-align": "center",
            "max-width": "undefinedpx",
            float: "left",
          },
          "asset-alt": "I am BATMAN",
          position: "center",
          "asset-caption": "BATMAN",
          link: "https://www.batman.com",
          target: "_blank",
        },
        children: [
          {
            text: "",
          },
        ],
      },
      {
        uid: "a670bcec53e54dd3b67a93838cb064df",
        type: "reference",
        attrs: {
          "display-type": "display",
          "asset-uid": "bltb87e0bd5764c421e",
          "content-type-uid": "sys_assets",
          "asset-link":
            "https://picsum.photos/200/300",
          "asset-name": "batman.png",
          "asset-type": "image/png",
          type: "asset",
          "class-name": "embedded-asset",
          "redactor-attributes": {
            position: "right",
            alt: "I am BATMAN",
            caption: "BATMAN",
            anchorLink: "https://www.batman.com",
            target: true,
          },
          style: {
            "text-align": "right",
            "max-width": "undefinedpx",
            float: "right",
          },
          position: "right",
          "asset-alt": "I am BATMAN",
          "asset-caption": "BATMAN",
          link: "https://www.batman.com",
          target: "_blank",
        },
        children: [
          {
            text: "",
          },
        ],
      },
    ]),
    expectedHtml: `<figure style="margin: 0"><div style="display: inline-block"><a href="https://www.batman.com" target="_blank"><img src="https://picsum.photos/200/300" alt="I am BATMAN" caption="BATMAN" anchorLink="https://www.batman.com" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="I am BATMAN" style="width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-caption="BATMAN" data-sys-asset-alt="I am BATMAN" data-sys-asset-link="https://www.batman.com" data-sys-asset-position="none" data-sys-asset-isnewtab="true" sys-style-type="display"/></a><figcaption style="text-align:center">BATMAN</figcaption></div></figure><figure style="margin: 0; text-align: left"><div style="display: inline-block"><a href="https://www.batman.com" target="_blank"><img src="https://picsum.photos/200/300" alt="I am BATMAN" caption="BATMAN" anchorLink="https://www.batman.com" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="I am BATMAN" style="text-align: left; max-width: undefinedpx; width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-caption="BATMAN" data-sys-asset-alt="I am BATMAN" data-sys-asset-link="https://www.batman.com" data-sys-asset-position="left" data-sys-asset-isnewtab="true" sys-style-type="display"/></a><figcaption style="text-align:center">BATMAN</figcaption></div></figure><figure style="margin: 0; text-align: center"><div style="display: inline-block"><a href="https://www.batman.com" target="_blank"><img src="https://picsum.photos/200/300" alt="I am BATMAN" caption="BATMAN" anchorLink="https://www.batman.com" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="I am BATMAN" style="text-align: center; max-width: undefinedpx; width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-caption="BATMAN" data-sys-asset-alt="I am BATMAN" data-sys-asset-link="https://www.batman.com" data-sys-asset-position="center" data-sys-asset-isnewtab="true" sys-style-type="display"/></a><figcaption style="text-align:center">BATMAN</figcaption></div></figure><figure style="margin: 0; text-align: right"><div style="display: inline-block"><a href="https://www.batman.com" target="_blank"><img src="https://picsum.photos/200/300" alt="I am BATMAN" caption="BATMAN" anchorLink="https://www.batman.com" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="I am BATMAN" style="text-align: right; max-width: undefinedpx; width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-caption="BATMAN" data-sys-asset-alt="I am BATMAN" data-sys-asset-link="https://www.batman.com" data-sys-asset-position="right" data-sys-asset-isnewtab="true" sys-style-type="display"/></a><figcaption style="text-align:center">BATMAN</figcaption></div></figure>`,
  },
  "inline-base": {
    value: getDoc([
      {
        uid: "b3aeae85e85446e484f43390be7b83e0",
        type: "p",
        attrs: {
          style: {},
          "redactor-attributes": {},
          dir: "ltr",
        },
        children: [
          {
            text: "I am",
          },
          {
            uid: "0b1d2b71639f4b83a9daeb082e1bd52c",
            type: "reference",
            attrs: {
              "display-type": "display",
              "asset-uid": "bltb87e0bd5764c421e",
              "content-type-uid": "sys_assets",
              "asset-link":
                "https://picsum.photos/200/300",
              "asset-name": "batman.png",
              "asset-type": "image/png",
              type: "asset",
              "class-name": "embedded-asset",
              inline: true,
              "redactor-attributes": {
                position: "none",
                inline: true,
              },
              style: {},
              position: "none",
            },
            children: [
              {
                text: "",
              },
            ],
          },
          {
            text: "batman",
          },
        ],
      },
    ]),
    expectedHtml: `<p dir="ltr">I am<img src="https://picsum.photos/200/300" inline="true" class="embedded-asset" content-type-uid="sys_assets" type="asset" style="width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-position="none" sys-style-type="display"/>batman</p>`,
  },
  "inline-alt": {
    value: getDoc([
      {
        uid: "f2b9cbb9371b498ca52084f9fb0d5539",
        type: "p",
        attrs: {
          style: {},
          "redactor-attributes": {},
          dir: "ltr",
        },
        children: [
          {
            text: "I am",
          },
          {
            uid: "c867e74ab2bc463aa3642bf66c7cb3b7",
            type: "reference",
            attrs: {
              "display-type": "display",
              "asset-uid": "bltb87e0bd5764c421e",
              "content-type-uid": "sys_assets",
              "asset-link":
                "https://picsum.photos/200/300",
              "asset-name": "batman.png",
              "asset-type": "image/png",
              type: "asset",
              "class-name": "embedded-asset",
              "redactor-attributes": {
                alt: "I am BATMAN",
                position: "none",
                inline: true,
              },
              style: {},
              "asset-alt": "I am BATMAN",
              position: "none",
              inline: true,
            },
            children: [
              {
                text: "",
              },
            ],
          },
          {
            text: "batman",
          },
        ],
      },
    ]),
    expectedHtml: `<p dir="ltr">I am<img src="https://picsum.photos/200/300" alt="I am BATMAN" inline="true" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="I am BATMAN" style="width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-alt="I am BATMAN" data-sys-asset-position="none" sys-style-type="display"/>batman</p>`,
  },
  "inline-caption": {
    value: getDoc([
      {
        uid: "c8cb166c89a945f98e1b9f1366635bad",
        type: "p",
        attrs: {
          style: {},
          "redactor-attributes": {},
          dir: "ltr",
        },
        children: [
          {
            text: "I am ",
          },
          {
            uid: "1f19dba931004b0cb96c7f9d290b160f",
            type: "reference",
            attrs: {
              "display-type": "display",
              "asset-uid": "bltb87e0bd5764c421e",
              "content-type-uid": "sys_assets",
              "asset-link":
                "https://picsum.photos/200/300",
              "asset-name": "batman.png",
              "asset-type": "image/png",
              type: "asset",
              "class-name": "embedded-asset",
              "redactor-attributes": {
                position: "none",
                caption: "BATMAN",
                inline: true,
              },
              style: {},
              position: "none",
              "asset-caption": "BATMAN",
              inline: true,
            },
            children: [
              {
                text: "",
              },
            ],
          },
          {
            text: "Batman",
          },
        ],
      },
    ]),
    expectedHtml: `<div dir="ltr" style="overflow: hidden"><span>I am <figure style="margin: 0; display: inline-block"><div style="display: inline-block"><img src="https://picsum.photos/200/300" caption="BATMAN" inline="true" class="embedded-asset" content-type-uid="sys_assets" type="asset" style="width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-caption="BATMAN" data-sys-asset-position="none" sys-style-type="display"/><figcaption style="text-align:center">BATMAN</figcaption></div></figure>Batman</span></div>`,
  },
  "inline-alignment": {
    value: getDoc([
      {
        uid: "75c3ff4800d34df6bf4243d62208406e",
        type: "p",
        attrs: {
          style: {},
          "redactor-attributes": {},
          dir: "ltr",
        },
        children: [
          {
            text: "",
          },
          {
            uid: "21f67557c705485890272fb9ecbaf32b",
            type: "reference",
            attrs: {
              "display-type": "display",
              "asset-uid": "bltb87e0bd5764c421e",
              "content-type-uid": "sys_assets",
              "asset-link":
                "https://picsum.photos/200/300",
              "asset-name": "batman.png",
              "asset-type": "image/png",
              type: "asset",
              "class-name": "embedded-asset",
              "redactor-attributes": {
                position: "left",
                inline: true,
              },
              style: {
                "text-align": "left",
                "max-width": "undefinedpx",
                float: "left",
              },
              position: "left",
              dir: "ltr",
              inline: true,
            },
            children: [
              {
                text: "",
              },
            ],
          },
          {
            text: "I am batman",
          },
        ],
      },
      {
        uid: "c3cab5a27496401ab7306108748a982e",
        type: "p",
        attrs: {
          style: {},
          "redactor-attributes": {},
          dir: "ltr",
        },
        children: [
          {
            text: "",
          },
          {
            uid: "b917e3fbe6004de9880749bbc5f435d7",
            type: "reference",
            attrs: {
              "display-type": "display",
              "asset-uid": "bltb87e0bd5764c421e",
              "content-type-uid": "sys_assets",
              "asset-link":
                "https://picsum.photos/200/300",
              "asset-name": "batman.png",
              "asset-type": "image/png",
              type: "asset",
              "class-name": "embedded-asset",
              "redactor-attributes": {
                position: "right",
                inline: true,
              },
              style: {
                "text-align": "right",
                "max-width": "undefinedpx",
                float: "right",
              },
              position: "right",
              inline: true,
            },
            children: [
              {
                text: "",
              },
            ],
          },
          {
            text: "I am batman",
          },
        ],
      },
    ]),
    expectedHtml: `<div dir="ltr" style="overflow: hidden"><span><figure style="margin: 0; float: left"><img src="https://picsum.photos/200/300" inline="true" class="embedded-asset" content-type-uid="sys_assets" type="asset" dir="ltr" style="text-align: left; max-width: undefinedpx; width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-position="left" sys-style-type="display"/></figure>I am batman</span></div><div dir="ltr" style="overflow: hidden"><span><figure style="margin: 0; float: right"><img src="https://picsum.photos/200/300" inline="true" class="embedded-asset" content-type-uid="sys_assets" type="asset" style="text-align: right; max-width: undefinedpx; width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-position="right" sys-style-type="display"/></figure>I am batman</span></div>`,
  },
  "inline-anchor": {
    value: getDoc([
      {
        uid: "4384b7f3907b4bd6a126901c39df99e1",
        type: "p",
        attrs: {
          style: {},
          "redactor-attributes": {},
          dir: "ltr",
        },
        children: [
          {
            text: "I am",
          },
          {
            uid: "00630ce6eacc458d9016ae7a2797f537",
            type: "reference",
            attrs: {
              "display-type": "display",
              "asset-uid": "bltb87e0bd5764c421e",
              "content-type-uid": "sys_assets",
              "asset-link":
                "https://picsum.photos/200/300",
              "asset-name": "batman.png",
              "asset-type": "image/png",
              type: "asset",
              "class-name": "embedded-asset",
              "redactor-attributes": {
                position: "none",
                anchorLink: "https://www.batman.com",
                inline: true,
              },
              style: {},
              position: "none",
              link: "https://www.batman.com",
              dir: "ltr",
              inline: true,
            },
            children: [
              {
                text: "",
              },
            ],
          },
          {
            text: " batman",
          },
        ],
      },
    ]),
    expectedHtml: `<p dir="ltr">I am<a href="https://www.batman.com"><img src="https://picsum.photos/200/300" anchorLink="https://www.batman.com" inline="true" class="embedded-asset" content-type-uid="sys_assets" type="asset" dir="ltr" style="width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-link="https://www.batman.com" data-sys-asset-position="none" sys-style-type="display"/></a> batman</p>`,
  },
  "inline-anchor-target": {
    value: getDoc([
      {
        uid: "d6d6f24c461a4c20bfaa63a05ac76b69",
        type: "p",
        attrs: {
          style: {},
          "redactor-attributes": {},
          dir: "ltr",
        },
        children: [
          {
            text: "I am",
          },
          {
            uid: "e28bbdda490b48a6b1a6f88a2eaf1201",
            type: "reference",
            attrs: {
              "display-type": "display",
              "asset-uid": "bltb87e0bd5764c421e",
              "content-type-uid": "sys_assets",
              "asset-link":
                "https://picsum.photos/200/300",
              "asset-name": "batman.png",
              "asset-type": "image/png",
              type: "asset",
              "class-name": "embedded-asset",
              "redactor-attributes": {
                alt: "I am BATMAN",
                position: "none",
                caption: "BATMAN",
                anchorLink: "https://www.batman.com",
                target: true,
                inline: true,
              },
              style: {},
              "asset-alt": "I am BATMAN",
              position: "none",
              "asset-caption": "BATMAN",
              link: "https://www.batman.com",
              target: "_blank",
              inline: true,
            },
            children: [
              {
                text: "",
              },
            ],
          },
          {
            text: "batman",
          },
        ],
      },
    ]),
    expectedHtml: `<div dir="ltr" style="overflow: hidden"><span>I am<figure style="margin: 0; display: inline-block"><div style="display: inline-block"><a href="https://www.batman.com" target="_blank"><img src="https://picsum.photos/200/300" alt="I am BATMAN" caption="BATMAN" anchorLink="https://www.batman.com" inline="true" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="I am BATMAN" style="width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-caption="BATMAN" data-sys-asset-alt="I am BATMAN" data-sys-asset-link="https://www.batman.com" data-sys-asset-position="none" data-sys-asset-isnewtab="true" sys-style-type="display"/></a><figcaption style="text-align:center">BATMAN</figcaption></div></figure>batman</span></div>`,
  },
  "inline-anchor-alignment-target-alt-caption": {
    value: getDoc([
      {
        uid: "08eaff382ac0443e9268c7a3c59a8f06",
        type: "p",
        attrs: {
          style: {},
          "redactor-attributes": {},
          dir: "ltr",
        },
        children: [
          {
            text: "",
          },
          {
            uid: "7df91929ac78495f90b230d174a516c8",
            type: "reference",
            attrs: {
              "display-type": "display",
              "asset-uid": "bltb87e0bd5764c421e",
              "content-type-uid": "sys_assets",
              "asset-link":
                "https://picsum.photos/200/300",
              "asset-name": "batman.png",
              "asset-type": "image/png",
              type: "asset",
              "class-name": "embedded-asset",
              "redactor-attributes": {
                alt: "I am BATMAN",
                position: "left",
                caption: "BATMAN",
                anchorLink: "https://www.batman.com",
                target: true,
                inline: true,
              },
              style: {
                "text-align": "left",
                "max-width": "undefinedpx",
                float: "left",
              },
              "asset-alt": "I am BATMAN",
              position: "left",
              "asset-caption": "BATMAN",
              link: "https://www.batman.com",
              target: "_blank",
              inline: true,
            },
            children: [
              {
                text: "",
              },
            ],
          },
          {
            text: "I am batman",
          },
        ],
      },
      {
        uid: "ec216ba8b3c04ca78f6552f1d8199267",
        type: "p",
        attrs: {
          style: {},
          "redactor-attributes": {},
          dir: "ltr",
        },
        children: [
          {
            text: "",
          },
          {
            uid: "a670bcec53e54dd3b67a93838cb064df",
            type: "reference",
            attrs: {
              "display-type": "display",
              "asset-uid": "bltb87e0bd5764c421e",
              "content-type-uid": "sys_assets",
              "asset-link":
                "https://picsum.photos/200/300",
              "asset-name": "batman.png",
              "asset-type": "image/png",
              type: "asset",
              "class-name": "embedded-asset",
              "redactor-attributes": {
                position: "right",
                alt: "I am BATMAN",
                caption: "BATMAN",
                anchorLink: "https://www.batman.com",
                target: true,
                inline: true,
              },
              style: {
                "text-align": "right",
                "max-width": "undefinedpx",
                float: "right",
              },
              position: "right",
              "asset-alt": "I am BATMAN",
              "asset-caption": "BATMAN",
              link: "https://www.batman.com",
              target: "_blank",
              inline: true,
            },
            children: [
              {
                text: "",
              },
            ],
          },
          {
            text: "I am batman",
          },
        ],
      },
    ]),
    expectedHtml: `<div dir="ltr" style="overflow: hidden"><span><figure style="margin: 0; float: left"><div style="display: inline-block"><a href="https://www.batman.com" target="_blank"><img src="https://picsum.photos/200/300" alt="I am BATMAN" caption="BATMAN" anchorLink="https://www.batman.com" inline="true" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="I am BATMAN" style="text-align: left; max-width: undefinedpx; width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-caption="BATMAN" data-sys-asset-alt="I am BATMAN" data-sys-asset-link="https://www.batman.com" data-sys-asset-position="left" data-sys-asset-isnewtab="true" sys-style-type="display"/></a><figcaption style="text-align:center">BATMAN</figcaption></div></figure>I am batman</span></div><div dir="ltr" style="overflow: hidden"><span><figure style="margin: 0; float: right"><div style="display: inline-block"><a href="https://www.batman.com" target="_blank"><img src="https://picsum.photos/200/300" alt="I am BATMAN" caption="BATMAN" anchorLink="https://www.batman.com" inline="true" class="embedded-asset" content-type-uid="sys_assets" type="asset" asset-alt="I am BATMAN" style="text-align: right; max-width: undefinedpx; width: auto" data-sys-asset-filelink="https://picsum.photos/200/300" data-sys-asset-uid="bltb87e0bd5764c421e" data-sys-asset-filename="batman.png" data-sys-asset-contenttype="image/png" data-sys-asset-caption="BATMAN" data-sys-asset-alt="I am BATMAN" data-sys-asset-link="https://www.batman.com" data-sys-asset-position="right" data-sys-asset-isnewtab="true" sys-style-type="display"/></a><figcaption style="text-align:center">BATMAN</figcaption></div></figure>I am batman</span></div>`,
  },
};

function getDoc(value: any) {
  return {
    type: "doc",
    attrs: {},
    uid: "ddec1e08f4634eaca512b113ba4da946",
    children: value,
  };
}
