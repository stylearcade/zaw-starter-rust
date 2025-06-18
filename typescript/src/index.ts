import { createInstance } from 'zaw'

type ExampleExports = {
  xorInt32Array: () => 0 | 1
}

export type ExampleAPI = {
  xorInt32Array: (values: Int32Array) => number
}

export async function initExample(wasmBuffer: Buffer): Promise<ExampleAPI> {
  const instance = await createInstance<ExampleExports>(wasmBuffer, {
    inputChannelSize: 1_000_000,
    outputChannelSize: 1_000_000,
    log: message => console.log(message),
  })

  return {
    xorInt32Array: instance.bind(
      instance.exports.xorInt32Array,
      (input, [values]) => input.copyInt32Array(values),
      output => output.readInt32(),
    ),
  }
}
