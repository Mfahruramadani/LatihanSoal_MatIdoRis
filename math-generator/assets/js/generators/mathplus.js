import { randInt, choose, mc, mcNum, shuffle, gcd } from "../utils.js";

const fmt = n => String(Number(n.toFixed(6))).replace(".", ",");
const rp = n => "Rp" + n.toLocaleString("id-ID");
const NAMES = ["Ani", "Budi", "Citra", "Dedi", "Eka", "Fajar", "Gita", "Hadi", "Indah", "Joko"];
const ITEMS = ["tas", "sepatu", "jaket", "kipas angin", "sepeda", "radio", "jam tangan"];
const POOL = (d, sub, map) => sub === "mixed" ? choose(map[d]) : sub;
// Jawaban angka: sebagian pilihan ganda, sebagian isian (isian ditulis tanpa pemisah ribuan).
const num = (prompt, ans, expl, f = String) => Math.random() < 0.4 ? mcNum(prompt, ans, expl, f) : { prompt, answer: String(ans), explanation: expl };

/* ---------- Perbandingan ---------- */
export function generateRatio(sub, d) {
  const t = POOL(d, sub, { easy: ["simplify", "direct"], medium: ["direct", "scale", "share"], hard: ["share", "inverse", "scale"] });
  const k = d === "easy" ? 1 : d === "medium" ? 2 : 3;
  if (t === "simplify") {
    let a, b; do { a = randInt(1, 6 * k); b = randInt(1, 6 * k); } while (a === b || gcd(a, b) !== 1);
    const g = randInt(2, 3 + 4 * k);
    return mc(`Bentuk paling sederhana dari ${a * g} : ${b * g} adalah ...`, `${a} : ${b}`, [`${b} : ${a}`, `${a + 1} : ${b}`, `${a} : ${b + 1}`],
      `Bagi kedua bilangan dengan FPB-nya, yaitu ${g}: ${a * g} : ${b * g} = ${a} : ${b}.`);
  }
  if (t === "direct") {
    const unit = randInt(2, 20) * 500, n1 = randInt(2, 6), n2 = n1 + randInt(2, 6 * k), who = choose(NAMES), it = choose(["buku", "pensil", "penggaris", "permen"]);
    return num(`${who} membeli ${n1} ${it} seharga ${rp(unit * n1)}. Dengan harga satuan yang sama, berapa harga ${n2} ${it}?`, unit * n2,
      `Harga satuan = ${unit * n1} ÷ ${n1} = ${unit}. Harga ${n2} ${it} = ${unit} × ${n2} = ${unit * n2}.`, n => rp(n));
  }
  if (t === "scale") {
    const n = choose([100000, 200000, 500000, 1000000]), cm = randInt(2, 12 * k);
    if (d === "hard") { const km = cm * n / 100000;
      return num(`Jarak dua kota sebenarnya ${km} km. Pada peta berskala 1 : ${n.toLocaleString("id-ID")}, berapa cm jarak keduanya pada peta?`, cm,
        `${km} km = ${km * 100000} cm. Jarak peta = ${km * 100000} ÷ ${n} = ${cm} cm.`); }
    return num(`Pada peta berskala 1 : ${n.toLocaleString("id-ID")}, jarak dua kota ${cm} cm. Berapa km jarak sebenarnya?`, cm * n / 100000,
      `Jarak sebenarnya = ${cm} × ${n} = ${cm * n} cm = ${cm * n / 100000} km.`);
  }
  if (t === "share") {
    const a = randInt(1, 5), b = randInt(2, 6), c = randInt(1, 4), three = d === "hard", parts = three ? [a, b, c] : [a, b];
    const sum = parts.reduce((x, y) => x + y, 0), unit = randInt(2, 10) * 1000, who = choose(NAMES);
    const big = Math.max(...parts), small = Math.min(...parts);
    if (three && big === small) return generateRatio(sub, d);
    const ask = three ? ["selisih bagian terbesar dan terkecil", (big - small) * unit] : ["bagian terbesar", big * unit];
    return num(`${who} membagi uang ${rp(sum * unit)} kepada ${parts.length} orang dengan perbandingan ${parts.join(" : ")}. Berapa ${ask[0]}?`, ask[1],
      `Satu bagian = ${sum * unit} ÷ ${sum} = ${unit}. ${ask[0]} = ${three ? `(${big} − ${small}) × ${unit}` : `${big} × ${unit}`} = ${ask[1]}.`, n => rp(n));
  }
  const total = randInt(2, 8) * randInt(3, 10) * 6, w1 = choose([3, 4, 6]), days = total / w1;
  const divs = Array.from({ length: total }, (_, i) => i + 1).filter(x => total % x === 0 && x > w1 && x <= 30);
  const w2 = choose(divs.length ? divs : [total]);
  return num(`${w1} pekerja menyelesaikan suatu pekerjaan dalam ${days} hari. Berapa hari yang dibutuhkan jika ada ${w2} pekerja (kemampuan sama)?`, total / w2,
    `Perbandingan berbalik nilai. Beban kerja = ${w1} × ${days} = ${total} hari-pekerja. Waktu = ${total} ÷ ${w2} = ${total / w2} hari.`);
}

