<script setup lang="ts">
  import { type Component, computed, getCurrentInstance, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import CopyButton from '../../../action/copy-button/copy-button.vue'
  import OverflowCount, {
    type OverflowCountItem,
    type OverflowCountNoun
  } from '../../../content/overflow-count/overflow-count.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'

  defineOptions({
    name: 'TableCellLink',
    inheritAttrs: false
  })

  export interface TableCellLinkProps {
    /** The resource name shown in the cell. */
    label?: string
    /** An absolute address outside the app (a scheme such as `https:` or a leading `//`); opens in a new tab with the external mark. A relative address is treated as an in-app link. */
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
    /** More values of the same type, shown as a `+N` chip after the name. */
    more?: OverflowCountItem[]
    /** What the `more` values are (`{ one: 'domain', other: 'domains' }`), the same name as CellTags. */
    noun?: OverflowCountNoun
  }

  const props = withDefaults(defineProps<TableCellLinkProps>(), {
    label: '',
    href: '',
    to: undefined,
    destination: '',
    icon: '',
    copyable: false,
    copyValue: '',
    more: () => [],
    noun: undefined
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ tableCellLink: en.tableCellLink, common: en.common })
  const instance = getCurrentInstance()
  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-cell-link'
  )

  const routerLink = (): Component | undefined =>
    instance?.appContext.components['RouterLink'] as Component | undefined

  const isLink = computed<boolean>(() => Boolean(props.href || props.to))
  const external = computed<boolean>(() => /^([a-z][a-z\d+.-]*:|\/\/)/i.test(props.href))
  const tag = computed<string | Component>(() => {
    if (props.href) return 'a'
    if (!props.to) return 'span'
    return routerLink() ?? 'a'
  })
  const linkAttrs = computed<Record<string, unknown>>(() => {
    if (external.value) return { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
    if (props.href) return { href: props.href }
    if (!props.to) return {}
    if (typeof tag.value !== 'string') return { to: props.to }
    return { href: typeof props.to === 'string' ? props.to : undefined }
  })
  const tooltip = computed<string>(() => {
    if (!isLink.value) return ''
    if (external.value) return t('tableCellLink.openInNewTab', { label: props.label })
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
      :content="tooltip"
      :disabled="!isLink"
      class="min-w-0 shrink!"
    >
      <component
        :is="tag"
        v-bind="linkAttrs"
        :data-link="isLink || null"
        :data-testid="`${testId}__link`"
        class="group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline outline-none data-[link]:cursor-pointer focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
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
          >{{ ` ${t('common.newTab')}` }}</span
        >
        <i
          v-if="external"
          class="ai ai-external-link shrink-0 text-body-xs leading-none"
          aria-hidden="true"
        />
      </component>
    </Tooltip>
    <OverflowCount
      v-if="more.length > 0"
      :items="more"
      :noun="noun"
      :data-testid="`${testId}__more`"
    />
    <CopyButton
      v-if="copyable && (copyValue || label)"
      variant="outline"
      :value="copyValue || label"
      :aria-label="t('tableCellLink.copy', { label })"
      :data-testid="`${testId}__copy`"
      class="ms-auto shrink-0"
      size="small"
    />
  </div>
</template>
