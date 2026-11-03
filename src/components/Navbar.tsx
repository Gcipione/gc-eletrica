import React, { useState } from 'react';
import {
  Zap,
  MessageCircle,
  Phone,
  Menu,
  X,
  Share2,
  Calculator,
  Film,
  Grid,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { CompanySettings } from '../types';

interface NavbarProps {
  settings: CompanySettings;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onOpenShare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  isAdminLoggedIn,
  onOpenAdmin,
  onOpenShare,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getWhatsAppLink = (text = 'Olá! Gostaria de um orçamento elétrico com a GC Elétrica.') => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const getPhoneCallLink = () => {
    const cleanNumber = settings.phone.replace(/\D/g, '');
    return `tel:${cleanNumber}`;
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#080808]/95 backdrop-blur-md shadow-lg shadow-black/50">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5">
          {/* Brand Wordmark (Safe responsive sizing) */}
          <a
            href="#inicio"
            className="flex items-center gap-2 group min-w-0 shrink"
            aria-label="GC Elétrica - Página Inicial"
          >
            <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-[1.5px] shadow-sm shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0a0a]">
                <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
                GC <span className="gold-gradient-text">ELÉTRICA</span>
              </span>
              <span className="hidden min-[380px]:block text-[9px] uppercase tracking-widest text-zinc-400 font-medium truncate">
                {settings.slogan}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <a href="#inicio" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              Início
            </a>
            <a href="#video" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              Vídeo
            </a>
            <a href="#vitrine" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              Vitrine
            </a>
            <a href="#simulador" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              Orçamento
            </a>
            <a href="#diferenciais" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              Diferenciais
            </a>
            <a href="#contato" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              Contato
            </a>
          </nav>

          {/* Action Zone: Compartilhar + Admin + WhatsApp + Hamburger Menu (Guaranteed No-Overflow) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Share Button (Sophisticated Trigger) */}
            <button
              type="button"
              onClick={onOpenShare}
              title="Compartilhar GC Elétrica"
              aria-label="Compartilhar site"
              className="relative flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-zinc-900/90 px-2 sm:px-3 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 hover:border-amber-400/60 transition-all active:scale-95 shadow-sm shadow-amber-500/10"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-xs font-bold">Compartilhar</span>
            </button>

            {/* Discreet Admin Lightning Bolt Trigger */}
            <button
              type="button"
              onClick={onOpenAdmin}
              title={isAdminLoggedIn ? 'Painel do Administrador (Ativo)' : 'Administração GC Elétrica'}
              aria-label="Acesso Administrativo"
              className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all focus:outline-none ${
                isAdminLoggedIn
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-zinc-600 hover:text-amber-400/90 hover:bg-zinc-900 border border-transparent hover:border-amber-500/30'
              }`}
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              {isAdminLoggedIn && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </button>

            {/* WhatsApp Primary CTA - Smart responsive width: icon-only on mobile, pill on sm+ */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              className="flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-2.5 sm:px-3.5 text-xs font-bold text-zinc-950 shadow-md shadow-amber-500/20 transition-all hover:brightness-110 active:scale-95 whitespace-nowrap"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-current shrink-0" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Mobile Hamburger Menu Trigger (Prominent, High-Contrast, Guaranteed Fitting) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex lg:hidden h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border transition-all active:scale-95 ${
                mobileMenuOpen
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'border-zinc-700/80 bg-zinc-900/90 text-zinc-200 hover:text-amber-400 hover:border-amber-500/40'
              }`}
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Ultra-Sophisticated Mobile Menu Drawer & Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-start">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative z-10 w-full max-h-[92vh] overflow-y-auto border-b border-amber-500/30 bg-[#0b0b0b]/98 px-4 pt-3 pb-6 shadow-[0_15px_40px_rgba(0,0,0,0.9)] animate-in slide-in-from-top-4 duration-200">
            {/* Top Bar inside Menu */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-700 p-[1px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                    <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  </div>
                </div>
                <div>
                  <div className="font-display text-sm font-extrabold text-white">
                    GC <span className="gold-gradient-text">ELÉTRICA</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Atendimento Rápido Ativo
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                aria-label="Fechar menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Share Spotlight Card */}
            <div className="mt-3.5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <Share2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      Compartilhar este Aplicativo
                      <Sparkles className="h-3 w-3 text-amber-400" />
                    </h4>
                    <p className="text-[10px] text-zinc-400">
                      Envie para amigos, clientes ou no WhatsApp
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenShare();
                  }}
                  className="rounded-lg bg-amber-500 hover:bg-amber-400 px-2.5 py-1.5 text-[11px] font-extrabold text-black active:scale-95 transition-all shadow-sm shrink-0"
                >
                  Compartilhar
                </button>
              </div>
            </div>

            {/* Sophisticated Navigation Links */}
            <div className="mt-4 space-y-1">
              <a
                href="#inicio"
                onClick={handleNavClick}
                className="flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-900/90 hover:text-amber-400 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Início
                </span>
                <span className="text-[10px] text-zinc-500">Topo</span>
              </a>

              <a
                href="#video"
                onClick={handleNavClick}
                className="flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-900/90 hover:text-amber-400 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Film className="h-4 w-4 text-amber-400" />
                  Vídeo do Trabalho em Ação
                </span>
                <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 border border-amber-500/20">
                  Vídeo MP4
                </span>
              </a>

              <a
                href="#vitrine"
                onClick={handleNavClick}
                className="flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-900/90 hover:text-amber-400 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Grid className="h-4 w-4 text-amber-400" />
                  Vitrine de Serviços
                </span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-300">
                  2 fotos por coluna
                </span>
              </a>

              <a
                href="#simulador"
                onClick={handleNavClick}
                className="flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-900/90 hover:text-amber-400 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Calculator className="h-4 w-4 text-amber-400" />
                  Simulador de Orçamento Rápido
                </span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 border border-amber-500/30">
                  Em 30s
                </span>
              </a>

              <a
                href="#diferenciais"
                onClick={handleNavClick}
                className="flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-900/90 hover:text-amber-400 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  Diferenciais & Padrão NR-10
                </span>
                <span className="text-[10px] text-zinc-500">Garantia</span>
              </a>

              <a
                href="#contato"
                onClick={handleNavClick}
                className="flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-900/90 hover:text-amber-400 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  Fale Conosco & Localização
                </span>
                <span className="text-[10px] text-zinc-500">{settings.city}</span>
              </a>
            </div>

            {/* Direct Contact Buttons */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-2">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2.5 text-xs font-bold text-black shadow-md shadow-emerald-500/20 active:scale-95 transition-transform"
              >
                <MessageCircle className="h-4 w-4 fill-black" />
                <span>WhatsApp</span>
              </a>

              <a
                href={getPhoneCallLink()}
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/90 px-3 py-2.5 text-xs font-bold text-zinc-100 hover:border-amber-500/50 hover:text-amber-400 active:scale-95 transition-all"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Ligar Agora</span>
              </a>
            </div>

            {/* Discreet Admin Footer */}
            <div className="mt-4 pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="truncate">{settings.phone}</span>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-1 text-zinc-500 hover:text-amber-400 transition-colors"
                title="Acesso com senha de administração"
              >
                <Zap className="h-3 w-3 fill-current text-amber-400/80" />
                <span>{isAdminLoggedIn ? 'Painel Admin' : 'Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
