const NUMBER = String.raw`(-?(?:\d+\.?\d*|\.\d+))`
const RECT = new RegExp(
  `^M\\s*${NUMBER}[\\s,]*${NUMBER}\\s*([vV])\\s*${NUMBER}\\s*([hH])\\s*${NUMBER}\\s*[vV]\\s*${NUMBER}\\s*[zZ]$`
)
const MIN_RUN = 8

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

function rectOf(path: globalThis.Element): Rect | null {
  if (path.localName !== 'path' || path.childElementCount > 0 || path.id) return null
  const match = RECT.exec(path.getAttribute('d') ?? '')
  if (!match) return null
  const x = Number(match[1])
  const y = Number(match[2])
  const height = match[3] === 'V' ? Number(match[4]) - y : Number(match[4])
  const width = match[5] === 'H' ? Number(match[6]) - x : Number(match[6])
  return {
    x: Math.min(x, x + width),
    y: Math.min(y, y + height),
    width: Math.abs(width),
    height: Math.abs(height)
  }
}

function signature(path: globalThis.Element): string {
  return [...path.attributes]
    .filter((attribute) => attribute.localName !== 'd')
    .map((attribute) => `${attribute.name}=${attribute.value}`)
    .sort()
    .join(' ')
}

function round(value: number): string {
  return String(Math.round(value * 1000) / 1000)
}

function mergeRun(run: globalThis.Element[], rects: Rect[]): void {
  if (run.length < MIN_RUN) return
  const d = rects
    .map(
      (rect) =>
        `M${round(rect.x)} ${round(rect.y)}h${round(rect.width)}v${round(rect.height)}h${round(-rect.width)}z`
    )
    .join('')
  run[0].setAttribute('d', d)
  for (const path of run.slice(1)) path.remove()
}

export function mergeDotRuns(root: globalThis.Element): void {
  let run: globalThis.Element[] = []
  let rects: Rect[] = []
  let key = ''
  for (const child of [...root.children]) {
    const rect = rectOf(child)
    const childKey = rect ? signature(child) : ''
    if (rect && childKey === key && run.length > 0) {
      run.push(child)
      rects.push(rect)
      continue
    }
    mergeRun(run, rects)
    run = rect ? [child] : []
    rects = rect ? [rect] : []
    key = childKey
    if (!rect) mergeDotRuns(child)
  }
  mergeRun(run, rects)
}
