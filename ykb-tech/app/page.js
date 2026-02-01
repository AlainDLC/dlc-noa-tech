"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  Search,
  Building2,
  Zap,
  ArrowRight,
  Star,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
} from "lucide-react";

// --- HJÄLPKOMPONENT FÖR SCROLL-EFFEKT ---
const RevealOnScroll = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 rotate-0"
          : "opacity-0 translate-y-12 rotate-x-6"
      }`}
      style={{ perspective: "1000px" }}
    >
      {children}
    </div>
  );
};

export default function HomePage() {
  const featuredSchools = [
    {
      name: "Falu Trafikcenter",
      city: "Falun",
      rating: 4.9,
      price: "5200 kr",
      tag: "Mest populär",
    },
    {
      name: "Proffschauffören AB",
      city: "Göteborg",
      rating: 4.8,
      price: "1450 kr",
      tag: "Bäst betyg",
    },
    {
      name: "YKB Syd",
      city: "Malmö",
      rating: 4.7,
      price: "1600 kr",
      tag: "Snabbast svar",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      {/* NAVBAR */}

      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Truck className="text-white" size={20} />
            </div>
            {/* Mindre text på mobil för att få plats med allt */}
            <span className="text-sm md:text-xl font-black italic tracking-tighter text-black uppercase text-nowrap">
              <span>YKB LEVERANTÖRERNA</span>
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* MOBIL VERSION AV PARTNERPORTAL (Ikon-knapp) */}
            <Link
              href="/register"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 active:scale-95 transition-all"
            >
              <Building2 size={18} />
            </Link>

            {/* DESKTOP VERSION AV PARTNERPORTAL */}
            <Link
              href="/register"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-blue-600 hover:bg-blue-50 transition-all font-bold text-[11px] uppercase tracking-widest"
            >
              <Building2 size={14} /> Partnerportal
            </Link>

            {/* HITTA KURS (Nu lite mer kompakt på mobil) */}
            <Link href="/search">
              <button className="bg-slate-900 text-white px-4 md:px-6 py-2.5 rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95 flex items-center gap-2">
                <span className="hidden xs:inline">Hitta Kurs</span>
                <Search size={14} className="md:w-4 md:h-4" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-20 pb-16 px-6 relative">
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-8 text-slate-400 border border-slate-100">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Marketplace: 142 lediga platser
          </div>

          <h1 className="text-6xl md:text-[94px] font-[1000] tracking-[-0.06em] mb-8 leading-[0.8] uppercase italic">
            BOKA DIN NÄSTA <br />
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-green-800 bg-clip-text text-transparent">
              YKB-UTBILDNING.
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
            Sveriges största samlingsplats för yrkesförarkurser. Vi säkrar din
            betalning tills kursen är genomförd.
          </p>

          <div className="flex justify-center mb-20">
            <Link href="/search">
              <button className="h-16 px-10 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 shadow-2xl hover:bg-blue-600 hover:scale-[1.05] transition-all group">
                <Search size={20} /> Starta sökning
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
            </Link>
          </div>

          {/* INFO CHIPS */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <ShieldCheck className="text-green-600" size={18} />,
                title: "Escrow-Skydd",
                desc: "Säker betalning",
              },
              {
                icon: <Zap className="text-blue-600" size={18} />,
                title: "Direktbokning",
                desc: "Svar direkt",
              },
              {
                icon: <Building2 className="text-red-500" size={18} />,
                title: "Validerat",
                desc: "Transportstyrelsen",
              },
            ].map((block, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="shrink-0 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  {block.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-black uppercase text-[10px] italic leading-none mb-1">
                    {block.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    {block.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SCHOOLS */}
      <section className="max-w-7xl mx-auto px-6 pb-32 pt-10">
        <div className="flex justify-between items-end mb-12 border-b border-slate-50 pb-6">
          <div>
            <p className="text-blue-600 font-black uppercase tracking-widest text-[9px] mb-2">
              Utvalda partners
            </p>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">
              Rekommenderade skolor
            </h2>
          </div>
          <Link
            href="/search"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
          >
            Se alla skolor →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredSchools.map((school, i) => (
            <RevealOnScroll key={i}>
              <Link href="/search">
                <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
                  <div className="flex justify-between items-start mb-10">
                    <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest group-hover:bg-blue-600 transition-colors">
                      {school.tag}
                    </span>
                    <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                      <Star
                        size={12}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span className="text-xs font-black text-yellow-700">
                        {school.rating}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {school.name}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-400 mb-10">
                    <MapPin size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {school.city}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase">
                        Pris från
                      </p>
                      <p className="text-2xl font-black text-slate-900 italic tracking-tighter">
                        {school.price}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-white pt-32 pb-16 px-6 overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-24">
            {/* VÄNSTER KOLUMN: LOGO & TEXT (Span 5) */}
            <div className="md:col-span-5 space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                  <Truck size={18} className="text-white" />
                </div>
                <span className="font-black italic uppercase tracking-tighter text-xl text-slate-900">
                  YKB<span className="text-blue-600">.</span>L
                </span>
              </div>
              <p className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-[0.85] text-slate-200">
                Framtiden är <br />
                <span className="text-slate-900 font-black">
                  Digital & Säkrad.
                </span>
              </p>
              <div className="flex gap-4">
                {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-11 h-11 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 cursor-pointer transition-all"
                  >
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>

            {/* MITTEN: NAVIGATION (Span 3 - Gav den mer plats för bättre alignment) */}
            <div className="md:col-span-3 flex flex-col justify-start pt-2">
              <h4 className="text-[10px] font-[1000] uppercase tracking-[0.3em] text-blue-600 mb-8 italic">
                Navigation
              </h4>
              <nav className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                <Link
                  href="/search"
                  className="hover:text-slate-900 transition-colors w-fit"
                >
                  Sök Utbildning
                </Link>
                <Link
                  href="/register"
                  className="hover:text-slate-900 transition-colors w-fit"
                >
                  För Skolor
                </Link>
                <Link
                  href="#"
                  className="hover:text-slate-900 transition-colors w-fit"
                >
                  Om Oss
                </Link>
              </nav>
            </div>

            {/* HÖGER: SUPPORT-KORT */}
            <div className="md:col-span-4 flex justify-start md:justify-end">
              {/* -mt-8 gör att innehållet i boxen hoppar upp och linjerar med Navigation-texten */}
              <div className="w-full max-w-sm p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group md:-mt-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 blur-3xl -z-10 group-hover:bg-green-100/50 transition-colors duration-700" />

                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 italic text-blue-600">
                  Support dygnet runt
                </h4>

                <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-tight leading-snug">
                  Behöver du hjälp? <br /> Vi svarar oftast direkt.
                </p>

                <button className="w-full py-4 bg-white border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-[0.15em] shadow-sm hover:shadow-md hover:border-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 italic">
                  Kontakta oss direkt
                </button>
              </div>
            </div>
          </div>

          {/* BOTTEN-RADEN */}
          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-nowrap">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 italic">
                © 2026 DLC NOA TECH SYSTEM{" "}
                <span className="mx-2 text-slate-200">/</span> GLOBAL LOGISTICS
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">
                Built for the modern logistics industry — Stockholm, SE
              </p>
            </div>

            <div className="flex flex-wrap gap-8 items-center text-[10px] font-black uppercase tracking-[0.2em]">
              <Link
                href="#"
                className="text-slate-300 hover:text-slate-900 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-slate-300 hover:text-slate-900 transition-colors"
              >
                Privacy
              </Link>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 italic">Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
