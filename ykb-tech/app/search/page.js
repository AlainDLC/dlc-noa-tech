"use client";
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useData } from "../context/DataContext";
import {
  Search as SearchIcon,
  MapPin,
  Star,
  Calendar,
  ChevronRight,
  Truck,
  Filter,
} from "lucide-react";

// Laddar kartan dynamiskt
const Map = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse" />,
});

export default function SearchPage() {
  // 1. Hämta både skolor och funktionen för att sätta aktiv skola
  const { schools, activeSchool, setActiveSchool } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSchools = schools.filter(
    (school) =>
      school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
              YKB MARKET
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
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
                Resultat
              </h1>
              <p className="text-slate-500 font-medium">
                Klicka på en skola för att se den på kartan
              </p>
            </div>
          </div>

          {filteredSchools.map((school) => (
            <div
              key={school.id}
              // 2. HÄR HÄNDER MAGIN: När man klickar på kortet sätts den som aktiv
              onClick={() => setActiveSchool(school)}
              className={`group cursor-pointer bg-white rounded-[2.5rem] p-2 border-2 transition-all ${
                activeSchool?.id === school.id
                  ? "border-blue-600 shadow-xl"
                  : "border-transparent shadow-sm hover:border-slate-200"
              }`}
            >
              <div className="flex flex-col md:flex-row gap-6 p-6">
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">
                        {school.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin size={14} className="text-blue-600" />
                        <span className="text-sm font-bold text-slate-500">
                          {school.city}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-600 italic tracking-tighter">
                        {school.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {school.courses?.map((course, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:w-48 flex items-stretch">
                  <button className="w-full bg-slate-900 text-white rounded-[1.8rem] font-black uppercase text-xs flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-all">
                    Välj skola <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="bg-white rounded-[2.5rem] h-[600px] sticky top-32 overflow-hidden border-4 border-white shadow-2xl">
            {/* 3. Skicka med activeSchool till kartan */}
            <Map schools={filteredSchools} activeSchool={activeSchool} />
          </div>
        </div>
      </main>
    </div>
  );
}
