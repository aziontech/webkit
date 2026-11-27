<script setup lang="ts">
  import { computed, h, onMounted, provide, ref, shallowRef, useAttrs, type VNode } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useElementListener } from '../../../composables/use-element-listener'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { cn } from '../../../utils/cn'
  import { useSidebarMenuLevels } from './composables/use-sidebar-menu-levels'
  import {
    type SidebarMenuGroupNode,
    SidebarMenuInjectionKey,
    type SidebarMenuNode
  } from './injection-key'
  import SidebarMenuGroup from './sidebar-menu-group/sidebar-menu-group.vue'
  import SidebarMenuItem from './sidebar-menu-item/sidebar-menu-item.vue'
  import SidebarMenuSub from './sidebar-menu-sub/sidebar-menu-sub.vue'
  import SidebarMenuSubContent from './sidebar-menu-sub-content/sidebar-menu-sub-content.vue'
  import SidebarMenuSubTrigger from './sidebar-menu-sub-trigger/sidebar-menu-sub-trigger.vue'

  defineOptions({
    name: 'SidebarMenu',
    inheritAttrs: false
  })

  export interface SidebarMenuProps {
    /** Data-driven tree of groups and items; leave empty to compose the parts in the default slot. */
    groups?: SidebarMenuGroupNode[]
    /** Id of the node rendered as the current page. */
    activeId?: string
    /** Plays the level enter motion on the first render. */
    enterOnMount?: boolean
    /** Accessible name of the navigation landmark; empty uses the locale catalog. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<SidebarMenuProps>(), {
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
  const { t } = useTranslate({ sidebarMenu: en.sidebarMenu })
  const levelState = useSidebarMenuLevels(path)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'sidebar-menu')
  const role = computed(() => (attrs['role'] as string | undefined) ?? 'navigation')

  const ariaLabelAttr = computed(() =>
    role.value === 'presentation' || role.value === 'none'
      ? undefined
      : props.ariaLabel || t('sidebarMenu.label')
  )

  const hasGroups = computed(() => props.groups.length > 0)
  const hasContent = () => hasGroups.value || Boolean(slots.default)

  const rootClass = computed(() =>
    cn('relative flex w-full flex-col', attrs.class as string | undefined)
  )

  const rootEl = ref<globalThis.HTMLElement | null>(null)
  const levelHostEl = shallowRef<globalThis.HTMLElement | null>(null)
  const backHostEl = shallowRef<globalThis.HTMLElement | null>(null)

  const seededExpandable = new Set<string>()

  const setExpanded = (id: string, open: boolean) => {
    if (open === expandedModel.value.includes(id)) return
    expandedModel.value = open
      ? [...expandedModel.value, id]
      : expandedModel.value.filter((entry) => entry !== id)
  }

  provide(SidebarMenuInjectionKey, {
    ...levelState,
    enterOnMount: computed(() => props.enterOnMount),
    levelHost: levelHostEl,
    backHost: backHostEl,
    setBackHost: (el: globalThis.HTMLElement | null) => {
      backHostEl.value = el
    },
    isExpanded: (id: string) => expandedModel.value.includes(id),
    setExpanded,
    registerExpandable: (id: string, defaultOpen: boolean) => {
      if (seededExpandable.has(id)) return
      seededExpandable.add(id)
      if (defaultOpen) setExpanded(id, true)
    }
  })

  onMounted(() => {
    if (props.enterOnMount) levelState.playEnter()
  })

  useElementListener(rootEl, 'keydown', (event: globalThis.KeyboardEvent) => {
    const key = logicalArrowKey(event.key, dir.value)
    if (key !== 'Escape' && key !== 'ArrowLeft') return
    if (path.value.length === 0) return
    event.preventDefault()
    levelState.pop()
  })

  const renderItem = (node: SidebarMenuNode): VNode =>
    h(SidebarMenuItem, {
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

  const renderNode = (node: SidebarMenuNode): VNode => {
    const children = node.children ?? []
    const type = node.type ?? 'inline'
    const levelGroups = type === 'drill' ? node.groups : undefined

    if (children.length === 0 && !levelGroups?.length) return renderItem(node)

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
            type,
            icon: node.icon ?? '',
            href: node.href ?? '',
            disabled: node.disabled ?? false,
            onClick: (event: globalThis.MouseEvent) => emit('navigate', event, node)
          }),
          h(SidebarMenuSubContent, null, {
            default: () =>
              type === 'drill'
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
    pop: levelState.pop
  })
</script>

<template>
  <div
    v-if="hasContent()"
    v-bind="$attrs"
    :role="role"
    :aria-label="ariaLabelAttr"
    ref="rootEl"
    :data-testid="testId"
    :class="rootClass"
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
