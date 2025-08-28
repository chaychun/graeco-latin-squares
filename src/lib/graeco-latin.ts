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
