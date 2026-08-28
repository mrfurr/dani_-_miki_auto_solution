import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const branchSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  phone: z.string().optional().nullable(),
  mapUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
})

export async function GET() {
  try {
    await requireAuth()
    const branches = await prisma.branch.findMany({ orderBy: { createdAt: 'asc' } })
    return NextResponse.json({ branches })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const data = branchSchema.parse(body)

    const branch = await prisma.branch.create({ data })
    return NextResponse.json({ branch }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create branch' }, { status: 500 })
  }
}
