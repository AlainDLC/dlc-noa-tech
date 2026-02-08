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
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function PartnerDashboard() {
  const { schools, deleteSchool, updateSlots, bookings = [] } = useData();
  const [view, setView] = useState("listings");
  const { partnerId } = useParams();

  // 1. FILTRERING - Se till att vi bara ser vår egen data

  /* 1. VISA ALLT (Mock-mode) 
  const mySchools = schools;
  const myBookings = bookings;
  */

  // Filtrering för att bara visa partnerns egna skolor/kurser
  const mySchools = schools.filter(
    (s) => s.id === partnerId || s.schoolId === partnerId,
  );

  const currentSchool = schools.find(
    (s) => s.id === partnerId || s.schoolId === partnerId,
  );

  const schoolOrg = currentSchool?.orgNr || "Ej angivet";
  const schoolAddress = currentSchool?.address || "Ingen adress sparad";
  const myBookings = bookings.filter((b) => b.schoolId === partnerId);

  const handleDelete = (id, name) => {
    if (window.confirm(`Är du säker på att du vill ta bort ${name}?`)) {
      deleteSchool(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <LayoutDashboard className="text-white" size={18} />
          </div>
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
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <Link href={`/partner/${partnerId}/scanner`}>
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-md cursor-pointer group">
              <ScanQrCode
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-xs font-black uppercase tracking-tight">
                Öppna Scanner
              </span>
            </div>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10">
        <div className="max-w-5xl mx-auto">
          {/* WELCOME HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black uppercase italic tracking-tighter text-xs mb-4 transition-colors"
              >
                <ArrowLeft size={14} /> Tillbaka till sajten
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                  Verifierad Partner
                </span>
              </div>
              <h1 className="text-5xl font-[1000] text-slate-900 tracking-tighter uppercase italic leading-[0.8]">
                {currentSchool?.name || "Din Skola"}
              </h1>
              <div className="flex gap-4 mt-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {currentSchool?.city}
                </span>
                <span className="flex items-center gap-1 text-blue-600">
                  <Globe size={12} /> Partner ID: {partnerId}
                </span>
              </div>
            </div>

            <Link
              href={`/register?partnerId=${partnerId}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1"
            >
              <Plus size={20} strokeWidth={3} /> Publicera Ny Kurs
            </Link>
          </div>

          {/* FÖRETAGSPROFIL (LÅST DATA) */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm mb-10 flex flex-col md:flex-row gap-8 items-center justify-between group hover:border-blue-200 transition-all">
            <div className="flex gap-6 items-center">
              <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl">
                <FileText size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Officiella Uppgifter
                </p>
                <h3 className="text-xl font-[1000] text-slate-900 uppercase italic leading-none mb-2">
                  {currentSchool?.name}
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200">
                    ORG: {schoolOrg}
                  </span>
                  <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200">
                    ADRESS: {schoolAddress}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:block text-right border-l border-slate-100 pl-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">
                Behöver du ändra något?
              </p>
              <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">
                Kontakta Partner Support
              </button>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard
              label="Aktiva Annonser"
              value={mySchools.length}
              change="Live nu"
              icon={<CheckCircle2 className="text-emerald-500" />}
            />
            <StatCard
              label="Totala Bokningar"
              value={myBookings.length}
              change={
                myBookings.length > 0 ? "Nya i listan" : "Väntar på elever"
              }
              icon={<Users className="text-blue-500" />}
            />
            <StatCard
              label="Din Status"
              value="Aktiv"
              color="text-emerald-500"
              icon={<Clock className="text-orange-500" />}
            />
          </div>

          {/* DYNAMISK TABELL-SEKTION */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {view === "listings" && (
              <ListingTable schools={mySchools} handleDelete={handleDelete} />
            )}
            {view === "bookings" && <BookingTable bookings={myBookings} />}
            {view === "schedule" && (
              <ScheduleTable schools={mySchools} updateSlots={updateSlots} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- UNDERKOMPONENTER (Optimerade för CRUD) ---

function ListingTable({ schools, handleDelete }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 uppercase">
              <th className="p-6 text-[10px] font-black text-slate-400 tracking-wider">
                Utbildningstyp
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 tracking-wider">
                Stad
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 tracking-wider">
                Nästa datum
              </th>
              <th className="p-6 text-right text-[10px] font-black text-slate-400 tracking-wider">
                Admin
              </th>
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                <th className="p-6">Elev</th>
                <th className="p-6">Kontakt</th>
                <th className="p-6">Kurs</th>
                <th className="p-6 text-right">Betalstatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6">
                    <div className="font-black text-sm text-slate-900 uppercase">
                      {booking.studentName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono italic">
                      {booking.personalId}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-xs font-black text-slate-600">
                      {booking.phone}
                    </div>
                    <div className="text-[10px] text-blue-600 font-bold lowercase">
                      {booking.email}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-[10px] font-black text-slate-800 uppercase italic mb-1">
                      {booking.courseLabel}
                    </div>
                    <div className="text-[10px] text-slate-400 font-black tracking-widest">
                      {booking.date}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <span
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] ${booking.status === "BETALD" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}
                    >
                      {booking.status}
                    </span>
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
            <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
              <th className="p-6">Kurs</th>
              <th className="p-6">Datum</th>
              <th className="p-6 text-center">Platser kvar</th>
              <th className="p-6 text-right">Snabbjustering</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schools.map((school) => {
              const scheduleItems = school.schedule || [];
              return scheduleItems.map((item, i) => (
                <tr
                  key={`${school.id}-${i}`}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-6">
                    <div className="font-black text-sm uppercase italic">
                      {school.name}
                    </div>
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
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-4 rounded-2xl cursor-pointer transition-all duration-300 ${active ? "bg-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
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
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-blue-500 transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
          {icon}
        </div>
        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-widest">
          {change}
        </span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
        {label}
      </p>
      <p
        className={`text-5xl font-[1000] tracking-tighter italic uppercase ${color}`}
      >
        {value}
      </p>
    </div>
  );
}
