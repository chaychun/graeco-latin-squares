import { create } from "zustand"

interface GraecoLatinState {
  size: number
  paletteType: "colored" | "grayscale"
  backgroundShift: number
  foregroundShift: number
  latinMultiplier: number
  greekMultiplier: number
  setSize: (size: number) => void
  setPaletteType: (paletteType: "colored" | "grayscale") => void
  setBackgroundShift: (shift: number) => void
  setForegroundShift: (shift: number) => void
  setLatinMultiplier: (multiplier: number) => void
  setGreekMultiplier: (multiplier: number) => void
}

export const useGraecoLatinStore = create<GraecoLatinState>((set) => ({
  size: 5,
  paletteType: "colored",
  backgroundShift: 0,
  foregroundShift: 0,
  latinMultiplier: 1,
  greekMultiplier: 2,
  setSize: (size: number) => set({ size }),
  setPaletteType: (paletteType: "colored" | "grayscale") => set({ paletteType }),
  setBackgroundShift: (backgroundShift: number) => set({ backgroundShift }),
  setForegroundShift: (foregroundShift: number) => set({ foregroundShift }),
  setLatinMultiplier: (latinMultiplier: number) => set({ latinMultiplier }),
  setGreekMultiplier: (greekMultiplier: number) => set({ greekMultiplier }),
}))
