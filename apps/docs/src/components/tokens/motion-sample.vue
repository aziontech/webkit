<script setup lang="ts">
  import IconButton from '@aziontech/ui/icon-button'
  import { computed, ref } from 'vue'

  import { format, messages } from '../../lib/i18n'

  const props = defineProps<{
    name: string
    value: string
    sample: 'ease' | 'animation'
  }>()

  const t = messages
  const playing = ref(false)
  const looping = computed(() => /\binfinite\b/.test(props.value))
  const shape = computed(() => {
    const bare = props.name.replace(/^animate-/, '')
    if (bare.startsWith('progress-')) return 'progress'
    if (bare.startsWith('flow-dash')) return 'line'
    if (bare === 'shimmer') return 'shimmer'
    if (bare === 'highlight-fade' || bare.startsWith('blink')) return 'text'
    return 'box'
  })

  const stoppable = computed(() => playing.value && props.sample === 'animation' && looping.value)
  const label = computed(() =>
    format(stoppable.value ? t.value.stopMotion : t.value.playMotion, { name: props.name })
  )

  function onClick() {
    playing.value = !playing.value
  }

  function onAnimationend() {
    if (!looping.value) playing.value = false
  }
</script>

<template>
  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
    <span class="flex items-center gap-(--spacing-xs) motion-reduce:hidden">
      <IconButton
        :icon="stoppable ? 'az az-stop' : 'az az-play'"
        :aria-label="label"
        variant="ghost"
        size="small"
        :data-playing="playing || null"
        @click="onClick"
      />
      <span
        v-if="sample === 'ease'"
        class="relative block h-8 w-24 shrink-0 rounded-(--shape-control) border border-(--border-muted) bg-(--bg-canvas)"
        aria-hidden="true"
      >
        <span
          :data-playing="playing || null"
          class="absolute inset-y-0 start-0 m-auto block size-3 translate-x-1 rounded-full bg-(--primary) transition-[translate] duration-slow-03 motion-reduce:transition-none data-[playing]:translate-x-20 rtl:-translate-x-1 rtl:data-[playing]:-translate-x-20"
          :style="{ transitionTimingFunction: `var(${name})` }"
        />
      </span>
      <span
        v-else
        class="relative flex h-10 w-24 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-canvas)"
        aria-hidden="true"
      >
        <span
          v-if="shape === 'progress'"
          class="relative block h-1.5 w-20 overflow-hidden rounded-full bg-(--bg-hover)"
        >
          <span
            :class="playing ? name : ''"
            class="absolute inset-y-0 start-0 end-full block rounded-full bg-(--primary) motion-reduce:animate-none"
            @animationend="onAnimationend"
          />
        </span>
        <svg
          v-else-if="shape === 'line'"
          viewBox="0 0 80 8"
          class="h-2 w-20"
        >
          <line
            x1="0"
            y1="4"
            x2="80"
            y2="4"
            stroke="var(--primary)"
            stroke-width="2"
            stroke-dasharray="6 6"
            :class="playing ? name : ''"
            class="motion-reduce:animate-none"
            @animationend="onAnimationend"
          />
        </svg>
        <span
          v-else-if="shape === 'shimmer'"
          :class="playing ? name : ''"
          class="block h-4 w-20 rounded-(--shape-control) bg-size-[200%_100%] motion-reduce:animate-none"
          :style="{
            backgroundImage:
              'linear-gradient(90deg, var(--bg-canvas) 25%, var(--bg-hover) 50%, var(--bg-canvas) 75%)'
          }"
          @animationend="onAnimationend"
        />
        <span
          v-else-if="shape === 'text'"
          :class="playing ? name : ''"
          class="block rounded-(--shape-control) px-(--spacing-2xs) text-label-sm text-(--text-default) motion-reduce:animate-none"
          @animationend="onAnimationend"
          >Aa</span
        >
        <span
          v-else
          :class="playing ? name : ''"
          class="block size-5 rounded-(--shape-control) bg-(--primary) [--texture-wave-shift:var(--spacing-xl)] motion-reduce:animate-none"
          @animationend="onAnimationend"
        />
      </span>
    </span>
    <span class="hidden text-body-xs text-(--text-muted) motion-reduce:block">{{
      t.reducedMotion
    }}</span>
  </span>
</template>
