import { Truck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-white pt-32 pb-16 px-6 overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-24">
          <div className="md:col-span-5 space-y-8 text-slate-900">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                <Truck size={18} className="text-white" />
              </div>
              <span className="font-black italic uppercase tracking-tighter text-xl">
                YKB
              </span>
            </div>
            <p className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-[0.85] text-slate-200">
              Framtiden är <br />{" "}
              <span className="text-slate-900 font-black">
                Digital & Säkrad.
              </span>
            </p>
          </div>

          {/* Här kan du enkelt lägga till kolumner för länkar senare */}
        </div>

        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 italic">
            © 2026 DLC TECH ZEQ SYSTEM
          </p>

          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100 text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="italic">Systems Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
