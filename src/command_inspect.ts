import { State } from "./state.js";

export async function inspectPokemon(state: State,name:string) {
    if (name === "") {
        console.log("Please provide a pikachu name to inspect.");
        return;
    }
    const pokemon = state.caughtPokemons[name];
    if (!pokemon) {
        console.log(`${name} is not caught.`);
        return;
    }
    console.log(`Inspecting ${pokemon.name}...`);
    console.log(`Name: ${pokemon.name}`);
    console.log(`Base Experience: ${pokemon.base_experience}`);
    console.log(`Height: ${pokemon.height}`);
    console.log(`Weight: ${pokemon.weight}`);
    console.log(`Types: ${pokemon.types.map(t => t.type.name).join(", ")}`);
    console.log(`Abilities: ${pokemon.abilities.map(a => a.ability.name).join("\n")}`);
    console.log(`Stats: ${pokemon.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join("\n")}`);
   
}