import { Download, Grid, Palette } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
            <Grid className="w-8 h-8" />
            Graeco-Latin Square Art Generator
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Generate beautiful geometric art using orthogonal Latin squares. Each cell contains a
            unique combination of background and foreground colors arranged in mathematical harmony.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="size">Grid Size (n)</Label>
                  <Select
                    value={size.toString()}
                    onValueChange={(value) => handleSizeChange(Number.parseInt(value, 10))}
                  >
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                    <SelectTrigger>
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

                <div className="pt-4 space-y-2">
                  <Button onClick={downloadSVG} className="w-full bg-transparent" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download SVG
                  </Button>
                  <Button onClick={downloadPNG} className="w-full bg-transparent" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Color Preview</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
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

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Mathematical Construction</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                <div className="space-y-2">
                  <p>
                    <strong>Latin Square:</strong> L(i,j) = (i + {latinMultiplier}j) mod {size}
                  </p>
                  <p>
                    <strong>Greek Square:</strong> G(i,j) = (i + {greekMultiplier}j) mod {size}
                  </p>
                  <p>
                    Each cell shows the unique combination (L(i,j), G(i,j)) as (background,
                    foreground) colors.
                  </p>
                  <p>
                    This construction ensures orthogonality: every color pair appears exactly once.
                  </p>
                  <p>
                    <strong>Note:</strong> Multipliers must satisfy gcd(|{greekMultiplier}-
                    {latinMultiplier}|, {size}) = 1 to ensure proper orthogonality.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
