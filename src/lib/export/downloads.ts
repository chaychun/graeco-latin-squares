export const downloadSVG = (svgElement: SVGSVGElement | null, size: number) => {
  if (!svgElement) return

  const svgData = new XMLSerializer().serializeToString(svgElement)
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

export const downloadPNG = (svgElement: SVGSVGElement | null, svgSize: number, size: number) => {
  if (!svgElement) return

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  canvas.width = svgSize
  canvas.height = svgSize

  const svgData = new XMLSerializer().serializeToString(svgElement)
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
