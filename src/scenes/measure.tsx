import { motion } from 'motion/react'
import type { SceneDef } from '.'
import { C, T, Show, Box, Line, Dot, Draw, Pill, Poly, Arrow } from './kit'

type Pt = [number, number]
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** grid lines inside a parallelogram p0-p1-p3 (p0 corner) with n divisions */
function GridIn({ p0, p1, p3, n, color, show, delay = 0 }: { p0: Pt; p1: Pt; p3: Pt; n: number; color: string; show: boolean; delay?: number }) {
  const lines = []
  const p2: Pt = [p1[0] + p3[0] - p0[0], p1[1] + p3[1] - p0[1]]
  for (let i = 1; i < n; i++) {
    const a = lerp(p0, p1, i / n)
    const b = lerp(p3, p2, i / n)
    const c = lerp(p0, p3, i / n)
    const d = lerp(p1, p2, i / n)
    lines.push(<line key={'a' + i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={1.5} opacity={0.6} />)
    lines.push(<line key={'b' + i} x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} stroke={color} strokeWidth={1.5} opacity={0.6} />)
  }
  return (
    <Show when={show} delay={delay}>
      {lines}
    </Show>
  )
}

// ---------- Pythagoras ----------
function Pyth({ step }: { step: number }) {
  const A: Pt = [230, 210]
  const B: Pt = [326, 210]
  const Cc: Pt = [230, 138]
  return (
    <g>
      <Show when={step === 0}>
        <rect x={200} y={110} width={160} height={130} rx={16} fill="#e3f7e9" stroke="#8fd3a4" strokeWidth={2} />
        <text x={280} y={100} fontSize={15} fill={C.soft} textAnchor="middle">
          🏟️ the school oval
        </text>
      </Show>
      <Poly points={[A, B, Cc]} fill={step === 0 ? 'transparent' : C.violetSoft} stroke={C.violet} width={4} />
      <path d={`M${A[0]} ${A[1] - 14} L${A[0] + 14} ${A[1] - 14} L${A[0] + 14} ${A[1]}`} fill="none" stroke={C.ink} strokeWidth={2} />
      <Draw d={`M${Cc[0]} ${Cc[1]} L${A[0]} ${A[1]} L${B[0]} ${B[1]}`} color={C.mint} width={5} dash="2 10" show={step === 0} />
      <Draw d={`M${Cc[0]} ${Cc[1]} L${B[0]} ${B[1]}`} color={C.coral} width={6} show={step <= 1} delay={0.6} />
      <T x={470} y={120} size={18} color={C.mint} show={step === 0}>walk around: 3 + 4 = 7 m</T>
      <T x={470} y={160} size={18} color={C.coral} show={step === 0}>shortcut: ? m</T>
      <T x={300} y={162} size={18} color={C.coral} show={step === 1} anchor="start">hypotenuse (longest)</T>
      <T x={208} y={174} size={18} color={C.ink} show={step >= 1}>3</T>
      <T x={278} y={228} size={18} color={C.ink} show={step >= 1}>4</T>
      <T x={286} y={164} size={18} color={C.ink} show={step >= 4}>5</T>
      {/* squares */}
      <Poly points={[A, B, [326, 306], [230, 306]]} fill={C.mintSoft} stroke={C.mint} show={step >= 2} />
      <GridIn p0={A} p1={B} p3={[230, 306]} n={4} color={C.mint} show={step >= 2} />
      <Poly points={[[158, 138], Cc, A, [158, 210]]} fill={C.sunSoft} stroke={C.sun} show={step >= 2} delay={0.3} />
      <GridIn p0={[158, 138]} p1={Cc} p3={[158, 210]} n={3} color="#e6a800" show={step >= 2} delay={0.3} />
      <Poly points={[Cc, B, [398, 114], [302, 42]]} fill={C.coralSoft} stroke={C.coral} show={step >= 3} />
      <GridIn p0={Cc} p1={B} p3={[302, 42]} n={5} color={C.coral} show={step >= 3} />
      <T x={278} y={262} size={22} color={C.mint} show={step >= 2}>16</T>
      <T x={194} y={174} size={22} color="#c48a00" show={step >= 2}>9</T>
      <T x={314} y={126} size={24} color={C.coral} show={step >= 3}>25</T>
      <Pill x={510} y={150} text="9 + 16 = 25" show={step >= 3} color={C.coral} size={18} />
      <Pill x={510} y={210} text="a² + b² = c²" show={step >= 4} color={C.violet} size={20} />
      <T x={510} y={262} size={16} color={C.soft} show={step >= 5}>Find c: add, then √</T>
      <T x={510} y={288} size={16} color={C.soft} show={step >= 5}>Shorter side: subtract, then √</T>
    </g>
  )
}

