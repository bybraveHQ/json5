# @bybrave/json5

Maintained, drop-in fork of [`json5`](https://github.com/json5/json5) — the JSON5 (JSON for humans) parser and stringifier: comments, unquoted keys, trailing commas, single quotes, hex, and more.

The original has had no release since 2022 (`2.2.3`) while still pulling ~800M downloads/month. This fork keeps the parser 100% compatible and fixes the long-standing ESM packaging bug, modernizes the build, and bundles TypeScript types.

```sh
npm install @bybrave/json5
```

```js
const JSON5 = require('@bybrave/json5');        // CommonJS
import JSON5 from '@bybrave/json5';              // ESM (default)
import { parse, stringify } from '@bybrave/json5'; // ESM (named) — now works
```

Same API as `json5`: `JSON5.parse(text, reviver?)` and `JSON5.stringify(value, replacer?, space?)`.

## What's fixed

| Issue | Problem | Fix |
|---|---|---|
| [#240](https://github.com/json5/json5/issues/240) | The ESM build (`module` field) exported only `{ default: {...} }` while CJS exported `{ parse, stringify }`. Bundlers that prefer `module` (webpack) broke on `import { parse }`, and `import`/`require` disagreed on shape. | ESM-first sources with an `exports` map: `import JSON5 from …`, `import { parse, stringify } from …`, and `require(…)` all resolve to the **same** shape. |
| [#348](https://github.com/json5/json5/issues/348) | Request to ship real ES modules (tree-shaking, no CJS-interop shim). | Sources are ES modules; the CJS entry is generated from them via the `require` condition. |
| [#205](https://github.com/json5/json5/issues/205) | Ask to drop the `minimist` CLI dependency. | Already resolved upstream (CLI uses a hand-rolled arg parser); this fork ships **zero runtime dependencies**. |

## Modernized build

The original toolchain (rollup 0.64 + buble + core-js 2, 15 dev-dependencies) is replaced by a single **esbuild** step producing the CJS entry and a minified browser (UMD-style `window.JSON5`) bundle. Dev-dependencies drop to three (esbuild, typescript, @types/node). No runtime dependencies.

Targets Node 18+. The browser bundle targets ES2015 (the original ES5 legacy target is dropped — a deliberate choice for a 2026 major).

## Extras (opt-in)

**Large integers (`bigint`)** — integer literals outside the safe range lose precision in `JSON.parse`/`json5`. Pass `{ bigint: true }` to get them back as `BigInt` ([#292](https://github.com/json5/json5/issues/292)); everything else is unchanged, and `stringify` serializes `BigInt` back to a bare literal:

```js
JSON5.parse('12345678901234567890');                 // 12345678901234567000  (imprecise)
JSON5.parse('12345678901234567890', { bigint: true }); // 12345678901234567890n
JSON5.stringify(99999999999999999999n);               // '99999999999999999999'
```

Options may also be passed as the second argument: `JSON5.parse(text, { bigint: true })`.

**Lone surrogates** — `stringify` now escapes unpaired surrogate code units as `\uXXXX` instead of emitting an invalid string that reads back as `U+FFFD` ([#192](https://github.com/json5/json5/issues/192)). Valid surrogate pairs (emoji, etc.) are untouched.

## Migration from `json5`

Replace the dependency and the import — the parser and stringifier behave identically. The only change is packaging: `import { parse, stringify }` now works, and the `import`/`require` shapes match. If you consumed the deprecated `json5/register` require-hook, it moved to `@bybrave/json5/register`.

## Support

If this package saves you time, you can support maintenance:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-buy%20me%20a%20coffee-FF5E5B?logo=kofi&logoColor=white)](https://ko-fi.com/bybrave)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-BTC-F7931A?logo=bitcoin&logoColor=white)](#support)

Bitcoin (BTC): `bc1q37557q5jpeaxqydzwvf3jgj7zhnfpn2td3q40q`

## Credits & license

MIT, same as the original — see [LICENSE.md](./LICENSE.md).
Based on [json5](https://github.com/json5/json5) by Aseem Kishore, Jordan Tucker and contributors.
