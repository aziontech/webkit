<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { cn } from '../../../utils/cn'
  import { provideNavigationMenuRoot } from './composables/use-navigation-menu-context'
  import {
    type NavigationMenuRootEmit,
    useNavigationMenuRootState
  } from './composables/use-navigation-menu-root'

  defineOptions({ name: 'NavigationMenu', inheritAttrs: false })

  export type NavigationMenuOrientation = 'horizontal' | 'vertical'
  export type NavigationMenuValue = string | number | null

  interface Props {
    /** Uncontrolled initial open item value. */
    defaultValue?: NavigationMenuValue
    /** Hover-open delay in milliseconds. */
    delay?: number
    /** Hover-close delay in milliseconds. */
    closeDelay?: number
    /** Menu orientation. */
    orientation?: NavigationMenuOrientation
    /** Accessible name for the root navigation landmark. Empty uses the locale catalog (`Main`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultValue: null,
    delay: 50,
    closeDelay: 300,
    orientation: 'horizontal',
    ariaLabel: ''
  })

  const emit = defineEmits<{
    'open-change-complete': [open: boolean]
  }>()

  const model = defineModel<NavigationMenuValue | undefined>({ default: undefined })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ navigationMenu: en.navigationMenu })
  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu')

  const ROOT_CLASS =
    'relative [--webkit-nav-selector:color-mix(in_srgb,var(--bg-hover)_60%,transparent)]'

  const internalValue = ref(props.defaultValue)
  const isControlled = computed(() => model.value !== undefined)
  const controlledValue = computed(() => (isControlled.value ? (model.value ?? null) : null))

  const rootState = useNavigationMenuRootState(
    controlledValue,
    isControlled,
    internalValue,
    {
      delay: () => props.delay,
      closeDelay: () => props.closeDelay,
      orientation: () => props.orientation,
      dir: useDirection()
    },
    emit as unknown as NavigationMenuRootEmit
  )

  provideNavigationMenuRoot(rootState)

  defineExpose({
    unmount: rootState.unmount
  })
</script>

<template>
  <nav
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :data-testid="testId"
    :aria-label="ariaLabel || t('navigationMenu.label')"
    :data-open="rootState.open.value ? '' : undefined"
    :data-orientation="orientation"
  >
    <slot />
  </nav>
</template>
