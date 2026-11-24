import { shuffle } from './num'

export type Fig =
  | { type: 'tri'; opp?: string; adj?: string; hyp?: string; angle?: string; highlight?: 'opp' | 'adj' | 'hyp' }
  | { type: 'graph'; lines?: { m: number; c: number; color?: string }[]; points?: { x: number; y: number; label?: string }[]; parabola?: { a: number; h: number; k: number } }
  | { type: 'scatter'; points: [number, number][]; xLabel: string; yLabel: string }

export interface Problem {
  q: string
  kind: 'num' | 'mcq' | 'multi'
  ans?: number
  tol?: number
  unit?: string
  options?: string[] // first is correct (shuffled on display)
  fields?: { label: string; ans: number }[]
  unordered?: boolean
  steps: string[]
  hint?: string
  fig?: Fig
}

export type Level = 1 | 2 | 3
export type Gen = (d: Level) => Problem

/** Build MCQ options, removing duplicates of the correct answer. */
export function mcq(q: string, correct: string, wrong: string[], steps: string[], hint?: string, fig?: Fig): Problem {
  const uniq = [...new Set(wrong.filter((w) => w !== correct))]
  return { q, kind: 'mcq', options: [correct, ...shuffle(uniq).slice(0, 3)], steps, hint, fig }
}

export function num(q: string, ans: number, steps: string[], opts: { tol?: number; unit?: string; hint?: string; fig?: Fig } = {}): Problem {
  return { q, kind: 'num', ans, steps, tol: opts.tol, unit: opts.unit, hint: opts.hint, fig: opts.fig }
}

export function multi(q: string, fields: { label: string; ans: number }[], steps: string[], opts: { unordered?: boolean; tol?: number; hint?: string; fig?: Fig } = {}): Problem {
  return { q, kind: 'multi', fields, steps, unordered: opts.unordered, tol: opts.tol, hint: opts.hint, fig: opts.fig }
}
