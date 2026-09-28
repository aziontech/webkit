// Client SYMBOLS — the square, 24px form of a client's mark.
//
// The registry next door (../index.js) owns the trust-strip form of every client: a
// `logo` wordmark, plus a `logoLight`/`artwork` rule for placing it on a theme. That
// form is useless in an avatar — `ifood-logo.svg` is 2500×1413, and a lockup squeezed
// into a 24px square is a smudge. So the square form lives here, and the two are
// deliberately separate assets rather than one asset scaled two ways.
//
// EACH FILE IS A COMPLETE TILE: a 24×24 `<rect>` in the brand's own colour with the
// mark composed on top, in the colour the brand draws it. That is why nothing here
// needs a brand hex, a per-theme swap or an inversion filter — the contrast is settled
// inside the file, so one asset is correct on both themes. Compare the four story
// clients in ../index.js, whose `symbol` ships as a bare white silhouette and has to be
// composed onto `brand.base` at render time.
import caixa from './caixa.svg'
import gpa from './gpa.svg'
import ifood from './ifood.svg'
import itau from './itau.svg'
import tray from './tray.svg'

/**
 * A company name reduced to letters and digits, accents folded away — so
 * "Caixa Econômica Federal", "Itaú" and "MadeiraMadeira" all resolve without a table
 * of spellings. Shared with the ../index.js lookup so both registries key alike.
 */
export const normalizeClientName = (name) =>
  (name ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

// Keyed by that normalized name.
export const CLIENT_SYMBOLS = {
  caixaeconomicafederal: caixa,
  gpa,
  ifood,
  itau,
  tray
}

/** The 24px tile for a client name, or `null` when this repo has no square mark for it. */
export const clientSymbolFor = (name) => CLIENT_SYMBOLS[normalizeClientName(name)] ?? null
