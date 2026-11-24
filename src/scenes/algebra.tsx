import { motion } from 'motion/react'
import type { SceneDef } from '.'
import { C, T, Show, Box, Line, Dot, Draw, Pill, Axes, plane, fnPath, Arrow } from './kit'

// ---------- Expanding brackets ----------
function Expand({ step }: { step: number }) {
  const X0 = 150
  const Y0 = 70
  const xs = 150
  const tok = [
    ['(', 200],
    ['x', 225],
    ['+', 258],
    ['3', 290],
    [')', 315],
    ['(', 345],
    ['x', 370],
    ['+', 403],
    ['2', 435],
    [')', 460],
  ] as const
  const arc = (a: number, b: number, up: boolean, color: string, delay: number) => <Draw d={`M${a} ${up ? 150 : 190} Q ${(a + b) / 2} ${up ? 80 : 260} ${b} ${up ? 150 : 190}`} color={color} width={3} show={step === 0} delay={delay} />
  return (
    <g>
      <Show when={step === 0}>
        {tok.map(([t, x], i) => (
          <text key={i} x={x} y={172} fontSize={40} fontWeight={700} fill={t === 'x' ? C.violet : /\d/.test(t) ? C.coral : C.ink} textAnchor="middle" dominantBaseline="middle">
            {t}
          </text>
        ))}
        <text x={320} y={300} fontSize={20} fill={C.soft} textAnchor="middle">
          🎉 Everyone in the first bracket greets everyone in the second
        </text>
      </Show>
      {arc(225, 370, true, C.violet, 0.2)}
      {arc(225, 435, true, C.violet, 0.6)}
      {arc(290, 370, false, C.coral, 1)}
      {arc(290, 435, false, C.coral, 1.4)}

      <Box x={X0} y={Y0} w={240} h={210} fill="white" stroke={C.ink} show={step >= 1} r={4} />
      <Box x={X0} y={Y0} w={xs} h={xs} fill={C.violetSoft} stroke={C.violet} show={step >= 2} r={4} />
      <Box x={X0 + xs} y={Y0} w={90} h={xs} fill={C.coralSoft} stroke={C.coral} show={step >= 3} r={4} />
      <Box x={X0} y={Y0 + xs} w={xs} h={60} fill={C.mintSoft} stroke={C.mint} show={step >= 3} r={4} delay={0.3} />
      <Box x={X0 + xs} y={Y0 + xs} w={90} h={60} fill={C.sunSoft} stroke={C.sun} show={step >= 4} r={4} />
      <T x={X0 + 75} y={Y0 - 22} show={step >= 1} color={C.violet}>x</T>
      <T x={X0 + 195} y={Y0 - 22} show={step >= 1} color={C.coral}>+ 3</T>
      <T x={X0 - 24} y={Y0 + 75} show={step >= 1} color={C.violet}>x</T>
      <T x={X0 - 30} y={Y0 + 180} show={step >= 1} color={C.coral}>+ 2</T>
      <T x={X0 + 75} y={Y0 + 75} size={30} show={step >= 2} color={C.violet}>x²</T>
      <T x={X0 + 195} y={Y0 + 75} size={28} show={step >= 3} color={C.coral}>3x</T>
      <T x={X0 + 75} y={Y0 + 180} size={28} show={step >= 3} color={C.mint}>2x</T>
      <T x={X0 + 195} y={Y0 + 180} size={28} show={step >= 4} color={C.sun}>6</T>
      <T x={520} y={130} size={22} show={step >= 5}>x² + 3x + 2x + 6</T>
      <T x={520} y={175} size={30} show={step >= 5} color={C.violet} delay={0.5}>= x² + 5x + 6</T>
      <Pill x={520} y={240} text="Add up all the pieces!" show={step >= 5} color={C.mint} size={15} delay={0.8} />
    </g>
  )
}

