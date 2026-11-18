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
  const n = d === "easy" ? randInt(1, 30) : d === "medium" ? randInt(21, 99) : randInt(100, 999), w = words(n);
  const accept = [w, w.replace(/-/g, " "), w.replace(" hundred ", " hundred and ")];
  if (d === "easy") return Math.random() < .5 ? mc(`Angka ${n} dalam bahasa Inggris adalah ...`, w, [words(n + 1), words(n + 2), words(Math.max(1, n - 1)), words(n > 10 ? n - 10 : n + 10)], `${n} = ${w}.`)
    : mc(`“${w}” berarti angka ...`, n, [n + 1, n - 1, n + 10], `${w} = ${n}.`);
  return Math.random() < .6 ? typed(`Tulis angka ${n} dalam bahasa Inggris.`, w, accept, `${n} ditulis ${w}.`)
    : mc(`“${w}” berarti angka ...`, n, [n + 1, n - 10, n + 10, +String(n).split("").reverse().join("")], `${w} = ${n}.`);
}
function days(d) {
  const t = d === "easy" ? "tr" : d === "medium" ? choose(["tr", "next"]) : choose(["next", "month"]);
  if (t === "tr") { const dayQ = Math.random() < .5, i = randInt(0, 6), j = randInt(0, 11);
    if (Math.random() < .5) return dayQ ? mc(`Apa bahasa Inggris dari “${DAYS_ID[i]}”?`, DAYS[i], DAYS.filter(x => x !== DAYS[i]), `${DAYS_ID[i]} = ${DAYS[i]}.`)
      : mc(`Apa bahasa Inggris dari bulan “${MONTHS_ID[j]}”?`, MONTHS[j], MONTHS.filter(x => x !== MONTHS[j]), `${MONTHS_ID[j]} = ${MONTHS[j]}.`);
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
const LVL = d => ({ easy: [1], medium: [1, 2], hard: [2, 3] }[d] || [1, 2, 3]);
const SUBJ3 = [["She", "she"], ["He", "he"], ["My mother", "mother"], ["My brother", "brother"], ["The dog", "dog"], ["Tom", "tom"], ["Our teacher", "teacher"], ["The cat", "cat"]];
const SUBJP = ["I", "You", "We", "They", "My friends", "The children"];

/* ---------- Melengkapi kalimat (template + bank) ---------- */
const VERB3 = [["go", "goes", "to school"], ["eat", "eats", "breakfast"], ["play", "plays", "football"], ["watch", "watches", "television"], ["study", "studies", "English"],
  ["like", "likes", "music"], ["wash", "washes", "the dishes"], ["cook", "cooks", "dinner"], ["read", "reads", "a book"], ["drink", "drinks", "water"], ["teach", "teaches", "math"], ["fix", "fixes", "bicycles"]];
const ing = b => ({ run: "running", swim: "swimming", sit: "sitting" })[b] || (b.endsWith("e") && !b.endsWith("ee") ? b.slice(0, -1) + "ing" : b + "ing");
const uniq = (arr, ans) => [...new Set(arr)].filter(x => x !== ans);
const PLUR = [["brother", "brothers"], ["book", "books"], ["box", "boxes"], ["child", "children"], ["man", "men"], ["foot", "feet"], ["tooth", "teeth"], ["city", "cities"],
  ["knife", "knives"], ["mouse", "mice"], ["bus", "buses"], ["woman", "women"], ["baby", "babies"], ["watch", "watches"], ["leaf", "leaves"]];
const PAST = [["go", "went", "gone"], ["eat", "ate", "eaten"], ["see", "saw", "seen"], ["buy", "bought", "bought"], ["take", "took", "taken"], ["write", "wrote", "written"],
  ["come", "came", "come"], ["give", "gave", "given"], ["make", "made", "made"], ["run", "ran", "run"], ["drink", "drank", "drunk"], ["sing", "sang", "sung"], ["swim", "swam", "swum"], ["meet", "met", "met"]];
const WHEN = ["yesterday", "last week", "two days ago", "last night", "last Sunday", "last month"];
const PLACE = ["to the market", "to the park", "to school", "to the beach", "to the library"];
const COMP = [["tall", "taller", "tallest"], ["big", "bigger", "biggest"], ["good", "better", "best"], ["bad", "worse", "worst"], ["happy", "happier", "happiest"], ["fast", "faster", "fastest"],
  ["beautiful", "more beautiful", "most beautiful"], ["expensive", "more expensive", "most expensive"], ["heavy", "heavier", "heaviest"], ["interesting", "more interesting", "most interesting"], ["small", "smaller", "smallest"], ["difficult", "more difficult", "most difficult"]];
const ART = [["apple", "an"], ["umbrella", "an"], ["hour", "an"], ["egg", "an"], ["orange", "an"], ["book", "a"], ["car", "a"], ["university", "a"], ["pen", "a"], ["house", "a"], ["engineer", "an"], ["unicorn", "a"]];
const CLOZE_BANK = bank([
  "2|They ___ football when it started to rain.|were playing|played~are playing~have play|Past continuous untuk kegiatan yang sedang berlangsung saat kejadian lain terjadi.",
  "2|He speaks English ___.|fluently|fluent~fluency~more fluent|Adverb (fluently) menerangkan kata kerja speaks.",
  "2|I ___ my homework when you called.|was doing|did~am doing~have do|Past continuous: was/were + verb-ing.",
  "2|She ___ here since 2020.|has lived|lived~is living~live|Since + titik waktu memakai present perfect: has lived.",
  "2|There ___ many students in the hall.|are|is~was~be|Many students (jamak) memakai are.",
  "2|You ___ wear a helmet when riding a motorcycle.|must|can~may~might|Must menyatakan kewajiban.",
  "2|I am looking forward ___ you.|to seeing|to see~for seeing~at see|Look forward to + verb-ing.",
  "2|If it rains, we ___ at home.|will stay|stayed~would stay~staying|Conditional type 1: will + verb.",
  "3|If I ___ rich, I would buy a big house.|were|am~will be~was being|Conditional type 2 memakai were untuk semua subjek.",
  "3|The book ___ by millions of people.|has been read|has read~have been read~is reading|Kalimat pasif present perfect: has been + past participle.",
  "3|She worked hard; ___, she passed the exam.|therefore|although~because~however|Therefore menyatakan akibat dari kalimat sebelumnya.",
  "3|He is interested ___ learning languages.|in|on~at~with|Kata sifat interested berpasangan dengan preposisi in.",
  "3|By the time we arrived, the movie ___.|had started|has started~starts~was start|Past perfect untuk kejadian yang lebih dulu dari kejadian lampau lain.",
  "3|I wish I ___ more time to study.|had|have~has~will have|Wish + past tense untuk pengandaian di masa kini.",
  "3|Neither the teacher nor the students ___ present.|were|was~is~be|Verb mengikuti subjek terdekat (students): were.",
  "3|The report must ___ by Friday.|be finished|finished~finishing~to finish|Modal + be + past participle untuk pasif.",
  "3|She asked me where I ___.|lived|do live~live~am living|Reported speech: tense bergeser ke lampau.",
  "3|Not only ___ English, but she also speaks French.|does she speak|she speaks~she does speak~speaks she|Inversi setelah not only.",
  "3|Despite ___ tired, he kept working.|being|he was~to be~of being|Despite + verb-ing.",
  "3|The more you practice, the ___ you become.|better|good~best~well|Struktur the + comparative, the + comparative."
]);
function cloze(d) {
  const lv = choose(LVL(d));
  if (lv === 3) return mcItem(pickBank(CLOZE_BANK, "hard"));
  if (lv === 2 && Math.random() < .5) return mcItem(pickBank(CLOZE_BANK, "medium"));
  const t = choose(lv === 1 ? ["s", "plural", "past", "be", "art"] : ["past2", "comp", "s2", "plural"]);
  if (t === "s" || t === "s2") { const [S] = choose(SUBJ3), [b, v, o] = choose(VERB3), e = choose(["every day", "every morning", "on weekdays", "after school"]);
    return mc(`${S} ___ ${o} ${e}.`, v, [...uniq([b, ing(b), b + "s", "to " + b], v)], `Subjek ${S.toLowerCase()} (orang ketiga tunggal) memakai verb + s/es: ${v}.`); }
  if (t === "plural") { const [s, p] = choose(PLUR), n = choose(["two", "three", "four", "five", "six", "ten"]);
    return mc(`I see ${n} ___ here.`, p, [...uniq([s, s + "s", s + "es", ...shuffle(PLUR).map(x => x[1])], p)], `Setelah ${n} dipakai bentuk jamak: ${p}.`); }
  if (t === "past" || t === "past2") { const [b, p, pp] = choose(PAST), S = choose(SUBJP.concat(["She", "He"])), w = choose(WHEN), pl = choose(PLACE);
    const phrase = ["eat", "drink", "buy", "write", "give", "make", "take", "see", "meet", "sing", "swim", "run"].includes(b) ? "" : " " + pl;
    return mc(`${S} ___${phrase} ${w}.`.replace("  ", " "), p, [...uniq([b, pp, b + "ed", ing(b)], p)], `${w} menunjukkan waktu lampau, jadi dipakai bentuk lampau ${b}: ${p}.`); }
  if (t === "be") { const S = choose([["I", "am"], ["He", "is"], ["She", "is"], ["They", "are"], ["We", "are"], ["You", "are"], ["The books", "are"], ["My father", "is"]]), a = choose(["happy", "tired", "busy", "ready", "late", "hungry", "at home", "in the garden"]);
    return mc(`${S[0]} ___ ${a} now.`, S[1], ["am", "is", "are", "be"].filter(x => x !== S[1]), `${S[0]} berpasangan dengan to be ${S[1]}.`); }
  if (t === "art") { const [n, a] = choose(ART); return mc(`This is ___ ${n}.`, a, ["a", "an", "two", "many"].filter(x => x !== a), `${a} dipakai karena bunyi awal kata ${n} (${a === "an" ? "vokal" : "konsonan"}).`); }
  const [b, c, sup] = choose(COMP), S = choose(["My sister", "This box", "That building", "Tom", "The red car"]), Y = choose(["her friend", "that one", "the old one", "mine"]);
  return mc(`${S} is ___ than ${Y}.`, c, [...uniq([b, sup, c.startsWith("more") ? b + "er" : "more " + b], c)], `Perbandingan dua hal memakai comparative: ${c}.`);
}

/* ---------- Jenis kata ---------- */
const WORDS = {
  noun: [["teacher", 1], ["apple", 1], ["book", 1], ["mother", 1], ["house", 1], ["dog", 1], ["school", 1], ["friend", 1], ["kitchen", 2], ["journey", 2], ["neighbor", 2], ["holiday", 2],
    ["market", 2], ["problem", 2], ["knowledge", 3], ["freedom", 3], ["honesty", 3], ["behavior", 3], ["environment", 3], ["happiness", 3]],
  verb: [["run", 1], ["eat", 1], ["sleep", 1], ["read", 1], ["write", 1], ["jump", 1], ["borrow", 2], ["decide", 2], ["travel", 2], ["invite", 2], ["repair", 2], ["achieve", 3], ["improve", 3], ["develop", 3], ["protect", 3], ["discover", 3]],
  adjective: [["happy", 1], ["big", 1], ["small", 1], ["red", 1], ["cold", 1], ["tall", 1], ["beautiful", 2], ["dangerous", 2], ["expensive", 2], ["careful", 2], ["heavy", 2], ["reluctant", 3], ["enormous", 3], ["generous", 3], ["ancient", 3], ["curious", 3]],
  adverb: [["quickly", 1], ["slowly", 1], ["loudly", 1], ["happily", 1], ["quietly", 1], ["carefully", 2], ["easily", 2], ["angrily", 2], ["softly", 2], ["bravely", 2], ["suddenly", 3], ["fortunately", 3], ["rarely", 3], ["eventually", 3], ["hardly", 3]]
};
const POS_LABEL = { noun: "noun (kata benda)", verb: "verb (kata kerja)", adjective: "adjective (kata sifat)", adverb: "adverb (kata keterangan)" };
const POS_WHY = { noun: "adalah nama benda, orang, tempat, atau gagasan", verb: "menyatakan kegiatan atau keadaan", adjective: "menerangkan kata benda", adverb: "menerangkan cara atau keadaan suatu kegiatan" };
function pos(d) {
  const k = choose(Object.keys(WORDS)), [w] = choose(WORDS[k].filter(x => LVL(d).includes(x[1])));
  return mc(`Kata “${w}” termasuk jenis kata ...`, POS_LABEL[k], Object.keys(POS_LABEL).filter(x => x !== k).map(x => POS_LABEL[x]), `${w[0].toUpperCase() + w.slice(1)} ${POS_WHY[k]}, jadi ${k}.`);
}

/* ---------- Frasa sehari-hari: [Inggris, Indonesia, tingkat] ---------- */
const PH = [
  ["Good morning", "Selamat pagi", 1], ["Good night", "Selamat malam (sebelum tidur)", 1], ["Thank you", "Terima kasih", 1], ["You're welcome", "Sama-sama", 1], ["See you tomorrow", "Sampai jumpa besok", 1],
  ["Excuse me", "Permisi", 1], ["I'm sorry", "Maaf", 1], ["Good afternoon", "Selamat siang", 1], ["Good evening", "Selamat sore", 1], ["How are you?", "Apa kabar?", 1],
  ["What's your name?", "Siapa namamu?", 1], ["Nice to meet you", "Senang bertemu denganmu", 1], ["Please sit down", "Silakan duduk", 1], ["Welcome", "Selamat datang", 1], ["Goodbye", "Selamat tinggal", 1],
  ["Happy birthday", "Selamat ulang tahun", 1], ["Good luck", "Semoga berhasil", 1], ["Take care", "Jaga dirimu", 1], ["Open the door", "Buka pintunya", 1], ["I don't know", "Saya tidak tahu", 1],
  ["I'm hungry", "Saya lapar", 1], ["Where is the toilet?", "Di mana kamar kecil?", 1], ["How much is this?", "Berapa harga ini?", 1], ["I love you", "Aku sayang kamu", 1],
  ["What time is it?", "Pukul berapa sekarang?", 2], ["I'm looking for a bank", "Saya sedang mencari bank", 2], ["Could you help me?", "Bisakah Anda membantu saya?", 2], ["Let's go together", "Ayo pergi bersama", 2],
  ["I'm afraid I can't come", "Sayangnya saya tidak bisa datang", 2], ["Never mind", "Tidak apa-apa / lupakan saja", 2], ["Congratulations", "Selamat (atas keberhasilan)", 2], ["Bless you", "Semoga sehat (saat bersin)", 2],
  ["It's my pleasure", "Dengan senang hati", 2], ["Please speak slowly", "Tolong bicara pelan-pelan", 2], ["Can you repeat that?", "Bisakah Anda mengulanginya?", 2], ["I'm on my way", "Saya sedang dalam perjalanan", 2],
  ["Make yourself at home", "Anggap saja rumah sendiri", 2], ["Just a moment, please", "Tunggu sebentar", 2], ["I agree with you", "Saya setuju denganmu", 2], ["That sounds great", "Kedengarannya bagus", 2],
  ["Keep in touch", "Tetap berhubungan", 2], ["Long time no see", "Lama tidak berjumpa", 2], ["It's a piece of cake", "Itu sangat mudah", 3], ["Break a leg", "Semoga sukses (untuk penampil)", 3],
  ["It's raining cats and dogs", "Hujan turun sangat deras", 3], ["Once in a blue moon", "Sangat jarang terjadi", 3], ["Under the weather", "Sedang kurang sehat", 3], ["Hit the books", "Belajar dengan giat", 3],
  ["Spill the beans", "Membocorkan rahasia", 3], ["Cost an arm and a leg", "Sangat mahal", 3], ["Let the cat out of the bag", "Tidak sengaja membuka rahasia", 3], ["Call it a day", "Berhenti bekerja untuk hari itu", 3],
  ["Better late than never", "Lebih baik terlambat daripada tidak sama sekali", 3], ["Practice makes perfect", "Latihan membuat sempurna", 3], ["Actions speak louder than words", "Perbuatan lebih bermakna daripada kata-kata", 3],
  ["The ball is in your court", "Sekarang giliran Anda memutuskan", 3], ["Beat around the bush", "Berbicara bertele-tele", 3], ["Don't judge a book by its cover", "Jangan menilai dari penampilan luar", 3]
];
function phrase(d) {
  const e = choose(PH.filter(x => LVL(d).includes(x[2]))), others = shuffle(PH.filter(o => o !== e));
  if (Math.random() < .5) return mc(`Apa arti “${e[0]}”?`, e[1], others.slice(0, 3).map(o => o[1]), `“${e[0]}” = ${e[1]}.`);
  return mc(`Ungkapan bahasa Inggris untuk “${e[1]}” adalah ...`, e[0], others.slice(0, 3).map(o => o[0]), `${e[1]} = “${e[0]}”.`);
}

/* ---------- Sinonim dan antonim ---------- */
const SYN = [["big", "large", "small", 1], ["happy", "glad", "sad", 1], ["fast", "quick", "slow", 1], ["begin", "start", "end", 1], ["clever", "smart", "foolish", 1],
  ["hot", "warm", "cold", 1], ["pretty", "beautiful", "ugly", 1], ["easy", "simple", "hard", 1], ["near", "close", "far", 1], ["rich", "wealthy", "poor", 1],
  ["tall", "high", "short", 1], ["buy", "purchase", "sell", 1], ["old", "aged", "new", 1], ["loud", "noisy", "quiet", 1], ["sleepy", "drowsy", "awake", 1],
  ["difficult", "hard", "easy", 2], ["quiet", "silent", "noisy", 2], ["ancient", "old", "modern", 2], ["angry", "furious", "calm", 2], ["brave", "courageous", "cowardly", 2],
  ["shout", "yell", "whisper", 2], ["strong", "powerful", "weak", 2], ["empty", "vacant", "full", 2], ["finish", "complete", "begin", 2], ["gift", "present", "loss", 2],
  ["huge", "giant", "tiny", 2], ["rapid", "swift", "gradual", 2], ["friend", "companion", "enemy", 2], ["smart", "intelligent", "stupid", 2], ["tired", "exhausted", "energetic", 2],
  ["reluctant", "unwilling", "eager", 3], ["scarce", "rare", "plentiful", 3], ["generous", "charitable", "stingy", 3], ["enormous", "huge", "tiny", 3], ["brief", "short", "lengthy", 3],
  ["ancient", "archaic", "contemporary", 3], ["conceal", "hide", "reveal", 3], ["abundant", "plentiful", "scarce", 3], ["diligent", "hardworking", "lazy", 3], ["fragile", "delicate", "sturdy", 3],
  ["permit", "allow", "forbid", 3], ["vague", "unclear", "precise", 3], ["inhabit", "live in", "abandon", 3], ["ordinary", "common", "extraordinary", 3], ["essential", "vital", "unnecessary", 3]];
function synant(d) {
  const e = choose(SYN.filter(x => LVL(d).includes(x[3]))), syn = Math.random() < .5, ans = syn ? e[1] : e[2];
  const wrong = shuffle(SYN.filter(o => o !== e).flatMap(o => [o[1], o[2]]).filter(x => x !== e[1] && x !== e[2] && x !== ans));
  return mc(`Pilih ${syn ? "sinonim (persamaan kata)" : "antonim (lawan kata)"} dari “${e[0]}”.`, ans, wrong, `${e[0]} bersinonim dengan ${e[1]} dan berantonim dengan ${e[2]}.`);
}

/* ---------- Menyusun kalimat (key = kalimat benar, karena urutan kata di soal diacak) ---------- */
const SENT = [[1, "I eat rice every day"], [1, "She is my best friend"], [1, "They play football after school"], [1, "My father reads a newspaper"], [1, "The cat sleeps on the sofa"], [1, "We go to school by bus"],
  [1, "He likes fried chicken"], [1, "The sun rises in the east"], [1, "I brush my teeth every morning"], [1, "My sister has a red bag"], [1, "The children are playing in the park"], [1, "Birds can fly in the sky"],
  [2, "We are going to the market tomorrow"], [2, "He does not like cold water"], [2, "My brother can swim very fast"], [2, "She visited her grandmother last Sunday"], [2, "They are watching a movie at home"],
  [2, "I will call you after dinner"], [2, "The teacher gave us a lot of homework"], [2, "Do you want to drink some tea"], [2, "There are three books on the table"], [2, "He was reading when I came"],
  [2, "Please open the window for me"], [2, "My mother is cooking in the kitchen"], [3, "If it rains tomorrow we will stay at home"], [3, "She has been studying English for two years"],
  [3, "The letter was written by my grandfather"], [3, "I would travel around the world if I were rich"], [3, "He told me that he had finished his work"], [3, "Although she was tired she kept working"],
  [3, "The more you practice the better you become"], [3, "The man who lives next door is a doctor"], [3, "They have just moved to a bigger house"], [3, "I am used to waking up early every day"],
  [3, "Neither my brother nor my sister likes spicy food"], [3, "The museum which we visited yesterday was very old"]];
const GENS = [["I", 0], ["You", 0], ["We", 0], ["They", 0], ["She", 1], ["He", 1], ["My mother", 1], ["My brother", 1], ["Our teacher", 1], ["The children", 0]];
function genSentence(lv) {
  const [S, third] = choose(GENS), [b, v, o] = choose(VERB3), t = lv === 1 ? "" : " " + choose(["every day", "on Sunday", "after school", "in the evening", "at night"]);
  return `${S} ${third ? v : b} ${o}${t}`;
}
function order(d) {
  const lv = choose(LVL(d)), s = lv < 3 && Math.random() < .6 ? genSentence(lv) : choose(SENT.filter(x => x[0] === lv))[1], w = s.split(" ");
  const fmtS = a => { const t = a.join(" ").toLowerCase(); return t[0].toUpperCase() + t.slice(1) + "."; }, right = fmtS(w), wrong = new Set();
  for (let i = 0; i < 80 && wrong.size < 3; i++) { const c = fmtS(shuffle(w)); if (c !== right) wrong.add(c); }
  return { ...mc(`Susunlah kata-kata ini menjadi kalimat yang benar: ${shuffle(w).map(x => x.toLowerCase()).join(" / ")}`, right, [...wrong], `Urutan yang benar: ${right}`), key: "order|" + right };
}
export function generateEnglishPlus(sub, d) {
  const t = sub === "mixed" ? choose(["numbers", "days", "translate", "fill", "pos", "synant", "phrases", "order"]) : sub;
  return ({ numbers: () => numbers(d), days: () => days(d), translate: () => translate(d), fill: () => cloze(d),
    pos: () => pos(d), synant: () => synant(d), phrases: () => phrase(d), order: () => order(d) })[t]();
}
