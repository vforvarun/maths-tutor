// Topics for Victorian Curriculum Mathematics, Levels 9–10.
// `lesson` markup: blank line = paragraph · "- " bullet · "> " tip · "! " common-mistake callout · $maths$ / $$display$$
import type { Gen } from '../lib/problem'
import * as N from '../gens/number'
import * as A from '../gens/algebra'
import * as M from '../gens/measure'
import * as S from '../gens/stats'

export type Strand = 'number' | 'algebra' | 'measurement' | 'space' | 'statistics' | 'probability'

export const STRANDS: Record<Strand, { name: string; emoji: string }> = {
  number: { name: 'Number', emoji: '🔢' },
  algebra: { name: 'Algebra', emoji: '🧮' },
  measurement: { name: 'Measurement', emoji: '📏' },
  space: { name: 'Space & geometry', emoji: '📐' },
  statistics: { name: 'Statistics', emoji: '📊' },
  probability: { name: 'Probability', emoji: '🎲' },
}

export interface Topic {
  id: string
  title: string
  strand: Strand
  level: 9 | 10
  emoji: string
  summary: string
  analogy: { emoji: string; title: string; text: string }
  lesson: string
  examples: { q: string; steps: string[] }[]
  mistakes: string[]
  formulas: string[]
  gens: Gen[]
  scene: string
}

const T = (t: Topic) => ({ ...t, lesson: t.lesson.trim() })

