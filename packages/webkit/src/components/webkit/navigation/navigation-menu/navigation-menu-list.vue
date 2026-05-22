<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { cn } from '../../../../utils/cn'
  import Overline from '../../../overline/overline.vue'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'
  import { useNavigationMenuListHighlight } from './composables/use-navigation-menu-list-highlight.js'
  import { provideNavigationMenuListHighlight } from './composables/use-navigation-menu-list-highlight-context.js'
  import { navigationMenuListSelectorClasses } from './presets/list-selector.js'

  defineOptions({ name: 'NavigationMenuList', inheritAttrs: false })

  interface Props {
    /** Section label for grouped panel lists (renders Overline). */
    label?: string
    /** Optional prefix shown before the overline label. */
    prefix?: string
    /** Enables sliding highlight on the root horizontal/vertical list. */
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
  const root = useNavigationMenuRoot()
  const headingId = useId()
  const listContainerRef = ref<HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__list'
  )

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

  const listClass = computed(() =>
    cn(
      isGroup.value
        ? 'm-0 flex list-none flex-col gap-[var(--spacing-1)] p-0'
        : [
            'relative z-[1] m-0 flex list-none items-center gap-[var(--spacing-1)] p-0',
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
      class="mb-[var(--spacing-3)] px-[var(--spacing-3)]"
    >
      {{ label }}
    </Overline>
    <component
      :is="as"
      :class="listClass"
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
    :data-testid="testId"
    @pointerleave="handleListPointerLeave"
  >
    <span
      aria-hidden="true"
      :class="navigationMenuListSelectorClasses"
      :style="selectorStyle"
      :data-testid="`${testId}__selector`"
    />
    <component
      :is="as"
      :class="listClass"
      role="list"
      :data-open="root.menuOpen.value ? '' : undefined"
    >
      <slot />
    </component>
  </div>
  <component
    v-else
    :is="as"
    :class="listClass"
    role="list"
    :data-testid="testId"
    :data-open="root.menuOpen.value ? '' : undefined"
  >
    <slot />
  </component>
</template>
