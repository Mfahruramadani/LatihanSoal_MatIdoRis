import { randInt, choose, shuffle, mc, mcNum } from "../utils.js";

const R = (d, e, m, h) => d === "easy" ? e : d === "medium" ? m : h;
const OBJ = [["🍎", "apel"], ["🐱", "kucing"], ["🚗", "mobil"], ["🌳", "pohon"], ["⭐", "bintang"], ["🎈", "balon"], ["📚", "buku"], ["🔔", "lonceng"],
  ["🍌", "pisang"], ["🐟", "ikan"], ["🏠", "rumah"], ["⚽", "bola"], ["🎸", "gitar"], ["🌙", "bulan"], ["🍩", "donat"], ["🦋", "kupu-kupu"]];
const memo = (q, content, seconds) => ({ ...q, memorize: { content, seconds } });

function digits(d, letters) {
  const n = R(d, 4, 6, 8), pool = letters ? [..."BCDFGHJKLMNPQRSTVWXZ"] : [..."0123456789"], seq = Array.from({ length: n }, () => choose(pool)), rev = d === "hard" && Math.random() < .5;
  const ans = (rev ? [...seq].reverse() : seq).join(" "), what = letters ? "huruf" : "angka";
  return memo({ kind: "seq", prompt: `Tulis ${what} tadi ${rev ? "dalam urutan TERBALIK" : "sesuai urutan"}.`, answer: ans, explanation: `${what[0].toUpperCase() + what.slice(1)} yang ditampilkan: ${seq.join(" ")}${rev ? `; terbalik: ${ans}` : ""}.` },
    seq.join("   "), n + R(d, 2, 2, 3));
}
function positions(d) {
  const [r, c] = R(d, [2, 3], [3, 3], [4, 4]), k = R(d, 3, 4, 6), cells = shuffle(Array.from({ length: r * c }, (_, i) => i)).slice(0, k), objs = shuffle(OBJ).slice(0, k);
  const grid = Array.from({ length: r * c }, (_, i) => cells.includes(i) ? objs[cells.indexOf(i)][0] : "⬜"), rows = Array.from({ length: r }, (_, i) => grid.slice(i * c, i * c + c).join("  "));
  const j = randInt(0, k - 1), pos = i => `Baris ${Math.floor(i / c) + 1}, Kolom ${i % c + 1}`, show = objs.map(o => o[0]);
  const q = Math.random() < .5
    ? mc(`Objek apa yang ada di ${pos(cells[j])}?`, objs[j][0], [...show, ...OBJ.map(o => o[0])], `Di ${pos(cells[j])} terdapat ${objs[j][0]} (${objs[j][1]}).`)
    : mc(`Di mana letak ${objs[j][0]} (${objs[j][1]})?`, pos(cells[j]), Array.from({ length: r * c }, (_, i) => pos(i)), `${objs[j][0]} berada di ${pos(cells[j])}.`);
  return memo(q, rows.join("\n"), R(d, 6, 8, 12));
}
function pairs(d) {
  const n = R(d, 3, 4, 6), P = shuffle(OBJ).slice(0, n), j = randInt(0, n - 1), toPic = d === "easy" || Math.random() < .5;
  const q = toPic ? mc(`Gambar apa yang berpasangan dengan kata “${P[j][1]}”?`, P[j][0], [...P.map(p => p[0]), ...OBJ.map(o => o[0])], `${P[j][1]} berpasangan dengan ${P[j][0]}.`)
    : mc(`Kata apa yang berpasangan dengan gambar ${P[j][0]}?`, P[j][1], [...P.map(p => p[1]), ...OBJ.map(o => o[1])], `${P[j][0]} berpasangan dengan ${P[j][1]}.`);
  return memo(q, P.map(p => `${p[1]}  →  ${p[0]}`).join("\n"), n * 2 + 2);
}
function visual(d) {
  const n = R(d, 3, 4, 5), g = Array.from({ length: n }, () => Array.from({ length: n }, () => Math.random() < .5 ? 1 : 0)), txt = m => m.map(r => r.map(x => x ? "■" : "□").join(" ")).join("\n");
  const secs = R(d, 5, 7, 9), content = txt(g);
  if (d === "easy") { const r = randInt(0, n - 1), cnt = g[r].reduce((a, b) => a + b, 0);
    return memo(mcNum(`Berapa kotak ■ pada baris ke-${r + 1}?`, cnt, `Baris ke-${r + 1}: ${g[r].map(x => x ? "■" : "□").join(" ")} → ${cnt} kotak terisi.`), content, secs); }
  const wrong = new Set(), flips = d === "hard" ? 1 : 2;
  for (let t = 0; t < 80 && wrong.size < 3; t++) { const m = g.map(r => [...r]); for (let f = 0; f < flips; f++) { const a = randInt(0, n - 1), b = randInt(0, n - 1); m[a][b] ^= 1; } const s = txt(m); if (s !== content) wrong.add(s); }
  return memo(mc("Manakah pola yang sama dengan yang ditampilkan tadi?", content, [...wrong], "Bandingkan kotak demi kotak; pilihan lain memiliki kotak yang berbeda."), content, secs);
}
function list(d) {
  const n = R(d, 4, 6, 8), items = shuffle(OBJ).slice(0, n), rest = OBJ.filter(o => !items.includes(o)), nm = o => `${o[0]} ${o[1]}`, t = choose(R(d, ["in", "notin"], ["in", "notin"], ["notin", "nth", "in"]));
  const content = items.map(nm).join("\n");
  let q;
  if (t === "in") q = mc("Manakah benda yang ADA dalam daftar tadi?", nm(choose(items)), rest.map(nm), "Benda tersebut ada dalam daftar yang ditampilkan.");
  else if (t === "notin") { const a = choose(rest); q = mc("Manakah benda yang TIDAK ada dalam daftar tadi?", nm(a), items.map(nm), `${a[1]} tidak termasuk dalam daftar.`); }
  else { const i = randInt(0, n - 1); q = mc(`Benda ke-${i + 1} dalam daftar tadi adalah ...`, nm(items[i]), items.map(nm), `Urutan daftar: ${items.map(o => o[1]).join(", ")}.`); }
  if (t === "in") q.choices = shuffle([q.answer, ...q.choices.filter(c => c !== q.answer)]);
  return memo(q, content, n + 3);
}
const NAMES = ["Rina", "Dodi", "Sari", "Toni", "Maya", "Bayu"], CITY = ["Medan", "Bandung", "Makassar", "Malang", "Padang", "Solo"], HOBI = ["melukis", "berenang", "membaca", "memasak", "bersepeda", "menari"],
  WARNA = ["merah", "biru", "hijau", "kuning", "ungu", "oranye"];
