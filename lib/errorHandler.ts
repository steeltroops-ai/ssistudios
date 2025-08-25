import { NextResponse } from 'next/server'

export interface ApiError extends Error {
  statusCode?: number
  code?: string
}

export class ValidationError extends Error {
  statusCode = 400
  code = 'VALIDATION_ERROR'
  
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class DatabaseError extends Error {
  statusCode = 500
  code = 'DATABASE_ERROR'
  
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class AuthenticationError extends Error {
  statusCode = 401
  code = 'AUTHENTICATION_ERROR'
  
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  statusCode = 403
  code = 'AUTHORIZATION_ERROR'
  
  constructor(message: string = 'Insufficient permissions') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error {
  statusCode = 404
  code = 'NOT_FOUND_ERROR'
  
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)
  
  // Handle known error types
  if (error instanceof ValidationError) {
    return NextResponse.json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        type: 'validation'
      }
    }, { status: error.statusCode })
  }
  
  if (error instanceof AuthenticationError) {
    return NextResponse.json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        type: 'authentication'
      }
    }, { status: error.statusCode })
  }
  
  if (error instanceof AuthorizationError) {
    return NextResponse.json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        type: 'authorization'
      }
    }, { status: error.statusCode })
  }
  
  if (error instanceof NotFoundError) {
    return NextResponse.json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        type: 'not_found'
      }
    }, { status: error.statusCode })
  }
  
  if (error instanceof DatabaseError) {
    return NextResponse.json({
      success: false,
      error: {
        code: error.code,
        message: process.env.NODE_ENV === 'production' 
          ? 'Database operation failed' 
          : error.message,
        type: 'database'
      }
    }, { status: error.statusCode })
  }
  
  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'production' 
          ? 'An unexpected error occurred' 
          : error.message,
        type: 'internal'
      }
    }, { status: 500 })
  }
  
  // Handle unknown errors
  return NextResponse.json({
    success: false,
    error: {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      type: 'unknown'
    }
  }, { status: 500 })
}

export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
