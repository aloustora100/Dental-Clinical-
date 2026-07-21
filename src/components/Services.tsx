/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useClinicData } from "../hooks/useClinicData";
import { Service } from "../types";
import {
  Sparkles,
  Shield,
  Activity,
  Layers,
  Scissors,
  Flame,
  Check,
  ChevronLeft,
  X,
  PhoneCall,
  MessageSquare,
  BookmarkPlus,
  Smile,
  Heart
} from "lucide-react";

export default function Services() {
  const { settings, services } = useClinicData();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Icon mapping helper
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Activity":
        return <Activity className="w-6 h-6" />;
      case "Layers":
        return <Layers className="w-6 h-6" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6" />;
      case "Shield":
        return <Shield className="w-6 h-6" />;
      case "Scissors":
        return <Scissors className="w-6 h-6" />;
      case "Flame":
        return <Flame className="w-6 h-6" />;
      case "Smile":
        return <Smile className="w-6 h-6" />;
      case "Heart":
        return <Heart className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getWhatsAppServiceLink = (serviceName: string) => {
    const text = `مرحباً عيادات الدكتور يوسف الشاذلي، أود الاستفسار وحجز موعد بخصوص خدمة: ${serviceName}`;
    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="services" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 rounded-full text-primary-800 text-sm font-bold">
            <BookmarkPlus className="w-4 h-4" />
            <span>خدماتنا الطبية والتجميلية</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            نعتني بابتسامتك بأعلى مستوى من الاحترافية
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            نقدم باقة متكاملة من أرقى خدمات طب وتجميل الأسنان المعتمدة على دقة التشخيص وأحدث الأجهزة والتقنيات لتجربة علاجية استثنائية وبدون ألم.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Icon Wrapper */}
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {getIcon(service.iconName)}
                </div>

                <div className="space-y-2 text-right">
                  <h3 className="text-xl font-extrabold text-gray-950 group-hover:text-primary-700 transition-colors">
                    {service.arabicTitle}
                  </h3>
                  <span className="text-xs font-bold text-gray-400 tracking-wider block uppercase font-mono">
                    {service.title}
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed pt-2">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-gray-50 flex items-center justify-between">
                <button
                  onClick={() => setSelectedService(service)}
                  className="flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer group/btn"
                >
                  <span>التفاصيل والمميزات</span>
                  <ChevronLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                </button>

                <a
                  href={getWhatsAppServiceLink(service.arabicTitle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-inner"
                  title="احجز هذه الخدمة فوراً"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Interactive Modal overlay */}
        {selectedService && (
          <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div
              className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative border border-gray-100 animate-scale-up text-right"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Banner decorative */}
              <div className="bg-gradient-to-tr from-primary-800 to-primary-600 p-8 text-white relative">
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4">
                  {getIcon(selectedService.iconName)}
                </div>
                <h3 className="text-2xl font-extrabold">{selectedService.arabicTitle}</h3>
                <p className="text-xs text-primary-200 mt-1 uppercase font-mono tracking-wider font-semibold">
                  {selectedService.title}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <h4 className="font-extrabold text-gray-900 text-base">ماذا تقدم لك العيادة في هذه الخدمة؟</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    نعتمد على أعلى درجات الدقة لنوفر لك تجربة علاجية لا تُنسى:
                  </p>
                </div>

                {/* Detail Points list */}
                <ul className="space-y-3">
                  {selectedService.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>

                {/* Call to Actions inside modal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-gray-100">
                  <a
                    href={getWhatsAppServiceLink(selectedService.arabicTitle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>احجز استشارة واتساب</span>
                  </a>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl font-bold transition-all text-sm border border-gray-100"
                  >
                    إغلاق التفاصيل
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
