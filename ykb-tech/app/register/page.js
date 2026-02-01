"use client";
import { useState } from "react";
import Link from "next/link";
import { useData } from "../context/DataContext"; // Importerar din "motor"
import {
  ArrowLeft,
  Plus,
  School,
  MapPin,
  CreditCard,
  CheckCircle2,
  Phone,
  Mail,
} from "lucide-react";

export default function RegisterSchool() {
  const { addSchool } = useData(); // Hämtar funktionen för att spara skolan
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    price: "",
    courses: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Här skickar vi datan till vårt globala state
    addSchool({
      name: formData.name,
      city: formData.city,
      address: formData.address,
      price: formData.price + " kr",
      // Vi delar upp textsträngen till en array (lista) av kurser
      courses: formData.courses.split(",").map((c) => c.trim()),
      nextStart: "Snarast", // Standardvärde för demo
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-4 uppercase text-slate-900">
            Skolan Registrerad!
          </h1>
          <p className="text-slate-500 mb-8 font-medium">
            Nu har din skola lagts till i systemet. Elever kan nu hitta dina
            kurser i {formData.city || "hela Sverige"}.
          </p>
          <Link
            href="/search"
            className="bg-[#3d081b] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest inline-block shadow-xl hover:scale-105 transition-all"
          >
            Se din skola i sökresultaten
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* NAVBAR */}
      <nav className="h-20 bg-white border-b flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-900 font-black uppercase italic tracking-tighter hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={20} /> Tillbaka
          </Link>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Partnerportal
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto pt-16 px-6">
        <div className="mb-12">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
            Steg 1: Profil
          </span>
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-slate-900 leading-[0.85] mb-4">
            REGISTRERA <br />
            DIN TRAFIKSKOLA.
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Fyll i uppgifterna nedan för att börja synas för elever direkt.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FÖRETAGSUPPGIFTER */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Företagsuppgifter
              </label>
              <div className="relative">
                <School
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900"
                  placeholder="Skolans namn"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  required
                  type="email"
                  placeholder="E-post"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  required
                  type="tel"
                  placeholder="Telefon"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* PLATS OCH PRIS */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  required
                  placeholder="Stad"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900"
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <CreditCard
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  required
                  type="number"
                  placeholder="Pris (SEK)"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900"
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </div>
            <input
              required
              placeholder="Gatuadress"
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900"
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {/* UTBILDNINGAR */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Vilka kurser erbjuder ni?
            </label>
            <textarea
              required
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900 min-h-[100px]"
              placeholder="Separera med kommatecken: YKB Del 1, YKB Del 2..."
              onChange={(e) =>
                setFormData({ ...formData, courses: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full h-20 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:bg-blue-600 transition-all active:scale-95"
          >
            <Plus size={24} /> Slutför registrering
          </button>
        </form>
      </main>
    </div>
  );
}
