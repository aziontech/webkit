// Column FLOORS, in px, for the table cells whose content is BOUNDED rather than prose
// — a chip, a date, a count, a size, an id, a person, a short enum.
//
// A `grow` weight asks for a SHARE of whatever space the table has left over, which
// is the right ask for a cell whose content is open-ended — a name, a domain, an
// address, a commit message. A cell that holds one short chip has no such appetite,
// and asking anyway made the same chip column a different width in every table: a
// 62px `Active` pill sat in a 242px column on Teams and a 134px one on WAF Rules,
// each carrying 70–180px of dead space that the name column next to it needed. The
// list columns were worse — Permissions took 565px to show one label and a `+50`.
//
// So a chip column declares a number instead of a share. These are the numbers, and
// they are **`minWidth`** — a FLOOR, not a reservation. The table measures what the
// column actually holds (its header, with the sort affordance, and every rendered
// cell) and resolves ONE width per column: the larger of this floor and that content.
// So the column asks for nothing it is not using, and nothing inside it truncates.
//
// They were `width` (a fixed reservation) until 2026-08-24, and a fixed number is a
// bet in both directions. Measured across the console's 24 lists it was 8–43px too
// generous on almost every chip column — the floor that mattered turned out to be the
// HEADER plus its sort affordance (`Status` needs 100px; the pill under it needs 62) —
// and on WAF Rules it was 89px too small, so `Threat Types` rendered as `SQL In…` and
// `Cross-Site Scri…`, which is a threat type nobody can read. `minWidth` is right
// about the only thing a number can be right about here: the minimum.
//
// Four values, not one per column: a ladder keeps chip columns reading as a family
// across tables, and the measurement takes care of the rest.
//
// Composition-mode tables (`<Table.HeadCell :style>`, e.g. ManageResources) size their
// own columns and get no measurement — every row there is its own flex container, so a
// content-sized column would drift the header away from the body. They keep a fixed
// `flex: 0 0 <n>px` built from these same numbers.

/** One chip under a one-word header — Status, Type, Mode, Role, Level, Access. */
export const TAG_COLUMN = 104

/**
 * One chip whose header is two words or whose label is a phrase — Environment,
 * Infrastructure, Tiered cache, Category. Also the tier for a chip list whose chips
 * are narrower than its own header (Status Codes: three numeric chips).
 */
export const TAG_COLUMN_WIDE = 136

/** A one-line chip list ending in `+N` — Threat Types, Modules. */
export const TAG_LIST_COLUMN = 200

/**
 * …the same, when the first entry is a phrase rather than a word — Permissions, whose
 * longest entry is `View Content Delivery Settings`.
 */
export const TAG_LIST_COLUMN_WIDE = 256

/**
 * Any OTHER column whose content is bounded — a date, a count, a size, an id, a
 * person, a short enum. There is no per-column number to pick here: the measurement
 * decides the width, and this is only the floor it never drops below, the same 5rem
 * the table's own flex basis already uses.
 *
 * It is deliberately NOT for a column whose content is open-ended — a name, a domain,
 * a path, a URL, a message, a description. Those are the columns that should absorb
 * what the fitted ones hand back, and truncate when there is nothing left to absorb.
 * Two reasons, and the second is the one that bites: an open-ended column fitted to
 * its content stops truncating, so one long row makes the column wide for every row;
 * and if EVERY column in a table is fitted, the row no longer fills the table — the
 * leftover collects as a gap in front of the row-actions column instead of behind the
 * identity the reader scans. Every list keeps at least one column on a share.
 */
export const FIT_COLUMN = 80
