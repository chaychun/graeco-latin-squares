import { describe, expect, it } from "vitest"
import {
  areMultipliersValid,
  directProductGraecoLatin,
  generateCyclicGraecoLatin,
  generateFiniteFieldGraecoLatin,
  generateGraecoLatinAuto,
  generateKlein4GraecoLatin,
  generateMethodOfDifferenceGraecoLatin,
  getAllMultipliers,
} from "./graeco-latin"

const isLatinSquare = (matrix: number[][]) => {
  const n = matrix.length
  for (let i = 0; i < n; i++) {
    const rowSet = new Set(matrix[i])
    if (rowSet.size !== n) return false
  }
  for (let j = 0; j < n; j++) {
    const colSet = new Set<number>()
    for (let i = 0; i < n; i++) colSet.add(matrix[i][j])
    if (colSet.size !== n) return false
  }
  return true
}

const arePairsOrthogonal = (latin: number[][], greek: number[][]) => {
  const n = latin.length
  const seen = new Set<number>()
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const key = latin[i][j] * n + greek[i][j]
      if (seen.has(key)) return false
      seen.add(key)
    }
  }
  return seen.size === n * n
}

describe("generateCyclicGraecoLatin", () => {
  const sizes = [3, 5, 7, 9, 11, 13, 15]

  it("has at least one valid multiplier pair", () => {
    const failures: number[] = []
    for (const n of sizes) {
      const multipliers = getAllMultipliers(n)
      const validPairs = multipliers
        .flatMap((a) => multipliers.map((b) => [a, b] as const))
        .filter(([a, b]) => areMultipliersValid(a, b, n))
      if (validPairs.length === 0) failures.push(n)
    }
    if (failures.length) console.error("No valid multipliers for n:", failures)
    expect(failures).toHaveLength(0)
  })

  it("produces valid Latin squares and orthogonal pairs for all valid multipliers", () => {
    const failures: { n: number; a: number; b: number; reason: string }[] = []
    for (const n of sizes) {
      const multipliers = getAllMultipliers(n)
      for (const a of multipliers) {
        for (const b of multipliers) {
          if (!areMultipliersValid(a, b, n)) continue
          const { latin, greek } = generateCyclicGraecoLatin(n, a, b)
          const latinValid = isLatinSquare(latin)
          const greekValid = isLatinSquare(greek)
          const orthogonal = arePairsOrthogonal(latin, greek)
          if (!latinValid) failures.push({ n, a, b, reason: "latin" })
          else if (!greekValid) failures.push({ n, a, b, reason: "greek" })
          else if (!orthogonal) failures.push({ n, a, b, reason: "orthogonal" })
        }
      }
    }
    if (failures.length) {
      const byN: Record<
        number,
        { total: number; latin: number; greek: number; orthogonal: number; cases: string[] }
      > = {}
      for (const f of failures) {
        if (!byN[f.n]) byN[f.n] = { total: 0, latin: 0, greek: 0, orthogonal: 0, cases: [] }
        byN[f.n].total++
        byN[f.n][f.reason as "latin" | "greek" | "orthogonal"]++
        byN[f.n].cases.push(`(n=${f.n}, a=${f.a}, b=${f.b}, reason=${f.reason})`)
      }
      console.error("Valid-multiplier failures:", failures)
      console.error("Summary by n:", byN)
    }
    expect(failures).toHaveLength(0)
  })

  it("fails orthogonality or Latin property for invalid multiplier pairs", () => {
    const unexpectedPasses: { n: number; a: number; b: number }[] = []
    for (const n of sizes) {
      const multipliers = getAllMultipliers(n)
      for (const a of multipliers) {
        for (const b of multipliers) {
          if (areMultipliersValid(a, b, n)) continue
          const { latin, greek } = generateCyclicGraecoLatin(n, a, b)
          const latinValid = isLatinSquare(latin)
          const greekValid = isLatinSquare(greek)
          const orthogonal = arePairsOrthogonal(latin, greek)
          if (latinValid && greekValid && orthogonal) unexpectedPasses.push({ n, a, b })
        }
      }
    }
    if (unexpectedPasses.length) {
      console.error("Invalid-multiplier unexpected passes:", unexpectedPasses)
    }
    expect(unexpectedPasses).toHaveLength(0)
  })

  it("throws for even sizes", () => {
    expect(() => generateCyclicGraecoLatin(4, 1, 3)).toThrow()
    expect(() => generateCyclicGraecoLatin(8, 1, 3)).toThrow()
  })
})

