<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'
  import { navigationMenuBackdropClasses } from './presets/styles'

  defineOptions({ name: 'NavigationMenuBackdrop', inheritAttrs: false })

  interface Props {
    /** Polymorphic backdrop element. */
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'div'
  })

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__backdrop'
  )

  const root = useNavigationMenuRoot()

  const backdropClasses = computed(() =>
    cn(navigationMenuBackdropClasses, attrs.class as string | undefined)
  )

  const backdropHidden = computed(() => !root.menuPopupMounted.value)

  const backdropDataAttrs = computed(() => ({
    'data-open': root.menuOpen.value ? '' : undefined,
    'data-closed': !root.menuOpen.value ? '' : undefined,
    'data-starting-style': root.popupTransitionStatus.value === 'starting' ? '' : undefined,
    'data-ending-style': root.popupTransitionStatus.value === 'ending' ? '' : undefined
  }))
</script>

<template>
  <component
    :is="props.as"
    :hidden="backdropHidden"
    :class="backdropClasses"
    :data-testid="testId"
    v-bind="backdropDataAttrs"
    aria-hidden="true"
    @click="root.close()"
  />
</template>
