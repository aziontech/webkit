<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Divider from '../../layout/divider/divider.vue'
  import Breadcrumb from '../../navigation/breadcrumb/breadcrumb.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  /**
   * The masthead of a documentation page: where the reader is (breadcrumb),
   * what the page is (title), the deck that says what they will have by the end,
   * when the page was last touched, and what can be done with it.
   *
   * EVERY REGION IS A SLOT OVER ITS BUILT-IN, so one masthead serves every page
   * without any page having to rebuild the row, the order, the rhythm or the
   * type scale to say one thing differently:
   *
   * - `breadcrumb` over the `breadcrumb` prop — the built-in renders the same
   *   component, but an application's trail must push a route instead of loading
   *   the document, so it passes the wired control in.
   * - `title` over the `title` prop — a prose page's name is a string; a page
   *   ABOUT something (a tool, a vendor, a product) is an identity: a mark beside
   *   the name and the maker above it. That is a title, not a decoration, so it
   *   goes where the `h1` goes rather than into a band of its own above the
   *   masthead.
   * - `details` — the rows a page carries between its deck and its meta line: the
   *   subject's facts as tags, the references a reader might want instead of the
   *   body. Empty on a prose page, which has none.
   * - `actions` — a control on the title's line, empty by default. A masthead's
   *   built-in action region is the meta line below, so a control up here is the
   *   page's own choice and never the default.
   *
   * THE META LINE IS ONE LINE, not a date with a toolbar under it: when the
   * content last changed, then what can be done with the page — read it as
   * Markdown, hand it to an agent, go set one up.
   *
   * THOSE CONTROLS ARE DATA, NOT ANATOMY. One array of same-shaped entries
   * rendered through one control, so a site adds, drops or reorders them without
   * touching this file. An entry with an `href` renders as a real anchor —
   * middle-click, copy link and open-in-a-tab all work — and one without renders
   * as a button; both report back through `meta-action`, so an app that routes
   * in-page prevents the default on the click it already has.
   *
   * EACH ONE CARRIES A TOOLTIP because the label cannot. A meta control has room
   * for two or three words — `Agent setup` — and none for the sentence that says
   * what it will do to the reader's day. The tip is that sentence, on hover and
   * on focus, from the design system's own tooltip rather than a `title`
   * attribute that no touch device and no keyboard ever shows.
   *
   * IT CLOSES ON A RULE. The masthead is the page's first section, and without
   * an edge it just runs into the prose — the reader gets the deck and the first
   * paragraph as one block of text, with only a size change between them. The
   * rule spans the whole column, so it reads as the page's own horizon rather
   * than as decoration under the title, and it is what gives every h2 below it
   * something to be subordinate TO.
   *
   * LAST UPDATED IS THE AUTHOR'S CLAIM, not the file's mtime. It comes from the
   * page's own frontmatter, so it changes when someone decides the content
   * changed — not when a typo is fixed or a build rewrites the file. A date is
   * accepted as ISO (`2026-06-30`) and formatted for reading; anything that is
   * not a date is printed verbatim, so an author can write the string directly.
   * The ISO form is parsed and rendered in UTC on purpose: read as local time, a
   * bare `2026-06-30` becomes the 29th for every reader west of Greenwich.
   */
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
    /**
     * Fired when a meta-line control is activated. A link's default navigation is
     * the consumer's to keep or to prevent — an app that routes in-page prevents it.
     */
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
    <!-- An unfilled slot with a `v-if`-ed fallback renders NO element, so a masthead
         with neither a trail nor a passed one pays no gap for the region it does not
         have — which is why the guard sits on the fallback rather than on a wrapper. -->
    <slot name="breadcrumb">
      <Breadcrumb
        v-if="crumbs.length"
        :items="crumbs"
      />
    </slot>
    <!-- A PASSED ACTION LEAVES THE TITLE'S LINE ON A PHONE. Beside a control the
         title had ~150px of a 390 viewport and broke into four lines, because `min-w-0
         flex-1` lets an h1 shrink to nothing rather than push the row wider. Stacked, the
         title gets the whole measure and the action reads as the page's utility rather
         than as something the heading has to flow around. It keeps its natural width: a
         full-bleed button between a title and its deck reads as the page's call to
         action, which this is not. -->
    <div
      class="flex flex-col items-start gap-(--spacing-md) sm:flex-row sm:items-center sm:justify-between sm:gap-10"
    >
      <!-- The masthead takes the prose h1's pair (see DocProse): a page title that an
           h2 could overtake — which `heading-lg` did between 640 and 768 — is not a
           title.

           The phone step is the one rung this pair cannot tune. `heading-2xl` renders
           30px there where 24 would sit better against the deck, but the heading scale
           skips 24 on mobile (2xl jumps to 30, xl drops to 20 — which is what the prose
           h2 renders at, so borrowing it would make the title and the section under it
           the same size). Pinning the primitive is a raw size the typography standard
           forbids, so the step waits on a token rather than an override here. -->
      <slot name="title">
        <h1
          class="m-0 w-full min-w-0 text-heading-2xl text-(--text-default) sm:w-auto sm:flex-1 sm:text-heading-xl"
        >
          {{ title }}
        </h1>
      </slot>
      <!-- A page-specific control sits on the TITLE'S line. Nothing ships here: the
           page's own actions are the meta line below, where they sit beside the date
           they qualify instead of competing with the title for the eye. -->
      <slot name="actions" />
    </div>
    <p
      v-if="description"
      class="m-0 text-body-md text-(--text-default)"
    >
      {{ description }}
    </p>
    <!-- The page's own rows, between the deck and the meta line. They are the masthead's
         direct children, so they take its rhythm; a page that wants a tighter step between
         two of them wraps those two and sets it there. -->
    <slot name="details" />
    <!-- THE META LINE: when the page changed, then what can be done with it. One row, so
         the date reads as the first entry in the page's utility belt rather than as a
         caption of its own — and it wraps per control, because on a phone the belt is
         wider than the column and a row that cannot wrap either clips or scrolls.

         WITH NO DATE THE LINE IS PULLED LEFT BY ONE STEP, because what starts it is then a
         `text` button, whose label sits `--spacing-xs` inside its own box — so left alone
         the whole line reads indented against the title and deck above it. The negative
         margin is exactly that padding: the ink lands on the column, and the hover surface
         keeps its box and bleeds into the gutter, where there is nothing to collide with.
         Dated, the date's own text starts the line and no compensation is owed. -->
    <div
      v-if="updatedLabel || metaActions.length"
      :data-undated="updatedLabel ? null : ''"
      class="flex flex-wrap items-center gap-(--spacing-xxs) data-[undated]:-ml-(--spacing-xs)"
    >
      <p
        v-if="updatedLabel"
        class="m-0 flex items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)"
      >
        <!-- The glyph is decorative: "Last updated" is right beside it, so naming it
             again to a screen reader would just read the same thing twice. -->
        <i
          class="pi pi-history shrink-0 text-label-sm leading-none"
          aria-hidden="true"
        />
        <span>
          Last updated
          <time :datetime="lastUpdated">{{ updatedLabel }}</time>
        </span>
      </p>
      <!-- The entries are THIS row's flex items, not a nested row's: a wrapper around
           them would wrap as one block and jump to the next line whole, where what a
           phone needs is one control moving down at a time. -->
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
