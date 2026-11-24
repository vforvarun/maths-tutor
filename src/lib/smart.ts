// SmartScore (IXL-style) mastery scoring and mistake diagnosis.
import type { Level, Problem } from './problem'
import { parseNum, close } from './num'

export const PERFECT = 100

/** Points gained/lost. Gains shrink near 100; losses grow in the Challenge Zone. */
export function updateSmart(score: number, ok: boolean): number {
  if (ok) {
    const gain = score < 40 ? 12 : score < 60 ? 8 : score < 75 ? 6 : score < 90 ? 4 : 2
    return Math.min(PERFECT, score + gain)
  }
  const loss = score < 40 ? 3 : score < 60 ? 5 : score < 75 ? 6 : score < 90 ? 8 : 10
  return Math.max(0, score - loss)
}

export function difficultyFor(score: number): Level {
  return score < 40 ? 1 : score < 75 ? 2 : 3
}

export interface Zone {
  name: string
  emoji: string
  color: string
  blurb: string
}
export function zoneFor(score: number): Zone {
  if (score >= PERFECT) return { name: 'Mastered!', emoji: '🏆', color: '#2ec4b6', blurb: 'Perfect score. You’ve mastered this topic!' }
  if (score >= 90) return { name: 'Challenge Zone', emoji: '🔥', color: '#ff6b6b', blurb: 'Harder questions. Each mistake costs more — slow down and check.' }
  if (score >= 75) return { name: 'Almost there', emoji: '🚀', color: '#ffbe0b', blurb: 'Great progress. Keep your accuracy up to reach the Challenge Zone at 90.' }
  if (score >= 40) return { name: 'Improving', emoji: '📈', color: '#3a86ff', blurb: 'You’re getting the hang of it. Questions are getting a little harder.' }
  return { name: 'Warming up', emoji: '🌱', color: '#6246ea', blurb: 'Building the basics. Take your time and use the hints.' }
}

/** Try to explain WHY a numeric answer is wrong, by spotting common slips. */
export function diagnose(p: Problem, vals: string[], topic?: string): string | null {
  if (p.kind === 'mcq') return null
  const tol = p.tol ?? 0.011
  const near = (a: number, b: number) => close(a, b, Math.max(tol, Math.abs(b) * 0.002))

  if (p.kind === 'multi') {
    const nums = vals.map(parseNum)
    if (nums.some((n) => n === null)) return 'Fill in every box with a number (fractions like 3/4 and negatives like −2 are fine).'
    const answers = p.fields!.map((f) => f.ans)
    if (nums.every((n, i) => near(-n!, p.unordered ? answers.find((a) => near(-n!, a)) ?? NaN : answers[i]))) return 'All your signs are flipped! Remember: if $(x - 3) = 0$ then $x = +3$. The solution has the **opposite** sign to the number in the bracket.'
    const rightCount = p.unordered ? nums.filter((n) => answers.some((a) => near(n!, a))).length : nums.filter((n, i) => near(n!, answers[i])).length
    if (!p.unordered && nums.length === 2 && near(nums[0]!, answers[1]) && near(nums[1]!, answers[0])) return 'You have the right numbers in the wrong boxes — check which value is $x$ and which is $y$.'
    if (rightCount > 0) return `${rightCount} of your ${nums.length} answers ${rightCount === 1 ? 'is' : 'are'} right — check the other one carefully.`
    return null
  }

  const v = parseNum(vals[0] ?? '')
  const a = p.ans!
  if (v === null) return 'That doesn’t look like a number. You can type whole numbers, decimals, negatives (−2) or fractions (3/4).'
  if (topic?.includes('prob') || topic === 'conditional') if (v > 1 || v < 0) return 'A probability is always between 0 and 1. Write it as a fraction like 3/8 or a decimal.'
  if (a !== 0 && near(v, -a)) return 'Right size, wrong sign! Check your negatives — especially when subtracting a negative or dividing by one.'
  if ((!Number.isInteger(a) || /decimal|nearest/i.test(p.q)) && Math.abs(v - a) <= Math.max(0.15, Math.abs(a) * 0.01)) return 'Very close! Check your rounding — keep full calculator accuracy until the end, then round to the decimal places asked.'
  if (a > 1 && near(v, a * a)) return 'It looks like you forgot to take the **square root** at the end.'
  if (a > 1 && near(v * v, a)) return 'It looks like you took a square root you didn’t need.'
  if (a !== 0 && v !== 0 && near(v, 1 / a)) return 'Your answer is upside down — you may have divided the wrong way round.'
  for (const k of [10, 100, 1000]) if (near(v, a * k) || near(v, a / k)) return 'The digits look right but the decimal point is in the wrong place. Count the places again.'
  if (a !== 0 && (near(v, a * 2) || near(v, a / 2))) return 'You’re out by a factor of 2. Check halving and doubling — e.g. the ½ in a triangle’s area, or dividing by 2 for a midpoint.'
  if (a !== 0 && (near(v, a * 3) || near(v, a / 3))) return 'You’re out by a factor of 3 — did you forget (or add) a ⅓, as in the volume of a cone or pyramid?'
  if (topic === 'pythagoras' || topic === 'coordinate') return 'Check which side is the hypotenuse (the longest side). To find it, **add** the squares; to find a shorter side, **subtract**.'
  if (topic === 'trig' || topic === 'trig-apps') return 'Label O, A and H from the angle first, then pick SOH, CAH or TOA. Also check your calculator is in **degrees** mode.'
  if (topic === 'simple-interest' || topic === 'compound-interest') return 'Did you write the percentage as a decimal (5% → 0.05)? And does the question want the interest, or the total amount?'
  if (topic === 'equations') return 'Try substituting your answer back into the equation — does it balance? Undo operations in reverse order.'
  return null
}
