import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('🧹 Clearing existing data...')
    await prisma.booking.deleteMany()
    await prisma.review.deleteMany()
    await prisma.mechanic.deleteMany()
    await prisma.package.deleteMany()
    await prisma.service.deleteMany()
    await prisma.message.deleteMany()
    await prisma.bankAccount.deleteMany()
    await prisma.businessHour.deleteMany()
    await prisma.breakHour.deleteMany()
    await prisma.blockedDate.deleteMany()
    await prisma.blockedTime.deleteMany()
    await prisma.inPersonBooking.deleteMany()
    await prisma.branch.deleteMany()
    await prisma.fAQ.deleteMany()
    await prisma.socialLink.deleteMany()
    await prisma.siteSetting.deleteMany()
    await prisma.websiteContent.deleteMany()
    await prisma.admin.deleteMany()
    await prisma.timeClassification.deleteMany()
  }

  // Create Admin
  console.log('👤 Creating admin user...')
  const passwordHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@danimiki.com',
      passwordHash
    }
  })
  console.log(`✅ Admin created: ${admin.email}`)

  // Create Services
  console.log('🔧 Creating services...')
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Computer Diagnostics',
        description: 'Deep Level Electronic Telemetry & Fault Isolation - Dealer-level OEM diagnostic scanning across all vehicle control modules.',
        isActive: true
      }
    }),
    prisma.service.create({
      data: {
        name: 'ECU Programming',
        description: 'Custom Chip Tuning, Module Flashing & Software Calibration - Precision flash reprogramming and EEPROM calibration.',
        isActive: true
      }
    }),
    prisma.service.create({
      data: {
        name: 'Automotive Electrical & Electronic',
        description: 'Complex Harness Diagnostics & Micro-Soldering Repairs - Comprehensive troubleshooting of complex automotive electrical faults.',
        isActive: true
      }
    }),
    prisma.service.create({
      data: {
        name: 'Key Programming',
        description: 'Smart Key Generation, Transponder Cloning & All Keys Lost - State-of-the-art immobilizer and key programming.',
        isActive: true
      }
    }),
    prisma.service.create({
      data: {
        name: 'DPF Service',
        description: 'Diesel Particulate Filter Regeneration, Cleaning & Calibration - Restoring clogged diesel particulate filters.',
        isActive: true
      }
    }),
    prisma.service.create({
      data: {
        name: 'Vehicle Maintenance',
        description: 'Precision Mechanical Service & Scheduled Inspections - Meticulous preventative maintenance.',
        isActive: true
      }
    })
  ])
  console.log(`✅ Created ${services.length} services`)

  // Create Packages
  console.log('📦 Creating packages...')
  const packages = await Promise.all([
    prisma.package.create({
      data: {
        name: 'Comprehensive OEM Diagnostic Health Scan',
        description: 'Complete electronic inspection of all vehicle onboard controllers with full printed/digital telemetry report.',
        price: 1500,
        deposit: 200,
        duration: 60,
        isActive: true,
        features: [
          'All-System Full Module DTC Scanning',
          'Live Sensor Data Stream Recording',
          'Actuator Bi-Directional Functional Testing',
          'Battery, Alternator & Starter Charging Load Test',
          'Clear False Codes & Professional Consultation'
        ]
      }
    }),
    prisma.package.create({
      data: {
        name: 'Stage 1 ECU Performance & Fuel Optimization',
        description: 'Custom tailored software calibration to unlock +15-30% horsepower and torque.',
        price: 12500,
        deposit: 200,
        duration: 180,
        isActive: true,
        features: [
          'Custom WinOLS Map tailored to your engine',
          'Pre-tune & Post-tune Diagnostic Validation',
          'Speed Governor Removal & Rev Limiter Adjustment',
          '100% Original Stock Backup Saved',
          'Smoother Power Delivery & Eliminated Turbo Lag'
        ]
      }
    }),
    prisma.package.create({
      data: {
        name: 'Advanced Auto-Electrical & Wiring Diagnostics',
        description: 'Deep level signal tracing with 4-channel PicoScope oscilloscope.',
        price: 3500,
        deposit: 200,
        duration: 180,
        isActive: true,
        features: [
          'Parasitic Battery Drain Current Isolation',
          'CAN-bus High/Low signal integrity capture',
          'Sensor ground & power reference verification',
          'Micro-soldering inspection of fuse box',
          'Comprehensive wiring repair plan with quote'
        ]
      }
    }),
    prisma.package.create({
      data: {
        name: 'Smart Key & Immobilizer Programming',
        description: 'OEM-grade key fob programming, proximity keyless-go pairing.',
        price: 4500,
        deposit: 200,
        duration: 45,
        isActive: true,
        features: [
          'High-grade OEM or aftermarket smart key fob',
          'Transponder chip crypto-pairing with ECU',
          'Keyless-Go proximity door lock calibration',
          'Emergency mechanical key laser cutting',
          'Old/lost keys deleted from vehicle memory'
        ]
      }
    }),
    prisma.package.create({
      data: {
        name: 'DPF Ultrasonic Clean & Forced Regeneration',
        description: 'Restore clogged diesel exhaust particulate filter flow rate.',
        price: 7000,
        deposit: 200,
        duration: 180,
        isActive: true,
        features: [
          'Chemical soot dissolution and pressurized flush',
          'Computer-commanded active regeneration',
          'Differential pressure sensor calibration',
          'EGR system carbon check and measurement',
          'Restores lost horsepower and clears limp mode'
        ]
      }
    })
  ])
  console.log(`✅ Created ${packages.length} packages`)

  // Create Mechanics
  console.log('👨‍🔧 Creating mechanics...')
  const mechanics = await Promise.all([
    prisma.mechanic.create({
      data: {
        name: 'Abel Tesfaye',
        role: 'Lead ECU Calibration & Diagnostic Engineer',
        specialization: 'ECU Remapping, BMW / Mercedes CAN-Bus, OBD-II Telemetry',
        experience: '5 years',
        certifications: ['Autel Certified Master Diagnostic', 'WinOLS ECU Map Specialist', 'Bosch Common Rail Tech'],
        bio: 'Specialist in deep-level ECU hex mapping, engine fault isolation, and high-performance powertrain optimization.',
        isActive: true
      }
    }),
    prisma.mechanic.create({
      data: {
        name: 'Michael (Miki) Assefa',
        role: 'Master Automotive Electrical & Systems Architect',
        specialization: 'Micro-Soldering, Complex Wiring Harnesses, Body Control Modules',
        experience: '8 years',
        certifications: ['ASE Master Electronic Certified', 'PicoScope 4-Channel Master', 'Hybrid/EV Safety L3'],
        bio: 'Founder and electrical systems mastermind. Known for unraveling complex phantom wiring shorts.',
        isActive: true
      }
    }),
    prisma.mechanic.create({
      data: {
        name: 'Daniel (Dani) Kebede',
        role: 'Powertrain Performance & Mechanical Director',
        specialization: 'Turbo Systems, DPF Chemical Flush, Engine Mechanical Timing',
        experience: '7 years',
        certifications: ['OEM German Powertrain Certified', 'DPF & Turbo Specialist', 'Transmission Fluid Tech'],
        bio: 'Co-founder with deep passion for engine dynamics, forced induction, and precision preventative maintenance.',
        isActive: true
      }
    }),
    prisma.mechanic.create({
      data: {
        name: 'Dawit Mengistu',
        role: 'Immobilizer & Smart Key Security Specialist',
        specialization: 'Push-to-Start Fobs, All-Keys-Lost Emergency, CAS4 / FEM BMW',
        experience: '4 years',
        certifications: ['Autel IM608 Advanced Immobilizer', 'VVDI Key Programmer Certified', 'Locksmith L2'],
        bio: 'Dedicated immobilizer and automotive cryptography expert. Rapid turnaround on all-keys-lost scenarios.',
        isActive: true
      }
    })
  ])
  console.log(`✅ Created ${mechanics.length} mechanics`)

  // Create Reviews
  console.log('⭐ Creating reviews...')
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        customer: 'Yared Hailu',
        email: 'yared.h@gmail.com',
        rating: 5,
        reviewText: 'They found the electrical communication fault in my Mercedes when two other prominent garages spent two weeks guessing. Miki solved it in 3 hours. True masterminds!',
        isPinned: true,
        status: 'APPROVED',
        mechanicId: mechanics[1].id
      }
    }),
    prisma.review.create({
      data: {
        customer: 'Dr. Selamawit Tadesse',
        email: 'selamawit.t@outlook.com',
        rating: 5,
        reviewText: 'Stage 1 ECU tuning done by Abel made the Prado feel like a completely different car. Overtaking is effortless now and fuel mileage actually went up.',
        isPinned: true,
        status: 'APPROVED',
        mechanicId: mechanics[0].id
      }
    }),
    prisma.review.create({
      data: {
        customer: 'Ermias Berhanu',
        phone: '+251 911 234 567',
        rating: 5,
        reviewText: 'Lost all keys while traveling. Dawit came out with the programmer, cut a new blade on site, and programmed two smart proximity keys in under 45 minutes.',
        isPinned: true,
        status: 'APPROVED',
        mechanicId: mechanics[3].id
      }
    })
  ])
  console.log(`✅ Created ${reviews.length} reviews`)

  // Create Bank Accounts
  console.log('🏦 Creating bank accounts...')
  const bankAccounts = await Promise.all([
    prisma.bankAccount.create({
      data: {
        bankName: 'Telebirr',
        accountName: 'Dani & Miki Auto Solution',
        accountNumber: '251911234567',
        isActive: true
      }
    }),
    prisma.bankAccount.create({
      data: {
        bankName: 'Commercial Bank of Ethiopia (CBE)',
        accountName: 'Dani & Miki Auto Solution',
        accountNumber: '1000123456789',
        isActive: true
      }
    }),
    prisma.bankAccount.create({
      data: {
        bankName: 'Awash Bank',
        accountName: 'Dani & Miki Auto Solution',
        accountNumber: '0123456789012',
        isActive: true
      }
    })
  ])
  console.log(`✅ Created ${bankAccounts.length} bank accounts`)

  // Create Business Hours (Monday - Saturday, 8AM - 6PM)
  console.log('🕐 Creating business hours...')
  const businessHours = await Promise.all([
    prisma.businessHour.create({ data: { dayOfWeek: 1, openTime: '08:00', closeTime: '18:00', isClosed: false } }), // Monday
    prisma.businessHour.create({ data: { dayOfWeek: 2, openTime: '08:00', closeTime: '18:00', isClosed: false } }), // Tuesday
    prisma.businessHour.create({ data: { dayOfWeek: 3, openTime: '08:00', closeTime: '18:00', isClosed: false } }), // Wednesday
    prisma.businessHour.create({ data: { dayOfWeek: 4, openTime: '08:00', closeTime: '18:00', isClosed: false } }), // Thursday
    prisma.businessHour.create({ data: { dayOfWeek: 5, openTime: '08:00', closeTime: '18:00', isClosed: false } }), // Friday
    prisma.businessHour.create({ data: { dayOfWeek: 6, openTime: '08:00', closeTime: '14:00', isClosed: false } }), // Saturday
    prisma.businessHour.create({ data: { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true } })  // Sunday
  ])
  console.log(`✅ Created ${businessHours.length} business hours`)

  // Create Break Hours
  console.log('🍽️ Creating break hours...')
  await prisma.breakHour.create({
    data: {
      name: 'Lunch Break',
      startTime: '12:00',
      endTime: '13:00'
    }
  })
  console.log('✅ Created break hours')

  // Create Branch
  console.log('🏢 Creating branch...')
  const branch = await prisma.branch.create({
    data: {
      name: 'Main Branch - Bole, Addis Ababa',
      address: 'Bole Road, Near Edna Mall, Addis Ababa, Ethiopia',
      mapUrl: 'https://maps.google.com/?q=Bole+Addis+Ababa',
      isActive: true
    }
  })
  console.log('✅ Created branch')

  // Create Social Links
  console.log('🔗 Creating social links...')
  const socialLinks = await Promise.all([
    prisma.socialLink.create({
      data: {
        platform: 'Facebook',
        url: 'https://facebook.com/danimikiauto',
        isActive: true
      }
    }),
    prisma.socialLink.create({
      data: {
        platform: 'Instagram',
        url: 'https://instagram.com/danimikiauto',
        isActive: true
      }
    }),
    prisma.socialLink.create({
      data: {
        platform: 'Telegram',
        url: 'https://t.me/danimikiauto',
        isActive: true
      }
    })
  ])
  console.log(`✅ Created ${socialLinks.length} social links`)

  // Create Site Settings
  console.log('⚙️ Creating site settings...')
  await Promise.all([
    prisma.siteSetting.create({
      data: {
        key: 'deposit_type',
        value: 'fixed',
        description: 'Deposit type: fixed or percentage'
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'deposit_amount',
        value: '200',
        description: 'Default deposit amount in ETB'
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'max_booking_days',
        value: '30',
        description: 'Maximum days in advance for booking'
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'garage_name',
        value: 'Dani & Miki Auto Solution',
        description: 'Garage business name'
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'garage_tagline',
        value: 'Precision Automotive Diagnostics & Performance',
        description: 'Garage tagline'
      }
    })
  ])
  console.log('✅ Created site settings')

  // Create Website Content
  console.log('📝 Creating website content...')
  const servicesShowcaseData = [
    {
      id: 'svc-01', numberCode: '01', title: 'Computer Diagnostics',
      tagline: 'Deep Level Electronic Telemetry & Fault Isolation',
      description: 'Dealer-level OEM diagnostic scanning across all vehicle control modules. We interrogate engine, transmission, ABS, airbag, body control, and CAN-bus networks to extract real-time live sensor data and hidden trouble codes with pinpoint precision.',
      features: ['Full CAN-bus network topology scan','Real-time live freeze-frame data logging','Actuator testing & bi-directional component activation','OEM dealer software for BMW, Mercedes, Toyota, VAG, Land Rover'],
      image: 'https://flojmgyiopjuesgpqpup.supabase.co/storage/v1/object/public/website/defaults/computer_diagnosis.jpeg',
      turnaround: '45 - 90 Minutes', accuracyRate: '99.8% Fault Pinpoint',
      equipmentUsed: 'Autel MaxiSys Ultra, Bosch KTS, Launch X431 PAD VII', category: 'Diagnostics',
    },
    {
      id: 'svc-02', numberCode: '02', title: 'ECU Programming',
      tagline: 'Custom Chip Tuning, Module Flashing & Software Calibration',
      description: 'Precision flash reprogramming and EEPROM calibration for Engine Control Units (ECU) and Transmission Control Modules (TCU). We perform Stage 1/2 performance tuning, software updates, checksum corrections, and module cloning without hardware damage.',
      features: ['Stage 1 & Stage 2 custom map development','ECU cloning & bench-mode EEPROM recovery','Speed limiter removal & throttle map sharpening','Transmission TCU shift speed & torque limit optimization'],
      image: 'https://flojmgyiopjuesgpqpup.supabase.co/storage/v1/object/public/website/defaults/service-ecu.jpg',
      turnaround: '2 - 4 Hours', accuracyRate: '100% Dyno Verified',
      equipmentUsed: 'Alientech KESS3, Autotuner, WinOLS 5, CMD Flash', category: 'Performance',
    },
    {
      id: 'svc-03', numberCode: '03', title: 'Automotive Electrical',
      tagline: 'Complex Harness Diagnostics & Micro-Soldering Repairs',
      description: 'Comprehensive troubleshooting of complex automotive electrical faults, intermittent parasitic battery drains, burnt wiring looms, alternator/starter systems, sensor failures, and circuit board level repair on immobilizers, BCMs, and fuse blocks.',
      features: ['Parasitic milliamp battery draw isolation','Oscilloscope waveform analysis on sensors & actuators','Wire harness repair & OEM waterproof pinning','BCM, SAM & fuse box micro-soldering component restoration'],
      image: 'https://flojmgyiopjuesgpqpup.supabase.co/storage/v1/object/public/website/defaults/automotive_electrical.jpeg',
      turnaround: 'Same Day / 24 Hours', accuracyRate: '100% Signal Integrity',
      equipmentUsed: 'PicoScope 4425A 4-Channel Automotive Oscilloscope, Thermal Cam', category: 'Electrical',
    },
    {
      id: 'svc-04', numberCode: '04', title: 'Key Programming',
      tagline: 'Smart Key Generation, Transponder Cloning & All Keys Lost',
      description: 'State-of-the-art immobilizer and key programming for modern proximity push-to-start fobs, European encrypted transponders, remote folding keys, and complete emergency key creation when all keys are lost.',
      features: ['Proximity smart key & push-button fob programming','All-Keys-Lost CAS4/FEM/BDC BMW & FBS4 Mercedes support','Toyota/Lexus H-Chip & G-Chip smart key coding','Keyless-Go & comfort access synchronization'],
      image: 'https://flojmgyiopjuesgpqpup.supabase.co/storage/v1/object/public/website/defaults/service-keys.jpg',
      turnaround: '30 - 60 Minutes', accuracyRate: '100% OEM Sync Guarantee',
      equipmentUsed: 'Autel MaxiIM IM608 Pro II, VVDI Key Tool Plus, OBDSTAR Key Master', category: 'Security',
    },
    {
      id: 'svc-05', numberCode: '05', title: 'DPF Service',
      tagline: 'Diesel Particulate Filter Regeneration, Cleaning & Calibration',
      description: 'Restoring clogged diesel particulate filters to 98% factory flow rate. We execute dynamic forced regenerations, pressurized chemical soot dissolution, differential pressure sensor calibrations, and EGR system soot elimination.',
      features: ['Chemical hydrostatic ultrasonic soot & ash flush','Active computer-forced high-temperature regeneration','Differential pressure sensor re-initialization','EGR valve carbon decoking & reset'],
      image: 'https://flojmgyiopjuesgpqpup.supabase.co/storage/v1/object/public/website/defaults/service-dpf.jpg',
      turnaround: '2 - 3 Hours', accuracyRate: '98% Backpressure Reduction',
      equipmentUsed: 'Pneumatic DPF Flush Rig, OEM Diagnostic Command Tools', category: 'Diesel',
    },
    {
      id: 'svc-06', numberCode: '06', title: 'Vehicle Maintenance',
      tagline: 'Precision Mechanical Service & Scheduled Inspections',
      description: 'Meticulous preventative maintenance performed according to manufacturer engineering standards. Premium synthetic lubricants, OEM filtration, timing system checks, brake system bleeding, and comprehensive 50-point diagnostic health validation.',
      features: ['Full OEM specification synthetic oil & filter change','Brake fluid moisture testing & electronic pressure bleeding','Suspension geometry & bushing torque spec inspection','Multi-point digital inspection report with photo documentation'],
      image: 'https://flojmgyiopjuesgpqpup.supabase.co/storage/v1/object/public/website/defaults/service-maintenance.jpg',
      turnaround: '1.5 - 3 Hours', accuracyRate: 'OEM Factory Spec Guarantee',
      equipmentUsed: 'Snap-on Digital Torque Wrenches, Fluid Analysis Kit', category: 'Mechanical',
    },
  ]

  await Promise.all([
    prisma.websiteContent.create({
      data: {
        section: 'home_hero',
        title: 'Precision Automotive Diagnostics',
        subtitle: 'Advanced Computer Telemetry & ECU Calibration',
        description: 'Ethiopia\'s premier destination for dealer-level automotive diagnostics, ECU programming, and precision electrical repairs.',
        ctaText: 'Book Appointment',
        imageUrl: 'https://flojmgyiopjuesgpqpup.supabase.co/storage/v1/object/public/website/defaults/dm_wallpaper2.jpg'
      }
    }),
    prisma.websiteContent.create({
      data: {
        section: 'about_us',
        title: 'About Dani & Miki',
        subtitle: 'Masters of Automotive Precision',
        description: 'Founded by automotive engineering specialists with passion for precision diagnostics and performance optimization.',
        ctaText: 'Learn More'
      }
    }),
    prisma.websiteContent.create({
      data: {
        section: 'services_showcase',
        title: 'CORE SOLUTIONS',
        subtitle: 'SPECIALIZED WORKSHOP DISCIPLINES',
        description: JSON.stringify(servicesShowcaseData),
        ctaText: 'BOOK THIS SERVICE',
      }
    }),
  ])
  console.log('✅ Created website content')

  // Create FAQ
  console.log('❓ Creating FAQ...')
  await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'What types of vehicles do you service?',
        answer: 'We specialize in German (BMW, Mercedes, Audi, VW), Japanese (Toyota, Lexus, Honda), and American vehicles. Our diagnostic tools cover most modern vehicles.',
        order: 1,
        isActive: true
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'How long does a diagnostic scan take?',
        answer: 'A comprehensive diagnostic scan typically takes 45-90 minutes depending on the vehicle and the issues being investigated.',
        order: 2,
        isActive: true
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'Do you offer warranty on your services?',
        answer: 'Yes, we offer warranty on all our services. The warranty period varies depending on the type of service performed.',
        order: 3,
        isActive: true
      }
    })
  ])
  console.log('✅ Created FAQ')

  // Create Time Classifications
  console.log('🕐 Creating time classifications...')
  await Promise.all([
    prisma.timeClassification.create({
      data: {
        label: 'Morning',
        ranges: JSON.stringify([
          { start: '08:30', end: '10:30', label: '8:30 AM – 10:30 AM' },
          { start: '10:35', end: '12:00', label: '10:35 AM – 12:00 PM' },
        ]),
        description: '8:30 AM – 10:30 AM, 10:35 AM – 12:00 PM',
        icon: 'Sun',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10 border-yellow-500/20',
        order: 0,
        isActive: true,
        bookingLimit: 5
      }
    }),
    prisma.timeClassification.create({
      data: {
        label: 'Afternoon',
        ranges: JSON.stringify([
          { start: '14:00', end: '15:30', label: '2:00 PM – 3:30 PM' },
          { start: '15:35', end: '17:00', label: '3:35 PM – 5:00 PM' },
        ]),
        description: '2:00 PM – 3:30 PM, 3:35 PM – 5:00 PM',
        icon: 'Sunset',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10 border-orange-500/20',
        order: 1,
        isActive: true,
        bookingLimit: 5
      }
    })
  ])
  console.log('✅ Created time classifications')

  console.log('🎉 Database seed completed successfully!')
  console.log('')
  console.log('📋 Login credentials:')
  console.log('   Email: admin@danimiki.com')
  console.log('   Password: admin123')
  console.log('')
  console.log('⚠️  Please change the admin password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })