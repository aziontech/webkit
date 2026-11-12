<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Kbd from '../../content/kbd/kbd.vue'

  defineOptions({ name: 'SearchTrigger', inheritAttrs: false })

  interface Props {
    /** Visible muted text and accessible name; empty uses the catalog's `Search`. */
    label?: string
    /** Key drawn after the platform modifier in the keycap and announced through `aria-keyshortcuts`; empty hides the keycap. */
    shortcut?: string
    /** Folds to the magnifier alone below the nearest container's `2xl` size; the label stays the accessible name. */
    collapsible?: boolean
    /** Disables the button; `click` is not emitted. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    shortcut: 'K',
    collapsible: false,
    disabled: false
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const attrs = useAttrs()

  const { t } = useTranslate({ searchTrigger: en.searchTrigger })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'actions-search-trigger'
  )

  const resolvedLabel = computed(() => props.label || t('searchTrigger.label'))

  const keyShortcuts = computed(() => {
    const key = props.shortcut.trim().toUpperCase()
    return key ? `Meta+${key} Control+${key}` : undefined
  })

  function onClick(event: MouseEvent) {
    if (props.disabled) return
    emit('click', event)
  }
</script>

<template>
  <button
    type="button"
    v-bind="$attrs"
    :data-testid="testId"
    :data-collapsible="collapsible ? 'true' : 'false'"
    :data-disabled="disabled ? '' : undefined"
    :disabled="disabled"
    :aria-label="resolvedLabel"
    :aria-keyshortcuts="keyShortcuts"
    :class="attrs.class"
    class="group/search-trigger inline-flex h-8 w-56 min-w-0 shrink cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-start text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none enabled:[&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:bg-(--bg-disabled) pointer-coarse:min-h-11 data-[collapsible=true]:w-8 data-[collapsible=true]:shrink-0 data-[collapsible=true]:justify-center data-[collapsible=true]:px-0 data-[collapsible=true]:pointer-coarse:min-w-11 data-[collapsible=true]:@2xl:w-56 data-[collapsible=true]:@2xl:shrink data-[collapsible=true]:@2xl:justify-start data-[collapsible=true]:@2xl:px-(--spacing-sm)"
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
  </button>
</template>
