import { create } from "zustand"

type PaletteType = "pastel" | "grayscale" | "scientific_american_59" | "nord" | "glacier"

interface PaletteState {
  paletteType: PaletteType
  backgroundShift: number
  foregroundShift: number
  paletteSeed: number
  setPaletteType: (paletteType: PaletteType) => void
  setBackgroundShift: (shift: number) => void
  setForegroundShift: (shift: number) => void
  setPaletteSeed: (seed: number) => void
}

export const usePaletteStore = create<PaletteState>((set) => ({
  paletteType: "nord",
  backgroundShift: 0,
  foregroundShift: 0,
  paletteSeed: 0,
  setPaletteType: (paletteType: PaletteType) => set({ paletteType }),
  setBackgroundShift: (backgroundShift: number) => set({ backgroundShift }),
  setForegroundShift: (foregroundShift: number) => set({ foregroundShift }),
  setPaletteSeed: (paletteSeed: number) => set({ paletteSeed }),
}))
