// Jalankan: node --test tools/progress.test.mjs
import test from "node:test";
import assert from "node:assert/strict";

const store = {};
let blocked = false;
globalThis.localStorage = {
  getItem: k => { if (blocked) throw new Error("blocked"); return store[k] ?? null; },
  setItem: (k, v) => { if (blocked) throw new Error("blocked"); store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
const P = await import("../assets/js/progress.js");
const fresh = () => { P.resetProgress(); for (const k of Object.keys(store)) delete store[k]; blocked = false; };

test("rumus XP level sesuai contoh spesifikasi", () => {
  const exp = { 1: 0, 2: 100, 3: 250, 4: 450, 5: 700, 10: 2700, 20: 10450, 50: 63700 };
  for (const [l, xp] of Object.entries(exp)) assert.equal(P.xpForLevel(Number(l)), xp, `level ${l}`);
});

test("level dari XP: batas tepat, satu di bawah, dan nilai ekstrem", () => {
  for (let L = 1; L <= 400; L++) {
    assert.equal(P.levelFromXp(P.xpForLevel(L)), L, `tepat di level ${L}`);
    assert.equal(P.levelFromXp(P.xpForLevel(L + 1) - 1), L, `satu XP sebelum level ${L + 1}`);
  }
  assert.equal(P.levelFromXp(0), 1); assert.equal(P.levelFromXp(99), 1); assert.equal(P.levelFromXp(100), 2);
  assert.equal(P.levelFromXp(-50), 1); assert.equal(P.levelFromXp(NaN), 1); assert.equal(P.levelFromXp(1e9) > 1000, true);
});

test("title per level termasuk semua batas", () => {
  const cases = [[1, "Novice"], [5, "Novice"], [6, "Apprentice"], [10, "Apprentice"], [11, "Scholar"], [20, "Scholar"], [21, "Expert"], [35, "Expert"], [36, "Master"], [50, "Master"], [51, "Grandmaster"], [200, "Grandmaster"]];
  for (const [l, t] of cases) assert.equal(P.titleForLevel(l), t, `level ${l}`);
});

test("XP sesi: benar, salah, tidak dijawab", () => {
  // 10 soal: 7 benar, 2 salah, 1 kosong -> 9*5 + 7*5 = 80, tanpa bonus selesai, akurasi 70% tanpa bonus
  let r = P.calculateSessionXp({ total: 10, answered: 9, correct: 7 }); assert.equal(r.total, 80);
  // 10 soal semua dijawab, 8 benar -> 50 + 40 + 20 + 30 = 140
  r = P.calculateSessionXp({ total: 10, answered: 10, correct: 8 }); assert.equal(r.total, 140);
  // 9 benar (90%) -> 50 + 45 + 20 + 30 = 145
  r = P.calculateSessionXp({ total: 10, answered: 10, correct: 9 }); assert.equal(r.total, 145);
  // 100% -> 50 + 50 + 20 + 50 = 170, bonus akurasi TIDAK ditumpuk (bukan +80)
  r = P.calculateSessionXp({ total: 10, answered: 10, correct: 10 }); assert.equal(r.total, 170);
  assert.equal(r.parts.filter(p => p.key === "accuracy").length, 1);
  // semua kosong -> 0 XP
  assert.equal(P.calculateSessionXp({ total: 10, answered: 0, correct: 0 }).total, 0);
  // semua dijawab, semua salah -> 50 + 20 = 70
  assert.equal(P.calculateSessionXp({ total: 10, answered: 10, correct: 0 }).total, 70);
  // batas akurasi: 79% tidak dapat bonus, 80% dapat
  assert.equal(P.calculateSessionXp({ total: 100, answered: 100, correct: 79 }).parts.some(p => p.key === "accuracy"), false);
  assert.equal(P.calculateSessionXp({ total: 100, answered: 100, correct: 80 }).parts.find(p => p.key === "accuracy").xp, 30);
  assert.equal(P.calculateSessionXp({ total: 5, answered: 5, correct: 4 }).parts.find(p => p.key === "accuracy").xp, 30); // 80% tepat
  // akurasi dihitung dari total soal: 8 benar dari 10 total padahal hanya 9 dijawab -> tetap 80%
  assert.equal(P.calculateSessionXp({ total: 10, answered: 9, correct: 8 }).parts.find(p => p.key === "accuracy").xp, 30);
  // input tidak masuk akal tidak merusak (benar > dijawab)
  assert.equal(P.calculateSessionXp({ total: 3, answered: 2, correct: 9 }).total, 2 * 5 + 2 * 5);
});

test("reward sesi pertama: XP, level, gemcrys", () => {
  fresh();
  const r = P.awardSession("s1", { total: 10, answered: 10, correct: 10 }); // 170 XP -> level 2
  assert.equal(r.xpGained, 170); assert.equal(r.newLevel, 2); assert.equal(r.levelsGained, 1);
  assert.equal(r.gemcrysGained, 10); assert.equal(r.newTitle, "Novice"); assert.equal(r.titleChanged, false);
  const d = P.loadProgress(); assert.equal(d.xp, 170); assert.equal(d.level, 2); assert.equal(d.gemcrys, 10);
  assert.deepEqual(d.claimedLevels, [2]);
});

test("level 1 tidak memberi gemcrys; XP kecil tidak naik level", () => {
  fresh();
  const r = P.awardSession("a", { total: 2, answered: 2, correct: 0 }); // 10 + 20 = 30 XP
  assert.equal(r.newLevel, 1); assert.equal(r.gemcrysGained, 0); assert.equal(P.loadProgress().gemcrys, 0);
});

test("naik beberapa level sekaligus menghitung semua level yang dilewati", () => {
  fresh();
  localStorage.setItem(P.PROGRESS_KEY, JSON.stringify({ xp: 90, gemcrys: 0, claimedLevels: [], rewardedSessions: [] }));
  // 90 XP + 170 = 260 -> level 3 (melewati level 2 dan 3)
  const r = P.awardSession("m1", { total: 10, answered: 10, correct: 10 });
  assert.equal(r.oldLevel, 1); assert.equal(r.newLevel, 3); assert.equal(r.levelsGained, 2); assert.equal(r.gemcrysGained, 20);
  assert.deepEqual(P.loadProgress().claimedLevels, [2, 3]);
  // lompatan besar dalam satu sesi: 100 soal semua benar = 1.070 XP dari 0 -> level 6 (lintas title)
  fresh();
  const big = P.awardSession("m2", { total: 100, answered: 100, correct: 100 });
  assert.equal(big.xpGained, 1070); assert.equal(big.newLevel, 6); assert.equal(big.levelsGained, 5);
  assert.equal(big.oldTitle, "Novice"); assert.equal(big.newTitle, "Apprentice"); assert.equal(big.titleChanged, true);
  assert.equal(big.gemcrysGained, 50); // level 2,3,4,5,6
  assert.deepEqual(P.loadProgress().claimedLevels, [2, 3, 4, 5, 6]);
});

test("title berubah otomatis di batas level", () => {
  fresh();
  localStorage.setItem(P.PROGRESS_KEY, JSON.stringify({ xp: P.xpForLevel(6) - 10, gemcrys: 0, claimedLevels: [2, 3, 4, 5], rewardedSessions: [] }));
  const r = P.awardSession("t", { total: 1, answered: 1, correct: 1 }); // +5 +5 +20 +50 = 80
  assert.equal(r.oldTitle, "Novice"); assert.equal(r.newLevel, 6); assert.equal(r.newTitle, "Apprentice"); assert.equal(r.titleChanged, true);
});

test("sesi yang sama tidak bisa diklaim dua kali", () => {
  fresh();
  const a = P.awardSession("dup", { total: 10, answered: 10, correct: 10 });
  const xp = P.loadProgress().xp, gems = P.loadProgress().gemcrys;
  for (let i = 0; i < 5; i++) assert.equal(P.awardSession("dup", { total: 10, answered: 10, correct: 10 }), null);
  assert.equal(P.loadProgress().xp, xp); assert.equal(P.loadProgress().gemcrys, gems); assert.ok(a);
  assert.equal(P.awardSession("", { total: 1, answered: 1, correct: 1 }), null);
  assert.equal(P.awardSession(undefined, { total: 1, answered: 1, correct: 1 }), null);
});

test("klaim dari dua 'tab' (storage dibaca ulang) tetap tidak ganda dan tidak saling menimpa", () => {
  fresh();
  P.awardSession("tabA", { total: 10, answered: 10, correct: 10 });
  const snapshotAfterA = store[P.PROGRESS_KEY];
  // tab B memakai ID berbeda -> bertambah; tab A mengulang ID lama -> ditolak
  P.awardSession("tabB", { total: 10, answered: 10, correct: 10 });
  assert.equal(P.awardSession("tabA", { total: 10, answered: 10, correct: 10 }), null);
  assert.equal(P.loadProgress().xp, 340); assert.notEqual(snapshotAfterA, store[P.PROGRESS_KEY]);
});

test("gemcrys per level hanya sekali walau XP/data dimanipulasi atau level 'turun' lalu naik lagi", () => {
  fresh();
  P.awardSession("g1", { total: 10, answered: 10, correct: 10 }); // level 2, +10
  // simulasi data: XP dikembalikan ke 0 tetapi daftar klaim tetap ada
  const d = JSON.parse(store[P.PROGRESS_KEY]); d.xp = 0; d.claimedLevels = [2]; store[P.PROGRESS_KEY] = JSON.stringify(d);
  const r = P.awardSession("g2", { total: 10, answered: 10, correct: 10 });
  assert.equal(r.newLevel, 2); // naik ke level 2 lagi, tapi reward level 2 sudah pernah diklaim
  assert.equal(r.gemcrysGained, 0);
});

test("data tersimpan setelah 'reload' dan tahan data rusak", () => {
  fresh();
  P.awardSession("p1", { total: 10, answered: 10, correct: 10 });
  const raw = store[P.PROGRESS_KEY];
  // reload: modul baru dengan storage yang sama
  const again = JSON.parse(raw);
  assert.equal(again.xp, 170); assert.equal(again.gemcrys, 10); assert.deepEqual(again.rewardedSessions, ["p1"]);
  // data rusak -> default aman
  for (const bad of ["{not json", "null", "[]", '{"xp":"abc"}', '{"xp":-100,"gemcrys":-5}', '{"xp":1e400}']) {
    store[P.PROGRESS_KEY] = bad; P.resetProgress(); store[P.PROGRESS_KEY] = bad;
    const d = P.loadProgress();
    assert.ok(Number.isInteger(d.xp) && d.xp >= 0 && d.level >= 1 && d.gemcrys >= 0, `data rusak: ${bad}`);
  }
  // level tersimpan yang tidak cocok dengan XP dikoreksi dari total XP
  store[P.PROGRESS_KEY] = JSON.stringify({ xp: 100, level: 99, gemcrys: 0, claimedLevels: [2, 50], rewardedSessions: [] });
  const fixed = P.loadProgress(); assert.equal(fixed.level, 2); assert.deepEqual(fixed.claimedLevels, [2, 50]); // level dikoreksi; catatan klaim dipertahankan
});

test("localStorage diblokir: tidak crash, tetap bekerja selama halaman terbuka", () => {
  fresh(); blocked = true;
  const r = P.awardSession("b1", { total: 10, answered: 10, correct: 10 });
  assert.ok(r); assert.equal(r.xpGained, 170);
  assert.equal(P.awardSession("b1", { total: 10, answered: 10, correct: 10 }), null); // tetap tidak ganda
  assert.equal(P.loadProgress().xp, 170);
  blocked = false;
});

test("riwayat sesi dibatasi tetapi sesi terbaru tetap terlindungi", () => {
  fresh();
  for (let i = 0; i < P.RULES.maxRewardedSessions + 20; i++) P.awardSession("s" + i, { total: 1, answered: 0, correct: 0 });
  const d = P.loadProgress();
  assert.equal(d.rewardedSessions.length, P.RULES.maxRewardedSessions);
  assert.equal(P.awardSession("s" + (P.RULES.maxRewardedSessions + 19), { total: 1, answered: 1, correct: 1 }), null);
});

test("progress bar: awal, tengah, dan tepat di batas level", () => {
  let p = P.levelProgress(0); assert.deepEqual([p.level, p.into, p.needed, p.percent], [1, 0, 100, 0]);
  p = P.levelProgress(50); assert.equal(p.percent, 50);
  p = P.levelProgress(100); assert.deepEqual([p.level, p.into, p.needed], [2, 0, 150]);
  p = P.levelProgress(99); assert.equal(p.level, 1); assert.ok(p.percent < 100);
});
