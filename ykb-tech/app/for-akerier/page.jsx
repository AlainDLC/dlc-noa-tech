"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Users,
  ShieldCheck,
  Zap,
  Lock,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Briefcase,
  Crown,
  Send,
  Loader2,
  User,
  Mail,
  X
} from "lucide-react";

export default function ForAkerierPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulera inskick av intresseanmälan för åkeri-annonsering
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative transition-colors duration-300">
      {/* NAVBAR */}
      <Navbar showSearch={false} />

      {/* BAKGRUNDS-GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[600px] left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="pt-16 md:pt-24 pb-16 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FÖR ÅKERIER & REKRYTERARE</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight uppercase italic text-slate-900 dark:text-white mb-6">
            HITTA CHAUFFÖRER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-600">
              & ANNONSERA JOBB.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Säkra ert åkeris nästa förare. Publicera lediga tjänster direkt till nyutbildade chaufförer eller sök verifierade kompetenser på Driver Leaderboard.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/leaderboard">
              <button className="h-16 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all group italic w-full sm:w-auto">
                <Users size={18} /> Sök Förare På Leaderboard
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ANNONSPAKET FÖR ÅKERIER */}
      <section className="max-w-5xl mx-auto px-6 mb-20 relative z-10">
        <div className="text-center mb-12">
          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-2">
            Annonslösningar
          </span>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
            Välj hur ert åkeri vill synas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdTier
            icon={<Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
            label="Enskild Tjänst"
            title="Jobbannons"
            price="Per Annons"
            description="Publicering av enskild tjänst (C, CE, YKB). Nå aktiva arbetssökande chaufförer i hela landet."
          />
          <AdTier
            icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            label="Mest Populär"
            title="Leaderboard + Jobb"
            price="Partner Åkeri"
            active={true}
            description="Fria upplåsningar på Leaderboarden kombinerat med framhävda jobbannonser i er region."
          />
          <AdTier
            icon={<Crown className="w-6 h-6 text-amber-500" />}
            label="Maximal Synlighet"
            title="Exklusiv Partner"
            price="Pro Rekrytering"
            description="Bannerexponering mot alla elever på teorisajten samt obegränsad förarrekrytering."
          />
        </div>
      </section>

      {/* INTRESSEANMÄLAN FÖR ÅKERI-ANNONSERING */}
      <section className="max-w-3xl mx-auto px-6 mb-32 relative z-10">
        <div className="bg-white/80 dark:bg-slate-900/60 rounded-3xl md:rounded-[2.5rem] p-8 md:p-14 border border-slate-200 dark:border-slate-800/80 shadow-xl backdrop-blur-md relative overflow-hidden">
          {!isSubmitted ? (
            <>
              <h2 className="text-3xl md:text-4xl font-black uppercase italic mb-4 tracking-tight text-slate-900 dark:text-white">
                Annonsera som <span className="text-emerald-600 dark:text-emerald-400">Åkeri</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 font-medium">
                Fyll i formuläret nedan för att registrera ert åkeri och börja annonsera lediga tjänster direkt på plattformen.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      size={18}
                    />
                    <input
                      name="name"
                      required
                      type="text"
                      placeholder="Kontaktperson"
                      className="w-full pl-12 pr-6 py-4 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                      size={18}
                    />
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder="E-postadress"
                      className="w-full pl-12 pr-6 py-4 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Building2
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    size={18}
                  />
                  <input
                    name="company"
                    required
                    type="text"
                    placeholder="Åkeriets / Företagets Namn"
                    className="w-full pl-12 pr-6 py-4 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition-all"
                  />
                </div>

                <div className="flex items-start gap-4 p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <input
                    required
                    type="checkbox"
                    id="terms-akeri"
                    checked={acceptedTerms}
                    onChange={() => setAcceptedTerms(!acceptedTerms)}
                    className="mt-1 w-5 h-5 accent-emerald-500 cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor="terms-akeri"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer leading-relaxed"
                  >
                    Jag godkänner de{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-500 transition-colors"
                    >
                      kommersiella villkoren
                    </button>{" "}
                    och bekräftar att företaget har giltigt Yrkestrafiktillstånd.
                  </label>
                </div>

                <button
                  disabled={!acceptedTerms || loading}
                  className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg italic ${
                    acceptedTerms
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/10 active:scale-95"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Registrera Åkeri & Annonsera <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="py-16 text-center animate-in zoom-in">
              <CheckCircle2 size={70} className="text-emerald-500 mx-auto mb-6" />
              <h2 className="text-3xl font-black uppercase italic mb-3 tracking-tight text-slate-900 dark:text-white">
                Åkeriprofil <span className="text-emerald-500">Mottagen!</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium max-w-md mx-auto">
                Tack! Vi kontaktar er för att aktivera kontot så att ni kan börja publicera jobbannonser direkt.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MODAL FÖR VILLKOR */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-slate-900 dark:bg-slate-950 p-6 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="text-lg font-black uppercase italic tracking-tight text-emerald-400">
                Villkor för Åkeriannonsering
              </h3>
              <button
                onClick={() => setShowTerms(false)}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] text-slate-600 dark:text-slate-300 space-y-6 text-xs leading-relaxed font-medium">
              <section>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Yrkestrafiktillstånd
                </h4>
                <p>
                  Annonserande åkeri måste inneha giltigt tillstånd för yrkesmässig trafik och följa svenska kollektivavtal/riktlinjer.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" /> Rekryteringssäkerhet
                </h4>
                <p>
                  Kontaktuppgifter från Leaderboard får endast användas i syfte att erbjuda relevanta anställningar eller uppdrag.
                </p>
              </section>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
              <button
                onClick={() => setShowTerms(false)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all shadow-md italic"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </main>
  );
}

function AdTier({ icon, label, title, price, description, active = false }) {
  return (
    <div
      className={`p-8 rounded-3xl md:rounded-[2.5rem] border-2 transition-all flex flex-col justify-between backdrop-blur-md ${
        active
          ? "border-emerald-500 bg-white/90 dark:bg-slate-900/80 md:scale-105 shadow-2xl"
          : "border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {icon}
          </div>
          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {label}
          </span>
        </div>
        <h3 className="text-2xl font-black italic uppercase leading-tight text-slate-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 italic mb-4">
          {price}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}