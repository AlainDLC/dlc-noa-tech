export default function PriceTier({
  range,
  fee,
  label,
  description,
  active = false,
}) {
  return (
    <div
      className={`p-8 rounded-[2.5rem] border-2 transition-all ${active ? "border-blue-600 bg-blue-50/50 scale-105 shadow-2xl" : "border-slate-100 bg-white"}`}
    >
      <p className="text-[10px] font-black uppercase text-blue-600 mb-4">
        {label}
      </p>
      <h3 className="text-4xl font-black italic uppercase mb-2 leading-none text-slate-900">
        {range}
      </h3>
      <p className="text-6xl font-black mb-6 text-slate-900 leading-none">
        {fee}
      </p>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
        {description}
      </p>
    </div>
  );
}
