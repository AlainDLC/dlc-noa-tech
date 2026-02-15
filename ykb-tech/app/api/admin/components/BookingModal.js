"use client";
import React, { useState } from "react";
import { useData } from "../../../context/DataContext";
import { useRouter } from "next/navigation";
import {
  X,
  CheckCircle,
  Calendar,
  User,
  Phone,
  Mail,
  Fingerprint,
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
  const [formData, setFormData] = useState({
    studentName: "",
    personalId: "",
    email: "",
    phone: "",
    selectedDate: school.schedule?.[0]?.date || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validering
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

    // 2. Hitta den valda kursen för att få RÄTT PRIS och ID
    const selectedCourse = school.schedule?.find(
      (c) => c.date === formData.selectedDate,
    );

    // 3. Skapa bokningsobjektet (Utan hårdkodat ID - Supabase skapar UUID)
    const newBooking = {
      name: formData.studentName,
      ssn: formData.personalId,
      email: formData.email,
      phone: formData.phone,
      schoolId: school.id,
      date: formData.selectedDate,
      // Här hämtas priset dynamiskt från kursen, annars skolans standardpris
      price: selectedCourse?.price || school.price || 9500,
      status: "paid",
    };

    // 4. Spara i Supabase via Context
    const success = await addBooking(newBooking);

    if (success) {
      // 5. Dra av platsen i databasen
      if (selectedCourse?.id) {
        updateSlots(selectedCourse.id, -1);
      }
      // 6. Skicka till framgångssidan
      router.push("/checkout/success");
    }
  };

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
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.selectedDate === item.date
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
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
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md mb-1">
                        {item.slots} kvar
                      </span>
                      <span className="text-[10px] font-black text-slate-900 italic">
                        {item.price} kr
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* FORMULÄR-FÄLT */}
            <div className="space-y-3 pt-4">
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
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border-2 transition-all font-bold text-sm text-black ${
                    errors.personalId
                      ? "border-red-200 focus:ring-red-500"
                      : "border-transparent focus:ring-blue-600"
                  }`}
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
              </div>

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