export const expanding: SceneDef = {
  id: 'expanding',
  title: 'Expanding brackets',
  steps: [
    'Expanding brackets is like a party where everyone in the first bracket must shake hands with everyone in the second bracket. Four handshakes!',
    'Let’s expand $(x + 3)(x + 2)$. Picture a rectangle that is $x + 3$ wide and $x + 2$ tall.',
    'Split it into pieces. The big square is $x \\times x = x^2$.',
    'The two long pieces are $3 \\times x = 3x$ and $2 \\times x = 2x$.',
    'And the little corner is $3 \\times 2 = 6$.',
    'Add up all the pieces: $x^2 + 3x + 2x + 6$. Collect like terms to get $x^2 + 5x + 6$.',
  ],
  Comp: Expand,
}

// ---------- Factorising (common factor) ----------
function Factor({ step }: { step: number }) {
  return (
    <g>
      <T x={320} y={70} size={22} color={C.soft} show={step === 0}>
        🧳 Expanding = unpacking · Factorising = packing up
      </T>
      <T x={320} y={150} size={34} show={step === 0}>3(2x + 3)  ⇄  6x + 9</T>
      <Box x={150} y={140} w={140} h={80} fill={C.violetSoft} stroke={C.violet} show={step >= 1 && step < 3} />
      <Box x={350} y={140} w={140} h={80} fill={C.mintSoft} stroke={C.mint} show={step >= 1 && step < 3} />
      <T x={220} y={180} size={34} show={step === 1} color={C.violet}>6x</T>
      <T x={300} y={180} size={34} show={step === 1}>+</T>
      <T x={420} y={180} size={34} show={step === 1} color={C.mint}>9</T>
      <T x={220} y={180} size={30} show={step === 2} color={C.violet}>
        <tspan fill={C.coral}>3</tspan> × 2x
      </T>
      <T x={420} y={180} size={30} show={step === 2} color={C.mint}>
        <tspan fill={C.coral}>3</tspan> × 3
      </T>
      <T x={320} y={265} size={20} show={step === 2} color={C.coral}>Highest common factor: 3</T>
      <T x={320} y={180} size={50} show={step >= 3}>
        <tspan fill={C.coral}>3</tspan>(<tspan fill={C.violet}>2x</tspan> + <tspan fill={C.mint}>3</tspan>)
      </T>
      <Arrow x1={240} y1={225} x2={300} y2={275} show={step >= 4} color={C.violet} />
      <Arrow x1={240} y1={225} x2={380} y2={275} show={step >= 4} color={C.mint} delay={0.3} />
      <T x={320} y={300} size={26} show={step >= 4} delay={0.5}>6x + 9 ✓</T>
    </g>
  )
}

export const factorising: SceneDef = {
  id: 'factorising',
  title: 'Factorising',
  steps: [
    'Factorising is expanding in reverse. If expanding is unpacking a suitcase, factorising is packing it back up neatly.',
    'Look at $6x + 9$. What do both terms have in common?',
    '$6x$ is $3 \\times 2x$ and $9$ is $3 \\times 3$. Both contain a 3 — that’s the highest common factor.',
    'Pull the 3 out the front and put what’s left inside the brackets: $3(2x + 3)$.',
    'Always check by expanding: $3 \\times 2x = 6x$ and $3 \\times 3 = 9$. It matches!',
  ],
  Comp: Factor,
}

