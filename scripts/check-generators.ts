// Stress-tests every question generator and all lesson maths.
import katex from 'katex'
import { TOPICS } from '../src/data/topics'
import { SCENES } from '../src/scenes'
import { warmupQuestion } from '../src/gens/warmup'
import type { Problem, Level } from '../src/lib/problem'

let problems = 0
const seen = new Set<string>()
const bad = (m: string) => {
  if (seen.has(m)) return
  seen.add(m)
  problems++
  if (problems < 40) console.log('✗', m)
}

function mathOk(text: string, where: string) {
  const t = text.replaceAll('\\$', '\u0001')
  const re = /\$\$([^$]+)\$\$|\$([^$]+)\$/g
  let m
  while ((m = re.exec(t))) {
    const tex = (m[1] ?? m[2]).replaceAll('\u0001', '\\$')
    try {
      katex.renderToString(tex, { throwOnError: true, strict: false })
    } catch (e) {
      bad(`${where}: KaTeX error in "${tex}": ${(e as Error).message.slice(0, 80)}`)
    }
  }
  const stray = t.replace(re, '').match(/\$/g)
  if (stray) bad(`${where}: unmatched $ in "${text.slice(0, 80)}"`)
  if (/undefined|NaN|Infinity|\[object/.test(text)) bad(`${where}: bad value in "${text.slice(0, 100)}"`)
}

function checkProblem(p: Problem, where: string) {
  mathOk(p.q, where + ' q')
  p.steps.forEach((s) => mathOk(s, where + ' step'))
  if (p.hint) mathOk(p.hint, where + ' hint')
  if (!p.steps.length) bad(`${where}: no steps`)
  if (p.kind === 'num' && !Number.isFinite(p.ans)) bad(`${where}: non-finite answer ${p.ans}`)
  if (p.kind === 'mcq') {
    if (!p.options || p.options.length < 2) bad(`${where}: <2 options`)
    else if (new Set(p.options).size !== p.options.length) bad(`${where}: duplicate options ${p.options}`)
    p.options?.forEach((o) => mathOk(o, where + ' option'))
  }
  if (p.kind === 'multi') p.fields!.forEach((f) => !Number.isFinite(f.ans) && bad(`${where}: non-finite field ${f.label}`))
}

let count = 0
for (const t of TOPICS) {
  if (!SCENES[t.scene]) bad(`${t.id}: missing scene ${t.scene}`)
  mathOk(t.lesson, t.id + ' lesson')
  mathOk(t.analogy.text, t.id + ' analogy')
  t.examples.forEach((e) => [e.q, ...e.steps].forEach((s) => mathOk(s, t.id + ' example')))
  t.mistakes.forEach((m) => mathOk(m, t.id + ' mistake'))
  t.formulas.forEach((f) => {
    try {
      katex.renderToString(f, { throwOnError: true })
    } catch (e) {
      bad(`${t.id} formula "${f}": ${(e as Error).message.slice(0, 60)}`)
    }
  })
  t.gens.forEach((g, gi) => {
    for (const d of [1, 2, 3] as Level[]) {
      for (let k = 0; k < 400; k++) {
        try {
          checkProblem(g(d), `${t.id}#${gi} d${d}`)
          count++
        } catch (e) {
          bad(`${t.id}#${gi} d${d}: threw ${(e as Error).message}`)
        }
      }
    }
  })
}
for (const s of Object.values(SCENES)) s.steps.forEach((x) => mathOk(x, 'scene ' + s.id))
for (let k = 0; k < 500; k++) checkProblem(warmupQuestion(), 'warmup')

console.log(`${TOPICS.length} topics, ${Object.keys(SCENES).length} animated lessons, ${TOPICS.reduce((a, t) => a + t.gens.length, 0)} generators, ${count} questions generated`)
console.log(problems ? `${problems} problem(s)` : 'All generator checks passed ✓')
process.exit(problems ? 1 : 0)
