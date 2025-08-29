import { describe, expect, it } from "vitest"
import {
  areMultipliersValid,
  generateCyclicGraecoLatin,
  generateFiniteFieldGraecoLatin,
  generateGraecoLatinAuto,
  generateKlein4GraecoLatin,
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

describe("generateFiniteFieldGraecoLatin and Auto", () => {
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
          // eslint-disable-next-line no-console
          console.log(
            `FF n=${n} latinRow0=${ff.latin[0].slice(0, Math.min(8, ff.latin[0].length))} greekRow0=${ff.greek[0].slice(0, Math.min(8, ff.greek[0].length))}`
          )
          // Check column uniqueness for added context
          const col0 = ff.latin.map((row) => row[0])
          const col1 = ff.latin.map((row) => row[1])
          // eslint-disable-next-line no-console
          console.log(`FF n=${n} latinCol0=${col0} latinCol1=${col1}`)
          const latinOk = isLatinSquare(ff.latin)
          const greekOk = isLatinSquare(ff.greek)
          const orthoOk = arePairsOrthogonal(ff.latin, ff.greek)
          if (!latinOk || !greekOk || !orthoOk) {
            // eslint-disable-next-line no-console
            console.error(
              `FF failure for n=${n}: latinOk=${latinOk} greekOk=${greekOk} orthoOk=${orthoOk}`
            )
          }
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

  it("auto prefers finite-field when available, falls back otherwise", () => {
    const auto3 = generateGraecoLatinAuto(3)
    expect(isLatinSquare(auto3.latin)).toBe(true)
    expect(isLatinSquare(auto3.greek)).toBe(true)
    expect(arePairsOrthogonal(auto3.latin, auto3.greek)).toBe(true)

    const auto9 = generateGraecoLatinAuto(9)
    expect(isLatinSquare(auto9.latin)).toBe(true)
    expect(isLatinSquare(auto9.greek)).toBe(true)
    expect(arePairsOrthogonal(auto9.latin, auto9.greek)).toBe(true)

    const auto15 = generateGraecoLatinAuto(15)
    expect(isLatinSquare(auto15.latin)).toBe(true)
    expect(isLatinSquare(auto15.greek)).toBe(true)
    expect(arePairsOrthogonal(auto15.latin, auto15.greek)).toBe(true)
  })
})
