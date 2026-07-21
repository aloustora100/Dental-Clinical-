/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BeforeAfter from "./components/BeforeAfter";
import SmileQuiz from "./components/SmileQuiz";
import Services from "./components/Services";
import Offers from "./components/Offers";
import BranchFinder from "./components/BranchFinder";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import Login from "./components/Admin/Login";
import Dashboard from "./components/Admin/Dashboard";
import { useClinicData } from "./hooks/useClinicData";
import { MessageSquare } from "lucide-react";

export default function App() {
  const { settings } = useClinicData();

  // Theme color injection
  useEffect(() => {
    const primary = settings.primaryColor || "#2552eb";
    const secondary = settings.secondaryColor || "#06b6d4";
    const topBanner = settings.topBannerColor || "#1d2e73";
    const footerBg = settings.footerBgColor || "#1e293b";

    const hexToRgb = (hex: string) => {
      try {
        const cleanHex = hex.replace("#", "");
        const bigint = parseInt(cleanHex.length === 3 ? cleanHex.split("").map(c => c + c).join("") : cleanHex, 16);
        return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
      } catch (e) {
        return { r: 37, g: 82, b: 235 };
      }
    };

    const rgbToHex = (r: number, g: number, b: number) => {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const mix = (c: {r: number, g: number, b: number}, target: {r: number, g: number, b: number}, weight: number) => {
      return rgbToHex(
        Math.round(c.r * (1 - weight) + target.r * weight),
        Math.round(c.g * (1 - weight) + target.g * weight),
        Math.round(c.b * (1 - weight) + target.b * weight)
      );
    };

    const applyTheme = (colorHex: string, prefix: string) => {
      const rgb = hexToRgb(colorHex);
      const white = { r: 255, g: 255, b: 255 };
      const black = { r: 0, g: 0, b: 0 };

      const shades = {
        50: mix(rgb, white, 0.95),
        100: mix(rgb, white, 0.90),
        200: mix(rgb, white, 0.80),
        300: mix(rgb, white, 0.60),
        400: mix(rgb, white, 0.30),
        500: colorHex,
        600: mix(rgb, black, 0.15),
        700: mix(rgb, black, 0.30),
        800: mix(rgb, black, 0.45),
        900: mix(rgb, black, 0.60),
      };

      Object.entries(shades).forEach(([shade, value]) => {
        document.documentElement.style.setProperty(`--color-${prefix}-${shade}`, value);
      });
    };

    applyTheme(primary, "primary");
    applyTheme(secondary, "cyan");

    document.documentElement.style.setProperty("--color-top-banner", topBanner);
    document.documentElement.style.setProperty("--color-footer-bg", footerBg);
  }, [settings.primaryColor, settings.secondaryColor, settings.topBannerColor, settings.footerBgColor]);

  // Unified routing state
  const [currentRoute, setCurrentRoute] = useState<"home" | "admin">(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.endsWith("/admin") || path.endsWith("/admin/login") || hash === "#admin" || hash.startsWith("#admin/")) {
      return "admin";
    }
    return "home";
  });

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("clinic_admin_authenticated") === "true";
  });

  useEffect(() => {
    const handleRouteCheck = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.endsWith("/admin") || path.endsWith("/admin/login") || hash === "#admin" || hash.startsWith("#admin/")) {
        setCurrentRoute("admin");
      } else {
        setCurrentRoute("home");
      }
    };

    window.addEventListener("popstate", handleRouteCheck);
    window.addEventListener("hashchange", handleRouteCheck);
    return () => {
      window.removeEventListener("popstate", handleRouteCheck);
      window.removeEventListener("hashchange", handleRouteCheck);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("clinic_admin_authenticated");
    setIsAdminAuthenticated(false);
  };

  const handleBackToHome = () => {
    window.location.hash = "";
    if (window.location.pathname.endsWith("/admin") || window.location.pathname.endsWith("/admin/login")) {
      window.history.pushState({}, "", "/");
    }
    setCurrentRoute("home");
  };

  // Render Admin Gateway
  if (currentRoute === "admin") {
    if (isAdminAuthenticated) {
      return <Dashboard onLogout={handleLogout} />;
    } else {
      return <Login onLoginSuccess={handleLoginSuccess} onBackToHome={handleBackToHome} />;
    }
  }

  // Render Public Dental Landing Page
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-primary-600 selection:text-white" dir="rtl">
      {/* Sticky Header and Announcements */}
      <Header />

      <main className="relative">
        {/* Hero Banner Section */}
        <Hero />

        {/* Before / After Treatment Gallery */}
        {(settings.beforeAfterVisible ?? true) && <BeforeAfter />}

        {/* Step-by-Step Smile Diagnostics Quiz */}
        {(settings.smileQuizVisible ?? true) && <SmileQuiz />}

        {/* Dental Services Grid with Modals */}
        {(settings.servicesVisible ?? true) && <Services />}

        {/* Promo Limited-Time Offers */}
        {(settings.offersVisible ?? true) && <Offers />}

        {/* Qalyubia Branches Card Finder */}
        {(settings.branchFinderVisible ?? true) && <BranchFinder />}

        {/* Patient Reviews & Dr Bio card */}
        {((settings.testimonialsVisible ?? true) || (settings.doctorBioVisible ?? true)) && <Testimonials />}

        {/* Expandable FAQ accordions */}
        {(settings.faqVisible ?? true) && <FAQ />}
      </main>

      {/* Footer and Mobile Action Bar */}
      <Footer />

      {/* Multi-Step Booking Modal */}
      <BookingModal />

      {/* Floating Sticky WhatsApp Booking Widget */}
      <div className="fixed bottom-6 left-6 z-40 group">
        <button
          onClick={() => window.dispatchEvent(new Event("open-booking-modal"))}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-200 hover:scale-105 active:scale-95 transition-all duration-300 relative cursor-pointer"
          title="حجز موعد سريع عبر الواتساب"
        >
          {/* Pulse Ripple Effect */}
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping -z-10"></span>
          
          <MessageSquare className="w-6 h-6 stroke-[2.5]" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-extrabold pr-0 group-hover:pr-2">
            حجز موعد سريع
          </span>
        </button>
      </div>
    </div>
  );
}
