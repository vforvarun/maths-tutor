import type { Fig } from '../lib/problem'

const C = { ink: '#1d1b3a', soft: '#5d5a7a', line: '#e3def5', violet: '#6246ea', coral: '#ff6b6b', mint: '#2ec4b6', sun: '#ffbe0b' }

export function Figure({ fig }: { fig: Fig }) {
  if (fig.type === 'tri') {
    const P = [50, 190]
    const Q = [270, 190]
    const R = [270, 40]
    const col = (k: 'opp' | 'adj' | 'hyp') => (fig.highlight === k ? C.coral : C.ink)
    return (
      <svg viewBox="0 0 330 230" className="mx-auto h-auto w-full max-w-sm">
        <path d={`M${P} L${Q} L${R} Z`} fill="#ece8ff" stroke={C.violet} strokeWidth={3} strokeLinejoin="round" />
        <path d={`M${Q[0] - 16} ${Q[1]} L${Q[0] - 16} ${Q[1] - 16} L${Q[0]} ${Q[1] - 16}`} fill="none" stroke={C.ink} strokeWidth={2} />
        {fig.highlight && <path d={fig.highlight === 'opp' ? `M${Q} L${R}` : fig.highlight === 'adj' ? `M${P} L${Q}` : `M${P} L${R}`} stroke={C.coral} strokeWidth={6} strokeLinecap="round" />}
        {fig.angle && (
          <>
            <path d="M95 190 A 45 45 0 0 0 89 166" fill="none" stroke={C.sun} strokeWidth={4} />
            <text x={106} y={178} fontSize={17} fontWeight={700} fill="#b07d00">
              {fig.angle}
            </text>
          </>
        )}
        {fig.adj && (
          <text x={160} y={216} fontSize={19} fontWeight={700} fill={col('adj')} textAnchor="middle">
            {fig.adj}
          </text>
        )}
        {fig.opp && (
          <text x={284} y={120} fontSize={19} fontWeight={700} fill={col('opp')}>
            {fig.opp}
          </text>
        )}
        {fig.hyp && (
          <text x={145} y={102} fontSize={19} fontWeight={700} fill={col('hyp')} textAnchor="end">
            {fig.hyp}
          </text>
        )}
      </svg>
    )
  }

  if (fig.type === 'graph') {
    const u = 20
    const o = 140
    const px = (x: number) => o + x * u
    const py = (y: number) => o - y * u
    const grid = []
    for (let i = -6; i <= 6; i++) {
      grid.push(<line key={'x' + i} x1={px(i)} y1={py(6)} x2={px(i)} y2={py(-6)} stroke={C.line} />)
      grid.push(<line key={'y' + i} x1={px(-6)} y1={py(i)} x2={px(6)} y2={py(i)} stroke={C.line} />)
    }
    const clip = (y: number) => Math.max(-6.5, Math.min(6.5, y))
    const parab = fig.parabola
      ? Array.from({ length: 121 }, (_, i) => {
          const x = -6 + i * 0.1
          const y = fig.parabola!.a * (x - fig.parabola!.h) ** 2 + fig.parabola!.k
          return `${i ? 'L' : 'M'}${px(x).toFixed(1)} ${py(clip(y)).toFixed(1)}`
        }).join(' ')
      : ''
    return (
      <svg viewBox="0 0 280 280" className="mx-auto h-auto w-full max-w-xs">
        <defs>
          <clipPath id="gclip">
            <rect x={px(-6)} y={py(6)} width={12 * u} height={12 * u} />
          </clipPath>
        </defs>
        {grid}
        <line x1={px(-6)} y1={o} x2={px(6)} y2={o} stroke={C.soft} strokeWidth={2} />
        <line x1={o} y1={py(6)} x2={o} y2={py(-6)} stroke={C.soft} strokeWidth={2} />
        {[-6, -4, -2, 2, 4, 6].map((n) => (
          <g key={n}>
            <text x={px(n)} y={o + 14} fontSize={10} fill={C.soft} textAnchor="middle">
              {n}
            </text>
            <text x={o - 5} y={py(n) + 3} fontSize={10} fill={C.soft} textAnchor="end">
              {n}
            </text>
          </g>
        ))}
        <g clipPath="url(#gclip)">
          {fig.lines?.map((l, i) => (
            <line key={i} x1={px(-7)} y1={py(l.m * -7 + l.c)} x2={px(7)} y2={py(l.m * 7 + l.c)} stroke={l.color ?? C.violet} strokeWidth={3.5} strokeLinecap="round" />
          ))}
          {parab && <path d={parab} fill="none" stroke={C.violet} strokeWidth={3.5} />}
        </g>
        {fig.points?.map((p, i) => (
          <g key={i}>
            <circle cx={px(p.x)} cy={py(p.y)} r={5} fill={C.coral} stroke="white" strokeWidth={2} />
            {p.label && (
              <text x={px(p.x) + 8} y={py(p.y) - 8} fontSize={12} fontWeight={700} fill={C.ink}>
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    )
  }

  // scatter
  const px = (x: number) => 40 + x * 22
  const py = (y: number) => 230 - y * 19
  return (
    <svg viewBox="0 0 300 270" className="mx-auto h-auto w-full max-w-sm">
      <line x1={40} y1={230} x2={290} y2={230} stroke={C.soft} strokeWidth={2} />
      <line x1={40} y1={230} x2={40} y2={20} stroke={C.soft} strokeWidth={2} />
      {fig.points.map(([x, y], i) => (
        <circle key={i} cx={px(x)} cy={py(y)} r={6} fill={C.coral} stroke="white" strokeWidth={2} />
      ))}
      <text x={165} y={258} fontSize={13} fill={C.soft} textAnchor="middle" fontWeight={600}>
        {fig.xLabel}
      </text>
      <text x={18} y={125} fontSize={13} fill={C.soft} textAnchor="middle" fontWeight={600} transform="rotate(-90 18 125)">
        {fig.yLabel}
      </text>
    </svg>
  )
}
