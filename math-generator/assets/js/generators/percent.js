import { randInt, choose, gcd, fmtScaled as f } from "../utils.js";

const FR = [[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,8],[3,8],[5,8],[7,8],[1,10],[3,10],[7,10],[9,10],[1,20],[3,20],[1,25]];
const rp = n => "Rp" + n.toLocaleString("id-ID");

export function generatePercent(subtype, difficulty) {
  const type = subtype === "mixed" ? choose(["of", "discount", "increase", "convert"]) : subtype;
  const p = difficulty === "easy" ? choose([10, 20, 25, 50, 75]) : difficulty === "medium" ? randInt(1, 19) * 5 : randInt(1, 99);
  const step = 100 / gcd(p, 100);
  const base = step * randInt(1, difficulty === "easy" ? 5 : difficulty === "medium" ? 20 : 60);
  if (type === "of") return { prompt: `${p}% dari ${base} = ?`, answer: String(p * base / 100),
    explanation: `${p}% × ${base} = ${p}/100 × ${base} = ${p * base / 100}.` };
  if (type === "discount") { const price = base * 1000, cut = price * p / 100;
    return { prompt: `Harga barang ${rp(price)} diskon ${p}%. Berapa harga setelah diskon? (tulis angka tanpa titik)`, answer: String(price - cut),
      explanation: `Diskon = ${p}% × ${price} = ${cut}. Harga akhir = ${price} − ${cut} = ${price - cut}.` }; }
  if (type === "increase") return { prompt: `Sebuah bilangan semula ${base}, lalu naik ${p}%. Berapa bilangan sekarang?`, answer: String(base * (100 + p) / 100),
    explanation: `Kenaikan = ${p}% × ${base} = ${base * p / 100}. Hasil = ${base} + ${base * p / 100} = ${base * (100 + p) / 100}.` };
  const [n, d] = choose(FR), pct = n * 10000 / d; // persen dengan 2 desimal (skala 100)
  return { prompt: `Ubah ${n}/${d} menjadi persen. (tulis angkanya saja, tanpa %)`, answer: f(pct, 2),
    explanation: `${n}/${d} = ${n} ÷ ${d} × 100% = ${f(pct, 2)}%.` };
}
