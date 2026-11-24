import { mcq, num, type Gen } from '../lib/problem'
import { ri, pick, round, tx, gcd, shuffle } from '../lib/num'

const list = (xs: number[]) => xs.join(', ')
const median = (s: number[]) => (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2)
const frac = (a: number, b: number) => {
  const g = gcd(a, b)
  return `\\dfrac{${a / g}}{${b / g}}`
}

// ---------- Summary statistics ----------
export const meanG: Gen = (d) => {
  const n = d === 1 ? 5 : ri(6, 8)
  const xs = Array.from({ length: n }, () => ri(2, 30))
  const sum = xs.reduce((a, b) => a + b, 0)
  if (d === 3 && Math.random() < 0.5) {
    const target = ri(10, 20)
    const known = xs.slice(0, n - 1)
    const ks = known.reduce((a, b) => a + b, 0)
    const missing = target * n - ks
    if (missing > 0) return num(`The mean of ${n} numbers is ${target}. ${n - 1} of them are ${list(known)}. What is the missing number?`, missing, [`Total needed $= \\text{mean} \\times n = ${target} \\times ${n} = ${target * n}$`, `Sum of known numbers $= ${ks}$`, `Missing number $= ${target * n} - ${ks} = ${missing}$`], { hint: 'Mean × number of values = total.' })
  }
  return num(`Find the mean of: ${list(xs)}${Number.isInteger(sum / n) ? '' : ' (1 decimal place)'}`, round(sum / n, 1), [`Add them up: ${xs.join(' + ')} = ${sum}`, `Divide by how many there are: $${sum} \\div ${n} ${Number.isInteger(sum / n) ? '=' : '\\approx'} ${tx(round(sum / n, 1), 1)}$`], { tol: 0.06, hint: 'Total ÷ how many.' })
}

export const medianG: Gen = (d) => {
  const n = d === 1 ? pick([5, 7]) : pick([6, 8, 9])
  const xs = Array.from({ length: n }, () => ri(1, 40))
  const s = [...xs].sort((a, b) => a - b)
  const m = median(s)
  return num(`Find the median of: ${list(xs)}`, m, [`Put them in order: ${list(s)}`, n % 2 ? `There are ${n} values, so the median is the ${(n + 1) / 2}th: **${m}**` : `There are ${n} values, so average the middle two: $\\dfrac{${s[n / 2 - 1]} + ${s[n / 2]}}{2} = ${tx(m)}$`], { hint: 'Order the numbers first!' })
}

export const rangeModeG: Gen = () => {
  const base = Array.from({ length: 6 }, () => ri(1, 25))
  const mode = pick(base)
  const xs = shuffle([...base, mode, mode])
  const counts: Record<number, number> = {}
  xs.forEach((x) => (counts[x] = (counts[x] ?? 0) + 1))
  const maxC = Math.max(...Object.values(counts))
  const modes = Object.keys(counts).filter((k) => counts[+k] === maxC)
  if (modes.length === 1 && Math.random() < 0.5) return num(`Find the mode of: ${list(xs)}`, +modes[0], [`Count how often each value appears.`, `${modes[0]} appears ${maxC} times — more than any other value.`])
  const r = Math.max(...xs) - Math.min(...xs)
  return num(`Find the range of: ${list(xs)}`, r, [`Highest = ${Math.max(...xs)}, lowest = ${Math.min(...xs)}`, `Range $= ${Math.max(...xs)} - ${Math.min(...xs)} = ${r}$`])
}

// ---------- Quartiles & IQR ----------
function quartiles(s: number[]) {
  const n = s.length
  const lower = s.slice(0, Math.floor(n / 2))
  const upper = s.slice(Math.ceil(n / 2))
  return { q1: median(lower), q2: median(s), q3: median(upper), lower, upper }
}

