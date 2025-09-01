# Graeco-Latin Square Art Generator

Generate geometric art from orthogonal Latin squares. Each cell pairs a background and foreground color.

## Features

- **Sizes**: 3–13 (excluding 6×6)
- **Methods**: Auto, Finite Field, Cyclic, Method of Difference, Direct Product
- **Cyclic controls**: Adjust Latin/Greek multipliers when using the cyclic method
- **12×12 option**: Choose 4×4 component via Finite Field or Method of Difference
- **Palettes**: Pastel, Grayscale, Scientific American ’59
- **Color tools**: Independent background/foreground shifts, deterministic shuffle with seed, reset
- **Export**: Download SVG or PNG

## Tech Stack

- React 19 + TypeScript
- Vite + TailwindCSS
- shadcn/ui components
- Zustand state management

## Getting Started

```bash
pnpm install
pnpm dev
```

## Supported methods

- **Finite Field**: Standard GF(q) construction for prime powers
- **Cyclic**: Classical cyclic construction for odd orders
- **Method of Difference**: Bose–Shrikhande–Parker (1960)
- **Direct Product**: Product of orthogonal Latin squares (e.g., 3×3 × 4×4 → 12×12)

Further methods will be added in the future that expands the possibility of square sizes.