export const pythagoras: SceneDef = {
  id: 'pythagoras',
  title: 'Pythagoras’ theorem',
  steps: [
    'Imagine walking along two edges of the oval: 3 metres, then 4 metres. That’s 7 metres. How much shorter is the shortcut straight across?',
    'The shortcut is the hypotenuse — the longest side, always opposite the right angle.',
    'Build a square on each of the two shorter sides. Their areas are $3^2 = 9$ and $4^2 = 16$.',
    'Now build a square on the hypotenuse. Count the squares: its area is 25 — exactly $9 + 16$!',
    'That’s Pythagoras’ theorem: $a^2 + b^2 = c^2$. Here $c = \\sqrt{25} = 5$, so the shortcut is 5 metres, saving 2 metres.',
    'It only works for right-angled triangles. To find the hypotenuse, add the squares then square-root. To find a shorter side, subtract then square-root.',
  ],
  Comp: Pyth,
}

// ---------- Trigonometry ----------
function Trig({ step }: { step: number }) {
  const big = { P: [130, 290] as Pt, Q: [370, 290] as Pt, R: [370, 110] as Pt }
  const sm = { P: [130, 290] as Pt, Q: [250, 290] as Pt, R: [250, 200] as Pt }
  return (
    <g>
      <Poly points={[big.P, big.Q, big.R]} fill={C.violetSoft} stroke={C.violet} width={4} />
      <path d={`M${big.Q[0] - 16} ${big.Q[1]} L${big.Q[0] - 16} ${big.Q[1] - 16} L${big.Q[0]} ${big.Q[1] - 16}`} fill="none" stroke={C.ink} strokeWidth={2} />
      <path d="M180 290 A 50 50 0 0 0 170 260" fill="none" stroke={C.sun} strokeWidth={4} />
      <T x={196} y={272} size={22} color="#c48a00">θ</T>
      <Line x1={big.P[0]} y1={big.P[1]} x2={big.R[0]} y2={big.R[1]} color={C.coral} width={7} show={step >= 1} />
      <T x={232} y={176} size={20} color={C.coral} show={step >= 1} anchor="end">Hypotenuse</T>
      <Line x1={big.Q[0]} y1={big.Q[1]} x2={big.R[0]} y2={big.R[1]} color={C.mint} width={7} show={step >= 2} />
      <T x={382} y={205} size={20} color={C.mint} show={step >= 2} anchor="start">Opposite</T>
      <Line x1={big.P[0]} y1={big.P[1]} x2={big.Q[0]} y2={big.Q[1]} color={C.sky} width={7} show={step >= 2} delay={0.4} />
      <T x={250} y={318} size={20} color={C.sky} show={step >= 2}>Adjacent</T>
      <Poly points={[sm.P, sm.Q, sm.R]} fill="rgba(255,190,11,0.25)" stroke={C.sun} show={step === 3} width={3} />
      <T x={530} y={80} size={20} show={step === 3}>small: 3 ÷ 5 = 0.6</T>
      <T x={530} y={120} size={20} show={step === 3} delay={0.4}>big: 6 ÷ 10 = 0.6</T>
      <T x={530} y={160} size={17} color={C.soft} show={step === 3} delay={0.8}>same angle → same ratio</T>
      <Pill x={530} y={60} text="SOH  sin θ = O / H" show={step >= 4} color={C.coral} size={16} />
      <Pill x={530} y={110} text="CAH  cos θ = A / H" show={step >= 4} color={C.sky} size={16} delay={0.2} />
      <Pill x={530} y={160} text="TOA  tan θ = O / A" show={step >= 4} color={C.mint} size={16} delay={0.4} />
    </g>
  )
}

export const trig: SceneDef = {
  id: 'trig',
  title: 'Trigonometry: SOH CAH TOA',
  steps: [
    'Trigonometry connects angles and side lengths in right-angled triangles. First we name the sides — from the point of view of the angle θ.',
    'The hypotenuse is always the longest side, opposite the right angle.',
    'The opposite side is directly across from θ. The adjacent side is next to θ — but it isn’t the hypotenuse.',
    'Here’s the magic: shrink or grow the triangle and the ratio opposite ÷ hypotenuse stays the same. It depends only on the angle — like how steep a ramp is.',
    'These ratios have names: $\\sin\\theta = \\frac{O}{H}$, $\\cos\\theta = \\frac{A}{H}$ and $\\tan\\theta = \\frac{O}{A}$. Remember them as SOH CAH TOA!',
  ],
  Comp: Trig,
}

// ---------- Elevation, depression, bearings ----------
function Stick({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={C.ink} strokeWidth={3} strokeLinecap="round" fill="none">
      <circle cx={x} cy={y - 50} r={9} fill={C.sunSoft} />
      <line x1={x} y1={y - 41} x2={x} y2={y - 15} />
      <line x1={x} y1={y - 15} x2={x - 9} y2={y} />
      <line x1={x} y1={y - 15} x2={x + 9} y2={y} />
      <line x1={x - 10} y1={y - 32} x2={x + 10} y2={y - 32} />
    </g>
  )
}

