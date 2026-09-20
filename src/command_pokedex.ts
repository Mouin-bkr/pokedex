import type { State } from "./state.js";

export async function pokedex(state: State) {
  if (Object.keys(state.caughtPokemons).length === 0) {
    console.log("You haven't caught any pokemons yet.");
    return;
  }
  console.log("Your Pokedex:");
  for (const pokemon of Object.values(state.caughtPokemons)) {
    console.log(` - ${pokemon.name}`);
  }
}
