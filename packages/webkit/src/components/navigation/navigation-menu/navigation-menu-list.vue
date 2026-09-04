<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { cn } from '../../../utils/cn'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'
  import { useNavigationMenuListHighlight } from './composables/use-navigation-menu-list-highlight.js'
  import { provideNavigationMenuListHighlight } from './composables/use-navigation-menu-list-highlight-context.js'
  import { createChangeEventDetails } from './composables/use-navigation-menu-root.js'
  import {
    navigationMenuGroupLabelClasses,
    navigationMenuGroupLabelLinkClasses,
    navigationMenuListGroupClasses,
    navigationMenuListRootClasses,
    navigationMenuListSelectorClasses
  } from './presets/styles'

  defineOptions({ name: 'NavigationMenuList', inheritAttrs: false })

  interface Props {
    /** Group heading for column lists inside content panels. */
    label?: string
    /** Optional marker rendered before the group heading. */
    prefix?: string
    /** When set, the group heading is itself a link to the section's own page. */
    href?: string
    /** Enables sliding highlight on the root horizontal list. */
    highlight?: boolean
    /** Polymorphic list element. */
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    label: undefined,
    prefix: '',
    href: '',
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

  // The heading is a link only when it has somewhere to go — a data prop switching the element,
  // never an `as`/`is` string (see .claude/rules/root-element.md).
  const isLabelLink = computed(() => props.href !== '')

  const labelClass = computed(() =>
    cn(
      navigationMenuGroupLabelClasses,
      isLabelLink.value ? navigationMenuGroupLabelLinkClasses : ''
    )
  )

  /**
   * A heading link is a destination, so following it ends the menu's job — the same close a
   * `close-on-click` entry performs, and for the same reason: the panel must not outlive the
   * navigation it triggered.
   */
  const onLabelClick = (event: globalThis.MouseEvent) => {
    if (!isLabelLink.value) {
      return
    }

    root.setValue(
      null,
      createChangeEventDetails('link-press', event, event.currentTarget as HTMLElement)
    )
  }

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
    <component
      :is="isLabelLink ? 'a' : 'div'"
      :id="headingId"
      :href="isLabelLink ? href : undefined"
      :class="labelClass"
      :data-testid="`${testId}__label`"
      @click="onLabelClick"
    >
      <span
        v-if="prefix"
        class="shrink-0"
        aria-hidden="true"
        >{{ prefix }}</span
      >
      <span class="min-w-0 flex-1 truncate">{{ label }}</span>
    </component>
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