export const iqrG: Gen = (d) => {
  const n = d === 1 ? 7 : pick([8, 9, 11])
  const xs = Array.from({ length: n }, () => ri(1, 50))
  const s = [...xs].sort((a, b) => a - b)
  const { q1, q3, lower, upper } = quartiles(s)
  const iqr = q3 - q1
  if (d === 3 && Math.random() < 0.5) {
    const fence = q3 + 1.5 * iqr
    return num(`For the data ${list(xs)}, find the upper fence $Q_3 + 1.5 \\times IQR$ (values above it are outliers).`, fence, [`Ordered: ${list(s)}`, `$Q_1 = ${tx(q1)}$, $Q_3 = ${tx(q3)}$, IQR $= ${tx(iqr)}$`, `Upper fence $= ${tx(q3)} + 1.5 \\times ${tx(iqr)} = ${tx(fence)}$`], { tol: 0.01 })
  }
  return num(`Find the interquartile range (IQR) of: ${list(xs)}`, iqr, [`Order the data: ${list(s)}`, `Lower half: ${list(lower)} → $Q_1 = ${tx(q1)}$`, `Upper half: ${list(upper)} → $Q_3 = ${tx(q3)}$`, `IQR $= Q_3 - Q_1 = ${tx(q3)} - ${tx(q1)} = ${tx(iqr)}$`], { tol: 0.01, hint: 'Q3 − Q1. Find the medians of the lower and upper halves.' })
}

export const scatterG: Gen = () => {
  const kind = pick(['pos', 'neg', 'none'] as const)
  const pts: [number, number][] = Array.from({ length: 12 }, (_, i) => {
    const x = 1 + i * 0.8 + Math.random() * 0.5
    const noise = (Math.random() - 0.5) * 3
    const y = kind === 'pos' ? 1 + x * 0.9 + noise : kind === 'neg' ? 10 - x * 0.9 + noise : 2 + Math.random() * 8
    return [round(x, 2), round(Math.max(0.3, Math.min(10.5, y)), 2)]
  })
  const ctx = { pos: ['hours of practice', 'goals scored'], neg: ['hours on phone', 'hours of sleep'], none: ['shoe size', 'test score'] }[kind]
  const answer = { pos: 'Positive relationship', neg: 'Negative relationship', none: 'No clear relationship' }[kind]
  return mcq(`Describe the relationship shown in this scatter plot.`, answer, ['Positive relationship', 'Negative relationship', 'No clear relationship'], [kind === 'pos' ? 'As one variable increases, the other tends to increase → positive.' : kind === 'neg' ? 'As one variable increases, the other tends to decrease → negative.' : 'The points are scattered with no trend → no relationship.'], undefined, { type: 'scatter', points: pts, xLabel: ctx[0], yLabel: ctx[1] })
}

// ---------- Probability ----------
export const probSingle: Gen = (d) => {
  if (d === 1) {
    const r = ri(1, 9)
    const b = ri(1, 9)
    const g = ri(0, 6)
    const col = pick(['red', 'blue'] as const)
    const k = col === 'red' ? r : b
    const tot = r + b + g
    return num(`A bag has ${r} red, ${b} blue${g ? ` and ${g} green` : ''} marbles. One is picked at random. What is P(${col})? (fraction or decimal)`, k / tot, [`Favourable outcomes: ${k}. Total outcomes: ${tot}.`, `P(${col}) $= ${frac(k, tot)}$`], { tol: 0.005, hint: 'Number of ways it can happen ÷ total number of outcomes.' })
  }
  const target = ri(2, 12)
  let ways = 0
  for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) if (i + j === target) ways++
  return num(`Two dice are rolled. What is the probability their sum is ${target}?`, ways / 36, [`There are $6 \\times 6 = 36$ equally likely outcomes.`, `Pairs that add to ${target}: ${ways}.`, `P $= ${frac(ways, 36)}$`], { tol: 0.005, hint: 'Draw a 6 × 6 table of sums.' })
}

