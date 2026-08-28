import { ServiceItem, Mechanic, Review, ServicePackage, DiagnosticDTC, DiagnosticSensor, Booking } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'computer-diagnostics',
    numberCode: '01',
    title: 'Computer Diagnostics',
    tagline: 'Deep Level Electronic Telemetry & Fault Isolation',
    description: 'Dealer-level OEM diagnostic scanning across all vehicle control modules. We interrogate engine, transmission, ABS, airbag, body control, and CAN-bus networks to extract real-time live sensor data and hidden trouble codes with pinpoint precision.',
    features: [
      'Full CAN-bus network topology scan',
      'Real-time live freeze-frame data logging',
      'Actuator testing & bi-directional component activation',
      'OEM dealer software for BMW, Mercedes, Toyota, VAG, Land Rover'
    ],
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85',
    techDetails: {
      protocols: ['ISO 15765-4 (CAN)', 'KWP2000', 'DoIP / Ethernet', 'UDS'],
      turnaround: '45 - 90 Minutes',
      accuracyRate: '99.8% Fault Pinpoint',
      equipmentUsed: 'Autel MaxiSys Ultra, Bosch KTS, Launch X431 PAD VII'
    },
    category: 'Diagnostics'
  },
  {
    id: 'ecu-programming',
    numberCode: '02',
    title: 'ECU Programming',
    tagline: 'Custom Chip Tuning, Module Flashing & Software Calibration',
    description: 'Precision flash reprogramming and EEPROM calibration for Engine Control Units (ECU) and Transmission Control Modules (TCU). We perform Stage 1/2 performance tuning, software updates, checksum corrections, and module cloning without hardware damage.',
    features: [
      'Stage 1 & Stage 2 custom map development',
      'ECU cloning & bench-mode EEPROM recovery',
      'Speed limiter removal & throttle map sharpening',
      'Transmission TCU shift speed & torque limit optimization'
    ],
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    techDetails: {
      protocols: ['OBD2 Flash', 'Bench TriCore Boot', 'BDM / JTAG', 'Flex Magic'],
      turnaround: '2 - 4 Hours',
      accuracyRate: '100% Dyno Verified',
      equipmentUsed: 'Alientech KESS3, Autotuner, WinOLS 5, CMD Flash'
    },
    category: 'Performance'
  },
  {
    id: 'automotive-electrical',
    numberCode: '03',
    title: 'Automotive Electrical & Electronic',
    tagline: 'Complex Harness Diagnostics & Micro-Soldering Repairs',
    description: 'Comprehensive troubleshooting of complex automotive electrical faults, intermittent parasitic battery drains, burnt wiring looms, alternator/starter systems, sensor failures, and circuit board level repair on immobilizers, BCMs, and fuse blocks.',
    features: [
      'Parasitic milliamp battery draw isolation',
      'Oscilloscope waveform analysis on sensors & actuators',
      'Wire harness repair & OEM waterproof pinning',
      'BCM, SAM & fuse box micro-soldering component restoration'
    ],
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1600&q=85',
    techDetails: {
      protocols: ['LIN Bus', 'CAN High/Low', 'FlexRay', 'PWM Analysis'],
      turnaround: 'Same Day / 24 Hours',
      accuracyRate: '100% Signal Integrity',
      equipmentUsed: 'PicoScope 4425A 4-Channel Automotive Oscilloscope, Thermal Cam'
    },
    category: 'Electrical'
  },
  {
    id: 'key-programming',
    numberCode: '04',
    title: 'Key Programming',
    tagline: 'Smart Key Generation, Transponder Cloning & All Keys Lost',
    description: 'State-of-the-art immobilizer and key programming for modern proximity push-to-start fobs, European encrypted transponders, remote folding keys, and complete emergency key creation when all keys are lost.',
    features: [
      'Proximity smart key & push-button fob programming',
      'All-Keys-Lost CAS4/FEM/BDC BMW & FBS4 Mercedes support',
      'Toyota/Lexus H-Chip & G-Chip smart key coding',
      'Keyless-Go & comfort access synchronization'
    ],
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85',
    techDetails: {
      protocols: ['RFID 125kHz / 134.2kHz', 'Hitag-Pro', 'Megamos Crypto', 'DST-AES'],
      turnaround: '30 - 60 Minutes',
      accuracyRate: '100% OEM Sync Guarantee',
      equipmentUsed: 'Autel MaxiIM IM608 Pro II, VVDI Key Tool Plus, OBDSTAR Key Master'
    },
    category: 'Security'
  },
  {
    id: 'dpf-service',
    numberCode: '05',
    title: 'DPF Service',
    tagline: 'Diesel Particulate Filter Regeneration, Cleaning & Calibration',
    description: 'Restoring clogged diesel particulate filters to 98% factory flow rate. We execute dynamic forced regenerations, pressurized chemical soot dissolution, differential pressure sensor calibrations, and EGR system soot elimination to regain engine power and fuel efficiency.',
    features: [
      'Chemical hydrostatic ultrasonic soot & ash flush',
      'Active computer-forced high-temperature regeneration',
      'Differential pressure sensor re-initialization',
      'EGR valve carbon decoking & reset'
    ],
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1600&q=85',
    techDetails: {
      protocols: ['DPF Dynamic Regen Mode', 'Differential Pressure Delta-P Log'],
      turnaround: '2 - 3 Hours',
      accuracyRate: '98% Backpressure Reduction',
      equipmentUsed: 'Pneumatic DPF Flush Rig, OEM Diagnostic Command Tools'
    },
    category: 'Diesel'
  },
  {
    id: 'vehicle-maintenance',
    numberCode: '06',
    title: 'Vehicle Maintenance',
    tagline: 'Precision Mechanical Service & Scheduled Inspections',
    description: 'Meticulous preventative maintenance performed according to manufacturer engineering standards. Premium synthetic lubricants, OEM filtration, timing system checks, brake system bleeding, and comprehensive 50-point diagnostic health validation.',
    features: [
      'Full OEM specification synthetic oil & filter change',
      'Brake fluid moisture testing & electronic pressure bleeding',
      'Suspension geometry & bushing torque spec inspection',
      'Multi-point digital inspection report with photo documentation'
    ],
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=85',
    techDetails: {
      protocols: ['50-Point Digital Vehicle Health Checklist', 'Torque Angle Verification'],
      turnaround: '1.5 - 3 Hours',
      accuracyRate: 'OEM Factory Spec Guarantee',
      equipmentUsed: 'Snap-on Digital Torque Wrenches, Fluid Analysis Kit'
    },
    category: 'Mechanical'
  }
];

