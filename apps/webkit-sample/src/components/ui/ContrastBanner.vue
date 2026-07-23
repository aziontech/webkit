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

      <!-- AI coding tools — bare brand logos on the pill. Claude keeps its
           color; Cursor / Windsurf / Codex / OpenCode are monochrome
           (currentColor). Decorative, so they drop off below `sm` where the
           pill would otherwise overflow a phone; the label carries the CTA. -->
      <span
        class="ml-[var(--spacing-xxs)] hidden shrink-0 items-center gap-[var(--spacing-xs)] sm:flex"
        aria-hidden="true"
      >
        <!-- Claude -->
        <svg class="size-[var(--size-5)] shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Claude">
          <path fill="#D97757" fill-rule="nonzero" d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
        </svg>

        <!-- Cursor (monochrome) -->
        <svg class="size-[var(--size-5)] shrink-0" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cursor">
          <path d="M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z" />
        </svg>

        <!-- Windsurf (monochrome) -->
        <svg class="size-[var(--size-5)] shrink-0" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Windsurf">
          <path clip-rule="evenodd" d="M23.78 5.004h-.228a2.187 2.187 0 00-2.18 2.196v4.912c0 .98-.804 1.775-1.76 1.775a1.818 1.818 0 01-1.472-.773L13.168 5.95a2.197 2.197 0 00-1.81-.95c-1.134 0-2.154.972-2.154 2.173v4.94c0 .98-.797 1.775-1.76 1.775-.57 0-1.136-.289-1.472-.773L.408 5.098C.282 4.918 0 5.007 0 5.228v4.284c0 .216.066.426.188.604l5.475 7.889c.324.466.8.812 1.351.938 1.377.316 2.645-.754 2.645-2.117V11.89c0-.98.787-1.775 1.76-1.775h.002c.586 0 1.135.288 1.472.773l4.972 7.163a2.15 2.15 0 001.81.95c1.158 0 2.151-.973 2.151-2.173v-4.939c0-.98.787-1.775 1.76-1.775h.194c.122 0 .22-.1.22-.222V5.225a.221.221 0 00-.22-.222z" />
        </svg>

        <!-- Codex (monochrome) -->
        <svg class="size-[var(--size-5)] shrink-0" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Codex">
          <path clip-rule="evenodd" d="M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z" />
        </svg>

        <!-- OpenCode (monochrome) -->
        <svg class="size-[var(--size-5)] shrink-0" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="OpenCode">
          <path d="M16 6H8v12h8V6zm4 16H4V2h16v20z" />
        </svg>
      </span>
    </button>
  </Tooltip>
</template>
