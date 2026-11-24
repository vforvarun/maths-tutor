import { motion } from 'motion/react'
import type { SceneDef } from '.'
import { C, T, Show, Line, Dot, Draw, Pill, Box } from './kit'

// ---------- Mean / median / mode / range ----------
function Lollies({ step }: { step: number }) {
  const data = [2, 4, 4, 5, 10]
  const names = ['Ava', 'Ben', 'Cy', 'Dee', 'Eli']
  const colors = [C.violet, C.coral, C.mint, C.sky, C.pink]
  // each lolly: owner index i, position k
  const lollies: { owner: number; col: number; k: number }[] = []
  let leveled = 0
  data.forEach((n, i) => {
    for (let k = 0; k < n; k++) {
      const id = lollies.length
      const col = step === 1 ? Math.floor(id / 5) : i
      const kk = step === 1 ? id % 5 : k
      lollies.push({ owner: i, col, k: kk })
      leveled++
    }
  })
  return (
    <g>
      <Line x1={70} y1={290} x2={570} y2={290} color={C.soft} width={2} />
      {lollies.map((l, idx) => (
        <motion.circle key={idx} initial={false} animate={{ cx: 120 + l.col * 100, cy: 274 - l.k * 22 }} transition={{ duration: 1, delay: step === 1 ? idx * 0.04 : 0 }} r={9} fill={colors[l.owner]} stroke="white" strokeWidth={2} />
      ))}
      {names.map((n, i) => (
        <g key={n}>
          <motion.rect initial={false} animate={{ opacity: step === 2 && i === 2 ? 1 : 0 }} x={80 + i * 100} y={40} width={80} height={265} rx={14} fill="none" stroke={C.sun} strokeWidth={4} />
          <text x={120 + i * 100} y={312} fontSize={15} fill={C.soft} textAnchor="middle" fontWeight={600}>
            {n} ({data[i]})
          </text>
        </g>
      ))}
      <Line x1={70} y1={274 - 4 * 22 - 11} x2={570} y2={274 - 4 * 22 - 11} color={C.violet} width={3} dash="8 6" show={step === 1} />
      <T x={320} y={30} size={20} show={step === 0} color={C.soft}>🍬 Five friends' lollies: 2, 4, 4, 5, 10</T>
      <T x={320} y={30} size={20} show={step === 1} color={C.violet}>Mean = 25 ÷ 5 = 5 each (shared equally)</T>
      <T x={320} y={30} size={20} show={step === 2} color="#c48a00">Median = middle value = 4</T>
      <T x={320} y={30} size={20} show={step === 3}>Mode = 4 (most common) · Range = 10 − 2 = 8</T>
      <T x={320} y={30} size={20} show={step >= 4} color={C.coral}>10 is an outlier: mean ↑, median stays put</T>
      <Show when={step >= 4}>
        <circle cx={520} cy={274 - 9 * 22} r={20} fill="none" stroke={C.coral} strokeWidth={3} />
      </Show>
    </g>
  )
}

export const statistics: SceneDef = {
  id: 'statistics',
  title: 'Mean, median, mode and range',
  steps: [
    'Five friends have 2, 4, 4, 5 and 10 lollies. How can we describe the “typical” number of lollies?',
    'The mean: share all the lollies out equally. There are 25 lollies and 5 people, so 25 ÷ 5 = 5 each.',
    'The median: line everyone up in order and pick the person in the middle. That’s 4.',
    'The mode is the most common value: 4. The range is the highest minus the lowest: 10 − 2 = 8.',
    'Notice that 10 is an outlier. It drags the mean up, but the median doesn’t move. That’s why the median is better when there are outliers.',
  ],
  Comp: Lollies,
}

