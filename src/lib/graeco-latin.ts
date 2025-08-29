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

function primePowerDecomposition(n: number): { p: number; k: number } | null {
  if (n < 2) return null
  let p = 0
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      p = d
      break
    }
  }
  if (p === 0) return { p: n, k: 1 }
  let k = 0
  let m = n
  while (m % p === 0) {
    m = Math.floor(m / p)
    k++
  }
  if (m !== 1) return null
  return { p, k }
}

function toVector(x: number, p: number, k: number): number[] {
  const v: number[] = new Array(k).fill(0)
  let m = x
  for (let i = 0; i < k; i++) {
    v[i] = m % p
    m = Math.floor(m / p)
  }
  return v
}

function fromVector(v: number[], p: number): number {
  let x = 0
  let mult = 1
  for (let i = 0; i < v.length; i++) {
    x += v[i] * mult
    mult *= p
  }
  return x
}

function addVec(a: number[], b: number[], p: number): number[] {
  const k = a.length
  const out: number[] = new Array(k)
  for (let i = 0; i < k; i++) out[i] = (a[i] + b[i]) % p
  return out
}

function scaleVec(c: number, v: number[], p: number): number[] {
  const k = v.length
  const out: number[] = new Array(k)
  for (let i = 0; i < k; i++) out[i] = (c * v[i]) % p
  return out
}

function trimZeros(a: number[]): number[] {
  let end = a.length - 1
  while (end > 0 && a[end] === 0) end--
  return a.slice(0, end + 1)
}

function polyAdd(a: number[], b: number[], p: number): number[] {
  const n = Math.max(a.length, b.length)
  const out = new Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    const ai = i < a.length ? a[i] : 0
    const bi = i < b.length ? b[i] : 0
    out[i] = (ai + bi) % p
  }
  return trimZeros(out)
}

function polySub(a: number[], b: number[], p: number): number[] {
  const n = Math.max(a.length, b.length)
  const out = new Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    const ai = i < a.length ? a[i] : 0
    const bi = i < b.length ? b[i] : 0
    out[i] = (ai - bi) % p
    if (out[i] < 0) out[i] += p
  }
  return trimZeros(out)
}

function polyMul(a: number[], b: number[], p: number): number[] {
  const out = new Array(a.length + b.length - 1).fill(0)
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      out[i + j] = (out[i + j] + a[i] * b[j]) % p
    }
  }
  return trimZeros(out)
}

function polyMod(a: number[], modPoly: number[], p: number): number[] {
  let r = a.slice()
  const k = modPoly.length - 1
  const lead = modPoly[k]
  for (;;) {
    r = trimZeros(r)
    if (r.length - 1 < k) break
    const diff = r.length - 1 - k
    const coeff = r[r.length - 1]
    if (coeff !== 0) {
      for (let i = 0; i <= k; i++) {
        const idx = i + diff
        const sub = (coeff * modPoly[i]) % p
        r[idx] = (r[idx] - sub) % p
        if (r[idx] < 0) r[idx] += p
      }
    } else {
      r.pop()
    }
  }
  return trimZeros(r)
}

function getIrreduciblePoly(p: number, k: number): number[] | null {
  if (k <= 1) return [1]
  if (p === 2 && k === 2) return [1, 1, 1]
  if (p === 2 && k === 3) return [1, 1, 0, 1]
  if (p === 3 && k === 2) return [1, 0, 1]
  return null
}

function gfAdd(a: number[], b: number[], p: number): number[] {
  return polyAdd(a, b, p)
}

function gfSub(a: number[], b: number[], p: number): number[] {
  return polySub(a, b, p)
}

function gfMul(a: number[], b: number[], p: number, modPoly: number[]): number[] {
  if (modPoly.length === 1) {
    return [((a[0] || 0) * (b[0] || 0)) % p]
  }
  return polyMod(polyMul(a, b, p), modPoly, p)
}

function gfIsZero(a: number[]): boolean {
  for (let i = 0; i < a.length; i++) if (a[i] !== 0) return false
  return true
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
  const one: number[] = new Array(k).fill(0)
  one[0] = 1
  const alpha: number[] =
    k === 1
      ? [((2 % p) + p) % p]
      : (() => {
          const v = new Array(k).fill(0)
          v[1] = 1
          return v
        })()
  const a = one
  const b = one
  const c = one
  const d = alpha
  const det = gfSub(gfMul(a, d, p, modPoly), gfMul(b, c, p, modPoly), p)
  if (gfIsZero(det)) return null
  const latin: number[][] = []
  const greek: number[][] = []
  for (let i = 0; i < n; i++) {
    latin[i] = []
    greek[i] = []
    const vi = toVector(i, p, k)
    for (let j = 0; j < n; j++) {
      const vj = toVector(j, p, k)
      const l = gfAdd(gfMul(a, vi, p, modPoly), gfMul(b, vj, p, modPoly), p)
      const g = gfAdd(gfMul(c, vi, p, modPoly), gfMul(d, vj, p, modPoly), p)
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