// ---------- Linear equations: balance ----------
function Balance({ step }: { step: number }) {
  const bags = step >= 3 ? 1 : 2
  const leftBlocks = step >= 2 ? 0 : 3
  const rightBlocks = step >= 3 ? 4 : step >= 2 ? 8 : 11
  const eq = ['', '2x + 3 = 11', '2x = 8', 'x = 4', '2 × 4 + 3 = 11 ✓'][step]
  return (
    <g>
      <T x={320} y={40} size={30} color={C.violet}>{eq || '⚖️'}</T>
      <path d="M320 230 L290 300 L350 300 Z" fill={C.soft} />
      <rect x={100} y={222} width={440} height={10} rx={5} fill={C.ink} />
      {Array.from({ length: 2 }, (_, i) => (
        <motion.g key={'bag' + i} initial={false} animate={{ opacity: i < bags ? 1 : 0, y: i < bags ? 0 : -30 }} transition={{ duration: 0.6 }}>
          <rect x={108 + i * 50} y={164} width={46} height={56} rx={14} fill={C.violet} />
          <text x={131 + i * 50} y={193} fontSize={24} fill="white" fontWeight={700} textAnchor="middle" dominantBaseline="middle">
            x
          </text>
        </motion.g>
      ))}
      {Array.from({ length: 3 }, (_, i) => (
        <motion.rect key={'lb' + i} initial={false} animate={{ opacity: i < leftBlocks ? 1 : 0, y: i < leftBlocks ? 192 : 140 }} transition={{ duration: 0.6, delay: i * 0.1 }} x={212 + i * 32} width={28} height={28} rx={5} fill={C.sun} stroke="#e6a800" strokeWidth={2} />
      ))}
      {Array.from({ length: 11 }, (_, i) => {
        const col = i % 6
        const row = Math.floor(i / 6)
        return <motion.rect key={'rb' + i} initial={false} animate={{ opacity: i < rightBlocks ? 1 : 0, y: i < rightBlocks ? 192 - row * 32 : 120 }} transition={{ duration: 0.6, delay: (10 - i) * 0.05 }} x={336 + col * 32} width={28} height={28} rx={5} fill={C.sun} stroke="#e6a800" strokeWidth={2} />
      })}
      <Pill x={200} y={100} text="− 3" color={C.coral} show={step === 2} />
      <Pill x={440} y={100} text="− 3" color={C.coral} show={step === 2} />
      <Pill x={200} y={100} text="÷ 2" color={C.mint} show={step === 3} />
      <Pill x={440} y={100} text="÷ 2" color={C.mint} show={step === 3} />
      <T x={320} y={335} size={18} color={C.soft} show={step === 0}>
        Both sides weigh the same
      </T>
    </g>
  )
}

export const equations: SceneDef = {
  id: 'equations',
  title: 'Solving equations',
  steps: [
    'An equation is like a balance scale: both sides weigh exactly the same.',
    'Here, two mystery bags, each holding $x$ blocks, plus 3 blocks balance 11 blocks. That’s $2x + 3 = 11$.',
    'Whatever you do to one side, you must do to the other. Take 3 blocks off both sides: $2x = 8$.',
    'Two bags balance 8 blocks, so halve both sides: $x = 4$.',
    'Check: $2 \\times 4 + 3 = 11$. Undo the operations in reverse order, and always keep the scales balanced!',
  ],
  Comp: Balance,
}

// ---------- Linear graphs ----------
function LinearG({ step }: { step: number }) {
  const ox = 300
  const oy = 220
  const u = 30
  const { px, py } = plane(ox, oy, u)
  const d1 = fnPath((x) => 2 * x + 1, -2, 1.5, px, py)
  const d2 = fnPath((x) => -x + 3, -1, 6, px, py)
  return (
    <g>
      <Show when={step === 0}>
        <text x={110} y={60} fontSize={20} fill={C.soft} textAnchor="middle">
          🛹 steeper ramp
        </text>
        <text x={110} y={84} fontSize={20} fill={C.soft} textAnchor="middle">
          = bigger gradient
        </text>
      </Show>
      <Axes ox={ox} oy={oy} unit={u} xr={[-7, 7]} yr={[-4, 4]} />
      <motion.path initial={false} animate={{ d: step >= 5 ? d2 : d1, stroke: step >= 5 ? C.coral : C.violet }} transition={{ duration: 1.2 }} fill="none" strokeWidth={5} strokeLinecap="round" />
      <Line x1={px(0)} y1={py(1)} x2={px(1)} y2={py(1)} color={C.mint} width={4} show={step >= 1 && step < 5} />
      <Line x1={px(1)} y1={py(1)} x2={px(1)} y2={py(3)} color={C.coral} width={4} show={step >= 1 && step < 5} delay={0.4} />
      <T x={px(0.5)} y={py(1) + 18} size={16} color={C.mint} show={step >= 1 && step < 5}>run 1</T>
      <T x={px(1) + 40} y={py(2)} size={16} color={C.coral} show={step >= 1 && step < 5}>rise 2</T>
      <Pill x={520} y={90} text="m = rise ÷ run = 2" show={step >= 2 && step < 5} color={C.coral} size={16} />
      <Dot x={px(0)} y={py(step >= 5 ? 3 : 1)} show={step >= 3} color={C.sun} r={9} />
      <Pill x={520} y={140} text={step >= 5 ? 'c = 3' : 'c = 1 (y-intercept)'} show={step >= 3} color={C.sun} size={16} />
      <Pill x={520} y={200} text={step >= 5 ? 'y = −x + 3' : 'y = 2x + 1'} show={step >= 4} color={step >= 5 ? C.coral : C.violet} size={20} />
      <T x={530} y={250} size={14} color={C.coral} show={step >= 5}>downhill = negative</T>
    </g>
  )
}

