export const tokenRef = (path) => ({ __ref: path })

export const isTokenRef = (value) => typeof value === 'object' && value !== null && '__ref' in value

export const assertResolvedRefs = (context, unresolved) => {
  if (unresolved.length === 0) return
  const lines = unresolved.map((entry) => `  ${entry}`).join('\n')
  throw new Error(`[theme] ${unresolved.length} unresolved tokenRef(s) in ${context}:\n${lines}`)
}
