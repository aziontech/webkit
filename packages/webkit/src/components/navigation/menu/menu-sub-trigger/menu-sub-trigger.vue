<script setup lang="ts">
  import {
    type ComponentPublicInstance,
    computed,
    onMounted,
    shallowRef,
    useAttrs,
    watch
  } from 'vue'

  import { cn } from '../../../../utils/cn'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
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

  /**
   * Declared rather than left to `$attrs` fallthrough. The row's root is a BOX holding two
   * controls, so a fallthrough listener would sit on that box and fire for the arrow too —
   * revealing the children would also trigger the consumer's navigation. Declaring it ties the
   * event to the control that means it: the label, and only the label.
   */
  const emit = defineEmits<{
    click: [event: globalThis.MouseEvent]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const sub = useMenuSubContext()
  const attrs = useAttrs()
  const arrowEl = shallowRef<ComponentPublicInstance | null>(null)

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

  /**
   * Names the arrow, since the glyph alone says nothing. An inline arrow names the state it
   * moves to (it is a disclosure, and `aria-expanded` says where it is); a drill arrow opens a
   * level, which is not a state of this row.
   */
  const arrowAriaLabel = computed(() => {
    const name = props.label
    if (!isInline.value) return name ? `Open ${name} menu` : 'Open submenu'
    if (sub.open.value) return name ? `Collapse ${name}` : 'Collapse'
    return name ? `Expand ${name}` : 'Expand'
  })

  const arrowIcon = computed(() => (isInline.value ? 'pi pi-chevron-down' : 'pi pi-chevron-right'))

  /**
   * The row is TWO controls, so it needs a box to hold them, and the box is not interactive.
   * The label references wherever the row points; the arrow reveals its children — expanding
   * them in place for an inline row, pushing a level for a drill one. One cannot nest inside
   * the other (a button may not contain a button), and the split is the point: a row that owns
   * children is still a destination, and reaching its children must not cost the reader that
   * destination.
   */
  const ROW_CLASS =
    'relative flex h-8 w-full shrink-0 items-center gap-(--spacing-xxs) pr-(--spacing-xxs)'

  // The label control reads as a MENU ROW, at the rows' own size and colour. Only a first-level
  // group title is allowed to be smaller and muted; from there every row is 14px, a trigger
  // included — a row that owns children is still a row.
  const REFERENCE_CLASS =
    'group relative flex h-8 min-w-0 flex-1 shrink-0 items-center gap-(--spacing-xs) ' +
    'rounded-(--shape-elements) pr-(--spacing-xs) py-(--spacing-xxs) text-left ' +
    'text-(--text-default) ' +
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance " +
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-(--bg-active) after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance " +
    'hover:before:opacity-100 active:after:opacity-100 ' +
    'motion-reduce:before:transition-none motion-reduce:after:transition-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--menu-ring-offset,var(--bg-canvas))] ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled) data-[disabled]:before:hidden data-[disabled]:after:hidden'

  /**
   * The arrow borrows the menu's ring offset instead of `IconButton`'s own (`offset-2` against
   * `--bg-canvas`): `Sidebar` sets `--menu-ring-offset` to its own surface, and a 2px offset on
   * a control this close to the rail edge collides with it. Both carry `!` on purpose — they
   * conflict with utilities `IconButton` puts in the same class list, and a plain class would be
   * resolved by stylesheet order rather than by which one was passed last.
   */
  const ARROW_CLASS =
    'focus-visible:ring-offset-1! focus-visible:ring-offset-[var(--menu-ring-offset,var(--bg-canvas))]!'

  /**
   * A disabled arrow paints NO fill. `IconButton`'s disabled state is a filled `--bg-disabled`
   * box, which is right for a standalone button and wrong here: it made the arrow the brightest
   * thing on a row whose own label had dimmed to disabled ink, so the one row you cannot use
   * drew more attention than its neighbours. `!` because it overrides a utility `IconButton`
   * puts in the same class list, where stylesheet order would otherwise decide.
   */
  const ARROW_DISABLED_CLASS = 'bg-transparent!'

  /**
   * The glyph is muted like every other chevron in the menu, and an inline one rotates to face
   * the state it is in. It goes through `iconClass` — onto the `i` itself — rather than the
   * button's class: `IconButton`'s `transparent` kind sets `text-(--text-default)` on the root,
   * and two colour utilities in one class list are settled by stylesheet order, not source order.
   */
  const ARROW_ICON_CLASS =
    'transition-transform duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none motion-reduce:transform-none'

  const arrowIconClass = computed(() =>
    cn(
      ARROW_ICON_CLASS,
      // Disabled ink, not muted: the glyph has to dim with the row's own label, or it reads as
      // the one live thing on a dead row.
      props.disabled ? 'text-(--text-disabled)' : 'text-(--text-muted)',
      isInline.value && sub.open.value && 'rotate-180'
    )
  )

  const arrowClass = computed(() => cn(ARROW_CLASS, props.disabled && ARROW_DISABLED_CLASS))

  // Same box and glyph as `Menu.Item`, so the two land on the menu's one content column: the
  // 32px box supplies the inset and the glyph's centring carries it the rest of the way.
  const ICON_BOX_CLASS = 'flex size-8 shrink-0 items-center justify-center overflow-hidden'

  const iconClass = computed(() =>
    cn(
      props.icon,
      'size-4 shrink-0 leading-none text-[length:inherit]',
      props.disabled
        ? 'text-(--text-disabled)'
        : 'text-(--text-muted) group-hover:text-(--text-default) group-focus-visible:text-(--text-default)'
    )
  )

  const rowClass = computed(() => cn(ROW_CLASS, attrs.class as string | undefined))

  const referenceClass = computed(() =>
    cn(
      REFERENCE_CLASS,
      // The menu's ONE content column (`--spacing-sm`): a group title's text, an icon-bearing
      // row's glyph and an icon-less row's label all start on it.
      showIcon.value ? 'pl-(--spacing-xxs)' : 'pl-(--spacing-sm)'
    )
  )

  /**
   * The element focus returns to when this sub is left behind: the ARROW, the control that
   * revealed the children, not the label beside it, which goes somewhere else.
   */
  const register = () => {
    sub.registerTrigger(
      props.kind,
      props.label,
      (arrowEl.value?.$el as globalThis.HTMLElement | null) ?? null
    )
  }

  onMounted(register)
  watch([() => props.kind, () => props.label], register)

  /**
   * The label is a REFERENCE: it announces its activation and nothing else. It does not reveal
   * the children — the arrow does — so a consumer can route to wherever the row points without
   * the menu moving out from under the reader.
   */
  const activate = (event: globalThis.MouseEvent) => {
    if (props.disabled) return
    emit('click', event)
  }

  /** The arrow: expand in place, or push the level. */
  const reveal = () => {
    if (props.disabled) return
    if (isInline.value) sub.toggle()
    else sub.push()
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (props.disabled) return

    if (event.key === 'ArrowRight') {
      // Kept on the label as well as on the arrow: the arrow keys are how a keyboard reader
      // reaches the children without leaving the row, which is the whole point of them here.
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
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-state="sub.open.value ? 'open' : 'closed'"
    :data-disabled="disabled ? '' : undefined"
    :class="rowClass"
  >
    <button
      :id="sub.triggerId"
      type="button"
      :data-testid="`${testId}__reference`"
      :data-disabled="disabled ? '' : undefined"
      :aria-disabled="disabled || undefined"
      :disabled="disabled"
      :class="referenceClass"
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
    </button>
    <!--
      `aria-expanded` / `aria-controls` sit HERE, on the control that actually expands the
      children — not on the label, which expands nothing. A drill arrow carries neither: it
      replaces the view rather than expanding one, so the attribute would be a lie.
    -->
    <IconButton
      ref="arrowEl"
      :icon="arrowIcon"
      kind="transparent"
      size="small"
      :ariaLabel="arrowAriaLabel"
      :aria-expanded="isInline ? sub.open.value : undefined"
      :aria-controls="isInline ? sub.contentId : undefined"
      :disabled="disabled"
      :class="arrowClass"
      :icon-class="arrowIconClass"
      :data-testid="`${testId}__arrow`"
      @click="reveal"
      @keydown="onKeydown"
    />
  </div>
</template>
