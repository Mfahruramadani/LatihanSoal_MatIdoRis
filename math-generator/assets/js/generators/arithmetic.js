import { randInt, choose } from "../utils.js";

const ranges = {
  easy: [1, 20], medium: [10, 100], hard: [50, 1000]
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
      const cap = difficulty === "easy" ? 12 : difficulty === "medium" ? 30 : 100;
      const x = randInt(2, cap), y = randInt(2, cap);
      expression = `${x} × ${y}`; answer = x * y; break;
    }
    case "division": {
      const divisor = randInt(2, difficulty === "easy" ? 12 : difficulty === "medium" ? 25 : 50);
      const quotient = randInt(2, difficulty === "easy" ? 12 : difficulty === "medium" ? 30 : 100);
      expression = `${divisor * quotient} ÷ ${divisor}`; answer = quotient; break;
    }
    case "parentheses": {
      const x = randInt(2, 12), y = randInt(2, 12), z = randInt(2, 10);
      expression = `(${x} + ${y}) × ${z}`; answer = (x + y) * z; break;
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
