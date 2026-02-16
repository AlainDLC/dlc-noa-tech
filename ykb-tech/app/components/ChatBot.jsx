"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("student");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const scrollRef = useRef(null);

  useEffect(() => {
    const isPartnerPage =
      pathname.includes("onboarding") || pathname.includes("partner");
    setMode(isPartnerPage ? "partner" : "student");

    setMessages([
      {
        id: "welcome-" + Date.now(),
        role: "ai",
        text: isPartnerPage
          ? "Välkommen till onboarding. Jag är din dedikerade partner-assistent. Hur kan vi hjälpa er att skala upp er utbildningsverksamhet?"
          : "Tjena! Behöver du hjälp med att hitta nästa lediga YKB-utbildning?",
      },
    ]);

    setInput("");
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const isPartner = mode === "partner";
  const accentGradient = isPartner
    ? "from-blue-700 via-blue-500 to-cyan-400"
    : "from-blue-600 via-green-500 to-green-800";

  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (input.length < 2) {
      const errorId = "err-" + Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: errorId,
          role: "ai",
          text: "Skriv gärna lite mer så jag kan hjälpa dig på bästa sätt.",
        },
      ]);
      return;
    }

    const userMsgId = "user-" + Date.now();
    const userMsg = { id: userMsgId, role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, mode: mode }),
      });

      const data = await response.json();

      if (data.text) {
        setMessages((prev) => [
          ...prev,
          { id: "ai-" + Date.now(), role: "ai", text: data.text },
        ]);
      } else {
        throw new Error("Inget svar");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: "fail-" + Date.now(),
          role: "ai",
          text: "Systemet är hårt belastat just nu. Försök igen eller kontakta supporten direkt.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 bg-gradient-to-r ${accentGradient} p-[2px] rounded-full hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] z-[9999]`}
      >
        <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center overflow-hidden border-2 border-black text-black uppercase font-black italic text-[10px]">
          <Image
            alt="YKB Centralen Loga"
            src="/loga.png"
            width={60}
            height={60}
            className="object-contain scale-125"
          />
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed z-[9999] flex flex-col font-sans transition-all duration-700
        ${
          isOpen
            ? "bottom-0 right-0 w-full h-full md:bottom-8 md:right-8 md:w-[380px] md:h-[600px] md:rounded-[2.5rem]"
            : "bottom-8 right-8 w-0 h-0 opacity-0 pointer-events-none"
        } 
        bg-[#050505] border-2 ${isPartner ? "border-blue-900/50" : "border-zinc-800 shadow-black"} 
        shadow-2xl overflow-hidden`}
    >
      {/* HEADER */}
      <div
        className={`${isPartner ? "bg-blue-950/30" : "bg-zinc-900"} 
        p-6 border-b border-zinc-800 flex justify-between items-center h-[90px] flex-shrink-0 transition-colors duration-500`}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black flex items-center justify-center border border-zinc-700 shadow-inner">
            <Image
              alt="YKB Centralen"
              src="/loga.png"
              width={45}
              height={45}
              className="object-contain mix-blend-screen scale-150"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-[1000] tracking-[-0.06em] leading-none uppercase italic text-white">
              {isPartner ? "PARTNER " : "BOKA "}
              <span
                className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}
              >
                {isPartner ? "STRATEGI" : "ASSISTENT"}
              </span>
            </h2>
            <span className="text-[8px] text-zinc-500 font-bold tracking-[0.2em] uppercase mt-1">
              {isPartner ? "Business Intelligence" : "Powered by Gemini 3.0"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="text-zinc-500 hover:text-white transition-all hover:rotate-90 p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* CHATT-INNEHÅLL */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 space-y-4 bg-[#050505] scrollbar-hide"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex group relative ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm relative ${
                msg.role === "user"
                  ? `bg-gradient-to-r ${accentGradient} text-white rounded-tr-none font-bold italic`
                  : "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none"
              }`}
            >
              <button
                onClick={() => removeMessage(msg.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold z-10 shadow-lg"
              >
                ✕
              </button>
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900/50 border border-zinc-800/50 p-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA - Fixerad i botten på mobilen */}
      <div className="flex-shrink-0 bg-zinc-900 border-t border-zinc-800 p-6 pb-8 md:pb-6">
        {!input && messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(isPartner
              ? ["Hur blir jag partner?", "Priser?", "Demo"]
              : ["Boka YKB", "Hitta kurser", "YKB status"]
            ).map((btn) => (
              <button
                key={btn}
                onClick={() => setInput(btn)}
                className="text-[9px] font-black italic uppercase bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full text-zinc-400 hover:text-white"
              >
                {btn}
              </button>
            ))}
          </div>
        )}

        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              isPartner ? "STÄLL EN AFFÄRSFRÅGA..." : "STÄLL EN FRÅGA..."
            }
            className={`w-full bg-black border-2 ${
              isPartner
                ? "border-blue-900/50 focus:border-blue-500"
                : "border-zinc-800 focus:border-green-500"
            } p-4 pr-24 text-white focus:outline-none transition-all uppercase italic font-black text-[10px] tracking-[0.1em]`}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`absolute right-2 bg-gradient-to-r ${accentGradient} px-4 py-2 text-[10px] font-[1000] italic uppercase text-white hover:brightness-110 shadow-lg disabled:opacity-50`}
          >
            {isLoading ? "..." : isPartner ? "ANSLUT" : "SVAR"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
