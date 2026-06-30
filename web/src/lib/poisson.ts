// Poisson regression model implemented in JavaScript
// Coefficients extracted from the trained Python model
import modelParams from "@/data/model_params.json";
import eloData from "@/data/elo.json";

const elo = eloData as Record<string, number>;

// Factorial lookup for k = 0..10
const FACT = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800];
const MAX_GOALS = 10;

function poissonPmf(lambda: number, k: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  return Math.exp(-lambda) * Math.pow(lambda, k) / FACT[k];
}

function predictXG(
  params: Record<string, number>,
  homeElo: number,
  awayElo: number,
  tournamentWeight = 5,
  neutral = 1
): number {
  const linPred =
    params.const +
    params.home_elo_pre * homeElo +
    params.away_elo_pre * awayElo +
    params.tournament_weight * tournamentWeight +
    params.neutral * neutral;
  return Math.exp(linPred);
}

export interface MatchPrediction {
  homeTeam: string;
  awayTeam: string;
  homeXG: number;
  awayXG: number;
  homeWin: number;
  draw: number;
  awayWin: number;
}

export function predictMatch(homeTeam: string, awayTeam: string): MatchPrediction | null {
  const homeElo = elo[homeTeam];
  const awayElo = elo[awayTeam];
  if (!homeElo || !awayElo) return null;

  const homeXG = predictXG(modelParams.home as Record<string, number>, homeElo, awayElo);
  const awayXG = predictXG(modelParams.away as Record<string, number>, homeElo, awayElo);

  let homeWin = 0, draw = 0, awayWin = 0;

  for (let h = 0; h <= MAX_GOALS; h++) {
    for (let a = 0; a <= MAX_GOALS; a++) {
      const prob = poissonPmf(homeXG, h) * poissonPmf(awayXG, a);
      if (h > a) homeWin += prob;
      else if (h === a) draw += prob;
      else awayWin += prob;
    }
  }

  return { homeTeam, awayTeam, homeXG, awayXG, homeWin, draw, awayWin };
}

export function getTeamElo(team: string): number | null {
  return elo[team] ?? null;
}

export function getAllTeams(): string[] {
  return Object.keys(elo).sort();
}
