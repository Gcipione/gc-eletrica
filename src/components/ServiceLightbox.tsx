import React from 'react';
import { X, MessageCircle, ShieldCheck, Tag, ExternalLink } from 'lucide-react';
import { ServiceItem, CompanySettings } from '../types';

interface ServiceLightboxProps {
  service: ServiceItem | null;
  settings: CompanySettings;
  onClose: () => void;
}

export const ServiceLightbox: React.FC<ServiceLightboxProps> = ({
  service,
  settings,
  onClose,
}) => {
  if (!service) return null;

  const getWhatsAppLink = () => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const message = `Olá, GC Elétrica! Vi o serviço "${service.title}" na vitrine do seu aplicativo e gostaria de solicitar um orçamento para o meu imóvel.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-amber-500/40 bg-[#0c0c0c] shadow-2xl shadow-amber-500/20 text-slate-100 max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-zinc-300 hover:text-white hover:bg-black transition-colors"
          aria-label="Fechar modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Large Image View */}
        <div className="relative aspect-video sm:aspect-[16/10] w-full bg-black overflow-hidden shrink-0">
          <img
            src={service.imageUrl}
            alt={service.title}
            className="h-full w-full object-contain sm:object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {service.badge && (
            <span className="absolute bottom-3 left-3 rounded-md bg-amber-500 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-md">
              {service.badge}
            </span>
          )}
        </div>

        {/* Details & Action */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Tag className="h-3 w-3" />
              <span>{service.category}</span>
            </div>
            <h3 className="font-display text-lg sm:text-2xl font-extrabold text-white mt-1">
              {service.title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Instalação padrão ABNT / NBR 5410 com laudo e garantia</span>
            </div>
            <span className="text-amber-400 font-bold hidden sm:inline">GC Elétrica</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 py-3 px-4 text-xs sm:text-sm font-bold text-black shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              <span>Solicitar Orçamento Deste Serviço</span>
            </a>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Voltar à Vitrine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
