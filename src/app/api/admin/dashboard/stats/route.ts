import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get today's bookings
    const todayBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Get pending verification count
    const pendingVerification = await prisma.booking.count({
      where: { status: 'PENDING_VERIFICATION' }
    })

    // Get approved count
    const approved = await prisma.booking.count({
      where: { status: 'APPROVED' }
    })

    // Get checked in count
    const checkedIn = await prisma.booking.count({
      where: { status: 'CHECKED_IN' }
    })

    // Get completed count
    const completed = await prisma.booking.count({
      where: { status: 'COMPLETED' }
    })

    // Get total unique customers
    const totalCustomers = await prisma.booking.groupBy({
      by: ['customerEmail'],
      _count: true
    })

    // Get total reviews
    const totalReviews = await prisma.review.count()

    // Get unread messages
    const unreadMessages = await prisma.message.count({
      where: { isRead: false }
    })

    // Get total revenue (from completed bookings)
    const completedBookings = await prisma.booking.findMany({
      where: { status: 'COMPLETED' },
      select: { depositAmount: true }
    })

    const totalRevenue = completedBookings.reduce(
      (sum, booking) => sum + (booking.depositAmount || 0),
      0
    )

    // Get total mechanics
    const totalMechanics = await prisma.mechanic.count({ where: { isActive: true } })

    return NextResponse.json({
      todayBookings,
      pendingVerification,
      approved,
      checkedIn,
      completed,
      totalCustomers: totalCustomers.length,
      totalReviews,
      unreadMessages,
      totalRevenue,
      totalMechanics
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}