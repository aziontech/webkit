// The entrance the signed-out screens share — Sign In, Sign Up and Onboarding.
//
// Each of those pages assembles itself from opposite sides instead of fading in
// as one flat block: one part arrives along +X (it starts to the left of where it
// lands) and its counterpart along -X, and they settle together around the
// middle. On the screens that are a single card (Sign In) there is just the one
// part, and it enters from the side the screen sits on in the flow — Sign In is
// to the left of Sign Up, so it comes in from the left and Sign Up's form comes
// in from the right, which is what makes moving between the two read as a
// direction rather than as two unrelated page loads.
//
// slow-01 + expressive-entrance, and both are the point: a card- or console-sized
// object crossing real distance reads as confident at 400ms and as a twitch at
// 150, and the expressive curve carries most of the travel early and then eases
// long, which is what makes the landing feel fluid rather than abrupt. The
// follower is held back one fast-01 so the lead part arrives first and the other
// follows it in — simultaneous arrival reads as a slide transition, a stagger
// reads as choreography.
//
// Timing rides on `style` because Tailwind cannot emit per-state duration /
// easing from theme tokens (the same reason AppLayout does it — DESIGN.md
// § Motion); the movement and opacity states stay on data-attribute variants, so
// the caller writes `:data-entered="entered || null"` plus its own offset and
// `data-[entered]:` landing classes.
//
// The animated property is `translate`, NOT `transform`: Tailwind v4 compiles
// `translate-x-*` to the standalone `translate` property, so a transition
// declared on `transform` animates nothing and the movement snaps. `transform`
// is listed too, harmlessly, so a utility that does use it still eases.
import { curve, duration } from '@aziontech/theme/animations'
import { onMounted, ref } from 'vue'

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const ENTER_TIMING = `${duration['slow-01']} ${curve['expressive-entrance']}`

/**
 * @returns {{ entered: import('vue').Ref<boolean>, leadStyle: object, followStyle: object }}
 *   `entered` flips one frame after mount (bind it to `data-entered`); `leadStyle`
 *   is the part that arrives first, `followStyle` the same timing one fast-01 later.
 */
export function useAuthEntrance() {
  const reduced = prefersReducedMotion()

  const leadStyle = reduced
    ? { transition: 'none' }
    : {
        transition: `opacity ${ENTER_TIMING}, translate ${ENTER_TIMING}, transform ${ENTER_TIMING}`
      }
  const followStyle = reduced
    ? { transition: 'none' }
    : { ...leadStyle, transitionDelay: duration['fast-01'] }

  // Two frames, not one: a single requestAnimationFrame can land in the same
  // frame the browser is already painting, so it renders the final state and
  // there is no change left to transition. The second frame guarantees the
  // offset state was painted first.
  const entered = ref(false)
  onMounted(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        entered.value = true
      })
    })
  })

  return { entered, leadStyle, followStyle }
}
