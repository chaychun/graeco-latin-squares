import { Palette } from "lucide-react"
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
import { areMultipliersValid, getAllMultipliers } from "@/lib/graeco-latin"
import {
  GRAYSCALE_PALETTE,
  PASTEL_PALETTE,
  SCIENTIFIC_AMERICAN_59_PALETTE,
  shiftPalette,
} from "@/lib/palettes"
import { useGraecoLatinStore } from "@/lib/store"

export default function Controls() {
  const {
    size,
    paletteType,
    backgroundShift,
    foregroundShift,
    latinMultiplier,
    greekMultiplier,
    method,
    setSize,
    setPaletteType,
    setBackgroundShift,
    setForegroundShift,
    setLatinMultiplier,
    setGreekMultiplier,
    setMethod,
  } = useGraecoLatinStore()

  const availableMultipliers = getAllMultipliers(size)

  const handleSizeChange = (newSize: number) => {
    setSize(newSize)
    if (newSize % 2 === 0 && method === "cyclic") setMethod("auto")
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

  const basePalette =
    paletteType === "pastel"
      ? PASTEL_PALETTE
      : paletteType === "grayscale"
        ? GRAYSCALE_PALETTE
        : SCIENTIFIC_AMERICAN_59_PALETTE
  const backgroundColors = shiftPalette(basePalette.slice(0, size), backgroundShift)
  const foregroundColors = shiftPalette(basePalette.slice(0, size), foregroundShift)

  return (
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
                <SelectTrigger className="bg-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3×3</SelectItem>
                  <SelectItem value="4">4×4</SelectItem>
                  <SelectItem value="5">5×5</SelectItem>
                  <SelectItem value="7">7×7</SelectItem>
                  <SelectItem value="8">8×8</SelectItem>
                  <SelectItem value="9">9×9</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="method">Construction Method</Label>
              <Select
                value={method}
                onValueChange={(value: "auto" | "finite" | "cyclic" | "klein4") => setMethod(value)}
              >
                <SelectTrigger className="bg-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="finite">Finite Field</SelectItem>
                  <SelectItem value="cyclic" disabled={size % 2 === 0}>
                    Cyclic
                  </SelectItem>
                  <SelectItem value="klein4" disabled={size !== 4}>
                    Klein 4 (4×4)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {method === "cyclic" && (
              <div>
                <Label htmlFor="latinMultiplier">Latin Square Multiplier</Label>
                <Select
                  value={latinMultiplier.toString()}
                  onValueChange={(value) => setLatinMultiplier(Number.parseInt(value, 10))}
                >
                  <SelectTrigger className="bg-white mt-2">
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
              </div>
            )}

            {method === "cyclic" && (
              <div>
                <Label htmlFor="greekMultiplier">Greek Square Multiplier</Label>
                <Select
                  value={greekMultiplier.toString()}
                  onValueChange={(value) => setGreekMultiplier(Number.parseInt(value, 10))}
                >
                  <SelectTrigger className="bg-white mt-2">
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
              </div>
            )}

            <div>
              <Label htmlFor="palette">Color Palette</Label>
              <Select
                value={paletteType}
                onValueChange={(value: "pastel" | "grayscale" | "scientific_american_59") =>
                  setPaletteType(value)
                }
              >
                <SelectTrigger className="bg-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pastel">Pastel</SelectItem>
                  <SelectItem value="grayscale">Grayscale</SelectItem>
                  <SelectItem value="scientific_american_59">Scientific American '59</SelectItem>
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
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
