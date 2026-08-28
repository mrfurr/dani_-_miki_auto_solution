import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/reviews — Return all APPROVED reviews for the public page
// isPinned controls visibility: pinned = shown, unpinned = hidden from public
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        status: 'APPROVED',
        isPinned: true, // unpinned = admin hid it from public
      },
      include: { mechanic: { select: { id: true, name: true, specialization: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST /api/reviews — Customer submits a review
// Goes LIVE immediately (APPROVED + pinned)
// Admin can delete or unpin to remove from public view
const reviewSchema = z.object({
  mechanicId: z.string().uuid('Invalid mechanic ID'),
  customer:   z.string().min(2, 'Name must be at least 2 characters'),
  email:      z.string().email('Invalid email').optional().or(z.literal('')),
  phone:      z.string().optional(),
  rating:     z.number().int().min(1).max(5),
  reviewText: z.string().min(10, 'Review must be at least 10 characters').max(1000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = reviewSchema.parse(body)

    const mechanic = await prisma.mechanic.findUnique({ where: { id: data.mechanicId } })
    if (!mechanic) {
      return NextResponse.json({ error: 'Mechanic not found' }, { status: 404 })
    }

    const review = await prisma.review.create({
      data: {
        mechanicId: data.mechanicId,
        customer:   data.customer,
        email:      data.email || null,
        phone:      data.phone || null,
        rating:     data.rating,
        reviewText: data.reviewText,
        status:     'APPROVED', // live immediately
        isPinned:   true,        // visible on public page immediately
      },
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error) {
    console.error('Review submission error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
