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
   * Ids of the inline subs currently expanded. The ROOT owns this, not each sub, for two
   * reasons: a consumer whose shell remounts on navigation can persist it and hand it back,
   * and expansion is a property of the menu as a whole — one sub opening must not disturb
   * another, which is exactly what per-sub local state cannot guarantee across a remount.
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
   * The name goes with the role. A presentational element takes no accessible name — ARIA
   * prohibits it and the a11y tree drops it — so a menu whose host owns the landmark
   * (`Sidebar` is a `<nav>`) would otherwise carry a label naming nothing.
   */
  const ariaLabelAttr = computed(() =>
    role.value === 'presentation' || role.value === 'none' ? undefined : props.ariaLabel
  )

  const hasGroups = computed(() => props.groups.length > 0)
  const hasContent = computed(() => hasGroups.value || Boolean(slots.default))

  const rootClass = computed(() =>
    cn('relative flex w-full flex-col', attrs.class as string | undefined)
  )

  // ---- drill stack -------------------------------------------------------------
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
   * A level names itself when its trigger mounts, so the stack does not depend on the push that
   * would normally have supplied the label. That matters for a `v-model:path` seeded from
   * outside — the case where a consumer persists the stack so a level survives the host
   * remounting — which reaches this component as state with no activation behind it.
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
    // Focus follows the view: the pushed level starts at its Back button.
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

  // ---- expansion ---------------------------------------------------------------
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
   * The state this menu mounts with was RESTORED, not travelled to — the consumer persisted
   * `path` so the view could survive the host remounting. Whether that arrival should look like
   * an entrance is something only the consumer knows: travelling between levels and navigating
   * *within* one both remount the host and both restore the same stack, so they are
   * indistinguishable from here. `enterOnMount` is that answer; without it the menu renders in
   * place, because replaying the entrance on every navigation inside a level reads as the menu
   * re-opening under someone who never left it.
   */
  onMounted(() => {
    if (!props.enterOnMount) return
    // The DIRECTION falls out of the restored stack rather than being a second thing to pass: a
    // menu that mounts inside a level was travelled INTO (push), and one that mounts at the root
    // was travelled BACK to (pop) — the rail arriving is as much an entrance as a level is.
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

  // ---- data-driven mode --------------------------------------------------------
  // The tree is recursive, so it is built with `h` and rendered through the very same
  // sub-components a hand-composed menu uses.
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
            // Honoured for a drill row only; an inline trigger heads the rows beneath it and
            // leaves the icon column to them, which `MenuSubTrigger` itself enforces.
            icon: node.icon ?? '',
            // The node's own destination, and the thing that decides the row's anatomy: with an
            // `href` the row is a link plus an arrow that reveals the children; without one the
            // WHOLE ROW reveals them. A container that is not a destination — which is most of
            // them — therefore behaves exactly as it did before the split existed.
            href: node.href ?? '',
            disabled: node.disabled ?? false,
            // Fires from the LINK only, so it cannot fire for a row that has nowhere to go.
            // Revealing the children emits nothing either way: that is a move inside the menu,
            // not a navigation.
            onClick: (event: globalThis.MouseEvent) => emit('navigate', event, node)
          }),
          h(MenuSubContent, null, {
            // A drilled level is a container so it can hold groups like the root: given
            // `groups` it renders them through the very same path the root uses, and given
            // only `children` it wraps them in one unlabeled group to supply the list an
            // inline level would have been. An inline level IS the list, so rows go in bare.
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
    <!-- The slot renders alongside a data-driven tree, not instead of it: a `Menu.Back`
         is the one row a `groups` consumer still has to place by hand, and without this
         a drilled level would have no pointer route back. It comes first so Back sits
         above the rows it returns from. -->
    <slot />
    <component
      v-for="(tree, index) in groupTrees"
      :is="tree"
      :key="index"
    />
    <!--
      Deliberately NOT positioned. The host sits after the groups, so a level that is out of
      flow must resolve its `top-0` against the menu ROOT (which is `relative`) — against the
      host it would hang below the groups instead of overlaying them, and a level sliding out
      would trail underneath the menu that replaced it. The CURRENT level stays in flow here,
      so it still gives the menu its height.
    -->
    <div
      ref="levelHost"
      :data-testid="`${testId}__levels`"
      class="flex w-full flex-col"
    />
  </div>
</template>
