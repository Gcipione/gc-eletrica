/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShowcaseVitrine } from './components/ShowcaseVitrine';
import { WhyChooseUs } from './components/WhyChooseUs';
import { BudgetCalculator } from './components/BudgetCalculator';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { ServiceLightbox } from './components/ServiceLightbox';
import { ShareModal } from './components/ShareModal';
import { ServiceItem, CompanySettings, SimulatorConfig } from './types';
import {
  loadServices,
  loadSettings,
  loadCategories,
  loadSimulatorConfig,
  checkIsAdminLoggedIn,
  fetchRemoteData,
} from './utils/storage';
import { MessageCircle, Zap, Share2 } from 'lucide-react';

export default function App() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(loadSettings());
  const [simulatorConfig, setSimulatorConfig] = useState<SimulatorConfig>(loadSimulatorConfig());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'vitrine' | 'categorias' | 'simulador' | 'video' | 'settings'>('vitrine');
  const [lightboxService, setLightboxService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    setServices(loadServices());
    setCategories(loadCategories());
    setSettings(loadSettings());
    setSimulatorConfig(loadSimulatorConfig());
    setIsAdminLoggedIn(checkIsAdminLoggedIn());
    fetchRemoteData().then((data) => {
      if (!data) return;
      setServices(data.services);
      setCategories(data.categories);
      setSettings(data.settings);
      setSimulatorConfig(data.simulatorConfig);
    });
  }, []);

  const handleOpenAdmin = (tab: 'vitrine' | 'categorias' | 'simulador' | 'video' | 'settings' = 'vitrine') => {
    setAdminInitialTab(tab);
    setIsAdminModalOpen(true);
  };

  const getFloatingWhatsAppLink = () => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Olá! Gostaria de um orçamento com a GC Elétrica.')}`;
  };

  return (
    <div className="min-h-screen bg-[#080808] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navbar with Responsive Navigation and Share Trigger */}
      <Navbar
        settings={settings}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => handleOpenAdmin('vitrine')}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Section with Brand & MP4 Video in place of logo */}
        <Hero
          settings={settings}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdminToVideo={() => handleOpenAdmin('video')}
        />

        {/* 2. Showcase Vitrine below Video (2 images per column on mobile) */}
        <ShowcaseVitrine
          services={services}
          categories={categories}
          settings={settings}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdminToAdd={() => handleOpenAdmin('vitrine')}
          onOpenAdminCategories={() => handleOpenAdmin('categorias')}
          onSelectService={(service) => setLightboxService(service)}
        />

        {/* 3. Differentials & Quality Standards */}
        <WhyChooseUs />

        {/* 4. Fast WhatsApp Budget Simulator (Configurable in Admin) */}
        <BudgetCalculator
          settings={settings}
          config={simulatorConfig}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdminToSimulator={() => handleOpenAdmin('simulador')}
        />

        {/* 5. Direct Contact & Location */}
        <ContactSection settings={settings} />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => handleOpenAdmin('vitrine')}
      />

      {/* Admin Panel Modal (Protegido por senha (verificada no Supabase)) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        services={services}
        setServices={setServices}
        categories={categories}
        setCategories={setCategories}
        settings={settings}
        setSettings={setSettings}
        simulatorConfig={simulatorConfig}
        setSimulatorConfig={setSimulatorConfig}
        initialTab={adminInitialTab}
      />

      {/* Service Lightbox Zoom */}
      <ServiceLightbox
        service={lightboxService}
        settings={settings}
        onClose={() => setLightboxService(null)}
      />

      {/* Sophisticated Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        settings={settings}
      />

      {/* Floating Action Cluster: Share + WhatsApp */}
      <aside aria-label="Acesso rápido WhatsApp e Compartilhamento" className="fixed bottom-4 right-3 sm:right-5 z-30 flex flex-col items-end gap-2.5">
        {/* Floating Share Button */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          title="Compartilhar site da GC Elétrica"
          aria-label="Compartilhar aplicativo"
          className="group flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-zinc-900/90 text-amber-400 p-2.5 sm:px-3 sm:py-2 text-xs font-bold shadow-lg shadow-black/80 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-300 active:scale-95 transition-all backdrop-blur-md"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Compartilhar</span>
        </button>

        {/* Floating WhatsApp CTA */}
        <a
          href={getFloatingWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Orçamento no WhatsApp"
          className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-black px-3.5 py-3 sm:px-4 sm:py-3 font-extrabold text-xs shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all"
        >
          <MessageCircle className="h-5 w-5 fill-current" />
          <span className="hidden sm:inline font-bold">Orçamento no WhatsApp</span>
        </a>
      </aside>

      {/* Quick Admin Bar if currently logged in */}
      {isAdminLoggedIn && (
        <aside aria-label="Barra de administração ativa" className="fixed bottom-4 left-3 sm:left-5 z-30">
          <button
            onClick={() => handleOpenAdmin('vitrine')}
            className="flex items-center gap-1.5 rounded-full bg-amber-500/90 text-black px-3.5 py-2 font-bold text-xs shadow-lg shadow-amber-500/30 hover:bg-amber-400 active:scale-95 transition-all"
          >
            <Zap className="h-3.5 w-3.5 fill-black" />
            <span>Gerenciar Vitrine ({services.length})</span>
          </button>
        </aside>
      )}
    </div>
  );
}
