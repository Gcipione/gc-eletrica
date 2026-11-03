import React, { useState, useEffect } from 'react';
import { Calculator, MessageCircle, ArrowRight, Settings } from 'lucide-react';
import { CompanySettings, SimulatorConfig } from '../types';

interface BudgetCalculatorProps {
  settings: CompanySettings;
  config: SimulatorConfig;
  isAdminLoggedIn?: boolean;
  onOpenAdminToSimulator?: () => void;
}

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  settings,
  config,
  isAdminLoggedIn = false,
  onOpenAdminToSimulator,
}) => {
  const [propertyType, setPropertyType] = useState(config.propertyTypes[0] || 'Residencial');
  const [serviceType, setServiceType] = useState(config.serviceTypes[0] || 'Instalação Elétrica');
  const [urgency, setUrgency] = useState(config.urgencyOptions[0] || 'Normal');
  const [details, setDetails] = useState('');

  // Keep state synchronized if options in config are updated or deleted
  useEffect(() => {
    if (!config.propertyTypes.includes(propertyType) && config.propertyTypes.length > 0) {
      setPropertyType(config.propertyTypes[0]);
    }
  }, [config.propertyTypes, propertyType]);

  useEffect(() => {
    if (!config.serviceTypes.includes(serviceType) && config.serviceTypes.length > 0) {
      setServiceType(config.serviceTypes[0]);
    }
  }, [config.serviceTypes, serviceType]);

  useEffect(() => {
    if (!config.urgencyOptions.includes(urgency) && config.urgencyOptions.length > 0) {
      setUrgency(config.urgencyOptions[0]);
    }
  }, [config.urgencyOptions, urgency]);

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const message = `⚡ *SOLICITAÇÃO DE ORÇAMENTO - GC ELÉTRICA* ⚡\n\n` +
      `🏢 *Tipo de Imóvel:* ${propertyType}\n` +
      `🔧 *Serviço Solicitado:* ${serviceType}\n` +
      `⏱️ *Prazo / Urgência:* ${urgency}\n` +
      (details.trim() ? `📝 *Observações:* ${details.trim()}\n\n` : '\n') +
      `Gostaria de verificar a disponibilidade e valores para esse serviço. Obrigado!`;

    const targetUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    const a = document.createElement('a');
    a.href = targetUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="simulador" className="relative py-12 sm:py-16 bg-[#080808]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#121212] to-[#0a0a0a] p-6 sm:p-10 shadow-2xl shadow-amber-500/5">
          {/* Decorative ambient gradient */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Admin shortcut button to alter, include and delete options */}
          {onOpenAdminToSimulator && (
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={onOpenAdminToSimulator}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm ${
                  isAdminLoggedIn
                    ? 'border-amber-500/60 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'border-amber-500/30 bg-zinc-900/90 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400'
                }`}
                title="Alterar, incluir ou excluir itens do simulador no painel de administração"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Alterar, Incluir e Excluir Opções no Admin</span>
              </button>
            </div>
          )}

          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Calculator className="h-3.5 w-3.5" />
              <span>Simulador de Atendimento</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {config.title || 'Calcule seu Orçamento Rápido'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              {config.subtitle || 'Selecione as opções do seu projeto e receba uma resposta ágil direto no WhatsApp.'}
            </p>
          </div>

          <form onSubmit={handleSendToWhatsApp} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Property Type */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    1. Tipo de Imóvel
                  </label>
                  {onOpenAdminToSimulator && (
                    <button
                      type="button"
                      onClick={onOpenAdminToSimulator}
                      className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-0.5"
                      title="Gerenciar opções no painel administrativo"
                    >
                      <Settings className="h-2.5 w-2.5" />
                      <span>Alterar / Incluir</span>
                    </button>
                  )}
                </div>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  {config.propertyTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    2. Serviço Principal
                  </label>
                  {onOpenAdminToSimulator && (
                    <button
                      type="button"
                      onClick={onOpenAdminToSimulator}
                      className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-0.5"
                      title="Gerenciar opções no painel administrativo"
                    >
                      <Settings className="h-2.5 w-2.5" />
                      <span>Alterar / Incluir</span>
                    </button>
                  )}
                </div>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  {config.serviceTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency / Prazo */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    3. Prazo Desejado
                  </label>
                  {onOpenAdminToSimulator && (
                    <button
                      type="button"
                      onClick={onOpenAdminToSimulator}
                      className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-0.5"
                      title="Gerenciar opções no painel administrativo"
                    >
                      <Settings className="h-2.5 w-2.5" />
                      <span>Alterar / Incluir</span>
                    </button>
                  )}
                </div>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  {config.urgencyOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                4. Detalhes Adicionais (opcional)
              </label>
              <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Ex: Preciso trocar o quadro de disjuntores antigo e colocar DPS contra raios..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 text-center">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-8 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                <span>Enviar Simulação para o WhatsApp da GC Elétrica</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

