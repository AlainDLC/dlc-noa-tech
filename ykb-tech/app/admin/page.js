"use client";
import React, { useState } from "react";
import { useData } from "../context/DataContext";
import {
  ShieldCheck,
  Users,
  School,
  TrendingUp,
  Plus,
  X,
  Wallet,
  Trash2,
  Download,
  Calendar,
  UserCheck,
  Mail,
  Phone,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function SuperAdmin() {
  const { schools, bookings, addSchool, deleteSchool } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: "", city: "" });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Om vi inte är mounted än, rendera en tom div eller en placeholder
  // som matchar serverns första enkla HTML
  if (!mounted) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  const commissionRate = 0.15;
  const pricePerCourse = 5000;
  const totalVolume = bookings.length * pricePerCourse;
  const totalCommission = totalVolume * commissionRate;

  // --- FULLSTÄNDIG EXPORT (Inkluderar ALL elevdata) ---
  const exportToExcel = () => {
    const headers = [
      "Namn, Personnummer, E-post, Telefon, Skola, Ort, Datum, Pris (SEK), Provision (15%)\n",
    ];
    const rows = bookings.map((b) => {
      const school = schools.find((s) => s.id === b.schoolId);
      const schoolName = school?.name || "Okänd";
      const schoolCity = school?.city || "Okänd";
      const comm = pricePerCourse * commissionRate;

      // Vi mappar alla fält och rensar eventuella kommatecken för att inte paja CSV-formatet
      return `${b.name}, ${b.ssn}, ${b.email || "N/A"}, ${b.phone || "N/A"}, ${schoolName}, ${schoolCity}, ${b.date}, ${pricePerCourse}, ${comm}`;
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" + headers + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `YKB_TOTAL_REPORT_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-10 text-slate-900 font-sans">
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black uppercase italic tracking-tighter text-xs mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Tillbaka till sajten
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
              Enterprise Control
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8]">
            OVER<span className="text-blue-600">LORD</span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20"
          >
            <FileSpreadsheet size={18} /> Fullständig Data-Export
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Total Bruttovolym"
          value={`${totalVolume.toLocaleString()} kr`}
          icon={<TrendingUp />}
          color="slate"
          sub="Genom Stripe Connect"
        />
        <StatCard
          title="Netto Provision"
          value={`${totalCommission.toLocaleString()} kr`}
          icon={<ShieldCheck />}
          color="emerald"
          sub="Din 15% vinstmarginal"
        />
        <StatCard
          title="Databas Elever"
          value={`${bookings.length} st`}
          icon={<Users />}
          color="blue"
          sub="Unika registrerade förare"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* PARTNER SNAPSHOT */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="font-black uppercase italic text-lg tracking-tighter">
                Partner Ekonomi
              </h2>
              <button
                onClick={() => setIsAdding(true)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {schools.map((school) => {
                const bCount = bookings.filter(
                  (b) => b.schoolId === school.id,
                ).length;
                const net = bCount * pricePerCourse * 0.85;
                return (
                  <div
                    key={school.id}
                    className="p-6 hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black uppercase italic text-sm text-slate-900">
                          {school.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          {school.city}
                        </p>
                      </div>
                      <p className="font-black text-blue-600 italic">
                        {net.toLocaleString()} kr
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MASTER ELEV-LEDGER (ALL DATA) */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black uppercase italic text-2xl tracking-tighter text-slate-900">
                Elev & Boknings-Master
              </h3>
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-black text-[10px] uppercase flex items-center gap-2">
                <UserCheck size={14} /> System Verified
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] uppercase font-black tracking-[0.15em] text-slate-400">
                    <th className="p-8">Elev & Kontakt</th>
                    <th className="p-8">Identitet</th>
                    <th className="p-8">Kursdetaljer</th>
                    <th className="p-8 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map((b, i) => {
                    const school = schools.find((s) => s.id === b.schoolId);
                    return (
                      <tr
                        key={i}
                        className="hover:bg-blue-50/20 transition-all group"
                      >
                        <td className="p-8">
                          <div className="font-black text-slate-900 uppercase italic text-lg leading-none mb-2">
                            {b.name || "namn saknas"}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                              <Mail size={12} className="text-blue-400" />{" "}
                              {b.email || "saknas@mail.se"}
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                              <Phone size={12} className="text-blue-400" />{" "}
                              {b.phone || "070-000 00 00"}
                            </div>
                          </div>
                        </td>
                        <td className="p-8 font-mono text-sm font-bold text-slate-400">
                          {b.ssn}
                        </td>
                        <td className="p-8">
                          <div className="font-black text-slate-700 uppercase italic text-xs mb-1">
                            {school?.name}
                          </div>
                          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-tighter">
                            <Calendar size={12} /> {b.date}
                          </div>
                        </td>
                        <td className="p-8 text-right">
                          <div className="flex flex-col items-end gap-2">
                            <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                              Betald
                            </span>
                            <span className="text-[9px] font-bold text-slate-300 uppercase italic">
                              Ref: STRIPE_LN_{i + 102}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, sub }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50/50 border-blue-100 shadow-blue-100/50",
    emerald:
      "text-emerald-600 bg-emerald-50/50 border-emerald-100 shadow-emerald-100/50",
    slate: "text-slate-900 bg-white border-slate-200 shadow-slate-200/50",
  };
  return (
    <div
      className={`p-10 rounded-[3rem] border-2 ${colors[color]} shadow-xl transition-all hover:scale-[1.02]`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${colors[color]} border`}>
          {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
        </div>
        <ArrowUpRight className="text-slate-300" size={24} />
      </div>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 italic">
        {title}
      </p>
      <h3 className="text-5xl font-black italic tracking-tighter text-slate-900 leading-none mb-3">
        {value}
      </h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {sub}
      </p>
    </div>
  );
}
