import { randInt, choose, primeFactors } from "../utils.js";

export function generateFactor(subtype, difficulty) {
  const t = subtype === "mixed" ? choose(["factorization", "count", "isprime"]) : subtype;
  const [lo, hi] = difficulty === "easy" ? [4, 60] : difficulty === "medium" ? [20, 200] : [100, 1000];
  let n = randInt(lo, hi), pf = primeFactors(n);
  if (t === "factorization") {
    while (pf.length < 2) { n = randInt(lo, hi); pf = primeFactors(n); }
    return { kind: "factors", prompt: `Faktorisasi prima dari ${n}? (contoh jawaban: 2 × 2 × 3)`, answer: pf.join(" × "),
      explanation: `Bagi ${n} dengan bilangan prima terkecil berulang kali: ${pf.join(" × ")}.` };
  }
  if (t === "count") {
    const fs = Array.from({ length: n }, (_, i) => i + 1).filter(x => n % x === 0);
    return { prompt: `Berapa banyak faktor positif dari ${n}?`, answer: String(fs.length), explanation: `Faktor ${n}: ${fs.join(", ")}. Jumlahnya ${fs.length}.` };
  }
  const prime = pf.length === 1;
  return { prompt: `Apakah ${n} bilangan prima? (jawab: ya / tidak)`, answer: prime ? "ya" : "tidak",
    explanation: prime ? `${n} hanya habis dibagi 1 dan dirinya sendiri.` : `${n} = ${pf.join(" × ")}, jadi bukan bilangan prima.` };
}
