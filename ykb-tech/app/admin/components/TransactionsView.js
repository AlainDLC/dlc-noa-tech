// components/TransactionsView.js
import React from "react";
import { Search, FileSpreadsheet } from "lucide-react";

export default function TransactionsView({ bookings, schools }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            Transaction <span className="text-blue-600">Ledger</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            Historik över alla elevbokningar
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl">
          <FileSpreadsheet size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <div className="relative max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Sök på elev eller skola..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-bold text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                <th className="px-8 py-5">Datum</th>
                <th className="px-8 py-5">Elev</th>
                <th className="px-8 py-5">Partner</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {bookings.map((b, i) => {
                // 1. Vi matchar partner_id istället för schoolId
                const school = schools.find((s) => s.id === b.partner_id);

                return (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* 2. Datum: Vi gör om created_at till ett läsbart datum */}
                    <td className="px-8 py-6 font-black text-sm">
                      {b.created_at
                        ? new Date(b.created_at).toLocaleDateString("sv-SE")
                        : "Saknas"}
                    </td>

                    {/* 3. Elev: Vi använder student_name */}
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-900 uppercase italic text-md leading-none mb-1">
                        {b.student_name || "Okänd elev"}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">
                        {b.email || "Ingen e-post"}
                      </p>
                    </td>

                    {/* 4. Partner: Visar skolans namn om vi hittar det */}
                    <td className="px-8 py-6 font-bold text-xs uppercase text-slate-600">
                      {school?.name || b.partner_id || "N/A"}
                    </td>

                    {/* 5. Status och Belopp (Lade till beloppet här så du ser pengarna!) */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-emerald-100">
                          {b.status === "active" ? "Betald" : b.status}
                        </span>
                        <span className="font-black text-slate-900 text-sm">
                          {b.amount?.toLocaleString()} kr
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
  );
}
