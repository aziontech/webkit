<script setup lang="ts">
  import { type ComponentPublicInstance, computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useMenuContext } from '../composables/use-menu-context'

  defineOptions({
    name: 'MenuBack',
    inheritAttrs: false
  })

  interface Props {
    /** Names the destination Back returns to, overriding the level below it on the stack. Set it to name the menu root, which has no trigger to name itself. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: ''
  })

  defineSlots<{
    default?(): unknown
  }>()

  const ctx = useMenuContext()
  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-back'
  )

  const isVisible = computed(() => ctx.backHost.value !== null)

  const destination = computed(() => {
    const levels = ctx.levels.value
    return props.label || (levels.length > 1 ? levels[levels.length - 2].label : '')
  })

  const text = computed(() => (destination.value ? `Back to ${destination.value}` : 'Back'))

  const ROOT_CLASS =
    'group relative flex h-8 w-fit max-w-full shrink-0 items-center gap-(--spacing-xxs) ' +
    'mb-(--spacing-sm) ' +
    'rounded-(--shape-elements) px-(--spacing-sm) ' +
    'text-(--text-default) ' +
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance " +
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-(--bg-active) after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance " +
    'hover:before:opacity-100 active:after:opacity-100 ' +
    'motion-reduce:before:transition-none motion-reduce:after:transition-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--menu-ring-offset,var(--bg-canvas))]'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))

  const registerElement = (el: globalThis.Element | ComponentPublicInstance | null) => {
    ctx.setBackElement(el as globalThis.HTMLElement | null)
  }
</script>

<template>
  <Teleport
    v-if="isVisible"
    :to="ctx.backHost.value"
  >
    <button
      :ref="registerElement"
      v-bind="$attrs"
      type="button"
      :data-testid="testId"
      :class="rootClass"
      @click="ctx.pop()"
    >
      <i
        class="pi pi-chevron-left size-4 shrink-0 leading-none text-[length:inherit] text-(--text-muted)"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      />
      <span class="min-w-0 truncate text-label-md">
        <slot>{{ text }}</slot>
      </span>
    </button>
  </Teleport>
</template>
