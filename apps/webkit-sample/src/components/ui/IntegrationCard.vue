<script setup>
// Integration catalog card. One component, two anatomies driven by `featured`:
//
//  • featured=false → compact, horizontal: vendor mark on the left, title +
//    "by {vendor}" and description on the right, with the type Tag pinned
//    top-right. This is the dense grid card.
//  • featured=true  → spotlight, vertical & centered: a larger vendor mark on
//    top, then the centered title / vendor / description, a faint accent glow,
//    and a raised surface. This is the "Featured" row at the top of the panel.
//
// Both are clickable (button semantics) and emit `select`.
import CardBox from "@aziontech/webkit/card-box";
import AzionLogoMin from "@aziontech/webkit/svg/azion/min";
import Tag from "@aziontech/webkit/tag";

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  vendor: { type: String, default: "Azion" },
  // Optional brand icon class (`ai-cor ai-*`). When empty, falls back to the
  // Azion Marketplace vendor mark.
  icon: { type: String, default: "" },
  // Short type label shown in the corner Tag (e.g. "Integration").
  badge: { type: String, default: "Integration" },
  // Switches the card anatomy: spotlight (true) vs. dense grid card (false).
  featured: { type: Boolean, default: false },
});

const emit = defineEmits(["select"]);

const activate = (event) => emit("select", event);
</script>

<template>
  <CardBox
    class="group relative cursor-pointer transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    :class="
      featured
        ? 'bg-[var(--bg-surface-raised)] hover:border-[var(--border-strong)]'
        : 'hover:bg-[var(--bg-hover)]'
    "
    role="button"
    tabindex="0"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space.prevent="activate"
  >
    <template #content>
      <!-- Featured accent glow, faded in on hover, behind the content. -->
      <span
        v-if="featured"
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-10 transition-opacity duration-moderate-01 ease-productive-entrance group-hover:opacity-20 motion-reduce:transition-none"
        style="background: radial-gradient(120% 90% at 50% 0%, var(--primary), transparent 62%)"
      />

      <!-- Corner type Tag, shared by both anatomies. -->
      <Tag
        class="absolute right-[var(--spacing-md)] top-[var(--spacing-md)] z-10"
        :severity="featured ? 'primary' : 'info'"
        size="small"
        :label="badge"
      />

      <!-- ── Spotlight anatomy: centered column ── -->
      <div
        v-if="featured"
        class="relative z-[1] flex flex-col items-center gap-[var(--spacing-md)] px-[var(--spacing-sm)] py-[var(--spacing-lg)] text-center"
      >
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
        >
          <i
            v-if="icon"
            :class="icon"
            class="text-[1.25rem] leading-none"
            aria-hidden="true"
          />
          <AzionLogoMin v-else class="h-5 w-auto" aria-label="Azion Marketplace" />
        </span>
        <div class="flex flex-col items-center gap-[var(--spacing-xxs)]">
          <h3 class="text-heading-xs text-[var(--text-default)]">{{ title }}</h3>
          <span class="text-body-xs text-[var(--text-muted)]">by {{ vendor }}</span>
        </div>
        <p class="text-pretty text-body-sm text-[var(--text-muted)]">
          {{ description }}
        </p>
      </div>

      <!-- ── Dense anatomy: logo left, text right ── -->
      <div
        v-else
        class="flex items-start gap-[var(--spacing-md)] pr-[var(--spacing-xl)]"
      >
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
        >
          <i
            v-if="icon"
            :class="icon"
            class="text-[1.25rem] leading-none"
            aria-hidden="true"
          />
          <AzionLogoMin v-else class="h-5 w-auto" aria-label="Azion Marketplace" />
        </span>
        <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
          <div class="flex flex-wrap items-baseline gap-x-[var(--spacing-xs)]">
            <h3 class="text-label-md text-[var(--text-default)]">{{ title }}</h3>
            <span class="text-body-xs text-[var(--text-muted)]">by {{ vendor }}</span>
          </div>
          <p class="text-pretty text-body-sm text-[var(--text-muted)]">
            {{ description }}
          </p>
        </div>
      </div>
    </template>
  </CardBox>
</template>
