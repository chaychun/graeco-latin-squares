import { create } from "zustand"

export type Method = "auto" | "finite" | "cyclic" | "klein4" | "difference" | "direct"

interface GraecoLatinState {
  size: number
  paletteType: "pastel" | "grayscale" | "scientific_american_59"
  backgroundShift: number
  foregroundShift: number
  latinMultiplier: number
  greekMultiplier: number
  method: Method
  direct4x4Method: "finite" | "difference"
  setSize: (size: number) => void
  setPaletteType: (paletteType: "pastel" | "grayscale" | "scientific_american_59") => void
  setBackgroundShift: (shift: number) => void
  setForegroundShift: (shift: number) => void
  setLatinMultiplier: (multiplier: number) => void
  setGreekMultiplier: (multiplier: number) => void
  setMethod: (method: Method) => void
  setDirect4x4Method: (m: "finite" | "difference") => void
}

export const useGraecoLatinStore = create<GraecoLatinState>((set) => ({
  size: 5,
  paletteType: "pastel",
  backgroundShift: 0,
  foregroundShift: 0,
  latinMultiplier: 1,
  greekMultiplier: 2,
  method: "auto",
  direct4x4Method: "finite",
  setSize: (size: number) => set({ size }),
  setPaletteType: (paletteType: "pastel" | "grayscale" | "scientific_american_59") =>
    set({ paletteType }),
  setBackgroundShift: (backgroundShift: number) => set({ backgroundShift }),
  setForegroundShift: (foregroundShift: number) => set({ foregroundShift }),
  setLatinMultiplier: (latinMultiplier: number) => set({ latinMultiplier }),
  setGreekMultiplier: (greekMultiplier: number) => set({ greekMultiplier }),
  setMethod: (method: Method) => set({ method }),
  setDirect4x4Method: (direct4x4Method: "finite" | "difference") => set({ direct4x4Method }),
}))
