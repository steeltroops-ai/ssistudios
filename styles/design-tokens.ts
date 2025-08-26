/**
 * SSI Studios - Design Token Architecture
 * 
 * Comprehensive design token system with CSS custom properties organization,
 * JavaScript token export system, theme switching functionality, and dark mode implementation.
 * 
 * Based on DESIGN_PHILOSOPHY.md specifications for systematic design consistency.
 */

import { colorPalettes, p3Colors, ColorSystem } from './color-system';

// Design Token Interfaces
export interface SpacingTokens {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
}

export interface TypographyTokens {
  fontFamily: {
    display: string;
    text: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    thin: number;
    extralight: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
}

export interface ShadowTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

export interface BorderTokens {
  radius: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  width: {
    0: string;
    1: string;
    2: string;
    4: string;
    8: string;
  };
}

export interface AnimationTokens {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: string;
  };
}

export interface SemanticTokens {
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  card: string;
  popover: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  error: string;
  errorForeground: string;
}

export interface ThemeTokens {
  colors: {
    quantum: typeof colorPalettes.quantum;
    aurora: typeof colorPalettes.aurora;
    nebula: typeof colorPalettes.nebula;
    solar: typeof colorPalettes.solar;
    cosmic: typeof colorPalettes.cosmic;
    semantic: SemanticTokens;
  };
  spacing: SpacingTokens;
  typography: TypographyTokens;
  shadows: ShadowTokens;
  borders: BorderTokens;
  animations: AnimationTokens;
}

/**
 * Design Token Generator
 * Creates comprehensive design token system with mathematical precision
 */
export class DesignTokenGenerator {
  
  /**
   * Generate spacing tokens based on 8px grid system (Apple-inspired)
   */
  static generateSpacingTokens(): SpacingTokens {
    return {
      0: '0px',
      1: '4px',    // 0.5 * base
      2: '8px',    // 1 * base
      3: '12px',   // 1.5 * base
      4: '16px',   // 2 * base
      5: '20px',   // 2.5 * base
      6: '24px',   // 3 * base
      8: '32px',   // 4 * base
      10: '40px',  // 5 * base
      12: '48px',  // 6 * base
      16: '64px',  // 8 * base
      20: '80px',  // 10 * base
      24: '96px',  // 12 * base
      32: '128px', // 16 * base
      40: '160px', // 20 * base
      48: '192px', // 24 * base
      56: '224px', // 28 * base
      64: '256px', // 32 * base
    };
  }

