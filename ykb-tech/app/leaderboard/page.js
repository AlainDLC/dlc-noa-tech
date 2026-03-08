"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users2,
  MapPin,
  ShieldCheck,
  Unlock,
  ArrowLeft,
  Phone,
  FileText,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import Image from "next/image";

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
      setLoading(false);
    };

    fetchDrivers();
  }, []);

  const handleUnlock = async (driverId) => {
    try {
      const res = await fetch("/api/unlock-driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId }),
      });

      if (res.ok) {
        // Uppdaterar lokala staten direkt för en "snabb" känsla
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
    <main className="min-h-screen bg-slate-50/50 pb-20 selection:bg-blue-100 font-sans">
      {/* HEADER SEKTION */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-8 px-6 sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Tillbaka till start
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users2 className="text-blue-600" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 italic">
                  YKB CENTRALEN REKRYTERING
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-[1000] italic uppercase tracking-tighter text-slate-900 leading-none">
                Driver <span className="text-blue-600">Leaderboard</span>
              </h1>
            </div>

            <div className="flex gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm min-w-[140px]">
                <p className="text-[8px] font-black text-zinc-400 uppercase mb-1 tracking-widest text-left">
                  TILLGÄNGLIGA
                </p>
                <p className="text-xl font-black italic uppercase text-left">
                  {drivers.length} Förare
                </p>
              </div>
              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg min-w-[140px]">
                <p className="text-[8px] font-black text-blue-400 uppercase mb-1 tracking-widest text-left">
                  STATUS
                </p>
                <p className="text-xl font-black italic uppercase text-nowrap text-left">
                  Verifierade
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRID MED FÖRARKORT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
              Ansluter till krypterad databas...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {drivers.map((driver, index) => (
              <div
                key={driver.id}
                className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 relative overflow-hidden flex flex-col"
              >
                {/* Ranking-badge i bakgrunden */}
                <div className="absolute top-6 right-8 text-5xl font-[1000] italic text-slate-50 group-hover:text-blue-50/50 transition-colors pointer-events-none">
                  #{index + 1}
                </div>

                {/* Profil-head */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden shadow-inner">
                    <Image
                      src="/loga.png" // Se till att din fil heter exakt så och ligger i public-mappen
                      width={40}
                      height={40}
                      className="opacity-70 grayscale" // Denna gör loggan subtil i bakgrunden
                      alt="logo"
                    />
                    {/* Gradient-listen i botten som knyter ihop färgerna */}
                    <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-blue-600 to-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-[1000] italic uppercase tracking-tighter leading-none mb-1 text-slate-900">
                      {driver.is_unlocked
                        ? driver.full_name
                        : driver.full_name.includes(" ")
                          ? `${driver.full_name.split(" ")[0]} ${driver.full_name.split(" ")[1]?.[0] || ""}.`
                          : `${driver.full_name.charAt(0)}. [ANONYM]`}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-400">
                      <MapPin size={12} className="text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {driver.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Behörigheter */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(driver.license_types || "C, CE, YKB")
                    .split(",")
                    .map((type) => (
                      <span
                        key={type}
                        className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black rounded-md italic uppercase tracking-widest border-b-2 border-blue-500"
                      >
                        {type.trim()}
                      </span>
                    ))}
                </div>

                {/* Resultat-box */}
                <div className="bg-slate-50 rounded-2xl p-5 mb-8 flex justify-between items-center border border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                      YKB RESULTAT
                    </p>
                    <p className="text-3xl font-[1000] italic text-slate-900 leading-none">
                      {driver.score_percentage}
                      <span className="text-sm text-blue-600 ml-0.5">%</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
                      <ShieldCheck size={20} className="text-green-500" />
                    </div>
                    <span className="text-[8px] font-black text-green-600 uppercase italic tracking-tighter">
                      Verifierad
                    </span>
                  </div>
                </div>

                {/* Action-sektion (Paywall vs Kontaktinfo) */}
                <div className="mt-auto pt-4">
                  {driver.is_unlocked ? (
                    <div className="space-y-3 animate-appearance-in">
                      <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                        <Phone size={16} className="text-green-600" />
                        <div>
                          <p className="text-[8px] font-black text-green-600 uppercase mb-0.5 tracking-widest italic leading-none">
                            MOBILNUMMER
                          </p>
                          <p className="text-lg font-[1000] text-slate-900 italic tracking-tighter leading-none uppercase">
                            {driver.phone}
                          </p>
                        </div>
                      </div>
                      <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all italic flex items-center justify-center gap-2">
                        <FileText size={14} /> Ladda ner CV / Intyg
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUnlock(driver.id)}
                      className="w-full h-14 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95 group/btn italic"
                    >
                      <Unlock
                        size={14}
                        className="group-hover/btn:rotate-12 transition-transform"
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
  );
}
