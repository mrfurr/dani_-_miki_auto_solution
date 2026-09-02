import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    await requireAuth()

    const todayStr = new Date().toISOString().split('T')[0]

    const [
      todayBookings,
      pendingVerification,
      approved,
      checkedIn,
      completed,
      totalCustomers,
      totalReviews,
      unreadMessages,
      totalMechanics,
      revenueAgg,
    ] = await Promise.all([
      prisma.booking.count({ where: { date: todayStr } }),
      prisma.booking.count({ where: { status: 'PENDING_VERIFICATION' } }),
      prisma.booking.count({ where: { status: 'APPROVED' } }),
      prisma.booking.count({ where: { status: 'CHECKED_IN' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.count(),
      prisma.review.count({ where: { status: 'APPROVED' } }),
      prisma.message.count({ where: { isRead: false } }),
      prisma.mechanic.count({ where: { isActive: true } }),
      prisma.booking.aggregate({
        where: { status: { in: ['APPROVED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED'] } },
        _sum: { depositAmount: true },
      }),
    ])

    return NextResponse.json({
      todayBookings,
      pendingVerification,
      approved,
      checkedIn,
      completed,
      totalCustomers,
      totalReviews,
      unreadMessages,
      totalMechanics,
      totalRevenue: revenueAgg._sum.depositAmount ?? 0,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
