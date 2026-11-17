import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { compileThemeVars } from '../src/tokens/theme-colors.js'

const APCA_0_0_98G_4G = {
  mainTRC: 2.4,
  sRco: 0.2126729,
  sGco: 0.7151522,
  sBco: 0.072175,
  normBG: 0.56,
  normTXT: 0.57,
  revTXT: 0.62,
  revBG: 0.65,
  blkThrs: 0.022,
  blkClmp: 1.414,
  scaleBoW: 1.14,
  scaleWoB: 1.14,
  loBoWoffset: 0.027,
  loWoBoffset: 0.027,
  deltaYmin: 0.0005,
  loClip: 0.1
}

const TARGETS = { body: 75, text: 60, icon: 45, mark: 30, border: 15 }

const SURFACES = ['--bg-canvas', '--bg-surface', '--bg-surface-raised']
const FILLS = ['primary', 'secondary', 'accent', 'success', 'warning', 'danger', 'info']
const STATUS = ['success', 'warning', 'danger', 'info']

const PAIRS = [
  ...SURFACES.map((bg) => ['body', '--text-default', bg]),
  ...['--text-muted', '--text-primary', '--text-brand', '--text-link', '--text-link-hover'].flatMap(
    (fg) => SURFACES.map((bg) => ['text', fg, bg])
  ),
  ...FILLS.map((fill) => ['text', `--${fill}-foreground`, `--${fill}`]),
  ['text', '--brand-blue-foreground', '--brand-blue'],
  ['text', '--text-contrast', '--bg-contrast'],
  ['text', '--chart-tooltip-text', '--chart-tooltip-bg'],
  ['text', '--chart-tooltip-muted', '--chart-tooltip-bg'],
  ...STATUS.flatMap((s) => SURFACES.map((bg) => ['icon', `--${s}-foreground`, bg])),
  ...[
    ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `--chart-series-${n}`),
    '--chart-series-other',
    ...STATUS.map((s) => `--chart-status-${s}`),
    ...['negative', 'negative-2', 'negative-3', 'positive-3', 'positive-2', 'positive'].map(
      (step) => `--chart-diverging-${step}`
    ),
    ...['critical', 'high', 'medium', 'low'].map((l) => `--severity-${l}`),
    '--primary',
    '--accent',
    '--brand-blue',
    '--border-selected',
    '--ring-color'
  ].flatMap((fg) => SURFACES.map((bg) => ['mark', fg, bg])),
  ...['--border-default', '--border-muted', '--border-input', '--border-strong'].flatMap((fg) =>
    SURFACES.map((bg) => ['border', fg, bg])
  )
]

const EXCEPTIONS = [
  {
    status: 'accepted',
    themes: ['light', 'dark'],
    fg: '--primary-foreground',
    bg: ['--primary'],
    reason:
      'black label on the logo orange button, Lc 46.6; owner accepted on 2026-11-14 to match the logo'
  },
  {
    status: 'accepted',
    themes: ['dark'],
    fg: '--border-default',
    bg: SURFACES,
    reason:
      'dark dividers restored to the original #2B2B2B by the owner on 2026-11-16; form outlines stay --border-input'
  },
  {
    status: 'accepted',
    themes: ['dark'],
    fg: '--border-muted',
    bg: SURFACES,
    reason: 'dark muted dividers restored to the original #242424 by the owner on 2026-11-16'
  },
  {
    status: 'accepted',
    themes: ['light', 'dark'],
    fg: '--text-brand',
    bg: SURFACES,
    reason:
      'brand: the eyebrow matches the logo orange #F3652B in light and dark (light also under WCAG 4.5:1); owner decision 2026-11-16'
  },
  {
    status: 'accepted',
    themes: ['light'],
    fg: '--border-muted',
    bg: ['--bg-canvas'],
    reason:
      'light muted divider on the canvas, Lc 13.3 (target 15); kept as is, owner decision 2026-11-16'
  },
  {
    status: 'accepted',
    themes: ['dark'],
    fg: '--text-muted',
    bg: ['--bg-surface-raised'],
    reason:
      'dark muted text on a raised surface, Lc 59.9 (target 60); kept as is, owner decision 2026-11-16'
  },
  {
    status: 'accepted',
    themes: ['dark'],
    fg: '--border-input',
    bg: ['--bg-surface-raised'],
    reason:
      'dark field outline on a raised surface, Lc 14.6 (target 15); kept as is, owner decision 2026-11-16'
  }
]

const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)

