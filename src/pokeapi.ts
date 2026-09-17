import {Cache} from "./pokeCache.js";
export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private readonly cache = new Cache(5000); // 5 seconds

  constructor() { }

  async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
    try {
      const url = pageURL ?? PokeAPI.baseURL+"/location-area";
      if (this.cache.get<ShallowLocations>(url)) {
        return this.cache.get<ShallowLocations>(url)!;
      }
      const response = await fetch(url);      
      if (!response.ok) {
        throw new Error(`Response status : ${response.status}`);
      }
      const result = await response.json();
      this.cache.add<ShallowLocations>(url, result);
      return result;

    } catch (e) {
      throw e;
    }
  }

  async fetchLocation(locationName: string): Promise<Location | null> {
    try {
      const url = PokeAPI.baseURL+"/location-area/"+locationName;
      if (this.cache.get<Location>(url)) {
        return this.cache.get<Location>(url)!;
      }
      const response = await fetch(url)
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`Response status : ${response.status}`);
      }
      const result = await response.json();
      this.cache.add<Location>(url, result);
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
  pokemon_encounters: {
    pokemon: {
      name: string
      url: string
    }
  }[];
  };
