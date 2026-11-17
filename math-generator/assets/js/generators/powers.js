import { randInt, choose, sup } from "../utils.js";

export function generatePower(subtype, difficulty) {
  const t = subtype === "mixed" ? choose(["square", "cube", "sqrt", "cbrt", "laws"]) : subtype;
  const r = difficulty === "easy" ? [2, 15] : difficulty === "medium" ? [11, 30] : [25, 60];
  const c = difficulty === "easy" ? [2, 6] : difficulty === "medium" ? [2, 10] : [5, 15];
  let a;
  if (t === "square") { a = randInt(...r); return { prompt: `${a}² = ?`, answer: String(a * a), explanation: `${a}² = ${a} × ${a} = ${a * a}.` }; }
  if (t === "cube") { a = randInt(...c); return { prompt: `${a}³ = ?`, answer: String(a ** 3), explanation: `${a}³ = ${a} × ${a} × ${a} = ${a ** 3}.` }; }
  if (t === "sqrt") { a = randInt(...r); return { prompt: `√${a * a} = ?`, answer: String(a), explanation: `Karena ${a} × ${a} = ${a * a}, maka √${a * a} = ${a}.` }; }
  if (t === "cbrt") { a = randInt(...c); return { prompt: `∛${a ** 3} = ?`, answer: String(a), explanation: `Karena ${a}³ = ${a ** 3}, maka ∛${a ** 3} = ${a}.` }; }
  a = randInt(2, 9); let e1 = randInt(2, 9), e2 = randInt(2, 9), k = choose(["mul", "div", "pow"]);
  if (k === "div" && e1 === e2) e1++;
  if (k === "div" && e1 < e2) [e1, e2] = [e2, e1];
  if (k === "mul") return { prompt: `Tentukan n: ${a}${sup(e1)} × ${a}${sup(e2)} = ${a}ⁿ`, answer: String(e1 + e2), explanation: `Pangkat dijumlahkan: ${e1} + ${e2} = ${e1 + e2}.` };
  if (k === "div") return { prompt: `Tentukan n: ${a}${sup(e1)} ÷ ${a}${sup(e2)} = ${a}ⁿ`, answer: String(e1 - e2), explanation: `Pangkat dikurangkan: ${e1} − ${e2} = ${e1 - e2}.` };
  return { prompt: `Tentukan n: (${a}${sup(e1)})${sup(e2)} = ${a}ⁿ`, answer: String(e1 * e2), explanation: `Pangkat dikalikan: ${e1} × ${e2} = ${e1 * e2}.` };
}
