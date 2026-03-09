"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import DriverCVPage from "../../components/DriverCVPage";

export default function FullCVPage() {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDriverData() {
      if (!id) return;

      const { data, error } = await supabase
        .from("market_drivers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Fel vid hämtning av förare:", error.message);
      } else {
        setDriver(data);
      }
      setLoading(false);
    }

    fetchDriverData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse italic">
          Verifierar certifikat och hämtar förardata...
        </p>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 italic">
          Kunde inte hitta föraren i YKB Centralen.
        </p>
      </div>
    );
  }

  return <DriverCVPage driver={driver} />;
}
