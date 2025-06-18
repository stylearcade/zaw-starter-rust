import fs from 'fs'
import path from 'path'
import { bench, describe } from 'vitest'
import { initExample } from '../src/index'

describe('TypeScript example host', async () => {
  const wasmPath = path.join(__dirname, '../../rust/target/wasm32-unknown-unknown/release/zaw_rust_example.wasm')
  const wasmBuffer = fs.readFileSync(wasmPath)
  const api = await initExample(wasmBuffer)

  for (const size of [10, 100, 1_000, 10_000, 100_000]) {
    describe(`XOR Int32Array @ ${size} elements`, () => {
      const values = new Int32Array(size).map(() => (Math.random() * 0x100000000) | 0)

      bench('js', () => {
        let total = 0

        for (let i = values.length; i-- > 0; ) {
          total ^= values[i]
        }
      })

      bench('zaw', () => {
        api.xorInt32Array(values)
      })
    })
  }
})
