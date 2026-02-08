"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Building2, FileText, Send } from "lucide-react";

export default function RegisterComplete() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter mb-2">
            Slutför din <span className="text-blue-600">ansökan</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Välkommen {user?.firstName}! Berätta lite mer om din skola så vi kan
            verifiera ert tillstånd.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Skolans Namn
            </label>
            <div className="relative">
              <Building2
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={20}
              />
              <input
                type="text"
                placeholder="T.ex. YKB-Utbildarna AB"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Organisationsnummer
            </label>
            <div className="relative">
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={20}
              />
              <input
                type="text"
                placeholder="55xxxx-xxxx"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-6 bg-slate-900 text-white rounded-2xl font-[1000] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-lg"
          >
            Skicka in för granskning <Send size={20} />
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
          Genom att skicka in bekräftar du att skolan har <br />
          giltiga tillstånd för yrkesförarkompetens.
        </p>
      </div>
    </div>
  );
}