export const INITIAL_MECHANICS: Mechanic[] = [
  {
    id: 'abel',
    name: 'Abel Tesfaye',
    role: 'Lead ECU Calibration & Diagnostic Engineer',
    rating: 4.9,
    experienceYears: 5,
    certifications: ['Autel Certified Master Diagnostic', 'WinOLS ECU Map Specialist', 'Bosch Common Rail Tech'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Specialist in deep-level ECU hex mapping, engine fault isolation, and high-performance powertrain optimization with hundreds of European & Japanese tuning projects completed.',
    specialties: ['ECU Remapping', 'BMW / Mercedes CAN-Bus', 'OBD-II Telemetry', 'Fault Isolation'],
    isAvailable: true,
    completedJobs: 640
  },
  {
    id: 'miki',
    name: 'Michael (Miki) Assefa',
    role: 'Master Automotive Electrical & Systems Architect',
    rating: 5.0,
    experienceYears: 8,
    certifications: ['ASE Master Electronic Certified', 'PicoScope 4-Channel Master', 'Hybrid/EV Safety L3'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Founder and electrical systems mastermind. Known for unraveling complex phantom wiring shorts and reviving water-damaged control modules other garages deemed irrecoverable.',
    specialties: ['Micro-Soldering', 'Complex Wiring Harnesses', 'Body Control Modules', 'Oscilloscope Waveforms'],
    isAvailable: true,
    completedJobs: 1120
  },
  {
    id: 'dani',
    name: 'Daniel (Dani) Kebede',
    role: 'Powertrain Performance & Mechanical Director',
    rating: 4.9,
    experienceYears: 7,
    certifications: ['OEM German Powertrain Certified', 'DPF & Turbo Specialist', 'Transmission Fluid Tech'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'Co-founder with deep passion for engine dynamics, forced induction, and precision preventative maintenance. Dedicated to achieving peak automotive reliability and smooth engine performance.',
    specialties: ['Turbo Systems', 'DPF Chemical Flush', 'Engine Mechanical Timing', 'German Performance'],
    isAvailable: true,
    completedJobs: 980
  },
  {
    id: 'dawit',
    name: 'Dawit Mengistu',
    role: 'Immobilizer & Smart Key Security Specialist',
    rating: 4.8,
    experienceYears: 4,
    certifications: ['Autel IM608 Advanced Immobilizer', 'VVDI Key Programmer Certified', 'Locksmith L2'],
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    bio: 'Dedicated immobilizer and automotive cryptography expert. Rapid turnaround on all-keys-lost scenarios, BMW FEM/BDC programming, and proximity fob coding.',
    specialties: ['Push-to-Start Fobs', 'All-Keys-Lost Emergency', 'CAS4 / FEM BMW', 'Toyota Smart Keys'],
    isAvailable: true,
    completedJobs: 510
  }
];

export const INITIAL_PACKAGES: ServicePackage[] = [
  {
    id: 'pkg-diag-pro',
    name: 'Comprehensive OEM Diagnostic Health Scan',
    badge: 'Most Popular',
    priceEtb: 1500,
    depositEtb: 200,
    duration: '45 - 60 Min',
    description: 'Complete electronic inspection of all vehicle onboard controllers with full printed/digital telemetry report and fault isolation roadmap.',
    features: [
      'All-System Full Module DTC Scanning (Engine, Transmission, ABS, SRS, BCM)',
      'Live Sensor Data Stream Recording & Freeze-Frame Analysis',
      'Actuator Bi-Directional Functional Testing',
      'Battery, Alternator & Starter Charging Load Test',
      'Clear False Codes & Professional Technician Consultation'
    ],
    isPopular: true,
    targetIssue: 'Check Engine Light, ABS Light, Irregular Performance, Pre-Purchase Inspection'
  },
  {
    id: 'pkg-ecu-stage1',
    name: 'Stage 1 ECU Performance & Fuel Optimization',
    badge: 'Performance',
    priceEtb: 12500,
    depositEtb: 200,
    duration: '2 - 3 Hours',
    description: 'Custom tailored software calibration to unlock +15-30% horsepower and torque while improving throttle responsiveness and fuel efficiency.',
    features: [
      'Custom WinOLS Map tailored to your exact engine serial & fuel grade',
      'Pre-tune & Post-tune Diagnostic Telemetry Validation',
      'Speed Governor Removal & Rev Limiter Fine Adjustment',
      '100% Original Stock Backup Saved to Cloud for Lifetime Return',
      'Smoother Power Delivery & Eliminated Turbo Lag'
    ],
    isPopular: false,
    targetIssue: 'Sluggish Acceleration, High Fuel Consumption, Throttle Delay'
  },
  {
    id: 'pkg-electrical-overhaul',
    name: 'Advanced Auto-Electrical & Wiring Diagnostics',
    badge: 'Specialist',
    priceEtb: 3500,
    depositEtb: 200,
    duration: '2 - 4 Hours',
    description: 'Deep level signal tracing with 4-channel PicoScope oscilloscope to eliminate mysterious battery drains, short circuits, and intermittent faults.',
    features: [
      'Parasitic Battery Drain Current Leakage Isolation (Milliamp precision)',
      'CAN-bus High/Low signal integrity oscilloscope capture',
      'Sensor ground & power reference voltage verification',
      'Micro-soldering inspection of fuse box and relays',
      'Comprehensive wiring repair plan with quote'
    ],
    isPopular: false,
    targetIssue: 'Dead Battery Overnight, Blown Fuses, Flickering Lights, Instrument Cluster Errors'
  },
  {
    id: 'pkg-smart-key',
    name: 'Smart Key & Immobilizer Programming',
    badge: 'Security',
    priceEtb: 4500,
    depositEtb: 200,
    duration: '30 - 45 Min',
    description: 'OEM-grade key fob programming, proximity keyless-go pairing, and security anti-theft immobilizer synchronization.',
    features: [
      'High-grade OEM or aftermarket smart key fob supplied',
      'Transponder chip crypto-pairing with anti-theft ECU',
      'Keyless-Go proximity door lock/unlock calibration',
      'Emergency mechanical key blade laser precision cutting',
      'Old/lost keys deleted from vehicle memory for anti-theft security'
    ],
    isPopular: false,
    targetIssue: 'Lost Keys, Need Spare Key, Smart Fob Not Detected, Immobilizer Lockout'
  },
  {
    id: 'pkg-dpf-clean',
    name: 'DPF Ultrasonic Clean & Forced Regeneration',
    badge: 'Diesel Power',
    priceEtb: 7000,
    depositEtb: 200,
    duration: '2 - 3 Hours',
    description: 'Restore clogged diesel exhaust particulate filter flow rate without expensive component replacement.',
    features: [
      'Chemical soot dissolution and pressurized flush',
      'Computer-commanded active dynamic high-temperature regeneration',
      'Differential pressure sensor zero-offset calibration',
      'EGR system carbon check and live backpressure measurement',
      'Restores lost horsepower and clears limp-home mode'
    ],
    isPopular: false,
    targetIssue: 'DPF Warning Light, Limp Mode, Black Smoke, Loss of Diesel Power'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Yared Hailu',
    location: 'Bole, Addis Ababa',
    carModel: 'Mercedes-Benz C300 (W205)',
    rating: 5,
    text: 'They found the electrical communication fault in my Mercedes when two other prominent garages spent two weeks guessing and wanted to change the entire ECU. Miki solved it in 3 hours. True masterminds!',
    serviceType: 'Automotive Electrical & Electronic',
    date: '2 weeks ago',
    isPinned: true,
    mechanicName: 'Miki Assefa'
  },
  {
    id: 'rev-2',
    author: 'Dr. Selamawit Tadesse',
    location: 'CMC, Addis Ababa',
    carModel: 'Toyota Land Cruiser V8 Prado',
    rating: 5,
    text: 'Stage 1 ECU tuning done by Abel made the Prado feel like a completely different car. Overtaking on the motorway is effortless now and fuel mileage actually went up by 1.2 km/L. Exceptional precision.',
    serviceType: 'ECU Programming',
    date: '1 month ago',
    isPinned: true,
    mechanicName: 'Abel Tesfaye'
  },
  {
    id: 'rev-3',
    author: 'Ermias Berhanu',
    location: 'Kazanchis, Addis Ababa',
    carModel: 'BMW 530i M Sport',
    rating: 5,
    text: 'Lost all keys while traveling. Dawit came out with the programmer, cut a new blade on site, and programmed two smart proximity keys in under 45 minutes. Super professional service.',
    serviceType: 'Key Programming',
    date: '3 weeks ago',
    isPinned: true,
    mechanicName: 'Dawit Mengistu'
  },
  {
    id: 'rev-4',
    author: 'Kassahun Bekele',
    location: 'Sarbet, Addis Ababa',
    carModel: 'Hyundai Tucson 2.0 CRDi Diesel',
    rating: 5,
    text: 'My Tucson was stuck in limp mode due to DPF soot blockage. Dani did the chemical cleaning and forced regen. Engine runs like brand new with zero smoke. Saved me over 45,000 ETB in replacement parts.',
    serviceType: 'DPF Service',
    date: 'Last month',
    isPinned: false,
    mechanicName: 'Dani Kebede'
  },
  {
    id: 'rev-5',
    author: 'Natnael Girma',
    location: 'Old Airport, Addis Ababa',
    carModel: 'Volkswagen Golf 7 GTI',
    rating: 5,
    text: 'Best diagnostic team in Ethiopia, period. The diagnostic scanner HUD they use and the transparent explanation of every trouble code gives you complete peace of mind. 10/10 recommend.',
    serviceType: 'Computer Diagnostics',
    date: '2 months ago',
    isPinned: false,
    mechanicName: 'Abel Tesfaye'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-94821',
    customerName: 'Abebe Kebede',
    phone: '+251 911 234 567',
    email: 'abebe.k@gmail.com',
    vehicleMake: 'Toyota',
    vehicleModel: 'Land Cruiser Prado',
    vehicleYear: '2021',
    plateNumber: 'AA 3-B49201',
    serviceId: 'pkg-diag-pro',
    serviceTitle: 'Comprehensive OEM Diagnostic Health Scan',
    preferredDate: '2026-08-24',
    preferredTime: '10:00 AM',
    notes: 'Intermittent check engine light when accelerating uphill.',
    depositAmount: 200,
    paymentMethod: 'Telebirr',
    paymentRefNumber: 'TEL-849201849',
    status: 'confirmed',
    createdAt: '2026-08-20T14:30:00Z',
    assignedMechanicId: 'abel'
  },
  {
    id: 'BK-94822',
    customerName: 'Sara Wolde',
    phone: '+251 922 987 654',
    email: 'sara.w@outlook.com',
    vehicleMake: 'Mercedes-Benz',
    vehicleModel: 'E300',
    vehicleYear: '2019',
    plateNumber: 'AA 2-C81023',
    serviceId: 'pkg-smart-key',
    serviceTitle: 'Smart Key & Immobilizer Programming',
    preferredDate: '2026-08-25',
    preferredTime: '02:30 PM',
    notes: 'Need one additional spare key fob programmed.',
    depositAmount: 200,
    paymentMethod: 'CBE',
    paymentRefNumber: 'CBE-99482019',
    status: 'pending_verification',
    createdAt: '2026-08-21T09:15:00Z',
    assignedMechanicId: 'dawit'
  },
  {
    id: 'BK-94823',
    customerName: 'Yonas Teshome',
    phone: '+251 933 456 789',
    email: 'yonas.t@yahoo.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5 xDrive40i',
    vehicleYear: '2020',
    plateNumber: 'AA 3-A11928',
    serviceId: 'pkg-ecu-stage1',
    serviceTitle: 'Stage 1 ECU Performance & Fuel Optimization',
    preferredDate: '2026-08-26',
    preferredTime: '11:00 AM',
    notes: 'Looking for smoother low-end torque and throttle sharpness.',
    depositAmount: 200,
    paymentMethod: 'Telebirr',
    paymentRefNumber: 'TEL-102938475',
    status: 'in_progress',
    createdAt: '2026-08-19T11:00:00Z',
    assignedMechanicId: 'abel'
  }
];

export const INITIAL_DIAGNOSTIC_CODES: DiagnosticDTC[] = [
  {
    code: 'P0300',
    system: 'Powertrain (ECU)',
    description: 'Random / Multiple Cylinder Misfire Detected',
    severity: 'critical',
    status: 'Active - MIL ON',
    remedy: 'Verify ignition coil dwell times, fuel injector flow rate, and spark plug gap resistance on bank 1 & 2.'
  },
  {
    code: 'P0171',
    system: 'Fuel / Air Metering',
    description: 'System Too Lean (Bank 1) - Fuel Trim > +24%',
    severity: 'warning',
    status: 'Stored in Memory',
    remedy: 'Inspect intake manifold gasket for vacuum smoke leak; verify MAF sensor voltage response at 2500 RPM.'
  },
  {
    code: 'U0100',
    system: 'CAN Network Bus',
    description: 'Lost Communication with Engine Control Module (ECM/PCM)',
    severity: 'critical',
    status: 'Intermittent',
    remedy: 'Perform oscilloscope differential signal capture on CAN-H (2.5-3.5V) and CAN-L (1.5-2.5V) terminating resistors.'
  },
  {
    code: 'B10A2',
    system: 'Body Control (BCM)',
    description: 'Crash Signal / Airbag Deployment Line Resistance High',
    severity: 'warning',
    status: 'Historic',
    remedy: 'Inspect pyrotechnic battery disconnect safety terminal and SRS squib wire resistance.'
  }
];

export const INITIAL_LIVE_SENSORS: DiagnosticSensor[] = [
  { id: 'rpm', name: 'Engine Speed', value: 840, unit: 'RPM', min: 0, max: 7000, status: 'nominal' },
  { id: 'boost', name: 'Manifold Pressure (MAP)', value: 1.24, unit: 'Bar', min: 0, max: 2.8, status: 'optimal' },
  { id: 'rail', name: 'Common Rail Pressure', value: 380, unit: 'Bar', min: 100, max: 2200, status: 'nominal' },
  { id: 'coolant', name: 'Coolant Temperature', value: 91, unit: '°C', min: 0, max: 130, status: 'nominal' },
  { id: 'lambda', name: 'Wideband Lambda (AFR)', value: 1.002, unit: 'λ', min: 0.7, max: 1.4, status: 'optimal' },
  { id: 'dpf_soot', name: 'DPF Soot Mass Load', value: 14.8, unit: 'g', min: 0, max: 60, status: 'nominal' }
];

export const DEFAULT_HERO_BG = 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=2000&q=85';

export interface HeroBgPreset {
  id: string;
  name: string;
  category: string;
  url: string;
  description: string;
}

export const HERO_BG_PRESETS: HeroBgPreset[] = [
  {
    id: 'garage-service-bay',
    name: 'Master Diagnostic Workshop Bay',
    category: 'Garage & Diagnostic',
    url: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=2000&q=85',
    description: 'Clean modern auto repair service bays with hydraulic lifts and precision equipment.'
  },
  {
    id: 'electronic-ecu-lab',
    name: 'High-Tech ECU & Electronics Bay',
    category: 'ECU & Electronics',
    url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85',
    description: 'Specialist auto-electronic testing bench with telemetry diagnostics.'
  },
  {
    id: 'performance-garage-hub',
    name: 'Performance Tuning Garage',
    category: 'Performance & Tuning',
    url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=2000&q=85',
    description: 'Atmospheric performance garage with tools and engine work bays.'
  },
  {
    id: 'supercar-precision-bay',
    name: 'Supercar Service Bay',
    category: 'Exotic & Precision',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85',
    description: 'Dark cinematic supercar tuning and telemetry workshop floor.'
  },
  {
    id: 'diagnostic-scanners-bay',
    name: 'OBD2 Computer Diagnostic Lab',
    category: 'Computer Scanning',
    url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=2000&q=85',
    description: 'Advanced diagnostic scanner systems and engine bay telemetry.'
  }
];

