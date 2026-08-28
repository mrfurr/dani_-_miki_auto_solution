import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const packageSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().nonnegative().optional().nullable(),
  deposit: z.number().nonnegative().optional().nullable(),
  duration: z.number().int().positive(),
  isActive: z.boolean().optional(),
  imageUrl: z.string().optional().nullable(),
  features: z.array(z.string()),
})

export async function GET() {
  try {
    await requireAuth()
    const packages = await prisma.package.findMany({ orderBy: { createdAt: 'asc' } })
    return NextResponse.json({ packages })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const data = packageSchema.parse(body)

    const pkg = await prisma.package.create({ data })
    return NextResponse.json({ package: pkg }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}
