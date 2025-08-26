/**
 * SSI Studios - Revolutionary OKLCH Color System
 * 
 * Advanced color generation system with OKLCH to RGB conversion,
 * automatic palette generation, accessibility validation, and P3 gamut support.
 * 
 * Based on DESIGN_PHILOSOPHY.md specifications for premium color experiences.
 */

// OKLCH Color Space Interface
export interface OKLCHColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4+)
  h: number; // Hue (0-360)
}

// RGB Color Interface
export interface RGBColor {
  r: number; // Red (0-255)
  g: number; // Green (0-255)
  b: number; // Blue (0-255)
}

// Color Scale Interface
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

// Color Palette Interface
export interface ColorPalette {
  oklch: ColorScale;
  rgb: ColorScale;
  hex: ColorScale;
}

// Revolutionary Color Palettes as specified in DESIGN_PHILOSOPHY.md
export const COLOR_PALETTE_DEFINITIONS = {
  quantum: { hue: 280, name: 'quantum' }, // Primary System - Blue-Purple
  aurora: { hue: 320, name: 'aurora' },   // Secondary System - Pink-Purple
  nebula: { hue: 200, name: 'nebula' },   // Tertiary System - Cyan-Blue
  solar: { hue: 60, name: 'solar' },      // Accent System - Yellow-Orange
  cosmic: { hue: 140, name: 'cosmic' },   // Success System - Green
} as const;

/**
 * Advanced OKLCH Color System Implementation
 * 
 * Provides mathematical precision for color generation with:
 * - OKLCH to RGB conversion algorithms
 * - Automatic palette generation
 * - Accessibility contrast validation
 * - P3 gamut support for advanced displays
 */
export class ColorSystem {
  
  /**
   * Convert OKLCH color to RGB color space
   * Uses advanced mathematical conversion for accurate color representation
   */
  static oklchToRgb(l: number, c: number, h: number): RGBColor {
    // Convert OKLCH to OKLab
    const a = c * Math.cos((h * Math.PI) / 180);
    const b = c * Math.sin((h * Math.PI) / 180);

    // OKLab to linear RGB conversion
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

    const l_cubed = l_ * l_ * l_;
    const m_cubed = m_ * m_ * m_;
    const s_cubed = s_ * s_ * s_;

    // Linear RGB values
    let r = +4.0767416621 * l_cubed - 3.3077115913 * m_cubed + 0.2309699292 * s_cubed;
    let g = -1.2684380046 * l_cubed + 2.6097574011 * m_cubed - 0.3413193965 * s_cubed;
    let b_val = -0.0041960863 * l_cubed - 0.7034186147 * m_cubed + 1.7076147010 * s_cubed;

    // Apply gamma correction for sRGB
    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
    b_val = b_val > 0.0031308 ? 1.055 * Math.pow(b_val, 1 / 2.4) - 0.055 : 12.92 * b_val;

    // Clamp values to valid RGB range
    return {
      r: Math.max(0, Math.min(255, Math.round(r * 255))),
      g: Math.max(0, Math.min(255, Math.round(g * 255))),
      b: Math.max(0, Math.min(255, Math.round(b_val * 255))),
    };
  }

