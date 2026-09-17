import { State } from "./state.js";

export async function explore(state: State, ...args: string[]) {
  if (args.length === 0) {
    console.log("Please provide a location name to explore.");
    return;
  }
  const locations = await state.pokeApi.fetchLocation(args[0]);
  if (!locations) {
    console.log(`Location ${args[0]} not found`);
    return;
  }
    console.log(`Exploring ${locations.name}...`);
    console.log(`Found Pokemon:`);
  for (const location of locations.pokemon_encounters) {
    console.log(`- ${location.pokemon.name}`);
  }
}
