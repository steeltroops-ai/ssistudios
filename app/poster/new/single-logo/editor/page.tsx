// app/poster/new/single-logo/editor/page.tsx (or wherever your PosterWithLogoEditor component resides)

'use client'

import { useState, useRef, useEffect } from 'react'
import { AiOutlineUpload, AiOutlineReload, AiOutlineDownload } from 'react-icons/ai'
import { motion, AnimatePresence } from 'framer-motion'

// Re-including HiOutlineMenu and HiX for the local header/toggle
import { HiOutlineMenu, HiX } from 'react-icons/hi'
// Assuming these are defined elsewhere or need to be defined here if not from react-icons/hi
// You might need to adjust import paths based on your actual project structure.
// If your project uses react-icons/hi, the above import is correct.
// If you define them manually, ensure they are defined in a way accessible to this component.

// --- HELPER FUNCTIONS ---
// (drawRoundedRect, clipRoundedRect, crc32, writeUInt32BE, setPngDpi, setJpegDpi)
// These functions are left as-is from your provided code, as they are not the source of the current error.

// Draws a rounded rectangle border
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  lineWidth: number
) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0)' // Set to transparent as per original intent

  ctx.lineWidth = lineWidth
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.stroke()
}

// Clips the drawing area to a rounded rectangle
function clipRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.clip()
}

/** ========= PNG DPI WRITER (valid CRC) ========= */
function crc32(bytes: Uint8Array) {
  let c = ~0 >>> 0
  for (let i = 0; i < bytes.length; i++) {
    c ^= bytes[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1))
  }
  return ~c >>> 0
}
function writeUInt32BE(buf: Uint8Array, offset: number, value: number) {
  buf[offset] = (value >>> 24) & 0xff
  buf[offset + 1] = (value >>> 16) & 0xff
  buf[offset + 2] = (value >>> 8) & 0xff
  buf[offset + 3] = value & 0xff
}

// Replaces existing pHYs or inserts right after IHDR, with correct CRC
function setPngDpi(dataUrl: string, dpi: number) {
  if (!dataUrl.startsWith('data:image/png;base64,')) return dataUrl
  const base64 = dataUrl.split(',')[1]
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)

  // PNG signature
  const sig = [137, 80, 78, 71, 13, 10, 26, 10]
  for (let i = 0; i < 8; i++) if (bytes[i] !== sig[i]) return dataUrl

  // scan chunks: find IHDR end and any existing pHYs
  let offset = 8
  let ihdrEnd = -1
  let physStart = -1
  while (offset + 8 <= bytes.length) {
    const len =
      (bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]
    const type = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7]
    )
    const chunkStart = offset
    const chunkEnd = offset + 12 + len // len(4)+type(4)+data(len)+crc(4)
    if (type === 'IHDR') ihdrEnd = chunkEnd
    if (type === 'pHYs') physStart = chunkStart
    if (type === 'IEND') break
    offset = chunkEnd
  }
  if (ihdrEnd === -1) return dataUrl

  // dpi -> pixels per meter
  const ppm = Math.round(dpi / 0.0254)

  // build pHYs data
  const pHYsData = new Uint8Array(9)
  writeUInt32BE(pHYsData, 0, ppm) // X
  writeUInt32BE(pHYsData, 4, ppm) // Y
  pHYsData[8] = 1 // unit: meter

  const typeBytes = new Uint8Array([0x70, 0x48, 0x59, 0x73]) // 'pHYs'
  const crcInput = new Uint8Array(typeBytes.length + pHYsData.length)
  crcInput.set(typeBytes, 0)
  crcInput.set(pHYsData, typeBytes.length)
  const crc = crc32(crcInput)

  const pHYsChunk = new Uint8Array(4 + 4 + 9 + 4)
  writeUInt32BE(pHYsChunk, 0, 9) // length
  pHYsChunk.set(typeBytes, 4) // type
  pHYsChunk.set(pHYsData, 8) // data
  writeUInt32BE(pHYsChunk, 17, crc) // crc

  // Replace existing pHYs or insert after IHDR
  let out: Uint8Array
  if (physStart !== -1) {
    const len =
      (bytes[physStart] << 24) |
      (bytes[physStart + 1] << 16) |
      (bytes[physStart + 2] << 8) |
      bytes[physStart + 3]
    const physEnd = physStart + 12 + len
    out = new Uint8Array(bytes.length - (physEnd - physStart) + pHYsChunk.length)
    out.set(bytes.subarray(0, physStart), 0)
    out.set(pHYsChunk, physStart)
    out.set(bytes.subarray(physEnd), physStart + pHYsChunk.length)
  } else {
    out = new Uint8Array(bytes.length + pHYsChunk.length)
    out.set(bytes.subarray(0, ihdrEnd), 0)
    out.set(pHYsChunk, ihdrEnd)
    out.set(bytes.subarray(ihdrEnd), ihdrEnd + pHYsChunk.length)
  }

  // back to data URL (chunked)
  const CHUNK = 0x8000
  let s = ''
  for (let i = 0; i < out.length; i += CHUNK) {
    s += String.fromCharCode(...out.subarray(i, i + CHUNK))
  }
  return `data:image/png;base64,${btoa(s)}`
}
/** ============== END PNG DPI WRITER ============== */

