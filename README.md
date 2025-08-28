# Graeco-Latin Square Art Generator

Generate beautiful geometric art using orthogonal Latin squares. Each cell contains a unique combination of background and foreground colors arranged in mathematical harmony.

## Features

- **Mathematical Construction**: Based on Graeco-Latin squares with orthogonal Latin multipliers
- **Interactive Controls**: Adjust grid size (3×3, 5×5, 7×7, 9×9), multipliers, and color palettes
- **Color Palettes**: Choose between pastel or grayscale palettes
- **Color Shifting**: Rotate background and foreground color assignments
- **Export Options**: Download generated art as SVG or PNG

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

## Mathematical Background

A Graeco-Latin square is a mathematical arrangement where each cell contains a unique ordered pair (Latin symbol, Greek symbol). This implementation uses the construction:

- **Latin Square**: L(i,j) = (i + a·j) mod n
- **Greek Square**: G(i,j) = (i + b·j) mod n

Where n is odd and the multipliers a and b satisfy gcd(|b-a|, n) = 1.
