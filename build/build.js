// Build the CJS entry (for the `require` condition) and the minified UMD browser
// bundle from the ESM sources in lib/, using esbuild — replaces the original
// rollup + buble + core-js toolchain.
import {build} from 'esbuild'
import {mkdirSync} from 'fs'

mkdirSync(new URL('../dist/', import.meta.url), {recursive: true})

const entry = new URL('../lib/index.js', import.meta.url).pathname

// CommonJS entry consumed via the `require` export condition. Keeping the named
// exports (parse, stringify) on module.exports so `require('@bybrave/json5')`
// and `import { parse } from '@bybrave/json5'` resolve to the same shape — the
// root of upstream #240.
await build({
  entryPoints: [entry],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  outfile: new URL('../dist/index.cjs', import.meta.url).pathname,
})

// Minified UMD-style browser global (window.JSON5), es2015 target.
await build({
  entryPoints: [entry],
  bundle: true,
  format: 'iife',
  globalName: 'JSON5',
  target: 'es2015',
  minify: true,
  outfile: new URL('../dist/index.min.js', import.meta.url).pathname,
  // esbuild wraps iife as `var JSON5 = (() => {…})()`; the module's default
  // export lands on JSON5.default, so expose it as the global directly.
  footer: {js: 'if(typeof JSON5!=="undefined"&&JSON5.default)JSON5=JSON5.default;'},
})

console.log('build: dist/index.cjs + dist/index.min.js')
