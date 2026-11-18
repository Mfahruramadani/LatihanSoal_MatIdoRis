import { randInt, choose, gcd, fmtScaled as f } from "../utils.js";

const rp = n => "Rp" + n.toLocaleString("id-ID");
// penyebut yang membuat hasil persen berhingga (dua desimal)
const DEN = { easy: [2, 4, 5, 10, 20, 25], medium: [2, 4, 5, 8, 10, 20, 25, 40, 50], hard: [2, 4, 5, 8, 10, 16, 20, 25, 40, 50, 80, 125, 200] };
const ITEMS = ["tas", "sepatu", "jaket", "buku tulis", "kipas angin", "sepeda", "radio", "jam tangan", "topi", "celana"];

export function generatePercent(subtype, difficulty) {
  const type = subtype === "mixed" ? choose(["of", "discount", "increase", "convert"]) : subtype;
  const d = difficulty;
  const p = d === "easy" ? choose([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80]) : d === "medium" ? randInt(1, 19) * 5 : randInt(1, 99);
  const step = 100 / gcd(p, 100);
  const maxK = d === "easy" ? 20 : d === "medium" ? 40 : 120;
  const base = step * randInt(1, maxK);
  if (type === "of") return { prompt: `${p}% dari ${base} = ?`, answer: String(p * base / 100),
    explanation: `${p}% × ${base} = ${p}/100 × ${base} = ${p * base / 100}.` };
  if (type === "discount") {
    const unit = choose([500, 1000, 2500, 5000]);
    const price = base * unit, cut = price * p / 100, it = choose(ITEMS);
    return { prompt: `Harga ${it} ${rp(price)} diskon ${p}%. Berapa harga setelah diskon? (tulis angka tanpa titik)`, answer: String(price - cut),
      explanation: `Diskon = ${p}% × ${price} = ${cut}. Harga akhir = ${price} − ${cut} = ${price - cut}.` };
  }
  if (type === "increase") {
    const ctx = choose(["bilangan", "jumlah siswa", "harga beras per kg", "jumlah penduduk desa", "tabungan"]);
    return { prompt: `${ctx[0].toUpperCase() + ctx.slice(1)} semula ${base}, lalu naik ${p}%. Berapa nilainya sekarang?`, answer: String(base * (100 + p) / 100),
      explanation: `Kenaikan = ${p}% × ${base} = ${base * p / 100}. Hasil = ${base} + ${base * p / 100} = ${base * (100 + p) / 100}.` };
  }
  const den = choose(DEN[d]), n0 = randInt(1, den - 1), g = gcd(n0, den), nn = n0 / g, dd = den / g; // selalu pecahan paling sederhana
  const pct = nn * 10000 / dd;
  return { prompt: `Ubah ${nn}/${dd} menjadi persen. (tulis angkanya saja, tanpa %)`, answer: f(pct, 2),
    explanation: `${nn}/${dd} = ${nn} ÷ ${dd} × 100% = ${f(pct, 2)}%.` };
}
