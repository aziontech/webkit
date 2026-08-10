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
import AzionLogoMin from "@aziontech/webkit/svg/azion/min";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";

import AgentMark from "../site/ui/AgentMark.vue";

// The tools this onboarding targets, in the order they read best on the pill.
const AGENTS = ["claude", "cursor", "windsurf", "codex", "opencode"];

const props = defineProps({
  // Brand the agent is being onboarded to — completes "Onboard your agent to …".
  brand: { type: String, default: "Azion" },
  // Overrides the default "Onboard your Agent to {brand}" label when set.
  label: { type: String, default: "" },
  // Shows the leading Azion mark; hide it for a plain text pill.
  showLogo: { type: Boolean, default: true },
  // The prompt copied to the clipboard on click.
  prompt: {
    type: String,
    default:
      "Set up this project to deploy on Azion. Read https://www.azion.com/en/documentation/, " +
      "install the Azion CLI, scaffold an azion.config.js for an edge application, and wire up " +
      "the build + deploy commands so I can ship to the edge.",
  },
});

const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.prompt);
    toast.success("Setup prompt copied", {
      description: "Paste it into your AI coding tool to onboard your agent.",
    });
  } catch {
    toast.error("Couldn't copy the prompt", {
      description: "Clipboard access was blocked by the browser.",
    });
  }
};
</script>

<template>
  <Tooltip text="Copies a setup prompt for your AI coding tool" placement="top">
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
          v-for="agent in AGENTS"
          :key="agent"
          :name="agent"
          class="size-[var(--size-5)]"
        />
      </span>
    </button>
  </Tooltip>
</template>
