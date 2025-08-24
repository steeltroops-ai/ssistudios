"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Target,
  Grid,
  MonitorUp,
  Palette,
  SlidersHorizontal,
  X, // For closing mobile panels
  Menu, // A generic icon for mobile buttons
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Helper functions (loadImageFromSrc, loadImageFromFile, drawRoundedImage, clamp) remain the same
// ... (keep your existing helper functions here) ...
// Helper: load a File/URL into an HTMLImageElement
async function loadImageFromSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (errorEvent) =>
      reject(
        new Error(
          `Failed to load image from source. Error: ${errorEvent.toString()}`
        )
      );
    img.src = src;
  });
}

async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (errorEvent) => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          `Failed to load image from file "${
            file.name
          }". Error: ${errorEvent.toString()}`
        )
      );
    };
    img.src = url;
  });
}

function drawRoundedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.save();
  ctx.beginPath();
  const right = x + w;
  const bottom = y + h;
  ctx.moveTo(x + radius, y);
  ctx.lineTo(right - radius, y);
  ctx.quadraticCurveTo(right, y, right, y + radius);
  ctx.lineTo(right, bottom - radius);
  ctx.quadraticCurveTo(right, bottom, right - radius, bottom);
  ctx.lineTo(x + radius, bottom);
  ctx.quadraticCurveTo(x, bottom, x, bottom - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();
}

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));
// Default template sizes for quick selection
const PRESETS = [
  { label: "1080 x 1080 (Square)", w: 1080, h: 1080 },
  { label: "1920 x 1080 (HD)", w: 1920, h: 1080 },
  { label: "1080 x 1920 (Story)", w: 1080, h: 1920 },
  { label: "2048 x 1152 (YouTube Banner)", w: 2048, h: 1152 },
];

