"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useData } from "../context/DataContext";
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  Loader2,
  Trash2,
  Lock,
  FileText, // Ny ikon för detaljer
} from "lucide-react";

export default function RegisterSchool() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addSchool, updateSchool, schools } = useData();
  const searchParams = useSearchParams();
  const router = useRouter();

  const editId = searchParams.get("edit");
  const partnerId = searchParams.get("partnerId");

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    kampanj: "",
    courses: "",
    phone: "",
    description: "", // <--- Detaljer/Beskrivning
  });

  const [schedule, setSchedule] = useState([
    { date: "", label: "", price: "", slots: "" },
  ]);

  useEffect(() => {
    const targetId = editId || partnerId;
    if (targetId && schools.length > 0) {
      const schoolToEdit = schools.find(
        (s) =>
          s.id.toString() === targetId.toString() || s.schoolId === targetId,
      );
      if (schoolToEdit) {
        setFormData({
          name: schoolToEdit.name || "",
          city: schoolToEdit.city || "",
          address: schoolToEdit.address || "",
          kampanj: schoolToEdit.price || "",
          courses: Array.isArray(schoolToEdit.courses)
            ? schoolToEdit.courses.join(", ")
            : schoolToEdit.courses || "",
          phone: schoolToEdit.phone || "",
          description: schoolToEdit.description || "", // Ladda in befintlig beskrivning
        });

        if (editId && schoolToEdit.schedule) {
          setSchedule(schoolToEdit.schedule);
        }
      }
    }
  }, [editId, partnerId, schools]);

  const addScheduleRow = () => {
    setSchedule([...schedule, { date: "", label: "", price: "", slots: "" }]);
  };

  const removeScheduleRow = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const updateSchedule = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const courseArray =
      typeof formData.courses === "string"
        ? formData.courses
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c !== "")
        : formData.courses;

    // 1. Hitta om skolan redan finns
    const existingSchool = schools.find(
      (s) => s.id.toString() === (editId || partnerId)?.toString(),
    );

    let finalSchoolData;

    if (existingSchool && partnerId && !editId) {
      // 2. OM VI LÄGGER TILL NY KURS (via partnerId):
      // Vi behåller allt gammalt men lägger till de NYA datumen i schedule-listan
      finalSchoolData = {
        ...existingSchool,
        schedule: [...existingSchool.schedule, ...schedule], // Slår ihop gamla + nya datum
        nextStart: schedule[0]?.date || existingSchool.nextStart,
      };
    } else {
      // 3. OM VI REDIGERAR ETT SPECIFIKT DATUM (via editId) eller skapar helt ny:
      finalSchoolData = {
        ...formData,
        id: editId || partnerId || (schools.length + 1).toString(),
        schoolId: partnerId || editId,
        price: formData.kampanj,
        courses: courseArray,
        schedule: schedule, // Här ersätter vi (eftersom vi redigerar)
        nextStart: schedule[0]?.date || "Ej satt",
        rating: 5.0,
        description: formData.description,
      };
    }

    // 4. Spara till "hjärnan" (DataContext)
    if (existingSchool) {
      await updateSchool(finalSchoolData);
    } else {
      await addSchool(finalSchoolData);
    }

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
            Sparat & <br /> Klart!
          </h1>
          <button
            onClick={() => router.push(`/partner/${partnerId || editId}`)}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest inline-block shadow-xl hover:bg-blue-700 transition-all mt-4"
          >
            Tillbaka till Hubben
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <nav className="h-20 bg-white border-b flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-900 font-black uppercase italic tracking-tighter"
          >
            <ArrowLeft size={20} /> Avbryt
          </button>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
            Redigeringsläge
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto pt-16 px-6">
        <div className="mb-12">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-[0.85] mb-4">
            {formData.name || "VERKSAMHET"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GRUNDINFO */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="relative">
              <input
                required
                readOnly={!!partnerId}
                value={formData.name}
                className={`w-full px-6 py-4 border-none rounded-2xl outline-none font-bold text-slate-900 ${partnerId ? "bg-slate-100 text-slate-400" : "bg-slate-50"}`}
                placeholder="Skolans namn"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {partnerId && (
                <Lock
                  className="absolute right-4 top-4 text-slate-300"
                  size={16}
                />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  required
                  disabled={!!partnerId} // <--- Lägg till denna
                  readOnly={!!partnerId} // <--- Lägg till denna
                  value={formData.name}
                  className={`w-full px-6 py-4 border-none rounded-2xl outline-none font-bold ${
                    partnerId
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-inner"
                      : "bg-slate-50 text-slate-900"
                  }`}
                  placeholder="Skolans namn"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {partnerId && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">
                      Kontakta support för namnbyte
                    </span>
                    <Lock className="text-slate-400" size={16} />
                  </div>
                )}
              </div>
              <input
                type="number"
                value={formData.kampanj}
                placeholder="BASPRIS (KR)"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900"
                onChange={(e) =>
                  setFormData({ ...formData, kampanj: e.target.value })
                }
              />
            </div>
          </div>

          {/* DATUM & KURSER */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Kursdatum
              </label>
              <button
                type="button"
                onClick={addScheduleRow}
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all shadow-lg"
              >
                <Plus size={12} strokeWidth={4} /> Nytt datum
              </button>
            </div>

            {schedule.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 rounded-2xl space-y-3"
              >
                <div className="flex gap-3">
                  <input
                    required
                    type="date"
                    className="flex-1 px-4 py-3 bg-white border-none rounded-xl font-bold text-sm"
                    value={item.date}
                    onChange={(e) =>
                      updateSchedule(index, "date", e.target.value)
                    }
                  />
                  <input
                    required
                    placeholder="T.ex. Delkurs 1"
                    className="flex-[1.5] px-4 py-3 bg-white border-none rounded-xl font-bold text-sm"
                    value={item.label}
                    onChange={(e) =>
                      updateSchedule(index, "label", e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    required
                    type="number"
                    placeholder="Pris"
                    className="flex-1 px-4 py-3 bg-white border-none rounded-xl font-bold text-xs"
                    value={item.price}
                    onChange={(e) =>
                      updateSchedule(index, "price", e.target.value)
                    }
                  />
                  <input
                    required
                    type="number"
                    placeholder="Platser"
                    className="w-24 px-4 py-3 bg-white border-none rounded-xl font-bold text-xs"
                    value={item.slots}
                    onChange={(e) =>
                      updateSchedule(index, "slots", e.target.value)
                    }
                  />
                  {schedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeScheduleRow(index)}
                      className="p-2 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* BESKRIVNING / DETALJER (TILLBAKA!) */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 ml-1">
              <FileText size={14} className="text-slate-400" />
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Om utbildaren & Detaljer
              </label>
            </div>
            <textarea
              required
              value={formData.description}
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-900 min-h-[150px] resize-none"
              placeholder="Berätta om er skola, t.ex: 'Vi bjuder på lunch och fika. Våra lärare har 20 års erfarenhet...'"
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
              "Spara ändringar"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
