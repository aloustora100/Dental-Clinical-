/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Calendar, MessageSquare, Award, Users, MapPin, Star } from "lucide-react";
import { useClinicData } from "../hooks/useClinicData";

const defaultBannerImage = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop";

export default function Hero() {
  const { settings } = useClinicData();
  const metrics = [
    {
      id: "specialties",
      icon: Award,
      value: settings.statsSpecialtiesValue || "11",
      label: settings.statsSpecialtiesLabel || "تخصصاً طبياً وعلاجياً",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      id: "branches",
      icon: MapPin,
      value: settings.statsBranchesValue || "3",
      label: settings.statsBranchesLabel || "فروع نشطة لخدمتكم",
      color: "text-cyan-600",
      bg: "bg-cyan-50"
    },
    {
      id: "smiles",
      icon: Star,
      value: settings.statsSmilesValue || "+15,000",
      label: settings.statsSmilesLabel || "ابتسامة جديدة وسعيدة",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    }
  ];

  const currentBannerImage = settings.heroImageUrl || defaultBannerImage;

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-primary-50/20 pt-16 pb-24 md:py-32">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl -z-10 animate-pulse duration-10000" />
      <div className="absolute bottom-12 left-1/4 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Content (Right-aligned in RTL) */}
          <div className="lg:col-span-7 flex flex-col items-start text-right space-y-6 md:space-y-8">
            
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100/80 rounded-full text-primary-800 text-xs md:text-sm font-bold shadow-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary-600 animate-spin" style={{ animationDuration: '3s' }} />
              <span>{settings.heroBadgeText || "الرعاية الأفضل لابتسامة تليق بك"}</span>
            </div>

            {/* Title / Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 leading-tight md:leading-[1.15]">
              {settings.heroHeading || settings.title}
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">
                {settings.heroSubheading || settings.subtitle}
              </span>
            </h1>

            {/* Sub-description */}
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              {settings.heroDescription || "نصنع الابتسامة التي تحلم بها بأعلى معايير الجودة والتعقيم العالمي. فروعنا في بنها، مرصفا، وسندنهور مجهزة بأحدث التقنيات الرقمية والكوادر الطبية المتخصصة لضمان راحة تامة وعلاج بدون ألم."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => window.dispatchEvent(new Event("open-booking-modal"))}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary-200 hover:shadow-primary-300 transition-all text-base md:text-lg group cursor-pointer"
              >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>احجز موعد كشف الآن</span>
              </button>
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("مرحباً عيادات الدكتور يوسف الشاذلي، أود الاستفسار عن مواعيد الكشف والحجز")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50/50 text-primary-800 bg-white/80 px-8 py-4 rounded-2xl font-bold transition-all text-base md:text-lg shadow-sm"
              >
                <MessageSquare className="w-5 h-5 text-emerald-500" />
                <span>استشارة مجانية عبر واتساب</span>
              </a>
            </div>

            {/* Trust and Rating Summary */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100 w-full sm:w-auto">
              <div className="flex -space-x-2 space-x-reverse">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                  alt="مريض"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                  alt="مريض"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
                  alt="مريض"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm font-bold text-gray-900 mr-2">4.9 / 5</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">أكثر من 15,000 مريض يثقون في رعايتنا الطبية</p>
              </div>
            </div>

          </div>

          {/* Hero Visual Block */}
          <div className="lg:col-span-5 relative w-full flex justify-center items-center">
            
            {/* Visual Frame wrapper */}
            <div className="relative w-full max-w-md md:max-w-lg aspect-square lg:aspect-auto lg:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary-100 border-4 border-white group">
              <img
                src={currentBannerImage}
                alt="داخل عيادات دكتور يوسف الشاذلي لطب الأسنان"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Image Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating doctor quote card */}
              <div className="absolute bottom-6 right-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-primary-50/50">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs text-gray-500 font-bold">إشراف طبي متكامل</h4>
                  <p className="text-sm text-gray-900 font-extrabold">بإشراف الدكتور يوسف الشاذلي شخصياً</p>
                </div>
              </div>
            </div>

            {/* Glowing orb accent behind image */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-300 rounded-full blur-2xl opacity-40 -z-10" />
          </div>

        </div>

        {/* Key Metrics Counters Grid */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {metrics.map((m) => {
            const IconComponent = m.icon;
            return (
              <div
                key={m.id}
                className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-gray-100/80 flex items-center gap-5 transition-all text-right group"
              >
                <div className={`w-14 h-14 rounded-2xl ${m.bg} flex items-center justify-center ${m.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight leading-none">
                    {m.value}
                  </h3>
                  <p className="text-sm font-bold text-gray-500 mt-1.5">
                    {m.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
