// SSI Studios - Application Constants
// Centralized constants for the application

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
export const API_TIMEOUT = 30000; // 30 seconds

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
  },
  TEMPLATES: {
    LIST: '/templates',
    CREATE: '/templates',
    UPDATE: '/templates',
    DELETE: '/templates',
    UPLOAD: '/posters/upload',
  },
  USER: {
    PROFILE: '/user',
    UPDATE: '/user',
    DELETE: '/user',
  },
  ADMIN: {
    SEED: '/seed-admin',
    USERS: '/admin/users',
    STATS: '/admin/stats',
  },
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/userprofile',
  TEMPLATES: '/templates',
  POSTER_EDITOR: '/poster',
  TOOLS: '/tools',
  ADMIN: '/admin',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#8B5CF6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#06B6D4',
  },
  FONTS: {
    PRIMARY: 'Inter, sans-serif',
    SECONDARY: 'Roboto, sans-serif',
    MONO: 'JetBrains Mono, monospace',
  },
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    XXL: '3rem',
  },
} as const;

// Form Validation
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'ssi_auth_token',
  REFRESH_TOKEN: 'ssi_refresh_token',
  USER_PREFERENCES: 'ssi_user_preferences',
  THEME: 'ssi_theme',
  LANGUAGE: 'ssi_language',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  LOGOUT: 'Successfully logged out!',
  REGISTER: 'Account created successfully!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  TEMPLATE_CREATED: 'Template created successfully!',
  TEMPLATE_UPDATED: 'Template updated successfully!',
  TEMPLATE_DELETED: 'Template deleted successfully!',
} as const;

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Template Categories
export const TEMPLATE_CATEGORIES = [
  'Business Cards',
  'Posters',
  'Flyers',
  'Brochures',
  'Certificates',
  'Invitations',
  'Social Media',
  'Presentations',
  'Logos',
  'Banners',
] as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Database Configuration
export const DB_CONFIG = {
  CONNECTION_TIMEOUT: 10000,
  MAX_POOL_SIZE: 10,
  MIN_POOL_SIZE: 2,
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  JWT_EXPIRY: '24h',
  REFRESH_TOKEN_EXPIRY: '7d',
  BCRYPT_ROUNDS: 12,
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_REGISTRATION: true,
  ENABLE_SOCIAL_LOGIN: false,
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
} as const;

// Export all constants as default
export default {
  API_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
  ROUTES,
  UI_CONSTANTS,
  THEME_CONFIG,
  VALIDATION_RULES,
  FILE_UPLOAD,
  PAGINATION,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_STATES,
  TEMPLATE_CATEGORIES,
  USER_ROLES,
  ANIMATION_DURATION,
  Z_INDEX,
  DB_CONFIG,
  SECURITY_CONFIG,
  FEATURE_FLAGS,
};
