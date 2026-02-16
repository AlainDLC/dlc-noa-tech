"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Zap,
  Building2,
  Mail,
  User,
  Send,
  CheckCircle2,
  Loader2,
  X,
  ArrowLeft,
  Truck,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      school: e.target.school.value,
    };

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("API-FILEN HAR LADDATS!");
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        alert("Något gick fel: " + errorData.error);
      }
    } catch (error) {
      console.error("DETTA ÄR FELET:", error);
      alert("Kunde inte skicka ansökan. Kontrollera din internetanslutning.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      {/* NAVBAR - SYNCAD MED HOMEPAGE */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
              <Image alt="loga" src="/loga.png" width={160} height={160} />
            </div>
            <span className="text-sm md:text-xl font-black italic tracking-tighter text-black uppercase text-nowrap">
              YKB CENTRALEN
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-slate-400 hover:text-slate-900 transition-all font-bold text-[11px] uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Sajten
            </Link>
            <div className="h-8 w-px bg-slate-100 hidden md:block" />
            <span className="text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] italic">
              Partner Portal
            </span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="max-w-4xl mx-auto pt-20 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-8">
          <Zap size={16} fill="currentColor" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Partner Onboarding
          </span>
        </div>
        <h1 className="text-6xl md:text-8xl font-[1000] tracking-tighter italic uppercase leading-[0.85] mb-8">
          Sälj fler platser <br />
          <span className="text-blue-600 italic">tjäna mer per elev.</span>
        </h1>
      </div>

      {/* PRIS-STEG */}
      <div className="max-w-5xl mx-auto px-6 mb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <PriceTier
          range="1-5 elever"
          fee="15%"
          label="Start"
          description="För de små kurserna."
        />
        <PriceTier
          range="6-11 elever"
          fee="12%"
          label="Partner"
          active={true}
          description="Klassrummet fylls."
        />
        <PriceTier
          range="12-17+ elever"
          fee="10%"
          label="Premium"
          description="Maximal utväxling."
        />
      </div>

      {/* FORMULÄR ELLER TACK */}
      <div className="max-w-3xl mx-auto px-6 mb-40">
        <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden">
          {!isSubmitted ? (
            <>
              <h2 className="text-4xl font-[1000] uppercase italic mb-8 tracking-tighter text-slate-900">
                Bli <span className="text-blue-600">Partner</span>
              </h2>

              <div className="space-y-6 mb-12 border-b border-slate-200 pb-12 text-slate-900">
                <Condition
                  title="Säkerhet"
                  text="Verifiering av tillstånd sker manuellt."
                />
                <Condition title="Utbetalning" text="Den 25:e varje månad." />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      name="name"
                      required
                      type="text"
                      placeholder="Ditt namn"
                      className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-900"
                    />
                  </div>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder="E-post"
                      className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-900"
                    />
                  </div>
                </div>
                <div className="relative">
                  <Building2
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    name="school"
                    required
                    type="text"
                    placeholder="Skolans namn"
                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-900"
                  />
                </div>

                <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <input
                    required
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={() => setAcceptedTerms(!acceptedTerms)}
                    className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-bold text-slate-900 cursor-pointer leading-relaxed"
                  >
                    Jag godkänner de{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-blue-600 underline hover:text-blue-800 transition-colors"
                    >
                      kommersiella villkoren
                    </button>{" "}
                    och bekräftar att vår skola innehar giltigt tillstånd.
                  </label>
                </div>

                <button
                  disabled={!acceptedTerms || loading}
                  className={`w-full py-6 rounded-2xl font-[1000] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${acceptedTerms ? "bg-slate-900 text-white hover:bg-blue-600" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Skicka intresseanmälan <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="py-20 text-center animate-in zoom-in">
              <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
              <h2 className="text-4xl font-[1000] uppercase italic mb-4 tracking-tighter text-slate-900">
                Ansökan <span className="text-blue-600">mottagen!</span>
              </h2>
            </div>
          )}
        </div>
      </div>

      {/* MODAL / POPUP - DIN ORIGINALKOD */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">
                Kommersiella Villkor
              </h3>
              <button
                onClick={() => setShowTerms(false)}
                className="p-2 hover:bg-blue-700 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 md:p-12 overflow-y-auto max-h-[70vh] text-slate-600 space-y-6">
              <section>
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />{" "}
                  Provisionsmodell
                </h4>
                <p className="text-sm leading-relaxed">
                  YKB-CENTRALEN tillämpar en rörlig provisionsmodell baserad på
                  antal bokade elever. Provisionen dras automatiskt innan
                  utbetalning.
                </p>
              </section>

              <section>
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />{" "}
                  Utbetalningsrutiner
                </h4>
                <p className="text-sm leading-relaxed">
                  Utbetalningar sker den 25:e varje månad för kurser som
                  rapporterats till Transportstyrelsen.
                </p>
              </section>

              <section>
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" /> Avbokning
                  & Ångerrätt
                </h4>
                <p className="text-sm leading-relaxed">
                  Elever har 14 dagars ångerrätt. Skolans specifika
                  avbokningsregler gäller vid avbokning nära kursstart.
                </p>
              </section>
            </div>
            <div className="p-6 border-t bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowTerms(false)}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-600"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER - SYNCAD MED HOMEPAGE */}
      <footer className="relative bg-white pt-32 pb-16 px-6 overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-24">
            <div className="md:col-span-5 space-y-8 text-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                  <Truck size={18} className="text-white" />
                </div>
                <span className="font-black italic uppercase tracking-tighter text-xl">
                  YKB
                </span>
              </div>
              <p className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-[0.85] text-slate-200">
                Framtiden är <br />{" "}
                <span className="text-slate-900 font-black">
                  Digital & Säkrad.
                </span>
              </p>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 italic">
              © 2026 DLC TECH ZEQ SYSTEM
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100 text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="italic">Systems Online</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// HJÄLPKOMPONENTER
function PriceTier({ range, fee, label, description, active = false }) {
  return (
    <div
      className={`p-8 rounded-[2.5rem] border-2 transition-all ${active ? "border-blue-600 bg-blue-50/50 scale-105 shadow-2xl" : "border-slate-100 bg-white"}`}
    >
      <p className="text-[10px] font-black uppercase text-blue-600 mb-4">
        {label}
      </p>
      <h3 className="text-4xl font-black italic uppercase mb-2 leading-none text-slate-900">
        {range}
      </h3>
      <p className="text-6xl font-black mb-6 text-slate-900 leading-none">
        {fee}
      </p>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
        {description}
      </p>
    </div>
  );
}

function Condition({ title, text }) {
  return (
    <div className="flex gap-4 italic font-medium">
      <ShieldCheck className="text-blue-600 shrink-0" size={24} />
      <div>
        <strong className="text-slate-900 uppercase text-xs font-black block tracking-widest">
          {title}
        </strong>
        <p className="text-sm text-slate-500 font-bold">{text}</p>
      </div>
    </div>
  );
}