function TrigApps({ step }: { step: number }) {
  return (
    <g>
      <Show when={step === 0}>
        <line x1={40} y1={300} x2={600} y2={300} stroke="#8fd3a4" strokeWidth={6} />
        <Stick x={120} y={300} />
        <line x1={120} y1={250} x2={460} y2={90} stroke={C.ink} strokeWidth={2} />
        <path d="M460 90 l-18 -22 l22 -6 z" fill={C.coral} />
        <line x1={120} y1={250} x2={470} y2={250} stroke={C.soft} strokeWidth={2} strokeDasharray="8 6" />
        <path d="M200 250 A 80 80 0 0 0 192 216" fill="none" stroke={C.sun} strokeWidth={4} />
        <text x={250} y={236} fontSize={17} fill="#c48a00" fontWeight={700}>
          angle of elevation
        </text>
      </Show>
      <Show when={step === 1 || step === 2}>
        <path d="M30 110 L210 110 L240 320 L30 320 Z" fill="#e8e2d0" stroke="#bfb393" strokeWidth={2} />
        <Stick x={180} y={110} />
        <path d="M430 300 l80 0 l-12 16 l-56 0 z" fill={C.sky} />
        <line x1={180} y1={62} x2={470} y2={300} stroke={C.ink} strokeWidth={2} />
        <line x1={180} y1={62} x2={600} y2={62} stroke={C.soft} strokeWidth={2} strokeDasharray="8 6" />
        <path d="M260 62 A 80 80 0 0 1 242 113" fill="none" stroke={C.coral} strokeWidth={4} />
        <text x={300} y={52} fontSize={17} fill={C.coral} fontWeight={700}>
          angle of depression
        </text>
      </Show>
      <Show when={step === 2}>
        <line x1={250} y1={300} x2={600} y2={300} stroke={C.soft} strokeWidth={2} strokeDasharray="8 6" />
        <path d="M390 300 A 80 80 0 0 1 408 249" fill="none" stroke={C.coral} strokeWidth={4} />
        <text x={380} y={240} fontSize={17} fill={C.coral} fontWeight={700} textAnchor="end">
          elevation from boat
        </text>
        <text x={470} y={150} fontSize={22} fill={C.ink} fontWeight={700}>
          equal! ✓
        </text>
      </Show>
      <Show when={step === 3}>
        <line x1={40} y1={300} x2={600} y2={300} stroke="#8fd3a4" strokeWidth={6} />
        <Stick x={130} y={300} />
        <rect x={452} y={190} width={16} height={110} fill="#a0703a" />
        <circle cx={460} cy={150} r={60} fill="#7ccf8a" />
        <line x1={130} y1={300} x2={460} y2={90} stroke={C.violet} strokeWidth={3} />
        <line x1={460} y1={90} x2={460} y2={300} stroke={C.coral} strokeWidth={4} strokeDasharray="8 6" />
        <path d="M210 300 A 80 80 0 0 0 198 257" fill="none" stroke={C.sun} strokeWidth={4} />
        <text x={222} y={282} fontSize={18} fill="#c48a00" fontWeight={700}>
          35°
        </text>
        <text x={295} y={325} fontSize={18} fill={C.ink} fontWeight={700} textAnchor="middle">
          20 m
        </text>
        <text x={490} y={200} fontSize={22} fill={C.coral} fontWeight={700}>
          h
        </text>
        <text x={320} y={40} fontSize={20} fill={C.ink} fontWeight={700} textAnchor="middle">
          tan 35° = h ÷ 20 → h = 20 × tan 35° ≈ 14 m
        </text>
      </Show>
      <Show when={step >= 4}>
        <circle cx={320} cy={190} r={120} fill="white" stroke={C.line} strokeWidth={3} />
        <line x1={320} y1={190} x2={320} y2={60} stroke={C.coral} strokeWidth={4} />
        <text x={320} y={48} fontSize={22} fill={C.coral} fontWeight={700} textAnchor="middle">
          N
        </text>
        <text x={452} y={196} fontSize={18} fill={C.soft} textAnchor="middle">
          E
        </text>
        <text x={320} y={330} fontSize={18} fill={C.soft} textAnchor="middle">
          S
        </text>
        <text x={186} y={196} fontSize={18} fill={C.soft} textAnchor="middle">
          W
        </text>
        <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1={320} y1={190} x2={405} y2={105} stroke={C.violet} strokeWidth={5} strokeLinecap="round" />
        <path d="M320 130 A 60 60 0 0 1 362 148" fill="none" stroke={C.sun} strokeWidth={4} />
        <text x={360} y={130} fontSize={18} fill="#c48a00" fontWeight={700}>
          045°
        </text>
        <text x={540} y={150} fontSize={16} fill={C.soft} textAnchor="middle">
          clockwise from North,
        </text>
        <text x={540} y={175} fontSize={16} fill={C.soft} textAnchor="middle">
          always 3 digits
        </text>
      </Show>
    </g>
  )
}

