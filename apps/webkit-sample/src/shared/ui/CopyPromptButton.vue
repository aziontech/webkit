<script setup>
  // CopyPromptButton — THE control that hands an AI coding tool a ready-to-paste
  // setup prompt. One click, one clipboard write, one confirmation.
  //
  // It was called `ContrastBanner`, which named its SKIN and not its job: every one
  // of its placements — the site hero, the Hub hero, the docs home hero and the
  // block further down that page — is offering the same prompt, and a reader who
  // met "a contrast banner" in the code had to open the file to learn that. The
  // name is the job now, and the appearance has since become the design system's own
  // AI treatment (below) rather than the contrast slab that earned the old name.
  //
  // ── IT IS A LARGE BUTTON, AT EVERY WIDTH ──
  //
  // The pill takes `Button size="large"`'s own metrics — `h-10` (40), `px-md` (16)
  // and a 14px label — flat, with no smaller step on a phone. It used to shrink
  // below `sm` (12px padding, a 12px label, height falling out of the padding at
  // 26), which put a 26px control next to the 40px primary it stands beside: two
  // heights in one row, and the row's rhythm broken at exactly the width where a
  // row has the least room to explain itself. Height is now declared rather than
  // derived from padding, so it is 40 against the primary's 40 instead of the 37
  // the padding happened to add up to.
  //
  // The cost is width: at 390 the pair no longer fits one line and wraps to two
  // left-aligned rows. That is the better trade — two 40px controls stacked read
  // as a list of two ways in, where a 26px pill beside a 40px button reads as a
  // control and its footnote.
  //
  // ── THE APPEARANCE: THE DESIGN SYSTEM'S AI TREATMENT ──
  //
  // The pill carries the same background pattern webkit's `ButtonHighlight` uses —
  // the DS control for an AI flow, ported from the console's Copilot button. Three
  // stacked layers, in the same tokens at the same durations:
  //
  //   THE RIM. A blurred three-stop gradient (white → `--color-blue-500` →
  //     `--color-brand-primary-500`) rotating once every 8 seconds behind the
  //     surface. It is the part that says "this one talks to an agent".
  //
  //     IT REPEATS EVERY 120px, which is what makes the rotation READ. A single
  //     gradient stretched across a 279px pill puts one colour band on the whole
  //     ring, so spinning it changes the colour at any given point by almost
  //     nothing and the pill looks static — measured 9.3 units of ring travel per
  //     phase. At a 120px period two segments sit on the ring at once and visibly
  //     chase around it: 18.3 units, twice as much, on the SAME 1px ring.
  //     `ButtonHighlight` needs no such period because it is ~80px wide, so one band
  //     already spans it. 120px is a plateau, not a knob to keep turning: 90px
  //     measures the same (18.6) and 60px is WORSE (13.0) — a period near the 12px
  //     blur radius averages itself back to grey.
  //   THE BASE. The brand-accent gradient over it — `accent-900` at 17%,
  //     `accent-100` at 53%, `accent-600` at 96%, on a 120° axis.
  //   THE SCRIM. `--bg-backdrop` (black at 80%) over that, which is what makes the
  //     resting pill dark and holds its white label at contrast.
  //
  // On hover the base and the scrim both drop to 60% and the rotating rim blooms
  // through. That reveal REPLACES what this pill used to do on hover (a 1.03 scale,
  // an orange ring, an orange glow shadow): an AI affordance should have one hover
  // language across the app, and this is the one the DS ships.
  //
  // 60%, where `ButtonHighlight` fades to 25%, because this control reveals about
  // 3.5× the area: the same floor that reads as a tinted 80px button reads as a pale
  // lavender slab 281px wide. Holding more of the scrim keeps the bloom a dark plum
  // instead (mean luminance 105 against 129 at the DS's floor, −19%), which is also
  // what lets the travelling ring read as its own element rather than dissolving
  // into the fill. The floor costs nothing in motion: the ring sits OUTSIDE the base
  // and the scrim, so its 24.7 units of travel are the same at any floor.
  //
  // It also settles the hierarchy question the old raised-surface treatment was
  // solving. This pill is still the SECOND action wherever it appears — but it now
  // reads as a different KIND of action rather than a quieter one, so it no longer
  // competes with the orange primary beside it for "loudest thing on screen".
  //
  // WHY THE LAYERS ARE MIRRORED HERE rather than rendering `<ButtonHighlight>`: that
  // component is `label`-only — no slots — and this control's content is an Azion
  // mark, a label that swaps to a confirmation, and five brand marks. So it borrows
  // the pattern, not the component. If `ButtonHighlight` ever grows a default slot,
  // this should compose it and the three spans below should go.
  //
  // THE RIM IS AN OVERSIZED SQUARE, not the `inset-0` rect `ButtonHighlight` spins.
  // A rotating rect only covers its own box at 0° and 180°: at 90° the rim of a
  // 279×40 pill is a 40px column and both ends of the pill go dark, so the glow
  // strobes once per revolution. A square whose side clears the pill's diagonal
  // covers it at every angle. `ButtonHighlight` is ~80px wide, where the same defect
  // is a mild pulse; at pill width it would be the whole effect. The square costs
  // nothing now that the gradient carries its own period — coverage and motion are
  // two separate knobs (the square is the first, the 120px repeat is the second).
  //
  // THE RING STAYS 1px, the hairline `ButtonHighlight` leaves. Widening it to 2px was
  // tried and reverted: it does measure more travel (26.2 against 18.3), but at that
  // width the ring stops reading as an edge and starts reading as a border drawn round
  // the pill — a heavier outline than anything else in these rows carries. The period
  // is what supplies the motion anyway, so the hairline keeps all of it.
  //
  // Left: the bare Azion mark, which keeps its own brand orange — it is the one mark
  // that does not follow the surface. Right: the AI coding tools this onboarding
  // targets. Claude keeps its brand colour; Cursor, Windsurf, Codex and OpenCode ship
  // monochrome marks, so they ride `currentColor` — white here, on the dark pill.
  //
  // A Tooltip on top explains what it does; clicking copies a ready-to-paste setup
  // prompt to the clipboard.
  //
  // ── THE CONFIRMATION IS THE LABEL, NOT A TOAST ──
  //
  // Copying used to fire a success toast, which put the answer to "did that work?" in
  // the opposite corner of the screen from the control the reader just pressed — and on
  // the docs pages the pill sits inside the reading column, so the reader had to leave
  // the sentence they were in to find out. The pill says it itself instead: the label
  // becomes `copiedLabel` for two seconds and then goes back to offering the action.
  // Feedback at the point of action, and it matches `CopyButton`, the DS control that
  // does the same job with an icon and a `copiedLabel`.
  //
  // A FAILURE still toasts. A refusal has to say why (clipboard blocked by the browser),
  // and that reason does not fit in a label the pill has to hand back two seconds later.
  //
  // ── DISMISSING IT (`closable`) ──
  //
  // The button is guidance, and guidance a reader has acted on (or decided against)
  // has to be able to leave. With `closable` it carries a × that REMOVES it from the
  // layout — not `visibility: hidden`, not `opacity-0`: the element unmounts, so it
  // stops taking space, stops being tabbable, and stops being read out.
  //
  // The × is a SIBLING of the pill, never inside it. The pill is itself a `<button>`,
  // and a button inside a button is invalid HTML that browsers un-nest at parse time,
  // which breaks both controls. So the root becomes a row holding the pill and the ×
  // beside it, and dismissing removes that row.
  //
  // The state is local, plus a `close` event. Local because the pill has to disappear
  // on the click that asked for it, with no round trip; the event because whether it
  // STAYS gone is the page's decision, not the pill's — that answer lives in a user
  // preference or in account data, and this component has no business holding it (see
  // the console's "how does a product know a hint is no longer needed" question).
  import IconButton from '@aziontech/webkit/icon-button'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, ref } from 'vue'

  import { AGENT_SETUP_PROMPT, AGENT_TOOLS } from '../lib/agent-onboarding'
  import AgentMark from './brand/AgentMark.vue'

  const props = defineProps({
    // Brand the agent is being onboarded to — completes "Onboard your agent to …".
    brand: { type: String, default: 'Azion' },
    // Overrides the default "Onboard your Agent to {brand}" label when set.
    label: { type: String, default: '' },
    // What the pill says for the two seconds after a successful write. The
    // confirmation is the LABEL, not a toast — see the note above.
    copiedLabel: { type: String, default: 'Prompt copied!' },
    // Shows the leading Azion mark; hide it for a plain text pill.
    showLogo: { type: Boolean, default: true },
    // The prompt copied to the clipboard on click. Shared with the first-access card
    // that offers the same onboarding (lib/agent-onboarding.js) — one prompt, two
    // surfaces, so they cannot drift into two different onboardings.
    prompt: { type: String, default: AGENT_SETUP_PROMPT },
    // Shows the trailing × that removes the pill from the layout. Off by default, so
    // every existing placement is unchanged: a banner that is part of a page's
    // composition (the site's hero) should not sprout a dismiss control, while one
    // offered as guidance (the first-access Overview) should.
    closable: { type: Boolean, default: false }
  })

  // Fires after the reader dismisses it, so the page can decide whether it stays gone.
  const emit = defineEmits(['close'])

  const dismissed = ref(false)

  const onClose = (event) => {
    dismissed.value = true
    emit('close', event)
  }

  // Two seconds, the same dwell `CopyButton` uses — long enough to read, short
  // enough that the pill is back to offering the action before the reader looks again.
  const COPIED_MS = 2000

  const copied = ref(false)
  let copiedTimeoutId = null

  // One string names the pill, so the button and its tooltip cannot disagree: the
  // idle label while idle, the confirmation for the dwell after a write.
  const idleLabel = computed(() => props.label || `Onboard your Agent to ${props.brand}`)
  const currentLabel = computed(() => (copied.value ? props.copiedLabel : idleLabel.value))

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.prompt)
    } catch {
      // The only case that still earns a toast: a refusal needs to say WHY, and the
      // reason does not fit in a label the pill has to give back two seconds later.
      toast.error("Couldn't copy the prompt", {
        description: 'Clipboard access was blocked by the browser.'
      })
      return
    }

    copied.value = true

    if (copiedTimeoutId) clearTimeout(copiedTimeoutId)
    copiedTimeoutId = setTimeout(() => {
      copied.value = false
      copiedTimeoutId = null
    }, COPIED_MS)
  }

  onBeforeUnmount(() => {
    if (copiedTimeoutId) clearTimeout(copiedTimeoutId)
  })
