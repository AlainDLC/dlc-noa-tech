"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Building2,
  Zap,
  ArrowRight,
  Star,
  MapPin,
  Sparkles,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import CourseCard from "./api/admin/components/CourseCard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

export default function HomePage() {
  const [myCourses, setMyCourses] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const initializePage = async () => {
      const { data: courses } = await supabase.from("courses").select("*");
      if (courses) setMyCourses(courses);

      if (isLoaded && isSignedIn && user) {
        const { data: partner } = await supabase
          .from("partners")
          .select("id, slug, role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (partner) {
          setUserProfile(partner);
        }
      }
      setLoading(false);
    };

    if (isLoaded) initializePage();
  }, [isLoaded, isSignedIn, user]);

  const featuredSchools = [
    {
      name: "Falu Trafikcenter",
      city: "Falun",
      rating: 4.9,
      price: "5 200 kr",
      tag: "C-KORT & YKB",
    },
    {
      name: "Proffschauffören AB",
      city: "Göteborg",
      rating: 4.8,
      price: "1 450 kr",
      tag: "YKB & ADR",
    },
    {
      name: "Sydsvenska Trafikakademin",
      city: "Malmö",
      rating: 4.7,
      price: "1 600 kr",
      tag: "Buss & CE",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative transition-colors duration-300">
      {/* FRISTÅENDE NAVBAR */}
      <Navbar showSearch={false} />

      {/* BAKGRUNDS-GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[600px] left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="pt-16 md:pt-24 pb-16 px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DRIVE AI CENTRALEN • TRAFIKSKOLEPORTALEN</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight uppercase italic text-slate-900 dark:text-white mb-6">
            HITTA DIN NÄSTA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-600">
              TRAFIKSKOLEKURS.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Jämför och boka godkända kurser för Lastbil (C/CE), Buss (D/DE), YKB, Taxi och ADR. Alla bokningar är Escrow-säkrade tills kursen genomförts.
          </p>

          <div className="flex justify-center mb-16">
            <Link href="/search">
              <button className="h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all group italic">
                <Search size={18} /> Sök Lediga Utbildningar
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
          </div>

          {/* SÄKERHETSTRIPLETT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: <ShieldCheck className="text-emerald-500 dark:text-emerald-400" size={20} />,
                title: "Escrow-Skyddad",
                desc: "Pengarna hålls säkra till kursstart",
              },
              {
                icon: <Zap className="text-blue-500 dark:text-blue-400" size={20} />,
                title: "Direktbekräftelse",
                desc: "Säkra din plats på några sekunder",
              },
              {
                icon: <Building2 className="text-teal-500 dark:text-teal-400" size={20} />,
                title: "Verifierade Skolor",
                desc: "Endast godkända utbildare",
              },
            ].map((block, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md text-left shadow-sm dark:shadow-none"
              >
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50">
                  {block.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase text-slate-900 dark:text-white tracking-wider">
                    {block.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {block.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE KURSER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative z-10">
        <div className="flex items-center justify-between mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-1">
              Aktuellt Utbud
            </span>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
              Lediga Kurser Just Nu
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Visa Alla Kurser →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.length > 0 ? (
            myCourses.map((item) => (
              <RevealOnScroll key={item.id}>
                <Link
                  href={`/search?courseId=${item.id}`}
                  className="block transition-all hover:-translate-y-1"
                >
                  <CourseCard course={item} />
                </Link>
              </RevealOnScroll>
            ))
          ) : (
            <div className="col-span-full py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 rounded-3xl">
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                Inga live-kurser schemalagda just nu.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* REKOMMENDERADE TRAFIKSKOLOR */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative z-10">
        <div className="flex justify-between items-end mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest block mb-1">
              Verifierade Utbildare
            </span>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
              Rekommenderade Trafikskolor
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredSchools.map((school, i) => (
            <RevealOnScroll key={i}>
              <Link href="/search">
                <div className="group bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-md flex flex-col justify-between h-full shadow-sm dark:shadow-none">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {school.tag}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        <Star
                          size={12}
                          className="text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400"
                        />
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                          {school.rating}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {school.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-8">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="text-xs font-semibold uppercase">
                        {school.city}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800/80">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                        Pris från
                      </p>
                      <p className="text-xl font-black text-slate-900 dark:text-white italic">
                        {school.price}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* FRISTÅENDE FOOTER */}
      <Footer />
    </main>
  );
}