function info(d) {
  const nf = R(d, 3, 4, 5), F = shuffle([["Umur", () => String(randInt(10, 60)), "umurnya"], ["Kota", () => choose(CITY), "kotanya"], ["Hobi", () => choose(HOBI), "hobinya"], ["Warna favorit", () => choose(WARNA), "warna favoritnya"], ["Anak ke", () => String(randInt(1, 5)), "urutan kelahirannya"]]).slice(0, nf - 1);
  const names = shuffle(NAMES).slice(0, d === "hard" ? 2 : 1), people = names.map(n => ({ n, f: F.map(x => [x[0], x[1](), x[2]]) }));
  const p = choose(people), f = choose(p.f), pool = { Umur: () => String(randInt(10, 60)), Kota: () => choose(CITY), Hobi: () => choose(HOBI), "Warna favorit": () => choose(WARNA), "Anak ke": () => String(randInt(1, 5)) }[f[0]];
  const wrong = Array.from({ length: 12 }, pool);
  const content = people.map(x => [`Nama: ${x.n}`, ...x.f.map(y => `${y[0]}: ${y[1]}`)].join("\n")).join("\n\n");
  return memo(mc(`Apa ${f[2]} ${p.n}?`, f[1], wrong, `${p.n}: ${f[0]} = ${f[1]}.`), content, R(d, 7, 9, 14));
}
export function generateMemory(sub, d) {
  const t = sub === "mixed" ? choose(["digits", "letters", "positions", "pairs", "visual", "list", "info"]) : sub;
  return ({ digits: () => digits(d, false), letters: () => digits(d, true), positions: () => positions(d), pairs: () => pairs(d), visual: () => visual(d), list: () => list(d), info: () => info(d) })[t]();
}