export const trigApps: SceneDef = {
  id: 'trig-apps',
  title: 'Elevation, depression and bearings',
  steps: [
    'Look up at a kite. The angle between flat ground and your line of sight is called the angle of elevation.',
    'Now stand on a cliff and look down at a boat. The angle below the horizontal is the angle of depression.',
    'The angle of depression from the cliff equals the angle of elevation from the boat — they are alternate angles between parallel lines.',
    'Example: you stand 20 m from a tree and look up 35° to the top. $\\tan 35° = \\frac{h}{20}$, so $h = 20 \\tan 35° \\approx 14$ m.',
    'Bearings measure direction clockwise from North, always with three digits. North-east is 045°.',
  ],
  Comp: TrigApps,
}

// ---------- Trigonometry in any triangle ----------
function TrigRules({ step }: { step: number }) {
  const A: Pt = [100, 290]
  const B: Pt = [400, 290]
  const Cv: Pt = [290, 92]
  const tri = step <= 3
  // laptop hinge
  const hinge: Pt = [190, 270]
  const tip = (deg: number): Pt => [hinge[0] + 150 * Math.cos((deg * Math.PI) / 180), hinge[1] - 150 * Math.sin((deg * Math.PI) / 180)]
  const key: Pt = [390, 270]
  const opens = [
    { d: 50, col: C.mint, gap: 155 },
    { d: 90, col: C.sky, gap: 250 },
    { d: 130, col: C.coral, gap: 318 },
  ]
  // area triangle
  const P: Pt = [120, 290]
  const Q: Pt = [420, 290]
  const R: Pt = [250, 110]
  return (
    <g>
      {/* ---- steps 0–3: one triangle, labelled ---- */}
      <Show when={tri}>
        <Poly points={[A, B, Cv]} fill={C.violetSoft} stroke={C.violet} width={4} />
        <T x={250} y={40} size={20} color={C.soft} show={step === 0}>No right angle anywhere 🤔</T>
      </Show>
      <Show when={tri && step >= 1}>
        <T x={78} y={302} size={24} color={C.coral} weight={800}>A</T>
        <T x={422} y={302} size={24} color={C.sky} weight={800}>B</T>
        <T x={290} y={68} size={24} color={C.mint} weight={800}>C</T>
        <Line x1={B[0]} y1={B[1]} x2={Cv[0]} y2={Cv[1]} color={C.coral} width={7} />
        <T x={368} y={180} size={24} color={C.coral} weight={800} anchor="start">a</T>
        <Line x1={A[0]} y1={A[1]} x2={Cv[0]} y2={Cv[1]} color={C.sky} width={7} delay={0.3} />
        <T x={176} y={178} size={24} color={C.sky} weight={800} anchor="end">b</T>
        <Line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} color={C.mint} width={7} delay={0.6} />
        <T x={250} y={320} size={24} color={C.mint} weight={800}>c</T>
      </Show>
      <Show when={step === 1}>
        <T x={540} y={150} size={18}>side a faces</T>
        <T x={540} y={178} size={18}>angle A</T>
        <T x={540} y={220} size={15} color={C.soft}>(across the triangle)</T>
      </Show>
      <Show when={step === 2}>
        <T x={530} y={70} size={16} color={C.soft}>A = 48°, B = 61°, C = 71°</T>
        <T x={530} y={115} size={18}>9.2 ÷ sin 48° ≈ 12.4</T>
        <T x={530} y={155} size={18} delay={0.4}>10.8 ÷ sin 61° ≈ 12.4</T>
        <T x={530} y={195} size={18} delay={0.8}>11.7 ÷ sin 71° ≈ 12.4</T>
        <T x={530} y={235} size={16} color={C.soft} delay={1.2}>always the same number!</T>
      </Show>
      <Pill x={500} y={300} text="a/sin A = b/sin B = c/sin C" show={step === 2 || step === 3} color={C.violet} size={15} />
      <Show when={step === 3}>
        <path d="M144 290 A 44 44 0 0 0 129 258" fill="none" stroke={C.sun} strokeWidth={5} />
        <T x={530} y={90} size={20} weight={700}>Matching pair ✓</T>
        <T x={530} y={130} size={16} color={C.soft}>a side + the angle</T>
        <T x={530} y={154} size={16} color={C.soft}>directly opposite it</T>
        <T x={530} y={200} size={16}>…plus one more fact</T>
        <T x={530} y={224} size={16}>→ sine rule</T>
      </Show>

      {/* ---- steps 4–5: laptop hinge → cosine rule ---- */}
      <Show when={step === 4 || step === 5}>
        <line x1={hinge[0]} y1={hinge[1]} x2={key[0]} y2={key[1]} stroke={C.soft} strokeWidth={12} strokeLinecap="round" />
        <T x={290} y={298} size={15} color={C.soft}>keyboard</T>
        {opens.map((o, i) => {
          const t = tip(o.d)
          return (
            <Show key={o.d} when={step === 4 || o.d === 90} delay={step === 4 ? i * 0.9 : 0}>
              <line x1={hinge[0]} y1={hinge[1]} x2={t[0]} y2={t[1]} stroke={C.ink} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
              <line x1={t[0]} y1={t[1]} x2={key[0]} y2={key[1]} stroke={o.col} strokeWidth={4} strokeDasharray="9 7" />
              <circle cx={t[0]} cy={t[1]} r={6} fill={o.col} />
              <T x={540} y={110 + i * 46} size={18} color={o.col} weight={700} show={step === 4}>{`${o.d}° → gap ${o.gap}`}</T>
            </Show>
          )
        })}
        <path d="M222 270 A 32 32 0 0 0 190 238" fill="none" stroke={C.sun} strokeWidth={4} />
        <T x={530} y={70} size={14} color={C.soft} show={step === 4}>screen 150 · keyboard 200</T>
      </Show>
      <Show when={step === 5}>
        <T x={140} y={190} size={20} weight={700}>c</T>
        <T x={300} y={250} size={20} weight={700}>b</T>
        <T x={310} y={175} size={20} color={C.sky} weight={700}>a</T>
        <T x={228} y={246} size={17} color="#c48a00" weight={700}>A</T>
        <T x={520} y={80} size={17}>at 90°: a² = b² + c²</T>
        <T x={520} y={110} size={15} color={C.soft}>(Pythagoras!)</T>
        <T x={520} y={160} size={17}>any angle: subtract</T>
        <T x={520} y={186} size={17}>a correction 2bc cos A</T>
      </Show>
      <Pill x={455} y={330} text="a² = b² + c² − 2bc cos A" show={step === 5} color={C.sky} size={17} />

      {/* ---- step 6: area rule ---- */}
      <Show when={step === 6}>
        <Poly points={[P, Q, R]} fill={C.mintSoft} stroke={C.mint} width={4} />
        <Line x1={R[0]} y1={R[1]} x2={R[0]} y2={P[1]} color={C.coral} width={3} dash="8 6" />
        <path d={`M${R[0]} ${P[1] - 14} L${R[0] + 14} ${P[1] - 14} L${R[0] + 14} ${P[1]}`} fill="none" stroke={C.ink} strokeWidth={2} />
        <path d="M160 290 A 40 40 0 0 0 148 262" fill="none" stroke={C.sun} strokeWidth={4} />
        <T x={170} y={270} size={18} color="#c48a00" weight={700}>C</T>
        <T x={270} y={316} size={20} weight={700}>a</T>
        <T x={166} y={190} size={20} weight={700} anchor="end">b</T>
        <T x={258} y={258} size={17} color={C.coral} weight={700} anchor="start">h = b sin C</T>
        <T x={530} y={100} size={17}>Area = ½ × base × height</T>
        <T x={530} y={140} size={17} delay={0.5}>= ½ × a × b sin C</T>
        <Pill x={530} y={210} text="Area = ½ab sin C" color={C.mint} size={18} delay={1} />
      </Show>

      {/* ---- step 7: which rule? ---- */}
      <Show when={step >= 7}>
        <T x={320} y={50} size={24} weight={800}>Which rule?</T>
        {[
          { q: 'Matching pair (side + opposite angle)?', r: 'Sine rule', col: C.violet },
          { q: 'Two sides + angle between, or 3 sides?', r: 'Cosine rule', col: C.sky },
          { q: 'Need the area?', r: 'Area rule', col: C.mint },
        ].map((row, i) => (
          <Show key={row.r} when={step >= 7} delay={0.3 + i * 0.6}>
            <rect x={40} y={92 + i * 82} width={340} height={56} rx={16} fill="white" stroke={C.line} strokeWidth={2} />
            <text x={210} y={121 + i * 82} fontSize={16} fontWeight={600} fill={C.ink} textAnchor="middle" dominantBaseline="middle">
              {row.q}
            </text>
            <Arrow x1={392} y1={120 + i * 82} x2={438} y2={120 + i * 82} color={C.soft} />
            <rect x={452} y={96 + i * 82} width={150} height={48} rx={24} fill={row.col} />
            <text x={527} y={121 + i * 82} fontSize={18} fontWeight={700} fill="white" textAnchor="middle" dominantBaseline="middle">
              {row.r}
            </text>
          </Show>
        ))}
      </Show>
    </g>
  )
}

