import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    const { searchParams } = new URL(request.url)
    const isRead = searchParams.get('isRead')

    const where: any = {}
    if (isRead === 'true') where.isRead = true
    if (isRead === 'false') where.isRead = false

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}
