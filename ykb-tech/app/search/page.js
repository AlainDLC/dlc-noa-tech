"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useData } from "../context/DataContext";
import {
  Search as SearchIcon,
  MapPin,
  Calendar,
  ChevronRight,
  Truck,
  Clock,
  ArrowLeft,
} from "lucide-react";

const Map = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse rounded-[3rem]" />
  ),
});

export default function SearchPage() {
  const { schools, activeSchool, setActiveSchool } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredSchools = useMemo(() => {
    return schools.filter(
      (school) =>
        school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [schools, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="h-20 bg-white border-b flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="text-white" size={18} />
            </div>
            <span className="font-black italic tracking-tighter text-slate-900 uppercase">
              YKB LEVERANTÖRERNA
            </span>
          </Link>
          <div className="relative w-1/3">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Sök stad eller skola..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
              {activeSchool ? "Detaljer" : "Resultat"}
            </h1>

            {activeSchool && (
              <button
                onClick={() => {
                  setActiveSchool(null);
                  setIsExpanded(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-xs font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft size={14} /> Visa alla skolor
              </button>
            )}
          </div>

          {(activeSchool ? [activeSchool] : filteredSchools).map((school) => (
            <div
              key={school.id}
              onClick={() => {
                if (activeSchool?.id !== school.id) {
                  setActiveSchool(school);
                  setIsExpanded(false);
                }
              }}
              className={`group cursor-pointer bg-white rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${
                activeSchool?.id === school.id
                  ? "border-blue-600 shadow-2xl scale-[1.01]"
                  : "border-transparent shadow-sm hover:border-slate-200"
              }`}
            >
              <div className="p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-6">
                    <div className="min-w-0">
                      <h3
                        className={`font-black italic tracking-tighter uppercase text-slate-900 leading-none mb-2 break-words ${activeSchool ? "text-3xl" : "text-2xl"}`}
                      >
                        {school.name}
                      </h3>
                      <div className="flex items-center text-slate-500">
                        <MapPin size={16} className="text-blue-600" />
                        <span className="text-xs font-black uppercase tracking-widest ml-1">
                          {school.city}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2 shrink-0">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 leading-none">
                          Pris
                        </p>
                        <p className="text-2xl font-black text-blue-600 italic tracking-tighter leading-none">
                          {school.price}
                        </p>
                      </div>

                      {activeSchool?.id === school.id && !isExpanded && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(true);
                          }}
                          className="mt-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
                        >
                          Visa detaljer
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <Clock size={12} /> Kommande starter
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {school.schedule && school.schedule.length > 0 ? (
                        school.schedule.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-2 py-2 rounded-xl"
                          >
                            <Calendar size={12} className="text-blue-600" />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-blue-800 leading-none uppercase">
                                {item.date}
                              </span>
                              <span className="text-[9px] font-bold text-blue-600/70 uppercase">
                                {item.label}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center bg-slate-50 py-2 rounded-xl ">
                          <Calendar size={12} className="text-slate-400" />
                          <span className="text-[10px] font-black text-slate-500 uppercase ml-2">
                            {school.nextStart || "Kontakta för datum"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 border-t pt-6">
                    {school.courses?.map((course, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400"
                      >
                        {course}
                      </span>
                    ))}
                  </div>

                  {isExpanded && activeSchool?.id === school.id && (
                    <div className="mt-8 pt-8 border-t-2 border-slate-50 animate-in fade-in slide-in-from-top-4 duration-500">
                      <h4 className="font-black italic uppercase tracking-tighter text-blue-600 mb-4 text-sm">
                        Om utbildaren
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
                        {school.description ||
                          "Information om utbildaren saknas."}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(false);
                        }}
                        className="mt-4 text-[9px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        Visa mindre info
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-[200px] h-[150px] flex-none hidden md:flex items-stretch">
                  <button className="w-full h-16 md:h-auto bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 hover:bg-green-600 transition-all active:scale-95 shadow-lg">
                    Boka plats <ChevronRight size={16} />
                  </button>
                </div>
                {/* Mobilversion av knappen (syns bara på små skärmar) */}
                <div className="md:hidden w-full h-16 mt-4">
                  <button className="w-full h-full bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2">
                    Boka plats <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="bg-white rounded-[3rem] h-[700px] sticky top-32 overflow-hidden border-[10px] border-white shadow-2xl">
            {/* VIKTIGT: Key är nu stabil ("static-map") för att undvika krasch vid sökning */}
            <Map
              key="static-map"
              schools={filteredSchools}
              activeSchool={activeSchool}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
