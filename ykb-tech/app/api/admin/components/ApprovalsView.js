// components/ApprovalsView.js
import React from "react";
import { CheckCircle, XCircle, Mail, Building2 } from "lucide-react";

export default function ApprovalsView({ requests, onApprove, onDeny }) {
  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white p-20 rounded-[3rem] border border-slate-200 text-center shadow-sm">
        <p className="font-[1000] text-slate-300 uppercase italic text-2xl tracking-tighter">
          Inga väntande ansökningar just nu
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Building2 size={28} />
              </div>
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                ID: {req.id.slice(0, 8)}
              </span>
            </div>

            <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter text-slate-900 leading-none mb-1">
              {req.school_name}
            </h3>
            <p className="text-blue-600 font-bold text-xs mb-4 uppercase tracking-tight">
              Kontakt: {req.contact_person}
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Mail size={14} /> {req.email}
              </div>
              <p className="text-slate-400 text-xs leading-relaxed italic border-l-2 border-slate-100 pl-4">
                "{req.message || "Ingen meddelande lämnat."}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
            <button
              onClick={() => onDeny(req.id)}
              className="flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all border-none"
            >
              <XCircle size={14} /> Neka
            </button>
            <button
              onClick={() => onApprove(req)}
              className="flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all border-none shadow-lg shadow-emerald-100"
            >
              <CheckCircle size={14} /> Godkänn
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
