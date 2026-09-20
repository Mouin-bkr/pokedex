import { startREPL } from "./repl.js";
import { initState } from "./state.js";

async function main() {
  const state = initState()
  const saved = Object.keys(state.caughtPokemons).length
  if (saved > 0) {
    console.log(`Welcome back! Loaded ${saved} pokemon from your saved Pokedex.`)
  }
  startREPL(state)
}

main();
