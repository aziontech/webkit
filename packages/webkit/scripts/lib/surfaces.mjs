export const SURFACES = {
  product: 'Product UI (the console and other apps). The default for components.',
  marketing: 'The marketing site (azion.com): page sections, bands, brand and client assets.',
  docs: 'The documentation site: doc page chrome, callouts, steps, on-this-page.'
}

const BY_COMPONENT_FOLDER = {
  marketing: 'marketing',
  sections: 'marketing',
  documentation: 'docs'
}

export function surfaceFromTarget(target) {
  const component = String(target).match(/^\.\/src\/components\/([^/]+)\//)
  if (component) return BY_COMPONENT_FOLDER[component[1]] ?? 'product'
  if (/^\.\/src\/assets\/(logos|illustrations|globe)\//.test(target)) return 'marketing'
  if (/^\.\/src\/assets\/diagrams\//.test(target)) return 'marketing'
  return null
}
