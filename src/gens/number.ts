import { mcq, num, type Gen } from '../lib/problem'
import { ri, pick, fmt, tx, money, round } from '../lib/num'

const sup = (n: number) => (n === 1 ? '' : `^{${n}}`)

// ---------- Indices ----------
export const indexMultiply: Gen = (d) => {
  const v = pick(['x', 'a', 'm', 'y'])
  const m = ri(2, 7)
  let n = ri(2, 7)
  if (m === 2 && n === 2) n = 3
  if (d === 1) {
    return mcq(`Simplify $${v}${sup(m)} \\times ${v}${sup(n)}$`, `$${v}${sup(m + n)}$`, [`$${v}${sup(m * n)}$`, `$${v}${sup(Math.abs(m - n))}$`, `$2${v}${sup(m + n)}$`], [`Same base, multiplying → **add** the indices.`, `$${v}${sup(m)} \\times ${v}${sup(n)} = ${v}^{${m}+${n}} =${v}${sup(m + n)}$`], 'Multiplying the same base: add the powers.')
  }
  const a = ri(2, 6)
  let b = ri(2, 5)
  if (a === 2 && b === 2) b = 3
  return mcq(`Simplify $${a}${v}${sup(m)} \\times ${b}${v}${sup(n)}$`, `$${a * b}${v}${sup(m + n)}$`, [`$${a + b}${v}${sup(m + n)}$`, `$${a * b}${v}${sup(m * n)}$`, `$${a + b}${v}${sup(m * n)}$`], [`Multiply the numbers: $${a} \\times ${b} = ${a * b}$.`, `Add the indices: $${m} + ${n} = ${m + n}$.`, `Answer: $${a * b}${v}${sup(m + n)}$`], 'Numbers multiply, indices add.')
}

export const indexDivide: Gen = (d) => {
  const v = pick(['x', 'a', 'p', 'y'])
  const n = ri(2, 5)
  const m = n + ri(1, 6)
  if (d === 1) return mcq(`Simplify $${v}${sup(m)} \\div ${v}${sup(n)}$`, `$${v}${sup(m - n)}$`, [`$${v}${sup(m + n)}$`, `$${v}^{${fmt(m / n, 1)}}$`, `$1${v}${sup(m * n)}$`], [`Same base, dividing → **subtract** the indices.`, `$${m} - ${n} = ${m - n}$, so the answer is $${v}${sup(m - n)}$.`])
  const b = ri(2, 5)
  const a = b * ri(2, 6)
  return mcq(`Simplify $\\dfrac{${a}${v}${sup(m)}}{${b}${v}${sup(n)}}$`, `$${a / b}${v}${sup(m - n)}$`, [`$${a - b}${v}${sup(m - n)}$`, `$${a / b}${v}${sup(m + n)}$`, `$${a * b}${v}${sup(m - n)}$`], [`Divide the numbers: $${a} \\div ${b} = ${a / b}$.`, `Subtract the indices: $${m} - ${n} = ${m - n}$.`, `Answer: $${a / b}${v}${sup(m - n)}$`])
}

export const indexPower: Gen = (d) => {
  const v = pick(['x', 'a', 'k'])
  const m = ri(2, 5)
  const n = ri(2, 4)
  if (d === 1) {
    const base = ri(2, 3)
    const p = ri(2, 4)
    const q = ri(1, 3)
    const val = base ** (p + q)
    return num(`Evaluate $${base}${sup(p)} \\times ${base}${sup(q)}$`, val, [`Add the indices: $${base}${sup(p)} \\times ${base}${sup(q)} = ${base}${sup(p + q)}$.`, `$${base}${sup(p + q)} = ${val}$`], { hint: 'Use the index law first, then work out the power.' })
  }
  if (d === 2) return mcq(`Simplify $(${v}${sup(m)})${sup(n)}$`, `$${v}${sup(m * n)}$`, [`$${v}${sup(m + n)}$`, `$${n}${v}${sup(m)}$`, `$${v}${sup(m ** n)}$`], [`A power of a power → **multiply** the indices.`, `$${m} \\times ${n} = ${m * n}$, so $${v}${sup(m * n)}$.`])
  const k = ri(2, 4)
  const c = ri(2, 9)
  if (Math.random() < 0.4) return num(`Evaluate $${c}${v}^0 + ${k}^0$`, c + 1, [`Anything to the power 0 is 1: $${v}^0 = 1$ and $${k}^0 = 1$.`, `$${c} \\times 1 + 1 = ${c + 1}$`], { hint: 'Careful: only the variable is raised to 0 in the first term.' })
  return mcq(`Simplify $(${k}${v}${sup(m)})${sup(n)}$`, `$${k ** n}${v}${sup(m * n)}$`, [`$${k * n}${v}${sup(m * n)}$`, `$${k}${v}${sup(m * n)}$`, `$${k ** n}${v}${sup(m + n)}$`], [`Everything inside the bracket is raised to the power ${n}.`, `$${k}${sup(n)} = ${k ** n}$ and $(${v}${sup(m)})${sup(n)} = ${v}${sup(m * n)}$.`, `Answer: $${k ** n}${v}${sup(m * n)}$`], 'Raise the number to the power too!')
}

// ---------- Scientific notation ----------
function sciParts(d: number) {
  const a = ri(11, 99) / 10 // 1.1 .. 9.9
  const n = d === 1 ? ri(3, 6) : ri(4, 9)
  return { a, n }
}
const sciTex = (a: number, n: number) => `${tx(a, 3)} \\times 10^{${n}}`

