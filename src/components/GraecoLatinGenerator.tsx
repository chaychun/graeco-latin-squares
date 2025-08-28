import { Download, Palette } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  areMultipliersValid,
  generateGraecoLatinSquare,
  getAllMultipliers,
} from "@/lib/graeco-latin"
import { COLORED_PALETTE, GRAYSCALE_PALETTE, shiftPalette } from "@/lib/palettes"

export default function GraecoLatinGenerator() {
  const [size, setSize] = useState(5)
  const [paletteType, setPaletteType] = useState<"colored" | "grayscale">("colored")
  const [backgroundShift, setBackgroundShift] = useState(0)
  const [foregroundShift, setForegroundShift] = useState(0)
  const [latinMultiplier, setLatinMultiplier] = useState(1)
  const [greekMultiplier, setGreekMultiplier] = useState(2)
  const svgRef = useRef<SVGSVGElement>(null)

  const availableMultipliers = getAllMultipliers(size)

  const handleSizeChange = (newSize: number) => {
    setSize(newSize)
    const newMultipliers = getAllMultipliers(newSize)
    if (!newMultipliers.includes(latinMultiplier)) {
      setLatinMultiplier(newMultipliers[0] || 1)
    }
    if (!newMultipliers.includes(greekMultiplier)) {
      const fallback =
        newMultipliers.find((m) => m !== latinMultiplier) ||
        newMultipliers[1] ||
        newMultipliers[0] ||
        1
      setGreekMultiplier(fallback)
    }
  }

  const getAvailableMultipliers = (exclude: number, forGreek = false) => {
    return availableMultipliers.filter((m) => {
      if (m === exclude) return false
      const other = forGreek ? latinMultiplier : greekMultiplier
      return areMultipliersValid(m, other, size)
    })
  }

  const square = generateGraecoLatinSquare(size, latinMultiplier, greekMultiplier)
  const basePalette = paletteType === "colored" ? COLORED_PALETTE : GRAYSCALE_PALETTE
  const backgroundColors = shiftPalette(basePalette.slice(0, size), backgroundShift)
  const foregroundColors = shiftPalette(basePalette.slice(0, size), foregroundShift)

  const cellSize = 60
  const innerSize = cellSize * 0.4
  const svgSize = size * cellSize

  const downloadSVG = () => {
    if (!svgRef.current) return

    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    const downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = `graeco-latin-${size}x${size}.svg`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(svgUrl)
  }

  const downloadPNG = () => {
    if (!svgRef.current) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = svgSize
    canvas.height = svgSize

    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (!blob) return
        const pngUrl = URL.createObjectURL(blob)
        const downloadLink = document.createElement("a")
        downloadLink.href = pngUrl
        downloadLink.download = `graeco-latin-${size}x${size}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(pngUrl)
      })
      URL.revokeObjectURL(svgUrl)
    }
    img.src = svgUrl
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-8 h-full">
          <div className="flex-shrink-0 lg:flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle>Generated Graeco-Latin Square</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  <svg
                    ref={svgRef}
                    width={svgSize}
                    height={svgSize}
                    viewBox={`0 0 ${svgSize} ${svgSize}`}
                    className="border border-slate-200"
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
                              stroke="#ffffff"
                              strokeWidth="1"
                            />
                            <rect
                              x={innerX}
                              y={innerY}
                              width={innerSize}
                              height={innerSize}
                              fill={foregroundColors[greekValue]}
                              stroke="#ffffff"
                              strokeWidth="0.5"
                            />
                          </g>
                        )
                      })
                    )}
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-6 pr-4 pb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Controls
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="size">Grid Size (n)</Label>
                      <Select
                        value={size.toString()}
                        onValueChange={(value) => handleSizeChange(Number.parseInt(value, 10))}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3×3</SelectItem>
                          <SelectItem value="5">5×5</SelectItem>
                          <SelectItem value="7">7×7</SelectItem>
                          <SelectItem value="9">9×9</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="latinMultiplier">Latin Square Multiplier</Label>
                      <Select
                        value={latinMultiplier.toString()}
                        onValueChange={(value) => setLatinMultiplier(Number.parseInt(value, 10))}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableMultipliers(greekMultiplier, false).map((multiplier) => (
                            <SelectItem key={multiplier} value={multiplier.toString()}>
                              {multiplier}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">Must satisfy gcd(|b-a|, n) = 1</p>
                    </div>

                    <div>
                      <Label htmlFor="greekMultiplier">Greek Square Multiplier</Label>
                      <Select
                        value={greekMultiplier.toString()}
                        onValueChange={(value) => setGreekMultiplier(Number.parseInt(value, 10))}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableMultipliers(latinMultiplier, true).map((multiplier) => (
                            <SelectItem key={multiplier} value={multiplier.toString()}>
                              {multiplier}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">Must satisfy gcd(|b-a|, n) = 1</p>
                    </div>

                    <div>
                      <Label htmlFor="palette">Color Palette</Label>
                      <Select
                        value={paletteType}
                        onValueChange={(value: "colored" | "grayscale") => setPaletteType(value)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="colored">Colored</SelectItem>
                          <SelectItem value="grayscale">Grayscale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Background Shift: {backgroundShift}</Label>
                      <Slider
                        value={[backgroundShift]}
                        onValueChange={(value) => setBackgroundShift(value[0])}
                        max={size - 1}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Foreground Shift: {foregroundShift}</Label>
                      <Slider
                        value={[foregroundShift]}
                        onValueChange={(value) => setForegroundShift(value[0])}
                        max={size - 1}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Color Preview</h4>
                      <div>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-slate-600">Background Colors</Label>
                            <div className="flex gap-1 mt-1">
                              {backgroundColors.map((color) => (
                                <div
                                  key={color}
                                  className="w-6 h-6 rounded border border-slate-300"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-slate-600">Foreground Colors</Label>
                            <div className="flex gap-1 mt-1">
                              {foregroundColors.map((color) => (
                                <div
                                  key={color}
                                  className="w-6 h-6 rounded border border-slate-300"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button onClick={downloadSVG} className="w-full bg-white" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download SVG
                      </Button>
                      <Button onClick={downloadPNG} className="w-full bg-white" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
