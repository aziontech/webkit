<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import type { LineFigureName } from './figures/registry'
  import { useLineFigure } from './use-line-figure'

  defineOptions({ name: 'LineFigure', inheritAttrs: false })

  interface Props {
    /** Registered figure to draw. */
    name?: LineFigureName | ''
    /** How strongly the figure answers the pointer, from 0 (subtle) to 1 (strong). */
    intensity?: number
    /** Walks the figure through its answer on its own until a pointer or focus arrives. */
    play?: boolean
    /** Accessible name; falls back to the figure's own description. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    intensity: 0.5,
    play: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    read: [caption: string]
  }>()

  const attrs = useAttrs()
  const stage = ref<HTMLElement | null>(null)
  const svg = ref<SVGSVGElement | null>(null)

  const { definition } = useLineFigure(stage, svg, {
    name: () => props.name,
    intensity: () => props.intensity,
    play: () => props.play,
    onRead: (caption) => emit('read', caption)
  })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-line-figure'
  )
  const label = computed(() => props.ariaLabel || definition.value?.label || '')
</script>

<template>
  <div
    ref="stage"
    v-bind="$attrs"
    role="img"
    :aria-label="label || undefined"
    :data-testid="testId"
    :data-name="name || null"
    :data-play="play || null"
    class="relative block aspect-[5/4] w-full touch-pan-y select-none [&_svg]:absolute [&_svg]:inset-0 [&_svg]:block [&_svg]:size-full [&_:is(path,ellipse,line,polygon)]:fill-[var(--line-figure-plate,var(--illustration-ground))] [&_:is(path,ellipse,line,polygon)]:stroke-(--illustration-highlight) [&_:is(path,ellipse,line,polygon)]:stroke-1 [&_:is(path,ellipse,line,polygon)]:[vector-effect:non-scaling-stroke] [&_:is(path,ellipse,line,polygon)]:[stroke-linejoin:round] [&_:is(path,ellipse,line,polygon)]:[stroke-linecap:round] [&_:is(path,ellipse,line,polygon)]:transition-colors [&_:is(path,ellipse,line,polygon)]:duration-moderate-02 [&_:is(path,ellipse,line,polygon)]:ease-productive-entrance motion-reduce:[&_:is(path,ellipse,line,polygon)]:transition-none [&_.nf]:fill-none [&_.fo]:stroke-none [&_.sil]:stroke-(--illustration-line-strong) [&_.hi]:stroke-(--illustration-primary) [&_.sil.hi]:stroke-(--illustration-primary) [&_.lo]:stroke-(--illustration-line) [&_.halo]:stroke-2 [&_.dash]:[stroke-dasharray:1_3] [&_.dot]:stroke-none [&_.dot]:fill-(--illustration-primary) [&_.dot.m]:fill-(--illustration-line-strong) [&_.dot.off]:fill-(--illustration-line)"
  >
    <svg
      ref="svg"
      viewBox="0 0 400 320"
      aria-hidden="true"
    />
  </div>
</template>