export const linearGraphs: SceneDef = {
  id: 'linear-graphs',
  title: 'Gradient and y = mx + c',
  steps: [
    'The gradient tells you how steep a line is — like a skateboard ramp. The bigger the gradient, the steeper the ramp!',
    'Gradient is rise over run. From a point on the line, go across (the run), then up to meet the line again (the rise).',
    'Here we go across 1 and up 2, so the gradient is $m = 2$.',
    'The y-intercept, $c$, is where the line crosses the y-axis — the starting height. Here $c = 1$.',
    'Put them together: $y = mx + c$ becomes $y = 2x + 1$.',
    'A negative gradient goes downhill, like $y = -x + 3$. Always read lines from left to right, like reading a book.',
  ],
  Comp: LinearG,
}

// ---------- Distance & midpoint ----------
function Coord({ step }: { step: number }) {
  const { px, py } = plane(110, 300, 40)
  return (
    <g>
      <Axes ox={110} oy={300} unit={40} xr={[0, 9]} yr={[0, 6]} />
      <Dot x={px(1)} y={py(1)} color={C.violet} r={10} />
      <Dot x={px(7)} y={py(5)} color={C.coral} r={10} />
      <T x={px(1) - 10} y={py(1) - 24} size={16}>A(1, 1)</T>
      <T x={px(7) + 10} y={py(5) - 24} size={16}>B(7, 5)</T>
      <Line x1={px(1)} y1={py(1)} x2={px(7)} y2={py(1)} color={C.mint} width={4} show={step >= 1} />
      <Line x1={px(7)} y1={py(1)} x2={px(7)} y2={py(5)} color={C.sun} width={4} show={step >= 1} delay={0.4} />
      <T x={px(4)} y={py(1) + 20} size={16} color={C.mint} show={step >= 1}>run = 6</T>
      <T x={px(7) + 44} y={py(3)} size={16} color="#c48a00" show={step >= 1}>rise = 4</T>
      <Line x1={px(1)} y1={py(1)} x2={px(7)} y2={py(5)} color={C.violet} width={4} show={step >= 2} dash="10 8" />
      <Pill x={540} y={90} text="d = √(6² + 4²) ≈ 7.2" show={step >= 2} color={C.violet} size={15} />
      <Dot x={px(4)} y={py(3)} color={C.pink} r={11} show={step >= 3} />
      <T x={px(4) - 50} y={py(3) - 22} size={16} color={C.pink} show={step >= 3}>M(4, 3)</T>
      <Pill x={545} y={150} text="M = (4, 3)" show={step >= 3} color={C.pink} size={15} />
      <T x={540} y={215} size={14} color={C.soft} show={step >= 4}>Midpoint: average</T>
      <T x={540} y={240} size={14} color={C.soft} show={step >= 4}>Distance: Pythagoras</T>
    </g>
  )
}