export const trigRules: SceneDef = {
  id: 'trig-rules',
  title: 'Trigonometry in any triangle',
  steps: [
    'SOH CAH TOA needs a right angle. But most triangles don’t have one! Let’s meet three rules that work for every triangle.',
    'First, labelling. The angles are capital A, B and C. Each side gets the small letter of the angle opposite it — side a faces angle A.',
    'Big angles face big sides. In fact, divide any side by the sine of its opposite angle and you always get the same number. That’s the sine rule.',
    'So use the sine rule when you know a matching pair — a side and the angle opposite it — plus one more side or angle.',
    'Now open a laptop. The screen and keyboard stay the same length, but the wider the hinge opens, the bigger the gap between their tips.',
    'At exactly 90 degrees, the gap is just Pythagoras. For any other angle, the cosine rule adds a correction: $a^2 = b^2 + c^2 - 2bc\\cos A$. Use it for two sides and the angle between them, or for all three sides.',
    'The area rule comes from half base times height. The height is $b\\sin C$, so the area is $\\frac{1}{2}ab\\sin C$.',
    'Which rule? Matching pair: sine rule. Two sides and the angle between, or all three sides: cosine rule. Need the area: area rule.',
  ],
  Comp: TrigRules,
}

// ---------- Surface area ----------
function SurfaceA({ step }: { step: number }) {
  return (
    <g>
      <Show when={step === 0}>
        <path d="M220 150 L380 150 L380 280 L220 280 Z" fill={C.coralSoft} stroke={C.coral} strokeWidth={3} />
        <path d="M220 150 L270 110 L430 110 L380 150 Z" fill="#ffd0d0" stroke={C.coral} strokeWidth={3} />
        <path d="M380 150 L430 110 L430 240 L380 280 Z" fill="#ffbcbc" stroke={C.coral} strokeWidth={3} />
        <path d="M300 150 L300 280 M220 215 L380 215" stroke={C.sun} strokeWidth={8} />
        <text x={320} y={320} fontSize={20} fill={C.soft} textAnchor="middle">
          🎁 How much wrapping paper?
        </text>
      </Show>
      <Show when={step === 1}>
        {[
          [250, 70, 90, 60],
          [250, 130, 90, 90],
          [160, 130, 90, 90],
          [340, 130, 90, 90],
          [430, 130, 90, 90],
          [250, 220, 90, 60],
        ].map(([x, y, w, h], i) => (
          <motion.rect key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }} x={x} y={y} width={w} height={h} fill={i % 2 ? C.coralSoft : '#ffd0d0'} stroke={C.coral} strokeWidth={2.5} />
        ))}
        <text x={320} y={320} fontSize={20} fill={C.ink} textAnchor="middle" fontWeight={600}>
          Net of a box: add the areas of all 6 faces
        </text>
      </Show>
      <Show when={step >= 2}>
        <ellipse cx={140} cy={110} rx={60} ry={18} fill={C.skySoft} stroke={C.sky} strokeWidth={3} />
        <path d="M80 110 L80 260 A 60 18 0 0 0 200 260 L200 110" fill={C.skySoft} stroke={C.sky} strokeWidth={3} />
        <rect x={80} y={150} width={120} height={60} fill="#ffe08a" opacity={0.8} />
        <text x={140} y={186} fontSize={14} textAnchor="middle" fill={C.ink} fontWeight={700}>
          LABEL
        </text>
        <Arrow x1={220} y1={185} x2={270} y2={185} color={C.soft} />
        <circle cx={400} cy={70} r={42} fill={C.skySoft} stroke={C.sky} strokeWidth={3} />
        <rect x={290} y={115} width={220} height={150} fill="#ffe08a" stroke="#e6a800" strokeWidth={3} />
        <circle cx={400} cy={310} r={42} fill={C.skySoft} stroke={C.sky} strokeWidth={3} />
        <text x={400} y={76} fontSize={18} textAnchor="middle" fill={C.sky} fontWeight={700}>
          πr²
        </text>
        <text x={400} y={316} fontSize={18} textAnchor="middle" fill={C.sky} fontWeight={700}>
          πr²
        </text>
      </Show>
      <Show when={step >= 3}>
        <text x={400} y={140} fontSize={18} textAnchor="middle" fill="#a87700" fontWeight={700}>
          width = 2πr
        </text>
        <text x={530} y={195} fontSize={18} fill="#a87700" fontWeight={700}>
          h
        </text>
        <text x={400} y={200} fontSize={22} textAnchor="middle" fill={C.ink} fontWeight={700}>
          2πr × h
        </text>
      </Show>
      <Pill x={150} y={325} text="SA = 2πr² + 2πrh" show={step >= 4} color={C.violet} size={17} />
    </g>
  )
}

