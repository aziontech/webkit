<script setup lang="ts">
  import { computed, onMounted, shallowRef, useAttrs, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useMenuSubContext } from '../composables/use-menu-sub-context'
  import type { MenuSubKind } from '../injection-key'

  defineOptions({
    name: 'MenuSubTrigger',
    inheritAttrs: false
  })

  interface Props {
    /** Visible row text. */
    label?: string
    /** Whether the children expand in place or replace the menu. */
    kind?: MenuSubKind
    /** Leading glyph class. Only a drill row takes one; an inline row heads the rows beneath it and leaves the column to them. */
    icon?: string
    /** Blocks toggling and pushing. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    kind: 'inline',
    icon: '',
    disabled: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const sub = useMenuSubContext()
  const attrs = useAttrs()
  const buttonEl = shallowRef<globalThis.HTMLButtonElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-sub-trigger'
  )

  const isInline = computed(() => props.kind === 'inline')

  /**
   * Only a DRILL row may carry a glyph, and the component enforces that rather than trusting
   * the caller: an INLINE row heads the rows it expands beneath it, in their own column, so a
   * glyph there competes with the rows it owns. A drill row has nothing beneath it — it
   * replaces the menu — so it sits amongst the leaves it is listed with and takes an icon for
   * the same reason they do.
   */
  const showIcon = computed(() => Boolean(props.icon) && !isInline.value)

  // Reads as a MENU ROW, at the rows' own size and colour. Only a first-level group title is
  // allowed to be smaller and muted; from there every row is 14px, a trigger included — a row
  // that owns children is still a row. The chevron sits on the trailing edge.
  const ROOT_CLASS =
    'group relative flex h-8 w-full shrink-0 items-center gap-[var(--spacing-xs)] ' +
    'rounded-[var(--shape-elements)] pr-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-left ' +
    'text-[var(--text-default)] ' +
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[var(--bg-hover)] before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance " +
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[var(--bg-active)] after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance " +
    'hover:before:opacity-100 active:after:opacity-100 ' +
    'motion-reduce:before:transition-none motion-reduce:after:transition-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--menu-ring-offset,var(--bg-canvas))] ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--text-disabled)] data-[disabled]:before:hidden data-[disabled]:after:hidden'

  // The chevron is a trailing affordance, not part of the icon column, so it keeps its own
  // smaller size. `text-label-sm` is the token that gets it there without a raw text-* class.
  const CHEVRON_CLASS = 'size-3 shrink-0 leading-none text-label-sm text-[var(--text-muted)]'

  // Same box and glyph as `Menu.Item`, so the two land on the menu's one content column: the
  // 32px box supplies the inset and the glyph's centring carries it the rest of the way.
  const ICON_BOX_CLASS = 'flex size-8 shrink-0 items-center justify-center overflow-hidden'

  const iconClass = computed(() =>
    cn(
      props.icon,
      'size-4 shrink-0 leading-none text-[length:inherit]',
      props.disabled
        ? 'text-[var(--text-disabled)]'
        : 'text-[var(--text-muted)] group-hover:text-[var(--text-default)] group-focus-visible:text-[var(--text-default)]'
    )
  )

  const rootClass = computed(() =>
    cn(
      ROOT_CLASS,
      // The menu's ONE content column (`--spacing-sm`): a group title's text, an icon-bearing
      // row's glyph and an icon-less row's label all start on it.
      showIcon.value ? 'pl-[var(--spacing-xxs)]' : 'pl-[var(--spacing-sm)]',
      attrs.class as string | undefined
    )
  )

  const register = () => {
    sub.registerTrigger(props.kind, props.label, buttonEl.value)
  }

  onMounted(register)
  watch([() => props.kind, () => props.label], register)

  const activate = () => {
    if (props.disabled) return
    if (isInline.value) sub.toggle()
    else sub.push()
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (props.disabled) return

    if (event.key === 'ArrowRight') {
      if (!isInline.value) {
        event.preventDefault()
        sub.push()
        return
      }
      if (!sub.open.value) {
        event.preventDefault()
        sub.setOpen(true)
      }
      return
    }

    if (event.key === 'ArrowLeft' && isInline.value && sub.open.value) {
      event.preventDefault()
      // The root pops a drill level on ArrowLeft; collapsing this sub wins over that.
      event.stopPropagation()
      sub.setOpen(false)
    }
  }
</script>

<template>
  <button
    ref="buttonEl"
    v-bind="$attrs"
    :id="sub.triggerId"
    type="button"
    :data-testid="testId"
    :data-kind="kind"
    :data-state="sub.open.value ? 'open' : 'closed'"
    :data-disabled="disabled ? '' : undefined"
    :aria-expanded="isInline ? sub.open.value : undefined"
    :aria-controls="isInline ? sub.contentId : undefined"
    :aria-disabled="disabled || undefined"
    :disabled="disabled"
    :class="rootClass"
    @click="activate"
    @keydown="onKeydown"
  >
    <!-- Drill rows only, and only when given one — see `showIcon`. -->
    <span
      v-if="showIcon"
      :class="ICON_BOX_CLASS"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    >
      <i
        :class="iconClass"
        aria-hidden="true"
      />
    </span>
    <!--
      The same label treatment as a `Menu.Item`: `.text-label-md`, colour inherited from the
      root (`--text-default`, and the disabled token). `.text-label-sm` + `--text-muted` is
      reserved for a first-level group title — the thing that replaced the overline — and is
      not spent on a trigger, however deep it sits.
    -->
    <span
      class="min-w-0 flex-1 truncate text-left text-label-md"
      :data-testid="`${testId}__label`"
    >
      <slot>{{ label }}</slot>
    </span>
    <i
      v-if="isInline"
      :class="CHEVRON_CLASS"
      class="pi pi-chevron-down transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]:rotate-180 motion-reduce:transition-none motion-reduce:transform-none"
      aria-hidden="true"
      :data-testid="`${testId}__chevron`"
    />
    <i
      v-else
      :class="CHEVRON_CLASS"
      class="pi pi-chevron-right"
      aria-hidden="true"
      :data-testid="`${testId}__chevron`"
    />
  </button>
</template>
