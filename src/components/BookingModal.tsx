/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  MapPin,
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { useClinicData } from "../hooks/useClinicData";

interface BookingData {
  name: string;
  phone: string;
  branch: string;
  service: string;
  doctor: string;
  date: string;
  timeSlot: string;
}

export default function BookingModal() {
  const { settings, services, branches } = useClinicData();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingData>({
    name: "",
    phone: "",
    branch: "",
    service: "",
    doctor: "",
    date: "",
    timeSlot: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingData, string>>>({});

  const doctors = settings.bookingDoctors && settings.bookingDoctors.length > 0 
    ? settings.bookingDoctors 
    : ["د. يوسف الشاذلي", "د. أحمد المصري", "د. سارة الطحان"];
  const finalSlots = settings.bookingTimeSlots && settings.bookingTimeSlots.length > 0 
    ? settings.bookingTimeSlots 
    : ["صباحي - من 12ظ لـ 4ع", "مسائي - من 6م لـ 10م"];

  useEffect(() => {
    // Sync default values when lists are loaded or updated
    setFormData(prev => ({
      ...prev,
      branch: prev.branch || branches[0]?.name || "بنها (الرئيسي)",
      service: prev.service || services[0]?.arabicTitle || "تقويم الأسنان",
      doctor: prev.doctor || doctors[0] || "د. يوسف الشاذلي",
      timeSlot: prev.timeSlot || finalSlots[0] || "مسائي - من 6م لـ 10م"
    }));
  }, [branches, services, doctors, finalSlots]);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      const initialService = customEvent.detail?.service || (services[0]?.arabicTitle || "تقويم الأسنان");
      const initialBranch = branches[0]?.name || "بنها (الرئيسي)";
      const defaultDoctor = doctors[0] || "د. يوسف الشاذلي";
      const defaultTimeSlot = finalSlots[0] || "مسائي - من 6م لـ 10م";

      setFormData(prev => ({
        ...prev,
        branch: initialBranch,
        service: initialService,
        doctor: defaultDoctor,
        timeSlot: defaultTimeSlot
      }));
      setIsOpen(true);
      setStep(1);
    };
    window.addEventListener("open-booking-modal", handleOpen);
    return () => window.removeEventListener("open-booking-modal", handleOpen);
  }, [branches, services, doctors, finalSlots]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateStep = () => {
    const nextErrors: Partial<Record<keyof BookingData, string>> = {};
    if (step === 1) {
      if (!formData.name.trim()) {
        nextErrors.name = "الرجاء إدخال الاسم الكامل";
      } else if (formData.name.trim().length < 4) {
        nextErrors.name = "الاسم يجب أن يكون ثنائياً على الأقل";
      }

      if (!formData.phone.trim()) {
        nextErrors.phone = "الرجاء إدخال رقم الهاتف";
      } else if (!/^01[0125]\d{8}$/.test(formData.phone.trim())) {
        nextErrors.phone = "الرجاء إدخال رقم هاتف مصري صحيح (مثال: 01063314572)";
      }
    } else if (step === 2) {
      if (!formData.branch) nextErrors.branch = "الرجاء اختيار الفرع";
      if (!formData.service) nextErrors.service = "الرجاء اختيار الخدمة المطلوبة";
      if (!formData.doctor) nextErrors.doctor = "الرجاء اختيار الطبيب";
    } else if (step === 3) {
      if (!formData.date) {
        nextErrors.date = "الرجاء اختيار تاريخ الحجز";
      } else {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          nextErrors.date = "لا يمكن حجز موعد في تاريخ سابق";
        }
      }
      if (!formData.timeSlot) nextErrors.timeSlot = "الرجاء اختيار التوقيت المفضل";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  // Generate dynamic Arabic WhatsApp message and URL
  const getWhatsAppLink = () => {
    const template = settings.bookingWhatsappTemplate || "مرحباً عيادات الدكتور يوسف الشاذلي، أود تأكيد حجز موعد كالتالي:\n\n👤 *الاسم الكامل:* [NAME]\n📱 *رقم الهاتف:* [PHONE]\n🏥 *الفرع:* [BRANCH]\n🩺 *الخدمة المطلوبة:* [SERVICE]\n👨‍⚕️ *الطبيب المعالج:* [DOCTOR]\n📅 *تاريخ الحجز المفضل:* [DATE]\n⏰ *توقيت الحجز:* [TIME]\n\nالرجاء تأكيد الحجز وإفادتي بالتعليمات الخاصة بالزيارة. شكراً لكم!";
    
    const message = template
      .replace("[NAME]", formData.name.trim())
      .replace("[PHONE]", formData.phone.trim())
      .replace("[BRANCH]", formData.branch)
      .replace("[SERVICE]", formData.service)
      .replace("[DOCTOR]", formData.doctor)
      .replace("[DATE]", formData.date)
      .replace("[TIME]", formData.timeSlot);

    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in text-right">
      <div
        className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Decorator */}
        <div className="bg-gradient-to-tr from-primary-800 to-cyan-700 p-6 text-white relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">حجز موعد إلكتروني فوراً</h3>
              <p className="text-xs text-primary-200 mt-0.5 font-medium">أكمل الخطوات البسيطة لتأكيد حجزك عبر الواتساب</p>
            </div>
          </div>

          {/* Step Stepper Indicator */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 text-xs font-bold text-primary-200">
            <div className="flex gap-2 w-full justify-around items-center">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all duration-300 ${
                      step >= num
                        ? "bg-white text-primary-800 shadow"
                        : "bg-white/20 text-white/70"
                    }`}
                  >
                    {num}
                  </div>
                  <span
                    className={`hidden sm:inline transition-opacity duration-300 ${
                      step === num ? "opacity-100 text-white" : "opacity-60"
                    }`}
                  >
                    {num === 1 && "البيانات"}
                    {num === 2 && "الخدمة والفرع"}
                    {num === 3 && "الموعد"}
                    {num === 4 && "التأكيد"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-extrabold text-gray-900 text-lg mb-2">{settings.bookingStep1Title || "أدخل بياناتك الشخصية"}</h4>
              <p className="text-sm text-gray-500">{settings.bookingStep1Subtitle || "من فضلك قم بإدخال بيانات الاتصال لتسجيل ملفك الطبي المبدئي."}</p>

              {/* Patient Name input */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">الاسم الكامل (ثنائي على الأقل)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="مثال: محمد أحمد العتيبي"
                    className={`w-full pr-12 pl-4 py-3.5 bg-gray-50 border rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                      errors.name
                        ? "border-red-300 focus:ring-red-100"
                        : "border-gray-200 focus:ring-primary-100 focus:border-primary-500"
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs font-bold text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Patient Phone input */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">رقم الهاتف (الواتساب)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="مثال: 01063314572"
                    className={`w-full pr-12 pl-4 py-3.5 bg-gray-50 border rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 transition-all font-mono text-left ${
                      errors.phone
                        ? "border-red-300 focus:ring-red-100"
                        : "border-gray-200 focus:ring-primary-100 focus:border-primary-500"
                    }`}
                    dir="ltr"
                  />
                </div>
                {errors.phone && <p className="text-xs font-bold text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-extrabold text-gray-900 text-lg mb-2">{settings.bookingStep2Title || "اختر الخدمة والفرع والطبيب"}</h4>
              <p className="text-sm text-gray-500">{settings.bookingStep2Subtitle || "اختر الفرع الأقرب والخدمة المطلوبة لتوجيهك بشكل صحيح."}</p>
              
              {/* Branch Selection */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">الفرع المفضل</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <select
                    value={formData.branch}
                    onChange={(e) => handleInputChange("branch", e.target.value)}
                    className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all appearance-none cursor-pointer"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">الخدمة المطلوبة</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <Activity className="w-5 h-5" />
                  </span>
                  <select
                    value={formData.service}
                    onChange={(e) => handleInputChange("service", e.target.value)}
                    className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all appearance-none cursor-pointer"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.arabicTitle}>
                        {s.arabicTitle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Doctor Selection */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">الطبيب المفضل</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <User className="w-5 h-5" />
                  </span>
                  <select
                    value={formData.doctor}
                    onChange={(e) => handleInputChange("doctor", e.target.value)}
                    className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all appearance-none cursor-pointer"
                  >
                    {doctors.map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-extrabold text-gray-900 text-lg mb-2">{settings.bookingStep3Title || "اختر الموعد المفضل والتوقيت"}</h4>
              <p className="text-sm text-gray-500">{settings.bookingStep3Subtitle || "حدد التاريخ والتوقيت الأنسب لزيارتك للعيادة."}</p>

              {/* Preferred Date */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">تاريخ الزيارة</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={`w-full pr-12 pl-4 py-3.5 bg-gray-50 border rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                      errors.date
                        ? "border-red-300 focus:ring-red-100"
                        : "border-gray-200 focus:ring-primary-100 focus:border-primary-500"
                    }`}
                  />
                </div>
                {errors.date && <p className="text-xs font-bold text-red-500 mt-1">{errors.date}</p>}
              </div>

              {/* Preferred Time Slot */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 block">التوقيت المفضل ({settings.bookingActiveDays || "يومياً عدا الجمعة"})</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {finalSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleInputChange("timeSlot", slot)}
                      className={`p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between cursor-pointer ${
                        formData.timeSlot === slot
                          ? "border-primary-500 bg-primary-50/50 text-primary-950"
                          : "border-gray-100 hover:border-gray-200 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={`w-5 h-5 ${formData.timeSlot === slot ? "text-primary-600" : "text-gray-400"}`} />
                        <span className="text-sm font-bold">{slot}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formData.timeSlot === slot ? "border-primary-600 bg-primary-600" : "border-gray-300"
                        }`}
                      >
                        {formData.timeSlot === slot && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-extrabold text-gray-900 text-lg">{settings.bookingStep4Title || "مراجعة وتأكيد تفاصيل الحجز"}</h4>
                <p className="text-sm text-gray-500">{settings.bookingStep4Subtitle || "راجع البيانات أدناه ثم اضغط على زر الإرسال للتأكيد عبر الواتساب فوراً."}</p>
              </div>

              {/* Summary Cards */}
              <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 space-y-3.5 text-sm font-bold text-gray-700">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-400">الاسم الكامل:</span>
                  <span className="text-gray-950">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-400">رقم الهاتف:</span>
                  <span className="text-gray-950 font-mono">{formData.phone}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-400">الفرع المختار:</span>
                  <span className="text-gray-950 text-primary-700">{formData.branch}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-400">الخدمة المطلوبة:</span>
                  <span className="text-gray-950">{formData.service}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-400">الطبيب المعالج:</span>
                  <span className="text-gray-950">{formData.doctor}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-400">التاريخ المفضل:</span>
                  <span className="text-gray-950 font-mono">{formData.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">التوقيت المفضل:</span>
                  <span className="text-gray-950">{formData.timeSlot}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-950 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-5 py-3 text-gray-500 hover:text-gray-800 font-bold text-sm rounded-2xl transition-all cursor-pointer"
            >
              إلغلاق
            </button>
            
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-1.5 bg-primary-700 hover:bg-primary-800 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary-100 hover:shadow-primary-200 transition-all cursor-pointer"
              >
                <span>المتابعة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>تأكيد الحجز على واتساب</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
