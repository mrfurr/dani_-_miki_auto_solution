import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// POST /api/admin/bookings/[id]/checkin - Check in a customer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    await requireAuth()

    const { id: bookingId } = await params

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Booking must be approved before check-in' },
        { status: 400 }
      )
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CHECKED_IN',
        checkedInAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      booking: updatedBooking
    })

  } catch (error) {
    console.error('Check-in error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to check in booking' },
      { status: 500 }
    )
  }
}