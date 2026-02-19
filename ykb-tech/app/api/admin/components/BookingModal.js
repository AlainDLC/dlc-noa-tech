"use client";
import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  User,
  Phone,
  Mail,
  Fingerprint,
  Loader2,
  User2Icon,
  Zap,
  UserCircle2,
  UserCheckIcon,
} from "lucide-react";

const validatePersonalId = (id) => {
  const cleanId = id.replace(/\D/g, "");
  return cleanId.length === 12;
};

const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export default function BookingModal({ school, onClose }) {
  const router = useRouter();
  const { addBooking, updateSlots } = useData();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    personalId: "",
    email: "",
    phone: "",
    selectedDate: school.schedule?.[0]?.date || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 1. Validering (Behåll din befintliga)
    let newErrors = {};
    if (!validatePersonalId(formData.personalId)) {
      newErrors.personalId = "Ange 12 siffror";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // 2. Hitta kursen för att få rätt pris
    const selectedCourse = school.schedule?.find(
      (c) => c.date === formData.selectedDate,
    );
    const finalPrice = Number(selectedCourse?.price || 30000);

    // 3. SKAPA OBJEKTET - Här var felet tidigare!
    // Vi mappar formData.studentName -> student_name
    const newBooking = {
      partner_id: school.id, // VIKTIGT: Måste heta partner_id
      student_name: formData.studentName,
      student_email: formData.email,
      course_date: formData.selectedDate,
      amount: Number(selectedCourse?.price || 30000),
      commission_amount: Math.round(
        Number(selectedCourse?.price || 30000) * 0.15,
      ),
      status: "paid",
    };

    // DEBUG: Logga objektet innan det skickas för att se att student_name INTE är null
    console.log("Objekt som skickas till Supabase:", newBooking);

    // 4. Spara via Context
    const success = await addBooking(newBooking);

    if (success) {
      if (selectedCourse?.id) {
        await updateSlots(selectedCourse.id, -1);
      }
      router.push("/checkout/success");
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-slate-900">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 z-10 disabled:opacity-50"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Snabba på - platserna går åt
            </span>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mt-2">
              Boka Utbildning.
            </h2>
            <p className="text-slate-600 text-sm font-light p-0">
              {school.name} - {school.city}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* DATUM-VAL */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                Välj startdatum
              </label>
              <div className="grid grid-cols-1 gap-3">
                {school.schedule?.map((item, idx) => {
                  const isSelected = formData.selectedDate === item.date;

                  return (
                    <label
                      key={idx}
                      className={`relative flex items-center justify-between p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100"
                          : "border-slate-100 hover:border-blue-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="date"
                        className="hidden"
                        disabled={isSubmitting}
                        onChange={() =>
                          setFormData({ ...formData, selectedDate: item.date })
                        }
                        checked={isSelected}
                      />

                      {/* --- KAMPANJ-BADGE (Om den finns) --- */}
                      {item.campaign_label && (
                        <div className="absolute -top-2.5 left-6 bg-emerald-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                          <Zap
                            size={10}
                            fill="currentColor"
                            className="text-emerald-200"
                          />
                          <span className="text-[8px] font-black uppercase tracking-widest">
                            {item.campaign_label}
                          </span>
                        </div>
                      )}

                      {/* --- VÄNSTER SIDA: DATUM & NAMN --- */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <Calendar size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${
                              isSelected ? "text-blue-600" : "text-slate-400"
                            }`}
                          >
                            {item.date}
                          </span>
                          <span className="font-black text-slate-900 uppercase italic text-sm tracking-tight">
                            {item.label}
                          </span>
                        </div>
                      </div>

                      {/* --- HÖGER SIDA: STATUS & PRIS --- */}
                      <div className="text-right flex flex-col items-end gap-1">
                        <div
                          className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
                            item.slots > 5
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          <UserCheckIcon size={10} />
                          <span className="text-[9px] font-black uppercase">
                            {item.slots} kvar
                          </span>
                        </div>
                        <p className="text-lg font-[1000] text-slate-900 italic tracking-tighter leading-none">
                          {item.price.toLocaleString()}{" "}
                          <span className="text-[10px] not-italic text-slate-400">
                            KR
                          </span>
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* FORMULÄR-FÄLT */}
            <div className="space-y-3 pt-4 text-slate-900">
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  required
                  type="text"
                  disabled={isSubmitting}
                  placeholder="Fullständigt namn"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm disabled:opacity-50"
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <Fingerprint
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.personalId ? "text-red-500" : "text-slate-400"}`}
                  size={18}
                />
                <input
                  required
                  type="text"
                  disabled={isSubmitting}
                  placeholder="Personnummer (12 siffror)"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all font-bold text-sm ${
                    errors.personalId
                      ? "border-red-200 focus:ring-red-500"
                      : "border-transparent focus:ring-blue-600"
                  } disabled:opacity-50`}
                  onChange={(e) =>
                    setFormData({ ...formData, personalId: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? "text-red-500" : "text-slate-400"}`}
                  size={18}
                />
                <input
                  required
                  type="email"
                  disabled={isSubmitting}
                  placeholder="Din E-post"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all font-bold text-sm ${
                    errors.email
                      ? "border-red-200 focus:ring-red-500"
                      : "border-transparent focus:ring-blue-600"
                  } disabled:opacity-50`}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  required
                  type="tel"
                  disabled={isSubmitting}
                  placeholder="Telefonnummer"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm disabled:opacity-50"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase italic tracking-tighter text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-6 flex items-center justify-center gap-2 disabled:bg-slate-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Bearbetar...
                </>
              ) : (
                "Bekräfta & Boka"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
