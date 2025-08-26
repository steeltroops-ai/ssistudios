// SSI Studios - TypeScript Type Definitions
// Comprehensive type system for the application

// User and Authentication Types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Template and Design Types
export interface Template {
  _id: string;
  name: string;
  description: string;
  category: string;
  image: Buffer;
  contentType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateWithBase64 {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation and UI Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  isActive?: boolean;
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

// Dashboard Types
export interface DashboardStats {
  totalTemplates: number;
  totalUsers: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'template_created' | 'user_registered' | 'template_downloaded';
  message: string;
  timestamp: Date;
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  query: string;
  category?: string;
  filters?: Record<string, any>;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface NavigationContextType {
  currentPath: string;
  navigate: (path: string) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export interface ThemeContextType {
  theme: ThemeConfig;
  toggleTheme: () => void;
  setTheme: (theme: ThemeConfig) => void;
}

// Database Model Types
export interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  isActive: boolean;
}

// Editor Types
export interface EditorState {
  content: string;
  selectedTemplate: Template | null;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

export interface EditorAction {
  type: 'SET_CONTENT' | 'SET_TEMPLATE' | 'TOGGLE_EDITING' | 'SAVE_CHANGES';
  payload?: any;
}

// File Upload Types
export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

// Layout Types
export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showSidebar?: boolean;
  showHeader?: boolean;
}

// Modal Types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Table Types
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationParams;
  onSort?: (column: keyof T, order: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
}

// Export all types
export type * from './index';
