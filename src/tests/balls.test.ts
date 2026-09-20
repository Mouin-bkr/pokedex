import { describe, expect, test } from "vitest";
import { BALLS, catchChance, parseBall, rollCatch } from "../balls.js";
import type { Pokemon } from "../pokeapi.js";

const mon = (base_experience: number | null) =>
  ({ name: "x", base_experience }) as unknown as Pokemon;

describe("catchChance", () => {
  test("stronger pokemon are harder to catch", () => {
    expect(catchChance(39, BALLS.pokeball)).toBeGreaterThan(catchChance(112, BALLS.pokeball));
    expect(catchChance(112, BALLS.pokeball)).toBeGreaterThan(catchChance(267, BALLS.pokeball));
  });

  test("stays strictly between 0 and 1 for any experience", () => {
    for (const exp of [0, 36, 300, 608, 5000]) {
      const c = catchChance(exp, BALLS.pokeball);
      expect(c).toBeGreaterThan(0);
      expect(c).toBeLessThanOrEqual(1);
    }
  });

  test("better balls raise the chance", () => {
    const [p, g, u] = [BALLS.pokeball, BALLS.greatball, BALLS.ultraball].map((b) =>
      catchChance(200, b),
    );
    expect(g).toBeGreaterThan(p);
    expect(u).toBeGreaterThan(g);
  });

  test("master ball never fails", () => {
    expect(catchChance(608, BALLS.masterball)).toBe(1);
    expect(rollCatch(mon(608), BALLS.masterball, () => 0.999999)).toBe(true);
  });

  test("missing base_experience falls back instead of NaN", () => {
    expect(catchChance(null, BALLS.pokeball)).toBe(0.5);
  });
});

describe("rollCatch", () => {
  test("low roll catches, high roll escapes", () => {
    const chance = catchChance(100, BALLS.pokeball);
    expect(rollCatch(mon(100), BALLS.pokeball, () => chance - 0.01)).toBe(true);
    expect(rollCatch(mon(100), BALLS.pokeball, () => chance + 0.01)).toBe(false);
  });
});

describe("parseBall", () => {
  test("defaults to pokeball", () => {
    expect(parseBall()).toBe(BALLS.pokeball);
  });
  test("accepts hyphenated and mixed-case names", () => {
    expect(parseBall("Great-Ball")).toBe(BALLS.greatball);
    expect(parseBall("ULTRABALL")).toBe(BALLS.ultraball);
  });
  test("unknown ball is undefined", () => {
    expect(parseBall("duskball")).toBeUndefined();
  });
});
