import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { CompanySettings } from '../types';

interface FooterProps {
  settings: CompanySettings;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  isAdminLoggedIn,
  onOpenAdmin,
}) => {
  return (
    <footer className="border-t border-zinc-900 bg-[#060606] py-10 text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-900">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full gold-ring-frame p-[1.5px]">
              <div className="h-full w-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
              </div>
            </div>
            <div>
              <div className="font-display text-base font-extrabold text-white tracking-tight">
                GC <span className="gold-gradient-text">ELÉTRICA</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-400">
                {settings.slogan}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-400 font-medium">
            <a href="#inicio" className="hover:text-amber-400 transition-colors">
              Início
            </a>
            <a href="#video" className="hover:text-amber-400 transition-colors">
              Vídeo MP4
            </a>
            <a href="#vitrine" className="hover:text-amber-400 transition-colors">
              Vitrine de Serviços
            </a>
            <a href="#diferenciais" className="hover:text-amber-400 transition-colors">
              Diferenciais
            </a>
            <a href="#contato" className="hover:text-amber-400 transition-colors">
              Contato
            </a>
          </div>

          {/* Discreet Admin Trigger in Footer */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdmin}
              title={isAdminLoggedIn ? "Painel Admin (Ativo)" : "Administração Restrita"}
              aria-label="Acesso Administrativo"
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                isAdminLoggedIn
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              <Zap className="h-3 w-3 fill-current" />
              <span>{isAdminLoggedIn ? "Admin Ativo" : "Admin"}</span>
            </button>
          </div>
        </div>

        {/* Bottom details */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} GC Elétrica. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500/80" />
            <span>Execução em Conformidade com as Normas Regulamentadoras NR-10 e ABNT NBR 5410.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
