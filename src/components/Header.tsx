/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Phone, MessageSquare, Menu, X, Clock, MapPin } from "lucide-react";
import { useClinicData } from "../hooks/useClinicData";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { settings, branches } = useClinicData();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "#hero", show: true },
    { name: "خدماتنا", href: "#services", show: settings.servicesVisible ?? true },
    { name: "قبل وبعد", href: "#before-after", show: settings.beforeAfterVisible ?? true },
    { name: "ابتسم معنا (اختبار)", href: "#quiz", show: settings.smileQuizVisible ?? true },
    { name: "العروض الحصرية", href: "#offers", show: settings.offersVisible ?? true },
    { name: "فروعنا", href: "#branches", show: settings.branchFinderVisible ?? true },
    { name: "الآراء", href: "#testimonials", show: (settings.testimonialsVisible ?? true) || (settings.doctorBioVisible ?? true) },
    { name: "الأسئلة الشائعة", href: "#faq", show: settings.faqVisible ?? true }
  ].filter(link => link.show);

  return (
    <header className="w-full z-50">
      {/* Emergency Contact Banner */}
      {(settings.emergencyBannerVisible ?? true) && (
        <div className="bg-red-600 text-white py-2 px-4 text-xs md:text-sm font-extrabold text-center relative overflow-hidden animate-pulse border-b border-red-700 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping"></span>
              <span>{settings.emergencyBannerText || "🚨 طوارئ أسنان؟ اتصل بنا فورا على مدار 24 ساعة:"}</span>
            </span>
            <a
              href={`tel:${settings.emergencyBannerPhone || settings.emergencyPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-red-700 rounded-lg hover:bg-red-50 hover:text-red-800 transition-all font-bold text-xs shadow"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.emergencyBannerPhone || settings.emergencyPhone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Announcement Bar */}
      <div className="bg-top-banner text-white py-2 px-4 text-xs md:text-sm font-medium transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary-300" />
              <span>مواعيد العمل: {settings.workingHours}</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary-300" />
              <span>الفروع: {branches && branches.length > 0 ? branches.map(b => b.name.replace("فرع ", "")).join(" - ") : "بنها - مرصفا - سندنهور"}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-primary-200">للحجز والاستفسار الفوري:</span>
            <a href={`tel:${settings.phone}`} className="hover:text-primary-300 transition-colors font-mono font-bold">
              {settings.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "sticky top-0 bg-white/95 backdrop-blur-md shadow-md py-3"
            : "bg-white py-4"
        }`}
        style={{ position: isScrolled ? "fixed" : "relative" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <a href="#hero" className="flex items-center gap-3 group">
            {settings.logoImageUrl ? (
              <img
                src={settings.logoImageUrl}
                alt={settings.logoText || settings.title}
                className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-xl shadow-lg"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-primary-700 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:scale-105 transition-transform">
                {/* Custom Elegant Tooth SVG integrated natively */}
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2C10 2 8 3 7 4.5 5.5 6 5 8 5 10c0 4 3.5 7 7 11 3.5-4 7-7 7-11 0-2-.5-4-2-5.5C16 3 14 2 12 2z" />
                  <path d="M12 6c1 1 1 3 0 4-1-1-1-3 0-4z" />
                </svg>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-lg md:text-xl text-primary-800 leading-tight">
                {settings.logoText || settings.title}
              </span>
              <span className="text-xs text-cyan-600 font-semibold tracking-wider">
                {settings.subtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2 px-4 py-2 border-2 border-primary-100 hover:border-primary-200 rounded-xl text-primary-700 hover:bg-primary-50 text-sm font-bold transition-all shadow-sm"
            >
              <Phone className="w-4 h-4 text-primary-500" />
              <span>اتصل الآن</span>
            </a>
            <button
              onClick={() => window.dispatchEvent(new Event("open-booking-modal"))}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>احجز الآن (واتساب)</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href={`tel:${settings.phone}`}
              className="p-2 bg-primary-50 hover:bg-primary-100 rounded-xl text-primary-700 transition-all md:hidden"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-800 transition-all"
              aria-label="Toggle Navigation Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-xl absolute top-full left-0 w-full z-50 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-primary-50/80 transition-all"
                >
                  {link.name}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-all text-sm"
                >
                  <Phone className="w-4 h-4 text-primary-600" />
                  <span>اتصل الآن</span>
                </a>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.dispatchEvent(new Event("open-booking-modal"));
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all text-sm shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>احجز الآن</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
