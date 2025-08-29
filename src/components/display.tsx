import { Download } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { downloadPNG, downloadSVG } from "@/lib/downloads"
import {
  type GraecoLatinSquare,
  generateCyclicGraecoLatin,
  generateFiniteFieldGraecoLatin,
  generateGraecoLatinAuto,
  generateKlein4GraecoLatin,
} from "@/lib/graeco-latin"
import {
  GRAYSCALE_PALETTE,
  PASTEL_PALETTE,
  SCIENTIFIC_AMERICAN_59_PALETTE,
  shiftPalette,
} from "@/lib/palettes"
import { useGraecoLatinStore } from "@/lib/store"

export default function Display() {
  const {
    size,
    paletteType,
    backgroundShift,
    foregroundShift,
    latinMultiplier,
    greekMultiplier,
    method,
  } = useGraecoLatinStore()

  const svgRef = useRef<SVGSVGElement>(null)

  let square: GraecoLatinSquare
  if (method === "klein4" && size === 4) {
    square = generateKlein4GraecoLatin()
  } else if (method === "finite") {
    const ff = generateFiniteFieldGraecoLatin(size)
    if (ff) square = ff
    else if (size === 4) square = generateKlein4GraecoLatin()
    else if (size % 2 !== 0)
      square = generateCyclicGraecoLatin(size, latinMultiplier, greekMultiplier)
    else square = generateGraecoLatinAuto(size, { latinMultiplier, greekMultiplier })
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
  const backgroundColors = shiftPalette(basePalette.slice(0, size), backgroundShift)
  const foregroundColors = shiftPalette(basePalette.slice(0, size), foregroundShift)

  const cellSize = 60
  const innerSize = cellSize * 0.4
  const svgSize = size * cellSize

  return (
    <div className="w-full max-w-full lg:max-w-lg xl:max-w-xl">
      <Card>
        <CardContent className="flex justify-center">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-full aspect-square mx-auto">
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              className="w-full h-full"
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
          <Download className="w-4 h-4 mr-2" />
          Download SVG
        </Button>
        <Button
          onClick={() => downloadPNG(svgRef.current, svgSize, size)}
          className="flex-1 bg-white"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PNG
        </Button>
      </div>
    </div>
  )
}
