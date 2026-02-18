"use client";
import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useData } from "../../../context/DataContext";
import { useParams } from "next/navigation";
import { ArrowLeft, UserCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";

export default function PartnerScanner() {
  const { id } = useParams();
  const { updateBooking, refreshData } = useData();
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

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
    });

    scannerRef.current = scanner;

    scanner.render(
      async (result) => {
        const bookingId = result.trim();

        // 1. Hämta bokningen (Alain)
        const { data: found } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", bookingId)
          .single();

        if (found) {
          // 2. HÄMTA DIN SKOLAS UUID DIREKT (Inga states, ingen gissning)
          const { data: partner } = await supabase
            .from("partners")
            .select("id")
            .eq("slug", id) // 'id' är 'los-locos' från URL:en
            .single();

          const bId = String(found.partner_id).toLowerCase().trim();
          const pId = partner ? String(partner.id).toLowerCase().trim() : null;

          console.log("SISTA KOLLEN:", { biljett: bId, skola: pId });

          if (pId && bId === pId) {
            setScanResult(found);
            if (scannerRef.current) {
              await scannerRef.current.clear().catch(() => {});
            }
          } else {
            alert(
              `STOPP!\n\nDenna biljett tillhör en annan skola.\nBokning: ${bId}\nDu: ${pId}`,
            );
          }
        } else {
          alert("Hittade ingen bokning.");
        }
      },
      () => {},
    );
  }, [mounted, scanResult, id]);

  const handleVerify = async () => {
    if (!scanResult) return;
    setIsSaving(true);
    try {
      const { error: bError } = await supabase
        .from("bookings")
        .update({ status: "Completed", completed_at: new Date().toISOString() })
        .eq("id", scanResult.id);

      if (bError) throw bError;

      const earnings =
        Number(scanResult.amount) - Number(scanResult.commission_amount);
      await supabase.from("payouts").insert([
        {
          partner_id: scanResult.partner_id,
          booking_id: scanResult.id,
          amount: earnings,
          status: "pending_payout",
          description: `Ersättning: ${scanResult.student_name}`,
        },
      ]);

      updateBooking(scanResult.id, { status: "Completed" });
      if (refreshData) await refreshData();

      alert(`Incheckad! ${earnings} kr har registrerats.`);
      setScanResult(null);
    } catch (err) {
      alert("Fel vid incheckning.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
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
          <div
            id="reader"
            className="bg-black rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl relative"
          ></div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-8 text-slate-900 animate-in zoom-in duration-300 text-center">
            <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <UserCheck size={32} />
            </div>
            <h2 className="text-3xl font-black uppercase italic mb-8">
              {scanResult.student_name}
            </h2>
            <button
              onClick={handleVerify}
              disabled={isSaving}
              className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase italic tracking-widest active:scale-95 transition-all"
            >
              {isSaving ? "Slutför..." : "Bekräfta Incheckning"}
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
