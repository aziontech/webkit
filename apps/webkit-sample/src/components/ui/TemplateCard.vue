<script setup>
// Shared framework-template card: a centered CardBox whose colored brand logo is
// grayscale until hover, with a soft brand-color glow faded in behind the
// content. Used by both the Marketplace template grid and the Creation Center
// recommended templates.
import CardBox from "@aziontech/webkit/card-box";

defineProps({
  // Brand logo class (`ai-cor ai-*` colored, or `ai ai-*` monochrome).
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  // Framework brand hex, used for the soft hover glow.
  color: { type: String, default: "var(--primary)" },
});

const emit = defineEmits(["select"]);

// Soft radial glow from the framework's brand color, revealed on hover.
const glow = (color) =>
  `radial-gradient(120% 90% at 50% 0%, ${color}33, transparent 62%)`;

const activate = (event) => emit("select", event);
</script>

<template>
  <CardBox
    class="group relative cursor-pointer text-center"
    role="button"
    tabindex="0"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space.prevent="activate"
  >
    <template #content>
      <!-- Brand-color glow, faded in on hover (behind the content). -->
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance group-hover:opacity-100 motion-reduce:transition-none"
        :style="{ background: glow(color) }"
      />
      <div
        class="relative z-10 flex flex-col items-center gap-[var(--spacing-md)] py-[var(--spacing-sm)]"
      >
        <i
          :class="icon"
          class="text-[2.5rem] leading-none grayscale transition duration-moderate-01 ease-productive-entrance group-hover:grayscale-0 motion-reduce:transition-none"
          aria-hidden="true"
        />
        <div class="flex flex-col gap-[var(--spacing-xxs)]">
          <h3 class="text-label-md text-[var(--text-default)]">{{ title }}</h3>
          <p class="text-pretty text-body-sm text-[var(--text-muted)]">
            {{ description }}
          </p>
        </div>
      </div>
    </template>
  </CardBox>
</template>
