import { primePowerDecomposition } from "./finite-field"
import { isMethodOfDifferenceSupported } from "./graeco-latin"
import type { Method } from "./graeco-latin-store"

export function isMethodValid(method: Method, size: number): boolean {
  if (method === "auto") return true
  if (method === "cyclic") return size % 2 !== 0
  if (method === "finite") return !!primePowerDecomposition(size)
  if (method === "difference") return isMethodOfDifferenceSupported(size)
  if (method === "direct") return size === 12
  return false
}

export function validateMethod(method: Method, size: number): Method {
  return isMethodValid(method, size) ? method : "auto"
}
