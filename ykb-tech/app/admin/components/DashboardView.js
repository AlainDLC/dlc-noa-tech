// components/DashboardView.js
import React from "react";
import { TrendingUp, ShieldCheck, Users, Send, Clock } from "lucide-react";

export default function DashboardView({ bookings, onboardingRequests }) {
  const totalVolume = (bookings?.length || 0) * 5000;
  const totalCommission = totalVolume * 0.15;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
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
            label="Gross Volume"
            value={`${totalVolume.toLocaleString()} kr`}
            icon={<TrendingUp size={16} />}
          />
          <QuickStat
            label="Net Profit"
            value={`${totalCommission.toLocaleString()} kr`}
            icon={<ShieldCheck size={16} />}
          />
          <QuickStat
            label="Active Drivers"
            value={`${bookings?.length || 0} st`}
            icon={<Users size={16} />}
          />
        </div>
      </div>

      {/* --- ONBOARDING SECTION --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-5">
          <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-black uppercase italic tracking-tighter text-2xl">
                    New Requests
                  </h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                    Pending approval
                  </p>
                </div>
                <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black animate-pulse">
                  {onboardingRequests?.length || 0} NYA
                </span>
              </div>

              <div className="space-y-4">
                {onboardingRequests?.map((req, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-blue-400 text-[9px] font-black uppercase mb-1">
                          {req.school}
                        </p>
                        <p className="font-bold text-lg leading-tight">
                          {req.name}
                        </p>
                      </div>
                      <Clock size={14} className="text-slate-600" />
                    </div>
                    <button className="w-full bg-white text-slate-900 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2">
                      Send Magic Link <Send size={12} />
                    </button>
                  </div>
                ))}
                {(!onboardingRequests || onboardingRequests.length === 0) && (
                  <p className="text-center py-10 text-slate-500 font-bold uppercase text-xs italic">
                    Inga väntande ansökningar
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="xl:col-span-7">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 h-full flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
              Live Insights kommer snart
            </h3>
            <p className="text-slate-400 text-sm font-medium max-w-xs uppercase tracking-tight">
              Här kommer vi visualisera tillväxten i realtid med React Query
              grafer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, icon }) {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2rem] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
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