/* ---------- Konversi satuan ---------- */
const UNITS = { panjang: [["km", 1000], ["m", 1], ["cm", .01], ["mm", .001]], massa: [["ton", 1000], ["kg", 1], ["gram", .001], ["mg", .000001]],
  volume: [["liter", 1], ["mL", .001]], waktu: [["jam", 3600], ["menit", 60], ["detik", 1]] };
const conv = (v, f, t) => Number((v * f / t).toFixed(6));
export function generateUnits(sub, d) {
  const t = POOL(d, sub, { easy: ["down"], medium: ["down", "up"], hard: ["compound", "speed", "up"] });
  const cat = choose(Object.keys(UNITS)), L = UNITS[cat];
  if (t === "compound") {
    const [[bu, bf], [su, sf]] = choose([[["km", 1000], ["m", 1]], [["jam", 60], ["menit", 1]], [["kg", 1000], ["gram", 1]], [["m", 100], ["cm", 1]]]);
    const a = randInt(1, 9), b = randInt(1, bf - 1), ans = a * bf + b;
    return num(`${a} ${bu} ${b} ${su} = ... ${su}`, ans, `${a} ${bu} = ${a * bf} ${su}, ditambah ${b} ${su} = ${ans} ${su}.`);
  }
  if (t === "speed") {
    if (Math.random() < .5) { const k = randInt(1, 10) * 18; return num(`${k} km/jam = ... m/detik`, k / 3.6, `Bagi dengan 3,6: ${k} ÷ 3,6 = ${k / 3.6} m/detik (1 km/jam = 1000 m / 3600 detik).`, fmt); }
    const v = randInt(2, 30); return num(`${v} m/detik = ... km/jam`, Number((v * 3.6).toFixed(6)), `Kalikan dengan 3,6: ${v} × 3,6 = ${fmt(v * 3.6)} km/jam.`, fmt);
  }
  let i = randInt(0, L.length - 2), j = randInt(i + 1, Math.min(L.length - 1, i + (d === "easy" ? 1 : 2)));
  if (d === "easy" && cat === "waktu") [i, j] = [0, 1];
  const [big, small] = [L[i], L[j]], r = big[1] / small[1];
  if (t === "up") { const v = randInt(2, 99) * Math.max(1, Math.round(r / 10)) + (d === "hard" ? randInt(1, 9) : 0), ans = conv(v, small[1], big[1]);
    return num(`${v} ${small[0]} = ... ${big[0]}`, ans, `1 ${big[0]} = ${r.toLocaleString("id-ID")} ${small[0]}, jadi ${v} ÷ ${r.toLocaleString("id-ID")} = ${fmt(ans)} ${big[0]}.`, fmt); }
  const v = randInt(2, 20), ans = conv(v, big[1], small[1]);
  return num(`${v} ${big[0]} = ... ${small[0]}`, ans, `1 ${big[0]} = ${r.toLocaleString("id-ID")} ${small[0]}, jadi ${v} × ${r.toLocaleString("id-ID")} = ${fmt(ans)} ${small[0]}.`, fmt);
}

