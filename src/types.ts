export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  badge?: string;
  order: number;
  createdAt: string;
}

export interface CompanySettings {
  name: string;
  slogan: string;
  logoUrl: string;
  whatsapp: string;
  phone: string;
  email: string;
  city: string;
  videoUrl: string;
  videoTitle: string;
  videoSubtitle: string;
  videoAutoplay: boolean;
  videoMuted: boolean;
  videoLoop: boolean;
}

export interface SimulatorConfig {
  title: string;
  subtitle: string;
  propertyTypes: string[];
  serviceTypes: string[];
  urgencyOptions: string[];
}
