import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')
const SKIP = new Set(['_app', 'assets'])
const DYNAMIC = [/^\/frame\//, /^\/example(?:\/|$)/]

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return SKIP.has(name) ? [] : pages(path)
    return name.endsWith('.html') ? [path] : []
  })
}

function routeOf(page) {
  const path = relative(DIST, page).split('\\').join('/')
  const route = path.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '')
  return `/${route}`
}

const VOID = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr'
])

function withoutExamples(html) {
  let out = ''
  let at = 0
  const start = /<([a-z][a-z0-9-]*)\b[^>]*\sdata-example="[^"]*"[^>]*>/gi
  for (let match = start.exec(html); match; match = start.exec(html)) {
    out += html.slice(at, match.index)
    const tag = /<\/?([a-z][a-z0-9-]*)\b[^>]*?(\/?)>/gi
    tag.lastIndex = match.index
    let depth = 0
    let end = html.length
    for (let token = tag.exec(html); token; token = tag.exec(html)) {
      const name = token[1].toLowerCase()
      if (VOID.has(name) || token[2]) continue
      depth += token[0][1] === '/' ? -1 : 1
      if (depth === 0) {
        end = tag.lastIndex
        break
      }
    }
    at = end
    start.lastIndex = end
  }
  return out + html.slice(at)
}

function exists(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/$/, '')
  const candidates = [
    join(DIST, clean),
    join(DIST, clean, 'index.html'),
    join(DIST, `${clean}.html`)
  ]
  return candidates.some((candidate) => existsSync(candidate) && statSync(candidate).isFile())
}

if (!existsSync(DIST)) {
  process.stderr.write(`check-links: ${DIST} is missing. Run pnpm build:docs first.\n`)
  process.exit(1)
}

const broken = new Map()
for (const page of pages(DIST)) {
  const html = withoutExamples(readFileSync(page, 'utf8'))
  const from = routeOf(page)
  if (from.startsWith('/frame/')) continue
  for (const match of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&')
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(href)) continue
    const url = new URL(href, `http://docs.local${from.endsWith('/') ? from : `${from}/`}`)
    if (DYNAMIC.some((pattern) => pattern.test(url.pathname))) continue
    if (exists(url.pathname)) continue
    const list = broken.get(url.pathname) ?? new Set()
    list.add(from)
    broken.set(url.pathname, list)
  }
}

if (broken.size) {
  process.stderr.write(`check-links: ${broken.size} internal link target(s) do not exist:\n`)
  for (const [target, from] of broken) {
    const sample = [...from].slice(0, 3).join(', ')
    process.stderr.write(
      `  ${target}  (from ${sample}${from.size > 3 ? `, +${from.size - 3}` : ''})\n`
    )
  }
  process.exit(1)
}

process.stdout.write('check-links: every internal link resolves to a built page.\n')
