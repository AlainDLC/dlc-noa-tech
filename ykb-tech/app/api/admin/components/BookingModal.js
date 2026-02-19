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
  Zap,
  UserCheckIcon,
} from "lucide-react";

const validatePersonalId = (id) => {
  const cleanId = id.replace(/\D/g, "");
  return cleanId.length === 12;
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

    let newErrors = {};
    if (!validatePersonalId(formData.personalId)) {
      newErrors.personalId = "Ange 12 siffror";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const selectedCourse = school.schedule?.find(
      (c) => c.date === formData.selectedDate,
    );

    const newBooking = {
      partner_id: school.id,
      student_name: formData.studentName,
      student_email: formData.email,
      course_date: formData.selectedDate,
      amount: Number(selectedCourse?.price || 5000),
      commission_amount: Math.round(
        Number(selectedCourse?.price || 5000) * 0.15,
      ),
      status: "paid",
    };

    // Sparar bokningen och hämtar objektet (med ID)
    const result = await addBooking(newBooking);

    if (result && result.id) {
      // Minskar slots i databasen
      if (selectedCourse?.id) {
        await updateSlots(selectedCourse.id, -1);
      }
      // Skickar med ID till success-sidan för biljetten
      router.push(`/checkout/success?id=${result.id}`);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 text-slate-900">
      <div className="bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-xl sm:rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
        {/* HEADER */}
        <div className="p-6 md:p-10 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 z-20">
          <div>
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Snabba på - platserna går åt
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-slate-900 mt-2">
              Boka Utbildning.
            </h2>
            <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
              {school.name} — {school.city}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8"
        >
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 block">
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

                    {/* HÄR ÄR DIN KAMPANJ-LABEL */}
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

                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}
                      >
                        <Calendar size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isSelected ? "text-blue-600" : "text-slate-400"}`}
                        >
                          {item.date}
                        </span>
                        <span className="font-black text-slate-900 uppercase italic text-sm tracking-tight">
                          {item.label}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <div
                        className={`px-2 py-1 rounded-lg flex items-center gap-1 ${item.slots > 5 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
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

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 block">
              Dina uppgifter
            </label>
            <div className="space-y-3">
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  required
                  type="text"
                  placeholder="Fullständigt namn"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm"
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
                  placeholder="Personnummer (12 siffror)"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border-2 font-bold text-sm ${errors.personalId ? "border-red-200" : "border-transparent"}`}
                  onChange={(e) =>
                    setFormData({ ...formData, personalId: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    type="email"
                    placeholder="E-post"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm"
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
                    placeholder="Telefon"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="p-6 md:p-10 border-t border-slate-100 bg-white shrink-0 z-20 pb-10 sm:pb-10">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.studentName}
            className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase italic tracking-tighter text-lg hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Bearbetar...
              </>
            ) : (
              "Bekräfta & Boka"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
