/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { dataManager } from "../../utils/dataManager";

interface LoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export default function Login({ onLoginSuccess, onBackToHome }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate database lookup delay
    setTimeout(() => {
      const storedUser = dataManager.getAdminUser();
      const storedPass = dataManager.getAdminPass();

      if (username === storedUser && password === storedPass) {
        sessionStorage.setItem("clinic_admin_authenticated", "true");
        onLoginSuccess();
      } else {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة! يرجى المحاولة مرة أخرى.");
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-right" dir="rtl">
      
      {/* Back button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <span>العودة للموقع الرئيسي</span>
        </button>
      </div>

      <div className="sm:mx-auto w-full max-w-md">
        {/* Brand Logo in Login */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary-700 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-100 mb-4 animate-bounce" style={{ animationDuration: "3s" }}>
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-950">
            بوابة الإشراف والتحكم
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            سجل دخولك لتعديل محتوى عيادات د. يوسف الشاذلي
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md px-4">
        <div className="bg-white py-10 px-6 sm:px-10 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">
          
          {error && (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl text-xs font-bold border border-rose-100 animate-pulse leading-relaxed text-right">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-bold text-gray-700">
                اسم المستخدم الإشرافي
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: admin"
                  className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all text-right"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                كلمة المرور السرية
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-12 pl-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all text-right"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Note on Defaults */}
            <div className="bg-slate-50 p-4 rounded-xl text-[11px] text-gray-500 leading-relaxed space-y-1 border border-slate-100">
              <p className="font-extrabold text-gray-700">📌 معلومات الدخول الافتراضية للتجربة:</p>
              <p>اسم المستخدم: <code className="bg-white px-1.5 py-0.5 rounded border text-primary-700 font-mono font-bold">admin</code></p>
              <p>كلمة المرور الافتراضية: <code className="bg-white px-1.5 py-0.5 rounded border text-primary-700 font-mono font-bold">password123</code></p>
              <p className="text-amber-600 font-bold">يمكنك تغيير هذه البيانات بحرية بعد الدخول من تبويب الإعدادات العامة!</p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-primary-700 to-primary-800 hover:from-primary-800 hover:to-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جاري التحقق والدخول...</span>
                  </span>
                ) : (
                  <span>تسجيل الدخول الآمن</span>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
