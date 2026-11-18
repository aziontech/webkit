export const SURFACES = {
  app: 'Product UI (the console and other apps). The default for components.',
  site: 'The marketing site (azion.com): page sections, bands, brand and client assets.',
  docs: 'The documentation site: doc page chrome, callouts, steps, on-this-page.',
  edge: "Pages Azion's edge serves to the visitors of a customer's site (error pages), with no Azion product chrome and no account actions."
}

const BY_COMPONENT_FOLDER = {
  marketing: 'site',
  section: 'site',
  docs: 'docs'
}

const BY_COMPONENT = {
  'layout/registration-frame': 'site',
  'layout/site-layout': 'site'
}

export function surfaceFromTarget(target) {
  const component = String(target).match(/^\.\/src\/components\/([^/]+)\/([^/]+)\//)
  if (component) {
    return (
      BY_COMPONENT[`${component[1]}/${component[2]}`] ?? BY_COMPONENT_FOLDER[component[1]] ?? 'app'
    )
  }
  if (/^\.\/src\/assets\/(logos|illustrations|globe|scenes)\//.test(target)) return 'site'
  if (/^\.\/src\/assets\/diagrams\//.test(target)) return 'site'
  return null
}
