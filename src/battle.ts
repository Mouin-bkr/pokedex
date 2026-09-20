import type { Pokemon } from "./pokeapi.js";
import type { Rng } from "./balls.js";

export type Fighter = {
  name: string;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
};

export type BattleResult = { winner: string; loser: string; rounds: number; log: string[] };

const DAMAGE_SCALE = 22;
const CRIT_CHANCE = 1 / 8;
const CRIT_MULTIPLIER = 1.5;
const DEFAULT_STAT = 50;

function stat(p: Pokemon, name: string): number {
  return p.stats.find((s) => s.stat.name === name)?.base_stat ?? DEFAULT_STAT;
}

export function toFighter(p: Pokemon): Fighter {
  const maxHp = stat(p, "hp") * 2;
  return {
    name: p.name,
    maxHp,
    hp: maxHp,
    attack: stat(p, "attack"),
    defense: stat(p, "defense"),
    speed: stat(p, "speed"),
  };
}

export function calcDamage(
  attacker: Fighter,
  defender: Fighter,
  rng: Rng,
): { damage: number; crit: boolean } {
  const variance = 0.85 + rng() * 0.15;
  const crit = rng() < CRIT_CHANCE;
  const ratio = attacker.attack / Math.max(1, defender.defense);
  const raw = DAMAGE_SCALE * ratio * variance * (crit ? CRIT_MULTIPLIER : 1);
  return { damage: Math.max(1, Math.round(raw)), crit };
}

export function simulateBattle(a: Pokemon, b: Pokemon, rng: Rng = Math.random): BattleResult {
  const fa = toFighter(a);
  const fb = toFighter(b);
  const [first, second] = fa.speed >= fb.speed ? [fa, fb] : [fb, fa];
  const log = [`${fa.name} vs ${fb.name}!`, `${first.name} is faster and moves first.`];

  for (let rounds = 1; ; rounds++) {
    log.push(`-- Round ${rounds} --`);
    for (const [attacker, defender] of [[first, second], [second, first]]) {
      const { damage, crit } = calcDamage(attacker, defender, rng);
      defender.hp = Math.max(0, defender.hp - damage);
      const critText = crit ? " Critical hit!" : "";
      log.push(
        `${attacker.name} hits ${defender.name} for ${damage}.${critText} ${defender.name}: ${defender.hp}/${defender.maxHp} HP`,
      );
      if (defender.hp === 0) {
        log.push(`${defender.name} fainted! ${attacker.name} wins!`);
        return { winner: attacker.name, loser: defender.name, rounds, log };
      }
    }
  }
}
