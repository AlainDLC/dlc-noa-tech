import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Info,
  ChevronRight,
  Zap,
} from "lucide-react";

export default function SchoolCard({
  school,
  isActive,
  isExpanded,
  onSelect,
  onToggleExpand,
  onBook,
}) {
  return (
    <div
      className={`group bg-white rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${
        isActive
          ? "border-blue-600 shadow-[0_30px_60px_-15px_rgba(37,99,235,0.2)] scale-[1.01]"
          : "border-slate-100 shadow-sm hover:border-blue-600/30"
      }`}
    >
      <div className="p-8 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
          <div onClick={onSelect} className="cursor-pointer group/title">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest italic group-hover:bg-blue-600 transition-colors">
                PARTNER // {school.city}
              </span>
            </div>
            <h3 className="font-[1000] italic tracking-tighter uppercase text-slate-900 leading-[0.9] mb-2 text-3xl md:text-4xl group-hover:text-blue-600 transition-colors">
              {school.name}
            </h3>
          </div>

          <div className="text-right bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-[1000] text-slate-400 uppercase tracking-widest mb-1 italic leading-none">
              STARTPRIS // SEK
            </p>
            <p className="text-3xl font-[1000] text-slate-900 italic tracking-tighter leading-none">
              {school.schedule?.[0]?.price || 4995}
            </p>
          </div>
        </div>

        {isActive && isExpanded && (
          <div className="mb-10 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in fade-in zoom-in duration-300">
            <p className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-blue-600 mb-4 flex items-center gap-2 italic">
              <Info size={14} /> SYSTEM_INFO // OM UTBILDNINGEN
            </p>
            <p className="text-slate-600 text-sm font-bold leading-relaxed whitespace-pre-line italic">
              {school.description || "INGEN MODULBESKRIVNING TILLGÄNGLIG."}
            </p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <p className="text-[10px] font-[1000] uppercase tracking-[0.3em] text-slate-300 flex items-center gap-2 italic">
            <Clock size={12} /> TILLGÄNGLIGA_STARTER
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {school.schedule?.map((item, idx) => (
              <div
                key={idx}
                className="relative flex items-center justify-between bg-white border border-slate-100 p-5 rounded-2xl group/item hover:border-blue-600 transition-all shadow-sm"
              >
                {item.campaign_label && (
                  <div className="absolute -top-3 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 z-10 animate-border-rotate">
                    <Zap
                      size={10}
                      fill="currentColor"
                      className="text-emerald-200"
                    />
                    <span className="text-[9px] font-black uppercase tracking-widest italic">
                      {item.campaign_label}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-[1000] text-slate-900 uppercase italic tracking-tighter">
                      {item.date}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                </div>

                <div
                  className={`shrink-0 px-3 py-1 rounded-lg flex items-center gap-1.5 ${item.slots > 5 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                >
                  <Users size={10} />
                  <span className="text-[9px] font-black uppercase italic">
                    {item.slots} KVAR
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-50 pt-8 mt-4">
          <button
            onClick={onToggleExpand}
            className="text-[10px] font-[1000] uppercase tracking-[0.2em] text-slate-300 hover:text-blue-600 transition-colors italic"
          >
            {isExpanded && isActive ? "// MINIMERA" : "// MER INFO"}
          </button>

          {/* DIN ANIMERADE BORDER-ROTATE KNAPP FRÅN DASHBOARD */}
          <div className="relative p-[2px] overflow-hidden rounded-2xl group isolate shadow-xl shadow-blue-100 w-full md:w-auto">
            <div className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#2563eb_0%,#22c55e_50%,#166534_100%)] animate-border-rotate" />

            <button
              onClick={onBook}
              className="relative w-full h-16 bg-white text-slate-900 px-12 rounded-[calc(1rem-2px)] font-[1000] uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all italic"
            >
              BOKA PLATS <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
