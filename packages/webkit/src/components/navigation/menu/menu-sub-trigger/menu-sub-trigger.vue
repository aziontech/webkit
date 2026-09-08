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

  // Emitted by the LINK only; declared rather than left to `$attrs` fallthrough, which would fire for the arrow too.
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

  // With `href` set the label is a LINK and the arrow alone reveals the children; with none, the label reveals them too.
  const hasReference = computed(() => props.href.length > 0)

  // Only a DRILL row may carry a glyph — an inline row heads the rows it expands, in their own column.
  const showIcon = computed(() => Boolean(props.icon) && !isInline.value)

  // Names the arrow: an inline arrow names the disclosure state, a drill arrow names the level it opens.
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

  // Reads as a MENU ROW at the rows' own size and colour — a group title alone is smaller and muted.
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

  // Borrows the menu's ring offset instead of IconButton's own; `!` overrides IconButton's own utilities.
  const ARROW_CLASS =
    'focus-visible:ring-offset-1! focus-visible:ring-offset-[var(--menu-ring-offset,var(--bg-canvas))]!'

  // A disabled arrow paints NO fill — IconButton's filled disabled box made it the brightest thing on a dead row.
  const ARROW_DISABLED_CLASS = 'bg-transparent!'

  const MOTION_CLASS =
    'transition-transform duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none motion-reduce:transform-none'

  // Colour goes through `iconClass` on the `i` itself, not the button's class — two colour utilities on one list resolve by stylesheet order.
  const arrowIconClass = computed(() =>
    cn(
      MOTION_CLASS,
      // Disabled ink, not muted — must dim with the row's own label.
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

  // Focus returns to whichever control revealed the children on leaving.
  const register = () => {
    const target = hasReference.value
      ? ((arrowEl.value?.$el as globalThis.HTMLElement | null) ?? null)
      : labelEl.value
    sub.registerTrigger(props.kind, props.label, target)
  }

  onMounted(register)
  watch([() => props.kind, () => props.label, hasReference], register)

  // The link announces its activation only — it never reveals the children.
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
  <!-- ONE anatomy: a box holding a LABEL control and an ARROW IconButton; href decides what the LABEL does, never the arrow's shape. -->
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-state="sub.open.value ? 'open' : 'closed'"
    :data-disabled="disabled ? '' : undefined"
    :class="rowClass"
  >
    <!-- A LINK when the row has a destination, a BUTTON otherwise — component :is on a data prop, never an as string. -->
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
      <!-- Same label treatment as a Menu.Item, colour inherited from the control; the smaller,
           muted treatment is reserved for a first-level group title, never a trigger. -->
      <span
        class="min-w-0 flex-1 truncate text-left text-label-md"
        :data-testid="`${testId}__label`"
      >
        <slot>{{ label }}</slot>
      </span>
    </component>
    <!-- aria-expanded/aria-controls live on whichever control expands the children; a redundant arrow leaves the tab order and a11y tree. -->
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
