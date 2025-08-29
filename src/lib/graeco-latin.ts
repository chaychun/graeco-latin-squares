export interface GraecoLatinSquare {
  latin: number[][]
  greek: number[][]
}

import {
  fromVector,
  getIrreduciblePoly,
  gfIsZero,
  gfMul,
  polyAdd,
  polySub,
  primePowerDecomposition,
  toVector,
} from "./finite-field"

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

export function generateCyclicGraecoLatin(
  n: number,
  latinMultiplier = 1,
  greekMultiplier = 2
): GraecoLatinSquare {
  if (n % 2 === 0) throw new Error("Cyclic method not allowed for even sizes")
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

export function generateFiniteFieldGraecoLatin(
  n: number,
  matrix?: [[number, number], [number, number]]
): GraecoLatinSquare | null {
  const dec = primePowerDecomposition(n)
  if (!dec) return null
  const { p, k } = dec
  const modPoly = getIrreduciblePoly(p, k)
  if (!modPoly) return null
  if (k === 1) {
    const toInt = (x: number) => {
      let m = x % p
      if (m < 0) m += p
      return m
    }
    const defaults = { a: 1, b: 1, c: 1, d: toInt(2) }
    const a = matrix ? toInt(matrix[0][0]) : defaults.a
    const b = matrix ? toInt(matrix[0][1]) : defaults.b
    const c = matrix ? toInt(matrix[1][0]) : defaults.c
    const d = matrix ? toInt(matrix[1][1]) : defaults.d
    let det = (a * d - b * c) % p
    if (det < 0) det += p
    if (det === 0) return null
    const latin: number[][] = []
    const greek: number[][] = []
    for (let i = 0; i < n; i++) {
      latin[i] = []
      greek[i] = []
      for (let j = 0; j < n; j++) {
        const l = (a * i + b * j) % p
        const g = (c * i + d * j) % p
        latin[i][j] = l
        greek[i][j] = g
      }
    }
    return { latin, greek }
  }
  const one: number[] = new Array(k).fill(0)
  one[0] = 1
  const alpha: number[] = (() => {
    const v = new Array(k).fill(0)
    v[1] = 1
    return v
  })()
  const toElt = (x: number) => toVector(((x % n) + n) % n, p, k)
  const a = matrix ? toElt(matrix[0][0]) : one
  const b = matrix ? toElt(matrix[0][1]) : one
  const c = matrix ? toElt(matrix[1][0]) : one
  const d = matrix ? toElt(matrix[1][1]) : alpha
  const det = polySub(gfMul(a, d, p, modPoly), gfMul(b, c, p, modPoly), p)
  if (gfIsZero(det)) return null
  const latin: number[][] = []
  const greek: number[][] = []
  for (let i = 0; i < n; i++) {
    latin[i] = []
    greek[i] = []
    const vi = toVector(i, p, k)
    for (let j = 0; j < n; j++) {
      const vj = toVector(j, p, k)
      const l = polyAdd(gfMul(a, vi, p, modPoly), gfMul(b, vj, p, modPoly), p)
      const g = polyAdd(gfMul(c, vi, p, modPoly), gfMul(d, vj, p, modPoly), p)
      latin[i][j] = fromVector(l, p)
      greek[i][j] = fromVector(g, p)
    }
  }
  return { latin, greek }
}

export function generateGraecoLatinAuto(
  n: number,
  opts?: {
    matrix?: [[number, number], [number, number]]
    latinMultiplier?: number
    greekMultiplier?: number
  }
): GraecoLatinSquare {
  const dec = primePowerDecomposition(n)
  if (n % 2 === 0) {
    const ffEven = generateFiniteFieldGraecoLatin(n, opts?.matrix)
    if (ffEven) return ffEven
    throw new Error("No valid construction for even size without finite field support")
  }
  if (dec && dec.k > 1) {
    const ff = generateFiniteFieldGraecoLatin(n, opts?.matrix)
    if (ff) return ff
  }
  return generateCyclicGraecoLatin(n, opts?.latinMultiplier ?? 1, opts?.greekMultiplier ?? 2)
}
