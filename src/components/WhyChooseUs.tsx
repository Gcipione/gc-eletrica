import React from 'react';
import { ShieldCheck, Cpu, Clock, CheckCircle2, Award, Zap } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const differentials = [
    {
      number: '01',
      title: 'Segurança & Normas NR-10',
      description: 'Execução estrita conforme as normas regulamentadoras NR-10 e NBR 5410, prevenindo curtos-circuitos, sobrecargas e riscos de incêndio.',
      icon: ShieldCheck,
    },
    {
      number: '02',
      title: 'Materiais Certificados',
      description: 'Trabalhamos exclusivamente com condutores elétricos de cobre puro, disjuntores normatizados e dispositivos de proteção contra surtos (DPS).',
      icon: Cpu,
    },
    {
      number: '03',
      title: 'Atendimento Rápido & Pontual',
      description: 'Diagnósticos precisos com instrumentos modernos de medição elétrica e agilidade no início e conclusão da sua instalação.',
      icon: Clock,
    },
    {
      number: '04',
      title: 'Garantia Formal nos Serviços',
      description: 'Total transparência em cada projeto, com teste de continuidade, dimensionamento de cargas e suporte completo pós-entrega.',
      icon: Award,
    },
  ];

  return (
    <section id="diferenciais" className="relative py-12 sm:py-16 bg-[#0a0a0a] border-t border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Zap className="h-3.5 w-3.5 fill-amber-400" />
            <span>Padrão de Excelência GC</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            Por Que Confiar na <span className="gold-gradient-text">GC Elétrica</span>?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Eletricidade exige responsabilidade e conhecimento técnico. Trazemos soluções completas com acabamento impecável.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {differentials.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#111111] p-5 transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-2xl font-black text-zinc-700 group-hover:text-amber-400 transition-colors">
                      {item.number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                  <span>Solução Garantida</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
