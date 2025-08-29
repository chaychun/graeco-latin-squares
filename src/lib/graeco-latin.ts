export interface GraecoLatinSquare {
  latin: number[][]
  greek: number[][]
}

export function getAllMultipliers(n: number): number[] {
  const multipliers: number[] = []
  for (let i = 1; i < n; i++) {
    multipliers.push(i)
  }
  return multipliers
}

export function areMultipliersValid(a: number, b: number, n: number): boolean {
  if (a === b) return false
  if (gcd(a, n) !== 1) return false
  if (gcd(b, n) !== 1) return false
  return gcd(Math.abs(b - a), n) === 1
}

export function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

export function generateGraecoLatinSquare(
  n: number,
  latinMultiplier = 1,
  greekMultiplier = 2
): GraecoLatinSquare {
  const latin: number[][] = []
  const greek: number[][] = []

  for (let i = 0; i < n; i++) {
    latin[i] = []
    greek[i] = []
    for (let j = 0; j < n; j++) {
      latin[i][j] = (i + latinMultiplier * j) % n
      greek[i][j] = (i + greekMultiplier * j) % n
    }
  }

  return { latin, greek }
}

export function generateKlein4GraecoLatin(
  M?: [[number, number], [number, number]]
): GraecoLatinSquare {
  const matrix = M ?? [
    [0, 1],
    [1, 1],
  ]
  const applyM = (v: number) => {
    const x = v & 1
    const y = (v >> 1) & 1
    const xPrime = (matrix[0][0] * x + matrix[0][1] * y) & 1
    const yPrime = (matrix[1][0] * x + matrix[1][1] * y) & 1
    return (yPrime << 1) | xPrime
  }
  const size = 4
  const latin: number[][] = []
  const greek: number[][] = []
  for (let r = 0; r < size; r++) {
    latin[r] = []
    greek[r] = []
    for (let c = 0; c < size; c++) {
      const mxc = applyM(c)
      latin[r][c] = r ^ c
      greek[r][c] = r ^ mxc
    }
  }
  return { latin, greek }
}
