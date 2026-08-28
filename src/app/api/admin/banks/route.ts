import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const bankSchema = z.object({
  bankName: z.string().min(2),
  bankIcon: z.string().optional().nullable(),
  accountName: z.string().min(2),
  accountNumber: z.string().min(5),
  isActive: z.boolean().optional(),
})

export async function GET() {
  try {
    await requireAuth()
    const banks = await prisma.bankAccount.findMany({ orderBy: { createdAt: 'asc' } })
    return NextResponse.json({ banks })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const data = bankSchema.parse(body)

    const bank = await prisma.bankAccount.create({ data })
    return NextResponse.json({ bank }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create bank' }, { status: 500 })
  }
}
