export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";

  constructor() { }

  async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
    try {
      const response = await fetch(pageURL ?? PokeAPI.baseURL+"/location-area")
      if (!response.ok) {
        throw new Error(`Response status : ${response.status}`);
      }
      const result = await response.json();
      return result;

    } catch (e) {
      throw e;
    }
  }

  async fetchLocation(locationName: string): Promise<Location> {
    try {
      const response = await fetch(PokeAPI.baseURL+"/location-area/"+locationName)
      if (!response.ok) {
        throw new Error(`Response status : ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (e) {
      throw e;
    }
  }
}


export type ShallowLocations = {
  count: number
    next: string | null
    previous: any | null
    results: Location[]
};

export type Location = {
  name: string
  url: string
  };
