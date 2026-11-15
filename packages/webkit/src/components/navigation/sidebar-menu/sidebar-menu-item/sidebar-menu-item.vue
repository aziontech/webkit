<script setup lang="ts">
  import { computed, type FunctionalComponent, inject, useAttrs, useSlots } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { directionalIconClass } from '../../../../utils/directional-icons'
  import Tag from '../../../content/tag/tag.vue'
  import { SidebarInjectionKey } from '../../../layout/sidebar/injection-key'

  /** Status colour of the trailing Tag. */
  export type SidebarMenuItemTagSeverity = 'neutral' | 'success' | 'info' | 'warning' | 'danger'

  /** Brand look of the trailing Tag. */
  export type SidebarMenuItemTagVariant = 'primary' | 'accent'

  defineOptions({
    name: 'SidebarMenuItem',
    inheritAttrs: false
  })

  interface Props {
    /** Visible label of the row. */
    label?: string
    /** Marks the row as the page you are on: applies the selected surface and `aria-current`. */
    active?: boolean
    /** Disables interaction. */
    disabled?: boolean
    /** Azion icon class for the leading icon. */
    icon?: string
    /** Destination URL; renders an anchor when set. */
    href?: string
    /** Link target when `href` is set. */
    target?: '_self' | '_blank'
    /** Short text rendered in a trailing Tag when set. */
    tagValue?: string
    /** Brand look of the optional trailing Tag, used when `tagSeverity` is not set. */
    tagVariant?: SidebarMenuItemTagVariant
    /** Status colour of the optional trailing Tag; wins over `tagVariant`. With neither set the Tag is `info`. */
    tagSeverity?: SidebarMenuItemTagSeverity
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    active: false,
    disabled: false,
    icon: '',
    href: '',
    target: '_self',
    tagValue: '',
    tagVariant: undefined,
    tagSeverity: undefined
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
  const sidebar = inject(SidebarInjectionKey, null)

  const forwardedAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-sidebar-menu-item'
  )

  const isAnchor = computed(() => Boolean(props.href) && !props.disabled)
  const rail = computed(() => sidebar?.rail === true)
  const showTag = () => !rail.value && (Boolean(props.tagValue) || Boolean(slots['tag']))

  const Passthrough: FunctionalComponent = (_, { slots: inner }) => inner['default']?.()

  const tip = computed(() =>
    rail.value && sidebar?.tooltip
      ? {
          is: sidebar.tooltip,
          props: { content: props.label, placement: sidebar?.tooltipPlacement ?? 'right' }
        }
      : { is: Passthrough, props: {} }
  )

  const INTERACTIVE_CLASS =
    'group relative flex h-8 w-full shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-control) pe-(--spacing-xs) py-(--spacing-2xs) ps-(--spacing-sm) data-[icon]:ps-(--spacing-2xs) text-(--text-default) transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--menu-item-ring-offset,var(--bg-canvas))] not-data-[active]:hover:bg-(--bg-hover) not-data-[active]:focus-visible:bg-(--bg-hover) data-[active]:bg-(--bg-selected) data-[disabled]:pointer-events-none data-[disabled]:text-(--text-disabled) data-[disabled]:hover:bg-transparent data-[disabled]:focus-visible:bg-transparent data-[rail]:size-8 data-[rail]:justify-center data-[rail]:p-0!'

  const ICON_CLASS =
    'size-4 shrink-0 leading-none text-[length:inherit] text-(--text-muted) group-hover:text-(--text-default) group-focus-visible:text-(--text-default) group-data-[active]:text-(--text-default) group-data-[disabled]:text-(--text-disabled)'

  const handleClick = (event: MouseEvent) => {
    if (props.disabled) {
      event.preventDefault()
      return
    }

    emit('click', event, { label: props.label, href: props.href })
  }
</script>

<template>
  <li
    v-bind="forwardedAttrs"
    :class="
      cn(
        'relative w-full shrink-0 data-[rail]:flex data-[rail]:justify-center data-[rail]:not-data-[icon]:hidden',
        attrs.class as string | undefined
      )
    "
    :data-active="active ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-rail="rail ? '' : undefined"
    :data-icon="icon ? '' : undefined"
    :data-testid="testId"
  >
    <component
      :is="tip.is"
      v-bind="tip.props"
    >
      <a
        v-if="isAnchor"
        :href="href"
        :target="target"
        :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
        :class="INTERACTIVE_CLASS"
        :data-active="active ? '' : undefined"
        :data-disabled="disabled ? '' : undefined"
        :data-icon="icon ? '' : undefined"
        :data-rail="rail ? '' : undefined"
        :aria-current="active ? 'page' : undefined"
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
          :data-rail="rail ? '' : undefined"
          class="min-w-0 flex-1 truncate text-label-md data-[rail]:sr-only"
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
              :variant="tagVariant"
              :severity="tagSeverity ?? (tagVariant ? undefined : 'info')"
              rounded
            />
          </slot>
        </span>
      </a>
      <button
        v-else
        type="button"
        :class="INTERACTIVE_CLASS"
        :data-active="active ? '' : undefined"
        :data-disabled="disabled ? '' : undefined"
        :data-icon="icon ? '' : undefined"
        :data-rail="rail ? '' : undefined"
        :aria-current="active ? 'page' : undefined"
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
          :data-rail="rail ? '' : undefined"
          class="min-w-0 flex-1 truncate text-start text-label-md data-[rail]:sr-only"
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
              :variant="tagVariant"
              :severity="tagSeverity ?? (tagVariant ? undefined : 'info')"
              rounded
            />
          </slot>
        </span>
      </button>
    </component>
  </li>
</template>
