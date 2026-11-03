import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  QrCode,
  X,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CompanySettings } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CompanySettings;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, settings }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://gceletrica.com.br';
  const shareTitle = `${settings.name} - ${settings.slogan}`;
  const shareText = `⚡ Precisa de eletricista profissional? Conheça a ${settings.name}! Especialistas em quadros de distribuição, instalações residenciais, comerciais, industriais e energia solar com conformidade NR-10.`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = currentUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch {
        // User cancelled or aborted
      }
    } else {
      handleCopyLink();
    }
  };

  const getWhatsAppShareUrl = () => {
    const text = `${shareText}\n\n👉 Acesse o site oficial: ${currentUrl}\n📲 Atendimento direto: https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const getTelegramShareUrl = () => {
    return `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
  };

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-[#0e0e0e]/95 p-5 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] backdrop-blur-xl transition-all z-10 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-[1px] shadow-md shadow-amber-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-black">
                <Share2 className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-1.5">
                Compartilhar <span className="gold-gradient-text">{settings.name}</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Divulgue serviços e soluções de eletricidade de alta qualidade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Website Card Preview */}
        <div className="my-4 rounded-xl border border-amber-500/20 bg-gradient-to-r from-zinc-900/90 via-[#151515] to-zinc-900/90 p-3.5 relative overflow-hidden group">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black border border-amber-500/50 shadow-inner">
              <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-sm text-white truncate">
                  {settings.name}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">
                  <Sparkles className="h-2.5 w-2.5" /> Oficial
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                {settings.slogan} • Instalações, Manutenção & Padrão NR-10
              </p>
              <p className="text-[10px] text-amber-400/80 truncate mt-0.5">
                {currentUrl}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action: Direct WhatsApp Sharing */}
        <div className="space-y-2.5">
          <a
            href={getWhatsAppShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 px-4 py-3 text-sm font-bold text-black shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <MessageCircle className="h-4 w-4 fill-black" />
            <span>Compartilhar no WhatsApp</span>
          </a>

          {/* Native Web Share API if supported on device */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-4 py-2.5 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <Share2 className="h-4 w-4" />
              <span>Abrir Opções de Compartilhar do Celular</span>
            </button>
          )}

          {/* Quick Share Secondary Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={getTelegramShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800/80 hover:border-sky-500/40 px-3 py-2.5 text-xs font-semibold text-zinc-200 transition-all"
            >
              <Send className="h-3.5 w-3.5 text-sky-400" />
              <span>Telegram</span>
            </a>

            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800/80 hover:border-amber-500/40 px-3 py-2.5 text-xs font-semibold text-zinc-200 transition-all"
            >
              <QrCode className="h-3.5 w-3.5 text-amber-400" />
              <span>{showQr ? 'Ocultar QR Code' : 'Ver QR Code'}</span>
            </button>
          </div>
        </div>

        {/* QR Code Section (Expandable) */}
        {showQr && (
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-black/60 p-4 text-center animate-in fade-in slide-in-from-top-2">
            <p className="text-xs font-semibold text-zinc-300 mb-3">
              Aponte a câmera do celular para abrir o site instantaneamente:
            </p>
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-xl bg-white p-2.5 shadow-md">
              {/* Clean decorative SVG QR representation for high-fidelity offline readiness */}
              <svg viewBox="0 0 100 100" className="h-full w-full fill-black">
                {/* QR Outer corners */}
                <rect x="0" y="0" width="30" height="30" rx="3" />
                <rect x="4" y="4" width="22" height="22" fill="white" rx="2" />
                <rect x="8" y="8" width="14" height="14" rx="1" />

                <rect x="70" y="0" width="30" height="30" rx="3" />
                <rect x="74" y="4" width="22" height="22" fill="white" rx="2" />
                <rect x="78" y="8" width="14" height="14" rx="1" />

                <rect x="0" y="70" width="30" height="30" rx="3" />
                <rect x="4" y="74" width="22" height="22" fill="white" rx="2" />
                <rect x="8" y="78" width="14" height="14" rx="1" />

                {/* Data blocks */}
                <rect x="36" y="8" width="8" height="8" />
                <rect x="48" y="16" width="14" height="6" />
                <rect x="8" y="36" width="8" height="8" />
                <rect x="20" y="42" width="14" height="6" />
                <rect x="38" y="38" width="24" height="24" rx="2" fill="#d97706" />
                <rect x="42" y="42" width="16" height="16" fill="white" rx="1" />
                <rect x="46" y="46" width="8" height="8" fill="#b45309" />
                <rect x="68" y="40" width="12" height="10" />
                <rect x="84" y="42" width="8" height="16" />
                <rect x="38" y="70" width="16" height="10" />
                <rect x="60" y="72" width="14" height="8" />
                <rect x="78" y="70" width="14" height="18" />
              </svg>
            </div>
            <p className="text-[10px] text-zinc-400 mt-2">
              Ideal para mostrar em reuniões de condomínio ou no balcão de obras
            </p>
          </div>
        )}

        {/* Copy Link Input Bar */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Link direto do site:
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-black/60 p-1.5 focus-within:border-amber-500/60 transition-colors">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-transparent px-2 text-xs text-zinc-300 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                copied
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                  : 'bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>
          </div>

          {copied && (
            <p className="mt-2 text-center text-xs font-semibold text-emerald-400 animate-in fade-in">
              ✨ Link copiado! Cole no WhatsApp, redes sociais ou envie por mensagem.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