</script>

<template>
  <!-- The row: the pill, and the dismiss beside it. `v-if` on the row is the whole
       feature — dismissing UNMOUNTS it, so the space it held collapses and neither
       control stays in the tab order. -->
  <div
    v-if="!dismissed"
    class="inline-flex max-w-full items-center gap-(--spacing-xxs)"
  >
    <!-- The tooltip keeps saying what the control DOES, in both states. Echoing the
         confirmation here would stack the same sentence twice — once in the label, once
         in a bubble directly above it, over the paragraph the reader is in — and
         `CopyButton` only puts it in the tooltip because its trigger is icon-only and
         has no label to put it in.

         Suppressing the tooltip during the dwell (`:disabled="copied"`) was the other
         option and it is a trap: `Tooltip.setOpen` returns early when `disabled`, so a
         tooltip that is already open when the state flips can no longer be CLOSED —
         it would stick over the text for the full two seconds. -->
    <Tooltip
      text="Copies a setup prompt for your AI coding tool"
      placement="top"
    >
      <button
        type="button"
        :data-state="copied ? 'copied' : 'default'"
        class="group/highlight relative isolate inline-flex h-10 max-w-full items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) p-px transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
        @click="onCopy"
      >
        <!-- THE RIM. The rotating glow, behind everything. `w-[max(110%,6rem)]` +
             `aspect-square` is the coverage floor: the side has to clear the pill's
             diagonal at every angle, and the `6rem` floor holds that true even for
             the shortest label this pill ever carries. `animate-spin` drives the
             `transform`, so the `-translate-x/y-1/2` that centres it (a separate CSS
             property in v4) is not overwritten by the rotation. -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[max(110%,6rem)] -translate-x-1/2 -translate-y-1/2 animate-spin [animation-duration:8s] [animation-timing-function:linear] bg-[repeating-linear-gradient(90deg,var(--color-base-white),var(--color-blue-500),var(--color-brand-primary-500),var(--color-base-white))] bg-size-[120px_100%] filter-[blur(12px)] motion-reduce:animate-none"
        />

        <!-- THE BASE. The brand-accent gradient, inset by the 1px the root pads out,
             so the rim reads as a hairline all the way around. -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-px rounded-[inherit] bg-[linear-gradient(120deg,var(--color-brand-accent-900)_17%,var(--color-brand-accent-100)_53%,var(--color-brand-accent-600)_96%)] transition-opacity duration-300 ease-out group-hover/highlight:opacity-60 motion-reduce:transition-none"
        />

        <!-- THE SCRIM. What darkens the resting pill and carries the white label at
             contrast. It fades with the base, which is the hover bloom. -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-px rounded-[inherit] bg-(--bg-backdrop) transition-opacity duration-300 ease-out group-hover/highlight:opacity-60 motion-reduce:transition-none"
        />

        <!-- The content rides above the three layers. `z-1` is enough because the root
             is `isolate`. -->
        <span
          class="relative z-1 flex h-full w-full min-w-0 items-center justify-center gap-(--spacing-xs) px-(--spacing-md) text-label-md text-(--color-base-white) sm:gap-(--spacing-sm)"
        >
          <!-- Azion mark — the bare icon, in its own orange. -->
          <AzionLogoMin
            v-if="showLogo"
            class="h-(--size-5) w-auto shrink-0"
            aria-hidden="true"
          />

          <!-- The label is where the copy is CONFIRMED, so it is a live region: the
               pill's own text changes under the reader's pointer, and a reader who is
               not looking at it gets the same confirmation announced. The width does
               not thrash while it swaps because the pill sizes to its content and both
               strings are one short line. -->
          <span
            aria-live="polite"
            class="min-w-0 truncate sm:whitespace-nowrap"
          >
            {{ currentLabel }}
          </span>

          <!-- AI coding tools — bare brand logos on the pill, drawn by AgentMark
               (Claude keeps its color; the other four ride currentColor). Not `mono`
               here: on the pill they are a row of logos, so each brand's own treatment
               is the point.

               THEY STAY ON A PHONE. They used to be `hidden sm:flex`, which left the
               mobile pill as a bare text label — and the marks are not decoration on
               this control, they are the answer to "which tools?", the one thing the
               label cannot say in two words. What gives instead is the ROW's own gap:
               `xxs` (4) below `sm`, the `xs` (8) it is drawn at from `sm` up. Same
               marks, same size, one rung tighter — 120px of row on a phone against
               136, so the pill stays a pill on a 320 column. -->
          <span
            class="ml-(--spacing-xxs) flex shrink-0 items-center gap-(--spacing-xxs) sm:gap-(--spacing-xs)"
            aria-hidden="true"
          >
            <AgentMark
              v-for="agent in AGENT_TOOLS"
              :key="agent"
              :name="agent"
              class="size-(--size-5)"
            />
          </span>
        </span>
      </button>
    </Tooltip>

    <!-- `transparent`, and only ever `small`: it is the quietest control in the row.
         The Tooltip says what it does and the `aria-label` says the same thing, so
         the glyph is never the only explanation. -->
    <Tooltip
      v-if="closable"
      text="Dismiss"
      placement="top"
    >
      <IconButton
        icon="pi pi-times"
        kind="transparent"
        size="small"
        aria-label="Dismiss"
        @click="onClose"
      />
    </Tooltip>
  </div>
</template>
