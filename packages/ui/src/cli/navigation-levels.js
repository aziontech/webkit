export const NAVIGATION_RULE = 'azion-ui-navigation-levels'

function navHidden(el) {
  return el.closest('[hidden],[inert],[aria-hidden="true"]') !== null
}

function navText(el) {
  return (el.textContent || '').replace(/\s+/g, ' ').trim()
}

function navSignature(el) {
  return [el.getAttribute('aria-label'), el.getAttribute('data-testid'), el.id]
    .filter(Boolean)
    .join(' ')
}

function navKind(el) {
  if (el.getAttribute('role') === 'tablist') return 'tablist'
  return el.tagName.toLowerCase() === 'nav' ? 'nav' : 'role=navigation'
}

function navLabelledBy(el) {
  const ids = (el.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean)
  return ids
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .map(navText)
    .join(' ')
}

function navName(el, index) {
  const own = el.getAttribute('aria-label')
  if (own && own.trim()) return own.trim()
  const labelled = navLabelledBy(el)
  if (labelled) return labelled
  const region = el.parentElement?.closest('aside[aria-label],[role="complementary"][aria-label]')
  if (region) return region.getAttribute('aria-label').trim()
  const testId = el.getAttribute('data-testid')
  if (testId) return testId
  return `${navKind(el)} ${index + 1}`
}

function navLink(el) {
  return el.matches('a[href]') ? el : el.querySelector('a[href]') || el.closest('a[href]')
}

function navControl(el, index) {
  const currents = [...el.querySelectorAll('[aria-current="page"]')].filter(
    (node) => !navHidden(node)
  )
  const currentLinks = new Set(currents.map(navLink).filter(Boolean))
  const links = [...el.querySelectorAll('a[href]')]
    .filter((a) => !navHidden(a))
    .map((a) => ({
      href: a.href,
      raw: a.getAttribute('href'),
      label: navText(a) || a.getAttribute('aria-label') || '',
      current: currentLinks.has(a)
    }))
  return {
    name: navName(el, index),
    kind: navKind(el),
    currentCount: currents.length,
    currentLabels: currents.map((node) => navText(node) || node.getAttribute('aria-label') || ''),
    links
  }
}

export function collectNavigation() {
  const SKIP = /breadcrumb|pagination|pager/i
  const candidates = [
    ...document.querySelectorAll('nav, [role="navigation"], [role="tablist"]')
  ].filter((el) => !navHidden(el) && !SKIP.test(navSignature(el)))
  const roots = candidates.filter(
    (el) => !candidates.some((other) => other !== el && other.contains(el))
  )
  return { url: location.href, controls: roots.map(navControl) }
}

const BROWSER_FUNCTIONS = [
  navHidden,
  navText,
  navSignature,
  navKind,
  navLabelledBy,
  navName,
  navLink,
  navControl,
  collectNavigation
]

export const COLLECT_NAVIGATION_SCRIPT = `(() => {\n${BROWSER_FUNCTIONS.map(String).join('\n')}\nreturn collectNavigation()\n})()`

export function routeOf(href, raw, pageUrl) {
  if (!raw || /^\s*(javascript|mailto|tel|data):/i.test(raw)) return null
  let url
  let page
  try {
    page = new URL(pageUrl)
    url = new URL(href || raw, page)
  } catch {
    return null
  }
  if (url.origin !== page.origin) return null
  let route
  if (url.hash.startsWith('#/')) route = url.hash.slice(1).split(/[?#]/)[0]
  else if (raw.trim().startsWith('#')) return null
  else route = url.pathname
  return route.length > 1 ? route.replace(/\/+$/, '') || '/' : route
}

function contains(ancestor, route) {
  return ancestor !== '/' && route.startsWith(`${ancestor}/`)
}

const display = (control) => `"${control.name}" (${control.kind})`

function withRoutes(snapshot) {
  return snapshot.controls.map((control) => ({
    ...control,
    routes: control.links
      .map((link) => ({ ...link, route: routeOf(link.href, link.raw, snapshot.url) }))
      .filter((link) => link.route)
  }))
}

function routeOwners(controls) {
  const owners = new Map()
  controls.forEach((control, index) => {
    for (const link of control.routes) {
      if (!owners.has(link.route)) owners.set(link.route, new Map())
      const byControl = owners.get(link.route)
      if (!byControl.has(index)) byControl.set(index, link.label)
    }
  })
  return owners
}

function duplicateRouteFindings(controls) {
  const findings = []
  for (const [route, byControl] of routeOwners(controls)) {
    if (byControl.size < 2) continue
    const offers = [...byControl].map(
      ([index, label]) => `${display(controls[index])} as "${label}"`
    )
    findings.push({
      rule: `${NAVIGATION_RULE}/duplicate-route`,
      route,
      controls: [...byControl.keys()].map((index) => controls[index].name),
      message:
        `${route} is offered by ${offers.length} navigation controls: ${offers.join(' and ')}. A ` +
        `destination appears once per screen: keep it in one level and drop it from the other ` +
        `(${NAVIGATION_RULE}, rule 5).`
    })
  }
  return findings
}

function manyCurrentFindings(controls) {
  return controls
    .filter((control) => control.currentCount > 1)
    .map((control) => {
      const labels = control.currentLabels.map((label) => `"${label}"`).join(', ')
      return {
        rule: `${NAVIGATION_RULE}/many-current`,
        controls: [control.name],
        message: `${display(control)} marks ${control.currentCount} rows as aria-current="page" (${labels}): a control marks exactly one current row (${NAVIGATION_RULE}, rule 6).`
      }
    })
}

function disagreement(a, b) {
  const ra = a.link.route
  const rb = b.link.route
  if (ra === rb || contains(ra, rb) || contains(rb, ra)) return null
  return {
    rule: `${NAVIGATION_RULE}/current-disagrees`,
    route: ra,
    controls: [a.control.name, b.control.name],
    message:
      `${display(a.control)} marks "${a.link.label}" (${ra}) as the current page but ` +
      `${display(b.control)} marks "${b.link.label}" (${rb}): the current rows of every level ` +
      `describe the same place (${NAVIGATION_RULE}, rule 6).`
  }
}

function currentDisagreesFindings(controls) {
  const current = controls
    .map((control) => ({ control, link: control.routes.find((link) => link.current) }))
    .filter((entry) => entry.link)
  const findings = []
  for (let i = 0; i < current.length; i++) {
    for (let j = i + 1; j < current.length; j++) {
      const found = disagreement(current[i], current[j])
      if (found) findings.push(found)
    }
  }
  return findings
}

export function navigationFindings(snapshot) {
  const controls = withRoutes(snapshot)
  return [
    ...duplicateRouteFindings(controls),
    ...manyCurrentFindings(controls),
    ...currentDisagreesFindings(controls)
  ]
}
