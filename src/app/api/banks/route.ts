import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/banks - Get all active bank accounts
export async function GET(request: NextRequest) {
  try {
    const banks = await prisma.bankAccount.findMany({
      where: { isActive: true },
      orderBy: { bankName: 'asc' }
    })

    return NextResponse.json({ banks })

  } catch (error) {
    console.error('Error fetching bank accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bank accounts' },
      { status: 500 }
    )
  }
}