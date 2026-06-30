"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import teamsData from "@/data/teams.json";
import { getFlag, getTeamColor, formatPct } from "@/lib/teams";

interface TeamRow {
  team: string; winner_prob: number; final_prob: number;
  sf_prob: number; qf_prob: number; r16_prob: number; elo: number;
}

const teams = (teamsData as TeamRow[]).sort((a, b) => b.winner_prob - a.winner_prob);

// Simple weighted random selection
function weightedRandom(items: TeamRow[], key: keyof TeamRow): TeamRow {
  const weights = items.map((t) => Number(t[key]) || 0.01);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

interface SimResult {
  r16: string[];
  qf: string[];
  sf: string[];
  final: string[];
  winner: string;
}

function runSimulation(): SimResult {
  const pool = [...teams];
  const r16 = Array.from({ length: 16 }, () => {
    const t = weightedRandom(pool, "r16_prob");
    return t.team;
  }).filter((v, i, a) => a.indexOf(v) === i).slice(0, 16);

  const r16teams = teams.filter((t) => r16.includes(t.team));
  const qf = Array.from({ length: 8 }, () => weightedRandom(r16teams, "qf_prob").team)
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, 8);

  const qfteams = teams.filter((t) => qf.includes(t.team));
  const sf = Array.from({ length: 4 }, () => weightedRandom(qfteams, "sf_prob").team)
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

  const sfteams = teams.filter((t) => sf.includes(t.team));
  const final = Array.from({ length: 2 }, () => weightedRandom(sfteams, "final_prob").team)
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, 2);

  const finalteams = teams.filter((t) => final.includes(t.team));
  const winner = weightedRandom(finalteams.length > 0 ? finalteams : sfteams, "winner_prob").team;

  return { r16, qf, sf, final, winner };
}

function StageCard({ title, teams: stageTeams, winner }: {
  title: string; teams: string[]; winner?: string;
}) {
  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-[#25293a]/50 border-b border-white/5">
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#dee1f7]">{title}</h3>
      </div>
      <div className="p-3 flex flex-wrap gap-2">
        {stageTeams.map((team) => {
          const isWinner = team === winner;
          const color = getTeamColor(team);
          return (
            <div
              key={team}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: isWinner ? `${color}30` : "rgba(255,255,255,0.05)",
                border: isWinner ? `1px solid ${color}60` : "1px solid rgba(255,255,255,0.08)",
                color: isWinner ? color : "#dee1f7",
                boxShadow: isWinner ? `0 0 12px ${color}40` : "none",
              }}
            >
              <span>{getFlag(team)}</span>
              <span>{team}</span>
              {isWinner && <span>🏆</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LiveSimulation() {
  const [sim, setSim] = useState<SimResult | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    setSim(null);
    setTimeout(() => {
      setSim(runSimulation());
      setRunning(false);
    }, 800);
  };

  const winnerTeam = sim ? teams.find((t) => t.team === sim.winner) : null;
  const winnerColor = sim ? getTeamColor(sim.winner) : "#f5c518";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-12 max-w-[1000px] mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#f5c518]/70 mb-2">
            Monte Carlo Engine
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Live <span style={{ color: "#f5c518" }}>Simulation</span>
          </h1>
          <p className="text-[#d1c5ac] mb-8">
            Simulate one full World Cup tournament weighted by our Monte Carlo probabilities
          </p>

          <button
            onClick={handleRun}
            disabled={running}
            className="btn-primary px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase flex items-center gap-2 mx-auto disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-base">
              {running ? "hourglass_empty" : "play_arrow"}
            </span>
            {running ? "Simulating..." : "▶ Run Tournament Simulation"}
          </button>
        </div>

        {/* Winner banner */}
        {sim && (
          <div
            className="rounded-xl p-6 text-center mb-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${winnerColor}20, rgba(245,197,24,0.05))`,
              border: `1px solid ${winnerColor}40`,
              boxShadow: `0 0 40px ${winnerColor}20`,
            }}
          >
            <div className="text-5xl mb-2">🏆</div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#9a9078] mb-1">World Cup 2026 Champion</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">{getFlag(sim.winner)}</span>
              <span
                className="text-3xl md:text-4xl font-extrabold"
                style={{ color: winnerColor, textShadow: `0 0 30px ${winnerColor}60` }}
              >
                {sim.winner}
              </span>
            </div>
            {winnerTeam && (
              <p className="text-sm text-[#d1c5ac] mt-2">
                Monte Carlo win probability:{" "}
                <span className="font-bold text-white">{formatPct(winnerTeam.winner_prob)}</span>
              </p>
            )}
          </div>
        )}

        {/* Bracket stages */}
        {sim && (
          <div className="space-y-4">
            <StageCard title="Round of 16" teams={sim.r16} winner={sim.winner} />
            <StageCard title="Quarter Finals" teams={sim.qf} winner={sim.winner} />
            <StageCard title="Semi Finals" teams={sim.sf} winner={sim.winner} />
            <StageCard title="Final" teams={sim.final} winner={sim.winner} />
          </div>
        )}

        {!sim && !running && (
          <div className="glass-panel rounded-xl p-12 text-center text-[#9a9078]">
            <span className="material-symbols-outlined text-4xl block mb-3" style={{ color: "#f5c518" }}>
              sports_soccer
            </span>
            <p>Click the button above to simulate the full World Cup tournament</p>
          </div>
        )}

        {running && (
          <div className="glass-panel rounded-xl p-12 text-center">
            <div className="animate-spin text-4xl mb-4">⚽</div>
            <p className="text-[#d1c5ac]">Simulating tournament...</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
