import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public endpoint — returns non-sensitive site settings for the frontend
// Only exposes specific safe keys (no admin credentials)
const PUBLIC_KEYS = ['garage_name', 'garage_tagline', 'logo_url', 'deposit_type', 'deposit_amount', 'max_booking_days']

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: PUBLIC_KEYS } } })
    const settings = Object.fromEntries(rows.map(r => [r.key, r.value]))
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching public settings:', error)
    return NextResponse.json({ settings: {} }, { status: 500 })
  }
}
