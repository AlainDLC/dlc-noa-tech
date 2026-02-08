"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase"; // Kontrollera din import-sökväg!
import { useRouter } from "next/navigation";
import { Truck, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // 1. Logga in i Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      setErrorMsg("Kunde inte logga in. Kontrollera uppgifterna.");
      setLoading(false);
      return;
    }

    // 2. Hämta Partner-profilen för att få tag i SLUG eller ID
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("id, slug, role")
      .eq("user_id", authData.user.id)
      .single();

    if (partnerError || !partner) {
      // Om ingen profil finns skickar vi dem till en standardsida
      router.push("/");
      return;
    }

    // 3. Skicka användaren rätt baserat på roll och slug
    if (partner.role === "admin") {
      router.push("/admin");
    } else {
      const identifier = partner.slug || partner.id;
      router.push(`/partner/${identifier}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        {/* LOGO */}
        <div className="flex justify-center mb-10 items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
            <Truck className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">
            YKB Centralen
          </span>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mb-2">
              Välkommen tillbaka
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              Logga in på din Partner-portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">
                E-postadress
              </label>
              <input
                type="email"
                required
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                placeholder="namn@företag.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">
                Lösenord
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200"
                  size={18}
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center mt-2">
                {errorMsg}
              </p>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 mt-6 hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Loggar in..." : "Logga in nu"}
              <ArrowRight size={20} />
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all tracking-[0.2em]"
          >
            ← Tillbaka till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}
