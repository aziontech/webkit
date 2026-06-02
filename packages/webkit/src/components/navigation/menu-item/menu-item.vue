<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { cn } from '../../../utils/cn'
  import Tag from '../../tag/tag.vue'

  export type MenuItemKind = 'option' | 'group'
  export type MenuItemTagSeverity =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'accent'

  defineOptions({
    name: 'MenuItem',
    inheritAttrs: false
  })

  interface Props {
    /** Structural variant: navigable row or section overline label. */
    kind?: MenuItemKind
    /** Visible label for the row or group header. */
    label?: string
    /** When true, applies the selected surface on option rows. */
    selected?: boolean
    /** Disables interaction on option rows. */
    disabled?: boolean
    /** PrimeIcons class for the leading icon (option kind only). */
    icon?: string
    /** Destination URL; renders an anchor when set on option rows. */
    href?: string
    /** Link target when `href` is set. */
    target?: '_self' | '_blank'
    /** Short text rendered in a trailing Tag when set. */
    tagValue?: string
    /** Severity token for the optional trailing Tag. */
    tagSeverity?: MenuItemTagSeverity
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'option',
    label: 'Option 1',
    selected: false,
    disabled: false,
    icon: 'pi pi-home',
    href: '',
    target: '_self',
    tagValue: undefined,
    tagSeverity: 'info'
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  defineSlots<{
    default(): unknown
    tag(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-item'
  )

  const isOption = computed(() => props.kind === 'option')
  const isGroup = computed(() => props.kind === 'group')
  const isAnchor = computed(() => isOption.value && Boolean(props.href) && !props.disabled)
  const showTag = computed(
    () => isOption.value && (Boolean(props.tagValue) || Boolean(slots['tag']))
  )

  const sharedRowClasses = [
    'relative flex w-full shrink-0 items-center',
    'rounded-[var(--shape-button)] transition-colors motion-reduce:transition-none',
    'pl-[var(--spacing-xxs)] pr-[var(--spacing-xs)] py-[var(--spacing-xxs)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]'
  ]

  const optionRowClasses = computed(() =>
    cn(
      sharedRowClasses,
      'h-9 gap-[var(--spacing-xs)]',
      props.selected
        ? 'bg-[var(--bg-surface-raised)] text-[var(--text-default)]'
        : 'text-[var(--text-default)] hover:bg-[var(--bg-hover)]',
      props.disabled && 'pointer-events-none text-[var(--text-disabled)] hover:bg-transparent',
      attrs.class
    )
  )

  const groupRowClasses = computed(() =>
    cn(sharedRowClasses, 'h-7 text-[var(--text-muted)]', attrs.class)
  )

  const iconBoxClasses = 'flex size-8 shrink-0 items-center justify-center overflow-hidden'

  const iconClasses = 'size-4 shrink-0 leading-none text-[length:inherit]'

  const handleClick = (event: MouseEvent) => {
    if (props.disabled || isGroup.value) {
      event.preventDefault()
      return
    }

    emit('click', event)
  }
</script>

<template>
  <li
    v-if="isOption"
    :class="optionRowClasses"
    :data-selected="selected ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-testid="testId"
  >
    <a
      v-if="isAnchor"
      :href="href"
      :target="target"
      :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
      class="flex min-h-9 w-full items-center gap-[var(--spacing-xs)]"
      :aria-current="selected ? 'page' : undefined"
      :aria-disabled="disabled || undefined"
      :tabindex="disabled ? -1 : undefined"
      :data-testid="`${testId}__link`"
      @click="handleClick"
    >
      <span
        :class="iconBoxClasses"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      >
        <i
          v-if="icon"
          :class="[icon, iconClasses]"
          aria-hidden="true"
        />
      </span>
      <span
        class="min-w-0 flex-1 truncate text-label-md"
        :data-testid="`${testId}__label`"
      >
        <slot>{{ label }}</slot>
      </span>
      <span
        v-if="showTag"
        class="shrink-0"
        :data-testid="`${testId}__tag`"
      >
        <slot name="tag">
          <Tag
            :value="tagValue"
            :severity="tagSeverity"
            rounded
          />
        </slot>
      </span>
    </a>
    <button
      v-else
      type="button"
      class="flex min-h-9 w-full items-center gap-[var(--spacing-xs)]"
      :aria-current="selected ? 'page' : undefined"
      :aria-disabled="disabled || undefined"
      :disabled="disabled"
      :data-testid="`${testId}__button`"
      @click="handleClick"
    >
      <span
        :class="iconBoxClasses"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      >
        <i
          v-if="icon"
          :class="[icon, iconClasses]"
          aria-hidden="true"
        />
      </span>
      <span
        class="min-w-0 flex-1 truncate text-left text-label-md"
        :data-testid="`${testId}__label`"
      >
        <slot>{{ label }}</slot>
      </span>
      <span
        v-if="showTag"
        class="shrink-0"
        :data-testid="`${testId}__tag`"
      >
        <slot name="tag">
          <Tag
            :value="tagValue"
            :severity="tagSeverity"
            rounded
          />
        </slot>
      </span>
    </button>
  </li>
  <div
    v-else-if="isGroup"
    :class="groupRowClasses"
    role="presentation"
    :data-testid="testId"
  >
    <span
      class="min-w-0 flex-1 truncate text-overline-xs"
      :data-testid="`${testId}__label`"
    >
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>