export const surfaceArea: SceneDef = {
  id: 'surface-area',
  title: 'Surface area',
  steps: [
    'Surface area is the amount of wrapping paper you’d need to cover a 3D object completely, with no overlaps.',
    'Unfold a box into a flat net and it’s just six rectangles. Add up their areas and you have the surface area.',
    'A cylinder — like a can of soup — unrolls into two circles (the lids) and one rectangle (the label).',
    'The rectangle’s width wraps exactly once around the circle, so it equals the circumference, $2\\pi r$. Its height is $h$.',
    'Add the pieces: $SA = 2\\pi r^2 + 2\\pi r h$. Two lids plus the label!',
  ],
  Comp: SurfaceA,
}

// ---------- Volume of prisms ----------
function VolumeP({ step }: { step: number }) {
  const slices = step === 1 ? 1 : step >= 2 ? 9 : 0
  const cyl = step >= 4
  const shape = (dx: number, dy: number) =>
    cyl
      ? `M${200 + dx} ${210 + dy} m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0`
      : `M${150 + dx} ${260 + dy} L${250 + dx} ${260 + dy} L${250 + dx} ${190 + dy} L${200 + dx} ${150 + dy} L${150 + dx} ${190 + dy} Z`
  return (
    <g>
      <Show when={step === 0}>
        <rect x={230} y={120} width={180} height={160} rx={8} fill={C.skySoft} stroke={C.sky} strokeWidth={3} />
        <motion.rect initial={{ height: 0, y: 280 }} animate={{ height: 110, y: 170 }} transition={{ duration: 2 }} x={233} width={174} fill="#9cc3ff" />
        <text x={320} y={320} fontSize={20} fill={C.soft} textAnchor="middle">
          💧 How much can it hold?
        </text>
      </Show>
      {Array.from({ length: 9 }, (_, i) => (
        <motion.path key={i + (cyl ? 'c' : 'p')} initial={{ opacity: 0 }} animate={{ opacity: i < slices ? 1 : 0 }} transition={{ delay: i * 0.18 }} d={shape(i * 22, -i * 12)} fill={i === slices - 1 || i === 0 ? (cyl ? C.mintSoft : C.violetSoft) : cyl ? '#bdeee8' : '#d9d1ff'} stroke={cyl ? C.mint : C.violet} strokeWidth={2.5} />
      ))}
      <T x={200} y={300} size={20} color={C.violet} show={step === 1}>area A</T>
      <Show when={step >= 3}>
        <line x1={270} y1={285} x2={446} y2={189} stroke={C.coral} strokeWidth={3} />
        <text x={385} y={265} fontSize={20} fill={C.coral} fontWeight={700}>
          h
        </text>
      </Show>
      <Pill x={530} y={80} text="V = A × h" show={step >= 3 && !cyl} color={C.violet} size={20} />
      <Pill x={530} y={80} text="V = πr²h" show={cyl} color={C.mint} size={20} />
      <T x={530} y={130} size={16} color={C.soft} show={step === 2}>🍞 slices of bread</T>
      <T x={545} y={130} size={14} color={C.soft} show={cyl}>A = πr² (circle)</T>
    </g>
  )
}

