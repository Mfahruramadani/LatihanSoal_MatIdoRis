import { randInt, choose, sup } from "../utils.js";

// v8: tiap jenis soal punya beberapa bentuk, supaya tidak hanya "a³ = ?" saja.
export function generatePower(subtype, difficulty) {
  const t = subtype === "mixed" ? choose(["square", "cube", "sqrt", "cbrt", "laws"]) : subtype;
  const d = difficulty;
  const r = d === "easy" ? [2, 20] : d === "medium" ? [11, 50] : [25, 99];   // basis kuadrat/akar
  const c = d === "easy" ? [2, 9] : d === "medium" ? [2, 12] : [5, 20];     // basis pangkat tiga/akar pangkat tiga
  const sm = d === "easy" ? [2, 12] : d === "medium" ? [2, 20] : [5, 30];   // bilangan kecil pendamping
  const ex = (e, ans) => ({ answer: String(ans), explanation: e });
  if (t === "square") {
    const a = randInt(...r), b = randInt(...sm), f = choose(d === "easy" ? ["plain", "plus", "diff"] : ["plain", "plus", "diff", "sumsq"]);
    if (f === "plus") return { prompt: `${a}² + ${b} = ?`, ...ex(`${a}² = ${a * a}, lalu ${a * a} + ${b} = ${a * a + b}.`, a * a + b) };
    if (f === "diff") return { prompt: `${a}² − ${b} = ?`, ...ex(`${a}² = ${a * a}, lalu ${a * a} − ${b} = ${a * a - b}.`, a * a - b) };
    if (f === "sumsq") { const x = randInt(2, d === "medium" ? 12 : 20), y = randInt(2, d === "medium" ? 12 : 20);
      return { prompt: `${x}² + ${y}² = ?`, ...ex(`${x}² = ${x * x} dan ${y}² = ${y * y}; jumlahnya ${x * x + y * y}.`, x * x + y * y) }; }
    return { prompt: `${a}² = ?`, ...ex(`${a}² = ${a} × ${a} = ${a * a}.`, a * a) };
  }
  if (t === "cube") {
    const a = randInt(...c), b = randInt(...sm), f = choose(d === "easy" ? ["plain", "plus", "neg"] : ["plain", "plus", "minus", "neg", "mix"]);
    if (f === "plus") return { prompt: `${a}³ + ${b} = ?`, ...ex(`${a}³ = ${a ** 3}, lalu ${a ** 3} + ${b} = ${a ** 3 + b}.`, a ** 3 + b) };
    if (f === "minus") return { prompt: `${a}³ − ${b} = ?`, ...ex(`${a}³ = ${a ** 3}, lalu ${a ** 3} − ${b} = ${a ** 3 - b}.`, a ** 3 - b) };
    if (f === "neg") return { prompt: `(−${a})³ = ?`, ...ex(`Pangkat ganjil dari bilangan negatif bernilai negatif: (−${a})³ = −${a ** 3}.`, -(a ** 3)) };
    if (f === "mix") { const q = randInt(2, 9); return { prompt: `${a}³ − ${q}² = ?`, ...ex(`${a}³ = ${a ** 3}, ${q}² = ${q * q}; ${a ** 3} − ${q * q} = ${a ** 3 - q * q}.`, a ** 3 - q * q) }; }
    return { prompt: `${a}³ = ?`, ...ex(`${a}³ = ${a} × ${a} × ${a} = ${a ** 3}.`, a ** 3) };
  }
  if (t === "sqrt") {
    const a = randInt(...r), b = randInt(...sm), f = choose(d === "easy" ? ["plain", "plus", "times"] : ["plain", "plus", "times", "sumsq"]);
    if (f === "plus") return { prompt: `√${a * a} + ${b} = ?`, ...ex(`√${a * a} = ${a}, lalu ${a} + ${b} = ${a + b}.`, a + b) };
    if (f === "times") { const k = randInt(2, 9); return { prompt: `${k} × √${a * a} = ?`, ...ex(`√${a * a} = ${a}, lalu ${k} × ${a} = ${k * a}.`, k * a) }; }
    if (f === "sumsq") { const trip = choose([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]]), m = randInt(1, d === "medium" ? 3 : 6), [x, y, z] = trip.map(v => v * m);
      return { prompt: `√(${x * x} + ${y * y}) = ?`, ...ex(`${x * x} + ${y * y} = ${z * z}, dan √${z * z} = ${z}.`, z) }; }
    return { prompt: `√${a * a} = ?`, ...ex(`Karena ${a} × ${a} = ${a * a}, maka √${a * a} = ${a}.`, a) };
  }
  if (t === "cbrt") {
    const a = randInt(...c), b = randInt(...sm), f = choose(d === "easy" ? ["plain", "plus", "neg"] : ["plain", "plus", "times", "neg"]);
    if (f === "plus") return { prompt: `∛${a ** 3} + ${b} = ?`, ...ex(`∛${a ** 3} = ${a}, lalu ${a} + ${b} = ${a + b}.`, a + b) };
    if (f === "times") { const k = randInt(2, 9); return { prompt: `${k} × ∛${a ** 3} = ?`, ...ex(`∛${a ** 3} = ${a}, lalu ${k} × ${a} = ${k * a}.`, k * a) }; }
    if (f === "neg") return { prompt: `∛(−${a ** 3}) = ?`, ...ex(`Karena (−${a})³ = −${a ** 3}, maka ∛(−${a ** 3}) = −${a}.`, -a) };
    return { prompt: `∛${a ** 3} = ?`, ...ex(`Karena ${a}³ = ${a ** 3}, maka ∛${a ** 3} = ${a}.`, a) };
  }
  // sifat pangkat
  const a = randInt(2, d === "hard" ? 12 : 9), e1 = randInt(2, d === "hard" ? 12 : 9), e2 = randInt(2, d === "hard" ? 12 : 9);
  let x = e1, y = e2, k = choose(["mul", "div", "pow", "mulnum", "divnum"]);
  if ((k === "div" || k === "divnum") && x === y) x++;
  if ((k === "div" || k === "divnum") && x < y) [x, y] = [y, x];
  if (k === "mul") return { prompt: `Tentukan n: ${a}${sup(x)} × ${a}${sup(y)} = ${a}ⁿ`, ...ex(`Pangkat dijumlahkan: ${x} + ${y} = ${x + y}.`, x + y) };
  if (k === "div") return { prompt: `Tentukan n: ${a}${sup(x)} ÷ ${a}${sup(y)} = ${a}ⁿ`, ...ex(`Pangkat dikurangkan: ${x} − ${y} = ${x - y}.`, x - y) };
  if (k === "pow") return { prompt: `Tentukan n: (${a}${sup(x)})${sup(y)} = ${a}ⁿ`, ...ex(`Pangkat dikalikan: ${x} × ${y} = ${x * y}.`, x * y) };
  const bs = randInt(2, 5), p = randInt(1, 3), q = randInt(1, 3);
  if (k === "mulnum") return { prompt: `${bs}${sup(p)} × ${bs}${sup(q)} = ?`, ...ex(`${bs}^${p + q} = ${bs ** (p + q)}.`, bs ** (p + q)) };
  const P = p + q; return { prompt: `${bs}${sup(P)} ÷ ${bs}${sup(q)} = ?`, ...ex(`${bs}^${P - q} = ${bs ** p}.`, bs ** p) };
}
