import { State } from "./state.js";
import { BALLS, parseBall } from "./balls.js";
import { attemptCatch } from "./command_catch.js";

const FLEE_CHANCE = 0.25;

export async function encounter(state: State, location?: string) {
  if (!location) {
    console.log("Usage: encounter <location-area>");
    return;
  }
  const area = await state.pokeApi.fetchLocation(location);
  if (!area) {
    console.log(`Location ${location} not found`);
    return;
  }
  const spawns = area.pokemon_encounters;
  if (spawns.length === 0) {
    console.log(`No wild pokemon in ${area.name}.`);
    return;
  }
  const name = spawns[Math.floor(Math.random() * spawns.length)].pokemon.name;
  const wild = await state.pokeApi.fetchPokemon(name);
  if (!wild) {
    console.log(`Pokemon ${name} not found.`);
    return;
  }
  state.wildPokemon = wild;
  const types = wild.types.map((t) => t.type.name).join("/");
  console.log(`A wild ${wild.name} appeared! (${types})`);
  console.log(`Use "throw [${Object.keys(BALLS).join("|")}]" to catch it.`);
}

export async function throwBall(state: State, ballName?: string) {
  const wild = state.wildPokemon;
  if (!wild) {
    console.log(`No wild pokemon nearby. Try "encounter <location-area>" first.`);
    return;
  }
  const ball = parseBall(ballName);
  if (!ball) {
    console.log(`Unknown ball "${ballName}". Available: ${Object.keys(BALLS).join(", ")}`);
    return;
  }
  if (attemptCatch(state, wild, ball)) {
    state.wildPokemon = null;
    return;
  }
  if (Math.random() < FLEE_CHANCE) {
    console.log(`${wild.name} fled!`);
    state.wildPokemon = null;
  }
}
