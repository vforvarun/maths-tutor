// Number helpers for question generators and answer checking.

export const ri = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1))
export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
/** random non-zero integer in [a,b] */
export const nz = (a: number, b: number) => {
  let n = 0
  while (n === 0) n = ri(a, b)
  return n
}
export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))

export const round = (n: number, dp = 2) => Math.round(n * 10 ** dp) / 10 ** dp

/** Format a number nicely: trims trailing zeros, uses minus sign. */
export function fmt(n: number, dp = 2): string {
  const r = round(n, dp)
  const s = Number.isInteger(r) ? String(r) : r.toFixed(dp).replace(/0+$/, '').replace(/\.$/, '')
  return s.replace('-', '−')
}
/** For LaTeX: plain minus */
export const tx = (n: number, dp = 2) => fmt(n, dp).replace('−', '-')

/** Money with 2 dp and thousands separators */
export const money = (n: number) => '\\$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const moneyPlain = (n: number) => '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Parse a typed answer: "3", "-2.5", "−4", "3/4", "1,200", "$12.50", "x=3" */
export function parseNum(input: string): number | null {
  let s = input.trim().toLowerCase().replace(/−|–/g, '-').replace(/\s+/g, '').replace(/^[a-z]=/, '').replace(/[$%°]|cm|m|units?/g, '')
  s = s.replace(/,(?=\d{3}(\D|$))/g, '') // thousands separators
  if (!s) return null
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/)
  if (frac) {
    const d = parseFloat(frac[2])
    return d === 0 ? null : parseFloat(frac[1]) / d
  }
  if (!/^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/.test(s)) return null
  return parseFloat(s)
}

export function close(a: number, b: number, tol = 0.011): boolean {
  return Math.abs(a - b) <= tol + 1e-9
}

// ---------- algebra string builders (LaTeX) ----------

/** coefficient * variable as a leading term: 1x→x, -1x→-x, 0→'' */
export function lead(c: number, v = 'x'): string {
  if (c === 0) return ''
  if (v === '') return String(c)
  if (c === 1) return v
  if (c === -1) return '-' + v
  return c + v
}
/** subsequent term with sign: +3x, - x, + 5 */
export function next(c: number, v = ''): string {
  if (c === 0) return ''
  const sign = c < 0 ? ' - ' : ' + '
  const a = Math.abs(c)
  return sign + (v && a === 1 ? v : a + v)
}
/** polynomial from [coef, var] pairs, skipping zeros */
export function poly(...terms: [number, string][]): string {
  const nzTerms = terms.filter(([c]) => c !== 0)
  if (!nzTerms.length) return '0'
  return nzTerms.map(([c, v], i) => (i === 0 ? lead(c, v) : next(c, v))).join('')
}
/** (x + a) style factor */
export const fac = (a: number, v = 'x', k = 1) => `(${lead(k, v)}${next(a)})`

export const sq = (n: number) => n * n
export const deg = (rad: number) => (rad * 180) / Math.PI
export const rad = (d: number) => (d * Math.PI) / 180

export const PYTH = [
  [3, 4, 5],
  [5, 12, 13],
  [6, 8, 10],
  [8, 15, 17],
  [9, 12, 15],
  [7, 24, 25],
  [12, 16, 20],
  [20, 21, 29],
] as const
