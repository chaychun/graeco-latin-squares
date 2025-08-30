import { Download } from "lucide-react"
import { useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { downloadPNG, downloadSVG } from "@/lib/downloads"
import {
  directProductGraecoLatin,
  type GraecoLatinSquare,
  generateCyclicGraecoLatin,
  generateFiniteFieldGraecoLatin,
  generateGraecoLatinAuto,
  generateMethodOfDifferenceGraecoLatin,
} from "@/lib/graeco-latin"
import {
  GRAYSCALE_PALETTE,
  PASTEL_PALETTE,
  SCIENTIFIC_AMERICAN_59_PALETTE,
  shiftPalette,
  shufflePalette,
} from "@/lib/palettes"
import { useGraecoLatinStore } from "@/lib/store"
import { useShallow } from "zustand/react/shallow"

export default function Display() {
  const {
    size,
    paletteType,
    backgroundShift,
    foregroundShift,
    paletteSeed,
    latinMultiplier,
    greekMultiplier,
    direct4x4Method,
    getEffectiveMethod,
  } = useGraecoLatinStore(
    useShallow((s) => ({
      size: s.size,
      paletteType: s.paletteType,
      backgroundShift: s.backgroundShift,
      foregroundShift: s.foregroundShift,
      paletteSeed: s.paletteSeed,
      latinMultiplier: s.latinMultiplier,
      greekMultiplier: s.greekMultiplier,
      direct4x4Method: s.direct4x4Method,
      getEffectiveMethod: s.getEffectiveMethod,
    }))
  )

  const svgRef = useRef<SVGSVGElement>(null)

  const effectiveMethod = getEffectiveMethod()

  const square: GraecoLatinSquare = useMemo(() => {
    if (size === 12 && (effectiveMethod === "auto" || effectiveMethod === "direct")) {
      const A = generateCyclicGraecoLatin(3)
      const B =
        direct4x4Method === "difference"
          ? generateMethodOfDifferenceGraecoLatin(1)
          : generateFiniteFieldGraecoLatin(4)!
      return directProductGraecoLatin(A, B)
    }
    if (effectiveMethod === "difference") {
      const m = (size - 1) / 3
      return generateMethodOfDifferenceGraecoLatin(m)
    }
    if (effectiveMethod === "finite") {
      const ff = generateFiniteFieldGraecoLatin(size)
      if (ff) return ff
      if (size % 2 !== 0) return generateCyclicGraecoLatin(size, latinMultiplier, greekMultiplier)
      return generateGraecoLatinAuto(size, { latinMultiplier, greekMultiplier })
    }
    if (effectiveMethod === "cyclic") {
      return generateCyclicGraecoLatin(size, latinMultiplier, greekMultiplier)
    }
    return generateGraecoLatinAuto(size, { latinMultiplier, greekMultiplier })
  }, [size, effectiveMethod, direct4x4Method, latinMultiplier, greekMultiplier])

  const basePalette =
    paletteType === "pastel"
      ? PASTEL_PALETTE
      : paletteType === "grayscale"
        ? GRAYSCALE_PALETTE
        : SCIENTIFIC_AMERICAN_59_PALETTE
  const effectivePalette =
    paletteSeed === 0 ? basePalette : shufflePalette(basePalette, paletteSeed)
  const backgroundColors = shiftPalette(effectivePalette, backgroundShift).slice(0, size)
  const foregroundColors = shiftPalette(effectivePalette, foregroundShift).slice(0, size)

  const cellSize = 60
  const innerSize = cellSize * 0.4
  const svgSize = size * cellSize

  return (
    <div className="w-full max-w-full lg:max-w-lg xl:max-w-xl">
      <Card>
        <CardContent className="flex justify-center">
          <div className="mx-auto aspect-square w-full max-w-sm sm:max-w-md lg:max-w-full">
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {square.latin.map((row, i) =>
                row.map((latinValue, j) => {
                  const greekValue = square.greek[i][j]
                  const x = j * cellSize
                  const y = i * cellSize
                  const innerX = x + (cellSize - innerSize) / 2
                  const innerY = y + (cellSize - innerSize) / 2

                  return (
                    <g key={`${latinValue}-${greekValue}`}>
                      <rect
                        x={x}
                        y={y}
                        width={cellSize}
                        height={cellSize}
                        fill={backgroundColors[latinValue]}
                      />
                      <rect
                        x={innerX}
                        y={innerY}
                        width={innerSize}
                        height={innerSize}
                        fill={foregroundColors[greekValue]}
                      />
                    </g>
                  )
                })
              )}
            </svg>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 flex gap-2">
        <Button
          onClick={() => downloadSVG(svgRef.current, size)}
          className="flex-1 bg-white"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Download SVG
        </Button>
        <Button
          onClick={() => downloadPNG(svgRef.current, svgSize, size)}
          className="flex-1 bg-white"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PNG
        </Button>
      </div>
    </div>
  )
}
