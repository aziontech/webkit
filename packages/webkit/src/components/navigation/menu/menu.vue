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

  import { cn } from '../../../utils/cn'
  import {
    type MenuGroupNode,
    MenuInjectionKey,
    type MenuLevel,
    type MenuMotion,
    type MenuNode
  } from './injection-key'
  import MenuGroup from './menu-group/menu-group.vue'
  import MenuItem from './menu-item/menu-item.vue'
  import MenuSub from './menu-sub/menu-sub.vue'
  import MenuSubContent from './menu-sub-content/menu-sub-content.vue'
  import MenuSubTrigger from './menu-sub-trigger/menu-sub-trigger.vue'
  import { MENU_LEVEL_EXIT_MS } from './presets/transitions'

  defineOptions({
    name: 'Menu',
    inheritAttrs: false
  })

  interface Props {
    groups?: MenuGroupNode[]
    activeId?: string
    enterOnMount?: boolean
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    groups: () => [],
    activeId: '',
    enterOnMount: false,
    ariaLabel: 'Menu'
  })

  const emit = defineEmits<{
    navigate: [event: globalThis.MouseEvent, node: MenuNode]
    'update:path': [value: string[]]
    'update:expanded': [value: string[]]
  }>()

  const path = defineModel<string[]>('path', { default: () => [] })

  const expandedModel = defineModel<string[]>('expanded', { default: () => [] })

  const slots = defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu')
  const role = computed(() => (attrs['role'] as string | undefined) ?? 'navigation')

  const ariaLabelAttr = computed(() =>
    role.value === 'presentation' || role.value === 'none' ? undefined : props.ariaLabel
  )

  const hasGroups = computed(() => props.groups.length > 0)
  const hasContent = computed(() => hasGroups.value || Boolean(slots.default))

  const rootClass = computed(() =>
    cn('relative flex w-full flex-col', attrs.class as string | undefined)
  )

  const labels = ref<Record<string, string>>({})
  const triggers = new Map<string, globalThis.HTMLElement | null>()
  const motion = ref<MenuMotion>('none')
  const leaving = ref<string[]>([])
  const backEl = shallowRef<globalThis.HTMLElement | null>(null)
  const levelHost = shallowRef<globalThis.HTMLElement | null>(null)
  const backHost = shallowRef<globalThis.HTMLElement | null>(null)

  let motionTimer: ReturnType<typeof globalThis.setTimeout> | undefined

  const levels = computed<MenuLevel[]>(() =>
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

  const push = (level: MenuLevel, trigger: globalThis.HTMLElement | null) => {
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
    backHost.value = el
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

  provide(MenuInjectionKey, {
    levels,
    motion: computed(() => motion.value),
    enterOnMount: computed(() => props.enterOnMount),
    levelHost,
    isCurrentLevel,
    isLevelMounted,
    push,
    registerLevel,
    pop,
    setBackElement,
    backHost,
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
    if (event.key !== 'Escape' && event.key !== 'ArrowLeft') return
    if (path.value.length === 0) return
    event.preventDefault()
    pop()
  }

  const renderNode = (node: MenuNode): VNode => {
    const children = node.children ?? []
    const isDrill = (node.kind ?? 'inline') === 'drill'
    const levelGroups = isDrill ? node.groups : undefined

    if (children.length === 0 && !levelGroups?.length) {
      return h(MenuItem, {
        key: node.id,
        label: node.label,
        icon: node.icon ?? '',
        href: node.href ?? '',
        target: node.target ?? '_self',
        tagValue: node.tagValue,
        disabled: node.disabled ?? false,
        selected: props.activeId !== '' && node.id === props.activeId,
        onClick: (event: globalThis.MouseEvent) => emit('navigate', event, node)
      })
    }

    return h(
      MenuSub,
      {
        key: node.id,
        'data-node-id': node.id,
        defaultOpen: node.defaultOpen ?? false
      },
      {
        default: () => [
          h(MenuSubTrigger, {
            label: node.label,
            kind: node.kind ?? 'inline',
            icon: node.icon ?? '',
            href: node.href ?? '',
            disabled: node.disabled ?? false,
            onClick: (event: globalThis.MouseEvent) => emit('navigate', event, node)
          }),
          h(MenuSubContent, null, {
            default: () =>
              isDrill
                ? (levelGroups ?? [{ items: children }]).map(renderGroup)
                : children.map(renderNode)
          })
        ]
      }
    )
  }

  const renderGroup = (group: MenuGroupNode, index: number): VNode =>
    h(
      MenuGroup,
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
    v-if="hasContent"
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
      ref="levelHost"
      :data-testid="`${testId}__levels`"
      class="flex w-full flex-col"
    />
  </div>
</template>
