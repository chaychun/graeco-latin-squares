import InfoBox from "pixelarticons/svg/info-box.svg?react"
import Shuffle from "pixelarticons/svg/shuffle.svg?react"
import Undo from "pixelarticons/svg/undo.svg?react"
import { useEffect, useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Method } from "@/lib/core/graeco-latin/graeco-latin-store"
import {
  getAutoResolvedMethod,
  getGreekMultiplierOptions,
  getLatinMultiplierOptions,
  getMethodDisabled,
  useGraecoLatinStore,
} from "@/lib/core/graeco-latin/graeco-latin-store"
import { usePaletteStore } from "@/lib/palette/palette-store"
import {
  GLACIER_PALETTE,
  GRAYSCALE_PALETTE,
  NORD_PALETTE,
  PASTEL_PALETTE,
  SCIENTIFIC_AMERICAN_59_PALETTE,
} from "@/lib/palette/palettes"

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])
  return matches
}

export default function Controls() {
  const [sixHelpOpen, setSixHelpOpen] = useState(false)
  const {
    size,
    latinMultiplier,
    greekMultiplier,
    method,
    direct4x4Method,
    setSize,
    setLatinMultiplier,
    setGreekMultiplier,
    setMethod,
    setDirect4x4Method,
  } = useGraecoLatinStore()
  const {
    paletteType,
    backgroundShift,
    foregroundShift,

    setPaletteType,
    setBackgroundShift,
    setForegroundShift,
    setPaletteSeed,
  } = usePaletteStore()

  const autoResolvedMethod = getAutoResolvedMethod(size)

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

  const randomizePalette = () => {
    const seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    setPaletteSeed(seed)
  }

  const resetPalette = () => {
    setPaletteSeed(0)
  }

  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const SquareControls = (
    <div className="space-y-6">
      <div className="flex gap-6">
        <div>
          <Label htmlFor="size">Size</Label>
          <Select
            value={size.toString()}
            onValueChange={(value) => {
              setSixHelpOpen(false)
              setSize(Number.parseInt(value, 10))
            }}
            onOpenChange={(open) => {
              if (!open) setSixHelpOpen(false)
            }}
          >
            <SelectTrigger className="mt-2 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3×3</SelectItem>
              <SelectItem value="4">4×4</SelectItem>
              <SelectItem value="5">5×5</SelectItem>
              <SelectItem
                value="6"
                className="opacity-60"
                aria-disabled
                onSelect={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
              >
                <span className="flex items-center gap-2">
                  6×6
                  <Tooltip open={sixHelpOpen} onOpenChange={setSixHelpOpen}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Why 6×6 is disabled"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSixHelpOpen((v) => !v)
                        }}
                        onPointerDown={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                        }}
                        className="inline-flex items-center text-inherit"
                      >
                        <InfoBox className="h-4 w-4 text-inherit" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={6} className="max-w-[380px] lg:max-w-none">
                      6×6 Graeco-Latin squares are impossible to construct. This was proven by
                      Gaston Tarry in 1901.
                    </TooltipContent>
                  </Tooltip>
                </span>
              </SelectItem>
              <SelectItem value="7">7×7</SelectItem>
              <SelectItem value="8">8×8</SelectItem>
              <SelectItem value="9">9×9</SelectItem>
              <SelectItem value="10">10×10</SelectItem>
              <SelectItem value="11">11×11</SelectItem>
              <SelectItem value="12">12×12</SelectItem>
              <SelectItem value="13">13×13</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label htmlFor="method">Method</Label>
          <Select value={method} onValueChange={(value) => setMethod(value as Method)}>
            <SelectTrigger className="mt-2 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                {`Auto ${
                  autoResolvedMethod === "finite"
                    ? "(Finite Field)"
                    : autoResolvedMethod === "cyclic"
                      ? "(Cyclic)"
                      : autoResolvedMethod === "difference"
                        ? "(Difference)"
                        : "(Direct Product)"
                }`}
              </SelectItem>
              <SelectItem value="finite" disabled={getMethodDisabled("finite", size)}>
                Finite Field
              </SelectItem>
              <SelectItem value="cyclic" disabled={getMethodDisabled("cyclic", size)}>
                Cyclic
              </SelectItem>
              <SelectItem value="difference" disabled={getMethodDisabled("difference", size)}>
                Method of Difference
              </SelectItem>
              <SelectItem value="direct" disabled={getMethodDisabled("direct", size)}>
                Direct Product
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(method === "cyclic" || (method === "auto" && autoResolvedMethod === "cyclic")) && (
        <div>
          <Label>Multipliers</Label>
          <div className="flex gap-8">
            <div>
              <Label htmlFor="latinMultiplier" className="text-[10px] text-chart-5">
                Background
              </Label>
              <Select
                value={latinMultiplier.toString()}
                onValueChange={(value) => setLatinMultiplier(Number.parseInt(value, 10))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getLatinMultiplierOptions(size, greekMultiplier).map((multiplier) => (
                    <SelectItem key={multiplier} value={multiplier.toString()}>
                      {multiplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="greekMultiplier" className="text-[10px] text-chart-5">
                Foreground
              </Label>
              <Select
                value={greekMultiplier.toString()}
                onValueChange={(value) => setGreekMultiplier(Number.parseInt(value, 10))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getGreekMultiplierOptions(size, latinMultiplier).map((multiplier) => (
                    <SelectItem key={multiplier} value={multiplier.toString()}>
                      {multiplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {((method === "direct" && size === 12) ||
        (method === "auto" && autoResolvedMethod === "direct" && size === 12)) && (
        <div>
          <Label htmlFor="direct4x4">4×4 component method</Label>
          <Select
            value={direct4x4Method}
            onValueChange={(value) => setDirect4x4Method(value as "finite" | "difference")}
          >
            <SelectTrigger className="mt-2 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="finite">4×4 via Finite Field</SelectItem>
              <SelectItem value="difference">4×4 via Method of Difference</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )

  const PaletteControls = (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-4">
          <Select
            value={paletteType}
            onValueChange={(value) =>
              setPaletteType(
                value as "pastel" | "grayscale" | "scientific_american_59" | "nord" | "glacier"
              )
            }
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nord">
                <span className="inline-flex w-full items-center whitespace-nowrap">
                  <span>
                    Nord <span className="text-current opacity-60">(Default)</span>
                  </span>
                  <span className="ml-auto mr-6 inline-flex items-center gap-1">
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: NORD_PALETTE[0] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: NORD_PALETTE[3] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: NORD_PALETTE[6] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: NORD_PALETTE[9] }}
                    />
                  </span>
                </span>
              </SelectItem>
              <SelectItem value="glacier">
                <span className="inline-flex w-full items-center whitespace-nowrap">
                  <span>Glacier</span>
                  <span className="ml-auto mr-6 inline-flex items-center gap-1">
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: GLACIER_PALETTE[0] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: GLACIER_PALETTE[3] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: GLACIER_PALETTE[6] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: GLACIER_PALETTE[9] }}
                    />
                  </span>
                </span>
              </SelectItem>
              <SelectItem value="grayscale">
                <span className="inline-flex w-full items-center whitespace-nowrap">
                  <span>Grayscale</span>
                  <span className="ml-auto mr-6 inline-flex items-center gap-1">
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: GRAYSCALE_PALETTE[0] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: GRAYSCALE_PALETTE[3] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: GRAYSCALE_PALETTE[6] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: GRAYSCALE_PALETTE[9] }}
                    />
                  </span>
                </span>
              </SelectItem>
              <SelectItem value="pastel">
                <span className="inline-flex w-full items-center whitespace-nowrap">
                  <span>Pastel</span>
                  <span className="ml-auto mr-6 inline-flex items-center gap-1">
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: PASTEL_PALETTE[0] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: PASTEL_PALETTE[3] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: PASTEL_PALETTE[6] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: PASTEL_PALETTE[9] }}
                    />
                  </span>
                </span>
              </SelectItem>
              <SelectItem value="scientific_american_59">
                <span className="inline-flex w-full items-center whitespace-nowrap">
                  <span>Scientific American '59</span>
                  <span className="ml-auto mr-6 inline-flex items-center gap-1">
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: SCIENTIFIC_AMERICAN_59_PALETTE[0] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: SCIENTIFIC_AMERICAN_59_PALETTE[3] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: SCIENTIFIC_AMERICAN_59_PALETTE[6] }}
                    />
                    <span
                      className="h-3 w-3 rounded-sm border border-border"
                      style={{ backgroundColor: SCIENTIFIC_AMERICAN_59_PALETTE[9] }}
                    />
                  </span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button onClick={resetPalette} className="bg-background" variant="outline" size="sm">
              <Undo className="h-5 w-5" />
            </Button>
            <Button
              onClick={randomizePalette}
              className="bg-background"
              variant="outline"
              size="sm"
            >
              <Shuffle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label>Background Shift: {backgroundShift}</Label>
        <Slider
          value={[backgroundShift]}
          onValueChange={(value) => setBackgroundShift(value[0])}
          max={basePalette.length - 1}
          step={1}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Foreground Shift: {foregroundShift}</Label>
        <Slider
          value={[foregroundShift]}
          onValueChange={(value) => setForegroundShift(value[0])}
          max={basePalette.length - 1}
          step={1}
          className="mt-2"
        />
      </div>
    </div>
  )

  return (
    <div className="flex h-full flex-col">
      {isDesktop ? (
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Square</CardTitle>
            </CardHeader>
            <CardContent>{SquareControls}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Palette</CardTitle>
            </CardHeader>
            <CardContent>{PaletteControls}</CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <Tabs defaultValue="square" className="flex h-full flex-col gap-0">
            <TabsList className="w-full rounded-none bg-transparent p-0">
              <TabsTrigger
                value="square"
                className="data-[state=active]:-mb-px rounded-none border-0 border-border border-b px-3 py-2 text-muted-foreground data-[state=active]:border-border data-[state=active]:border-x data-[state=active]:border-t data-[state=active]:border-b-0 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Square
              </TabsTrigger>
              <TabsTrigger
                value="palette"
                className="data-[state=active]:-mb-px rounded-none border-0 border-border border-b px-3 py-2 text-muted-foreground data-[state=active]:border-border data-[state=active]:border-x data-[state=active]:border-t data-[state=active]:border-b-0 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Palette
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="square"
              className="flex-1 overflow-hidden border border-t-0 bg-card"
            >
              <ScrollArea className="h-full">
                <div className="p-4 pb-6">{SquareControls}</div>
              </ScrollArea>
            </TabsContent>
            <TabsContent
              value="palette"
              className="flex-1 overflow-hidden border border-t-0 bg-card"
            >
              <ScrollArea className="h-full">
                <div className="p-4 pb-6">{PaletteControls}</div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
