<script setup lang="ts">
  import { defaultWindow, useEventListener, useResizeObserver } from '@vueuse/core'
  import { computed, type FunctionalComponent, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Kbd from '../../content/kbd/kbd.vue'
  import { isShortcutClaimed } from '../../overlay/command/shortcut-registry'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  defineOptions({ name: 'SearchTrigger', inheritAttrs: false })

  interface Props {
    /** Visible muted text and accessible name; empty uses the catalog's `Search`. */
    label?: string
    /** Key that opens search with ⌘ or Ctrl: drawn in the keycap, announced through `aria-keyshortcuts` and bound on the window unless a mounted `Command` already listens for it; empty removes all three. */
    shortcut?: string
    /** Folds to the magnifier alone while the nearest container is narrower than 47rem (752px, the `--container-2xl` token); the label stays the accessible name and shows as a tooltip on hover and focus. */
    collapsible?: boolean
    /** Disables the button and its shortcut; `open` is not emitted. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    shortcut: 'K',
    collapsible: false,
    disabled: false
  })

  const emit = defineEmits<{
    open: [event: MouseEvent | KeyboardEvent]
  }>()

  const attrs = useAttrs()

  const { t } = useTranslate({ searchTrigger: en.searchTrigger })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'actions-search-trigger'
  )

  const resolvedLabel = computed(() => props.label || t('searchTrigger.label'))

  const buttonRef = ref<HTMLButtonElement | null>(null)
  const labelRef = ref<HTMLElement | null>(null)
  const folded = ref(true)

  useResizeObserver(buttonRef, () => {
    folded.value = (labelRef.value?.getClientRects().length ?? 0) === 0
  })

  const Bare: FunctionalComponent = (_, { slots }) => slots['default']?.()

  const keyShortcuts = computed(() => {
    const key = props.shortcut.trim().toUpperCase()
    return key ? `Meta+${key} Control+${key}` : undefined
  })

  function onClick(event: MouseEvent) {
    if (props.disabled) return
    emit('open', event)
  }

  useEventListener(defaultWindow, 'keydown', (event: globalThis.KeyboardEvent) => {
    const key = props.shortcut.trim().toLowerCase()
    if (!key || props.disabled || event.defaultPrevented) return
    if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return
    if (event.key.toLowerCase() !== key || isShortcutClaimed(`meta+${key}`)) return
    event.preventDefault()
    emit('open', event)
  })
</script>

<template>
  <component
    :is="collapsible ? Tooltip : Bare"
    v-bind="
      collapsible
        ? {
            text: resolvedLabel,
            placement: 'bottom',
            disabled: disabled || !folded,
            'data-testid': `${testId}__tooltip`
          }
        : {}
    "
  >
    <button
      ref="buttonRef"
      type="button"
      v-bind="$attrs"
      :data-testid="testId"
      :data-collapsible="collapsible ? 'true' : 'false'"
      :data-disabled="disabled ? '' : undefined"
      :disabled="disabled"
      :aria-keyshortcuts="keyShortcuts"
      :class="attrs.class"
      class="group/search-trigger relative inline-flex h-8 w-56 min-w-0 shrink cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-start text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none enabled:[&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:bg-(--bg-disabled) data-[collapsible=true]:w-8 data-[collapsible=true]:shrink-0 data-[collapsible=true]:justify-center data-[collapsible=true]:px-0 data-[collapsible=true]:@2xl:w-56 data-[collapsible=true]:@2xl:shrink data-[collapsible=true]:@2xl:justify-start data-[collapsible=true]:@2xl:px-(--spacing-sm)"
      @click="onClick"
    >
      <span
        class="inline-flex shrink-0 items-center justify-center text-(--text-muted) group-disabled/search-trigger:text-(--text-disabled)"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      >
        <i class="pi pi-search" />
      </span>
      <span
        class="sr-only"
        :data-testid="`${testId}__name`"
        >{{ resolvedLabel }}</span
      >
      <span
        ref="labelRef"
        aria-hidden="true"
        class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted) group-disabled/search-trigger:text-(--text-disabled) group-data-[collapsible=true]/search-trigger:hidden group-data-[collapsible=true]/search-trigger:@2xl:inline"
        :data-testid="`${testId}__label`"
        >{{ resolvedLabel }}</span
      >
      <Kbd
        v-if="keyShortcuts"
        meta
        size="small"
        aria-hidden="true"
        :data-testid="`${testId}__shortcut`"
        class="shrink-0 group-data-[collapsible=true]/search-trigger:hidden group-data-[collapsible=true]/search-trigger:@2xl:inline-flex"
        >{{ shortcut.trim().toUpperCase() }}</Kbd
      >
      <span
        aria-hidden="true"
        data-slot="touch-target"
        class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
      />
    </button>
  </component>
</template>
