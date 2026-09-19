#!/usr/bin/env bash
set -euo pipefail
clang++-18 --target=wasm32 -std=c++17 -O3 -msimd128 -mbulk-memory -ffreestanding -nostdlib -fno-exceptions -fno-rtti -Wl,--no-entry -Wl,--export-all -Wl,--export-memory -Wl,--initial-memory=134217728 -Wl,--max-memory=134217728 -Wl,-z,stack-size=2097152 src/own-engine/kernel.cpp -o src/own-engine/kernel.wasm