describe("generateMethodOfDifferenceGraecoLatin", () => {
  it("produces Latin/orthogonal for odd m", () => {
    const ms = [1, 3, 5]
    for (const m of ms) {
      const { latin, greek } = generateMethodOfDifferenceGraecoLatin(m)
      expect(latin.length).toBe(3 * m + 1)
      expect(greek.length).toBe(3 * m + 1)
      expect(isLatinSquare(latin)).toBe(true)
      expect(isLatinSquare(greek)).toBe(true)
      expect(arePairsOrthogonal(latin, greek)).toBe(true)
    }
  })

  it("matches the 10x10 pair from the paper for m=3", () => {
    const { latin, greek } = generateMethodOfDifferenceGraecoLatin(3)
    const A = [
      [0, 6, 5, 4, 9, 8, 7, 1, 2, 3],
      [7, 1, 0, 6, 5, 9, 8, 2, 3, 4],
      [8, 7, 2, 1, 0, 6, 9, 3, 4, 5],
      [9, 8, 7, 3, 2, 1, 0, 4, 5, 6],
      [1, 9, 8, 7, 4, 3, 2, 5, 6, 0],
      [3, 2, 9, 8, 7, 5, 4, 6, 0, 1],
      [5, 4, 3, 9, 8, 7, 6, 0, 1, 2],
      [2, 3, 4, 5, 6, 0, 1, 7, 8, 9],
      [4, 5, 6, 0, 1, 2, 3, 8, 9, 7],
      [6, 0, 1, 2, 3, 4, 5, 9, 7, 8],
    ]
    const B = [
      [0, 7, 8, 9, 1, 3, 5, 2, 4, 6],
      [6, 1, 7, 8, 9, 2, 4, 3, 5, 0],
      [5, 0, 2, 7, 8, 9, 3, 4, 6, 1],
      [4, 6, 1, 3, 7, 8, 9, 5, 0, 2],
      [9, 5, 0, 2, 4, 7, 8, 6, 1, 3],
      [8, 9, 6, 1, 3, 5, 7, 0, 2, 4],
      [7, 8, 9, 0, 2, 4, 6, 1, 3, 5],
      [1, 2, 3, 4, 5, 6, 0, 7, 8, 9],
      [2, 3, 4, 5, 6, 0, 1, 9, 7, 8],
      [3, 4, 5, 6, 0, 1, 2, 8, 9, 7],
    ]
    const toPairs = (L: number[][], G: number[][]) =>
      L.map((row, i) => row.map((a, j) => `${a}${G[i][j]}`))
    if (
      JSON.stringify(latin) !== JSON.stringify(A) ||
      JSON.stringify(greek) !== JSON.stringify(B)
    ) {
      const diffs: { i: number; j: number; got: [number, number]; exp: [number, number] }[] = []
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const got: [number, number] = [latin[i][j], greek[i][j]]
          const exp: [number, number] = [A[i][j], B[i][j]]
          if (got[0] !== exp[0] || got[1] !== exp[1]) diffs.push({ i, j, got, exp })
        }
      }
      console.log(
        "m=3 generated pair grid:\n" +
          toPairs(latin, greek)
            .map((r) => r.join(" "))
            .join("\n")
      )
      console.log(
        "expected pair grid:\n" +
          toPairs(A, B)
            .map((r) => r.join(" "))
            .join("\n")
      )
      console.log("diff cells:", diffs)
    }
    expect(latin).toEqual(A)
    expect(greek).toEqual(B)
  })
})

