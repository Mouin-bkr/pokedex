import { State } from "./state.js";
import type { Pokemon } from "./pokeapi.js";
import { simulateBattle } from "./battle.js";

const LINE_DELAY_MS = Number(process.env.BATTLE_DELAY_MS ?? 400);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function resolvePokemon(state: State, name: string): Promise<Pokemon | null> {
  return state.caughtPokemons[name] ?? (await state.pokeApi.fetchPokemon(name));
}

export async function battle(state: State, nameA?: string, nameB?: string) {
  if (!nameA || !nameB) {
    console.log("Usage: battle <pokemon1> <pokemon2>");
    return;
  }
  const [a, b] = await Promise.all([resolvePokemon(state, nameA), resolvePokemon(state, nameB)]);
  if (!a || !b) {
    console.log(`Pokemon ${!a ? nameA : nameB} not found.`);
    return;
  }
  for (const line of simulateBattle(a, b).log) {
    console.log(line);
    await sleep(LINE_DELAY_MS);
  }
}
