/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BeforeAfterTreatment,
  Service,
  Offer,
  Branch,
  Testimonial,
  FAQItem,
  ClinicSettings
} from "../types";

import {
  BEFORE_AFTER_TREATMENTS,
  SERVICES,
  OFFERS,
  BRANCHES,
  TESTIMONIALS,
  FAQ_ITEMS
} from "../data";

// Default admin credentials
const DEFAULT_ADMIN_USER = "admin";
const DEFAULT_ADMIN_PASS = "password123";

const DEFAULT_SETTINGS: ClinicSettings = {
  title: "عيادات الدكتور يوسف الشاذلي",
  subtitle: "لطب وتجميل الأسنان بأحدث التقنيات العالمية وبأعلى مستويات التعقيم",
  phone: "01063314572",
  whatsapp: "01063314572",
  emergencyPhone: "01098201691",
  workingHours: "يومياً من الساعة 2 ظهراً حتى 10 مساءً",
  logoText: "د. يوسف الشاذلي",
  logoImageUrl: "",

  // Emergency Banner
  emergencyBannerText: "🚨 طوارئ أسنان؟ اتصل بنا فورا على مدار 24 ساعة:",
  emergencyBannerPhone: "01098201691",
  emergencyBannerVisible: true,

  // Hero Section
  heroBadgeText: "الرعاية الأفضل لابتسامة تليق بك",
  heroHeading: "عيادات د. يوسف الشاذلي لطب الأسنان",
  heroSubheading: "الرعاية المتكاملة لابتسامة صحية وجذابة بأحدث الأجهزة والتقنيات الرقمية العالمية",
  heroDescription: "نصنع الابتسامة التي تحلم بها بأعلى معايير الجودة والتعقيم العالمي. فروعنا في بنها، مرصفا، وسندنهور مجهزة بأحدث التقنيات الرقمية والكوادر الطبية المتخصصة لضمان راحة تامة وعلاج بدون ألم.",
  heroImageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop",
  
  // Hero Stats Counters
  statsSpecialtiesValue: "11",
  statsSpecialtiesLabel: "تخصصاً طبياً وعلاجياً",
  statsBranchesValue: "3",
  statsBranchesLabel: "فروع نشطة لخدمتكم",
  statsSmilesValue: "+15,000",
  statsSmilesLabel: "ابتسامة جديدة وسعيدة",

  // Doctor Profile
  doctorName: "د. يوسف الشاذلي",
  doctorTitle: "أخصائي طب وتجميل الأسنان وعلاج الجذور",
  doctorBio: "في عياداتنا، لا ننظر لعلاج الأسنان كمجرد إجراء طبي تقليدي، بل هو مهارة وفن يستهدف إعادة الثقة والراحة والابتسامة المشرقة لكل مريض. نلتزم بأعلى درجات التعقيم وأحدث ما توصل إليه العلم لخدمة أهلنا في القليوبية.",
  doctorImageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop",
  doctorMotto: "شعارنا: ابتسامتكم أمانتنا وهدفنا الأول",

  // Branding & Theme Customizer
  primaryColor: "#2552eb",
  secondaryColor: "#06b6d4",
  topBannerColor: "#1d2e73",
  footerBgColor: "#1e293b",

  // Footer & Social Media
  socialFacebook: "https://facebook.com",
  socialInstagram: "https://instagram.com",
  socialYoutube: "https://youtube.com",
  socialTiktok: "https://tiktok.com",
  socialWhatsapp: "01063314572",
  footerDescription: "عيادات الدكتور يوسف الشاذلي لطب وتجميل الأسنان - نقدم رعاية طبية متكاملة بأحدث الأجهزة والتقنيات لضمان ابتسامة مثالية وصحية.",
  footerCopyright: "جميع الحقوق محفوظة © عيادات د. يوسف الشاذلي لطب الأسنان ٢٠٢٦",

  // Interactive 4-Step Booking Modal
  bookingStep1Title: "أدخل بياناتك الشخصية",
  bookingStep1Subtitle: "من فضلك قم بإدخال بيانات الاتصال لتسجيل ملفك الطبي المبدئي.",
  bookingStep2Title: "اختر الخدمة والفرع والطبيب",
  bookingStep2Subtitle: "اختر الفرع الأقرب والخدمة المطلوبة لتوجيهك بشكل صحيح.",
  bookingStep3Title: "اختر الموعد المفضل والتوقيت",
  bookingStep3Subtitle: "حدد التاريخ والتوقيت الأنسب لزيارتك للعيادة.",
  bookingStep4Title: "مراجعة وتأكيد تفاصيل الحجز",
  bookingStep4Subtitle: "راجع البيانات أدناه ثم اضغط على زر الإرسال للتأكيد عبر الواتساب فوراً.",
  bookingTimeSlots: ["صباحي - من 12ظ لـ 4ع", "مسائي - من 6م لـ 10م"],
  bookingActiveDays: "يومياً عدا الجمعة",
  bookingWhatsappTemplate: "مرحباً عيادات الدكتور يوسف الشاذلي، أود تأكيد حجز موعد كالتالي:\n\n👤 *الاسم الكامل:* [NAME]\n📱 *رقم الهاتف:* [PHONE]\n🏥 *الفرع:* [BRANCH]\n🩺 *الخدمة المطلوبة:* [SERVICE]\n👨‍⚕️ *الطبيب المعالج:* [DOCTOR]\n📅 *تاريخ الحجز المفضل:* [DATE]\n⏰ *توقيت الحجز:* [TIME]\n\nالرجاء تأكيد الحجز وإفادتي بالتعليمات الخاصة بالزيارة. شكراً لكم!",

  // Smile Quiz Manager
  quizIntroTitle: "اختبر صحة ابتسامتك في دقيقة واحدة",
  quizIntroSubtitle: "أجب عن 4 أسئلة سريعة لمساعدتنا في تشخيص حالتك المبدئية، واحصل على خطة علاجية مخصصة وعرض حجز استشارة مجانية عبر الواتساب.",
  quizCompletedTitle: "لقد انتهيت من تشخيص ابتسامتك بنجاح!",
  quizCompletedSubtitle: "قمنا بتحليل إجاباتك وصياغة تقرير أولي لحالتك. اضغط على الزر بالأسفل لإرسال التقرير للدكتور يوسف وحجز موعد كشف بخصم حصرى مخصص لك.",
  quizWhatsappTemplate: "مرحباً عيادات الدكتور يوسف الشاذلي، قمت بإجراء اختبار ابتسامتي السريعة عبر موقعكم الإلكتروني وإليكم إجاباتي للاستشارة المبدئية وحجز كشف:\n\n[RESPONSES]\n\nأود حجز موعد استشارة مبدئية مع الطبيب في أقرب وقت. شكراً لكم!",

  // Attending Doctors List
  bookingDoctors: ["د. يوسف الشاذلي", "د. أحمد المصري", "د. سارة الطحان"],

  // Global Section Visibility Controls
  testimonialsVisible: true,
  doctorBioVisible: true,
  smileQuizVisible: true,
  offersVisible: true,
  beforeAfterVisible: true,
  servicesVisible: true,
  branchFinderVisible: true,
  faqVisible: true
};

