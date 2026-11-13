<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { cn } from '../../../utils/cn'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context'
  import { useNavigationMenuListHighlight } from './composables/use-navigation-menu-list-highlight'
  import { provideNavigationMenuListHighlight } from './composables/use-navigation-menu-list-highlight-context'
  import { createChangeEventDetails } from './composables/use-navigation-menu-root'

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
  }

  const props = withDefaults(defineProps<Props>(), {
    label: undefined,
    prefix: '',
    href: '',
    highlight: true
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

  const isLabelLink = computed(() => props.href !== '')

  const onLabelClick = (event: globalThis.MouseEvent) => {
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

  const ROOT_CLASS = 'relative z-1 m-0 flex list-none items-center gap-(--spacing-xs) p-0'

  const VERTICAL_CLASS = 'flex-col items-stretch'

  const isVertical = computed(() => root.menuOrientation.value === 'vertical')
</script>

<template>
  <div
    v-if="isGroup"
    class="flex flex-col"
    role="group"
    :aria-labelledby="headingId"
    :data-testid="`${testId}__group`"
  >
    <a
      v-if="isLabelLink"
      :id="headingId"
      :href="href"
      class="flex shrink-0 items-center border border-transparent border-b-(--border-default) mx-(--spacing-md) pb-(--spacing-xs) mb-(--spacing-xs) text-overline-xs text-(--text-muted) cursor-pointer no-underline transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
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
    </a>
    <div
      v-else
      :id="headingId"
      class="flex shrink-0 items-center border border-transparent border-b-(--border-default) mx-(--spacing-md) pb-(--spacing-xs) mb-(--spacing-xs) text-overline-xs text-(--text-muted)"
      :data-testid="`${testId}__label`"
    >
      <span
        v-if="prefix"
        class="shrink-0"
        aria-hidden="true"
        >{{ prefix }}</span
      >
      <span class="min-w-0 flex-1 truncate">{{ label }}</span>
    </div>
    <ul
      :class="cn('m-0 flex list-none flex-col p-0', attrs.class as string | undefined)"
      role="list"
      :data-testid="testId"
    >
      <slot />
    </ul>
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
      class="pointer-events-none absolute z-0 rounded-(--shape-button) bg-(--webkit-nav-selector) transition-[left,top,width,height,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
      :style="selectorStyle"
      :data-testid="`${testId}__selector`"
    />
    <ul
      :class="cn(ROOT_CLASS, isVertical && VERTICAL_CLASS, attrs.class as string | undefined)"
      role="list"
      :data-testid="testId"
      :data-open="root.menuOpen.value ? '' : undefined"
    >
      <slot />
    </ul>
  </div>
  <ul
    v-else
    :class="cn(ROOT_CLASS, isVertical && VERTICAL_CLASS, attrs.class as string | undefined)"
    role="list"
    :data-testid="testId"
    :data-open="root.menuOpen.value ? '' : undefined"
  >
    <slot />
  </ul>
</template>