/* ---------- Aritmetika sosial ---------- */
export function generateSocial(sub, d) {
  const t = POOL(d, sub, { easy: ["profit"], medium: ["profit", "discount", "interest"], hard: ["percent", "tax", "tara", "savings"] });
  const who = choose(NAMES), it = choose(ITEMS), B = randInt(5, 80) * 10000;
  if (t === "profit") { const diff = randInt(1, 9) * 5000, win = Math.random() < .6;
    return num(`${who} membeli ${it} seharga ${rp(B)} lalu menjualnya ${rp(win ? B + diff : B - diff)}. Berapa ${win ? "untung" : "rugi"}nya?`, diff,
      `${win ? "Untung" : "Rugi"} = selisih harga jual dan harga beli = ${diff}.`, n => rp(n)); }
  if (t === "discount") { const p = choose([10, 20, 25, 30, 40, 50]), P = B * 2, pay = P * (100 - p) / 100;
    return num(`Sebuah ${it} berharga ${rp(P)} didiskon ${p}%. Berapa harga yang dibayar?`, pay, `Diskon = ${p}% × ${P} = ${P * p / 100}. Dibayar = ${P} − ${P * p / 100} = ${pay}.`, n => rp(n)); }
  if (t === "interest") { const M = randInt(2, 20) * 100000, p = randInt(2, 12), yr = randInt(1, 5), I = M * p * yr / 100;
    return num(`${who} meminjam ${rp(M)} dengan bunga tunggal ${p}% per tahun. Berapa bunga setelah ${yr} tahun?`, I, `Bunga = ${M} × ${p}% × ${yr} = ${I}.`, n => rp(n)); }
  if (t === "percent") { const p = choose([10, 20, 25, 40, 50]), S = B * (100 + p) / 100;
    return num(`${who} membeli ${it} ${rp(B)} dan menjualnya ${rp(S)}. Berapa persen keuntungannya? (tulis angka saja)`, p, `Untung = ${S - B}. Persentase = ${S - B} ÷ ${B} × 100% = ${p}%.`, n => n + "%"); }
  if (t === "tax") { const k = randInt(1, 9), P = k * 10000, p = choose([10, 20, 25, 50]), after = P * (100 - p) / 100, fin = after * 110 / 100;
    return num(`Harga ${it} ${rp(P)} didiskon ${p}%, lalu dikenai pajak 10%. Berapa harga akhirnya?`, fin, `Setelah diskon: ${after}. Pajak 10% → ${after} × 110% = ${fin}.`, n => rp(n)); }
  if (t === "tara") { const bruto = randInt(1, 9) * 100, tr = choose([2, 4, 5, 10]), neto = bruto * (100 - tr) / 100;
    return num(`Berat kotor (bruto) sekarung beras ${bruto} kg dengan tara ${tr}%. Berapa berat bersih (neto)?`, neto, `Tara = ${tr}% × ${bruto} = ${bruto * tr / 100} kg. Neto = ${bruto} − ${bruto * tr / 100} = ${neto} kg.`); }
  const M = randInt(2, 20) * 500000, p = randInt(3, 12), m = choose([6, 12]), tot = M + M * p * m / 1200;
  return num(`${who} menabung ${rp(M)} dengan bunga tunggal ${p}% per tahun. Berapa saldo setelah ${m} bulan?`, tot, `Bunga = ${M} × ${p}% × ${m}/12 = ${M * p * m / 1200}. Saldo = ${M} + ${M * p * m / 1200} = ${tot}.`, n => rp(n));
}

/* ---------- Aljabar dasar ---------- */
export function generateAlgebra(sub, d) {
  const t = POOL(d, sub, { easy: ["subst", "onestep"], medium: ["twostep", "subst", "simplify"], hard: ["bothsides", "bracket", "word", "simplify"] });
  const x = randInt(-9, 12) || 3, r = d === "easy" ? 9 : 15, sg = n => n < 0 ? `− ${-n}` : `+ ${n}`;
  if (t === "subst") { const a = randInt(2, 9), b = randInt(1, 12), v = randInt(2, 9);
    return num(`Jika x = ${v}, berapakah nilai ${a}x ${sg(b)}?`, a * v + b, `${a}(${v}) + ${b} = ${a * v} + ${b} = ${a * v + b}.`); }
  if (t === "onestep") { const a = randInt(2, r);
    return Math.random() < .5 ? num(`Tentukan x jika x + ${a} = ${x + a}.`, x, `x = ${x + a} − ${a} = ${x}.`)
      : num(`Tentukan x jika ${a}x = ${a * x}.`, x, `x = ${a * x} ÷ ${a} = ${x}.`); }
  if (t === "twostep") { const a = randInt(2, 9), b = randInt(1, r);
    return num(`Tentukan x jika ${a}x ${sg(b)} = ${a * x + b}.`, x, `${a}x = ${a * x + b} ${b >= 0 ? "−" : "+"} ${Math.abs(b)} = ${a * x}, sehingga x = ${x}.`); }
  if (t === "bothsides") { let a = randInt(3, 9), c = randInt(1, a - 1), b = randInt(1, 15), dd = (a - c) * x + b;
    return num(`Tentukan x jika ${a}x + ${b} = ${c}x + ${dd}.`, x, `Pindahkan suku: ${a - c}x = ${dd - b}, sehingga x = ${x}.`); }
  if (t === "bracket") { const a = randInt(2, 6), b = randInt(1, 9);
    return num(`Tentukan x jika ${a}(x ${sg(b)}) = ${a * (x + b)}.`, x, `Bagi kedua ruas dengan ${a}: x ${sg(b)} = ${x + b}, sehingga x = ${x}.`); }
  if (t === "word") { const a = randInt(2, 5), b = randInt(3, 20), n = randInt(3, 15);
    return num(`${a} kali suatu bilangan ditambah ${b} hasilnya ${a * n + b}. Berapa bilangan itu?`, n, `${a}n + ${b} = ${a * n + b} → ${a}n = ${a * n} → n = ${n}.`); }
  const a = randInt(2, 9), b = randInt(1, 9), c = randInt(1, 9), ans = a + b - c; // a·x + b·x − c·x
  return mc(`Bentuk paling sederhana dari ${a}x + ${b}x − ${c}x adalah ...`, `${ans}x`, [`${a + b + c}x`, `${a - b + c}x`, `${ans + 1}x`, `${ans}x²`],
    `Jumlahkan koefisien suku sejenis: ${a} + ${b} − ${c} = ${ans}.`);
}

