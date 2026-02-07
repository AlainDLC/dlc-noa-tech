"use client";
import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useData } from "../../context/DataContext";
import {
  Camera,
  UserCheck,
  ShieldAlert,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function PartnerScanner() {
  const { bookings, updateBooking } = useData();
  const [scanResult, setScanResult] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Fix för Hydration-felet
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
        const foundBooking = bookings.find((b) => b.id === result);
        if (foundBooking) {
          setScanResult(foundBooking);
          scanner.clear();
        } else {
          alert("Ogiltig kod - Bokningen hittades inte i systemet.");
        }
      },
      (err) => {
        /* Ignorera tysta scan-fel */
      },
    );

    return () => {
      scanner
        .clear()
        .catch((error) => console.error("Failed to clear scanner", error));
    };
  }, [mounted, scanResult, bookings]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-6">
      <div className="max-w-md mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/partner" className="text-slate-400">
            <ArrowLeft />
          </Link>
          <h1 className="text-xl font-black uppercase italic tracking-tighter">
            YKB <span className="text-blue-500">Scanner</span>
          </h1>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {!scanResult ? (
          <div className="space-y-6">
            <div className="bg-black rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl">
              <div id="reader" className="w-full"></div>
            </div>
            <div className="text-center">
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] animate-pulse">
                Söker efter QR-kod...
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-8 text-slate-900 animate-in zoom-in duration-300">
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
                <span className="text-amber-500">Pågående kurs</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase border-b border-slate-50 pb-2">
                <span className="text-slate-400">Datum</span>
                <span>{scanResult.date}</span>
              </div>
            </div>

            <button
              onClick={() => {
                updateBooking(scanResult.id, {
                  status: "Completed",
                  completedAt: new Date().toLocaleDateString(),
                });
                alert("Utbildningen markerad som slutförd!");
                setScanResult(null); // Starta om scannern
              }}
              className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase italic tracking-widest shadow-xl shadow-blue-200 active:scale-95 transition-all"
            >
              Slutför Utbildning
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
