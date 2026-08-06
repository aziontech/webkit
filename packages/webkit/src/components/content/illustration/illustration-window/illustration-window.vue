<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'

  defineOptions({
    name: 'IllustrationWindow',
    inheritAttrs: false
  })

  export type IllustrationWindowKind = 'icon' | 'chat' | 'website'

  /** A window has no `small` step — 32px leaves no room for a scene. */
  export type IllustrationWindowSize = 'medium' | 'large'

  interface Props {
    /** Which scene fills the window body. */
    kind?: IllustrationWindowKind
    /** Scale of the window; inherits the scene scale when omitted, clamped to `medium`. */
    size?: IllustrationWindowSize
    /** Lights the window with the brand rim; inherits the scene emphasis when omitted. */
    active?: boolean
    /** Icon class pair from the icon library; used by `kind: 'icon'`. */
    icon?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'icon',
    size: undefined,
    active: undefined,
    icon: ''
  })

  defineSlots<{
    /** Replaces the scene, keeping the window chrome. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const { size: sceneSize, active } = useIllustrationContext(
    () => props.size,
    () => props.active,
    'large'
  )

  // The scene may be `small`; a window clamps up to its smallest real step.
  const resolvedSize = computed<IllustrationWindowSize>(() =>
    sceneSize.value === 'large' ? 'large' : 'medium'
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-window'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  // The window sits on the canvas, not on a surface, so it overrides the rim's fill layer.
  const ROOT_CLASS =
    'flex shrink-0 flex-col border-solid border-transparent border-[length:var(--illustration-rim-width)] rounded-[var(--illustration-shape-large)] text-[var(--text-default)] [--illustration-fill:var(--bg-canvas)] [background-image:var(--illustration-rim-layers)] [background-origin:var(--illustration-rim-boxes)] [background-clip:var(--illustration-rim-boxes)] transition-[background-image] duration-150 ease-out motion-reduce:transition-none data-[active]:[background-image:var(--illustration-rim-layers-active)] data-[size=medium]:size-16 data-[size=medium]:gap-[var(--spacing-xxs)] data-[size=medium]:p-[var(--spacing-xs)] data-[size=large]:size-32 data-[size=large]:gap-[var(--spacing-sm)] data-[size=large]:p-[var(--spacing-sm)]'

  const CHROME_CLASS =
    'flex shrink-0 items-center gap-[var(--spacing-xxs)] group-data-[size=medium]/window:*:size-0.5 group-data-[size=large]/window:*:size-1'

  const BODY_CLASS = 'min-h-0 flex-1'

  const BLOCK_CLASS = 'rounded-[var(--shape-button)] bg-[var(--bg-placeholder)]'

  const rootClass = computed(() =>
    cn(ROOT_CLASS, 'group/window', attrs.class as string | undefined)
  )
</script>

<template>
  <span
    :data-testid="testId"
    :data-kind="kind"
    :data-size="resolvedSize"
    :data-active="active || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <span
      aria-hidden="true"
      :class="CHROME_CLASS"
    >
      <span class="rounded-full bg-[var(--danger-contrast)]" />
      <span class="rounded-full bg-[var(--warning-contrast)]" />
      <span class="rounded-full bg-[var(--success-contrast)]" />
    </span>

    <slot>
      <span
        v-if="kind === 'icon'"
        :class="BODY_CLASS"
        class="grid place-items-center group-data-[size=medium]/window:text-[length:var(--size-6)] group-data-[size=large]/window:text-[length:var(--size-12)]"
      >
        <i
          v-if="icon"
          aria-hidden="true"
          :class="icon"
          class="leading-none"
        />
      </span>

      <span
        v-else-if="kind === 'chat'"
        :class="BODY_CLASS"
        class="grid grid-cols-2 grid-rows-[1fr_1fr_1fr_1.6fr] gap-[var(--spacing-xxs)]"
      >
        <span :class="[BLOCK_CLASS, 'col-start-1 row-start-1 w-[86%]']" />
        <span :class="[BLOCK_CLASS, 'col-start-2 row-start-2 w-[86%] justify-self-end']" />
        <span :class="[BLOCK_CLASS, 'col-start-1 row-start-3 w-[86%]']" />
        <span :class="[BLOCK_CLASS, 'col-span-2 row-start-4']" />
      </span>

      <span
        v-else
        :class="BODY_CLASS"
        class="grid grid-rows-[14fr_57fr_23fr] gap-[var(--spacing-xxs)]"
      >
        <span :class="BLOCK_CLASS" />
        <span :class="BLOCK_CLASS" />
        <span :class="BLOCK_CLASS" />
      </span>
    </slot>
  </span>
</template>