const flatten = (fg, bg) => {
  if (fg.length === 7) return fg
  const alpha = parseInt(fg.slice(7, 9), 16) / 255
  const back = channels(bg)
  return `#${channels(fg)
    .map((c, i) =>
      Math.round((c * alpha + back[i] * (1 - alpha)) * 255)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`
}

const screenY = (hex) => {
  const k = APCA_0_0_98G_4G
  const [r, g, b] = channels(hex)
  const y = r ** k.mainTRC * k.sRco + g ** k.mainTRC * k.sGco + b ** k.mainTRC * k.sBco
  return y < k.blkThrs ? y + (k.blkThrs - y) ** k.blkClmp : y
}

const apcaLc = (text, background) => {
  const k = APCA_0_0_98G_4G
  const yt = screenY(text)
  const yb = screenY(background)
  if (Math.abs(yb - yt) < k.deltaYmin) return 0
  if (yb > yt) {
    const sapc = (yb ** k.normBG - yt ** k.normTXT) * k.scaleBoW
    return sapc < k.loClip ? 0 : (sapc - k.loBoWoffset) * 100
  }
  const sapc = (yb ** k.revBG - yt ** k.revTXT) * k.scaleWoB
  return sapc > -k.loClip ? 0 : (sapc + k.loWoBoffset) * 100
}

const vars = compileThemeVars()

const exceptionFor = (variant, fg, bg) =>
  EXCEPTIONS.find((e) => e.themes.includes(variant) && e.fg === fg && e.bg.includes(bg))

const measure = (variant, fg, bg) => {
  const back = vars[variant][bg]
  return Math.abs(apcaLc(flatten(vars[variant][fg], back), back))
}

test('APCA 0.0.98G-4g reference values: black on white Lc 106.0, white on black Lc -107.9, black on #F3652B Lc 46.6', () => {
  assert.equal(apcaLc('#000000', '#FFFFFF').toFixed(1), '106.0')
  assert.equal(apcaLc('#FFFFFF', '#000000').toFixed(1), '-107.9')
  assert.equal(apcaLc('#000000', '#F3652B').toFixed(1), '46.6')
})

for (const variant of ['light', 'dark']) {
  test(`${variant}: every documented pair meets its APCA target (body 75, text 60, icon 45, mark 30, border 15) or is a listed exception`, () => {
    const failures = []
    for (const [tier, fg, bg] of PAIRS) {
      assert.match(vars[variant][fg] ?? '', /^#[0-9a-f]{6,8}$/i, `${fg} unresolved in ${variant}`)
      assert.match(vars[variant][bg] ?? '', /^#[0-9a-f]{6}$/i, `${bg} unresolved in ${variant}`)
      const lc = measure(variant, fg, bg)
      if (lc < TARGETS[tier] && !exceptionFor(variant, fg, bg))
        failures.push(`${fg} on ${bg} is Lc ${lc.toFixed(1)}, ${tier} target Lc ${TARGETS[tier]}`)
    }
    assert.deepEqual(failures, [])
  })

  test(`${variant}: every exception still misses its target, so a fixed pair leaves the list`, () => {
    for (const e of EXCEPTIONS.filter((x) => x.themes.includes(variant))) {
      for (const bg of e.bg) {
        const pair = PAIRS.find(([, fg, b]) => fg === e.fg && b === bg)
        assert.ok(pair, `${e.fg} on ${bg} is an exception but not a documented pair`)
        const lc = measure(variant, e.fg, bg)
        assert.ok(
          lc < TARGETS[pair[0]],
          `${e.fg} on ${bg} (${variant}) now reaches Lc ${lc.toFixed(1)}; remove the exception`
        )
      }
    }
  })
}

test('every exception is recorded with its reason in rules/webkit-tokens.md', () => {
  const doc = readFileSync(new URL('../../../rules/webkit-tokens.md', import.meta.url), 'utf8')
  const section = doc.slice(doc.indexOf('## Contrast: APCA and WCAG 2'))
  assert.ok(section.length > 0 && doc.includes('## Contrast: APCA and WCAG 2'))
  for (const e of EXCEPTIONS) {
    assert.ok(e.reason.length > 20, `${e.fg} needs a reason`)
    const rows = section
      .split('\n')
      .filter((line) => line.includes(`\`${e.fg}\``) && line.includes(`| ${e.status}`))
    assert.ok(rows.length, `${e.fg} (${e.status}) is missing from the exceptions table`)
    for (const variant of e.themes)
      assert.ok(
        rows.some((row) => row.includes(variant)),
        `${e.fg} row does not name ${variant}`
      )
  }
})
