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
    /** Data-driven navigation tree; each entry renders through Menu.Group and its items through Menu.Item / Menu.Sub. Composes with the default slot rather than replacing it. */
    groups?: MenuGroupNode[]
    /** Id of the node rendered as selected in data-driven mode. */
    activeId?: string
    /** Plays the level entrance when the stack is already populated at mount, for a restored stack whose arrival is an entrance rather than a move inside a level the user was already in. */
    enterOnMount?: boolean
    /** Accessible name for the navigation region. */
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

  /** Drill stack as ancestor node ids, outermost first. Empty at the root level. */
  const path = defineModel<string[]>('path', { default: () => [] })

  /**
   * Ids of the expanded inline subs. The ROOT owns this so a consumer whose shell remounts
   * can persist and hand it back, and so one sub opening cannot disturb another — per-sub
   * local state guarantees neither across a remount.
   */
  const expandedModel = defineModel<string[]>('expanded', { default: () => [] })

  const slots = defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu')
  /** The host may already be a landmark, so the consumer can suppress the role. */
  const role = computed(() => (attrs['role'] as string | undefined) ?? 'navigation')

  /**
   * The name goes with the role: ARIA prohibits an accessible name on a presentational
   * element (the a11y tree drops it), so a menu whose host owns the landmark gets no label.
   */
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
  /** Ids kept in the DOM after leaving the stack, so their slide-out can play. */
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

  /**
   * A level names itself when its trigger mounts, so the stack does not depend on a push
   * having supplied the label — a `v-model:path` seeded from outside reaches this component
   * as state with no activation behind it.
   */
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
    // Focus follows the view: the pushed level starts at its Back row.
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

  /** Seeded once per id, so a sub's `defaultOpen` cannot fight the consumer's own state. */
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

  /**
   * A mount with a populated stack was RESTORED. Only the consumer can tell an entrance from
   * navigation within a level (both remount and restore the same stack) — `enterOnMount` is
   * that answer; without it the menu renders in place instead of replaying the entrance.
   */
  onMounted(() => {
    if (!props.enterOnMount) return
    // Direction falls out of the restored stack: mounting inside a level was travelled INTO
    // (push); mounting at the root was travelled BACK to (pop).
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

  // Recursive tree: built with `h`, rendered through the same sub-components a hand-composed
  // menu uses.
  const renderNode = (node: MenuNode): VNode => {
    const children = node.children ?? []
    const isDrill = (node.kind ?? 'inline') === 'drill'
    // `groups` describes a drill level the same way it describes the root, so a node
    // carrying only groups is still a sub — not a leaf.
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
        // Hands the real node id to the sub so the drill stack carries node ids.
        'data-node-id': node.id,
        defaultOpen: node.defaultOpen ?? false
      },
      {
        default: () => [
          h(MenuSubTrigger, {
            label: node.label,
            kind: node.kind ?? 'inline',
            // Honoured for a drill row only — MenuSubTrigger itself enforces it.
            icon: node.icon ?? '',
            disabled: node.disabled ?? false,
            // A drill row is a DESTINATION as well as a level: it announces its activation so
            // the consumer can route to the level's landing page while the level opens. An
            // inline row only toggles — not a navigation — so it emits nothing.
            ...(isDrill
              ? { onClick: (event: globalThis.MouseEvent) => emit('navigate', event, node) }
              : {})
          }),
          h(MenuSubContent, null, {
            // Given `groups` a drilled level renders them like the root; given only `children`
            // it wraps them in one unlabeled group. An inline level IS the list, so rows go in bare.
            default: () =>
              isDrill
                ? (levelGroups ?? [{ items: children }]).map(renderGroup)
                : children.map(renderNode)
          })
        ]
      }
    )
  }

  /** One group, wherever it sits — the root's own list or a drilled level's. */
  const renderGroup = (group: MenuGroupNode, index: number): VNode =>
    h(
      MenuGroup,
      { key: group.label ?? index, label: group.label ?? '' },
      { default: () => group.items.map(renderNode) }
    )

  const groupTrees = computed<VNode[]>(() => props.groups.map(renderGroup))
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
    <!-- The slot renders alongside a data-driven tree: Menu.Back is the one row a `groups`
         consumer still places by hand, and without it a drilled level has no pointer route
         back. It comes first so Back sits above the rows it returns from. -->
    <slot />
    <component
      v-for="(tree, index) in groupTrees"
      :is="tree"
      :key="index"
    />
    <!-- Deliberately NOT positioned: an out-of-flow level must resolve its top offset against
         the menu ROOT — against this host it would hang below the groups instead of overlaying
         them. The CURRENT level stays in flow here, so it still gives the menu its height. -->
    <div
      ref="levelHost"
      :data-testid="`${testId}__levels`"
      class="flex w-full flex-col"
    />
  </div>
</template>
