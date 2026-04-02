'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Modal from '../components/Modal';
import LeadForm from '../components/LeadForm';
import TierSelection from '../components/TierSelection';
import Navbar from '../components/Navbar';
import FAQ from '../components/FAQ';
import JsonLd from '../components/JsonLd';

// Sub-components
import HeroSection from './components/HeroSection';
import SocialProof from './components/SocialProof';
import PillarsSection from './components/PillarsSection';
import EvolutionSection from './components/EvolutionSection';
import PricingSection from './components/PricingSection';

// Constants
import {
  ORGANIZATION_JSON_LD,
  WEBSITE_JSON_LD,
  SOFTWARE_JSON_LD,
  FAQ_JSON_LD,
  FAQ_ITEMS,
} from '../lib/metadata-constants';

interface ClawMoreClientProps {
  apiUrl: string;
  dict?: any;
}

/**
 * Main client-side entry point for the ClawMore landing page.
 * Orchestrates several high-level sections and handles lead generation state.
 *
 * Refactored into specialized sub-components (Hero, Pillars, Pricing, etc.)
 * to improve AI signal clarity and maintainability.
 */
export default function ClawMoreClient({ apiUrl, dict }: ClawMoreClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'beta' | 'waitlist' | 'trial'>(
    'beta'
  );

  const openModal = (type: 'beta' | 'waitlist' | 'trial') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyber-blue/30 selection:text-cyber-blue font-sans text-left">
      {/* Structured Data for SEO and AI Grounding */}
      <JsonLd data={ORGANIZATION_JSON_LD} />
      <JsonLd data={WEBSITE_JSON_LD} />
      <JsonLd data={SOFTWARE_JSON_LD} />
      <JsonLd data={FAQ_JSON_LD} />

      <Navbar dict={dict} />

      <main>
        {/* Core Sections */}
        <HeroSection
          onOpenBeta={() => openModal('beta')}
          onOpenTrial={() => openModal('trial')}
        />
        <SocialProof />
        <PillarsSection />
        <EvolutionSection dict={dict} />
        <PricingSection />

        {/* Secondary Content */}
        <FAQ items={FAQ_ITEMS} title="Frequently Asked Questions" />
      </main>

      {/* Conversion Overlays */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalType === 'trial' ? (
          <TierSelection
            onSelectManaged={() => {
              setModalType('beta');
            }}
            onClose={closeModal}
          />
        ) : (
          <LeadForm
            type={modalType}
            onSuccess={closeModal}
            apiUrl={apiUrl}
            dict={dict}
          />
        )}
      </Modal>

      {/* Site Footer */}
      <footer className="py-14 sm:py-20 border-t border-white/5 bg-black/40">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <Image
              src="/logo.png"
              alt="ClawMore Logo"
              width={32}
              height={32}
              className="rounded-sm opacity-80"
            />
            <span className="font-black text-xl tracking-tighter italic glow-text">
              ClawMore
            </span>
          </div>
          <div className="flex items-center justify-center gap-6 mb-8">
            <Link
              href="/terms"
              className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <a
              href="mailto:support@getaiready.dev"
              className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
            >
              Support
            </a>
          </div>
          <div className="text-zinc-500 text-sm">
            {dict.footer.ecosystem}{' '}
            <Link
              href="https://getaiready.dev"
              className="text-zinc-400 hover:text-cyber-blue transition-colors underline decoration-white/10 underline-offset-4"
            >
              AIReady Ecosystem
            </Link>{' '}
            neural network.
            <div className="mt-4 text-xs text-zinc-600">
              {dict.footer.copyright}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
