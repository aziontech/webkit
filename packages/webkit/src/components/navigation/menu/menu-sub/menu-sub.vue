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
  /** Read before providing, so the depth counts ancestors only. */
  const parentSub = inject(MenuSubInjectionKey, null)
  const attrs = useAttrs()
  const uid = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-sub'
  )

  /**
   * Identity of this sub on the drill stack. Data-driven mode hands the tree node's
   * own id down as an attribute, so the emitted path carries real node ids; a
   * hand-composed sub falls back to a generated one.
   */
  const id = (attrs['data-node-id'] as string | undefined) || uid
  const level = (parentSub?.level ?? -1) + 1

  const kind = ref<MenuSubKind>('inline')
  const label = ref('')
  const triggerEl = shallowRef<globalThis.HTMLElement | null>(null)

  const isDrill = computed(() => kind.value === 'drill')

  // The ROOT holds inline expansion (see `Menu`'s `expanded` model): one sub opening must
  // not disturb another, and a consumer whose shell remounts can persist it. `defaultOpen`
  // seeds that set once; `v-model:open` on this sub still works, writing through to it.
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
    // Mirrored so a consumer binding `v-model:open` on this sub still hears the change.
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
    // A drill sub names its level to the ROOT here rather than only when pushed, so a stack
    // restored from `v-model:path` still has a label for `Menu.Back` and an element to return
    // focus to. Inline subs never enter the stack, so they announce nothing.
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
