<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { cn } from '../../../../utils/cn'
  import Overline from '../../../overline/overline.vue'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'
  import { useNavigationMenuListHighlight } from './composables/use-navigation-menu-list-highlight.js'
  import { provideNavigationMenuListHighlight } from './composables/use-navigation-menu-list-highlight-context.js'
  import {
    navigationMenuListGroupClasses,
    navigationMenuListRootClasses,
    navigationMenuListSelectorClasses,
    navigationMenuOverlineClasses
  } from './presets/styles'

  defineOptions({ name: 'NavigationMenuList', inheritAttrs: false })

  interface Props {
    /** Group heading for column lists inside content panels. */
    label?: string
    /** Optional prefix shown in the overline. */
    prefix?: string
    /** Enables sliding highlight on the root horizontal list. */
    highlight?: boolean
    /** Polymorphic list element. */
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    label: undefined,
    prefix: '',
    highlight: true,
    as: 'ul'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__list'
  )

  const root = useNavigationMenuRoot()
  const headingId = useId()
  const listContainerRef = ref<HTMLElement | null>(null)

  const isGroup = computed(() => props.label != null && props.label !== '')

  const useHighlight = computed(() => props.highlight && !isGroup.value)

  const { selectorStyle, setTarget, handleTargetPointerLeave, handleListPointerLeave } =
    useNavigationMenuListHighlight(listContainerRef, root)

  if (useHighlight.value) {
    provideNavigationMenuListHighlight({
      setTarget,
      handleTargetPointerLeave
    })
  }

  const listClasses = computed(() =>
    cn(
      isGroup.value
        ? navigationMenuListGroupClasses
        : [
            navigationMenuListRootClasses,
            root.menuOrientation.value === 'vertical' ? 'flex-col items-stretch' : ''
          ],
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <div
    v-if="isGroup"
    class="flex flex-col"
    role="group"
    :aria-labelledby="headingId"
    :data-testid="`${testId}__group`"
  >
    <Overline
      :id="headingId"
      size="sm"
      :prefix="prefix"
      :class="navigationMenuOverlineClasses"
    >
      {{ label }}
    </Overline>
    <component
      :is="props.as"
      :class="listClasses"
      role="list"
      :data-testid="testId"
    >
      <slot />
    </component>
  </div>
  <div
    v-else-if="useHighlight"
    ref="listContainerRef"
    class="relative"
    :data-testid="`${testId}__highlight`"
    @pointerleave="handleListPointerLeave"
  >
    <span
      aria-hidden="true"
      :class="navigationMenuListSelectorClasses"
      :style="selectorStyle"
      :data-testid="`${testId}__selector`"
    />
    <component
      :is="props.as"
      :class="listClasses"
      role="list"
      :data-testid="testId"
      :data-open="root.menuOpen.value ? '' : undefined"
    >
      <slot />
    </component>
  </div>
  <component
    v-else
    :is="props.as"
    :class="listClasses"
    role="list"
    :data-testid="testId"
    :data-open="root.menuOpen.value ? '' : undefined"
  >
    <slot />
  </component>
</template>
