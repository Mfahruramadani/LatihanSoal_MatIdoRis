import { TOPICS } from "../assets/js/generator.js";
import { isCorrect } from "../assets/js/checker.js";
const N = 3000;
const sig = q => (q.key ?? (q.prompt + "||" + q.answer)) + (q.memorize?.content || "");
const rows = []; let errs = [], wrong = [];
for (const [tk, t] of Object.entries(TOPICS)) for (const [sk] of t.subtypes) { if (sk === "mixed") continue;
  for (const d of ["easy","medium","hard"]) {
    const freq = new Map();
    for (let i = 0; i < N; i++) { let q;
      try { q = t.gen(sk, d); } catch (e) { errs.push(`${tk}/${sk}/${d}: ${e.message}`); continue; }
      if (!q.prompt || q.answer === undefined || q.answer === "undefined" || /NaN|undefined|Infinity/.test(q.prompt + q.answer)) wrong.push(`${tk}/${sk}/${d} bad text: ${q.prompt} => ${q.answer}`);
      if (q.kind === "choice") { if (!q.choices.includes(q.answer) || new Set(q.choices).size !== q.choices.length || q.choices.length < 3) wrong.push(`${tk}/${sk}/${d} choices: ${q.prompt.slice(0,60)} ${JSON.stringify(q.choices)}`); }
      else if (q.kind !== "vocab" && !isCorrect(q, q.answer)) wrong.push(`${tk}/${sk}/${d} checker rejects own answer: ${q.prompt.slice(0,70)} => ${q.answer}`);
      if (q.kind === "vocab" && !isCorrect(q, q.answer)) wrong.push(`${tk}/${sk}/${d} vocab rejects: ${q.prompt} => ${q.answer}`);
      const h = sig(q); freq.set(h, (freq.get(h) || 0) + 1); }
    const dis = freq.size, f1 = [...freq.values()].filter(v => v === 1).length, f2 = [...freq.values()].filter(v => v === 2).length;
    rows.push({ tk, sk, d, distinct: dis, est: Math.round(dis + f1 * (f1 - 1) / (2 * (f2 + 1))) });
  } }
console.log("errors", errs.length, errs.slice(0,5)); console.log("quality issues", wrong.length); const cats=new Map(); wrong.forEach(w=>{const k=w.split(" ")[0]; cats.set(k,(cats.get(k)||0)+1)}); console.log([...cats]); wrong.filter(w=>!w.startsWith("speed/compare/hard")).slice(0,8).forEach(x=>console.log(" ",x));
const buckets = { "<30": 0, "30-99": 0, "100-299": 0, ">=300": 0 };
for (const r of rows) buckets[r.distinct < 30 ? "<30" : r.distinct < 100 ? "30-99" : r.distinct < 300 ? "100-299" : ">=300"]++;
console.log(rows.length, buckets);
console.log("Masih kecil (<40 unik):"); rows.filter(r=>r.distinct<40).sort((a,b)=>a.distinct-b.distinct).forEach(r=>console.log(`  ${r.tk}/${r.sk}/${r.d}: ${r.distinct}`));
import fs from "fs"; fs.writeFileSync("./pool-report.json", JSON.stringify(rows));
