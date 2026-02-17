"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSignIn, useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

  const handleRouting = (partner) => {
    if (partner.role === "admin") {
      router.push("/admin");
    } else {
      const identifier = partner.slug || partner.id;
      router.push(`/partner/${identifier}/dashboard`);
    }
  };

  useEffect(() => {
    const checkPartner = async () => {
      if (user) {
        const { data: partner } = await supabase
          .from("partners")
          .select("id, slug, role, clerk_id")
          .eq("clerk_id", user.id)
          .single();

        if (partner) {
          handleRouting(partner);
        }
      }
    };
    checkPartner();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err) {
      setErrorMsg("OGILTIGA UPPGIFTER. FÖRSÖK IGEN.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* BAKGRUNDSDEKOR (Matchar startsidans mjuka blur) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-slate-50 blur-[120px]" />
      </div>

      <div className="max-w-[440px] w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* LOGO SEKTION */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="mb-8 relative group">
            <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
            <Image
              alt="YKB Centralen"
              src="/loga.png"
              width={140}
              height={140}
              className="object-contain relative z-10"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full text-[9px] font-[1000] uppercase tracking-[0.2em] mb-4 text-slate-400 border border-slate-100">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Säkrad Partner Port
          </div>

          <h1 className="text-4xl font-[1000] tracking-[-0.04em] uppercase italic leading-none">
            VÄLKOMMEN <br />
            <span className="text-blue-600">TILLBAKA.</span>
          </h1>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 relative">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-slate-400 ml-1">
                Identifiering
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-5 pl-14 pr-6 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900 placeholder:text-slate-300 text-sm italic"
                  placeholder="NAMN@FORETAG.SE"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-slate-400 ml-1">
                Säkerhetskod
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-5 pl-14 pr-6 font-bold outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900 placeholder:text-slate-300 text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="pt-2 flex items-center justify-center gap-2">
                <span className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                <p className="text-red-500 text-[9px] font-black uppercase tracking-widest text-center">
                  {errorMsg}
                </p>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 hover:bg-blue-600 text-white py-6 rounded-[1.25rem] font-black uppercase italic tracking-[0.2em] flex items-center justify-center gap-3 mt-6 transition-all active:scale-[0.98] shadow-2xl shadow-slate-200 hover:shadow-blue-100 disabled:opacity-50 group text-xs"
            >
              {loading ? (
                <Loader2 className="animate-spin text-white" size={20} />
              ) : (
                <>
                  Logga in nu
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <Link
            href="/"
            className="text-[10px] font-black uppercase text-slate-300 hover:text-blue-600 transition-all tracking-[0.3em] flex items-center gap-2"
          >
            ← Tillbaka till startsidan
          </Link>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-green-50 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 italic text-[9px] font-black uppercase tracking-widest">
              Systems Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
