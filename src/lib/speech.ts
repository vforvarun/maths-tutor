// English narration for animated lessons, using the device's built-in voices.

export const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
let cache: SpeechSynthesisVoice[] = []

function load() {
  if (!ttsSupported) return []
  const v = window.speechSynthesis.getVoices().filter((x) => x.lang.toLowerCase().startsWith('en'))
  if (v.length) cache = v
  return cache
}
if (ttsSupported) {
  load()
  window.speechSynthesis.addEventListener?.('voiceschanged', load)
}

const GOOD = ['natural', 'online', 'premium', 'enhanced', 'google', 'karen', 'catherine', 'natasha', 'william', 'lee', 'samantha', 'daniel', 'serena', 'aria', 'jenny']
function rank(v: SpeechSynthesisVoice) {
  const n = v.name.toLowerCase()
  let r = 0
  GOOD.forEach((g, i) => n.includes(g) && (r += 100 - i))
  if (v.lang === 'en-AU') r += 60
  else if (v.lang === 'en-GB') r += 25
  else if (v.lang === 'en-US') r += 15
  return r
}
export function englishVoices() {
  return [...load()].sort((a, b) => rank(b) - rank(a))
}

let preferred: string | undefined
let rate = 1
export function configureVoice(uri: string | undefined, r: number) {
  preferred = uri
  rate = r
}

/** Turn maths notation into something a voice can read. */
export function spoken(text: string): string {
  return text
    .replaceAll('\\$', '\u0001')
    .replace(/\$\$?([^$]+)\$\$?/g, '$1')
    .replaceAll('\u0001', '$')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1 over $2')
    .replace(/\\times/g, ' times ')
    .replace(/\\div/g, ' divided by ')
    .replace(/\\sqrt\{([^}]*)\}/g, 'root $1')
    .replace(/\^2/g, ' squared')
    .replace(/\^3/g, ' cubed')
    .replace(/\^\{?(\d+)\}?/g, ' to the power $1')
    .replace(/\\(le|leq)/g, ' less than or equal to ')
    .replace(/\\(ge|geq)/g, ' greater than or equal to ')
    .replace(/\\theta/g, 'theta')
    .replace(/\\pi/g, 'pi')
    .replace(/\\[a-z]+/g, ' ')
    .replace(/[{}*]/g, '')
    .replace(/−/g, 'minus ')
    .replace(/\s+/g, ' ')
}

export function speak(text: string, opts: { rate?: number } = {}): Promise<void> {
  return new Promise((resolve) => {
    if (!ttsSupported) return resolve()
    const synth = window.speechSynthesis
    synth.cancel()
    const u = new SpeechSynthesisUtterance(spoken(text))
    const voices = englishVoices()
    const v = voices.find((x) => x.voiceURI === preferred) ?? voices[0]
    if (v) u.voice = v
    u.lang = v?.lang ?? 'en-AU'
    u.rate = Math.max(0.6, Math.min(1.4, rate * (opts.rate ?? 1)))
    let done = false
    const finish = () => {
      if (!done) {
        done = true
        resolve()
      }
    }
    u.onend = finish
    u.onerror = finish
    // safety net: some browsers never fire onend
    setTimeout(finish, Math.max(4000, text.length * 90))
    synth.speak(u)
  })
}

export function stopSpeaking() {
  if (ttsSupported) window.speechSynthesis.cancel()
}
