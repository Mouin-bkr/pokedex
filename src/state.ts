import { createInterface, type Interface } from "readline";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { PokeAPI, Pokemon } from "./pokeapi.js";
import { map } from "./command_map.js";
import { mapb } from "./command_mapb.js";
import { explore } from "./command_explore.js";
import { catchPokemon } from "./command_catch.js";
import { inspectPokemon } from "./command_inspect.js";
import { pokedex } from "./command_pokedex.js";
import { battle } from "./command_battle.js";
import { encounter, throwBall } from "./command_encounter.js";
import { defaultSavePath, loadPokedex } from "./storage.js";

export type State = {
  pokeApi: PokeAPI
  rl: Interface,
  commands: Record<string, CLICommand>,
  nextLocationsURL: string | null ,
  prevLocationsURL: string | null,
  caughtPokemons: Record<string, Pokemon>,
  wildPokemon: Pokemon | null,
  savePath: string,
}

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State , ...args: string[]) => Promise<void>;
};

export function initState():State {
  const savePath = defaultSavePath();

  return {
    pokeApi: new PokeAPI(),
    nextLocationsURL: null,
    prevLocationsURL: null,
    rl : createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "Pokedex > ",
    }),
    commands: {
      exit: {
        name: "exit",
        description: "Exit the Pokedex",
        callback: commandExit,
      },
      help: {
        name: "help",
        description: "Help Message",
        callback: commandHelp,
      },
      map: {
        name: "map",
        description: "map the locations list",
        callback: map,
      },
      mapb: {
        name: "mapb",
        description: "map back the lcoations list",
        callback: mapb,
      },
      explore: {
        name: "explore",
        description: "Explore a specific location",
        callback: explore,
      },
      catch: {
        name: "catch",
        description: "Catch a pokemon: catch <name> [pokeball|greatball|ultraball|masterball]",
        callback: catchPokemon,
      },
      inspect: {
        name: "inspect",
        description: "Inspect a specific pokemon",
        callback: inspectPokemon,
      },
      pokedex: {
        name: "pokedex",
        description: "List all caught pokemons",
        callback: pokedex,
      },
      battle: {
        name: "battle",
        description: "Battle two pokemon: battle <pokemon1> <pokemon2>",
        callback: battle,
      },
      encounter: {
        name: "encounter",
        description: "Meet a random wild pokemon: encounter <location-area>",
        callback: encounter,
      },
      throw: {
        name: "throw",
        description: "Throw a ball at the wild pokemon: throw [ball]",
        callback: throwBall,
      },
    },
    caughtPokemons: loadPokedex(savePath),
    wildPokemon: null,
    savePath,
  };
}