export const volume: SceneDef = {
  id: 'volume',
  title: 'Volume of prisms',
  steps: [
    'Volume is how much space a 3D object takes up — for example, how much water a container can hold.',
    'A prism has the same cross-section all the way through. Here’s one slice, with area A.',
    'Stack identical slices, like slices in a loaf of bread, until the prism is h units long…',
    '…so the volume is the cross-section area times the height: $V = A \\times h$.',
    'A cylinder is just a prism with a circle cross-section, so $V = \\pi r^2 h$.',
  ],
  Comp: VolumeP,
}

// ---------- Cones, pyramids, spheres ----------
function Cones({ step }: { step: number }) {
  const level = Math.min(step, 3) / 3
  const top = 110
  const bottom = 290
  const h = (bottom - top) * level
  return (
    <g>
      {/* cone */}
      <path d="M150 110 L90 290 A 60 16 0 0 0 210 290 Z" fill={C.coralSoft} stroke={C.coral} strokeWidth={3} />
      <path d="M100 262 L200 262 L150 120 Z" fill="#9cc3ff" opacity={0.7} />
      <T x={150} y={330} size={17} color={C.coral}>cone</T>
      {/* cylinder */}
      <ellipse cx={430} cy={top} rx={60} ry={16} fill="white" stroke={C.sky} strokeWidth={3} />
      <motion.rect initial={false} animate={{ y: bottom - h, height: h }} transition={{ duration: 1.2 }} x={372} width={116} fill="#9cc3ff" />
      <motion.ellipse initial={false} animate={{ cy: bottom - h, opacity: level > 0 ? 1 : 0 }} transition={{ duration: 1.2 }} cx={430} rx={58} ry={14} fill="#b8d4ff" />
      <path d={`M370 ${top} L370 ${bottom} A 60 16 0 0 0 490 ${bottom} L490 ${top}`} fill="none" stroke={C.sky} strokeWidth={3} />
      <T x={430} y={330} size={17} color={C.sky}>cylinder</T>
      {[1, 2].map((k) => (
        <line key={k} x1={372} x2={488} y1={bottom - ((bottom - top) * k) / 3} y2={bottom - ((bottom - top) * k) / 3} stroke={C.sky} strokeDasharray="5 5" strokeWidth={1.5} />
      ))}
      <Arrow x1={220} y1={150} x2={355} y2={150} show={step >= 1 && step <= 3} color={C.soft} />
      <T x={290} y={130} size={18} show={step >= 1 && step <= 3}>pour #{Math.max(1, Math.min(step, 3))}</T>
      <T x={560} y={bottom - h} size={16} color={C.sky} show={step >= 1 && step <= 3}>
        {['', '⅓', '⅔', 'full!'][Math.min(step, 3)]}
      </T>
      <T x={320} y={40} size={20} color={C.soft} show={step === 0}>Same base, same height…</T>
      <Pill x={320} y={40} text="V(cone) = ⅓ πr²h" show={step === 3} color={C.coral} size={18} />
      <Pill x={320} y={30} text="Pyramid: V = ⅓ × base × h" show={step >= 4} color={C.violet} size={16} />
      <Pill x={320} y={75} text="Sphere: V = ⁴⁄₃ πr³" show={step >= 4} color={C.mint} size={16} delay={0.3} />
    </g>
  )
}

