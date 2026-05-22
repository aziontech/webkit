<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { provideNavigationMenuRoot } from './composables/use-navigation-menu-context.js'
  import { useNavigationMenuRootState } from './composables/use-navigation-menu-root.js'
  import { getNavigationMenuRootClasses } from './presets/styles'

  export type NavigationMenuOrientation = 'horizontal' | 'vertical'

  defineOptions({ name: 'NavigationMenu', inheritAttrs: false })

  interface Props {
    /** Uncontrolled initial open item value. */
    defaultValue?: string | number | null
    /** Controlled open item (`v-model:value`). */
    value?: string | number | null
    /** Hover-open delay in milliseconds. */
    delay?: number
    /** Hover-close delay in milliseconds. */
    closeDelay?: number
    /** Menu orientation. */
    orientation?: NavigationMenuOrientation
    /** Accessible name for the root navigation landmark. */
    ariaLabel?: string
    /** Polymorphic root element. */
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultValue: null,
    value: undefined,
    delay: 50,
    closeDelay: 300,
    orientation: 'horizontal',
    ariaLabel: 'Main',
    as: 'nav'
  })

  const emit = defineEmits<{
    'update:value': [value: string | number | null, eventDetails: unknown]
    'value-change': [value: string | number | null, eventDetails: unknown]
    'open-change-complete': [open: boolean]
  }>()

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu')

  const internalValue = ref(props.defaultValue)
  const isControlled = computed(() => props.value !== undefined)
  const controlledValue = computed(() => (isControlled.value ? (props.value ?? null) : null))

  const rootState = useNavigationMenuRootState(
    controlledValue,
    computed(() => props.defaultValue),
    isControlled,
    internalValue,
    {
      delay: props.delay,
      closeDelay: props.closeDelay,
      orientation: props.orientation,
      nested: false
    },
    emit
  )

  provideNavigationMenuRoot(rootState)

  defineExpose({
    unmount: rootState.unmount
  })

  const rootClasses = computed(() =>
    cn(getNavigationMenuRootClasses(), attrs.class as string | undefined)
  )
</script>

<template>
  <component
    :is="as"
    :class="rootClasses"
    :aria-label="ariaLabel"
    :data-testid="testId"
    :data-open="rootState.open.value ? '' : undefined"
    :data-orientation="orientation"
    :data-state="rootState.open.value ? 'open' : 'closed'"
  >
    <slot />
  </component>
</template>
