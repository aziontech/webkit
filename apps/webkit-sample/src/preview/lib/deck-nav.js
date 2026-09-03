// DECK NAVIGATION — the three things the reviewing surface and the presenting one must agree on.
//
// The deck is TWO ROUTES, not two modes of one view: `/preview` reviews it, `/preview/present/:slide`
// shows it. Splitting them is what makes a slide addressable — you can send someone slide 14 rather
// than "the deck, then click through" — it survives a reload, and it is why Escape can simply GO
// somewhere instead of unwinding a boolean the back button knows nothing about.
//
// The cost of two views is that both have to number, clamp and address slides identically, so
// neither does it itself.

/** Two digits, the way a slide is numbered in the filmstrip and in the presenter's counter. */
export const numberOf = (index) => String(index + 1).padStart(2, '0')

/** Hold an index inside the deck, whatever arithmetic or URL segment produced it. */
export const clampIndex = (index, length) =>
  Math.min(length - 1, Math.max(0, Number.isFinite(index) ? index : 0))

// The URL is 1-BASED because it is read by people: `/preview/present/1` is the first slide, and
// the number in it matches the number printed under the slide in the grid. Everything inside the
// app stays 0-based (it indexes an array), so the conversion lives here and nowhere else.

/** The presenting route for a 0-based slide index. */
export const presentPath = (index) => `/preview/present/${index + 1}`

/** The 0-based index a `:slide` route param names. */
export const indexFromParam = (param, length) => clampIndex(Number.parseInt(param, 10) - 1, length)
