import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public endpoint — no auth required
// Returns all website content sections for the public frontend
export async function GET() {
  try {
    const rows = await prisma.websiteContent.findMany({
      orderBy: { section: 'asc' }
    })
    const content = Object.fromEntries(rows.map(r => [r.section, r]))
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error fetching public content:', error)
    return NextResponse.json({ content: {} }, { status: 500 })
  }
}
