import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/time-classifications?date=YYYY-MM-DD&branchId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date     = searchParams.get('date')
    const branchId = searchParams.get('branchId') || null

    const classifications = await prisma.timeClassification.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    const parsed = classifications.map(c => ({
      ...c,
      ranges: JSON.parse(c.ranges) as Array<{ start: string; end: string; label: string }>
    }))

    if (date) {
      const bookings = await prisma.booking.findMany({
        where: {
          date,
          status: { in: ['APPROVED', 'CHECKED_IN', 'IN_PROGRESS'] },
          ...(branchId ? { branchId } : {})
        },
        select: { time: true }
      })

      const withCount = parsed.map(c => {
        const startTimes = c.ranges.map((r: any) => r.start)
        const count = bookings.filter(b => startTimes.includes(b.time)).length
        return {
          ...c,
          currentBookings: count,
          isFull: count >= c.bookingLimit
        }
      })

      return NextResponse.json({ classifications: withCount })
    }

    return NextResponse.json({ classifications: parsed })
  } catch (error) {
    console.error('Error fetching time classifications:', error)
    return NextResponse.json({ error: 'Failed to fetch time classifications' }, { status: 500 })
  }
}