export const probTree: Gen = (d) => {
  const p = pick([0.2, 0.3, 0.4, 0.6, 0.7, 0.8])
  const q = pick([0.1, 0.25, 0.5, 0.6, 0.75, 0.9])
  if (d <= 2) return num(`The probability it rains on Saturday is ${p}, and on Sunday is ${q} (independent). What is the probability it rains on **both** days?`, round(p * q, 4), [`Independent events: multiply along the branches.`, `$P = ${p} \\times ${q} = ${round(p * q, 4)}$`], { tol: 0.001 })
  const ans = round(p * (1 - q) + (1 - p) * q, 4)
  return num(`P(rain Saturday) = ${p}, P(rain Sunday) = ${q} (independent). What is the probability it rains on **exactly one** day?`, ans, [`Two paths: rain–dry or dry–rain.`, `$${p} \\times ${round(1 - q, 2)} + ${round(1 - p, 2)} \\times ${q}$`, `$= ${round(p * (1 - q), 4)} + ${round((1 - p) * q, 4)} = ${ans}$`], { tol: 0.001, hint: 'Multiply along each path, then add the paths.' })
}

export const vennG: Gen = () => {
  const both = ri(2, 8)
  const onlyA = ri(3, 12)
  const onlyB = ri(3, 12)
  const neither = ri(1, 8)
  const total = both + onlyA + onlyB + neither
  const ask = pick(['union', 'neither', 'onlyA'] as const)
  const v = { union: both + onlyA + onlyB, neither, onlyA }[ask]
  const desc = { union: 'plays soccer OR netball (or both)', neither: 'plays neither sport', onlyA: 'plays soccer only' }[ask]
  return num(`In a class of ${total}: ${onlyA + both} play soccer, ${onlyB + both} play netball, and ${both} play both. What is the probability a student ${desc}?`, v / total, [`Soccer only $= ${onlyA + both} - ${both} = ${onlyA}$, netball only $= ${onlyB + both} - ${both} = ${onlyB}$`, `Neither $= ${total} - ${onlyA} - ${onlyB} - ${both} = ${neither}$`, `P $= ${frac(v, total)}$`], { tol: 0.005, hint: 'Draw a Venn diagram. Fill in “both” first!' })
}

// ---------- Conditional ----------
export const noReplace: Gen = () => {
  const r = ri(3, 8)
  const b = ri(2, 7)
  const t = r + b
  const ans = (r / t) * ((r - 1) / (t - 1))
  return num(`A box has ${r} red and ${b} blue pens. Two are taken out **without replacement**. What is P(both red)?`, ans, [`First pick: $P(R) = ${frac(r, t)}$`, `Second pick (one red gone): $P(R) = ${frac(r - 1, t - 1)}$`, `$P(RR) = ${frac(r, t)} \\times ${frac(r - 1, t - 1)} = ${frac(r * (r - 1), t * (t - 1))}$`], { tol: 0.002, hint: 'After the first pick there is one fewer pen — and one fewer red.' })
}

export const twoWayG: Gen = () => {
  const a = ri(5, 20)
  const b = ri(5, 20)
  const c = ri(5, 20)
  const dd = ri(5, 20)
  return num(`A survey: Year 9 — ${a} like footy, ${b} don’t. Year 10 — ${c} like footy, ${dd} don’t. A student is chosen from those who like footy. What is P(Year 10 | likes footy)?`, c / (a + c), [`“Given they like footy” → only look at the footy column: $${a} + ${c} = ${a + c}$ students.`, `Of these, ${c} are Year 10.`, `$P = ${frac(c, a + c)}$`], { tol: 0.005, hint: 'The “given” part shrinks the group you choose from.' })
}

export const independentG: Gen = () => {
  const pa = pick([0.2, 0.4, 0.5, 0.6])
  const pb = pick([0.3, 0.5, 0.25])
  const indep = Math.random() < 0.5
  const pab = indep ? round(pa * pb, 3) : round(pa * pb + pick([0.05, 0.1, -0.05]), 3)
  return mcq(`$P(A) = ${pa}$, $P(B) = ${pb}$ and $P(A \\cap B) = ${pab}$. Are A and B independent?`, indep ? 'Yes' : 'No', [indep ? 'No' : 'Yes'], [`Independent means $P(A \\cap B) = P(A) \\times P(B)$.`, `$${pa} \\times ${pb} = ${round(pa * pb, 3)}$`, indep ? `That matches ${pab}, so they ARE independent.` : `That does not match ${pab}, so they are NOT independent.`])
}
