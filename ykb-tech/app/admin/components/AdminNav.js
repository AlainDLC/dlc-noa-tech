// app/admin/components/AdminNav.js
import React from "react";
import { FileSpreadsheet } from "lucide-react";
import Link from "next/link";

export default function AdminNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "partners", label: "Partners" },
    { id: "transactions", label: "Transactions" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <Link href="/" className="hover:opacity-60 transition-opacity">
          <h1 className="text-2xl font-black italic tracking-tighter">
            OVER<span className="text-blue-600">LORD</span>
          </h1>
        </Link>
        <div className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest cursor-pointer">
          {tabs.map((tab) => (
            <span
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-900 transition-colors"
              }
            >
              {tab.label}
            </span>
          ))}
        </div>
      </div>
      <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2">
        <FileSpreadsheet size={14} /> Export Data
      </button>
    </nav>
  );
}
