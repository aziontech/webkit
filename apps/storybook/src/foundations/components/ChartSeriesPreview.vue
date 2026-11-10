<script setup>
  const SERIES = [1, 2, 3, 4, 5, 6].map((slot) => ({
    label: `Series ${slot}`,
    token: `var(--chart-series-${slot})`,
    height: 72 - slot * 8
  }))
  SERIES.push({ label: 'Other', token: 'var(--chart-series-other)', height: 16 })

  const SEQUENTIAL = [1, 2, 3, 4, 5, 6, 7].map((step) => `var(--chart-sequential-${step})`)
  const DIVERGING = [
    'var(--chart-diverging-negative)',
    'var(--chart-diverging-neutral)',
    'var(--chart-diverging-positive)'
  ]

  const SURFACES = [
    { id: 'surface', label: 'On --bg-surface', className: 'bg-(--bg-surface)' },
    { id: 'canvas', label: 'On --bg-canvas', className: 'bg-(--bg-canvas)' }
  ]
</script>

<template>
  <section class="mb-(--spacing-xxl) flex flex-col gap-(--spacing-md)">
    <div class="grid gap-(--spacing-md) md:grid-cols-2">
      <figure
        v-for="surface in SURFACES"
        :key="surface.id"
        :class="surface.className"
        class="m-0 flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-solid border-(--border-default) p-(--spacing-md)"
      >
        <figcaption class="text-overline-sm text-(--text-muted)">{{ surface.label }}</figcaption>
        <svg
          viewBox="0 0 336 84"
          class="block h-auto w-full"
          role="img"
          :aria-label="`The six series slots and Other, drawn as bars, lines and markers ${surface.label.toLowerCase()}`"
        >
          <line
            x1="0"
            x2="336"
            y1="80"
            y2="80"
            stroke="var(--chart-axis)"
            stroke-width="1"
          />
          <g
            v-for="(item, index) in SERIES"
            :key="item.label"
          >
            <rect
              :x="index * 48 + 4"
              :y="80 - item.height"
              width="16"
              :height="item.height"
              rx="2"
              :fill="item.token"
            />
            <line
              :x1="index * 48 + 26"
              :x2="index * 48 + 44"
              :y1="80 - item.height / 2"
              :y2="80 - item.height / 2"
              :stroke="item.token"
              stroke-width="2"
              stroke-linecap="round"
            />
            <circle
              :cx="index * 48 + 35"
              :cy="80 - item.height / 2 - 12"
              r="4"
              :fill="item.token"
              stroke="var(--bg-surface)"
              stroke-width="2"
            />
          </g>
        </svg>
        <div class="grid grid-cols-7 gap-(--spacing-xxs)">
          <span
            v-for="item in SERIES"
            :key="item.label"
            class="truncate text-label-sm text-(--text-muted)"
          >
            {{ item.label }}
          </span>
        </div>
      </figure>
    </div>

    <div class="grid gap-(--spacing-md) md:grid-cols-2">
      <div class="flex flex-col gap-(--spacing-xs)">
        <span class="text-overline-sm text-(--text-muted)">Sequential</span>
        <div
          class="flex h-(--spacing-lg) overflow-hidden rounded-(--shape-card) border border-solid border-(--border-default)"
        >
          <span
            v-for="step in SEQUENTIAL"
            :key="step"
            class="flex-1 bg-(--ramp)"
            :style="{ '--ramp': step }"
          />
        </div>
      </div>
      <div class="flex flex-col gap-(--spacing-xs)">
        <span class="text-overline-sm text-(--text-muted)">Diverging</span>
        <div
          class="flex h-(--spacing-lg) overflow-hidden rounded-(--shape-card) border border-solid border-(--border-default)"
        >
          <span
            v-for="step in DIVERGING"
            :key="step"
            class="flex-1 bg-(--ramp)"
            :style="{ '--ramp': step }"
          />
        </div>
      </div>
    </div>
  </section>
</template>
