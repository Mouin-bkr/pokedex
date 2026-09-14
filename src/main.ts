import { startREPL } from "./repl.js";
import { initState } from "./state.js";

async function main() {
  const state = initState()
  startREPL(state)
}

main();
