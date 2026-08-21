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
    class="flex w-full flex-col gap-(--spacing-lg) border-b border-(--border-default) pb-(--spacing-lg)"
  >
    <Breadcrumb
      v-if="crumbs.length"
      :items="crumbs"
    />
    <div class="flex items-center justify-between gap-10">
      <h1 class="m-0 min-w-0 flex-1 text-heading-lg font-normal text-(--text-default)">
        {{ title }}
      </h1>
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
    </div>
    <p
      v-if="description"
      class="m-0 text-body-md font-light text-(--text-default)"
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
