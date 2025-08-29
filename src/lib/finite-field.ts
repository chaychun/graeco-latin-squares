export function primePowerDecomposition(n: number): { p: number; k: number } | null {
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

export function toVector(x: number, p: number, k: number): number[] {
  const v: number[] = new Array(k).fill(0)
  let m = x
  for (let i = 0; i < k; i++) {
    v[i] = m % p
    m = Math.floor(m / p)
  }
  return v
}

export function fromVector(v: number[], p: number): number {
  let x = 0
  let mult = 1
  for (let i = 0; i < v.length; i++) {
    x += v[i] * mult
    mult *= p
  }
  return x
}

function trimZeros(a: number[]): number[] {
  let end = a.length - 1
  while (end > 0 && a[end] === 0) end--
  return a.slice(0, end + 1)
}

export function polyAdd(a: number[], b: number[], p: number): number[] {
  const n = Math.max(a.length, b.length)
  const out = new Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    const ai = i < a.length ? a[i] : 0
    const bi = i < b.length ? b[i] : 0
    out[i] = (ai + bi) % p
  }
  return trimZeros(out)
}

export function polySub(a: number[], b: number[], p: number): number[] {
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

export function getIrreduciblePoly(p: number, k: number): number[] | null {
  if (k <= 1) return [1]
  if (p === 2 && k === 2) return [1, 1, 1]
  if (p === 2 && k === 3) return [1, 1, 0, 1]
  if (p === 3 && k === 2) return [1, 0, 1]
  return null
}

export function gfMul(a: number[], b: number[], p: number, modPoly: number[]): number[] {
  if (modPoly.length === 1) {
    return [((a[0] || 0) * (b[0] || 0)) % p]
  }
  return polyMod(polyMul(a, b, p), modPoly, p)
}

export function gfIsZero(a: number[]): boolean {
  for (let i = 0; i < a.length; i++) if (a[i] !== 0) return false
  return true
}
