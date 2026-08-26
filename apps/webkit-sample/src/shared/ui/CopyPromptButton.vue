<script setup>
  // CopyPromptButton — THE control that hands an AI coding tool a ready-to-paste
  // setup prompt. One click, one clipboard write, one confirmation.
  //
  // It was called `ContrastBanner`, which named its SKIN and not its job: every one
  // of its placements — the site hero, the Hub hero, the docs home hero and the
  // block further down that page — is offering the same prompt, and a reader who
  // met "a contrast banner" in the code had to open the file to learn that. The
  // name is the job now; the appearance is still what it was.
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
  // THE APPEARANCE: a RAISED SURFACE, not a contrast one. It used to be built on the
  // contrast pair (`--bg-contrast` / `--text-contrast`), which inverts against the
  // page — a near-black pill in light mode, a near-white one in dark — so that it
  // would read as the loudest thing on screen.
  //
  // That was one loud thing too many. This control is the SECOND action wherever it
  // appears: a primary `Button` stands beside it and says "start here", and the pill
  // says "or hand it to your agent". An inverted slab is heavier than the orange it
  // is supposed to defer to, so the row had two things shouting and no first thing
  // to do. On `--bg-surface-raised` with `--text-default` it is a secondary control
  // that happens to be pill-shaped, and the hierarchy in the row is legible again.
  //
  // IT NEEDS THE BORDER. `--bg-surface-raised` is #FFF on a #FAFAFA canvas in light
  // mode and #141414 on #000 in dark — a real step in both, but far too small to be
  // the only edge a control has. `--border-default` is what draws it, the same
  // hairline every other resting surface in this app is bounded by.
  //
  // Left: the bare Azion mark. Right: the AI coding tools this onboarding targets,
  // rendered as bare brand logos on the pill. Claude keeps its brand color (it reads
  // on either surface); Cursor, Windsurf, Codex and OpenCode ship monochrome brand
  // marks, so they ride `currentColor` — now `--text-default` — and stay legible in
  // both themes.
  //
  // The whole pill is one button. On hover it lifts with a small scale and an
  // orange brand glow — an orange ring (`--primary`) plus a soft orange shadow
  // (`--primary-mask`). A Tooltip on top explains what it does; clicking copies a
  // ready-to-paste setup prompt to the clipboard.
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
        class="group inline-flex max-w-full h-10 items-center gap-(--spacing-xs) rounded-full border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-md) text-label-md text-(--text-default) transition-[scale,box-shadow] duration-moderate-01 ease-productive-entrance hover:scale-[1.03] hover:shadow-[0_0_24px_4px_var(--primary-mask)] hover:ring-2 hover:ring-(--primary) active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none motion-reduce:scale-100 sm:gap-(--spacing-sm)"
        @click="onCopy"
      >
        <!-- Azion mark — the bare icon. -->
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
