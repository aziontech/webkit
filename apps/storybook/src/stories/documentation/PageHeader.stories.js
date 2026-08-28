import Tag from '@aziontech/webkit/tag'
import DocPageHeader from '@aziontech/webkit-docs/doc-page-header'

import { toSfc } from '../_shared/story-source'

const IMPORT = "import DocPageHeader from '@aziontech/webkit-docs/doc-page-header'"
const IMPORT_WITH_TAG = [IMPORT, "import Tag from '@aziontech/webkit/tag'"]

const BREADCRUMB = [{ label: 'Start', href: '/start' }, { label: 'Deploy an application' }]

const DESCRIPTION =
  'By the end of this tutorial, an application will be live on the Azion Web Platform, answering HTTP 200 on its own Azion domain. It takes a few minutes.'

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
  title: 'Documentation/Page header',
  component: DocPageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The masthead of a documentation page: where the reader is (the trail), what the page is (the title and its deck), when the content last changed, and what can be done with it. The last two are ONE line — the meta line — so the date reads as the first entry in the page's utility belt rather than as a caption under it. Every region is a slot over its built-in, so one masthead serves a page of prose and a page about a product without either one rebuilding the row, the order or the rhythm. The rule that closes it belongs to the PAGE, not to this component: it is the edge of the reading region, a width only the page knows, so the page wraps the masthead in the element that draws it — which is what every snippet here shows."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  /*
   * `title` and `breadcrumb` are a prop AND a slot; Storybook keys argTypes by name, so the
   * slots table below lists only the two names that do not collide. Their descriptions say
   * so rather than leaving the slot invisible — see the Slotted regions story.
   */
  argTypes: {
    title: {
      control: 'text',
      description: 'The page title. Also a SLOT, for a title that is more than a string.'
    },
    description: { control: 'text' },
    lastUpdated: {
      control: 'text',
      description:
        "The author's claim from the page's frontmatter, not the file's mtime. An ISO date is formatted in UTC; any other string prints verbatim."
    },
    breadcrumb: {
      control: false,
      table: { type: { summary: 'DocCrumb[]' } },
      description:
        'Ancestor trail, current page last. Also a SLOT, for a trail whose click must route in-page.'
    },
    metaActions: {
      control: false,
      table: { type: { summary: 'DocPageAction[]' } },
      description:
        "The meta line's controls, in reading order. One entry is `{ label, icon?, href?, target?, value?, tip? }` — with an `href` it renders as a real anchor, without one as a button."
    },
    'meta-action': {
      control: false,
      table: { type: { summary: '(event: MouseEvent, item: DocPageAction)' } },
      description:
        "Fired when a meta-line control is activated. A link's default navigation is yours to keep or to prevent — an app that routes in-page prevents it."
    }
  },
  args: {
    title: 'Deploy an application',
    description: DESCRIPTION,
    breadcrumb: BREADCRUMB,
    lastUpdated: '2026-08-26',
    metaActions: META_ACTIONS
  }
}

export default meta

const Template = (args) => ({
  components: { DocPageHeader },
  setup: () => ({ props: args }),
  template: '<div class="border-b border-(--border-default)"><DocPageHeader v-bind="props" /></div>'
})

const DEFAULT_MARKUP = `<div class="border-b border-(--border-default)">
  <DocPageHeader
    title="Deploy an application"
    description="By the end of this tutorial, an application will be live on the Azion Web Platform, answering HTTP 200 on its own Azion domain. It takes a few minutes."
    :breadcrumb="[{ label: 'Start', href: '/start' }, { label: 'Deploy an application' }]"
    last-updated="2026-08-26"
    :meta-actions="[
      { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy', tip: 'Copy this page as Markdown, ready to paste into an assistant.' },
      { value: 'markdown', label: 'View as Markdown', icon: 'pi pi-eye', tip: 'Open this page as plain Markdown in a new tab.' },
      { value: 'agent-setup', label: 'Agent setup', icon: 'pi pi-microchip-ai', href: '/docs/agent-setup', tip: 'Set up your coding agent to build on Azion.' }
    ]"
  />
</div>`

