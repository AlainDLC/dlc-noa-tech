"use client";
import { useState, useEffect } from "react";
import { SignInButton, SignedOut, SignedIn, useUser } from "@clerk/nextjs";
import { supabase } from "../../../lib/supabase";
import {
  Lock,
  CheckCircle2,
  MapPin,
  Building2,
  Rocket,
  Loader2,
} from "lucide-react";

export default function SetupPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [partnerSlug, setPartnerSlug] = useState(""); // Sparar slug för redirect
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
  });

  // 1. Kolla om skolan redan är registrerad
  useEffect(() => {
    async function checkStatus() {
      if (!isLoaded || !user) return;

      try {
        const { data, error } = await supabase
          .from("partners")
          .select("*")
          .eq("clerk_id", user.id)
          .single();

        if (data) {
          setFormData({
            name: data.name || "",
            address: data.address || "",
            city: data.city || "",
            zip: data.zip || "",
          });
          setPartnerSlug(data.slug || data.id); // Spara slug eller ID för länken
          setIsLocked(true);
        }
      } catch (err) {
        console.error("Error fetching partner:", err);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, [user, isLoaded]);

  // Funktion för att skicka användaren till sin specifika dashboard
  const goToDashboard = () => {
    if (partnerSlug) {
      window.location.href = `/partner/${partnerSlug}/dashboard`;
    } else {
      alert("Hittar ingen profil att gå till.");
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    // Skapa en URL-vänlig slug från namnet (t.ex. "Leons Skola" -> "leons-skola")
    const generatedSlug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { data, error } = await supabase
      .from("partners")
      .insert([
        {
          clerk_id: user.id,
          name: formData.name,
          slug: generatedSlug, // Spara den snygga URL-biten
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
          email: user.primaryEmailAddress?.emailAddress,
          status: "active",
        },
      ])
      .select()
      .single();

    if (!error) {
      setPartnerSlug(generatedSlug);
      setIsLocked(true);
    } else {
      alert("Kunde inte spara: " + error.message);
    }
    setLoading(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black italic uppercase text-slate-400">
        <Loader2 className="animate-spin mr-2" /> Verifierar...
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-2xl">
            <Rocket size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter mb-4">
            Välkommen till YKB-Centralen
          </h1>
          <SignInButton mode="modal">
            <button className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-[1000] uppercase italic tracking-widest shadow-2xl hover:bg-blue-600 transition-all active:scale-95">
              Logga in / Skapa konto →
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-slate-50 p-6 md:p-20">
          <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="bg-slate-900 p-10 text-white text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <Rocket size={32} />
              </div>
              <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter">
                {isLocked ? "Profilen är klar" : "Slutför registrering"}
              </h1>
            </div>

            <form
              onSubmit={handleFinalSubmit}
              className="p-10 md:p-16 space-y-8"
            >
              {isLocked && (
                <div className="flex items-center gap-4 bg-green-50 p-6 rounded-2xl border border-green-100 text-green-700">
                  <CheckCircle2 className="shrink-0" />
                  <p className="text-sm font-bold uppercase italic leading-tight">
                    Uppgifterna är låsta. Kontakta support för ändringar.
                  </p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">
                    Skolnamn{" "}
                    {isLocked && <Lock size={10} className="inline ml-1" />}
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={20}
                    />
                    <input
                      disabled={isLocked}
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`w-full pl-14 pr-6 py-5 rounded-2xl border-2 outline-none transition-all font-bold ${
                        isLocked
                          ? "bg-slate-50 border-transparent text-slate-400"
                          : "bg-white border-slate-100 focus:border-blue-600"
                      }`}
                      placeholder="Ex: Leons Trafikskola"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">
                    Besöksadress
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={20}
                    />
                    <input
                      disabled={isLocked}
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className={`w-full pl-14 pr-6 py-5 rounded-2xl border-2 outline-none transition-all font-bold ${
                        isLocked
                          ? "bg-slate-50 border-transparent text-slate-400"
                          : "bg-white border-slate-100 focus:border-blue-600"
                      }`}
                      placeholder="Gatuadress 1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    disabled={isLocked}
                    required
                    placeholder="Stad"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className={`w-full px-6 py-5 rounded-2xl border-2 font-bold outline-none ${
                      isLocked
                        ? "bg-slate-50 border-transparent text-slate-400"
                        : "bg-white border-slate-100 focus:border-blue-600"
                    }`}
                  />
                  <input
                    disabled={isLocked}
                    required
                    placeholder="Postnummer"
                    value={formData.zip}
                    onChange={(e) =>
                      setFormData({ ...formData, zip: e.target.value })
                    }
                    className={`w-full px-6 py-5 rounded-2xl border-2 font-bold outline-none ${
                      isLocked
                        ? "bg-slate-50 border-transparent text-slate-400"
                        : "bg-white border-slate-100 focus:border-blue-600"
                    }`}
                  />
                </div>
              </div>

              {!isLocked ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-[1000] uppercase italic tracking-widest shadow-xl hover:bg-slate-900 transition-all active:scale-95 flex justify-center items-center"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Aktivera Skola & Börja Sälj →"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goToDashboard}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-[1000] uppercase italic tracking-widest hover:bg-blue-600 transition-all shadow-xl"
                >
                  Gå till kontrollpanelen
                </button>
              )}
            </form>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