export const coordinate: SceneDef = {
  id: 'coordinate',
  title: 'Distance and midpoint',
  steps: [
    'Two friends live at A(1, 1) and B(7, 5) on a map grid. How far apart are they, and where should they meet?',
    'Draw a right-angled triangle between them: across 6, and up 4.',
    'The straight-line distance is the hypotenuse, so use Pythagoras: $d = \\sqrt{6^2 + 4^2} = \\sqrt{52} \\approx 7.2$ units.',
    'To meet exactly halfway, average the coordinates: $M = \\left(\\frac{1+7}{2}, \\frac{1+5}{2}\\right) = (4, 3)$.',
    'So: for the midpoint, average the x’s and the y’s. For distance, use Pythagoras on the run and the rise.',
  ],
  Comp: Coord,
}

// ---------- Factorising quadratics ----------
function FactQuad({ step }: { step: number }) {
  const ux = 130
  const u = 26
  const ox = 210
  const oy = 70
  type R = { x: number; y: number; w: number; h: number; f: string; s: string }
  const tiles: R[] = []
  const arranged = step >= 3
  // x²
  tiles.push(arranged ? { x: ox, y: oy, w: ux, h: ux, f: C.violetSoft, s: C.violet } : { x: 40, y: 110, w: ux, h: ux, f: C.violetSoft, s: C.violet })
  // 5 strips: 3 vertical, 2 horizontal when arranged
  for (let i = 0; i < 5; i++) {
    if (!arranged) tiles.push({ x: 190 + i * 34, y: 110, w: u, h: ux, f: C.coralSoft, s: C.coral })
    else if (i < 3) tiles.push({ x: ox + ux + i * u, y: oy, w: u, h: ux, f: C.coralSoft, s: C.coral })
    else tiles.push({ x: ox, y: oy + ux + (i - 3) * u, w: ux, h: u, f: C.coralSoft, s: C.coral })
  }
  for (let i = 0; i < 6; i++) {
    if (!arranged) tiles.push({ x: 380 + (i % 3) * 32, y: 150 + Math.floor(i / 3) * 32, w: u, h: u, f: C.sunSoft, s: C.sun })
    else tiles.push({ x: ox + ux + (i % 3) * u, y: oy + ux + Math.floor(i / 3) * u, w: u, h: u, f: C.sunSoft, s: C.sun })
  }
  return (
    <g>
      <T x={320} y={60} size={36} show={step <= 1} color={C.violet}>x² + 5x + 6</T>
      <T x={320} y={120} size={20} show={step === 0} color={C.soft}>🔍 Find two numbers that…</T>
      <T x={220} y={170} size={26} show={step === 0} color={C.coral}>multiply to 6</T>
      <T x={430} y={170} size={26} show={step === 0} color={C.mint}>add to 5</T>
      <T x={320} y={150} size={24} show={step === 1}>1 × 6 = 6 → 1 + 6 = 7 ✗</T>
      <T x={320} y={200} size={24} show={step === 1} color={C.mint} delay={0.5}>2 × 3 = 6 → 2 + 3 = 5 ✓</T>
      {tiles.map((t, i) => (
        <Box key={i} x={t.x} y={t.y} w={t.w} h={t.h} fill={t.f} stroke={t.s} show={step >= 2} r={3} delay={step === 3 ? i * 0.04 : 0} />
      ))}
      <T x={320} y={300} size={18} show={step === 2} color={C.soft}>x² tile · five x-strips · six unit squares</T>
      <T x={ox + ux / 2} y={oy - 20} size={22} show={step >= 3} color={C.violet}>x</T>
      <T x={ox + ux + 39} y={oy - 20} size={22} show={step >= 3} color={C.coral}>+ 3</T>
      <T x={ox - 22} y={oy + ux / 2} size={22} show={step >= 3} color={C.violet}>x</T>
      <T x={ox - 28} y={oy + ux + 26} size={22} show={step >= 3} color={C.coral}>+ 2</T>
      <Pill x={470} y={310} text="x² + 5x + 6 = (x + 2)(x + 3)" show={step >= 4} color={C.violet} size={16} />
    </g>
  )
}

