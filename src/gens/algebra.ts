import { mcq, num, multi, type Gen } from '../lib/problem'
import { ri, nz, pick, gcd, poly, fac, lead, next, fmt, tx, round } from '../lib/num'

const $ = (s: string) => `$${s}$`

// ---------- Expanding ----------
export const expandSingle: Gen = (d) => {
  const k = d === 1 ? ri(2, 7) : nz(-6, 6) === 0 ? -2 : -ri(2, 6)
  const a = ri(1, 3)
  const b = nz(-9, 9)
  const correct = poly([k * a, 'x'], [k * b, ''])
  return mcq(`Expand ${$(`${k}(${poly([a, 'x'], [b, ''])})`)}`, $(correct), [$(poly([k * a, 'x'], [b, ''])), $(poly([k * a, 'x'], [-k * b, ''])), $(poly([a, 'x'], [k * b, '']))], [`Multiply **everything** inside the bracket by $${k}$.`, `$${k} \\times ${lead(a)} = ${lead(k * a)}$ and $${k} \\times ${b < 0 ? `(${b})` : b} = ${k * b}$`, `Answer: $${correct}$`], k < 0 ? 'A negative times a negative is positive!' : 'Multiply both terms inside.')
}

export const expandBinomial: Gen = (d) => {
  const a = d === 1 ? ri(1, 6) : nz(-7, 7)
  const b = d === 1 ? ri(1, 6) : nz(-7, 7)
  if (d === 3 && Math.random() < 0.5) {
    const c = ri(2, 9)
    if (Math.random() < 0.5) {
      const correct = poly([1, 'x^2'], [2 * c, 'x'], [c * c, ''])
      return mcq(`Expand ${$(`(x + ${c})^2`)}`, $(correct), [$(poly([1, 'x^2'], [c * c, ''])), $(poly([1, 'x^2'], [c, 'x'], [c * c, ''])), $(poly([1, 'x^2'], [2 * c, 'x'], [2 * c, '']))], [`$(x + ${c})^2$ means $(x + ${c})(x + ${c})$ — not just squaring each term!`, `$x^2 + ${c}x + ${c}x + ${c * c} = ${correct}$`], 'Write it out as two brackets.')
    }
    const correct = poly([1, 'x^2'], [-c * c, ''])
    return mcq(`Expand ${$(`(x + ${c})(x - ${c})`)}`, $(correct), [$(poly([1, 'x^2'], [c * c, ''])), $(poly([1, 'x^2'], [-2 * c, 'x'], [-c * c, ''])), $(poly([1, 'x^2'], [-c, '']))], [`$x^2 - ${c}x + ${c}x - ${c * c}$`, `The middle terms cancel: $${correct}$ (difference of two squares)`])
  }
  const correct = poly([1, 'x^2'], [a + b, 'x'], [a * b, ''])
  if (Math.random() < 0.35) return num(`Expand ${$(`${fac(a)}${fac(b)}`)}. What is the coefficient of $x$?`, a + b, [`$x \\times x = x^2$, $x \\times ${b < 0 ? `(${b})` : b} = ${lead(b)}$, $${a} \\times x = ${lead(a)}$, $${a} \\times ${b < 0 ? `(${b})` : b} = ${a * b}$`, `$${correct}$, so the coefficient of $x$ is ${a + b}.`], { hint: 'The x-terms come from the two "outside" and "inside" products.' })
  return mcq(`Expand ${$(`${fac(a)}${fac(b)}`)}`, $(correct), [$(poly([1, 'x^2'], [a * b, 'x'], [a + b, ''])), $(poly([1, 'x^2'], [a * b, ''])), $(poly([1, 'x^2'], [a - b, 'x'], [a * b, ''])), $(poly([1, 'x^2'], [a + b, 'x'], [-a * b, '']))], [`Multiply each term in the first bracket by each term in the second (4 handshakes).`, `$x^2${next(b, 'x')}${next(a, 'x')}${next(a * b)}$`, `Collect like terms: $${correct}$`], 'First, Outside, Inside, Last.')
}

