"use client";

import React, { useState, useEffect } from 'react';
import { PageLoader } from '../components/PageLoader';
import { CustomCursor } from '../components/CustomCursor';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { TypographicInterlude } from '../components/TypographicInterlude';
import { ServicesShowcase } from '../components/ServicesShowcase';
import { DiagnosticScannerHUD } from '../components/DiagnosticScannerHUD';
import { PrecisionShowcase } from '../components/PrecisionShowcase';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { MechanicsShowcase } from '../components/MechanicsShowcase';
import { ReviewsSection } from '../components/ReviewsSection';
import { PackagesSection } from '../components/PackagesSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { BookingModal } from '../components/BookingModal';
import { INITIAL_SERVICES, DEFAULT_HERO_BG } from '../data/initialData';
import { ServicePackage, Mechanic, Review } from '../types';
import { sounds } from '../utils/audio';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);

  // Data states
  const [heroBackground, setHeroBackground] = useState<string>(DEFAULT_HERO_BG);
  const [siteContent, setSiteContent] = useState<Record<string, Record<string, string>>>({});
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [depositType, setDepositType] = useState<'fixed'|'percentage'>('fixed');
  const [depositValue, setDepositValue] = useState<number>(200);

  useEffect(() => {
    fetchWebsiteData();
  }, []);

  const fetchWebsiteData = async () => {
    try {
      // ── Content sections (hero bg, interlude, precision, etc.) ──
      try {
        const contentRes = await fetch('/api/content');
        const contentData = await contentRes.json();
        const raw: Record<string, any> = contentData.content || {};

        // Build flat key-value maps per section
        const built: Record<string, Record<string, string>> = {};
        for (const [section, row] of Object.entries(raw)) {
          const flat: Record<string, string> = {};
          // Parse JSON description FIRST (lower priority)
          try {
            if (row.description) {
              const parsed = JSON.parse(row.description);
              // Don't let description override top-level imageUrl
              const { imageUrl: _ignored, ...rest } = parsed;
              Object.assign(flat, rest);
            }
          } catch {}
          // Top-level fields SECOND (higher priority — overwrite any JSON values)
          if (row.title)    flat.title    = row.title;
          if (row.subtitle) flat.subtitle = row.subtitle;
          if (row.ctaText)  flat.ctaText  = row.ctaText;
          if (row.imageUrl) flat.imageUrl = row.imageUrl; // always wins over description.imageUrl
          built[section] = flat;
        }
        setSiteContent(built);

        // Hero background image
        const heroSection = built['home_hero'];
        if (heroSection?.imageUrl) {
          setHeroBackground(heroSection.imageUrl);
        }

        // Services from DB
        try {
          const svcRow = raw['services_showcase'];
          if (svcRow?.description) {
            const parsed = JSON.parse(svcRow.description);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const mapped = parsed.map((s: any) => ({
                id: s.id,
                numberCode: s.numberCode,
                title: s.title,
                tagline: s.tagline,
                description: s.description,
                features: Array.isArray(s.features) ? s.features : [],
                image: s.image,
                techDetails: {
                  protocols: s.protocols || [],
                  turnaround: s.turnaround || '',
                  accuracyRate: s.accuracyRate || '',
                  equipmentUsed: s.equipmentUsed || '',
                },
                category: s.category || '',
              }));
              setServices(mapped);
            }
          }
        } catch { /* keep INITIAL_SERVICES */ }

      } catch { /* fall back to defaults */ }

      // ── Logo + public settings ──
      try {
        const settingsRes = await fetch('/api/settings');
        const settingsData = await settingsRes.json();
        if (settingsData.settings?.logo_url) {
          setLogoUrl(settingsData.settings.logo_url);
        }
        // Read deposit settings
        const dtype = settingsData.settings?.deposit_type || 'fixed';
        setDepositType(dtype === 'percentage' ? 'percentage' : 'fixed');
        const dval = parseFloat(settingsData.settings?.deposit_amount || '200');
        if (!isNaN(dval) && dval > 0) setDepositValue(dval);
      } catch { /* keep empty logo */ }

      // ── Packages ──
      const packagesRes = await fetch('/api/packages');
      const packagesData = await packagesRes.json();
      const transformedPackages = packagesData.packages.map((pkg: any) => ({
        id: pkg.id,
        name: pkg.name,
        priceEtb: pkg.price || 0,
        depositEtb: pkg.deposit || 200,
        duration: `${Math.floor(pkg.duration / 60)}h ${pkg.duration % 60 > 0 ? pkg.duration % 60 + 'm' : ''}`,
        description: pkg.description,
        features: pkg.features || [],
        isPopular: false,
        targetIssue: '',
      }));
      setPackages(transformedPackages);

      // ── Mechanics ──
      const mechanicsRes = await fetch('/api/mechanics');
      const mechanicsData = await mechanicsRes.json();
      const transformedMechanics = mechanicsData.mechanics.map((mech: any) => ({
        id: mech.id,
        name: mech.name,
        role: mech.role,
        rating: mech.averageRating || 0,
        experienceYears: parseInt(mech.experience) || 0,
        certifications: mech.certifications || [],
        avatar: mech.photo || null,
        bio: mech.bio,
        specialties: mech.specialization?.split(', ') || [],
        isAvailable: mech.isActive,
        completedJobs: 0,
      }));
      setMechanics(transformedMechanics);

      // ── Reviews ── fetch ALL approved reviews for the carousel
      const reviewsRes = await fetch('/api/reviews');
      const reviewsData = await reviewsRes.json();
      const transformedReviews = reviewsData.reviews.map((review: any) => ({
        id: review.id,
        author: review.customer,
        location: 'Addis Ababa',
        carModel: 'Various',
        rating: review.rating,
        text: review.reviewText,
        serviceType: review.mechanic?.specialization || 'Various',
        date: new Date(review.createdAt).toLocaleDateString(),
        isPinned: review.isPinned,
        mechanicName: review.mechanic?.name,
      }));
      setReviews(transformedReviews);

    } catch (error) {
      console.error('Error fetching website data:', error);
    }
  };

  const handleOpenBooking = (serviceId?: string) => {
    setPreselectedServiceId(serviceId);
    setIsBookingOpen(true);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-slate-100 font-sans selection:bg-red-600 selection:text-white">
      {/* Page Loader */}
      <PageLoader onComplete={() => {}} />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => window.location.href = '/admin/login'}
        onNavigateSection={handleNavigateSection}
        isAdminOpen={false}
      />

      <main>
        {/* Hero */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onExploreServices={() => handleNavigateSection('services')}
          onLaunchHUD={() => handleNavigateSection('diagnostics')}
          backgroundImage={heroBackground}
          content={siteContent['home_hero']}
        />

        {/* Typographic Interlude */}
        <TypographicInterlude content={siteContent['typographic_interlude']} />

        {/* Services Showcase */}
        <ServicesShowcase
          services={services}
          onSelectServiceForBooking={(id) => handleOpenBooking(id)}
          sectionContent={siteContent['services_showcase']}
        />

        {/* Diagnostic Scanner HUD */}
        <DiagnosticScannerHUD
          onOpenBookingForDiagnosis={() => handleOpenBooking('pkg-diag-pro')}
        />

        {/* Precision Showcase */}
        <PrecisionShowcase content={siteContent['precision_showcase']} />

        {/* Why Choose Us */}
        <WhyChooseUs content={siteContent['why_choose_us']} />

        {/* Mechanics Showcase */}
        <MechanicsShowcase
          mechanics={mechanics}
          onBookWithMechanic={(id) => handleOpenBooking(id)}
        />

        {/* Reviews */}
        <ReviewsSection reviews={reviews} />

        {/* Packages */}
        <PackagesSection
          packages={packages}
          onSelectPackage={(id) => handleOpenBooking(id)}
          depositType={depositType}
          depositValue={depositValue}
        />

        {/* Contact */}
        <ContactSection
          onOpenBooking={() => handleOpenBooking()}
          content={siteContent['contact_section']}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => window.location.href = '/admin/login'}
        content={siteContent['footer']}
        logoUrl={logoUrl}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        packages={packages}
        services={services}
        preselectedServiceId={preselectedServiceId}
        onBookingCreated={() => fetchWebsiteData()}
        contactContent={siteContent['contact_section']}
      />
    </div>
  );
}
