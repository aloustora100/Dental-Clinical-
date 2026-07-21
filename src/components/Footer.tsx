/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Phone, MessageSquare, MapPin, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import { useClinicData } from "../hooks/useClinicData";

export default function Footer() {
  const { settings, branches } = useClinicData();
  const socialLinks = [
    { id: "fb", icon: Facebook, href: settings.socialFacebook || "https://facebook.com", color: "hover:bg-blue-600 hover:text-white" },
    { id: "ig", icon: Instagram, href: settings.socialInstagram || "https://instagram.com", color: "hover:bg-pink-600 hover:text-white" },
    { id: "yt", icon: Youtube, href: settings.socialYoutube || "https://youtube.com", color: "hover:bg-red-600 hover:text-white" }
  ];

  return (
    <footer className="bg-footer-bg text-gray-300 pt-20 pb-24 md:pb-12 text-right relative border-t border-primary-900">
      
      {/* Top Footer Widgets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-primary-900 pb-16 mb-12">
        
        {/* Clinic branding (4 columns) */}
        <div className="md:col-span-5 space-y-5">
          <div className="flex items-center gap-3">
            {settings.logoImageUrl ? (
              <img
                src={settings.logoImageUrl}
                alt={settings.logoText || settings.title}
                className="w-12 h-12 object-contain rounded-xl shadow-lg"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-tr from-primary-700 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
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
            <div>
              <h3 className="text-xl font-extrabold text-white leading-none">{settings.logoText || settings.title}</h3>
              <span className="text-xs text-cyan-400 font-bold block mt-1 tracking-wider">{settings.subtitle}</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            {settings.footerDescription || "صرح طبي متميز ومتكامل في محافظة القليوبية لعلاج وتجميل الأسنان وتصميم الابتسامة الرقمية بأحدث الأجهزة والتقنيات العالمية وتحت إشراف كادر طبي محترف."}
          </p>

          {/* Social Icons */}
          <div className="flex gap-2.5 pt-2">
            {socialLinks.map((s) => {
              const IconComponent = s.icon;
              return (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 bg-primary-900 rounded-xl flex items-center justify-center text-gray-400 transition-all ${s.color}`}
                >
                  <IconComponent className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick links (3 columns) */}
        <div className="md:col-span-3 space-y-5">
          <h4 className="text-white font-extrabold text-base border-r-4 border-cyan-500 pr-3">روابط سريعة</h4>
          <ul className="space-y-2.5 text-sm font-semibold">
            <li>
              <a href="#hero" className="hover:text-cyan-400 transition-colors">الصفحة الرئيسية</a>
            </li>
            <li>
              <a href="#services" className="hover:text-cyan-400 transition-colors">خدماتنا الطبية</a>
            </li>
            <li>
              <a href="#before-after" className="hover:text-cyan-400 transition-colors">معرض قبل وبعد</a>
            </li>
            <li>
              <a href="#quiz" className="hover:text-cyan-400 transition-colors">اختبار ابتسامتي</a>
            </li>
            <li>
              <a href="#offers" className="hover:text-cyan-400 transition-colors">العروض والخصومات</a>
            </li>
          </ul>
        </div>

        {/* Branches Contact summary (4 columns) */}
        <div className="md:col-span-4 space-y-5">
          <h4 className="text-white font-extrabold text-base border-r-4 border-cyan-500 pr-3">فروعنا الرسمية</h4>
          <div className="space-y-4 text-sm">
            {branches && branches.length > 0 ? (
              branches.map((b) => (
                <div key={b.id} className="flex gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white text-xs md:text-sm">{b.name}:</h5>
                    <p className="text-xs text-gray-400 mt-1">{b.address}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white text-xs md:text-sm">فرع بنها (الرئيسي):</h5>
                  <p className="text-xs text-gray-400 mt-1">شارع فريد ندا، برج الأطباء، بجوار مجمع المحاكم</p>
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-2 border-t border-primary-900/40">
              <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-white text-xs md:text-sm">للحجز والاستعلام الموحد:</h5>
                <a href={`tel:${settings.phone}`} className="text-xs text-gray-400 font-mono hover:text-white transition-colors block mt-1">
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom copyright segment */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-500">
        <span>{settings.footerCopyright || `جميع الحقوق محفوظة © ${settings.title} ${new Date().getFullYear()}`}</span>
        <span className="flex items-center gap-4">
          <span>تم التصميم والتطوير بكل حب وصنع للابتسامة</span>
          <span className="text-gray-700">|</span>
          <a href="#admin" className="text-primary-400 hover:text-cyan-400 transition-colors">بوابة المشرفين 🔐</a>
        </span>
      </div>

      {/* Fixed Mobile Bottom Action Navigation Bar */}
      {/* Visible only on mobile screens up to md:hidden */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md shadow-[0_-4px_10px_rgba(0,0,0,0.06)] border-t border-gray-100 grid grid-cols-2 z-40 md:hidden overflow-hidden">
        
        {/* Telephone call block action */}
        <a
          href={`tel:${settings.phone}`}
          className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 text-primary-900 border-l border-gray-100 transition-colors font-bold"
        >
          <Phone className="w-5 h-5 text-primary-700" />
          <span className="text-[10px]">اتصل بنا تلفونياً</span>
        </a>

        {/* WhatsApp chat block action */}
        <button
          onClick={() => window.dispatchEvent(new Event("open-booking-modal"))}
          className="flex flex-col items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white transition-colors font-bold cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 text-white" />
          <span className="text-[10px]">احجز كشفاً بالواتساب</span>
        </button>

      </div>

    </footer>
  );
}
