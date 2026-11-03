<script setup lang="ts">
  import { computed, inject, provide, ref, shallowRef, useAttrs, useId, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useMenuContext } from '../composables/use-menu-context'
  import { MenuSubInjectionKey, type MenuSubKind } from '../injection-key'

  defineOptions({
    name: 'MenuSub',
    inheritAttrs: false
  })

  interface Props {
    /** Initial state when uncontrolled; ignored for a drill trigger, whose visibility is the root's stack. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultOpen: false
  })

  const openModel = defineModel<boolean | undefined>('open', { default: undefined })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = useMenuContext()
  const parentSub = inject(MenuSubInjectionKey, null)
  const attrs = useAttrs()
  const uid = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-sub'
  )

  const id = (attrs['data-node-id'] as string | undefined) || uid
  const level = (parentSub?.level ?? -1) + 1

  const kind = ref<MenuSubKind>('inline')
  const label = ref('')
  const triggerEl = shallowRef<globalThis.HTMLElement | null>(null)

  const isDrill = computed(() => kind.value === 'drill')

  ctx.registerExpandable(id, openModel.value ?? props.defaultOpen)
  watch(openModel, (value) => {
    if (value !== undefined && !isDrill.value) ctx.setExpanded(id, value)
  })

  const open = computed(() => (isDrill.value ? ctx.isCurrentLevel(id) : ctx.isExpanded(id)))

  const rootClass = computed(() =>
    cn('relative flex w-full shrink-0 flex-col', attrs.class as string | undefined)
  )

  const setOpen = (value: boolean) => {
    if (isDrill.value) return
    ctx.setExpanded(id, value)
    openModel.value = value
  }

  const toggle = () => {
    setOpen(!open.value)
  }

  const push = () => {
    ctx.push({ id, label: label.value }, triggerEl.value)
  }

  const registerTrigger = (
    nextKind: MenuSubKind,
    nextLabel: string,
    el: globalThis.HTMLElement | null
  ) => {
    kind.value = nextKind
    label.value = nextLabel
    triggerEl.value = el
    if (nextKind === 'drill') ctx.registerLevel(id, nextLabel, el)
  }

  provide(MenuSubInjectionKey, {
    id,
    level,
    triggerId: `${uid}-trigger`,
    contentId: `${uid}-content`,
    open,
    kind: computed(() => kind.value),
    label: computed(() => label.value),
    registerTrigger,
    toggle,
    setOpen,
    push
  })
</script>

<template>
  <li
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="open ? 'open' : 'closed'"
    :class="rootClass"
  >
    <slot />
  </li>
</template>
