// Hydration from a Node render (M1.10): every block and example is rendered by vue/server-renderer
// in Node (server-render.ts, a browser command), where window and document do not exist, the SFCs
// are compiled for SSR and the time zone differs from the browser's. The browser then hydrates over
// that HTML. It covers `typeof window` branches, media queries read during setup, and dates or clock
// times that depend on the zone or the day, which the in-browser render of hydration.test.ts cannot see.
//
// KNOWN lists component defects this pass found that belong to other lanes. A mismatch matching one
// does not fail its file, nor do the follow-ups it causes (the closing notice and shifted useId
// values); any other mismatch does. The last test fails when a known mismatch no longer occurs,
// so the entry is removed together with the fix.
import { describe, expect, it } from 'vitest'
import { commands } from 'vitest/browser'

import { files, modules, useHydrationHost } from './hydration-shared'
import type {} from './server-render'

const KNOWN: { component: string; signature: RegExp; cause: string }[] = []

const CASCADE =
  /^Hydration completed but contains mismatches\.|rendered on server: [\w-]+="[^"]*\bv-\d+/

const seen = new Set<string>()
let finished = 0

describe('blocks and examples rendered in Node hydrate without mismatches', () => {
  const { hydrate } = useHydrationHost()

  it.each(files)('%s', async (file) => {
    const rendered = await commands.renderOnServer(file)
    expect(rendered.error, `${file} fails to render in Node`).toBeNull()
    const mod = await modules[`../../${file}`]()
    const mismatches = await hydrate(mod.default, rendered.html, rendered.teleports)
    const known = mismatches.map((message) =>
      KNOWN.find(({ signature }) => signature.test(message))
    )
    for (const entry of known) if (entry) seen.add(entry.component)
    const unexpected = mismatches.filter(
      (message, index) => !known[index] && !(known.some(Boolean) && CASCADE.test(message))
    )
    finished += 1
    expect(unexpected, unexpected.join('\n')).toEqual([])
  })

  it('every known mismatch still occurs', () => {
    if (finished < files.length) return
    const gone = KNOWN.filter(({ component }) => !seen.has(component)).map(
      ({ component }) => component
    )
    expect(gone, `fixed, remove from KNOWN: ${gone.join(', ')}`).toEqual([])
  })
})
