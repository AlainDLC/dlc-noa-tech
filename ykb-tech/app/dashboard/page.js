"use client";
import React from "react";
import { useData } from "../context/DataContext";
import {
  LayoutDashboard,
  Plus,
  Users,
  Calendar,
  ArrowUpRight,
  MoreVertical,
  Search,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function PartnerDashboard() {
  const { schools } = useData();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* SIDEBAR (Subtil Shadcn-stil) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <LayoutDashboard className="text-white" size={18} />
          </div>
          <span className="font-black italic tracking-tighter text-slate-900 uppercase">
            Partner Hub
          </span>
        </div>

        <nav className="space-y-1">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Överblick"
            active
          />
          <NavItem icon={<Users size={18} />} label="Bokningar" />
          <NavItem icon={<Calendar size={18} />} label="Schema" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10">
        <div className="max-w-5xl mx-auto">
          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-10">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-900 font-black uppercase italic tracking-tighter"
            >
              <ArrowLeft size={20} /> Tillbaka
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Välkommen tillbaka!
              </h1>

              <p className="text-slate-500 text-sm font-medium mt-1">
                Här är statusen för dina YKB-utbildningar idag.
              </p>
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm">
              <Plus size={18} /> Ny annons
            </button>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard
              label="Aktiva kurser"
              value={schools.length}
              change="+2"
              icon={<CheckCircle2 className="text-emerald-500" />}
            />
            <StatCard
              label="Totala bokningar"
              value="142"
              change="+12%"
              icon={<Users className="text-blue-500" />}
            />
            <StatCard
              label="Lediga platser"
              value="28"
              color="text-red-500"
              icon={<Clock className="text-orange-500" />}
            />
          </div>

          {/* TABLE SECTION (Shadcn Table style) */}
          <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
                Dina Listningar
              </h2>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Sök..."
                  className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 w-48"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Utbildning
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Stad
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Nästa start
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Platser
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schools.map((school) => (
                    <tr
                      key={school.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {school.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          ID: {school.id.toString().slice(-5)}
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-600 uppercase tracking-tight">
                        {school.city}
                      </td>
                      <td className="p-4 text-xs text-slate-600 font-medium">
                        {school.schedule?.[0]?.date || "Ej satt"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full"
                              style={{ width: "60%" }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-700">
                            {school.schedule?.[0]?.slots || 0} st
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-komponenter för att hålla koden ren
function NavItem({ icon, label, active = false }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${active ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}
    >
      {icon}
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
}

function StatCard({ label, value, change, icon, color = "text-slate-900" }) {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
          {change}
        </span>
      </div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}
