import DocPageHeader from '@aziontech/webkit/doc-page-header'
import Tag from '@aziontech/webkit/tag'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import DocPageHeader from '@aziontech/webkit/doc-page-header'"
const IMPORT_WITH_TAG = [IMPORT, "import Tag from '@aziontech/webkit/tag'"]

const CRUMBS = [{ label: 'Docs', href: '/docs' }, { label: 'Deploy an application' }]

/*
 * The meta line's controls, as a page declares them: two or three words each, a glyph, and
 * the sentence the label has no room for. `copy` is an event the page handles; `agent-setup`
 * has an `href`, so it renders as a real anchor.
 */
const META_ACTIONS = [
  {
    value: 'copy',
    label: 'Copy as Markdown',
    icon: 'pi pi-copy',
    tip: 'Copy this page as Markdown, ready to paste into an assistant.'
  },
  {
    value: 'markdown',
    label: 'View as Markdown',
    icon: 'pi pi-eye',
    tip: 'Open this page as plain Markdown in a new tab.'
  },
  {
    value: 'agent-setup',
    label: 'Agent setup',
    icon: 'pi pi-microchip-ai',
    href: '/docs/agent-setup',
    tip: 'Set up your coding agent to build on Azion.'
  }
]

/** @type {import('@storybook/vue3').Meta<typeof DocPageHeader>} */
const meta = {
  title: 'Components/Documentation/DocPageHeader',
  component: DocPageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The masthead of a documentation page: where the reader is, what the page is, the deck that says what they will have by the end, and one meta line carrying when the content last changed and what can be done with the page. It closes on a rule spanning the column — without that edge the deck runs straight into the prose, with only a size change between them — and that rule is what gives every h2 below it something to be subordinate to. \"Last updated\" is the author's claim from the page's frontmatter, not the file's mtime; every region is a slot over its built-in."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  /*
   * `title` and `breadcrumb` are a prop AND a slot; Storybook keys argTypes by name, so the
   * slots table lists only the two names that do not collide. Their descriptions say so
   * rather than leaving the slot invisible — see the Slots story.
   */
  argTypes: {
    title: {
      control: 'text',
      description: 'The page title. Also a SLOT, for a title that is more than a string.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'The deck under the title.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    breadcrumb: {
      control: 'object',
      description:
        'Ancestor trail, current page last. Also a SLOT, for a trail whose click must route in-page.',
      table: { type: { summary: 'DocCrumb[]' }, defaultValue: { summary: '[]' } }
    },
    lastUpdated: {
      control: 'text',
      description: "When the page's content last changed. ISO date, or a ready-made string.",
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    metaActions: {
      control: 'object',
      description:
        'The meta line’s controls, in reading order. One entry is `{ label, icon?, href?, target?, value?, tip? }` — with an `href` it renders as a real anchor, without one as a button.',
      table: { type: { summary: 'DocPageAction[]' }, defaultValue: { summary: '[]' } }
    },
    onMetaAction: {
      action: 'meta-action',
      description:
        "Fired when a meta-line control is activated. A link's default navigation is yours to keep or to prevent — an app that routes in-page prevents it.",
      table: { type: { summary: '(event: MouseEvent, item: DocPageAction)' } }
    }
  },
  args: {
    title: 'Deploy an application',
    description: 'Go from a template to a live edge application in a few clicks.',
    breadcrumb: CRUMBS,
    lastUpdated: '2026-06-30',
    metaActions: META_ACTIONS
  }
}

export default meta

const DEFAULT_MARKUP = `<DocPageHeader
  title="Deploy an application"
  description="Go from a template to a live edge application in a few clicks."
  :breadcrumb="[{ label: 'Docs', href: '/docs' }, { label: 'Deploy an application' }]"
  last-updated="2026-06-30"
  :meta-actions="[
    { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy', tip: 'Copy this page as Markdown, ready to paste into an assistant.' },
    { value: 'markdown', label: 'View as Markdown', icon: 'pi pi-eye', tip: 'Open this page as plain Markdown in a new tab.' },
    { value: 'agent-setup', label: 'Agent setup', icon: 'pi pi-microchip-ai', href: '/docs/agent-setup', tip: 'Set up your coding agent to build on Azion.' }
  ]"
/>`

export const Default = {
  render: (args) => ({
    components: { DocPageHeader },
    setup: () => ({ props: args }),
    template: '<DocPageHeader v-bind="props" />'
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The full masthead: trail, title, deck, and the meta line. The ISO date is formatted for reading and rendered in UTC, so a bare `2026-06-30` does not become the 29th west of Greenwich.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const ACTIONS_MARKUP = `<DocPageHeader
  title="Deploy an application"
  description="Three entries, three shapes: a button that acts on the page, an in-app link, and a link that leaves the documentation."
  last-updated="2026-06-30"
  :meta-actions="[
    { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy', tip: 'Copy this page as Markdown, ready to paste into an assistant.' },
    { value: 'agent-setup', label: 'Agent setup', icon: 'pi pi-microchip-ai', href: '/docs/agent-setup', tip: 'Set up your coding agent to build on Azion.' },
    { value: 'source', label: 'Edit this page', icon: 'pi pi-pencil', href: 'https://github.com/aziontech/azion-docs', target: '_blank', tip: 'Open this page in the repository and propose a change.' }
  ]"
  @meta-action="onMetaAction"
/>`

/*
 * The handler the snippet names, so the canvas wires what the panel shows: an in-app href is
 * the router's, an off-site one is the browser's, and everything else is the page's own.
 */
const onMetaAction = (event, item) => {
  if (!item.href?.startsWith('/')) return
  event.preventDefault()
}

export const Actions = {
  name: 'The action belt',
  render: () => ({
    components: { DocPageHeader },
    setup: () => ({ onMetaAction }),
    template: ACTIONS_MARKUP
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The controls are DATA, not anatomy: one array of same-shaped entries, so a site adds, drops or reorders them without touching a component. An entry with an `href` renders as a real anchor — middle-click, copy link and open-in-a-tab all work — and one without renders as a button; both report back through `meta-action`, so an app that routes in-page calls `preventDefault()` on the click it already has. Each entry carries a `tip` because the label cannot: two or three words name the control, and the sentence saying what it does appears on hover and on focus. The rules between entries are drawn only from `md` up — below that the line wraps, and a rule at the end of a wrapped line has nothing after it.'
      },
      source: { code: toSfc(IMPORT, ACTIONS_MARKUP) }
    }
  }
}

const REGIONS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <DocPageHeader
    title="No breadcrumb"
    description="The trail is optional; the masthead closes up rather than leaving a gap."
    last-updated="2026-06-30"
  />
  <DocPageHeader
    title="No deck"
    :breadcrumb="[{ label: 'Docs', href: '/docs' }, { label: 'No deck' }]"
    last-updated="Updated this morning"
  />
  <DocPageHeader
    title="No date"
    description="Without a date the belt starts the line, and the line is pulled left by one step so the first label lands on the column the title and deck start on."
    :meta-actions="[
      { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy', tip: 'Copy this page as Markdown, ready to paste into an assistant.' },
      { value: 'markdown', label: 'View as Markdown', icon: 'pi pi-eye', tip: 'Open this page as plain Markdown in a new tab.' }
    ]"
  />
  <DocPageHeader
    title="Nothing to do with it"
    description="No date and no entries: the meta line renders no element at all."
  />
</div>`

export const Regions = {
  render: () => ({ components: { DocPageHeader }, template: REGIONS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Every region is independently optional, and an absent one closes up instead of leaving an empty row. The second example shows that `lastUpdated` accepts a ready-made string when the author would rather write it themselves; the third is the undated line and its one-step compensation; the fourth has no meta line at all.'
      },
      source: { code: toSfc(IMPORT, REGIONS_TEMPLATE) }
    }
  }
}

const SLOTS_MARKUP = `<DocPageHeader
  description="Terminal agent that reads your codebase, runs commands, and edits files. One CLI command connects the Azion MCP server."
  :breadcrumb="[{ label: 'Agent Setup', href: '/docs/agent-setup' }, { label: 'Claude Code' }]"
  :meta-actions="[
    { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy', tip: 'Copy this page as Markdown, ready to paste into an assistant.' },
    { value: 'agent-setup', label: 'Agent setup', icon: 'pi pi-microchip-ai', href: '/docs/agent-setup', tip: 'Set up your coding agent to build on Azion.' }
  ]"
  @meta-action="onMetaAction"
>
  <template #title>
    <div class="flex min-w-0 flex-col items-start gap-(--spacing-sm) sm:flex-1 sm:flex-row sm:items-center sm:gap-(--spacing-md)">
      <span class="flex size-14 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised) sm:size-16">
        <i class="pi pi-microchip-ai text-heading-lg text-(--text-default)" aria-hidden="true" />
      </span>
      <div class="min-w-0 flex-1">
        <span class="block text-overline-sm uppercase text-(--primary)">Anthropic</span>
        <h1 class="m-0 text-heading-2xl text-(--text-default) sm:text-heading-xl">
          Claude Code + Azion
        </h1>
      </div>
    </div>
  </template>
  <template #details>
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Tag label="Terminal" size="medium" rounded />
      <Tag label="Subscription" size="medium" rounded />
      <Tag label="Project memory" size="medium" rounded />
    </div>
  </template>
</DocPageHeader>`

export const Slots = {
  name: 'Slotted regions',
  render: () => ({
    components: { DocPageHeader, Tag },
    setup: () => ({ onMetaAction }),
    template: SLOTS_MARKUP
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Four regions are slots over their built-ins. **`breadcrumb`** over the `breadcrumb` prop — the built-in renders the same component, but an application's trail must push a route instead of loading the document. **`title`** over the `title` prop — a prose page's name is a string, while a page ABOUT something is an identity: a mark beside the name and the maker above it. That is a title, so it goes where the `h1` goes rather than into a band of its own. **`details`** — the rows a page carries between its deck and its meta line, the subject's facts as tags or the references a reader might want instead of the body. **`actions`** — a control on the title's line, empty by default, because a masthead's built-in action region is the meta line below. Everything the slots do not replace stays shared: the order, the rhythm, the type scale, and the one column every row starts on."
      },
      source: { code: toSfc(IMPORT_WITH_TAG, SLOTS_MARKUP) }
    }
  }
}
