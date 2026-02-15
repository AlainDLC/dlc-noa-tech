"use client";
import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useData } from "../../../context/DataContext";
import { useParams } from "next/navigation";
import { ArrowLeft, UserCheck } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";

export default function PartnerScanner() {
  const { id } = useParams();
  const { bookings, updateBooking, refreshData } = useData();
  const [scanResult, setScanResult] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted || scanResult) return;

    const container = document.getElementById("reader");
    if (container) container.innerHTML = "";

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
    });

    scannerRef.current = scanner;

    scanner.render(
      async (result) => {
        const cleanId = result.trim().toLowerCase();

        let found = bookings.find(
          (b) => String(b.id).toLowerCase() === cleanId,
        );

        if (!found) {
          const { data } = await supabase
            .from("bookings")
            .select("*")
            .eq("id", cleanId)
            .single();
          found = data;
        }

        if (found) {
          // Pixies partner_id (Verifierat mot din DB tidigare)
          if (
            String(found.partner_id).toLowerCase() ===
            "d8cf1d10-050b-427e-bb36-2e8f51e747f1"
          ) {
            setScanResult(found);
            if (scannerRef.current) {
              await scannerRef.current.clear();
            }
          } else {
            alert("STOPP! Denna biljett tillhör inte Pixie YKB.");
          }
        } else {
          alert("Hittade ingen bokning.");
        }
      },
      () => {},
    );
  }, [mounted, scanResult, bookings]);

  // FUNKTIONEN SOM SKÖTER INCHECKNING OCH BETALNING
  const handleVerify = async () => {
    if (!scanResult) return;
    setIsSaving(true);

    try {
      // 1. Uppdatera bokningen till Completed
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({
          status: "Completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", scanResult.id);

      if (bookingError) throw bookingError;

      // 2. Registrera utbetalning/intäkt för skolan
      // Här räknar vi ut vad skolan ska ha (Total - Provision)
      const schoolEarnings =
        Number(scanResult.amount) - Number(scanResult.commission_amount);

      // VIKTIGT: Här lägger vi till pengarna i en tabell som heter 'payouts'
      // eller liknande så att skolan ser dem i sin dashboard
      const { error: payoutError } = await supabase.from("payouts").insert([
        {
          partner_id: scanResult.partner_id,
          booking_id: scanResult.id,
          amount: schoolEarnings,
          status: "pending_payout",
          description: `Ersättning för elev: ${scanResult.student_name}`,
        },
      ]);

      if (payoutError) {
        console.warn(
          "Kunde inte skapa utbetalningspost, men incheckning sparad.",
        );
      }

      // 3. Uppdatera lokalt state och ladda om data
      updateBooking(scanResult.id, { status: "Completed" });
      if (refreshData) refreshData();

      alert(
        `Incheckad! ${schoolEarnings} kr har registrerats för utbetalning.`,
      );
      setScanResult(null);
    } catch (err) {
      console.error("Fel:", err);
      alert("Något gick fel vid verifieringen.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Link
            href={`/partner/${id}/dashboard`}
            className="bg-slate-800 p-3 rounded-xl"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-black uppercase italic tracking-tighter">
            YKB <span className="text-blue-500">Scanner</span>
          </h1>
        </div>

        {!scanResult ? (
          <div className="space-y-6">
            <div
              id="reader"
              className="bg-black rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl"
            ></div>
            <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              Söker QR-kod...
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-8 text-slate-900 animate-in zoom-in duration-300">
            <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <UserCheck size={32} />
            </div>
            <p className="text-[10px] font-black uppercase text-blue-600 mb-1">
              Verifierad
            </p>
            <h2 className="text-3xl font-black uppercase italic mb-8 leading-none tracking-tighter">
              {scanResult.student_name}
            </h2>

            <div className="bg-slate-50 p-4 rounded-2xl mb-8">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span className="text-slate-400">Belopp till skolan:</span>
                <span className="text-slate-900">
                  {Number(scanResult.amount) -
                    Number(scanResult.commission_amount)}{" "}
                  kr
                </span>
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={isSaving}
              className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase italic tracking-widest active:scale-95 transition-all shadow-xl"
            >
              {isSaving ? "Registrerar..." : "Bekräfta & Betala"}
            </button>
            <button
              onClick={() => setScanResult(null)}
              className="w-full mt-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest"
            >
              Avbryt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
