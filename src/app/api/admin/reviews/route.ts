import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    if (status && status !== 'all') where.status = status
    if (search) {
      where.OR = [
        { customer: { contains: search, mode: 'insensitive' } },
        { reviewText: { contains: search, mode: 'insensitive' } },
      ]
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        mechanic: { select: { name: true, specialization: true } }
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }]
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
