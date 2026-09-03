"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";
import BookingModal from "../api/admin/components/BookingModal";
import Navbar from "../components/Navbar";
import {
  MapPin,
  Calendar,
  ChevronRight,
  Clock,
  ArrowLeft,
  MapIcon,
  List,
  Info,
  Users,
  Zap,
} from "lucide-react";

const Map = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-[3rem]" />
  ),
});

export default function SearchPage() {
  const [schools, setSchools] = useState([]);
  const [activeSchool, setActiveSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedSchoolForBooking, setSelectedSchoolForBooking] =
    useState(null);

  useEffect(() => {
    async function fetchLiveMarketplace() {
      setLoading(true);
      const { data, error } = await supabase.from("partners").select(`
        id, 
        name, 
        city, 
        address, 
        lat, 
        lng, 
        slug,
        description,
        courses (*) 
      `);

      if (!error && data) {
        const formattedData = data.map((school) => ({
          ...school,
          schedule: (school.courses || []).map((c) => ({
            date: c.date,
            label: c.name,
            slots: c.slots,
            price: c.price || 5000,
            campaign_label: c.campaign_label,
          })),
        }));
        setSchools(formattedData);
      }
      setLoading(false);
    }
    fetchLiveMarketplace();
  }, []);

  const filteredSchools = useMemo(() => {
    return schools.filter(
      (school) =>
        school.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [schools, searchTerm]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-20 text-center font-black animate-pulse text-emerald-500 uppercase italic text-lg tracking-widest">
        Söker efter lediga utbildningar...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* NAVBAR MED INBYGGDA SÖK & TEMA-VÄXLARE */}
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} showSearch={true} />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">
              {activeSchool
                ? "Detaljer"
                : `Resultat (${filteredSchools.length})`}
            </h1>
            {activeSchool && (
              <button
                onClick={() => {
                  setActiveSchool(null);
                  setIsExpanded(false);
                }}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft size={12} /> <span>Visa alla</span>
              </button>
            )}
          </div>

          {(activeSchool ? [activeSchool] : filteredSchools).map((school) => (
            <div
              key={school.id}
              className={`group bg-white dark:bg-slate-900/60 rounded-3xl md:rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden backdrop-blur-md ${
                activeSchool?.id === school.id
                  ? "border-emerald-500 shadow-2xl scale-[1.01]"
                  : "border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-emerald-500/40"
              }`}
            >
              <div className="p-5 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                  <div
                    onClick={() => setActiveSchool(school)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none mb-2 text-2xl md:text-3xl group-hover:text-emerald-500 transition-colors">
                      {school.name}
                    </h3>
                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                      <MapPin size={14} className="text-emerald-500 dark:text-emerald-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest ml-1">
                        {school.city}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">
                      PRIS FRÅN
                    </p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 italic tracking-tighter leading-none">
                      {school.schedule?.[0]?.price || 4995} kr
                    </p>
                  </div>
                </div>

                {activeSchool?.id === school.id && isExpanded && (
                  <div className="mb-8 p-6 md:p-8 bg-slate-100 dark:bg-slate-900/90 rounded-[2rem] animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                      <Info size={14} /> Om utbildaren
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold leading-relaxed whitespace-pre-line">
                      {school.description || "Ingen beskrivning tillgänglig."}
                    </p>
                  </div>
                )}

                {/* DATUM & PLATSER */}
                <div className="space-y-2 mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <Clock size={12} /> Tillgängliga starter
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5 pt-2">
                    {school.schedule?.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl hover:border-emerald-500/40 transition-all group/item"
                      >
                        {item.campaign_label && (
                          <div className="absolute -top-3 left-4 bg-emerald-500 text-slate-950 px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 z-10 animate-in fade-in slide-in-from-top-1 transition-transform group-hover/item:scale-105">
                            <Zap
                              size={10}
                              fill="currentColor"
                              className="text-slate-950"
                            />
                            <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                              {item.campaign_label}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            <Calendar size={18} className="text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase italic truncate">
                              {item.date}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none truncate">
                              {item.label}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`shrink-0 px-3 py-1 rounded-full flex items-center gap-1.5 ${
                            item.slots > 5
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}
                        >
                          <Users size={10} />
                          <span className="text-[9px] font-black uppercase whitespace-nowrap">
                            {item.slots} kvar
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800/80 pt-6 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSchool(school);
                      setIsExpanded(!isExpanded);
                    }}
                    className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    {isExpanded && activeSchool?.id === school.id
                      ? "Visa mindre"
                      : "Läs mer om skolan"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSchoolForBooking(school);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-wider flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-emerald-500/10 active:scale-95 italic"
                  >
                    Boka plats <ChevronRight size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* KARTA */}
        <div
          className={`lg:block lg:relative ${showMap ? "fixed top-20 inset-x-0 bottom-0 z-40 bg-white dark:bg-slate-950" : "hidden"}`}
        >
          <div className="h-full w-full lg:h-[700px] lg:sticky lg:top-32 overflow-hidden lg:rounded-[3rem] lg:border-[10px] lg:border-white dark:lg:border-slate-900 lg:shadow-2xl">
            {(showMap ||
              (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
              <Map
                key={activeSchool?.id || "global-map"}
                schools={filteredSchools}
                activeSchool={activeSchool}
                showMap={showMap}
              />
            )}
          </div>
        </div>

        {/* MOBIL KNAPP FÖR KARTA/LISTA */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 active:scale-95 transition-transform"
        >
          {showMap ? <List size={18} /> : <MapIcon size={18} />}
          {showMap ? "Visa Lista" : "Visa Karta"}
        </button>
      </main>

      {selectedSchoolForBooking && (
        <BookingModal
          school={selectedSchoolForBooking}
          onClose={() => setSelectedSchoolForBooking(null)}
        />
      )}
    </div>
  );
}