import { motion } from 'motion/react'
import type { SceneDef } from '.'
import { C, T, Show, Box, Line, Pill } from './kit'

// ---------- Index laws ----------
function Twos({ step }: { step: number }) {
  // positions of 6 "2" coins per step
  type P = { x: number; y: number; c: string; o: number; cross?: boolean }
  const row = (n: number, y: number, start = 320, gap = 64) => Array.from({ length: n }, (_, i) => start - ((n - 1) * gap) / 2 + i * gap).map((x) => ({ x, y }))
  let coins: P[] = []
  if (step === 0) coins = row(3, 170).map((p) => ({ ...p, c: C.violet, o: 1 }))
  if (step === 1) {
    const a = row(3, 170, 210)
    const b = row(2, 170, 470)
    coins = [...a.map((p) => ({ ...p, c: C.violet, o: 1 })), ...b.map((p) => ({ ...p, c: C.coral, o: 1 }))]
  }
  if (step === 2) coins = row(5, 170).map((p, i) => ({ ...p, c: i < 3 ? C.violet : C.coral, o: 1 }))
  if (step === 3) {
    const top = row(5, 135)
    const bot = row(2, 235, 192)
    coins = [...top.map((p, i) => ({ ...p, c: C.violet, o: 1, cross: i < 2 })), ...bot.map((p) => ({ ...p, c: C.coral, o: 1, cross: true }))]
  }
  if (step === 4) {
    const g1 = row(3, 170, 190, 54)
    const g2 = row(3, 170, 450, 54)
    coins = [...g1, ...g2].map((p) => ({ ...p, c: C.mint, o: 1 }))
  }
  if (step >= 5) coins = row(3, 170).map((p) => ({ ...p, c: C.violet, o: 0 }))
  const all = Array.from({ length: 7 }, (_, i) => coins[i] ?? { x: 320, y: 170, c: C.violet, o: 0 })
  return (
    <g>
      {step === 3 && <line x1={150} y1={185} x2={490} y2={185} stroke={C.ink} strokeWidth={3} />}
      {step === 4 && (
        <>
          <rect x={95} y={130} width={190} height={80} rx={40} fill="none" stroke={C.mint} strokeWidth={3} strokeDasharray="6 6" />
          <rect x={355} y={130} width={190} height={80} rx={40} fill="none" stroke={C.mint} strokeWidth={3} strokeDasharray="6 6" />
        </>
      )}
      {all.map((p, i) => (
        <motion.g key={i} initial={false} animate={{ x: p.x, y: p.y, opacity: p.o }} transition={{ duration: 0.7, delay: i * 0.05 }}>
          <circle r={24} fill={p.c} />
          <text fontSize={24} fill="white" fontWeight={700} textAnchor="middle" dominantBaseline="central">
            2
          </text>
          {p.cross && step === 3 && <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 }} x1={-22} y1={22} x2={22} y2={-22} stroke={C.ink} strokeWidth={4} />}
        </motion.g>
      ))}
      <T x={320} y={70} size={34} show={step === 0}>2³ = 2 × 2 × 2 = 8</T>
      <T x={320} y={70} size={34} show={step === 1}>2³ × 2²</T>
      <T x={320} y={70} size={34} show={step === 2} color={C.violet}>2³ × 2² = 2³⁺² = 2⁵</T>
      <T x={560} y={185} size={34} show={step === 3} color={C.violet}>= 2³</T>
      <T x={320} y={290} size={22} show={step === 3} color={C.soft}>2⁵ ÷ 2² = 2⁵⁻² = 2³</T>
      <T x={320} y={70} size={34} show={step === 4} color={C.mint}>(2³)² = 2³ˣ² = 2⁶</T>
      <T x={320} y={150} size={44} show={step >= 5} color={C.violet}>2³ ÷ 2³ = 2⁰</T>
      <T x={320} y={220} size={44} show={step >= 5} color={C.coral}>…and 8 ÷ 8 = 1</T>
      <Pill x={320} y={300} text="Any number to the power 0 = 1" show={step >= 5} color={C.mint} />
    </g>
  )
}

export const indices: SceneDef = {
  id: 'indices',
  title: 'Index laws',
  steps: [
    'An index (or power) is a shortcut for repeated multiplication. $2^3$ means $2 \\times 2 \\times 2$ — three twos multiplied together.',
    'Now multiply $2^3 \\times 2^2$. Write out all the twos…',
    '…and you get five twos in a row! So $2^3 \\times 2^2 = 2^5$. When you multiply, **add the indices**.',
    'Dividing is the opposite. In $2^5 \\div 2^2$, pairs of twos cancel, leaving $2^3$. When you divide, **subtract the indices**.',
    'A power of a power, like $(2^3)^2$, means two groups of three twos — that’s six twos. **Multiply the indices**.',
    'And here’s a fun one: $2^3 \\div 2^3$ must equal 1, but the index law says it’s $2^0$. So any number to the power zero equals 1!',
  ],
  Comp: Twos,
}

