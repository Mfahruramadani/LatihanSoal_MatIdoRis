import { randInt, shuffle } from "../utils.js";

export function generateOrdering(difficulty) {
  const count = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
  const maxDen = difficulty === "easy" ? 8 : difficulty === "medium" ? 15 : 25;
  const values = new Map();
  while (values.size < count) {
    const d = randInt(2, maxDen), n = randInt(1, d - 1);
    const key = `${n}/${d}`;
    const value = n / d;
    if (![...values.values()].some(v => Math.abs(v - value) < 0.00001)) values.set(key, value);
  }
  const items = [...values.entries()];
  const descending = Math.random() < 0.5;
  const sorted = [...items].sort((x,y) => descending ? y[1]-x[1] : x[1]-y[1]);
  const shown = shuffle(items.map(x => x[0]));
  const direction = descending ? "terbesar ke terkecil" : "terkecil ke terbesar";
  return {
    prompt: `Urutkan ${direction}: ${shown.join(", ")}`,
    answer: sorted.map(x => x[0]).join(", "),
    answerValue: sorted.map(x => x[0]),
    explanation: `Urutan ${direction}: ${sorted.map(x=>x[0]).join(", ")}`
  };
}
