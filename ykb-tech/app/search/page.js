"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase"; // Se till att sökvägen stämmer
import BookingModal from "../admin/components/BookingModal";
import {
  Search as SearchIcon,
  MapPin,
  Calendar,
  ChevronRight,
  Truck,
  Clock,
  ArrowLeft,
  MapIcon,
  List,
} from "lucide-react";

const Map = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse rounded-[3rem]" />
  ),
});

export default function SearchPage() {
  // --- LIVE DATA STATES ---
  const [schools, setSchools] = useState([]);
  const [activeSchool, setActiveSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedSchoolForBooking, setSelectedSchoolForBooking] =
    useState(null);

  // 1. HÄMTA DATA FRÅN SUPABASE (Kopplingen till Dashboarden)
  useEffect(() => {
    async function fetchLiveMarketplace() {
      setLoading(true);
      // Vi hämtar partners och deras kurser.
      // Eftersom adressen är STATISK på partnern, hämtar vi den härifrån.
      const { data, error } = await supabase.from("partners").select(`
        id, 
        name, 
        city, 
        address, 
        lat, 
        lng, 
        slug,
        courses (*) 
      `);

      if (!error && data) {
        const formattedData = data.map((school) => ({
          ...school,
          // Vi mappar in kurserna under skolan
          schedule: school.courses.map((c) => ({
            date: c.date,
            label: c.name,
            slots: c.slots,
            price: c.price || 5000,
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
      <nav className="h-20 bg-white border-b flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="text-white" size={18} />
            </div>
            <span className="font-black italic tracking-tighter text-slate-900 uppercase">
              YKB CENTRALEN
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
              onClick={() => {
                if (activeSchool?.id !== school.id) {
                  setActiveSchool(school);
                  setIsExpanded(false);
                }
              }}
              className={`group cursor-pointer bg-white rounded-3xl md:rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${
                activeSchool?.id === school.id
                  ? "border-blue-600 shadow-2xl scale-[1.01]"
                  : "border-transparent shadow-sm hover:border-slate-200"
              }`}
            >
              <div className="p-5 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                  <div>
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

                {/* KOMMANDE STARTER (Från Dashboarden) */}
                <div className="space-y-3 mb-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Clock size={12} /> Tillgängliga datum
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {school.schedule?.length > 0 ? (
                      school.schedule.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
                        >
                          <Calendar size={14} className="text-blue-600" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-900 uppercase">
                              {item.date}
                            </span>
                            <span className="text-[9px] font-bold text-blue-600 uppercase">
                              {item.label}
                            </span>
                            <span
                              className={`text-[8px] font-black uppercase ${item.slots < 5 ? "text-red-500" : "text-slate-400"}`}
                            >
                              {item.slots} platser kvar
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-[10px] font-black text-slate-400 uppercase italic">
                        Inga inplanerade starter just nu
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t pt-6 mt-4">
                  <button className="text-[9px] font-black uppercase text-blue-600 hover:underline">
                    Mer info
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSchoolForBooking(school);
                    }}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.15em] flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg"
                  >
                    Boka plats <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* KARTA */}
        <div
          className={`lg:block lg:relative ${showMap ? "fixed inset-0 pt-20 z-40 bg-white" : "hidden"}`}
        >
          <div className="h-full w-full lg:h-[700px] lg:sticky lg:top-32 overflow-hidden lg:rounded-[3rem] lg:border-[10px] lg:border-white lg:shadow-2xl">
            <Map schools={filteredSchools} activeSchool={activeSchool} />
          </div>
        </div>

        {/* MOBILKNAPP */}
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