// ---------- Factorising (common factor) ----------
export const factorHCF: Gen = (d) => {
  if (d === 1) {
    const k = ri(2, 9)
    const p = ri(1, 7)
    let q = ri(1, 9)
    while (gcd(p, q) !== 1) q = ri(1, 9)
    const correct = `${k}(${poly([p, 'x'], [q, ''])})`
    return mcq(`Factorise ${$(poly([k * p, 'x'], [k * q, '']))}`, $(correct), [$(`${k}(${poly([p, 'x'], [k * q, ''])})`), $(`${k * p}(x + ${q})`), $(`${k}(${poly([p, 'x'], [-q, ''])})`)], [`HCF of $${k * p}$ and $${k * q}$ is $${k}$.`, `$${k * p}x \\div ${k} = ${lead(p)}$ and $${k * q} \\div ${k} = ${q}$`, `Answer: $${correct}$ — check by expanding!`], 'Find the biggest number that divides both terms.')
  }
  if (d === 2) {
    const k = ri(2, 6)
    const p = ri(1, 5)
    let q = nz(-7, 7)
    while (gcd(p, Math.abs(q)) !== 1) q = nz(-7, 7)
    const correct = `${k}x(${poly([p, 'x'], [q, ''])})`
    return mcq(`Factorise **fully** ${$(poly([k * p, 'x^2'], [k * q, 'x']))}`, $(correct), [$(`${k}(${poly([p, 'x^2'], [q, 'x'])})`), $(`x(${poly([k * p, 'x'], [k * q, ''])})`), $(`${k}x(${poly([p, 'x'], [-q, ''])})`)], [`Both terms have a factor of $${k}$ **and** a factor of $x$, so the HCF is $${k}x$.`, `Answer: $${correct}$`], '“Fully” means take out the numbers AND the letters.')
  }
  const a = ri(2, 6) * 2
  const b = ri(3, 9) * 3
  const h = gcd(a, b)
  return num(`What is the highest common factor of $${a}x$ and $${b}$?`, h, [`Factors of ${a}: ${divisors(a).join(', ')}`, `Factors of ${b}: ${divisors(b).join(', ')}`, `The largest one in both lists is ${h}.`])
}
function divisors(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1).filter((i) => n % i === 0)
}

