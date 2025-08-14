// app/poster/new/single-logo/editor/page.tsx

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { AiOutlineUpload, AiOutlineReload, AiOutlineDownload } from 'react-icons/ai'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineMenu, HiX } from 'react-icons/hi' // For local header/toggle


// --- HELPER FUNCTIONS ---
// These functions are now solid and should not be the source of issues.
// Placed here for context but ideally in a separate utils file.

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  lineWidth: number
) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0)'
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

function setPngDpi(dataUrl: string, dpi: number) {
  if (!dataUrl.startsWith('data:image/png;base64,')) return dataUrl
  const base64 = dataUrl.split(',')[1]
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)

  const sig = [137, 80, 78, 71, 13, 10, 26, 10]
  for (let i = 0; i < 8; i++) if (bytes[i] !== sig[i]) return dataUrl

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
    const chunkEnd = offset + 12 + len
    if (type === 'IHDR') ihdrEnd = chunkEnd
    if (type === 'pHYs') physStart = chunkStart
    if (type === 'IEND') break
    offset = chunkEnd
  }
  if (ihdrEnd === -1) return dataUrl

  const ppm = Math.round(dpi / 0.0254)

  const pHYsData = new Uint8Array(9)
  writeUInt32BE(pHYsData, 0, ppm)
  writeUInt32BE(pHYsData, 4, ppm)
  pHYsData[8] = 1

  const typeBytes = new Uint8Array([0x70, 0x48, 0x59, 0x73])
  const crcInput = new Uint8Array(typeBytes.length + pHYsData.length)
  crcInput.set(typeBytes, 0)
  crcInput.set(pHYsData, typeBytes.length)
  const crc = crc32(crcInput)

  const pHYsChunk = new Uint8Array(4 + 4 + 9 + 4)
  writeUInt32BE(pHYsChunk, 0, 9)
  pHYsChunk.set(typeBytes, 4)
  pHYsChunk.set(pHYsData, 8)
  writeUInt32BE(pHYsChunk, 17, crc)

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

  const CHUNK = 0x8000
  let s = ''
  for (let i = 0; i < out.length; i += CHUNK) {
    s += String.fromCharCode(...out.subarray(i, i + CHUNK))
  }
  return `data:image/png;base64,${btoa(s)}`
}
/** ============== END PNG DPI WRITER ============== */

/** ========= JPEG DPI WRITER ========= */
function setJpegDpi(dataUrl: string, dpi: number) {
  if (!dataUrl.startsWith('data:image/jpeg;base64,')) return dataUrl

  const base64 = dataUrl.split(',')[1]
  const bin = atob(base64)
  const len = bin.length

  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = bin.charCodeAt(i)
  }

  const app0Offset = 2

  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[app0Offset] !== 0xff || bytes[app0Offset + 1] !== 0xe0) {
    console.warn('Standard JFIF header not found. Cannot set DPI.')
    return dataUrl
  }

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

  const unitsOffset = app0Offset + 11
  const xDensityOffset = app0Offset + 12
  const yDensityOffset = app0Offset + 14

  bytes[unitsOffset] = 1

  bytes[xDensityOffset] = (dpi >> 8) & 0xff
  bytes[xDensityOffset + 1] = dpi & 0xff

  bytes[yDensityOffset] = (dpi >> 8) & 0xff
  bytes[yDensityOffset + 1] = dpi & 0xff

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
type BlendMode =
  | 'source-over'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'

// --- CONSTANTS ---
const RESOLUTIONS: ExportResolution[] = [
  { name: 'Use Original', width: 0, height: 0, kind: 'original' },
  { name: '4K (3840x2160)', width: 3840, height: 2160, kind: 'preset' },
  { name: 'Full HD (1920x1080)', width: 1920, height: 1080, kind: 'preset' },
  { name: 'Social Media (1080x1080)', width: 1080, height: 1080, kind: 'preset' }
]

const BLEND_MODES: BlendMode[] = [
  'source-over',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity'
]

