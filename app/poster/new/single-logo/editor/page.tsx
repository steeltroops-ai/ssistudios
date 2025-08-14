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

  // Logo transformation states
  const [logoZoom, setLogoZoom] = useState(100)
  const [logoRotation, setLogoRotation] = useState(0)
  const [logoOpacity, setLogoOpacity] = useState(100)
  const [logoBorderWidth, setLogoBorderWidth] = useState(0)
  const [logoBorderColor, setLogoBorderColor] = useState('#ffffff')
  const [logoBlendMode, setLogoBlendMode] = useState<BlendMode>('source-over')
  const [logoHorizontalOffset, setLogoHorizontalOffset] = useState(0);
  const [logoVerticalOffset, setLogoVerticalOffset] = useState(0);
  const [logoRadius, setLogoRadius] = useState(0);
  const [logoPlateHorizontalPadding, setLogoPlateHorizontalPadding] = useState(15);
  const [logoPlateVerticalPadding, setLogoPlateVerticalPadding] = useState(15);

  const [showExportModal, setShowExportModal] = useState(false)

  const [exportSettings, setExportSettings] = useState({
    format: 'jpeg' as ExportFormat,
    resolution: RESOLUTIONS[0],
    quality: 1.0
  })

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => { setIsSidebarOpen(!isSidebarOpen) }

  const previewWidth = 800
  const previewHeight = 450

  useEffect(() => {
    if (!baseImageSrc) return setBaseImage(null)
    const img = new Image()
    img.src = baseImageSrc
    img.crossOrigin = 'anonymous'
    img.onload = () => setBaseImage(img)
    img.onerror = (e) => console.error("Failed to load base image:", e);
  }, [baseImageSrc])

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

  const drawLogoPreview = useCallback(() => {
    const canvas = logoPreviewCanvasRef.current
    if (!canvas || !logoImage) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const maxDimension = 1000;
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

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(logoRotation * (Math.PI / 180))

    const originalLogoDrawWidth = logoImage.width;
    const originalLogoDrawHeight = logoImage.height;

    const fitScale = Math.min(canvas.width / originalLogoDrawWidth, canvas.height / originalLogoDrawHeight);
    const currentLogoScaleFactor = fitScale * (logoZoom / 100);

    ctx.scale(currentLogoScaleFactor, currentLogoScaleFactor);

    ctx.globalAlpha = logoOpacity / 100
    ctx.imageSmoothingEnabled = true;
    (ctx as any).imageSmoothingQuality = 'high';

    const drawX = -originalLogoDrawWidth / 2
    const drawY = -originalLogoDrawHeight / 2

    const effectiveLogoRadius = logoRadius / currentLogoScaleFactor;
    if (effectiveLogoRadius > 0) {
      clipRoundedRect(ctx, drawX, drawY, originalLogoDrawWidth, originalLogoDrawHeight, effectiveLogoRadius);
    }
    ctx.drawImage(logoImage, drawX, drawY, originalLogoDrawWidth, originalLogoDrawHeight)
    ctx.restore()

    if (logoBorderWidth > 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(logoRotation * (Math.PI / 180));
        ctx.scale(currentLogoScaleFactor, currentLogoScaleFactor);
        ctx.strokeStyle = logoBorderColor;
        ctx.lineWidth = logoBorderWidth / currentLogoScaleFactor;
        drawRoundedRect(ctx, drawX, drawY, originalLogoDrawWidth, originalLogoDrawHeight, effectiveLogoRadius, ctx.lineWidth);
        ctx.restore();
    }
  }, [logoImage, logoZoom, logoRotation, logoOpacity, logoRadius, logoBorderWidth, logoBorderColor])

  useEffect(() => {
    drawLogoPreview()
  }, [drawLogoPreview])

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

    if (logoImage && logoPreviewCanvasRef.current) {
        const transformedLogoCanvas = logoPreviewCanvasRef.current;
        const containerConfig = { top: 0.62, bottom: 0.76, hPadding: 0.35 };
        const containerY = previewHeight * containerConfig.top;
        const containerHeight = previewHeight * (containerConfig.bottom - containerConfig.top);
        const containerX = previewWidth * containerConfig.hPadding;
        const containerWidth = previewWidth * (1 - 2 * containerConfig.hPadding);
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
        x += (logoHorizontalOffset / 100) * containerWidth;
        y += (logoVerticalOffset / 100) * containerHeight;

        if (backgroundType === 'white') {
            const hPadding = finalLogoWidth * (logoPlateHorizontalPadding / 100);
            const vPadding = finalLogoHeight * (logoPlateVerticalPadding / 100);
            const plateWidth = finalLogoWidth + hPadding * 2;
            const plateHeight = finalLogoHeight + vPadding * 2;
            const plateX = x - hPadding;
            const plateY = y - vPadding;
            ctx.fillStyle = 'white';
            ctx.fillRect(plateX, plateY, plateWidth, plateHeight);
        }

        ctx.save();
        ctx.globalCompositeOperation = logoBlendMode;
        ctx.drawImage(transformedLogoCanvas, x, y, finalLogoWidth, finalLogoHeight);
        ctx.restore();
    }
  }, [
    baseImage, logoImage, backgroundType, logoHorizontalOffset, logoVerticalOffset, 
    logoBlendMode, previewWidth, previewHeight, drawLogoPreview, 
    logoPlateHorizontalPadding, logoPlateVerticalPadding
  ])

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

    ctx.drawImage(baseImage, 0, 0, outW, outH)

    const transformedLogoCanvas = logoPreviewCanvasRef.current;
    const containerConfig = { top: 0.62, bottom: 0.76, hPadding: 0.35 }
    const containerY = outH * containerConfig.top
    const containerHeight = outH * (containerConfig.bottom - containerConfig.top)
    const containerX = outW * containerConfig.hPadding
    const containerWidth = outW * (1 - 2 * containerConfig.hPadding)
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
    x += (logoHorizontalOffset / 100) * containerWidth;
    y += (logoVerticalOffset / 100) * containerHeight;

    if (backgroundType === 'white') {
        const hPadding = finalLogoWidth * (logoPlateHorizontalPadding / 100);
        const vPadding = finalLogoHeight * (logoPlateVerticalPadding / 100);
        const plateWidth = finalLogoWidth + hPadding * 2;
        const plateHeight = finalLogoHeight + vPadding * 2;
        const plateX = x - hPadding;
        const plateY = y - vPadding;
        ctx.fillStyle = 'white';
        ctx.fillRect(plateX, plateY, plateWidth, plateHeight);
    }

    ctx.save();
    ctx.globalCompositeOperation = logoBlendMode;
    ctx.drawImage(transformedLogoCanvas, x, y, finalLogoWidth, finalLogoHeight);
    ctx.restore();

    const mimeType = `image/${exportSettings.format}`
    let dataUrl = exportCanvas.toDataURL(mimeType, exportSettings.quality)
    if (exportSettings.format === 'png') {
      dataUrl = setPngDpi(dataUrl, 300)
    } else if (exportSettings.format === 'jpeg') {
      dataUrl = setJpegDpi(dataUrl, 300)
    }
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

  // Component for individual reset buttons
  const ResetButton = ({ onReset, isDefault }: { onReset: () => void; isDefault: boolean }) => (
    <button
      onClick={onReset}
      className={`text-gray-500 hover:text-white transition-opacity duration-200 ${isDefault ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      aria-label="Reset setting"
    >
      <AiOutlineReload size={14} />
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-transparent md:bg-black">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">SSI Studios</h1>
          <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-white lg:hidden focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md" aria-label="Toggle sidebar">
            {isSidebarOpen ? <HiX size={28} /> : <HiOutlineMenu size={28} />}
          </button>
        </div>
        <p className="text-gray-400 mt-2 lg:mt-1 lg:ml-auto">Bring your vision to life. Upload a logo to begin.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[#1a1b1f] border border-gray-700/50 rounded-xl p-6 flex flex-col gap-8 shadow-lg">
          <div className="pb-4 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">1. Logo Source</h2>
            <label htmlFor="logo-upload" className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-200 px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 shadow-md w-full" aria-disabled={uploading || generating}>
              <AiOutlineUpload size={22} />
              <span>{logoImage ? 'Change Logo' : 'Upload PNG Logo'}</span>
              <input id="logo-upload" type="file" accept="image/png" onChange={handleLogoUpload} disabled={uploading || generating} className="hidden" ref={fileInputRef} />
            </label>
          </div>

          <div className={`flex-1 transition-opacity duration-500 ${!logoImage ? 'opacity-30 pointer-events-none' : ''}`}>
            <h2 className="text-xl font-semibold text-white mb-4">2. Transformations</h2>
            <div className="space-y-6">
              
              {/* Zoom */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="logo-zoom" className="font-medium text-gray-300 text-sm">Zoom/Fit: {logoZoom}%</label>
                  <ResetButton onReset={() => setLogoZoom(100)} isDefault={logoZoom === 100} />
                </div>
                <input id="logo-zoom" type="range" min="10" max="200" value={logoZoom} onChange={(e) => setLogoZoom(Number(e.target.value))} disabled={!logoImage} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider" />
              </div>

              {/* Rotation */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="logo-rotation" className="font-medium text-gray-300 text-sm">Rotation: {logoRotation}°</label>
                  <ResetButton onReset={() => setLogoRotation(0)} isDefault={logoRotation === 0} />
                </div>
                <input id="logo-rotation" type="range" min="-180" max="180" value={logoRotation} onChange={(e) => setLogoRotation(Number(e.target.value))} disabled={!logoImage} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider" />
              </div>

              {/* Opacity */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="logo-opacity" className="font-medium text-gray-300 text-sm">Opacity: {logoOpacity}%</label>
                  <ResetButton onReset={() => setLogoOpacity(100)} isDefault={logoOpacity === 100} />
                </div>
                <input id="logo-opacity" type="range" min="0" max="100" value={logoOpacity} onChange={(e) => setLogoOpacity(Number(e.target.value))} disabled={!logoImage} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider" />
              </div>

              {/* Corner Radius */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="logo-radius" className="font-medium text-gray-300 text-sm">Corner Radius: {logoRadius}px</label>
                  <ResetButton onReset={() => setLogoRadius(0)} isDefault={logoRadius === 0} />
                </div>
                <input id="logo-radius" type="range" min="0" max="50" value={logoRadius} onChange={(e) => setLogoRadius(Number(e.target.value))} disabled={!logoImage} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider" />
              </div>

              {/* Horizontal Offset */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="logo-horizontal-offset" className="font-medium text-gray-300 text-sm">Horizontal Offset: {logoHorizontalOffset}%</label>
                  <ResetButton onReset={() => setLogoHorizontalOffset(0)} isDefault={logoHorizontalOffset === 0} />
                </div>
                <input id="logo-horizontal-offset" type="range" min="-50" max="50" value={logoHorizontalOffset} onChange={(e) => setLogoHorizontalOffset(Number(e.target.value))} disabled={!logoImage} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider" />
              </div>

              {/* Vertical Offset */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="logo-vertical-offset" className="font-medium text-gray-300 text-sm">Vertical Offset: {logoVerticalOffset}%</label>
                  <ResetButton onReset={() => setLogoVerticalOffset(0)} isDefault={logoVerticalOffset === 0} />
                </div>
                <input id="logo-vertical-offset" type="range" min="-50" max="50" value={logoVerticalOffset} onChange={(e) => setLogoVerticalOffset(Number(e.target.value))} disabled={!logoImage} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider" />
              </div>

              {/* Border */}
              <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="logo-border-width" className="font-medium text-gray-300 text-sm">Border Width: {logoBorderWidth}px</label>
                    <ResetButton onReset={() => setLogoBorderWidth(0)} isDefault={logoBorderWidth === 0} />
                </div>
                <input id="logo-border-width" type="range" min="0" max="20" value={logoBorderWidth} onChange={(e) => setLogoBorderWidth(Number(e.target.value))} disabled={!logoImage} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider" />
                <div className="mt-2">
                  <label htmlFor="logo-border-color" className="block font-medium text-gray-300 text-sm mb-2">Border Color:</label>
                  <input id="logo-border-color" type="color" value={logoBorderColor} onChange={(e) => setLogoBorderColor(e.target.value)} disabled={!logoImage || logoBorderWidth === 0} className="w-full h-10 border border-gray-600 rounded-md cursor-pointer" />
                </div>
              </div>

              {/* Blend Mode */}
              <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="blend-mode" className="font-medium text-gray-300 text-sm">Blend Mode:</label>
                    <ResetButton onReset={() => setLogoBlendMode('source-over')} isDefault={logoBlendMode === 'source-over'} />
                </div>
                <select id="blend-mode" value={logoBlendMode} onChange={(e) => setLogoBlendMode(e.target.value as BlendMode)} disabled={!logoImage} className="w-full bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md px-4 py-2 cursor-pointer outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 hover:border-gray-500 transition-colors">
                  {BLEND_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Logo Background Plate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="background-select" className="font-medium text-gray-300 text-sm">Logo Background Plate</label>
                  <ResetButton onReset={() => { setBackgroundType('original'); setLogoPlateHorizontalPadding(15); setLogoPlateVerticalPadding(15); }} isDefault={backgroundType === 'original'} />
                </div>
                <select id="background-select" value={backgroundType} onChange={(e) => setBackgroundType(e.target.value as 'original' | 'white')} disabled={!logoImage} className="w-full bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md px-4 py-2 cursor-pointer outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 hover:border-gray-500 transition-colors">
                  <option value="original">Transparent (No Plate)</option>
                  <option value="white">White Plate</option>
                </select>
                
                <AnimatePresence>
                  {backgroundType === 'white' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }} exit={{ opacity: 0, height: 0, marginTop: '0rem' }} className="overflow-hidden">
                      <div className="space-y-4 pt-4 border-t border-gray-700/50">
                        <div>
                          <label htmlFor="plate-h-padding" className="block font-medium text-gray-400 text-xs mb-2">Plate Horizontal Padding: {logoPlateHorizontalPadding}%</label>
                          <input id="plate-h-padding" type="range" min="0" max="100" value={logoPlateHorizontalPadding} onChange={(e) => setLogoPlateHorizontalPadding(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider" />
                        </div>
                        <div>
                          <label htmlFor="plate-v-padding" className="block font-medium text-gray-400 text-xs mb-2">Plate Vertical Padding: {logoPlateVerticalPadding}%</label>
                          <input id="plate-v-padding" type="range" min="0" max="100" value={logoPlateVerticalPadding} onChange={(e) => setLogoPlateVerticalPadding(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-gray-700/50">
            <button onClick={handleGenerateClick} disabled={!logoImage || generating} className="flex items-center justify-center gap-3 bg-[#4CAF50] hover:bg-[#45a049] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#4CAF50]/40">
              <AiOutlineDownload size={22} />
              {generating ? 'Exporting...' : 'Export Poster'}
            </button>
            {/* The single reset button has been removed from here */}
          </div>
        </div>

        <div className="lg:col-span-2 relative w-full h-full min-h-[60vh] flex flex-col gap-6">
          <div className="relative w-full aspect-video rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl shadow-black/30 bg-[#1a1b1f] flex items-center justify-center">
            <canvas ref={combinedCanvasRef} className="absolute inset-0 w-full h-full" />
            {!baseImage && <div className="flex items-center justify-center text-gray-500 text-xl font-semibold">Loading base image...</div>}
            {!logoImage && baseImage && <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl font-semibold bg-black/50">Upload a logo to start editing.</div>}
          </div>
          <div className={`relative w-full aspect-video rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl shadow-black/30 ${logoImage ? 'bg-[#1a1b1f]' : 'bg-transparent'} flex items-center justify-center`}>
            <h3 className="absolute top-4 left-4 text-sm font-semibold text-gray-400 z-10">Logo Preview (Transparent Background)</h3>
            <canvas ref={logoPreviewCanvasRef} className="absolute inset-0 w-full h-full" />
            {!logoImage && <div className="flex items-center justify-center text-gray-500 text-lg font-semibold bg-black/50">Logo preview will appear here.</div>}
          </div>
        </div>
      </div>

      <AnimatePresence>{showUploadAnimation && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"> <svg className="w-24 h-24 mb-4 text-gray-400" viewBox="0 0 100 100" aria-label="Loading progress"> <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.25" /> <motion.circle cx="50" cy="50" r="44" stroke="#4CAF50" strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} className="animate-pulse" /> </svg> <p className="text-gray-200 text-lg font-semibold select-none">UPLOADING... {progress}%</p> </motion.div> )}</AnimatePresence>
      <AnimatePresence>{showExportModal && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"> <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#1a1b1f] border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-6"> <h2 className="text-2xl font-bold text-white mb-6">Export Settings</h2> <div className="space-y-4"> <div> <label htmlFor="export-format" className="block font-medium text-gray-300 text-sm mb-2"> Format </label> <select id="export-format" value={exportSettings.format} onChange={(e) => setExportSettings({ ...exportSettings, format: e.target.value as ExportFormat })} className="w-full bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md px-4 py-2 cursor-pointer outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 hover:border-gray-500 transition-colors"> <option value="png">PNG (Lossless, Large File)</option> <option value="jpeg">JPEG (Max Quality, 300 DPI)</option> </select> </div> <div> <label htmlFor="export-resolution" className="block font-medium text-gray-300 text-sm mb-2"> Resolution </label> <select id="export-resolution" value={exportSettings.resolution.name} onChange={(e) => setExportSettings({ ...exportSettings, resolution: RESOLUTIONS.find((r) => r.name === e.target.value) || RESOLUTIONS[0] })} className="w-full bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-md px-4 py-2 cursor-pointer outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 hover:border-gray-500 transition-colors"> {RESOLUTIONS.map((r) => ( <option key={r.name} value={r.name}> {r.name} </option> ))} </select> </div> <p className="text-xs text-gray-400 text-center pt-2"> PNG & JPEG exports embed a true 300 DPI tag. “Use Original” keeps the base image’s native pixels. </p> </div> <div className="mt-8 flex justify-end gap-4"> <button onClick={() => setShowExportModal(false)} className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold px-4 py-2 rounded-lg transition-colors"> Cancel </button> <button onClick={executeExport} className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold px-6 py-2 rounded-lg transition-colors"> Export Now </button> </div> </motion.div> </motion.div> )}</AnimatePresence>

      <style jsx global>{`
        /* General styling for range sliders */
        .range-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; background: #3b3b3b; outline: none; opacity: 0.8; transition: opacity .2s; border-radius: 4px; }
        .range-slider:hover { opacity: 1; }
        .range-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; background: #4CAF50; border-radius: 50%; cursor: pointer; border: 2px solid #ffffff; margin-top: -5px; box-shadow: 0px 0px 4px rgba(0,0,0,0.4); transition: background 0.2s, transform 0.1s; }
        .range-slider::-webkit-slider-thumb:active { transform: scale(1.1); }
        .range-slider::-moz-range-thumb { width: 18px; height: 18px; background: #4CAF50; border-radius: 50%; cursor: pointer; border: 2px solid #ffffff; box-shadow: 0px 0px 4px rgba(0,0,0,0.4); transition: background 0.2s, transform 0.1s; }
        .range-slider::-moz-range-thumb:active { transform: scale(1.1); }
      `}</style>
    </div>
  )
}