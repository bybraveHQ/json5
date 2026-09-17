# Changelog

Maintained fork of [json5/json5](https://github.com/json5/json5). Being upstreamed in [json5/json5#370](https://github.com/json5/json5/pull/370); once that ships as `json5` v3 this package will be deprecated in its favor.

## 3.1.0 — 2026-07-05

### Added

- Opt-in `BigInt` parsing: `JSON5.parse(text, { bigint: true })` returns integer literals outside the safe range as `BigInt` instead of losing precision ([json5#292](https://github.com/json5/json5/issues/292)). Options may be passed as the second argument; `stringify` serializes `BigInt` back to a bare literal.

### Fixed

- `stringify` escapes lone (unpaired) surrogate code units as `\uXXXX` instead of emitting an invalid string that reads back as `U+FFFD` ([json5#192](https://github.com/json5/json5/issues/192)). Valid surrogate pairs are untouched.

## 3.0.0 — 2026-07-05

Initial release of the fork. The parser and stringifier are byte-for-byte compatible with `json5@2.2.3`; the changes are packaging and tooling.

### Changed

- **Breaking:** ES module sources with an `exports` map. `import JSON5 from …`, `import { parse, stringify } from …` and `require(…)` resolve to the same shape ([json5#240](https://github.com/json5/json5/issues/240), [json5#348](https://github.com/json5/json5/issues/348)). The `require` entry is generated from the sources.
- **Breaking:** Node.js 18 or later; the browser bundle targets ES2015 instead of ES5.
- **Breaking:** the `json5/lib/register` require hook moved to `@bybrave/json5/register`.
- Build: rollup + buble + core-js replaced by a single esbuild step; tap replaced by `node:test`. Zero runtime dependencies, three dev dependencies.
- TypeScript declarations bundled as a single `index.d.ts` covering both entries.
