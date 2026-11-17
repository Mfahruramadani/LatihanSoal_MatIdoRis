import { randInt, choose, shuffle, mc, bank, pickBank, mcItem } from "../utils.js";
import { LEVELS } from "./english.js";

const ONES = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const TENS = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
const words = n => n < 20 ? ONES[n] : n < 100 ? TENS[n / 10 | 0] + (n % 10 ? "-" + ONES[n % 10] : "") : ONES[n / 100 | 0] + " hundred" + (n % 100 ? " " + words(n % 100) : "");
const typed = (prompt, answer, accept, explanation) => ({ kind: "vocab", prompt, answer, accept, explanation });
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], DAYS_ID = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function numbers(d) {
  const n = d === "easy" ? randInt(1, 20) : d === "medium" ? randInt(21, 99) : randInt(100, 999), w = words(n);
  const accept = [w, w.replace(/-/g, " "), w.replace(" hundred ", " hundred and ")];
  if (d === "easy") return Math.random() < .5 ? mc(`Angka ${n} dalam bahasa Inggris adalah ...`, w, [words(n + 1), words(Math.max(1, n - 1)), words(n > 10 ? n - 10 : n + 10)], `${n} = ${w}.`)
    : mc(`“${w}” berarti angka ...`, n, [n + 1, n - 1, n + 10], `${w} = ${n}.`);
  return Math.random() < .6 ? typed(`Tulis angka ${n} dalam bahasa Inggris.`, w, accept, `${n} ditulis ${w}.`)
    : mc(`“${w}” berarti angka ...`, n, [n + 1, n - 10, n + 10, +String(n).split("").reverse().join("")], `${w} = ${n}.`);
}
function days(d) {
  const t = d === "easy" ? "tr" : d === "medium" ? choose(["tr", "next"]) : choose(["next", "month"]);
  if (t === "tr") { const dayQ = Math.random() < .5, i = randInt(0, 6), j = randInt(0, 11);
    return dayQ ? mc(`Apa bahasa Inggris dari hari “${DAYS_ID[i]}”?`, DAYS[i], DAYS.filter(x => x !== DAYS[i]), `${DAYS_ID[i]} = ${DAYS[i]}.`)
      : mc(`Apa arti “${MONTHS[j]}”?`, MONTHS_ID[j], MONTHS_ID.filter(x => x !== MONTHS_ID[j]), `${MONTHS[j]} = ${MONTHS_ID[j]}.`); }
  if (t === "next") { const i = randInt(0, 6), s = Math.random() < .5 ? 1 : -1, n = randInt(1, d === "hard" ? 4 : 1) * s, a = DAYS[(i + n + 70) % 7];
    return mc(`What day is ${Math.abs(n)} day${Math.abs(n) > 1 ? "s" : ""} ${s > 0 ? "after" : "before"} ${DAYS[i]}?`, a, DAYS.filter(x => x !== a), `${Math.abs(n)} hari ${s > 0 ? "setelah" : "sebelum"} ${DAYS[i]} adalah ${a}.`); }
  const i = randInt(0, 11), n = randInt(2, 7), a = MONTHS[(i + n) % 12];
  return typed(`What month is ${n} months after ${MONTHS[i]}? (tulis dalam bahasa Inggris)`, a, [a], `${n} bulan setelah ${MONTHS[i]} adalah ${a}.`);
}
function translate(d) {
  const L = LEVELS[d] || LEVELS.medium, w = choose(L), enid = Math.random() < .5;
  if (enid) return mc(`Apa arti kata “${w.en}”?`, w.id[0], shuffle(L).filter(o => !o.id.some(x => w.id.includes(x))).map(o => o.id[0]), `“${w.en}” berarti ${w.id.join(", ")}.`);
  const shown = choose(w.id);
  return mc(`Kata bahasa Inggris untuk “${shown}” adalah ...`, w.en, shuffle(L).filter(o => !o.id.includes(shown)).map(o => o.en), `“${shown}” = ${w.en}.`);
}
const CLOZE = bank([
  "1|She ___ to school every day.|goes|go~going~gone|Subjek she (orang ketiga tunggal) memakai verb + s/es: goes.",
  "1|I have two ___.|brothers|brother~brothering~broth|Setelah two dipakai kata benda jamak: brothers.",
  "1|This bag is very ___.|heavy|heavily~heaviness~heave|Setelah to be (is) dipakai adjective: heavy.",
  "1|My mother cooks ___ in the kitchen.|dinner|dinners are~cooked dinner~dine|Cooks membutuhkan objek berupa kata benda: dinner.",
  "2|He speaks English ___.|fluently|fluent~fluency~more fluent|Adverb (fluently) menerangkan kata kerja speaks.",
  "2|They ___ football when it started to rain.|were playing|played~are playing~have play|Past continuous untuk kegiatan yang sedang berlangsung saat kejadian lain terjadi.",
  "2|She is ___ than her sister.|taller|tall~tallest~more tall|Perbandingan dua orang memakai comparative: taller.",
  "2|We ___ to the zoo last Sunday.|went|go~goes~going|Last Sunday menunjukkan lampau; bentuk lampau go adalah went.",
  "3|If I ___ rich, I would buy a big house.|were|am~will be~was being|Conditional type 2 memakai were untuk semua subjek.",
  "3|The book ___ by millions of people.|has been read|has read~have been read~is reading|Kalimat pasif present perfect: has been + past participle.",
  "3|She worked hard; ___, she passed the exam.|therefore|although~because~however|Therefore menyatakan akibat dari kalimat sebelumnya.",
  "3|He is interested ___ learning languages.|in|on~at~with|Kata sifat interested berpasangan dengan preposisi in."
]);
const POS = bank([
  "1|Kata “quickly” termasuk jenis kata ...|adverb (kata keterangan)|noun (kata benda)~verb (kata kerja)~adjective (kata sifat)|Quickly menerangkan cara melakukan sesuatu, jadi adverb.",
  "1|Kata “happy” termasuk jenis kata ...|adjective (kata sifat)|noun (kata benda)~verb (kata kerja)~adverb (kata keterangan)|Happy menerangkan keadaan kata benda: adjective.",
  "1|Kata “teacher” termasuk jenis kata ...|noun (kata benda)|verb (kata kerja)~adjective (kata sifat)~adverb (kata keterangan)|Teacher adalah nama orang/profesi: noun.",
  "1|Kata “run” pada kalimat “Birds can run.” adalah ...|verb (kata kerja)|noun (kata benda)~adjective (kata sifat)~adverb (kata keterangan)|Run menyatakan kegiatan: verb.",
  "2|Kata “carefully” termasuk jenis kata ...|adverb (kata keterangan)|noun (kata benda)~verb (kata kerja)~adjective (kata sifat)|Akhiran -ly pada carefully membentuk adverb.",
  "2|Kata “beautiful” termasuk jenis kata ...|adjective (kata sifat)|adverb (kata keterangan)~noun (kata benda)~verb (kata kerja)|Beautiful menerangkan benda/orang: adjective.",
  "3|Kata “knowledge” termasuk jenis kata ...|noun (kata benda)|verb (kata kerja)~adjective (kata sifat)~adverb (kata keterangan)|Knowledge adalah kata benda abstrak.",
  "3|Kata “suddenly” pada “He suddenly stopped.” berfungsi sebagai ...|adverb (kata keterangan)|adjective (kata sifat)~noun (kata benda)~verb (kata kerja)|Suddenly menerangkan kata kerja stopped."
]);
const PHRASE = bank([
  "1|Apa arti “Good morning”?|Selamat pagi|Selamat malam~Selamat tinggal~Terima kasih|Good morning dipakai menyapa di pagi hari.",
  "1|Apa arti “Thank you”?|Terima kasih|Sama-sama~Maaf~Permisi|Thank you untuk berterima kasih.",
  "1|Apa arti “See you tomorrow”?|Sampai jumpa besok|Selamat datang~Apa kabar~Selamat tidur|See you tomorrow = sampai jumpa besok.",
  "2|Jawaban yang tepat untuk “How are you?” adalah ...|I'm fine, thank you.|You're welcome.~Nice to meet you.~See you later.|How are you? menanyakan kabar.",
  "2|Ungkapan untuk meminta maaf adalah ...|I'm sorry.|You are welcome.~Good luck.~Congratulations.|I'm sorry dipakai untuk meminta maaf.",
  "2|Apa arti “Nice to meet you”?|Senang bertemu denganmu|Sampai jumpa lagi~Selamat ulang tahun~Tolong bantu saya|Dipakai saat berkenalan.",
  "3|Ungkapan yang tepat untuk menawarkan bantuan adalah ...|Can I help you?|Do you mind?~I beg your pardon.~Take your time.|Can I help you? menawarkan bantuan.",
  "3|“It's a piece of cake” berarti ...|Itu sangat mudah|Itu kue enak~Itu sangat mahal~Itu hampir selesai|Idiom: sesuatu yang sangat mudah."
]);
const SYN = [["big","large","small",1],["happy","glad","sad",1],["fast","quick","slow",1],["begin","start","end",1],["clever","smart","foolish",1],
  ["difficult","hard","easy",2],["rich","wealthy","poor",2],["buy","purchase","sell",2],["quiet","silent","noisy",2],["ancient","old","modern",2],
  ["reluctant","unwilling","eager",3],["scarce","rare","plentiful",3],["generous","charitable","stingy",3],["enormous","huge","tiny",3],["brief","short","lengthy",3]];
