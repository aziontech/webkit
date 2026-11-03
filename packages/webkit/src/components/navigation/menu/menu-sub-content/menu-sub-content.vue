<script setup lang="ts">
  import {
    type ComponentPublicInstance,
    computed,
    nextTick,
    ref,
    shallowRef,
    useAttrs,
    watch
  } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useMenuContext } from '../composables/use-menu-context'
  import { useMenuSubContext } from '../composables/use-menu-sub-context'
  import {
    collapseHeightOnEnter,
    collapseHeightOnLeave,
    getMenuLevelTransitionStyle,
    MENU_LEVEL_ENTER_MS
  } from '../presets/transitions'

  defineOptions({
    name: 'MenuSubContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = useMenuContext()
  const sub = useMenuSubContext()
  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-sub-content'
  )

  const isDrill = computed(() => sub.kind.value === 'drill')
  const isCurrent = computed(() => ctx.isCurrentLevel(sub.id))
  const isMounted = computed(() => ctx.isLevelMounted(sub.id))

  const wasRestored = ref(isMounted.value)
  watch(isMounted, (mounted) => {
    if (!mounted) wasRestored.value = false
  })

  const canTeleport = computed(() => isDrill.value && ctx.levelHost.value !== null)

  const ready = ref(false)

  watch(
    canTeleport,
    (on) => {
      if (!on || ready.value) return
      nextTick(() => {
        ready.value = true
      })
    },
    { immediate: true }
  )

  const enterFromClass = computed(() =>
    wasRestored.value && !ctx.enterOnMount.value
      ? ''
      : 'motion-safe:translate-x-full! motion-safe:opacity-0'
  )

  const motion = computed(() => {
    const levels = ctx.levels.value
    const index = levels.findIndex((level) => level.id === sub.id)
    if (index === -1) return ctx.motion.value
    return index >= levels.length - 2 ? ctx.motion.value : 'none'
  })

  const INLINE_CLASS =
    'relative m-0 flex w-full list-none flex-col p-0 ' +
    '[--menu-indent:calc(var(--spacing-sm)+var(--spacing-xs))] ' +
    '[--menu-rail-x:var(--spacing-sm)] ' +
    'pl-(--menu-indent) ' +
    '[&>li]:relative ' +
    "[&>li]:before:pointer-events-none [&>li]:before:absolute [&>li]:before:top-0 [&>li]:before:left-[calc(var(--menu-rail-x)-var(--menu-indent))] [&>li]:before:h-4 [&>li]:before:w-[calc(var(--menu-indent)-var(--menu-rail-x))] [&>li]:before:rounded-bl-(--shape-elements) [&>li]:before:border-b [&>li]:before:border-l [&>li]:before:border-(--border-default) [&>li]:before:content-[''] " +
    "[&>li]:after:pointer-events-none [&>li]:after:absolute [&>li]:after:top-4 [&>li]:after:bottom-0 [&>li]:after:left-[calc(var(--menu-rail-x)-var(--menu-indent))] [&>li]:after:w-0 [&>li]:after:border-l [&>li]:after:border-(--border-default) [&>li]:after:content-[''] " +
    '[&>li:last-child]:after:hidden'

  const DRILL_CLASS =
    'relative z-10 flex w-full flex-col ' +
    'data-[motion=push]:bg-[var(--menu-slide-surface,var(--bg-surface))] ' +
    'data-[motion=pop]:bg-[var(--menu-slide-surface,var(--bg-surface))] ' +
    'data-[state=open]:translate-x-0 ' +
    'data-[state=closed]:z-0 ' +
    'data-[state=closed]:absolute data-[state=closed]:inset-x-0 data-[state=closed]:top-0 ' +
    'data-[state=closed]:-translate-x-full ' +
    'data-[state=closed]:data-[motion=pop]:translate-x-full ' +
    'data-[state=closed]:opacity-0 ' +
    'data-[state=closed]:motion-reduce:hidden ' +
    'motion-reduce:transition-none motion-reduce:transform-none'

  const inlineClass = computed(() => cn(INLINE_CLASS, attrs.class as string | undefined))
  const drillClass = computed(() => cn(DRILL_CLASS, attrs.class as string | undefined))

  const levelStyle = computed(() =>
    getMenuLevelTransitionStyle(isCurrent.value ? 'enter' : 'leave')
  )

  const anchorEl = shallowRef<globalThis.HTMLElement | null>(null)

  const backAnchor = (el: globalThis.Element | ComponentPublicInstance | null) => {
    const node = el as globalThis.HTMLElement | null
    anchorEl.value = node
    if (node === null) {
      if (ctx.backHost.value?.dataset['levelId'] === sub.id) ctx.setBackHost(null)
    } else if (isCurrent.value) {
      ctx.setBackHost(node)
    }
  }

  watch(isCurrent, (current) => {
    if (current && anchorEl.value) ctx.setBackHost(anchorEl.value)
  })
</script>

<template>
  <Teleport
    v-if="canTeleport"
    :to="ctx.levelHost.value"
  >
    <Transition
      :enter-from-class="enterFromClass"
      :duration="{ enter: MENU_LEVEL_ENTER_MS, leave: 0 }"
    >
      <div
        v-if="isMounted && ready"
        v-bind="$attrs"
        :id="sub.contentId"
        role="group"
        :data-testid="testId"
        :data-kind="sub.kind.value"
        :data-state="isCurrent ? 'open' : 'closed'"
        :data-motion="motion"
        :data-level="sub.level"
        :aria-label="sub.label.value || undefined"
        :aria-hidden="isCurrent ? undefined : 'true'"
        :inert="isCurrent ? undefined : true"
        :class="drillClass"
        :style="levelStyle"
      >
        <div
          :ref="backAnchor"
          :data-level-id="sub.id"
          :data-testid="`${testId}__back-host`"
        />
        <slot />
      </div>
    </Transition>
  </Teleport>
  <Transition
    v-else-if="!isDrill"
    :css="false"
    @enter="collapseHeightOnEnter"
    @leave="collapseHeightOnLeave"
  >
    <ul
      v-if="sub.open.value"
      v-bind="$attrs"
      :id="sub.contentId"
      :data-testid="testId"
      :data-kind="sub.kind.value"
      :data-state="sub.open.value ? 'open' : 'closed'"
      :data-level="sub.level"
      :aria-labelledby="sub.triggerId"
      :class="inlineClass"
    >
      <slot />
    </ul>
  </Transition>
</template>
