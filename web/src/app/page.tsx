"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import teamsData from "@/data/teams.json";
import { getFlag, getTeamColor, formatPct } from "@/lib/teams";

interface TeamRow {
  team: string;
  winner_prob: number;
  final_prob: number;
  sf_prob: number;
  qf_prob: number;
  r16_prob: number;
  r32_prob: number;
  elo: number;
  fifa_rank: number;
  confederation: string;
}

const teams = (teamsData as TeamRow[]).sort((a, b) => b.winner_prob - a.winner_prob);

const CONF_COLORS: Record<string, string> = {
  UEFA: "#3b82f6", CONMEBOL: "#22c55e", CONCACAF: "#f59e0b",
  AFC: "#a855f7", CAF: "#ef4444", OFC: "#06b6d4",
};

export default function HomePage() {
  const [animate, setAnimate] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  const topTeam = teams[0];
  const displayTeams = showAll ? teams : teams.slice(0, 10);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-12 max-w-[1440px] mx-auto w-full">
        {/* Hero */}
        <section className="text-center mb-12 animate-fade-in">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#f5c518]/70 mb-3">
            ⚽ Monte Carlo + Poisson ML Model
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight tracking-tight">
            Who Will Win the{" "}
            <span style={{ color: "#f5c518", textShadow: "0 0 40px rgba(245,197,24,0.3)" }}>
              World Cup 2026?
            </span>
          </h1>
          <p className="text-base md:text-lg text-[#d1c5ac] max-w-2xl mx-auto">
            Powered by weighted Poisson regression + {" "}
            <span className="text-[#f0c110]">100 Monte Carlo simulations</span>
            {" "}with 4-year temporal weighting
          </p>
        </section>

        {/* Top 3 hero cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {teams.slice(0, 3).map((team, i) => {
            const color = getTeamColor(team.team);
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <div
                key={team.team}
                className="glass-panel rounded-xl p-6 text-center relative overflow-hidden"
                style={{
                  borderColor: i === 0 ? "rgba(245,197,24,0.4)" : "rgba(255,255,255,0.08)",
                  boxShadow: i === 0 ? `0 0 40px ${color}20` : "none",
                  animationDelay: `${i * 0.15}s`,
                  opacity: animate ? 1 : 0,
                  transition: "opacity 0.6s ease",
                }}
              >
                <div
                  className="absolute inset-0 opacity-5 rounded-xl"
                  style={{ background: color }}
                />
                <div className="text-3xl mb-1">{medals[i]}</div>
                <div className="text-3xl mb-2">{getFlag(team.team)}</div>
                <h3 className="text-xl font-bold text-white mb-1">{team.team}</h3>
                <div
                  className="text-4xl font-extrabold mb-1"
                  style={{ color, textShadow: `0 0 20px ${color}60` }}
                >
                  {formatPct(team.winner_prob)}
                </div>
                <p className="text-xs text-[#9a9078] uppercase tracking-widest">Win Probability</p>
                <div className="mt-3 text-xs text-[#d1c5ac] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#9a9078]">Final:</span>
                    <span>{formatPct(team.final_prob)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9a9078]">Elo:</span>
                    <span className="font-mono">{Math.round(team.elo)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard */}
        <div className="glass-panel rounded-xl overflow-hidden shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="px-6 py-4 bg-[#25293a]/50 border-b border-white/5 flex justify-between items-center">
            <div>
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#dee1f7]">
                Tournament Win Probabilities
              </h2>
              <p className="text-xs text-[#9a9078] mt-0.5">
                Based on 100 Monte Carlo tournament simulations
              </p>
            </div>
            <span className="text-xs text-[#9a9078] font-mono hidden md:block">
              {teams.length} teams
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <th className="py-3 px-4 text-xs font-bold tracking-widest uppercase text-[#9a9078] w-14 text-center">#</th>
                  <th className="py-3 px-4 text-xs font-bold tracking-widest uppercase text-[#9a9078]">Country</th>
                  <th className="py-3 px-4 text-xs font-bold tracking-widest uppercase text-[#9a9078] min-w-[180px]">Win %</th>
                  <th className="py-3 px-4 text-xs font-bold tracking-widest uppercase text-[#9a9078] text-right">Final</th>
                  <th className="py-3 px-4 text-xs font-bold tracking-widest uppercase text-[#9a9078] text-right">SF</th>
                  <th className="py-3 px-4 text-xs font-bold tracking-widest uppercase text-[#9a9078] text-right">QF</th>
                  <th className="py-3 px-4 text-xs font-bold tracking-widest uppercase text-[#9a9078] text-right">R16</th>
                  <th className="py-3 px-4 text-xs font-bold tracking-widest uppercase text-[#9a9078] text-right hidden md:table-cell">Elo</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {displayTeams.map((team, idx) => {
                  const color = getTeamColor(team.team);
                  const isHovered = hovered === team.team;
                  const bgOdd = idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.025)";

                  return (
                    <tr
                      key={team.team}
                      className="glass-row border-b border-white/5 cursor-default"
                      style={{
                        background: isHovered ? "rgba(255,255,255,0.06)" : bgOdd,
                        opacity: animate ? 1 : 0,
                        transition: `opacity 0.5s ease ${0.05 * idx}s`,
                      }}
                      onMouseEnter={() => setHovered(team.team)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center">
                        {idx < 3 ? (
                          <span className="text-lg">
                            {["🥇", "🥈", "🥉"][idx]}
                          </span>
                        ) : (
                          <span className="text-[#9a9078] font-bold">{idx + 1}</span>
                        )}
                      </td>

                      {/* Country */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getFlag(team.team)}</span>
                          <div>
                            <span className="font-bold text-white text-sm">{team.team}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider"
                                style={{
                                  background: `${CONF_COLORS[team.confederation] || "#666"}25`,
                                  color: CONF_COLORS[team.confederation] || "#aaa",
                                }}
                              >
                                {team.confederation}
                              </span>
                              <span className="text-[10px] text-[#9a9078]">
                                FIFA #{team.fifa_rank}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Win % with bar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-12 text-right font-bold text-sm"
                            style={{ color: idx < 3 ? color : "#dee1f7" }}
                          >
                            {formatPct(team.winner_prob)}
                          </span>
                          <div className="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden min-w-[80px]">
                            {animate && (
                              <div
                                className="h-full rounded-full bar-fill"
                                style={{
                                  background: `linear-gradient(90deg, ${color}, ${color}99)`,
                                  boxShadow: `0 0 6px ${color}80`,
                                  "--target-width": `${Math.min(team.winner_prob * 100 * 3, 100)}%`,
                                } as React.CSSProperties}
                              />
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Stage probs */}
                      <td className="py-4 px-4 text-right text-[#d1c5ac]">{formatPct(team.final_prob)}</td>
                      <td className="py-4 px-4 text-right text-[#d1c5ac]">{formatPct(team.sf_prob)}</td>
                      <td className="py-4 px-4 text-right text-[#d1c5ac]">{formatPct(team.qf_prob)}</td>
                      <td className="py-4 px-4 text-right text-[#d1c5ac]">{formatPct(team.r16_prob)}</td>
                      <td className="py-4 px-4 text-right hidden md:table-cell text-[#9a9078]">
                        {Math.round(team.elo)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Show more */}
          <div className="px-6 py-4 border-t border-white/5 bg-black/10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-bold tracking-widest uppercase text-[#f5c518] hover:text-white transition-colors flex items-center gap-1 mx-auto"
            >
              {showAll ? "SHOW TOP 10" : `VIEW ALL ${teams.length} TEAMS`}
              <span className="material-symbols-outlined text-sm">
                {showAll ? "expand_less" : "expand_more"}
              </span>
            </button>
          </div>
        </div>

        {/* Pitch bottom glow */}
        <div
          className="fixed bottom-0 left-0 w-full h-64 pointer-events-none z-0"
          style={{ background: "linear-gradient(to top, rgba(34, 197, 94, 0.04), transparent)" }}
        />
      </main>

      <Footer />
    </div>
  );
}
