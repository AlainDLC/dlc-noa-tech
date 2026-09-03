"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-white dark:bg-slate-950 pt-24 pb-16 px-6 overflow-hidden border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-20">
          
          {/* VENSTER SEKTION: LOGO OCH RUBRIK */}
          <div className="md:col-span-5 space-y-6 text-slate-900 dark:text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md">
                <GraduationCap size={22} />
              </div>
              <span className="font-black italic uppercase tracking-tighter text-xl">
                DRIVE AI CENTRALEN
              </span>
            </div>
            
            <p className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-[0.85] text-slate-300 dark:text-slate-800">
              Framtiden är <br />
              <span className="text-slate-900 dark:text-white font-black">
                Digital & Säkrad.
              </span>
            </p>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed">
              Sveriges samlingsplats för yrkes- och tungutbildningar. Boka C-kort, CE, YKB, Buss och ADR säkert.
            </p>
          </div>

          {/* MITTEN SEKTION: NAVIGERINGSLÄNKAR */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 italic">
              Snabblänkar
            </h4>
            <nav className="flex flex-col gap-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <Link href="/search" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Sök Utbildning
              </Link>
              <Link href="/onboarding" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Bli Partner (Trafikskola)
              </Link>
              <a
                href="https://centralen.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
              >
                Plugga Teori (Drive AI) →
              </a>
            </nav>
          </div>

          {/* HÖGER SEKTION: B2B PARTNER INFO */}
          <div className="md:col-span-4">
            <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                För Trafikskolor
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-medium">
                Publicera kurser och fyll lediga platser direkt på Sveriges modernaste marknadsplats.
              </p>
              <Link
                href="/onboarding"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center transition-all shadow-md shadow-emerald-500/10 italic"
              >
                Anslut Din Skola
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 italic">
              © 2026 DLC TECH CARGO  SYSTEM <span className="mx-2 text-slate-300 dark:text-slate-700">/</span> DRIVE AI CENTRALEN
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">
              Göteborg, Sweden
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="italic">Systems Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}