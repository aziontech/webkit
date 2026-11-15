const PRODUCTIVE_ENTRANCE = 'cubic-bezier(0.39, 0.57, 0.56, 1)'
const PRODUCTIVE_EXIT = 'cubic-bezier(0.55, 0.09, 0.68, 0.53)'
const EXPRESSIVE_ENTRANCE = 'cubic-bezier(0.17, 0.84, 0.44, 1)'
const EXPRESSIVE_EXIT = 'cubic-bezier(0.95, 0.05, 0.8, 0.04)'
const FAST_01 = '70ms'
const FAST_02 = '110ms'
const MODERATE_01 = '150ms'
const MODERATE_02 = '240ms'
const SLOW_01 = '400ms'
const SLOW_02 = '700ms'
const SLOW_03 = '1100ms'
const SLOW_04 = '2100ms'

export const curve = {
  'productive-entrance': PRODUCTIVE_ENTRANCE,
  'productive-exit': PRODUCTIVE_EXIT,
  'expressive-entrance': EXPRESSIVE_ENTRANCE,
  'expressive-exit': EXPRESSIVE_EXIT
}

export const duration = {
  'fast-01': FAST_01,
  'fast-02': FAST_02,
  'moderate-01': MODERATE_01,
  'moderate-02': MODERATE_02,
  'slow-01': SLOW_01,
  'slow-02': SLOW_02,
  'slow-03': SLOW_03,
  'slow-04': SLOW_04
}

export const animate = {
  spin: 'spin 1s linear infinite',
  ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  bounce: 'bounce 1s infinite',
  shimmer: 'shimmer 1.6s linear infinite',
  blink: 'blink 1s step-end infinite',
  'fade-in': 'fadeIn 220ms ease-in-out',
  'fade-out': 'fadeOut 220ms ease-in-out',
  'slide-down': 'slideDown 220ms ease-in-out',
  'highlight-fade': `highlight ${SLOW_03} ease-in forwards`,
  'page-enter': `pageEnter ${MODERATE_02} ${PRODUCTIVE_ENTRANCE}`,
  'content-enter': `contentEnter ${MODERATE_02} ${PRODUCTIVE_ENTRANCE} var(--content-enter-delay, 0s) backwards`,
  'popup-scale-in': `popupScaleIn ${MODERATE_01} ${PRODUCTIVE_ENTRANCE}`,
  'popup-scale-out': `popupScaleOut ${FAST_02} ${PRODUCTIVE_EXIT}`,
  'slide-in-start': `slideInStart ${MODERATE_02} ${PRODUCTIVE_ENTRANCE}`,
  'slide-out-start': `slideOutStart ${MODERATE_01} ${PRODUCTIVE_EXIT}`,
  'slide-in-end': `slideInEnd ${MODERATE_02} ${PRODUCTIVE_ENTRANCE}`,
  'slide-out-end': `slideOutEnd ${MODERATE_01} ${PRODUCTIVE_EXIT}`,
  'progress-indeterminate': `progressIndeterminate ${SLOW_04} ${PRODUCTIVE_ENTRANCE} infinite`,
  'progress-indeterminate-short': `progressIndeterminateShort ${SLOW_04} ${EXPRESSIVE_ENTRANCE} ${SLOW_03} infinite`,
  'flow-dash': `flowDash ${SLOW_02} linear infinite`,
  'texture-wave-a': 'textureWaveA 13s linear infinite',
  'texture-wave-b': 'textureWaveB 19s linear infinite',
  'brand-marquee': 'brandMarquee 59s linear infinite'
}

export const useWhen = {
  'page-enter':
    'A page arriving on a route change — on the CONTENT ZONE only, never the shell. The chrome is the same before and after, and sliding it announces a reload that did not happen. Key it on the route path so a component serving several paths still replays it. Nothing inside the page may animate on mount at the same time: the two run in lockstep and read as one element travelling on a diagonal.',
  'content-enter':
    'Content settling INSIDE a page that is already on screen — a loading window resolving, a filtered list swapping, a step changing. Never on first paint of a page whose own entrance is already running (use it after that entrance, or after a wire). Stagger a follower with --content-enter-delay.',
  spin: 'Indeterminate circular spinners (loading icons).',
  ping: 'One-off attention ring radiating from a small element (notification dot).',
  pulse: 'Skeleton/placeholder opacity pulse while content loads.',
  bounce: 'Playful attention bounce (scroll-down hints); use sparingly.',
  shimmer: 'Skeleton shimmer sweep while content loads.',
  blink: 'Text caret / terminal cursor blink.',
  'fade-in': 'Content or backdrop appearing in place (no directional origin).',
  'fade-out': 'Content or backdrop leaving in place (pair of fade-in).',
  'slide-down': 'Vertical disclosure expanding (accordion panel, expandable row).',
  'highlight-fade': 'Row/item briefly highlighted after an update (recently changed).',
  'popup-scale-in':
    'Anchored overlays opening (dropdown, popover, tooltip, menu); set --popup-origin.',
  'popup-scale-out': 'Anchored overlays closing (pair of popup-scale-in).',
  'slide-in-start':
    'Start-anchored panel entering (sidebar, navigation drawer); flips with the reading direction. Wrap the v-if region in a Vue Transition with enter-active-class.',
  'slide-out-start':
    'Start-anchored panel leaving (pair of slide-in-start; use as leave-active-class).',
  'slide-in-end':
    'End-anchored panel entering (settings/detail drawer); flips with the reading direction.',
  'slide-out-end': 'End-anchored panel leaving (pair of slide-in-end).',
  'progress-indeterminate': 'Indeterminate linear progress bar (primary sweep).',
  'progress-indeterminate-short': 'Indeterminate linear progress bar (secondary short sweep).',
  'flow-dash':
    'Flowing connection along an SVG connector stroke in a node-based / network diagram. Set a stroke-dasharray whose cycle divides 24 (e.g. 4 4) so the loop is seamless.',
  'texture-wave-a':
    'One of the two crossing bands of a pixelate texture, travelling left. Set --texture-wave-shift on the element to one period of its banding measured along X, and overhang the element by that much on the side it travels toward, or the field uncovers mid-cycle.',
  'texture-wave-b':
    'The counter-travelling band of that pair (pair of texture-wave-a; same --texture-wave-shift contract, opposite direction).',
  'brand-marquee':
    'A strip of logos looping forever (client trust strips, framework strips). Apply to a track holding its row exactly twice, the duplicate aria-hidden, and set animation-duration ON THE ELEMENT from the mark count so every strip on a site moves at one speed rather than one duration — a var in this shorthand would resolve at :root and never see it. Pause it on hover and focus-within so a linked mark can be reached.'
}

export default { animate, curve, duration, useWhen }
