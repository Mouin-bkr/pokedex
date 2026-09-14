import { State } from "./state.js";

export async function mapb(state: State) {
  if (state.prevLocationsURL === null) {
    console.log("you're on the first page")
  }
  else {
    const maps = await state.pokeApi.fetchLocations(state.prevLocationsURL)
    state.nextLocationsURL = maps.next
    state.prevLocationsURL = maps.previous
    for (const map of maps.results) {
      console.log(map.name)
    }
  }
}
