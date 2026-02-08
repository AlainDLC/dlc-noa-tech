"use client";
import React, { useState } from "react";
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
  const { schools, deleteSchool, updateSlots, bookings = [] } = useData();
  const [view, setView] = useState("listings");
  const { partnerId } = useParams();
  const [isAdding, setIsAdding] = useState(false);

  // 1. FILTRERING
  const currentSchool = schools.find(
    (s) => s.id === partnerId || s.schoolId === partnerId,
  );

  const mySchools = schools.filter(
    (s) => s.id === partnerId || s.schoolId === partnerId,
  );

  const myBookings = bookings.filter((b) => b.schoolId === partnerId);

  // 2. EKONOMI-LOGIK
  const COMMISSION_RATE = 0.15;
  const totalGross = myBookings.reduce((sum, b) => {
    const price = Number(b.amount) || 5000; // Om inget pris finns, kör vi 5000 som test
    return sum + price;
  }, 0);
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
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-slate-900 text-white hover:bg-blue-600 transition-all cursor-pointer group">
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
                {currentSchool?.name || "Min Testskola"}
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
            <Link
              href={`/register?partnerId=${partnerId}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl shadow-blue-200 transition-all"
            >
              <Plus size={20} strokeWidth={3} /> Ny Kurs
            </Link>
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
                    <span>Brutto: {totalGross} kr</span>
                    <span className="text-red-400">
                      Avgift: -{platformFee} kr
                    </span>
                  </div>
                </div>
                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col justify-center text-center">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">
                    Nästa Utbetalning
                  </p>
                  <p className="text-3xl font-black italic uppercase mb-6">
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

              {/* DYNAMISKA VYER */}

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* 1. ENBART EKONOMI-VY */}
                {view === "finance" && (
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
                )}

                {/* 2. KURSER-VY MED TRANSFORMERANDE FORMULÄR */}
                {view === "listings" && (
                  <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-500">
                    {!isAdding ? (
                      <>
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                          <h3 className="font-[1000] uppercase italic text-slate-900 tracking-tighter text-xl">
                            Dina Publicerade Kurser
                          </h3>
                          <button
                            onClick={() => setIsAdding(true)}
                            className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-6 py-4 rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
                          >
                            + Lägg till kursstart
                          </button>
                        </div>
                        <ListingTable
                          schools={mySchools}
                          handleDelete={handleDelete}
                        />
                      </>
                    ) : (
                      /* SNABB-FORMULÄRET SOM VÄXER FRAM */
                      <div className="p-10 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                          <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 text-left">
                              Uppdatera utbudet
                            </p>
                            <h3 className="font-[1000] uppercase italic text-slate-900 text-3xl tracking-tighter">
                              Ny Kursstart
                            </h3>
                          </div>
                          <button
                            onClick={() => setIsAdding(false)}
                            className="bg-slate-100 p-3 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest text-left block">
                              Kursens namn
                            </label>
                            <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-900"
                              placeholder="t.ex. YKB Delkurs 1"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest text-left block">
                              Pris (kr)
                            </label>
                            <input
                              type="number"
                              className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-900"
                              placeholder="5000"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest text-left block">
                              Datum
                            </label>
                            <input
                              type="date"
                              className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="mt-10 flex flex-col md:flex-row gap-4">
                          <button
                            onClick={() => setIsAdding(false)}
                            className="flex-1 bg-slate-900 text-white py-6 rounded-2xl font-[1000] uppercase text-xs tracking-[0.3em] hover:bg-emerald-500 transition-all shadow-2xl"
                          >
                            Publicera till kortet
                          </button>
                          <button
                            onClick={() => setIsAdding(false)}
                            className="px-10 font-black uppercase text-[10px] text-slate-400 hover:text-slate-900"
                          >
                            Avbryt
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. ÖVRIGA VYER */}
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
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 uppercase text-[10px] font-black text-slate-400 tracking-wider">
              <th className="p-6">Utbildningstyp</th>
              <th className="p-6">Stad</th>
              <th className="p-6">Nästa datum</th>
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
                  <div className="text-[10px] text-slate-400 font-bold tracking-tighter">
                    ID: {school.id}
                  </div>
                </td>
                <td className="p-6 text-xs font-black text-slate-600 uppercase italic">
                  {school.city}
                </td>
                <td className="p-6">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {school.schedule?.[0]?.date || "Ej satt"}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/register?edit=${school.id}`}
                      className="p-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 rounded-xl transition-all"
                    >
                      <Edit3 size={16} />
                    </Link>
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
                <th className="p-6">Kurs & Pris</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-right">Åtgärd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="p-6">
                    <div className="font-black text-slate-900 uppercase italic leading-none mb-1">
                      {booking.email}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">
                      Ref: {booking.id?.slice(0, 8) || "REC-4921"}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-slate-700 text-xs uppercase">
                      {booking.courseName || "YKB Utbildning"}
                    </div>
                    <div className="text-blue-600 font-black">
                      {booking.amount || "5 000"} kr
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border-2 ${
                        booking.status === "Completed" ||
                        booking.status === "Betald"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-orange-50 text-orange-600 border-orange-100"
                      }`}
                    >
                      {booking.status === "Completed" ||
                      booking.status === "Betald"
                        ? "✓ Completed"
                        : "● Pending"}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={() =>
                        alert(`Kvitto skickat på nytt till ${booking.email}!`)
                      }
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
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
              <th className="p-6">Datum</th>
              <th className="p-6 text-center">Platser kvar</th>
              <th className="p-6 text-right">Snabbjustering</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schools.map((school) =>
              school.schedule?.map((item, i) => (
                <tr
                  key={`${school.id}-${i}`}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-6 font-black text-sm uppercase italic">
                    {school.name}
                  </td>
                  <td className="p-6 text-xs text-blue-600 font-black uppercase">
                    {item.date}
                  </td>
                  <td className="p-6 text-center">
                    <span
                      className={`font-black text-sm px-4 py-2 rounded-xl ${Number(item.slots) < 5 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      {item.slots} st
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => updateSlots(school.id, i, -1)}
                        className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-red-500 hover:text-white rounded-xl font-black transition-all"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateSlots(school.id, i, 1)}
                        className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-xl font-black transition-all"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-4 rounded-2xl cursor-pointer transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
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
