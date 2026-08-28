import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const breakSchema = z.object({
  name: z.string().min(2),
  startTime: z.string(),
  endTime: z.string(),
})

export async function GET() {
  try {
    await requireAuth()
    const breaks = await prisma.breakHour.findMany({ orderBy: { startTime: 'asc' } })
    return NextResponse.json({ breaks })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch break hours' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const data = breakSchema.parse(body)
    const breakHour = await prisma.breakHour.create({ data })
    return NextResponse.json({ breakHour }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create break hour' }, { status: 500 })
  }
}
