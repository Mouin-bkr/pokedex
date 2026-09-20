import { describe, expect, test } from "vitest";
import { calcDamage, simulateBattle, toFighter } from "../battle.js";
import type { Pokemon } from "../pokeapi.js";

const mon = (name: string, hp: number, attack: number, defense: number, speed: number) =>
  ({
    name,
    stats: [
      { base_stat: hp, stat: { name: "hp" } },
      { base_stat: attack, stat: { name: "attack" } },
      { base_stat: defense, stat: { name: "defense" } },
      { base_stat: speed, stat: { name: "speed" } },
    ],
  }) as unknown as Pokemon;

const pikachu = mon("pikachu", 35, 55, 40, 90);
const charizard = mon("charizard", 78, 84, 78, 100);
const noCrit = () => 0.5;

describe("toFighter", () => {
  test("reads stats by name, doubles hp", () => {
    expect(toFighter(pikachu)).toMatchObject({
      name: "pikachu",
      maxHp: 70,
      hp: 70,
      attack: 55,
      defense: 40,
      speed: 90,
    });
  });

  test("missing stats get a default", () => {
    const f = toFighter({ name: "ghost", stats: [] } as unknown as Pokemon);
    expect(f.attack).toBe(50);
  });
});

describe("calcDamage", () => {
  test("always deals at least 1", () => {
    const weak = toFighter(mon("weak", 10, 1, 10, 10));
    const tank = toFighter(mon("tank", 10, 10, 250, 10));
    expect(calcDamage(weak, tank, noCrit).damage).toBeGreaterThanOrEqual(1);
  });

  test("crit deals more than a normal hit", () => {
    const a = toFighter(charizard);
    const d = toFighter(pikachu);
    const normal = calcDamage(a, d, () => 0.9).damage;
    const crit = calcDamage(a, d, () => 0).damage;
    expect(crit).toBeGreaterThan(normal);
  });
});

describe("simulateBattle", () => {
  test("stronger pokemon wins and loser hp reaches 0", () => {
    const result = simulateBattle(pikachu, charizard, noCrit);
    expect(result.winner).toBe("charizard");
    expect(result.loser).toBe("pikachu");
    expect(result.log.at(-1)).toContain("charizard wins!");
    expect(result.log.some((l) => l.includes("pikachu: 0/70 HP"))).toBe(true);
  });

  test("faster pokemon moves first", () => {
    const result = simulateBattle(pikachu, charizard, noCrit);
    expect(result.log[1]).toContain("charizard is faster");
  });

  test("argument order does not change the winner", () => {
    expect(simulateBattle(charizard, pikachu, noCrit).winner).toBe("charizard");
  });

  test("always terminates", () => {
    const wall = mon("wall", 255, 5, 250, 5);
    const result = simulateBattle(wall, wall, noCrit);
    expect(result.rounds).toBeGreaterThan(0);
    expect(result.winner).toBe("wall");
  });
});
