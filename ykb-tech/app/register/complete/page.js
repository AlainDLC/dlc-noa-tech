"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase, getCoords } from "@/lib/supabase"; // 1. LADE TILL getCoords HÄR
import { Building2, FileText, Send, MapPin, Loader2, Mail } from "lucide-react";

function RegisterCompleteContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const partnerId = searchParams.get("partner_id");

  useEffect(() => {
    async function fetchPartner() {
      if (partnerId) {
        const { data } = await supabase
          .from("partners")
          .select("*")
          .eq("id", partnerId)
          .single();
        if (data) setInitialData(data);
      }
    }
    fetchPartner();
  }, [partnerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!partnerId) return alert("Partner-ID saknas!");

    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 2. KORREKT HÄMTNING AV VÄRDEN
    const name = formData.get("school_name");
    const address = formData.get("address");
    const city = formData.get("city");

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

    try {
      // 3. ANROPA getCoords MED RÄTT VARIABLER
      const coords = await getCoords(address, city);

      const { error: partnerError } = await supabase
        .from("partners")
        .update({
          clerk_id: user?.id,
          user_id: user?.id,
          name: name,
          org_nr: formData.get("org_nr"),
          address: address,
          city: city,
          zip: formData.get("zip"),
          description: formData.get("description"),
          slug: slug,
          status: "active",
          // 4. MAPPA KOORDINATERNA TILL DATABASEN
          lat: coords?.lat || null,
          lng: coords?.lng || null,
        })
        .eq("id", partnerId);

      if (partnerError) throw partnerError;

      await supabase.from("profiles").upsert({
        id: user?.id,
        email: user?.primaryEmailAddress?.emailAddress,
        name: name,
        role: "partner",
      });

      router.push(`/partner/${slug}/dashboard`);
    } catch (err) {
      console.error("Fel:", err);
      alert("Kunde inte spara.");
    } finally {
      setLoading(false);
    }
  };

  if (!partnerId)
    return (
      <div className="p-20 font-black text-red-500 uppercase">
        Ogiltig länk.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100">
        <div className="mb-10 text-center text-slate-900">
          <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter mb-2">
            Slutför din <span className="text-blue-600">identitet</span>
          </h1>
          <p className="text-slate-500 font-medium italic">
            Välkommen! Justera uppgifterna för din skola.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
              Företagsfakta
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <Building2
                  className="absolute left-4 top-4 text-slate-300"
                  size={20}
                />
                <input
                  name="school_name"
                  defaultValue={initialData?.name || ""}
                  required
                  placeholder="Skolans namn"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-4 text-slate-300"
                  size={20}
                />
                <input
                  disabled
                  value={user?.primaryEmailAddress?.emailAddress || ""}
                  className="w-full pl-12 pr-6 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-400 cursor-not-allowed"
                />
              </div>
              <div className="relative">
                <FileText
                  className="absolute left-4 top-4 text-slate-300"
                  size={20}
                />
                <input
                  name="org_nr"
                  required
                  placeholder="Organisationsnummer"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
              Adress för kartan
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="address"
                required
                placeholder="Gatuadress"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 col-span-2"
              />
              <input
                name="city"
                defaultValue={
                  initialData?.city !== "Väntar på uppgifter"
                    ? initialData?.city
                    : ""
                }
                required
                placeholder="Stad"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                name="zip"
                required
                placeholder="Postnummer"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </section>

          <section className="space-y-4 text-slate-900">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
              Om utbildaren
            </h2>
            <textarea
              name="description"
              rows="4"
              placeholder="Beskriv era lokaler..."
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-slate-900 text-white rounded-2xl font-[1000] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Aktivera min profil"
            )}
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RegisterComplete() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      }
    >
      <RegisterCompleteContent />
    </Suspense>
  );
}
