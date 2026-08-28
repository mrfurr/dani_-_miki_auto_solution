import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/availability?date=YYYY-MM-DD - Get available time slots for a specific date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // Parse the date
    const requestedDate = new Date(date)
    const dayOfWeek = requestedDate.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Check if the date is blocked
    const blockedDate = await prisma.blockedDate.findFirst({
      where: { date }
    })

    if (blockedDate) {
      return NextResponse.json({
        available: false,
        reason: blockedDate.reason || 'Garage is closed on this date',
        timeSlots: []
      })
    }

    // Get business hours for this day
    const businessHour = await prisma.businessHour.findFirst({
      where: { dayOfWeek }
    })

    if (!businessHour || businessHour.isClosed) {
      return NextResponse.json({
        available: false,
        reason: 'Garage is closed on this day',
        timeSlots: []
      })
    }

    // Get break hours
    const breakHours = await prisma.breakHour.findMany()

    // Get blocked times for this date
    const blockedTimes = await prisma.blockedTime.findMany({
      where: { date }
    })

    // Get in-person bookings for this date
    const inPersonBookings = await prisma.inPersonBooking.findMany({
      where: { date }
    })

    // Get existing online bookings for this date
    const existingBookings = await prisma.booking.findMany({
      where: {
        date,
        status: {
          in: ['PENDING_VERIFICATION', 'APPROVED', 'CHECKED_IN', 'IN_PROGRESS']
        }
      },
      select: { time: true }
    })

    // Generate time slots based on business hours
    const [openHour, openMinute] = businessHour.openTime.split(':').map(Number)
    const [closeHour, closeMinute] = businessHour.closeTime.split(':').map(Number)

    const timeSlots: string[] = []
    let currentHour = openHour
    let currentMinute = openMinute

    // Generate slots every 90 minutes
    while (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute)) {
      const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`

      // Check if this time is during a break
      const isDuringBreak = breakHours.some((bh: { startTime: string; endTime: string }) => {
        const [bsH, bsM] = bh.startTime.split(':').map(Number)
        const [beH, beM] = bh.endTime.split(':').map(Number)
        const cur = currentHour * 60 + currentMinute
        const bStart = bsH * 60 + bsM
        const bEnd = beH * 60 + beM
        return cur >= bStart && cur < bEnd
      })

      // Check if this time is blocked
      const isBlocked = blockedTimes.some((bt: { startTime: string; endTime: string }) => {
        const [bsH, bsM] = bt.startTime.split(':').map(Number)
        const [beH, beM] = bt.endTime.split(':').map(Number)
        const cur = currentHour * 60 + currentMinute
        const bStart = bsH * 60 + bsM
        const bEnd = beH * 60 + beM
        return cur >= bStart && cur < bEnd
      })

      // Check if this time is booked (online or in-person)
      const isBooked =
        existingBookings.some((b: { time: string }) => b.time === timeString) ||
        inPersonBookings.some((ip: { startTime: string; endTime: string }) => {
          const [bsH, bsM] = ip.startTime.split(':').map(Number)
          const [beH, beM] = ip.endTime.split(':').map(Number)
          const cur = currentHour * 60 + currentMinute
          const bStart = bsH * 60 + bsM
          const bEnd = beH * 60 + beM
          return cur >= bStart && cur < bEnd
        })

      // Add slot if available
      if (!isDuringBreak && !isBlocked && !isBooked) {
        const displayHour = currentHour % 12 || 12
        const ampm = currentHour >= 12 ? 'PM' : 'AM'
        const displayTime = `${String(displayHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')} ${ampm}`
        timeSlots.push(displayTime)
      }

      // Increment by 90 minutes
      currentMinute += 90
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60)
        currentMinute = currentMinute % 60
      }
    }

    return NextResponse.json({
      available: true,
      date,
      dayOfWeek,
      businessHours: {
        open: businessHour.openTime,
        close: businessHour.closeTime
      },
      timeSlots
    })
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
