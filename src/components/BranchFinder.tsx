/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useClinicData } from "../hooks/useClinicData";
import { Branch } from "../types";
import { MapPin, Clock, Phone, MessageSquare, ExternalLink, Compass } from "lucide-react";

export default function BranchFinder() {
  const { settings, branches } = useClinicData();
  const [activeBranchId, setActiveBranchId] = useState<string>("benha");

  const getWhatsAppBranchLink = (branchName: string, phone: string) => {
    const text = `مرحباً عيادات الدكتور يوسف الشاذلي، أود الاستفسار وحجز موعد كشف في: ${branchName}`;
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("2") && cleanPhone.length > 10 ? cleanPhone : `2${cleanPhone}`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="branches" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-100 rounded-full text-cyan-800 text-sm font-bold">
            <Compass className="w-4 h-4" />
            <span>فروعنا المنتشرة لخدمتكم</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            اختر الفرع الأقرب لبيتك واحجز موعدك
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            تنتشر فروعنا في مراكز القليوبية الحيوية (بنها، مرصفا، وسندنهور) لتسهيل حصولك على رعاية طبية وصحية متميزة دون عناء السفر الطويل.
          </p>
        </div>

        {/* Interactive Selector Tabs for Mobile/Tablet */}
        <div className="flex justify-center gap-2 mb-10 lg:hidden">
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setActiveBranchId(branch.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                activeBranchId === branch.id
                  ? "bg-primary-700 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-100"
              }`}
            >
              {branch.name.split(" (")[0]}
            </button>
          ))}
        </div>

        {/* Branches Layout Grid */}
        {/* Desktop: Displays all cards side by side, and hovering or clicking highlights them. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {branches.map((branch) => {
            const isSelectedMobile = activeBranchId === branch.id;
            const whatsAppUrl = getWhatsAppBranchLink(branch.name, branch.phone);

            return (
              <div
                key={branch.id}
                className={`bg-white rounded-[2.5rem] overflow-hidden border transition-all duration-300 flex flex-col justify-between group ${
                  isSelectedMobile
                    ? "border-primary-500 shadow-xl lg:border-gray-100 lg:shadow-md lg:hover:border-primary-100 lg:hover:shadow-xl"
                    : "hidden lg:flex border-gray-100 shadow-md hover:border-primary-100 hover:shadow-xl"
                }`}
              >
                {/* Branch illustrative cover */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={branch.imageUrl}
                    alt={branch.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay shadow to hold category */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 right-4 bg-primary-700 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-md">
                    متاح الكشف والاستشارة
                  </div>
                </div>

                {/* Branch Details */}
                <div className="p-6 md:p-8 space-y-5 text-right flex-grow">
                  <h3 className="text-xl md:text-2xl font-black text-gray-950">
                    {branch.name}
                  </h3>

                  <div className="space-y-4">
                    {/* Address block */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm font-bold text-gray-600 leading-relaxed">
                        {branch.address}
                      </p>
                    </div>

                    {/* Hours block */}
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm font-bold text-gray-600 leading-relaxed">
                        {branch.hours}
                      </p>
                    </div>

                    {/* Phone call block */}
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                      <a
                        href={`tel:+20${branch.phone}`}
                        className="text-xs md:text-sm font-black text-gray-700 hover:text-primary-700 transition-colors font-mono"
                      >
                        {branch.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Branch Call-to-actions */}
                <div className="px-6 pb-6 md:px-8 md:pb-8 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Google Maps link button */}
                    <a
                      href={branch.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 border-2 border-primary-100 hover:border-primary-200 hover:bg-primary-50 text-primary-800 py-3 rounded-xl font-bold transition-all text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-primary-500" />
                      <span>اتجاهات الخريطة</span>
                    </a>

                    {/* Call button */}
                    <a
                      href={`tel:+20${branch.phone}`}
                      className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold transition-all text-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-600" />
                      <span>اتصال هاتفي</span>
                    </a>
                  </div>

                  {/* WhatsApp reservation direct button */}
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-black shadow-md hover:shadow-lg transition-all text-sm w-full"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>احجز في هذا الفرع</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
