import { State } from "./state.js";
import { BALLS, parseBall, rollCatch, type Ball, type Rng } from "./balls.js";
import type { Pokemon } from "./pokeapi.js";
import { savePokedex, slimPokemon } from "./storage.js";

export async function catchPokemon(state: State, name: string = "", ballName?: string) {
  if (name === "") {
    console.log("Please provide a pikachu name to catch.");
    return;
  }
  const ball = parseBall(ballName);
  if (!ball) {
    console.log(`Unknown ball "${ballName}". Available: ${Object.keys(BALLS).join(", ")}`);
    return;
  }
  const pokemon = await state.pokeApi.fetchPokemon(name);
  if (!pokemon) {
    console.log(`Pokemon ${name} not found.`);
    return;
  }
  attemptCatch(state, pokemon, ball);
}

export function attemptCatch(
  state: State,
  pokemon: Pokemon,
  ball: Ball,
  rng: Rng = Math.random,
): boolean {
  console.log(`Throwing ${ball.label} at ${pokemon.name}...`);
  if (rollCatch(pokemon, ball, rng)) {
    state.caughtPokemons[pokemon.name] = slimPokemon(pokemon);
    savePokedex(state.savePath, state.caughtPokemons);
    console.log(`${pokemon.name} was caught!`);
    return true;
  }
  console.log(`${pokemon.name} escaped!`);
  return false;
}
