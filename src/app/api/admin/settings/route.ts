import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

export async function GET() {
  try {
    await requireAuth()
    const settings = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } })
    // Convert to key/value map
    const map = Object.fromEntries(settings.map(s => [s.key, s.value]))
    return NextResponse.json({ settings: map, raw: settings })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

const settingsUpdateSchema = z.object({
  settings: z.record(z.string(), z.string())
})

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { settings } = settingsUpdateSchema.parse(body)

    const updated = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        })
      )
    )

    return NextResponse.json({ updated })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
