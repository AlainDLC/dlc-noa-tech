"use client";
import React, { useState } from "react";
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

    const response = await fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setIsSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-40">
      {/* HERO */}
      <div className="max-w-4xl mx-auto pt-20 pb-16 px-6 text-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] mb-4"
        >
          <ArrowLeft size={14} /> Sajten
        </Link>
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-8">
          <Zap size={16} fill="currentColor" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Partner Onboarding
          </span>
        </div>
        <h1 className="text-6xl md:text-8xl font-[1000] tracking-tighter italic uppercase leading-[0.85] mb-8">
          Sälj fler platser <br />
          <span className="text-blue-600">tjäna mer per elev.</span>
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
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-sm">
          {!isSubmitted ? (
            <>
              <h2 className="text-4xl font-[1000] uppercase italic mb-8 tracking-tighter">
                Bli <span className="text-blue-600">Partner</span>
              </h2>

              <div className="space-y-6 mb-12 border-b border-slate-200 pb-12">
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
                      className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
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
                      className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
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
                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  />
                </div>

                {/* CHECKBOX MED POPUP-LÄNK - NU PERFEKT ALIGNAD */}
                <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <input
                    required
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={() => setAcceptedTerms(!acceptedTerms)}
                    /* shrink-0 ser till att den inte trycks ihop, mt-1 sänker den lite för att möta första raden */
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
                    och bekräftar att vår skola innehar giltigt tillstånd från
                    Transportstyrelsen för YKB.
                  </label>
                </div>

                <button
                  disabled={!acceptedTerms || loading}
                  className={`w-full py-6 rounded-2xl font-[1000] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${acceptedTerms ? "bg-slate-900 text-white hover:bg-blue-600 shadow-blue-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
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
            <div className="py-20 text-center animate-in fade-in zoom-in">
              <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
              <h2 className="text-4xl font-[1000] uppercase italic mb-4 tracking-tighter text-slate-900">
                Ansökan <span className="text-blue-600">mottagen!</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                Vi granskar er skola och skickar en personlig inbjudan via Clerk
                så fort ni är godkända.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL / POPUP */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
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
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
      <p className="text-6xl font-black mb-6 text-slate-900">{fee}</p>
      <p className="text-xs text-slate-500 font-bold">{description}</p>
    </div>
  );
}

function Condition({ title, text }) {
  return (
    <div className="flex gap-4 italic font-medium">
      <ShieldCheck className="text-blue-600 shrink-0" size={24} />
      <div>
        <strong className="text-slate-900 uppercase text-xs font-black block">
          {title}
        </strong>
        <p className="text-sm text-slate-500">{text}</p>
      </div>
    </div>
  );
}
