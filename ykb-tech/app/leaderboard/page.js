"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users2,
  MapPin,
  ShieldCheck,
  Unlock,
  Phone,
  FileText,
  Zap,
  Briefcase,
  Lock,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import Image from "next/image";

// Importera dina komponenter
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LeaderboardPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      const { data, error } = await supabase
        .from("market_drivers")
        .select("*")
        .order("score_percentage", { ascending: false });

      if (data) setDrivers(data);
      if (error) console.error("Fel vid hämtning:", error);
      setLoading(false);
    };

    fetchDrivers();
  }, []);

  const handleUnlock = async (driverId) => {
    try {
      const res = await fetch("http://localhost:3001/api/unlock-driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId }),
      });

      if (res.ok) {
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === driverId ? { ...d, is_unlocked: true } : d,
          ),
        );
      }
    } catch (error) {
      console.error("Kunde inte låsa upp profilen:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar showSearch={false} />

      <main className="flex-grow bg-slate-50/50 pb-20 selection:bg-blue-100 font-sans text-left">
        {/* HEADER SECTION */}
        <div className="bg-white border-b border-slate-100 pt-10 pb-6 px-4 md:px-6 text-left">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Users2 className="text-blue-600" size={16} />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600 italic leading-none">
                    YKB CENTRALEN MARKETPLACE
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-[1000] italic uppercase tracking-tighter text-slate-900 leading-none">
                  Driver <span className="text-blue-600">Leaderboard</span>
                </h1>
              </div>

              {/* STATS BOXAR - FIXADE PROPORTIONER */}
              <div className="flex flex-row gap-3 w-full md:w-auto mt-4 md:mt-0 text-left">
                <div className="flex-1 md:w-52 bg-white border border-slate-200 p-4 md:p-6 rounded-[2rem] shadow-sm flex flex-col justify-center transition-all hover:border-blue-200">
                  <p className="text-[7px] md:text-[9px] font-[1000] text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none text-left">
                    TILLGÄNGLIGA \
                  </p>
                  <p className="text-base md:text-2xl font-[1000] italic uppercase text-slate-900 leading-none text-left">
                    {drivers.length}{" "}
                    <span className="text-[10px] md:text-sm text-blue-600 font-black ml-1">
                      Förare
                    </span>
                  </p>
                </div>

                <div className="flex-1 md:w-52 bg-slate-900 p-4 md:p-6 rounded-[2rem] shadow-xl flex flex-col justify-center border border-slate-800 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[7px] md:text-[9px] font-[1000] text-blue-400 uppercase tracking-[0.2em] mb-1 relative z-10 leading-none text-left">
                    SYSTEM STATUS \
                  </p>
                  <div className="flex items-center gap-2 relative z-10 text-left">
                    <div className="shrink-0 w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <p className="text-sm md:text-2xl font-[1000] italic uppercase text-white leading-none text-left tracking-tighter">
                      Verifierade
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GRID SECTION */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-left">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-left">
                Ansluter till krypterad databas...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {drivers.map((driver, index) => (
                <div
                  key={driver.id}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full overflow-hidden text-left"
                >
                  <div className="absolute top-6 right-8 text-5xl font-[1000] italic text-slate-50 group-hover:text-blue-50/50 transition-colors pointer-events-none text-left">
                    #{index + 1}
                  </div>

                  <div className="flex items-center gap-2 mb-6 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100 text-left">
                    <ShieldCheck size={12} className="text-green-600" />
                    <span className="text-[8px] font-black text-green-700 uppercase tracking-widest italic leading-none text-left">
                      Verifierad Kompetens
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-6 text-left">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden flex-shrink-0 text-left">
                      <Image
                        src="/loga.png"
                        width={40}
                        height={40}
                        className={`opacity-70 grayscale transition-all ${!driver.is_unlocked ? "blur-md" : ""}`}
                        alt="logo"
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-[1000] italic uppercase tracking-tighter leading-none mb-1 text-slate-900 text-left">
                        {driver.is_unlocked
                          ? driver.full_name
                          : `FÖRARE #${driver.id.slice(0, 5).toUpperCase()}`}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-400 text-left leading-none">
                        <MapPin size={12} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none text-left">
                          {driver.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4 text-left">
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg text-left">
                      <Briefcase size={10} className="text-blue-600" />
                      <span className="text-[9px] font-black uppercase text-blue-700 leading-none text-left">
                        {driver.experience_level || "0-2 år"}
                      </span>
                    </div>
                    {driver.adr_status !== "Saknas" && (
                      <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100 text-left">
                        <Zap size={10} className="text-orange-600" />
                        <span className="text-[9px] font-black uppercase text-orange-700 leading-none text-left">
                          ADR {driver.adr_status}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative mb-6 text-left">
                    <p
                      className={`text-[11px] text-slate-500 italic font-medium line-clamp-2 transition-all duration-700 text-left ${!driver.is_unlocked ? "blur-[5px] opacity-40 select-none" : ""}`}
                    >
                      {driver.bio ||
                        "Professionell yrkesförare med fokus på säkerhet och leveransprecision."}
                    </p>
                    {!driver.is_unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center text-left">
                        <div className="bg-white/90 border border-slate-100 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm text-left">
                          <Lock
                            size={10}
                            className="text-slate-900 text-left"
                          />
                          <span className="text-[7px] font-black text-slate-900 uppercase italic leading-none text-left">
                            Profil Låst
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-8 text-left">
                    {driver.has_c_license && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[8px] font-black rounded-md uppercase italic border border-slate-200 leading-none text-left">
                        Lastbil (C)
                      </span>
                    )}
                    {driver.has_ce_license && (
                      <span className="px-2 py-1 bg-slate-900 text-white text-[8px] font-black rounded-md uppercase italic border-b-2 border-blue-500 leading-none text-left">
                        Släp (CE)
                      </span>
                    )}
                    {driver.has_ykb && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-[8px] font-black rounded-md uppercase italic leading-none text-left">
                        YKB Klar
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 mb-8 flex justify-between items-center border border-slate-100 group-hover:bg-blue-50/50 transition-colors mt-auto relative overflow-hidden text-left">
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-purple-600 rounded-full animate-ai-pulse-purple z-10 shadow-lg shadow-purple-200 text-left">
                      <Zap
                        size={8}
                        className="text-white fill-white text-left"
                      />
                      <span className="text-[7px] font-black text-white uppercase tracking-tighter italic leading-none text-left">
                        TECH MATCH
                      </span>
                    </div>

                    <div className="text-left relative z-10">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest leading-none text-left">
                        YKB PRESTATION
                      </p>
                      <div className="flex items-baseline gap-1 text-left">
                        <p className="text-3xl font-[1000] italic text-slate-900 leading-none text-left">
                          {driver.score_percentage}
                          <span className="text-sm text-blue-600 ml-0.5">
                            %
                          </span>
                        </p>
                        {driver.score_percentage >= 90 && (
                          <span className="text-[10px] font-black text-blue-600 uppercase italic leading-none text-left">
                            Elite
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 relative z-10 text-left">
                      <ShieldCheck
                        size={20}
                        className="text-green-500 text-left"
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-left">
                    {driver.is_unlocked ? (
                      <div className="space-y-3 text-left">
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3 text-left">
                          <Phone
                            size={16}
                            className="text-green-600 text-left"
                          />
                          <div className="text-left">
                            <p className="text-[8px] font-black text-green-600 uppercase mb-0.5 tracking-widest italic leading-none text-left">
                              MOBILNUMMER
                            </p>
                            <p className="text-lg font-[1000] text-slate-900 italic tracking-tighter leading-none text-left">
                              {driver.phone}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/cv/${driver.id}`}
                          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg italic flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 text-left"
                        >
                          <FileText size={14} className="text-left" /> Se
                          fullständigt CV
                        </Link>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUnlock(driver.id)}
                        className="w-full h-14 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all shadow-sm italic group active:scale-95 text-left"
                      >
                        <Unlock
                          size={14}
                          className="group-hover:rotate-12 transition-transform text-left"
                        />
                        Lås upp profil
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