export const Default = {
  name: 'Page header',
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "Trail, title, deck, meta line — a flat 24px between every row, and every row of ink starting on one column. The date is the author's claim from the page's own frontmatter, so it changes when someone decides the content changed, not when a build rewrites the file; an ISO date is rendered in UTC on purpose, because read as local time a bare `2026-08-26` becomes the 25th for every reader west of Greenwich."
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const ACTIONS_MARKUP = `<div class="border-b border-(--border-default)">
  <DocPageHeader
    title="Deploy an application"
    description="Three entries, three shapes: a button that acts on the page, an in-app link, and a link that leaves the documentation."
    last-updated="2026-08-26"
    :meta-actions="[
      { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy', tip: 'Copy this page as Markdown, ready to paste into an assistant.' },
      { value: 'agent-setup', label: 'Agent setup', icon: 'pi pi-microchip-ai', href: '/docs/agent-setup', tip: 'Set up your coding agent to build on Azion.' },
      { value: 'source', label: 'Edit this page', icon: 'pi pi-pencil', href: 'https://github.com/aziontech/azion-docs', target: '_blank', tip: 'Open this page in the repository and propose a change.' }
    ]"
    @meta-action="onMetaAction"
  />
</div>`

export const Actions = {
  name: 'The action belt',
  render: () => ({ components: { DocPageHeader }, template: ACTIONS_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The controls are DATA, not anatomy: one array of same-shaped entries, so a site adds, drops or reorders them without touching a component. An entry with an `href` renders as a real anchor — middle-click, copy link and open-in-a-tab all work — and one without renders as a button; both report back through `meta-action`, so an app that routes in-page calls `preventDefault()` on the click it already has:\n\n```js\nconst onMetaAction = (event, item) => {\n  if (item.value === "copy") return copyPage()\n  if (!item.href?.startsWith("/")) return // external: leave it to the browser\n  if (event.button !== 0 || event.metaKey || event.ctrlKey) return // a modified click is the browser\'s\n  event.preventDefault()\n  router.push(item.href)\n}\n```\n\nEach entry carries a `tip` because the label cannot: two or three words name the control, and the sentence saying what it will do to the reader\'s day appears on hover and on focus — from the design system\'s tooltip, never a `title` attribute no touch device and no keyboard ever shows. The rules between entries are drawn only from `md` up: below that the line wraps, and a rule left at the end of a wrapped line has nothing after it.'
      },
      source: { code: toSfc(IMPORT, ACTIONS_MARKUP) }
    }
  }
}

const UNDATED_MARKUP = `<div class="border-b border-(--border-default)">
  <DocPageHeader
    title="Rules reference"
    description="A page whose answer to “is this current?” is its own content — an API reference, a config schema — carries no date, and the belt starts the line."
    :meta-actions="[
      { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy', tip: 'Copy this page as Markdown, ready to paste into an assistant.' },
      { value: 'markdown', label: 'View as Markdown', icon: 'pi pi-eye', tip: 'Open this page as plain Markdown in a new tab.' }
    ]"
    @meta-action="onMetaAction"
  />
</div>`

export const Undated = {
  name: 'No date',
  render: () => ({ components: { DocPageHeader }, template: UNDATED_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Without `last-updated` the line is the belt alone, and it is pulled left by one spacing step: what starts it is then a text button, whose label sits `--spacing-xs` inside its own box, so left alone the whole line would read indented against the title and deck above it. The compensation is exactly that padding — the ink lands on the column, and the hover surface keeps its box and bleeds into the gutter where nothing collides. Drop `meta-actions` as well and the line renders no element at all: the masthead pays no gap for a region it does not have.'
      },
      source: { code: toSfc(IMPORT, UNDATED_MARKUP) }
    }
  }
}

const SLOTS_MARKUP = `<div class="border-b border-(--border-default)">
  <DocPageHeader
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
          <h1 class="m-0 text-heading-xl text-(--text-default) max-sm:[font-size:var(--text-2xl)]">
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
  </DocPageHeader>
</div>`

export const Slots = {
  name: 'Slotted regions',
  render: () => ({ components: { DocPageHeader, Tag }, template: SLOTS_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Four regions are slots over their built-ins. **`breadcrumb`** over the `breadcrumb` prop — the built-in renders the same component, but an application's trail must `router.push` instead of loading the document, so it passes the wired control in. **`title`** over the `title` prop — a prose page's name is a string, while a page ABOUT something is an identity: a mark beside the name and the maker above it. That is a title, so it goes where the `h1` goes rather than into a band of its own. **`details`** — the rows a page carries between its deck and its meta line (the subject's facts as tags, the references a reader might want instead of the body); they are the masthead's own children, so a page wanting a tighter step between two of them wraps those two. **`actions`** — a control on the title's line, empty by default, because a masthead's built-in action region is the meta line below. Everything the slots do not replace stays shared: the order, the 24px rhythm, the type scale, and the one column every row starts on."
      },
      source: { code: toSfc(IMPORT_WITH_TAG, SLOTS_MARKUP) }
    }
  }
}
