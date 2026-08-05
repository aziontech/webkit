/**
 * Letter-spacing scale, in `rem` so the emitted CSS carries a single measure
 * unit across the whole token set (font sizes, spacings and tracking are all
 * root-relative). Values are the em-scale numbers kept as-is, so `widest`
 * resolves to a fixed 1.6px instead of 10% of the element's font size.
 */
export const tracking = {
  tighter: '-0.05rem',
  tight: '-0.025rem',
  normal: '0',
  wide: '0.025rem',
  wider: '0.05rem',
  widest: '0.1rem'
}

export default { tracking }
