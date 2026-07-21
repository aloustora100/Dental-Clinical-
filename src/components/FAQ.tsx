/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useClinicData } from "../hooks/useClinicData";
import { MessageCircle, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const { faqs } = useClinicData();
  const [openId, setOpenId] = useState<string | null>("faq-1"); // Keep the first one open by default

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-100 rounded-full text-cyan-800 text-sm font-bold">
            <MessageCircle className="w-4 h-4" />
            <span>الأسئلة الشائعة والإجابات</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            لديك استفسار؟ تجد إجابته هنا بالتفصيل
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            جمعنا لكم أهم وأبرز الأسئلة والاستفسارات الطبية والتنظيمية التي يطرحها علينا مرضانا الكرام بخصوص خدماتنا وأنظمة العلاج والحجز.
          </p>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-4">
          {faqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300"
              >
                
                {/* Accordion Header Trigger */}
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-right gap-4 font-extrabold text-sm md:text-base text-gray-950 hover:bg-gray-50/50 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      isOpen ? "text-primary-600" : "text-gray-400"
                    }`} />
                    <span>{item.question}</span>
                  </span>
                  
                  <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 flex-shrink-0 transition-transform ${
                    isOpen ? "rotate-180 bg-primary-50 text-primary-600" : ""
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Expandable Content Panel */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-[500px] border-t border-gray-50" : "max-h-0"
                  }`}
                >
                  <p className="p-6 md:p-8 text-xs md:text-sm font-semibold text-gray-500 leading-relaxed bg-gray-50/30">
                    {item.answer}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="bg-primary-900 text-white rounded-[2.5rem] p-8 md:p-10 text-center mt-12 space-y-6 shadow-xl border border-primary-800">
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-extrabold">هل ما زال لديك أي استفسار آخر؟</h3>
            <p className="text-xs md:text-sm text-primary-200 max-w-lg mx-auto leading-relaxed">
              يسعد فريقنا الطبي وخدمة العملاء الرد على كافة أسئلتكم واستشاراتكم الخاصة بالأسنان على مدار الساعة عبر الواتساب مجاناً.
            </p>
          </div>
          <a
            href="https://wa.me/201012345678?text=مرحباً%20عيادات%20الدكتور%20يوسف،%20أود%20الاستفسار%20عن%20موضوع%20معين"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60 transition-all text-sm"
          >
            <MessageCircle className="w-4.5 h-4.5" />
            <span>اسألنا مباشرة الآن عبر الواتساب</span>
          </a>
        </div>

      </div>
    </section>
  );
}
