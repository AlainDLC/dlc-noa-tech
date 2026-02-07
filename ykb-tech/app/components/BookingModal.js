"use client";
import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useRouter } from "next/navigation";
import {
  X,
  CheckCircle,
  Calendar,
  User,
  Phone,
  Mail,
  Fingerprint,
} from "lucide-react"; // La till Mail och Fingerprint

const validatePersonalId = (id) => {
  // Rensar bort eventuella bindestreck för att kolla längden
  const cleanId = id.replace(/\D/g, "");
  return cleanId.length === 12; // Vi kräver 12 siffror (ÅÅÅÅMMDDXXXX)
};

const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export default function BookingModal({ school, onClose }) {
  const router = useRouter();
  const { addBooking, updateSlots } = useData(); // La till updateSlots här
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    studentName: "",
    personalId: "", // NY
    email: "", // NY
    phone: "",
    selectedDate: school.schedule?.[0]?.date || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // ... din valideringslogik här (behåll den som den är) ...
    let newErrors = {};
    if (!validatePersonalId(formData.personalId)) {
      newErrors.personalId = "Ange 12 siffror (ÅÅÅÅMMDDXXXX)";
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Ange en giltig e-postadress";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // --- HÄR HÄNDER DET ---

    // 1. Skapa ett unikt ID för QR-koden
    const bookingId =
      "YKB-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const newBooking = {
      id: bookingId, // VIKTIGT: Lägg till ID här!
      name: formData.studentName, // Ändra studentName -> name så det matchar Success-sidan
      ssn: formData.personalId, // Ändra personalId -> ssn
      email: formData.email,
      phone: formData.phone,
      schoolId: school.id,
      date: formData.selectedDate,
      status: "PENDING",
    };

    // 2. Spara i systemet
    addBooking(newBooking);

    // 3. Dra av platsen
    const dateIndex = school.schedule?.findIndex(
      (s) => s.date === formData.selectedDate,
    );
    if (dateIndex !== -1) {
      updateSlots(school.id, dateIndex, -1);
    }

    // 4. NAVIGERA TILL SUCCESS-SIDAN
    // Vi skickar användaren till din nya sida!
    router.push("/checkout/success");
  };

  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl border-4 border-emerald-500">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mb-2">
            Bokad & Klar!
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            Platsen på {school.name} är reserverad. Skolan kontaktar dig snart!
          </p>
          <button
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
          >
            Stäng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden relative text-black">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 z-10"
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
            <p className="text-slate-500 text-sm font-medium">
              {school.name} - {school.city}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* DATUM-VAL */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">
                Välj startdatum
              </label>
              <div className="grid grid-cols-1 gap-2">
                {school.schedule?.map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.selectedDate === item.date ? "border-blue-600 bg-blue-50" : "border-slate-100 hover:border-slate-200"}`}
                  >
                    <input
                      type="radio"
                      name="date"
                      className="hidden"
                      onChange={() =>
                        setFormData({ ...formData, selectedDate: item.date })
                      }
                      checked={formData.selectedDate === item.date}
                    />
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />{" "}
                      {item.date}
                    </span>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">
                      {item.slots} kvar
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* FORMULÄR-FÄLT */}
            <div className="space-y-3 pt-4">
              {/* Namn */}
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

              {/* Personnummer */}
              <div className="relative">
                <Fingerprint
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.personalId ? "text-red-500" : "text-slate-400"}`}
                  size={18}
                />
                <input
                  required
                  type="text"
                  placeholder="Personnummer (12 siffror)"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all font-bold text-sm text-black ${
                    errors.personalId
                      ? "border-red-200 focus:ring-red-500"
                      : "border-transparent focus:ring-blue-600"
                  }`}
                  onChange={(e) =>
                    setFormData({ ...formData, personalId: e.target.value })
                  }
                />
                {errors.personalId && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 italic">
                    {errors.personalId}
                  </p>
                )}
              </div>

              {/* E-post */}
              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? "text-red-500" : "text-slate-400"}`}
                  size={18}
                />
                <input
                  required
                  type="email"
                  placeholder="Din E-post"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all font-bold text-sm text-black ${
                    errors.email
                      ? "border-red-200 focus:ring-red-500"
                      : "border-transparent focus:ring-blue-600"
                  }`}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 italic">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Telefon */}
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  required
                  type="tel"
                  placeholder="Telefonnummer"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase italic tracking-tighter text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-6">
              Bekräfta & Boka
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
