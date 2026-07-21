/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useClinicData } from "../hooks/useClinicData";
import { Star, ShieldCheck, Heart, User, Quote } from "lucide-react";
const doctorPortrait = "/src/assets/images/dr_youssef_portrait_1784554539377.jpg";

export default function Testimonials() {
  const { testimonials, settings } = useClinicData();
  const defaultDoctorPortrait = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop";
  const currentDoctorPortrait = settings.doctorImageUrl || defaultDoctorPortrait;

  const showDoctorBio = settings.doctorBioVisible ?? true;
  const showTestimonials = settings.testimonialsVisible ?? true;

  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      {/* Background soft gradients */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary-50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-emerald-800 text-sm font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>آراء مرضانا الموثقة</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            قصص نجاح وابتسامات نعتز بصنعها
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            ثقة مرضانا هي المحرك الأساسي لتميزنا. استمع لآراء وتجارب المرضى الفعليين الذين تشرفنا بعلاجهم وتجميل أسنانهم في فروع عياداتنا.
          </p>
        </div>

        {/* Layout Grid: Doctor Message Card + Google Reviews Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Doctor Message Bio Card (4 columns) */}
          {showDoctorBio && (
            <div className={`${showTestimonials ? "lg:col-span-5" : "lg:col-span-12"} bg-gradient-to-b from-primary-900 to-primary-950 text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden text-right border-4 border-primary-800`}>
              {/* Background pattern */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

              <div className="relative space-y-6">
                
                {/* Doctor Avatar */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-primary-700/60 shadow-lg mx-auto md:mr-0 md:ml-auto">
                  <img
                    src={currentDoctorPortrait}
                    alt={settings.doctorName || "الدكتور يوسف الشاذلي"}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Bio Details */}
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black">{settings.doctorName || "د. يوسف الشاذلي"}</h3>
                  <p className="text-xs font-bold text-cyan-400 tracking-wider">
                    {settings.doctorTitle || "أخصائي طب وتجميل الأسنان وعلاج الجذور"}
                  </p>
                </div>

                {/* Message Quote */}
                <div className="relative pt-4 border-t border-primary-800">
                  <Quote className="absolute top-2 left-0 w-10 h-10 text-primary-800 -scale-x-100 pointer-events-none opacity-40" />
                  <p className="text-sm text-primary-100 leading-relaxed font-medium font-sans">
                    "{settings.doctorBio || "في عياداتنا، لا ننظر لعلاج الأسنان كمجرد إجراء طبي تقليدي، بل هو مهارة وفن يستهدف إعادة الثقة والراحة والابتسامة المشرقة لكل مريض. نلتزم بأعلى درجات التعقيم وأحدث ما توصل إليه العلم لخدمة أهلنا في القليوبية."}"
                  </p>
                </div>

                {/* Heart signature */}
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold pt-2">
                  <Heart className="w-4 h-4 fill-cyan-400" />
                  <span>{settings.doctorMotto || "شعارنا: ابتسامتكم أمانتنا وهدفنا الأول"}</span>
                </div>

              </div>
            </div>
          )}

          {/* Google Reviews Grid (7 columns) */}
          {showTestimonials && (
            <div className={`${showDoctorBio ? "lg:col-span-7" : "lg:col-span-12"} space-y-8`}>
            
            {/* Google Trust Badge Summary */}
            <div className="bg-gray-50 border border-gray-100 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  {/* Google Custom G Logo SVG */}
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-950 text-sm md:text-base">تقييمات مرضانا على Google</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-sm font-black text-amber-500">4.9 / 5</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-bold">(+350 تقييم موثق)</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2 bg-emerald-100/60 text-emerald-800 rounded-xl text-xs font-extrabold border border-emerald-100">
                ✓ جهة طبية معتمدة وموثوقة
              </div>
            </div>

            {/* Testimonials List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-100/40 transition-all text-right relative flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Stars and verified indicator */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        مريض موثق ✓
                      </span>
                    </div>

                    {/* Comment text */}
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium">
                      "{t.comment}"
                    </p>
                  </div>

                  {/* Patient Info Footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-4">
                    <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs md:text-sm font-extrabold text-gray-900 leading-none">
                        {t.name}
                      </h5>
                      <span className="text-[10px] text-gray-400 font-medium block mt-1">
                        {t.date}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
          )}

        </div>

      </div>
    </section>
  );
}
