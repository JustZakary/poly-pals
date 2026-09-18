# ![poly-pals avatar](assets/poly-pals.svg) Poly Pals ![JustZakary avatar](assets/JustZakary.svg)

Seeded polygon avatars. The same display name always produces the same pal.

## Install

```bash
npm install poly-pals
```

## npm package

`displayname` is required and is used as the random seed.

```js
const { generateSvg, generate, writeSvg } = require('poly-pals');

const svg = generateSvg('JustZakary', {
  shadow: true,
  size: 200,
});

const avatar = generate('JustZakary', {
  shadow: true,
  size: 200,
});
// avatar.svg, avatar.shapeSVG, avatar.mouthSVG, avatar.eyesSVG

const filePath = writeSvg('JustZakary', {
  shadow: true,
  size: 200,
  output: './output',
  filename: 'JustZakary.svg',
});
```

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `shadow` | `boolean` | `true` | Include a drop shadow on the shape. |
| `size` | `number` | `200` | SVG width and height in pixels. |
| `output` | `string` | `output/` | Directory for `writeSvg`. |
| `filename` | `string` | `<displayname>.svg` | Filename for `writeSvg`. |

`writeSvg` is Node-only. `generate` and `generateSvg` work in Node and in the browser.

## CLI

```bash
npx poly-pals --displayname JustZakary
```

```bash
npx poly-pals --displayname JustZakary --output ./output --size 200 --shadow
npx poly-pals -n JustZakary --no-shadow
```

From this repo:

```bash
npm run generate -- --displayname JustZakary
node cli.js --displayname JustZakary
```

| Flag | Description |
| --- | --- |
| `--displayname`, `-n` | Required. Used as the random seed and default filename. |
| `--output`, `-o` | Directory to save the SVG. Default: `output`. |
| `--size`, `-s` | Output size in pixels. Default: `200`. |
| `--shadow` | Shape drop shadow. Default: `true`. |
| `--no-shadow` | Disable the drop shadow. |
| `--help`, `-h` | Show usage. |

## Web generator

Generate and download avatars in the browser: [justzakary.github.io/poly-pals](https://justzakary.github.io/poly-pals).

## Links
- [Try the generator](https://justzakary.github.io/poly-pals)
- [npm](https://www.npmjs.com/package/poly-pals)
- [GitHub](https://github.com/JustZakary/poly-pals)