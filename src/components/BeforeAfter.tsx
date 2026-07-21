/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useClinicData } from "../hooks/useClinicData";
import { MoveHorizontal, Eye, HelpCircle, ArrowLeftRight } from "lucide-react";

export default function BeforeAfter() {
  const { beforeAfter } = useClinicData();
  const categories = ["الكل", ...Array.from(new Set(beforeAfter.map((t) => t.category)))];
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [activeTab, setActiveTab] = useState("braces");
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  const filteredTreatments = selectedCategory === "الكل"
    ? beforeAfter
    : beforeAfter.filter((t) => t.category === selectedCategory);

  const activeTreatment = filteredTreatments.find((t) => t.id === activeTab) || filteredTreatments[0] || beforeAfter[0];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  // Keep track of container width for clipping mask
  useEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="before-after" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 rounded-full text-cyan-800 text-sm font-bold">
            <Eye className="w-4 h-4" />
            <span>معرض الحالات الواقعية</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            نتائج تتحدث عن نفسها (قبل وبعد العلاج)
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            شاهد التحول المذهل في ابتسامات مرضانا. اسحب الشريط التفاعلي يميناً ويساراً لمقارنة النتيجة قبل العلاج وبعده في عياداتنا.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-gray-100 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                const firstOfCat = cat === "الكل" 
                  ? beforeAfter[0] 
                  : beforeAfter.find(t => t.category === cat);
                if (firstOfCat) {
                  setActiveTab(firstOfCat.id);
                }
                setSliderPosition(50);
              }}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                selectedCategory === cat
                  ? "bg-primary-50 text-primary-700 border border-primary-200"
                  : "bg-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Navigation Tabs */}
        {filteredTreatments.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {filteredTreatments.map((treatment) => (
              <button
                key={treatment.id}
                onClick={() => {
                  setActiveTab(treatment.id);
                  setSliderPosition(50); // reset position
                }}
                className={`px-5 py-3 rounded-2xl font-bold text-sm md:text-base transition-all ${
                  activeTreatment.id === treatment.id
                    ? "bg-primary-700 text-white shadow-lg shadow-primary-200"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {treatment.title.split(" (")[0] /* Clean the arabic title */}
              </button>
            ))}
          </div>
        )}

        {/* Treatment Info */}
        {activeTreatment && (
          <div className="text-center max-w-3xl mx-auto mb-8 animate-fade-in">
            <h3 className="text-xl font-extrabold text-gray-950 mb-2">{activeTreatment.title}</h3>
            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
              {activeTreatment.description}
            </p>
          </div>
        )}

        {/* Interactive Comparison Slider Container */}
        {activeTreatment && (
          <div className="relative max-w-2xl mx-auto aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 select-none">
            <div
              ref={containerRef}
              className="relative w-full h-full cursor-ew-resize"
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                handleMove(e.clientX);
              }}
              onTouchStart={(e) => {
                setIsDragging(true);
                if (e.touches[0]) {
                  handleMove(e.touches[0].clientX);
                }
              }}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* After Image (Full background) */}
              <img
                src={activeTreatment.afterUrl}
                alt="بعد العلاج"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md uppercase tracking-wider">
                بعد العلاج
              </div>

              {/* Before Image (Clipped overlay) */}
              <div
                className="absolute inset-y-0 right-0 overflow-hidden pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div
                  className="absolute inset-0 h-full"
                  style={{
                    width: `${containerWidth}px`,
                    right: 0
                  }}
                >
                  <img
                    src={activeTreatment.beforeUrl}
                    alt="قبل العلاج"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{
                      width: `${containerWidth}px`
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div
                className="absolute top-4 bg-gray-800/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md uppercase tracking-wider transition-all"
                style={{ right: `calc(${100 - sliderPosition}% + 1rem)` }}
              >
                قبل العلاج
              </div>

              {/* Draggable Divider Line & Handle */}
              <div
                className="absolute inset-y-0 w-1 bg-white cursor-ew-resize pointer-events-none flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-10 h-10 rounded-full bg-white text-primary-700 shadow-2xl border-2 border-primary-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform pointer-events-auto">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Quick Help Tip */}
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-400 mt-6 font-medium">
          <MoveHorizontal className="w-4 h-4 text-primary-400" />
          <span>اسحب المقبض الدائري لمشاهدة الفرق المذهل</span>
        </div>

      </div>
    </section>
  );
}
