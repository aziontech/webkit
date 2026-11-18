import { expect, test } from '@playwright/test'

import { findBandEdges } from './band-edges'
import { DOCS, label, type Mode, prepare, query, settle } from './lib'

const WIDTHS = [390, 1280]

const pages: { name: string; path: string }[] = [{ name: 'docs home', path: '/' }]

for (const { name, path } of pages) {
  for (const width of WIDTHS) {
    const mode: Mode = { theme: 'light', width }
    test(`band edges ${name} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}${path}${query(mode)}`)
      await settle(page)
      const bands = await page.evaluate(findBandEdges)
      expect(bands.length, 'the page renders its bands').toBeGreaterThan(1)
      const [first] = bands
      expect(
        bands
          .filter((band) => Math.abs(band.edge - first.edge) > 1)
          .map((band) => `${band.band} starts at ${band.edge}px, ${first.band} at ${first.edge}px`),
        'every band starts its content on one edge: the band inset is --spacing-xl inside the column'
      ).toEqual([])
    })
  }
}
