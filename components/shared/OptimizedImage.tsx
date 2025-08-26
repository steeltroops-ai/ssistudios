"use client";

import Image from "next/image";
import { useState, forwardRef } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  loading?: "lazy" | "eager";
}

// Optimized Image component with performance enhancements
export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    className = "",
    priority = false,
    quality = 85,
    placeholder = "empty",
    blurDataURL,
    sizes,
    fill = false,
    style,
    onLoad,
    onError,
    loading = "lazy",
    ...props
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };

    // Generate blur placeholder for better loading experience
    const generateBlurDataURL = (w: number, h: number) => {
      return `data:image/svg+xml;base64,${Buffer.from(
        `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <rect width="100%" height="100%" fill="url(#gradient)"/>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#f9fafb;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>`
      ).toString('base64')}`;
    };

    // Error fallback component
    if (hasError) {
      return (
        <div 
          className={`bg-gray-200 flex items-center justify-center ${className}`}
          style={{ width, height, ...style }}
        >
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      );
    }

    return (
      <div className={`relative ${isLoading ? 'animate-pulse' : ''}`}>
        <Image
          ref={ref}
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined)}
          sizes={sizes || (fill ? "100vw" : undefined)}
          className={className}
          style={style}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

// Responsive image component with automatic sizing
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = "16/9",
  className = "",
  priority = false,
  quality = 85,
  ...props
}: OptimizedImageProps & { aspectRatio?: string }) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio }}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        {...props}
      />
    </div>
  );
}

// Avatar component with optimized loading
export function OptimizedAvatar({
  src,
  alt,
  size = 40,
  className = "",
  fallback,
  ...props
}: OptimizedImageProps & { 
  size?: number; 
  fallback?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError && fallback) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-600 font-medium rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        {fallback}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      quality={90}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}

// Gallery image with lazy loading and intersection observer
export function GalleryImage({
  src,
  alt,
  width,
  height,
  className = "",
  onClick,
  ...props
}: OptimizedImageProps & { onClick?: () => void }) {
  return (
    <div 
      className={`relative cursor-pointer group overflow-hidden rounded-lg ${className}`}
      onClick={onClick}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="transition-transform duration-300 group-hover:scale-105"
        quality={80}
        loading="lazy"
        {...props}
      />
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
    </div>
  );
}

// Hero image with optimized loading
export function HeroImage({
  src,
  alt,
  className = "",
  overlay = false,
  ...props
}: OptimizedImageProps & { overlay?: boolean }) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover"
        {...props}
      />
      
      {/* Optional overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
      )}
    </div>
  );
}

// Thumbnail component with consistent sizing
export function Thumbnail({
  src,
  alt,
  size = 120,
  className = "",
  ...props
}: OptimizedImageProps & { size?: number }) {
  return (
    <div 
      className={`relative overflow-hidden rounded-lg bg-gray-100 ${className}`}
      style={{ width: size, height: size }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        quality={75}
        sizes={`${size}px`}
        className="object-cover"
        loading="lazy"
        {...props}
      />
    </div>
  );
}

// Logo component with optimized loading
export function OptimizedLogo({
  src,
  alt,
  width = 120,
  height = 40,
  className = "",
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority
      quality={95}
      className={className}
      {...props}
    />
  );
}

// Utility function to generate responsive sizes
export function generateResponsiveSizes(breakpoints: { [key: string]: string }) {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
    .join(", ");
}

// Common responsive sizes presets
export const responsiveSizes = {
  full: "100vw",
  half: "(max-width: 768px) 100vw, 50vw",
  third: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quarter: "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw",
  thumbnail: "120px",
  avatar: "40px",
};
