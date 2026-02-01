"use client";
import { useState } from "react";
import Link from "next/link";
import { useData } from "../context/DataContext";
import {
  ArrowLeft,
  Plus,
  School,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  Loader2,
  Calendar,
  Trash2, // Importera papperskorgen för att kunna ta bort datum
} from "lucide-react";

export default function RegisterSchool() {
  const { addSchool } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // State för grunddata
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    price: "",
    courses: "",
    phone: "",
    email: "",
    description: "",
  });

  // NYTT: State för flera utbildningstider
  const [schedule, setSchedule] = useState([{ date: "", label: "" }]);

  const addScheduleRow = () => {
    setSchedule([...schedule, { date: "", label: "" }]);
  };

  const removeScheduleRow = (index) => {
    const newSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(newSchedule);
  };

  const updateSchedule = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await addSchool({
      ...formData,
      price: formData.price + " kr",
      courses: formData.courses.split(",").map((c) => c.trim()),
      // Vi skickar med hela schemat och sätter första datumet som "nextStart" för snabbvisning
      schedule: schedule,
      nextStart: schedule[0]?.date || "Ej satt",
    });

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-4 uppercase text-slate-900 leading-tight">
            Skolan <br /> Registrerad!
          </h1>
          <p className="text-slate-500 mb-8 font-medium">
            Din skola och dina {schedule.length} inplanerade kurser är nu
            synliga på kartan.
          </p>
          <Link
            href="/search"
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest inline-block shadow-xl hover:bg-blue-700 transition-all"
          >
            Se resultatet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <nav className="h-20 bg-white border-b flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-900 font-black uppercase italic tracking-tighter"
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
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-[0.85] mb-4">
            REGISTRERA <br /> VERKSAMHET.
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* KONTAKT & ADRESS (Samma som innan) */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <input
              required
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900"
              placeholder="Skolans namn"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                required
                placeholder="Stad"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900"
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
              <input
                required
                type="number"
                placeholder="Pris (SEK)"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <input
              required
              placeholder="Exakt gatuadress"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900"
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {/* NY DYNAMISK SEKTION: FLERA UTBILDNINGSTIDER */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Kommande kurstillfällen
              </label>
              <button
                type="button"
                onClick={addScheduleRow}
                className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase hover:bg-green-100 transition-colors"
              >
                <Plus size={12} /> Lägg till tid
              </button>
            </div>

            {schedule.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 items-center animate-in fade-in slide-in-from-top-1"
              >
                <div className="relative flex-1">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    required
                    type="date"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-slate-900"
                    value={item.date}
                    onChange={(e) =>
                      updateSchedule(index, "date", e.target.value)
                    }
                  />
                </div>
                <input
                  required
                  placeholder="T.ex. YKB Del 1"
                  className="flex-[1.5] px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm text-slate-900"
                  value={item.label}
                  onChange={(e) =>
                    updateSchedule(index, "label", e.target.value)
                  }
                />
                {schedule.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeScheduleRow(index)}
                    className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* KURSUTBUD (TAGGAR) */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Generellt Kursutbud (separera med kommatecken)
            </label>
            <textarea
              required
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900 min-h-[80px]"
              placeholder="YKB, ADR, Truck, Grävmaskin"
              onChange={(e) =>
                setFormData({ ...formData, courses: e.target.value })
              }
            />
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Om utbildaren / Beskrivning
            </label>
            <textarea
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900 min-h-[120px] resize-none"
              placeholder="Berätta om er skola, t.ex: 'Vi erbjuder erfarna lärare och bjuder på lunch. Våra lokaler ligger nära centralstationen...'"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-20 rounded-[2rem] bg-slate-900 text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:bg-blue-600 transition-all disabled:bg-slate-300"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              "Slutför registrering"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
