/**
 * Uploads local default images to Supabase 'website' bucket
 * and updates the DB records to use Supabase public URLs.
 * Run once: npx tsx scripts/upload-default-images.ts
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

const BUCKET = 'website'
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')

// Map: local filename → role
const IMAGE_MAP = [
  { file: 'dm_wallpaper2.jpg',          key: 'hero_bg' },
  { file: 'hero-garage.jpg',            key: 'precision_bg' },
  { file: 'computer_diagnosis.jpeg',    key: 'svc_01' },
  { file: 'service-ecu.jpg',            key: 'svc_02' },
  { file: 'automotive_electrical.jpeg', key: 'svc_03' },
  { file: 'service-keys.jpg',           key: 'svc_04' },
  { file: 'service-dpf.jpg',            key: 'svc_05' },
  { file: 'service-maintenance.jpg',    key: 'svc_06' },
]

async function uploadImage(filename: string): Promise<string> {
  const filepath = path.join(IMAGES_DIR, filename)
  const buffer = fs.readFileSync(filepath)
  const ext = path.extname(filename).toLowerCase()
  const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png'
  const destPath = `defaults/${filename}`

  // Try upload — if already exists, skip
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(destPath, buffer, { contentType, upsert: true })

  if (error) throw new Error(`Upload failed for ${filename}: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(destPath)
  return data.publicUrl
}

async function main() {
  console.log('📤 Uploading default images to Supabase...\n')

  const urls: Record<string, string> = {}

  for (const { file, key } of IMAGE_MAP) {
    try {
      const url = await uploadImage(file)
      urls[key] = url
      console.log(`✅ ${key}: ${url}`)
    } catch (e: any) {
      console.error(`❌ ${key}: ${e.message}`)
      process.exit(1)
    }
  }

  console.log('\n📝 Updating database records...\n')

  // Update home_hero background
  await prisma.websiteContent.upsert({
    where: { section: 'home_hero' },
    update: { imageUrl: urls.hero_bg },
    create: {
      section: 'home_hero',
      title: 'ADVANCED AUTOMOTIVE SOLUTIONS',
      subtitle: 'Precision Diagnostics & ECU Calibration',
      ctaText: 'BOOK AN APPOINTMENT',
      imageUrl: urls.hero_bg,
    }
  })
  console.log('✅ home_hero imageUrl updated')

  // Update precision_showcase background
  await prisma.websiteContent.upsert({
    where: { section: 'precision_showcase' },
    update: { imageUrl: urls.precision_bg },
    create: {
      section: 'precision_showcase',
      title: 'PRECISION IN EVERY DETAIL.',
      subtitle: 'UNCOMPROMISING STANDARDS',
      imageUrl: urls.precision_bg,
    }
  })
  console.log('✅ precision_showcase imageUrl updated')

  // Update services_showcase with new image URLs
  const svcRow = await prisma.websiteContent.findUnique({ where: { section: 'services_showcase' } })
  if (svcRow?.description) {
    const services = JSON.parse(svcRow.description)
    const keyMap: Record<number, string> = {
      0: urls.svc_01,
      1: urls.svc_02,
      2: urls.svc_03,
      3: urls.svc_04,
      4: urls.svc_05,
      5: urls.svc_06,
    }
    const updated = services.map((s: any, i: number) => ({
      ...s,
      image: keyMap[i] ?? s.image
    }))
    await prisma.websiteContent.update({
      where: { section: 'services_showcase' },
      data: { description: JSON.stringify(updated) }
    })
    console.log('✅ services_showcase images updated')
  }

  console.log('\n🎉 Done! All default images are now hosted on Supabase.')
  console.log('The deployed site will now use these URLs automatically.\n')
}

main()
  .catch(e => { console.error('ERROR:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