  /**
   * Convert RGB to HEX color format
   */
  static rgbToHex(rgb: RGBColor): string {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  /**
   * Generate complete color palette with mathematical precision
   * Creates 11-step color scale (50-950) with optimal lightness and chroma curves
   */
  static generatePalette(baseHue: number, name: string): ColorPalette {
    // Mathematical lightness curve for optimal visual perception
    const lightnessValues = [
      0.98, // 50 - Lightest
      0.95, // 100
      0.90, // 200
      0.82, // 300
      0.72, // 400
      0.62, // 500 - Base color
      0.52, // 600
      0.42, // 700
      0.32, // 800
      0.22, // 900
      0.15, // 950 - Darkest
    ];

    // Mathematical chroma curve for consistent saturation
    const chromaValues = [
      0.005, // 50 - Very low saturation
      0.01,  // 100
      0.02,  // 200
      0.04,  // 300
      0.08,  // 400
      0.12,  // 500 - Base saturation
      0.16,  // 600
      0.20,  // 700
      0.24,  // 800
      0.28,  // 900
      0.32,  // 950 - Highest saturation
    ];

    const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    
    const oklchScale: Partial<ColorScale> = {};
    const rgbScale: Partial<ColorScale> = {};
    const hexScale: Partial<ColorScale> = {};

    scales.forEach((scale, index) => {
      const l = lightnessValues[index];
      const c = chromaValues[index];
      const h = baseHue;

      // Generate OKLCH value
      const oklchValue = `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h})`;
      
      // Convert to RGB
      const rgb = this.oklchToRgb(l, c, h);
      const rgbValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      
      // Convert to HEX
      const hexValue = this.rgbToHex(rgb);

      oklchScale[scale as keyof ColorScale] = oklchValue;
      rgbScale[scale as keyof ColorScale] = rgbValue;
      hexScale[scale as keyof ColorScale] = hexValue;
    });

    return {
      oklch: oklchScale as ColorScale,
      rgb: rgbScale as ColorScale,
      hex: hexScale as ColorScale,
    };
  }

  /**
   * Calculate contrast ratio between two colors for accessibility validation
   * Returns ratio from 1:1 (no contrast) to 21:1 (maximum contrast)
   */
  static calculateContrastRatio(color1: RGBColor, color2: RGBColor): number {
    const getLuminance = (rgb: RGBColor): number => {
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Validate color accessibility according to WCAG 2.1 standards
   */
  static validateAccessibility(foreground: RGBColor, background: RGBColor): {
    ratio: number;
    aa: boolean;
    aaa: boolean;
    aaLarge: boolean;
    aaaLarge: boolean;
  } {
    const ratio = this.calculateContrastRatio(foreground, background);
    
    return {
      ratio,
      aa: ratio >= 4.5,        // WCAG AA normal text
      aaa: ratio >= 7,         // WCAG AAA normal text
      aaLarge: ratio >= 3,     // WCAG AA large text
      aaaLarge: ratio >= 4.5,  // WCAG AAA large text
    };
  }

  /**
   * Generate all revolutionary color palettes as specified in DESIGN_PHILOSOPHY.md
   */
  static generateAllPalettes(): Record<string, ColorPalette> {
    const palettes: Record<string, ColorPalette> = {};
    
    Object.entries(COLOR_PALETTE_DEFINITIONS).forEach(([key, { hue, name }]) => {
      palettes[key] = this.generatePalette(hue, name);
    });

    return palettes;
  }

  /**
   * Generate P3 gamut colors for advanced displays
   * Provides wider color gamut support for premium experiences
   */
  static generateP3Colors(baseHue: number): Record<string, string> {
    // P3 color space values for enhanced displays
    const p3Colors: Record<string, string> = {};
    
    // Generate key P3 colors for the palette
    const keyScales = [500, 600, 700];
    const lightnessValues = [0.62, 0.52, 0.42];
    
    keyScales.forEach((scale, index) => {
      const l = lightnessValues[index];
      // Enhanced chroma for P3 gamut
      const c = 0.15 + (index * 0.05);
      
      // Convert to P3 color space approximation
      const rgb = this.oklchToRgb(l, c, baseHue);
      const p3R = rgb.r / 255;
      const p3G = rgb.g / 255;
      const p3B = rgb.b / 255;
      
      p3Colors[`${scale}`] = `color(display-p3 ${p3R.toFixed(3)} ${p3G.toFixed(3)} ${p3B.toFixed(3)})`;
    });

    return p3Colors;
  }
}

/**
 * Export generated color palettes for use throughout the application
 */
export const colorPalettes = ColorSystem.generateAllPalettes();

/**
 * Export P3 gamut colors for advanced displays
 */
export const p3Colors = {
  quantum: ColorSystem.generateP3Colors(280),
  aurora: ColorSystem.generateP3Colors(320),
  nebula: ColorSystem.generateP3Colors(200),
  solar: ColorSystem.generateP3Colors(60),
  cosmic: ColorSystem.generateP3Colors(140),
};
