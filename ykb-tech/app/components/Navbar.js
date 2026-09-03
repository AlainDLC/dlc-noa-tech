"use client";

import Link from "next/link";
import {
  Search as SearchIcon,
  Sun,
  Moon,
  GraduationCap,
  Building2,
  Users,
  Home,
  Menu,
  X,
  Truck,
  BookOpen,
  Briefcase
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Navbar({
  searchTerm = "",
  setSearchTerm = () => {},
  showSearch = true,
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Säkrar att klienten är redo innan tema/fönsterberoende kod körs
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <nav className="border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-[100] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center gap-4">
        
        {/* LOGO / BRAND */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-500 dark:text-emerald-400 group-hover:scale-105 group-hover:border-emerald-400 transition-all shadow-lg shadow-emerald-500/5">
              <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                DRIVE AI <span className="text-emerald-500">CENTRALEN</span>
              </span>
              <span className="text-[9px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400 uppercase leading-none mt-1">
                Marknadsplats & Rekrytering
              </span>
            </div>
          </Link>
        </div>

        {/* SÖKFÄLT DESKTOP */}
        {showSearch && (
          <div className="relative flex-1 max-w-xs xl:max-w-md mx-4 hidden md:block">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={16}
            />
            <input
              type="text"
              value={searchTerm}
              placeholder="Sök utbildning, ort eller jobbtitel..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none font-bold text-xs transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* DESKTOP NAVIGERING */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Hem</span>
          </Link>

          <Link
            href="/jobs"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
            <span>Lediga Jobb</span>
          </Link>

          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            <span>Leaderboard</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* B2B PUSH KNAPPAR */}
          <Link
            href="/for-akerier"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>För Åkerier</span>
          </Link>

          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>För Trafikskolor</span>
          </Link>

          {/* EXTERNT TEORIVERKTYG */}
          <a
            href="https://centralen.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 ml-1 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/15 active:scale-95 italic"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Plugga Teori</span>
          </a>

          {/* TEMA-TOGGLE */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-95 ml-1 min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Växla tema"
          >
            {mounted ? (
              isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-emerald-600" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* MOBILKONTROLLER */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            {mounted ? (
              isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-emerald-600" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILSÖK */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="relative">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={15}
            />
            <input
              type="text"
              value={searchTerm}
              placeholder="Sök utbildning, ort, jobb..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* MOBIL MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-6 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white transition-colors"
          >
            <Home size={18} className="text-slate-400" />
            <span>Hem</span>
          </Link>

          <Link
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white transition-colors"
          >
            <Briefcase size={18} className="text-emerald-500" />
            <span>Sök Lediga Jobb</span>
          </Link>

          <Link
            href="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white transition-colors"
          >
            <Users size={18} className="text-emerald-500" />
            <span>Driver Leaderboard</span>
          </Link>

          <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800/80" />

          <Link
            href="/for-akerier"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-bold text-emerald-600 dark:text-emerald-400"
          >
            <Truck size={18} />
            <span>För Åkerier (Rekrytering)</span>
          </Link>

          <Link
            href="/onboarding"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-sm font-bold text-blue-600 dark:text-blue-400"
          >
            <Building2 size={18} />
            <span>För Trafikskolor (Annonsering)</span>
          </Link>

          <a
            href="https://centralen.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full mt-4 py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-black uppercase text-xs tracking-wider italic shadow-lg shadow-emerald-500/20"
          >
            <BookOpen size={16} />
            <span>Plugga Teori på Drive AI</span>
          </a>
        </div>
      )}
    </nav>
  );
}