// ---------- Linear equations ----------
export const linEqTwoStep: Gen = (d) => {
  const x = d === 1 ? ri(1, 10) : nz(-9, 9)
  const a = ri(2, 9)
  const b = nz(-15, 15)
  const c = a * x + b
  return num(`Solve ${$(`${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${c}`)}`, x, [`${b < 0 ? `Add ${-b}` : `Subtract ${b}`} on both sides: $${a}x = ${c - b}$`, `Divide both sides by ${a}: $x = ${x}$`, `Check: $${a} \\times ${x < 0 ? `(${x})` : x} ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${c}$ ✓`], { hint: 'Undo the + or − first, then the ×.' })
}

export const linEqBothSides: Gen = (d) => {
  const x = nz(-8, 8)
  const a = ri(3, 9)
  let c = ri(1, a - 1)
  if (d === 3) c = -ri(1, 5)
  const b = nz(-12, 12)
  const dd = (a - c) * x + b
  return num(`Solve ${$(`${poly([a, 'x'], [b, ''])} = ${poly([c, 'x'], [dd, ''])}`)}`, x, [`Get the $x$’s on one side: subtract $${lead(c)}$ from both sides: $${poly([a - c, 'x'], [b, ''])} = ${dd}$`, `${b < 0 ? `Add ${-b}` : `Subtract ${b}`}: $${lead(a - c)} = ${dd - b}$`, `Divide by ${a - c}: $x = ${x}$`], { hint: 'Collect the x terms on the side with more x’s.' })
}

export const linEqBrackets: Gen = (d) => {
  const x = d === 1 ? ri(1, 9) : nz(-8, 8)
  const a = ri(2, 6)
  const b = nz(-6, 6)
  if (d === 3 || Math.random() < 0.4) {
    const k = ri(2, 5)
    const c = ri(1, 6)
    // (x + b)/k = c  → x = kc - b
    const xx = k * c - b
    return num(`Solve ${$(`\\dfrac{${poly([1, 'x'], [b, ''])}}{${k}} = ${c}`)}`, xx, [`Multiply both sides by ${k}: $${poly([1, 'x'], [b, ''])} = ${k * c}$`, `${b < 0 ? `Add ${-b}` : `Subtract ${b}`}: $x = ${xx}$`])
  }
  const rhs = a * (x + b)
  return num(`Solve ${$(`${a}(${poly([1, 'x'], [b, ''])}) = ${rhs}`)}`, x, [`Divide both sides by ${a}: $${poly([1, 'x'], [b, ''])} = ${rhs / a}$`, `${b < 0 ? `Add ${-b}` : `Subtract ${b}`}: $x = ${x}$`, `(Or expand first: $${poly([a, 'x'], [a * b, ''])} = ${rhs}$.)`])
}

// ---------- Linear graphs ----------
export const gradientTwoPoints: Gen = (d) => {
  const x1 = ri(-4, 3)
  const y1 = ri(-4, 4)
  const run = ri(1, 5)
  const m = d === 1 ? ri(1, 3) : d === 2 ? nz(-3, 3) : pick([0.5, -0.5, 1.5, -2, 3])
  const rr = m % 1 !== 0 ? 2 * ri(1, 2) : run
  const x2 = x1 + rr
  const y2 = y1 + m * rr
  return num(`Find the gradient of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`, m, [`$m = \\dfrac{\\text{rise}}{\\text{run}} = \\dfrac{y_2 - y_1}{x_2 - x_1}$`, `$m = \\dfrac{${y2} - ${y1 < 0 ? `(${y1})` : y1}}{${x2} - ${x1 < 0 ? `(${x1})` : x1}} = \\dfrac{${y2 - y1}}{${rr}} = ${tx(m)}$`], { hint: 'Change in y divided by change in x. You can type fractions like 1/2.' })
}

export const readMC: Gen = (d) => {
  const m = nz(-5, 5)
  const c = nz(-9, 9)
  if (d === 1) {
    const askM = Math.random() < 0.5
    return num(`For the line ${$(`y = ${poly([m, 'x'], [c, ''])}`)}, what is the ${askM ? 'gradient' : '$y$-intercept'}?`, askM ? m : c, [`Compare with $y = mx + c$.`, askM ? `The number in front of $x$ is the gradient: $m = ${m}$.` : `The constant term is the y-intercept: $c = ${c}$.`])
  }
  if (d === 2) {
    const k = ri(2, 4)
    return num(`Find the gradient of ${$(`${k}y = ${poly([k * m, 'x'], [k * c, ''])}`)}`, m, [`Get $y$ on its own: divide everything by ${k}.`, `$y = ${poly([m, 'x'], [c, ''])}$, so $m = ${m}$.`], { hint: 'Rearrange to y = mx + c first.' })
  }
  const x = nz(-5, 5)
  return num(`The line ${$(`y = ${poly([m, 'x'], [c, ''])}`)} passes through a point with $x = ${x}$. What is the $y$-value?`, m * x + c, [`Substitute $x = ${x}$: $y = ${m} \\times ${x < 0 ? `(${x})` : x} ${c < 0 ? '-' : '+'} ${Math.abs(c)}$`, `$y = ${m * x + c}$`])
}

export const graphToEq: Gen = () => {
  const m = pick([-2, -1, 1, 2, 3, -3, 0.5])
  const c = nz(-3, 3)
  const eq = (mm: number, cc: number) => $(`y = ${mm === 0.5 ? '\\tfrac{1}{2}x' : lead(mm)}${next(cc)}`)
  return mcq(`Which equation matches this line?`, eq(m, c), [eq(-m, c), eq(m, -c), eq(c === m ? m + 1 : c, m === 0.5 ? 1 : m)], [`Find where it crosses the $y$-axis: $c = ${c}$.`, `From one grid point, count the run and rise: gradient $m = ${fmt(m)}$.`, `So ${eq(m, c)}`], 'Start with the y-intercept, then rise ÷ run.', { type: 'graph', lines: [{ m, c }] })
}

// ---------- Coordinate geometry ----------
export const midpointG: Gen = (d) => {
  const x1 = ri(-6, 6)
  const y1 = ri(-6, 6)
  const x2 = x1 + 2 * ri(1, 5) * (d >= 2 ? pick([1, -1]) : 1)
  const y2 = y1 + 2 * ri(-4, 4) + (d === 3 ? 1 : 0)
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  return multi(`Find the midpoint of $A(${x1}, ${y1})$ and $B(${x2}, ${y2})$.`, [
    { label: 'x', ans: mx },
    { label: 'y', ans: my },
  ], [`$M = \\left(\\dfrac{x_1 + x_2}{2}, \\dfrac{y_1 + y_2}{2}\\right)$`, `$x = \\dfrac{${x1} + ${x2 < 0 ? `(${x2})` : x2}}{2} = ${tx(mx)}$`, `$y = \\dfrac{${y1} + ${y2 < 0 ? `(${y2})` : y2}}{2} = ${tx(my)}$`], { hint: 'Average the x’s, average the y’s.' })
}

export const distanceG: Gen = (d) => {
  const [a, b] = d === 1 ? pick([[3, 4], [6, 8], [5, 12]] as const) : [ri(1, 7), ri(1, 7)]
  const x1 = ri(-5, 4)
  const y1 = ri(-5, 4)
  const x2 = x1 + a
  const y2 = y1 + b * pick([1, -1])
  const dist = Math.sqrt(a * a + b * b)
  return num(`Find the distance between $(${x1}, ${y1})$ and $(${x2}, ${y2})$${Number.isInteger(dist) ? '' : ', correct to 1 decimal place'}.`, round(dist, 1), [`Run $= ${a}$, rise $= ${Math.abs(y2 - y1)}$`, `$d = \\sqrt{${a}^2 + ${Math.abs(y2 - y1)}^2} = \\sqrt{${a * a + b * b}}$`, `$d ${Number.isInteger(dist) ? '=' : '\\approx'} ${tx(round(dist, 1), 1)}$`], { tol: 0.06, hint: 'Find the run and rise, then use Pythagoras.' })
}

// ---------- Factorising quadratics ----------
export const factorQuad: Gen = (d) => {
  if (d === 3 && Math.random() < 0.5) {
    const c = ri(2, 10)
    return mcq(`Factorise ${$(`x^2 - ${c * c}`)}`, $(`(x + ${c})(x - ${c})`), [$(`(x - ${c})^2`), $(`(x + ${c})^2`), $(`(x - ${c * c})(x + 1)`)], [`This is a difference of two squares: $a^2 - b^2 = (a + b)(a - b)$.`, `$x^2 - ${c * c} = x^2 - ${c}^2 = (x + ${c})(x - ${c})$`])
  }
  const p = d === 1 ? ri(1, 7) : nz(-8, 8)
  let q = d === 1 ? ri(1, 7) : nz(-8, 8)
  if (p + q === 0) q = q + 1 || 2
  const expr = poly([1, 'x^2'], [p + q, 'x'], [p * q, ''])
  const right = `${fac(p)}${fac(q)}`
  if (d === 2 && Math.random() < 0.4) return num(`${$(`${expr} = ${fac(p)}(x + ?)`)}. What number replaces the ? (it may be negative)`, q, [`The two numbers must multiply to $${p * q}$ and add to $${p + q}$.`, `$${p} \\times ${q < 0 ? `(${q})` : q} = ${p * q}$ and $${p} + ${q < 0 ? `(${q})` : q} = ${p + q}$`, `So the missing number is ${q}.`])
  const same = (u: number, v: number) => (u === p && v === q) || (u === q && v === p)
  const wrongs = ([[-p, -q], [p, -q], [p * q, 1], [p + q, 1], [-p, q]] as [number, number][]).filter(([u, v]) => !same(u, v)).map(([u, v]) => $(`${fac(u)}${fac(v)}`))
  return mcq(`Factorise ${$(expr)}`, $(right), wrongs, [`Find two numbers that **multiply** to $${p * q}$ and **add** to $${p + q}$.`, `They are $${p}$ and $${q}$.`, `So $${expr} = ${right}$. Expand to check!`], 'Product = last number, sum = middle number.')
}

// ---------- Solving quadratics ----------
export const quadNFL: Gen = (d) => {
  const p = nz(-9, 9)
  let q = nz(-9, 9)
  if (q === p) q = -p || 3
  if (d === 1) {
    const k = Math.random() < 0.5 ? 1 : ri(2, 3)
    const f2 = k === 1 ? fac(-q) : `(${k}x${next(-q * k)})`
    return multi(`Solve ${$(`${fac(-p)}${f2} = 0`)}`, [
      { label: 'x₁', ans: p },
      { label: 'x₂', ans: q },
    ], [`Null Factor Law: one of the brackets must equal zero.`, `$${poly([1, 'x'], [-p, ''])} = 0 \\Rightarrow x = ${p}$`, `$${k === 1 ? poly([1, 'x'], [-q, '']) : poly([k, 'x'], [-q * k, ''])} = 0 \\Rightarrow x = ${q}$`], { unordered: true, hint: 'Set each bracket equal to zero.' })
  }
  const expr = poly([1, 'x^2'], [-(p + q), 'x'], [p * q, ''])
  return multi(`Solve ${$(`${expr} = 0`)}`, [
    { label: 'x₁', ans: p },
    { label: 'x₂', ans: q },
  ], [`Factorise: two numbers that multiply to $${p * q}$ and add to $${-(p + q)}$ are $${-p}$ and $${-q}$.`, `$${fac(-p)}${fac(-q)} = 0$`, `Null Factor Law: $x = ${p}$ or $x = ${q}$`], { unordered: true, hint: 'Factorise first, then set each bracket to zero.' })
}

export const quadFormula: Gen = () => {
  let a = ri(1, 3)
  let b = nz(-9, 9)
  let c = nz(-9, 9)
  let disc = b * b - 4 * a * c
  let tries = 0
  while ((disc <= 0 || Number.isInteger(Math.sqrt(disc))) && tries < 50) {
    a = ri(1, 3)
    b = nz(-9, 9)
    c = nz(-9, 9)
    disc = b * b - 4 * a * c
    tries++
  }
  const r1 = (-b + Math.sqrt(disc)) / (2 * a)
  const r2 = (-b - Math.sqrt(disc)) / (2 * a)
  return multi(`Use the quadratic formula to solve ${$(`${poly([a, 'x^2'], [b, 'x'], [c, ''])} = 0`)}. Give answers to 2 decimal places.`, [
    { label: 'x₁', ans: round(r1, 2) },
    { label: 'x₂', ans: round(r2, 2) },
  ], [`$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ with $a = ${a}, b = ${b}, c = ${c}$`, `$b^2 - 4ac = ${b * b} - ${4 * a * c < 0 ? `(${4 * a * c})` : 4 * a * c} = ${disc}$`, `$x = \\dfrac{${-b} \\pm \\sqrt{${disc}}}{${2 * a}}$`, `$x \\approx ${tx(round(r1, 2))}$ or $x \\approx ${tx(round(r2, 2))}$`], { unordered: true, tol: 0.011 })
}

// ---------- Parabolas ----------
export const turningPoint: Gen = (d) => {
  const h = nz(-6, 6)
  const k = nz(-8, 8)
  const a = d === 1 ? 1 : pick([1, -1, 2, -2, 3])
  const expr = `y = ${a === 1 ? '' : a === -1 ? '-' : a}(x${next(-h)})^2${next(k)}`
  if (d === 3 && Math.random() < 0.5) {
    const yInt = a * h * h + k
    return num(`Find the $y$-intercept of ${$(expr)}`, yInt, [`The y-intercept is where $x = 0$.`, `$y = ${a === 1 ? '' : a === -1 ? '-' : a}(0${next(-h)})^2${next(k)} = ${a === 1 ? '' : a + ' \\times '}${h * h}${next(k)} = ${yInt}$`])
  }
  if (d >= 2 && Math.random() < 0.35) return mcq(`Which way does ${$(expr)} open?`, a > 0 ? 'Upwards (∪, minimum turning point)' : 'Downwards (∩, maximum turning point)', [a > 0 ? 'Downwards (∩, maximum turning point)' : 'Upwards (∪, minimum turning point)'], [`Look at the sign of $a$ (the number in front of the bracket): $a = ${a}$.`, a > 0 ? 'Positive $a$ → opens upwards.' : 'Negative $a$ → opens downwards (flipped).'])
  return multi(`What is the turning point of ${$(expr)}?`, [
    { label: 'x', ans: h },
    { label: 'y', ans: k },
  ], [`Turning point form: $y = a(x - h)^2 + k$ has turning point $(h, k)$.`, `Here $(x${next(-h)})$ means $h = ${h}$ — watch the sign flip!`, `Turning point: $(${h}, ${k})$`], { hint: 'The x-coordinate has the opposite sign to the number in the bracket.', fig: { type: 'graph', parabola: { a, h, k } } })
}

export const xIntercepts: Gen = () => {
  const p = nz(-6, 6)
  let q = nz(-6, 6)
  if (q === p) q = -p
  return multi(`Find the $x$-intercepts of ${$(`y = ${fac(-p)}${fac(-q)}`)}`, [
    { label: 'x₁', ans: p },
    { label: 'x₂', ans: q },
  ], [`x-intercepts are where $y = 0$: $${fac(-p)}${fac(-q)} = 0$.`, `Null Factor Law: $x = ${p}$ or $x = ${q}$.`], { unordered: true, fig: { type: 'graph', parabola: { a: 1, h: (p + q) / 2, k: -(((p - q) / 2) ** 2) } } })
}

// ---------- Simultaneous equations ----------
export const simulSub: Gen = (d) => {
  const x = nz(-5, 6)
  const y = nz(-5, 6)
  if (d === 1) {
    const s = x + y
    const df = x - y
    return multi(`Solve simultaneously: ${$(`x + y = ${s}`)} and ${$(`x - y = ${df}`)}`, [
      { label: 'x', ans: x },
      { label: 'y', ans: y },
    ], [`Add the equations (the $y$’s cancel): $2x = ${s + df}$, so $x = ${x}$.`, `Substitute: $${x} + y = ${s}$, so $y = ${y}$.`, `Check in the second equation: $${x} - ${y < 0 ? `(${y})` : y} = ${df}$ ✓`], { hint: 'Add the two equations to eliminate y.' })
  }
  const m = nz(-3, 3)
  const c = y - m * x
  const a = ri(1, 4)
  let b = nz(-3, 3)
  while (a + b * m === 0) b = nz(-3, 3)
  const rhs = a * x + b * y
  return multi(`Solve simultaneously: ${$(`y = ${poly([m, 'x'], [c, ''])}`)} and ${$(`${poly([a, 'x'], [b, 'y'])} = ${rhs}`)}`, [
    { label: 'x', ans: x },
    { label: 'y', ans: y },
  ], [`Substitute $y = ${poly([m, 'x'], [c, ''])}$ into the second equation.`, `$${lead(a)}${next(b)}(${poly([m, 'x'], [c, ''])}) = ${rhs}$`, `$${poly([a + b * m, 'x'], [b * c, ''])} = ${rhs}$, so $x = ${x}$.`, `Then $y = ${m} \\times ${x < 0 ? `(${x})` : x}${next(c)} = ${y}$.`], { hint: 'Substitute the first equation into the second.' })
}

export const simulWord: Gen = () => {
  const adult = pick([12, 15, 18, 20])
  const child = pick([6, 8, 9, 10])
  const A = ri(2, 9)
  const Cn = ri(2, 9)
  const total = A + Cn
  const cost = A * adult + Cn * child
  return multi(`At the movies, adult tickets cost \\$${adult} and child tickets cost \\$${child}. A group of ${total} people paid \\$${cost}. How many adults and children were there?`, [
    { label: 'adults', ans: A },
    { label: 'children', ans: Cn },
  ], [`Let $a$ = adults, $c$ = children: $a + c = ${total}$ and $${adult}a + ${child}c = ${cost}$.`, `From the first: $c = ${total} - a$. Substitute: $${adult}a + ${child}(${total} - a) = ${cost}$`, `$${adult - child}a = ${cost - child * total}$, so $a = ${A}$ and $c = ${Cn}$.`])
}

// ---------- Inequalities ----------
const ineqSym = ['<', '>', '\\le', '\\ge'] as const
const flip = (s: string) => ({ '<': '>', '>': '<', '\\le': '\\ge', '\\ge': '\\le' })[s]!

export const solveIneq: Gen = (d) => {
  const x = nz(-6, 6)
  const sym = pick(ineqSym)
  const neg = d >= 2 && Math.random() < 0.6
  const a = neg ? -ri(2, 5) : ri(2, 6)
  const b = nz(-9, 9)
  const c = a * x + b
  const ans = neg ? flip(sym) : sym
  return mcq(`Solve ${$(`${poly([a, 'x'], [b, ''])} ${sym} ${c}`)}`, $(`x ${ans} ${x}`), [$(`x ${neg ? sym : flip(sym)} ${x}`), $(`x ${ans} ${-x || 1}`), $(`x ${ans} ${round((c + b) / a, 2)}`)], [`${b < 0 ? `Add ${-b}` : `Subtract ${b}`} on both sides: $${lead(a)} ${sym} ${c - b}$`, `Divide by $${a}$${neg ? ' — a **negative**, so flip the sign!' : ''}`, `$x ${ans} ${x}$`], neg ? 'Dividing by a negative flips the inequality sign.' : 'Solve it just like an equation.')
}

export const countIntegers: Gen = () => {
  const lo = ri(-6, 2)
  const hi = lo + ri(2, 7)
  const incLo = Math.random() < 0.5
  const incHi = Math.random() < 0.5
  const count = hi - lo - 1 + (incLo ? 1 : 0) + (incHi ? 1 : 0)
  const list = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((n) => (n > lo || incLo) && (n < hi || incHi))
  return num(`How many integers satisfy ${$(`${lo} ${incLo ? '\\le' : '<'} x ${incHi ? '\\le' : '<'} ${hi}`)}?`, count, [`${incLo ? `$${lo}$ is included` : `$${lo}$ is NOT included`} (${incLo ? '≤' : '<'}), ${incHi ? `$${hi}$ is included` : `$${hi}$ is NOT included`}.`, `The integers are: ${list.join(', ')}`, `That’s ${count} integers.`])
}
