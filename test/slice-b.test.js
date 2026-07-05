import {test} from 'node:test'
import assert from 'node:assert'
import JSON5, {parse, stringify} from '../lib/index.js'

// #292 — opt-in BigInt for integers outside the safe range.
test('#292: default loses precision above 2^53', () => {
    assert.strictEqual(JSON5.parse('12345678901234567890'), 12345678901234567000)
})

test('#292: bigint option preserves large integers', () => {
    assert.strictEqual(
        parse('12345678901234567890', {bigint: true}),
        12345678901234567890n,
    )
})

test('#292: bigint option leaves safe integers as number', () => {
    assert.strictEqual(typeof parse('42', {bigint: true}), 'number')
    assert.strictEqual(parse('42', {bigint: true}), 42)
})

test('#292: bigint option handles negatives', () => {
    assert.strictEqual(
        parse('-99999999999999999999', {bigint: true}),
        -99999999999999999999n,
    )
})

test('#292: bigint option handles hex literals', () => {
    assert.strictEqual(
        parse('0xFFFFFFFFFFFFFFFF', {bigint: true}),
        0xFFFFFFFFFFFFFFFFn,
    )
})

test('#292: floats and exponents stay number even with bigint', () => {
    assert.strictEqual(typeof parse('1.5', {bigint: true}), 'number')
    assert.strictEqual(typeof parse('1e10', {bigint: true}), 'number')
    assert.strictEqual(typeof parse('1.5e10', {bigint: true}), 'number')
})

test('#292: options can be passed as third arg with reviver', () => {
    const result = parse('{n:99999999999999999999}', null, {bigint: true})
    assert.strictEqual(result.n, 99999999999999999999n)
})

test('#292: reviver still works alongside bigint', () => {
    const doubled = parse('{a:1}', (k, v) => (typeof v === 'number' ? v * 2 : v))
    assert.strictEqual(doubled.a, 2)
})

test('#292: default behavior unchanged without option', () => {
    assert.strictEqual(typeof parse('12345678901234567890'), 'number')
})

test('#292: stringify serializes BigInt as bare literal', () => {
    const parsed = parse('{n:99999999999999999999}', {bigint: true})
    assert.strictEqual(stringify(parsed), '{n:99999999999999999999}')
})

test('#292: BigInt round-trips through JSON5', () => {
    const parsed = parse('{n:99999999999999999999}', {bigint: true})
    assert.strictEqual(
        parse(stringify(parsed), {bigint: true}).n,
        99999999999999999999n,
    )
})

// #192 — lone surrogates are escaped on stringify.
test('#192: lone high surrogate is escaped', () => {
    assert.strictEqual(stringify('\uD800'), "'\\ud800'")
})

test('#192: lone low surrogate is escaped', () => {
    assert.strictEqual(stringify('\uDC00'), "'\\udc00'")
})

test('#192: lone surrogate in the middle of a string is escaped', () => {
    assert.ok(stringify('a\uD834b').includes('\\ud834'))
})

test('#192: valid surrogate pairs are left intact', () => {
    assert.strictEqual(stringify('\u{1F600}'), "'\u{1F600}'")
})

test('#192: valid emoji round-trips', () => {
    assert.strictEqual(JSON5.parse(stringify('\u{1F600}x')), '\u{1F600}x')
})
