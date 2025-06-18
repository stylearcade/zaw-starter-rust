import fs from 'fs'
import path from 'path'
import { describe, it, expect } from 'vitest'
import { initExample } from '../src/index'

describe('TypeScript example host', async () => {
  const wasmPath = path.join(__dirname, '../../rust/target/wasm32-unknown-unknown/release/zaw_rust_example.wasm')
  const wasmBuffer = fs.readFileSync(wasmPath)
  const api = await initExample(wasmBuffer)

  for (const size of [2, 10, 100, 1000, 10000]) {
    describe(`XOR Int32Array @ ${size} elements`, () => {
      const values = new Int32Array(size).map(() => (Math.random() * 0x100000000) | 0)
      const expectation = values.reduce((a, v) => a ^ v, 0)

      it('zaw should have correct result', () => {
        const result = api.xorInt32Array(values)
        expect(result).toBe(expectation)
      })
    })
  }
})