function synant(d) {
  const r = { easy: [1], medium: [1, 2], hard: [2, 3] }[d], pool = SYN.filter(e => r.includes(e[3])), e = choose(pool), syn = Math.random() < .5, ans = syn ? e[1] : e[2];
  const wrong = SYN.filter(o => o !== e).flatMap(o => [o[1], o[2]]).filter(x => x !== e[1] && x !== e[2]);
  return mc(`Pilih ${syn ? "sinonim (persamaan kata)" : "antonim (lawan kata)"} dari “${e[0]}”.`, ans, shuffle(wrong), `${e[0]} bersinonim dengan ${e[1]} dan berantonim dengan ${e[2]}.`);
}
const SENT = [[1,"I eat rice every day"],[1,"She is my best friend"],[1,"They play football after school"],[2,"We are going to the market tomorrow"],[2,"He does not like cold water"],
  [3,"If it rains tomorrow we will stay at home"],[3,"She has been studying English for two years"]];
function order(d) {
  const r = { easy: [1], medium: [1, 2], hard: [2, 3] }[d], [, s] = choose(SENT.filter(x => r.includes(x[0]))), w = s.split(" ");
  const fmtS = a => { const t = a.join(" ").toLowerCase(); return t[0].toUpperCase() + t.slice(1) + "."; }, right = fmtS(w), wrong = new Set();
  for (let i = 0; i < 60 && wrong.size < 3; i++) { const c = fmtS(shuffle(w)); if (c !== right) wrong.add(c); }
  return mc(`Susunlah kata-kata ini menjadi kalimat yang benar: ${shuffle(w).map(x => x.toLowerCase()).join(" / ")}`, right, [...wrong], `Urutan yang benar: ${right}`);
}
export function generateEnglishPlus(sub, d) {
  const t = sub === "mixed" ? choose(["numbers", "days", "translate", "fill", "pos", "synant", "phrases", "order"]) : sub;
  return ({ numbers: () => numbers(d), days: () => days(d), translate: () => translate(d), fill: () => mcItem(pickBank(CLOZE, d)),
    pos: () => mcItem(pickBank(POS, d)), synant: () => synant(d), phrases: () => mcItem(pickBank(PHRASE, d)), order: () => order(d) })[t]();
}
