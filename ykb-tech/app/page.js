import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  Search,
  Building2,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      {/* NAVBAR */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="text-white" size={24} />
            </div>
            <span className="text-xl font-black italic tracking-tighter text-[#3d081b] uppercase">
              YKB LEVERANTÖRERNA
            </span>
          </Link>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            {/* LÄNK TILL TRAFIKSKOLORNA */}
            <Link
              href="/register"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-[#3d081b] hover:bg-slate-50 transition-all font-bold text-sm border border-transparent hover:border-slate-100"
            >
              <Building2 size={16} />
              För Trafikskolor
            </Link>

            <Link href="/search">
              <button className="bg-[#3d081b] text-white px-6 py-2.5 rounded-full font-black text-sm hover:scale-105 transition-all shadow-md active:scale-95 flex items-center gap-2">
                Hitta Utbildning
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-24 pb-32 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Status: Online & Säkrad
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            FRAMTIDENS <br />
            <span className="text-[#3d081b]">YKB-PORTAL.</span>
          </h1>
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
            Hitta, boka och genomför dina kurser på ett ställe. Vi håller dina
            pengar tills du har fått ditt intyg. Tryggt för dig, enkelt för
            skolan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/search">
              <button className="h-16 px-10 bg-[#3d081b] text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:bg-black transition-all">
                <Search size={20} /> Börja Sökningen
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* INFO BLOCKS */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 pb-32">
        {[
          {
            icon: <ShieldCheck className="text-green-600" size={32} />,
            title: "Escrow-Säkerhet",
            desc: "Vi agerar oberoende mellanhand och säkrar transaktionen för båda parter.",
          },
          {
            icon: <Zap className="text-blue-600" size={32} />,
            title: "Real-tids bokning",
            desc: "Se direkt när nästa ADR eller YKB-kurs startar i din stad.",
          },
          {
            icon: <Building2 className="text-[#3d081b]" size={32} />,
            title: "Certifierade skolor",
            desc: "Vi samarbetar endast med utbildare som är godkända av Transportstyrelsen.",
          },
        ].map((block, i) => (
          <div
            key={i}
            className="p-8 bg-slate-50 rounded-[2.5rem] space-y-4 border border-transparent hover:border-slate-200 transition-colors"
          >
            {block.icon}
            <h3 className="font-black uppercase text-sm italic">
              {block.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              {block.desc}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
