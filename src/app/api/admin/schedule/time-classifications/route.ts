import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET /api/admin/schedule/time-classifications - Get all time classifications
export async function GET() {
  try {
    await requireAuth()
    const classifications = await prisma.timeClassification.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json({ classifications })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching time classifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch time classifications' },
      { status: 500 }
    )
  }
}

// POST /api/admin/schedule/time-classifications - Create time classification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { label, ranges, description, icon, color, bgColor, order, bookingLimit } = body

    if (!label || !ranges || !description) {
      return NextResponse.json(
        { error: 'Label, ranges, and description are required' },
        { status: 400 }
      )
    }

    const classification = await prisma.timeClassification.create({
      data: {
        label,
        ranges: JSON.stringify(ranges),
        description: description || (ranges as any[]).map((r: any) => r.label || `${r.start} – ${r.end}`).join(', '),
        icon: icon || null,
        color: color || null,
        bgColor: bgColor || null,
        order: order || 0,
        bookingLimit: bookingLimit != null ? parseInt(bookingLimit) : 5
      }
    })

    return NextResponse.json({ classification })
  } catch (error) {
    console.error('Error creating time classification:', error)
    return NextResponse.json(
      { error: 'Failed to create time classification' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/schedule/time-classifications - Update time classifications (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { classifications } = body

    if (!Array.isArray(classifications)) {
      return NextResponse.json(
        { error: 'Classifications must be an array' },
        { status: 400 }
      )
    }

    // Update each classification
    const updates = classifications.map((item: any) =>
      prisma.timeClassification.update({
        where: { id: item.id },
        data: {
          label: item.label,
          ranges: JSON.stringify(item.ranges),
          description: item.description,
          icon: item.icon || null,
          color: item.color || null,
          bgColor: item.bgColor || null,
          order: item.order || 0,
          isActive: item.isActive !== undefined ? item.isActive : true,
          bookingLimit: item.bookingLimit != null ? parseInt(item.bookingLimit) : 5
        }
      })
    )

    await prisma.$transaction(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating time classifications:', error)
    return NextResponse.json(
      { error: 'Failed to update time classifications' },
      { status: 500 }
    )
  }
}
