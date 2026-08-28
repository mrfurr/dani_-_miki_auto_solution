import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AdminPayload {
  id: string
  email: string
}

// Generate JWT token
export function generateToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload
  } catch {
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}

// Get current admin from cookie
export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token) return null
  
  const payload = verifyToken(token)
  if (!payload) return null
  
  // Verify admin still exists in database
  const admin = await prisma.admin.findUnique({
    where: { id: payload.id }
  })
  
  if (!admin) return null
  
  return payload
}

// Protect server-side route - throws if not authenticated
export async function requireAuth(): Promise<AdminPayload> {
  const admin = await getCurrentAdmin()
  if (!admin) {
    throw new Error('Unauthorized')
  }
  return admin
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(password, 10)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(password, hash)
}