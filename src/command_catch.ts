import { State } from "./state.js";

export async function catchPokemon(state: State,name:string) {
  if (name === "") {
    console.log("Please provide a pikachu name to catch.");
    return;
  }
  const pokemon = await state.pokeApi.fetchPokemon(name);
    if (!pokemon) {
        console.log(`Pokemon ${name} not found.`);
        return;
    }
  console.log(`Throwing a Pokeball at ${pokemon.name}...`);
  const chance = 100/(pokemon.base_experience + 100)
    if (Math.random() > chance){
      state.pokedex[pokemon.name] = pokemon;
      console.log(`${pokemon.name} was caught!`);
    } else {
      console.log(`${pokemon.name} escaped!`);
    }
}
