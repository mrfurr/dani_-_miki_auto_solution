import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const mechanicUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.string().min(2).optional(),
  specialization: z.string().min(2).optional(),
  experience: z.string().min(1).optional(),
  certifications: z.array(z.string()).optional(),
  bio: z.string().min(10).optional(),
  photo: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await request.json()
    const data = mechanicUpdateSchema.parse(body)

    const mechanic = await prisma.mechanic.update({ where: { id }, data })
    return NextResponse.json({ mechanic })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update mechanic' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

    // Soft-delete: deactivate instead of hard delete to preserve review history
    const mechanic = await prisma.mechanic.update({
      where: { id },
      data: { isActive: false }
    })
    return NextResponse.json({ mechanic })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete mechanic' }, { status: 500 })
  }
}
