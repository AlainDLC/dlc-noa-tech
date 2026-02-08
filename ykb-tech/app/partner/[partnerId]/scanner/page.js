"use client";
import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useData } from "../../../context/DataContext";
import { useParams } from "next/navigation";
import { UserCheck, ArrowLeft, ShieldAlert, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PartnerScanner() {
  const { partnerId } = useParams(); // Hämtar [partnerId] från mappen/URL:en
  const { bookings, updateBooking } = useData();
  const [scanResult, setScanResult] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Fix för Hydration-felet (Next.js server-side vs client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || scanResult) return;

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (result) => {
        // 1. Hitta bokningen baserat på QR-koden (ID)
        const foundBooking = bookings.find((b) => b.id === result);

        if (foundBooking) {
          // 2. SÄKERHETSKONTROLL: Tillhör eleven denna skola?
          // Vi jämför bokningens schoolId med partnerId från URL:en
          if (foundBooking.schoolId === partnerId) {
            setScanResult(foundBooking);
            scanner.clear();
          } else {
            alert(
              `STOPP! Eleven är bokad på en annan skola: ${foundBooking.schoolName || foundBooking.schoolId}`,
            );
          }
        } else {
          alert("Ogiltig kod - Bokningen hittades inte i systemet.");
        }
      },
      (err) => {
        /* Ignorera tysta scan-fel under sökning */
      },
    );

    return () => {
      scanner
        .clear()
        .catch((error) => console.error("Failed to clear scanner", error));
    };
  }, [mounted, scanResult, bookings, partnerId]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-6">
      <div className="max-w-md mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-10">
          <Link
            href={`/partner/${partnerId}`} // Går tillbaka till Dashboarden
            className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Dashboard
            </span>
          </Link>

          <div className="text-right">
            <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">
              YKB <span className="text-blue-500">Scanner</span>
            </h1>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Partner ID: {partnerId}
            </p>
          </div>
        </div>

        {!scanResult ? (
          <div className="space-y-6">
            <div className="bg-black rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl relative">
              <div id="reader" className="w-full"></div>
              {/* Overlay för designkänsla */}
              <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20"></div>
            </div>
            <div className="text-center">
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] animate-pulse">
                Söker efter elevens QR-kod...
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-8 text-slate-900 animate-in zoom-in duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <UserCheck size={32} />
            </div>

            <p className="text-[10px] font-black uppercase text-blue-600 mb-1">
              Verifierad Elev
            </p>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-1 leading-none">
              {scanResult.name}
            </h2>
            <p className="text-sm font-mono text-slate-400 mb-8">
              {scanResult.ssn}
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-xs font-bold uppercase border-b border-slate-50 pb-2">
                <span className="text-slate-400">Status</span>
                <span
                  className={
                    scanResult.status === "Completed"
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }
                >
                  {scanResult.status === "Completed"
                    ? "Redan slutförd"
                    : "Väntar på incheckning"}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase border-b border-slate-50 pb-2">
                <span className="text-slate-400">Bokad Kurs</span>
                <span>{scanResult.date}</span>
              </div>
            </div>

            <button
              onClick={() => {
                updateBooking(scanResult.id, {
                  status: "Completed",
                  completedAt: new Date().toLocaleDateString(),
                  verifiedBy: partnerId, // Sparar vilken partner som utförde scanningen
                });
                alert("Eleven har checkats in och markerats som klar!");
                setScanResult(null);
              }}
              className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all hover:bg-blue-600"
            >
              Bekräfta Närvaro
            </button>

            <button
              onClick={() => setScanResult(null)}
              className="w-full mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"
            >
              Avbryt / Scanna nästa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
