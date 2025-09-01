export const PASTEL_PALETTE = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C291",
  "#F5B7B1",
  "#A3E4D7",
]

export const GRAYSCALE_PALETTE = [
  "#000000",
  "#0d0d0d",
  "#1a1a1a",
  "#333333",
  "#4d4d4d",
  "#666666",
  "#737373",
  "#808080",
  "#999999",
  "#b3b3b3",
  "#cccccc",
  "#e6e6e6",
  "#f2f2f2",
]

export const SCIENTIFIC_AMERICAN_59_PALETTE = [
  "#978c84",
  "#68221c",
  "#c67441",
  "#645c60",
  "#b7291d",
  "#cdcb8a",
  "#190d10",
  "#362731",
  "#3d4966",
  "#f9f8f7",
  "#7f6a5a",
  "#8a9a9f",
  "#d0c7b8",
]

export function shiftPalette(palette: string[], shift: number): string[] {
  return palette.map((_color, index) => palette[(index + shift) % palette.length])
}

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

export function shufflePalette(palette: string[], seed: number): string[] {
  const random = mulberry32(seed >>> 0)
  const arr = palette.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}
