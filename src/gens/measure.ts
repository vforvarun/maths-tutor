import { mcq, num, type Gen } from '../lib/problem'
import { ri, pick, round, tx, PYTH, rad, deg } from '../lib/num'

const dp1 = (n: number) => tx(round(n, 1), 1)

// ---------- Pythagoras ----------
export const pythHyp: Gen = (d) => {
  let a: number, b: number
  if (d === 1) {
    const [x, y] = pick(PYTH)
    a = x
    b = y
  } else {
    a = ri(2, 15)
    b = ri(2, 15)
  }
  const c = Math.sqrt(a * a + b * b)
  const exact = Number.isInteger(c)
  return num(`Find the length of the hypotenuse $c$${exact ? '' : ' (to 1 decimal place)'}.`, round(c, 1), [`$c^2 = a^2 + b^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}$`, `$c = \\sqrt{${a * a + b * b}} ${exact ? '=' : '\\approx'} ${dp1(c)}$ cm`], { tol: 0.06, unit: 'cm', hint: 'Square the two shorter sides, add, then square root.', fig: { type: 'tri', opp: `${a} cm`, adj: `${b} cm`, hyp: 'c', highlight: 'hyp' } })
}

export const pythShort: Gen = (d) => {
  let a: number, c: number
  if (d === 1) {
    const [x, , z] = pick(PYTH)
    a = x
    c = z
  } else {
    c = ri(8, 25)
    a = ri(2, c - 2)
  }
  const b = Math.sqrt(c * c - a * a)
  const exact = Number.isInteger(b)
  return num(`Find the length of the shorter side $b$${exact ? '' : ' (to 1 decimal place)'}.`, round(b, 1), [`$b^2 = c^2 - a^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${c * c - a * a}$`, `$b = \\sqrt{${c * c - a * a}} ${exact ? '=' : '\\approx'} ${dp1(b)}$ m`], { tol: 0.06, unit: 'm', hint: 'Finding a shorter side? Subtract, then square root.', fig: { type: 'tri', opp: `${a} m`, adj: 'b', hyp: `${c} m`, highlight: 'adj' } })
}

export const pythWord: Gen = (d) => {
  if (d === 3 || Math.random() < 0.3) {
    const [x, y, z] = pick(PYTH)
    const k = ri(1, 3)
    const right = Math.random() < 0.5
    const zz = right ? z * k : z * k + 1
    return mcq(`A triangle has sides ${x * k} cm, ${y * k} cm and ${zz} cm. Is it right-angled?`, right ? 'Yes' : 'No', [right ? 'No' : 'Yes'], [`Test $a^2 + b^2 = c^2$ with the longest side as $c$.`, `$${x * k}^2 + ${y * k}^2 = ${(x * k) ** 2 + (y * k) ** 2}$ and $${zz}^2 = ${zz * zz}$`, right ? 'They are equal, so it is right-angled.' : 'They are not equal, so it is NOT right-angled.'])
  }
  const L = ri(4, 9)
  const base = round(ri(10, 25) / 10, 1)
  const h = Math.sqrt(L * L - base * base)
  return num(`A ${L} m ladder leans against a wall. Its foot is ${base} m from the wall. How high up the wall does it reach? (1 decimal place)`, round(h, 1), [`The ladder is the hypotenuse: $h^2 = ${L}^2 - ${base}^2 = ${L * L} - ${round(base * base, 2)} = ${round(L * L - base * base, 2)}$`, `$h \\approx ${dp1(h)}$ m`], { tol: 0.06, unit: 'm', hint: 'Draw it! The ladder is the longest side.' })
}

