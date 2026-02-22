"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";
import BookingModal from "../api/admin/components/BookingModal";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Search as SearchIcon,
  MapPin,
  Calendar,
  ChevronRight,
  Clock,
  ArrowLeft,
  MapIcon,
  List,
  Info,
  Users,
  ScanIcon,
  Zap,
} from "lucide-react";
import Image from "next/image";

const Map = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse rounded-[3rem]" />
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
  const { user } = useUser();

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
          schedule: school.courses.map((c) => ({
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
      <div className="p-20 text-center font-black animate-bounce text-blue-600 uppercase italic">
        Söker efter bästa YKB...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* --- NAVBAR (SYNCHRONIZED WITH HOMEPAGE) --- */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-[100]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center">
                <Image
                  alt="loga"
                  src="/loga.png"
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </div>
              <span className="text-sm md:text-xl font-black italic tracking-tighter text-black uppercase text-nowrap">
                YKB CENTRALEN
              </span>
            </Link>
          </div>

          {/* SÖKFÄLT DESKTOP */}
          <div className="relative flex-1 max-w-md mx-4 hidden md:block">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              placeholder="Sök stad eller skola..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* 
            {user && (
              <Link
                href="/partner/dashboard"
                className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-blue-600 transition-all"
              >
                <ScanIcon size={18} />
              </Link>
            )}
            <div className="scale-110">
              <UserButton afterSignOutUrl="/" />
            </div>
             */}
          </div>
        </div>

        {/* MOBILSÖK (SYNLIGT ENDAST PÅ MOBIL) */}
        <div className="md:hidden px-4 pb-4 bg-white/80 backdrop-blur-md">
          <div className="relative">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              value={searchTerm}
              placeholder="Sök stad eller skola..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl font-bold text-xs outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
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
                className="flex items-center gap-1 md:gap-2 px-3 py-2 bg-white rounded-full shadow-sm text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft size={12} /> <span>Visa alla</span>
              </button>
            )}
          </div>

          {(activeSchool ? [activeSchool] : filteredSchools).map((school) => (
            <div
              key={school.id}
              className={`group bg-white rounded-3xl md:rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${
                activeSchool?.id === school.id
                  ? "border-blue-600 shadow-2xl scale-[1.01]"
                  : "border-transparent shadow-sm hover:border-slate-200"
              }`}
            >
              <div className="p-5 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                  <div
                    onClick={() => setActiveSchool(school)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-black italic tracking-tighter uppercase text-slate-900 leading-none mb-2 text-2xl md:text-3xl">
                      {school.name}
                    </h3>
                    <div className="flex items-center text-slate-500">
                      <MapPin size={14} className="text-blue-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest ml-1">
                        {school.city}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">
                      PRIS FRÅN
                    </p>
                    <p className="text-2xl font-black text-blue-600 italic tracking-tighter leading-none">
                      {school.schedule?.[0]?.price || 4995} kr
                    </p>
                  </div>
                </div>

                {activeSchool?.id === school.id && isExpanded && (
                  <div className="mb-8 p-8 bg-slate-50 rounded-[2rem] animate-in fade-in zoom-in duration-300 border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
                      <Info size={14} /> Om utbildaren
                    </p>
                    <p className="text-slate-600 text-sm font-bold leading-relaxed whitespace-pre-line">
                      {school.description || "Ingen beskrivning tillgänglig."}
                    </p>
                  </div>
                )}

                {/* --- DATUM & PLATSER --- */}
                <div className="space-y-2 mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 right-1">
                    <Clock size={12} /> Tillgängliga starter
                  </p>

                  {/* Vi lägger till gap-5 istället för gap-3 för att ge plats åt etiketterna */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5 pt-2">
                    {school.schedule?.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:border-blue-200 transition-all group/item"
                      >
                        {/* KAMPANJ-BADGE - Justerad position */}
                        {item.campaign_label && (
                          <div className="absolute -top-3 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full shadow-lg shadow-emerald-200 flex items-center gap-1.5 z-10 animate-in fade-in slide-in-from-top-1 transition-transform group-hover/item:scale-105">
                            <Zap
                              size={10}
                              fill="currentColor"
                              className="text-emerald-200"
                            />
                            <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                              {item.campaign_label}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            <Calendar size={18} className="text-blue-600" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black text-slate-900 uppercase italic truncate">
                              {item.date}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase leading-none truncate">
                              {item.label}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`shrink-0 px-3 py-1 rounded-full flex items-center gap-1.5 ${
                            item.slots > 5
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
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

                <div className="flex justify-between items-center border-t pt-6 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSchool(school);
                      setIsExpanded(!isExpanded);
                    }}
                    className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
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
                    className="bg-slate-900   text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.1em] flex items-center gap-3 hover:bg-blue-600 hover:-translate-y-1 transition-all shadow-xl shadow-blue-100"
                  >
                    Boka plats <ChevronRight size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`lg:block lg:relative ${showMap ? "fixed top-20 inset-x-0 bottom-0 z-40 bg-white" : "hidden"}`}
        >
          <div className="h-full w-full lg:h-[700px] lg:sticky lg:top-32 overflow-hidden lg:rounded-[3rem] lg:border-[10px] lg:border-white lg:shadow-2xl">
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

        <button
          onClick={() => setShowMap(!showMap)}
          className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3"
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
