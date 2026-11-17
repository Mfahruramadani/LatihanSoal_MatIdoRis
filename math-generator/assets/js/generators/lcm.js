import { randInt, gcd } from "../utils.js";

export function generateLCM(difficulty) {
  const max = difficulty === "easy" ? 12 : difficulty === "medium" ? 20 : 35;
  const a = randInt(2, max), b = randInt(2, max);
  const c = difficulty === "hard" ? randInt(2, 15) : null;
  const nums = c ? [a,b,c] : [a,b];
  const lcm = nums.reduce((acc,n) => acc / gcd(acc,n) * n, 1);
  return { prompt: `Tentukan KPK dari ${nums.join(", ")}.`, answer: String(lcm), explanation: `KPK dari ${nums.join(", ")} adalah ${lcm}.` };
}