// ---------- Scientific notation ----------
function Sci({ step }: { step: number }) {
  const big = step < 4
  const digits = big ? '150000000'.split('') : '000042'.split('')
  const gap = 46
  const x0 = 320 - ((digits.length - 1) * gap) / 2
  // decimal point position = index after which it sits
  const pos = big ? (step >= 2 ? 0 : 8) : step >= 4 ? 4 : 0
  const pointX = x0 + pos * gap + gap / 2
  const hops = big ? 8 : 4
  return (
    <g>
      <T x={320} y={60} size={24} color={C.soft} show={step === 0}>
        ☀️ Distance from Earth to the Sun ≈
      </T>
      <T x={320} y={60} size={24} color={C.soft} show={step === 1}>
        (number from 1 to 10) × 10ⁿ
      </T>
      <T x={320} y={60} size={24} color={C.coral} show={step === 2}>
        Count the hops: {hops} to the left ←
      </T>
      <T x={320} y={60} size={24} color={C.sky} show={step === 4}>
        Tiny: 0.00042 → hop 4 places right →
      </T>
      {digits.map((d, i) => (
        <motion.g key={(big ? 'b' : 's') + i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <rect x={x0 + i * gap - 20} y={130} width={40} height={56} rx={10} fill={big ? (i < 2 ? C.violetSoft : '#f3f1fb') : i >= 4 ? C.skySoft : '#f3f1fb'} />
          <text x={x0 + i * gap} y={160} fontSize={34} fontWeight={700} fill={big ? (i < 2 ? C.violet : C.soft) : i >= 4 ? C.sky : C.soft} textAnchor="middle" dominantBaseline="middle">
            {d}
          </text>
        </motion.g>
      ))}
      <motion.circle initial={false} animate={{ cx: pointX, cy: 186 }} transition={{ duration: 1.6, ease: 'easeInOut' }} r={7} fill={C.coral} />
      {step === 2 &&
        Array.from({ length: 8 }, (_, i) => (
          <motion.path key={i} d={`M${x0 + (8 - i) * gap + gap / 2} 200 Q ${x0 + (7.5 - i) * gap + gap / 2} 235 ${x0 + (7 - i) * gap + gap / 2} 200`} fill="none" stroke={C.coral} strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 * i }} />
        ))}
      {step === 4 &&
        Array.from({ length: 4 }, (_, i) => (
          <motion.path key={i} d={`M${x0 + i * gap + gap / 2} 200 Q ${x0 + (i + 0.5) * gap + gap / 2} 235 ${x0 + (i + 1) * gap + gap / 2} 200`} fill="none" stroke={C.sky} strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 * i }} />
        ))}
      <T x={320} y={280} size={26} show={step === 0}>150 000 000 km</T>
      <T x={320} y={285} size={40} color={C.violet} show={step === 3}>= 1.5 × 10⁸</T>
      <T x={320} y={285} size={40} color={C.sky} show={step === 4}>0.00042 = 4.2 × 10⁻⁴</T>
      <Pill x={320} y={330} text="Big → positive power · Tiny → negative power" show={step >= 3} color={C.mint} size={16} />
    </g>
  )
}

export const sciNotation: SceneDef = {
  id: 'sci-notation',
  title: 'Scientific notation',
  steps: [
    'Scientists work with huge and tiny numbers — like the distance to the Sun, about 150 000 000 km. Writing all those zeros is slow and easy to get wrong!',
    'Scientific notation writes any number as a number between 1 and 10, multiplied by a power of 10.',
    'Move the decimal point until there is just one non-zero digit in front of it. Count the hops: eight hops to the left.',
    'So 150 000 000 equals $1.5 \\times 10^8$. Big numbers get a positive power of ten.',
    'Tiny numbers work the other way. In 0.00042 the point hops 4 places to the right, giving $4.2 \\times 10^{-4}$. Small numbers get a negative power.',
  ],
  Comp: Sci,
}