export const TOPICS: Topic[] = [
  // ================= NUMBER =================
  T({
    id: 'indices', title: 'Index laws', strand: 'number', level: 9, emoji: '⚡', scene: 'indices',
    summary: 'Shortcuts for multiplying and dividing powers.',
    analogy: { emoji: '📄', title: 'Folding paper', text: 'Fold a sheet of paper in half 5 times and it’s $2^5 = 32$ layers thick. A power is just “how many times you repeat the multiplication” — a shorthand for a long chain of the same number.' },
    lesson: `
A power (or index) tells you how many times to multiply a number by itself: $a^4 = a \\times a \\times a \\times a$. The big number is the **base**, the little number is the **index**.

The index laws are shortcuts that come from writing everything out:

- **Multiplying** the same base → **add** the indices: $a^m \\times a^n = a^{m+n}$
- **Dividing** the same base → **subtract** the indices: $a^m \\div a^n = a^{m-n}$
- **Power of a power** → **multiply** the indices: $(a^m)^n = a^{mn}$
- **Power of a product** → raise every part: $(ab)^n = a^n b^n$
- **Zero index**: anything (except 0) to the power 0 is 1: $a^0 = 1$

> With numbers in front (coefficients), deal with the numbers normally and the indices with the laws: $3x^2 \\times 4x^5 = 12x^7$.

! The laws only work when the bases are the same. $2^3 \\times 3^2$ can’t be combined into one power.`,
    examples: [
      { q: 'Simplify $5a^3 \\times 2a^4$', steps: ['Multiply the numbers: $5 \\times 2 = 10$', 'Add the indices: $3 + 4 = 7$', 'Answer: $10a^7$'] },
      { q: 'Simplify $(2x^3)^2$', steps: ['Square everything inside: $2^2 = 4$', '$(x^3)^2 = x^6$ (multiply indices)', 'Answer: $4x^6$'] },
    ],
    mistakes: ['Multiplying the indices when you should add: $x^2 \\times x^3 \\ne x^6$', 'Forgetting to raise the number: $(3x)^2 = 9x^2$, not $3x^2$', 'Thinking $x^0 = 0$ — it equals 1'],
    formulas: ['a^m \\times a^n = a^{m+n}', 'a^m \\div a^n = a^{m-n}', '(a^m)^n = a^{mn}', 'a^0 = 1'],
    gens: [N.indexMultiply, N.indexDivide, N.indexPower],
  }),
  T({
    id: 'sci-notation', title: 'Scientific notation', strand: 'number', level: 9, emoji: '🔭', scene: 'sci-notation',
    summary: 'Writing very big and very small numbers neatly.',
    analogy: { emoji: '📸', title: 'Zooming a camera', text: 'Scientific notation is like a zoom setting. The first part ($4.2$) is the picture; the power of ten tells you how far zoomed in or out you are.' },
    lesson: `
Scientific notation writes a number as:

$$a \\times 10^n \\quad\\text{where } 1 \\le a < 10$$

**Big number → scientific:** move the decimal point **left** until one non-zero digit is in front. The number of hops is the (positive) power.

$$4\\,700\\,000 = 4.7 \\times 10^6$$

**Small number → scientific:** move the decimal point **right**. The power is **negative**.

$$0.00036 = 3.6 \\times 10^{-4}$$

**Back to ordinary:** a positive power moves the point right (bigger), a negative power moves it left (smaller).

> Quick check: big numbers have positive powers, tiny numbers (less than 1) have negative powers.`,
    examples: [
      { q: 'Write $82\\,000$ in scientific notation', steps: ['Put the point after the first digit: $8.2$', 'It moved 4 places left', '$8.2 \\times 10^4$'] },
      { q: 'Write $5.06 \\times 10^{-3}$ as an ordinary number', steps: ['Negative power → move the point 3 places left', '$0.00506$'] },
    ],
    mistakes: ['Writing $47 \\times 10^5$ — the first part must be between 1 and 10', 'Getting the sign of the power backwards for small numbers'],
    formulas: ['a \\times 10^n,\\ 1 \\le a < 10'],
    gens: [N.sciToStandard, N.sciToOrdinary],
  }),
  T({
    id: 'simple-interest', title: 'Simple interest', strand: 'number', level: 9, emoji: '🏦', scene: 'simple-interest',
    summary: 'Interest that grows by the same amount each year.',
    analogy: { emoji: '🏠', title: 'Rent for money', text: 'Interest is rent paid for using someone else’s money. Borrow from the bank and you pay rent; save in the bank and the bank pays you rent.' },
    lesson: `
Simple interest is calculated on the original amount only, so you earn the **same amount every year**.

$$I = Prn$$

- $I$ = interest (\\$)
- $P$ = principal — the amount invested or borrowed
- $r$ = interest rate per year **as a decimal** (5% → 0.05)
- $n$ = number of years

The total amount at the end is $A = P + I$.

> To find the rate or time, rearrange: $r = \\dfrac{I}{Pn}$ and $n = \\dfrac{I}{Pr}$.

! Always convert the percentage to a decimal (divide by 100) before multiplying. For months, use $n = \\frac{\\text{months}}{12}$.`,
    examples: [
      { q: 'Find the simple interest on \\$2500 at 4% p.a. for 3 years', steps: ['$I = Prn = 2500 \\times 0.04 \\times 3$', '$I = \\$300$'] },
    ],
    mistakes: ['Using 4 instead of 0.04 for 4%', 'Giving the interest when the question asks for the total amount'],
    formulas: ['I = Prn', 'A = P + I'],
    gens: [N.simpleInterestG],
  }),
  T({
    id: 'compound-interest', title: 'Compound interest', strand: 'number', level: 10, emoji: '❄️', scene: 'compound-interest',
    summary: 'Earning interest on your interest — growth that speeds up.',
    analogy: { emoji: '⛄', title: 'A rolling snowball', text: 'A snowball rolling downhill picks up more snow each turn because it’s already bigger. Compound interest works the same way: each year you earn interest on a bigger amount.' },
    lesson: `
With compound interest, each year’s interest is added to the balance, and next year’s interest is calculated on the new, bigger balance.

$$A = P(1 + r)^n$$

- $A$ = final amount, $P$ = principal
- $r$ = rate per period as a decimal, $n$ = number of periods

The **interest earned** is $A - P$.

**Depreciation** (losing value, like a car) uses $1 - r$ instead:

$$A = P(1 - r)^n$$

> If interest is compounded monthly, divide the yearly rate by 12 and multiply the years by 12.

! Don’t forget to subtract the principal when the question asks for the interest only.`,
    examples: [
      { q: '\\$4000 is invested at 5% p.a. compounded annually. Find the value after 3 years.', steps: ['$A = 4000 \\times 1.05^3$', '$A = \\$4630.50$'] },
    ],
    mistakes: ['Using simple interest by mistake', 'Writing $1.5$ instead of $1.05$ for 5%'],
    formulas: ['A = P(1 + r)^n', 'A = P(1 - r)^n'],
    gens: [N.compoundG],
  }),

  // ================= ALGEBRA =================
  T({
    id: 'expanding', title: 'Expanding brackets', strand: 'algebra', level: 9, emoji: '🎉', scene: 'expanding',
    summary: 'Multiplying out brackets using the distributive law.',
    analogy: { emoji: '🤝', title: 'Party handshakes', text: 'Everything outside the bracket must shake hands with everything inside. With two brackets, everyone in the first bracket shakes hands with everyone in the second — 4 handshakes.' },
    lesson: `
**One bracket:** multiply the term outside by **every** term inside.

$$3(x + 4) = 3x + 12 \\qquad -2(x - 5) = -2x + 10$$

**Two brackets:** each term in the first multiplies each term in the second (remember **FOIL**: First, Outside, Inside, Last).

$$(x + 3)(x + 2) = x^2 + 2x + 3x + 6 = x^2 + 5x + 6$$

Then **collect like terms**.

**Special patterns** worth knowing:

- Perfect square: $(x + a)^2 = x^2 + 2ax + a^2$
- Difference of two squares: $(x + a)(x - a) = x^2 - a^2$

> Think of it as an area model: a rectangle $(x + 3)$ wide and $(x + 2)$ tall splits into four pieces.

! $(x + 3)^2$ is NOT $x^2 + 9$. Write it as $(x + 3)(x + 3)$ and expand properly.`,
    examples: [
      { q: 'Expand $(x - 4)(x + 7)$', steps: ['$x \\times x = x^2$, $x \\times 7 = 7x$, $-4 \\times x = -4x$, $-4 \\times 7 = -28$', '$x^2 + 7x - 4x - 28 = x^2 + 3x - 28$'] },
    ],
    mistakes: ['Only multiplying the first term inside: $3(x + 4) \\ne 3x + 4$', 'Sign errors with negatives', '$(x+a)^2 \\ne x^2 + a^2$'],
    formulas: ['a(b + c) = ab + ac', '(x + a)(x + b) = x^2 + (a+b)x + ab', '(x + a)^2 = x^2 + 2ax + a^2', '(x + a)(x - a) = x^2 - a^2'],
    gens: [A.expandSingle, A.expandBinomial],
  }),
  T({
    id: 'factorising', title: 'Factorising', strand: 'algebra', level: 9, emoji: '🧳', scene: 'factorising',
    summary: 'Taking out the highest common factor — expanding in reverse.',
    analogy: { emoji: '🧳', title: 'Packing a suitcase', text: 'Expanding is unpacking everything onto the bed. Factorising is packing it neatly back into the suitcase, with the common item on the outside.' },
    lesson: `
To factorise, find the **highest common factor (HCF)** of all the terms — numbers **and** letters — and put it outside the bracket.

$$6x + 9 = 3(2x + 3)$$

$$4x^2 + 6x = 2x(2x + 3)$$

**Steps:**

- Find the biggest number that divides every coefficient
- Find the letters common to every term (lowest power)
- Divide each term by the HCF to get what goes inside the brackets

> Always check by expanding your answer — you should get back to where you started.

! “Factorise fully” means take out everything common. $2(2x^2 + 3x)$ is not fully factorised — there’s still an $x$ in both terms.`,
    examples: [
      { q: 'Factorise $15a^2 - 10a$', steps: ['HCF of 15 and 10 is 5; both terms contain $a$', 'HCF $= 5a$', '$15a^2 \\div 5a = 3a$ and $-10a \\div 5a = -2$', 'Answer: $5a(3a - 2)$'] },
    ],
    mistakes: ['Not taking out the highest factor', 'Forgetting the 1: $3x + 3 = 3(x + 1)$, not $3(x)$'],
    formulas: ['ab + ac = a(b + c)'],
    gens: [A.factorHCF],
  }),
  T({
    id: 'equations', title: 'Linear equations', strand: 'algebra', level: 9, emoji: '⚖️', scene: 'equations',
    summary: 'Finding the unknown by keeping both sides balanced.',
    analogy: { emoji: '⚖️', title: 'Balance scales', text: 'An equation is a balanced scale. Whatever you do to one side, you must do to the other or it tips over.' },
    lesson: `
To solve an equation, **undo** the operations in reverse order, doing the same thing to both sides.

$$\\begin{aligned} 3x - 5 &= 16 \\\\ 3x &= 21 \\quad (+5) \\\\ x &= 7 \\quad (\\div 3) \\end{aligned}$$

**Unknown on both sides:** move all the $x$ terms to one side first.

$$5x + 2 = 2x + 14 \\Rightarrow 3x + 2 = 14 \\Rightarrow 3x = 12 \\Rightarrow x = 4$$

**Brackets:** expand first (or divide both sides by the number outside).

**Fractions:** multiply both sides by the denominator to get rid of it.

> Always check by substituting your answer back into the original equation.`,
    examples: [
      { q: 'Solve $\\dfrac{x + 3}{4} = 5$', steps: ['Multiply both sides by 4: $x + 3 = 20$', 'Subtract 3: $x = 17$'] },
    ],
    mistakes: ['Doing something to only one side', 'Undoing in the wrong order (divide before subtracting)', 'Sign errors when moving terms'],
    formulas: [],
    gens: [A.linEqTwoStep, A.linEqBothSides, A.linEqBrackets],
  }),
  T({
    id: 'linear-graphs', title: 'Linear graphs', strand: 'algebra', level: 9, emoji: '🛹', scene: 'linear-graphs',
    summary: 'Gradient, intercepts and the equation y = mx + c.',
    analogy: { emoji: '🛹', title: 'Skate ramp', text: 'The gradient is how steep the ramp is. The y-intercept is the height you start at.' },
    lesson: `
Every straight line can be written as

$$y = mx + c$$

- $m$ is the **gradient** (steepness): $m = \\dfrac{\\text{rise}}{\\text{run}} = \\dfrac{y_2 - y_1}{x_2 - x_1}$
- $c$ is the **y-intercept**: where the line crosses the y-axis

Positive gradient → goes **up** from left to right. Negative → goes **down**. Zero → flat (horizontal).

To **sketch** a line: plot the y-intercept, then use rise/run to find another point. Or find both intercepts (set $x = 0$, then set $y = 0$).

> If the equation isn’t in the form $y = mx + c$, rearrange it first: $2y = 6x + 4 \\Rightarrow y = 3x + 2$.

! Parallel lines have the same gradient.`,
    examples: [
      { q: 'Find the gradient through $(1, 2)$ and $(4, 11)$', steps: ['$m = \\dfrac{11 - 2}{4 - 1} = \\dfrac{9}{3} = 3$'] },
    ],
    mistakes: ['Doing run over rise', 'Subtracting coordinates in a different order on top and bottom', 'Reading $c$ before rearranging'],
    formulas: ['y = mx + c', 'm = \\dfrac{y_2 - y_1}{x_2 - x_1}'],
    gens: [A.gradientTwoPoints, A.readMC, A.graphToEq],
  }),
  T({
    id: 'coordinate', title: 'Distance & midpoint', strand: 'algebra', level: 9, emoji: '📍', scene: 'coordinate',
    summary: 'How far apart two points are, and the point halfway between.',
    analogy: { emoji: '🧑‍🤝‍🧑', title: 'Meeting a friend halfway', text: 'To meet a friend halfway, you average your positions. To know how far apart you are as the crow flies, Pythagoras takes the shortcut across the grid.' },
    lesson: `
**Midpoint** — average the coordinates:

$$M = \\left(\\dfrac{x_1 + x_2}{2},\\ \\dfrac{y_1 + y_2}{2}\\right)$$

**Distance** — it’s Pythagoras using the run and the rise:

$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

> Draw a quick sketch with the right-angled triangle. It makes the distance formula obvious.`,
    examples: [
      { q: 'Find the midpoint and distance between $(2, -1)$ and $(8, 7)$', steps: ['Midpoint: $\\left(\\frac{2+8}{2}, \\frac{-1+7}{2}\\right) = (5, 3)$', 'Run $= 6$, rise $= 8$', '$d = \\sqrt{36 + 64} = 10$'] },
    ],
    mistakes: ['Subtracting instead of adding for the midpoint', 'Forgetting to square root at the end'],
    formulas: ['M = \\left(\\dfrac{x_1+x_2}{2}, \\dfrac{y_1+y_2}{2}\\right)', 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}'],
    gens: [A.midpointG, A.distanceG],
  }),
  T({
    id: 'inequalities', title: 'Inequalities', strand: 'algebra', level: 10, emoji: '🎢', scene: 'inequalities',
    summary: 'Solving and graphing <, >, ≤ and ≥.',
    analogy: { emoji: '🎢', title: 'Theme park height sign', text: '“You must be at least 140 cm” is an inequality: $h \\ge 140$. Lots of answers work, not just one.' },
    lesson: `
The symbols: $<$ less than, $>$ greater than, $\\le$ less than or equal to, $\\ge$ greater than or equal to.

**On a number line:** open circle ○ for $<$ or $>$ (not included); closed circle ● for $\\le$ or $\\ge$ (included).

**Solving:** exactly like equations, with **one** extra rule:

> When you multiply or divide both sides by a **negative** number, **flip the inequality sign**.

$$-3x > 12 \\Rightarrow x < -4$$

Why? $2 < 5$, but multiply both by $-1$: $-2 > -5$. Negatives reverse the order.`,
    examples: [
      { q: 'Solve $5 - 2x \\le 11$', steps: ['Subtract 5: $-2x \\le 6$', 'Divide by $-2$ and flip: $x \\ge -3$'] },
    ],
    mistakes: ['Forgetting to flip the sign when dividing by a negative', 'Using a closed circle for < or >'],
    formulas: [],
    gens: [A.solveIneq, A.countIntegers],
  }),
  T({
    id: 'simultaneous', title: 'Simultaneous equations', strand: 'algebra', level: 10, emoji: '🕵️', scene: 'simultaneous',
    summary: 'Two equations, two unknowns — find where the lines cross.',
    analogy: { emoji: '🕵️', title: 'Two clues', text: 'One clue about two mystery numbers isn’t enough — lots of pairs fit. A second clue narrows it down to exactly one answer.' },
    lesson: `
The solution is the point $(x, y)$ that makes **both** equations true — where their graphs intersect.

**Substitution** (best when one equation is already $y = \\dots$ or $x = \\dots$): substitute it into the other equation.

$$y = 2x \\text{ and } x + y = 9 \\Rightarrow x + 2x = 9 \\Rightarrow x = 3,\\ y = 6$$

**Elimination** (best when coefficients match): add or subtract the equations to cancel a variable.

$$\\begin{aligned} x + y &= 10 \\\\ x - y &= 4 \\end{aligned} \\quad \\text{add: } 2x = 14 \\Rightarrow x = 7,\\ y = 3$$

> Always substitute both values back into **both** equations to check.

**Word problems:** define your two variables, write two equations, then solve.`,
    examples: [
      { q: 'Solve $2x + y = 11$ and $x - y = 1$', steps: ['Add: $3x = 12$, so $x = 4$', 'Substitute: $4 - y = 1$, so $y = 3$'] },
    ],
    mistakes: ['Only finding one of the two unknowns', 'Sign errors when subtracting equations'],
    formulas: [],
    gens: [A.simulSub, A.simulWord],
  }),
  T({
    id: 'factorise-quad', title: 'Factorising quadratics', strand: 'algebra', level: 10, emoji: '🔍', scene: 'factorise-quad',
    summary: 'Turning x² + bx + c into two brackets.',
    analogy: { emoji: '🔍', title: 'Detective puzzle', text: 'You’re looking for two secret numbers. Clue 1: they multiply to give the last number. Clue 2: they add to give the middle number.' },
    lesson: `
To factorise $x^2 + bx + c$, find two numbers that:

- **multiply** to give $c$
- **add** to give $b$

$$x^2 + 7x + 12 = (x + 3)(x + 4) \\quad (3 \\times 4 = 12,\\ 3 + 4 = 7)$$

$$x^2 - 2x - 15 = (x - 5)(x + 3) \\quad (-5 \\times 3 = -15,\\ -5 + 3 = -2)$$

**Sign clues:** if $c$ is positive, both numbers have the same sign as $b$. If $c$ is negative, the numbers have opposite signs.

**Difference of two squares:** $x^2 - a^2 = (x + a)(x - a)$.

> Take out any common factor first: $2x^2 + 10x + 12 = 2(x^2 + 5x + 6) = 2(x + 2)(x + 3)$.`,
    examples: [
      { q: 'Factorise $x^2 - 9x + 20$', steps: ['Multiply to $20$, add to $-9$: $-4$ and $-5$', '$(x - 4)(x - 5)$'] },
    ],
    mistakes: ['Getting the signs wrong', 'Forgetting a common factor first'],
    formulas: ['x^2 + (a+b)x + ab = (x+a)(x+b)', 'x^2 - a^2 = (x+a)(x-a)'],
    gens: [A.factorQuad],
  }),
  T({
    id: 'quadratic-eq', title: 'Solving quadratics', strand: 'algebra', level: 10, emoji: '🎯', scene: 'quadratic-eq',
    summary: 'The Null Factor Law and the quadratic formula.',
    analogy: { emoji: '0️⃣', title: 'Zero friends', text: 'If two friends multiply their numbers and get 0, one of them must be holding a 0. That’s the Null Factor Law.' },
    lesson: `
**Null Factor Law:** if $a \\times b = 0$, then $a = 0$ or $b = 0$.

**Steps:**

- Rearrange so one side is **0**
- Factorise
- Set each factor to 0 and solve

$$x^2 - x - 6 = 0 \\Rightarrow (x - 3)(x + 2) = 0 \\Rightarrow x = 3 \\text{ or } x = -2$$

When it won’t factorise nicely, use the **quadratic formula**:

$$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

The **discriminant** $b^2 - 4ac$ tells you how many solutions: positive → 2, zero → 1, negative → none.

> The solutions are the x-intercepts of the parabola $y = ax^2 + bx + c$.`,
    examples: [
      { q: 'Solve $x^2 = 5x$', steps: ['Rearrange: $x^2 - 5x = 0$', 'Factorise: $x(x - 5) = 0$', '$x = 0$ or $x = 5$ (don’t divide by $x$ — you’d lose a solution!)'] },
    ],
    mistakes: ['Trying the Null Factor Law when the right side isn’t 0', 'Dividing both sides by x and losing x = 0', 'Sign errors: $(x - 3) = 0$ gives $x = 3$, not $-3$'],
    formulas: ['x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', '\\Delta = b^2 - 4ac'],
    gens: [A.quadNFL, A.quadFormula],
  }),
  T({
    id: 'parabolas', title: 'Parabolas', strand: 'algebra', level: 10, emoji: '⛲', scene: 'parabolas',
    summary: 'Graphing quadratics using turning point form.',
    analogy: { emoji: '🏀', title: 'A thrown ball', text: 'The path of a basketball shot is a parabola. The highest point of the shot is the turning point.' },
    lesson: `
The graph of a quadratic is a **parabola**. Turning point form:

$$y = a(x - h)^2 + k$$

- Turning point: $(h, k)$ — careful, the sign of $h$ is **opposite** to what’s in the bracket
- $a > 0$: opens upwards ∪ (minimum). $a < 0$: opens downwards ∩ (maximum)
- Bigger $|a|$ → narrower
- Axis of symmetry: $x = h$

**Key features to find when sketching:**

- **y-intercept:** set $x = 0$
- **x-intercepts:** set $y = 0$ and solve
- **Turning point**

> In factorised form $y = (x - p)(x - q)$, the x-intercepts are $p$ and $q$ and the turning point is halfway between them.`,
    examples: [
      { q: 'Describe $y = -2(x + 1)^2 + 8$', steps: ['Turning point $(-1, 8)$', '$a = -2 < 0$ → opens down, maximum at $(-1, 8)$', 'y-intercept: $y = -2(1)^2 + 8 = 6$'] },
    ],
    mistakes: ['Getting the sign of h wrong', 'Mixing up the y-intercept and the turning point'],
    formulas: ['y = a(x - h)^2 + k', '\\text{TP} = (h, k)'],
    gens: [A.turningPoint, A.xIntercepts],
  }),

  // ================= MEASUREMENT =================
  T({
    id: 'pythagoras', title: 'Pythagoras’ theorem', strand: 'measurement', level: 9, emoji: '📐', scene: 'pythagoras',
    summary: 'Finding a missing side of a right-angled triangle.',
    analogy: { emoji: '🏟️', title: 'Cutting across the oval', text: 'Walking around the edge of the oval is longer than cutting straight across. Pythagoras tells you exactly how long the shortcut is.' },
    lesson: `
In a right-angled triangle, the **hypotenuse** $c$ is the longest side, opposite the right angle.

$$a^2 + b^2 = c^2$$

**Finding the hypotenuse:** square, **add**, square root.

$$c = \\sqrt{a^2 + b^2}$$

**Finding a shorter side:** square, **subtract**, square root.

$$a = \\sqrt{c^2 - b^2}$$

**Pythagorean triples** (whole-number answers): 3-4-5, 5-12-13, 8-15-17, 7-24-25 and their multiples (6-8-10…).

> Testing for a right angle: if $a^2 + b^2 = c^2$ (with $c$ the longest side), the triangle is right-angled.

! Only works for right-angled triangles. Always identify the hypotenuse first.`,
    examples: [
      { q: 'A rectangle is 9 cm by 12 cm. How long is the diagonal?', steps: ['Diagonal is the hypotenuse', '$c^2 = 81 + 144 = 225$', '$c = 15$ cm'] },
    ],
    mistakes: ['Adding when finding a shorter side', 'Forgetting the square root at the end', 'Using it on non-right-angled triangles'],
    formulas: ['a^2 + b^2 = c^2'],
    gens: [M.pythHyp, M.pythShort, M.pythWord],
  }),
  T({
    id: 'trig', title: 'Trigonometry', strand: 'measurement', level: 9, emoji: '📏', scene: 'trig',
    summary: 'SOH CAH TOA: linking angles and sides.',
    analogy: { emoji: '🛝', title: 'Same slide, any size', text: 'A slide at a 30° angle has the same steepness whether it’s a toy or a giant waterslide. The ratio of the sides depends only on the angle — that’s what sin, cos and tan measure.' },
    lesson: `
Label the sides **from the angle’s point of view**:

- **Hypotenuse (H)** — longest side, opposite the right angle
- **Opposite (O)** — across from the angle
- **Adjacent (A)** — next to the angle (not the hypotenuse)

$$\\sin\\theta = \\dfrac{O}{H} \\quad \\cos\\theta = \\dfrac{A}{H} \\quad \\tan\\theta = \\dfrac{O}{A}$$

Remember **SOH CAH TOA**.

**Finding a side:** choose the ratio with the side you know and the side you want, then rearrange.

$$\\sin 30° = \\dfrac{x}{12} \\Rightarrow x = 12 \\sin 30° = 6$$

**Finding an angle:** use the inverse ($\\sin^{-1}$, $\\cos^{-1}$, $\\tan^{-1}$ — usually SHIFT on the calculator).

$$\\tan\\theta = \\dfrac{5}{8} \\Rightarrow \\theta = \\tan^{-1}(0.625) \\approx 32.0°$$

! Make sure your calculator is in **degrees** mode (a small D on the screen).`,
    examples: [
      { q: 'Find $x$ if the hypotenuse is 20 and the angle is 40°, and $x$ is adjacent.', steps: ['A and H → CAH', '$x = 20 \\cos 40° \\approx 15.3$'] },
    ],
    mistakes: ['Labelling O and A before knowing which angle', 'Calculator in radians', 'Putting x on the bottom and multiplying instead of dividing'],
    formulas: ['\\sin\\theta = \\dfrac{O}{H}', '\\cos\\theta = \\dfrac{A}{H}', '\\tan\\theta = \\dfrac{O}{A}'],
    gens: [M.trigLabel, M.trigWhich, M.trigSide, M.trigAngle],
  }),
  T({
    id: 'trig-apps', title: 'Elevation & bearings', strand: 'measurement', level: 10, emoji: '🪁', scene: 'trig-apps',
    summary: 'Using trigonometry to solve real-world problems.',
    analogy: { emoji: '🪁', title: 'Looking up at a kite', text: 'Tilt your head up to see a kite: that tilt from the horizontal is the angle of elevation. Look down from a lookout: that’s the angle of depression.' },
    lesson: `
- **Angle of elevation:** measured **up** from the horizontal
- **Angle of depression:** measured **down** from the horizontal

The angle of depression from A to B equals the angle of elevation from B to A (alternate angles).

**Strategy:** draw a diagram, mark the right angle, label O, A, H, then use SOH CAH TOA.

**True bearings** give direction as an angle measured **clockwise from North**, written with three digits: 045°, 120°, 270°.

> Back bearing (to return): add 180° if the bearing is less than 180°, otherwise subtract 180°.`,
    examples: [
      { q: 'From 50 m away, the angle of elevation to the top of a building is 32°. How tall is it?', steps: ['$\\tan 32° = \\dfrac{h}{50}$', '$h = 50 \\tan 32° \\approx 31.2$ m'] },
    ],
    mistakes: ['Measuring elevation from the vertical', 'Writing bearings with fewer than 3 digits'],
    formulas: [],
    gens: [M.elevationG, M.bearingG],
  }),
  T({
    id: 'trig-rules', title: 'Trigonometry in any triangle', strand: 'measurement', level: 10, emoji: '🔺', scene: 'trig-rules',
    summary: 'Sine rule, cosine rule and area rule — no right angle needed.',
    analogy: { emoji: '💻', title: 'Opening a laptop', text: 'The screen and keyboard never change length, but the wider you open the hinge, the further apart their tips get. The cosine rule tells you that gap for any hinge angle — and at exactly 90° it’s just Pythagoras.' },
    lesson: `
SOH CAH TOA only works in **right-angled** triangles. These three rules work in **any** triangle.

**Labelling:** capital letters $A$, $B$, $C$ are the angles. Each side takes the lowercase letter of the angle **opposite** it — side $a$ faces angle $A$.

**Sine rule** — use it when you know a **matching pair** (a side and the angle opposite it) plus one more fact:

$$\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C}$$

To find an angle, flip it so the sines are on top: $\\dfrac{\\sin A}{a} = \\dfrac{\\sin B}{b}$.

**Cosine rule** — use it when there’s **no matching pair**: two sides and the angle **between** them (find the third side), or all three sides (find an angle).

$$a^2 = b^2 + c^2 - 2bc\\cos A \\qquad \\cos A = \\dfrac{b^2 + c^2 - a^2}{2bc}$$

> If $A = 90°$ then $\\cos A = 0$, and the cosine rule turns into Pythagoras: $a^2 = b^2 + c^2$.

**Area rule** — two sides and the angle between them:

$$\\text{Area} = \\tfrac12 ab\\sin C$$

**Which rule?**

- Matching pair → **sine rule**
- No matching pair → **cosine rule**
- Want the area → **area rule**
- The biggest angle is always opposite the longest side.
- An obtuse angle has a **negative** cosine; the cosine rule handles that automatically.

! Type the cosine rule in one go: $b^2 + c^2 - 2bc\\cos A$. Don’t work out $b^2 + c^2 - 2bc$ first and then multiply by $\\cos A$.

! Finding an angle with the sine rule can be **ambiguous**, because $\\sin 30° = \\sin 150°$. If the angle is opposite the **shorter** of the two known sides, it must be acute.`,
    examples: [
      { q: 'In triangle $ABC$, $A = 40°$, $B = 75°$ and $a = 10$ cm. Find $b$.', steps: ['$a$ and $A$ are a matching pair → sine rule', '$\\dfrac{b}{\\sin 75°} = \\dfrac{10}{\\sin 40°}$', '$b = \\dfrac{10 \\sin 75°}{\\sin 40°} \\approx 15.0$ cm'] },
      { q: '$b = 7$ m, $c = 9$ m and the angle between them is $A = 60°$. Find $a$.', steps: ['Two sides and the included angle → cosine rule', '$a^2 = 7^2 + 9^2 - 2 \\times 7 \\times 9 \\times \\cos 60° = 130 - 63 = 67$', '$a = \\sqrt{67} \\approx 8.2$ m'] },
      { q: 'A triangle has sides 5, 7 and 8 cm. Find its largest angle.', steps: ['The largest angle is opposite the longest side, 8', '$\\cos\\theta = \\dfrac{5^2 + 7^2 - 8^2}{2 \\times 5 \\times 7} = \\dfrac{10}{70}$', '$\\theta = \\cos^{-1}\\left(\\dfrac{1}{7}\\right) \\approx 81.8°$'] },
      { q: 'Find the area of a triangle with sides 6 cm and 10 cm and an angle of 30° between them.', steps: ['$\\text{Area} = \\tfrac12 \\times 6 \\times 10 \\times \\sin 30°$', '$= 30 \\times 0.5 = 15$ cm²'] },
    ],
    mistakes: ['Using the sine rule without a matching side–angle pair', 'Working out $b^2 + c^2 - 2bc$ first, then multiplying by $\\cos A$', 'Forgetting to square-root at the end of the cosine rule', 'Calculator in radians mode', 'Using the area rule with an angle that isn’t between the two sides'],
    formulas: ['\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C}', 'a^2 = b^2 + c^2 - 2bc\\cos A', '\\cos A = \\dfrac{b^2 + c^2 - a^2}{2bc}', '\\text{Area} = \\tfrac12 ab\\sin C'],
    gens: [M.whichRule, M.sineSide, M.sineAngle, M.cosineSide, M.cosineAngle, M.areaRule],
  }),
  T({
    id: 'surface-area', title: 'Surface area', strand: 'measurement', level: 9, emoji: '🎁', scene: 'surface-area',
    summary: 'The total area covering a 3D object.',
    analogy: { emoji: '🎁', title: 'Wrapping paper', text: 'Surface area is how much wrapping paper covers a present exactly, with no overlaps.' },
    lesson: `
Unfold the solid into its **net** and add the areas of all the faces.

**Rectangular prism:**

$$SA = 2(lw + lh + wh)$$

**Triangular prism:** 2 triangles + 3 rectangles.

**Cylinder:** two circles plus the curved surface (which unrolls into a rectangle $2\\pi r$ wide):

$$SA = 2\\pi r^2 + 2\\pi r h$$

> An open-topped cylinder (like a cup) has only one circle: $SA = \\pi r^2 + 2\\pi r h$.

! Surface area is in **square** units (cm²). Use the radius, not the diameter.`,
    examples: [
      { q: 'Find the SA of a closed cylinder, r = 3 cm, h = 10 cm', steps: ['Circles: $2\\pi(3)^2 \\approx 56.5$', 'Curved: $2\\pi(3)(10) \\approx 188.5$', 'Total $\\approx 245.0$ cm²'] },
    ],
    mistakes: ['Using the diameter instead of the radius', 'Missing a face', 'Giving cubic units'],
    formulas: ['SA_{\\text{box}} = 2(lw + lh + wh)', 'SA_{\\text{cyl}} = 2\\pi r^2 + 2\\pi rh'],
    gens: [M.saPrism, M.saCylinder],
  }),
  T({
    id: 'volume', title: 'Volume of prisms', strand: 'measurement', level: 9, emoji: '🍞', scene: 'volume',
    summary: 'Cross-section area × height.',
    analogy: { emoji: '🍞', title: 'Sliced bread', text: 'A prism is like a loaf of sliced bread: every slice is the same shape. Volume = area of one slice × how long the loaf is.' },
    lesson: `
For any **prism** (same cross-section all the way through):

$$V = A \\times h$$

where $A$ is the area of the cross-section and $h$ is the height (or length).

- Rectangular prism: $V = lwh$
- Triangular prism: $V = \\frac12 bh \\times L$
- Cylinder: $V = \\pi r^2 h$

**Capacity:** $1 \\text{ cm}^3 = 1 \\text{ mL}$, and $1000 \\text{ cm}^3 = 1 \\text{ L}$. Also $1 \\text{ m}^3 = 1000 \\text{ L}$.

> Volume is in **cubic** units (cm³, m³).`,
    examples: [
      { q: 'A cylindrical tank has r = 0.5 m and h = 2 m. How many litres?', steps: ['$V = \\pi (0.5)^2 (2) \\approx 1.571$ m³', '$1.571 \\times 1000 \\approx 1571$ L'] },
    ],
    mistakes: ['Using the wrong “height” for a triangular prism', 'Forgetting to convert units'],
    formulas: ['V = Ah', 'V_{\\text{cyl}} = \\pi r^2 h'],
    gens: [M.volPrism, M.volCylinder],
  }),
  T({
    id: 'volume-3d', title: 'Pyramids, cones & spheres', strand: 'measurement', level: 10, emoji: '🍦', scene: 'volume-3d',
    summary: 'Volumes of pointy and round solids.',
    analogy: { emoji: '🍦', title: 'Ice cream cones', text: 'Three cones of water exactly fill a cylinder with the same base and height. So a cone (or pyramid) is one third of its matching prism.' },
    lesson: `
Pyramids and cones come to a point, so they hold **one third** of the matching prism:

$$V_{\\text{pyramid}} = \\tfrac13 \\times \\text{base area} \\times h \\qquad V_{\\text{cone}} = \\tfrac13 \\pi r^2 h$$

**Sphere:**

$$V = \\tfrac43 \\pi r^3 \\qquad SA = 4\\pi r^2$$

**Composite solids:** split into familiar shapes and add (or subtract) the volumes.

! $h$ is the **perpendicular** height (straight up), not the slant height.`,
    examples: [
      { q: 'A cone has r = 3 cm and h = 8 cm. Find its volume.', steps: ['$V = \\tfrac13 \\pi (3)^2 (8) = 24\\pi \\approx 75.4$ cm³'] },
    ],
    mistakes: ['Forgetting the ⅓', 'Using slant height instead of perpendicular height', 'Using $r^2$ instead of $r^3$ for spheres'],
    formulas: ['V = \\tfrac13 Ah', 'V_{\\text{cone}} = \\tfrac13 \\pi r^2 h', 'V_{\\text{sphere}} = \\tfrac43 \\pi r^3', 'SA_{\\text{sphere}} = 4\\pi r^2'],
    gens: [M.volCone],
  }),

  // ================= SPACE =================
  T({
    id: 'similarity', title: 'Similar figures', strand: 'space', level: 9, emoji: '🔎', scene: 'similarity',
    summary: 'Enlargements and scale factors.',
    analogy: { emoji: '📱', title: 'Zooming a photo', text: 'Pinch-zooming a photo on your phone makes everything bigger by the same amount, but the shape never changes. That’s similarity.' },
    lesson: `
Two shapes are **similar** if one is an enlargement of the other:

- Matching **angles are equal**
- Matching **sides are in the same ratio** (the scale factor $k$)

$$k = \\dfrac{\\text{image length}}{\\text{original length}}$$

**Finding a missing side:** find $k$ from a pair of matching sides, then multiply (or divide).

**Area and volume:** lengths scale by $k$, areas by $k^2$, volumes by $k^3$.

> Shadow problems: the sun’s rays make similar triangles, so you can find the height of a tree from its shadow.

**Proving triangles similar** (Year 10): AAA (equal angles), SSS (sides in ratio), SAS (two sides in ratio, included angle equal).`,
    examples: [
      { q: 'Similar triangles: 4 cm matches 10 cm. Find the side matching 6 cm.', steps: ['$k = 10 \\div 4 = 2.5$', '$6 \\times 2.5 = 15$ cm'] },
    ],
    mistakes: ['Matching the wrong sides', 'Multiplying area by k instead of k²'],
    formulas: ['k = \\dfrac{\\text{image}}{\\text{original}}', '\\text{Area} \\times k^2', '\\text{Volume} \\times k^3'],
    gens: [M.similarSide, M.similarArea, M.shadowG],
  }),

  // ================= STATISTICS =================
  T({
    id: 'statistics', title: 'Mean, median & range', strand: 'statistics', level: 9, emoji: '🍬', scene: 'statistics',
    summary: 'Describing data with summary statistics.',
    analogy: { emoji: '🍬', title: 'Sharing lollies', text: 'The mean is what everyone gets if you share the lollies equally. The median is the middle person when everyone lines up in order.' },
    lesson: `
**Measures of centre:**

- **Mean** = total ÷ number of values
- **Median** = the middle value when the data is **in order** (average the middle two if there’s an even number)
- **Mode** = the most common value

**Measures of spread:**

- **Range** = highest − lowest
- **Interquartile range (IQR)** = $Q_3 - Q_1$ (the spread of the middle 50%)

> Outliers (unusually high or low values) pull the mean towards them, but barely affect the median. Use the median for skewed data, like house prices.

**Finding a missing value:** total needed = mean × number of values.`,
    examples: [
      { q: 'Find the median of 8, 3, 12, 5, 9, 4', steps: ['Order: 3, 4, 5, 8, 9, 12', 'Six values → average the 3rd and 4th: $(5 + 8) \\div 2 = 6.5$'] },
    ],
    mistakes: ['Finding the median without ordering first', 'Forgetting to average the middle two for even counts'],
    formulas: ['\\bar{x} = \\dfrac{\\sum x}{n}', '\\text{Range} = \\max - \\min'],
    gens: [S.meanG, S.medianG, S.rangeModeG],
  }),
  T({
    id: 'bivariate', title: 'Box plots & scatter plots', strand: 'statistics', level: 10, emoji: '📦', scene: 'bivariate',
    summary: 'Quartiles, box plots and relationships between two variables.',
    analogy: { emoji: '📦', title: 'Five-number summary', text: 'A box plot is like a highlights reel of the data: just five numbers tell you where it starts, ends, and where the middle chunk sits.' },
    lesson: `
**Five-number summary:** minimum, $Q_1$, median ($Q_2$), $Q_3$, maximum.

- $Q_1$ = median of the **lower half**, $Q_3$ = median of the **upper half** (leave out the middle value if there’s an odd number)
- **IQR** $= Q_3 - Q_1$

**Box plot:** a box from $Q_1$ to $Q_3$ with a line at the median, and whiskers out to the min and max.

**Outliers:** values below $Q_1 - 1.5 \\times IQR$ or above $Q_3 + 1.5 \\times IQR$.

**Scatter plots** show **bivariate** data (two variables). Describe the relationship by its:

- **Direction:** positive (↗) or negative (↘)
- **Strength:** strong, moderate, weak
- **Form:** linear or not

> Correlation doesn’t prove causation! Ice-cream sales and sunburn both rise in summer, but one doesn’t cause the other.`,
    examples: [
      { q: 'Find the IQR of 2, 4, 5, 7, 8, 10, 13', steps: ['Median = 7', 'Lower half: 2, 4, 5 → $Q_1 = 4$', 'Upper half: 8, 10, 13 → $Q_3 = 10$', 'IQR $= 6$'] },
    ],
    mistakes: ['Including the median in the halves (for odd counts)', 'Saying a correlation proves cause'],
    formulas: ['IQR = Q_3 - Q_1', '\\text{Outlier} < Q_1 - 1.5\\,IQR \\text{ or } > Q_3 + 1.5\\,IQR'],
    gens: [S.iqrG, S.scatterG],
  }),

  // ================= PROBABILITY =================
  T({
    id: 'probability', title: 'Probability', strand: 'probability', level: 9, emoji: '🎲', scene: 'probability',
    summary: 'Two-step experiments, tree diagrams and Venn diagrams.',
    analogy: { emoji: '🗺️', title: 'Choose-your-own-adventure', text: 'A tree diagram is a map of every possible path. To find the chance of one path, multiply along it. To combine paths, add them.' },
    lesson: `
$$P(\\text{event}) = \\dfrac{\\text{number of favourable outcomes}}{\\text{total number of outcomes}}$$

Probabilities are between 0 (impossible) and 1 (certain). $P(\\text{not } A) = 1 - P(A)$.

**Two-step experiments:** use a **table** (e.g. two dice: 36 outcomes) or a **tree diagram**.

- **Multiply** along branches ("and")
- **Add** separate paths ("or")

**Venn diagrams:** fill in the overlap ("both") first.

$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$

> “And” → ∩ (intersection, the overlap). “Or” → ∪ (union, everything in either).`,
    examples: [
      { q: 'Two dice are rolled. Find P(sum = 7).', steps: ['36 outcomes', '(1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6 ways', '$P = \\frac{6}{36} = \\frac16$'] },
    ],
    mistakes: ['Adding when you should multiply along a path', 'Double-counting the overlap in a Venn diagram'],
    formulas: ['P(A) = \\dfrac{n(A)}{n(S)}', 'P(A^\\prime) = 1 - P(A)', 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)'],
    gens: [S.probSingle, S.probTree, S.vennG],
  }),
  T({
    id: 'conditional', title: 'Conditional probability', strand: 'probability', level: 10, emoji: '🧦', scene: 'conditional',
    summary: 'Dependent events, “given that”, and independence.',
    analogy: { emoji: '🧦', title: 'Socks in a drawer', text: 'Grab a sock and keep it, and the drawer changes for your next grab. What you know (or what’s already happened) changes the odds.' },
    lesson: `
**Without replacement:** after the first pick, there’s one fewer item — the probabilities change. The events are **dependent**.

$$P(RR) = \\dfrac{3}{5} \\times \\dfrac{2}{4}$$

**Conditional probability** — the probability of A **given** B has happened:

$$P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)}$$

In a two-way table, “given B” means **only look at the B row or column**.

**Independent events:** one doesn’t affect the other, and

$$P(A \\cap B) = P(A) \\times P(B)$$

> “Given that…” is the giveaway for conditional probability. It shrinks the group you’re choosing from.`,
    examples: [
      { q: 'Of 30 students, 18 play sport; 12 of those are in Year 10. Find P(Year 10 | plays sport).', steps: ['Only look at the 18 who play sport', '$P = \\frac{12}{18} = \\frac23$'] },
    ],
    mistakes: ['Dividing by the whole total instead of the “given” group', 'Not reducing the numbers after a pick without replacement'],
    formulas: ['P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)}', 'P(A \\cap B) = P(A)P(B) \\text{ (independent)}'],
    gens: [S.noReplace, S.twoWayG, S.independentG],
  }),
]

export const topicById = (id: string) => TOPICS.find((t) => t.id === id)
