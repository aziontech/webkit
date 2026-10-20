<script setup lang="ts">
  import { computed, useId } from 'vue'

  import { MARBLE_SIZE, marbleElements, marbleTransform } from '../../lib/behavior/marble.js'
  import { accentOf } from '../../lib/state/organizations.js'

  interface Props {
    name?: string
    accent?: string
    size?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    accent: 'blue',
    size: 'small'
  })

  const uid = useId()
  const filterId = `marble-blur-${uid}`

  const colors = computed(() => accentOf(props.accent).colors)
  const elements = computed(() => marbleElements(props.name, colors.value.length))
  const fillOf = (index) => ({ fill: colors.value[elements.value[index].colorIndex] })

  const sizeClasses = {
    small: 'size-(--size-5)',
    medium: 'size-(--size-6)',
    large: 'size-(--size-12)'
  }
</script>

<template>
  <span
    role="img"
    :aria-label="name"
    :class="[
      sizeClasses[size] ?? sizeClasses.small,
      'inline-flex shrink-0 overflow-hidden rounded-(--shape-button)'
    ]"
  >
    <svg
      :viewBox="`0 0 ${MARBLE_SIZE} ${MARBLE_SIZE}`"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <rect
          :width="MARBLE_SIZE"
          :height="MARBLE_SIZE"
          :style="fillOf(0)"
        />
        <path
          :filter="`url(#${filterId})`"
          :transform="marbleTransform(elements[1])"
          :style="fillOf(1)"
          d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
        />
        <path
          :filter="`url(#${filterId})`"
          :transform="marbleTransform(elements[2])"
          :style="{ ...fillOf(2), mixBlendMode: 'overlay' }"
          d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
        />
      </g>
      <defs>
        <filter
          :id="filterId"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood
            flood-opacity="0"
            result="BackgroundImageFix"
          />
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="7"
            result="effect1_foregroundBlur"
          />
        </filter>
      </defs>
    </svg>
  </span>
</template>
