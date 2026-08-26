<script setup lang="ts">
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import SplitButton from '@aziontech/webkit/split-button'
  import { computed } from 'vue'

  /**
   * The masthead of a documentation page: where the reader is (breadcrumb),
   * what the page is (title), what they can do with it (the Copy Page control
   * that hands the page to an AI tool), the deck that says what they will have
   * by the end, and when the page was last touched.
   *
   * THE TRAIL AND THE ACTION ARE SLOTS OVER THE BUILT-INS. Both regions ship a
   * working default — a `Breadcrumb` over the `breadcrumb` prop, a Copy Page
   * `SplitButton` over `source` — which is all a static docs page needs. An
   * application needs more than a default can express: a trail whose plain
   * click must become a `router.push` instead of a document load, and a menu
   * whose entries are that site's own (the page link, the raw markdown, each
   * assistant by name) with the primary segment reporting back after a copy. So
   * the page may pass the real controls in and keep everything else — the
   * region, the order, the title's line, the type scale.
   *
   * IT CLOSES ON A RULE, AND THE PAGE IS WHAT DRAWS IT. The masthead is the
   * page's first section, and without an edge it just runs into the prose — the
   * reader gets the deck and the first paragraph as one block of text, with only
   * a size change between them. That rule is what gives every h2 below it
   * something to be subordinate TO.
   *
   * It is not drawn here because WHERE IT ENDS is a fact only the page holds. A
   * masthead submits to the reading column, but a rule that stops at the column's
   * inset reads as decoration under the title; it reads as the page's own horizon
   * only when it runs to the edge of the region that holds it. Those are two
   * different widths, and past the column's measure cap they are not even a fixed
   * distance apart. So the page wraps this masthead in the element that carries
   * the rule and lets the masthead take the column — the same split a sticky page
   * bar makes, where the bar's rule is the region's edge and its content is not.
   *
   * LAST UPDATED IS THE AUTHOR'S CLAIM, not the file's mtime. It comes from the
   * page's own frontmatter, so it changes when someone decides the content
   * changed — not when a typo is fixed or a build rewrites the file. A date is
   * accepted as ISO (`2026-06-30`) and formatted for reading; anything that is
   * not a date is printed verbatim, so an author can write the string directly.
   * The ISO form is parsed and rendered in UTC on purpose: read as local time, a
   * bare `2026-06-30` becomes the 29th for every reader west of Greenwich.
   */
  defineOptions({ name: 'DocPageHeader' })

  /** One breadcrumb segment. */
  export type DocCrumb = { label: string; href?: string }

  interface Props {
    /** The page title. */
    title?: string
    /** The deck under the title. */
    description?: string
    /** Ancestor trail, current page last. */
    breadcrumb?: DocCrumb[]
    /** Shows the Copy Page control. */
    copyable?: boolean
    /** The markdown handed to the clipboard by the primary action. */
    source?: string
    /** When the page's content last changed. ISO date, or a ready-made string. */
    lastUpdated?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    breadcrumb: () => [],
    copyable: true,
    source: '',
    lastUpdated: ''
  })

  const emit = defineEmits<{
    /** Fired when the primary Copy Page action runs, after the copy resolves. */
    copy: [event: MouseEvent, source: string]
    /** Fired when one of the attached AI actions is chosen. */
    action: [event: MouseEvent | KeyboardEvent, item: { label: string; value?: string }]
  }>()

  defineSlots<{
    /** The trail; replaces the built-in breadcrumb. */
    breadcrumb(): unknown
    /** What the reader can do with the page; replaces the built-in Copy Page control. */
    actions(): unknown
  }>()

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

  const AI_ACTIONS = [
    { label: 'View as Markdown', value: 'markdown', icon: 'pi pi-file' },
    { label: 'Open in ChatGPT', value: 'chatgpt', icon: 'pi pi-comments' },
    { label: 'Open in Claude', value: 'claude', icon: 'pi pi-sparkles' }
  ]

  async function handleCopy(event: MouseEvent) {
    try {
      await navigator.clipboard?.writeText(props.source)
    } catch {
      /* clipboard is unavailable in some embedded contexts; the event still fires */
    }
    emit('copy', event, props.source)
  }
</script>

<template>
  <header
    data-testid="doc-page-header"
    class="flex w-full flex-col gap-(--spacing-lg) pb-(--spacing-lg)"
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
    <!-- THE ACTION LEAVES THE TITLE'S LINE ON A PHONE. Beside a `Copy page` control the
         title had ~150px of a 390 viewport and broke into four lines, because `min-w-0
         flex-1` lets an h1 shrink to nothing rather than push the row wider. Stacked, the
         title gets the whole measure and the action reads as the page's utility rather
         than as something the heading has to flow around. It keeps its natural width: a
         full-bleed button between a title and its deck reads as the page's call to
         action, which this is not. -->
    <div
      class="flex flex-col items-start gap-(--spacing-md) sm:flex-row sm:items-center sm:justify-between sm:gap-10"
    >
      <!-- The masthead takes the prose h1's rung (see DocProse): a page title that an
           h2 could overtake — which `heading-lg` did between 640 and 768 — is not a
           title. `heading-xl` IS that rung from 640 up (30px, then 36px past 768), and
           the token carries the steps itself.

           THE PHONE STEP IS PINNED, because the token's own is 20px — exactly what the
           prose h2 renders at below 640, so the title and the section under it would
           come out the same size. The heading scale skips 24px on mobile (2xl jumps to
           30, xl drops to 20), so the pin names the primitive step rather than borrowing
           a semantic token whose other two widths are wrong. Only the size is
           overridden; the balance, line-height and weight stay the token's. -->
      <h1
        class="m-0 w-full min-w-0 text-heading-xl text-(--text-default) max-sm:[font-size:var(--text-2xl)] sm:w-auto sm:flex-1"
      >
        {{ title }}
      </h1>
      <!-- The action sits on the TITLE'S line, so a page that passes its own control
           gets the same placement as the built-in one rather than having to rebuild the
           row to reach it. -->
      <slot name="actions">
        <SplitButton
          v-if="copyable"
          kind="outlined"
          icon="pi pi-copy"
          label="Copy Page"
          :model="AI_ACTIONS"
          class="shrink-0"
          @click="handleCopy"
          @item-click="(event, item) => emit('action', event, item)"
        />
      </slot>
    </div>
    <p
      v-if="description"
      class="m-0 text-body-md text-(--text-default)"
    >
      {{ description }}
    </p>
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
  </header>
</template>
