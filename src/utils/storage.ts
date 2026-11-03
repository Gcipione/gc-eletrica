import { ServiceItem, CompanySettings, SimulatorConfig } from '../types';
import { remoteSelect, remoteRpc, isRemoteEnabled } from './supabase';
import {
  DEFAULT_SERVICES,
  DEFAULT_SETTINGS,
  DEFAULT_CATEGORIES,
  DEFAULT_SIMULATOR_CONFIG,
} from '../data/defaultData';

const SERVICES_KEY = 'gc_eletrica_services_v1';
const SETTINGS_KEY = 'gc_eletrica_settings_v1';
const CATEGORIES_KEY = 'gc_eletrica_categories_v1';
const SIMULATOR_KEY = 'gc_eletrica_simulator_v1';
const ADMIN_AUTH_KEY = 'gc_eletrica_admin_authed';
const ADMIN_PW_KEY = 'gc_eletrica_admin_pw';

const getAdminPw = (): string => {
  try { return sessionStorage.getItem(ADMIN_PW_KEY) || ''; } catch { return ''; }
};

// Grava no Supabase (se configurado e logado como admin). Falhas não quebram a UI.
const pushRemote = (fn: string, args: Record<string, unknown>): void => {
  const pw = getAdminPw();
  if (!isRemoteEnabled() || !pw) return;
  remoteRpc(fn, { p_password: pw, ...args }).catch((err) => {
    console.error(`Erro ao sincronizar (${fn}):`, err);
    alert('Não foi possível salvar no servidor. Verifique a conexão e tente novamente.');
  });
};

export const loadSimulatorConfig = (): SimulatorConfig => {
  try {
    const raw = localStorage.getItem(SIMULATOR_KEY);
    if (!raw) {
      saveSimulatorConfig(DEFAULT_SIMULATOR_CONFIG);
      return DEFAULT_SIMULATOR_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return {
      title: parsed.title || DEFAULT_SIMULATOR_CONFIG.title,
      subtitle: parsed.subtitle || DEFAULT_SIMULATOR_CONFIG.subtitle,
      propertyTypes: Array.isArray(parsed.propertyTypes) && parsed.propertyTypes.length > 0
        ? parsed.propertyTypes
        : DEFAULT_SIMULATOR_CONFIG.propertyTypes,
      serviceTypes: Array.isArray(parsed.serviceTypes) && parsed.serviceTypes.length > 0
        ? parsed.serviceTypes
        : DEFAULT_SIMULATOR_CONFIG.serviceTypes,
      urgencyOptions: Array.isArray(parsed.urgencyOptions) && parsed.urgencyOptions.length > 0
        ? parsed.urgencyOptions
        : DEFAULT_SIMULATOR_CONFIG.urgencyOptions,
    };
  } catch (err) {
    console.error('Erro ao carregar simulador:', err);
    return DEFAULT_SIMULATOR_CONFIG;
  }
};

export const saveSimulatorConfig = (config: SimulatorConfig): void => {
  try {
    localStorage.setItem(SIMULATOR_KEY, JSON.stringify(config));
    pushRemote('admin_save_simulator', { p_data: config });
  } catch (err) {
    console.error('Erro ao salvar simulador:', err);
  }
};

export const loadCategories = (): string[] => {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATEGORIES;
  } catch (err) {
    console.error('Erro ao carregar categorias:', err);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: string[]): void => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    pushRemote('admin_save_categories', { p_items: categories });
  } catch (err) {
    console.error('Erro ao salvar categorias:', err);
  }
};

export const loadServices = (): ServiceItem[] => {
  try {
    const raw = localStorage.getItem(SERVICES_KEY);
    if (!raw) {
      saveServices(DEFAULT_SERVICES);
      return DEFAULT_SERVICES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => a.order - b.order);
    }
    return DEFAULT_SERVICES;
  } catch (err) {
    console.error('Erro ao carregar serviços:', err);
    return DEFAULT_SERVICES;
  }
};

export const saveServices = (services: ServiceItem[]): void => {
  try {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
    pushRemote('admin_save_services', { p_items: services });
  } catch (err) {
    console.error('Erro ao salvar serviços:', err);
  }
};

export const loadSettings = (): CompanySettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.error('Erro ao carregar configurações:', err);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: CompanySettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    pushRemote('admin_save_settings', { p_data: settings });
  } catch (err) {
    console.error('Erro ao salvar configurações:', err);
  }
};

export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  const pw = password.trim();
  if (!pw || !isRemoteEnabled()) return false;
  try {
    const ok = await remoteRpc<boolean>('admin_check', { p_password: pw });
    if (ok === true) {
      try { sessionStorage.setItem(ADMIN_PW_KEY, pw); } catch { /* ignore */ }
    }
    return ok === true;
  } catch (err) {
    console.error('Erro ao verificar senha:', err);
    return false;
  }
};

export interface RemoteData {
  services: ServiceItem[];
  categories: string[];
  settings: CompanySettings;
  simulatorConfig: SimulatorConfig;
}

/** Carrega os dados do Supabase e atualiza o cache local. Retorna null se indisponível. */
export const fetchRemoteData = async (): Promise<RemoteData | null> => {
  if (!isRemoteEnabled()) return null;
  try {
    const [svc, cats, set, sim] = await Promise.all([
      remoteSelect<any[]>('services', 'select=*&order=sort_order.asc'),
      remoteSelect<any[]>('categories', 'select=*&order=sort_order.asc'),
      remoteSelect<any[]>('company_settings', 'select=*&id=eq.1'),
      remoteSelect<any[]>('simulator_config', 'select=*&id=eq.1'),
    ]);
    const data: RemoteData = {
      services: svc.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        imageUrl: r.image_url,
        badge: r.badge || undefined,
        order: r.sort_order,
        createdAt: r.created_at,
      })),
      categories: cats.map((r) => r.name),
      settings: set[0]
        ? {
            name: set[0].name,
            slogan: set[0].slogan,
            logoUrl: set[0].logo_url,
            whatsapp: set[0].whatsapp,
            phone: set[0].phone,
            email: set[0].email,
            city: set[0].city,
            videoUrl: set[0].video_url,
            videoTitle: set[0].video_title,
            videoSubtitle: set[0].video_subtitle,
            videoAutoplay: set[0].video_autoplay,
            videoMuted: set[0].video_muted,
            videoLoop: set[0].video_loop,
          }
        : DEFAULT_SETTINGS,
      simulatorConfig: sim[0]
        ? {
            title: sim[0].title,
            subtitle: sim[0].subtitle,
            propertyTypes: sim[0].property_types,
            serviceTypes: sim[0].service_types,
            urgencyOptions: sim[0].urgency_options,
          }
        : DEFAULT_SIMULATOR_CONFIG,
    };
    // cache local (sem reenviar ao servidor)
    localStorage.setItem(SERVICES_KEY, JSON.stringify(data.services));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data.categories));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
    localStorage.setItem(SIMULATOR_KEY, JSON.stringify(data.simulatorConfig));
    return data;
  } catch (err) {
    console.error('Erro ao carregar dados do Supabase:', err);
    return null;
  }
};

export const checkIsAdminLoggedIn = (): boolean => {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true' && !!getAdminPw();
};

export const setAdminLoggedIn = (isLoggedIn: boolean): void => {
  if (isLoggedIn) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_PW_KEY);
  }
};

/**
 * Resizes and compresses an uploaded image file into a base64 DataURL
 * suitable for localStorage persistence.
 */
export const compressImageFile = (file: File, maxWidth = 1200, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = elem.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
