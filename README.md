# zaw Starter - Rust/TypeScript

A [Zero-Allocation WASM (zaw)](https://github.com/stylearcade/zaw) starter template demonstrating SIMD-optimized XOR Int32Array operations using Rust WASM and TypeScript.

## Structure

```
├── rust/           # Rust WASM implementation with SIMD
├── typescript/     # TypeScript host with tests and benchmarks
└── package.json    # Build orchestration
```

## Quick Start

1. Install TypeScript & Rust dependencies:

```bash
npm run install
```

2. Build everything:

```bash
npm run build
```

3. Run tests:

```bash
npm test
```

4. Run benchmarks:

```bash
npm run bench
```

## Requirements

- Rust (latest stable)
- Node.js (18+)
