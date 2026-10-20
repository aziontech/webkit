<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import { computed } from 'vue'

  interface Props {
    title: string
    unit?: string
    period?: string
    series?: unknown[]
  }

  const props = withDefaults(defineProps<Props>(), {
    unit: '',
    period: '',
    series: () => []
  })

  const WIDTH = 100
  const HEIGHT = 32

  const bounds = computed(() => {
    const values = props.series
    if (!values.length) return { min: 0, max: 1 }
    const min = Math.min(...values)
    const max = Math.max(...values)
    return max === min ? { min: min - 1, max: max + 1 } : { min, max }
  })

  const points = computed(() => {
    const { min, max } = bounds.value
    const step = props.series.length > 1 ? WIDTH / (props.series.length - 1) : 0
    return props.series
      .map((value, index) => {
        const y = HEIGHT - ((value - min) / (max - min)) * HEIGHT
        return `${(index * step).toFixed(2)},${y.toFixed(2)}`
      })
      .join(' ')
  })

  const area = computed(() =>
    points.value ? `0,${HEIGHT} ${points.value} ${WIDTH},${HEIGHT}` : ''
  )

  const latest = computed(() => {
    const value = props.series.at(-1)
    if (value === undefined) return ''
    return value >= 100 ? Math.round(value).toLocaleString() : value.toFixed(2)
  })
</script>

<template>
  <CardBox>
    <template #content>
      <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
        <div class="flex min-w-0 items-baseline justify-between gap-(--spacing-xs)">
          <h3 class="min-w-0 truncate text-label-md text-(--text-default)">{{ title }}</h3>
          <span class="shrink-0 text-body-sm text-(--text-muted)">{{ period }}</span>
        </div>

        <p class="flex items-baseline gap-(--spacing-xxs)">
          <span class="text-heading-md text-(--text-default)">{{ latest }}</span>
          <span
            v-if="unit"
            class="text-body-sm text-(--text-muted)"
            >{{ unit }}</span
          >
        </p>

        <svg
          :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
          preserveAspectRatio="none"
          class="h-16 w-full text-(--primary)"
          aria-hidden="true"
        >
          <polygon
            :points="area"
            fill="currentColor"
            opacity="0.12"
          />
          <polyline
            :points="points"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>
    </template>
  </CardBox>
</template>