/** ========= JPEG DPI WRITER ========= */
// This function finds the JFIF block and modifies the DPI.
// It assumes a standard JFIF header is present, which is
// typical for images created by canvas.toDataURL('image/jpeg').
function setJpegDpi(dataUrl: string, dpi: number) {
  if (!dataUrl.startsWith('data:image/jpeg;base64,')) return dataUrl

  const base64 = dataUrl.split(',')[1]
  const bin = atob(base64)
  const len = bin.length

  // We need a mutable array
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = bin.charCodeAt(i)
  }

  // The JFIF segment (APP0) should start at offset 2, after the SOI (FF D8) marker.
  const app0Offset = 2

  // Check for SOI and APP0 markers
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[app0Offset] !== 0xff || bytes[app0Offset + 1] !== 0xe0) {
    console.warn('Standard JFIF header not found. Cannot set DPI.')
    return dataUrl
  }

  // Check for 'JFIF' identifier (4A 46 49 46 00) which starts at offset 4 within the APP0 segment
  const jfifIdOffset = app0Offset + 4
  if (
    bytes[jfifIdOffset] !== 0x4a ||
    bytes[jfifIdOffset + 1] !== 0x46 ||
    bytes[jfifIdOffset + 2] !== 0x49 ||
    bytes[jfifIdOffset + 3] !== 0x46 ||
    bytes[jfifIdOffset + 4] !== 0x00
  ) {
    console.warn('JFIF identifier not found. Cannot set DPI.')
    return dataUrl
  }

  // The DPI information is located at specific offsets within the APP0 segment.
  const unitsOffset = app0Offset + 11
  const xDensityOffset = app0Offset + 12
  const yDensityOffset = app0Offset + 14

  // Set resolution unit to DPI (1)
  bytes[unitsOffset] = 1

  // Set X density (2 bytes, big-endian)
  bytes[xDensityOffset] = (dpi >> 8) & 0xff // High byte
  bytes[xDensityOffset + 1] = dpi & 0xff // Low byte

  // Set Y density (2 bytes, big-endian)
  bytes[yDensityOffset] = (dpi >> 8) & 0xff // High byte
  bytes[yDensityOffset + 1] = dpi & 0xff // Low byte

  // Re-encode to base64
  const CHUNK = 0x8000
  let s = ''
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return `data:image/jpeg;base64,${btoa(s)}`
}
/** ============== END JPEG DPI WRITER ============== */

// --- TYPE DEFINITIONS ---
type ExportFormat = 'png' | 'jpeg'
type ExportResolution = { name: string; width: number; height: number; kind?: 'preset' | 'original' }

// --- CONSTANTS ---
const RESOLUTIONS: ExportResolution[] = [
  { name: 'Use Original', width: 0, height: 0, kind: 'original' },
  { name: '4K (3840x2160)', width: 3840, height: 2160, kind: 'preset' },
  { name: 'Full HD (1920x1080)', width: 1920, height: 1080, kind: 'preset' },
  { name: 'Social Media (1080x1080)', width: 1080, height: 1080, kind: 'preset' }
]

