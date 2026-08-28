import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Storage buckets
export const STORAGE_BUCKETS = {
  PAYMENT_SCREENSHOTS: 'payment-screenshots',
  MECHANICS: 'mechanics',
  PACKAGES: 'packages',
  WEBSITE: 'website',
  BRANDING: 'branding'
} as const

// Helper function to upload file
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  contentType: string
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: false
    })

  if (error) throw error
  return data
}

// Helper function to get public URL (only for non-private buckets)
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Helper function to create signed URL (for private buckets like payment screenshots)
export async function getSignedUrl(bucket: string, path: string, expiresIn: number = 60) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)
  
  if (error) throw error
  return data.signedUrl
}

// Helper function to delete file
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) throw error
}