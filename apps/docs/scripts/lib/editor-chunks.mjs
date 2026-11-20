export function indexGraph(graph) {
  return new Map(graph.chunks.map((chunk) => [chunk.file, chunk]))
}

export function staticClosure(byFile, seeds) {
  const seen = new Set()
  const stack = [...seeds]
  while (stack.length) {
    const file = stack.pop()
    if (seen.has(file) || !byFile.has(file)) continue
    seen.add(file)
    stack.push(...byFile.get(file).imports)
  }
  return seen
}

export function pageSeeds(html) {
  const seeds = new Set()
  const tag = /<(?:script|link)\b[^>]*>/g
  for (const [element] of html.matchAll(tag)) {
    const isScript = element.startsWith('<script') && /\btype="module"/.test(element)
    const isPreload = element.startsWith('<link') && /\brel="modulepreload"/.test(element)
    if (!isScript && !isPreload) continue
    const url = element.match(/\b(?:src|href)="\/?([^"]+\.js)"/)?.[1]
    if (url) seeds.add(url)
  }
  return [...seeds]
}

export function findEditorLeaks(graph, pages) {
  const byFile = indexGraph(graph)
  const problems = []
  const editors = graph.chunks.filter((chunk) => chunk.editor)
  if (!editors.length) {
    problems.push('the chunk graph holds no Monaco chunk: the detector no longer sees the editor')
  }
  for (const chunk of graph.chunks) {
    if (chunk.editor) continue
    for (const file of chunk.imports) {
      const target = byFile.get(file)
      if (!target?.editor) continue
      const foreign = target.foreignModules.length
        ? ` (${file} also holds ${target.foreignModules.slice(0, 3).join(', ')})`
        : ''
      problems.push(`${chunk.file} statically imports the Monaco chunk ${file}${foreign}`)
    }
  }
  for (const { route, seeds } of pages) {
    const loaded = [...staticClosure(byFile, seeds)].filter((file) => byFile.get(file).editor)
    if (loaded.length) problems.push(`${route} loads the Monaco chunks ${loaded.join(', ')}`)
  }
  return problems
}
