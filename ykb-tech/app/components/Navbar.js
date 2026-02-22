import Link from "next/link";
import Image from "next/image";
import { Search as SearchIcon } from "lucide-react";

export default function Navbar({ searchTerm, setSearchTerm }) {
  return (
    <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-[100]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center">
              <Image
                alt="loga"
                src="/loga.png"
                width={160}
                height={160}
                className="object-contain"
              />
            </div>
            <span className="text-sm md:text-xl font-black italic tracking-tighter text-black uppercase text-nowrap">
              YKB CENTRALEN
            </span>
          </Link>
        </div>

        {/* SÖKFÄLT DESKTOP */}
        <div className="relative flex-1 max-w-md mx-4 hidden md:block">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            placeholder="Sök stad eller skola..."
            className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* MOBILSÖK */}
      <div className="md:hidden px-4 pb-4 bg-white/80 backdrop-blur-md">
        <div className="relative">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            value={searchTerm}
            placeholder="Sök stad eller skola..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl font-bold text-xs outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
}
