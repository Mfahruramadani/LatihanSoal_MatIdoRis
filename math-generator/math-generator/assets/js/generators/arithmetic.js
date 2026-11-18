import { randInt, choose } from "../utils.js";

const ranges = {
  easy: [1, 50], medium: [10, 200], hard: [50, 2000]
};

function makeArithmetic(subtype, difficulty) {
  const [min, max] = ranges[difficulty];
  const a = randInt(min, max);
  const b = randInt(min, max);
  let expression, answer;

  switch (subtype) {
    case "addition":
      expression = `${a} + ${b}`; answer = a + b; break;
    case "subtraction": {
      const x = Math.max(a, b), y = Math.min(a, b);
      expression = `${x} − ${y}`; answer = x - y; break;
    }
    case "multiplication": {
      const cap = difficulty === "easy" ? 15 : difficulty === "medium" ? 40 : 150;
      const x = randInt(2, cap), y = randInt(2, difficulty === "easy" ? 20 : cap);
      expression = `${x} × ${y}`; answer = x * y; break;
    }
    case "division": {
      const divisor = randInt(2, difficulty === "easy" ? 12 : difficulty === "medium" ? 30 : 60);
      const quotient = randInt(2, difficulty === "easy" ? 25 : difficulty === "medium" ? 40 : 120);
      expression = `${divisor * quotient} ÷ ${divisor}`; answer = quotient; break;
    }
    case "parentheses": {
      const m = difficulty === "easy" ? 12 : difficulty === "medium" ? 25 : 60, x = randInt(2, m), y = randInt(2, m), z = randInt(2, difficulty === "easy" ? 10 : 15);
      const form = choose(["(+)×", "(−)×", "×(+)", "(+)÷"]);
      if (form === "(−)×") { const hi = Math.max(x, y) + (x === y ? 1 : 0), lo = Math.min(x, y); expression = `(${hi} − ${lo}) × ${z}`; answer = (hi - lo) * z; }
      else if (form === "×(+)") { expression = `${z} × (${x} + ${y})`; answer = z * (x + y); }
      else if (form === "(+)÷") { const q = randInt(2, 12), s = z + 1, tot = q * s, a1 = randInt(1, tot - 1); expression = `(${a1} + ${tot - a1}) ÷ ${s}`; answer = q; }
      else { expression = `(${x} + ${y}) × ${z}`; answer = (x + y) * z; }
      break;
    }
    default: {
      const op = choose(["+", "−", "×"]);
      if (op === "+") { expression = `${a} + ${b}`; answer = a + b; }
      else if (op === "−") { const x=Math.max(a,b), y=Math.min(a,b); expression=`${x} − ${y}`; answer=x-y; }
      else { const x=randInt(2, difficulty==="easy"?12: difficulty==="medium"?25:60); const y=randInt(2,difficulty==="easy"?12:difficulty==="medium"?25:60); expression=`${x} × ${y}`; answer=x*y; }
    }
  }
  return { prompt: `${expression} = ?`, answer: String(answer), explanation: `${expression} = ${answer}` };
}

export function generateArithmetic(subtype, difficulty) {
  return makeArithmetic(subtype, difficulty);
}