// ---------- Simple interest ----------
function Simple({ step }: { step: number }) {
  const base = 120
  const ib = 24
  const years = [0, 1, 2, 3, 4]
  return (
    <g>
      <T x={320} y={40} size={22} color={C.soft} show={step === 0}>
        🏦 Interest = rent paid for using money
      </T>
      <Line x1={90} y1={300} x2={560} y2={300} color={C.soft} width={2} />
      {years.map((y, i) => {
        const x = 110 + i * 92
        const shown = step >= 1
        const interest = step >= 3 ? y : step >= 2 ? Math.min(y, 1) : 0
        return (
          <g key={y}>
            <Box x={x} y={300 - base} w={56} h={base} fill={C.violetSoft} stroke={C.violet} show={shown} delay={i * 0.08} />
            {Array.from({ length: 4 }, (_, k) => (
              <Box key={k} x={x} y={300 - base - (k + 1) * ib} w={56} h={ib - 3} fill={C.coral} stroke={C.coral} show={k < interest} delay={k * 0.15} r={4} />
            ))}
            <T x={x + 28} y={322} size={15} color={C.soft} show={shown}>
              Year {y}
            </T>
          </g>
        )
      })}
      <T x={320} y={85} size={22} show={step === 1}>$1000 saved at 5% p.a.</T>
      <T x={320} y={85} size={22} color={C.coral} show={step === 2}>5% of $1000 = $50 each year</T>
      <T x={320} y={24} size={20} color={C.coral} show={step >= 3}>+$50, +$50, +$50, +$50 → $200 interest</T>
      <Pill x={320} y={60} text="I = P × r × n = 1000 × 0.05 × 4 = $200" show={step >= 4} color={C.violet} size={16} />
    </g>
  )
}

export const simpleInterest: SceneDef = {
  id: 'simple-interest',
  title: 'Simple interest',
  steps: [
    'Interest is like rent for money. If you borrow money, you pay the bank rent. If you save money, the bank pays rent to you!',
    'Say you put \\$1000 in the bank at 5% per year simple interest.',
    'Each year you earn 5% of \\$1000, which is \\$50.',
    'With simple interest it’s the same \\$50 every year, so the savings grow in equal steps. After 4 years you’ve earned \\$200.',
    'The formula is $I = Prn$: principal times rate times number of years. $1000 \\times 0.05 \\times 4 = 200$.',
  ],
  Comp: Simple,
}

// ---------- Compound interest ----------
function Compound({ step }: { step: number }) {
  const vals = [1000, 1100, 1210, 1331, 1464.1, 1610.51]
  const scale = 0.14
  const shownN = step === 0 ? 0 : step === 1 ? 2 : step === 2 ? 3 : 6
  return (
    <g>
      <T x={320} y={40} size={22} color={C.soft} show={step === 0}>
        ❄️ A snowball grows faster the bigger it gets
      </T>
      <motion.circle initial={false} animate={{ cx: step === 0 ? 320 : 600, cy: step === 0 ? 170 : 40, r: step === 0 ? 50 : 0 }} fill={C.skySoft} stroke={C.sky} strokeWidth={3} />
      <Line x1={70} y1={310} x2={600} y2={310} color={C.soft} width={2} />
      {vals.map((v, i) => {
        const x = 90 + i * 85
        const h = (v - 600) * scale * 1.6
        return (
          <g key={i}>
            <Box x={x} y={310 - h} w={52} h={h} fill={i === 0 ? C.violetSoft : C.mintSoft} stroke={i === 0 ? C.violet : C.mint} show={i < shownN} delay={i * 0.12} />
            <T x={x + 26} y={300 - h} size={13} show={i < shownN} delay={i * 0.12} weight={700}>
              ${v.toFixed(0)}
            </T>
            <T x={x + 26} y={330} size={13} color={C.soft} show={i < shownN}>
              Yr {i}
            </T>
          </g>
        )
      })}
      <T x={320} y={70} size={20} show={step === 1} color={C.mint}>Year 1: 10% of $1000 = +$100</T>
      <T x={320} y={70} size={20} show={step === 2} color={C.mint}>Year 2: 10% of $1100 = +$110 (interest on interest!)</T>
      <Show when={step >= 3}>
        <line x1={116} y1={310 - 400 * 0.224} x2={116 + 5 * 85} y2={310 - (1500 - 600) * 0.224} stroke={C.coral} strokeWidth={3} strokeDasharray="8 7" />
        <text x={150} y={205} fontSize={14} fill={C.coral} fontWeight={700} textAnchor="start">
          simple interest
        </text>
      </Show>
      <Pill x={300} y={30} text="A = P(1 + r)ⁿ = 1000 × 1.1⁵ ≈ $1610.51" show={step >= 4} color={C.violet} size={16} />
    </g>
  )
}

export const compoundInterest: SceneDef = {
  id: 'compound-interest',
  title: 'Compound interest',
  steps: [
    'Compound interest is like a snowball rolling down a hill. It picks up more snow each turn, because it’s already bigger.',
    'Start with \\$1000 at 10% per year. In year 1 you earn \\$100, so now you have \\$1100.',
    'In year 2 you earn 10% of \\$1100 — that’s \\$110, because you’re earning interest on your interest!',
    'Each year the growth gets bigger. Compare it with simple interest, the dashed line: compound interest pulls further ahead every year.',
    'The formula is $A = P(1 + r)^n$. After 5 years: $1000 \\times 1.1^5 \\approx \\$1610.51$.',
  ],
  Comp: Compound,
}

