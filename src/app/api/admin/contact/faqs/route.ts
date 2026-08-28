import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export async function GET() {
  try {
    await requireAuth()
    const faqs = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ faqs })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const data = faqSchema.parse(body)
    const faq = await prisma.fAQ.create({ data })
    return NextResponse.json({ faq }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }
}
