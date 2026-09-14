import { State } from "./state.js";

export async function map(state: State) {
  const maps = await state.pokeApi.fetchLocations(state.nextLocationsURL)
  state.nextLocationsURL = maps.next
  state.prevLocationsURL = maps.previous
  for (const map of maps.results) {
    console.log(map.name)
  }
}