// ---------- Box plots & scatter ----------
function BoxPlot({ step }: { step: number }) {
  const data = [2, 3, 4, 4, 5, 6, 7, 7, 8, 9, 12]
  const px = (v: number) => 80 + v * 40
  const counts: Record<number, number> = {}
  return (
    <g>
      <Show when={step <= 3}>
        <line x1={80} y1={250} x2={600} y2={250} stroke={C.soft} strokeWidth={2} />
        {Array.from({ length: 14 }, (_, i) => (
          <g key={i}>
            <line x1={px(i)} y1={244} x2={px(i)} y2={256} stroke={C.soft} strokeWidth={2} />
            <text x={px(i)} y={276} fontSize={13} fill={C.soft} textAnchor="middle">
              {i}
            </text>
          </g>
        ))}
        {data.map((v, i) => {
          counts[v] = (counts[v] ?? 0) + 1
          const hl = (step >= 1 && (i === 0 || i === 10 || i === 5)) || (step >= 2 && (i === 2 || i === 8))
          return <Dot key={i} x={px(v)} y={232 - (counts[v] - 1) * 18} r={8} color={hl ? C.coral : C.violet} />
        })}
        <T x={px(2)} y={300} size={14} color={C.coral} show={step >= 1}>min</T>
        <T x={px(12)} y={300} size={14} color={C.coral} show={step >= 1}>max</T>
        <T x={px(6)} y={300} size={14} color={C.coral} show={step >= 1}>Q2 = 6</T>
        <T x={px(4)} y={318} size={14} color={C.coral} show={step >= 2}>Q1 = 4</T>
        <T x={px(8)} y={318} size={14} color={C.coral} show={step >= 2}>Q3 = 8</T>
        <Show when={step >= 3}>
          <line x1={px(2)} y1={130} x2={px(4)} y2={130} stroke={C.ink} strokeWidth={3} />
          <line x1={px(8)} y1={130} x2={px(12)} y2={130} stroke={C.ink} strokeWidth={3} />
          <line x1={px(2)} y1={115} x2={px(2)} y2={145} stroke={C.ink} strokeWidth={3} />
          <line x1={px(12)} y1={115} x2={px(12)} y2={145} stroke={C.ink} strokeWidth={3} />
        </Show>
        <Box x={px(4)} y={100} w={px(8) - px(4)} h={60} fill={C.mintSoft} stroke={C.mint} show={step >= 3} r={2} />
        <Line x1={px(6)} y1={100} x2={px(6)} y2={160} color={C.mint} width={4} show={step >= 3} />
        <T x={px(6)} y={80} size={17} color={C.mint} show={step >= 3}>IQR = 8 − 4 = 4 (middle 50%)</T>
        <T x={320} y={40} size={18} color={C.soft} show={step <= 2}>Data: 2, 3, 4, 4, 5, 6, 7, 7, 8, 9, 12</T>
      </Show>
      <Show when={step >= 4}>
        <line x1={90} y1={300} x2={560} y2={300} stroke={C.soft} strokeWidth={2} />
        <line x1={90} y1={300} x2={90} y2={50} stroke={C.soft} strokeWidth={2} />
        <text x={325} y={330} fontSize={15} fill={C.soft} textAnchor="middle">
          hours of study
        </text>
        <text x={60} y={175} fontSize={15} fill={C.soft} textAnchor="middle" transform="rotate(-90 60 175)">
          test score
        </text>
        {[
          [1, 40],
          [2, 48],
          [2.5, 45],
          [3, 58],
          [4, 60],
          [4.5, 70],
          [5, 66],
          [6, 78],
          [7, 80],
          [8, 92],
        ].map(([h, s], i) => (
          <Dot key={i} x={90 + h * 55} y={300 - s * 2.6} r={8} color={C.coral} delay={i * 0.08} />
        ))}
        <Draw d={`M${90 + 0.5 * 55} ${300 - 38 * 2.6} L${90 + 8.3 * 55} ${300 - 92 * 2.6}`} color={C.violet} dash="10 8" width={3} delay={0.9} />
        <Pill x={240} y={60} text="positive trend ↗" color={C.violet} size={16} />
      </Show>
    </g>
  )
}

export const bivariate: SceneDef = {
  id: 'bivariate',
  title: 'Box plots and scatter plots',
  steps: [
    'A box plot sums up a whole data set using just five numbers. Here are 11 test results.',
    'First, order the data. The minimum is 2, the maximum is 12, and the median, Q2, is the middle value: 6.',
    'The median of the lower half is the first quartile, Q1 = 4. The median of the upper half is the third quartile, Q3 = 8.',
    'The box goes from Q1 to Q3 and holds the middle 50% of the data. Its width is the interquartile range: IQR = Q3 − Q1 = 4.',
    'A scatter plot shows two variables at once, like hours of study and test score. Points trending upwards show a positive relationship.',
  ],
  Comp: BoxPlot,
}

