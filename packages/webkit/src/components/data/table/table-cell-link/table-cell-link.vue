<script setup lang="ts">
  import { type Component, computed, getCurrentInstance, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import CopyButton from '../../../actions/copy-button/copy-button.vue'
  import OverflowCount, {
    type OverflowCountItem,
    type OverflowCountNoun
  } from '../../../content/overflow-count/overflow-count.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableCellLink',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** The resource name shown in the cell. */
      label?: string
      /** An address outside the app; opens in a new tab. */
      href?: string
      /** An in-app route; rendered with the app's `RouterLink` when one is registered, otherwise as a plain link. */
      to?: string | Record<string, unknown>
      /** Where an in-app link leads (`Workloads`), for the tooltip `Open <label> in <destination>`. */
      destination?: string
      /** Glyph class drawn before the name, muted (the provider or resource type: `ai ai-github`, `ai ai-workloads`). */
      icon?: string
      /** Adds a copy button pinned to the cell's end edge. */
      copyable?: boolean
      /** Text the copy button copies; defaults to `label`. */
      copyValue?: string
      /** More values of the same kind, shown as a `+N` chip after the name. */
      more?: OverflowCountItem[]
      /** What the `more` values are (`{ one: 'domain', other: 'domains' }`). */
      moreNoun?: OverflowCountNoun
    }>(),
    {
      label: '',
      href: '',
      to: undefined,
      destination: '',
      icon: '',
      copyable: false,
      copyValue: '',
      more: () => [],
      moreNoun: undefined
    }
  )

  const attrs = useAttrs()
  const { t } = useTranslate({ tableCellLink: en.tableCellLink })
  const ctx = inject(TableInjectionKey, null)
  const instance = getCurrentInstance()
  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__cell-link` : 'data-table__cell-link')
  )

  const routerLink = (): Component | undefined =>
    instance?.appContext.components['RouterLink'] as Component | undefined

  const isLink = computed<boolean>(() => Boolean(props.href || props.to))
  const external = computed<boolean>(() => Boolean(props.href))
  const tag = computed<string | Component>(() => {
    if (props.href) return 'a'
    if (!props.to) return 'span'
    return routerLink() ?? 'a'
  })
  const linkAttrs = computed<Record<string, unknown>>(() => {
    if (props.href) return { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
    if (!props.to) return {}
    if (typeof tag.value !== 'string') return { to: props.to }
    return { href: typeof props.to === 'string' ? props.to : undefined }
  })
  const tooltip = computed<string>(() => {
    if (!isLink.value) return ''
    if (external.value) return t('tableCellLink.newTab', { label: props.label })
    return props.destination
      ? t('tableCellLink.openIn', { label: props.label, destination: props.destination })
      : t('tableCellLink.open', { label: props.label })
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex w-full min-w-0 items-center gap-(--spacing-xs)"
  >
    <i
      v-if="icon"
      :class="icon"
      :data-testid="`${testId}__icon`"
      class="shrink-0 text-body-lg leading-none text-(--text-muted)"
      aria-hidden="true"
    />
    <Tooltip
      :text="tooltip"
      :disabled="!isLink"
      class="min-w-0 shrink!"
    >
      <component
        :is="tag"
        v-bind="linkAttrs"
        :data-link="isLink || null"
        :data-testid="`${testId}__link`"
        class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline outline-none data-[link]:cursor-pointer focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
        @click.stop
      >
        <span
          dir="auto"
          :data-link="isLink || null"
          class="truncate underline-offset-2 data-[link]:group-hover/link:underline"
          >{{ label }}</span
        >
        <span
          v-if="external"
          class="sr-only"
          >{{ ` ${t('tableCellLink.newTabHint')}` }}</span
        >
        <i
          v-if="isLink"
          class="pi pi-external-link shrink-0 text-body-xs leading-none"
          aria-hidden="true"
        />
      </component>
    </Tooltip>
    <OverflowCount
      v-if="more.length > 0"
      :items="more"
      :noun="moreNoun"
      :data-testid="`${testId}__more`"
    />
    <CopyButton
      v-if="copyable && (copyValue || label)"
      kind="outlined"
      :value="copyValue || label"
      :aria-label="t('tableCellLink.copy', { label })"
      :data-testid="`${testId}__copy`"
      class="ms-auto shrink-0"
    />
  </div>
</template>
