"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useParams } from "next/navigation";
import { useData } from "../../context/DataContext";
import {
  LayoutDashboard,
  Plus,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Edit3,
  Trash2,
  ScanQrCode,
  MapPin,
  Globe,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function PartnerDashboard() {
  // 1. STATES & CONTEXT
  const { deleteSchool, updateSlots, bookings = [] } = useData();
  const { partnerId } = useParams();

  const [view, setView] = useState("listings");
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [currentSchool, setCurrentSchool] = useState(null);

  // 2. HÄMTA DATA FRÅN SUPABASE (Baserat på slug i URL)
  useEffect(() => {
    async function getSchoolData() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("partners")
          .select("*")
          .eq("slug", partnerId)
          .single();

        if (error) {
          console.error("Fel vid hämtning:", error.message);
        } else {
          setCurrentSchool(data);
        }
      } catch (err) {
        console.error("Oväntat fel:", err);
      } finally {
        setLoading(false);
      }
    }

    if (partnerId) {
      getSchoolData();
    }
  }, [partnerId]);

  // 3. LOGIK FÖR ATT HANTERA DATA (Viktigt för att tabellerna ska funka)
  if (loading)
    return (
      <div className="p-20 font-black uppercase italic text-center text-slate-400 animate-pulse">
        Laddar Hubben...
      </div>
    );

  // Vi mappar om currentSchool till en array så att tabellerna kan loopa som vanligt
  const mySchools = currentSchool ? [currentSchool] : [];

  // Ekonomi-logik
  const myBookings = bookings.filter((b) => b.schoolId === partnerId);
  const COMMISSION_RATE = 0.15;
  const totalGross = myBookings.reduce(
    (sum, b) => sum + (Number(b.amount) || 5000),
    0,
  );
  const platformFee = totalGross * COMMISSION_RATE;
  const myEarnings = totalGross - platformFee;

  const handleDelete = (id, name) => {
    if (window.confirm(`Är du säker på att du vill ta bort ${name}?`)) {
      deleteSchool(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2 text-blue-600">
          <LayoutDashboard size={24} strokeWidth={3} />
          <span className="font-black italic tracking-tighter text-slate-900 uppercase">
            Partner Hub
          </span>
        </div>

        <nav className="space-y-1 flex-1">
          <button onClick={() => setView("listings")} className="w-full">
            <NavItem
              icon={<LayoutDashboard size={18} />}
              label="Mina Kurser"
              active={view === "listings"}
            />
          </button>
          <button onClick={() => setView("bookings")} className="w-full">
            <NavItem
              icon={<Users size={18} />}
              label="Elevbokningar"
              active={view === "bookings"}
            />
          </button>
          <button onClick={() => setView("schedule")} className="w-full">
            <NavItem
              icon={<Calendar size={18} />}
              label="Hantera Platser"
              active={view === "schedule"}
            />
          </button>
          <button onClick={() => setView("finance")} className="w-full">
            <NavItem
              icon={<Wallet size={18} />}
              label="Ekonomi & Utbet"
              active={view === "finance"}
            />
          </button>
        </nav>

        <Link href={`/partner/${partnerId}/scanner`} className="mt-4">
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-slate-900 text-white hover:bg-blue-600 transition-all cursor-pointer group text-center">
            <ScanQrCode size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Öppna Scanner
            </span>
          </div>
        </Link>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10">
        <div className="max-w-5xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] mb-4"
              >
                <ArrowLeft size={14} /> Sajten
              </Link>
              <h1 className="text-5xl font-[1000] text-slate-900 tracking-tighter uppercase italic leading-[0.8] mb-4">
                {currentSchool?.name || "Skola saknas"}
              </h1>
              <div className="flex gap-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                <span className="flex items-center gap-1 text-blue-600">
                  <Globe size={12} /> {partnerId}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {currentSchool?.city || "Sverige"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setView("listings")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl shadow-blue-200 transition-all"
            >
              <Plus size={20} strokeWidth={3} /> Ny Kurs
            </button>
          </div>

          {/* DYNAMISKA VYER */}
          {view === "finance" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-10 rounded-[2.5rem] border-2 border-emerald-500 shadow-xl shadow-emerald-50/50">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2 text-center">
                    Ditt Saldo (Netto)
                  </p>
                  <p className="text-6xl font-[1000] text-slate-900 italic uppercase tracking-tighter text-center">
                    {myEarnings.toLocaleString()} kr
                  </p>
                  <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between text-[9px] font-black uppercase text-slate-400">
                    <span>Brutto: {totalGross.toLocaleString()} kr</span>
                    <span className="text-red-400">
                      Avgift (15%): -{platformFee.toLocaleString()} kr
                    </span>
                  </div>
                </div>
                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col justify-center text-center">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">
                    Nästa Utbetalning
                  </p>
                  <p className="text-3xl font-black italic uppercase mb-6 underline decoration-blue-500 underline-offset-8">
                    25 Mars 2026
                  </p>
                  <button className="flex items-center justify-center gap-2 bg-blue-600 w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">
                    Begär Express <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                  label="Aktiva Kurser"
                  value={mySchools.length}
                  change="Live"
                  icon={<CheckCircle2 className="text-emerald-500" />}
                />
                <StatCard
                  label="Elevbokningar"
                  value={myBookings.length}
                  change="Totalt"
                  icon={<Users className="text-blue-500" />}
                />
                <StatCard
                  label="Intjänat"
                  value={myEarnings.toLocaleString() + " kr"}
                  color="text-emerald-500"
                  icon={<Wallet className="text-blue-500" />}
                />
              </div>

              {/* LISTINGS / BOOKINGS / SCHEDULE */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {view === "listings" && (
                  <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                      <h3 className="font-[1000] uppercase italic text-slate-900 tracking-tighter text-xl">
                        Dina Publicerade Kurser
                      </h3>
                      <button
                        onClick={() => setIsAdding(true)}
                        className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-6 py-4 rounded-2xl hover:bg-slate-900 transition-all shadow-lg"
                      >
                        + Lägg till kursstart
                      </button>
                    </div>
                    <ListingTable
                      schools={mySchools}
                      handleDelete={handleDelete}
                    />
                  </div>
                )}

                {view === "bookings" && <BookingTable bookings={myBookings} />}

                {view === "schedule" && (
                  <ScheduleTable
                    schools={mySchools}
                    updateSlots={updateSlots}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// --- UNDERKOMPONENTER ---

function ListingTable({ schools, handleDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100 uppercase text-[10px] font-black text-slate-400 tracking-wider">
            <th className="p-6">Utbildningstyp</th>
            <th className="p-6">Stad</th>
            <th className="p-6">Status</th>
            <th className="p-6 text-right">Admin</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {schools.map((school) => (
            <tr
              key={school.id}
              className="hover:bg-slate-50/80 transition-colors group"
            >
              <td className="p-6">
                <div className="font-black text-slate-900 text-sm uppercase italic">
                  {school.name}
                </div>
                <div className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">
                  ID: {school.id?.slice(0, 8)}
                </div>
              </td>
              <td className="p-6 text-xs font-black text-slate-600 uppercase italic">
                {school.city}
              </td>
              <td className="p-6">
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-widest">
                  Aktiv
                </span>
              </td>
              <td className="p-6 text-right">
                <div className="flex justify-end gap-2">
                  <button className="p-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 rounded-xl transition-all">
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(school.id, school.name)}
                    className="p-3 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BookingTable({ bookings }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
      {bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 tracking-widest">
                <th className="p-6">Elev & Kontakt</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-right">Åtgärd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6">
                    <div className="font-black text-slate-900 uppercase italic leading-none mb-1">
                      {booking.email}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      Kurs: {booking.courseName || "YKB"}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border-2 bg-emerald-50 text-emerald-600 border-emerald-100">
                      ✓ Betald
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                      <Wallet size={12} /> Kvitto
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-20 text-center text-slate-300 font-black uppercase text-xs tracking-[0.3em]">
          Inga inkomna bokningar ännu
        </div>
      )}
    </div>
  );
}

function ScheduleTable({ schools, updateSlots }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 tracking-widest">
              <th className="p-6">Kurs</th>
              <th className="p-6 text-center">Platser kvar</th>
              <th className="p-6 text-right">Justera</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schools.map((school) => (
              <tr
                key={school.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="p-6 font-black text-sm uppercase italic">
                  {school.name}
                </td>
                <td className="p-6 text-center">
                  <span className="font-black text-sm px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600">
                    12 st
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => updateSlots(school.id, 0, -1)}
                      className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-red-500 hover:text-white rounded-xl font-black transition-all"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateSlots(school.id, 0, 1)}
                      className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-xl font-black transition-all"
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-4 rounded-2xl cursor-pointer transition-all ${active ? "bg-blue-600 text-white shadow-lg scale-[1.02]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

function StatCard({ label, value, change, icon, color = "text-slate-900" }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-tighter">
          {change}
        </span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p
        className={`text-4xl font-[1000] tracking-tighter italic uppercase ${color}`}
      >
        {value}
      </p>
    </div>
  );
}
