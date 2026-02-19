"use client";
import React from "react";
import { TrendingUp, ShieldCheck, Users, CreditCard } from "lucide-react";

export default function DashboardView({
  bookings = [],
  onboardingRequests = [],
  setActiveTab,
  payouts = [], // Nu använder vi denna lista istället!
}) {
  // 1. Beräkna Bruttovolym (Alla betalda bokningar)
  const totalVolume = bookings
    .filter((b) => b.status === "Completed" || b.status === "paid")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  // 2. Din vinst (15%)
  const totalCommission = totalVolume * 0.15;

  // 3. Realized (Det som faktiskt är UTBETALT - status 'paid_out')
  const realizedVolume = payouts
    .filter((p) => p.status === "paid_out")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  // 4. PAYOUT REQUESTS - Här är fixen!
  // Vi visar bara de som har status "pending_payout" i payouts-tabellen
  const pendingRequests = payouts.filter((p) => p.status === "pending_payout");

  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-slate-900">
      {/* --- HEADER & KPIS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-end">
        <div className="lg:col-span-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">
            System Status: Active
          </p>
          <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
            Enterprise
            <br />
            Control
          </h2>
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickStat
            label="Gross Volume (Total)"
            value={`${totalVolume.toLocaleString()} kr`}
            icon={<TrendingUp size={16} />}
          />
          <QuickStat
            label="Net Profit (15%)"
            value={`${totalCommission.toLocaleString()} kr`}
            icon={<ShieldCheck size={16} />}
          />
          <QuickStat
            label="Realized (Completed)"
            value={`${realizedVolume.toLocaleString()} kr`}
            icon={<Users size={16} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* --- PAYOUT REQUESTS --- */}
        <div className="xl:col-span-6">
          <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-black uppercase italic tracking-tighter text-2xl">
                  Payout Requests
                </h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                  Ready for settlement
                </p>
              </div>
              <span className="bg-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">
                {pendingRequests.length} Att betala
              </span>
            </div>

            <div className="space-y-4">
              {pendingRequests.map((p) => (
                <div
                  key={p.id}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl flex justify-between items-center"
                >
                  <div>
                    <p className="text-blue-400 text-[9px] font-black uppercase">
                      SKOLA
                    </p>
                    <p className="font-bold text-lg">{p.description}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase">
                      Netto: {p.amount.toLocaleString()} kr
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab?.("payouts")}
                    className="bg-white text-slate-900 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                  >
                    Process Payout
                  </button>
                </div>
              ))}

              {pendingRequests.length === 0 && (
                <p className="text-center py-10 text-slate-600 font-bold uppercase text-[10px]">
                  Inga väntande utbetalningar
                </p>
              )}
            </div>
          </section>
        </div>

        {/* --- ONBOARDING SECTION --- */}
        <div className="xl:col-span-6">
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 text-slate-900 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-black uppercase italic tracking-tighter text-2xl">
                  New Onboarding
                </h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                  Partner applications
                </p>
              </div>
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black">
                {onboardingRequests?.length || 0} NYA
              </span>
            </div>

            <div className="space-y-4">
              {onboardingRequests?.map((req, i) => (
                <div
                  key={i}
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center"
                >
                  <div>
                    <p className="text-blue-600 text-[9px] font-black uppercase">
                      {req.school_name}
                    </p>
                    <p className="font-bold text-slate-900">
                      {req.contact_person}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab?.("approvals")}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, icon }) {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2rem] flex items-center justify-between shadow-sm">
      <div>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">
          {label}
        </p>
        <p className="text-3xl font-black italic tracking-tighter">{value}</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-2xl text-slate-900">{icon}</div>
    </div>
  );
}
