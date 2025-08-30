import { create } from "zustand"
import { areMultipliersValid, getAllMultipliers } from "./graeco-latin"
import { validateMethod } from "./method-validation"

export type Method = "auto" | "finite" | "cyclic" | "difference" | "direct"

interface GraecoLatinState {
  size: number
  paletteType: "pastel" | "grayscale" | "scientific_american_59"
  backgroundShift: number
  foregroundShift: number
  paletteSeed: number
  latinMultiplier: number
  greekMultiplier: number
  method: Method
  direct4x4Method: "finite" | "difference"
  setSize: (size: number) => void
  setPaletteType: (paletteType: "pastel" | "grayscale" | "scientific_american_59") => void
  setBackgroundShift: (shift: number) => void
  setForegroundShift: (shift: number) => void
  setPaletteSeed: (seed: number) => void
  setLatinMultiplier: (multiplier: number) => void
  setGreekMultiplier: (multiplier: number) => void
  setMethod: (method: Method) => void
  setDirect4x4Method: (m: "finite" | "difference") => void
  getEffectiveMethod: () => Method
}

export const useGraecoLatinStore = create<GraecoLatinState>((set, get) => ({
  size: 5,
  paletteType: "pastel",
  backgroundShift: 0,
  foregroundShift: 0,
  paletteSeed: 0,
  latinMultiplier: 1,
  greekMultiplier: 2,
  method: "auto",
  direct4x4Method: "finite",
  setSize: (newSize: number) => {
    const { method, latinMultiplier, greekMultiplier } = get()
    const adjustedMethod = validateMethod(method, newSize)
    const available = getAllMultipliers(newSize)

    let nextLatin = latinMultiplier
    let nextGreek = greekMultiplier

    if (!available.includes(nextLatin) || !available.includes(nextGreek) || !areMultipliersValid(nextLatin, nextGreek, newSize)) {
      nextLatin = available[0] || 1
      nextGreek = available.find((m) => m !== nextLatin && areMultipliersValid(nextLatin, m, newSize)) || available[1] || nextLatin || 1
    }

    set({ size: newSize, method: adjustedMethod, latinMultiplier: nextLatin, greekMultiplier: nextGreek })
  },
  setPaletteType: (paletteType: "pastel" | "grayscale" | "scientific_american_59") => set({ paletteType }),
  setBackgroundShift: (backgroundShift: number) => set({ backgroundShift }),
  setForegroundShift: (foregroundShift: number) => set({ foregroundShift }),
  setPaletteSeed: (paletteSeed: number) => set({ paletteSeed }),
  setLatinMultiplier: (latinMultiplier: number) => {
    const { greekMultiplier, size } = get()
    if (!areMultipliersValid(latinMultiplier, greekMultiplier, size)) {
      const available = getAllMultipliers(size)
      const fallback = available.find((m) => m !== greekMultiplier && areMultipliersValid(m, greekMultiplier, size))
      set({ latinMultiplier: fallback ?? latinMultiplier })
      return
    }
    set({ latinMultiplier })
  },
  setGreekMultiplier: (greekMultiplier: number) => {
    const { latinMultiplier, size } = get()
    if (!areMultipliersValid(latinMultiplier, greekMultiplier, size)) {
      const available = getAllMultipliers(size)
      const fallback = available.find((m) => m !== latinMultiplier && areMultipliersValid(latinMultiplier, m, size))
      set({ greekMultiplier: fallback ?? greekMultiplier })
      return
    }
    set({ greekMultiplier })
  },
  setMethod: (next: Method) => {
    const { size } = get()
    set({ method: validateMethod(next, size) })
  },
  setDirect4x4Method: (direct4x4Method: "finite" | "difference") => set({ direct4x4Method }),
  getEffectiveMethod: () => {
    const { method, size } = get()
    return validateMethod(method, size)
  },
}))
