# Changelog

Maintained fork of [pvorb/node-md5](https://github.com/pvorb/node-md5).

## 5.0.0 — 2026-07-05

### Added

- Zero runtime dependencies — the `charenc`, `crypt`, and `is-buffer` micro-packages are now inlined.
- Dual ESM + CommonJS builds via an `exports` map; `require('@bybrave/md5')` still returns the function directly.
- Built-in TypeScript types (`index.d.ts` with `asBytes` / `asString` overloads), removing the need for `@types/md5`.

### Fixed

- #49: `ArrayBuffer`, `DataView`, and any `TypedArray` are now hashed as their underlying bytes, so `md5(ab) === md5(new Uint8Array(ab))`.
- #79: numbers are coerced with `String(value)`, so `md5(1003) === md5('1003')`.
