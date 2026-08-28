import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

export async function GET() {
  try {
    await requireAuth()
    const content = await prisma.websiteContent.findMany({ orderBy: { section: 'asc' } })
    const map = Object.fromEntries(content.map(c => [c.section, c]))
    return NextResponse.json({ content: map, raw: content })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

const contentUpdateSchema = z.object({
  section: z.string().min(2),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  ctaText: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
})

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const data = contentUpdateSchema.parse(body)

    const content = await prisma.websiteContent.upsert({
      where: { section: data.section },
      update: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        ctaText: data.ctaText,
        imageUrl: data.imageUrl,
      },
      create: data,
    })

    return NextResponse.json({ content })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}
