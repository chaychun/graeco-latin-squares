import { create } from "zustand"
import { areMultipliersValid, getAllMultipliers } from "./graeco-latin"
import { validateMethod } from "./method-validation"

export type Method = "auto" | "finite" | "cyclic" | "difference" | "direct"

interface GraecoLatinState {
  size: number
  latinMultiplier: number
  greekMultiplier: number
  method: Method
  direct4x4Method: "finite" | "difference"
  setSize: (size: number) => void
  setLatinMultiplier: (multiplier: number) => void
  setGreekMultiplier: (multiplier: number) => void
  setMethod: (method: Method) => void
  setDirect4x4Method: (m: "finite" | "difference") => void
}

export const useGraecoLatinStore = create<GraecoLatinState>((set) => ({
  size: 5,
  latinMultiplier: 1,
  greekMultiplier: 2,
  method: "auto",
  direct4x4Method: "finite",
  setSize: (newSize: number) =>
    set((state) => {
      if (newSize === 6) return {}
      const nextMethod = validateMethod(state.method, newSize)
      const candidates = getAllMultipliers(newSize)
      let nextLatin = state.latinMultiplier
      let nextGreek = state.greekMultiplier
      if (!areMultipliersValid(nextLatin, nextGreek, newSize)) {
        nextLatin =
          candidates.find((m) => m !== nextGreek && areMultipliersValid(m, nextGreek, newSize)) ??
          candidates[0] ??
          1
        if (!areMultipliersValid(nextLatin, nextGreek, newSize)) {
          nextGreek =
            candidates.find((m) => m !== nextLatin && areMultipliersValid(nextLatin, m, newSize)) ??
            candidates[1] ??
            candidates[0] ??
            2
        }
      }
      return {
        size: newSize,
        method: nextMethod,
        latinMultiplier: nextLatin,
        greekMultiplier: nextGreek,
      }
    }),
  setLatinMultiplier: (latinMultiplier: number) =>
    set((state) => {
      const n = state.size
      let nextGreek = state.greekMultiplier
      if (!areMultipliersValid(latinMultiplier, nextGreek, n)) {
        const candidates = getAllMultipliers(n)
        nextGreek =
          candidates.find(
            (m) => m !== latinMultiplier && areMultipliersValid(latinMultiplier, m, n)
          ) ?? state.greekMultiplier
      }
      return { latinMultiplier, greekMultiplier: nextGreek }
    }),
  setGreekMultiplier: (greekMultiplier: number) =>
    set((state) => {
      const n = state.size
      let nextLatin = state.latinMultiplier
      if (!areMultipliersValid(nextLatin, greekMultiplier, n)) {
        const candidates = getAllMultipliers(n)
        nextLatin =
          candidates.find(
            (m) => m !== greekMultiplier && areMultipliersValid(m, greekMultiplier, n)
          ) ?? state.latinMultiplier
      }
      return { greekMultiplier, latinMultiplier: nextLatin }
    }),
  setMethod: (method: Method) =>
    set((state) => {
      const next = validateMethod(method, state.size)
      return { method: next }
    }),
  setDirect4x4Method: (direct4x4Method: "finite" | "difference") => set({ direct4x4Method }),
}))
