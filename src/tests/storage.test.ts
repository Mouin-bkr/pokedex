import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadPokedex, savePokedex, slimPokemon } from "../storage.js";
import type { Pokemon } from "../pokeapi.js";

const full = {
  name: "pikachu",
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ slot: 1, type: { name: "electric", url: "u" } }],
  abilities: [{ is_hidden: false, ability: { name: "static", url: "u" } }],
  stats: [{ base_stat: 35, effort: 0, stat: { name: "hp", url: "u" } }],
  moves: new Array(100).fill({ move: "big" }),
  sprites: { front_default: "x" },
} as unknown as Pokemon;

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "pokedex-test-"));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("slimPokemon", () => {
  test("keeps only the typed fields", () => {
    const slim = slimPokemon(full);
    expect(Object.keys(slim).sort()).toEqual(
      ["abilities", "base_experience", "height", "name", "stats", "types", "weight"].sort(),
    );
    expect(slim.types).toEqual([{ type: { name: "electric" } }]);
    expect(slim.stats).toEqual([{ base_stat: 35, stat: { name: "hp" } }]);
  });
});

describe("save/load", () => {
  test("roundtrips a pokedex", () => {
    const path = join(dir, "nested", "save.json");
    const pokedex = { pikachu: slimPokemon(full) };
    savePokedex(path, pokedex);
    expect(loadPokedex(path)).toEqual(pokedex);
  });

  test("missing file gives empty pokedex", () => {
    expect(loadPokedex(join(dir, "nope.json"))).toEqual({});
  });

  test("corrupt file gives empty pokedex", () => {
    const path = join(dir, "bad.json");
    writeFileSync(path, "{not json");
    expect(loadPokedex(path)).toEqual({});
  });

  test("non-object JSON gives empty pokedex", () => {
    const path = join(dir, "arr.json");
    writeFileSync(path, "[1,2,3]");
    expect(loadPokedex(path)).toEqual({});
  });
});
