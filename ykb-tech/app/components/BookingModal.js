"use client";
import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { X, CheckCircle, Calendar, User, Phone } from "lucide-react";

export default function BookingModal({ school, onClose }) {
  const { addBooking } = useData();
  const [step, setStep] = useState(1); // 1: Formulär, 2: Bekräftelse
  const [formData, setFormData] = useState({
    studentName: "",
    phone: "",
    selectedDate: school.schedule?.[0]?.date || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Skapa bokningsobjektet
    const newBooking = {
      studentName: formData.studentName,
      courseLabel: school.name,
      date: formData.selectedDate,
      status: "PENDING", // Startar som väntande
      schoolId: school.id,
      phone: formData.phone,
    };

    addBooking(newBooking);
    setStep(2); // Visa succé-skärmen
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
            Din plats på {school.name} är nu reserverad. Skolan kommer kontakta
            dig via telefon.
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
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
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
            {/* VÄLJ DATUM */}
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
                      {item.slots} platser kvar
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* ELEVUPPGIFTER */}
            <div className="space-y-3 pt-4">
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  required
                  type="text"
                  placeholder="Ditt fullständiga namn"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
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
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase italic tracking-tighter text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-6">
              Bekräfta Bokning
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
