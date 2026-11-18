import { randInt, gcd } from "../utils.js";

export function generateGCD(difficulty) {
  const max = difficulty === "easy" ? 60 : difficulty === "medium" ? 150 : 400;
  const a = randInt(2, max), b = randInt(2, max);
  const c = difficulty === "hard" ? randInt(2, 100) : null;
  const nums = c ? [a,b,c] : [a,b];
  const result = nums.reduce((acc,n) => gcd(acc,n));
  return { prompt: `Tentukan FPB dari ${nums.join(", ")}.`, answer: String(result), explanation: `FPB dari ${nums.join(", ")} adalah ${result}.` };
}
