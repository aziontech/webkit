export const ICON_CANVAS = 14

export const MIN_SQUARENESS = 0.6

export const INTENTIONALLY_NON_SQUARE = {
  'az/az-minus.svg': 'a single horizontal bar',
  'az/az-equals.svg': 'two horizontal bars',
  'az/az-ellipsis.svg': 'three dots in a row',
  'az/az-ellipsis-vertical.svg': 'three dots in a column',
  'az/az-git-commit.svg': 'a dot on a vertical line',
  'az/az-json-text.svg': 'a row of braces and dots',
  'az/az-sql.svg': 'the letters SQL set as a word',
  'az/az-azion-api.svg': 'the letters API set as a word',
  'az/az-move-horizontal.svg': 'a horizontal double arrow',
  'az/az-move-vertical.svg': 'a vertical double arrow',
  'az/az-caret-up.svg': 'a filled triangle, twice as wide as tall',
  'az/az-caret-down.svg': 'a filled triangle, twice as wide as tall',
  'az/az-caret-left.svg': 'a filled triangle, twice as tall as wide',
  'az/az-caret-right.svg': 'a filled triangle, twice as tall as wide',
  'az/az-sort-up-fill.svg': 'a filled triangle, twice as wide as tall',
  'az/az-sort-down-fill.svg': 'a filled triangle, twice as wide as tall',
  'az/az-chevron-up.svg': 'an open angle, wider than tall',
  'az/az-chevron-down.svg': 'an open angle, wider than tall',
  'az/az-chevron-left.svg': 'an open angle, taller than wide',
  'az/az-chevron-right.svg': 'an open angle, taller than wide',
  'az/az-star-half.svg': 'the left half of a star',
  'az/az-jekyll.svg': 'the Jekyll test tube, a tall logo',
  'az/az-langgraph.svg': 'the LangGraph logo, a wide mark',
  'az/az-windsurf.svg': 'the Windsurf logo, a wide wave',
  'az-color/az-jekyll.svg': 'the Jekyll test tube, a tall logo',
  'az-color/az-langgraph.svg': 'the LangGraph logo, a wide mark',
  'az-color/az-windsurf.svg': 'the Windsurf logo, a wide wave'
}

const EPSILON = 0.05

const attribute = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]

const numbers = (text) => (text.match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? []).map(Number)

const ARGUMENT_COUNTS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 }

const tokenize = (d) => {
  const commands = []
  const pattern = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g
  for (const [, letter, body] of d.matchAll(pattern)) {
    const count = ARGUMENT_COUNTS[letter.toLowerCase()]
    if (count === 0) {
      commands.push([letter, []])
      continue
    }
    const args = letter.toLowerCase() === 'a' ? arcArguments(body) : numbers(body)
    for (let index = 0; index < args.length; index += count) {
      const implicit =
        index > 0 && letter.toLowerCase() === 'm' ? (letter === 'm' ? 'l' : 'L') : letter
      commands.push([implicit, args.slice(index, index + count)])
    }
  }
  return commands
}

