import React, { useState, useRef } from 'react';
import {
  Zap,
  Lock,
  Unlock,
  X,
  Upload,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Film,
  Layers,
  Phone,
  Check,
  AlertCircle,
  RotateCcw,
  Eye,
  EyeOff,
  Tag,
  Tags,
  Calculator,
} from 'lucide-react';
import { ServiceItem, CompanySettings, SimulatorConfig } from '../types';
import {
  verifyAdminPassword,
  compressImageFile,
  saveServices,
  saveSettings,
  saveCategories,
  saveSimulatorConfig,
  setAdminLoggedIn,
} from '../utils/storage';
import { DEFAULT_SERVICES, DEFAULT_CATEGORIES, DEFAULT_SIMULATOR_CONFIG } from '../data/defaultData';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  settings: CompanySettings;
  setSettings: React.Dispatch<React.SetStateAction<CompanySettings>>;
  simulatorConfig: SimulatorConfig;
  setSimulatorConfig: React.Dispatch<React.SetStateAction<SimulatorConfig>>;
  initialTab?: 'vitrine' | 'categorias' | 'simulador' | 'video' | 'settings';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  services,
  setServices,
  categories,
  setCategories,
  settings,
  setSettings,
  simulatorConfig,
  setSimulatorConfig,
  initialTab = 'vitrine',
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'vitrine' | 'categorias' | 'simulador' | 'video' | 'settings'>(initialTab);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Category management states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryMsg, setCategoryMsg] = useState('');
  const [showQuickAddCategory, setShowQuickAddCategory] = useState(false);
  const [quickCategoryInput, setQuickCategoryInput] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Service deletion confirmation state
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  // Service form states
  const [isEditingService, setIsEditingService] = useState<string | null>(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Instalação Residencial');
  const [customCategory, setCustomCategory] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceBadge, setServiceBadge] = useState('');
  const [serviceImageUrl, setServiceImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video form states
  const [tempVideoUrl, setTempVideoUrl] = useState(settings.videoUrl);
  const [tempVideoTitle, setTempVideoTitle] = useState(settings.videoTitle);
  const [tempVideoSubtitle, setTempVideoSubtitle] = useState(settings.videoSubtitle);
  const [videoSuccessMsg, setVideoSuccessMsg] = useState('');
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Settings form states
  const [tempWhatsApp, setTempWhatsApp] = useState(settings.whatsapp);
  const [tempPhone, setTempPhone] = useState(settings.phone);
  const [tempEmail, setTempEmail] = useState(settings.email);
  const [tempSlogan, setTempSlogan] = useState(settings.slogan);
  const [tempCity, setTempCity] = useState(settings.city);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');

  // Simulator management states
  const [simulatorTitle, setSimulatorTitle] = useState(simulatorConfig.title);
  const [simulatorSubtitle, setSimulatorSubtitle] = useState(simulatorConfig.subtitle);
  const [newPropertyType, setNewPropertyType] = useState('');
  const [newServiceType, setNewServiceType] = useState('');
  const [newUrgencyOption, setNewUrgencyOption] = useState('');
  const [editingPropertyIndex, setEditingPropertyIndex] = useState<number | null>(null);
  const [editingPropertyText, setEditingPropertyText] = useState('');
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [editingServiceText, setEditingServiceText] = useState('');
  const [editingUrgencyIndex, setEditingUrgencyIndex] = useState<number | null>(null);
  const [editingUrgencyText, setEditingUrgencyText] = useState('');
  const [simulatorDeleteTarget, setSimulatorDeleteTarget] = useState<{
    type: 'property' | 'service' | 'urgency';
    index: number;
    value: string;
  } | null>(null);
  const [simulatorSuccessMsg, setSimulatorSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await verifyAdminPassword(password)) {
      setAdminLoggedIn(true);
      setIsAdminLoggedIn(true);
      setAuthError('');
      setPassword('');
      if (initialTab) {
        setActiveTab(initialTab);
      }
    } else {
      setAuthError('Senha incorreta.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminLoggedIn(false);
    setPassword('');
    onClose();
  };

  // Image upload handling
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      // Compress image for localStorage resilience
      const base64 = await compressImageFile(file, 1000, 0.82);
      setServiceImageUrl(base64);
      setImagePreview(base64);
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      alert('Não foi possível processar a imagem selecionada.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Video upload handling
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setTempVideoUrl(url);
  };

  const resetServiceForm = () => {
    setIsEditingService(null);
    setServiceTitle('');
    setServiceCategory('Instalação Residencial');
    setCustomCategory('');
    setServiceDescription('');
    setServiceBadge('');
    setServiceImageUrl('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartEditService = (service: ServiceItem) => {
    setIsEditingService(service.id);
    setServiceTitle(service.title);
    setServiceCategory(service.category);
    setServiceDescription(service.description);
    setServiceBadge(service.badge || '');
    setServiceImageUrl(service.imageUrl);
    setImagePreview(service.imageUrl);
    setActiveTab('vitrine');
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = serviceImageUrl || imagePreview;

    if (!serviceTitle.trim()) {
      alert('Por favor, informe o título do serviço.');
      return;
    }
    if (!finalImage) {
      alert('Por favor, faça upload de uma foto ou insira a URL da imagem.');
      return;
    }

    const finalCategory = serviceCategory === 'Outro' && customCategory.trim() 
      ? customCategory.trim() 
      : serviceCategory;

    let updatedList: ServiceItem[];

    if (isEditingService) {
      updatedList = services.map((s) =>
        s.id === isEditingService
          ? {
              ...s,
              title: serviceTitle.trim(),
              category: finalCategory,
              description: serviceDescription.trim(),
              badge: serviceBadge.trim() || undefined,
              imageUrl: finalImage,
            }
          : s
      );
    } else {
      const newService: ServiceItem = {
        id: `srv-${Date.now()}`,
        title: serviceTitle.trim(),
        category: finalCategory,
        description: serviceDescription.trim() || 'Serviço elétrico especializado com garantia GC Elétrica.',
        badge: serviceBadge.trim() || undefined,
        imageUrl: finalImage,
        order: services.length + 1,
        createdAt: new Date().toISOString(),
      };
      updatedList = [...services, newService];
    }

    setServices(updatedList);
    saveServices(updatedList);
    resetServiceForm();
  };

  // Service deletion handlers (In-UI confirmation, no window.confirm)
  const handleRequestDeleteService = (id: string) => {
    setServiceToDelete(id);
  };

  const handleConfirmDeleteService = () => {
    if (!serviceToDelete) return;
    const updatedList = services.filter((s) => s.id !== serviceToDelete);
    setServices(updatedList);
    saveServices(updatedList);
    if (isEditingService === serviceToDelete) resetServiceForm();
    setServiceToDelete(null);
  };

  const handleCancelDeleteService = () => {
    setServiceToDelete(null);
  };

  const handleMoveService = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const copy = [...services];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    // Reassign order
    const reordered = copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    setServices(reordered);
    saveServices(reordered);
  };

  // Category handlers: Include Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryMsg('Por favor, digite o nome da categoria.');
      setTimeout(() => setCategoryMsg(''), 3000);
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setCategoryMsg(`A categoria "${trimmed}" já existe.`);
      setTimeout(() => setCategoryMsg(''), 3000);
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    saveCategories(updated);
    setNewCategoryName('');
    setCategoryMsg(`Categoria "${trimmed}" incluída com sucesso!`);
    setTimeout(() => setCategoryMsg(''), 3000);
  };

  // Quick Category add from service form
  const handleQuickAddCategory = () => {
    const trimmed = quickCategoryInput.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setServiceCategory(trimmed);
      setShowQuickAddCategory(false);
      setQuickCategoryInput('');
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    saveCategories(updated);
    setServiceCategory(trimmed);
    setQuickCategoryInput('');
    setShowQuickAddCategory(false);
  };

  // In-UI Category deletion handlers (No window.confirm!)
  const handleRequestDeleteCategory = (catToDelete: string) => {
    if (categories.length <= 1) {
      setCategoryMsg('Você precisa manter pelo menos 1 categoria.');
      setTimeout(() => setCategoryMsg(''), 3000);
      return;
    }
    setCategoryToDelete(catToDelete);
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    const cat = categoryToDelete;
    const updatedCategories = categories.filter((c) => c !== cat);
    const fallbackCat = updatedCategories[0] || 'Geral';

    if (updatedCategories.length === 0) {
      updatedCategories.push('Geral');
    }

    // Reassign services that were using this category
    const servicesUsingCat = services.filter((s) => s.category === cat);
    if (servicesUsingCat.length > 0) {
      const updatedServices = services.map((s) =>
        s.category === cat ? { ...s, category: fallbackCat } : s
      );
      setServices(updatedServices);
      saveServices(updatedServices);
    }

    setCategories(updatedCategories);
    saveCategories(updatedCategories);

    if (serviceCategory === cat) {
      setServiceCategory(fallbackCat);
    }

    setCategoryToDelete(null);
    setCategoryMsg(`Categoria "${cat}" excluída com sucesso!`);
    setTimeout(() => setCategoryMsg(''), 3000);
  };

  const handleCancelDeleteCategory = () => {
    setCategoryToDelete(null);
  };

  const handleRestoreDefaultCategories = () => {
    setCategories(DEFAULT_CATEGORIES);
    saveCategories(DEFAULT_CATEGORIES);
    setCategoryMsg('Categorias padrão restauradas!');
    setTimeout(() => setCategoryMsg(''), 3000);
  };

  const handleRestoreDefaultServices = () => {
    setServices(DEFAULT_SERVICES);
    saveServices(DEFAULT_SERVICES);
    resetServiceForm();
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CompanySettings = {
      ...settings,
      videoUrl: tempVideoUrl.trim() || settings.videoUrl,
      videoTitle: tempVideoTitle.trim() || settings.videoTitle,
      videoSubtitle: tempVideoSubtitle.trim() || settings.videoSubtitle,
    };
    setSettings(updated);
    saveSettings(updated);
    setVideoSuccessMsg('Vídeo MP4 atualizado com sucesso!');
    setTimeout(() => setVideoSuccessMsg(''), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CompanySettings = {
      ...settings,
      whatsapp: tempWhatsApp.trim(),
      phone: tempPhone.trim(),
      email: tempEmail.trim(),
      slogan: tempSlogan.trim(),
      city: tempCity.trim(),
    };
    setSettings(updated);
    saveSettings(updated);
    setSettingsSuccessMsg('Configurações salvas com sucesso!');
    setTimeout(() => setSettingsSuccessMsg(''), 3000);
  };

  // 1. Property Type Handlers (Incluir, Alterar, Excluir)
  const handleAddPropertyType = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPropertyType.trim();
    if (!trimmed) return;
    if (simulatorConfig.propertyTypes.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      setSimulatorSuccessMsg(`O tipo de imóvel "${trimmed}" já está na lista.`);
      setTimeout(() => setSimulatorSuccessMsg(''), 3000);
      return;
    }
    const updated: SimulatorConfig = {
      ...simulatorConfig,
      propertyTypes: [...simulatorConfig.propertyTypes, trimmed],
    };
    setSimulatorConfig(updated);
    saveSimulatorConfig(updated);
    setNewPropertyType('');
    setSimulatorSuccessMsg(`Tipo de imóvel "${trimmed}" incluído com sucesso!`);
    setTimeout(() => setSimulatorSuccessMsg(''), 3000);
  };

  const handleStartEditProperty = (index: number) => {
    setEditingPropertyIndex(index);
    setEditingPropertyText(simulatorConfig.propertyTypes[index] || '');
  };

  const handleSaveEditProperty = (index: number) => {
    const trimmed = editingPropertyText.trim();
    if (!trimmed) return;
    const copy = [...simulatorConfig.propertyTypes];
    copy[index] = trimmed;
    const updated: SimulatorConfig = {
      ...simulatorConfig,
      propertyTypes: copy,
    };
    setSimulatorConfig(updated);
    saveSimulatorConfig(updated);
    setEditingPropertyIndex(null);
    setSimulatorSuccessMsg('Tipo de imóvel alterado com sucesso!');
    setTimeout(() => setSimulatorSuccessMsg(''), 3000);
  };

  // 2. Service Type Handlers (Incluir, Alterar, Excluir)
  const handleAddServiceType = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newServiceType.trim();
    if (!trimmed) return;
    if (simulatorConfig.serviceTypes.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSimulatorSuccessMsg(`O serviço "${trimmed}" já está na lista.`);
      setTimeout(() => setSimulatorSuccessMsg(''), 3000);
      return;
    }
    const updated: SimulatorConfig = {
      ...simulatorConfig,
      serviceTypes: [...simulatorConfig.serviceTypes, trimmed],
    };
    setSimulatorConfig(updated);
    saveSimulatorConfig(updated);
    setNewServiceType('');
    setSimulatorSuccessMsg(`Serviço "${trimmed}" incluído com sucesso!`);
    setTimeout(() => setSimulatorSuccessMsg(''), 3000);
  };

  const handleStartEditServiceType = (index: number) => {
    setEditingServiceIndex(index);
    setEditingServiceText(simulatorConfig.serviceTypes[index] || '');
  };

  const handleSaveEditServiceType = (index: number) => {
    const trimmed = editingServiceText.trim();
    if (!trimmed) return;
    const copy = [...simulatorConfig.serviceTypes];
    copy[index] = trimmed;
    const updated: SimulatorConfig = {
      ...simulatorConfig,
      serviceTypes: copy,
    };
    setSimulatorConfig(updated);
    saveSimulatorConfig(updated);
    setEditingServiceIndex(null);
    setSimulatorSuccessMsg('Serviço alterado com sucesso!');
    setTimeout(() => setSimulatorSuccessMsg(''), 3000);
  };

  // 3. Urgency / Prazo Handlers (Incluir, Alterar, Excluir)
  const handleAddUrgencyOption = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newUrgencyOption.trim();
    if (!trimmed) return;
    if (simulatorConfig.urgencyOptions.some((u) => u.toLowerCase() === trimmed.toLowerCase())) {
      setSimulatorSuccessMsg(`O prazo "${trimmed}" já está na lista.`);
      setTimeout(() => setSimulatorSuccessMsg(''), 3000);
      return;
    }
    const updated: SimulatorConfig = {
      ...simulatorConfig,
      urgencyOptions: [...simulatorConfig.urgencyOptions, trimmed],
    };
    setSimulatorConfig(updated);
    saveSimulatorConfig(updated);
    setNewUrgencyOption('');
    setSimulatorSuccessMsg(`Prazo "${trimmed}" incluído com sucesso!`);
    setTimeout(() => setSimulatorSuccessMsg(''), 3000);
  };

  const handleStartEditUrgency = (index: number) => {
    setEditingUrgencyIndex(index);
    setEditingUrgencyText(simulatorConfig.urgencyOptions[index] || '');
  };

  const handleSaveEditUrgency = (index: number) => {
    const trimmed = editingUrgencyText.trim();
    if (!trimmed) return;
    const copy = [...simulatorConfig.urgencyOptions];
    copy[index] = trimmed;
    const updated: SimulatorConfig = {
      ...simulatorConfig,
      urgencyOptions: copy,
    };
    setSimulatorConfig(updated);
    saveSimulatorConfig(updated);
    setEditingUrgencyIndex(null);
    setSimulatorSuccessMsg('Prazo alterado com sucesso!');
    setTimeout(() => setSimulatorSuccessMsg(''), 3000);
  };

  // In-UI Confirmation for simulator deletions (No window.confirm!)
  const handleConfirmSimulatorDelete = () => {
    if (!simulatorDeleteTarget) return;
    const { type, index, value } = simulatorDeleteTarget;
    let updated: SimulatorConfig = { ...simulatorConfig };

    if (type === 'property') {
      if (simulatorConfig.propertyTypes.length <= 1) {
        setSimulatorSuccessMsg('É obrigatório manter pelo menos 1 tipo de imóvel.');
        setTimeout(() => setSimulatorSuccessMsg(''), 3000);
        setSimulatorDeleteTarget(null);
        return;
      }
      updated.propertyTypes = simulatorConfig.propertyTypes.filter((_, i) => i !== index);
    } else if (type === 'service') {
      if (simulatorConfig.serviceTypes.length <= 1) {
        setSimulatorSuccessMsg('É obrigatório manter pelo menos 1 serviço.');
        setTimeout(() => setSimulatorSuccessMsg(''), 3000);
        setSimulatorDeleteTarget(null);
        return;
      }
      updated.serviceTypes = simulatorConfig.serviceTypes.filter((_, i) => i !== index);
    } else if (type === 'urgency') {
      if (simulatorConfig.urgencyOptions.length <= 1) {
        setSimulatorSuccessMsg('É obrigatório manter pelo menos 1 prazo.');
        setTimeout(() => setSimulatorSuccessMsg(''), 3000);
        setSimulatorDeleteTarget(null);
        return;
      }
      updated.urgencyOptions = simulatorConfig.urgencyOptions.filter((_, i) => i !== index);
    }

    setSimulatorConfig(updated);
    saveSimulatorConfig(updated);
    setSimulatorDeleteTarget(null);
    setSimulatorSuccessMsg(`Item "${value}" excluído com sucesso!`);
    setTimeout(() => setSimulatorSuccessMsg(''), 3000);
  };

  const handleMovePropertyType = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= simulatorConfig.propertyTypes.length) return;
    const copy = [...simulatorConfig.propertyTypes];
    const [item] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, item);
    const updated = { ...simulatorConfig, propertyTypes: copy };
    setSimulatorConfig(updated);
    saveSimulatorConfig(updated);
  };

  const handleMoveServiceType = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= simulatorConfig.serviceTypes.length) return;
    const copy = [...simulatorConfig.serviceTypes];
    const [item] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, item);
    const updated = { ...simulatorConfig, serviceTypes: copy };
    setSimulatorConfig(updated);
    saveSimulatorConfig(updated);
  };

  const handleMoveUrgencyOption = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= simulatorConfig.urgencyOptions.length) return;
    const copy = [...simulatorConfig.urgencyOptions];
    const [item] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, item);
    const updated = { ...simulatorConfig, urgencyOptions: copy };
    setSimulatorConfig(updated);
    saveSimulatorConfig(updated);
  };

  const handleSaveSimulatorHeader = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SimulatorConfig = {
      ...simulatorConfig,
      title: simulatorTitle.trim() || DEFAULT_SIMULATOR_CONFIG.title,
      subtitle: simulatorSubtitle.trim() || DEFAULT_SIMULATOR_CONFIG.subtitle,
    };
    setSimulatorConfig(updated);
    saveSimulatorConfig(updated);
    setSimulatorSuccessMsg('Títulos do simulador atualizados com sucesso!');
    setTimeout(() => setSimulatorSuccessMsg(''), 3000);
  };

  const handleRestoreDefaultSimulator = () => {
    setSimulatorConfig(DEFAULT_SIMULATOR_CONFIG);
    saveSimulatorConfig(DEFAULT_SIMULATOR_CONFIG);
    setSimulatorTitle(DEFAULT_SIMULATOR_CONFIG.title);
    setSimulatorSubtitle(DEFAULT_SIMULATOR_CONFIG.subtitle);
    setSimulatorSuccessMsg('Opções do simulador restauradas para o padrão inicial!');
    setTimeout(() => setSimulatorSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-amber-500/40 bg-[#0e0e0e] shadow-2xl shadow-amber-500/20 text-slate-100 my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-[#141414] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Zap className="h-4 w-4 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Painel Administrativo GC Elétrica</span>
                {isAdminLoggedIn && (
                  <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 text-[10px] text-emerald-400 font-semibold uppercase">
                    Autenticado
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-xs text-zinc-400 hover:text-red-400 px-2 py-1 rounded transition-colors"
                title="Sair da Administração"
              >
                Sair
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* NOT LOGGED IN: Password prompt */}
        {!isAdminLoggedIn ? (
          <div className="p-6 sm:p-8">
            <div className="mx-auto max-w-sm text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Lock className="h-7 w-7" />
              </div>
              <h4 className="font-display text-lg font-bold text-white">
                Acesso Restrito
              </h4>
              <p className="mt-1 text-xs text-zinc-400">
                Digite a senha de administrador para gerenciar fotos da vitrine, vídeo em MP4 e configurações.
              </p>

              <form onSubmit={handleLogin} className="mt-5 space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha..."
                    autoFocus
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    aria-label="Alternar visualização da senha"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {authError && (
                  <div className="flex items-center gap-1.5 text-left text-xs text-red-400 bg-red-950/40 border border-red-800/40 p-2.5 rounded-lg">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-sm font-bold text-black shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Entrar no Painel</span>
                </button>

                <p className="text-[11px] text-zinc-500 pt-1">
                  Acesso configurado para a senha solicitada.
                </p>
              </form>
            </div>
          </div>
        ) : (
          /* LOGGED IN: Full Dashboard */
          <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-zinc-800 pb-3 mb-5 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('vitrine')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  activeTab === 'vitrine'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Vitrine ({services.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('categorias')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  activeTab === 'categorias'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Tags className="h-3.5 w-3.5" />
                <span>Categorias ({categories.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('simulador')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  activeTab === 'simulador'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>Simulador de Orçamento</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  activeTab === 'video'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Film className="h-3.5 w-3.5" />
                <span>Vídeo MP4</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Contatos & Dados</span>
              </button>
            </div>

            {/* TAB 1: Vitrine de Serviços */}
            {activeTab === 'vitrine' && (
              <div className="space-y-6">
                {/* Add / Edit Service Form */}
                <form
                  onSubmit={handleSaveService}
                  className="rounded-xl border border-zinc-800 bg-[#121212] p-4 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <h4 className="font-display text-sm font-bold text-amber-400 flex items-center gap-1.5">
                      {isEditingService ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      <span>{isEditingService ? 'Editar Serviço da Vitrine' : 'Adicionar Nova Imagem / Serviço'}</span>
                    </h4>
                    {isEditingService && (
                      <button
                        type="button"
                        onClick={resetServiceForm}
                        className="text-xs text-zinc-400 hover:text-white"
                      >
                        Cancelar Edição
                      </button>
                    )}
                  </div>

                  {/* Image selection: File upload or URL */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Foto do Serviço (Upload do Celular/PC ou URL)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                      {/* File picker button */}
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                          id="service-image-upload"
                        />
                        <label
                          htmlFor="service-image-upload"
                          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-700 hover:border-amber-500 rounded-xl p-4 bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-colors text-center"
                        >
                          <Upload className="h-5 w-5 text-amber-400" />
                          <span className="text-xs font-medium text-zinc-200">
                            {isUploadingImage ? 'Processando foto...' : 'Escolher foto da galeria'}
                          </span>
                          <span className="text-[10px] text-zinc-500">JPG, PNG ou WebP</span>
                        </label>
                      </div>

                      {/* Image Preview or URL input */}
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={serviceImageUrl.startsWith('data:') ? '' : serviceImageUrl}
                          onChange={(e) => {
                            setServiceImageUrl(e.target.value);
                            setImagePreview(e.target.value);
                          }}
                          placeholder="Ou cole a URL da imagem aqui..."
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                        />

                        {imagePreview && (
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-amber-500/30 bg-black">
                            <img
                              src={imagePreview}
                              alt="Pré-visualização"
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setServiceImageUrl('');
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              className="absolute top-1.5 right-1.5 rounded-full bg-black/70 p-1 text-zinc-300 hover:text-white"
                              title="Remover imagem"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Título do Serviço *
                      </label>
                      <input
                        type="text"
                        value={serviceTitle}
                        onChange={(e) => setServiceTitle(e.target.value)}
                        placeholder="Ex: Instalação de Padrão de Entrada"
                        required
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-zinc-300">
                          Categoria *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowQuickAddCategory(!showQuickAddCategory)}
                          className="text-[10px] font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          <span>{showQuickAddCategory ? 'Fechar' : '+ Nova Categoria'}</span>
                        </button>
                      </div>

                      {showQuickAddCategory && (
                        <div className="mb-2 p-2 rounded-lg border border-amber-500/40 bg-[#1a1a1a] flex gap-1.5">
                          <input
                            type="text"
                            value={quickCategoryInput}
                            onChange={(e) => setQuickCategoryInput(e.target.value)}
                            placeholder="Nome da categoria..."
                            className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleQuickAddCategory}
                            className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 shrink-0"
                          >
                            Adicionar
                          </button>
                        </div>
                      )}

                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Badge & Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Destaque / Etiqueta (opcional)
                      </label>
                      <input
                        type="text"
                        value={serviceBadge}
                        onChange={(e) => setServiceBadge(e.target.value)}
                        placeholder="Ex: Mais Solicitado, Destaque"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Descrição Breve
                      </label>
                      <input
                        type="text"
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        placeholder="Breve descrição dos materiais, normas ou benefícios..."
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isUploadingImage}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>{isEditingService ? 'Salvar Alterações' : 'Adicionar à Vitrine'}</span>
                    </button>
                  </div>
                </form>

                {/* List of Current Services */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Serviços Atuais na Vitrine ({services.length})
                    </h4>
                    <button
                      type="button"
                      onClick={handleRestoreDefaultServices}
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Restaurar Padrões Iniciais</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {services.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#141414] p-2.5 hover:border-zinc-700 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-14 w-16 shrink-0 rounded-lg overflow-hidden bg-black border border-zinc-700">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                              {item.category}
                            </span>
                            {item.badge && (
                              <span className="rounded bg-amber-500/20 text-amber-300 px-1.5 py-0.2 text-[9px] font-bold">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                          <p className="text-[11px] text-zinc-400 truncate">{item.description}</p>
                        </div>

                        {/* Reorder and Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveService(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 disabled:opacity-20"
                            title="Mover para cima"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveService(index, 'down')}
                            disabled={index === services.length - 1}
                            className="p-1 rounded text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 disabled:opacity-20"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEditService(item)}
                            className="p-1.5 rounded text-zinc-400 hover:text-amber-400 hover:bg-zinc-800"
                            title="Editar"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRequestDeleteService(item.id)}
                            className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                            title="Excluir"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* In-UI Service Deletion Confirmation (No window.confirm) */}
                  {serviceToDelete && (
                    <div className="mt-3 rounded-xl border border-red-500/50 bg-red-950/30 p-3.5 space-y-2.5 animate-in fade-in">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                        <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                        <span>Confirmar exclusão deste serviço da vitrine?</span>
                      </div>
                      <p className="text-[11px] text-zinc-300">
                        O serviço será removido imediatamente da vitrine do aplicativo.
                      </p>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleCancelDeleteService}
                          className="px-3 py-1 text-xs rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmDeleteService}
                          className="px-3 py-1 text-xs rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
                        >
                          Confirmar Exclusão
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: Gerenciamento de Categorias (Incluir e Excluir) */}
            {activeTab === 'categorias' && (
              <div className="space-y-6">
                {/* Form to Include Category */}
                <div className="rounded-xl border border-zinc-800 bg-[#121212] p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Incluir Nova Categoria</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Cadastre uma nova categoria para organizar as fotos e serviços da sua vitrine.
                  </p>

                  <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Ex: Câmeras & CFTV, Padrão de Entrada, Automação..."
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Incluir Categoria</span>
                    </button>
                  </form>

                  {categoryMsg && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-lg">
                      <Check className="h-4 w-4" />
                      <span>{categoryMsg}</span>
                    </div>
                  )}
                </div>

                {/* List and Delete Categories */}
                <div className="rounded-xl border border-zinc-800 bg-[#121212] p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                    <div>
                      <h4 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                        <Tags className="h-4 w-4 text-amber-400" />
                        <span>Categorias Ativas ({categories.length})</span>
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Use o botão de exclusão para remover categorias indesejadas.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRestoreDefaultCategories}
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Restaurar Padrões</span>
                    </button>
                  </div>

                  {/* In-UI Category Deletion Confirmation Card */}
                  {categoryToDelete && (
                    <div className="mt-3 rounded-xl border border-red-500/50 bg-red-950/30 p-4 space-y-2.5 animate-in fade-in">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs sm:text-sm font-bold text-white">
                            Excluir Categoria: <span className="text-amber-400">"{categoryToDelete}"</span>?
                          </h5>
                          <p className="text-[11px] text-zinc-300 mt-0.5">
                            {services.filter((s) => s.category === categoryToDelete).length > 0
                              ? `Existem ${services.filter((s) => s.category === categoryToDelete).length} serviço(s) nesta categoria. Eles serão mantidos e transferidos para "${categories.filter((c) => c !== categoryToDelete)[0] || 'Geral'}".`
                              : 'Esta categoria não possui serviços e será removida imediatamente da vitrine.'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleCancelDeleteCategory}
                          className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmDeleteCategory}
                          className="px-3.5 py-1.5 text-xs rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
                        >
                          Confirmar Exclusão
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="divide-y divide-zinc-800/80">
                    {categories.map((cat) => {
                      const serviceCount = services.filter((s) => s.category === cat).length;
                      return (
                        <div
                          key={cat}
                          className="flex items-center justify-between py-2.5 px-2 hover:bg-zinc-900/50 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Tag className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            <span className="text-xs sm:text-sm font-bold text-white truncate">
                              {cat}
                            </span>
                            <span className="text-[10px] font-medium text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full shrink-0">
                              {serviceCount} {serviceCount === 1 ? 'serviço' : 'serviços'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleRequestDeleteCategory(cat)}
                              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-red-500/30 transition-all"
                              title={`Excluir categoria "${cat}"`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Excluir</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Gerenciamento do Simulador de Orçamento Rápido (Alterar, Excluir e Incluir) */}
            {activeTab === 'simulador' && (
              <div className="space-y-6">
                {/* Header & Quick Explanation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <h4 className="font-display text-base font-bold text-amber-400 flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      <span>Gerenciador do Simulador de Orçamento</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Gerencie cada item que aparece no formulário do site. Você pode <strong className="text-amber-300">Incluir</strong> novas opções, <strong className="text-amber-300">Alterar</strong> nomes ou <strong className="text-amber-300">Excluir</strong> itens desnecessários.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRestoreDefaultSimulator}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-amber-400 border border-zinc-800 hover:border-amber-500/40 px-3 py-1.5 rounded-lg bg-zinc-900 self-start sm:self-auto transition-all shrink-0"
                    title="Restaurar a lista original de tipos, serviços e prazos"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Restaurar Padrões</span>
                  </button>
                </div>

                {/* Feedback Message */}
                {simulatorSuccessMsg && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 p-3 rounded-xl animate-in fade-in shadow-md">
                    <Check className="h-4 w-4 shrink-0 text-emerald-300" />
                    <span>{simulatorSuccessMsg}</span>
                  </div>
                )}

                {/* In-UI Simulator Delete Confirmation Box */}
                {simulatorDeleteTarget && (
                  <div className="rounded-xl border border-red-500/60 bg-red-950/40 p-4 space-y-2.5 animate-in fade-in shadow-lg">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-300">
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                      <span>Confirmar exclusão de "{simulatorDeleteTarget.value}"?</span>
                    </div>
                    <p className="text-xs text-zinc-300">
                      Este item será removido permanentemente da lista de seleção do formulário no site.
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-1.5">
                      <button
                        type="button"
                        onClick={() => setSimulatorDeleteTarget(null)}
                        className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmSimulatorDelete}
                        className="px-4 py-1.5 text-xs rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-md active:scale-95"
                      >
                        Confirmar Exclusão
                      </button>
                    </div>
                  </div>
                )}

                {/* 1. SEÇÃO: TIPO DE IMÓVEL */}
                <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-extrabold text-amber-400 border border-amber-500/40">
                        1
                      </span>
                      <h5 className="font-display text-sm font-bold text-white">
                        Tipo de Imóvel ({simulatorConfig.propertyTypes.length} opções)
                      </h5>
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      Aparece no campo 1 do simulador
                    </span>
                  </div>

                  {/* Form to Include new property type */}
                  <form onSubmit={handleAddPropertyType} className="flex gap-2">
                    <input
                      type="text"
                      value={newPropertyType}
                      onChange={(e) => setNewPropertyType(e.target.value)}
                      placeholder="Incluir novo tipo (Ex: Chácara / Sítio, Galpão, Indústria)..."
                      className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black px-4 py-2 text-xs font-bold transition-all shadow-sm shrink-0 active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Incluir Tipo</span>
                    </button>
                  </form>

                  {/* List of property types */}
                  <div className="space-y-2">
                    {simulatorConfig.propertyTypes.map((item, index) => (
                      <div
                        key={`prop-${index}`}
                        className="rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-2.5 transition-all hover:border-zinc-700 hover:bg-zinc-900"
                      >
                        {editingPropertyIndex === index ? (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              value={editingPropertyText}
                              onChange={(e) => setEditingPropertyText(e.target.value)}
                              autoFocus
                              className="flex-1 rounded-lg border-2 border-amber-500 bg-black px-3 py-1.5 text-xs text-white focus:outline-none"
                            />
                            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                              <button
                                type="button"
                                onClick={() => handleSaveEditProperty(index)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-sm transition-all"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Salvar Alteração</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPropertyIndex(null)}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-400">
                                {index + 1}
                              </span>
                              <span className="text-xs font-semibold text-zinc-100 truncate">
                                {item}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Reorder buttons */}
                              <button
                                type="button"
                                onClick={() => handleMovePropertyType(index, 'up')}
                                disabled={index === 0}
                                className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-500"
                                title="Mover para cima"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMovePropertyType(index, 'down')}
                                disabled={index === simulatorConfig.propertyTypes.length - 1}
                                className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-500"
                                title="Mover para baixo"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>

                              {/* Alterar button */}
                              <button
                                type="button"
                                onClick={() => handleStartEditProperty(index)}
                                className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
                                title="Alterar o nome deste tipo de imóvel"
                              >
                                <Edit2 className="h-3 w-3" />
                                <span>Alterar</span>
                              </button>

                              {/* Excluir button */}
                              <button
                                type="button"
                                onClick={() => setSimulatorDeleteTarget({ type: 'property', index, value: item })}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-950/40 px-2.5 py-1 text-xs font-bold text-red-300 hover:bg-red-900/60 transition-colors"
                                title="Excluir este tipo de imóvel"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Excluir</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. SEÇÃO: SERVIÇOS PRINCIPAIS */}
                <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-extrabold text-amber-400 border border-amber-500/40">
                        2
                      </span>
                      <h5 className="font-display text-sm font-bold text-white">
                        Serviços Principais ({simulatorConfig.serviceTypes.length} opções)
                      </h5>
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      Aparece no campo 2 do simulador
                    </span>
                  </div>

                  {/* Form to Include new service type */}
                  <form onSubmit={handleAddServiceType} className="flex gap-2">
                    <input
                      type="text"
                      value={newServiceType}
                      onChange={(e) => setNewServiceType(e.target.value)}
                      placeholder="Incluir novo serviço (Ex: Instalação de DPS, Padrão de Entrada)..."
                      className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black px-4 py-2 text-xs font-bold transition-all shadow-sm shrink-0 active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Incluir Serviço</span>
                    </button>
                  </form>

                  {/* List of service types */}
                  <div className="space-y-2">
                    {simulatorConfig.serviceTypes.map((item, index) => (
                      <div
                        key={`serv-${index}`}
                        className="rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-2.5 transition-all hover:border-zinc-700 hover:bg-zinc-900"
                      >
                        {editingServiceIndex === index ? (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              value={editingServiceText}
                              onChange={(e) => setEditingServiceText(e.target.value)}
                              autoFocus
                              className="flex-1 rounded-lg border-2 border-amber-500 bg-black px-3 py-1.5 text-xs text-white focus:outline-none"
                            />
                            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                              <button
                                type="button"
                                onClick={() => handleSaveEditServiceType(index)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-sm transition-all"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Salvar Alteração</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingServiceIndex(null)}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-400">
                                {index + 1}
                              </span>
                              <span className="text-xs font-semibold text-zinc-100 truncate">
                                {item}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Reorder buttons */}
                              <button
                                type="button"
                                onClick={() => handleMoveServiceType(index, 'up')}
                                disabled={index === 0}
                                className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-500"
                                title="Mover para cima"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveServiceType(index, 'down')}
                                disabled={index === simulatorConfig.serviceTypes.length - 1}
                                className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-500"
                                title="Mover para baixo"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>

                              {/* Alterar button */}
                              <button
                                type="button"
                                onClick={() => handleStartEditServiceType(index)}
                                className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
                                title="Alterar o nome deste serviço"
                              >
                                <Edit2 className="h-3 w-3" />
                                <span>Alterar</span>
                              </button>

                              {/* Excluir button */}
                              <button
                                type="button"
                                onClick={() => setSimulatorDeleteTarget({ type: 'service', index, value: item })}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-950/40 px-2.5 py-1 text-xs font-bold text-red-300 hover:bg-red-900/60 transition-colors"
                                title="Excluir este serviço"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Excluir</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. SEÇÃO: PRAZO DESEJADO / URGÊNCIA */}
                <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-extrabold text-amber-400 border border-amber-500/40">
                        3
                      </span>
                      <h5 className="font-display text-sm font-bold text-white">
                        Prazos Desejados ({simulatorConfig.urgencyOptions.length} opções)
                      </h5>
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      Aparece no campo 3 do simulador
                    </span>
                  </div>

                  {/* Form to Include new urgency */}
                  <form onSubmit={handleAddUrgencyOption} className="flex gap-2">
                    <input
                      type="text"
                      value={newUrgencyOption}
                      onChange={(e) => setNewUrgencyOption(e.target.value)}
                      placeholder="Incluir novo prazo (Ex: Imediato / Plantão Noturno, 24 horas)..."
                      className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black px-4 py-2 text-xs font-bold transition-all shadow-sm shrink-0 active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Incluir Prazo</span>
                    </button>
                  </form>

                  {/* List of urgency options */}
                  <div className="space-y-2">
                    {simulatorConfig.urgencyOptions.map((item, index) => (
                      <div
                        key={`urg-${index}`}
                        className="rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-2.5 transition-all hover:border-zinc-700 hover:bg-zinc-900"
                      >
                        {editingUrgencyIndex === index ? (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              value={editingUrgencyText}
                              onChange={(e) => setEditingUrgencyText(e.target.value)}
                              autoFocus
                              className="flex-1 rounded-lg border-2 border-amber-500 bg-black px-3 py-1.5 text-xs text-white focus:outline-none"
                            />
                            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                              <button
                                type="button"
                                onClick={() => handleSaveEditUrgency(index)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-sm transition-all"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Salvar Alteração</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingUrgencyIndex(null)}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-400">
                                {index + 1}
                              </span>
                              <span className="text-xs font-semibold text-zinc-100 truncate">
                                {item}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Reorder buttons */}
                              <button
                                type="button"
                                onClick={() => handleMoveUrgencyOption(index, 'up')}
                                disabled={index === 0}
                                className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-500"
                                title="Mover para cima"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveUrgencyOption(index, 'down')}
                                disabled={index === simulatorConfig.urgencyOptions.length - 1}
                                className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-500"
                                title="Mover para baixo"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>

                              {/* Alterar button */}
                              <button
                                type="button"
                                onClick={() => handleStartEditUrgency(index)}
                                className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
                                title="Alterar o nome deste prazo"
                              >
                                <Edit2 className="h-3 w-3" />
                                <span>Alterar</span>
                              </button>

                              {/* Excluir button */}
                              <button
                                type="button"
                                onClick={() => setSimulatorDeleteTarget({ type: 'urgency', index, value: item })}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-950/40 px-2.5 py-1 text-xs font-bold text-red-300 hover:bg-red-900/60 transition-colors"
                                title="Excluir este prazo"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Excluir</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. SEÇÃO: TÍTULOS DO SIMULADOR */}
                <form onSubmit={handleSaveSimulatorHeader} className="rounded-2xl border border-zinc-800 bg-[#111111] p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[11px] font-extrabold text-amber-400 border border-amber-500/40">
                      4
                    </span>
                    <h5 className="font-display text-sm font-bold text-amber-400">
                      Textos de Apresentação do Formulário
                    </h5>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Título Principal do Bloco
                      </label>
                      <input
                        type="text"
                        value={simulatorTitle}
                        onChange={(e) => setSimulatorTitle(e.target.value)}
                        placeholder="Ex: Calcule seu Orçamento Rápido"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Subtítulo Explicativo
                      </label>
                      <input
                        type="text"
                        value={simulatorSubtitle}
                        onChange={(e) => setSimulatorSubtitle(e.target.value)}
                        placeholder="Selecione as opções do seu projeto..."
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black px-4 py-2 text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Salvar Textos</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: Configuração do Vídeo MP4 */}
            {activeTab === 'video' && (
              <form onSubmit={handleSaveVideo} className="space-y-4">
                <div className="rounded-xl border border-zinc-800 bg-[#121212] p-4 space-y-4">
                  <h4 className="font-display text-sm font-bold text-amber-400 flex items-center gap-1.5">
                    <Film className="h-4 w-4" />
                    <span>Configurações do Vídeo em MP4</span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    O vídeo fica localizado em destaque no início da página, logo acima da vitrine de fotos. Você pode alterar a URL do vídeo em MP4 ou fazer upload de um vídeo do seu dispositivo.
                  </p>

                  {/* Video URL */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Link / URL do Vídeo MP4
                    </label>
                    <input
                      type="url"
                      value={tempVideoUrl}
                      onChange={(e) => setTempVideoUrl(e.target.value)}
                      placeholder="https://exemplo.com/video.mp4"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Or local video file */}
                  <div>
                    <input
                      ref={videoFileInputRef}
                      type="file"
                      accept="video/mp4,video/*"
                      onChange={handleVideoFileChange}
                      className="hidden"
                      id="video-file-upload"
                    />
                    <label
                      htmlFor="video-file-upload"
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-200 cursor-pointer transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5 text-amber-400" />
                      <span>Fazer upload de vídeo MP4 do celular/computador</span>
                    </label>
                  </div>

                  {/* Video Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Título da Seção de Vídeo
                      </label>
                      <input
                        type="text"
                        value={tempVideoTitle}
                        onChange={(e) => setTempVideoTitle(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Subtítulo da Seção
                      </label>
                      <input
                        type="text"
                        value={tempVideoSubtitle}
                        onChange={(e) => setTempVideoSubtitle(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Video Preview */}
                  {tempVideoUrl && (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">
                        Prévia do Vídeo:
                      </label>
                      <div className="aspect-video w-full max-w-md rounded-xl overflow-hidden bg-black border border-zinc-800">
                        <video
                          src={tempVideoUrl}
                          controls
                          className="h-full w-full object-cover"
                        >
                          Seu navegador não suporta este formato.
                        </video>
                      </div>
                    </div>
                  )}

                  {videoSuccessMsg && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-lg">
                      <Check className="h-4 w-4" />
                      <span>{videoSuccessMsg}</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-black hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>Salvar Vídeo</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 3: Contatos e Configurações */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="rounded-xl border border-zinc-800 bg-[#121212] p-4 space-y-3.5">
                  <h4 className="font-display text-sm font-bold text-amber-400 flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    <span>Dados de Contato da GC Elétrica</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        WhatsApp (apenas números com DDD)
                      </label>
                      <input
                        type="text"
                        value={tempWhatsApp}
                        onChange={(e) => setTempWhatsApp(e.target.value)}
                        placeholder="Ex: 5511999999999"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-[10px] text-zinc-500">
                        Usado nos botões de solicitação de orçamento.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Telefone de Exibição
                      </label>
                      <input
                        type="text"
                        value={tempPhone}
                        onChange={(e) => setTempPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        E-mail de Contato
                      </label>
                      <input
                        type="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Slogan da Empresa
                      </label>
                      <input
                        type="text"
                        value={tempSlogan}
                        onChange={(e) => setTempSlogan(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Região / Área de Atendimento
                    </label>
                    <input
                      type="text"
                      value={tempCity}
                      onChange={(e) => setTempCity(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {settingsSuccessMsg && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-lg">
                      <Check className="h-4 w-4" />
                      <span>{settingsSuccessMsg}</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-black hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>Salvar Dados de Contato</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