// Storage keys
const KEYS = {
  SETTINGS: "clinic_settings",
  SERVICES: "clinic_services",
  BEFORE_AFTER: "clinic_before_after",
  OFFERS: "clinic_offers",
  BRANCHES: "clinic_branches",
  TESTIMONIALS: "clinic_testimonials",
  FAQS: "clinic_faqs",
  ADMIN_USER: "clinic_admin_user",
  ADMIN_PASS: "clinic_admin_pass"
};

export const dataManager = {
  // Clinic Settings
  getSettings(): ClinicSettings {
    const saved = localStorage.getItem(KEYS.SETTINGS);
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: ClinicSettings) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    // Trigger custom event to notify components that are listening
    window.dispatchEvent(new Event("clinic-data-updated"));
  },

  // Services
  getServices(): Service[] {
    const saved = localStorage.getItem(KEYS.SERVICES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SERVICES;
      }
    }
    return SERVICES;
  },

  saveServices(services: Service[]) {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
    window.dispatchEvent(new Event("clinic-data-updated"));
  },

  // Before & After
  getBeforeAfter(): BeforeAfterTreatment[] {
    const saved = localStorage.getItem(KEYS.BEFORE_AFTER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return BEFORE_AFTER_TREATMENTS;
      }
    }
    return BEFORE_AFTER_TREATMENTS;
  },

  saveBeforeAfter(treatments: BeforeAfterTreatment[]) {
    localStorage.setItem(KEYS.BEFORE_AFTER, JSON.stringify(treatments));
    window.dispatchEvent(new Event("clinic-data-updated"));
  },

  // Offers
  getOffers(): Offer[] {
    const saved = localStorage.getItem(KEYS.OFFERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return OFFERS;
      }
    }
    return OFFERS;
  },

  saveOffers(offers: Offer[]) {
    localStorage.setItem(KEYS.OFFERS, JSON.stringify(offers));
    window.dispatchEvent(new Event("clinic-data-updated"));
  },

  // Branches
  getBranches(): Branch[] {
    const saved = localStorage.getItem(KEYS.BRANCHES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return BRANCHES;
      }
    }
    return BRANCHES;
  },

  saveBranches(branches: Branch[]) {
    localStorage.setItem(KEYS.BRANCHES, JSON.stringify(branches));
    window.dispatchEvent(new Event("clinic-data-updated"));
  },

  // Testimonials
  getTestimonials(): Testimonial[] {
    const saved = localStorage.getItem(KEYS.TESTIMONIALS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return TESTIMONIALS;
      }
    }
    return TESTIMONIALS;
  },

  saveTestimonials(testimonials: Testimonial[]) {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    window.dispatchEvent(new Event("clinic-data-updated"));
  },

  // FAQs
  getFAQs(): FAQItem[] {
    const saved = localStorage.getItem(KEYS.FAQS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return FAQ_ITEMS;
      }
    }
    return FAQ_ITEMS;
  },

  saveFAQs(faqs: FAQItem[]) {
    localStorage.setItem(KEYS.FAQS, JSON.stringify(faqs));
    window.dispatchEvent(new Event("clinic-data-updated"));
  },

  // Admin auth and management
  getAdminUser(): string {
    return localStorage.getItem(KEYS.ADMIN_USER) || DEFAULT_ADMIN_USER;
  },

  getAdminPass(): string {
    return localStorage.getItem(KEYS.ADMIN_PASS) || DEFAULT_ADMIN_PASS;
  },

  updateAdminCredentials(user: string, pass: string) {
    localStorage.setItem(KEYS.ADMIN_USER, user);
    localStorage.setItem(KEYS.ADMIN_PASS, pass);
  },

  // Export & Import full database
  exportBackup(): string {
    const data = {
      settings: this.getSettings(),
      services: this.getServices(),
      beforeAfter: this.getBeforeAfter(),
      offers: this.getOffers(),
      branches: this.getBranches(),
      testimonials: this.getTestimonials(),
      faqs: this.getFAQs(),
      adminUser: this.getAdminUser(),
      adminPass: this.getAdminPass()
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) this.saveSettings(data.settings);
      if (data.services) this.saveServices(data.services);
      if (data.beforeAfter) this.saveBeforeAfter(data.beforeAfter);
      if (data.offers) this.saveOffers(data.offers);
      if (data.branches) this.saveBranches(data.branches);
      if (data.testimonials) this.saveTestimonials(data.testimonials);
      if (data.faqs) this.saveFAQs(data.faqs);
      if (data.adminUser) localStorage.setItem(KEYS.ADMIN_USER, data.adminUser);
      if (data.adminPass) localStorage.setItem(KEYS.ADMIN_PASS, data.adminPass);
      window.dispatchEvent(new Event("clinic-data-updated"));
      return true;
    } catch (e) {
      console.error("Failed to import clinic backup:", e);
      return false;
    }
  },

  // Reset to default clinic structure
  resetToDefaults() {
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.SERVICES);
    localStorage.removeItem(KEYS.BEFORE_AFTER);
    localStorage.removeItem(KEYS.OFFERS);
    localStorage.removeItem(KEYS.BRANCHES);
    localStorage.removeItem(KEYS.TESTIMONIALS);
    localStorage.removeItem(KEYS.FAQS);
    window.dispatchEvent(new Event("clinic-data-updated"));
  }
};
