import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// A slot range from the new format
interface SlotRange {
  start: string  // HH:mm
  end:   string  // HH:mm
  label: string  // "8:30 AM – 10:30 AM"
}

const toMins = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// GET /api/availability?date=YYYY-MM-DD&branchId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date     = searchParams.get('date')
    const branchId = searchParams.get('branchId') || null

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    const requestedDate = new Date(date)
    const dayOfWeek = requestedDate.getDay()

    // Blocked date?
    const blockedDate = await prisma.blockedDate.findFirst({ where: { date } })
    if (blockedDate) {
      return NextResponse.json({
        available: false,
        reason: blockedDate.reason || 'Garage is closed on this date',
        timeSlots: []
      })
    }

    // Business hours for this day
    const businessHour = await prisma.businessHour.findFirst({ where: { dayOfWeek } })
    if (!businessHour || businessHour.isClosed) {
      return NextResponse.json({
        available: false,
        reason: 'Garage is closed on this day',
        timeSlots: []
      })
    }

    const openMins  = toMins(businessHour.openTime)
    const closeMins = toMins(businessHour.closeTime)

    // Get blocked times and in-person bookings for this date
    const [blockedTimes, inPersonBookings, existingBookings, timeClassifications] = await Promise.all([
      prisma.blockedTime.findMany({ where: { date } }),
      prisma.inPersonBooking.findMany({ where: { date } }),
      prisma.booking.findMany({
        where: {
          date,
          status: { in: ['APPROVED', 'CHECKED_IN', 'IN_PROGRESS'] },
          // scope to branch — null branchId means no filter (single-branch setup)
          ...(branchId ? { branchId } : {})
        },
        select: { time: true }
      }),
      prisma.timeClassification.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } })
    ])

    // Build the available slot list from classification ranges
    const timeSlots: Array<{ label: string; start: string; end: string; groupLabel: string }> = []

    for (const tc of timeClassifications) {
      let ranges: SlotRange[]
      try { ranges = JSON.parse(tc.ranges) } catch { continue }

      for (const range of ranges) {
        const slotStart = toMins(range.start)
        const slotEnd   = toMins(range.end)

        // Must fall within business hours
        if (slotStart < openMins || slotEnd > closeMins) continue

        // Check if slot overlaps with a blocked time
        const isBlocked = blockedTimes.some(bt => {
          const bStart = toMins(bt.startTime)
          const bEnd   = toMins(bt.endTime)
          return slotStart < bEnd && slotEnd > bStart
        })
        if (isBlocked) continue

        // Check if slot overlaps with an in-person booking
        const isInPerson = inPersonBookings.some(ip => {
          const iStart = toMins(ip.startTime)
          const iEnd   = toMins(ip.endTime)
          return slotStart < iEnd && slotEnd > iStart
        })
        if (isInPerson) continue

        // Count bookings for the whole group and compare against limit
        const groupRanges: SlotRange[] = JSON.parse(tc.ranges)
        const groupStartTimes = groupRanges.map(r => r.start)
        const bookingsInGroup = existingBookings.filter(b => groupStartTimes.includes(b.time)).length

        // Slot unavailable only when the group's booking limit is reached
        if (bookingsInGroup >= tc.bookingLimit) continue

        timeSlots.push({
          label:      range.label,
          start:      range.start,
          end:        range.end,
          groupLabel: tc.label
        })
      }
    }

    return NextResponse.json({
      available: true,
      date,
      dayOfWeek,
      businessHours: { open: businessHour.openTime, close: businessHour.closeTime },
      timeSlots
    })

  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 })
  }
}
