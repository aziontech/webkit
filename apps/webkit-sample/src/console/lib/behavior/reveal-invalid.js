// THE WAY BACK TO THE FIELD THAT BLOCKED THE ADVANCE.
//
// A create that validates on its commit has one failure mode that is entirely about
// LENGTH: the reader presses Next at the foot of a part, the check fails on a field near
// its top, and the only thing that changes on screen is a line of amber the reader cannot
// see. The press reads as dead. They press it again.
//
// The fix is not a second message somewhere they ARE looking — a summary at the bottom
// says what is wrong without saying where, and the reader still has to hunt. It is to take
// them to the field: the first one that failed becomes the anchor, the page scrolls it into
// view, and the caret lands in it so the next keystroke is already the fix.
//
// WHAT MARKS AN ANCHOR. `data-field-invalid` on the field's own wrapper — set by
// ../../components/form/FieldStack.vue whenever it is showing a blocking message, so every
// field built on the triad is anchored by construction and no page maintains a list of its
// own field ids. A region that carries a message without being a single field (a list the
// reader has to choose a row in) opts in by setting the same attribute itself.
//
// WHY THE WRAPPER AND NOT THE CONTROL. The anchor has to bring the LABEL and the message
// with it — a control scrolled to the top edge on its own arrives with the name of the
// field it belongs to and the reason it failed both above the fold, which is the same
// problem one scroll position later.
//
// FOCUS FIRST, THEN SCROLL. `focus()` performs a scroll of its own, and Chromium aligns it
// by centring while other engines align to `nearest` — two engines disagreeing about where
// the reader lands. Focusing with `preventScroll` and then scrolling explicitly makes the
// landing the same everywhere, and leaves one animation instead of two fighting.
import { nextTick } from 'vue'

// What a field's wrapper carries while it is showing a blocking message.
export const INVALID_FIELD_ATTR = 'data-field-invalid'

// The control the caret goes to. `[tabindex="-1"]` is excluded deliberately: it is what a
// component uses for a node it manages programmatically, never a place to put the reader.
const FOCUSABLE = [
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'button',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

// A field inside a closed disclosure has a box of zero size, and one behind a `v-if` is not
// in the DOM at all. `getClientRects` answers both without a `getComputedStyle` sweep.
const rendered = (el) => el.getClientRects().length > 0

const focusable = (el) =>
  !!el && !el.disabled && el.getAttribute('aria-hidden') !== 'true' && rendered(el)

// WHICH ELEMENT THE CARET GOES TO — the one the field's own `<label for>` points at, and
// only then the first focusable thing in the box.
//
// The order matters, and it is not a refinement: a webkit `Label` with a `hint` renders the
// ⓘ glyph as a real BUTTON, and that button comes before the control in the DOM. Taking the
// first focusable descendant lands the reader on the tooltip trigger of the field they have
// to fill in — measured, on the workload release part's Application field. The `for`
// association is the field saying which control is its value, so it is the answer whenever
// there is one.
const focusControl = (anchor) => {
  const doc = anchor.ownerDocument
  const owner = anchor.querySelector('label[for]')?.getAttribute('for')
  const labelled = owner ? doc.getElementById(owner) : null
  if (focusable(labelled)) {
    labelled.focus({ preventScroll: true })
    return labelled
  }

  // No association (a region that is not one field, a control the label wraps rather than
  // points at). Anything inside a `<label>` is skipped for the same reason as above.
  const control = Array.from(anchor.querySelectorAll(FOCUSABLE)).find(
    (el) => focusable(el) && !el.closest('label')
  )
  control?.focus({ preventScroll: true })
  return control ?? null
}

const prefersReducedMotion = () =>
  globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

/**
 * Scroll the first field that failed into view and put the caret in it.
 *
 * Call it on the failing branch of a validation, with the region that was validated. It
 * awaits a tick first: the messages are rendered by the same update that set them, so the
 * anchors do not exist yet at the moment the check returns.
 *
 * @param {Element | { $el?: Element } | null} [root] The region to search — the wizard's
 *   scroller, a drawer's body. A component instance is accepted and its `$el` read.
 *   Defaults to the document, which is right for a page with one form on it.
 * @returns {Promise<boolean>} Whether an anchor was found; false means the failure has no
 *   field to point at and the caller should say what is wrong some other way.
 */
export async function revealFirstInvalid(root) {
  await nextTick()

  const scope = root?.$el ?? root ?? globalThis.document
  if (!scope?.querySelectorAll) return false

  const anchors = Array.from(scope.querySelectorAll(`[${INVALID_FIELD_ATTR}]`))
  // The first anchor the reader can actually be taken to. The fallback keeps a message
  // that failed inside something collapsed from silently going nowhere — scrolling to a
  // zero-height box is still closer to the truth than doing nothing.
  const anchor = anchors.find(rendered) ?? anchors[0]
  if (!anchor) return false

  focusControl(anchor)

  // CENTRED, unless the field is too tall to centre — a field taller than most of the
  // viewport would arrive with its label above the top edge, so that one aligns to its
  // start instead and lets the scroller's own `scroll-padding` keep it clear of whatever
  // is pinned up there (../behavior/scroll-fade.js sets it).
  const tall = anchor.getBoundingClientRect().height > (globalThis.innerHeight ?? 0) * 0.6
  anchor.scrollIntoView({
    block: tall ? 'start' : 'center',
    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
  })

  return true
}
