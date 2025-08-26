/**
 * Real User Monitoring (RUM) and Performance Tracking for SSI Studios
 * Tracks Core Web Vitals and custom performance metrics
 */

// Core Web Vitals tracking
interface WebVital {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: string;
}

interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte

  // Custom metrics
  pageLoadTime?: number;
  domContentLoaded?: number;
  timeToInteractive?: number;
  totalBlockingTime?: number;

  // User context
  userAgent?: string;
  connection?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;

  // Page context
  url?: string;
  referrer?: string;
  timestamp?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Track navigation timing
    this.trackNavigationTiming();

    // Track Core Web Vitals
    this.trackLCP();
    this.trackFID();
    this.trackCLS();
    this.trackFCP();
    this.trackTTFB();

    // Track custom metrics
    this.trackTimeToInteractive();
    this.trackTotalBlockingTime();

    // Collect device/connection info
    this.collectDeviceInfo();

    // Send metrics on page unload
    this.setupReporting();
  }

  private trackNavigationTiming(): void {
    if (!("performance" in window) || !("getEntriesByType" in performance))
      return;

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.metrics.pageLoadTime =
        navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.domContentLoaded =
        navigation.domContentLoadedEventEnd - navigation.fetchStart;
      this.metrics.ttfb = navigation.responseStart - navigation.fetchStart;
    }
  }

  private trackLCP(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;

        if (lastEntry) {
          this.metrics.lcp = lastEntry.startTime;
          this.reportMetric("LCP", lastEntry.startTime);
        }
      });

      observer.observe({ type: "largest-contentful-paint", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("LCP tracking failed:", error);
    }
  }

  private trackFID(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            this.metrics.fid = fid;
            this.reportMetric("FID", fid);
          }
        });
      });

      observer.observe({ type: "first-input", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("FID tracking failed:", error);
    }
  }

  private trackCLS(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      let clsValue = 0;
      let sessionValue = 0;
      let sessionEntries: any[] = [];

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (
              sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }

            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              this.metrics.cls = clsValue;
              this.reportMetric("CLS", clsValue);
            }
          }
        });
      });

      observer.observe({ type: "layout-shift", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("CLS tracking failed:", error);
    }
  }

  private trackFCP(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === "first-contentful-paint") {
            this.metrics.fcp = entry.startTime;
            this.reportMetric("FCP", entry.startTime);
          }
        });
      });

      observer.observe({ type: "paint", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("FCP tracking failed:", error);
    }
  }

  private trackTTFB(): void {
    if (!("performance" in window)) return;

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.fetchStart;
      this.metrics.ttfb = ttfb;
      this.reportMetric("TTFB", ttfb);
    }
  }

  private trackTimeToInteractive(): void {
    // Simplified TTI calculation
    if (document.readyState === "complete") {
      this.calculateTTI();
    } else {
      window.addEventListener("load", () => this.calculateTTI());
    }
  }

  private calculateTTI(): void {
    if (!("performance" in window)) return;

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      // Simplified: use domContentLoaded + 50ms buffer
      const tti = navigation.domContentLoadedEventEnd + 50;
      this.metrics.timeToInteractive = tti;
      this.reportMetric("TTI", tti);
    }
  }

  private trackTotalBlockingTime(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      let totalBlockingTime = 0;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.duration > 50) {
            totalBlockingTime += entry.duration - 50;
          }
        });

        this.metrics.totalBlockingTime = totalBlockingTime;
      });

      observer.observe({ type: "longtask", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("TBT tracking failed:", error);
    }
  }

  private collectDeviceInfo(): void {
    if (typeof window === "undefined") return;

    this.metrics.userAgent = navigator.userAgent;
    this.metrics.url = window.location.href;
    this.metrics.referrer = document.referrer;
    this.metrics.timestamp = Date.now();

    // Connection info
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    if (connection) {
      this.metrics.connection = connection.effectiveType;
    }

    // Device memory
    if ("deviceMemory" in navigator) {
      this.metrics.deviceMemory = (navigator as any).deviceMemory;
    }

    // Hardware concurrency
    if ("hardwareConcurrency" in navigator) {
      this.metrics.hardwareConcurrency = navigator.hardwareConcurrency;
    }
  }

  private setupReporting(): void {
    // Send metrics on page unload
    window.addEventListener("beforeunload", () => {
      this.sendMetrics();
    });

    // Send metrics on visibility change (for SPA navigation)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.sendMetrics();
      }
    });

    // Send metrics periodically for long sessions
    setInterval(() => {
      this.sendMetrics();
    }, 30000); // Every 30 seconds
  }

  private reportMetric(name: string, value: number): void {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
    }

    // Send to analytics service
    this.sendToAnalytics(name, value);
  }

  private sendToAnalytics(name: string, value: number): void {
    // In production, send to your analytics service
    // Example: Google Analytics, DataDog, New Relic, etc.

    if (typeof window !== "undefined" && "gtag" in window) {
      (window as any).gtag("event", "performance_metric", {
        metric_name: name,
        metric_value: Math.round(value),
        custom_parameter: this.getRating(name, value),
      });
    }
  }

  private getRating(name: string, value: number): string {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
      TTI: { good: 3800, poor: 7300 },
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return "unknown";

    if (value <= threshold.good) return "good";
    if (value <= threshold.poor) return "needs-improvement";
    return "poor";
  }

  private sendMetrics(): void {
    if (Object.keys(this.metrics).length === 0) return;

    // Use sendBeacon for reliable delivery
    if ("sendBeacon" in navigator) {
      const data = JSON.stringify(this.metrics);
      navigator.sendBeacon("/api/analytics/performance", data);
    } else {
      // Fallback to fetch
      fetch("/api/analytics/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.metrics),
        keepalive: true,
      }).catch(() => {
        // Silently handle errors
      });
    }
  }

  // Public methods
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public trackCustomMetric(name: string, value: number): void {
    this.reportMetric(name, value);
  }

  public markFeatureUsage(feature: string): void {
    this.trackCustomMetric(`feature_${feature}`, performance.now());
  }

  public startTimer(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.trackCustomMetric(name, duration);
    };
  }

  public destroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance tracking
