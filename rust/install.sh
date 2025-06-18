#!/bin/bash
set -e

# Install Rust
if ! command -v rustup &> /dev/null; then
  echo "Installing rust..."
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
fi

echo "Installing/updating Rust stable toolchain..."
rustup toolchain install stable
rustup target add wasm32-unknown-unknown

if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi
