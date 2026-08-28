import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const mechanicSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  specialization: z.string().min(2),
  experience: z.string().min(1),
  certifications: z.array(z.string()),
  bio: z.string().min(10),
  photo: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
})

export async function GET() {
  try {
    await requireAuth()
    const mechanics = await prisma.mechanic.findMany({
      include: {
        reviews: {
          where: { status: 'APPROVED' },
          select: { rating: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    const result = mechanics.map(m => ({
      ...m,
      avgRating: m.reviews.length > 0
        ? m.reviews.reduce((s, r) => s + r.rating, 0) / m.reviews.length
        : 0,
      reviewCount: m.reviews.length
    }))

    return NextResponse.json({ mechanics: result })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch mechanics' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const data = mechanicSchema.parse(body)

    const mechanic = await prisma.mechanic.create({ data })
    return NextResponse.json({ mechanic }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create mechanic' }, { status: 500 })
  }
}
