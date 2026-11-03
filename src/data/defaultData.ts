import { ServiceItem, CompanySettings, SimulatorConfig } from '../types';

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Quadros de Distribuição & Disjuntores',
    description: 'Montagem, organização e adequação de quadros de distribuição residencial e industrial conforme norma NR-10 e NBR 5410.',
    category: 'Quadros & Painéis',
    imageUrl: '/assets/services/servico_quadro_eletrico.webp',
    badge: 'Mais Solicitado',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'srv-2',
    title: 'Energia Solar Fotovoltaica',
    description: 'Projetos completos de energia solar homologados na concessionária com microinversores e redução de até 95% na conta de luz.',
    category: 'Energia Solar',
    imageUrl: '/assets/services/servico_instalacao_solar.webp',
    badge: 'Alta Economia',
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'srv-3',
    title: 'Iluminação Arquitetônica em LED',
    description: 'Instalação de fitas LED embutidas, perfis de alumínio, sancas iluminadas e automação de iluminação residencial e comercial.',
    category: 'Iluminação & Design',
    imageUrl: '/assets/services/servico_iluminacao_led.webp',
    badge: 'Design Moderno',
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'srv-4',
    title: 'Manutenção Industrial & Comandos',
    description: 'Painéis de comando elétrico, CLPs, inversores de frequência e manutenção preventiva para linhas de produção e maquinários.',
    category: 'Industrial',
    imageUrl: '/assets/services/servico_manutencao_industrial.webp',
    badge: 'Especializado',
    order: 4,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_SETTINGS: CompanySettings = {
  name: 'GC Elétrica',
  slogan: 'Trazendo Soluções',
  logoUrl: '/assets/logo.webp',
  whatsapp: '5511999999999', // Usuário pode personalizar no Admin
  phone: '(11) 99999-9999',
  email: 'gceletrica7@gmail.com',
  city: 'Atendimento Regional e Grande São Paulo',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  videoTitle: 'Nosso Trabalho em Execução',
  videoSubtitle: 'Compromisso com precisão técnica, acabamento impecável e segurança total em cada instalação.',
  videoAutoplay: false,
  videoMuted: true,
  videoLoop: true,
};

export const DEFAULT_CATEGORIES: string[] = [
  'Quadros & Painéis',
  'Energia Solar',
  'Iluminação & Design',
  'Industrial',
  'Instalação Residencial',
  'Comercial & Predial',
];

export const DEFAULT_SIMULATOR_CONFIG: SimulatorConfig = {
  title: 'Calcule seu Orçamento Rápido',
  subtitle: 'Selecione as opções do seu projeto e receba uma resposta ágil direto no WhatsApp.',
  propertyTypes: [
    'Residencial (Casa / Apto)',
    'Comercial (Loja / Escritório)',
    'Industrial (Galpão / Fábrica)',
    'Condomínio (Predial)',
  ],
  serviceTypes: [
    'Quadro de Distribuição & Disjuntores',
    'Energia Solar Fotovoltaica',
    'Iluminação LED & Automação',
    'Revisão Elétrica Completa',
    'Instalação de Tomadas & Disjuntores',
    'Manutenção de Painel Industrial',
    'Emergência / Curto-Circuito',
    'Outro Serviço Especializado',
  ],
  urgencyOptions: [
    'Normal (Próximos dias)',
    'Urgente (Hoje / Amanhã)',
    'Planejamento de Obra Futura',
  ],
};
