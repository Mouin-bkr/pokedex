import { State } from "./state.js"

export async function commandExit(state: State) {
  console.log("Closing the Pokedex... Goodbye!")
  state.rl.close()
  state.pokeApi.closeCache()
  process.exit(0)
};
