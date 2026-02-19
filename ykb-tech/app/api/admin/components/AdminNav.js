// app/admin/components/AdminNav.js
import React from "react";
import { FileSpreadsheet } from "lucide-react";
import Link from "next/link";

export default function AdminNav({ activeTab, setActiveTab, bookings = [] }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "partners", label: "Partners" },
    { id: "transactions", label: "Transactions" },
  ];

  // FUNKTION FÖR ATT EXPORTERA CSV
  const handleExport = () => {
    if (bookings.length === 0) return alert("Ingen data att exportera");

    // Skapa rubriker (Headers)
    const headers = [
      "Datum",
      "Student",
      "Skola ID",
      "Belopp",
      "Provision",
      "Status",
    ];

    // Mappa rader från din bookings-data
    const rows = bookings.map((b) => [
      b.course_date,
      b.student_name,
      b.partner_id,
      b.amount,
      b.commission_amount,
      b.status,
    ]);

    // Slå ihop till CSV-sträng
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    // Skapa en nedladdningslänk
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `ykb_transactions_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <Link href="/" className="hover:opacity-60 transition-opacity">
          <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">
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

      {/* KNAPPEN NU MED FUNKTION */}
      <button
        onClick={handleExport}
        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 border-none cursor-pointer"
      >
        <FileSpreadsheet size={14} /> Export CSV
      </button>
    </nav>
  );
}
