import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Film, Settings } from 'lucide-react';
import { CompanySettings } from '../types';

interface VideoSectionProps {
  settings: CompanySettings;
  isAdminLoggedIn: boolean;
  onOpenAdminToVideo: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  settings,
  isAdminLoggedIn,
  onOpenAdminToVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(settings.videoMuted);
  const [hasStarted, setHasStarted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch((err) => {
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
    <section id="video" className="relative py-8 sm:py-12 bg-[#0a0a0a] border-y border-zinc-800/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-5 sm:mb-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 text-left">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Film className="h-3.5 w-3.5" />
              <span>Vídeo Institucional</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1">
              {settings.videoTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
              {settings.videoSubtitle}
            </p>
          </div>

          {isAdminLoggedIn && (
            <button
              onClick={onOpenAdminToVideo}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors shrink-0"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Trocar Vídeo MP4</span>
            </button>
          )}
        </div>

        {/* Video Player Box */}
        <div className="relative group overflow-hidden rounded-2xl border border-amber-500/30 bg-black shadow-2xl shadow-amber-500/10">
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

          {/* Quick Custom Control Bar Overlay when not in native fullscreen */}
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

          {/* Large Center Play Overlay Button if paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-opacity group-hover:bg-black/30 z-10"
            >
              <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full gold-ring-frame p-[2px] shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-transform group-hover:scale-110">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-950/90 text-amber-400">
                  <Play className="h-7 w-7 sm:h-8 sm:w-8 translate-x-0.5 fill-amber-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Footer info */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 px-1">
          <span>Vídeo em formato MP4 de alta definição</span>
          <span className="text-amber-400 font-medium">GC Elétrica Oficial</span>
        </div>
      </div>
    </section>
  );
};
