import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

const services = [
  {
    id: 'svc-01', numberCode: '01', title: 'Computer Diagnostics',
    tagline: 'Deep Level Electronic Telemetry & Fault Isolation',
    description: 'Dealer-level OEM diagnostic scanning across all vehicle control modules. We interrogate engine, transmission, ABS, airbag, body control, and CAN-bus networks to extract real-time live sensor data and hidden trouble codes with pinpoint precision.',
    features: ['Full CAN-bus network topology scan','Real-time live freeze-frame data logging','Actuator testing & bi-directional component activation','OEM dealer software for BMW, Mercedes, Toyota, VAG, Land Rover'],
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85',
    turnaround: '45 - 90 Minutes', accuracyRate: '99.8% Fault Pinpoint',
    equipmentUsed: 'Autel MaxiSys Ultra, Bosch KTS, Launch X431 PAD VII', category: 'Diagnostics',
  },
  {
    id: 'svc-02', numberCode: '02', title: 'ECU Programming',
    tagline: 'Custom Chip Tuning, Module Flashing & Software Calibration',
    description: 'Precision flash reprogramming and EEPROM calibration for Engine Control Units (ECU) and Transmission Control Modules (TCU). We perform Stage 1/2 performance tuning, software updates, checksum corrections, and module cloning without hardware damage.',
    features: ['Stage 1 & Stage 2 custom map development','ECU cloning & bench-mode EEPROM recovery','Speed limiter removal & throttle map sharpening','Transmission TCU shift speed & torque limit optimization'],
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    turnaround: '2 - 4 Hours', accuracyRate: '100% Dyno Verified',
    equipmentUsed: 'Alientech KESS3, Autotuner, WinOLS 5, CMD Flash', category: 'Performance',
  },
  {
    id: 'svc-03', numberCode: '03', title: 'Automotive Electrical',
    tagline: 'Complex Harness Diagnostics & Micro-Soldering Repairs',
    description: 'Comprehensive troubleshooting of complex automotive electrical faults, intermittent parasitic battery drains, burnt wiring looms, alternator/starter systems, sensor failures, and circuit board level repair on immobilizers, BCMs, and fuse blocks.',
    features: ['Parasitic milliamp battery draw isolation','Oscilloscope waveform analysis on sensors & actuators','Wire harness repair & OEM waterproof pinning','BCM, SAM & fuse box micro-soldering component restoration'],
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1600&q=85',
    turnaround: 'Same Day / 24 Hours', accuracyRate: '100% Signal Integrity',
    equipmentUsed: 'PicoScope 4425A 4-Channel Automotive Oscilloscope, Thermal Cam', category: 'Electrical',
  },
  {
    id: 'svc-04', numberCode: '04', title: 'Key Programming',
    tagline: 'Smart Key Generation, Transponder Cloning & All Keys Lost',
    description: 'State-of-the-art immobilizer and key programming for modern proximity push-to-start fobs, European encrypted transponders, remote folding keys, and complete emergency key creation when all keys are lost.',
    features: ['Proximity smart key & push-button fob programming','All-Keys-Lost CAS4/FEM/BDC BMW & FBS4 Mercedes support','Toyota/Lexus H-Chip & G-Chip smart key coding','Keyless-Go & comfort access synchronization'],
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85',
    turnaround: '30 - 60 Minutes', accuracyRate: '100% OEM Sync Guarantee',
    equipmentUsed: 'Autel MaxiIM IM608 Pro II, VVDI Key Tool Plus, OBDSTAR Key Master', category: 'Security',
  },
  {
    id: 'svc-05', numberCode: '05', title: 'DPF Service',
    tagline: 'Diesel Particulate Filter Regeneration, Cleaning & Calibration',
    description: 'Restoring clogged diesel particulate filters to 98% factory flow rate. We execute dynamic forced regenerations, pressurized chemical soot dissolution, differential pressure sensor calibrations, and EGR system soot elimination.',
    features: ['Chemical hydrostatic ultrasonic soot & ash flush','Active computer-forced high-temperature regeneration','Differential pressure sensor re-initialization','EGR valve carbon decoking & reset'],
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1600&q=85',
    turnaround: '2 - 3 Hours', accuracyRate: '98% Backpressure Reduction',
    equipmentUsed: 'Pneumatic DPF Flush Rig, OEM Diagnostic Command Tools', category: 'Diesel',
  },
  {
    id: 'svc-06', numberCode: '06', title: 'Vehicle Maintenance',
    tagline: 'Precision Mechanical Service & Scheduled Inspections',
    description: 'Meticulous preventative maintenance performed according to manufacturer engineering standards. Premium synthetic lubricants, OEM filtration, timing system checks, brake system bleeding, and comprehensive 50-point diagnostic health validation.',
    features: ['Full OEM specification synthetic oil & filter change','Brake fluid moisture testing & electronic pressure bleeding','Suspension geometry & bushing torque spec inspection','Multi-point digital inspection report with photo documentation'],
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=85',
    turnaround: '1.5 - 3 Hours', accuracyRate: 'OEM Factory Spec Guarantee',
    equipmentUsed: 'Snap-on Digital Torque Wrenches, Fluid Analysis Kit', category: 'Mechanical',
  },
]

async function main() {
  await prisma.websiteContent.upsert({
    where: { section: 'services_showcase' },
    update: {
      title: 'CORE SOLUTIONS',
      subtitle: 'SPECIALIZED WORKSHOP DISCIPLINES',
      description: JSON.stringify(services),
      ctaText: 'BOOK THIS SERVICE',
    },
    create: {
      section: 'services_showcase',
      title: 'CORE SOLUTIONS',
      subtitle: 'SPECIALIZED WORKSHOP DISCIPLINES',
      description: JSON.stringify(services),
      ctaText: 'BOOK THIS SERVICE',
    },
  })
  console.log('✅ Services content seeded!')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