  /**
   * Generate typography tokens with Apple-quality font system
   */
  static generateTypographyTokens(): TypographyTokens {
    return {
      fontFamily: {
        display: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        text: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
      },
      fontSize: {
        xs: '0.75rem',   // 12px - Captions
        sm: '0.875rem',  // 14px - Body 2
        base: '1rem',    // 16px - Body 1
        lg: '1.125rem',  // 18px - Subheadline
        xl: '1.25rem',   // 20px - Headline
        '2xl': '1.5rem', // 24px - Title 3
        '3xl': '1.875rem', // 30px - Title 2
        '4xl': '2.25rem',  // 36px - Title 1
        '5xl': '3rem',     // 48px - Large Title
        '6xl': '3.75rem',  // 60px - Display
      },
      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
      },
    };
  }

  /**
   * Generate shadow tokens for depth and elevation
   */
  static generateShadowTokens(): ShadowTokens {
    return {
      xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
      sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      none: 'none',
    };
  }

  /**
   * Generate border tokens with Apple-inspired corner radius system
   */
  static generateBorderTokens(): BorderTokens {
    return {
      radius: {
        xs: '4px',     // Small elements
        sm: '8px',     // Buttons, inputs
        md: '12px',    // Cards, panels
        lg: '16px',    // Large cards
        xl: '24px',    // Hero sections
        '2xl': '32px', // Modal overlays
        full: '9999px', // Circular elements
      },
      width: {
        0: '0px',
        1: '1px',
        2: '2px',
        4: '4px',
        8: '8px',
      },
    };
  }

  /**
   * Generate animation tokens for consistent motion design
   */
  static generateAnimationTokens(): AnimationTokens {
    return {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      easing: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        spring: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    };
  }

  /**
   * Generate semantic color tokens for light theme
   */
  static generateLightSemanticTokens(): SemanticTokens {
    return {
      background: colorPalettes.quantum.oklch[50],
      foreground: colorPalettes.quantum.oklch[950],
      muted: colorPalettes.quantum.oklch[100],
      accent: colorPalettes.quantum.oklch[200],
      destructive: colorPalettes.solar.oklch[500], // Using solar (red-orange) for destructive
      border: colorPalettes.quantum.oklch[200],
      input: colorPalettes.quantum.oklch[100],
      ring: colorPalettes.quantum.oklch[500],
      card: colorPalettes.quantum.oklch[50],
      popover: colorPalettes.quantum.oklch[50],
      primary: colorPalettes.quantum.oklch[500],
      primaryForeground: colorPalettes.quantum.oklch[50],
      secondary: colorPalettes.aurora.oklch[500],
      secondaryForeground: colorPalettes.aurora.oklch[50],
      success: colorPalettes.cosmic.oklch[500],
      successForeground: colorPalettes.cosmic.oklch[50],
      warning: colorPalettes.solar.oklch[500],
      warningForeground: colorPalettes.solar.oklch[50],
      error: colorPalettes.solar.oklch[600],
      errorForeground: colorPalettes.solar.oklch[50],
    };
  }

  /**
   * Generate semantic color tokens for dark theme
   */
  static generateDarkSemanticTokens(): SemanticTokens {
    return {
      background: colorPalettes.quantum.oklch[950],
      foreground: colorPalettes.quantum.oklch[50],
      muted: colorPalettes.quantum.oklch[900],
      accent: colorPalettes.quantum.oklch[800],
      destructive: colorPalettes.solar.oklch[400],
      border: colorPalettes.quantum.oklch[800],
      input: colorPalettes.quantum.oklch[900],
      ring: colorPalettes.quantum.oklch[400],
      card: colorPalettes.quantum.oklch[900],
      popover: colorPalettes.quantum.oklch[900],
      primary: colorPalettes.quantum.oklch[400],
      primaryForeground: colorPalettes.quantum.oklch[950],
      secondary: colorPalettes.aurora.oklch[400],
      secondaryForeground: colorPalettes.aurora.oklch[950],
      success: colorPalettes.cosmic.oklch[400],
      successForeground: colorPalettes.cosmic.oklch[950],
      warning: colorPalettes.solar.oklch[400],
      warningForeground: colorPalettes.solar.oklch[950],
      error: colorPalettes.solar.oklch[500],
      errorForeground: colorPalettes.solar.oklch[950],
    };
  }

  /**
   * Generate complete theme tokens
   */
  static generateThemeTokens(isDark = false): ThemeTokens {
    return {
      colors: {
        quantum: colorPalettes.quantum,
        aurora: colorPalettes.aurora,
        nebula: colorPalettes.nebula,
        solar: colorPalettes.solar,
        cosmic: colorPalettes.cosmic,
        semantic: isDark ? this.generateDarkSemanticTokens() : this.generateLightSemanticTokens(),
      },
      spacing: this.generateSpacingTokens(),
      typography: this.generateTypographyTokens(),
      shadows: this.generateShadowTokens(),
      borders: this.generateBorderTokens(),
      animations: this.generateAnimationTokens(),
    };
  }
}

/**
 * Export design tokens for light and dark themes
 */
export const lightTheme = DesignTokenGenerator.generateThemeTokens(false);
export const darkTheme = DesignTokenGenerator.generateThemeTokens(true);

/**
 * Default theme (light)
 */
export const defaultTheme = lightTheme;
