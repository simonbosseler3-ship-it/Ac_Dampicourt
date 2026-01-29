"use client";

import { useState, useEffect } from "react";
import { Zap, Clock, ChevronDown, Info } from "lucide-react";

/**
 * COEFFICIENTS OFFICIELS WORLD ATHLETICS (TABLES SPIRIEV)
 * Formule : Points = a * (b - perf)^2 pour les courses
 * Formule : Points = a * (perf - b)^2 pour les concours
 */
const COEFFICIENTS: any = {
  homme: {
    "100m": { a: 25.4347, b: 18.0, type: "track" },
    "200m": { a: 5.8425, b: 38.0, type: "track" },
    "400m": { a: 1.53775, b: 82.0, type: "track" },
    "800m": { a: 0.13279, b: 235.0, type: "track" },
    "1500m": { a: 0.03768, b: 480.0, type: "track" },
    "110m Haies": { a: 7.6356, b: 30.0, type: "track" },
    "Hauteur": { a: 0.8465, b: 75.0, type: "field_cm" },
    "Perche": { a: 0.2797, b: 100.0, type: "field_cm" },
    "Longueur": { a: 0.14354, b: 220.0, type: "field_cm" },
    "Poids": { a: 51.39, b: 1.5, type: "field_m" },
    "Javelot": { a: 10.14, b: 7.0, type: "field_m" },
  },
  femme: {
    "100m": { a: 17.857, b: 21.5, type: "track" },
    "200m": { a: 4.9908, b: 46.5, type: "track" },
    "400m": { a: 1.342, b: 103.0, type: "track" },
    "800m": { a: 0.11193, b: 310.0, type: "track" },
    "1500m": { a: 0.03524, b: 615.0, type: "track" },
    "100m Haies": { a: 9.2307, b: 30.0, type: "track" },
    "Hauteur": { a: 1.221, b: 75.0, type: "field_cm" },
    "Longueur": { a: 0.1888, b: 210.0, type: "field_cm" },
    "Poids": { a: 47.83, b: 1.5, type: "field_m" },
  }
};

export default function TableHongroiseFinale() {
  const [gender, setGender] = useState("homme");
  const [event, setEvent] = useState("100m");
  const [performance, setPerformance] = useState("");
  const [points, setPoints] = useState<number>(0);

  const parsePerformance = (input: string, currentEvent: string) => {
    const clean = input.trim().replace(",", ".");
    if (!clean) return NaN;

    if (clean.includes(":")) {
      const parts = clean.split(":");
      return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    }

    const val = parseFloat(clean);
    if (["800m", "1500m"].includes(currentEvent) && clean.includes(".") && val < 10) {
      const p = clean.split(".");
      return parseInt(p[0]) * 60 + parseFloat(p[1] || "0");
    }
    return val;
  };

  useEffect(() => {
    const coeff = COEFFICIENTS[gender][event];
    const perf = parsePerformance(performance, event);

    if (!coeff || isNaN(perf) || perf <= 0) {
      setPoints(0);
      return;
    }

    let res = 0;
    if (coeff.type === "track") {
      if (perf < coeff.b) res = coeff.a * Math.pow(coeff.b - perf, 2);
    } else if (coeff.type === "field_cm") {
      const cm = perf * 100;
      if (cm > coeff.b) res = coeff.a * Math.pow(cm - coeff.b, 2);
    } else if (coeff.type === "field_m") {
      if (perf > coeff.b) res = coeff.a * Math.pow(perf - coeff.b, 2);
    }

    setPoints(Math.floor(res));
  }, [performance, event, gender]);

  const getStatus = (p: number) => {
    if (p >= 1150) return { label: "INTERNATIONAL", color: "text-amber-500", bg: "bg-amber-50" };
    if (p >= 1000) return { label: "NATIONAL", color: "text-red-600", bg: "bg-red-50" };
    if (p >= 850) return { label: "RÉGIONAL", color: "text-blue-600", bg: "bg-blue-50" };
    return { label: "LOISIR", color: "text-slate-400", bg: "bg-slate-50" };
  };

  const status = getStatus(points);

  return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">

          {/* Header */}
          <div className="bg-[#1E293B] p-12 text-center relative">
            <Zap className="absolute right-8 top-8 text-red-500 opacity-20" size={40} />
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">
              ATHLÉ<span className="text-red-600">MASTER</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.4em] mt-3">Tables de Cotation World Athletics</p>
          </div>

          <div className="p-10 space-y-10">
            {/* Genre */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-xs mx-auto">
              {["homme", "femme"].map((g) => (
                  <button key={g} onClick={() => {setGender(g); setPerformance("");}} className={`flex-1 py-3 rounded-xl font-black uppercase italic text-xs transition-all ${gender === g ? "bg-white text-red-600 shadow-sm" : "text-slate-400"}`}>
                    {g}
                  </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Discipline */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Discipline</label>
                <div className="relative">
                  <select value={event} onChange={(e) => {setEvent(e.target.value); setPerformance("");}} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold appearance-none outline-none focus:border-red-600 transition-all text-slate-700">
                    {Object.keys(COEFFICIENTS[gender]).map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Performance */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Performance</label>
                <div className="relative">
                  <input type="text" value={performance} onChange={(e) => setPerformance(e.target.value)} placeholder="0.00" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-3xl focus:border-red-600 outline-none transition-all" />
                  <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-200" size={28} />
                </div>
              </div>
            </div>

            {/* Résultat - Style Card comme sur tes images */}
            <div className="bg-[#0F172A] rounded-[3rem] p-12 text-center relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity underline-offset-8"></div>

              <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full ${status.bg} ${status.color} text-[10px] font-black uppercase tracking-widest mb-6 relative z-10 shadow-sm`}>
                {status.label}
              </div>

              <div className="text-[10rem] leading-none font-black text-white italic tracking-tighter relative z-10 drop-shadow-2xl">
                {points}
              </div>

              <div className="text-white/20 text-[11px] font-bold uppercase tracking-[0.5em] mt-8 relative z-10">
                POINTS COTATION IAAF
              </div>
            </div>

            {/* Info Aide */}
            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-center">
              <div className="bg-white p-2 rounded-xl shadow-sm"><Info className="text-blue-500" size={20}/></div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                Mode de calcul : Tables Spiriev. Pour le 800m et +, "2.50" = 2'50". Pour le 400m et -, "55.50" = 55.50s.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}