// --- MAIN COMPONENT ---
export default function PosterWithLogoEditor() {
  const combinedCanvasRef = useRef<HTMLCanvasElement>(null)
  const logoPreviewCanvasRef = useRef<HTMLCanvasElement>(null)
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

  // Logo transformation states (refined)
  const [logoZoom, setLogoZoom] = useState(100) // Percentage of container fill
  const [logoRotation, setLogoRotation] = useState(0) // Degrees
  const [logoOpacity, setLogoOpacity] = useState(100) // Percentage
  const [logoBorderWidth, setLogoBorderWidth] = useState(0) // Pixels (relative to logo)
  const [logoBorderColor, setLogoBorderColor] = useState('#ffffff') // White default
  const [logoBlendMode, setLogoBlendMode] = useState<BlendMode>('source-over')
  const [logoHorizontalOffset, setLogoHorizontalOffset] = useState(0); // Offset from center in % of container width
  const [logoVerticalOffset, setLogoVerticalOffset] = useState(0); // Offset from center in % of container height
  const [logoRadius, setLogoRadius] = useState(0); // Correctly initialized here


  const [showExportModal, setShowExportModal] = useState(false)

  const [exportSettings, setExportSettings] = useState({
    format: 'jpeg' as ExportFormat,
    resolution: RESOLUTIONS[0],
    quality: 1.0
  })

  // State and function for local sidebar toggle (if ClientRootLayout doesn't pass it as prop)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => { setIsSidebarOpen(!isSidebarOpen) }

  // Fixed canvas preview dimensions
  const previewWidth = 800
  const previewHeight = 450

  // Load base image
  useEffect(() => {
    if (!baseImageSrc) return setBaseImage(null)
    const img = new Image()
    img.src = baseImageSrc
    img.crossOrigin = 'anonymous'
    img.onload = () => setBaseImage(img)
    img.onerror = (e) => console.error("Failed to load base image:", e);
  }, [baseImageSrc])

  // Load logo image
  useEffect(() => {
    if (!logoImageSrc) return setLogoImage(null)
    const img = new Image()
    img.src = logoImageSrc
    img.crossOrigin = 'anonymous'
    img.onload = () => setLogoImage(img)
    img.onerror = (e) => {
        alert('Failed to load logo image. Please ensure it is a valid PNG.');
        console.error("Failed to load logo image:", e);
        setLogoImageSrc(null);
    }
  }, [logoImageSrc])

  // Draw logo on its own preview canvas (used for transformations)
  const drawLogoPreview = useCallback(() => {
    const canvas = logoPreviewCanvasRef.current
    if (!canvas || !logoImage) {
      if (canvas) { // Clear canvas if logo is null
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    // Set canvas dimensions large enough for high quality transformations, but not excessively so
    const maxDimension = 1000; // Cap internal canvas size for performance
    let logoCanvasWidth = logoImage.naturalWidth || logoImage.width;
    let logoCanvasHeight = logoImage.naturalHeight || logoImage.height;

    const aspectRatio = logoCanvasWidth / logoCanvasHeight;
    if (logoCanvasWidth > maxDimension || logoCanvasHeight > maxDimension) {
      if (logoCanvasWidth > logoCanvasHeight) {
        logoCanvasWidth = maxDimension;
        logoCanvasHeight = maxDimension / aspectRatio;
      } else {
        logoCanvasHeight = maxDimension;
        logoCanvasWidth = maxDimension * aspectRatio;
      }
    }

    canvas.width = logoCanvasWidth;
    canvas.height = logoCanvasHeight;

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    // Move origin to center of this temporary logo canvas
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Apply rotation
    ctx.rotate(logoRotation * (Math.PI / 180))

    // Calculate effective logo size based on actual image dimensions and zoom
    const originalLogoDrawWidth = logoImage.width;
    const originalLogoDrawHeight = logoImage.height;

    // Scale the logo to fit within the *preview canvas's minimum dimension* by default, then apply logoZoom
    // This ensures that 100% zoom makes the logo fit nicely without cutoff on its own preview.
    const fitScale = Math.min(canvas.width / originalLogoDrawWidth, canvas.height / originalLogoDrawHeight);
    const currentLogoScaleFactor = fitScale * (logoZoom / 100);

    ctx.scale(currentLogoScaleFactor, currentLogoScaleFactor);

    ctx.globalAlpha = logoOpacity / 100 // Opacity
    ctx.imageSmoothingEnabled = true;
    (ctx as any).imageSmoothingQuality = 'high';

    // Draw logo, centered on the new origin (which is the center of the canvas)
    const drawX = -originalLogoDrawWidth / 2
    const drawY = -originalLogoDrawHeight / 2

    // Apply clipping for radius
    // CRITICAL FIX for logoRadius: Scale the logoRadius inversely to the drawing scale factor
    // This ensures the radius appears constant regardless of zoom level.
    const effectiveLogoRadius = logoRadius / currentLogoScaleFactor;
    if (effectiveLogoRadius > 0) {
      clipRoundedRect(ctx, drawX, drawY, originalLogoDrawWidth, originalLogoDrawHeight, effectiveLogoRadius);
    }
    ctx.drawImage(logoImage, drawX, drawY, originalLogoDrawWidth, originalLogoDrawHeight)
    ctx.restore() // Restore state after drawing logo and clipping

    // Draw border
    if (logoBorderWidth > 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2); // Translate to center again for border
        ctx.rotate(logoRotation * (Math.PI / 180)); // Re-apply rotation for border
        ctx.scale(currentLogoScaleFactor, currentLogoScaleFactor); // Re-apply scale for border

        ctx.strokeStyle = logoBorderColor;
        // CRITICAL FIX for logoBorderWidth: Scale the borderWidth inversely to the drawing scale factor
        ctx.lineWidth = logoBorderWidth / currentLogoScaleFactor;

        // Draw the border around the logo's original dimensions, using the *scaled* radius
        drawRoundedRect(ctx, drawX, drawY, originalLogoDrawWidth, originalLogoDrawHeight, effectiveLogoRadius, ctx.lineWidth);
        ctx.restore();
    }

  }, [logoImage, logoZoom, logoRotation, logoOpacity, logoRadius, logoBorderWidth, logoBorderColor]) // Added logoRadius to dependencies

  // Update logo preview whenever logo or its transform settings change
  useEffect(() => {
    drawLogoPreview()
  }, [drawLogoPreview])


  // Draw combined image (base + transformed logo) for the main preview
  useEffect(() => {
    const canvas = combinedCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = previewWidth
    canvas.height = previewHeight
    ctx.clearRect(0, 0, previewWidth, previewHeight) // Clear canvas

    // 1. Draw base image
    if (baseImage) {
      ctx.drawImage(baseImage, 0, 0, previewWidth, previewHeight)
    }

    // 2. Draw logo container (background plate if white)
    const containerConfig = { top: 0.62, bottom: 0.76, hPadding: 0.35 }
    const containerY = previewHeight * containerConfig.top
    const containerHeight = previewHeight * (containerConfig.bottom - containerConfig.top)
    const containerX = previewWidth * containerConfig.hPadding
    const containerWidth = previewWidth * (1 - 2 * containerConfig.hPadding)

    if (logoImage && backgroundType === 'white') {
      const paddingRatio = 0.1
      const paddedWidth = containerWidth * (1 + paddingRatio) // Pad relative to container
      const paddedHeight = containerHeight * (1 + paddingRatio)
      const paddedX = containerX - (paddedWidth - containerWidth) / 2
      const paddedY = containerY - (paddedHeight - containerHeight) / 2
      ctx.fillStyle = 'white'
      ctx.fillRect(paddedX, paddedY, paddedWidth, paddedHeight)
    }

    // 3. Draw transformed logo from logoPreviewCanvas onto the main combined canvas
    if (logoImage && logoPreviewCanvasRef.current) {
      const transformedLogoCanvas = logoPreviewCanvasRef.current; // This canvas already has the transformed logo

      // Calculate the size of the transformed logo from its preview canvas.
      // This is the size of the logo AFTER its individual scaling/rotation from drawLogoPreview.
      const transformedLogoRenderWidth = transformedLogoCanvas.width;
      const transformedLogoRenderHeight = transformedLogoCanvas.height;

      // Determine max scale factor to fit this already transformed logo into the main container
      const scaleFactorToFitContainer = Math.min(
          containerWidth / transformedLogoRenderWidth,
          containerHeight / transformedLogoRenderHeight
      );

      const finalLogoWidth = transformedLogoRenderWidth * scaleFactorToFitContainer;
      const finalLogoHeight = transformedLogoRenderHeight * scaleFactorToFitContainer;

      // Calculate position: always centered in container, then apply offsets
      let x = containerX + (containerWidth - finalLogoWidth) / 2;
      let y = containerY + (containerHeight - finalLogoHeight) / 2;

      // Apply horizontal and vertical offsets
      x += (logoHorizontalOffset / 100) * containerWidth; // Offset based on container width
      y += (logoVerticalOffset / 100) * containerHeight; // Offset based on container height

      ctx.save();
      ctx.globalCompositeOperation = logoBlendMode; // Apply blend mode
      ctx.drawImage(transformedLogoCanvas, x, y, finalLogoWidth, finalLogoHeight);
      ctx.restore();
    }


  }, [baseImage, logoImage, backgroundType, logoHorizontalOffset, logoVerticalOffset, logoBlendMode, previewWidth, previewHeight, drawLogoPreview])


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
      URL.revokeObjectURL(objectUrl)
      startProgressAnimation(() => {
        setUploading(false)
        setShowUploadAnimation(false)
      })
    }
    img.onerror = () => {
      alert('Failed to load image. Please ensure it is a valid PNG.')
      setUploading(false)
      setShowUploadAnimation(false)
      setLogoImageSrc(null)
      URL.revokeObjectURL(objectUrl)
    }
    img.src = objectUrl
  }

  const handleReset = () => {
    setLogoImageSrc(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Reset all logo transform settings to initial defaults
    setLogoZoom(100)
    setLogoRotation(0)
    setLogoOpacity(100)
    setLogoBorderWidth(0)
    setLogoBorderColor('#ffffff')
    setLogoBlendMode('source-over')
    setLogoHorizontalOffset(0);
    setLogoVerticalOffset(0);
    setBackgroundType('original');
    setLogoRadius(0); // Also reset radius
  }

  const handleGenerateClick = () => {
    if (!baseImage || !logoImage) return
    setShowExportModal(true)
  }

  async function executeExport() {
    if (!baseImage || !logoImage || !logoPreviewCanvasRef.current) return
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

    // 1. Draw base image at export resolution
    ctx.drawImage(baseImage, 0, 0, outW, outH)

    // 2. Calculate logo container at export resolution
    const containerConfig = { top: 0.62, bottom: 0.76, hPadding: 0.35 }
    const containerY = outH * containerConfig.top
    const containerHeight = outH * (containerConfig.bottom - containerConfig.top)
    const containerX = outW * containerConfig.hPadding
    const containerWidth = outW * (1 - 2 * containerConfig.hPadding)

    // 3. Draw white background plate if selected
    if (backgroundType === 'white') {
      const paddingRatio = 0.1
      const paddedWidth = containerWidth * (1 + paddingRatio)
      const paddedHeight = containerHeight * (1 + paddingRatio)
      const paddedX = containerX - (paddedWidth - containerWidth) / 2
      const paddedY = containerY - (paddedHeight - containerHeight) / 2
      ctx.fillStyle = 'white'
      ctx.fillRect(paddedX, paddedY, paddedWidth, paddedHeight)
    }

    // 4. Draw transformed logo from logoPreviewCanvas onto the export canvas
    if (logoImage && logoPreviewCanvasRef.current) {
      const transformedLogoCanvas = logoPreviewCanvasRef.current;

      const transformedLogoRenderWidth = transformedLogoCanvas.width;
      const transformedLogoRenderHeight = transformedLogoCanvas.height;

      const scaleFactorToFitContainer = Math.min(
          containerWidth / transformedLogoRenderWidth,
          containerHeight / transformedLogoRenderHeight
      );

      const finalLogoWidth = transformedLogoRenderWidth * scaleFactorToFitContainer;
      const finalLogoHeight = transformedLogoRenderHeight * scaleFactorToFitContainer;

      let x = containerX + (containerWidth - finalLogoWidth) / 2;
      let y = containerY + (containerHeight - finalLogoHeight) / 2;

      // Apply horizontal and vertical offsets
      x += (logoHorizontalOffset / 100) * containerWidth; // Offset based on container width
      y += (logoVerticalOffset / 100) * containerHeight; // Offset based on container height

      ctx.save();
      ctx.globalCompositeOperation = logoBlendMode;
      ctx.drawImage(transformedLogoCanvas, x, y, finalLogoWidth, finalLogoHeight);
      ctx.restore();
    }

    const mimeType = `image/${exportSettings.format}`
    let dataUrl = exportCanvas.toDataURL(mimeType, exportSettings.quality)

    if (exportSettings.format === 'png') {
      dataUrl = setPngDpi(dataUrl, 300)
    } else if (exportSettings.format === 'jpeg') {
      dataUrl = setJpegDpi(dataUrl, 300)
    }

    // CRITICAL FIX: Directly convert base64 data URL to Blob to avoid Failed to fetch
    const base64Data = dataUrl.split(',')[1]
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })

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
    // Outer container: transparent on large screens (AuthBackground shows), black on mobile
    <div className="flex flex-col h-full bg-transparent md:bg-black">
      {/* Header for this specific page */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">SSI Studios</h1>
          {/* Mobile hamburger button, controlled locally */}
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-white lg:hidden focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <HiX size={28} /> : <HiOutlineMenu size={28} />}
          </button>
        </div>
        <p className="text-gray-400 mt-2 lg:mt-1 lg:ml-auto">Bring your vision to life. Upload a logo to begin.</p>
      </header>

      {/* Main Grid Layout for Editor */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Upload and Controls */}
        <div className="lg:col-span-1 bg-[#1a1b1f] border border-gray-700/50 rounded-xl p-6 flex flex-col gap-8 shadow-lg">
          <div className="pb-4 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">1. Logo Source</h2>
            <label
              htmlFor="logo-upload"
              className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-200 px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 shadow-md w-full"
              aria-disabled={uploading || generating}
            >
              <AiOutlineUpload size={22} />
              <span>{logoImage ? 'Change Logo' : 'Upload PNG Logo'}</span>
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

          <div className={`flex-1 transition-opacity duration-500 ${!logoImage ? 'opacity-30 pointer-events-none' : ''}`}>
            <h2 className="text-xl font-semibold text-white mb-4">2. Transformations</h2>
            <div className="space-y-6">
              {/* Logo Zoom (within container) */}
              <div>
                <label htmlFor="logo-zoom" className="block font-medium text-gray-300 text-sm mb-2">
                  Zoom/Fit: {logoZoom}%
                </label>
                <input
                  id="logo-zoom"
                  type="range"
                  min="10"
                  max="200"
                  value={logoZoom}
                  onChange={(e) => setLogoZoom(Number(e.target.value))}
                  disabled={!logoImage}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
                />
              </div>

              {/* Logo Rotation */}
              <div>
                <label htmlFor="logo-rotation" className="block font-medium text-gray-300 text-sm mb-2">
                  Rotation: {logoRotation}°
                </label>
                <input
                  id="logo-rotation"
                  type="range"
                  min="-180"
                  max="180"
                  value={logoRotation}
                  onChange={(e) => setLogoRotation(Number(e.target.value))}
                  disabled={!logoImage}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
                />
              </div>

              {/* Logo Opacity */}
              <div>
                <label htmlFor="logo-opacity" className="block font-medium text-gray-300 text-sm mb-2">
                  Opacity: {logoOpacity}%
                </label>
                <input
                  id="logo-opacity"
                  type="range"
                  min="0"
                  max="100"
                  value={logoOpacity}
                  onChange={(e) => setLogoOpacity(Number(e.target.value))}
                  disabled={!logoImage}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
                />
              </div>

              {/* Logo Corner Radius */}
              <div>
                <label htmlFor="logo-radius" className="block font-medium text-gray-300 text-sm mb-2">
                  Corner Radius: {logoRadius}px
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

              {/* Horizontal Offset */}
              <div>
                <label htmlFor="logo-horizontal-offset" className="block font-medium text-gray-300 text-sm mb-2">
                  Horizontal Offset: {logoHorizontalOffset}%
                </label>
                <input
                  id="logo-horizontal-offset"
                  type="range"
                  min="-50"
                  max="50"
                  value={logoHorizontalOffset}
                  onChange={(e) => setLogoHorizontalOffset(Number(e.target.value))}
                  disabled={!logoImage}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
                />
              </div>

              {/* Vertical Offset */}
              <div>
                <label htmlFor="logo-vertical-offset" className="block font-medium text-gray-300 text-sm mb-2">
                  Vertical Offset: {logoVerticalOffset}%
                </label>
                <input
                  id="logo-vertical-offset"
                  type="range"
                  min="-50"
                  max="50"
                  value={logoVerticalOffset}
                  onChange={(e) => setLogoVerticalOffset(Number(e.target.value))}
                  disabled={!logoImage}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
                />
              </div>

              {/* Logo Border */}
              <div>
                <label htmlFor="logo-border-width" className="block font-medium text-gray-300 text-sm mb-2">
                  Border Width: {logoBorderWidth}px
                </label>
                <input
                  id="logo-border-width"
                  type="range"
                  min="0"
                  max="20"
                  value={logoBorderWidth}
                  onChange={(e) => setLogoBorderWidth(Number(e.target.value))}
                  disabled={!logoImage}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
                />
                <div className="mt-2">
                  <label htmlFor="logo-border-color" className="block font-medium text-gray-300 text-sm mb-2">
                    Border Color:
                  </label>
                  <input
                    id="logo-border-color"
                    type="color"
                    value={logoBorderColor}
                    onChange={(e) => setLogoBorderColor(e.target.value)}
                    disabled={!logoImage || logoBorderWidth === 0}
                    className="w-full h-10 border border-gray-600 rounded-md cursor-pointer"
                  />
                </div>
              </div>

              {/* Blend Mode */}
              <div>
                <label htmlFor="blend-mode" className="block font-medium text-gray-300 text-sm mb-2">
                  Blend Mode:
                </label>
                <select
                  id="blend-mode"
                  value={logoBlendMode}
                  onChange={(e) => setLogoBlendMode(e.target.value as BlendMode)}
                  disabled={!logoImage}
                  className="w-full bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md px-4 py-2 cursor-pointer outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 hover:border-gray-500 transition-colors"
                >
                  {BLEND_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Logo Background Plate */}
              <div>
                <label htmlFor="background-select" className="block font-medium text-gray-300 text-sm mb-2">
                  Logo Background Plate
                </label>
                <select
                  id="background-select"
                  value={backgroundType}
                  onChange={(e) => setBackgroundType(e.target.value as 'original' | 'white')}
                  disabled={!logoImage}
                  className="w-full bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md px-4 py-2 cursor-pointer outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 hover:border-gray-500 transition-colors"
                >
                  <option value="original">Transparent (No Plate)</option>
                  <option value="white">White Plate</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-gray-700/50">
            <button
              onClick={handleGenerateClick}
              disabled={!logoImage || generating}
              className="flex items-center justify-center gap-3 bg-[#4CAF50] hover:bg-[#45a049] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#4CAF50]/40"
            >
              <AiOutlineDownload size={22} />
              {generating ? 'Exporting...' : 'Export Poster'}
            </button>
            {logoImage && (
              <button
                onClick={handleReset}
                disabled={uploading || generating}
                className="flex items-center justify-center gap-2 bg-[#FFC107] hover:bg-[#e0a800] disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-medium px-5 py-2 rounded-lg transition-all duration-300 text-sm shadow-md"
              >
                <AiOutlineReload size={18} />
                Reset All Adjustments
              </button>
            )}
          </div>
        </div>

        {/* Right Panel: Main Preview and Logo-Only Preview */}
        <div className="lg:col-span-2 relative w-full h-full min-h-[60vh] flex flex-col gap-6">
          {/* Main Combined Preview Card */}
          <div className="relative w-full aspect-video rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl shadow-black/30 bg-[#1a1b1f] flex items-center justify-center">
            <canvas
              ref={combinedCanvasRef}
              className="absolute inset-0 w-full h-full"
            />
            {!baseImage && (
                <div className="flex items-center justify-center text-gray-500 text-xl font-semibold">
                    Loading base image...
                </div>
            )}
            {!logoImage && baseImage && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl font-semibold bg-black/50">
                    Upload a logo to start editing.
                </div>
            )}
          </div>

          {/* New: Logo-Only Preview Card */}
          <div className={`relative w-full aspect-video rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl shadow-black/30 ${logoImage ? 'bg-[#1a1b1f]' : 'bg-transparent'} flex items-center justify-center`}>
            <h3 className="absolute top-4 left-4 text-sm font-semibold text-gray-400 z-10">Logo Preview (Transparent Background)</h3>
            <canvas
              ref={logoPreviewCanvasRef}
              className="absolute inset-0 w-full h-full"
            />
            {!logoImage && (
                <div className="flex items-center justify-center text-gray-500 text-lg font-semibold bg-black/50">
                    Logo preview will appear here.
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload/Generating Animations (unchanged) */}
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
                stroke="#4CAF50" // Changed color
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
              className="bg-[#1a1b1f] border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-6" // Changed bg color
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
                    className="w-full bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md px-4 py-2 cursor-pointer outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 hover:border-gray-500 transition-colors"
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
                    className="w-full bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md px-4 py-2 cursor-pointer outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 hover:border-gray-500 transition-colors"
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
                  className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold px-6 py-2 rounded-lg transition-colors" // Changed color
                >
                  Export Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* General styling for range sliders */
        .range-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          background: #3b3b3b;
          outline: none;
          opacity: 0.8; /* Slightly less opaque for professional feel */
          transition: opacity .2s;
          border-radius: 4px;
        }

        .range-slider:hover {
          opacity: 1;
        }

        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: #4CAF50; /* Green accent color */
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #ffffff;
          margin-top: -5px;
          box-shadow: 0px 0px 4px rgba(0,0,0,0.4);
          transition: background 0.2s, transform 0.1s;
        }

        .range-slider::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }

        .range-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #4CAF50; /* Green accent color */
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0px 0px 4px rgba(0,0,0,0.4);
          transition: background 0.2s, transform 0.1s;
        }

        .range-slider::-moz-range-thumb:active {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}