const arcArguments = (body) => {
  const out = []
  let rest = body
  const number = /^[\s,]*(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/i
  const flag = /^[\s,]*([01])/
  while (rest.trim().replace(/,/g, '') !== '') {
    for (let slot = 0; slot < 7; slot++) {
      const match = (slot === 3 || slot === 4 ? flag : number).exec(rest)
      if (!match) return out
      out.push(Number(match[1]))
      rest = rest.slice(match[0].length)
    }
  }
  return out
}

const quadraticRoots = (a, b, c) => {
  if (Math.abs(a) < 1e-12) return Math.abs(b) < 1e-12 ? [] : [-c / b]
  const discriminant = b * b - 4 * a * c
  if (discriminant < 0) return []
  const root = Math.sqrt(discriminant)
  return [(-b + root) / (2 * a), (-b - root) / (2 * a)]
}

const cubicExtrema = (p0, p1, p2, p3) =>
  quadraticRoots(3 * (-p0 + 3 * p1 - 3 * p2 + p3), 6 * (p0 - 2 * p1 + p2), 3 * (p1 - p0)).filter(
    (t) => t > 0 && t < 1
  )

const cubicAt = (p0, p1, p2, p3, t) =>
  (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3

const arcPoints = (x1, y1, rx, ry, rotation, large, sweep, x2, y2) => {
  if (rx === 0 || ry === 0) return [[x2, y2]]
  const phi = (rotation * Math.PI) / 180
  const cos = Math.cos(phi)
  const sin = Math.sin(phi)
  const dx = (x1 - x2) / 2
  const dy = (y1 - y2) / 2
  const xp = cos * dx + sin * dy
  const yp = -sin * dx + cos * dy
  rx = Math.abs(rx)
  ry = Math.abs(ry)
  const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry)
  if (lambda > 1) {
    rx *= Math.sqrt(lambda)
    ry *= Math.sqrt(lambda)
  }
  const numerator = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp
  const denominator = rx * rx * yp * yp + ry * ry * xp * xp
  const factor = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, numerator / denominator))
  const cxp = (factor * rx * yp) / ry
  const cyp = (-factor * ry * xp) / rx
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2
  const angle = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
  const start = angle(1, 0, (xp - cxp) / rx, (yp - cyp) / ry)
  let delta = angle((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry)
  if (!sweep && delta > 0) delta -= 2 * Math.PI
  if (sweep && delta < 0) delta += 2 * Math.PI
  const steps = 64
  const points = []
  for (let step = 1; step <= steps; step++) {
    const theta = start + (delta * step) / steps
    points.push([
      cx + rx * Math.cos(theta) * cos - ry * Math.sin(theta) * sin,
      cy + rx * Math.cos(theta) * sin + ry * Math.sin(theta) * cos
    ])
  }
  return points
}

export const pathBounds = (d) => {
  const points = []
  let x = 0
  let y = 0
  let startX = 0
  let startY = 0
  let controlX = 0
  let controlY = 0
  let previous = ''
  const cubic = (x1, y1, x2, y2, x3, y3) => {
    for (const t of [...cubicExtrema(x, x1, x2, x3), ...cubicExtrema(y, y1, y2, y3)]) {
      points.push([cubicAt(x, x1, x2, x3, t), cubicAt(y, y1, y2, y3, t)])
    }
    points.push([x3, y3])
    controlX = x2
    controlY = y2
    x = x3
    y = y3
  }
  const quadratic = (x1, y1, x2, y2) => {
    cubic(
      x + (2 / 3) * (x1 - x),
      y + (2 / 3) * (y1 - y),
      x2 + (2 / 3) * (x1 - x2),
      y2 + (2 / 3) * (y1 - y2),
      x2,
      y2
    )
    controlX = x1
    controlY = y1
  }
  for (const [letter, args] of tokenize(d)) {
    const relative = letter === letter.toLowerCase()
    const ox = relative ? x : 0
    const oy = relative ? y : 0
    switch (letter.toLowerCase()) {
      case 'm':
        x = ox + args[0]
        y = oy + args[1]
        startX = x
        startY = y
        points.push([x, y])
        break
      case 'l':
        x = ox + args[0]
        y = oy + args[1]
        points.push([x, y])
        break
      case 'h':
        x = ox + args[0]
        points.push([x, y])
        break
      case 'v':
        y = oy + args[0]
        points.push([x, y])
        break
      case 'c':
        cubic(ox + args[0], oy + args[1], ox + args[2], oy + args[3], ox + args[4], oy + args[5])
        break
      case 's': {
        const reflect = 'CcSs'.includes(previous)
        cubic(
          reflect ? 2 * x - controlX : x,
          reflect ? 2 * y - controlY : y,
          ox + args[0],
          oy + args[1],
          ox + args[2],
          oy + args[3]
        )
        break
      }
      case 'q':
        quadratic(ox + args[0], oy + args[1], ox + args[2], oy + args[3])
        break
      case 't': {
        const reflect = 'QqTt'.includes(previous)
        quadratic(
          reflect ? 2 * x - controlX : x,
          reflect ? 2 * y - controlY : y,
          ox + args[0],
          oy + args[1]
        )
        break
      }
      case 'a': {
        const [rx, ry, rotation, large, sweep, ex, ey] = args
        points.push(...arcPoints(x, y, rx, ry, rotation, large, sweep, ox + ex, oy + ey))
        x = ox + ex
        y = oy + ey
        break
      }
      case 'z':
        x = startX
        y = startY
        break
    }
    previous = letter
  }
  if (points.length === 0) return null
  const xs = points.map(([px]) => px)
  const ys = points.map(([, py]) => py)
  return { x: Math.min(...xs), y: Math.min(...ys), right: Math.max(...xs), bottom: Math.max(...ys) }
}