// --- MAIN COMPONENT ---
export default function PosterWithLogoEditor() {
  const combinedCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [baseImageSrc, setBaseImageSrc] = useState('/posters/poster1.jpg')
  const [logoImageSrc, setLogoImageSrc] = useState<string | null>(null)
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)

  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [showUploadAnimation, setShowUploadAnimation] = useState(false)
  const [progress, setProgress] = useState(0)
  const [backgroundType, setBackgroundType] = useState<'original' | 'white'>('original')

  const [logoRadius, setLogoRadius] = useState(12)
  const [logoPosition, setLogoPosition] = useState(50)

  const [showExportModal, setShowExportModal] = useState(false)
  const [exportSettings, setExportSettings] = useState({
    format: 'jpeg' as ExportFormat,
    resolution: RESOLUTIONS[0],
    quality: 1.0
  })

  // State and function for local sidebar toggle, if this component is responsible for it
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => { setIsSidebarOpen(!isSidebarOpen); };


  const previewWidth = 800
  const previewHeight = 450

  useEffect(() => {
    if (!baseImageSrc) return setBaseImage(null)
    const img = new Image()
    img.src = baseImageSrc
    img.crossOrigin = 'anonymous'
    img.onload = () => setBaseImage(img)
  }, [baseImageSrc])

  useEffect(() => {
    if (!logoImageSrc) return setLogoImage(null)
    const img = new Image()
    img.src = logoImageSrc
    img.crossOrigin = 'anonymous'
    img.onload = () => setLogoImage(img)
  }, [logoImageSrc])

  useEffect(() => {
    const canvas = combinedCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = previewWidth
    canvas.height = previewHeight
    ctx.clearRect(0, 0, previewWidth, previewHeight)
    if (baseImage) {
      ctx.drawImage(baseImage, 0, 0, previewWidth, previewHeight)
    }
    const containerConfig = { top: 0.62, bottom: 0.76, hPadding: 0.35 }
    const containerY = previewHeight * containerConfig.top
    const containerHeight = previewHeight * (containerConfig.bottom - containerConfig.top)
    const containerX = previewWidth * containerConfig.hPadding
    const containerWidth = previewWidth * (1 - 2 * containerConfig.hPadding)
    drawRoundedRect(ctx, containerX, containerY, containerWidth, containerHeight, 20, 2)
    if (logoImage) {
      const scale = Math.min(containerWidth / logoImage.width, containerHeight / logoImage.height)
      const logoWidth = logoImage.width * scale
      const logoHeight = logoImage.height * scale
      const minX = containerX
      const maxX = containerX + containerWidth - logoWidth
      const x = Math.round(minX + ((maxX - minX) * logoPosition) / 100)
      const y = Math.round(containerY + (containerHeight - logoHeight) / 2)
      if (backgroundType === 'white') {
        const paddingRatio = 0.1
        const paddedWidth = logoWidth * (1 + paddingRatio)
        const paddedHeight = logoHeight * (1 + paddingRatio)
        const paddedX = x - (paddedWidth - logoWidth) / 2
        const paddedY = y - (paddedHeight - logoHeight) / 2
        ctx.fillStyle = 'white'
        ctx.fillRect(paddedX, paddedY, paddedWidth, paddedHeight) // Corrected from paddedY
      }
      ctx.save()
      clipRoundedRect(ctx, x, y, logoWidth, logoHeight, logoRadius) // Corrected logoRadius scaling
      ctx.drawImage(logoImage, x, y, logoWidth, logoHeight)
      ctx.restore()
    }
  }, [baseImage, logoImage, backgroundType, logoRadius, logoPosition, previewWidth, previewHeight]) // Added previewWidth, previewHeight to dependencies

  function startProgressAnimation(onComplete: () => void) {
    let current = 0
    const interval = setInterval(() => {
      current++
      setProgress(current)
      if (current >= 100) {
        clearInterval(interval)
        onComplete()
      }
    }, 8)
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setShowUploadAnimation(true)
    setProgress(0)
    const objectUrl = URL.createObjectURL(file)
    setLogoImageSrc(objectUrl)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      startProgressAnimation(() => {
        setUploading(false)
        setShowUploadAnimation(false)
      })
    }
    img.onerror = () => {
      alert('Failed to load image')
      setUploading(false)
      setShowUploadAnimation(false)
      setLogoImageSrc(null)
    }
    img.src = objectUrl
  }

  const handleReset = () => {
    setLogoImageSrc(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setLogoRadius(12)
    setLogoPosition(50)
  }

  const handleGenerateClick = () => {
    if (!baseImage || !logoImage) return
    setShowExportModal(true)
  }

  async function executeExport() {
    if (!baseImage || !logoImage) return
    setGenerating(true)
    setShowExportModal(false)
    await new Promise((r) => setTimeout(r, 300))

    let outW = exportSettings.resolution.width
    let outH = exportSettings.resolution.height
    if (exportSettings.resolution.kind === 'original' && baseImage) {
      outW = (baseImage as any).naturalWidth || baseImage.width
      outH = (baseImage as any).naturalHeight || baseImage.height
    }

    outW = Math.max(16, Math.floor(outW || 0))
    outH = Math.max(16, Math.floor(outH || 0))

    const exportCanvas = document.createElement('canvas')
    const ctx = exportCanvas.getContext('2d')
    if (!ctx) return

    exportCanvas.width = outW
    exportCanvas.height = outH

    ctx.imageSmoothingEnabled = true
    ;(ctx as any).imageSmoothingQuality = 'high'

    ctx.drawImage(baseImage, 0, 0, outW, outH)

    const containerConfig = { top: 0.62, bottom: 0.76, hPadding: 0.35 }
    const containerY = outH * containerConfig.top
    const containerHeight = outH * (containerConfig.bottom - containerConfig.top)
    const containerX = outW * containerConfig.hPadding
    const containerWidth = outW * (1 - 2 * containerConfig.hPadding)

    const scaleFor = (val: number) => (outW / previewWidth) * val // Use previewWidth for scaling reference
    drawRoundedRect(
      ctx,
      containerX,
      containerY,
      containerWidth,
      containerHeight,
      scaleFor(20),
      scaleFor(2)
    )

    const scale = Math.min(containerWidth / logoImage.width, containerHeight / logoImage.height)
    const logoWidth = logoImage.width * scale
    const logoHeight = logoImage.height * scale
    const minX = containerX
    const maxX = containerX + containerWidth - logoWidth
    const x = Math.round(minX + ((maxX - minX) * logoPosition) / 100)
    const y = Math.round(containerY + (containerHeight - logoHeight) / 2)

    if (backgroundType === 'white') {
      const paddingRatio = 0.1
      const paddedWidth = logoWidth * (1 + paddingRatio)
      const paddedHeight = logoHeight * (1 + paddingRatio)
      const paddedX = x - (paddedWidth - logoWidth) / 2
      const paddedY = y - (paddedHeight - logoHeight) / 2
      ctx.fillStyle = 'white'
      ctx.fillRect(paddedX, paddedY, paddedWidth, paddedHeight) // Corrected from paddedY
    }

    ctx.save()
    clipRoundedRect(ctx, x, y, logoWidth, logoHeight, (logoRadius * outW) / previewWidth) // Corrected logoRadius scaling
    ctx.drawImage(logoImage, x, y, logoWidth, logoHeight)
    ctx.restore()

    const mimeType = `image/${exportSettings.format}`
    let dataUrl = exportCanvas.toDataURL(mimeType, exportSettings.quality)

    if (exportSettings.format === 'png') {
      dataUrl = setPngDpi(dataUrl, 300)
    } else if (exportSettings.format === 'jpeg') {
      dataUrl = setJpegDpi(dataUrl, 300)
    }

    // *** THE CRITICAL FIX FOR "Failed to fetch" ***
    // Directly convert base64 data URL to Blob
    const base64Data = dataUrl.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    // *** END FIX ***

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)

    const fileW = outW
    const fileH = outH
    link.download = `poster_ssi_${fileW}x${fileH}.${exportSettings.format}`
    link.click()
    URL.revokeObjectURL(link.href)
    setGenerating(false)
  }

  const circumference = 2 * Math.PI * 44
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col h-full">
      {/* Re-introducing the local header block for this component */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Creative Studio</h1>
          {/* Mobile hamburger button, controlled locally */}
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-white lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <HiX size={28} /> : <HiOutlineMenu size={28} />}
          </button>
        </div>
        <p className="text-gray-400 mt-2 lg:mt-1 lg:ml-auto">Bring your vision to life. Upload a logo to begin.</p>
      </header>

      {/* The rest of your content specific to the Poster Editor */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col gap-8">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">1. Upload</h2>
            <label
              htmlFor="logo-upload"
              className="flex items-center justify-center gap-3 bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-gray-600 transition-all duration-300 shadow-md w-full"
            >
              <AiOutlineUpload size={22} />
              <span>{logoImage ? 'Change Logo' : 'Upload Logo (PNG)'}</span>
              <input
                id="logo-upload"
                type="file"
                accept="image/png"
                onChange={handleLogoUpload}
                disabled={uploading || generating}
                className="hidden"
                ref={fileInputRef}
              />
            </label>
          </div>

          <div className={`transition-opacity duration-500 ${!logoImage ? 'opacity-30 pointer-events-none' : ''}`}>
            <h2 className="text-lg font-semibold text-white mb-4">2. Adjust</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="background-select" className="block font-medium text-gray-300 text-sm mb-2">
                  Background
                </label>
                <select
                  id="background-select"
                  value={backgroundType}
                  onChange={(e) => setBackgroundType(e.target.value as 'original' | 'white')}
                  disabled={!logoImage}
                  className="w-full bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md px-4 py-2 cursor-pointer outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-500 transition-colors"
                >
                  <option value="original">Original (Transparent)</option>
                  <option value="white">White Plate</option>
                </select>
              </div>
              <div>
                <label htmlFor="logo-radius" className="block font-medium text-gray-300 text-sm mb-2">
                  Curve: {logoRadius}px
                </label>
                <input
                  id="logo-radius"
                  type="range"
                  min="0"
                  max="50"
                  value={logoRadius}
                  onChange={(e) => setLogoRadius(Number(e.target.value))}
                  disabled={!logoImage}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
                />
              </div>
              <div>
                <label htmlFor="logo-position" className="block font-medium text-gray-300 text-sm mb-2">
                  Position: {logoPosition}%
                </label>
                <input
                  id="logo-position"
                  type="range"
                  min="0"
                  max="100"
                  value={logoPosition}
                  onChange={(e) => setLogoPosition(Number(e.target.value))}
                  disabled={!logoImage}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
                />
              </div>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-4">
            <button
              onClick={handleGenerateClick}
              disabled={!logoImage || generating}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/40"
            >
              <AiOutlineDownload size={22} />
              {generating ? 'Exporting...' : 'Export Poster'}
            </button>
            {logoImage && (
              <button
                onClick={handleReset}
                disabled={uploading || generating}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 font-medium px-5 py-2 rounded-lg transition-all duration-300 text-sm"
              >
                <AiOutlineReload size={18} />
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 relative w-full h-full min-h-[50vh] flex flex-col items-center justify-center">
          <div className="relative w-full aspect-video rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl shadow-black/30 bg-gray-900">
            <canvas
              ref={combinedCanvasRef}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showUploadAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <svg className="w-24 h-24 mb-4 text-gray-400" viewBox="0 0 100 100" aria-label="Loading progress">
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.25" />
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                className="animate-pulse"
              />
            </svg>
            <p className="text-gray-200 text-lg font-semibold select-none">UPLOADING... {progress}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Export Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="export-format" className="block font-medium text-gray-300 text-sm mb-2">
                    Format
                  </label>
                  <select
                    id="export-format"
                    value={exportSettings.format}
                    onChange={(e) =>
                      setExportSettings({ ...exportSettings, format: e.target.value as ExportFormat })
                    }
                    className="w-full bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md px-4 py-2 cursor-pointer outline-none focus:border-blue-500 focus:ring-1 focus:ring-500 hover:border-gray-500 transition-colors"
                  >
                    <option value="png">PNG (Lossless, Large File)</option>
                    <option value="jpeg">JPEG (Max Quality, 300 DPI)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="export-resolution" className="block font-medium text-gray-300 text-sm mb-2">
                    Resolution
                  </label>
                  <select
                    id="export-resolution"
                    value={exportSettings.resolution.name}
                    onChange={(e) =>
                      setExportSettings({
                        ...exportSettings,
                        resolution: RESOLUTIONS.find((r) => r.name === e.target.value) || RESOLUTIONS[0]
                      })
                    }
                    className="w-full bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md px-4 py-2 cursor-pointer outline-none focus:border-blue-500 focus:ring-1 focus:ring-500 hover:border-gray-500 transition-colors"
                  >
                    {RESOLUTIONS.map((r) => (
                      <option key={r.name} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-400 text-center pt-2">
                  PNG & JPEG exports embed a true 300 DPI tag. “Use Original” keeps the base image’s native pixels.
                </p>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeExport}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg transition-colors"
                >
                  Export Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          margin-top: -7px;
        }
        .range-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          margin-top: -7px; /* Adjusted for consistency */
        }
      `}</style>
    </div>
  )
}