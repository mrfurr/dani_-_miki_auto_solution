import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { supabase, STORAGE_BUCKETS } from '@/lib/supabase'

// GET /api/admin/screenshot?path=filename.jpg
// Returns a short-lived signed URL for a private payment screenshot
export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 })
    }

    // Generate a signed URL valid for 5 minutes
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.PAYMENT_SCREENSHOTS)
      .createSignedUrl(path, 300) // 300 seconds = 5 minutes

    if (error || !data?.signedUrl) {
      console.error('Error generating signed URL:', error)
      return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 })
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to get screenshot' }, { status: 500 })
  }
}
