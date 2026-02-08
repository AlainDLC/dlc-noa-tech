// components/PartnersView.js
import React, { useState } from "react";
import {
  Plus,
  Search,
  Building2,
  MapPin,
  Trash2,
  ArrowLeft,
  Calendar,
  Users,
} from "lucide-react";

export default function PartnersView({
  schools,
  bookings,
  deleteSchool,
  openAddModal,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // OM EN PARTNER ÄR VALD - VISA DETALJVY
  if (selectedPartner) {
    const partnerBookings = bookings.filter(
      (b) => b.schoolId === selectedPartner.id,
    );

    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-300">
        <button
          onClick={() => setSelectedPartner(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] tracking-widest transition-colors"
        >
          <ArrowLeft size={14} /> Tillbaka till listan
        </button>

        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">
              {selectedPartner.name}
            </h2>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">
              {selectedPartner.city}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center min-w-[120px]">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                Total Volym
              </p>
              <p className="font-black text-xl">
                {(partnerBookings.length * 5000).toLocaleString()} kr
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* HÄR KAN DU LISTA DERAS KURSER ELLER SPECIFIKA ELEVER */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8">
            <h3 className="font-black uppercase italic mb-6 flex items-center gap-2 text-lg">
              <Users size={20} className="text-blue-600" /> Elever hos skolan
            </h3>
            <div className="space-y-4">
              {partnerBookings.map((b, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 bg-slate-50 rounded-xl"
                >
                  <span className="font-bold text-sm uppercase">{b.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {b.date}
                  </span>
                </div>
              ))}
              {partnerBookings.length === 0 && (
                <p className="text-slate-400 italic text-sm text-center py-10">
                  Inga bokningar ännu.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STANDARDVY: LISTAN MED ALLA PARTNERS
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            Partner <span className="text-blue-600">Directory</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            Klicka på en partner för att se detaljer
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-900 transition-all flex items-center gap-2 shadow-xl"
        >
          <Plus size={16} /> Ny partner
        </button>
      </div>

      <div className="relative group">
        <Search
          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Sök på skola..."
          className="w-full bg-white border border-slate-200 p-6 pl-16 rounded-[2rem] outline-none font-bold"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <div
            key={school.id}
            onClick={() => setSelectedPartner(school)}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:border-blue-600 transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Building2 size={24} />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSchool(school.id);
                }}
                className="p-2 text-slate-200 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">
              {school.name}
            </h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              {school.city}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
