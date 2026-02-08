"use client";
import React, { useState } from "react";
import { ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

export default function OnboardingPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* HERO SECTION */}
      <div className="max-w-4xl mx-auto pt-20 pb-16 px-6 text-center">
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
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Anslut din skola till YKB-Marketplace. Vi sköter bokning, betalning
          och elevlistor.
        </p>
      </div>

      {/* PROVISIONS-TRAPPAN */}
      <div className="max-w-5xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PriceTier
            range="1-5 elever"
            fee="15%"
            label="Start-nivå"
            description="Perfekt för mindre kurser."
          />
          <PriceTier
            range="6-11 elever"
            fee="12%"
            label="Partner"
            active={true}
            description="När ni börjar fylla klassrummet."
          />
          <PriceTier
            range="12-17+ elever"
            fee="10%"
            label="Premium"
            description="Maximal utväxling för stora skolor."
          />
        </div>
      </div>

      {/* VILLKOR & AVTAL */}
      <div className="max-w-3xl mx-auto px-6 pb-40">
        <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100">
          <h2 className="text-3xl font-[1000] uppercase italic mb-8 tracking-tighter">
            Partneravtal & Villkor
          </h2>

          <div className="space-y-6 text-slate-600 font-medium leading-relaxed mb-10">
            <Condition
              title="Ångerrätt"
              text="Eleven har 14 dagars lagstadgad ångerrätt. Vid avbokning närmare än 7 dagar före kursstart gäller skolans egna villkor."
            />
            <Condition
              title="Rapportering"
              text="Utbetalning sker när kursen är avslutad och timmar har rapporterats till Transportstyrelsen."
            />
            <Condition
              title="Utbetalning"
              text="Sker den 25:e varje månad efter verifiering av identitet och tillstånd via Clerk."
            />
          </div>

          {/* CHECKBOX */}
          <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200 mb-8">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="mt-1 w-5 h-5 accent-blue-600"
            />
            <label
              htmlFor="terms"
              className="text-sm font-bold text-slate-900 leading-snug cursor-pointer"
            >
              Jag godkänner de kommersiella villkoren och bekräftar att vår
              skola innehar giltigt tillstånd från Transportstyrelsen för YKB.
            </label>
          </div>

          {/* CLERK SIGN UP BUTTON */}
          {acceptedTerms ? (
            <SignUpButton mode="modal" afterSignUpUrl="/register/complete">
              <button className="w-full py-6 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200 font-[1000] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
                Skapa konto & Ansök <ArrowRight size={20} />
              </button>
            </SignUpButton>
          ) : (
            <button
              disabled
              className="w-full py-6 rounded-2xl bg-slate-200 text-slate-400 font-[1000] uppercase tracking-[0.2em] cursor-not-allowed"
            >
              Godkänn villkor för att fortsätta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-komponenter för renare kod
function PriceTier({ range, fee, label, description, active = false }) {
  return (
    <div
      className={`p-8 rounded-[2.5rem] border-2 transition-all ${active ? "border-blue-600 bg-blue-50/50 scale-105 shadow-2xl shadow-blue-100" : "border-slate-100 bg-white"}`}
    >
      <p className="text-[10px] font-[1000] uppercase tracking-widest text-blue-600 mb-4">
        {label}
      </p>
      <h3 className="text-4xl font-[1000] italic uppercase mb-2 text-slate-900">
        {range}
      </h3>
      <p className="text-6xl font-[1000] text-slate-900 mb-6">{fee}</p>
      <p className="text-xs text-slate-500 font-bold leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function Condition({ title, text }) {
  return (
    <div className="flex gap-4">
      <ShieldCheck className="text-blue-600 shrink-0" />
      <p>
        <strong className="text-slate-900 uppercase text-xs font-black block mb-1">
          {title}
        </strong>
        {text}
      </p>
    </div>
  );
}
