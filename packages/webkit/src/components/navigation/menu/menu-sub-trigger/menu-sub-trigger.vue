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
    /** Destination of the row itself. Set it and the row splits into a link plus an arrow that reveals the children; leave it empty and the whole row reveals them. */
    href?: string
    /** Blocks toggling and pushing. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    kind: 'inline',
    icon: '',
    href: '',
    disabled: false
  })

  /**
   * Emitted by the LINK only, so it fires only where the row actually has a destination.
   * Declared rather than left to `$attrs` fallthrough: in the split shape the root is a box
   * holding two controls, and a fallthrough listener would sit on that box and fire for the
   * arrow too — revealing the children would also trigger the consumer's navigation.
   */
  const emit = defineEmits<{
    click: [event: globalThis.MouseEvent]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const sub = useMenuSubContext()
  const attrs = useAttrs()
  const labelEl = shallowRef<globalThis.HTMLElement | null>(null)
  const arrowEl = shallowRef<ComponentPublicInstance | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-sub-trigger'
  )

  const isInline = computed(() => props.kind === 'inline')

  /**
   * The one decision that shapes this component — and it changes the LABEL, never the arrow.
   * The arrow is always a real `IconButton`: it is the affordance that says "this row owns
   * children", and it looks the same on every row whether or not the row is a destination.
   * What `href` decides is what the label beside it does, and therefore how much of the row
   * reveals the children:
   *
   * - **It has an `href`** — the label is a LINK to that destination, and the arrow alone
   *   reveals the children. Reaching them must not cost the reader the destination.
   * - **It has none** — the label REVEALS the children too, so the whole row does. There is no
   *   destination to protect, and leaving the 28px arrow as the only live target is 7% of the
   *   row's area with the other 93% doing nothing: on a phone that reads as a broken menu.
   *
   * `href` is the signal rather than a boolean, because it is the same data every other row in
   * this menu uses to say where it goes, and it makes the behaviour fall out of the tree in
   * data-driven mode.
   */
  const hasReference = computed(() => props.href.length > 0)

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

  /** The box that holds the row's two controls. Not interactive itself. */
  const ROW_CLASS =
    'relative flex h-8 w-full shrink-0 items-center gap-(--spacing-xxs) pr-(--spacing-xxs)'

  // Reads as a MENU ROW, at the rows' own size and colour. Only a first-level group title is
  // allowed to be smaller and muted; from there every row is 14px, a trigger included — a row
  // that owns children is still a row.
  const CONTROL_CLASS =
    'group relative flex h-8 shrink-0 items-center gap-(--spacing-xs) ' +
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
   * drew more attention than its neighbours.
   */
  const ARROW_DISABLED_CLASS = 'bg-transparent!'

  const MOTION_CLASS =
    'transition-transform duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none motion-reduce:transform-none'

  /**
   * The glyph colour goes through `iconClass` — onto the `i` itself — rather than the button's
   * class: `IconButton`'s `transparent` kind sets `text-(--text-default)` on the root, and two
   * colour utilities in one class list are settled by stylesheet order, not source order.
   */
  const arrowIconClass = computed(() =>
    cn(
      MOTION_CLASS,
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

  // The menu's ONE content column (`--spacing-sm`): a group title's text, an icon-bearing
  // row's glyph and an icon-less row's label all start on it.
  const contentColumnClass = computed(() =>
    showIcon.value ? 'pl-(--spacing-xxs)' : 'pl-(--spacing-sm)'
  )

  const rowClass = computed(() => cn(ROW_CLASS, attrs.class as string | undefined))

  /** The label control fills whatever the arrow leaves, in both shapes. */
  const labelClass = computed(() => cn(CONTROL_CLASS, 'min-w-0 flex-1', contentColumnClass.value))

  /**
   * The element focus returns to when this sub is left behind: whichever control revealed the
   * children — the arrow when it is the only one that does, the label when it does too.
   */
  const register = () => {
    const target = hasReference.value
      ? ((arrowEl.value?.$el as globalThis.HTMLElement | null) ?? null)
      : labelEl.value
    sub.registerTrigger(props.kind, props.label, target)
  }

  onMounted(register)
  watch([() => props.kind, () => props.label, hasReference], register)

  /**
   * The link announces its activation and nothing else — it does not reveal the children, so a
   * consumer can route to wherever the row points without the menu moving under the reader.
   */
  const activate = (event: globalThis.MouseEvent) => {
    if (props.disabled) return
    emit('click', event)
  }

  /** Reveal the children: expand in place, or push the level. */
  const reveal = () => {
    if (props.disabled) return
    if (isInline.value) sub.toggle()
    else sub.push()
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (props.disabled) return

    if (event.key === 'ArrowRight') {
      // Kept on the link as well as on the arrow: the arrow keys are how a keyboard reader
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
  <!--
    ONE anatomy for every row that owns children: a box holding a LABEL control and an ARROW.
    The arrow is always a real `IconButton` — it is the affordance that says the row owns
    children, and it should not change shape depending on whether the row also has a
    destination. `href` decides what the LABEL does, which is what decides how much of the row
    reveals the children. Nesting is not an option either way (neither an anchor nor a button
    may contain a button), so the row itself is never the control.
  -->
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-state="sub.open.value ? 'open' : 'closed'"
    :data-disabled="disabled ? '' : undefined"
    :class="rowClass"
  >
    <!--
      A LINK when the row has its own destination, a BUTTON that reveals the children when it
      does not — `<component :is>` on a data prop, per root-element.md, never an `as` string.
    -->
    <component
      :is="hasReference ? 'a' : 'button'"
      ref="labelEl"
      :id="sub.triggerId"
      :type="hasReference ? undefined : 'button'"
      :href="hasReference && !disabled ? href : undefined"
      :disabled="hasReference ? undefined : disabled || undefined"
      :tabindex="disabled && hasReference ? -1 : undefined"
      :aria-expanded="!hasReference && isInline ? sub.open.value : undefined"
      :aria-controls="!hasReference && isInline ? sub.contentId : undefined"
      :aria-disabled="disabled || undefined"
      :data-testid="`${testId}__${hasReference ? 'reference' : 'control'}`"
      :data-disabled="disabled ? '' : undefined"
      :class="labelClass"
      @click="hasReference ? activate($event) : reveal()"
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
        control. `.text-label-sm` + `--text-muted` is reserved for a first-level group title.
      -->
      <span
        class="min-w-0 flex-1 truncate text-left text-label-md"
        :data-testid="`${testId}__label`"
      >
        <slot>{{ label }}</slot>
      </span>
    </component>
    <!--
      `aria-expanded` / `aria-controls` live on whichever control expands the children, and only
      one of them ever carries them. When the label is a link the arrow is the disclosure, so it
      owns them. When the label already reveals, the arrow is a REDUNDANT pointer affordance for
      the same action: it leaves the tab order and the accessibility tree (`tabindex="-1"` +
      `aria-hidden`) rather than announcing a second control for one thing. A drill arrow never
      carries `aria-expanded` — it replaces the view rather than expanding one.
    -->
    <IconButton
      ref="arrowEl"
      :icon="arrowIcon"
      kind="transparent"
      size="small"
      :ariaLabel="arrowAriaLabel"
      :aria-expanded="hasReference && isInline ? sub.open.value : undefined"
      :aria-controls="hasReference && isInline ? sub.contentId : undefined"
      :aria-hidden="hasReference ? undefined : 'true'"
      :tabindex="hasReference ? undefined : -1"
      :disabled="disabled"
      :class="arrowClass"
      :icon-class="arrowIconClass"
      :data-testid="`${testId}__arrow`"
      @click="reveal"
    />
  </div>
</template>
