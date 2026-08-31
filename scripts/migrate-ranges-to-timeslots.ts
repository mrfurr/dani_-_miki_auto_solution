/**
 * Migrates TimeClassification.ranges from minute-arrays [[510,630]]
 * to named time-slot objects [{start:"08:30",end:"10:30",label:"8:30 AM – 10:30 AM"}]
 * Run once: npx tsx scripts/migrate-ranges-to-timeslots.ts
 */
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

function minsToTime(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function minsToLabel(start: number, end: number): string {
  const fmt = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    const ampm = h >= 12 ? 'PM' : 'AM'
    const display = h % 12 || 12
    return `${display}:${String(m).padStart(2, '0')} ${ampm}`
  }
  return `${fmt(start)} – ${fmt(end)}`
}

async function main() {
  const all = await prisma.timeClassification.findMany()

  for (const tc of all) {
    let parsed: any
    try { parsed = JSON.parse(tc.ranges) } catch { continue }

    // Already migrated (array of objects)?
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object' && 'start' in parsed[0]) {
      console.log(`⏩ ${tc.label} already migrated`)
      continue
    }

    // Old format: [[510, 630], [635, 720]]
    const newRanges = (parsed as number[][]).map(([start, end]) => ({
      start: minsToTime(start),
      end: minsToTime(end),
      label: minsToLabel(start, end)
    }))

    // Rebuild description from new labels
    const description = newRanges.map(r => r.label).join(', ')

    await prisma.timeClassification.update({
      where: { id: tc.id },
      data: {
        ranges: JSON.stringify(newRanges),
        description
      }
    })
    console.log(`✅ ${tc.label}: ${description}`)
  }

  console.log('\n🎉 Migration complete!')
}

main()
  .catch(e => { console.error('ERROR:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
