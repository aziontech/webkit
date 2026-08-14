// "Did the reader just do something?" — one answer, shared by every component that
// needs to tell a change the user CAUSED from a change that merely happened.
//
// The distinction matters wherever motion is involved. A band easing its height is
// right when a switch just revealed it and wrong when the page is simply arriving:
// the first is an answer taking effect, the second is a screen that will not sit
// still. Nothing in the DOM says which one a resize is, so the only honest signal is
// whether a real input event landed a moment ago.
//
// THIS HAS TO BE A MODULE, and that is the whole reason the file exists. The obvious
// place for it is the top of the component that uses it — but in `<script setup>`
// every top-level statement is compiled INTO `setup()`, so a `let` there is per
// instance and a listener there is registered per instance, at mount. A component
// that mounts BECAUSE of a click then registers its listener a beat too late to have
// seen the click that mounted it, and concludes it arrived on its own. Real module
// scope is what makes the stamp older than the components that read it.
//
// Capture phase, on the document, so the stamp lands before the handler that changes
// the state — the resize it causes is observed in the very same frame.
//
//   pointerdown + click — a real pointer fires both; a keyboard activation and some
//     assistive tech produce a lone `click`, so neither alone is enough.
//   keydown             — typing, Space/Enter on a control, arrow keys in a listbox.
//   change + input      — a Select committing through its teleported panel, where the
//     pointerdown landed frames earlier on an element that is no longer there.
const EVENTS = ['pointerdown', 'click', 'keydown', 'change', 'input']

// Long enough for Vue to patch and for layout to settle after an input; short enough
// that something arriving seconds later — a fetch, a font, a resize — is never
// mistaken for the reader's doing.
const WINDOW_MS = 400

let lastInteraction = 0
// While set, `userDriven()` answers false however recent the click was. This is what
// keeps an ENTRANCE from being read as a reveal: navigating to a page, or picking a
// tab, is a click like any other, and without this every band on the arriving screen
// would treat its own mount as "the reader just revealed me" and grow from nothing.
// An arriving screen has its own entrance; heights are for answers taking effect.
let suppressedUntil = 0

const stamp = () => {
  lastInteraction = performance.now()
}

if (typeof document !== 'undefined') {
  for (const type of EVENTS) document.addEventListener(type, stamp, true)
}

/**
 * Declare that what is about to mount is an ENTRANCE, not a reveal — call it from a
 * route change or a tab switch, before the new content mounts.
 */
export const suppressEntranceMotion = () => {
  suppressedUntil = performance.now() + WINDOW_MS
}

/**
 * Whether the change being handled right now can be attributed to the reader.
 *
 * @returns {boolean} true when a real input event landed within the last 400ms and
 *   the screen is not in the middle of arriving.
 */
export const userDriven = () =>
  performance.now() > suppressedUntil && performance.now() - lastInteraction < WINDOW_MS
