"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useMarketplace } from "../hooks/useMarketplace";
import Navbar from "../components/Navbar";
import SchoolCard from "../components/SchoolCard";
import BookingModal from "../api/admin/components/BookingModal";
import Footer from "../components/Footer";
import { List, MapIcon, ArrowLeft } from "lucide-react";

const Map = dynamic(() => import("./MapComponent"), { ssr: false });

export default function SearchPage() {
  const { schools, loading } = useMarketplace();
  const [activeSchool, setActiveSchool] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedSchoolForBooking, setSelectedSchoolForBooking] =
    useState(null);

  const filteredSchools = useMemo(() => {
    return schools.filter(
      (s) =>
        s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [schools, searchTerm]);

  if (loading)
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full text-[10px] font-[1000] uppercase tracking-[0.2em] text-white italic shadow-2xl">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
          INITIERAR MARKETPLACE ENGINE...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 flex flex-col">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-12 flex-grow w-full">
        <div className="lg:col-span-2 space-y-10">
          {/* HEADER MED DIN DASHBOARD-STIL */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[9px] font-[1000] uppercase tracking-widest text-slate-500 italic mb-4">
              SEARCH MODULE // READY
            </div>
            <h1 className="text-5xl md:text-7xl font-[1000] tracking-[-0.06em] uppercase italic text-slate-900 leading-[0.85]">
              {activeSchool ? "DETALJER" : "TILLGÄNGLIGA "}
              <span className="bg-gradient-to-r from-blue-600 via-green-500 to-green-800 bg-clip-text text-transparent block">
                {activeSchool ? activeSchool.name : "YKB KURSER"}
              </span>
            </h1>

            {activeSchool && (
              <button
                onClick={() => {
                  setActiveSchool(null);
                  setIsExpanded(false);
                }}
                className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 italic hover:translate-x-[-4px] transition-transform"
              >
                <ArrowLeft size={14} /> // ÅTERGÅ TILL LISTAN
              </button>
            )}
          </div>

          {/* LISTAN */}
          <div className="space-y-8">
            {(activeSchool ? [activeSchool] : filteredSchools).map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                isActive={activeSchool?.id === school.id}
                isExpanded={isExpanded}
                onSelect={() => setActiveSchool(school)}
                onToggleExpand={(e) => {
                  e.stopPropagation();
                  setActiveSchool(school);
                  setIsExpanded(!isExpanded);
                }}
                onBook={(e) => {
                  e.stopPropagation();
                  setSelectedSchoolForBooking(school);
                }}
              />
            ))}
          </div>
        </div>

        {/* KARTA */}
        <aside
          className={`${showMap ? "fixed inset-0 z-[60] bg-white" : "hidden lg:block"} lg:relative`}
        >
          <div className="h-full w-full lg:h-[750px] lg:sticky lg:top-32 overflow-hidden lg:rounded-[3rem] border-[1px] border-slate-100 shadow-2xl relative">
            <div className="absolute top-6 left-6 z-10 bg-slate-900 text-white px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest italic shadow-xl">
              GEO_LOC ENGINE // ACTIVE
            </div>
            <Map schools={filteredSchools} activeSchool={activeSchool} />
          </div>
        </aside>
      </main>

      <Footer />

      {/* MOBILKNAPP KARTA */}
      <button
        onClick={() => setShowMap(!showMap)}
        className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-[0.2em] shadow-2xl flex items-center gap-3 italic"
      >
        {showMap ? <List size={18} /> : <MapIcon size={18} />}
        {showMap ? "// VISA LISTA" : "// VISA KARTA"}
      </button>

      {selectedSchoolForBooking && (
        <BookingModal
          school={selectedSchoolForBooking}
          onClose={() => setSelectedSchoolForBooking(null)}
        />
      )}
    </div>
  );
}
