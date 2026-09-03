"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MOCK_JOBS } from "../data/schools";
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
  Briefcase,
  BadgeCheck,
  Building2,
  CheckCircle2,
  X
} from "lucide-react";

// Dynamisk karta
const Map = dynamic(() => import("../search/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-[3rem]" />
  ),
});

export default function JobsPage() {
  const [activeJob, setActiveJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(
      (job) =>
        job.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* NAVBAR MED SÖK */}
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} showSearch={true} />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid lg:grid-cols-3 gap-8">
        
        {/* VÄNSTERKOLUMN: JOBBLISTA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-1">
                Sök Lediga Tjänster
              </span>
              <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">
                {activeJob ? "Jobbdetaljer" : `Lediga Jobb (${filteredJobs.length})`}
              </h1>
            </div>

            {activeJob && (
              <button
                onClick={() => {
                  setActiveJob(null);
                  setIsExpanded(false);
                }}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft size={12} /> <span>Visa alla jobb</span>
              </button>
            )}
          </div>

          {(activeJob ? [activeJob] : filteredJobs).map((job) => (
            <div
              key={job.id}
              className={`group bg-white dark:bg-slate-900/60 rounded-3xl md:rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden backdrop-blur-md ${
                activeJob?.id === job.id
                  ? "border-emerald-500 shadow-2xl scale-[1.01]"
                  : "border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-emerald-500/40"
              }`}
            >
              <div className="p-5 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                  <div
                    onClick={() => setActiveJob(job)}
                    className="cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                      <Briefcase size={12} /> {job.type}
                    </span>
                    <h3 className="font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none mb-2 text-2xl md:text-3xl group-hover:text-emerald-500 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      {job.company}
                    </p>
                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                      <MapPin size={14} className="text-emerald-500 dark:text-emerald-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest ml-1">
                        {job.city} • {job.address}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">
                      UPPSKATTAD LÖN
                    </p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 italic tracking-tighter leading-none">
                      {job.salary}
                    </p>
                  </div>
                </div>

                {/* BEHÖRIGHETER & KRAV */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.requirements?.map((req, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
                    >
                      <BadgeCheck size={12} className="text-emerald-500" />
                      {req}
                    </span>
                  ))}
                </div>

                {/* UTVIKT BESKRIVNING */}
                {activeJob?.id === job.id && isExpanded && (
                  <div className="mb-8 p-6 md:p-8 bg-slate-100 dark:bg-slate-900/90 rounded-[2rem] animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                      <Info size={14} /> Om tjänsten & Åkeriet
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                )}

                {/* STARTDATUM OCH PLATSER */}
                <div className="space-y-2 mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <Clock size={12} /> Tillgängliga anställningsstarter
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {job.schedule?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            <Calendar size={16} className="text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-xs font-black text-slate-900 dark:text-white uppercase italic">
                            {item.date}
                          </span>
                        </div>

                        <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1">
                          <Users size={10} />
                          <span className="text-[9px] font-black uppercase">
                            {item.slots} platser
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTTOM ACTION */}
                <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800/80 pt-6 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveJob(job);
                      setIsExpanded(!isExpanded);
                    }}
                    className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    {isExpanded && activeJob?.id === job.id
                      ? "Visa mindre"
                      : "Läs hela tjänstebeskrivningen"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJobForApplication(job);
                      setHasApplied(false);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-wider flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-emerald-500/10 active:scale-95 italic"
                  >
                    Sök Tjänst <ChevronRight size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HÖGERKOLUMN: KARTA OVER ÅKERIER */}
        <div
          className={`lg:block lg:relative ${showMap ? "fixed top-20 inset-x-0 bottom-0 z-40 bg-white dark:bg-slate-950" : "hidden"}`}
        >
          <div className="h-full w-full lg:h-[700px] lg:sticky lg:top-32 overflow-hidden lg:rounded-[3rem] lg:border-[10px] lg:border-white dark:lg:border-slate-900 lg:shadow-2xl">
            {(showMap ||
              (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
              <Map
                key={activeJob?.id || "global-map-jobs"}
                schools={filteredJobs.map((j) => ({ ...j, name: j.company }))}
                activeSchool={activeJob ? { ...activeJob, name: activeJob.company } : null}
                showMap={showMap}
              />
            )}
          </div>
        </div>

        {/* MOBIL KNAPP KARTA/LISTA */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 active:scale-95 transition-transform"
        >
          {showMap ? <List size={18} /> : <MapIcon size={18} />}
          {showMap ? "Visa Lista" : "Visa Karta"}
        </button>
      </main>

      {/* MODAL FÖR ANSÖKAN */}
      {selectedJobForApplication && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-8 relative">
            <button
              onClick={() => setSelectedJobForApplication(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={20} />
            </button>

            {!hasApplied ? (
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest block mb-1">
                  Snabbansökan
                </span>
                <h3 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white mb-2">
                  {selectedJobForApplication.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-6">
                  {selectedJobForApplication.company} • {selectedJobForApplication.city}
                </p>

                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="Ditt fullständiga namn"
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="email"
                    placeholder="E-postadress"
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="tel"
                    placeholder="Telefonnummer"
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  onClick={() => setHasApplied(true)}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-xs tracking-wider rounded-xl italic transition-all"
                >
                  Skicka Ansökan Nu
                </button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle2 size={60} className="text-emerald-500 mx-auto mb-4" />
                <h4 className="text-xl font-black uppercase italic text-slate-900 dark:text-white mb-2">
                  Ansökan Skickad!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
                  Åkeriet har tagit emot din ansökan och återkommer direkt till din telefon eller e-post.
                </p>
                <button
                  onClick={() => setSelectedJobForApplication(null)}
                  className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Stäng
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
}