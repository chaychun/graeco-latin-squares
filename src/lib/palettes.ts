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
]

export const GRAYSCALE_PALETTE = [
  "#000000",
  "#1a1a1a",
  "#333333",
  "#4d4d4d",
  "#666666",
  "#808080",
  "#999999",
  "#b3b3b3",
  "#cccccc",
  "#e6e6e6",
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
]

export function shiftPalette(palette: string[], shift: number): string[] {
  return palette.map((_color, index) => palette[(index + shift) % palette.length])
}