export default function TemplateLogoEditor() {
  // Canvas & state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);

  // Composition settings
  const [tplW, setTplW] = useState(1920);
  const [tplH, setTplH] = useState(1080);
  const [zoom, setZoom] = useState(0.5); // preview zoom
  const [showGrid, setShowGrid] = useState(true);

  const [autoBottomCenter, setAutoBottomCenter] = useState(true);
  const [marginBottom, setMarginBottom] = useState(32);

  const [logoScalePct, setLogoScalePct] = useState(28);
  const [cornerRadius, setCornerRadius] = useState(20);

  // Manual overrides
  const [logoX, setLogoX] = useState(0);
  const [logoY, setLogoY] = useState(0);

  // Drag move
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // ✨ RESPONSIVE STATE: For managing mobile panel visibility
  const [isAssetsPanelOpen, setAssetsPanelOpen] = useState(false);
  const [isControlsPanelOpen, setControlsPanelOpen] = useState(false);

  // Derived logo render rect (No changes needed here)
  const logoRect = useMemo(() => {
    if (!logoImg) return null;
    const maxLogoW = (logoScalePct / 100) * tplW;
    const scale = maxLogoW / logoImg.width;
    const w = logoImg.width * scale;
    const h = logoImg.height * scale;

    if (autoBottomCenter) {
      const x = Math.round((tplW - w) / 2);
      const y = Math.round(tplH - h - marginBottom);
      return { x, y, w, h };
    } else {
      const x = clamp(logoX, 0, Math.max(0, tplW - w));
      const y = clamp(logoY, 0, Math.max(0, tplH - h));
      return { x, y, w, h };
    }
  }, [
    logoImg,
    tplW,
    tplH,
    logoScalePct,
    autoBottomCenter,
    logoX,
    logoY,
    marginBottom,
  ]);

  // Draw composition on canvas (No changes needed here)
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = tplW;
    canvas.height = tplH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    // @ts-ignore
    ctx.imageSmoothingQuality = "high";

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, tplW, tplH);

    if (templateImg) {
      ctx.drawImage(templateImg, 0, 0, tplW, tplH);
    }

    if (logoImg && logoRect) {
      drawRoundedImage(
        ctx,
        logoImg,
        logoRect.x,
        logoRect.y,
        logoRect.w,
        logoRect.h,
        cornerRadius
      );
    }
  }, [templateImg, logoImg, logoRect, cornerRadius, tplW, tplH]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Pointer interactions, keyboard nudge, exportPNG, and file handlers remain the same
  // ... (keep all your existing handler functions here) ...
  const previewRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!logoRect || autoBottomCenter) return;
    const rect = (
      previewRef.current as HTMLDivElement
    ).getBoundingClientRect();
    const px = (event.clientX - rect.left) / zoom;
    const py = (event.clientY - rect.top) / zoom;
    const inside =
      px >= logoRect.x &&
      px <= logoRect.x + logoRect.w &&
      py >= logoRect.y &&
      py <= logoRect.y + logoRect.h;
    if (inside) {
      setDragging(true);
      dragOffset.current = { x: px - logoRect.x, y: py - logoRect.y };
    }
  };
  const handlePointerMove = (event: React.PointerEvent) => {
    if (!dragging || !logoRect || autoBottomCenter) return;
    const rect = (
      previewRef.current as HTMLDivElement
    ).getBoundingClientRect();
    const px = (event.clientX - rect.left) / zoom;
    const py = (event.clientY - rect.top) / zoom;
    const nx = clamp(px - dragOffset.current.x, 0, tplW - logoRect.w);
    const ny = clamp(py - dragOffset.current.y, 0, tplH - logoRect.h);
    setLogoX(Math.round(nx));
    setLogoY(Math.round(ny));
  };
  const handlePointerUp = () => setDragging(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (autoBottomCenter || !logoRect) return;
      const step = event.shiftKey ? 10 : 1;
      if (event.key === "ArrowLeft")
        setLogoX((prevX) => clamp(prevX - step, 0, tplW - logoRect.w));
      if (event.key === "ArrowRight")
        setLogoX((prevX) => clamp(prevX + step, 0, tplW - logoRect.w));
      if (event.key === "ArrowUp")
        setLogoY((prevY) => clamp(prevY - step, 0, tplH - logoRect.h));
      if (event.key === "ArrowDown")
        setLogoY((prevY) => clamp(prevY + step, 0, tplH - logoRect.h));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [autoBottomCenter, logoRect, tplW, tplH]);

  const exportPNG = async (scale = 2) => {
    const src = canvasRef.current;
    if (!src) return;
    const out = document.createElement("canvas");
    out.width = Math.round(tplW * scale);
    out.height = Math.round(tplH * scale);
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    // @ts-ignore
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, out.width, out.height);
    if (templateImg) {
      ctx.drawImage(templateImg, 0, 0, out.width, out.height);
    }
    if (logoImg && logoRect) {
      const s = scale;
      drawRoundedImage(
        ctx,
        logoImg,
        Math.round(logoRect.x * s),
        Math.round(logoRect.y * s),
        Math.round(logoRect.w * s),
        Math.round(logoRect.h * s),
        Math.round(cornerRadius * s)
      );
    }
    const data = out.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = data;
    a.download = `export_${tplW}x${tplH}.png`;
    a.click();
  };

  const onTemplateFile = async (file?: File) => {
    if (!file) return;
    try {
      const img = await loadImageFromFile(file);
      setTemplateImg(img);
      setTplW(img.naturalWidth || img.width);
      setTplH(img.naturalHeight || img.height);
    } catch (error) {
      console.error("Template load failed", error);
    }
  };

  const onLogoFile = async (file?: File) => {
    if (!file) return;
    try {
      const img = await loadImageFromFile(file);
      setLogoImg(img);
      setAutoBottomCenter(true);
    } catch (error) {
      console.error("Logo load failed", error);
    }
  };

  // ✨ JSX for Panels, extracted for re-use and clarity
  const AssetsPanel = () => (
    <div className="border-r border-neutral-900 p-2 flex flex-col gap-2 bg-black/80 backdrop-blur-sm overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold uppercase tracking-wide text-neutral-400 px-1">
          Assets
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setAssetsPanelOpen(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      {/* Template uploader */}
      <div className="rounded-lg border border-neutral-900 bg-neutral-950 p-2">
        <div className="flex items-center gap-2 mb-2 px-1">
          <ImageIcon className="w-4 h-4" />
          <div className="text-sm font-medium">Template</div>
        </div>
        <label className="block border border-neutral-800 rounded-md p-3 text-center cursor-pointer hover:bg-neutral-900 transition">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => onTemplateFile(event.target.files?.[0])}
          />
          <div className="flex items-center justify-center gap-2 text-neutral-400">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload Image</span>
          </div>
        </label>
        <div className="mt-2 text-xs text-neutral-500 px-1">
          Or use a preset:
        </div>
        <div className="mt-1.5 flex flex-col gap-1">
          {PRESETS.map((p) => (
            <Button
              key={p.label}
              variant="secondary"
              className="justify-start bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 cursor-pointer text-xs h-8"
              onClick={() => {
                setTplW(p.w);
                setTplH(p.h);
                setTemplateImg(null);
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Logo uploader */}
      <div className="rounded-lg border border-neutral-900 bg-neutral-950 p-2">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Palette className="w-4 h-4" />
          <div className="text-sm font-medium">Logo</div>
        </div>
        <label className="block border border-neutral-800 rounded-md p-3 text-center cursor-pointer hover:bg-neutral-900 transition">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => onLogoFile(event.target.files?.[0])}
          />
          <div className="flex items-center justify-center gap-2 text-neutral-400">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Choose Logo</span>
          </div>
        </label>
      </div>
    </div>
  );

  const ControlsPanel = () => (
    <div className="border-l border-neutral-900 p-2 bg-black/80 backdrop-blur-sm overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold uppercase tracking-wide text-neutral-400 mb-2 px-1">
          Controls
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setControlsPanelOpen(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      {/* All control groups go here */}
      <div className="flex flex-col gap-2">
        <div className="rounded-lg border border-neutral-900 bg-neutral-950 p-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <div className="text-sm font-medium">Template Size</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <Label className="text-xs text-neutral-400 px-1">Width</Label>
              <Input
                type="number"
                className="bg-black border-neutral-800 h-8"
                value={tplW}
                onChange={(event) =>
                  setTplW(Math.max(1, Number(event.target.value || 0)))
                }
              />
            </div>
            <div>
              <Label className="text-xs text-neutral-400 px-1">Height</Label>
              <Input
                type="number"
                className="bg-black border-neutral-800 h-8"
                value={tplH}
                onChange={(event) =>
                  setTplH(Math.max(1, Number(event.target.value || 0)))
                }
              />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-900 bg-neutral-950 p-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <div className="text-sm font-medium">Placement</div>
            </div>
            <Switch
              checked={autoBottomCenter}
              onCheckedChange={setAutoBottomCenter}
            />
          </div>
          {autoBottomCenter ? (
            <>
              <Label className="text-xs text-neutral-400 px-1">
                Bottom Margin: {marginBottom}px
              </Label>
              <Slider
                value={[marginBottom]}
                min={0}
                max={200}
                step={1}
                onValueChange={([value]) => setMarginBottom(value)}
                className="my-2"
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <Label className="text-xs text-neutral-400 px-1">X (px)</Label>
                  <Input
                    type="number"
                    className="bg-black border-neutral-800 h-8"
                    value={logoX}
                    onChange={(event) =>
                      setLogoX(Number(event.target.value || 0))
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs text-neutral-400 px-1">Y (px)</Label>
                  <Input
                    type="number"
                    className="bg-black border-neutral-800 h-8"
                    value={logoY}
                    onChange={(event) =>
                      setLogoY(Number(event.target.value || 0))
                    }
                  />
                </div>
              </div>
              <div className="text-xs text-neutral-500 mt-2 px-1">
                Tip: Use arrow keys to nudge.
              </div>
            </>
          )}
        </div>
        <div className="rounded-lg border border-neutral-900 bg-neutral-950 p-2">
          <div className="flex items-center gap-2 mb-2 px-1">
            <ImageIcon className="w-4 h-4" />
            <div className="text-sm font-medium">Logo Style</div>
          </div>
          <Label className="text-xs text-neutral-400 px-1">
            Logo Width: {logoScalePct}%
          </Label>
          <Slider
            value={[logoScalePct]}
            min={5}
            max={60}
            step={1}
            onValueChange={([value]) => setLogoScalePct(value)}
            className="my-2"
          />
          <Label className="text-xs text-neutral-400 px-1">
            Corner Radius: {cornerRadius}px
          </Label>
          <Slider
            value={[cornerRadius]}
            min={0}
            max={200}
            step={1}
            onValueChange={([value]) => setCornerRadius(value)}
            className="my-2"
          />
        </div>
        <div className="rounded-lg border border-neutral-900 bg-neutral-950 p-2">
          <div className="flex items-center gap-2 mb-2 px-1">
            <MonitorUp className="w-4 h-4" />
            <div className="text-sm font-medium">Preview</div>
          </div>
          <Button
            variant="secondary"
            className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 cursor-pointer"
            onClick={() => setShowGrid((s) => !s)}
          >
            <Grid className="w-4 h-4 mr-2" />{" "}
            {showGrid ? "Hide Grid" : "Show Grid"}
          </Button>
        </div>
        <div className="rounded-lg border border-neutral-900 bg-neutral-950 p-2">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Download className="w-4 h-4" />
            <div className="text-sm font-medium">Export</div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <Button
              className="bg-white text-black hover:bg-neutral-200 cursor-pointer"
              onClick={() => exportPNG(1)}
            >
              1×
            </Button>
            <Button
              className="bg-white text-black hover:bg-neutral-200 cursor-pointer"
              onClick={() => exportPNG(2)}
            >
              2×
            </Button>
            <Button
              className="bg-white text-black hover:bg-neutral-200 cursor-pointer"
              onClick={() => exportPNG(4)}
            >
              4×
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    // ✨ FIX: Main container is now flex-col and takes full screen height
<div className="absolute top-0 bottom-0 right-0 left-20 bg-black text-neutral-200 overflow-hidden flex flex-col">      {/* Top Bar (no changes needed) */}
      <div className="w-full h-12 border-b border-neutral-800 flex items-center justify-between px-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          <span className="font-medium tracking-wide text-sm">
            SSI Studios — Pro Editor
          </span>
          <span className="text-xs text-neutral-500">Pure Black</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="icon"
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 cursor-pointer"
            onClick={() => setZoom((z) => clamp(z + 0.1, 0.1, 2))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 cursor-pointer"
            onClick={() => setZoom((z) => clamp(z - 0.1, 0.1, 2))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 cursor-pointer h-9 px-2 text-xs"
            onClick={() => setZoom(1)}
          >
            100%
          </Button>
          <div className="w-px h-6 bg-neutral-800 mx-2" />
          <Button
            className="bg-white text-black hover:bg-neutral-200 cursor-pointer"
            onClick={() => exportPNG(2)}
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* ✨ FIX: Main Grid is now responsive and relative for positioning mobile panels */}
      <div className="w-full flex-grow grid grid-cols-1 lg:grid-cols-[250px_1fr_280px] relative overflow-hidden">
        {/* Left Panel — Desktop */}
        <div className="hidden lg:block">
          <AssetsPanel />
        </div>

        {/* Center — Canvas Preview */}
        <div className="relative bg-black h-full w-full">
          <div className="absolute top-2 left-2 z-10 text-xs text-neutral-400 bg-neutral-950/70 px-2 py-1 rounded-md border border-neutral-800">
            {tplW}×{tplH}px · Zoom {(zoom * 100).toFixed(0)}%
          </div>
          <div
            ref={previewRef}
            className="w-full h-full flex items-center justify-center select-none overflow-auto p-4"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div
              className="relative"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              {showGrid && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundSize: "20px 20px",
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  }}
                />
              )}
              <canvas
                ref={canvasRef}
                className="shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                style={{ width: tplW, height: tplH }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel — Desktop */}
        <div className="hidden lg:block">
          <ControlsPanel />
        </div>

        {/* ✨ NEW: Mobile Panels (Slide-in Overlays) */}
        <AnimatePresence>
          {isAssetsPanelOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 h-full w-[250px] z-50 lg:hidden"
            >
              <AssetsPanel />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isControlsPanelOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 h-full w-[280px] z-50 lg:hidden"
            >
              <ControlsPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✨ NEW: Mobile Controls Bar */}
        <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
          <Button
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 cursor-pointer flex items-center gap-2"
            onClick={() => setAssetsPanelOpen(true)}
          >
            <Menu className="w-4 h-4" />
            Assets
          </Button>
          <Button
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 cursor-pointer flex items-center gap-2"
            onClick={() => setControlsPanelOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Controls
          </Button>
        </div>
      </div>
    </div>
  );
}
