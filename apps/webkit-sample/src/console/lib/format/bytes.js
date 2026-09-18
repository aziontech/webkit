// Byte counts, rendered the way a file listing reads them.
//
// Every other size in the console is a MOCK STRING typed by hand
// (../data/object-storage.js: `'842 KB'`, `'1.25 KB'`) because nothing there ever held a
// real file. The project drop does — a `File` off a `DataTransfer` carries a real `size`
// in bytes — so its manifest needs the number turned into those same strings rather than
// a fixture written to look like one.
//
// Precision falls as the number grows, which is how a size is read: `1.25 KB` and
// `24.8 KB` and `842 KB` each carry about three significant digits, and a trailing `.0`
// on a round figure is noise.
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB']
const STEP = 1024

/**
 * Format a byte count as a short human size: `24.8 KB`, `842 KB`, `1.25 MB`.
 *
 * @param {number} bytes Size in bytes.
 * @returns {string}
 */
export function formatBytes(bytes = 0) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'

  let value = bytes
  let unit = 0
  while (value >= STEP && unit < UNITS.length - 1) {
    value /= STEP
    unit += 1
  }

  if (unit === 0) return `${Math.round(value)} B`
  const decimals = value >= 100 ? 0 : value >= 10 ? 1 : 2
  return `${Number(value.toFixed(decimals))} ${UNITS[unit]}`
}

const plural = (count, noun) => `${count} ${noun}${count === 1 ? '' : 's'}`

/**
 * The one line a manifest leads with: how many files, and how much they weigh.
 *
 * Both figures are now exact. They were not always: while the drop only read a project's
 * top level, the size covered four files with a 50 KB image sitting unweighed in
 * `assets/`, and the line had to hedge (`4 files (2.43 KB) and 2 folders`) to keep from
 * claiming a total it did not have. The walk goes all the way down now, so the hedge is
 * gone and the plain form is true.
 *
 * The one case that still qualifies itself is a project bigger than the walk agrees to
 * read (MAX_FILES in ../behavior/project-upload.js). There the count and the total are a
 * slice, and the line says `first 500 files` rather than presenting the slice as the lot.
 *
 * @param {{ size?: number }[]} files The files read off the drop.
 * @param {boolean} truncated Whether the walk stopped before the project did.
 * @returns {string}
 */
export function formatManifest(files = [], truncated = false) {
  const total = formatBytes(files.reduce((sum, file) => sum + (file.size ?? 0), 0))
  if (truncated) return `first ${plural(files.length, 'file')}, ${total}`
  return `${plural(files.length, 'file')}, ${total}`
}
