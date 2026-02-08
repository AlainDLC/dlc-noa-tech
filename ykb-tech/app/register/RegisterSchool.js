"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useData } from "../context/DataContext";
import { supabase } from "../../lib/supabase";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  FileText,
  MapPin,
  Building2,
  Plus,
} from "lucide-react";

export default function RegisterSchool() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { schools, getData } = useData();
  const searchParams = useSearchParams();
  const router = useRouter();

  const editId = searchParams.get("edit");
  const partnerId = searchParams.get("partnerId");

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    description: "",
    orgNr: "",
  });

  useEffect(() => {
    const targetId = editId || partnerId;
    if (targetId && schools.length > 0) {
      const schoolToEdit = schools.find(
        (s) => s.id.toString() === targetId.toString() || s.slug === targetId,
      );
      if (schoolToEdit) {
        setFormData({
          name: schoolToEdit.name || "",
          city: schoolToEdit.city || "",
          address: schoolToEdit.address || "",
          email: schoolToEdit.email || "",
          phone: schoolToEdit.phone || "",
          description: schoolToEdit.description || "",
          orgNr: schoolToEdit.org_nr || "",
        });
      }
    }
  }, [editId, partnerId, schools]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const generatedSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const partnerData = {
        name: formData.name,
        city: formData.city,
        address: formData.address,
        email: formData.email,
        description: formData.description,
        org_nr: formData.orgNr,
        phone: formData.phone,
        slug: generatedSlug,
        status: "active",
      };

      let error;
      if (editId || partnerId) {
        const { error: updateError } = await supabase
          .from("partners")
          .update(partnerData)
          .eq("id", editId || partnerId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("partners")
          .insert([partnerData]);
        error = insertError;
      }

      if (error) throw error;

      setSubmitted(true);
      if (getData) await getData();
    } catch (err) {
      alert("Kunde inte spara profilen: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-4 uppercase text-slate-900 leading-[0.9]">
            Profilen är <br /> nu sparad!
          </h1>
          <p className="text-slate-500 font-bold mb-8 uppercase text-[10px] tracking-widest">
            Nu kan du börja publicera kurser i hubben.
          </p>
          <button
            onClick={() => router.push(`/partner/${partnerId || editId}`)}
            className="w-full bg-slate-900 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all"
          >
            Gå till Partner Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <nav className="h-20 bg-white border-b flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto w-full flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-900 font-black uppercase italic tracking-tighter hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} /> Avbryt
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Verksamhetsregister
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto pt-12 px-6">
        <div className="mb-12">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase text-slate-900 leading-[0.8] mb-2">
            {formData.name || "NY SKOLA"}
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">
            Skapa din digitala identitet på YKB-Marketplace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FÖRETAGSUPPGIFTER */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={16} className="text-blue-600" />
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Företagsfakta
              </label>
            </div>

            <div className="relative">
              <input
                required
                readOnly={!!partnerId}
                value={formData.name}
                className={`w-full px-7 py-5 border-none rounded-[1.5rem] font-bold text-lg ${partnerId ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"}`}
                placeholder="Företagsnamn"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {partnerId && (
                <Lock
                  className="absolute right-6 top-6 text-slate-300"
                  size={20}
                />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                value={formData.orgNr}
                placeholder="Organisationsnummer"
                className="w-full px-7 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, orgNr: e.target.value })
                }
              />
              <input
                type="email"
                required
                value={formData.email}
                placeholder="E-post (för inloggning)"
                className="w-full px-7 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* PLATS & KARTA */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-red-500" />
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Adress för kartan
              </label>
            </div>
            <input
              required
              value={formData.city}
              placeholder="Stad (t.ex. Stockholm)"
              className="w-full px-7 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold focus:ring-2 focus:ring-blue-600 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
            <input
              required
              value={formData.address}
              placeholder="Gatuadress (t.ex. Vasagatan 12)"
              className="w-full px-7 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold focus:ring-2 focus:ring-blue-600 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {/* BESKRIVNING */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-slate-400" />
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Om utbildaren & Faciliteter
              </label>
            </div>
            <textarea
              required
              value={formData.description}
              className="w-full px-7 py-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-900 min-h-[200px] resize-none focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
              placeholder="Berätta om er skola. Inkludera gärna info om lunch, parkering, lärare eller annat som gör er unika..."
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-24 rounded-[2.5rem] bg-slate-900 text-white font-[1000] uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl hover:bg-blue-600 active:scale-[0.98] transition-all disabled:bg-slate-200"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={28} />
            ) : (
              <>
                Spara Företagsprofil
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus size={18} strokeWidth={3} />
                </div>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
