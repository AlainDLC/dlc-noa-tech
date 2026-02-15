"use client";
import React from "react";
import { MapPin, Calendar, Users, Zap, ArrowRight } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <div className="group relative bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full">
      {/* 1. KAMPANJ-BADGE (Flytande ovanpå) */}
      {course.campaign_label && (
        <div className="absolute -top-3 left-8 bg-emerald-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-emerald-200 flex items-center gap-1.5 z-10 animate-in fade-in slide-in-from-top-2">
          <Zap size={12} fill="currentColor" className="text-emerald-200" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {course.campaign_label}
          </span>
        </div>
      )}

      {/* 2. TOPP: TITEL OCH STAD */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter text-slate-900 leading-[0.9] group-hover:text-blue-600 transition-colors">
            {course.name}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
          <MapPin size={12} className="text-blue-500" />
          {course.city}
        </div>
      </div>

      {/* 3. INFO-GRID: DATUM & PLATSER */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
            Datum
          </p>
          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase">
            <Calendar size={14} className="text-slate-400" />
            {course.date}
          </div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
            Status
          </p>
          <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase">
            <Users size={14} />
            {course.slots > 0 ? `${course.slots} Kvar` : "Fullbokat"}
          </div>
        </div>
      </div>

      {/* 4. PRIS OCH KNAPP */}
      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black text-slate-300 uppercase leading-none">
            Pris per person
          </p>
          <p className="text-3xl font-[1000] text-slate-900 italic tracking-tighter">
            {course.price.toLocaleString()}{" "}
            <span className="text-sm font-black not-italic text-slate-400">
              kr
            </span>
          </p>
        </div>

        <button className="h-14 w-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all shadow-xl shadow-slate-200 group-hover:shadow-blue-200">
          <ArrowRight size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
