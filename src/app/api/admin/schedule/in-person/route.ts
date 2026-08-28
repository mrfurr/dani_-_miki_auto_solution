import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const inPersonSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional().nullable(),
})

export async function GET() {
  try {
    await requireAuth()
    const bookings = await prisma.inPersonBooking.findMany({
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
    })
    return NextResponse.json({ bookings })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch in-person bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const data = inPersonSchema.parse(body)
    const booking = await prisma.inPersonBooking.create({ data })
    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create in-person booking' }, { status: 500 })
  }
}
