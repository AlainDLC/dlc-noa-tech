"use client";
import React, { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Download,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const { bookings, schools } = useData();
  const [latestBooking, setLatestBooking] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Vi hämtar den senaste bokningen för att visa QR-koden
    if (bookings.length > 0) {
      const last = bookings[bookings.length - 1];
      const school = schools.find((s) => s.id === last.schoolId);
      setLatestBooking({
        ...last,
        schoolName: school?.name,
        city: school?.city,
      });
    }
  }, [bookings, schools]);

  // Förhindrar Hydration-fel (Locale-matchning)
  if (!mounted || !latestBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black italic uppercase tracking-tighter">
        Verifierar Betalning...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 font-sans text-slate-900">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          {/* TOP STATUS */}
          <div className="bg-emerald-500 p-10 text-center text-white">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <CheckCircle2 size={40} strokeWidth={3} />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
              Bokad & Klar!
            </h1>
            <p className="text-emerald-100 font-bold uppercase text-[10px] tracking-widest">
              Ditt YKB-intyg börjar här
            </p>
          </div>

          <div className="p-10">
            {/* THE QR CODE - THE "TICKET" */}
            <div className="text-center mb-10">
              <div className="inline-block p-6 bg-white border-[6px] border-slate-900 rounded-[2.5rem] shadow-2xl mb-4">
                {/* QR-koden innehåller bokningens ID som scannern letar efter */}
                <QRCodeSVG value={latestBooking.id} size={200} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                Visa denna kod för utbildaren <br /> vid ankomst till lokalerna
              </p>
            </div>

            {/* BOOKING DETAILS */}
            <div className="grid grid-cols-2 gap-8 border-t border-b border-slate-50 py-8 mb-8">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-blue-600 uppercase italic tracking-widest">
                  Elev
                </p>
                <p className="font-black text-slate-900 uppercase italic text-lg leading-none">
                  {latestBooking.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  {latestBooking.ssn}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-blue-600 uppercase italic tracking-widest">
                  Datum
                </p>
                <p className="font-black text-slate-900 uppercase italic text-lg leading-none">
                  {latestBooking.date}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-blue-600 uppercase italic tracking-widest">
                  Plats
                </p>
                <p className="font-black text-slate-900 uppercase italic text-lg leading-none">
                  {latestBooking.schoolName}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  {latestBooking.city}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest">
                  Status
                </p>
                <p className="text-emerald-500 font-black uppercase italic text-2xl tracking-tighter leading-none">
                  BETALD
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-4">
              <button
                onClick={() => window.print()}
                className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                <Download size={18} /> Spara Bokningsbevis
              </button>

              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all"
              >
                Tillbaka till startsidan <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* COMPLIANCE NOTE */}
        <p className="text-center mt-8 text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] px-10 leading-relaxed">
          Boknings-ID: {latestBooking.id} — Ett kvitto har skickats till din
          e-post. Glöm ej giltig legitimation vid kurstillfället.
        </p>
      </div>
    </div>
  );
}
