"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useParams } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Users,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Trash2,
  MapPin,
  Globe,
  Wallet,
  X,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function PartnerDashboard() {
  const { partnerId } = useParams();

  // States
  const [view, setView] = useState("listings");
  const [loading, setLoading] = useState(true);
  const [currentSchool, setCurrentSchool] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State för ny kurs
  const [newCourse, setNewCourse] = useState({
    name: "",
    date: "",
    slots: 15,
    price: 5000,
  });

  // 1. HÄMTA DATA
  const getData = async () => {
    try {
      setLoading(true);
      const { data: school, error: schoolError } = await supabase
        .from("partners")
        .select("*")
        .eq("slug", partnerId)
        .single();

      if (schoolError) throw schoolError;
      setCurrentSchool(school);

      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .eq("partner_id", school.id)
        .order("date", { ascending: true });

      if (coursesError) throw coursesError;
      setMyCourses(courses);
    } catch (err) {
      console.error("Fel:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (partnerId) getData();
  }, [partnerId]);

  // EKONOMI-LOGIK (Baserad på kurser och platser för demo)
  const COMMISSION_RATE = 0.15;
  const estimatedBookings = myCourses.length * 3; // Demo-siffra
  const totalGross = estimatedBookings * 5000;
  const platformFee = totalGross * COMMISSION_RATE;
  const myEarnings = totalGross - platformFee;

  // 2. FUNKTIONER
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          ...newCourse,
          partner_id: currentSchool.id,
          city: currentSchool.city,
          // HÄR KOPPLAR VI ADRESS OCH KOORDINATER FRÅN SKOLANS REGISTER
          address: currentSchool.address,
          lat: currentSchool.lat,
          lng: currentSchool.lng,
        },
      ])
      .select();

    if (!error) {
      setMyCourses([...myCourses, data[0]]);
      setIsModalOpen(false);
      setNewCourse({ name: "", date: "", slots: 15, price: 5000 });
    }
  };

  const handleUpdateSlots = async (courseId, currentSlots, change) => {
    const newSlots = Math.max(0, currentSlots + change);
    setMyCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, slots: newSlots } : c)),
    );
    await supabase
      .from("courses")
      .update({ slots: newSlots })
      .eq("id", courseId);
  };

  if (loading)
    return (
      <div className="p-20 font-black text-center animate-pulse text-slate-400">
        ANSLUTER TILL HUBBEN...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2 text-blue-600">
          <LayoutDashboard size={24} strokeWidth={3} />
          <span className="font-black italic text-slate-900 uppercase">
            Partner Hub
          </span>
        </div>
        <nav className="space-y-1 flex-1">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Mina Kurser"
            active={view === "listings"}
            onClick={() => setView("listings")}
          />
          <NavItem
            icon={<Calendar size={18} />}
            label="Hantera Platser"
            active={view === "schedule"}
            onClick={() => setView("schedule")}
          />
          <NavItem
            icon={<Wallet size={18} />}
            label="Ekonomi & Utbet"
            active={view === "finance"}
            onClick={() => setView("finance")}
          />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <div className="max-w-5xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] mb-4 transition-all"
              >
                <ArrowLeft size={14} /> Sajten
              </Link>
              <h1 className="text-6xl font-[1000] text-slate-900 tracking-tighter uppercase italic leading-none mb-2">
                {currentSchool?.name}
              </h1>
              <div className="flex gap-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <span className="text-blue-600">● {partnerId}</span>
                <span>● {currentSchool?.city}</span>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl shadow-blue-100 hover:-translate-y-1 transition-all"
            >
              <Plus size={20} strokeWidth={4} /> Ny Kursstart
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
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 text-center">
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
          ) : view === "listings" ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <ListingTable courses={myCourses} />
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <ScheduleTable courses={myCourses} onUpdate={handleUpdateSlots} />
            </div>
          )}
        </div>
      </main>

      {/* MODAL FÖR NY KURS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-slate-900">
                Skapa kurs
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Kursnamn
                </label>
                <input
                  required
                  placeholder="YKB Delkurs 1"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Datum
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none"
                    value={newCourse.date}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Platser
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none"
                    value={newCourse.slots}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, slots: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
              >
                Publicera Kursstart
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// HJÄLP-KOMPONENTER
function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]" : "text-slate-500 hover:bg-slate-50"}`}
    >
      {icon}{" "}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </button>
  );
}

function ListingTable({ courses }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
        <tr>
          <th className="p-6">Kurstyp</th>
          <th className="p-6">Datum</th>
          <th className="p-6">Stad</th>
          <th className="p-6 text-right">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {courses.map((c) => (
          <tr key={c.id} className="hover:bg-slate-50 transition-colors">
            <td className="p-6 font-black text-sm uppercase italic">
              {c.name}
            </td>
            <td className="p-6 text-xs font-bold text-slate-500">{c.date}</td>
            <td className="p-6 text-xs font-bold text-slate-500 uppercase">
              {c.city}
            </td>
            <td className="p-6 text-right">
              <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase">
                Publicerad
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ScheduleTable({ courses, onUpdate }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
        <tr>
          <th className="p-6">Kursnamn</th>
          <th className="p-6 text-center">Lagersaldo</th>
          <th className="p-6 text-right">Hantera</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {courses.map((c) => (
          <tr key={c.id}>
            <td className="p-6 font-black text-sm uppercase italic">
              {c.name}
            </td>
            <td className="p-6 text-center">
              <span
                className={`px-4 py-2 rounded-xl text-[10px] font-black ${c.slots > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600"}`}
              >
                {c.slots} PLATSER
              </span>
            </td>
            <td className="p-6 text-right">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onUpdate(c.id, c.slots, -1)}
                  className="w-10 h-10 bg-slate-100 rounded-xl font-black hover:bg-red-500 hover:text-white transition-all"
                >
                  -
                </button>
                <button
                  onClick={() => onUpdate(c.id, c.slots, 1)}
                  className="w-10 h-10 bg-slate-100 rounded-xl font-black hover:bg-emerald-500 hover:text-white transition-all"
                >
                  +
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