export const factQuad: SceneDef = {
  id: 'factorise-quad',
  title: 'Factorising quadratics',
  steps: [
    'To factorise $x^2 + 5x + 6$ we play detective: find two numbers that multiply to 6 and add to 5.',
    'Pairs that multiply to 6 are 1 and 6, or 2 and 3. Which pair adds to 5? It’s 2 and 3!',
    'Here’s why it works. Take the tiles: one $x^2$ square, five $x$ strips and six little unit squares.',
    'They fit together perfectly into a rectangle that is $x + 3$ wide and $x + 2$ tall.',
    'So $x^2 + 5x + 6 = (x + 2)(x + 3)$. Expand it to check!',
  ],
  Comp: FactQuad,
}

// ---------- Solving quadratics ----------
function QuadEq({ step }: { step: number }) {
  const { px, py } = plane(320, 200, 25)
  return (
    <g>
      <Show when={step <= 2}>
        <text x={320} y={70} fontSize={28} fontWeight={700} textAnchor="middle" fill={C.ink}>
          ? × ? = 0
        </text>
        <text x={320} y={110} fontSize={18} textAnchor="middle" fill={C.soft}>
          If a product is zero, one of the factors must be zero
        </text>
      </Show>
      <T x={320} y={170} size={34} show={step >= 1 && step <= 2} color={C.violet}>(x − 1)(x + 3) = 0</T>
      <T x={210} y={235} size={26} show={step >= 1 && step <= 2} color={C.coral}>x − 1 = 0</T>
      <T x={430} y={235} size={26} show={step >= 1 && step <= 2} color={C.mint}>x + 3 = 0</T>
      <T x={210} y={285} size={30} show={step === 2} color={C.coral}>x = 1</T>
      <T x={430} y={285} size={30} show={step === 2} color={C.mint}>x = −3</T>
      <Show when={step >= 3}>
        <Axes ox={320} oy={200} unit={25} xr={[-7, 7]} yr={[-5, 5]} />
      </Show>
      <Draw d={fnPath((x) => x * x + 2 * x - 3, -4, 2, px, py)} show={step >= 3} color={C.violet} width={4} />
      <Dot x={px(1)} y={py(0)} show={step >= 3} color={C.coral} r={9} delay={0.8} />
      <Dot x={px(-3)} y={py(0)} show={step >= 3} color={C.mint} r={9} delay={0.8} />
      <T x={px(1) + 26} y={py(0) + 22} size={16} color={C.coral} show={step >= 3}>x = 1</T>
      <T x={px(-3) - 30} y={py(0) + 22} size={16} color={C.mint} show={step >= 3}>x = −3</T>
      <Pill x={140} y={40} text="= 0 → factorise → NFL" show={step >= 4} color={C.violet} size={15} />
    </g>
  )
}

export const quadEq: SceneDef = {
  id: 'quadratic-eq',
  title: 'Solving quadratic equations',
  steps: [
    'If two numbers multiply to give zero, at least one of them must be zero. This is called the Null Factor Law.',
    'Solve $(x - 1)(x + 3) = 0$. Either $x - 1 = 0$, or $x + 3 = 0$.',
    'So $x = 1$ or $x = -3$. A quadratic can have two answers!',
    'On a graph, these answers are where the parabola $y = (x - 1)(x + 3)$ crosses the x-axis.',
    'The recipe: rearrange so the equation equals zero, factorise, then use the Null Factor Law.',
  ],
  Comp: QuadEq,
}

