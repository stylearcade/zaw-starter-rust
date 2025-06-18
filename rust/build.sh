#!/bin/bash

set -e

echo "Building Rust WASM package..."

RUSTFLAGS="-C target-feature=+simd128 -C link-arg=--import-memory -C link-arg=--export-memory" cargo build --target wasm32-unknown-unknown --release

echo "Rust WASM build complete!"