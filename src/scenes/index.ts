import type { ComponentType } from 'react'
import { indices, sciNotation, simpleInterest, compoundInterest } from './number'
import { expanding, factorising, equations, linearGraphs, coordinate, factQuad, quadEq, parabolas, simultaneous, inequalities } from './algebra'
import { pythagoras, trig, trigApps, trigRules, surfaceArea, volume, volume3d, similarity } from './measure'
import { statistics, bivariate, probability, conditional } from './stats'

export interface SceneDef {
  id: string
  title: string
  steps: string[] // narration for each step (may contain $maths$)
  Comp: ComponentType<{ step: number }>
}

export const SCENES: Record<string, SceneDef> = Object.fromEntries(
  [indices, sciNotation, simpleInterest, compoundInterest, expanding, factorising, equations, linearGraphs, coordinate, factQuad, quadEq, parabolas, simultaneous, inequalities, pythagoras, trig, trigApps, trigRules, surfaceArea, volume, volume3d, similarity, statistics, bivariate, probability, conditional].map((s) => [s.id, s]),
)
