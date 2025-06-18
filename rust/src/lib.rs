use zaw::interop;
use zaw::interop::OK;

#[cfg(target_arch = "wasm32")]
use std::arch::wasm32::*;

// Setup all required WASM interop exports
zaw::setup_interop!();

pub fn xor_array_i32(values: &[i32]) -> i32 {
    let mut total = 0i32;

    unsafe {
        let len = values.len();

        const LANES: usize = 4;         // i32x4 has 4 lanes
        const BATCH_SIZE: usize = LANES * 4; // process 4 SIMD vectors per loop

        // Four independent accumulators for ILP
        let mut acc: [v128; 4] = [
            i32x4_splat(0),
            i32x4_splat(0),
            i32x4_splat(0),
            i32x4_splat(0),
        ];
        let mut i = 0;

        // Process in batches of 4 vectors
        while i + BATCH_SIZE <= len {
                let ptr = values.as_ptr().add(i) as *const v128;
                let v0 = v128_load(ptr);
                let v1 = v128_load(ptr.add(1));
                let v2 = v128_load(ptr.add(2));
                let v3 = v128_load(ptr.add(3));

                acc[0] = v128_xor(acc[0], v0);
                acc[1] = v128_xor(acc[1], v1);
                acc[2] = v128_xor(acc[2], v2);
                acc[3] = v128_xor(acc[3], v3);
            i += BATCH_SIZE;
        }

        // Handle any remaining full SIMD chunks
        while i + LANES <= len {
                let ptr = values.as_ptr().add(i) as *const v128;
                let v = v128_load(ptr);
                acc[0] = v128_xor(acc[0], v);
            i += LANES;
        }

        // Reduce the four SIMD accumulators into a scalar total via XOR of each lane
        for &vec in &acc {
            total ^= i32x4_extract_lane::<0>(vec);
            total ^= i32x4_extract_lane::<1>(vec);
            total ^= i32x4_extract_lane::<2>(vec);
            total ^= i32x4_extract_lane::<3>(vec);
        }

        // Handle any remaining scalar tail elements
        while i < len {
            total ^= values[i];
            i += 1;
        }
    }

    total
}

#[no_mangle]
pub extern "C" fn xorInt32Array() -> i32 {
    let input = interop::get_input();
    let output = interop::get_output();

    let values = input.read_array_i32();
    let result = xor_array_i32(&values);

    output.write_i32(result);

    OK
}
