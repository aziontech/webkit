<script setup lang="ts">
  import { computed, inject, useAttrs, useId } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useMenuContext } from '../composables/use-menu-context'
  import { MenuSubInjectionKey } from '../injection-key'
  import { getMenuLevelTransitionStyle, MENU_LEVEL_ENTER_MS } from '../presets/transitions'

  defineOptions({
    name: 'MenuGroup',
    inheritAttrs: false
  })

  interface Props {
    label?: string
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    ariaLabel: ''
  })

  const slots = defineSlots<{
    default(): unknown
    label(): unknown
  }>()

  const ctx = useMenuContext()
  const attrs = useAttrs()

  const uid = useId()
  const labelId = `${uid}-label`

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-group'
  )

  const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label))

  const isNested = inject(MenuSubInjectionKey, null) !== null
  const isCurrent = computed(() => isNested || ctx.levels.value.length === 0)

  const levelStyle = computed(() => {
    if (isNested) return undefined
    return isCurrent.value
      ? getMenuLevelTransitionStyle('enter', { fade: false })
      : getMenuLevelTransitionStyle('leave')
  })

  const ROOT_CLASS =
    'relative z-10 flex w-full flex-col my-(--spacing-sm) first-of-type:my-0 translate-x-0 ' +
    'data-[motion=push]:bg-[var(--menu-slide-surface,var(--bg-surface))] ' +
    'data-[motion=pop]:bg-[var(--menu-slide-surface,var(--bg-surface))] ' +
    'aria-hidden:z-0 ' +
    'aria-hidden:absolute aria-hidden:inset-x-0 aria-hidden:top-0 aria-hidden:-translate-x-full ' +
    'aria-hidden:opacity-0 aria-hidden:motion-reduce:hidden ' +
    'motion-reduce:transition-none motion-reduce:transform-none'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))

  const appear = computed(
    () => !isNested && ctx.enterOnMount.value && ctx.levels.value.length === 0
  )

  const transitionAttrs = computed(() => (appear.value ? { appear: true } : {}))
</script>

<template>
  <Transition
    v-bind="transitionAttrs"
    :duration="{ enter: MENU_LEVEL_ENTER_MS, leave: 0 }"
    enter-from-class="motion-safe:-translate-x-full!"
  >
    <section
      v-bind="$attrs"
      :data-testid="testId"
      :data-motion="ctx.motion.value"
      :aria-hidden="isCurrent ? undefined : 'true'"
      :inert="isCurrent ? undefined : true"
      :aria-labelledby="hasLabel ? labelId : undefined"
      :aria-label="hasLabel ? undefined : ariaLabel || undefined"
      :class="rootClass"
      :style="levelStyle"
    >
      <div
        v-if="hasLabel"
        :id="labelId"
        :data-testid="`${testId}__label`"
        class="flex min-h-8 w-full shrink-0 items-center px-(--spacing-sm) text-label-sm text-(--text-muted)"
      >
        <span class="min-w-0 flex-1 truncate">
          <slot name="label">{{ label }}</slot>
        </span>
      </div>
      <ul
        :data-testid="`${testId}__list`"
        class="relative m-0 flex w-full list-none flex-col p-0"
      >
        <slot />
      </ul>
    </section>
  </Transition>
</template>
