import React, { useState } from "react";
import { User, Mail, Building2, Send, Loader2 } from "lucide-react";

export default function OnboardingForm({ onShowTerms }) {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      school: e.target.school.value,
    };

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        alert("SYSTEM_ERROR: " + errorData.error);
      }
    } catch (error) {
      alert("FATAL_ERROR: Kunde inte ansluta till servern.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-20 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
          <Send className="text-white" size={32} />
        </div>
        <h2 className="text-5xl font-[1000] uppercase italic mb-4 tracking-tighter text-slate-900 leading-none">
          DATA <span className="text-blue-600">MOTTAGEN</span>
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
          // VI ANALYSERAR DIN ANSÖKAN NU
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] p-10 md:p-16 border-2 border-slate-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8">
        <span className="text-[8px] font-black text-slate-200 uppercase tracking-[0.4em] vertical-text">
          DLC_ZEQ_SYS
        </span>
      </div>

      <h2 className="text-4xl font-[1000] uppercase italic mb-12 tracking-tighter text-slate-900 leading-none">
        BLI <span className="text-blue-600">PARTNER</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <User
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              name="name"
              required
              type="text"
              placeholder="ANSVARIG UTBILDARE"
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-slate-900 uppercase text-xs tracking-widest"
            />
          </div>
          <div className="relative">
            <Mail
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              name="email"
              required
              type="email"
              placeholder="SYSTEM_MAIL"
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-slate-900 uppercase text-xs tracking-widest"
            />
          </div>
        </div>

        <div className="relative">
          <Building2
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            name="school"
            required
            type="text"
            placeholder="TRAFIKSKOLANS NAMN"
            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-slate-900 uppercase text-xs tracking-widest"
          />
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 group hover:border-blue-600/30 transition-all">
          <div className="flex items-start gap-4">
            <input
              required
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="mt-1 w-6 h-6 accent-blue-600 cursor-pointer shrink-0"
            />
            <label
              htmlFor="terms"
              className="text-[10px] font-black text-slate-900 cursor-pointer leading-relaxed uppercase tracking-widest italic"
            >
              Jag godkänner de{" "}
              <button
                type="button"
                onClick={onShowTerms}
                className="text-blue-600 underline hover:text-blue-800"
              >
                KOMMERSIELLA VILLKOREN
              </button>{" "}
              och bekräftar giltigt tillstånd från Transportstyrelsen.
            </label>
          </div>
        </div>

        <div className="relative p-[2px] overflow-hidden rounded-2xl group isolate shadow-2xl">
          <div className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#2563eb_0%,#22c55e_50%,#166534_100%)] animate-border-rotate" />
          <button
            disabled={!acceptedTerms || loading}
            className={`relative w-full py-6 rounded-[calc(1rem-2px)] font-[1000] uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all italic ${
              acceptedTerms
                ? "bg-white text-slate-900 hover:bg-slate-50"
                : "bg-slate-100 text-slate-300"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                SKICKA INTRESSEANMÄLAN <Send size={18} strokeWidth={3} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
