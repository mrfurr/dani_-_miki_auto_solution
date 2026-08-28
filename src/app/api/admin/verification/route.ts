import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET /api/admin/verification?code=DM-XXXX-XXXX - Verify a booking code
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    await requireAuth()

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const phone = searchParams.get('phone')
    const email = searchParams.get('email')
    const name = searchParams.get('name')

    if (!code && !phone && !email && !name) {
      return NextResponse.json(
        { error: 'At least one search parameter is required' },
        { status: 400 }
      )
    }

    const where: any = {}

    if (code) {
      where.bookingCode = code
    } else if (phone) {
      where.customerPhone = phone
    } else if (email) {
      where.customerEmail = email
    } else if (name) {
      where.customerName = { contains: name, mode: 'insensitive' }
    }

    const booking = await prisma.booking.findFirst({
      where,
      include: {
        package: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      booking
    })

  } catch (error) {
    console.error('Verification error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to verify booking' },
      { status: 500 }
    )
  }
}