"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";
import BookingModal from "../../app/api/admin/components/BookingModal";
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
  Info,
  Loader2,
} from "lucide-react";
import Image from "next/image";

const Map = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse rounded-[3rem] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" />
    </div>
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
      {/* --- NAVBAR --- */}
      <nav className="h-20 bg-white border-b flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Image alt="loga" src="/loga.png" width={160} height={160} />
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
              placeholder="Sök stad..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid lg:grid-cols-3 gap-8">
        {/* --- LISTA: Döljs på mobil om showMap är true --- */}
        <div
          className={`lg:col-span-2 space-y-6 ${showMap ? "hidden lg:block" : "block"}`}
        >
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
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm text-[10px] font-black uppercase text-blue-600 border border-blue-50"
              >
                <ArrowLeft size={12} /> <span>Visa alla</span>
              </button>
            )}
          </div>

          {(activeSchool ? [activeSchool] : filteredSchools).map((school) => (
            <div
              key={school.id}
              className={`bg-white rounded-[2.5rem] border-2 transition-all p-6 ${activeSchool?.id === school.id ? "border-blue-600 shadow-xl" : "border-transparent shadow-sm"}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  onClick={() => setActiveSchool(school)}
                  className="cursor-pointer"
                >
                  <h3 className="font-black italic tracking-tighter uppercase text-slate-900 text-2xl">
                    {school.name}
                  </h3>
                  <div className="flex items-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <MapPin size={14} className="text-blue-600 mr-1" />{" "}
                    {school.city}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-blue-600 italic">
                    {school.schedule?.[0]?.price || 4995} kr
                  </p>
                </div>
              </div>

              {activeSchool?.id === school.id && isExpanded && (
                <div className="mb-6 p-4 bg-blue-50 rounded-2xl text-xs font-bold uppercase text-slate-600">
                  {school.description || "Ingen beskrivning."}
                </div>
              )}

              <div className="flex justify-between items-center border-t pt-4">
                <button
                  onClick={() => {
                    setActiveSchool(school);
                    setIsExpanded(!isExpanded);
                  }}
                  className="text-[10px] font-black uppercase text-blue-600"
                >
                  Info
                </button>
                <button
                  onClick={() => setSelectedSchoolForBooking(school)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg"
                >
                  Boka plats
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- KARTA: Tar hela skärmen på mobil när showMap är true --- */}
        <div
          className={`
          ${showMap ? "fixed inset-0 z-40 bg-white pt-20 lg:pt-0 lg:relative lg:inset-auto lg:h-[700px] lg:block" : "hidden lg:block lg:h-[700px] lg:sticky lg:top-32"}
          lg:rounded-[3rem] lg:border-[10px] lg:border-white lg:shadow-2xl overflow-hidden flex-grow
        `}
        >
          <div className="w-full h-full">
            <Map
              schools={filteredSchools}
              activeSchool={activeSchool}
              showMap={showMap}
            />
          </div>
        </div>

        {/* --- MOBILKNAPP --- */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3"
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
