/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { QUIZ_QUESTIONS } from "../data";
import { useClinicData } from "../hooks/useClinicData";
import { ChevronLeft, ChevronRight, MessageSquare, CheckCircle2, RotateCcw, HelpCircle } from "lucide-react";

export default function SmileQuiz() {
  const { settings } = useClinicData();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const totalSteps = QUIZ_QUESTIONS.length;

  const handleOptionSelect = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Automatically advance to the next step after a tiny delay for an amazing UX
    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setCurrentStep(totalSteps); // Show summary screen
      }
    }, 300);
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
  };

  // Compile final WhatsApp text containing results
  const getWhatsAppLink = () => {
    const baseNumber = settings.whatsapp || "01063314572";
    
    const responses = QUIZ_QUESTIONS.map((q) => {
      const selectedValue = answers[q.id] || "لم يتم التحديد";
      return `❓ *${q.question}*\n👈 الإجابة: ${selectedValue}`;
    }).join("\n\n");

    const template = settings.quizWhatsappTemplate || "مرحباً عيادات الدكتور يوسف الشاذلي، قمت بإجراء اختبار ابتسامتي السريعة عبر موقعكم الإلكتروني وإليكم إجاباتي للاستشارة المبدئية وحجز كشف:\n\n[RESPONSES]\n\nأود حجز موعد استشارة مبدئية مع الطبيب في أقرب وقت. شكراً لكم!";
    const fullMessage = template.replace("[RESPONSES]", responses);
    const encodedMessage = encodeURIComponent(fullMessage);
    return `https://wa.me/${baseNumber}?text=${encodedMessage}`;
  };

  const isCurrentQuestionAnswered = answers[QUIZ_QUESTIONS[currentStep]?.id] !== undefined;

  return (
    <section id="quiz" className="py-24 bg-gradient-to-b from-primary-50/20 via-white to-primary-50/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 rounded-full text-primary-800 text-sm font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>مستشار الابتسامة التفاعلي</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            {settings.quizIntroTitle || "اختبر صحة ابتسامتك في دقيقة واحدة"}
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            {settings.quizIntroSubtitle || "أجب عن 4 أسئلة سريعة لمساعدتنا في تشخيص حالتك المبدئية، واحصل على خطة علاجية مخصصة وعرض حجز استشارة مجانية عبر الواتساب."}
          </p>
        </div>

        {/* Quiz Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-primary-100/60 border border-gray-100 p-6 md:p-10 relative overflow-hidden">
          
          {/* Progress Bar & Steps indicators */}
          {currentStep < totalSteps && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2.5 text-xs md:text-sm font-bold text-gray-500">
                <span>السؤال {currentStep + 1} من {totalSteps}</span>
                <span>نسبة الإنجاز: {Math.round(((currentStep) / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-primary-600 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Render Questions (Steps 0 to 3) */}
          {currentStep < totalSteps && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-950 leading-snug">
                {QUIZ_QUESTIONS[currentStep].question}
              </h3>

              <div className="grid gap-3.5 mt-6">
                {QUIZ_QUESTIONS[currentStep].options.map((option) => {
                  const isSelected = answers[QUIZ_QUESTIONS[currentStep].id] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(QUIZ_QUESTIONS[currentStep].id, option.value)}
                      className={`w-full p-4 md:p-5 rounded-2xl text-right font-bold text-sm md:text-base border-2 transition-all flex items-center justify-between group ${
                        isSelected
                          ? "border-primary-600 bg-primary-50/60 text-primary-800"
                          : "border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 text-gray-700"
                      }`}
                    >
                      <span>{option.text}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "border-primary-600 bg-primary-600 text-white"
                          : "border-gray-300 bg-white group-hover:border-gray-400"
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Back / Next actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-8">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    currentStep === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <span className="text-xs font-bold text-gray-400">خطوتك نحو ابتسامة جذابة وسليمة</span>
              </div>
            </div>
          )}

          {/* Render Result Summary (Step 4) */}
          {currentStep === totalSteps && (
            <div className="text-center space-y-6 md:space-y-8 animate-scale-up">
              
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-950">
                  {settings.quizCompletedTitle || "لقد انتهيت من تشخيص ابتسامتك بنجاح!"}
                </h3>
                <p className="text-sm md:text-base text-gray-500 max-w-lg mx-auto">
                  {settings.quizCompletedSubtitle || "قمنا بتحليل إجاباتك وصياغة تقرير أولي لحالتك. اضغط على الزر بالأسفل لإرسال التقرير للدكتور يوسف وحجز موعد كشف بخصم حصرى مخصص لك."}
                </p>
              </div>

              {/* Answers Summary Panel */}
              <div className="bg-primary-50/50 rounded-2xl p-5 border border-primary-100/60 text-right space-y-3.5 max-w-lg mx-auto">
                <h4 className="font-extrabold text-primary-900 text-sm md:text-base border-b border-primary-100 pb-2">
                  ملخص حالتك واختياراتك:
                </h4>
                {QUIZ_QUESTIONS.map((q) => (
                  <div key={q.id} className="text-xs md:text-sm flex flex-col md:flex-row md:justify-between gap-1">
                    <span className="text-gray-500 font-medium">{q.question}</span>
                    <span className="font-extrabold text-gray-900">{answers[q.id] || "لم يحدد"}</span>
                  </div>
                ))}
              </div>

              {/* CTA Send answers to WhatsApp */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4 max-w-md mx-auto">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:shadow-emerald-300 transition-all text-base md:text-lg w-full"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>إرسال الإجابات وحجز كشف</span>
                </a>
                
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 text-gray-500 hover:text-gray-800 px-4 py-3 rounded-2xl text-sm font-bold transition-all hover:bg-gray-50 w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الاختبار</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
