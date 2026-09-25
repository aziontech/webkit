<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'MigrationCard',
    inheritAttrs: false
  })

  interface Props {
    /** URL of the mark for the platform being left. */
    fromSrc: string
    /** Name of the platform being left, as the mark's alternative text. */
    fromAlt: string
    /** URL of the mark for the platform moved to. */
    toSrc: string
    /** Name of the platform moved to, as the mark's alternative text. */
    toAlt: string
    /** Short caption naming the customer or the outcome. */
    label?: string
    /** When set, the whole card renders as an anchor link to this URL. */
    href?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    href: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-migration-card'
  )

  const isLink = computed<boolean>(() => props.href.length > 0)

  const TICK_CLASS = 'pointer-events-none absolute z-20 block size-1 bg-(--bg-contrast)'
</script>

<template>
  <component
    :is="isLink ? 'a' : 'article'"
    v-bind="$attrs"
    :href="isLink ? href : undefined"
    :data-testid="testId"
    :data-linked="isLink || null"
    class="group/card relative flex h-full min-h-34 flex-col border border-(--border-default) p-(--spacing-xxs) transition-colors duration-150 ease-out [--plate-bg:var(--bg-surface-raised)] [--plate-ink:var(--text-default)] motion-reduce:transition-none data-[linked]:hover:bg-(--bg-surface-raised) data-[linked]:hover:[--plate-bg:var(--bg-contrast)] data-[linked]:hover:[--plate-ink:var(--text-contrast)] data-[linked]:focus-visible:bg-(--bg-surface-raised) data-[linked]:focus-visible:ring-2 data-[linked]:focus-visible:ring-(--ring-color) data-[linked]:focus-visible:ring-offset-2 data-[linked]:focus-visible:ring-offset-(--bg-canvas) data-[linked]:focus-visible:[--plate-bg:var(--bg-contrast)] data-[linked]:focus-visible:[--plate-ink:var(--text-contrast)]"
  >
    <span
      aria-hidden="true"
      :class="[TICK_CLASS, 'left-0 top-0']"
    />
    <span
      aria-hidden="true"
      :class="[TICK_CLASS, 'right-0 top-0']"
    />
    <span
      aria-hidden="true"
      :class="[TICK_CLASS, 'left-0 bottom-0']"
    />
    <span
      aria-hidden="true"
      :class="[TICK_CLASS, 'right-0 bottom-0']"
    />

    <div class="flex items-start gap-(--spacing-xs)">
      <p
        v-if="label"
        class="m-0 bg-(--plate-bg) px-(--spacing-sm) py-(--spacing-xxs) text-overline-md text-(--plate-ink) transition-colors duration-150 ease-out motion-reduce:transition-none"
      >
        {{ label }}
      </p>

      <span
        v-if="isLink"
        aria-hidden="true"
        class="ml-auto grid size-6 shrink-0 place-items-center bg-(--primary) opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/card:opacity-100 group-focus-visible/card:opacity-100"
      >
        <span class="relative block size-1">
          <span
            class="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-(--primary-contrast)"
          />
          <span
            class="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-(--primary-contrast)"
          />
        </span>
      </span>
    </div>

    <div class="flex flex-1 items-end justify-center gap-(--spacing-xl) pb-(--spacing-lg)">
      <img
        :src="fromSrc"
        :alt="fromAlt"
        loading="lazy"
        decoding="async"
        class="h-8 w-auto max-w-full object-contain mix-blend-luminosity"
      />
      <img
        :src="toSrc"
        :alt="toAlt"
        loading="lazy"
        decoding="async"
        class="h-8 w-auto max-w-full object-contain mix-blend-luminosity"
      />
    </div>
  </component>
</template>