// ---------- Trigonometry ----------
export const trigLabel: Gen = () => {
  const which = pick(['opp', 'adj', 'hyp'] as const)
  const name = { opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse' }[which]
  return mcq(`In the triangle, which side is the **${name}** relative to angle $\\theta$?`, { opp: 'p', adj: 'q', hyp: 'r' }[which], ['p', 'q', 'r'], [`The hypotenuse (r) is opposite the right angle — the longest side.`, `The opposite side (p) is across from $\\theta$.`, `The adjacent side (q) is next to $\\theta$ and isn’t the hypotenuse.`], undefined, { type: 'tri', opp: 'p', adj: 'q', hyp: 'r', angle: 'θ' })
}

export const trigWhich: Gen = () => {
  const cases = [
    { know: 'opposite and hypotenuse', r: 'sin' },
    { know: 'adjacent and hypotenuse', r: 'cos' },
    { know: 'opposite and adjacent', r: 'tan' },
  ]
  const c = pick(cases)
  return mcq(`You know the angle, and need to link the **${c.know}**. Which ratio should you use?`, c.r, ['sin', 'cos', 'tan'], [`SOH: sin = O/H · CAH: cos = A/H · TOA: tan = O/A`, `${c.know} → ${c.r}`])
}

export const trigSide: Gen = (d) => {
  const theta = ri(20, 70)
  const known = ri(5, 30)
  const type = d === 1 ? 'opp-hyp' : pick(['opp-hyp', 'adj-hyp', 'opp-adj', 'hyp-from-opp'])
  const t = rad(theta)
  if (type === 'opp-hyp') {
    const x = known * Math.sin(t)
    return num(`Find $x$ (1 decimal place).`, round(x, 1), [`We have the hypotenuse and want the opposite → SOH.`, `$\\sin ${theta}° = \\dfrac{x}{${known}}$`, `$x = ${known} \\sin ${theta}° \\approx ${dp1(x)}$`], { tol: 0.06, hint: 'Label O, A, H first. Use a calculator in degrees mode.', fig: { type: 'tri', opp: 'x', hyp: String(known), angle: `${theta}°`, highlight: 'opp' } })
  }
  if (type === 'adj-hyp') {
    const x = known * Math.cos(t)
    return num(`Find $x$ (1 decimal place).`, round(x, 1), [`We have the hypotenuse and want the adjacent → CAH.`, `$\\cos ${theta}° = \\dfrac{x}{${known}}$`, `$x = ${known} \\cos ${theta}° \\approx ${dp1(x)}$`], { tol: 0.06, fig: { type: 'tri', adj: 'x', hyp: String(known), angle: `${theta}°`, highlight: 'adj' } })
  }
  if (type === 'opp-adj') {
    const x = known * Math.tan(t)
    return num(`Find $x$ (1 decimal place).`, round(x, 1), [`We have the adjacent and want the opposite → TOA.`, `$\\tan ${theta}° = \\dfrac{x}{${known}}$`, `$x = ${known} \\tan ${theta}° \\approx ${dp1(x)}$`], { tol: 0.06, fig: { type: 'tri', opp: 'x', adj: String(known), angle: `${theta}°`, highlight: 'opp' } })
  }
  const x = known / Math.sin(t)
  return num(`Find the hypotenuse $x$ (1 decimal place).`, round(x, 1), [`We have the opposite and want the hypotenuse → SOH.`, `$\\sin ${theta}° = \\dfrac{${known}}{x}$`, `$x = \\dfrac{${known}}{\\sin ${theta}°} \\approx ${dp1(x)}$`], { tol: 0.06, hint: 'When x is on the bottom, it ends up dividing.', fig: { type: 'tri', opp: String(known), hyp: 'x', angle: `${theta}°`, highlight: 'hyp' } })
}

export const trigAngle: Gen = () => {
  const o = ri(3, 15)
  const a = ri(3, 15)
  const h = ri(Math.max(o, a) + 1, 25)
  const type = pick(['tan', 'sin', 'cos'] as const)
  if (type === 'tan') {
    const th = deg(Math.atan(o / a))
    return num(`Find angle $\\theta$ to 1 decimal place.`, round(th, 1), [`Opposite and adjacent → TOA.`, `$\\tan \\theta = \\dfrac{${o}}{${a}}$`, `$\\theta = \\tan^{-1}\\left(\\dfrac{${o}}{${a}}\\right) \\approx ${dp1(th)}°$`], { tol: 0.06, unit: '°', hint: 'Use the inverse function (shift + tan).', fig: { type: 'tri', opp: String(o), adj: String(a), angle: 'θ' } })
  }
  if (type === 'sin') {
    const th = deg(Math.asin(o / h))
    return num(`Find angle $\\theta$ to 1 decimal place.`, round(th, 1), [`Opposite and hypotenuse → SOH.`, `$\\theta = \\sin^{-1}\\left(\\dfrac{${o}}{${h}}\\right) \\approx ${dp1(th)}°$`], { tol: 0.06, unit: '°', fig: { type: 'tri', opp: String(o), hyp: String(h), angle: 'θ' } })
  }
  const th = deg(Math.acos(a / h))
  return num(`Find angle $\\theta$ to 1 decimal place.`, round(th, 1), [`Adjacent and hypotenuse → CAH.`, `$\\theta = \\cos^{-1}\\left(\\dfrac{${a}}{${h}}\\right) \\approx ${dp1(th)}°$`], { tol: 0.06, unit: '°', fig: { type: 'tri', adj: String(a), hyp: String(h), angle: 'θ' } })
}

// ---------- Elevation / depression / bearings ----------
export const elevationG: Gen = (d) => {
  const theta = ri(15, 65)
  const dist = ri(10, 80)
  if (d === 1 || Math.random() < 0.5) {
    const h = dist * Math.tan(rad(theta))
    return num(`From a point ${dist} m from the base of a tower, the angle of elevation to the top is ${theta}°. How tall is the tower? (1 decimal place)`, round(h, 1), [`Draw a right-angled triangle: adjacent = ${dist} m, opposite = height $h$.`, `$\\tan ${theta}° = \\dfrac{h}{${dist}}$`, `$h = ${dist} \\tan ${theta}° \\approx ${dp1(h)}$ m`], { tol: 0.06, unit: 'm', hint: 'Elevation is measured up from the horizontal.' })
  }
  const cliff = ri(20, 120)
  const x = cliff / Math.tan(rad(theta))
  return num(`From the top of a ${cliff} m cliff, the angle of depression to a boat is ${theta}°. How far is the boat from the base of the cliff? (1 decimal place)`, round(x, 1), [`Angle of depression = angle of elevation from the boat = ${theta}°.`, `$\\tan ${theta}° = \\dfrac{${cliff}}{x}$`, `$x = \\dfrac{${cliff}}{\\tan ${theta}°} \\approx ${dp1(x)}$ m`], { tol: 0.06, unit: 'm' })
}

export const bearingG: Gen = () => {
  const b = ri(1, 35) * 10
  const back = (b + 180) % 360
  return num(`Sam walks on a bearing of ${String(b).padStart(3, '0')}°. What bearing must Sam walk to return to the start?`, back, [`The return (back) bearing differs by 180°.`, b < 180 ? `${b}° + 180° = ${back}°` : `${b}° − 180° = ${back}°`], { unit: '°', hint: 'Add 180° if less than 180°, otherwise subtract.' })
}

// ---------- Trigonometry in any triangle (sine, cosine & area rules) ----------
const sinD = (d: number) => Math.sin(rad(d))
const cosD = (d: number) => Math.cos(rad(d))
/** angle (degrees) opposite side z, from three sides */
const angleFrom = (x: number, y: number, z: number) => deg(Math.acos((x * x + y * y - z * z) / (2 * x * y)))

export const sineSide: Gen = (d) => {
  const A = ri(30, 100)
  const B = ri(25, Math.min(110, 155 - A))
  const C = 180 - A - B
  const a = ri(6, 25)
  const x = (a * sinD(B)) / sinD(A)
  if (d === 3) {
    // given A and C: find B first
    return num(`In triangle $ABC$, $A = ${A}°$, $C = ${C}°$ and $a = ${a}$ cm. Find side $b$ (1 decimal place).`, round(x, 1), [`Side $b$ is opposite angle $B$, so find $B$ first: $B = 180° - ${A}° - ${C}° = ${B}°$`, `Matching pair: $a$ and $A$ → sine rule: $\\dfrac{b}{\\sin ${B}°} = \\dfrac{${a}}{\\sin ${A}°}$`, `$b = \\dfrac{${a} \\sin ${B}°}{\\sin ${A}°} \\approx ${dp1(x)}$ cm`], { tol: 0.06, unit: 'cm', hint: 'Angles in a triangle add to 180°. Which angle is opposite b?', fig: { type: 'gtri', angles: [A, B, C], labels: { A: `${A}°`, C: `${C}°`, a: `${a} cm`, b: 'b' }, highlight: 'b' } })
  }
  return num(`Find side $x$ (1 decimal place).`, round(x, 1), [`Side ${a} cm is opposite ${A}°, a **matching pair** → sine rule.`, `$\\dfrac{x}{\\sin ${B}°} = \\dfrac{${a}}{\\sin ${A}°}$`, `$x = \\dfrac{${a} \\sin ${B}°}{\\sin ${A}°} \\approx ${dp1(x)}$ cm`], { tol: 0.06, unit: 'cm', hint: 'Find a side and the angle opposite it — that’s your matching pair.', fig: { type: 'gtri', angles: [A, B, C], labels: { A: `${A}°`, B: `${B}°`, a: `${a} cm`, b: 'x' }, highlight: 'b' } })
}

export const sineAngle: Gen = (d) => {
  const A = d === 1 ? ri(50, 90) : ri(35, 120)
  const a = ri(9, 22)
  const b = ri(Math.max(4, Math.ceil(a * 0.45)), a - 1) // b < a → B is acute, no ambiguity
  const s = (b * sinD(A)) / a
  const B = deg(Math.asin(s))
  return num(`Find angle $\\theta$ (1 decimal place).`, round(B, 1), [`${a} is opposite ${A}° (matching pair), and ${b} is opposite $\\theta$ → sine rule, flipped to find an angle.`, `$\\dfrac{\\sin\\theta}{${b}} = \\dfrac{\\sin ${A}°}{${a}}$`, `$\\sin\\theta = \\dfrac{${b} \\sin ${A}°}{${a}} \\approx ${tx(s, 4)}$`, `$\\theta = \\sin^{-1}(${tx(s, 4)}) \\approx ${dp1(B)}°$`, `Check: ${b} < ${a}, so $\\theta$ must be smaller than ${A}° — it’s acute, so there’s only one answer.`], { tol: 0.06, unit: '°', hint: 'Put the sines on top when you are finding an angle.', fig: { type: 'gtri', angles: [A, B, 180 - A - B], labels: { A: `${A}°`, B: 'θ', a: String(a), b: String(b) }, highlight: 'B' } })
}

export const cosineSide: Gen = (d) => {
  const A = d === 1 ? ri(40, 80) : d === 2 ? ri(30, 120) : ri(95, 140)
  const b = ri(5, 20)
  const c = ri(5, 20)
  const a2 = b * b + c * c - 2 * b * c * cosD(A)
  const a = Math.sqrt(a2)
  const B = angleFrom(a, c, b)
  return num(`Find side $x$ (1 decimal place).`, round(a, 1), [
    `Two sides and the angle **between** them (no matching pair) → cosine rule.`,
    `$x^2 = ${b}^2 + ${c}^2 - 2 \\times ${b} \\times ${c} \\times \\cos ${A}°$`,
    `$x^2 = ${b * b + c * c} - ${2 * b * c} \\cos ${A}° \\approx ${tx(a2, 2)}$${A > 90 ? ` (cos of an obtuse angle is negative, so this ends up *adding*)` : ''}`,
    `$x = \\sqrt{${tx(a2, 2)}} \\approx ${dp1(a)}$ m`,
  ], { tol: 0.06, unit: 'm', hint: 'Type it in one go: b² + c² − 2bc·cos A, then square-root.', fig: { type: 'gtri', angles: [A, B, 180 - A - B], labels: { A: `${A}°`, b: `${b} m`, c: `${c} m`, a: 'x' }, highlight: 'a' } })
}

export const cosineAngle: Gen = (d) => {
  const a = ri(5, 15)
  const b = ri(5, 15)
  // d3: the third side is the longest, so θ may be obtuse
  const c = d === 3 ? ri(Math.max(a, b) + 1, a + b - 2) : ri(Math.abs(a - b) + 2, a + b - 2)
  const nm = a * a + b * b - c * c
  const dn = 2 * a * b
  const C = deg(Math.acos(nm / dn))
  const A = angleFrom(b, c, a)
  return num(`${d === 3 ? 'Find the largest angle, $\\theta$' : 'Find angle $\\theta$'} (1 decimal place).`, round(C, 1), [
    ...(d === 3 ? [`The largest angle is opposite the longest side (${c}).`] : []),
    `All three sides, no angles → cosine rule, rearranged for the angle.`,
    `$\\cos\\theta = \\dfrac{${a}^2 + ${b}^2 - ${c}^2}{2 \\times ${a} \\times ${b}} = \\dfrac{${nm}}{${dn}}$`,
    `$\\theta = \\cos^{-1}\\left(\\dfrac{${nm}}{${dn}}\\right) \\approx ${dp1(C)}°$${nm < 0 ? ' — the cosine is negative, so the angle is obtuse.' : ''}`,
  ], { tol: 0.06, unit: '°', hint: 'The side opposite θ is the one you subtract.', fig: { type: 'gtri', angles: [A, 180 - A - C, C], labels: { a: String(a), b: String(b), c: String(c), C: 'θ' }, highlight: 'C' } })
}

export const areaRule: Gen = (d) => {
  const a = ri(4, 20)
  const b = ri(4, 20)
  const C = d === 1 ? pick([30, 45, 60, 90, 150]) : ri(25, 150)
  const area = 0.5 * a * b * sinD(C)
  const c = Math.sqrt(a * a + b * b - 2 * a * b * cosD(C))
  const A = angleFrom(b, c, a)
  if (d === 3 && C < 90) {
    const ar = round(area, 1)
    const s = (2 * ar) / (a * b)
    const th = deg(Math.asin(s))
    return num(`A triangle has sides ${a} cm and ${b} cm with an acute angle $\\theta$ between them. Its area is ${tx(ar, 1)} cm². Find $\\theta$ (1 decimal place).`, round(th, 1), [`Area rule: $${tx(ar, 1)} = \\tfrac12 \\times ${a} \\times ${b} \\times \\sin\\theta$`, `$\\sin\\theta = \\dfrac{2 \\times ${tx(ar, 1)}}{${a} \\times ${b}} \\approx ${tx(s, 4)}$`, `$\\theta = \\sin^{-1}(${tx(s, 4)}) \\approx ${dp1(th)}°$`], { tol: 0.11, unit: '°', hint: 'Substitute into Area = ½ab sin C, then solve for sin θ.', fig: { type: 'gtri', angles: [A, 180 - A - C, C], labels: { a: `${a} cm`, b: `${b} cm`, C: 'θ' }, highlight: 'C' } })
  }
  return num(`Find the area of the triangle (1 decimal place).`, round(area, 1), [`Two sides and the angle **between** them → area rule.`, `$\\text{Area} = \\tfrac12 ab\\sin C = \\tfrac12 \\times ${a} \\times ${b} \\times \\sin ${C}°$`, `$\\approx ${dp1(area)}$ cm²`], { tol: 0.06, unit: 'cm²', hint: 'Area = ½ × side × side × sin(angle between them).', fig: { type: 'gtri', angles: [A, 180 - A - C, C], labels: { a: `${a} cm`, b: `${b} cm`, C: `${C}°` } } })
}

export const whichRule: Gen = () => {
  const SR = 'Sine rule'
  const CR = 'Cosine rule'
  const AR = 'Area rule'
  const RT = 'SOH CAH TOA'
  const A = ri(35, 80)
  const B = ri(35, Math.min(95, 150 - A))
  const ang: [number, number, number] = [A, B, 180 - A - B]
  const sB = deg(Math.asin((7 * sinD(A)) / 9))
  const sss: [number, number, number] = [angleFrom(7, 9, 5), angleFrom(5, 9, 7), angleFrom(5, 7, 9)]
  const cases = [
    { q: 'Find side $x$.', r: SR, why: 'We know 8 and the angle opposite it — a matching pair. So use the sine rule.', labels: { A: `${A}°`, B: `${B}°`, a: '8', b: 'x' } },
    { q: 'Find angle $\\theta$.', r: SR, why: 'We know 9 and its opposite angle — a matching pair — and the side opposite θ. Sine rule.', labels: { A: `${A}°`, a: '9', b: '7', B: 'θ' }, ang: [A, sB, 180 - A - sB] as [number, number, number] },
    { q: 'Find side $x$.', r: CR, why: 'Two sides and the angle between them, with no matching pair → cosine rule.', labels: { A: `${A}°`, b: '6', c: '9', a: 'x' } },
    { q: 'Find angle $\\theta$.', r: CR, why: 'All three sides and no angles → cosine rule.', labels: { a: '5', b: '7', c: '9', C: 'θ' }, ang: sss },
    { q: 'Find the area of the triangle.', r: AR, why: 'Two sides and the angle between them, and we want the area → Area = ½ab sin C.', labels: { a: '6', b: '10', C: `${ang[2]}°` } },
  ]
  if (Math.random() < 0.15) return mcq('A triangle has a **right angle**, one known side and one known angle. Which is the quickest tool to find another side?', RT, [SR, CR, AR], ['With a right angle, SOH CAH TOA is the simplest. (The sine and cosine rules still work, but take longer.)'])
  const c = pick(cases)
  return mcq(`${c.q} Which rule should you use?`, c.r, [SR, CR, AR, RT], [c.why, 'Matching pair → sine rule · no matching pair → cosine rule · area → area rule.'], 'Look for a side and the angle directly opposite it.', { type: 'gtri', angles: ('ang' in c && c.ang) || ang, labels: { ...c.labels } })
}

// ---------- Surface area ----------
export const saPrism: Gen = (d) => {
  const l = ri(2, 12)
  const w = ri(2, 10)
  const h = ri(2, 9)
  if (d <= 2) {
    const sa = 2 * (l * w + l * h + w * h)
    return num(`Find the surface area of a rectangular prism ${l} cm × ${w} cm × ${h} cm.`, sa, [`There are 3 pairs of rectangles: $2(lw + lh + wh)$`, `$2(${l * w} + ${l * h} + ${w * h}) = 2 \\times ${l * w + l * h + w * h} = ${sa}$ cm²`], { unit: 'cm²', hint: 'Top & bottom, front & back, two ends.' })
  }
  const [a, b, c] = pick(PYTH.slice(0, 3))
  const L = ri(5, 15)
  const sa = a * b + (a + b + c) * L
  return num(`A triangular prism has a right-angled triangle cross-section with sides ${a}, ${b} and ${c} cm, and length ${L} cm. Find its surface area.`, sa, [`Two triangles: $2 \\times \\tfrac12 \\times ${a} \\times ${b} = ${a * b}$ cm²`, `Three rectangles: $(${a} + ${b} + ${c}) \\times ${L} = ${(a + b + c) * L}$ cm²`, `Total: $${sa}$ cm²`], { unit: 'cm²' })
}

export const saCylinder: Gen = (d) => {
  const r = ri(2, 10)
  const h = ri(3, 20)
  const open = d === 3 && Math.random() < 0.5
  const sa = (open ? 1 : 2) * Math.PI * r * r + 2 * Math.PI * r * h
  return num(`Find the surface area of a${open ? 'n open-topped' : ' closed'} cylinder with radius ${r} cm and height ${h} cm (1 decimal place).`, round(sa, 1), [`${open ? 'One circle (no lid)' : 'Two circles'}: $${open ? '' : '2 \\times '}\\pi \\times ${r}^2 = ${dp1((open ? 1 : 2) * Math.PI * r * r)}$`, `Curved surface (the label): $2\\pi r h = 2\\pi \\times ${r} \\times ${h} = ${dp1(2 * Math.PI * r * h)}$`, `Total $\\approx ${dp1(sa)}$ cm²`], { tol: 0.15, unit: 'cm²', hint: 'Circles plus the rectangle label (2πr × h).' })
}

// ---------- Volume ----------
export const volPrism: Gen = (d) => {
  if (d === 1) {
    const l = ri(2, 12)
    const w = ri(2, 10)
    const h = ri(2, 10)
    return num(`Find the volume of a rectangular prism ${l} cm × ${w} cm × ${h} cm.`, l * w * h, [`$V = l \\times w \\times h = ${l} \\times ${w} \\times ${h} = ${l * w * h}$ cm³`], { unit: 'cm³' })
  }
  if (d === 2) {
    const b = ri(2, 12)
    const h = ri(2, 10)
    const L = ri(3, 15)
    const V = 0.5 * b * h * L
    return num(`A triangular prism has a triangle cross-section with base ${b} cm and height ${h} cm. The prism is ${L} cm long. Find its volume.`, V, [`Cross-section area: $A = \\tfrac12 \\times ${b} \\times ${h} = ${tx(0.5 * b * h)}$ cm²`, `$V = A \\times L = ${tx(0.5 * b * h)} \\times ${L} = ${tx(V)}$ cm³`], { unit: 'cm³' })
  }
  const l = ri(10, 40)
  const w = ri(10, 30)
  const h = ri(10, 30)
  const L = (l * w * h) / 1000
  return num(`A fish tank is ${l} cm × ${w} cm × ${h} cm. How many litres does it hold? (1 L = 1000 cm³)`, L, [`$V = ${l} \\times ${w} \\times ${h} = ${l * w * h}$ cm³`, `$${l * w * h} \\div 1000 = ${tx(L, 3)}$ L`], { tol: 0.01, unit: 'L' })
}

export const volCylinder: Gen = () => {
  const r = ri(2, 12)
  const h = ri(3, 25)
  const V = Math.PI * r * r * h
  return num(`Find the volume of a cylinder with radius ${r} cm and height ${h} cm (1 decimal place).`, round(V, 1), [`$V = \\pi r^2 h = \\pi \\times ${r}^2 \\times ${h}$`, `$V \\approx ${dp1(V)}$ cm³`], { tol: 0.15, unit: 'cm³', hint: 'Area of the circle × height.' })
}

// ---------- Cones, pyramids, spheres ----------
export const volCone: Gen = (d) => {
  const kind = d === 1 ? 'pyramid' : pick(['cone', 'sphere', 'pyramid'])
  if (kind === 'pyramid') {
    const s = ri(3, 12)
    const h = ri(4, 15)
    const V = (s * s * h) / 3
    return num(`Find the volume of a square-based pyramid with base ${s} m × ${s} m and height ${h} m (1 decimal place).`, round(V, 1), [`$V = \\tfrac13 \\times \\text{base area} \\times h$`, `$V = \\tfrac13 \\times ${s * s} \\times ${h} \\approx ${dp1(V)}$ m³`], { tol: 0.06, unit: 'm³' })
  }
  if (kind === 'cone') {
    const r = ri(2, 10)
    const h = ri(3, 18)
    const V = (Math.PI * r * r * h) / 3
    return num(`Find the volume of a cone with radius ${r} cm and height ${h} cm (1 decimal place).`, round(V, 1), [`$V = \\tfrac13 \\pi r^2 h = \\tfrac13 \\times \\pi \\times ${r}^2 \\times ${h}$`, `$V \\approx ${dp1(V)}$ cm³`], { tol: 0.15, unit: 'cm³', hint: 'A cone is one third of a cylinder.' })
  }
  const r = ri(2, 12)
  const V = (4 / 3) * Math.PI * r ** 3
  return num(`Find the volume of a sphere with radius ${r} cm (1 decimal place).`, round(V, 1), [`$V = \\tfrac43 \\pi r^3 = \\tfrac43 \\times \\pi \\times ${r}^3$`, `$V \\approx ${dp1(V)}$ cm³`], { tol: 0.2, unit: 'cm³' })
}

// ---------- Similarity ----------
export const similarSide: Gen = (d) => {
  const k = d === 1 ? ri(2, 4) : pick([1.5, 2.5, 3, 4])
  const a = ri(2, 10) * 2
  const b = ri(2, 10) * 2
  return num(`Two triangles are similar. A side of ${a} cm in the small triangle matches ${a * k} cm in the large triangle. Another side in the small triangle is ${b} cm. Find the matching side in the large triangle.`, b * k, [`Scale factor $k = \\dfrac{${tx(a * k)}}{${a}} = ${tx(k)}$`, `Matching side $= ${b} \\times ${tx(k)} = ${tx(b * k)}$ cm`], { unit: 'cm', hint: 'Find the scale factor: big ÷ small.' })
}

export const similarArea: Gen = () => {
  const k = ri(2, 5)
  const A = ri(3, 20)
  return num(`A shape with area ${A} cm² is enlarged by a scale factor of ${k}. What is the new area?`, A * k * k, [`Areas scale by $k^2 = ${k}^2 = ${k * k}$.`, `New area $= ${A} \\times ${k * k} = ${A * k * k}$ cm²`], { unit: 'cm²', hint: 'Area grows by the scale factor SQUARED.' })
}

export const shadowG: Gen = () => {
  const person = pick([1.5, 1.6, 1.8, 2])
  const shadow = pick([1, 1.2, 2, 2.5])
  const treeShadow = ri(4, 20)
  const tree = (person / shadow) * treeShadow
  return num(`A ${person} m tall person casts a ${shadow} m shadow. At the same time, a tree casts a ${treeShadow} m shadow. How tall is the tree? (1 decimal place)`, round(tree, 1), [`The sun makes similar triangles. Scale factor $= \\dfrac{${treeShadow}}{${shadow}} = ${tx(treeShadow / shadow)}$`, `Tree height $= ${person} \\times ${tx(treeShadow / shadow)} \\approx ${dp1(tree)}$ m`], { tol: 0.06, unit: 'm' })
}
