import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const packageUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().nonnegative().nullable().optional(),
  deposit: z.number().nonnegative().nullable().optional(),
  duration: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  imageUrl: z.string().nullable().optional(),
  features: z.array(z.string()).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await request.json()
    const data = packageUpdateSchema.parse(body)

    const pkg = await prisma.package.update({ where: { id }, data })
    return NextResponse.json({ package: pkg })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

    // Check if package has bookings
    const bookingCount = await prisma.booking.count({ where: { packageId: id } })
    if (bookingCount > 0) {
      // Soft delete: deactivate instead
      const pkg = await prisma.package.update({ where: { id }, data: { isActive: false } })
      return NextResponse.json({ package: pkg, note: 'Package deactivated (has bookings)' })
    }

    await prisma.package.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
  }
}
