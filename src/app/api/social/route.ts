import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public endpoint — active social links for the frontend
export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { platform: 'asc' },
    })
    return NextResponse.json({ links })
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json({ links: [] }, { status: 500 })
  }
}
