"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useData } from "../context/DataContext";
import { supabase, getCoords } from "../../lib/supabase"; // <--- 1. LADE TILL getCoords HÄR
import { useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  FileText,
  MapPin,
  Building2,
  Plus,
  Mail,
} from "lucide-react";

export default function RegisterSchool() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getData } = useData();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const partnerIdFromUrl = searchParams.get("partner_id");
  const emailFromUrl = searchParams.get("email");

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    zip: "",
    email: "",
    phone: "",
    description: "",
    orgNr: "",
  });

  // 1. Hämta befintlig data för skolan
  useEffect(() => {
    async function fetchApprovedPartner() {
      const userEmail = emailFromUrl || user?.primaryEmailAddress?.emailAddress;

      if (!isLoaded || (!partnerIdFromUrl && !userEmail)) return;

      let query = supabase.from("partners").select("*");

      if (partnerIdFromUrl) {
        query = query.eq("id", partnerIdFromUrl);
      } else {
        query = query.eq("email", userEmail);
      }

      const { data, error } = await query.single();

      if (data) {
        const cleanValue = (val) =>
          val === "Väntar på uppgifter" ? "" : val || "";

        setFormData({
          name: data.name || "",
          city: cleanValue(data.city),
          address: cleanValue(data.address),
          zip: cleanValue(data.zip),
          email: data.email || userEmail || "",
          phone: cleanValue(data.phone),
          description: cleanValue(data.description),
          orgNr: cleanValue(data.org_nr),
        });
      }
    }

    fetchApprovedPartner();
  }, [partnerIdFromUrl, user, isLoaded, emailFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Du måste vara inloggad via Clerk.");
    setLoading(true);

    try {
      // --- 2. HÄMTA KOORDINATER ---
      const coords = await getCoords(formData.address, formData.city);

      // Skapa slug
      const slug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const partnerData = {
        name: formData.name,
        city: formData.city,
        address: formData.address,
        zip: formData.zip,
        email: formData.email,
        description: formData.description,
        org_nr: formData.orgNr,
        phone: formData.phone,
        slug: slug,
        status: "active",
        clerk_id: user.id,
        user_id: user.id,
        role: "partner",
        // --- 3. INJICERA LAT/LNG ---
        lat: coords?.lat || null,
        lng: coords?.lng || null,
      };

      // Hitta ID för raden vi ska uppdatera
      let targetId = partnerIdFromUrl;

      if (!targetId) {
        const { data: existing } = await supabase
          .from("partners")
          .select("id")
          .eq("email", formData.email)
          .single();
        targetId = existing?.id;
      }

      if (!targetId) {
        throw new Error("Kunde inte hitta en matchande profil att uppdatera.");
      }

      // Kör uppdateringen
      const { error: updateError } = await supabase
        .from("partners")
        .update(partnerData)
        .eq("id", targetId);

      if (updateError) throw updateError;

      // Uppdatera profil-tabellen
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: formData.name,
        role: "partner",
      });

      if (getData) await getData();
      setSubmitted(true);
    } catch (err) {
      alert("Fel vid sparande: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <CheckCircle2 size={80} className="text-emerald-500 mx-auto mb-6" />
          <h1 className="text-4xl font-black uppercase italic mb-4">
            Profil Sparad!
          </h1>
          <button
            onClick={() => {
              const slug = formData.name
                .toLowerCase()
                .trim()
                .replace(/[\s_-]+/g, "-");
              router.push(`/partner/${slug}/dashboard`);
            }}
            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl"
          >
            Gå till Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 text-slate-900">
      <nav className="h-20 bg-white border-b flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto w-full flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-black uppercase italic tracking-tighter"
          >
            <ArrowLeft size={20} /> Avbryt
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Verksamhetsregister
          </span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto pt-12 px-6">
        <div className="mb-12">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-[0.8] mb-2 text-slate-900">
            {formData.name || "LADDAR..."}
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            Skapa din digitala identitet
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Företagsfakta */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-blue-600 font-black uppercase text-[10px] tracking-widest">
              <Building2 size={16} /> Företagsfakta
            </div>
            <div className="relative">
              <input
                readOnly
                value={formData.name}
                className="w-full px-7 py-5 bg-slate-50 rounded-[1.5rem] font-bold text-slate-400 cursor-not-allowed border-none outline-none"
              />
              <Lock
                className="absolute right-6 top-6 text-slate-300"
                size={20}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                value={formData.orgNr}
                placeholder="Organisationsnummer"
                className="w-full px-7 py-5 bg-slate-50 rounded-[1.5rem] font-bold outline-none focus:ring-2 focus:ring-blue-600 border-none"
                onChange={(e) =>
                  setFormData({ ...formData, orgNr: e.target.value })
                }
              />
              <div className="relative">
                <input
                  readOnly
                  value={formData.email}
                  className="w-full px-7 py-5 bg-slate-100 rounded-[1.5rem] font-bold text-slate-400 border-none outline-none"
                />
                <Mail
                  className="absolute right-4 top-5 text-slate-300"
                  size={18}
                />
              </div>
            </div>
          </div>

          {/* Adress */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-red-500 font-black uppercase text-[10px] tracking-widest">
              <MapPin size={16} /> Adress för kartan
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                value={formData.city}
                placeholder="Stad"
                className="w-full px-7 py-5 bg-slate-50 rounded-[1.5rem] font-bold outline-none focus:ring-2 focus:ring-blue-600 border-none"
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
              <input
                required
                value={formData.zip}
                placeholder="Postnummer"
                className="w-full px-7 py-5 bg-slate-50 rounded-[1.5rem] font-bold outline-none focus:ring-2 focus:ring-blue-600 border-none"
                onChange={(e) =>
                  setFormData({ ...formData, zip: e.target.value })
                }
              />
            </div>
            <input
              required
              value={formData.address}
              placeholder="Gatuadress"
              className="w-full px-7 py-5 bg-slate-50 rounded-[1.5rem] font-bold outline-none focus:ring-2 focus:ring-blue-600 border-none"
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {/* Beskrivning */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-4 shadow-sm text-slate-900">
            <div className="flex items-center gap-2 mb-2 text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <FileText size={16} /> Om utbildaren
            </div>
            <textarea
              required
              value={formData.description}
              rows={5}
              placeholder="Berätta om er skola..."
              className="w-full px-7 py-5 bg-slate-50 rounded-[1.5rem] font-bold outline-none focus:ring-2 focus:ring-blue-600 resize-none leading-relaxed border-none"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-24 rounded-[2.5rem] bg-slate-900 text-white font-[1000] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-2xl disabled:bg-slate-200 border-none outline-none"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={28} />
            ) : (
              <>
                Spara Företagsprofil <Plus size={18} />
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
