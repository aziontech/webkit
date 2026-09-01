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
  // stacked layers, IDENTICAL to the DS's: same tokens, same gradients, same
  // geometry, same durations, same hover floor, same rim border.
  //
  //   THE GLOW. A blurred three-stop gradient (white → `--color-blue-500` →
  //     `--color-brand-primary-500`) filling the button box and rotating once every
  //     8 seconds behind the surface. It is the part that says "this one talks to an
  //     agent".
  //   THE BASE. The brand-accent gradient over it — `accent-900` at 17%,
  //     `accent-100` at 53%, `accent-600` at 96%, on a 120° axis.
  //   THE SCRIM. `--bg-backdrop` (black at 80%) over that, which is what makes the
  //     resting pill dark and holds its white label at contrast.
  //
  // On hover the base and the scrim both drop to 25% and the rotating glow blooms
  // through. That reveal REPLACES what this pill used to do on hover (a 1.03 scale,
  // an orange ring, an orange glow shadow): an AI affordance should have one hover
  // language across the app, and this is the one the DS ships.
  //
  // NOTHING HERE IS RE-TUNED FOR THE PILL'S WIDTH. Earlier revisions diverged from
  // the DS on four axes, each defensible on its own and each a second answer to a
  // question the DS had already answered: a `repeating-linear-gradient` on a 120px
  // period (so the rotation read across a 279px pill rather than parking one colour
  // band on the whole ring), an oversized square (so a rotating rect covered the
  // pill's diagonal at every angle instead of strobing once per revolution), a 60%
  // hover floor against the DS's 25% (so the bloom over ~3.5× the area stayed a dark
  // plum instead of a pale lavender slab), and `--border-muted` for the rim frame.
  // All four are gone. The cost is real and known — the ring reads flatter at this
  // width and the hover bloom is lighter — and it buys the thing that matters more:
  // one AI treatment with one set of numbers, so this pill inherits whatever
  // `ButtonHighlight` decides next instead of holding its own copy of the answer.
  //
  // It also settles the hierarchy question the old raised-surface treatment was
  // solving. This pill is still the SECOND action wherever it appears — but it now
  // reads as a different KIND of action rather than a quieter one, so it no longer
  // competes with the orange primary beside it for "loudest thing on screen".
  //
  // WHY THE LAYERS ARE MIRRORED HERE rather than rendering `<ButtonHighlight>`: that
  // component is `label`-only — no slots — and this control's content is an Azion
  // mark, a label that swaps to a confirmation, and four brand marks. So it borrows
  // the pattern, not the component. If `ButtonHighlight` ever grows a default slot,
  // this should compose it and the three spans below should go.
  //
  // Left: the bare Azion mark, which keeps its own brand orange — it is the one mark
  // that does not follow the surface. Right: Claude, Codex, Gemini and Cursor
  // (`AGENT_TOOLS`), each one flat white on the dark pill.
  //
  // FOUR MARKS, NOT THE CATALOG'S SEVEN. The row is an example, not an inventory: it
  // answers "will this work with mine?", and four widely-used marks answer that as well
  // as seven while costing 72px less of a control that already carries an Azion mark and
  // a label. The whole list lives where a reader goes to CHOOSE — the Agent Setup index,
  // its comparison table, and the rail's row per agent — so nothing is lost by the row
  // not repeating it.
  //
  // It was five brand treatments before that — Claude in its own orange, four monochrome
  // marks on `currentColor`, and Gemini and Copilot left out because their published marks
  // are gradients — and that is a separate fault, fixed separately: a row of logos each in
  // its own colour, on a surface that is already a rotating three-stop glow, is the
  // loudest thing on a button whose label the reader has not finished reading. `mono` on
  // every mark (AgentMark's own flatten-to-`currentColor`) is what fixed it, which is why
  // Gemini's gradient mark is one of these four — one ink, the pill's own white, four
  // silhouettes at one weight.
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
        class="group/highlight relative isolate inline-flex h-10 max-w-full items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-default) p-px transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
        @click="onCopy"
      >
        <!-- THE GLOW. The rotating glow, behind everything — `ButtonHighlight`'s
             layer verbatim: `inset-0`, one three-stop gradient with no repeat, no
             oversized square. -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 animate-spin [animation-duration:8s] [animation-timing-function:linear] [background:linear-gradient(90deg,var(--color-base-white),var(--color-blue-500),var(--color-brand-primary-500))] filter-[blur(12px)] motion-reduce:animate-none"
        />

        <!-- THE BASE. The brand-accent gradient, inset by the 1px the root pads out,
             so the rim reads as a hairline all the way around. -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-px rounded-[inherit] bg-[linear-gradient(120deg,var(--color-brand-accent-900)_17%,var(--color-brand-accent-100)_53%,var(--color-brand-accent-600)_96%)] transition-opacity duration-300 ease-out group-hover/highlight:opacity-25 motion-reduce:transition-none"
        />

        <!-- THE SCRIM. What darkens the resting pill and carries the white label at
             contrast. It fades with the base, which is the hover bloom. -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-px rounded-[inherit] bg-(--bg-backdrop) transition-opacity duration-300 ease-out group-hover/highlight:opacity-25 motion-reduce:transition-none"
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

          <!-- AI coding tools — Claude, Codex, Gemini, Cursor (`AGENT_TOOLS`), drawn by
               AgentMark in `mono`, so every mark is a flat silhouette in the pill's own ink
               (see the note above). `mono` is `currentColor`, not a theme-driven
               black/white filter, which is what makes it right here: this pill is dark in
               BOTH themes, so its marks take the white the label is already set in and stop
               asking the theme.

               THEY STAY ON A PHONE. They used to be `hidden sm:flex`, which left the
               mobile pill as a bare text label — and the marks are not decoration on
               this control, they are the answer to "which tools?", the one thing the
               label cannot say in two words. What gives instead is the ROW's own gap:
               `xxs` (4) below `sm`, the `xs` (8) it is drawn at from `sm` up.

               WHAT THE CUT FROM SEVEN BOUGHT, measured at 390: the docs hero's "Copy
               prompt" pill 306.89 → 234.89 and the Hub's longer "Start with Agents"
               335.86 → 263.86 — 72px each, three marks at 20 plus their three 4px gaps
               (84 from `sm` up, where the gap is 8). The docs hero's PAIR needs 359.75px
               for one line instead of 439, so it stacks below a 392px viewport instead of
               below 465 — a 390 phone still sees the same two left-aligned rows it saw
               before, and everything from 392 up gets one. -->
          <span
            class="ml-(--spacing-xxs) flex shrink-0 items-center gap-(--spacing-xxs) sm:gap-(--spacing-xs)"
            aria-hidden="true"
          >
            <AgentMark
              v-for="agent in AGENT_TOOLS"
              :key="agent"
              :name="agent"
              mono
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
