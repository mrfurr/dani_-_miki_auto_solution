import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/branches — public endpoint, returns all active branches
export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, address: true, phone: true, mapUrl: true }
    })
    return NextResponse.json({ branches })
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 })
  }
}
