import Download from "pixelarticons/svg/download.svg?react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  directProductGraecoLatin,
  type GraecoLatinSquare,
  generateCyclicGraecoLatin,
  generateFiniteFieldGraecoLatin,
  generateGraecoLatinAuto,
  generateMethodOfDifferenceGraecoLatin,
} from "@/lib/core/graeco-latin/graeco-latin"
import { useGraecoLatinStore } from "@/lib/core/graeco-latin/graeco-latin-store"
import { downloadPNG, downloadSVG } from "@/lib/export/downloads"
import { usePaletteStore } from "@/lib/palette/palette-store"
import {
  GRAYSCALE_PALETTE,
  PASTEL_PALETTE,
  SCIENTIFIC_AMERICAN_59_PALETTE,
  shiftPalette,
  shufflePalette,
} from "@/lib/palette/palettes"

export default function Display() {
  const { size, latinMultiplier, greekMultiplier, method, direct4x4Method } = useGraecoLatinStore()
  const { paletteType, backgroundShift, foregroundShift, paletteSeed } = usePaletteStore()

  const svgRef = useRef<SVGSVGElement>(null)

  let square: GraecoLatinSquare
  if (method === "difference") {
    const m = (size - 1) / 3
    square = generateMethodOfDifferenceGraecoLatin(m)
  } else if (method === "direct") {
    const A = generateCyclicGraecoLatin(3)
    const B =
      direct4x4Method === "difference"
        ? generateMethodOfDifferenceGraecoLatin(1)
        : generateFiniteFieldGraecoLatin(4)!
    square = directProductGraecoLatin(A, B)
  } else if (method === "finite") {
    square = generateFiniteFieldGraecoLatin(size)!
  } else if (method === "cyclic") {
    square = generateCyclicGraecoLatin(size, latinMultiplier, greekMultiplier)
  } else {
    square = generateGraecoLatinAuto(size, { latinMultiplier, greekMultiplier })
  }
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
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
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
          className="flex-1 bg-background"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Download SVG
        </Button>
        <Button
          onClick={() => downloadPNG(svgRef.current, svgSize, size)}
          className="flex-1 bg-background"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PNG
        </Button>
      </div>
    </div>
  )
}
