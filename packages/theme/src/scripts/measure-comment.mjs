/**
 * Measure-comment gate for the layout tokens — the check that keeps a `// 1620px`
 * annotation honest against the `var(--container-*)` it annotates. The VALUE is the
 * source of truth; the comment is a reader's convenience, and a comment that disagrees
 * with it is worse than no comment at all.
 *
 * Nothing else sees this: the annotation is a JS comment, so it never reaches the
 * compiled CSS the zero-unit gate reads, and no linter resolves a `var()` back to the
 * rung it names. A value can therefore be changed — or reverted — under a comment that
 * still describes the old one, with every gate green. Pure: node built-ins only.
 */

const MEASURE_LINE = /'([\w-]+)':\s*'var\(--container-([\w]+)\)',?\s*\/\/\s*(\d+)px/

/** Every `'token': 'var(--container-X)', // Npx` line, as `{ token, rung, claimed, n }`. */
export const findMeasureComments = (sourceText) =>
  sourceText.split('\n').flatMap((line, i) => {
    const m = line.match(MEASURE_LINE)
    return m ? [{ token: m[1], rung: m[2], claimed: Number(m[3]), n: i + 1 }] : []
  })

/**
 * Throw when a measure comment disagrees with the container rung it annotates, or names
 * a rung that does not exist. `container` is the rung table; `source` names the artifact.
 */
export const assertMeasureCommentsMatch = (sourceText, container, source = 'layouts.data.js') => {
  const rows = findMeasureComments(sourceText)
  const wrong = rows.flatMap(({ token, rung, claimed, n }) => {
    const real = container[rung]
    if (real === undefined) return [{ token, rung, claimed, n, real: null }]
    return parseInt(real, 10) === claimed ? [] : [{ token, rung, claimed, n, real }]
  })
  if (wrong.length === 0) return

  const detail = wrong
    .map(({ token, rung, claimed, n, real }) =>
      real === null
        ? `  ${source}:${n}  ${token} → --container-${rung} is not a rung of the ladder`
        : `  ${source}:${n}  ${token} → --container-${rung} is ${real}, comment says ${claimed}px`
    )
    .join('\n')
  throw new Error(
    `build:tokens — ${wrong.length} measure comment(s) disagree with the token value.\n${detail}\n` +
      'The value is the source of truth: fix the comment to match it, or change the rung if the ' +
      'value is what is wrong. Rungs live in src/tokens/primitives/shape/container.js.'
  )
}
