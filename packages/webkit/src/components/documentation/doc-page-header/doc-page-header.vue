<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Divider from '../../layout/divider/divider.vue'
  import Breadcrumb from '../../navigation/breadcrumb/breadcrumb.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  defineOptions({ name: 'DocPageHeader', inheritAttrs: false })

  /** One breadcrumb segment. */
  export type DocCrumb = { label: string; href?: string }

  /** One control on the meta line. */
  export type DocPageAction = {
    /** The control's words. Two or three; the sentence goes in `tip`. */
    label: string
    /** PrimeIcons class for the leading glyph. */
    icon?: string
    /** Destination. With it the control is a real anchor, without it a button. */
    href?: string
    /** Where the link opens, when there is one. */
    target?: '_blank' | '_self'
    /** Identity handed back with the event, so one handler can switch on it. */
    value?: string
    /** The sentence the label has no room for, shown on hover and on focus. */
    tip?: string
  }

  interface Props {
    /** The page title. */
    title?: string
    /** The deck under the title. */
    description?: string
    /** Ancestor trail, current page last. */
    breadcrumb?: DocCrumb[]
    /** When the page's content last changed. ISO date, or a ready-made string. */
    lastUpdated?: string
    /** The controls on the meta line, in reading order. */
    metaActions?: DocPageAction[]
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    breadcrumb: () => [],
    lastUpdated: '',
    metaActions: () => []
  })

  const emit = defineEmits<{
    /** A meta-line control was activated; a link's default navigation is the consumer's to keep or prevent. */
    'meta-action': [event: MouseEvent, item: DocPageAction]
  }>()

  defineSlots<{
    /** The trail; replaces the built-in breadcrumb. */
    breadcrumb(): unknown
    /** The page's name; replaces the built-in `h1`, for a title that is more than a string. */
    title(): unknown
    /** A control on the title's line. Empty by default; the meta line carries the page's actions. */
    actions(): unknown
    /** Rows between the deck and the meta line — a page's own facts, tags or references. */
    details(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-page-header')

  const crumbs = computed(() =>
    props.breadcrumb.map((crumb, position) => ({
      label: crumb.label,
      href: crumb.href,
      current: position === props.breadcrumb.length - 1
    }))
  )

  const updatedLabel = computed(() => {
    const raw = props.lastUpdated.trim()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
    const parsed = new Date(`${raw}T00:00:00Z`)
    if (Number.isNaN(parsed.getTime())) return raw
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(parsed)
  })
</script>

<template>
  <header
    v-bind="$attrs"
    :data-testid="testId"
    class="flex w-full flex-col gap-(--spacing-lg) border-b border-(--border-default) pb-(--spacing-lg)"
  >
    <slot name="breadcrumb">
      <Breadcrumb
        v-if="crumbs.length"
        :items="crumbs"
      />
    </slot>
    <div
      class="flex flex-col items-start gap-(--spacing-md) sm:flex-row sm:items-center sm:justify-between sm:gap-10"
    >
      <slot name="title">
        <h1
          class="m-0 w-full min-w-0 text-heading-2xl text-(--text-default) sm:w-auto sm:flex-1 sm:text-heading-xl"
        >
          {{ title }}
        </h1>
      </slot>
      <slot name="actions" />
    </div>
    <p
      v-if="description"
      class="m-0 text-body-md text-(--text-default)"
    >
      {{ description }}
    </p>
    <slot name="details" />
    <div
      v-if="updatedLabel || metaActions.length"
      :data-undated="updatedLabel ? null : ''"
      class="flex flex-wrap items-center gap-(--spacing-xxs) data-[undated]:-ml-(--spacing-xs)"
    >
      <p
        v-if="updatedLabel"
        class="m-0 flex items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)"
      >
        <i
          class="pi pi-history shrink-0 text-label-sm leading-none"
          aria-hidden="true"
        />
        <span>
          Last updated
          <time :datetime="lastUpdated">{{ updatedLabel }}</time>
        </span>
      </p>
      <template
        v-for="(action, index) in metaActions"
        :key="action.value ?? action.label"
      >
        <span
          v-if="updatedLabel || index > 0"
          aria-hidden="true"
          class="mx-(--spacing-xxs) hidden h-4 items-center md:flex"
        >
          <Divider orientation="vertical" />
        </span>
        <Tooltip :text="action.tip ?? ''">
          <Button
            kind="text"
            size="small"
            :label="action.label"
            :icon="action.icon ?? ''"
            :href="action.href ?? ''"
            :target="action.target ?? '_self'"
            @click="(event) => emit('meta-action', event, action)"
          />
        </Tooltip>
      </template>
    </div>
  </header>
</template>