// ---------- Parabolas ----------
function Parab({ step }: { step: number }) {
  const { px, py } = plane(320, 190, 24)
  const clip: [number, number] = [-6.5, 6.5]
  const paths = [
    fnPath((x) => x * x, -2.6, 2.6, px, py, clip),
    fnPath((x) => x * x, -2.6, 2.6, px, py, clip),
    fnPath((x) => (x - 2) ** 2, -0.6, 4.6, px, py, clip),
    fnPath((x) => (x - 2) ** 2 - 3, -1, 5, px, py, clip),
    fnPath((x) => -((x - 2) ** 2) + 3, -1, 5, px, py, clip),
    fnPath((x) => -((x - 2) ** 2) + 3, -1, 5, px, py, clip),
  ]
  const tp = [
    [0, 0],
    [0, 0],
    [2, 0],
    [2, -3],
    [2, 3],
    [2, 3],
  ][step]
  const label = ['', 'y = x²', 'y = (x − 2)²', 'y = (x − 2)² − 3', 'y = −(x − 2)² + 3', 'y = a(x − h)² + k'][step]
  return (
    <g>
      <Axes ox={320} oy={190} unit={24} xr={[-7, 7]} yr={[-6, 6]} />
      <Show when={step === 0}>
        <text x={130} y={60} fontSize={20} fill={C.soft} textAnchor="middle">
          ⛲ 🏀 the path of a thrown ball
        </text>
      </Show>
      <motion.path initial={false} animate={{ d: paths[step], stroke: step >= 4 ? C.coral : C.violet }} transition={{ duration: 1.1 }} fill="none" strokeWidth={5} strokeLinecap="round" />
      <Dot x={px(tp[0])} y={py(tp[1])} color={C.sun} r={9} show={step >= 1} />
      <Pill x={520} y={60} text={label} show={step >= 1} color={step >= 4 ? C.coral : C.violet} size={17} />
      <T x={520} y={110} size={16} color={C.soft} show={step >= 1 && step < 5}>
        turning point ({tp[0]}, {tp[1]})
      </T>
      <T x={520} y={110} size={16} color={C.soft} show={step >= 5}>turning point (h, k)</T>
      <Arrow x1={px(0)} y1={py(-1)} x2={px(2) - 6} y2={py(-1)} show={step === 2} color={C.mint} />
      <Arrow x1={px(2) + 30} y1={py(0)} x2={px(2) + 30} y2={py(-3) + 4} show={step === 3} color={C.mint} />
    </g>
  )
}

export const parabolas: SceneDef = {
  id: 'parabolas',
  title: 'Graphing parabolas',
  steps: [
    'A parabola is the curved path of a ball you throw, or the water from a drinking fountain.',
    'The basic parabola is $y = x^2$. Its lowest point, the turning point, is at (0, 0).',
    '$y = (x - 2)^2$ slides it 2 units to the right. Careful — minus inside the bracket means move right!',
    '$y = (x - 2)^2 - 3$ slides it down 3 more. The turning point is now (2, −3).',
    'A negative in front, $y = -(x - 2)^2 + 3$, flips it upside down — just like the path of a thrown ball.',
    'In turning point form, $y = a(x - h)^2 + k$, the turning point is $(h, k)$, and the sign of $a$ tells you which way it opens.',
  ],
  Comp: Parab,
}

// ---------- Simultaneous equations ----------
function Simul({ step }: { step: number }) {
  const { px, py } = plane(110, 310, 36)
  return (
    <g>
      <Axes ox={110} oy={310} unit={36} xr={[0, 8]} yr={[0, 7]} />
      {[1, 2, 3, 4, 5].map((x, i) => (
        <Dot key={x} x={px(x)} y={py(6 - x)} r={7} color={C.violet} show={step === 1} delay={i * 0.15} />
      ))}
      <Draw d={`M${px(0)} ${py(6)} L${px(6)} ${py(0)}`} show={step >= 1} color={C.violet} delay={step === 1 ? 0.9 : 0} />
      <Draw d={`M${px(0)} ${py(0)} L${px(3.5)} ${py(7)}`} show={step >= 2} color={C.coral} />
      <Pill x={500} y={70} text="Clue 1: x + y = 6" show={step >= 1} color={C.violet} size={16} />
      <Pill x={500} y={120} text="Clue 2: y = 2x" show={step >= 2} color={C.coral} size={16} />
      <Dot x={px(2)} y={py(4)} r={12} color={C.sun} show={step >= 3} />
      <T x={px(2) + 50} y={py(4) - 4} size={20} show={step >= 3}>(2, 4)</T>
      <T x={500} y={190} size={18} show={step >= 4}>x + 2x = 6</T>
      <T x={500} y={220} size={18} show={step >= 4} delay={0.3}>3x = 6 → x = 2</T>
      <T x={500} y={250} size={18} show={step >= 4} delay={0.6}>y = 2 × 2 = 4</T>
    </g>
  )
}

