<script setup lang="ts">
  import { computed } from 'vue'

  import { cubicBezier, milliseconds, type TokenSampleKind } from '../../lib/tokens'

  const props = defineProps<{
    name: string
    value: string
    sample: TokenSampleKind
    text?: string
    paired?: boolean
  }>()

  const curve = computed(() => {
    const points = cubicBezier(props.value)
    if (!points) return ''
    const [x1, y1, x2, y2] = points
    const at = (x: number, y: number) => `${2 + x * 28} ${30 - y * 28}`
    return `M${at(0, 0)} C${at(x1, y1)} ${at(x2, y2)} ${at(1, 1)}`
  })

  const share = computed(() => Math.min(milliseconds(props.value) / 2100, 1))
</script>

<template>
  <span
    v-if="sample === 'swatch'"
    class="inline-flex shrink-0 overflow-hidden rounded-(--shape-control) border border-(--border-default)"
    aria-hidden="true"
  >
    <span
      v-for="mode in paired ? (['light', 'dark'] as const) : [undefined]"
      :key="mode ?? 'one'"
      :data-theme="mode"
      class="inline-block size-8"
      :style="{
        background: `linear-gradient(var(${name}), var(${name})), var(--bg-canvas)`
      }"
    />
  </span>
  <span
    v-else-if="sample === 'bar'"
    class="block max-w-full overflow-x-auto"
    aria-hidden="true"
  >
    <span
      class="block h-4 rounded-(--shape-flat) bg-(--primary)"
      :style="{ width: `var(${name})`, minWidth: '2px' }"
    />
  </span>
  <span
    v-else-if="sample === 'radius'"
    class="inline-block size-8 shrink-0 border-2 border-(--primary) bg-(--bg-surface)"
    :style="{ borderRadius: `var(${name})` }"
    aria-hidden="true"
  />
  <span
    v-else-if="sample === 'shadow'"
    class="inline-flex shrink-0 overflow-hidden rounded-(--shape-control) border border-(--border-default)"
    aria-hidden="true"
    data-docs-shadow-sample
  >
    <span
      v-for="mode in ['light', 'dark'] as const"
      :key="mode"
      :data-theme="mode"
      class="inline-flex size-12 items-center justify-center bg-(--bg-canvas)"
    >
      <span
        class="size-7 rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised)"
        :style="
          name.startsWith('--drop-shadow')
            ? { filter: `drop-shadow(var(${name}))` }
            : { boxShadow: `var(${name})` }
        "
      />
    </span>
  </span>
  <svg
    v-else-if="sample === 'ease' && curve"
    viewBox="0 0 32 32"
    class="size-8 shrink-0 rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface)"
    aria-hidden="true"
  >
    <path
      :d="curve"
      fill="none"
      stroke="var(--primary)"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
  <span
    v-else-if="sample === 'duration'"
    class="block h-2 w-14 shrink-0 overflow-hidden rounded-(--shape-flat) bg-(--bg-surface-raised)"
    aria-hidden="true"
  >
    <span
      class="block h-full bg-(--primary)"
      :style="{ width: `${share * 100}%` }"
    />
  </span>
  <span
    v-else-if="sample === 'type'"
    :class="name"
    class="block min-w-0 py-(--spacing-2xs) text-(--text-default)"
    >{{ name.includes('-code-') ? 'const region = await edge.nearest()' : text }}</span
  >
  <span
    v-else-if="sample === 'font'"
    class="block min-w-0 text-heading-lg text-(--text-default)"
    :style="{ fontFamily: `var(${name})` }"
    >{{ text }}</span
  >
  <span
    v-else-if="sample === 'weight'"
    class="block min-w-0 text-heading-lg text-(--text-default)"
    :style="{ fontWeight: `var(${name})` }"
    >{{ text }}</span
  >
</template>
