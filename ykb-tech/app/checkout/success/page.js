"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useData } from "../../context/DataContext";
import { QRCodeSVG } from "qrcode.react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Vi skapar en intern komponent för att hantera searchParams korrekt i Next.js
function TicketContent() {
  const { bookings, schools } = useData();
  const searchParams = useSearchParams();
  const [latestBooking, setLatestBooking] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 1. Vänta tills vi har data
    if (bookings?.length > 0) {
      const urlId = searchParams.get("id");

      // 2. Hitta rätt bokning baserat på ID i URL:en
      const booking = urlId
        ? bookings.find((b) => String(b.id) === String(urlId))
        : bookings[bookings.length - 1];

      if (booking) {
        // 3. Matcha skolan - VIKTIGT: Här kollar vi mot schools-listan
        const schoolMatch = schools?.find(
          (s) => String(s.id) === String(booking.partner_id),
        );

        setLatestBooking({
          id: booking.id,
          name: booking.student_name,
          date: booking.course_date,
          schoolName: schoolMatch ? schoolMatch.name : "YKB Partner",
          city: schoolMatch ? schoolMatch.city : "Sverige",
          status: booking.status || "PAID",
        });
      }
    }
  }, [bookings, schools, searchParams]);

  if (!mounted || !latestBooking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-black italic uppercase tracking-tighter text-blue-600">
          Genererar din biljett...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-emerald-500 p-10 text-center text-white">
            <CheckCircle2 size={40} className="mx-auto mb-4" strokeWidth={3} />
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
              Bokad & Klar!
            </h1>
            <p className="text-emerald-100 font-bold uppercase text-[10px] tracking-widest">
              ID: {latestBooking.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="p-10 text-center">
            <div className="inline-block p-6 bg-white border-[6px] border-slate-900 rounded-[2.5rem] mb-6 shadow-xl">
              <QRCodeSVG value={latestBooking.id} size={180} />
            </div>

            <div className="grid grid-cols-2 gap-6 text-left border-t border-slate-50 pt-8 mb-8">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase italic">
                  Elev
                </p>
                <p className="font-black text-slate-900 uppercase italic text-lg leading-none">
                  {latestBooking.name}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase italic">
                  Datum
                </p>
                <p className="font-black text-slate-900 uppercase italic text-lg leading-none">
                  {latestBooking.date}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase italic">
                  Utbildare
                </p>
                <p className="font-black text-slate-900 uppercase italic text-lg leading-none">
                  {latestBooking.schoolName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase italic">
                  Status
                </p>
                <p className="text-emerald-500 font-black uppercase italic text-xl">
                  BETALD
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black uppercase italic hover:bg-blue-600 transition-all shadow-lg"
            >
              Spara bokningsbevis
            </button>
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all pt-2"
            >
              <ArrowLeft size={12} /> Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper för att Next.js kräver Suspense runt useSearchParams
export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Laddar...</div>}>
      <TicketContent />
    </Suspense>
  );
}
