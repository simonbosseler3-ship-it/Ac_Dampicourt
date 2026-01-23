"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar/navbar";
import { Calculator, Info, Trophy, Zap, Clock } from "lucide-react";

// Coefficients officiels World Athletics (IAAF Scoring Tables)
const COEFFICIENTS: any = {
  homme: {
    // Courses (Track)
    "100m": { a: 25.4347, b: 18.0, c: 1.81, type: "track" },
    "200m": { a: 5.8425, b: 38.0, c: 1.81, type: "track" },
    "400m": { a: 1.53775, b: 82.0, c: 1.81, type: "track" },
    "800m": { a: 0.13279, b: 235.0, c: 1.85, type: "track" },
    "1500m": { a: 0.03768, b: 480.0, c: 1.85, type: "track" },
    "3000m": { a: 0.0105, b: 1005.0, c: 1.85, type: "track" },
    "5000m": { a: 0.00419, b: 1680.0, c: 1.85, type: "track" },
    "10000m": { a: 0.000415, b: 4245.0, c: 1.9, type: "track" },
    "110m Haies": { a: 5.74352, b: 28.5, c: 1.92, type: "track" },
    "400m Haies": { a: 0.55601, b: 95.0, c: 1.89, type: "track" },
    "3000m Steeple": { a: 0.00511, b: 1155.0, c: 1.9, type: "track" },
    // Concours (Field) - b est en m sauf Hauteur/Perche (cm dans la formule)
    "Hauteur": { a: 0.8465, b: 75.0, c: 1.42, type: "field_cm" },
    "Perche": { a: 0.2797, b: 100.0, c: 1.35, type: "field_cm" },
    "Longueur": { a: 0.14354, b: 220.0, c: 1.4, type: "field_cm" },
    "Triple Saut": { a: 0.0632, b: 480.0, c: 1.41, type: "field_cm" },
    "Poids": { a: 51.39, b: 1.5, c: 1.05, type: "field_m" },
    "Disque": { a: 12.91, b: 4.0, c: 1.1, type: "field_m" },
    "Marteau": { a: 13.0449, b: 7.0, c: 1.05, type: "field_m" },
    "Javelot": { a: 10.14, b: 7.0, c: 1.08, type: "field_m" },
  },
  femme: {
    "100m": { a: 17.857, b: 21.0, c: 1.81, type: "track" },
    "200m": { a: 4.9908, b: 42.5, c: 1.81, type: "track" },
    "400m": { a: 1.34285, b: 91.7, c: 1.81, type: "track" },
    "800m": { a: 0.11193, b: 254.0, c: 1.88, type: "track" },
    "1500m": { a: 0.0335, b: 520.0, c: 1.88, type: "track" },
    "3000m": { a: 0.00683, b: 1150.0, c: 1.88, type: "track" },
    "5000m": { a: 0.00272, b: 1920.0, c: 1.88, type: "track" },
    "10000m": { a: 0.000325, b: 4900.0, c: 1.88, type: "track" },
    "100m Haies": { a: 9.23076, b: 26.7, c: 1.835, type: "track" },
    "400m Haies": { a: 0.99807, b: 103.0, c: 1.81, type: "track" },
    "3000m Steeple": { a: 0.00408, b: 1320.0, c: 1.9, type: "track" },
    "Hauteur": { a: 1.84523, b: 75.0, c: 1.348, type: "field_cm" },
    "Perche": { a: 0.441, b: 100.0, c: 1.35, type: "field_cm" },
    "Longueur": { a: 0.188807, b: 210.0, c: 1.41, type: "field_cm" },
    "Triple Saut": { a: 0.08302, b: 450.0, c: 1.41, type: "field_cm" },
    "Poids": { a: 56.0211, b: 1.5, c: 1.05, type: "field_m" },
    "Disque": { a: 12.331, b: 3.0, c: 1.1, type: "field_m" },
    "Marteau": { a: 17.5458, b: 6.0, c: 1.05, type: "field_m" },
    "Javelot": { a: 15.9803, b: 3.8, c: 1.04, type: "field_m" },
  }
};

