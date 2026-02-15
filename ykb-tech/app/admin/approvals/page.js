"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Check, School, Mail, User, Copy, Clock, Loader2 } from "lucide-react";

export default function AdminApprovals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setupLink, setSetupLink] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const { data, error } = await supabase
      .from("onboarding_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (!error) setRequests(data);
    setLoading(false);
  }

  const handleApprove = async (request) => {
    setApprovingId(request.id);
    try {
      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: request.id,
          school_name: request.school_name,
          email: request.email,
        }),
      });

      const data = await res.json();

      if (res.ok && data.partner_id) {
        // Bygg den magiska länken
        const nextStepUrl = `${window.location.origin}/register?partner_id=${data.partner_id}`;
        const generatedLink = `${window.location.origin}/sign-up?email_address=${encodeURIComponent(request.email)}&fallbackRedirectUrl=${encodeURIComponent(nextStepUrl)}`;

        // Visa modalen
        setSetupLink({ link: generatedLink, name: request.school_name });

        // Ta bort från listan
        setRequests(requests.filter((r) => r.id !== request.id));
      } else {
        alert("Fel: " + (data.error || "Kunde inte generera länk"));
      }
    } catch (err) {
      alert("Kunde inte kontakta servern. Kontrollera middleware.");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-20 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* MODAL FÖR GENERERAD LÄNK */}
        {setupLink && (
          <div className="mb-10 bg-white border-4 border-blue-600 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-600 font-black uppercase text-xs mb-1 italic tracking-widest">
                  Partner Aktiverad!
                </p>
                <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter">
                  Länk för {setupLink.name}
                </h2>
              </div>
              <button
                onClick={() => setSetupLink(null)}
                className="text-slate-400 hover:text-slate-900 font-bold"
              >
                STÄNG
              </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 break-all font-mono text-[10px] text-blue-700">
              {setupLink.link}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(setupLink.link);
                alert("Kopierad!");
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
            >
              Kopiera Länk <Copy size={18} />
            </button>
          </div>
        )}

        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-2">
              System Admin
            </p>
            <h1 className="text-6xl font-[1000] italic uppercase tracking-tighter leading-none">
              Väntande <span className="text-blue-600">Ansökningar</span>
            </h1>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-xs font-black uppercase text-slate-400">
              Totalt i kö
            </p>
            <p className="text-3xl font-[1000]">{requests.length}</p>
          </div>
        </div>

        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                    <School size={20} />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                    {req.school_name}
                  </h3>
                </div>
                <div className="flex gap-4 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <User size={14} /> {req.contact_person}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {req.email}
                  </span>
                </div>
              </div>
              <button
                disabled={approvingId === req.id}
                onClick={() => handleApprove(req)}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {approvingId === req.id ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Godkänn Partner <Check size={18} />
                  </>
                )}
              </button>
            </div>
          ))}

          {requests.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 uppercase font-black text-slate-300">
              Inga nya ansökningar just nu
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