const translation = (transform) => {
  const match = transform?.match(/^\s*translate\(\s*([^)]*)\)\s*$/)
  if (!match) return [0, 0]
  const [tx = 0, ty = 0] = numbers(match[1])
  return [tx, ty]
}

export const drawnBounds = (svg) => {
  const visible = svg
    .replace(/<defs[\s\S]*?<\/defs>/g, '')
    .replace(/<clipPath[\s\S]*?<\/clipPath>/g, '')
  let box = null
  for (const [tag] of visible.matchAll(/<path\b[^>]*>/g)) {
    const d = attribute(tag, 'd')
    if (!d) continue
    const bounds = pathBounds(d)
    if (!bounds) continue
    const [tx, ty] = translation(attribute(tag, 'transform'))
    const shifted = {
      x: bounds.x + tx,
      y: bounds.y + ty,
      right: bounds.right + tx,
      bottom: bounds.bottom + ty
    }
    box = box
      ? {
          x: Math.min(box.x, shifted.x),
          y: Math.min(box.y, shifted.y),
          right: Math.max(box.right, shifted.right),
          bottom: Math.max(box.bottom, shifted.bottom)
        }
      : shifted
  }
  return box && { ...box, width: box.right - box.x, height: box.bottom - box.y }
}

const nonUniformTransform = (transform) => {
  for (const [, name, body] of transform.matchAll(/(scale|matrix|skewX|skewY)\(([^)]*)\)/g)) {
    const values = numbers(body)
    if (name === 'skewX' || name === 'skewY') return `${name}(${body}) skews the drawing`
    if (name === 'scale') {
      const [sx, sy = sx] = values
      if (Math.abs(Math.abs(sx) - Math.abs(sy)) > 1e-6)
        return `scale(${body}) scales x and y differently`
    }
    if (name === 'matrix') {
      const [a, b, c, d] = values
      const columnX = a * a + b * b
      const columnY = c * c + d * d
      if (Math.abs(columnX - columnY) > 1e-6 || Math.abs(a * c + b * d) > 1e-6) {
        return `matrix(${body}) does not scale x and y alike`
      }
    }
  }
  return null
}

export const geometryIssues = (svg, key) => {
  const issues = []
  const root = svg.match(/<svg\b[^>]*>/)?.[0] ?? ''
  const width = Number(attribute(root, 'width'))
  const height = Number(attribute(root, 'height'))
  const viewBox = attribute(root, 'viewBox')
  if (width !== ICON_CANVAS || height !== ICON_CANVAS) {
    issues.push(`canvas is ${width}x${height}, the set draws on ${ICON_CANVAS}x${ICON_CANVAS}`)
  }
  if (viewBox !== undefined && numbers(viewBox).join(' ') !== `0 0 ${ICON_CANVAS} ${ICON_CANVAS}`) {
    issues.push(`viewBox="${viewBox}" does not match the ${ICON_CANVAS}x${ICON_CANVAS} canvas`)
  }
  if (/\spreserveAspectRatio=/.test(svg)) {
    issues.push(
      `preserveAspectRatio="${attribute(svg, 'preserveAspectRatio')}" can stretch the drawing`
    )
  }
  for (const [, transform] of svg.matchAll(/\stransform="([^"]*)"/g)) {
    const problem = nonUniformTransform(transform)
    if (problem) issues.push(problem)
  }
  const box = drawnBounds(svg)
  if (!box) return issues
  if (
    box.x < -EPSILON ||
    box.y < -EPSILON ||
    box.right > ICON_CANVAS + EPSILON ||
    box.bottom > ICON_CANVAS + EPSILON
  ) {
    issues.push(
      `drawing (${box.x.toFixed(2)}, ${box.y.toFixed(2)})–(${box.right.toFixed(2)}, ${box.bottom.toFixed(2)}) overflows the canvas`
    )
  }
  const squareness = Math.min(box.width, box.height) / Math.max(box.width, box.height)
  if (squareness < MIN_SQUARENESS && !(key in INTENTIONALLY_NON_SQUARE)) {
    issues.push(
      `drawing is ${box.width.toFixed(2)}x${box.height.toFixed(2)} (ratio ${squareness.toFixed(2)}), badly non-square`
    )
  }
  return issues
}
