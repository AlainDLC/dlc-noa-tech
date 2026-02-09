"use client";
import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { supabase } from "../../../../lib/supabase";
import { useParams } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Calendar,
  ArrowLeft,
  Trash2,
  Wallet,
  X,
  ArrowUpRight,
  Zap,
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
  const [myBookings, setMyBookings] = useState([]);

  // State för ny kurs
  const [newCourse, setNewCourse] = useState({
    name: "",
    date: "",
    slots: 15,
    price: 9500, // Standardpris
    campaign_label: "",
  });

  // 1. HÄMTA DATA
  const getData = async () => {
    try {
      setLoading(true);

      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          partnerId,
        );
      let query = supabase.from("partners").select("*");
      if (isUUID) {
        query = query.eq("id", partnerId);
      } else {
        query = query.eq("slug", partnerId);
      }

      const { data: school, error: schoolError } = await query.single();
      if (schoolError) throw schoolError;
      setCurrentSchool(school);

      // HÄMTA KURSER
      const { data: courses } = await supabase
        .from("courses")
        .select("*")
        .eq("partner_id", school.id);
      setMyCourses(courses || []);

      // HÄMTA RIKTIGA BOKNINGAR för denna skola
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .eq("partner_id", school.id)
        .eq("status", "Completed"); // Vi räknar bara de som är betalda

      if (bookingsError) throw bookingsError;
      setMyBookings(bookings || []);
    } catch (err) {
      console.error("Fel vid hämtning:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (partnerId) getData();
  }, [partnerId]);

  // 3. RIKTIG EKONOMI-LOGIK (Ingen "* 3" längre!)
  const COMMISSION_RATE = 0.15;

  // Vi räknar summan av alla faktiska bokningar i 'myBookings'
  const totalGross = myBookings.reduce((sum, booking) => {
    const val = booking.amount || booking.price_at_purchase || 0;
    return sum + Number(val);
  }, 0);

  const platformFee = totalGross * COMMISSION_RATE;
  const myEarnings = totalGross - platformFee;

  // 2. FUNKTIONER
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    console.log("Försöker publicera kurs för:", currentSchool.name);

    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([
          {
            ...newCourse,
            price: Number(newCourse.price),
            partner_id: currentSchool.id, // Detta MÅSTE vara UUID
            city: currentSchool.city || "",
            address: currentSchool.address || "",
            lat: currentSchool.lat || 0,
            lng: currentSchool.lng || 0,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase vägrade skapa kursen:", error.message);
        alert("Kunde inte publicera: " + error.message);
        return;
      }

      if (data && data.length > 0) {
        console.log("Kurs skapad framgångsrikt!");
        setMyCourses([...myCourses, data[0]]);
        setIsModalOpen(false);
        setNewCourse({
          name: "",
          date: "",
          slots: 15,
          price: 9500,
          campaign_label: "",
        });
      }
    } catch (err) {
      console.error("Oväntat fel vid publicering:", err);
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

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Är du säker på att du vill ta bort denna kursstart?"))
      return;

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (!error) {
      setMyCourses(myCourses.filter((c) => c.id !== courseId));
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black italic uppercase text-slate-400 animate-pulse">
        Ansluter till Hubben...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 sticky top-0 h-screen">
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

        {/* UTLoggning - Längst ner i sidebaren */}
        <div className="mt-auto pt-6 border-t border-slate-100 px-2 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-900 leading-none">
              Inloggad som
            </span>
            <span className="text-[10px] text-slate-400 truncate w-32">
              {currentSchool?.name || "Partner"}
            </span>
          </div>
        </div>
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
              <div className="flex gap-4 text-[10px] font-black uppercase text-slate-400 tracking-widest items-center">
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                  Verifierad Partner
                </span>
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
              <ListingTable courses={myCourses} onDelete={handleDeleteCourse} />
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <ScheduleTable
                courses={myCourses}
                onUpdate={handleUpdateSlots}
                onDelete={handleDeleteCourse}
              />
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
              {/* KURSNAMN */}
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
                {/* PRIS */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Pris (SEK)
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-500"
                      value={newCourse.price}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, price: e.target.value })
                      }
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300">
                      kr
                    </span>
                  </div>
                </div>

                {/* DATUM */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Datum
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-500"
                    value={newCourse.date}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* PLATSER */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Antal Platser
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-500"
                    value={newCourse.slots}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, slots: e.target.value })
                    }
                  />
                </div>

                {/* KAMPANJ */}
                <div>
                  <label className="text-[10px] font-black uppercase text-emerald-600 ml-1 flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> Kampanj (Valfritt)
                  </label>
                  <input
                    placeholder="T.ex. Fika ingår"
                    className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-4 font-bold text-emerald-900 outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-200"
                    value={newCourse.campaign_label}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        campaign_label: e.target.value,
                      })
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

function ListingTable({ courses, onDelete }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
        <tr>
          <th className="p-6">Kurstyp</th>
          <th className="p-6 text-center">Pris</th>
          <th className="p-6 text-center">Datum</th>
          <th className="p-6 text-right">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {courses.map((c) => (
          <tr key={c.id} className="hover:bg-slate-50 transition-colors">
            <td className="p-6">
              <div className="flex flex-col gap-1">
                <span className="font-black text-sm uppercase italic text-slate-900">
                  {c.name}
                </span>
                {c.campaign_label && (
                  <div className="flex items-center gap-1">
                    <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Zap size={8} fill="currentColor" />
                      <span className="text-[8px] font-black uppercase tracking-wider">
                        {c.campaign_label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </td>
            <td className="p-6 text-center text-xs font-black text-slate-900">
              {c.price?.toLocaleString()} kr
            </td>
            <td className="p-6 text-center text-xs font-bold text-slate-500">
              {c.date}
            </td>
            <td className="p-6 text-right">
              <div className="flex items-center justify-end gap-4">
                <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase">
                  Publicerad
                </span>
                <button
                  onClick={() => onDelete(c.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ScheduleTable({ courses, onUpdate, onDelete }) {
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
                <button
                  onClick={() => onDelete(c.id)}
                  className="ml-4 p-3 text-slate-300 hover:text-red-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
