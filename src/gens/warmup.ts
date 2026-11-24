// Mental maths warm-up: quick-fire basics that underpin everything else.
import { num, type Problem } from '../lib/problem'
import { ri, pick, nz, tx } from '../lib/num'

const kinds: (() => Problem)[] = [
  () => {
    const a = ri(3, 12)
    const b = ri(3, 12)
    return num(`$${a} \\times ${b}$`, a * b, [`$${a} \\times ${b} = ${a * b}$`])
  },
  () => {
    const b = ri(3, 12)
    const q = ri(2, 12)
    return num(`$${b * q} \\div ${b}$`, q, [`$${b} \\times ${q} = ${b * q}$, so the answer is ${q}.`])
  },
  () => {
    const a = nz(-12, 12)
    const b = nz(-12, 12)
    const op = pick(['+', '-', '\\times'])
    const v = op === '+' ? a + b : op === '-' ? a - b : a * b
    return num(`$${a} ${op} ${b < 0 ? `(${b})` : b}$`, v, [op === '\\times' ? 'Same signs → positive, different signs → negative.' : 'Subtracting a negative is the same as adding.', `Answer: ${v}`])
  },
  () => {
    const p = pick([10, 20, 25, 50, 5, 15, 75])
    const n = ri(2, 20) * 20
    return num(`${p}% of ${n}`, (p * n) / 100, [p === 10 ? 'Divide by 10.' : p === 25 ? 'Divide by 4.' : p === 50 ? 'Halve it.' : p === 5 ? 'Find 10%, then halve.' : p === 15 ? '10% + 5%.' : p === 75 ? '50% + 25%.' : 'Find 10%, then double.', `$${tx((p * n) / 100)}$`])
  },
  () => {
    const [f, dec] = pick([
      ['\\tfrac12', 0.5],
      ['\\tfrac14', 0.25],
      ['\\tfrac34', 0.75],
      ['\\tfrac15', 0.2],
      ['\\tfrac25', 0.4],
      ['\\tfrac18', 0.125],
      ['\\tfrac{1}{10}', 0.1],
      ['\\tfrac35', 0.6],
    ] as const)
    return num(`Write $${f}$ as a decimal`, dec, [`$${f} = ${dec}$`])
  },
  () => {
    const n = ri(2, 15)
    return Math.random() < 0.5 ? num(`$${n}^2$`, n * n, [`$${n} \\times ${n} = ${n * n}$`]) : num(`$\\sqrt{${n * n}}$`, n, [`$${n} \\times ${n} = ${n * n}$, so $\\sqrt{${n * n}} = ${n}$`])
  },
  () => {
    const a = ri(2, 9)
    const b = ri(2, 9)
    const c = ri(2, 9)
    return num(`$${a} + ${b} \\times ${c}$`, a + b * c, [`Multiply before adding (BIDMAS): $${b} \\times ${c} = ${b * c}$`, `$${a} + ${b * c} = ${a + b * c}$`])
  },
  () => {
    const x = nz(-6, 6)
    const m = ri(2, 5)
    const c = nz(-9, 9)
    return num(`If $x = ${x}$, find $${m}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}$`, m * x + c, [`$${m} \\times ${x < 0 ? `(${x})` : x} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${m * x + c}$`])
  },
]

export function warmupQuestion(): Problem {
  return pick(kinds)()
}
