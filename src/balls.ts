import type { Pokemon } from "./pokeapi.js";

export type Ball = { name: string; label: string; strength: number };
export type Rng = () => number;

export const BALLS: Record<string, Ball> = {
  pokeball: { name: "Pokeball", label: "a Pokeball", strength: 1 },
  greatball: { name: "Great Ball", label: "a Great Ball", strength: 1.5 },
  ultraball: { name: "Ultra Ball", label: "an Ultra Ball", strength: 2 },
  masterball: { name: "Master Ball", label: "a Master Ball", strength: Infinity },
};

const BASE_K = 100;
const FALLBACK_EXPERIENCE = 100;

export function parseBall(input?: string): Ball | undefined {
  if (input === undefined) return BALLS.pokeball;
  return BALLS[input.toLowerCase().replace(/[-_]/g, "")];
}

export function catchChance(baseExperience: number | null, ball: Ball): number {
  const k = BASE_K * ball.strength;
  if (!Number.isFinite(k)) return 1;
  const exp = Number.isFinite(baseExperience) ? (baseExperience as number) : FALLBACK_EXPERIENCE;
  return k / (k + exp);
}

export function rollCatch(pokemon: Pokemon, ball: Ball, rng: Rng = Math.random): boolean {
  return rng() < catchChance(pokemon.base_experience, ball);
}
