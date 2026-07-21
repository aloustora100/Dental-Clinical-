/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Settings,
  Activity,
  Layers,
  Sparkles,
  Shield,
  Clock,
  MapPin,
  MessageSquare,
  HelpCircle,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  RefreshCw,
  LogOut,
  Save,
  Download,
  Upload,
  Eye,
  Star,
  FileText
} from "lucide-react";
import { dataManager } from "../../utils/dataManager";
import {
  ClinicSettings,
  Service,
  BeforeAfterTreatment,
  Offer,
  Branch,
  Testimonial,
  FAQItem
} from "../../types";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  // Navigation tabs
  const tabs = [
    { id: "settings", label: "الإعدادات العامة", icon: Settings },
    { id: "services", label: "الخدمات العلاجية", icon: Activity },
    { id: "before-after", label: "قبل وبعد", icon: Layers },
    { id: "offers", label: "العروض الحصرية", icon: Sparkles },
    { id: "branches", label: "فروع العيادة", icon: MapPin },
    { id: "testimonials", label: "آراء المرضى", icon: MessageSquare },
    { id: "faqs", label: "الأسئلة الشائعة", icon: HelpCircle }
  ];

  const [activeTab, setActiveTab] = useState("settings");
  const [settingsSubTab, setSettingsSubTab] = useState("general");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ----------------------------------------------------
  // Reactive hooks for managing state inside each tab
  // ----------------------------------------------------
  const [settings, setSettings] = useState<ClinicSettings>(dataManager.getSettings());
  const [services, setServices] = useState<Service[]>(dataManager.getServices());
  const [beforeAfter, setBeforeAfter] = useState<BeforeAfterTreatment[]>(dataManager.getBeforeAfter());
  const [offers, setOffers] = useState<Offer[]>(dataManager.getOffers());
  const [branches, setBranches] = useState<Branch[]>(dataManager.getBranches());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(dataManager.getTestimonials());
  const [faqs, setFaqs] = useState<FAQItem[]>(dataManager.getFAQs());

  // Credentials change state
  const [adminUser, setAdminUser] = useState(dataManager.getAdminUser());
  const [adminPass, setAdminPass] = useState(dataManager.getAdminPass());

  // Editing state variables
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingBeforeAfter, setEditingBeforeAfter] = useState<BeforeAfterTreatment | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  // Helper to flash standard success alerts
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Helper to flash error alerts
  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  // ----------------------------------------------------
  // SETTINGS HANDLERS
  // ----------------------------------------------------
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dataManager.saveSettings(settings);
    dataManager.updateAdminCredentials(adminUser, adminPass);
    showSuccess("تم حفظ إعدادات العيادة وبيانات الدخول الجديدة بنجاح!");
  };

  // Backup & reset functions
  const handleExportBackup = () => {
    const backupStr = dataManager.exportBackup();
    const blob = new Blob([backupStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dental_clinic_backup_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    showSuccess("تم تصدير نسخة احتياطية من البيانات بنجاح!");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = dataManager.importBackup(content);
      if (success) {
        // Refresh local react hooks state
        setSettings(dataManager.getSettings());
        setServices(dataManager.getServices());
        setBeforeAfter(dataManager.getBeforeAfter());
        setOffers(dataManager.getOffers());
        setBranches(dataManager.getBranches());
        setTestimonials(dataManager.getTestimonials());
        setFaqs(dataManager.getFAQs());
        setAdminUser(dataManager.getAdminUser());
        setAdminPass(dataManager.getAdminPass());
        showSuccess("تم استيراد النسخة الاحتياطية وتحديث كافة بيانات الموقع فوراً!");
      } else {
        showError("فشل استيراد النسخة الاحتياطية. يرجى التأكد من اختيار ملف JSON صالح ومصدّر مسبقاً.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = () => {
    if (confirm("هل أنت متأكد من رغبتك في إعادة ضبط المصنع؟ سيؤدي ذلك إلى حذف كافة تعديلاتك واستعادة صور ونصوص العيادة الأصلية.")) {
      dataManager.resetToDefaults();
      setSettings(dataManager.getSettings());
      setServices(dataManager.getServices());
      setBeforeAfter(dataManager.getBeforeAfter());
      setOffers(dataManager.getOffers());
      setBranches(dataManager.getBranches());
      setTestimonials(dataManager.getTestimonials());
      setFaqs(dataManager.getFAQs());
      showSuccess("تمت استعادة كافة البيانات الافتراضية بنجاح!");
    }
  };

  // ----------------------------------------------------
  // SERVICES HANDLERS (CRUD)
  // ----------------------------------------------------
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    let updatedList;
    if (services.some((s) => s.id === editingService.id)) {
      updatedList = services.map((s) => (s.id === editingService.id ? editingService : s));
    } else {
      updatedList = [...services, editingService];
    }

    setServices(updatedList);
    dataManager.saveServices(updatedList);
    setEditingService(null);
    showSuccess("تم حفظ الخدمة العلاجية بنجاح!");
  };

  const handleDeleteService = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الخدمة نهائياً؟")) {
      const updatedList = services.filter((s) => s.id !== id);
      setServices(updatedList);
      dataManager.saveServices(updatedList);
      showSuccess("تم حذف الخدمة العلاجية.");
    }
  };

  const startNewService = () => {
    setEditingService({
      id: "service-" + Date.now(),
      title: "New Dental Service",
      arabicTitle: "اسم الخدمة الجديدة",
      description: "وصف الخدمة العلاجية بالتفصيل والمميزات والتقنية المستخدمة.",
      iconName: "Activity",
      features: ["ميزة طبية أولى", "ميزة طبية ثانية", "استشارة ومتابعة دورية"]
    });
  };

  // ----------------------------------------------------
  // BEFORE/AFTER HANDLERS (CRUD)
  // ----------------------------------------------------
  const handleSaveBeforeAfter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBeforeAfter) return;

    let updatedList;
    if (beforeAfter.some((item) => item.id === editingBeforeAfter.id)) {
      updatedList = beforeAfter.map((item) => (item.id === editingBeforeAfter.id ? editingBeforeAfter : item));
    } else {
      updatedList = [...beforeAfter, editingBeforeAfter];
    }

    setBeforeAfter(updatedList);
    dataManager.saveBeforeAfter(updatedList);
    setEditingBeforeAfter(null);
    showSuccess("تم حفظ زوج صور (قبل / بعد) بنجاح!");
  };

  const handleDeleteBeforeAfter = (id: string) => {
    if (confirm("هل أنت متأكد من حذف زوج الصور هذا؟")) {
      const updatedList = beforeAfter.filter((item) => item.id !== id);
      setBeforeAfter(updatedList);
      dataManager.saveBeforeAfter(updatedList);
      showSuccess("تم حذف الزوج بنجاح.");
    }
  };

  const startNewBeforeAfter = () => {
    setEditingBeforeAfter({
      id: "treatment-" + Date.now(),
      title: "قبل وبعد علاج وتجميل",
      category: "تقويم الأسنان",
      beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=600&auto=format&fit=crop",
      arabicDescription: "حالة تجميلية تم علاجها بنجاح بأحدث الأجهزة والتقنيات وبدون ألم."
    });
  };

  // ----------------------------------------------------
  // OFFERS HANDLERS (CRUD)
  // ----------------------------------------------------
  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    let updatedList;
    if (offers.some((o) => o.id === editingOffer.id)) {
      updatedList = offers.map((o) => (o.id === editingOffer.id ? editingOffer : o));
    } else {
      updatedList = [...offers, editingOffer];
    }

    setOffers(updatedList);
    dataManager.saveOffers(updatedList);
    setEditingOffer(null);
    showSuccess("تم حفظ العرض الترويجي بنجاح!");
  };

  const handleDeleteOffer = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العرض الترويجي؟")) {
      const updatedList = offers.filter((o) => o.id !== id);
      setOffers(updatedList);
      dataManager.saveOffers(updatedList);
      showSuccess("تم حذف العرض بنجاح.");
    }
  };

  const startNewOffer = () => {
    setEditingOffer({
      id: "offer-" + Date.now(),
      title: "عرض تنظيف الأسنان وإزالة الجير",
      subtitle: "استرجع بريق ابتسامتك الطبيعي بأحدث تقنية كشط وترقيع",
      oldPrice: "1000",
      newPrice: "450",
      features: ["تنظيف عميق بجهاز التراسونيك", "إزالة التصبغات والاصفرار", "مضمضة تلطيف اللثة مجاناً"],
      expiryDate: "2026-12-31"
    });
  };

  // ----------------------------------------------------
  // BRANCHES HANDLERS (CRUD)
  // ----------------------------------------------------
  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;

    let updatedList;
    if (branches.some((b) => b.id === editingBranch.id)) {
      updatedList = branches.map((b) => (b.id === editingBranch.id ? editingBranch : b));
    } else {
      updatedList = [...branches, editingBranch];
    }

    setBranches(updatedList);
    dataManager.saveBranches(updatedList);
    setEditingBranch(null);
    showSuccess("تم حفظ بيانات الفرع بنجاح!");
  };

  const handleDeleteBranch = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الفرع نهائياً؟")) {
      const updatedList = branches.filter((b) => b.id !== id);
      setBranches(updatedList);
      dataManager.saveBranches(updatedList);
      showSuccess("تم حذف الفرع.");
    }
  };

  const startNewBranch = () => {
    setEditingBranch({
      id: "branch-" + Date.now(),
      name: "الفرع الجديد للعيادة",
      address: "العنوان بالتفصيل، الشارع، المعلم المميز والمدينة",
      phone: "01063314572",
      hours: "يومياً من الساعة 3 عصراً حتى 9 مساءً",
      mapUrl: "https://maps.google.com",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110292.05739343836!2d31.1852936!3d30.46583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDI3JzU3LjAiTiAzMcKwMTEnMDcuMSJF!5e0!3m2!1sar!2seg!4v1716000000000!5m2!1sar!2seg"
    });
  };

  // ----------------------------------------------------
  // TESTIMONIALS HANDLERS (CRUD)
  // ----------------------------------------------------
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    let updatedList;
    if (testimonials.some((t) => t.id === editingTestimonial.id)) {
      updatedList = testimonials.map((t) => (t.id === editingTestimonial.id ? editingTestimonial : t));
    } else {
      updatedList = [...testimonials, editingTestimonial];
    }

    setTestimonials(updatedList);
    dataManager.saveTestimonials(updatedList);
    setEditingTestimonial(null);
    showSuccess("تم حفظ التقييم بنجاح!");
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا التقييم؟")) {
      const updatedList = testimonials.filter((t) => t.id !== id);
      setTestimonials(updatedList);
      dataManager.saveTestimonials(updatedList);
      showSuccess("تم حذف التقييم.");
    }
  };

  const startNewTestimonial = () => {
    setEditingTestimonial({
      id: "review-" + Date.now(),
      name: "اسم المريض المقيّم",
      treatment: "تقويم شفاف متطور",
      text: "تجربة ممتازة وعلاج احترافي وأسعار معتدلة جداً. أنصح الجميع بالتعامل مع دكتور يوسف.",
      rating: 5,
      avatar: ""
    });
  };

  // ----------------------------------------------------
  // FAQS HANDLERS (CRUD)
  // ----------------------------------------------------
  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    let updatedList;
    if (faqs.some((f) => f.id === editingFaq.id)) {
      updatedList = faqs.map((f) => (f.id === editingFaq.id ? editingFaq : f));
    } else {
      updatedList = [...faqs, editingFaq];
    }

    setFaqs(updatedList);
    dataManager.saveFAQs(updatedList);
    setEditingFaq(null);
    showSuccess("تم حفظ السؤال الشائع بنجاح!");
  };

  const handleDeleteFaq = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      const updatedList = faqs.filter((f) => f.id !== id);
      setFaqs(updatedList);
      dataManager.saveFAQs(updatedList);
      showSuccess("تم حذف السؤال.");
    }
  };

  const startNewFaq = () => {
    setEditingFaq({
      id: "faq-" + Date.now(),
      question: "ما هي التكلفة التقريبية لتقويم الأسنان في العيادة؟",
      answer: "تختلف التكلفة حسب نوع التقويم (معدني، زيركون، شفاف) وحسب مدة العلاج وخطة الحالة. تفضل بزيارتنا للكشف المجاني وسنعطيك تسعيرة دقيقة وخيارات تقسيط ميسرة!"
    });
  };

  // ----------------------------------------------------
  // RENDER FUNCTION
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-right" dir="rtl">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between border-l border-slate-800">
        <div>
          {/* Logo Brand Title */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-primary-600 rounded-xl flex items-center justify-center text-slate-950 font-bold">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">لوحة الإدارة الذاتية</h2>
              <p className="text-[10px] text-gray-400 font-bold">عيادات د. يوسف الشاذلي</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // clear edits on tab change
                    setEditingService(null);
                    setEditingBeforeAfter(null);
                    setEditingOffer(null);
                    setEditingBranch(null);
                    setEditingTestimonial(null);
                    setEditingFaq(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs md:text-sm font-bold transition-all text-right cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-gradient-to-l from-primary-700 to-cyan-600 text-white shadow-lg shadow-cyan-900/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action triggers and Logouts */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <button
            onClick={handleExportBackup}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-gray-300 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير نسخة احتياطية</span>
          </button>
          
          <label className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-gray-300 transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>استيراد نسخة احتياطية</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            onClick={handleResetToDefaults}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-950/40 hover:bg-red-900/30 text-red-400 rounded-xl text-xs font-bold transition-all border border-red-900/40 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة ضبط المصنع الأصلية</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-950 hover:bg-black text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج الآمن</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        
        {/* Success / Error Toast Banners */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm animate-pulse">
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-800 border border-rose-100 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm animate-pulse">
            <X className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 1: CLINIC GENERAL SETTINGS (MASTER CMS HUB)
            ---------------------------------------------------- */}
        {activeTab === "settings" && (
          <div className="space-y-8 animate-fade-in text-right">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">لوحة التحكم بالمحتوى وتخصيص المظهر (CMS)</h1>
              <p className="text-xs text-gray-500 mt-1">تعديل كافة نصوص، صور، ألوان، ومسارات الموقع دون تعديل الكود</p>
            </div>

            {/* Sub-Tabs Selector Menu */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3" dir="rtl">
              {[
                { id: "general", label: "البيانات والاتصال", icon: MapPin },
                { id: "theme_hero", label: "الهوية والثيم وبانر الهيرو", icon: Sparkles },
                { id: "visibility", label: "إظهار وإخفاء الأقسام", icon: Eye },
                { id: "doctor", label: "نبذة وملف الطبيب", icon: Shield },
                { id: "booking", label: "إدارة نافذة (احجز موعد كشف الآن)", icon: Clock },
                { id: "quiz", label: "مستشار اختبار الابتسامة", icon: HelpCircle },
                { id: "footer", label: "التذييل والسوشيال", icon: Layers },
                { id: "security", label: "الأمان والنسخ الاحتياطي", icon: Settings }
              ].map((sub) => {
                const IconComponent = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSettingsSubTab(sub.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer ${
                      settingsSubTab === sub.id
                        ? "bg-primary-900 text-white shadow-md shadow-primary-900/10"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">
              
              {/* SUB-TAB 1: GENERAL INFO */}
              {settingsSubTab === "general" && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2">معلومات الاتصال الأساسية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">عنوان العيادة الرئيسي (Title)</label>
                      <input
                        type="text"
                        value={settings.title}
                        onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">العنوان الفرعي (Subtitle)</label>
                      <input
                        type="text"
                        value={settings.subtitle}
                        onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">رقم الاتصال الموحد</label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">رقم واتساب الأساسي للحجز المباشر (أرقام فقط مع كود الدولة مثل 201063314572)</label>
                      <input
                        type="text"
                        value={settings.whatsapp}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">رقم طوارئ الأسنان (24 ساعة)</label>
                      <input
                        type="text"
                        value={settings.emergencyPhone}
                        onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">مواعيد وساعات العمل الرسمية</label>
                      <input
                        type="text"
                        value={settings.workingHours}
                        onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">شريط الطوارئ العلوي (الأحمر)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">نص شريط الطوارئ</label>
                      <input
                        type="text"
                        value={settings.emergencyBannerText}
                        onChange={(e) => setSettings({ ...settings, emergencyBannerText: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">رقم الاتصال في الطوارئ</label>
                      <input
                        type="text"
                        value={settings.emergencyBannerPhone}
                        onChange={(e) => setSettings({ ...settings, emergencyBannerPhone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-6 md:col-span-2">
                      <input
                        type="checkbox"
                        id="bannerVisible"
                        checked={settings.emergencyBannerVisible}
                        onChange={(e) => setSettings({ ...settings, emergencyBannerVisible: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                      />
                      <label htmlFor="bannerVisible" className="text-xs font-extrabold text-gray-700 cursor-pointer">تفعيل وعرض شريط الطوارئ أعلى الصفحة الرئيسية بشكل دائم</label>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB: SECTION VISIBILITY CONTROLS */}
              {settingsSubTab === "visibility" && (
                <div className="space-y-6 animate-fade-in text-right">
                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2">التحكم في ظهور وإخفاء أقسام الموقع الرئيسي</h3>
                  <p className="text-xs text-gray-500">قم بتفعيل أو تعطيل أي جزء من الصفحة الرئيسية كصاحب قرار كامل للعيادة بنقرة واحدة</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {[
                      {
                        key: "emergencyBannerVisible",
                        label: "الشريط العاجل العلوي (أحمر)",
                        desc: "شريط التنبيهات والطوارئ في أعلى الترويسة للاتصال الفوري"
                      },
                      {
                        key: "servicesVisible",
                        label: "قسم الخدمات والمجالات العلاجية",
                        desc: "عرض شبكة البطاقات الذكية ومميزات العلاجات والتجميل"
                      },
                      {
                        key: "beforeAfterVisible",
                        label: "قسم صور ومعرض قبل وبعد الحالات",
                        desc: "معرض مقارنة الصور الحية والتفاصيل للحالات الناجحة"
                      },
                      {
                        key: "smileQuizVisible",
                        label: "مستشار اختبار الابتسامة التفاعلي (Smile Quiz)",
                        desc: "الاستبيان السريع المبتكر لجمع ملفات الحالات عبر الواتساب"
                      },
                      {
                        key: "offersVisible",
                        label: "قسم العروض الترويجية والحملات",
                        desc: "عرض بطاقات الأسعار المخفضة والخصومات المؤقتة مع مؤقت تنازلي"
                      },
                      {
                        key: "branchFinderVisible",
                        label: "قسم الفروع وبطاقات الخرائط الجغرافية",
                        desc: "توجيه العملاء لأماكن الفروع الثلاثة وأزرار GPS"
                      },
                      {
                        key: "testimonialsVisible",
                        label: "قسم آراء وتجارب المرضى (Google Reviews)",
                        desc: "عرض الملاحظات والنجوم والشهادات الحقيقية لزوار العيادة"
                      },
                      {
                        key: "doctorBioVisible",
                        label: "بطاقة التعريف وبورتريه الطبيب (Bio Card)",
                        desc: "البطاقة الداكنة الجانبية التي تلخص المسمى المهني والرسالة الإنسانية للدكتور"
                      },
                      {
                        key: "faqVisible",
                        label: "قسم الأسئلة الشائعة والاستجواب الطبي (FAQ)",
                        desc: "الأكورديون التفاعلي لإجابة التساؤلات المتكررة عن التقويم والجراحة"
                      }
                    ].map((section) => {
                      const value = (settings as any)[section.key] ?? true;
                      return (
                        <div key={section.key} className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-3xl hover:bg-white hover:shadow-md transition-all">
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-sm text-gray-900">{section.label}</h4>
                            <p className="text-xs text-gray-400 font-semibold">{section.desc}</p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setSettings({ ...settings, [section.key]: !value })}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              value ? "bg-emerald-500" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                value ? "-translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: THEME & HERO CUSTOMIZER */}
              {settingsSubTab === "theme_hero" && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2">ألوان وهوية العيادة (ثيم تفاعلي)</h3>
                  <p className="text-xs text-gray-400">تحكم بجميع درجات الألوان المستخدمة في التصميم والحدود والتأثيرات التجميلية</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">اللون الرئيسي للعيادة (Primary Color)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="w-10 h-10 border border-gray-200 rounded-lg cursor-pointer flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-left focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">اللون الثانوي (Secondary Color)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="w-10 h-10 border border-gray-200 rounded-lg cursor-pointer flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-left focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">خلفية الشريط العلوي</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.topBannerColor}
                          onChange={(e) => setSettings({ ...settings, topBannerColor: e.target.value })}
                          className="w-10 h-10 border border-gray-200 rounded-lg cursor-pointer flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={settings.topBannerColor}
                          onChange={(e) => setSettings({ ...settings, topBannerColor: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-left focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">خلفية الفوتر (Footer Background)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.footerBgColor}
                          onChange={(e) => setSettings({ ...settings, footerBgColor: e.target.value })}
                          className="w-10 h-10 border border-gray-200 rounded-lg cursor-pointer flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={settings.footerBgColor}
                          onChange={(e) => setSettings({ ...settings, footerBgColor: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-left focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">شعار العيادة (Logo & Brand)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">اسم الشعار النصي (Logo Text)</label>
                      <input
                        type="text"
                        value={settings.logoText || ""}
                        onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">رابط لوجو العيادة (صورة مخصصة - فارغ لاستخدام الأيقونة الافتراضية)</label>
                      <input
                        type="text"
                        value={settings.logoImageUrl || ""}
                        onChange={(e) => setSettings({ ...settings, logoImageUrl: e.target.value })}
                        placeholder="رابط مباشر للصورة (URL)"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">واجهة الهيرو الرئيسية (Hero Landing Page)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">شعار صغير علوي (Badge Text)</label>
                      <input
                        type="text"
                        value={settings.heroBadgeText}
                        onChange={(e) => setSettings({ ...settings, heroBadgeText: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">عنوان الهيرو العريض (Heading)</label>
                      <input
                        type="text"
                        value={settings.heroHeading}
                        onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-gray-600 block">العنوان الترويجي المثير (Subheading)</label>
                      <input
                        type="text"
                        value={settings.heroSubheading}
                        onChange={(e) => setSettings({ ...settings, heroSubheading: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-gray-600 block">الوصف أو القصة الترحيبية للعيادة (Description)</label>
                      <textarea
                        value={settings.heroDescription}
                        onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-gray-600 block">رابط صورة الهيرو الجانبية / البانر الخلفي</label>
                      <input
                        type="text"
                        value={settings.heroImageUrl}
                        onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">أرقام وإحصائيات الثقة (Hero Counter Metrics)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 space-y-3">
                      <h4 className="font-extrabold text-xs text-primary-900">الإحصائية الأولى (مثال: التخصصات)</h4>
                      <input
                        type="text"
                        value={settings.statsSpecialtiesValue}
                        onChange={(e) => setSettings({ ...settings, statsSpecialtiesValue: e.target.value })}
                        placeholder="الرقم"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={settings.statsSpecialtiesLabel}
                        onChange={(e) => setSettings({ ...settings, statsSpecialtiesLabel: e.target.value })}
                        placeholder="النص التوضيحي"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 space-y-3">
                      <h4 className="font-extrabold text-xs text-primary-900">الإحصائية الثانية (مثال: الفروع)</h4>
                      <input
                        type="text"
                        value={settings.statsBranchesValue}
                        onChange={(e) => setSettings({ ...settings, statsBranchesValue: e.target.value })}
                        placeholder="الرقم"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={settings.statsBranchesLabel}
                        onChange={(e) => setSettings({ ...settings, statsBranchesLabel: e.target.value })}
                        placeholder="النص التوضيحي"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 space-y-3">
                      <h4 className="font-extrabold text-xs text-primary-900">الإحصائية الثالثة (مثال: الابتسامات)</h4>
                      <input
                        type="text"
                        value={settings.statsSmilesValue}
                        onChange={(e) => setSettings({ ...settings, statsSmilesValue: e.target.value })}
                        placeholder="الرقم"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={settings.statsSmilesLabel}
                        onChange={(e) => setSettings({ ...settings, statsSmilesLabel: e.target.value })}
                        placeholder="النص التوضيحي"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: DOCTOR'S PROFILE */}
              {settingsSubTab === "doctor" && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2">الملف الطبي وبورتريه الطبيب (Testimonials & Bio)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">اسم الطبيب المعالج</label>
                      <input
                        type="text"
                        value={settings.doctorName}
                        onChange={(e) => setSettings({ ...settings, doctorName: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">المسمى الوظيفي العلمي والشهادة</label>
                      <input
                        type="text"
                        value={settings.doctorTitle}
                        onChange={(e) => setSettings({ ...settings, doctorTitle: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-gray-600 block">شعار الطبيب أو الموتو المكتوب بخط اليد</label>
                      <input
                        type="text"
                        value={settings.doctorMotto}
                        onChange={(e) => setSettings({ ...settings, doctorMotto: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-gray-600 block">رابط صورة الدكتور البورتريه (بجانب قسم آراء المرضى)</label>
                      <input
                        type="text"
                        value={settings.doctorImageUrl}
                        onChange={(e) => setSettings({ ...settings, doctorImageUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-gray-600 block">السيرة الطبية والمهنية الكاملة (Bio)</label>
                      <textarea
                        value={settings.doctorBio}
                        onChange={(e) => setSettings({ ...settings, doctorBio: e.target.value })}
                        rows={5}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: 4-STEP BOOKING MODAL */}
              {settingsSubTab === "booking" && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2">إدارة نافذة (احجز موعد كشف الآن) والخطوات التفاعلية</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                      <h4 className="font-extrabold text-xs text-primary-900 border-r-2 border-primary-500 pr-1.5">الخطوة الأولى: البيانات الشخصية</h4>
                      <input
                        type="text"
                        value={settings.bookingStep1Title}
                        onChange={(e) => setSettings({ ...settings, bookingStep1Title: e.target.value })}
                        placeholder="العنوان"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={settings.bookingStep1Subtitle}
                        onChange={(e) => setSettings({ ...settings, bookingStep1Subtitle: e.target.value })}
                        placeholder="الوصف الفرعي"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                      <h4 className="font-extrabold text-xs text-primary-900 border-r-2 border-primary-500 pr-1.5">الخطوة الثانية: الفرع والخدمة</h4>
                      <input
                        type="text"
                        value={settings.bookingStep2Title}
                        onChange={(e) => setSettings({ ...settings, bookingStep2Title: e.target.value })}
                        placeholder="العنوان"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={settings.bookingStep2Subtitle}
                        onChange={(e) => setSettings({ ...settings, bookingStep2Subtitle: e.target.value })}
                        placeholder="الوصف الفرعي"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                      <h4 className="font-extrabold text-xs text-primary-900 border-r-2 border-primary-500 pr-1.5">الخطوة الثالثة: التاريخ والوقت</h4>
                      <input
                        type="text"
                        value={settings.bookingStep3Title}
                        onChange={(e) => setSettings({ ...settings, bookingStep3Title: e.target.value })}
                        placeholder="العنوان"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={settings.bookingStep3Subtitle}
                        onChange={(e) => setSettings({ ...settings, bookingStep3Subtitle: e.target.value })}
                        placeholder="الوصف الفرعي"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                      <h4 className="font-extrabold text-xs text-primary-900 border-r-2 border-primary-500 pr-1.5">الخطوة الرابعة: مراجعة الطلب</h4>
                      <input
                        type="text"
                        value={settings.bookingStep4Title}
                        onChange={(e) => setSettings({ ...settings, bookingStep4Title: e.target.value })}
                        placeholder="العنوان"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={settings.bookingStep4Subtitle}
                        onChange={(e) => setSettings({ ...settings, bookingStep4Subtitle: e.target.value })}
                        placeholder="الوصف الفرعي"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">أيام العمل النشطة</h3>
                  <div className="space-y-1.5 max-w-md">
                    <label className="text-xs font-bold text-gray-600 block">أيام العمل النشطة المعروضة للمرضى</label>
                    <input
                      type="text"
                      value={settings.bookingActiveDays}
                      onChange={(e) => setSettings({ ...settings, bookingActiveDays: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                    />
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">قائمة الخدمات والمجالات الطبية</h3>
                  <p className="text-xs text-gray-500 font-semibold mb-2">قم بإضافة، تعديل، أو حذف الخدمات المتاحة للاختيار في نموذج حجز المواعيد والصفحة الرئيسية</p>

                  <div className="space-y-3 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div className="flex flex-wrap gap-2.5">
                      {(services || []).map((srv, idx) => (
                        <div key={srv.id || idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-gray-200 shadow-sm transition-all hover:border-cyan-300">
                          <input
                            type="text"
                            value={srv.arabicTitle}
                            onChange={(e) => {
                              const newList = services.map((s, i) => i === idx ? { ...s, arabicTitle: e.target.value } : s);
                              setServices(newList);
                              dataManager.saveServices(newList);
                            }}
                            className="text-xs font-bold text-gray-800 bg-transparent focus:outline-none w-36 text-right"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف خدمة "${srv.arabicTitle}"؟`)) {
                                const newList = services.filter((_, i) => i !== idx);
                                setServices(newList);
                                dataManager.saveServices(newList);
                                showSuccess("تم حذف الخدمة الطبية بنجاح");
                              }
                            }}
                            className="p-1 hover:text-red-500 text-gray-400 rounded-lg transition-colors cursor-pointer"
                            title="حذف الخدمة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {(services || []).length === 0 && (
                        <p className="text-xs text-gray-400 font-semibold py-1">لا توجد خدمات مضافة حالياً.</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-150 max-w-sm font-sans">
                      <input
                        type="text"
                        placeholder="اسم الخدمة الجديدة (مثال: زراعة الأسنان الفورية)"
                        id="new-service-booking-input"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              const newSrv: Service = {
                                id: "service-" + Date.now(),
                                title: val,
                                arabicTitle: val,
                                description: "خدمة علاجية مضافة من لوحة التحكم",
                                iconName: "Activity",
                                details: ["متابعة طبية مستمرة"]
                              };
                              const newList = [...services, newSrv];
                              setServices(newList);
                              dataManager.saveServices(newList);
                              showSuccess("تم إضافة الخدمة الطبية بنجاح");
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none text-right"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("new-service-booking-input") as HTMLInputElement;
                          const val = el?.value?.trim();
                          if (val) {
                            const newSrv: Service = {
                              id: "service-" + Date.now(),
                              title: val,
                              arabicTitle: val,
                              description: "خدمة علاجية مضافة من لوحة التحكم",
                              iconName: "Activity",
                              details: ["متابعة طبية مستمرة"]
                            };
                            const newList = [...services, newSrv];
                            setServices(newList);
                            dataManager.saveServices(newList);
                            showSuccess("تم إضافة الخدمة الطبية بنجاح");
                            el.value = "";
                          }
                        }}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة خدمة</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">قائمة فروع العيادة</h3>
                  <p className="text-xs text-gray-500 font-semibold mb-2">قم بإضافة، تعديل، أو حذف فروع العيادة المتاحة للاختيار في نموذج حجز المواعيد والصفحة الرئيسية</p>

                  <div className="space-y-3 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div className="flex flex-wrap gap-2.5">
                      {(branches || []).map((br, idx) => (
                        <div key={br.id || idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-gray-200 shadow-sm transition-all hover:border-cyan-300">
                          <input
                            type="text"
                            value={br.name}
                            onChange={(e) => {
                              const newList = branches.map((b, i) => i === idx ? { ...b, name: e.target.value } : b);
                              setBranches(newList);
                              dataManager.saveBranches(newList);
                            }}
                            className="text-xs font-bold text-gray-800 bg-transparent focus:outline-none w-36 text-right"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف فرع "${br.name}"؟`)) {
                                const newList = branches.filter((_, i) => i !== idx);
                                setBranches(newList);
                                dataManager.saveBranches(newList);
                                showSuccess("تم حذف الفرع بنجاح");
                              }
                            }}
                            className="p-1 hover:text-red-500 text-gray-400 rounded-lg transition-colors cursor-pointer"
                            title="حذف الفرع"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {(branches || []).length === 0 && (
                        <p className="text-xs text-gray-400 font-semibold py-1">لا توجد فروع مضافة حالياً.</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-150 max-w-sm font-sans">
                      <input
                        type="text"
                        placeholder="اسم الفرع الجديد (مثال: فرع طوخ)"
                        id="new-branch-booking-input"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              const newBr: Branch = {
                                id: "branch-" + Date.now(),
                                name: val,
                                address: "العنوان الافتراضي للفرع الجديد",
                                phone: "01063314572",
                                hours: "يومياً من الساعة 2 ظهراً حتى 10 مساءً",
                                mapsLink: "https://maps.google.com",
                                whatsAppLink: "",
                                imageUrl: ""
                              };
                              const newList = [...branches, newBr];
                              setBranches(newList);
                              dataManager.saveBranches(newList);
                              showSuccess("تم إضافة الفرع بنجاح");
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none text-right"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("new-branch-booking-input") as HTMLInputElement;
                          const val = el?.value?.trim();
                          if (val) {
                            const newBr: Branch = {
                              id: "branch-" + Date.now(),
                              name: val,
                              address: "العنوان الافتراضي للفرع الجديد",
                              phone: "01063314572",
                              hours: "يومياً من الساعة 2 ظهراً حتى 10 مساءً",
                              mapsLink: "https://maps.google.com",
                              whatsAppLink: "",
                              imageUrl: ""
                            };
                            const newList = [...branches, newBr];
                            setBranches(newList);
                            dataManager.saveBranches(newList);
                            showSuccess("تم إضافة الفرع بنجاح");
                            el.value = "";
                          }
                        }}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة فرع</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">قائمة فترات الحجز المتاحة (Time Slots)</h3>
                  <p className="text-xs text-gray-500 font-semibold mb-2">قم بإضافة، تعديل، أو حذف فترات وتوقيتات الحجز المتاحة للمرضى</p>

                  <div className="space-y-3 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div className="flex flex-wrap gap-2.5">
                      {(settings.bookingTimeSlots || []).map((slot, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-gray-200 shadow-sm transition-all hover:border-cyan-300">
                          <input
                            type="text"
                            value={slot}
                            onChange={(e) => {
                              const newList = [...(settings.bookingTimeSlots || [])];
                              newList[idx] = e.target.value;
                              setSettings({ ...settings, bookingTimeSlots: newList });
                            }}
                            className="text-xs font-bold text-gray-800 bg-transparent focus:outline-none w-44 text-right"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newList = (settings.bookingTimeSlots || []).filter((_, i) => i !== idx);
                              setSettings({ ...settings, bookingTimeSlots: newList });
                              showSuccess("تم حذف فترة الحجز بنجاح");
                            }}
                            className="p-1 hover:text-red-500 text-gray-400 rounded-lg transition-colors cursor-pointer"
                            title="حذف الفترة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {(settings.bookingTimeSlots || []).length === 0 && (
                        <p className="text-xs text-gray-400 font-semibold py-1">لا توجد فترات حجز مضافة حالياً. سيتم استخدام الفترات الافتراضية.</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-150 max-w-sm font-sans">
                      <input
                        type="text"
                        placeholder="فترة جديدة (مثال: صباحي - من 9ص لـ 1ظ)"
                        id="new-timeslot-booking-input"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              setSettings({
                                ...settings,
                                bookingTimeSlots: [...(settings.bookingTimeSlots || []), val]
                              });
                              showSuccess("تم إضافة فترة حجز جديدة");
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none text-right"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("new-timeslot-booking-input") as HTMLInputElement;
                          const val = el?.value?.trim();
                          if (val) {
                            setSettings({
                              ...settings,
                              bookingTimeSlots: [...(settings.bookingTimeSlots || []), val]
                            });
                            showSuccess("تم إضافة فترة حجز جديدة");
                            el.value = "";
                          }
                        }}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة فترة</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">قالب الواتساب لبيانات حجز الموعد</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 block">هيكل الرسالة (استخدم المتغيرات: [NAME]، [PHONE]، [BRANCH]، [SERVICE]، [DOCTOR]، [DATE]، [TIME])</label>
                    <textarea
                      value={settings.bookingWhatsappTemplate}
                      onChange={(e) => setSettings({ ...settings, bookingWhatsappTemplate: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                    />
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">قائمة الأطباء المعالجين</h3>
                  <p className="text-xs text-gray-500 font-semibold mb-2">قم بإضافة، تعديل، أو حذف أسماء الأطباء المتاحين للاختيار في نموذج حجز المواعيد</p>

                  <div className="space-y-3 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div className="flex flex-wrap gap-2.5">
                      {(settings.bookingDoctors || []).map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-gray-200 shadow-sm transition-all hover:border-cyan-300">
                          <input
                            type="text"
                            value={doc}
                            onChange={(e) => {
                              const newList = [...(settings.bookingDoctors || [])];
                              newList[idx] = e.target.value;
                              setSettings({ ...settings, bookingDoctors: newList });
                            }}
                            className="text-xs font-bold text-gray-800 bg-transparent focus:outline-none w-32 text-right"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newList = (settings.bookingDoctors || []).filter((_, i) => i !== idx);
                              setSettings({ ...settings, bookingDoctors: newList });
                            }}
                            className="p-1 hover:text-red-500 text-gray-400 rounded-lg transition-colors cursor-pointer"
                            title="حذف الطبيب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {(settings.bookingDoctors || []).length === 0 && (
                        <p className="text-xs text-gray-400 font-semibold py-1">لا يوجد أطباء مضافين حالياً. سيتم استخدام القائمة الافتراضية.</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-150 max-w-sm font-sans">
                      <input
                        type="text"
                        placeholder="اسم الطبيب الجديد (مثال: د. سليم الهواري)"
                        id="new-doctor-input"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              setSettings({
                                ...settings,
                                bookingDoctors: [...(settings.bookingDoctors || []), val]
                              });
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none text-right"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("new-doctor-input") as HTMLInputElement;
                          const val = el?.value?.trim();
                          if (val) {
                            setSettings({
                              ...settings,
                              bookingDoctors: [...(settings.bookingDoctors || []), val]
                            });
                            el.value = "";
                          }
                        }}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 5: SMILE QUIZ */}
              {settingsSubTab === "quiz" && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2">تخصيص مستشار الابتسامة التفاعلي</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">عنوان مقدمة الاختبار</label>
                      <input
                        type="text"
                        value={settings.quizIntroTitle}
                        onChange={(e) => setSettings({ ...settings, quizIntroTitle: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">شرح مقدمة الاختبار</label>
                      <input
                        type="text"
                        value={settings.quizIntroSubtitle}
                        onChange={(e) => setSettings({ ...settings, quizIntroSubtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">عنوان شاشة انتهاء الأسئلة</label>
                      <input
                        type="text"
                        value={settings.quizCompletedTitle}
                        onChange={(e) => setSettings({ ...settings, quizCompletedTitle: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">شرح شاشة انتهاء الأسئلة والإجراء</label>
                      <input
                        type="text"
                        value={settings.quizCompletedSubtitle}
                        onChange={(e) => setSettings({ ...settings, quizCompletedSubtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">قالب إجابات اختبار الابتسامة للواتساب</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 block">هيكل رسالة إرسال الإجابات (تلقائياً يتم تبديل المتغير [RESPONSES] بتقرير الأسئلة والأجوبة التراكمية)</label>
                    <textarea
                      value={settings.quizWhatsappTemplate}
                      onChange={(e) => setSettings({ ...settings, quizWhatsappTemplate: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                    />
                  </div>
                </div>
              )}

              {/* SUB-TAB 6: FOOTER & SOCIALS */}
              {settingsSubTab === "footer" && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2">أزرار ومنافذ شبكات التواصل الاجتماعي</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">رابط الفيسبوك (Facebook URL)</label>
                      <input
                        type="text"
                        value={settings.socialFacebook}
                        onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">رابط الإنستجرام (Instagram URL)</label>
                      <input
                        type="text"
                        value={settings.socialInstagram}
                        onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">رابط اليوتيوب (YouTube URL)</label>
                      <input
                        type="text"
                        value={settings.socialYoutube}
                        onChange={(e) => setSettings({ ...settings, socialYoutube: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">رابط تيك توك (TikTok URL)</label>
                      <input
                        type="text"
                        value={settings.socialTiktok}
                        onChange={(e) => setSettings({ ...settings, socialTiktok: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-4">رسالة التذييل وحقوق النشر</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">الوصف والنص التعريفي بالفوتر</label>
                      <textarea
                        value={settings.footerDescription}
                        onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">حقوق النشر والملكية (Copyright Statement)</label>
                      <input
                        type="text"
                        value={settings.footerCopyright}
                        onChange={(e) => setSettings({ ...settings, footerCopyright: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 7: CONTROL PANEL SECURITY & DATA BACKUPS */}
              {settingsSubTab === "security" && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2">🔑 بيانات الدخول إلى لوحة التحكم الإشرافية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">اسم المستخدم الإداري (Username)</label>
                      <input
                        type="text"
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">كلمة المرور الجديدة (Password)</label>
                      <input
                        type="text"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-right"
                      />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 border-r-4 border-cyan-500 pr-2 pt-6">💾 إدارة وتخزين البيانات والنسخ الاحتياطي</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">قم بتنزيل نسخة كاملة من نصوص، خدمات، عروض، وصور العيادة في ملف واحد للنسخ الاحتياطي أو النقل لملقم آخر.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>تصدير نسخة احتياطية (JSON)</span>
                    </button>
                    
                    <label className="flex items-center justify-center gap-2 px-5 py-3.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-2xl font-bold text-xs transition-all cursor-pointer border border-cyan-200">
                      <Upload className="w-4 h-4" />
                      <span>استيراد نسخة احتياطية</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleResetToDefaults}
                      className="flex items-center justify-center gap-2 px-5 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-2xl font-bold text-xs transition-all cursor-pointer border border-rose-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>إعادة ضبط المصنع بالكامل</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-800 to-cyan-600 hover:from-primary-900 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl text-xs md:text-sm font-extrabold shadow-lg shadow-primary-900/15 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ وإطلاق كافة التحديثات فوراً 🚀</span>
                </button>
                <span className="text-xs text-gray-400 font-bold hidden sm:inline">أخر تحديث مخزن محلياً وتلقائياً</span>
              </div>
            </form>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 2: SERVICES MANAGER (CRUD)
            ---------------------------------------------------- */}
        {activeTab === "services" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">الخدمات الطبية والتجميلية</h1>
                <p className="text-xs text-gray-500 mt-1">تحديث، حذف، أو إضافة خدمات جديدة لقسم الخدمات</p>
              </div>
              {!editingService && (
                <button
                  onClick={startNewService}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة خدمة جديدة</span>
                </button>
              )}
            </div>

            {editingService ? (
              <form onSubmit={handleSaveService} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">تعديل بيانات الخدمة</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">الاسم بالعربية (مثال: تركيبات الزيركون)</label>
                    <input
                      type="text"
                      value={editingService.arabicTitle}
                      onChange={(e) => setEditingService({ ...editingService, arabicTitle: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">الاسم بالإنجليزية (مثال: Zirconia Crowns)</label>
                    <input
                      type="text"
                      value={editingService.title}
                      onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">أيقونة الخدمة</label>
                    <select
                      value={editingService.iconName}
                      onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    >
                      <option value="Activity">نبض / علاج (Activity)</option>
                      <option value="Layers">طبقات زيركون (Layers)</option>
                      <option value="Sparkles">تجميل / تبييض (Sparkles)</option>
                      <option value="Shield">وقاية / حماية (Shield)</option>
                      <option value="Scissors">جراحة / لثة (Scissors)</option>
                      <option value="Flame">حشوة ضوئية (Flame)</option>
                      <option value="Smile">ابتسامة (Smile)</option>
                      <option value="Heart">عناية فائقة (Heart)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 block">وصف الخدمة بالتفصيل</label>
                    <textarea
                      value={editingService.description}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 block">المميزات والفوائد (مفصولة بفاصلة أو سطر جديد)</label>
                    <textarea
                      value={editingService.features.join("\n")}
                      onChange={(e) => setEditingService({ ...editingService, features: e.target.value.split("\n").filter(f=>f.trim()!=="") })}
                      required
                      rows={3}
                      placeholder="ميزة أولى&#10;ميزة ثانية&#10;ميزة ثالثة"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow cursor-pointer"
                  >
                    حفظ الخدمة
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    إلغاء التعديل
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono font-bold text-primary-500 bg-primary-50 px-2 py-1 rounded">
                          {service.iconName}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingService(service)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                            title="تعديل"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-lg font-extrabold text-gray-900">{service.arabicTitle}</h3>
                      <p className="text-xs text-gray-400 uppercase font-bold font-mono">{service.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 3: BEFORE & AFTER SLIDER MANAGER
            ---------------------------------------------------- */}
        {activeTab === "before-after" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">معرض حالات قبل وبعد</h1>
                <p className="text-xs text-gray-500 mt-1">إضافة أو تعديل صور مقارنة الحالات العلاجية ومستوى النتائج</p>
              </div>
              {!editingBeforeAfter && (
                <button
                  onClick={startNewBeforeAfter}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة زوج صور جديد</span>
                </button>
              )}
            </div>

            {editingBeforeAfter ? (
              <form onSubmit={handleSaveBeforeAfter} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">تعديل زوج الصور</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">عنوان الحالة</label>
                    <input
                      type="text"
                      value={editingBeforeAfter.title}
                      onChange={(e) => setEditingBeforeAfter({ ...editingBeforeAfter, title: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">التصنيف أو الخدمة</label>
                    <select
                      value={editingBeforeAfter.category}
                      onChange={(e) => setEditingBeforeAfter({ ...editingBeforeAfter, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    >
                      <option value="تقويم الأسنان">تقويم الأسنان</option>
                      <option value="زراعة الأسنان">زراعة الأسنان</option>
                      <option value="تركيبات زيركون">تركيبات زيركون</option>
                      <option value="تبييض">تبييض الأسنان</option>
                      <option value="حشوات تجميلية">حشوات تجميلية</option>
                      <option value="تنظيف الجير">تنظيف الجير</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">رابط صورة قبل العلاج (Before Image URL)</label>
                    <input
                      type="text"
                      value={editingBeforeAfter.beforeImage}
                      onChange={(e) => setEditingBeforeAfter({ ...editingBeforeAfter, beforeImage: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">رابط صورة بعد العلاج (After Image URL)</label>
                    <input
                      type="text"
                      value={editingBeforeAfter.afterImage}
                      onChange={(e) => setEditingBeforeAfter({ ...editingBeforeAfter, afterImage: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 block">وصف الحالة وتفاصيل النتيجة</label>
                    <textarea
                      value={editingBeforeAfter.arabicDescription}
                      onChange={(e) => setEditingBeforeAfter({ ...editingBeforeAfter, arabicDescription: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow cursor-pointer"
                  >
                    حفظ التعديلات
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBeforeAfter(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    إلغاء التعديل
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beforeAfter.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-all">
                    {/* Double preview of both before and after images */}
                    <div className="grid grid-cols-2 h-36 bg-gray-100 relative">
                      <div className="relative overflow-hidden">
                        <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">قبل</span>
                      </div>
                      <div className="relative overflow-hidden border-r border-white">
                        <img src={item.afterImage} alt="After" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">بعد</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full">{item.category}</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => setEditingBeforeAfter(item)}
                              className="p-1 text-gray-400 hover:text-primary-600 rounded cursor-pointer"
                              title="تعديل"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBeforeAfter(item.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-sm font-extrabold text-gray-900 line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-1">{item.arabicDescription}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 4: OFFERS MANAGER (CRUD)
            ---------------------------------------------------- */}
        {activeTab === "offers" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">العروض الحصرية والتخفيضات</h1>
                <p className="text-xs text-gray-500 mt-1">تعديل باقات عروض التوفير والأسعار في قسم العروض</p>
              </div>
              {!editingOffer && (
                <button
                  onClick={startNewOffer}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة عرض جديد</span>
                </button>
              )}
            </div>

            {editingOffer ? (
              <form onSubmit={handleSaveOffer} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">تعديل العرض الترويجي</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">عنوان العرض</label>
                    <input
                      type="text"
                      value={editingOffer.title}
                      onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">تفاصيل قصيرة أو كود العرض</label>
                    <input
                      type="text"
                      value={editingOffer.subtitle}
                      onChange={(e) => setEditingOffer({ ...editingOffer, subtitle: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">السعر الأصلي (قبل الخصم)</label>
                    <input
                      type="text"
                      value={editingOffer.oldPrice}
                      onChange={(e) => setEditingOffer({ ...editingOffer, oldPrice: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">السعر المخفض (بعد الخصم)</label>
                    <input
                      type="text"
                      value={editingOffer.newPrice}
                      onChange={(e) => setEditingOffer({ ...editingOffer, newPrice: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">تاريخ انتهاء الصلاحية</label>
                    <input
                      type="date"
                      value={editingOffer.expiryDate}
                      onChange={(e) => setEditingOffer({ ...editingOffer, expiryDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 block">مميزات العرض بالتفصيل (كل ميزة في سطر منفصل)</label>
                    <textarea
                      value={editingOffer.features.join("\n")}
                      onChange={(e) => setEditingOffer({ ...editingOffer, features: e.target.value.split("\n").filter(f=>f.trim()!=="") })}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow cursor-pointer"
                  >
                    حفظ العرض
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingOffer(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    إلغاء التعديل
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded">
                          انتهاء: {offer.expiryDate}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingOffer(offer)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-gray-900">{offer.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">{offer.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-lg font-extrabold text-emerald-600">{offer.newPrice} ج.م</span>
                        <span className="text-xs text-gray-400 line-through font-mono">{offer.oldPrice} ج.م</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 5: BRANCHES MANAGER (CRUD)
            ---------------------------------------------------- */}
        {activeTab === "branches" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">فروع العيادة والخرائط</h1>
                <p className="text-xs text-gray-500 mt-1">تعديل عناوين الفروع، أرقام تواصلها، وروابط الخرائط التفاعلية</p>
              </div>
              {!editingBranch && (
                <button
                  onClick={startNewBranch}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة فرع جديد</span>
                </button>
              )}
            </div>

            {editingBranch ? (
              <form onSubmit={handleSaveBranch} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">تعديل بيانات الفرع</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">اسم الفرع (مثال: بنها (الرئيسي))</label>
                    <input
                      type="text"
                      value={editingBranch.name}
                      onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">رقم هاتف الفرع لحجز الواتساب</label>
                    <input
                      type="text"
                      value={editingBranch.phone}
                      onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold font-mono text-left"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">ساعات عمل هذا الفرع</label>
                    <input
                      type="text"
                      value={editingBranch.hours}
                      onChange={(e) => setEditingBranch({ ...editingBranch, hours: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">رابط خرائط جوجل (Google Maps URL)</label>
                    <input
                      type="text"
                      value={editingBranch.mapUrl}
                      onChange={(e) => setEditingBranch({ ...editingBranch, mapUrl: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 block">العنوان بالتفصيل الدقيق</label>
                    <input
                      type="text"
                      value={editingBranch.address}
                      onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 block">رابط تضمين خريطة IFrame (Embed Source URL)</label>
                    <textarea
                      value={editingBranch.mapEmbedUrl}
                      onChange={(e) => setEditingBranch({ ...editingBranch, mapEmbedUrl: e.target.value })}
                      required
                      rows={3}
                      placeholder="https://www.google.com/maps/embed?..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow cursor-pointer"
                  >
                    حفظ الفرع
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBranch(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    إلغاء التعديل
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                  <div key={branch.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    
                    {/* Maps iframe mini-preview */}
                    <div className="h-32 bg-slate-100 relative">
                      <iframe
                        src={branch.mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="pointer-events-none opacity-80"
                      />
                      <div className="absolute inset-0 bg-transparent flex items-center justify-center">
                        <span className="bg-slate-900/80 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>خريطة الفرع</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-extrabold text-gray-900">{branch.name}</h3>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setEditingBranch(branch)}
                            className="p-1 text-gray-400 hover:text-primary-600 rounded cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBranch(branch.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-500">
                        <p className="font-semibold text-gray-800">📍 العنوان: {branch.address}</p>
                        <p className="font-mono">📱 الهواتف: {branch.phone}</p>
                        <p>⏰ مواعيد العمل: {branch.hours}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 6: TESTIMONIALS MANAGER (CRUD)
            ---------------------------------------------------- */}
        {activeTab === "testimonials" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">إدارة تقييمات وآراء المرضى</h1>
                <p className="text-xs text-gray-500 mt-1">إضافة، تعديل أو حذف قصص وتجارب نجاح المرضى</p>
              </div>
              {!editingTestimonial && (
                <button
                  onClick={startNewTestimonial}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة تقييم جديد</span>
                </button>
              )}
            </div>

            {editingTestimonial ? (
              <form onSubmit={handleSaveTestimonial} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">تعديل التقييم</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">اسم المريض المقيّم</label>
                    <input
                      type="text"
                      value={editingTestimonial.name}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">نوع العلاج / الخدمة المستفاد منها</label>
                    <input
                      type="text"
                      value={editingTestimonial.treatment}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, treatment: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">التقييم بالنجوم (من 1 إلى 5)</label>
                    <select
                      value={editingTestimonial.rating}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3">⭐⭐⭐ (3/5)</option>
                      <option value="2">⭐⭐ (2/5)</option>
                      <option value="1">⭐ (1/5)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 block">نص التقييم والتجربة بالتفصيل</label>
                    <textarea
                      value={editingTestimonial.text}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow cursor-pointer"
                  >
                    حفظ التقييم
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    إلغاء التعديل
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-0.5">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setEditingTestimonial(t)}
                            className="p-1 text-gray-400 hover:text-primary-600 rounded cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed italic">"{t.text}"</p>
                    </div>

                    <div className="pt-4 border-t border-gray-50 mt-4 text-xs font-bold">
                      <span className="text-gray-900 block">{t.name}</span>
                      <span className="text-cyan-600 block text-[10px] mt-0.5">{t.treatment}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 7: FAQ MANAGER (CRUD)
            ---------------------------------------------------- */}
        {activeTab === "faqs" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">الأسئلة الشائعة والإجابات</h1>
                <p className="text-xs text-gray-500 mt-1">تعديل وتحديث الأسئلة والحلول الطبية لإفادة زوار الموقع</p>
              </div>
              {!editingFaq && (
                <button
                  onClick={startNewFaq}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة سؤال وجواب</span>
                </button>
              )}
            </div>

            {editingFaq ? (
              <form onSubmit={handleSaveFaq} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">تعديل السؤال الشائع</h2>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">السؤال المطروح</label>
                    <input
                      type="text"
                      value={editingFaq.question}
                      onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">الإجابة الطبية والتنظيمية الوافية</label>
                    <textarea
                      value={editingFaq.answer}
                      onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow cursor-pointer"
                  >
                    حفظ التغييرات
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingFaq(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    إلغاء التعديل
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <h3 className="text-sm md:text-base font-extrabold text-gray-950 flex items-center gap-2">
                          <HelpCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                          <span>{faq.question}</span>
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed pr-7">{faq.answer}</p>
                      </div>

                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => setEditingFaq(faq)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg cursor-pointer"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
