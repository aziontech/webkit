/**
 * Token reference helpers.
 */

export const tokenRef = (path) => ({ __ref: path })

export const isTokenRef = (value) => typeof value === 'object' && value !== null && '__ref' in value

/**
 * Fail loudly on unresolved refs. A typo'd token must never silently vanish
 * from the compiled CSS or ship as a raw `path.to.token` string — the compilers
 * collect every miss and this throws once with the full list.
 */
export const assertResolvedRefs = (context, unresolved) => {
  if (unresolved.length === 0) return
  const lines = unresolved.map((entry) => `  ${entry}`).join('\n')
  throw new Error(`[theme] ${unresolved.length} unresolved tokenRef(s) in ${context}:\n${lines}`)
}