// ---------- Tree diagrams ----------
function Tree({ step }: { step: number }) {
  const root = [90, 180]
  const l1 = [
    [250, 100],
    [250, 260],
  ]
  const l2 = [
    [420, 60],
    [420, 140],
    [420, 220],
    [420, 300],
  ]
  const lab1 = ['H', 'T']
  const lab2 = ['HH', 'HT', 'TH', 'TT']
  return (
    <g>
      <Dot x={root[0]} y={root[1]} r={10} color={C.ink} />
      {l1.map((p, i) => (
        <g key={i}>
          <Draw d={`M${root[0]} ${root[1]} L${p[0]} ${p[1]}`} color={C.violet} show={step >= 1} delay={i * 0.2} />
          <T x={(root[0] + p[0]) / 2 - 8} y={(root[1] + p[1]) / 2 + (i ? 18 : -18)} size={16} color={C.violet} show={step >= 1}>½</T>
          <Dot x={p[0]} y={p[1]} r={20} color={i ? C.sky : C.sun} show={step >= 1} delay={0.4} />
          <T x={p[0]} y={p[1] + 1} size={18} color="white" show={step >= 1} delay={0.4}>{lab1[i]}</T>
        </g>
      ))}
      {l2.map((p, j) => {
        const parent = l1[Math.floor(j / 2)]
        const hl = (step === 3 && j === 0) || (step >= 4 && (j === 1 || j === 2))
        return (
          <g key={j}>
            <Draw d={`M${parent[0] + 20} ${parent[1]} L${p[0] - 20} ${p[1]}`} color={hl ? C.coral : C.violet} width={hl ? 6 : 4} show={step >= 2} delay={j * 0.15} />
            <T x={(parent[0] + p[0]) / 2} y={(parent[1] + p[1]) / 2 + (j % 2 ? 16 : -16)} size={15} color={C.violet} show={step >= 2}>½</T>
            <Dot x={p[0]} y={p[1]} r={18} color={j % 2 ? C.sky : C.sun} show={step >= 2} delay={0.5} />
            <T x={p[0]} y={p[1] + 1} size={15} color="white" show={step >= 2} delay={0.5}>{lab2[j].slice(1)}</T>
            <T x={490} y={p[1]} size={18} show={step >= 2} anchor="start" color={hl ? C.coral : C.ink}>
              {lab2[j]}  ¼
            </T>
          </g>
        )
      })}
      <T x={320} y={30} size={18} color={C.soft} show={step === 0}>🪙 Flip a coin twice…</T>
      <Pill x={170} y={330} text="P(HH) = ½ × ½ = ¼" show={step === 3} color={C.coral} size={16} />
      <Pill x={200} y={330} text="P(one head) = ¼ + ¼ = ½" show={step >= 4} color={C.coral} size={16} />
    </g>
  )
}

export const probability: SceneDef = {
  id: 'probability',
  title: 'Tree diagrams',
  steps: [
    'A tree diagram is like a choose-your-own-adventure map: every branch is a possible path. Let’s flip a coin twice.',
    'The first flip: two branches, heads or tails, each with probability one half.',
    'The second flip: each branch splits into two more. Now there are four paths: HH, HT, TH and TT.',
    'To find the probability of a path, multiply along its branches: $P(HH) = \\frac12 \\times \\frac12 = \\frac14$.',
    'To combine paths, add them: P(exactly one head) = P(HT) + P(TH) = ¼ + ¼ = ½.',
  ],
  Comp: Tree,
}

// ---------- Conditional probability ----------
function Socks({ step }: { step: number }) {
  const socks = [C.coral, C.coral, C.coral, C.sky, C.sky]
  const pos = [
    [240, 200],
    [290, 230],
    [340, 195],
    [270, 260],
    [360, 250],
  ]
  return (
    <g>
      <path d="M200 140 Q 190 300 300 300 Q 410 300 400 140 Z" fill="#f4efe6" stroke="#bfb393" strokeWidth={3} />
      {socks.map((c, i) => {
        const taken = step >= 1 && i === 0
        return (
          <motion.g key={i} initial={false} animate={{ x: taken ? 280 : 0, y: taken ? -100 : 0 }} transition={{ duration: 1 }}>
            <path d={`M${pos[i][0]} ${pos[i][1] - 22} l0 24 q0 12 14 12 l12 0 l0 -12 l-10 0 l0 -24 z`} fill={c} stroke="white" strokeWidth={2} />
          </motion.g>
        )
      })}
      <T x={320} y={40} size={20} show={step === 0}>3 red 🧦 + 2 blue 🧦 → P(red) = 3/5</T>
      <T x={320} y={40} size={20} show={step === 1} color={C.coral}>Keep it! Now 2 red + 2 blue → P(red) = 2/4</T>
      <T x={320} y={40} size={20} show={step === 2} color={C.violet}>P(red, red) = 3/5 × 2/4 = 6/20 = 3/10</T>
      <T x={320} y={40} size={18} show={step === 3}>Without replacement → dependent events</T>
      <T x={320} y={40} size={18} show={step >= 4} color={C.violet}>P(A | B) = probability of A given B</T>
      <T x={560} y={120} size={14} color={C.soft} show={step >= 1}>taken out</T>
      <Pill x={530} y={300} text="Sample space shrinks!" show={step >= 4} color={C.mint} size={15} />
    </g>
  )
}

export const conditional: SceneDef = {
  id: 'conditional',
  title: 'Conditional probability',
  steps: [
    'A drawer has 3 red socks and 2 blue socks. Grab one without looking: P(red) = 3 out of 5.',
    'You keep that sock — no replacement. Now there are only 4 socks left: 2 red and 2 blue, so P(red) is now 2 out of 4.',
    'So the chance of red then red is $\\frac35 \\times \\frac24 = \\frac{6}{20} = \\frac{3}{10}$.',
    'When the first pick changes the second, the events are dependent. If you put the sock back, they’re independent and the fractions don’t change.',
    'Conditional probability, written P(A | B), means the probability of A given that B has already happened. Knowing B shrinks the sample space.',
  ],
  Comp: Socks,
}