export const simultaneous: SceneDef = {
  id: 'simultaneous',
  title: 'Simultaneous equations',
  steps: [
    'Simultaneous equations are like two clues about the same two mystery numbers.',
    'Clue 1: $x + y = 6$. Lots of pairs work — (1, 5), (2, 4), (3, 3)… and they all lie on a straight line.',
    'Clue 2: $y = 2x$. The pairs that fit this clue lie on a different line.',
    'Only one point fits both clues — where the two lines cross: (2, 4).',
    'Algebra gives the same answer. Substitute $y = 2x$ into $x + y = 6$: $3x = 6$, so $x = 2$ and $y = 4$.',
  ],
  Comp: Simul,
}

// ---------- Inequalities ----------
function Ineq({ step }: { step: number }) {
  const px = (v: number) => 320 + v * 48
  const ticks = Array.from({ length: 11 }, (_, i) => i - 5)
  const ray = (from: number, right: boolean, closed: boolean, color: string, show: boolean) => (
    <Show when={show}>
      <line x1={px(from)} y1={230} x2={right ? 590 : 50} y2={230} stroke={color} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
      <path d={right ? 'M580 218 L598 230 L580 242' : 'M60 218 L42 230 L60 242'} fill={color} />
      <circle cx={px(from)} cy={230} r={11} fill={closed ? color : 'white'} stroke={color} strokeWidth={4} />
    </Show>
  )
  return (
    <g>
      <T x={320} y={70} size={30} show={step === 0}>🎢 You must be at least 140 cm</T>
      <T x={320} y={125} size={34} show={step === 0} color={C.violet}>h ≥ 140</T>
      <line x1={50} y1={230} x2={590} y2={230} stroke={C.soft} strokeWidth={2} />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={px(t)} y1={222} x2={px(t)} y2={238} stroke={C.soft} strokeWidth={2} />
          <text x={px(t)} y={262} fontSize={15} fill={C.soft} textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      {ray(2, true, false, C.violet, step === 1)}
      {ray(-1, false, true, C.coral, step === 2)}
      {ray(-3, true, false, C.mint, step >= 4)}
      <T x={320} y={90} size={34} show={step === 1} color={C.violet}>x &gt; 2   (open circle)</T>
      <T x={320} y={90} size={34} show={step === 2} color={C.coral}>x ≤ −1   (closed circle)</T>
      <T x={320} y={70} size={32} show={step >= 3}>−2x &lt; 6</T>
      <T x={320} y={120} size={24} show={step === 3} color={C.soft}>÷ (−2) on both sides…</T>
      <T x={320} y={125} size={34} show={step >= 4} color={C.mint}>x &gt; −3  🔄 sign flipped!</T>
    </g>
  )
}

export const inequalities: SceneDef = {
  id: 'inequalities',
  title: 'Inequalities',
  steps: [
    'An inequality is like the height sign at a theme park: you must be at least 140 cm. That’s $h \\ge 140$ — lots of heights work, not just one.',
    'On a number line, $x > 2$ has an open circle at 2, because 2 itself doesn’t count, and an arrow to the right.',
    '$x \\le -1$ uses a closed, filled-in circle, because −1 is included.',
    'Solve inequalities just like equations… with one twist. To solve $-2x < 6$, we divide by −2…',
    '…and we must FLIP the sign: $x > -3$. Multiplying or dividing by a negative number reverses the direction.',
  ],
  Comp: Ineq,
}
