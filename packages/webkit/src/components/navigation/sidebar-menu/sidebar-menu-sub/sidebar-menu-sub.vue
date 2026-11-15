<script setup lang="ts">
  import { computed, inject, provide, ref, shallowRef, useAttrs, useId, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useSidebarMenuContext } from '../composables/use-sidebar-menu-context'
  import { SidebarMenuSubInjectionKey, type SidebarMenuSubType } from '../injection-key'

  defineOptions({
    name: 'SidebarMenuSub',
    inheritAttrs: false
  })

  export interface SidebarMenuSubProps {
    /** Initial state when uncontrolled; ignored for a drill trigger, whose visibility is the root's stack. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<SidebarMenuSubProps>(), {
    defaultOpen: false
  })

  /** Controlled open state. Use with v-model:open; while unbound the sub starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })
  const openBinding = computed<boolean | undefined>(() => openModel.value)

  defineSlots<{
    default(): unknown
  }>()

  const ctx = useSidebarMenuContext()
  const parentSub = inject(SidebarMenuSubInjectionKey, null)
  const attrs = useAttrs()
  const uid = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-sidebar-menu-sub'
  )

  const id = (attrs['data-node-id'] as string | undefined) || uid
  const level = (parentSub?.level ?? -1) + 1

  const type = ref<SidebarMenuSubType>('inline')
  const label = ref('')
  const triggerEl = shallowRef<globalThis.HTMLElement | null>(null)

  const isDrill = computed(() => type.value === 'drill')

  ctx.registerExpandable(id, openBinding.value ?? props.defaultOpen)
  watch(openBinding, (value) => {
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
    nextType: SidebarMenuSubType,
    nextLabel: string,
    el: globalThis.HTMLElement | null
  ) => {
    type.value = nextType
    label.value = nextLabel
    triggerEl.value = el
    if (nextType === 'drill') ctx.registerLevel(id, nextLabel, el)
  }

  provide(SidebarMenuSubInjectionKey, {
    id,
    level,
    triggerId: `${uid}-trigger`,
    contentId: `${uid}-content`,
    open,
    type: computed(() => type.value),
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
