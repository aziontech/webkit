<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Divider from '../../layout/divider/divider.vue'
  import Breadcrumb from '../../navigation/breadcrumb/breadcrumb.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  // The masthead of a documentation page. Every region is a named slot over its
  // built-in, so one masthead serves every page. Meta controls are data, not anatomy:
  // one array through one control — an entry with an href renders a real anchor, one
  // without renders a button, both report back through meta-action. ISO dates render
  // in UTC on purpose: read as local time, a bare date shifts a day west of Greenwich.
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

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-page-header')

  const crumbs = computed(() =>
    props.breadcrumb.map((crumb, position) => ({
      label: crumb.label,
      href: crumb.href,
      current: position === props.breadcrumb.length - 1
    }))
  )

  /** ISO dates become "Jun 30, 2026"; anything else is the author's own string. */
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
    <!-- The guard sits on the fallback, not a wrapper: an unfilled slot with a guarded
         fallback renders no element, so a trail-less masthead pays no gap for it. -->
    <slot name="breadcrumb">
      <Breadcrumb
        v-if="crumbs.length"
        :items="crumbs"
      />
    </slot>
    <!-- A passed action leaves the title's line on a phone: beside a control the title
         had ~150px of a 390 viewport and broke into four lines. Stacked, the action
         keeps its natural width — full-bleed between a title and its deck would read
         as the page's call to action, which it is not. -->
    <div
      class="flex flex-col items-start gap-(--spacing-md) sm:flex-row sm:items-center sm:justify-between sm:gap-10"
    >
      <!-- The masthead takes the prose h1's own responsive pair (see DocProse): a page
           title an h2 could overtake is not a title. The phone step is the one rung the
           pair cannot tune — the heading scale skips 24 on mobile, and pinning a
           primitive is a raw size the typography standard forbids, so that step waits
           on a token rather than an override here. -->
      <slot name="title">
        <h1
          class="m-0 w-full min-w-0 text-heading-2xl text-(--text-default) sm:w-auto sm:flex-1 sm:text-heading-xl"
        >
          {{ title }}
        </h1>
      </slot>
      <!-- Nothing ships on the title's line by default: the page's own actions live on
           the meta line below, beside the date they qualify. -->
      <slot name="actions" />
    </div>
    <p
      v-if="description"
      class="m-0 text-body-md text-(--text-default)"
    >
      {{ description }}
    </p>
    <!-- Direct children of the masthead, so they take its rhythm; a page wanting a
         tighter step between two rows wraps those two and sets it there. -->
    <slot name="details" />
    <!-- The meta line: the date, then what can be done with the page — one row that
         wraps per control. With no date the row is pulled left by exactly the text
         button's own label inset, so the ink lands on the column edge instead of
         reading indented; the hover surface bleeds into the gutter, hitting nothing. -->
    <div
      v-if="updatedLabel || metaActions.length"
      :data-undated="updatedLabel ? null : ''"
      class="flex flex-wrap items-center gap-(--spacing-xxs) data-[undated]:-ml-(--spacing-xs)"
    >
      <p
        v-if="updatedLabel"
        class="m-0 flex items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)"
      >
        <!-- Decorative: "Last updated" sits right beside it; naming it would read twice. -->
        <i
          class="pi pi-history shrink-0 text-label-sm leading-none"
          aria-hidden="true"
        />
        <span>
          Last updated
          <time :datetime="lastUpdated">{{ updatedLabel }}</time>
        </span>
      </p>
      <!-- The entries are this row's own flex items: a nested row would wrap as one
           block, where a phone needs one control moving down at a time. -->
      <template
        v-for="(action, index) in metaActions"
        :key="action.value ?? action.label"
      >
        <!-- The rule is decoration, and announced it would be one more separator a screen
             reader steps over on the way to each control — so it is hidden from the
             accessibility tree. It takes its height from the wrapper rather than a class
             of its own: the vertical divider is `h-full` at a specificity a utility cannot
             beat, so the only honest way to size it is to size what holds it.

             DRAWN ONLY WHERE THE LINE CANNOT WRAP (`md` and up). Wrapped, a rule is left
             dangling at the end of a line with nothing after it; below `md` the gap does
             the separating and nothing hangs. -->
        <span
          v-if="updatedLabel || index > 0"
          aria-hidden="true"
          class="mx-(--spacing-xxs) hidden h-4 items-center md:flex"
        >
          <Divider orientation="vertical" />
        </span>
        <!-- `text` at `small`: this is the page's quietest register, and the kind's
             transparent ground keeps the line reading as metadata until a pointer lands on
             an entry. An entry with no `tip` passes the empty string, and the tooltip
             simply never opens. -->
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
