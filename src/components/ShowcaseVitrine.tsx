import React, { useState, useMemo } from 'react';
import { MessageCircle, ZoomIn, Plus, Sparkles, Layers, Tags } from 'lucide-react';
import { ServiceItem, CompanySettings } from '../types';

interface ShowcaseVitrineProps {
  services: ServiceItem[];
  categories: string[];
  settings: CompanySettings;
  isAdminLoggedIn: boolean;
  onOpenAdminToAdd: () => void;
  onOpenAdminCategories: () => void;
  onSelectService: (service: ServiceItem) => void;
}

export const ShowcaseVitrine: React.FC<ShowcaseVitrineProps> = ({
  services,
  categories,
  settings,
  isAdminLoggedIn,
  onOpenAdminToAdd,
  onOpenAdminCategories,
  onSelectService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Compute active categories strictly from user-defined categories
  const allCategories = useMemo(() => {
    const list = ['Todos'];
    categories.forEach((cat) => {
      if (cat && !list.includes(cat)) {
        list.push(cat);
      }
    });
    return list;
  }, [categories]);

  // If active category was deleted, safely reset filter to 'Todos'
  React.useEffect(() => {
    if (selectedCategory !== 'Todos' && !categories.includes(selectedCategory)) {
      setSelectedCategory('Todos');
    }
  }, [categories, selectedCategory]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'Todos') return services;
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);

  const getWhatsAppLink = (serviceTitle: string) => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const message = `Olá, GC Elétrica! Gostaria de solicitar um orçamento para o serviço: ${serviceTitle}.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="vitrine" className="relative py-10 sm:py-16 bg-[#080808]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Layers className="h-3.5 w-3.5" />
              <span>Vitrine Oficial</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1">
              Vitrine de Serviços & Projetos
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-2xl">
              Confira fotos reais de soluções executadas pela nossa equipe. Clique em qualquer serviço para ampliar a imagem e solicitar atendimento rápido.
            </p>
          </div>

          {isAdminLoggedIn && (
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-auto">
              <button
                onClick={onOpenAdminCategories}
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-amber-500/50 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-amber-400 transition-all"
                title="Incluir ou excluir categorias"
              >
                <Tags className="h-3.5 w-3.5 text-amber-400" />
                <span>Gerenciar Categorias</span>
              </button>

              <button
                onClick={onOpenAdminToAdd}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Serviço</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Filters (Clean functional buttons) */}
        {allCategories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* SHOWCASE GRID:
            Mobile: exactly 2 images per row (grid-cols-2) as specifically requested by user!
            Tablet/Desktop: 3 to 4 columns */}
        {filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">
            <p className="text-sm text-zinc-400">Nenhum serviço encontrado nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800/90 bg-[#0f0f0f] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10"
              >
                {/* Image Container with Zoom Affordance */}
                <div
                  onClick={() => onSelectService(service)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900 cursor-pointer"
                >
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if image path fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Gradient Overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badge (if any) */}
                  {service.badge && (
                    <span className="absolute top-2 left-2 rounded-md bg-amber-500/90 backdrop-blur-sm px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-black shadow-sm">
                      {service.badge}
                    </span>
                  )}

                  {/* Quick Zoom Icon */}
                  <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-zinc-200 backdrop-blur-md opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:text-amber-400 transition-all">
                    <ZoomIn className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3.5">
                  <div>
                    {/* Category */}
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/90">
                      {service.category}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xs sm:text-sm font-bold text-white line-clamp-2 mt-0.5 group-hover:text-amber-300 transition-colors">
                      {service.title}
                    </h3>

                    {/* Description - compact on mobile */}
                    <p className="mt-1 text-[11px] sm:text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* WhatsApp Action Button */}
                  <div className="mt-3 pt-2 border-t border-zinc-800/80">
                    <a
                      href={getWhatsAppLink(service.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-amber-500 hover:text-black border border-zinc-700/60 hover:border-amber-400 py-1.5 px-2 text-[11px] font-bold text-zinc-200 transition-all active:scale-95 whitespace-nowrap shadow-sm"
                    >
                      <MessageCircle className="h-3 w-3 fill-current text-emerald-400 group-hover/btn:text-black shrink-0" />
                      <span>Pedir Orçamento</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile notice: confirmation of 2 columns */}
        <div className="mt-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400/70" />
          <span>Vitrine otimizada para celular: visualização em 2 fotos por coluna</span>
        </div>
      </div>
    </section>
  );
};
