import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { CompanySettings } from '../types';

interface ContactSectionProps {
  settings: CompanySettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [service, setService] = useState('Instalação Residencial');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const text = `⚡ *CONTATO VIA SITE - GC ELÉTRICA* ⚡\n\n` +
      `👤 *Nome:* ${name}\n` +
      `📱 *Telefone:* ${userPhone}\n` +
      `🔧 *Serviço de Interesse:* ${service}\n` +
      `💬 *Mensagem:* ${message || 'Solicito contato para orçamento'}\n`;

    setSubmitted(true);
    setTimeout(() => {
      window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
      setSubmitted(false);
      setName('');
      setUserPhone('');
      setMessage('');
    }, 1000);
  };

  const getDirectWhatsApp = () => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Olá! Gostaria de falar com a equipe da GC Elétrica.')}`;
  };

  return (
    <section id="contato" className="relative py-12 sm:py-16 bg-[#0a0a0a] border-t border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Company Contact Information */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Atendimento & Localização</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Fale Diretamente com a <span className="gold-gradient-text">GC Elétrica</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                Estamos prontos para atender você com máxima rapidez, transparência e segurança técnica.
              </p>
            </div>

            <div className="space-y-3">
              {/* WhatsApp Item */}
              <a
                href={getDirectWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-[#121212] p-4 hover:border-amber-500/40 hover:bg-zinc-900 transition-all group"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                  <MessageCircle className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    WhatsApp Comercial & Emergencial
                  </div>
                  <div className="font-display text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {settings.phone || settings.whatsapp}
                  </div>
                </div>
              </a>

              {/* Email Item */}
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-[#121212] p-4 hover:border-amber-500/40 hover:bg-zinc-900 transition-all group"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    E-mail Direto
                  </div>
                  <div className="font-display text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {settings.email}
                  </div>
                </div>
              </a>

              {/* Coverage Area */}
              <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-[#121212] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Região Atendida
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-zinc-200">
                    {settings.city}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-6 shadow-xl">
            <h3 className="font-display text-lg font-bold text-white mb-1">
              Envie sua Mensagem
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Preencha os campos abaixo para abrir uma conversa direta no WhatsApp.
            </p>

            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 animate-bounce" />
                <h4 className="font-display text-base font-bold text-white">
                  Conectando ao WhatsApp...
                </h4>
                <p className="text-xs text-zinc-400">
                  Você será redirecionado para enviar sua solicitação.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Seu WhatsApp / Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="(DDD) 99999-9999"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tipo de Serviço
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs sm:text-sm text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Instalação Residencial">Instalação Residencial</option>
                    <option value="Quadro de Distribuição">Quadro de Distribuição</option>
                    <option value="Energia Solar">Energia Solar</option>
                    <option value="Iluminação LED">Iluminação LED</option>
                    <option value="Industrial / Comercial">Industrial / Comercial</option>
                    <option value="Emergência 24h">Emergência 24h</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Como podemos ajudar?
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Descreva o que precisa ser feito..."
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 py-3 text-xs sm:text-sm font-bold text-black shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>Iniciar Atendimento via WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
