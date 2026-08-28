import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { sendRejectionEmail } from '@/lib/email'
import { z } from 'zod'

const rejectSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required')
})

// POST /api/admin/bookings/[id]/reject - Reject a booking
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    await requireAuth()

    const { id: bookingId } = await params
    const body = await request.json()
    const { reason } = rejectSchema.parse(body)

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { package: true }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.status !== 'PENDING_VERIFICATION') {
      return NextResponse.json(
        { error: 'Booking can only be rejected from pending verification status' },
        { status: 400 }
      )
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason
      },
      include: { package: true }
    })

    // Send rejection email only if customer provided a valid email
    if (booking.customerEmail && booking.customerEmail.includes('@')) {
      try {
        await sendRejectionEmail({
          customerEmail: booking.customerEmail,
          customerName: booking.customerName,
          serviceName: booking.package.name,
          date: booking.date,
          time: booking.time,
          rejectionReason: reason
        })
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking
    })

  } catch (error) {
    console.error('Rejection error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to reject booking' },
      { status: 500 }
    )
  }
}