export function usePerformanceTracking() {
  const trackFeature = (feature: string) => {
    performanceMonitor.markFeatureUsage(feature);
  };

  const startTimer = (name: string) => {
    return performanceMonitor.startTimer(name);
  };

  const getMetrics = () => {
    return performanceMonitor.getMetrics();
  };

  return { trackFeature, startTimer, getMetrics };
}

// Performance budget checker
export class PerformanceBudget {
  private budgets = {
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    FCP: 1800,
    TTFB: 800,
    bundleSize: 500 * 1024, // 500KB
  };

  checkBudget(metrics: PerformanceMetrics): {
    passed: boolean;
    violations: string[];
  } {
    const violations: string[] = [];

    if (metrics.lcp && metrics.lcp > this.budgets.LCP) {
      violations.push(
        `LCP: ${metrics.lcp}ms exceeds budget of ${this.budgets.LCP}ms`
      );
    }

    if (metrics.fid && metrics.fid > this.budgets.FID) {
      violations.push(
        `FID: ${metrics.fid}ms exceeds budget of ${this.budgets.FID}ms`
      );
    }

    if (metrics.cls && metrics.cls > this.budgets.CLS) {
      violations.push(
        `CLS: ${metrics.cls} exceeds budget of ${this.budgets.CLS}`
      );
    }

    if (metrics.fcp && metrics.fcp > this.budgets.FCP) {
      violations.push(
        `FCP: ${metrics.fcp}ms exceeds budget of ${this.budgets.FCP}ms`
      );
    }

    if (metrics.ttfb && metrics.ttfb > this.budgets.TTFB) {
      violations.push(
        `TTFB: ${metrics.ttfb}ms exceeds budget of ${this.budgets.TTFB}ms`
      );
    }

    return {
      passed: violations.length === 0,
      violations,
    };
  }
}

export const performanceBudget = new PerformanceBudget();
