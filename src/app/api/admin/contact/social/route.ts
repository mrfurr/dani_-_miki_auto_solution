import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const socialSchema = z.object({
  platform: z.string().min(2),
  url: z.string().url(),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
})

export async function GET() {
  try {
    await requireAuth()
    const links = await prisma.socialLink.findMany({ orderBy: { createdAt: 'asc' } })
    return NextResponse.json({ links })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const data = socialSchema.parse(body)
    const link = await prisma.socialLink.create({ data })
    return NextResponse.json({ link }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create social link' }, { status: 500 })
  }
}
