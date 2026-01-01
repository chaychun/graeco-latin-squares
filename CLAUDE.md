# CLAUDE.md

This file provides guidance for AI assistants working with this codebase.

## Project Overview

A geometric art generator that creates visual patterns from Graeco-Latin squares. Users select a grid size, construction method, and color palette to generate downloadable SVG/PNG artwork.

**Live behavior**: Each cell displays a background color (from the Latin square) with a centered inner square of a foreground color (from the Greek square).

## Tech Stack

- **Framework**: React 19 with React Compiler (babel-plugin-react-compiler)
- **Build**: Vite 7
- **Language**: TypeScript 5.8
- **Styling**: TailwindCSS v4 (via @tailwindcss/vite plugin)
- **UI Components**: shadcn/ui (Radix primitives)
- **State Management**: Zustand
- **Linting/Formatting**: Biome
- **Testing**: Vitest
- **Package Manager**: pnpm

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # TypeScript check + Vite build
pnpm test         # Run tests once
pnpm test:ui      # Run tests in watch mode
pnpm lint         # Run Biome linter
pnpm lint:fix     # Fix linting issues
pnpm format       # Format code with Biome
pnpm check        # Run all Biome checks with auto-fix
```

## Project Structure

```
src/
├── App.tsx                    # Root component (Display + Controls layout)
├── main.tsx                   # Entry point
├── index.css                  # Global styles, TailwindCSS imports
├── components/
│   ├── display.tsx            # SVG rendering, download buttons, info dialog
│   ├── controls.tsx           # Size/method/palette controls with tabs (mobile) or cards (desktop)
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── core/
│   │   ├── finite-field.ts    # GF(q) arithmetic for prime-power constructions
│   │   └── graeco-latin/
│   │       ├── graeco-latin.ts       # Square generation algorithms
│   │       ├── graeco-latin.test.ts  # Vitest tests for all methods
│   │       ├── graeco-latin-store.ts # Zustand store for square settings
│   │       └── validation.ts         # Method availability per size
│   ├── palette/
│   │   ├── palettes.ts        # Color definitions, shuffle/shift utilities
│   │   └── palette-store.ts   # Zustand store for palette settings
│   ├── export/
│   │   └── downloads.ts       # SVG/PNG export functions
│   └── utils.ts               # cn() helper (clsx + tailwind-merge)
```

## Architecture

### State Management

Two Zustand stores manage application state:

1. **`useGraecoLatinStore`** (`graeco-latin-store.ts`)
   - `size`: Grid dimension (3-13, excluding 6)
   - `method`: "auto" | "finite" | "cyclic" | "difference" | "direct"
   - `latinMultiplier`, `greekMultiplier`: For cyclic method
   - `direct4x4Method`: Component choice for 12x12 direct product

2. **`usePaletteStore`** (`palette-store.ts`)
   - `paletteType`: "pastel" | "grayscale" | "scientific_american_59" | "nord" | "glacier"
   - `backgroundShift`, `foregroundShift`: Rotate colors in palette
   - `paletteSeed`: For deterministic shuffle

### Square Generation Methods

Located in `lib/core/graeco-latin/graeco-latin.ts`:

| Method | Function | Valid Sizes | Notes |
|--------|----------|-------------|-------|
| Cyclic | `generateCyclicGraecoLatin()` | Odd only | Uses row+multiplier*col formula |
| Finite Field | `generateFiniteFieldGraecoLatin()` | Prime powers (3,4,5,7,8,9,11,13) | GF(p^k) construction |
| Difference | `generateMethodOfDifferenceGraecoLatin()` | 4, 10 | Bose-Shrikhande-Parker 1960 |
| Direct Product | `directProductGraecoLatin()` | 12 only | Combines 3x3 and 4x4 |
| Auto | `generateGraecoLatinAuto()` | All supported | Selects best method |

**Size 6 is mathematically impossible** - this is a proven theorem, not a limitation.

### Component Flow

1. `Controls` updates Zustand stores via user interaction
2. `Display` reads stores, calls appropriate generation function
3. Generated square renders as SVG with palette-derived colors
4. Download buttons serialize SVG to file

## Code Style Guidelines

### Must Follow

- **No comments** in code
- **kebab-case** for all file names
- **No semicolons** (configured in Biome)
- **2-space indentation**
- **LF line endings**
- **100 character line width**
- Follow React Compiler requirements (no manual memoization needed)

### UI/UX Conventions

- Use existing shadcn components from `components/ui/`
- Install from shadcn catalog if component doesn't exist
- Extend shadcn styles rather than creating from scratch
- **Aesthetic**: Retro-modern, monochrome, Macintosh System 7 inspired
- **Color palette**: Use neutral grays when gray is needed
- Icons from `pixelarticons` package

### Path Aliases

Use `@/` prefix for imports from `src/`:
```typescript
import { Button } from "@/components/ui/button"
import { usePaletteStore } from "@/lib/palette/palette-store"
```

## Testing

Tests are in `*.test.ts` files alongside source. Current test coverage focuses on mathematical correctness:

- Verifies generated squares are valid Latin squares
- Confirms orthogonality (all pairs unique)
- Tests multiplier validation for cyclic method
- Validates specific known outputs (e.g., 10x10 matches paper)

Run tests before committing changes to core algorithms:
```bash
pnpm test
```

## Key Constraints

1. **6x6 squares don't exist** - Don't try to add support
2. **Multipliers must be coprime** - `areMultipliersValid()` enforces this
3. **Method availability varies by size** - `validation.ts` controls this
4. **React Compiler enabled** - Avoid patterns that break compilation

## Common Tasks

### Adding a new palette

1. Add color array to `lib/palette/palettes.ts`
2. Add type to `PaletteType` in `palette-store.ts`
3. Add to palette switch in `display.tsx` and `controls.tsx`

### Adding a new generation method

1. Implement in `graeco-latin.ts` with signature returning `GraecoLatinSquare`
2. Add tests in `graeco-latin.test.ts`
3. Update `Method` type in `graeco-latin-store.ts`
4. Add availability check in `validation.ts`
5. Update UI in `controls.tsx` and `display.tsx`

### Modifying UI components

1. Check if shadcn has the component: https://ui.shadcn.com
2. Install with: `npx shadcn@latest add <component>`
3. Customize in `components/ui/` directory
