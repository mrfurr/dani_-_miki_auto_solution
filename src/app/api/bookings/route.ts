import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadFile } from '@/lib/supabase'
import { STORAGE_BUCKETS } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for booking creation
const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 characters'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  vehicleMake: z.string().nullish(),
  vehicleModel: z.string().nullish(),
  vehicleYear: z.string().nullish(),
  plateNumber: z.string().nullish(),
  packageId: z.string().uuid('Invalid package ID').optional().or(z.literal('')),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  notes: z.string().nullish(),
  depositAmount: z.number().positive('Deposit must be positive'),
  depositMethod: z.string().min(1, 'Payment method is required'),
  transactionRef: z.string().optional().default('N/A'),
  branchId: z.string().optional().nullable(),
  paymentScreenshot: z.any().optional()
})

// Helper to safely get optional string from form data
function getOptionalField(formData: FormData, key: string): string | null {
  const val = formData.get(key) as string | null
  return val && val.trim() !== '' ? val.trim() : null
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const bookingData = {
      customerName: formData.get('customerName') as string,
      customerPhone: formData.get('customerPhone') as string,
      customerEmail: formData.get('customerEmail') as string,
      vehicleMake: getOptionalField(formData, 'vehicleMake'),
      vehicleModel: getOptionalField(formData, 'vehicleModel'),
      vehicleYear: getOptionalField(formData, 'vehicleYear'),
      plateNumber: getOptionalField(formData, 'plateNumber'),
      packageId: formData.get('packageId') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      notes: getOptionalField(formData, 'notes'),
      depositAmount: parseFloat(formData.get('depositAmount') as string),
      depositMethod: formData.get('depositMethod') as string,
      transactionRef: formData.get('transactionRef') as string,
      branchId: getOptionalField(formData, 'branchId'),
    }

    const paymentScreenshot = formData.get('paymentScreenshot') as File | null

    // Validate booking data
    const validatedData = bookingSchema.parse(bookingData)

    // Verify package exists and is active (skip for custom problems)
    if (validatedData.packageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: validatedData.packageId }
      })
      if (!pkg || !pkg.isActive) {
        return NextResponse.json(
          { error: 'Invalid or inactive package' },
          { status: 400 }
        )
      }
    }

    // Check booking limit for the time group
    const timeClassifications = await prisma.timeClassification.findMany({
      where: { isActive: true }
    })

    // Get all approved bookings for this date+branch (pending don't occupy a spot until approved)
    const activeDayBookings = await prisma.booking.findMany({
      where: {
        date: validatedData.date,
        status: { in: ['APPROVED', 'CHECKED_IN', 'IN_PROGRESS'] },
        // scope to branch if provided
        ...(validatedData.branchId ? { branchId: validatedData.branchId } : {})
      },
      select: { time: true }
    })

    for (const tc of timeClassifications) {
      // ranges are now objects: [{start:"08:30", end:"10:30", label:"..."}]
      const ranges: Array<{start:string; end:string; label:string}> = JSON.parse(tc.ranges)
      const startTimes = ranges.map(r => r.start)

      // Is the selected slot in this group?
      const inGroup = startTimes.includes(validatedData.time)
      if (!inGroup) continue

      // Count how many active bookings for this date fall in this group
      const countInGroup = activeDayBookings.filter(b => startTimes.includes(b.time)).length

      if (countInGroup >= tc.bookingLimit) {
        return NextResponse.json(
          { error: `The ${tc.label} time slot is fully booked for this date. Please choose a different date or time.` },
          { status: 409 }
        )
      }
    }

    // Upload payment screenshot - required
    if (!paymentScreenshot || paymentScreenshot.size === 0) {
      return NextResponse.json(
        { error: 'Payment screenshot is required' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(paymentScreenshot.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (paymentScreenshot.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // Generate safe filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = paymentScreenshot.name.split('.').pop()
    const filename = `booking-${timestamp}-${randomString}.${extension}`

    let paymentScreenshotPath: string
    // Upload to Supabase
    try {
      await uploadFile(
        STORAGE_BUCKETS.PAYMENT_SCREENSHOTS,
        filename,
        paymentScreenshot,
        paymentScreenshot.type
      )
      paymentScreenshotPath = filename
    } catch (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload payment screenshot' },
        { status: 500 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        customerEmail: validatedData.customerEmail || '',
        vehicleMake: validatedData.vehicleMake ?? undefined,
        vehicleModel: validatedData.vehicleModel ?? undefined,
        vehicleYear: validatedData.vehicleYear ?? undefined,
        plateNumber: validatedData.plateNumber ?? undefined,
        ...(validatedData.packageId ? { packageId: validatedData.packageId } : {}),
        date: validatedData.date,
        time: validatedData.time,
        notes: validatedData.notes ?? undefined,
        depositAmount: validatedData.depositAmount,
        depositMethod: validatedData.depositMethod,
        transactionRef: validatedData.transactionRef,
        paymentScreenshot: paymentScreenshotPath,
        branchId: validatedData.branchId ?? null,
        status: 'PENDING_VERIFICATION'
      },
      ...(validatedData.packageId
        ? { include: { package: true, branch: true } }
        : { include: { branch: true } }
      )
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        internalId: booking.internalId,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        serviceName: (booking as any).package?.name ?? 'Custom Problem',
        date: booking.date,
        time: booking.time,
        status: booking.status,
        createdAt: booking.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Booking creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// GET /api/bookings - Get all bookings (admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (date) {
      where.date = date
    }
    
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { bookingCode: { contains: search, mode: 'insensitive' } }
      ]
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        package: true,
        branch: { select: { name: true, address: true } }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ bookings })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}