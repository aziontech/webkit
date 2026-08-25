// The MDX page registry — every `.mdx` in `content/`, plus the reading chrome the shell
// asks each page for: its trail, and the pages before and after it.
//
// It exists so that ADDING A DOCUMENTATION PAGE IS ADDING A FILE. Before this, each page
// was its own routed view repeating the same forty lines of wiring (parse, scroll-spy,
// heading nav, rail groups, crumbs, previous/next) with only the import and three
// constants changing — which is fine for two pages and is a copy-paste factory at ten.
// Now `content/<slug>.mdx` + an `href` on its row in `docs-nav.js` is the whole change,
// and `AzionDocsPage` renders it.
//
// THE TRAIL AND THE READING ORDER COME FROM THE RAIL, not from frontmatter. The rail
// already knows where a page sits and what is next to it, so restating either in the file
// would be a second copy free to drift — the exact failure the old per-view constants had
// (`First deploy`'s `next` still pointed at a "Go live" page that never existed). Derived
// here, a page's neighbours change when the tree changes, and a page nobody can reach from
// the rail gets no neighbours at all, which is the honest answer.
import { splitFrontmatter } from '@aziontech/webkit-docs/mdx'
import { menuLeaves, menuPath } from '@shared/lib/menu-tree.js'

import { docsNavSections } from './docs-nav.js'

/**
 * Every `.mdx` under `content/`, as slug → raw source.
 *
 * `eager` because a documentation page is content, not a code-split boundary: the whole
 * set is a few dozen kB of text, and lazy-loading it would trade that for a spinner on
 * every page turn. `?raw` because the parser is ours — `DocMarkdown` reads the source, so
 * nothing compiles `.mdx` at build time.
 */
const SOURCES = Object.fromEntries(
  Object.entries(
    import.meta.glob('../content/*.mdx', { query: '?raw', import: 'default', eager: true })
  ).map(([path, source]) => [path.replace(/^.*\/([^/]+)\.mdx$/, '$1'), source])
)

/** Whether a slug has a page behind it — what the router checks before rendering. */
export const hasDocsPage = (slug) => Object.hasOwn(SOURCES, slug)

/** The raw `.mdx` for a slug, or `''` when there is none. */
export const docsPageSource = (slug) => SOURCES[slug] ?? ''

/** Every row of the rail in column order, tagged with the segment it sits in. */
const ROWS = docsNavSections.flatMap((section) =>
  menuLeaves(section.items).map((row) => ({ ...row, section: section.label }))
)

/** Label of every container in the tree, so a crumb can name one by id. */
const LABELS = new Map()
const collectLabels = (items) => {
  for (const item of items) {
    LABELS.set(item.id, item.label)
    if (item.children) collectLabels(item.children)
  }
}
docsNavSections.forEach((section) => collectLabels(section.items))

/** The rows that are actually reachable, in order — the reading order the pair walks. */
const REACHABLE = ROWS.filter((row) => row.href?.startsWith('/site/docs'))

const neighbour = (index, step) => {
  const row = REACHABLE[index + step]
  return row ? { title: row.label, href: row.href } : null
}

/**
 * The reading chrome for one page, keyed by its route.
 *
 * @param {string} path - the in-app route, e.g. `/site/docs/cache`.
 * @returns {{ crumbs: object[], previous: object|null, next: object|null }}
 */
export const docsPageChrome = (path) => {
  const index = REACHABLE.findIndex((row) => row.href === path)
  if (index === -1) return { crumbs: [], previous: null, next: null }
  const row = REACHABLE[index]

  // Documentation › segment › the innermost container › this page. The full ancestor chain
  // is up to four containers deep (`Build › Applications › Modules › Cache`), which is a
  // trail that wraps to two lines in a bar pinned for the whole scroll — so it keeps the
  // one container that actually disambiguates the page ("About Cache" under `Cache`).
  const containers = menuPath(
    docsNavSections.flatMap((section) => section.items),
    row.id
  )
  const innermost = containers?.length ? LABELS.get(containers[containers.length - 1]) : null

  return {
    crumbs: [
      { label: 'Documentation', href: '/site/docs' },
      { label: row.section },
      ...(innermost ? [{ label: innermost }] : []),
      { label: row.label, current: true }
    ],
    previous: neighbour(index, -1),
    next: neighbour(index, 1)
  }
}

/** `sourcePath` from a page's frontmatter — where its markdown lives in the docs repo. */
export const docsPageSourcePath = (slug) =>
  splitFrontmatter(docsPageSource(slug)).frontmatter.sourcePath ?? ''