export const sciToStandard: Gen = (d) => {
  if (d === 1) {
    const { a, n } = sciParts(d)
    const value = round(a * 10 ** n, 0)
    return mcq(`Write $${value.toLocaleString('en-AU').replace(/,/g, '\\,')}$ in scientific notation.`, `$${sciTex(a, n)}$`, [`$${sciTex(a, n - 1)}$`, `$${sciTex(a, n + 1)}$`, `$${tx(a * 10, 3)} \\times 10^{${n - 1}}$`], [`Move the decimal point until one non-zero digit is in front: $${tx(a, 3)}$.`, `It moved ${n} places to the left, so the power is $10^{${n}}$.`, `Answer: $${sciTex(a, n)}$`], 'Count how many places the decimal point hops.')
  }
  const a = ri(11, 99) / 10
  const n = -ri(2, d === 2 ? 4 : 6)
  const value = a * 10 ** n
  const str = value.toFixed(-n + 1).replace(/0+$/, '')
  return mcq(`Write $${str}$ in scientific notation.`, `$${sciTex(a, n)}$`, [`$${sciTex(a, -n)}$`, `$${sciTex(a, n + 1)}$`, `$${sciTex(a, n - 1)}$`], [`Move the decimal point right until one non-zero digit is in front: $${tx(a, 3)}$.`, `It moved ${-n} places to the right, so the power is negative: $10^{${n}}$.`, `Answer: $${sciTex(a, n)}$`], 'Small numbers get a negative power of 10.')
}

export const sciToOrdinary: Gen = (d) => {
  const a = ri(11, 99) / 10
  const n = d === 1 ? ri(2, 5) : d === 2 ? -ri(1, 3) : pick([ri(3, 6), -ri(2, 4)])
  const val = a * 10 ** n
  return num(`Write $${sciTex(a, n)}$ as an ordinary number.`, val, [n > 0 ? `Positive power → move the point ${n} places to the **right**.` : `Negative power → move the point ${-n} places to the **left**.`, `Answer: $${n > 0 ? round(val, 0) : val.toFixed(-n + 1).replace(/0+$/, '')}$`], { tol: Math.abs(val) * 1e-6 + 1e-9, hint: 'Positive power: bigger number. Negative power: smaller number.' })
}

// ---------- Simple interest ----------
const rates = [2, 2.5, 3, 3.5, 4, 4.5, 5, 6]

export const simpleInterestG: Gen = (d) => {
  const P = ri(5, 60) * 100
  const r = pick(rates)
  const n = ri(2, 6)
  const I = (P * r * n) / 100
  if (d === 1) return num(`Find the simple interest on ${money(P)} invested at ${r}% p.a. for ${n} years.`, I, [`$I = Prn$`, `$I = ${P} \\times ${r / 100} \\times ${n}$`, `$I = ${money(I)}$`], { tol: 0.01, unit: '$', hint: 'Change the rate to a decimal: divide by 100.' })
  if (d === 2) return num(`${money(P)} is invested at ${r}% p.a. simple interest for ${n} years. What is the **total** value at the end?`, P + I, [`Interest: $I = ${P} \\times ${r / 100} \\times ${n} = ${money(I)}$`, `Total: $A = P + I = ${P} + ${tx(I)} = ${money(P + I)}$`], { tol: 0.01, unit: '$', hint: 'Total = principal + interest.' })
  return num(`An investment of ${money(P)} earned ${money(I)} simple interest over ${n} years. What was the interest rate (% p.a.)?`, r, [`Rearrange $I = Prn$: $r = \\dfrac{I}{Pn}$`, `$r = \\dfrac{${tx(I)}}{${P} \\times ${n}} = ${r / 100}$`, `As a percentage: ${r}% p.a.`], { tol: 0.01, unit: '%' })
}

// ---------- Compound interest ----------
export const compoundG: Gen = (d) => {
  const P = ri(10, 80) * 100
  const r = pick([3, 4, 5, 6, 8, 10])
  const n = ri(2, d === 1 ? 3 : 8)
  const A = round(P * (1 + r / 100) ** n, 2)
  if (d === 1) return num(`${money(P)} is invested at ${r}% p.a. compounded annually. What is it worth after ${n} years? (nearest cent)`, A, [`$A = P(1 + r)^n$`, `$A = ${P} \\times ${tx(1 + r / 100, 2)}^{${n}}$`, `$A = ${money(A)}$`], { tol: 0.05, unit: '$', hint: 'Multiply by (1 + rate as a decimal) once for every year.' })
  if (d === 2) return num(`How much **interest** is earned when ${money(P)} is invested at ${r}% p.a. compounded annually for ${n} years? (nearest cent)`, round(A - P, 2), [`$A = ${P} \\times ${tx(1 + r / 100, 2)}^{${n}} = ${money(A)}$`, `Interest $= A - P = ${tx(A)} - ${P} = ${money(A - P)}$`], { tol: 0.05, unit: '$' })
  const dep = pick([10, 12, 15, 20])
  const V = ri(15, 45) * 1000
  const val = round(V * (1 - dep / 100) ** n, 2)
  return num(`A car bought for ${money(V)} loses ${dep}% of its value each year. What is it worth after ${n} years? (nearest cent)`, val, [`Depreciation: $A = P(1 - r)^n$`, `$A = ${V} \\times ${tx(1 - dep / 100, 2)}^{${n}}$`, `$A = ${money(val)}$`], { tol: 0.05, unit: '$', hint: 'Losing value → multiply by (1 − rate).' })
}