export default function TableHongroise() {
  const [gender, setGender] = useState("homme");
  const [event, setEvent] = useState("100m");
  const [performance, setPerformance] = useState("");
  const [points, setPoints] = useState<number | null>(null);

  // Fonction pour parser les formats MM:SS.cc ou SS.cc
  const parsePerformance = (input: string) => {
    const cleanInput = input.replace(",", ".");
    if (cleanInput.includes(":")) {
      const parts = cleanInput.split(":");
      if (parts.length === 2) {
        return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
      }
    }
    return parseFloat(cleanInput);
  };

  const calculatePoints = () => {
    const coeff = COEFFICIENTS[gender][event];
    if (!coeff || !performance) {
      setPoints(0);
      return;
    }

    const perf = parsePerformance(performance);
    if (isNaN(perf)) return;

    let result = 0;
    try {
      if (coeff.type === "track") {
        if (perf < coeff.b) {
          result = coeff.a * Math.pow((coeff.b - perf), coeff.c);
        }
      } else if (coeff.type === "field_cm") {
        const valInCm = perf * 100;
        if (valInCm > coeff.b) {
          result = coeff.a * Math.pow((valInCm - coeff.b), coeff.c);
        }
      } else if (coeff.type === "field_m") {
        if (perf > coeff.b) {
          result = coeff.a * Math.pow((perf - coeff.b), coeff.c);
        }
      }
    } catch (e) {
      result = 0;
    }

    setPoints(Math.max(0, Math.floor(result)));
  };

  useEffect(() => {
    calculatePoints();
  }, [performance, event, gender]);

  // Reset de la performance si on change d'épreuve pour éviter les incohérences
  useEffect(() => {
    setPerformance("");
    setPoints(0);
  }, [event, gender]);

  return (
      <div className="min-h-screen bg-slate-50/50">
        <Navbar/>

        <main className="container mx-auto px-4 py-12 pt-24 max-w-4xl">
          {/* HEADER */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Calculator size={14}/> Simulation de Performance
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
              Table <span className="text-red-600">Hongroise</span>
            </h1>
            <div className="h-2 w-20 bg-red-600 mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">

            {/* CALCULATEUR */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="space-y-6">
                {/* SEXE */}
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button
                      onClick={() => setGender("homme")}
                      className={`flex-1 py-3 rounded-xl font-black uppercase italic text-xs transition-all ${gender === "homme" ? "bg-white text-red-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >Homme
                  </button>
                  <button
                      onClick={() => setGender("femme")}
                      className={`flex-1 py-3 rounded-xl font-black uppercase italic text-xs transition-all ${gender === "femme" ? "bg-white text-red-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >Femme
                  </button>
                </div>

                {/* EPREUVE */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Discipline</label>
                  <select
                      value={event}
                      onChange={(e) => setEvent(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-all appearance-none cursor-pointer"
                  >
                    {Object.keys(COEFFICIENTS[gender]).map(e => (
                        <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>

                {/* PERFORMANCE */}
                <div>
                  <div className="flex justify-between items-end mb-2 ml-1">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Performance
                    </label>
                    <span className="text-[9px] text-slate-400 italic">
                      {COEFFICIENTS[gender][event].type === "track" ? "Format SS.cc ou MM:SS.cc" : "Format en mètres (ex: 7.20)"}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                        type="text"
                        placeholder={COEFFICIENTS[gender][event].type === "track" ? "00.00" : "0.00"}
                        value={performance}
                        onChange={(e) => setPerformance(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-3xl outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                    {COEFFICIENTS[gender][event].type === "track" && (
                        <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200" size={24} />
                    )}
                  </div>
                </div>

                {/* RESULTAT */}
                <div className="pt-6">
                  <div className="bg-slate-900 rounded-[2rem] p-8 text-center relative overflow-hidden group">
                    <Zap className="absolute -right-4 -top-4 text-white/10 group-hover:scale-110 transition-transform duration-500" size={120}/>
                    <div className="relative z-10">
                      <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Points calculés</p>
                      <div className="text-6xl font-black text-white italic tracking-tighter">
                        {points ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EXPLICATIONS / REPERES */}
            <div className="space-y-6">
              <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-red-600">
                  <Info size={20}/>
                  <h3 className="font-black uppercase italic text-sm">À quoi ça sert ?</h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  Les tables de cotation de World Athletics permettent de comparer les performances entre des épreuves totalement différentes.
                  <br /><br />
                  Est-ce qu'un 100m en 10.50 est plus "fort" qu'un saut en longueur à 7m50 ? Le nombre de points donne la réponse.
                </p>
              </div>

              <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-black uppercase italic mb-6 flex items-center gap-2 text-sm">
                  <Trophy size={18} className="text-red-600"/> Échelle de niveau
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">International</span>
                    <span className="text-sm font-black italic text-red-600">1200+ pts</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">National</span>
                    <span className="text-sm font-black italic text-slate-900">1000 pts</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">Régional</span>
                    <span className="text-sm font-black italic text-slate-700">700 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400">Départemental</span>
                    <span className="text-sm font-black italic text-slate-500">400 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-slate-300 text-[9px] mt-16 uppercase font-bold tracking-[0.4em]">
            Athlétique Club Dampicourt
          </p>
        </main>
      </div>
  );
}