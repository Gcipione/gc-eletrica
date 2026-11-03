import React, { useRef, useState } from 'react';
import {
  MessageCircle,
  ArrowDown,
  ShieldCheck,
  Award,
  Clock,
  Play,
  Volume2,
  VolumeX,
  Maximize,
  Film,
  Settings,
  Zap,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CompanySettings } from '../types';

interface HeroProps {
  settings: CompanySettings;
  isAdminLoggedIn: boolean;
  onOpenAdminToVideo: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  isAdminLoggedIn,
  onOpenAdminToVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(settings.videoMuted);

  const getWhatsAppLink = (text = 'Olá! Gostaria de falar com a GC Elétrica para solicitar um orçamento.') => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Erro ao reproduzir vídeo:', err);
        });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section id="inicio" className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 text-center">
      {/* Background ambient lighting effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      >
        <div className="h-80 w-80 sm:h-[450px] sm:w-[450px] rounded-full bg-amber-500/12 blur-[100px]" />
        <div className="absolute top-1/4 h-64 w-64 rounded-full bg-yellow-600/10 blur-[90px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Brand Headline */}
        <div className="space-y-3 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-zinc-900 to-amber-500/15 px-4 py-1 text-xs font-bold text-amber-300 shadow-sm shadow-amber-500/10 mb-1">
            <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>Soluções Especializadas em Eletricidade & Engenharia</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white text-balance">
            GC <span className="gold-gradient-text">ELÉTRICA</span>
          </h1>

          <p className="text-sm sm:text-lg font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase chrome-gradient-text">
            {settings.slogan}
          </p>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed text-balance pt-1">
            Instalações elétricas <strong className="text-amber-400 font-semibold">residenciais</strong>, <strong className="text-amber-400 font-semibold">comerciais</strong> e <strong className="text-amber-400 font-semibold">industriais</strong> de alta precisão com conformidade estrita às normas NR-10 e NBR 5410.
          </p>
        </div>

        {/* VIDEO IN PLACE OF THE LOGO */}
        <div id="video" className="relative my-6 sm:my-8">
          <div className="flex items-center justify-between mb-3 text-left">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Film className="h-3.5 w-3.5" />
              <span>{settings.videoTitle}</span>
            </div>

            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={onOpenAdminToVideo}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors shrink-0"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Trocar Vídeo MP4</span>
              </button>
            )}
          </div>

          {/* Video Player Box with Gold Glowing Accent */}
          <div className="relative group overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-black shadow-2xl shadow-amber-500/20 gold-border-glow transition-all">
            <video
              ref={videoRef}
              src={settings.videoUrl}
              loop={settings.videoLoop}
              muted={isMuted}
              playsInline
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full aspect-video object-cover bg-black"
            >
              Seu navegador não suporta a reprodução deste vídeo em MP4.
            </video>

            {/* Custom Control Bar Overlay */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-20 pointer-events-auto">
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-zinc-200 backdrop-blur-md hover:bg-black/90 hover:text-amber-400 border border-white/10 transition-colors"
                title={isMuted ? 'Ativar Som' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleFullscreen}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-zinc-200 backdrop-blur-md hover:bg-black/90 hover:text-amber-400 border border-white/10 transition-colors"
                title="Tela Cheia"
              >
                <Maximize className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Center Play Overlay Button if paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-opacity group-hover:bg-black/30 z-10"
              >
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full gold-ring-frame p-[2px] shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-transform group-hover:scale-110">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-950/95 text-amber-400">
                    <Play className="h-7 w-7 sm:h-8 sm:w-8 translate-x-0.5 fill-amber-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 text-left text-xs text-zinc-400">
            {settings.videoSubtitle}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-6 py-3.5 text-sm font-extrabold text-zinc-950 shadow-lg shadow-amber-500/25 transition-all hover:brightness-110 hover:shadow-amber-500/40 active:scale-98"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            <span>Solicitar Orçamento no WhatsApp</span>
          </a>

          <a
            href="#vitrine"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-zinc-900/90 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-800 hover:text-amber-400 hover:border-amber-500/60"
          >
            <span>Ver Vitrine de Serviços</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* ULTRA-SOPHISTICATED CREDENTIALS / TRUST BAR (Redesigned from the generic wireframe) */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Credential 1: NR-10 & NBR */}
            <div className="group relative flex items-center gap-3.5 rounded-2xl border border-amber-500/20 bg-gradient-to-r sm:bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] p-3.5 sm:p-4 text-left transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/10">
              <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-600/15 to-transparent border border-amber-500/35 text-amber-400 shadow-inner group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  Normas NR-10 & NBR
                </div>
                <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate mt-0.5">
                  Segurança técnica & conformidade
                </div>
              </div>
            </div>

            {/* Credential 2: Atendimento Ágil */}
            <div className="group relative flex items-center gap-3.5 rounded-2xl border border-amber-500/20 bg-gradient-to-r sm:bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] p-3.5 sm:p-4 text-left transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/10">
              <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-600/15 to-transparent border border-amber-500/35 text-amber-400 shadow-inner group-hover:scale-105 transition-transform">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  Atendimento Ágil
                </div>
                <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate mt-0.5">
                  Pontualidade & resposta rápida
                </div>
              </div>
            </div>

            {/* Credential 3: Garantia nos Serviços */}
            <div className="group relative flex items-center gap-3.5 rounded-2xl border border-amber-500/20 bg-gradient-to-r sm:bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#0a0a0a] p-3.5 sm:p-4 text-left transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/10">
              <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-600/15 to-transparent border border-amber-500/35 text-amber-400 shadow-inner group-hover:scale-105 transition-transform">
                <Award className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  Garantia nos Serviços
                </div>
                <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate mt-0.5">
                  Materiais certificados & ART
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