export const volume3d: SceneDef = {
  id: 'volume-3d',
  title: 'Cones, pyramids and spheres',
  steps: [
    'Here’s a cone and a cylinder with the same circular base and the same height. How many cones of water would it take to fill the cylinder?',
    'Pour in one cone of water… the cylinder is one third full.',
    'Pour in a second cone… two thirds full.',
    'The third cone fills it exactly! So a cone holds one third of the cylinder: $V = \\frac{1}{3} \\pi r^2 h$.',
    'Pyramids work the same way: $V = \\frac{1}{3} \\times$ base area $\\times$ height. And a sphere has volume $V = \\frac{4}{3} \\pi r^3$.',
  ],
  Comp: Cones,
}

// ---------- Similarity ----------
function Similar({ step }: { step: number }) {
  const s: Pt[] = [
    [80, 290],
    [160, 290],
    [80, 230],
  ]
  const A: Pt = [280, 300]
  const B: Pt = [520, 300]
  const Cc: Pt = [280, 120]
  const mAB: Pt = [400, 300]
  const mAC: Pt = [280, 210]
  const mBC: Pt = [400, 210]
  return (
    <g>
      <Show when={step === 0}>
        <rect x={50} y={60} width={150} height={260} rx={22} fill="none" stroke={C.ink} strokeWidth={4} />
        <text x={125} y={50} fontSize={16} fill={C.soft} textAnchor="middle">
          📱 zoom in…
        </text>
      </Show>
      <Poly points={s} fill={C.violetSoft} stroke={C.violet} />
      <T x={66} y={262} size={16}>3</T>
      <T x={120} y={308} size={16}>4</T>
      <Poly points={[A, B, Cc]} fill={C.coralSoft} stroke={C.coral} show={step >= 1} />
      <T x={262} y={210} size={18} show={step >= 1}>6</T>
      <T x={400} y={322} size={18} show={step >= 1}>8</T>
      <Pill x={540} y={80} text="scale factor k = 2" show={step >= 1} color={C.coral} size={16} />
      <Show when={step >= 2}>
        <path d="M140 290 A 20 20 0 0 0 144 279" fill="none" stroke={C.sun} strokeWidth={5} />
        <path d="M480 300 A 40 40 0 0 0 488 278" fill="none" stroke={C.sun} strokeWidth={5} />
        <text x={540} y={130} fontSize={16} fill="#c48a00" textAnchor="middle" fontWeight={700}>
          angles stay the same
        </text>
      </Show>
      <Show when={step >= 3}>
        <Poly points={[A, mAB, mAC]} fill={C.violetSoft} stroke={C.violet} width={2} />
        <Poly points={[mAB, B, mBC]} fill={C.violetSoft} stroke={C.violet} width={2} />
        <Poly points={[mAC, mBC, Cc]} fill={C.violetSoft} stroke={C.violet} width={2} />
        <Poly points={[mAB, mBC, mAC]} fill="#d9d1ff" stroke={C.violet} width={2} />
        <text x={540} y={175} fontSize={18} fill={C.violet} textAnchor="middle" fontWeight={700}>
          area × k² = × 4
        </text>
      </Show>
      <Pill x={545} y={225} text="k = big ÷ small" show={step >= 4} color={C.mint} size={16} />
    </g>
  )
}

export const similarity: SceneDef = {
  id: 'similarity',
  title: 'Similar figures',
  steps: [
    'Similar shapes are like zooming in on a photo on your phone: same shape, just a different size.',
    'This triangle has been enlarged by a scale factor of 2. Every length doubles: 3 becomes 6 and 4 becomes 8.',
    'The angles don’t change at all. That’s why the shape looks exactly the same.',
    'But the area grows by the scale factor squared: $2^2 = 4$. Four small triangles fit inside the big one!',
    'To find a missing side, work out the scale factor — big side divided by matching small side — then multiply.',
  ],
  Comp: Similar,
}

export { Box, Dot }
