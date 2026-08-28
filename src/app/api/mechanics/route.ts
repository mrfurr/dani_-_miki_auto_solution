import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/mechanics - Get all active mechanics
export async function GET(request: NextRequest) {
  try {
    const mechanics = await prisma.mechanic.findMany({
      where: { isActive: true },
      include: {
        reviews: {
          where: { status: 'APPROVED' },
          select: {
            rating: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Calculate average rating for each mechanic
    const mechanicsWithRatings = mechanics.map(mechanic => {
      const reviews = mechanic.reviews
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0

      return {
        ...mechanic,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length
      }
    })

    return NextResponse.json({ mechanics: mechanicsWithRatings })

  } catch (error) {
    console.error('Error fetching mechanics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mechanics' },
      { status: 500 }
    )
  }
}