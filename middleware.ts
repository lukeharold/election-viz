import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Delete x-frame-options header
  response.headers.delete('x-frame-options')

  // Add new headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  
  return response
}

export const config = {
  matcher: '/:path*',
}