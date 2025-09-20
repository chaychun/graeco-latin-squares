import Download from "pixelarticons/svg/download.svg?react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
  GLACIER_PALETTE,
  GRAYSCALE_PALETTE,
  NORD_PALETTE,
  PASTEL_PALETTE,
  SCIENTIFIC_AMERICAN_59_PALETTE,
  shiftPalette,
  shufflePalette,
} from "@/lib/palette/palettes"
import { Info } from "lucide-react"

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
        : paletteType === "scientific_american_59"
          ? SCIENTIFIC_AMERICAN_59_PALETTE
          : paletteType === "nord"
            ? NORD_PALETTE
            : GLACIER_PALETTE
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
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <CardTitle>Graeco-Latin Square</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Info className="h-4 w-4" />
                <span className="sr-only">About Graeco-Latin squares</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
              <Card>
                <CardHeader>
                  <CardTitle>Understanding Graeco-Latin Squares</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-sm sm:text-base">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base">What am I looking at?</h3>
                    <p>
                      This is called a <em>Graeco-Latin square</em>. It’s a mathematical
                      structure similar to a Sudoku grid, but with a twist. The rules are:
                    </p>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>
                        Take an <em>n</em> by <em>n</em> grid. Fill it with <em>n</em> “symbols”
                        (numbers, letters, or in our case <em>colors</em>) so that each row and
                        each column has all <em>n</em> symbols, each exactly once.
                      </li>
                      <li>
                        Take two of these squares (not necessarily with the same set of symbols)
                        and put one on top of another. Each cell now contains two symbols instead
                        of one. The order matters.
                      </li>
                      <li>
                        Do it in a way that each cell is unique, or equivalently, that every
                        possible pair of symbols show up, each exactly once.
                      </li>
                    </ul>
                    <p>
                      Because of the constraints, the squares can sometimes look mesmerizing. Try
                      fiddling with the controls to see different patterns. Different sizes also
                      support different generation methods, which can yield different results.
                    </p>
                    <p>If you want to see the underlying pattern better, I recommend switching to the grayscale palette.</p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base">FAQs</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="size-6">
                        <AccordionTrigger>Why is the 6x6 option grayed out?</AccordionTrigger>
                        <AccordionContent>
                          The 6x6 square is impossible to construct! Every size is possible except 2x2 and 6x6.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="name">
                        <AccordionTrigger>Why is it called Graeco-Latin?</AccordionTrigger>
                        <AccordionContent>
                          Mathematician
                          {" "}
                          <a
                            href="https://en.wikipedia.org/wiki/Leonhard_Euler"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-primary underline"
                          >
                            Leonard Euler
                          </a>
                          {" "}
                          studied Graeco-Latin squares quite extensively late in this career. In his works, he took the two sets
                          of symbols to be the Latin letters and the Greek letters, hence the name.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="methods">
                        <AccordionTrigger>Why some methods don’t work on some sizes?</AccordionTrigger>
                        <AccordionContent>
                          There is no universal method for constructing every size. We have to rely on a combination of multiple
                          methods derived from studies of these squares in the past, some simpler and some more complicated. The
                          complicated ones usually yield a more interesting, less symmetric pattern.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="pattern">
                        <AccordionTrigger>
                          I’ve seen this “square inside a square” pattern before! (better name?)
                        </AccordionTrigger>
                        <AccordionContent>
                          You’re right! This pattern of making an art from a Graeco-Latin square isn’t original. It first appears on
                          the cover November 1959 issue of <em>Scientific American</em>.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="learn-more">
                        <AccordionTrigger>Where can I learn more?</AccordionTrigger>
                        <AccordionContent>
                          Check out the Wikipedia pages on
                          {" "}
                          <a
                            href="https://en.wikipedia.org/wiki/Latin_square"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-primary underline"
                          >
                            Latin squares
                          </a>
                          {" "}
                          and
                          {" "}
                          <a
                            href="https://en.wikipedia.org/wiki/Mutually_orthogonal_Latin_squares"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-primary underline"
                          >
                            Orthogonal Latin squares
                          </a>
                          . Also check out
                          {" "}
                          <a
                            href="https://www.youtube.com/watch?v=qu04xLNrk94"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-primary underline"
                          >
                            this excellent Numberphile video
                          </a>
                          {" "}
                          (it inspired this site!).
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="flex justify-center p-4">
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
      <div className="mt-4 flex gap-4">
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
