export const NAVIGATION_RULE = 'webkit-navigation-levels'

export function collectNavigation() {
  const SKIP = /breadcrumb|pagination|pager/i
  const hidden = (el) => el.closest('[hidden],[inert],[aria-hidden="true"]') !== null
  const text = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim()
  const signature = (el) =>
    [el.getAttribute('aria-label'), el.getAttribute('data-testid'), el.id].filter(Boolean).join(' ')
  const kindOf = (el) =>
    el.getAttribute('role') === 'tablist'
      ? 'tablist'
      : el.tagName.toLowerCase() === 'nav'
        ? 'nav'
        : 'role=navigation'
  const nameOf = (el, index) => {
    const own = el.getAttribute('aria-label')
    if (own && own.trim()) return own.trim()
    const ids = (el.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean)
    const labelled = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map(text)
      .join(' ')
    if (labelled) return labelled
    const region = el.parentElement?.closest('aside[aria-label],[role="complementary"][aria-label]')
    if (region) return region.getAttribute('aria-label').trim()
    const testId = el.getAttribute('data-testid')
    if (testId) return testId
    return `${kindOf(el)} ${index + 1}`
  }
  const linkOf = (el) =>
    el.matches('a[href]') ? el : el.querySelector('a[href]') || el.closest('a[href]')

  const candidates = [
    ...document.querySelectorAll('nav, [role="navigation"], [role="tablist"]')
  ].filter((el) => !hidden(el) && !SKIP.test(signature(el)))
  const roots = candidates.filter(
    (el) => !candidates.some((other) => other !== el && other.contains(el))
  )

  return {
    url: location.href,
    controls: roots.map((el, index) => {
      const currents = [...el.querySelectorAll('[aria-current="page"]')].filter(
        (node) => !hidden(node)
      )
      const currentLinks = new Set(currents.map(linkOf).filter(Boolean))
      const links = [...el.querySelectorAll('a[href]')]
        .filter((a) => !hidden(a))
        .map((a) => ({
          href: a.href,
          raw: a.getAttribute('href'),
          label: text(a) || a.getAttribute('aria-label') || '',
          current: currentLinks.has(a)
        }))
      return {
        name: nameOf(el, index),
        kind: kindOf(el),
        currentCount: currents.length,
        currentLabels: currents.map((node) => text(node) || node.getAttribute('aria-label') || ''),
        links
      }
    })
  }
}

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

export function navigationFindings(snapshot) {
  const findings = []
  const pageUrl = snapshot.url
  const controls = snapshot.controls.map((control) => ({
    ...control,
    routes: control.links
      .map((link) => ({ ...link, route: routeOf(link.href, link.raw, pageUrl) }))
      .filter((link) => link.route)
  }))

  const owners = new Map()
  controls.forEach((control, index) => {
    for (const link of control.routes) {
      if (!owners.has(link.route)) owners.set(link.route, new Map())
      const byControl = owners.get(link.route)
      if (!byControl.has(index)) byControl.set(index, link.label)
    }
  })
  for (const [route, byControl] of owners) {
    if (byControl.size < 2) continue
    const offers = [...byControl].map(
      ([index, label]) => `${display(controls[index])} as "${label}"`
    )
    findings.push({
      rule: `${NAVIGATION_RULE}/duplicate-route`,
      route,
      controls: [...byControl.keys()].map((index) => controls[index].name),
      message: `${route} is offered by ${offers.length} navigation controls: ${offers.join(' and ')}. A destination appears once per screen: keep it in one level and drop it from the other (${NAVIGATION_RULE}, rule 2).`
    })
  }

  for (const control of controls) {
    if (control.currentCount <= 1) continue
    const labels = control.currentLabels.map((label) => `"${label}"`).join(', ')
    findings.push({
      rule: `${NAVIGATION_RULE}/many-current`,
      controls: [control.name],
      message: `${display(control)} marks ${control.currentCount} rows as aria-current="page" (${labels}): a control marks exactly one current row (${NAVIGATION_RULE}, rule 5).`
    })
  }

  const current = controls
    .map((control) => ({ control, link: control.routes.find((link) => link.current) }))
    .filter((entry) => entry.link)
  for (let i = 0; i < current.length; i++) {
    for (let j = i + 1; j < current.length; j++) {
      const a = current[i]
      const b = current[j]
      const ra = a.link.route
      const rb = b.link.route
      if (ra === rb || contains(ra, rb) || contains(rb, ra)) continue
      findings.push({
        rule: `${NAVIGATION_RULE}/current-disagrees`,
        route: ra,
        controls: [a.control.name, b.control.name],
        message: `${display(a.control)} marks "${a.link.label}" (${ra}) as the current page but ${display(b.control)} marks "${b.link.label}" (${rb}): the current rows of every level describe the same place (${NAVIGATION_RULE}, rule 5).`
      })
    }
  }

  return findings
}
