// Competitor marks, for the pages that compare the platform with another one.
//
// A separate population from `../clients/index.js` on purpose: that registry answers
// "who runs on Azion", and a name in here has never been a customer. Nothing that reads
// CLIENTS should pick these up, so they never share a list.
//
// The entry shape IS the client one — `{ name, logo, logoLight?, artwork? }` — because
// `ClientMark` already solves the only hard part of painting a foreign mark (placing it
// correctly on both themes), and that rule should not exist twice. The two routes are
// documented there and in the clients registry:
//
//   • `logo` + `logoLight` — two real assets, one per theme, neither filtered.
//   • `logo` + `artwork`   — one asset, inverted only where it would otherwise vanish.
//
// Vercel's brand is monochrome and ships both drawings, so it takes the two-asset route:
// the white lockup on dark, the black one on light, each the file the brand publishes.
import vercelDark from './dark/vercel.svg'
import vercelLight from './vercel.svg'

export const COMPETITORS = [{ name: 'Vercel', logo: vercelDark, logoLight: vercelLight }]

/** The entry for `name`, or a bare `{ name }` so a comparison still reads without artwork. */
export const competitor = (name) => COMPETITORS.find((entry) => entry.name === name) ?? { name }
