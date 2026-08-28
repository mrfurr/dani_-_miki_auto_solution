import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, verifyPassword, hashPassword } from '@/lib/auth'
import { z } from 'zod'

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAuth()
    const body = await request.json()
    const { currentPassword, newPassword } = passwordSchema.parse(body)

    const adminRecord = await prisma.admin.findUnique({ where: { id: admin.id } })
    if (!adminRecord) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    const isValid = await verifyPassword(currentPassword, adminRecord.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    const passwordHash = await hashPassword(newPassword)
    await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
