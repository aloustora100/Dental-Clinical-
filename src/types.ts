/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BeforeAfterTreatment {
  id: string;
  title: string;
  description: string;
  beforeUrl: string;
  afterUrl: string;
  category: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    value: string;
  }[];
}

export interface Service {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  iconName: string;
  details: string[];
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  originalPrice: string;
  discountedPrice: string;
  expiryTime: string; // ISO string or specific time
  features: string[];
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  mapsLink: string;
  phone: string;
  whatsAppLink: string;
  hours: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ClinicSettings {
  // General & Contact
  title: string;
  subtitle: string;
  phone: string;
  whatsapp: string;
  emergencyPhone: string;
  workingHours: string;
  logoText: string;
  logoImageUrl?: string;

  // Emergency Banner
  emergencyBannerText: string;
  emergencyBannerPhone: string;
  emergencyBannerVisible: boolean;

  // Hero Section
  heroBadgeText: string;
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  heroImageUrl: string;
  
  // Hero Stats Counters
  statsSpecialtiesValue: string;
  statsSpecialtiesLabel: string;
  statsBranchesValue: string;
  statsBranchesLabel: string;
  statsSmilesValue: string;
  statsSmilesLabel: string;

  // Doctor Profile
  doctorName: string;
  doctorTitle: string;
  doctorBio: string;
  doctorImageUrl: string;
  doctorMotto: string;

  // Branding & Theme Customizer
  primaryColor: string; // e.g. #2552eb
  secondaryColor: string; // e.g. #06b6d4
  topBannerColor: string; // e.g. #1d2e73
  footerBgColor: string; // e.g. #1e293b

  // Footer & Social Media
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialTiktok: string;
  socialWhatsapp: string;
  footerDescription: string;
  footerCopyright: string;

  // Interactive 4-Step Booking Modal
  bookingStep1Title: string;
  bookingStep1Subtitle: string;
  bookingStep2Title: string;
  bookingStep2Subtitle: string;
  bookingStep3Title: string;
  bookingStep3Subtitle: string;
  bookingStep4Title: string;
  bookingStep4Subtitle: string;
  bookingTimeSlots: string[]; // List of strings for slots
  bookingActiveDays: string; // Active days description
  bookingWhatsappTemplate: string; // Dynamic placeholder text

  // Smile Quiz Manager
  quizIntroTitle: string;
  quizIntroSubtitle: string;
  quizCompletedTitle: string;
  quizCompletedSubtitle: string;
  quizWhatsappTemplate: string;

  // Attending Doctors List
  bookingDoctors: string[];

  // Global Section Visibility Controls
  testimonialsVisible: boolean;
  doctorBioVisible: boolean;
  smileQuizVisible: boolean;
  offersVisible: boolean;
  beforeAfterVisible: boolean;
  servicesVisible: boolean;
  branchFinderVisible: boolean;
  faqVisible: boolean;
}
