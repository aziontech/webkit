<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, useAttrs, useId, useSlots, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { safeHref } from '../../../../utils/safe-href'
  import { useDropdownContext } from '../composables/use-dropdown-context'
  import type { DropdownMenuItemType } from '../injection-key'
  import { DropdownMenuGroupInjectionKey } from '../injection-key'

  export type DropdownMenuItemTarget = '_self' | '_blank'

  defineOptions({
    name: 'DropdownMenuItem',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
    leading(): unknown
    trailing(): unknown
  }>()

  export interface DropdownMenuItemProps {
    /** Identifier emitted on the root select event when this option is activated. */
    value: string | number
    /** Plain-text label; falls back to the default slot when omitted. */
    label?: string
    /**
     * Keyboard-shortcut hint rendered on the trailing side. A shared window listener
     * matches the shortcut and emits `select` for this option. Mutually exclusive with
     * the trailing slot.
     */
    command?: string
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the option as checked: a radio-style check on a default option, the check or dot on a checkbox or radio option. */
    selected?: boolean
    /** Destination URL; the option renders as a link that still emits select. */
    href?: string
    /** Where the link opens; `_blank` adds `rel="noopener noreferrer"`, the external-link glyph and the new-tab hint. */
    target?: DropdownMenuItemTarget
    /** Secondary line under the label, cut at two lines; set, the row grows to fit both lines. */
    description?: string
    /** Item role: a plain action that closes the menu, or a checkbox or radio item that keeps it open. */
    type?: DropdownMenuItemType
  }

  const props = withDefaults(defineProps<DropdownMenuItemProps>(), {
    label: '',
    command: '',
    disabled: false,
    selected: false,
    href: '',
    target: '_self',
    description: '',
    type: 'default'
  })

  const attrs = useAttrs()
  const slots = useSlots()
  const ctx = useDropdownContext()
  const inGroup = inject(DropdownMenuGroupInjectionKey, false)
  const { t } = useTranslate({ common: en.common })
  const uid = useId()
  const labelId = `${uid}-label`
  const descriptionId = `${uid}-description`

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'dropdown-menu-item'
  )

  const hasCommand = computed(() => props.command.length > 0)
  const linkHref = computed(() => safeHref(props.href))
  const isLink = computed(() => linkHref.value !== null && !props.disabled)
  const newTab = computed(() => isLink.value && props.target === '_blank')
  const hasDescription = computed(() => props.description.length > 0)
  const hasLeading = () => Boolean(slots['leading'])
  const hasTrailing = () => Boolean(slots['trailing'])

  const checkable = computed(() => props.type !== 'default')

  const role = computed(() =>
    props.type === 'checkbox'
      ? 'menuitemcheckbox'
      : props.type === 'radio' || props.selected
        ? 'menuitemradio'
        : 'menuitem'
  )

  const ariaChecked = computed<'true' | 'false' | undefined>(() => {
    if (checkable.value) return props.selected ? 'true' : 'false'
    return props.selected ? 'true' : undefined
  })

  function activate(event: globalThis.MouseEvent | globalThis.KeyboardEvent) {
    if (props.disabled) return
    ctx.selectOption(props.value, event, !checkable.value)
  }

  function onClick(event: globalThis.MouseEvent) {
    activate(event)
  }

  function onPointerenter() {
    ctx.setActiveSub(null, true)
  }

  function onFocus() {
    ctx.setActiveSub(null)
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (event.key === 'Enter' && isLink.value) return
    if (event.key === ' ' && isLink.value) {
      event.preventDefault()
      ;(event.currentTarget as globalThis.HTMLElement | null)?.click()
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate(event)
    }
  }

  let unregisterCommand: (() => void) | null = null

  watch(
    () => [props.command, props.disabled] as const,
    ([command, disabled]) => {
      unregisterCommand?.()
      unregisterCommand = null
      if (command && !disabled) {
        unregisterCommand = ctx.registerCommand(command, (event) => activate(event))
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    unregisterCommand?.()
  })

  const ROOT_CLASS =
    'flex h-8 min-h-8 pointer-coarse:min-h-11 cursor-pointer select-none items-center gap-(--spacing-xs) rounded-(--shape-button) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 px-(--spacing-sm) py-(--spacing-2xs) text-label-sm text-(--text-default) no-underline outline-none transition-colors duration-150 ease-out ' +
    'motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) ' +
    'data-[type=default]:data-[selected]:bg-(--bg-selected) ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled) ' +
    'data-[ungrouped]:mx-(--spacing-2xs) ' +
    'data-[description]:h-auto data-[description]:items-start data-[description]:py-(--spacing-xs)'
</script>

<template>
  <Teleport
    v-if="inGroup || ctx.panelBodyEl.value"
    :to="ctx.panelBodyEl.value ?? 'body'"
    :disabled="inGroup"
  >
    <component
      :is="isLink ? 'a' : 'div'"
      v-bind="attrs"
      :href="isLink ? (linkHref ?? undefined) : undefined"
      :target="isLink && target === '_blank' ? '_blank' : undefined"
      :rel="newTab ? 'noopener noreferrer' : undefined"
      :role="role"
      tabindex="-1"
      :aria-checked="ariaChecked"
      :aria-disabled="disabled || undefined"
      :aria-labelledby="hasDescription ? labelId : undefined"
      :aria-describedby="hasDescription ? descriptionId : undefined"
      :data-testid="testId"
      :data-type="type"
      :data-selected="selected || null"
      :data-disabled="disabled || null"
      :data-ungrouped="inGroup ? null : ''"
      :data-description="hasDescription || null"
      :class="ROOT_CLASS"
      @click="onClick"
      @keydown="onKeydown"
      @pointerenter="onPointerenter"
      @focus="onFocus"
    >
      <span
        v-if="checkable"
        aria-hidden="true"
        :data-testid="`${testId}__indicator`"
        class="flex size-4 shrink-0 items-center justify-center"
      >
        <i
          v-if="type === 'checkbox' && selected"
          class="az az-check text-[length:inherit] leading-none"
        />
        <span
          v-else-if="type === 'radio' && selected"
          class="size-1.5 rounded-full bg-current"
        />
      </span>

      <span
        v-if="hasLeading()"
        :data-testid="`${testId}__leading`"
        class="flex shrink-0 items-center"
      >
        <slot name="leading" />
      </span>

      <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) text-start">
        <span
          :id="labelId"
          class="truncate in-data-[description]:line-clamp-2 in-data-[description]:whitespace-normal"
          ><slot>{{ label }}</slot
          ><span
            v-if="newTab"
            class="sr-only"
            >{{ ' ' }}{{ t('common.newTab') }}</span
          ></span
        >
        <span
          v-if="hasDescription"
          :id="descriptionId"
          :data-testid="`${testId}__description`"
          class="line-clamp-2 text-body-xs text-(--text-muted)"
          >{{ description }}</span
        >
      </span>

      <span
        v-if="hasTrailing() && !hasCommand"
        :data-testid="`${testId}__trailing`"
        class="flex shrink-0 items-center"
      >
        <slot name="trailing" />
      </span>

      <span
        v-else-if="hasCommand"
        :data-testid="`${testId}__command`"
        class="flex shrink-0 items-center text-label-sm text-(--text-muted)"
      >
        {{ command }}
      </span>

      <i
        v-else-if="newTab"
        :data-testid="`${testId}__external`"
        class="az az-external-link shrink-0 text-body-xs text-(--text-muted)"
        aria-hidden="true"
      />

      <i
        v-if="selected && !checkable"
        :data-testid="`${testId}__check`"
        class="az az-check shrink-0 text-body-xs text-(--text-default)"
        aria-hidden="true"
      />
    </component>
  </Teleport>
</template>
