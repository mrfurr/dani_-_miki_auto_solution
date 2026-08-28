import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

export async function GET() {
  try {
    await requireAuth()
    const hours = await prisma.businessHour.findMany({ orderBy: { dayOfWeek: 'asc' } })
    return NextResponse.json({ hours })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch business hours' }, { status: 500 })
  }
}

const updateSchema = z.object({
  hours: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: z.string(),
    closeTime: z.string(),
    isClosed: z.boolean(),
  }))
})

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { hours } = updateSchema.parse(body)

    const updated = await Promise.all(
      hours.map(h =>
        prisma.businessHour.upsert({
          where: { dayOfWeek: h.dayOfWeek },
          update: { openTime: h.openTime, closeTime: h.closeTime, isClosed: h.isClosed },
          create: h,
        })
      )
    )

    return NextResponse.json({ hours: updated })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update business hours' }, { status: 500 })
  }
}
