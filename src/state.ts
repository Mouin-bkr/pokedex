import { createInterface, type Interface } from "readline";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { PokeAPI, Pokemon } from "./pokeapi.js";
import { map } from "./command_map.js";
import { mapb } from "./command_mapb.js";
import { explore } from "./command_explore.js";
import { catchPokemon } from "./command_catch.js";

export type State = {
  pokeApi: PokeAPI
  rl: Interface,
  commands: Record<string, CLICommand>,
  nextLocationsURL: string | null ,
  prevLocationsURL: string | null,
  pokedex: Record<string, Pokemon>,
}

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State , ...args: string[]) => Promise<void>;
};

export function initState():State {

  return {
    pokeApi: new PokeAPI(),
    nextLocationsURL: null,
    prevLocationsURL: null,
    rl : createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "Pokedex > ",
     }),
    commands :{
     exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback:  commandExit,
    },
     help: {
      name: "help",
      description: "Help Message",
      callback: commandHelp,
      },
      map: {
        name: "map",
        description: "map the locations list",
        callback: map
      },
      mapb: {
        name: "mapb",
        description: "map back the lcoations list",
        callback:mapb
      },
      explore: {
        name: "explore",
        description: "Explore a specific location",
        callback:explore
      },
      catch: {
        name: "catch",
        description: "Catch a specific pokemon",
        callback:catchPokemon
      }
   },
   pokedex: {},
  };

}
