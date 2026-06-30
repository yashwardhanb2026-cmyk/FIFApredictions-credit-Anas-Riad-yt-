"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { predictMatch } from "@/lib/poisson";
import { getFlag, getTeamColor } from "@/lib/teams";
import teamsData from "@/data/teams.json";

interface TeamRow { team: string; elo: number; fifa_rank: number; confederation: string; }
const WC_TEAMS = (teamsData as TeamRow[]).map((t) => t.team).sort();

function PredictionBar({ homeWin, draw, awayWin }: { homeWin: number; draw: number; awayWin: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, [homeWin, draw, awayWin]);

  return (
    <div
      className="flex w-full rounded-full overflow-hidden h-3 my-4"
      style={{ background: "rgba(255,255,255,0.08)" }}
    >
      <div
        className="h-full transition-all duration-1000 ease-out"
        style={{
          width: mounted ? `${homeWin * 100}%` : "0%",
          background: "linear-gradient(90deg, #E03531, #ff6b6b)",
          boxShadow: "2px 0 8px rgba(224,53,49,0.5)",
        }}
      />
      <div
        className="h-full transition-all duration-1000 ease-out"
        style={{
          width: mounted ? `${draw * 100}%` : "0%",
          background: "linear-gradient(90deg, #555, #888)",
        }}
      />
      <div
        className="h-full transition-all duration-1000 ease-out"
        style={{
          width: mounted ? `${awayWin * 100}%` : "0%",
          background: "linear-gradient(90deg, #1A3A8F, #4A76E8)",
          boxShadow: "-2px 0 8px rgba(74,118,232,0.5)",
        }}
      />
    </div>
  );
}

export default function MatchExplorer() {
  const [teamA, setTeamA] = useState("Argentina");
  const [teamB, setTeamB] = useState("Brazil");
  const [result, setResult] = useState<ReturnType<typeof predictMatch>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (teamA !== teamB) {
      setResult(predictMatch(teamA, teamB));
    }
  }, [teamA, teamB]);

  const colorA = getTeamColor(teamA);
  const colorB = getTeamColor(teamB);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-12 max-w-[900px] mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#f5c518]/70 mb-2">
            Poisson ML Model
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Match <span style={{ color: "#f5c518" }}>Explorer</span>
          </h1>
          <p className="text-[#d1c5ac]">
            Select two teams to predict the outcome using our Poisson regression model
          </p>
        </div>

        {/* Team selectors */}
        <div className="glass-panel rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {/* Team A */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-[#9a9078] mb-2 block">
                Team A
              </label>
              <select
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="w-full px-3 py-3 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-1 transition-all"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#dee1f7",
                }}
              >
                {WC_TEAMS.filter((t) => t !== teamB).map((t) => (
                  <option key={t} value={t} style={{ background: "#1a1f2f" }}>
                    {getFlag(t)} {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Team B */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-[#9a9078] mb-2 block">
                Team B
              </label>
              <select
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="w-full px-3 py-3 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-1 transition-all"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#dee1f7",
                }}
              >
                {WC_TEAMS.filter((t) => t !== teamA).map((t) => (
                  <option key={t} value={t} style={{ background: "#1a1f2f" }}>
                    {getFlag(t)} {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && teamA !== teamB && (
          <div
            className="glass-panel rounded-xl p-6 md:p-8 space-y-6"
            style={{ border: "1px solid rgba(245,197,24,0.15)" }}
          >
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#9a9078] text-center">
              Win Prediction
            </h2>

            {/* Three probability cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* Team A */}
              <div
                className="rounded-xl p-4 text-center relative overflow-hidden"
                style={{
                  background: `${colorA}15`,
                  border: `1.5px solid ${colorA}50`,
                }}
              >
                <div className="text-2xl mb-1">{getFlag(teamA)}</div>
                <p className="text-xs font-bold text-white/80 mb-2 truncate">{teamA}</p>
                <p
                  className="text-3xl font-extrabold"
                  style={{ color: colorA, textShadow: `0 0 16px ${colorA}60` }}
                >
                  {(result.homeWin * 100).toFixed(1)}%
                </p>
                <p className="text-[10px] text-[#9a9078] mt-1 uppercase tracking-wider">Win</p>
                <p className="text-xs text-[#d1c5ac] mt-2">
                  xG: <span className="font-mono font-bold text-white">{result.homeXG.toFixed(2)}</span>
                </p>
              </div>

              {/* Draw */}
              <div
                className="rounded-xl p-4 text-center"
                style={{
                  background: "rgba(100,100,100,0.1)",
                  border: "1.5px solid rgba(150,150,150,0.3)",
                }}
              >
                <div className="text-2xl mb-1">🤝</div>
                <p className="text-xs font-bold text-white/80 mb-2">Draw</p>
                <p className="text-3xl font-extrabold text-[#cccccc]">
                  {(result.draw * 100).toFixed(1)}%
                </p>
                <p className="text-[10px] text-[#9a9078] mt-1 uppercase tracking-wider">Probability</p>
              </div>

              {/* Team B */}
              <div
                className="rounded-xl p-4 text-center relative overflow-hidden"
                style={{
                  background: `${colorB}15`,
                  border: `1.5px solid ${colorB}50`,
                }}
              >
                <div className="text-2xl mb-1">{getFlag(teamB)}</div>
                <p className="text-xs font-bold text-white/80 mb-2 truncate">{teamB}</p>
                <p
                  className="text-3xl font-extrabold"
                  style={{ color: colorB, textShadow: `0 0 16px ${colorB}60` }}
                >
                  {(result.awayWin * 100).toFixed(1)}%
                </p>
                <p className="text-[10px] text-[#9a9078] mt-1 uppercase tracking-wider">Win</p>
                <p className="text-xs text-[#d1c5ac] mt-2">
                  xG: <span className="font-mono font-bold text-white">{result.awayXG.toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* 3-segment bar */}
            <PredictionBar homeWin={result.homeWin} draw={result.draw} awayWin={result.awayWin} />

            {/* Bar legend */}
            <div className="flex justify-between text-xs text-[#9a9078] -mt-2">
              <span style={{ color: colorA }}>{teamA}</span>
              <span className="text-[#888]">Draw</span>
              <span style={{ color: colorB }}>{teamB}</span>
            </div>

            {/* Model note */}
            <p className="text-[11px] text-[#9a9078] text-center border-t border-white/5 pt-4">
              ⚙️ Poisson regression model with 4-year temporal weighting (35% recent / 65% historical)
            </p>
          </div>
        )}

        {teamA === teamB && (
          <div className="glass-panel rounded-xl p-8 text-center text-[#9a9078]">
            Please select two different teams.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
