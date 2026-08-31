import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Seeding website content...')

  const sections = [
    // ── HERO ──────────────────────────────────────────────────────────────────
    {
      section: 'home_hero',
      title: 'ADVANCED AUTOMOTIVE SOLUTIONS',
      subtitle: 'Precision Diagnostics & ECU Calibration',
      description: JSON.stringify({
        line1: 'ADVANCED',
        line2: 'AUTOMOTIVE',
        line3: 'SOLUTIONS',
        badge: 'DANI & MIKI AUTO SOLUTION  |  EST. ADDIS ABABA',
        body: 'High-precision computer diagnostics, ECU programming, custom chip tuning, and master auto-electrical engineering for European, Asian, and American vehicles.',
        cta_primary: 'BOOK AN APPOINTMENT',
        cta_secondary: 'LAUNCH DIAGNOSTIC SCANNER',
        scroll_label: 'SCROLL TO EXPLORE',
        badge1_label: 'ECU PROGRAMMING',
        badge1_sub: 'ENGINE & TCU',
        badge2_label: 'OEM DIAGNOSTICS',
        badge2_sub: 'ALL-SYSTEM',
        badge3_label: 'AUTO ELECTRICAL',
        badge3_sub: 'CAN-BUS & SENSORS',
        badge4_label: 'KEY PROGRAMMING',
        badge4_sub: 'SECURITY & FOBS',
      }),
      ctaText: 'BOOK AN APPOINTMENT',
    },

    // ── TYPOGRAPHIC INTERLUDE ─────────────────────────────────────────────────
    {
      section: 'typographic_interlude',
      title: 'THE DANI & MIKI STANDARD',
      subtitle: null,
      description: JSON.stringify({
        phrase1_left: "WE DON'T JUST",
        phrase1_right: 'FIND THE PROBLEM.',
        phrase2_left: 'WE ENGINEER THE',
        phrase2_right: 'RIGHT SOLUTION.',
        spec1: '01 / ZERO GUESSWORK',
        spec2: '02 / OEM PROTOCOLS',
        spec3: '03 / DEDICATED PRECISION',
      }),
      ctaText: null,
    },

    // ── PRECISION SHOWCASE ────────────────────────────────────────────────────
    {
      section: 'precision_showcase',
      title: 'PRECISION IN EVERY DETAIL.',
      subtitle: 'UNCOMPROMISING STANDARDS',
      description: JSON.stringify({
        body: 'From microscopic EEPROM soldering to high-load dynamometer tuning, our workshop operates at the intersection of mechanical craftsmanship and digital science.',
        stat1_value: '100%',
        stat1_label: 'FACTORY OEM WIRE LOOM MAPPING',
        stat2_value: '0.01A',
        stat2_label: 'PARASITIC DRAIN ISOLATION',
        stat3_value: 'LIFETIME',
        stat3_label: 'ECU MAP CLOUD BACKUPS',
      }),
      ctaText: null,
      imageUrl: 'https://flojmgyiopjuesgpqpup.supabase.co/storage/v1/object/public/website/defaults/hero-garage.jpg',
    },

    // ── WHY CHOOSE US ─────────────────────────────────────────────────────────
    {
      section: 'why_choose_us',
      title: 'ENGINEERED FOR TRUST',
      subtitle: 'MEASURED EXCELLENCE',
      description: JSON.stringify({
        intro: "Why Addis Ababa's most discerning motorists trust Dani & Miki Auto Solution with their high-value automotive investments.",
        stat1_number: '500',
        stat1_suffix: '+',
        stat1_label: 'VEHICLES SERVICED',
        stat1_desc: 'Precision repairs across German, Japanese, and American luxury & performance vehicles.',
        stat2_number: '1000',
        stat2_suffix: '+',
        stat2_label: 'DIAGNOSTIC SCANS',
        stat2_desc: 'Deep level CAN-bus & control module fault extractions with zero false positives.',
        stat3_number: '5',
        stat3_suffix: '+',
        stat3_label: 'SPECIALIZED DISCIPLINES',
        stat3_desc: 'ECU mapping, electronic micro-soldering, key immobilizers, DPF care, and diagnostics.',
        stat4_number: '100',
        stat4_suffix: '%',
        stat4_label: 'PRECISION RATE',
        stat4_desc: 'Rigorous pre-delivery health validation and warranty-backed service execution.',
        pillar1_title: 'OEM Equipment & Software',
        pillar1_body: 'We invest in genuine factory diagnostic units (Autel Ultra, Bosch KTS, WinOLS, Kess3, PicoScope) to interface directly with vehicle computers.',
        pillar2_title: 'Transparent Digital Reports',
        pillar2_body: 'Every customer receives an unedited digital telemetry printout detailing live DTC codes, sensor readings, and exact repair roadmaps.',
        pillar3_title: 'Guaranteed Turnaround',
        pillar3_body: 'Structured workflow schedules ensure your vehicle is diagnosed swiftly and returned in pristine operational status without unnecessary delays.',
      }),
      ctaText: null,
    },

    // ── CONTACT SECTION ───────────────────────────────────────────────────────
    {
      section: 'contact_section',
      title: "LET'S GET YOUR VEHICLE MOVING.",
      subtitle: 'DIRECT WORKSHOP COMMUNICATIONS',
      description: JSON.stringify({
        body: 'Whether diagnosing an elusive electrical error, programming a replacement smart key, or unlocking horsepower via custom ECU software — our master engineers are ready.',
        cta_primary: 'RESERVE WORKSHOP BAY',
        cta_secondary: 'CALL WORKSHOP',
        address_title: 'Bole Medhanialem / Garage Zone',
        address_body: 'Addis Ababa, Ethiopia · Direct GPS Coordinates: 9.0024° N, 38.7882° E',
        hours_label: 'Mon – Sat',
        hours_value: '08:00 AM – 06:30 PM',
        phone1: '+251 911 234 567',
        phone2: '+251 922 987 654',
        telegram_handle: '@DANIMIKIAUTO',
      }),
      ctaText: 'RESERVE WORKSHOP BAY',
    },

    // ── FOOTER ────────────────────────────────────────────────────────────────
    {
      section: 'footer',
      title: 'DANI & MIKI AUTO SOLUTION',
      subtitle: 'AUTO SOLUTION · PRECISION IN EVERY DETAIL',
      description: JSON.stringify({
        tagline: 'Precision automotive electronic engineering, deep OEM computer diagnostics, custom ECU calibrations, and immobilizer cryptographic solutions in Addis Ababa.',
        status_badge: 'DIAGNOSTIC BAYS ACTIVE',
        address_line1: 'Bole Medhanialem',
        address_line2: 'Addis Ababa, Ethiopia',
        phone: '+251 911 234 567',
        copyright: 'DANI & MIKI AUTO SOLUTION. ALL RIGHTS RESERVED.',
      }),
      ctaText: 'BOOK ONLINE',
    },
  ]

  for (const s of sections) {
    await prisma.websiteContent.upsert({
      where: { section: s.section },
      update: s,
      create: s,
    })
    console.log(`✅ ${s.section}`)
  }

  console.log('🎉 Content seeded!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
