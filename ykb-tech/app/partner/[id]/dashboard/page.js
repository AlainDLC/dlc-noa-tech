"use client";
import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Calendar,
  ArrowLeft,
  Trash2,
  Wallet,
  X,
  Loader2,
  Edit3,
  Zap, // Importerad Zap för kampanjer
} from "lucide-react";
import Link from "next/link";

export default function PartnerDashboard() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [editingCourse, setEditingCourse] = useState(null);

  const [view, setView] = useState("listings");
  const [loading, setLoading] = useState(true);
  const [currentSchool, setCurrentSchool] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newCourse, setNewCourse] = useState({
    name: "",
    date: "",
    slots: 15,
    price: 9500,
    campaign_label: "", // Lagt till i state
  });

  const handleEditCourse = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("courses")
      .update({
        name: editingCourse.name,
        price: Number(editingCourse.price),
        date: editingCourse.date,
        slots: Number(editingCourse.slots),
        campaign_label: editingCourse.campaign_label, // Uppdatera kampanj
      })
      .eq("id", editingCourse.id);

    if (!error) {
      setMyCourses(
        myCourses.map((c) => (c.id === editingCourse.id ? editingCourse : c)),
      );
      setEditingCourse(null);
    }
  };

  const getData = async () => {
    if (!id || !user) return;

    try {
      setLoading(true);
      const { data: school, error: schoolError } = await supabase
        .from("partners")
        .select("*")
        .eq("slug", id)
        .single();

      if (schoolError || !school) {
        setLoading(false);
        return;
      }

      const hasAccess =
        school.clerk_id === user.id || school.user_id === user.id;

      if (!hasAccess) {
        setLoading(false);
        return;
      }

      setCurrentSchool(school);

      const [coursesRes, bookingsRes] = await Promise.all([
        supabase.from("courses").select("*").eq("partner_id", school.id),
        supabase
          .from("bookings")
          .select("*")
          .eq("partner_id", school.id)
          .in("status", ["paid", "Completed"]),
      ]);

      setMyCourses(coursesRes.data || []);
      setMyBookings(bookingsRes.data || []);
    } catch (err) {
      console.error("Dashboard error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user && id) {
      getData();
    }
  }, [isLoaded, user, id]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/login");
    }
  }, [isLoaded, user, router]);

  const totalGross = myBookings.reduce(
    (sum, b) => sum + Number(b.amount || 0),
    0,
  );

  const totalNet = myBookings.reduce(
    (sum, b) =>
      sum + (Number(b.amount || 0) - Number(b.commission_amount || 0)),
    0,
  );

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!currentSchool) return;

    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          ...newCourse,
          price: Number(newCourse.price),
          partner_id: currentSchool.id,
          city: currentSchool.city,
          address: currentSchool.address,
        },
      ])
      .select();

    if (!error && data) {
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
    if (!confirm("Vill du radera denna kursstart?")) return;
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);
    if (!error) setMyCourses(myCourses.filter((c) => c.id !== courseId));
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      </div>
    );
  }

  if (!currentSchool) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-900">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2 text-blue-600">
          <LayoutDashboard size={24} strokeWidth={3} />
          <span className="font-black italic uppercase tracking-tighter">
            Partner Hub
          </span>
        </div>
        <nav className="space-y-1 flex-1">
          <button
            onClick={() => setView("listings")}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${view === "listings" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <LayoutDashboard size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Mina Kurser
            </span>
          </button>
          <button
            onClick={() => setView("schedule")}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${view === "schedule" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <Calendar size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Hantera Platser
            </span>
          </button>
          <button
            onClick={() => setView("finance")}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${view === "finance" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <Wallet size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Ekonomi
            </span>
          </button>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-100 px-2 flex items-center gap-3 text-slate-900">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase leading-none text-slate-900">
              Inloggad
            </span>
            <span className="text-[10px] text-slate-400 truncate w-32">
              {currentSchool?.name}
            </span>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-10 text-slate-900">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] mb-4 transition-all"
              >
                <ArrowLeft size={14} /> Sajten
              </Link>
              <h1 className="text-6xl font-[1000] tracking-tighter uppercase italic leading-none mb-2 text-slate-900">
                {currentSchool?.name}
              </h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl hover:-translate-y-1 transition-all border-none outline-none"
            >
              <Plus size={20} strokeWidth={4} /> Ny Kursstart
            </button>
          </div>

          {view === "finance" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 text-slate-900">
              <div className="bg-white p-10 rounded-[2.5rem] border-2 border-emerald-500 shadow-xl text-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">
                  Saldo (Netto)
                </p>
                <p className="text-6xl font-[1000] italic uppercase tracking-tighter text-slate-900">
                  {totalNet.toLocaleString()} kr
                </p>
                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between text-[9px] font-black uppercase text-slate-400">
                  <span>Brutto: {totalGross.toLocaleString()} kr</span>
                  <span className="text-blue-500 text-slate-900">
                    Inkl. väntande utbetalningar
                  </span>
                </div>
              </div>
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col justify-center text-center">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">
                  Utbetalning
                </p>
                <p className="text-3xl font-black italic uppercase mb-6 underline decoration-blue-500 underline-offset-8 text-white">
                  Släpps vid incheckning
                </p>
                <button className="bg-blue-600 w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all text-white border-none">
                  Begär Utbetalning
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm text-slate-900">
              {view === "listings" ? (
                <ListingTable
                  courses={myCourses}
                  onDelete={handleDeleteCourse}
                  onEdit={setEditingCourse}
                  bookings={myBookings}
                />
              ) : (
                <ScheduleTable
                  courses={myCourses}
                  onUpdate={handleUpdateSlots}
                  onDelete={handleDeleteCourse}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL SKAPA KURS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl text-slate-900">
            <div className="flex justify-between items-center mb-8 text-slate-900">
              <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-slate-900">
                Skapa kurs
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-red-100 text-slate-900 border-none outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleCreateCourse}
              className="space-y-6 text-slate-900"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 pl-1">
                  Kursnamn
                </label>
                <input
                  required
                  placeholder="t.ex. YKB Delkurs 1"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:border-blue-500"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-slate-900">
                <div className="space-y-1 text-slate-900">
                  <label className="text-[10px] font-black uppercase text-slate-400 pl-1">
                    Pris
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:border-blue-500"
                    value={newCourse.price}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, price: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 pl-1 text-slate-900">
                    Datum
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:border-blue-500"
                    value={newCourse.date}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, date: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* KAMPANJ-FÄLTET */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1 pl-1">
                  <Zap size={10} fill="currentColor" /> Kampanjetikett
                  (Valfritt)
                </label>
                <input
                  placeholder="t.ex. Fika ingår, Sista chansen..."
                  className="w-full bg-slate-50 border-2 border-blue-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:border-emerald-500"
                  value={newCourse.campaign_label}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      campaign_label: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all border-none outline-none"
              >
                Publicera Kursstart
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL REDIGERA KURS --- */}
      {editingCourse && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl text-slate-900">
            <div className="flex justify-between items-center mb-8 text-slate-900">
              <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-slate-900">
                Redigera kurs
              </h2>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-2 bg-slate-100 rounded-full hover:bg-red-100 transition-colors text-slate-900 border-none outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleEditCourse}
              className="space-y-6 text-slate-900"
            >
              <div className="text-slate-900">
                <label className="text-[10px] font-black uppercase mb-2 block text-slate-400">
                  Kursnamn
                </label>
                <input
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:border-blue-500"
                  value={editingCourse.name}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-slate-900">
                <div className="text-slate-900">
                  <label className="text-[10px] font-black uppercase mb-2 block text-slate-400">
                    Pris
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:border-blue-500"
                    value={editingCourse.price}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase mb-2 block text-slate-400 text-slate-900">
                    Platser
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:border-blue-500"
                    value={editingCourse.slots}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        slots: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* KAMPANJ-FÄLTET I REDIGERA */}
              <div className="text-slate-900">
                <label className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1 mb-2">
                  <Zap size={10} fill="currentColor" /> Kampanjetikett
                </label>
                <input
                  className="w-full bg-slate-50 border-2 border-blue-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:border-emerald-500"
                  value={editingCourse.campaign_label || ""}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      campaign_label: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all border-none outline-none"
              >
                Spara Ändringar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ... Tabellkomponenterna ListingTable och ScheduleTable är oförändrade från din kod ...

function ListingTable({ courses, onDelete, onEdit, bookings = [] }) {
  if (courses.length === 0)
    return (
      <div className="p-20 text-center font-black uppercase italic text-slate-300">
        Inga kurser publicerade
      </div>
    );

  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
        <tr>
          <th className="p-6">Kurstyp & Status</th>
          <th className="p-6 text-center">Pris</th>
          <th className="p-6 text-center">Datum</th>
          <th className="p-6 text-right">Åtgärd</th>
        </tr>
      </thead>
      <tbody className="divide-y text-slate-900">
        {courses.map((c) => {
          const courseBookings = bookings.filter(
            (b) => b.course_date === c.date,
          ).length;

          const fillRate =
            c.slots > 0
              ? Math.min(100, Math.round((courseBookings / c.slots) * 100))
              : 0;

          // Dynamisk text baserad på fyllnad
          let statusText = `${fillRate}% FYLLD`;
          if (fillRate === 0) statusText = "LEDIG";
          if (fillRate === 100) statusText = "FULLBOKAD";

          // Färglogik
          let barColor = "bg-blue-500";
          if (fillRate < 30) barColor = "bg-emerald-500";
          if (fillRate > 80) barColor = "bg-red-500";

          return (
            <tr
              key={c.id}
              className="hover:bg-slate-50 transition-colors group"
            >
              <td className="p-6">
                <div className="flex flex-col gap-2">
                  <span className="font-black text-sm uppercase italic">
                    {c.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} transition-all duration-500`}
                        style={{ width: `${Math.max(fillRate, 5)}%` }}
                      />
                    </div>
                    <span
                      className={`text-[9px] font-[1000] uppercase tracking-widest ${fillRate === 0 ? "text-emerald-500" : "text-slate-400"}`}
                    >
                      {statusText}
                    </span>
                  </div>
                </div>
              </td>
              {/* ÅTERSTÄLLDA PRISER OCH DATUM NEDAN */}
              <td className="p-6 text-center text-xs font-black">
                {c.price?.toLocaleString()} kr
              </td>
              <td className="p-6 text-center text-xs font-bold text-slate-500">
                {c.date}
              </td>
              <td className="p-6 text-right">
                <div className="flex justify-end gap-3 text-slate-900">
                  <button
                    onClick={() => onEdit(c)}
                    className="text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ScheduleTable({ courses, onUpdate, onDelete }) {
  if (courses.length === 0)
    return (
      <div className="p-20 text-center font-black uppercase italic text-slate-300">
        Inga kurser att hantera
      </div>
    );
  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
        <tr>
          <th className="p-6">Kursnamn</th>
          <th className="p-6 text-center">Lagersaldo</th>
          <th className="p-6 text-right">Hantera</th>
        </tr>
      </thead>
      <tbody className="divide-y text-slate-900">
        {courses.map((c) => (
          <tr key={c.id}>
            <td className="p-6 font-black text-sm uppercase italic text-slate-900">
              {c.name}
            </td>
            <td className="p-6 text-center text-slate-900">
              <span className="px-4 py-2 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                {c.slots} PLATSER
              </span>
            </td>
            <td className="p-6 text-right text-slate-900">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onUpdate(c.id, c.slots, -1)}
                  className="w-10 h-10 bg-slate-100 rounded-xl font-black hover:bg-red-500 hover:text-white border-none outline-none text-slate-900"
                >
                  -
                </button>
                <button
                  onClick={() => onUpdate(c.id, c.slots, 1)}
                  className="w-10 h-10 bg-slate-100 rounded-xl font-black hover:bg-emerald-500 hover:text-white border-none outline-none text-slate-900"
                >
                  +
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="ml-4 p-3 text-slate-300 hover:text-red-500 border-none bg-transparent outline-none"
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
