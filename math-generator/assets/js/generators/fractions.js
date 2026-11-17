import { randInt, choose, gcd } from "../utils.js";

function fraction(n, d) {
  const g = gcd(Math.abs(n), d); n /= g; d /= g;
  if (d < 0) { n = -n; d = -d; }
  return { n, d };
}
const display = f => f.d === 1 ? String(f.n) : `${f.n}/${f.d}`;
const SYM = { addition: "+", subtraction: "−", multiplication: "×", division: "÷" };

export function generateFraction(subtype, difficulty) {
  const max = difficulty === "easy" ? 8 : difficulty === "medium" ? 15 : 30;
  const maxDen = difficulty === "easy" ? 40 : difficulty === "medium" ? 120 : 200;
  let q;
  for (let t = 0; t < 60; t++) { // batasi hasil agar tidak terlalu besar
    const a = randInt(1, max), b = randInt(2, max), c = randInt(1, max), d = randInt(2, max);
    const sym = subtype === "mixed" ? choose(["+", "−", "×", "÷"]) : SYM[subtype];
    const [n, den] = sym === "+" ? [a*d + c*b, b*d] : sym === "−" ? [a*d - c*b, b*d] : sym === "×" ? [a*c, b*d] : [a*d, b*c];
    const r = fraction(n, den);
    q = { a, b, c, d, sym, r };
    if (r.d <= maxDen && Math.abs(r.n) <= maxDen * 2) break;
  }
  const { a, b, c, d, sym, r } = q;
  const prompt = `${a}/${b} ${sym} ${c}/${d} = ?`;
  const how = sym === "+" || sym === "−" ? `Samakan penyebut (${b*d}), lalu ${sym === "+" ? "jumlahkan" : "kurangkan"} pembilang.`
    : sym === "×" ? "Kalikan pembilang dengan pembilang dan penyebut dengan penyebut." : `Ubah ke perkalian dengan kebalikan ${c}/${d}, yaitu ${d}/${c}.`;
  return { prompt, answer: display(r), answerValue: r, explanation: `${how} Hasil disederhanakan: ${display(r)}.` };
}
