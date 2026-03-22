"use client";

import { useTheme } from "./ThemeContext";
import { Snowflake, Ghost, Egg, Flower2, Bell, Star, Sparkles, Rabbit } from "lucide-react";
import { useEffect, useState } from "react";

export function GlobalDecorations() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
      <div className="fixed inset-0 pointer-events-none z-[115] overflow-hidden">
        <style>{`
        @keyframes float-easter {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          35% { transform: translateY(35vh) translateX(30px) rotate(90deg); }
          65% { transform: translateY(65vh) translateX(-30px) rotate(180deg); }
          90% { opacity: 0.8; }
          100% { transform: translateY(110vh) translateX(10px) rotate(360deg); opacity: 0; }
        }

        @keyframes swing {
          0% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
          100% { transform: rotate(-6deg); }
        }

        @keyframes snow {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); }
          100% { transform: translateY(110vh) translateX(20px) rotate(360deg); }
        }
      `}</style>

        {/* --- THÈME PÂQUES --- */}
        {theme === "easter" && (
            <>
              {/* Suspensions Navbar Pâques */}
              <div className="absolute top-0 left-0 right-0 h-32 flex justify-around items-start px-8 lg:px-24">
                {[1, 2, 3, 4, 5, 6].map((i) => {
                  const Icon = i % 2 === 0 ? Egg : Rabbit;
                  const color = i % 2 === 0 ? "text-pink-400" : "text-amber-400";
                  return (
                      <div
                          key={`easter-deco-${i}`}
                          className="relative flex flex-col items-center"
                          style={{
                            transformOrigin: 'top center',
                            animation: `swing 5s ease-in-out infinite`,
                            animationDelay: `${i * 0.4}s`
                          }}
                      >
                        <div className="w-[1px] bg-gradient-to-b from-green-100/40 to-green-500/60 h-10" />
                        <Icon size={22} className={`${color} drop-shadow-sm`} fill="currentColor" />
                      </div>
                  );
                })}
              </div>

              {/* Pluie de Printemps */}
              {[...Array(30)].map((_, i) => {
                const isFlower = i % 2 === 0;
                return (
                    <div
                        key={`easter-item-${i}`}
                        className="absolute"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `-50px`,
                          animation: `float-easter ${8 + Math.random() * 12}s linear ${Math.random() * -20}s infinite`,
                        }}
                    >
                      {isFlower ? <Flower2 size={18} className="text-pink-300/60" /> : <Egg size={14} className="text-blue-300/50" />}
                    </div>
                );
              })}
            </>
        )}

        {/* --- THÈME NOËL --- */}
        {theme === "christmas" && (
            <>
              {/* Suspensions Navbar Noël */}
              <div className="absolute top-0 left-0 right-0 h-32 flex justify-around items-start px-8 lg:px-24">
                {[1, 2, 3, 4, 5, 6].map((i) => {
                  const Icons = [Bell, Star, Sparkles];
                  const Icon = Icons[i % Icons.length];
                  const color = i % 2 === 0 ? "text-red-500" : "text-yellow-500";
                  return (
                      <div
                          key={`xmas-deco-${i}`}
                          className="relative flex flex-col items-center"
                          style={{
                            transformOrigin: 'top center',
                            animation: `swing 4s ease-in-out infinite`,
                            animationDelay: `${i * 0.5}s`
                          }}
                      >
                        <div className="w-[1px] bg-slate-300/50 h-10" />
                        <Icon size={20} className={`${color} drop-shadow-md`} fill={i % 3 === 0 ? "currentColor" : "none"} />
                      </div>
                  );
                })}
              </div>

              {/* Chute de Neige */}
              {[...Array(40)].map((_, i) => (
                  <div
                      key={`snow-${i}`}
                      className="absolute text-blue-100/40"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `-10%`,
                        animation: `snow ${6 + Math.random() * 10}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                      }}
                  >
                    <Snowflake size={12 + Math.random() * 15} />
                  </div>
              ))}
            </>
        )}

        {/* --- THÈME HALLOWEEN --- */}
        {theme === "halloween" && (
            <>
              {/* Les fantômes arrivent bientôt ? */}
            </>
        )}
      </div>
  );
}