<script setup>
  // ContrastBanner — a high-emphasis onboarding pill built on the CONTRAST token
  // pair (`--bg-contrast` / `--text-contrast`). Contrast inverts against the
  // surface: a near-black pill in light mode, a near-white pill in dark mode, so
  // it reads as the loudest thing on the page without borrowing a brand color.
  //
  // Left: the bare Azion mark. Right: the AI coding tools this onboarding targets,
  // rendered as bare brand logos on the pill. Claude keeps its brand color (it
  // reads on either contrast surface); Cursor, Windsurf, Codex and OpenCode ship
  // monochrome brand marks, so they ride `currentColor` (`--text-contrast`) and
  // stay legible in both themes.
  //
  // The whole pill is one button. On hover it lifts with a small scale and an
  // orange brand glow — an orange ring (`--primary`) plus a soft orange shadow
  // (`--primary-mask`). A Tooltip on top explains what it does; clicking copies a
  // ready-to-paste setup prompt to the clipboard.
  //
  // ── DISMISSING IT (`closable`) ──
  //
  // The pill is guidance, and guidance a reader has acted on (or decided against) has
  // to be able to leave. With `closable` it carries a × that REMOVES it from the
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
  import { ref } from 'vue'

  import { AGENT_SETUP_PROMPT, AGENT_TOOLS } from '../../lib/agent-onboarding'
  import AgentMark from '../site/ui/AgentMark.vue'

  const props = defineProps({
    // Brand the agent is being onboarded to — completes "Onboard your agent to …".
    brand: { type: String, default: 'Azion' },
    // Overrides the default "Onboard your Agent to {brand}" label when set.
    label: { type: String, default: '' },
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

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.prompt)
      toast.success('Setup prompt copied', {
        description: 'Paste it into your AI coding tool to onboard your agent.'
      })
    } catch {
      toast.error("Couldn't copy the prompt", {
        description: 'Clipboard access was blocked by the browser.'
      })
    }
  }
</script>

<template>
  <!-- The row: the pill, and the dismiss beside it. `v-if` on the row is the whole
       feature — dismissing UNMOUNTS it, so the space it held collapses and neither
       control stays in the tab order. -->
  <div
    v-if="!dismissed"
    class="inline-flex max-w-full items-center gap-[var(--spacing-xxs)]"
  >
    <Tooltip
      text="Copies a setup prompt for your AI coding tool"
      placement="top"
    >
      <button
        type="button"
        class="group inline-flex max-w-full items-center gap-[var(--spacing-xs)] rounded-full bg-[var(--bg-contrast)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-label-sm text-[var(--text-contrast)] transition-[scale,box-shadow] duration-moderate-01 ease-productive-entrance hover:scale-[1.03] hover:shadow-[0_0_24px_4px_var(--primary-mask)] hover:ring-2 hover:ring-[var(--primary)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none motion-reduce:scale-100 sm:gap-[var(--spacing-sm)] sm:px-[var(--spacing-md)] sm:py-[var(--spacing-xs)] sm:text-label-md"
        @click="onCopy"
      >
        <!-- Azion mark — the bare icon. -->
        <AzionLogoMin
          v-if="showLogo"
          class="h-[var(--size-4)] w-auto shrink-0 sm:h-[var(--size-5)]"
          aria-hidden="true"
        />

        <span class="min-w-0 truncate font-medium sm:whitespace-nowrap">
          {{ label || `Onboard your Agent to ${brand}` }}
        </span>

        <!-- AI coding tools — bare brand logos on the pill, drawn by AgentMark
           (Claude keeps its color; the other four ride currentColor). Not
           `mono` here: on the pill they are a row of logos, so each brand's own
           treatment is the point. Decorative, so they drop off below `sm` where
           the pill would otherwise overflow a phone; the label carries the CTA. -->
        <span
          class="ml-[var(--spacing-xxs)] hidden shrink-0 items-center gap-[var(--spacing-xs)] sm:flex"
          aria-hidden="true"
        >
          <AgentMark
            v-for="agent in AGENT_TOOLS"
            :key="agent"
            :name="agent"
            class="size-[var(--size-5)]"
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
