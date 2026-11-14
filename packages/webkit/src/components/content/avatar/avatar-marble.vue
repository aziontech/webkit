<script setup lang="ts">
  import { computed, useId } from 'vue'

  defineOptions({ name: 'AvatarMarble' })

  const props = defineProps<{
    seed: string
    colors: string[]
    testId: string
  }>()

  const filterId = `avatar-pattern-${useId()}`

  const layers = computed(() => {
    let seed = 0
    for (let index = 0; index < props.seed.length; index += 1) {
      seed = (seed << 5) - seed + props.seed.charCodeAt(index)
      seed |= 0
    }
    seed = Math.abs(seed)
    const palette = props.colors.length ? props.colors : ['var(--primary)']
    const signed = (value: number, range: number, position?: number) => {
      const magnitude = value % range
      if (position && Math.floor((value / 10 ** position) % 10) % 2 === 0) return -magnitude
      return magnitude
    }
    return [0, 1, 2].map((index) => {
      const value = seed * (index + 1)
      return {
        fill: palette[(seed + index) % palette.length],
        transform: `translate(${signed(value, 8, 1)} ${signed(value, 8, 2)}) rotate(${signed(value, 360, 1)} 40 40) scale(${1.2 + signed(value, 4) / 10})`
      }
    })
  })
</script>

<template>
  <svg
    :data-testid="`${testId}__pattern`"
    viewBox="0 0 80 80"
    fill="none"
    aria-hidden="true"
    class="size-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter
        :id="filterId"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>
    <rect
      width="80"
      height="80"
      :style="{ fill: layers[0].fill }"
    />
    <path
      :filter="`url(#${filterId})`"
      :transform="layers[1].transform"
      :style="{ fill: layers[1].fill }"
      d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
    />
    <path
      :filter="`url(#${filterId})`"
      :transform="layers[2].transform"
      :style="{ fill: layers[2].fill }"
      class="mix-blend-overlay"
      d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
    />
  </svg>
</template>
