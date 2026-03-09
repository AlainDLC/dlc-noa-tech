"use client";
import Image from "next/image";

export default function TalentBadge({ score, variant = "default" }) {
  const accentGradient = "from-blue-600 via-green-500 to-green-800";
  const isWatermark = variant === "watermark";

  return (
    <div
      className={`relative flex justify-center items-center ${isWatermark ? "" : "py-6 sm:py-12"} animate-appearance-in w-full`}
    >
      {/* Glow döljs om det är ett vattenmärke */}
      {!isWatermark && (
        <div
          className={`absolute w-full sm:w-80 h-40 bg-gradient-to-r ${accentGradient} opacity-5 blur-[60px] sm:blur-[100px] rounded-full`}
        />
      )}

      {/* Kortet: Om vattenmärke, ta bort bakgrund, ram och skugga */}
      <div
        className={`w-full max-w-[380px] relative overflow-hidden transition-all ${
          isWatermark
            ? "bg-transparent border-none shadow-none scale-150"
            : "border-2 border-zinc-200 bg-white shadow-2xl rounded-[2rem]"
        }`}
      >
        <div
          className={`${isWatermark ? "p-0" : "p-6 sm:p-10"} flex flex-col items-center relative z-10`}
        >
          <div className="w-full flex flex-col items-center mb-6">
            <Image
              alt="logo"
              src="/loga.png"
              width={isWatermark ? 120 : 160}
              height={50}
              className="object-contain"
              priority
            />
            <div
              className={`h-1 w-20 bg-gradient-to-r ${accentGradient} rounded-full mt-2 opacity-60`}
            />
          </div>

          <div className="flex flex-col items-center mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-1 italic">
              Examination Fullföljd
            </p>
            <h4
              className={`text-7xl ${isWatermark ? "sm:text-8xl" : "sm:text-9xl"} font-[1000] italic tracking-tighter leading-none bg-gradient-to-br ${accentGradient} bg-clip-text text-transparent`}
              style={{ WebkitBackgroundClip: "text" }}
            >
              {score}
              <span className="text-3xl ml-1 text-zinc-300">%</span>
            </h4>
          </div>

          <div className="inline-flex items-center justify-center font-[1000] uppercase italic text-[11px] px-8 h-10 border-2 border-slate-900 bg-slate-900 text-white rounded-xl shadow-xl">
            Verifierad Trafikutbildare
          </div>
        </div>
      </div>
    </div>
  );
}
