<script setup>
// The shared chrome for every unauthenticated screen (Sign Up, Check Inbox,
// Personalize): the black GlobalHeader with the Azion brand mark + a
// Documentation link, a flex-1 slotted body, and the persistent copyright
// footer. Screens compose their own two-column layout inside the default slot.
//
// Kept as one component so the brand SVG, the Documentation affordance, and the
// footer are defined once and stay identical across the whole signup flow —
// mirroring how CreationHeader centralizes the header for the creation flows.
import Button from "@aziontech/webkit/button";
import GlobalHeader from "@aziontech/webkit/global-header";
</script>

<template>
  <div class="flex h-dvh flex-col overflow-y-auto bg-[var(--bg-canvas)]">
    <GlobalHeader aria-label="Azion Console">
      <GlobalHeader.Brand>
        <span class="text-[var(--primary)]">
          <svg
            viewBox="0 0 90 18"
            fill="currentColor"
            role="img"
            aria-label="Azion"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M86.637 0L85.1445 7.79033L87.861 11.1671L90 0H86.637ZM72.5099 0L69.1465 17.561H72.5111L74.8163 5.52224L84.5333 17.561H86.637L87.0518 15.4112L74.6131 0H72.5099Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M51.6563 0L48.293 17.561H65.7833L69.1466 0H51.6563ZM54.3884 3.31794H65.1392L63.0467 14.243H52.296L54.3884 3.31794Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M45.0001 0L41.707 17.561H44.9994L48.2924 0H45.0001Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M24.217 0L23.5814 3.31801H35.1962L21.3511 14.9756L20.8535 17.561H38.3437L38.9793 14.243H27.3646L41.2126 2.58289L41.7072 0H24.217Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z"
            />
          </svg>
        </span>
      </GlobalHeader.Brand>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-external-link"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="flex flex-1 flex-col">
      <slot />
    </main>

    <footer
      class="border-t-[length:var(--border-width-default)] border-[var(--border-muted)] px-[var(--spacing-xl)] py-[var(--spacing-md)]"
    >
      <p class="text-body-xs text-[var(--text-muted)]">
        © Azion Technologies, Inc or its affiliates. All rights reserved.
      </p>
    </footer>
  </div>
</template>