/* ---------- Bilangan negatif (konteks) ---------- */
export function generateNegative(sub, d) {
  const t = POOL(d, sub, { easy: ["temp", "compare"], medium: ["temp", "depth", "balance"], hard: ["multi", "balance", "expr"] });
  const k = d === "easy" ? 8 : d === "medium" ? 20 : 40;
  if (t === "temp") { const a = randInt(-k, k), c = randInt(2, k), up = Math.random() < .5;
    return num(`Suhu awal ${a}°C, lalu ${up ? "naik" : "turun"} ${c}°C. Berapa suhu sekarang?`, up ? a + c : a - c, `${a} ${up ? "+" : "−"} ${c} = ${up ? a + c : a - c}.`, n => n + "°C"); }
  if (t === "compare") { const s = [...new Set(Array.from({ length: 4 }, () => randInt(-k, k)))]; if (s.length < 4) return generateNegative(sub, d);
    const asc = Math.random() < .5, v = asc ? Math.min(...s) : Math.max(...s);
    return mc(`Manakah bilangan ${asc ? "terkecil" : "terbesar"}: ${s.join(", ")}?`, v, s, `Pada garis bilangan, bilangan di sebelah ${asc ? "kiri" : "kanan"} lebih ${asc ? "kecil" : "besar"}; jawabannya ${v}.`); }
  if (t === "depth") { const a = randInt(10, 80), up = randInt(2, a - 1);
    return num(`Seorang penyelam berada pada kedalaman ${a} m (posisi −${a}), lalu naik ${up} m. Posisinya sekarang?`, -a + up, `−${a} + ${up} = ${-a + up}.`, n => n + " m"); }
  if (t === "balance") { const s = randInt(2, 20) * 10000, m = randInt(2, 20) * 10000, y = randInt(1, 15) * 10000;
    return num(`Saldo awal ${rp(s)}. Dipakai ${rp(s + m)}, lalu ditransfer masuk ${rp(y)}. Berapa saldo akhir (negatif berarti kurang)?`, -m + y, `${s} − ${s + m} + ${y} = ${-m + y}.`, n => (n < 0 ? "−" : "") + rp(Math.abs(n))); }
  if (t === "multi") { const a = randInt(-5, 10), dr = randInt(2, 6), h = randInt(2, 6);
    return num(`Suhu pukul 00.00 adalah ${a}°C. Suhu turun ${dr}°C setiap jam selama ${h} jam. Berapa suhu akhir?`, a - dr * h, `${a} − (${dr} × ${h}) = ${a} − ${dr * h} = ${a - dr * h}.`, n => n + "°C"); }
  const a = randInt(2, 9), b = randInt(2, 9), c = randInt(2, 20);
  return num(`Hitung: (−${a}) × (−${b}) − ${c}`, a * b - c, `(−${a}) × (−${b}) = ${a * b} (negatif × negatif = positif). ${a * b} − ${c} = ${a * b - c}.`);
}
