<script setup lang="ts">
  import {
    computed,
    h,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    shallowRef,
    useAttrs,
    type VNode
  } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { cn } from '../../../utils/cn'
  import {
    type SidebarMenuGroupNode,
    SidebarMenuInjectionKey,
    type SidebarMenuLevel,
    type SidebarMenuMotion,
    type SidebarMenuNode
  } from './injection-key'
  import { MENU_LEVEL_EXIT_MS } from './presets/transitions'
  import SidebarMenuGroup from './sidebar-menu-group/sidebar-menu-group.vue'
  import SidebarMenuItem from './sidebar-menu-item/sidebar-menu-item.vue'
  import SidebarMenuSub from './sidebar-menu-sub/sidebar-menu-sub.vue'
  import SidebarMenuSubContent from './sidebar-menu-sub-content/sidebar-menu-sub-content.vue'
  import SidebarMenuSubTrigger from './sidebar-menu-sub-trigger/sidebar-menu-sub-trigger.vue'

  defineOptions({
    name: 'SidebarMenu',
    inheritAttrs: false
  })

  interface Props {
    /** Data-driven tree of groups and items; leave empty to compose the parts in the default slot. */
    groups?: SidebarMenuGroupNode[]
    /** Id of the node rendered as the current page. */
    activeId?: string
    /** Plays the level enter motion on the first render. */
    enterOnMount?: boolean
    /** Accessible name of the navigation landmark; empty uses the locale catalog. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    groups: () => [],
    activeId: '',
    enterOnMount: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    navigate: [event: globalThis.MouseEvent, node: SidebarMenuNode]
  }>()

  const path = defineModel<string[]>('path', { default: () => [] })

  const expandedModel = defineModel<string[]>('openKeys', { default: () => [] })

  const slots = defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const dir = useDirection()
  const { t } = useTranslate({ menu: en.menu })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-sidebar-menu'
  )
  const role = computed(() => (attrs['role'] as string | undefined) ?? 'navigation')

  const ariaLabelAttr = computed(() =>
    role.value === 'presentation' || role.value === 'none'
      ? undefined
      : props.ariaLabel || t('menu.label')
  )

  const hasGroups = computed(() => props.groups.length > 0)
  const hasContent = () => hasGroups.value || Boolean(slots.default)

  const rootClass = computed(() =>
    cn('relative flex w-full flex-col', attrs.class as string | undefined)
  )

  const labels = ref<Record<string, string>>({})
  const triggers = new Map<string, globalThis.HTMLElement | null>()
  const motion = ref<SidebarMenuMotion>('none')
  const leaving = ref<string[]>([])
  const backEl = shallowRef<globalThis.HTMLElement | null>(null)
  const levelHostEl = shallowRef<globalThis.HTMLElement | null>(null)
  const backHostEl = shallowRef<globalThis.HTMLElement | null>(null)

  let motionTimer: ReturnType<typeof globalThis.setTimeout> | undefined

  const levels = computed<SidebarMenuLevel[]>(() =>
    path.value.map((id) => ({ id, label: labels.value[id] ?? '' }))
  )

  const endMotion = () => {
    if (motionTimer !== undefined) globalThis.clearTimeout(motionTimer)
    motionTimer = globalThis.setTimeout(() => {
      motion.value = 'none'
      leaving.value = []
      motionTimer = undefined
    }, MENU_LEVEL_EXIT_MS)
  }

  const isCurrentLevel = (id: string) =>
    path.value.length > 0 && path.value[path.value.length - 1] === id

  const isLevelMounted = (id: string) => path.value.includes(id) || leaving.value.includes(id)

  const registerLevel = (id: string, label: string, trigger: globalThis.HTMLElement | null) => {
    triggers.set(id, trigger)
    if (label && labels.value[id] !== label) {
      labels.value = { ...labels.value, [id]: label }
    }
  }

  const push = (level: SidebarMenuLevel, trigger: globalThis.HTMLElement | null) => {
    if (path.value.includes(level.id)) return
    labels.value = { ...labels.value, [level.id]: level.label }
    triggers.set(level.id, trigger)
    path.value = [...path.value, level.id]
    motion.value = 'push'
    endMotion()
    nextTick(() => backEl.value?.focus())
  }

  const pop = () => {
    const current = path.value[path.value.length - 1]
    if (current === undefined) return
    const trigger = triggers.get(current) ?? null
    triggers.delete(current)
    path.value = path.value.slice(0, -1)
    leaving.value = [...leaving.value, current]
    motion.value = 'pop'
    endMotion()
    nextTick(() => trigger?.focus())
  }

  const setBackElement = (el: globalThis.HTMLElement | null) => {
    backEl.value = el
  }

  const setBackHost = (el: globalThis.HTMLElement | null) => {
    backHostEl.value = el
  }

  const seededExpandable = new Set<string>()

  const isExpanded = (id: string) => expandedModel.value.includes(id)

  const setExpanded = (id: string, open: boolean) => {
    if (open === expandedModel.value.includes(id)) return
    expandedModel.value = open
      ? [...expandedModel.value, id]
      : expandedModel.value.filter((entry) => entry !== id)
  }

  const registerExpandable = (id: string, defaultOpen: boolean) => {
    if (seededExpandable.has(id)) return
    seededExpandable.add(id)
    if (defaultOpen) setExpanded(id, true)
  }

  provide(SidebarMenuInjectionKey, {
    levels,
    motion: computed(() => motion.value),
    enterOnMount: computed(() => props.enterOnMount),
    levelHost: levelHostEl,
    isCurrentLevel,
    isLevelMounted,
    push,
    registerLevel,
    pop,
    setBackElement,
    backHost: backHostEl,
    setBackHost,
    isExpanded,
    setExpanded,
    registerExpandable
  })

  onMounted(() => {
    if (!props.enterOnMount) return
    motion.value = path.value.length > 0 ? 'push' : 'pop'
    endMotion()
  })

  onBeforeUnmount(() => {
    if (motionTimer !== undefined) globalThis.clearTimeout(motionTimer)
  })

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    const key = logicalArrowKey(event.key, dir.value)
    if (key !== 'Escape' && key !== 'ArrowLeft') return
    if (path.value.length === 0) return
    event.preventDefault()
    pop()
  }

  const renderNode = (node: SidebarMenuNode): VNode => {
    const children = node.children ?? []
    const isDrill = (node.type ?? 'inline') === 'drill'
    const levelGroups = isDrill ? node.groups : undefined

    if (children.length === 0 && !levelGroups?.length) {
      return h(SidebarMenuItem, {
        key: node.id,
        label: node.label,
        icon: node.icon ?? '',
        href: node.href ?? '',
        target: node.target ?? '_self',
        tagValue: node.tagValue,
        disabled: node.disabled ?? false,
        active: props.activeId !== '' && node.id === props.activeId,
        onClick: (event: globalThis.MouseEvent) => emit('navigate', event, node)
      })
    }

    return h(
      SidebarMenuSub,
      {
        key: node.id,
        'data-node-id': node.id,
        defaultOpen: node.defaultOpen ?? false
      },
      {
        default: () => [
          h(SidebarMenuSubTrigger, {
            label: node.label,
            type: node.type ?? 'inline',
            icon: node.icon ?? '',
            href: node.href ?? '',
            disabled: node.disabled ?? false,
            onClick: (event: globalThis.MouseEvent) => emit('navigate', event, node)
          }),
          h(SidebarMenuSubContent, null, {
            default: () =>
              isDrill
                ? (levelGroups ?? [{ items: children }]).map(renderGroup)
                : children.map(renderNode)
          })
        ]
      }
    )
  }

  const renderGroup = (group: SidebarMenuGroupNode, index: number): VNode =>
    h(
      SidebarMenuGroup,
      { key: group.label ?? index, label: group.label ?? '' },
      { default: () => group.items.map(renderNode) }
    )

  const groupTrees = computed<VNode[]>(() => props.groups.map(renderGroup))

  defineExpose({
    pop
  })
</script>

<template>
  <div
    v-if="hasContent()"
    v-bind="$attrs"
    :role="role"
    :aria-label="ariaLabelAttr"
    :data-testid="testId"
    :class="rootClass"
    @keydown="onKeydown"
  >
    <slot />
    <component
      v-for="(tree, index) in groupTrees"
      :is="tree"
      :key="index"
    />
    <div
      ref="levelHostEl"
      :data-testid="`${testId}__levels`"
      class="flex w-full flex-col"
    />
  </div>
</template>
