<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { directionalIconClass } from '../../../../utils/directional-icons'
  import Tag from '../../../content/tag/tag.vue'

  export type MenuItemKind = 'option' | 'group'
  export type MenuItemTagSeverity =
    'primary' | 'neutral' | 'success' | 'info' | 'warning' | 'danger' | 'accent'

  defineOptions({
    name: 'MenuItem',
    inheritAttrs: false
  })

  interface Props {
    /**
     * Structural variant: navigable row or section overline label.
     * @deprecated since 6.0 — kind group: use the Menu.Group label. Removed in 7.0.
     */
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
    label: '',
    selected: false,
    disabled: false,
    icon: '',
    href: '',
    target: '_self',
    tagValue: '',
    tagSeverity: 'info'
  })

  const emit = defineEmits<{
    click: [event: MouseEvent, item: { label: string; href: string }]
  }>()

  defineSlots<{
    default(): unknown
    tag(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const forwardedAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu-item'
  )

  const isOption = computed(() => props.kind === 'option')
  const isGroup = computed(() => props.kind === 'group')
  const isAnchor = computed(() => isOption.value && Boolean(props.href) && !props.disabled)
  const showTag = () => isOption.value && (Boolean(props.tagValue) || Boolean(slots['tag']))

  const INTERACTIVE_CLASS =
    'group relative flex h-8 w-full shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) pe-(--spacing-xs) py-(--spacing-xxs) ps-(--spacing-sm) data-[icon]:ps-(--spacing-xxs) text-(--text-default) transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--menu-item-ring-offset,var(--bg-canvas))] not-data-[selected]:hover:bg-(--bg-hover) not-data-[selected]:focus-visible:bg-(--bg-hover) data-[selected]:bg-(--bg-selected) data-[disabled]:pointer-events-none data-[disabled]:text-(--text-disabled) data-[disabled]:hover:bg-transparent data-[disabled]:focus-visible:bg-transparent'

  const ICON_CLASS =
    'size-4 shrink-0 leading-none text-[length:inherit] text-(--text-muted) group-hover:text-(--text-default) group-focus-visible:text-(--text-default) group-data-[selected]:text-(--text-default) group-data-[disabled]:text-(--text-disabled)'

  const handleClick = (event: MouseEvent) => {
    if (props.disabled || isGroup.value) {
      event.preventDefault()
      return
    }

    emit('click', event, { label: props.label, href: props.href })
  }
</script>

<template>
  <li
    v-if="isOption"
    v-bind="forwardedAttrs"
    :class="cn('relative w-full shrink-0', attrs.class as string | undefined)"
    :data-selected="selected ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-testid="testId"
  >
    <a
      v-if="isAnchor"
      :href="href"
      :target="target"
      :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
      :class="INTERACTIVE_CLASS"
      :data-selected="selected ? '' : undefined"
      :data-disabled="disabled ? '' : undefined"
      :data-icon="icon ? '' : undefined"
      :aria-current="selected ? 'page' : undefined"
      :aria-disabled="disabled || undefined"
      :tabindex="disabled ? -1 : undefined"
      :data-testid="`${testId}__link`"
      @click="handleClick"
    >
      <span
        v-if="icon"
        class="flex size-8 shrink-0 items-center justify-center overflow-hidden"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      >
        <i
          :class="[icon, directionalIconClass(icon), ICON_CLASS]"
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
        v-if="showTag()"
        class="shrink-0"
        :data-testid="`${testId}__tag`"
      >
        <slot name="tag">
          <Tag
            :label="tagValue"
            :severity="tagSeverity"
            rounded
          />
        </slot>
      </span>
    </a>
    <button
      v-else
      type="button"
      :class="INTERACTIVE_CLASS"
      :data-selected="selected ? '' : undefined"
      :data-disabled="disabled ? '' : undefined"
      :data-icon="icon ? '' : undefined"
      :aria-current="selected ? 'page' : undefined"
      :aria-disabled="disabled || undefined"
      :disabled="disabled"
      :data-testid="`${testId}__button`"
      @click="handleClick"
    >
      <span
        v-if="icon"
        class="flex size-8 shrink-0 items-center justify-center overflow-hidden"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      >
        <i
          :class="[icon, directionalIconClass(icon), ICON_CLASS]"
          aria-hidden="true"
        />
      </span>
      <span
        class="min-w-0 flex-1 truncate text-start text-label-md"
        :data-testid="`${testId}__label`"
      >
        <slot>{{ label }}</slot>
      </span>
      <span
        v-if="showTag()"
        class="shrink-0"
        :data-testid="`${testId}__tag`"
      >
        <slot name="tag">
          <Tag
            :label="tagValue"
            :severity="tagSeverity"
            rounded
          />
        </slot>
      </span>
    </button>
  </li>
  <li
    v-else-if="isGroup"
    v-bind="forwardedAttrs"
    :class="
      cn(
        'relative flex h-7 w-full shrink-0 items-center rounded-(--shape-elements) ps-(--spacing-xxs) pe-(--spacing-xs) py-(--spacing-xxs) text-(--text-muted)',
        attrs.class as string | undefined
      )
    "
    role="presentation"
    :data-testid="testId"
  >
    <span
      class="min-w-0 flex-1 truncate text-overline-xs"
      :data-testid="`${testId}__label`"
    >
      <slot>{{ label }}</slot>
    </span>
  </li>
</template>
