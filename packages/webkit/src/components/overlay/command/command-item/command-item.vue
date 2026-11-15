<script setup lang="ts">
  import {
    Comment,
    computed,
    inject,
    onBeforeUnmount,
    onMounted,
    ref,
    Text,
    toRef,
    useAttrs,
    useId,
    useSlots,
    type VNode
  } from 'vue'

  import Kbd, { type KbdKeyName } from '../../../content/kbd/kbd.vue'
  import { matchCommand, splitByRanges } from '../command-match'
  import {
    CommandGroupInjectionKey,
    type CommandItemValue,
    CommandPageInjectionKey,
    useCommandMenuContext
  } from '../injection-key'

  defineOptions({
    name: 'CommandItem',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
    leading(): unknown
    trailing(): unknown
  }>()

  export interface CommandItemProps {
    /** Identifier emitted on the root `select` event when this item is activated. */
    value: CommandItemValue
    /** Disables interaction; the item is skipped by roving navigation and never activates. */
    disabled?: boolean
    /** Extra search terms matched as substrings of the query; never shown. */
    keywords?: string[]
    /** Name of a Command.Page this item opens instead of selecting. */
    page?: string
    /** A `'+'`-delimited shortcut hint (e.g. `'meta+d'`) rendered on the right via `Kbd`. Display only. */
    shortcut?: string
  }

  const props = withDefaults(defineProps<CommandItemProps>(), {
    disabled: false,
    keywords: () => [],
    page: '',
    shortcut: ''
  })

  const attrs = useAttrs()
  const ctx = useCommandMenuContext()
  const groupId = inject(CommandGroupInjectionKey, null)
  const itemPage = inject(CommandPageInjectionKey, '')
  const slots = useSlots()

  const itemId = useId()
  const rootEl = ref<HTMLElement | null>(null)
  const labelEl = ref<HTMLElement | null>(null)
  const itemText = ref(String(props.value))

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__item`
  )

  const match = computed(() =>
    matchCommand(ctx.query.value, itemText.value, [String(props.value), ...props.keywords])
  )

  const isVisible = computed(() => ctx.page.value === itemPage && match.value.score > 0)

  const order = computed(() => (ctx.ranking.value ? Math.round((1 - match.value.score) * 1000) : 0))

  function plainLabel(nodes: VNode[]): string | null {
    let text = ''
    for (const node of nodes) {
      if (node.type === Comment) continue
      if (node.type !== Text || typeof node.children !== 'string') return null
      text += node.children
    }
    return text.trim()
  }

  function labelParts() {
    if (!ctx.ranking.value) return null
    const label = plainLabel(slots['default']?.() ?? [])
    if (!label) return null
    const { ranges } = matchCommand(ctx.query.value, label)
    return ranges.length ? splitByRanges(label, ranges) : null
  }

  const active = computed(() => ctx.activeValue.value === props.value)

  const NAMED_KEYS: Record<string, KbdKeyName> = {
    esc: 'escape',
    escape: 'escape',
    enter: 'enter',
    return: 'enter',
    space: 'space',
    tab: 'tab',
    backspace: 'backspace',
    delete: 'delete',
    del: 'delete',
    up: 'arrowUp',
    down: 'arrowDown',
    left: 'arrowLeft',
    right: 'arrowRight'
  }
  const shortcutHint = computed(() => {
    const tokens = props.shortcut
      .toLowerCase()
      .split('+')
      .map((token) => token.trim())
      .filter(Boolean)
    if (!tokens.length) return null
    const last = tokens.at(-1) ?? ''
    const modifiers = tokens.slice(0, -1)
    const keyName: KbdKeyName | undefined = NAMED_KEYS[last]
    return {
      keyName,
      key: keyName ? '' : last.toUpperCase(),
      meta: modifiers.includes('meta'),
      ctrl: modifiers.includes('ctrl'),
      shift: modifiers.includes('shift'),
      alt: modifiers.includes('alt')
    }
  })

  function activate(event: globalThis.MouseEvent | globalThis.KeyboardEvent) {
    if (props.disabled) return
    if (props.page) ctx.pushPage(props.page)
    else ctx.select(event, props.value)
  }

  const disabledRef = toRef(props, 'disabled')
  let unregister: (() => void) | null = null

  onMounted(() => {
    itemText.value = labelEl.value?.textContent?.trim() || String(props.value)
    unregister = ctx.registerItem({
      value: props.value,
      id: itemId,
      groupId,
      disabled: disabledRef,
      isVisible,
      order,
      el: rootEl,
      activate
    })
  })

  onBeforeUnmount(() => {
    unregister?.()
  })
</script>

<template>
  <div
    ref="rootEl"
    v-show="isVisible"
    :id="itemId"
    v-bind="attrs"
    role="option"
    tabindex="-1"
    :aria-selected="active"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :data-active="active || undefined"
    :data-disabled="disabled || undefined"
    :style="ctx.ranking.value ? { order } : undefined"
    class="flex min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-2xs) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none data-[active]:bg-(--bg-selected) data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled)"
    @click="!disabled && activate($event)"
    @keydown.enter.prevent="!disabled && activate($event)"
    @keydown.space.prevent="!disabled && activate($event)"
    @mouseenter="!disabled && ctx.setActive(value)"
  >
    <span
      v-if="$slots['leading']"
      :data-testid="`${testId}__leading`"
      class="flex size-4 shrink-0 items-center justify-center overflow-hidden"
    >
      <slot name="leading" />
    </span>

    <span
      ref="labelEl"
      class="flex-1 truncate text-start"
    >
      <template
        v-for="parts in [labelParts()]"
        :key="'label'"
      >
        <template v-if="parts">
          <template
            v-for="(part, index) in parts"
            :key="index"
          >
            <mark
              v-if="part.match"
              :data-testid="`${testId}__match`"
              class="bg-transparent font-semibold text-inherit"
              >{{ part.text }}</mark
            >
            <template v-else>{{ part.text }}</template>
          </template>
        </template>
        <slot v-else />
      </template>
    </span>

    <Kbd
      v-if="shortcutHint"
      :meta="shortcutHint.meta"
      :ctrl="shortcutHint.ctrl"
      :shift="shortcutHint.shift"
      :alt="shortcutHint.alt"
      :key-name="shortcutHint.keyName"
      size="small"
      >{{ shortcutHint.key }}</Kbd
    >
    <span
      v-else-if="$slots['trailing']"
      class="flex shrink-0 items-center"
    >
      <slot name="trailing" />
    </span>
    <i
      v-else-if="page"
      :data-testid="`${testId}__page`"
      class="ai ai-chevron-right shrink-0 text-label-sm text-(--text-muted) rtl:-scale-x-100"
      aria-hidden="true"
    />
  </div>
</template>
