import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { sendApprovalEmail } from '@/lib/email'

// POST /api/admin/bookings/[id]/approve - Approve a booking
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
        { error: 'Booking can only be approved from pending verification status' },
        { status: 400 }
      )
    }

    // Generate unique booking code (DM-XXXX-XXXX format)
    const generateBookingCode = () => {
      const segment1 = Math.floor(1000 + Math.random() * 9000)
      const segment2 = Math.floor(1000 + Math.random() * 9000)
      return `DM-${segment1}-${segment2}`
    }

    let bookingCode: string
    let codeExists = true

    // Ensure unique booking code
    do {
      bookingCode = generateBookingCode()
      const existing = await prisma.booking.findUnique({
        where: { bookingCode }
      })
      codeExists = !!existing
    } while (codeExists)

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'APPROVED',
        bookingCode,
        approvedAt: new Date()
      },
      include: { package: true }
    })

    // Send approval email only if customer provided a valid email
    if (booking.customerEmail && booking.customerEmail.includes('@')) {
      try {
        await sendApprovalEmail({
          customerEmail: booking.customerEmail,
          customerName: booking.customerName,
          bookingCode,
          serviceName: booking.package.name,
          date: booking.date,
          time: booking.time,
          depositAmount: booking.depositAmount
        })
        console.log('[Email] Approval email sent to:', booking.customerEmail)
      } catch (emailError: any) {
        console.error('[Email] Failed to send approval email:', emailError?.message)
      }
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking
    })

  } catch (error) {
    console.error('Approval error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to approve booking' },
      { status: 500 }
    )
  }
}