describe("generateKlein4GraecoLatin", () => {
  it("produces 4x4 Latin squares and orthogonal pairs for default M", () => {
    const { latin, greek } = generateKlein4GraecoLatin()
    expect(latin.length).toBe(4)
    expect(greek.length).toBe(4)
    expect(isLatinSquare(latin)).toBe(true)
    expect(isLatinSquare(greek)).toBe(true)
    expect(arePairsOrthogonal(latin, greek)).toBe(true)
  })

  it("matches the explicit example pairs for M=[[0,1],[1,1]] up to labels", () => {
    const { latin, greek } = generateKlein4GraecoLatin([
      [0, 1],
      [1, 1],
    ])
    const expectedPairs = [
      [
        [0, 0],
        [1, 2],
        [2, 3],
        [3, 1],
      ],
      [
        [1, 1],
        [0, 3],
        [3, 2],
        [2, 0],
      ],
      [
        [2, 2],
        [3, 0],
        [0, 1],
        [1, 3],
      ],
      [
        [3, 3],
        [2, 1],
        [1, 0],
        [0, 2],
      ],
    ]
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        expect([latin[i][j], greek[i][j]]).toEqual(expectedPairs[i][j])
      }
    }
  })
})

describe("generateFiniteFieldGraecoLatin", () => {
  const sizes = [3, 4, 5, 7, 8, 9]
  it("produces Latin/orthogonal for prime powers via finite field", () => {
    const failures: number[] = []
    for (const n of sizes) {
      const isPrimePower = (() => {
        const check = (x: number) => {
          if (x < 2) return false
          for (let d = 2; d * d <= x; d++) if (x % d === 0) return false
          return true
        }
        if (check(n)) return true
        for (let p = 2; p <= n; p++) {
          let m = n
          let k = 0
          while (m % p === 0) {
            m = Math.floor(m / p)
            k++
          }
          if (m === 1 && k > 1) return true
        }
        return false
      })()
      const ff = generateFiniteFieldGraecoLatin(n)
      if (isPrimePower) {
        if (!ff) failures.push(n)
        else {
          const latinOk = isLatinSquare(ff.latin)
          const greekOk = isLatinSquare(ff.greek)
          const orthoOk = arePairsOrthogonal(ff.latin, ff.greek)
          expect(latinOk).toBe(true)
          expect(greekOk).toBe(true)
          expect(orthoOk).toBe(true)
        }
      } else {
        expect(ff).toBeNull()
      }
    }
    expect(failures).toHaveLength(0)
  })
})

describe("directProductGraecoLatin", () => {
  it("constructs 12 = 3*4 from 3 and 4", () => {
    const A = generateCyclicGraecoLatin(3)
    const B = generateKlein4GraecoLatin()
    const C = directProductGraecoLatin(A, B)
    expect(C.latin.length).toBe(12)
    expect(C.greek.length).toBe(12)
    const isLatin = (M: number[][]) => {
      const n = M.length
      for (let i = 0; i < n; i++) if (new Set(M[i]).size !== n) return false
      for (let j = 0; j < n; j++) {
        const s = new Set<number>()
        for (let i = 0; i < n; i++) s.add(M[i][j])
        if (s.size !== n) return false
      }
      return true
    }
    const ortho = (L: number[][], G: number[][]) => {
      const n = L.length
      const seen = new Set<number>()
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const key = L[i][j] * (n * n) + G[i][j]
          if (seen.has(key)) return false
          seen.add(key)
        }
      }
      return seen.size === n * n
    }
    expect(isLatin(C.latin)).toBe(true)
    expect(isLatin(C.greek)).toBe(true)
    expect(ortho(C.latin, C.greek)).toBe(true)
  })
})

describe("generateGraecoLatinAuto selection", () => {
  it("uses cyclic for prime odd (k=1) sizes", () => {
    const auto3 = generateGraecoLatinAuto(3)
    const cyc3 = generateCyclicGraecoLatin(3)
    expect(auto3).toEqual(cyc3)
  })

  it("uses finite-field for prime-power k>1", () => {
    const auto9 = generateGraecoLatinAuto(9)
    const ff9 = generateFiniteFieldGraecoLatin(9)
    expect(ff9).not.toBeNull()
    expect(auto9).toEqual(ff9)
  })

  it("falls back to cyclic for odd non-prime-power", () => {
    const auto15 = generateGraecoLatinAuto(15)
    const cyc15 = generateCyclicGraecoLatin(15)
    expect(auto15).toEqual(cyc15)
  })

  it("uses method-of-difference for n=10", () => {
    const auto10 = generateGraecoLatinAuto(10)
    const diff10 = generateMethodOfDifferenceGraecoLatin(3)
    expect(auto10).toEqual(diff10)
  })
})
