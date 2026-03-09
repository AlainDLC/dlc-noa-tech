"use client";
import React from "react";
import TalentBadge from "./TalentBadge";
import {
  Phone,
  MapPin,
  Briefcase,
  Zap,
  CheckCircle2,
  Printer,
  ArrowLeft,
  User,
  Linkedin,
  Instagram,
  Facebook,
  Music2,
} from "lucide-react";
import Link from "next/link";

export default function DriverCVPage({ driver }) {
  if (!driver) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 print:bg-white print:py-0 print:px-0 text-left selection:bg-blue-100 font-sans relative overflow-x-hidden">
      {/* KONTROLLER */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden relative z-50">
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={14} /> Tillbaka
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black italic uppercase text-xs shadow-xl hover:bg-blue-600 transition-all active:scale-95"
        >
          <Printer size={16} />{" "}
          <span className="hidden sm:inline">Skriv ut / Spara PDF</span>
          <span className="sm:hidden">Spara PDF</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-none print:rounded-none relative z-10">
        {/* HEADER SEKTION */}
        <div className="relative p-8 sm:p-12 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-8 items-center md:items-start min-h-[320px]">
          {/* 1. TALENT BADGE - MOBIL (HÖGST UPP, CENTRERAD) */}
          <div className="md:hidden w-full flex justify-center pt-2 pb-4 scale-90">
            <TalentBadge score={driver.score_percentage} />
          </div>

          {/* 2. PROFILBILDSRUTA */}
          <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden relative flex-shrink-0 z-20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-green-500/10" />
            <div className="flex items-center justify-center h-full text-slate-200">
              {driver.profile_image ? (
                <img
                  src={driver.profile_image}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <User size={60} />
              )}
            </div>
            <div className="absolute bottom-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-green-500 to-green-800" />
          </div>

          {/* 3. NAMN OCH KONTAKT */}
          <div className="flex-1 space-y-6 pt-2 text-center md:text-left z-20 md:max-w-[55%]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-blue-600 font-[1000] italic uppercase tracking-[0.2em] text-[9px]">
                  Verifierad Yrkesförare
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-[1000] italic uppercase tracking-tighter text-slate-900 leading-[0.9] break-words">
                {driver.full_name}
              </h1>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm font-black italic text-[11px] uppercase tracking-wider leading-none">
                <Phone size={14} className="text-blue-600" />
                {driver.phone}
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm font-black italic text-[11px] uppercase tracking-wider leading-none">
                <MapPin size={14} className="text-blue-600" />
                {driver.city}
              </div>
            </div>

            {/* SOCIALA MEDIER */}
            <div className="flex justify-center md:justify-start gap-6 pt-2 print:hidden">
              {driver.linkedin_url && (
                <a
                  href={driver.linkedin_url}
                  target="_blank"
                  className="text-slate-400 hover:text-blue-700 transition-colors"
                >
                  <Linkedin size={22} />
                </a>
              )}
              {driver.instagram_url && (
                <a
                  href={driver.instagram_url}
                  target="_blank"
                  className="text-slate-400 hover:text-pink-600 transition-colors"
                >
                  <Instagram size={22} />
                </a>
              )}
              {driver.facebook_url && (
                <a
                  href={driver.facebook_url}
                  target="_blank"
                  className="text-slate-400 hover:text-blue-800 transition-colors"
                >
                  <Facebook size={22} />
                </a>
              )}
              {driver.tiktok_url && (
                <a
                  href={driver.tiktok_url}
                  target="_blank"
                  className="text-slate-400 hover:text-black transition-colors"
                >
                  <Music2 size={22} />
                </a>
              )}
            </div>
          </div>

          {/* 4. TALENT BADGE - DESKTOP (Sitter kvar i hörnet) */}
          <div className="hidden md:block absolute -top-2 -right-2 scale-75 origin-top-right z-30">
            <TalentBadge score={driver.score_percentage} />
          </div>

          {/* BAKGRUNDS-VATTENMÄRKE (Endast subtilt i bakgrunden) */}
          <div className="absolute -right-20 -top-20 scale-[1.5] rotate-[25deg] opacity-[0.02] pointer-events-none z-0">
            <TalentBadge score={driver.score_percentage} variant="watermark" />
          </div>
        </div>

        {/* BIO SEKTION */}
        <div className="p-8 sm:p-12 border-b border-slate-100 bg-white">
          <div className="max-w-3xl space-y-4 text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 italic">
              Personlig Profil \
            </h3>
            <p className="text-slate-600 font-bold italic leading-relaxed text-xl md:text-3xl antialiased">
              "
              {driver.bio ||
                "Professionell förare med fokus på hög trafiksäkerhet och punktlighet."}
              "
            </p>
          </div>
        </div>

        {/* KOMPETENSER */}
        <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-12 bg-slate-50/30">
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 relative overflow-hidden shadow-sm text-left">
              <Briefcase
                size={40}
                className="absolute -right-2 -bottom-2 text-slate-100 rotate-12"
              />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Erfarenhetsnivå
              </p>
              <p className="text-2xl font-[1000] italic text-slate-900 uppercase leading-none">
                {driver.experience_level}
              </p>
            </div>
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 relative overflow-hidden shadow-sm text-left">
              <Zap
                size={40}
                className="absolute -right-2 -bottom-2 text-orange-50/50 rotate-12"
              />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                ADR Kompetens
              </p>
              <p className="text-2xl font-[1000] italic text-slate-900 uppercase leading-none">
                {driver.adr_status}
              </p>
            </div>
          </div>

          <div className="space-y-6 text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
              Behörigheter
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <SkillItem label="YKB (Yrkeskompetens)" active={driver.has_ykb} />
              <SkillItem label="Busskort (D)" active={driver.has_bus_license} />
              <SkillItem label="Truckkort" active={driver.truck_card} />
              <SkillItem label="Krankort" active={driver.kran_card} />
              <SkillItem label="Tunga fordon (C/CE)" active={true} />
            </div>
          </div>
        </div>

        <div className="p-8 bg-white text-center border-t border-slate-50">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em] italic">
            Verifierat Dokument — YKB Centralen Sweden
          </p>
        </div>
      </div>
    </div>
  );
}

function SkillItem({ label, active }) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${active ? "bg-white border-slate-900 shadow-md scale-[1.02]" : "bg-slate-50 border-slate-100 opacity-40 grayscale"}`}
    >
      <CheckCircle2
        size={18}
        className={active ? "text-green-500" : "text-slate-300"}
      />
      <span
        className={`text-[12px] font-[1000] uppercase italic tracking-tight ${active ? "text-slate-900" : "text-slate-400"}`}
      >
        {label}
      </span>
    </div>
  );
}
