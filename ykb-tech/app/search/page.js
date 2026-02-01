"use client";
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic"; // Behövs för att ladda kartan rätt
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

// Vi laddar kartan dynamiskt så att Next.js inte kraschar
const Map = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 flex items-center justify-center">
      <p className="font-black italic uppercase text-slate-400 animate-pulse">
        Kartan laddas...
      </p>
    </div>
  ),
});

export default function SearchPage() {
  const { schools } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSchools = schools.filter(
    (school) =>
      school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* NAVBAR */}
      <nav className="h-20 bg-white border-b flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3d081b] rounded-lg flex items-center justify-center shadow-md">
              <Truck className="text-white" size={18} />
            </div>
            <span className="font-black italic tracking-tighter text-[#3d081b] uppercase">
              Körkortsutbildarna
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
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-[#3d081b] outline-none font-bold text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        {/* LISTA MED RESULTAT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
                Tillgängliga <br /> Utbildningar
              </h1>
              <p className="text-slate-500 font-medium mt-2">
                Visar {filteredSchools.length} utbildare just nu
              </p>
            </div>
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={14} /> Filter
            </button>
          </div>

          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="group bg-white rounded-[2.5rem] p-2 border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#3d081b]/20 transition-all"
            >
              <div className="flex flex-col md:flex-row gap-6 p-6">
                {/* INFO */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                          Auktoriserad
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                          <Star size={12} fill="currentColor" />
                          <span className="text-[10px] font-black">
                            {school.rating}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">
                        {school.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        Pris från
                      </p>
                      <p className="text-2xl font-black text-[#3d081b] italic tracking-tighter">
                        {school.price}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={16} className="text-[#3d081b]" />
                      <span className="text-sm font-bold">{school.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={16} className="text-[#3d081b]" />
                      <span className="text-sm font-bold">
                        Start: {school.nextStart || "Snarast"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {school.courses?.map((course, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                {/* BOKA KNAPP */}
                <div className="md:w-48 flex items-stretch">
                  <button className="w-full bg-slate-900 text-white rounded-[1.8rem] font-black uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-2 group-hover:bg-[#3d081b] transition-all p-6">
                    Boka Nu
                    <ChevronRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredSchools.length === 0 && (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest">
                Inga skolor hittades
              </p>
            </div>
          )}
        </div>

        {/* KARTA (DIN RIKTIGA KARTA) */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-[2.5rem] h-[600px] sticky top-32 overflow-hidden border-4 border-white shadow-2xl relative z-10">
            <Map schools={filteredSchools} />
          </div>
        </div>
      </main>
    </div>
  );
}
