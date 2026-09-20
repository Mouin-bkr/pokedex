import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { Pokemon } from "./pokeapi.js";

export function defaultSavePath(): string {
  return process.env.POKEDEX_FILE ?? join(homedir(), ".pokedex.json");
}

export function slimPokemon(p: Pokemon): Pokemon {
  return {
    name: p.name,
    height: p.height,
    weight: p.weight,
    base_experience: p.base_experience,
    types: p.types.map((t) => ({ type: { name: t.type.name } })),
    abilities: p.abilities.map((a) => ({ ability: { name: a.ability.name } })),
    stats: p.stats.map((s) => ({ base_stat: s.base_stat, stat: { name: s.stat.name } })),
  };
}

export function savePokedex(path: string, pokedex: Record<string, Pokemon>): void {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(pokedex, null, 2));
  } catch (e) {
    console.log(`Could not save pokedex: ${(e as Error).message}`);
  }
}

export function loadPokedex(path: string): Record<string, Pokemon> {
  try {
    const data = JSON.parse(readFileSync(path, "utf8"));
    return data && typeof data === "object" && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}
