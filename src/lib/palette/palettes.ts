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
  "#141414",
  "#282828",
  "#3D3D3D",
  "#525252",
  "#676767",
  "#7C7C7C",
  "#919191",
  "#A6A6A6",
  "#BBBBBB",
  "#D0D0D0",
  "#E5E5E5",
  "#FAFAFA",
]

export const SCIENTIFIC_AMERICAN_59_PALETTE = [
  "#8a9a9f",
  "#b7291d",
  "#d0c7b8",
  "#978c84",
  "#3d4966",
  "#7f6a5a",
  "#c67441",
  "#645c60",
  "#cdcb8a",
  "#f9f8f7",
  "#362731",
  "#190d10",
  "#68221c",
]

export const NORD_PALETTE = [
  "#9AB9C8",
  "#B7D7E2",
  "#D8DEE9",
  "#ECEFF4",
  "#B48EAD",
  "#2E3440",
  "#3B4252",
  "#434C5E",
  "#4C566A",
  "#5E81AC",
  "#81A1C1",
  "#88C0D0",
  "#8FBCBB",
]

export const GLACIER_PALETTE = [
  "#7EA7E6",
  "#8FD1D5",
  "#A7E3E5",
  "#E6F3F7",
  "#0B1220",
  "#142034",
  "#1E2A44",
  "#243B53",
  "#2F4A68",
  "#3E5C84",
  "#4E6F9D",
  "#5E82B7",
  "#6E95CF",
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
