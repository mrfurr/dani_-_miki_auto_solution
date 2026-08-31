import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// PATCH /api/admin/schedule/time-classifications/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const body = await request.json()
    const { label, ranges, description, icon, color, bgColor, order, isActive, bookingLimit } = body

    const data: any = {}
    if (label       !== undefined) data.label       = label
    if (ranges      !== undefined) data.ranges      = JSON.stringify(ranges)
    if (description !== undefined) data.description = description
    if (icon        !== undefined) data.icon        = icon
    if (color       !== undefined) data.color       = color
    if (bgColor     !== undefined) data.bgColor     = bgColor
    if (order       !== undefined) data.order       = order
    if (isActive    !== undefined) data.isActive    = isActive
    if (bookingLimit !== undefined) data.bookingLimit = parseInt(bookingLimit)

    const updated = await prisma.timeClassification.update({
      where: { id },
      data
    })

    return NextResponse.json({ classification: updated })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating time classification:', error)
    return NextResponse.json({ error: 'Failed to update time classification' }, { status: 500 })
  }
}

// DELETE /api/admin/schedule/time-classifications/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    await prisma.timeClassification.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting time classification:', error)
    return NextResponse.json({ error: 'Failed to delete time classification' }, { status: 500 })
  }
}
