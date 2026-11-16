# TemplateBrowser (`view/template-browser`)

> The template catalog people start a project from: a medium page heading with the outlined Documentation action, one `PropertyFilter` that searches the name and the description and filters by Category and Framework, then one section per category (Frameworks, Starters, Functions) with a grid of template tiles. Each tile is a `Card variant="integration"` with the framework mark, the name as a button that opens the preview, two lines of description and the framework as a badge; the whole tile is the target, and the grid follows the content width through container queries. The preview is a large right `Drawer`: the mark and the name in the header, the description, a `KeyValueList` of framework, category, repository and last update, and the template's README in a `Card` through `DocProse`; its footer holds View repository and the primary Deploy, which leads to the deploy template flow (`create/deploy-template`), where the deploy runs and reports by toast. The filter lives in the URL through `useCollection`. A search that matches nothing shows No matching templates with Clear filters; while the catalog loads the tiles are skeletons; a catalog that fails to load shows a danger `Alert` with Retry and an Import from Git way out. Built from `PageHeader`, `Button`, `PropertyFilter`, `Card`, `EmptyState`, `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `PanelBody`, `PanelFooter`, `KeyValueList` and `DocProse`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/view/template-browser/template-browser.vue` in `@aziontech/webkit`
- MCP: `get_block("view/template-browser")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [DocProse](../../components/doc-prose.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [EmptyState](../../components/empty-state.md), [KeyValueList](../../components/key-value-list.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PropertyFilter](../../components/property-filter.md), [Skeleton](../../components/skeleton.md), `use-collection`
- Skills: `webkit-lists`, `webkit-create-surface`, `webkit-ui-states`

## Asked as

template browser; template gallery; template catalog; start from a template; browse templates; templates by framework; template preview; template readme; deploy a template; starter templates; galeria de templates; catálogo de templates; navegar templates; começar a partir de um template; pré-visualizar template; template marketplace; search templates; templates catalog; project templates; pick a template

The catalog of templates a person starts a project from. They arrive from the creation hub or a "Start from a template" link, already knowing roughly what they want (a framework, a kind of site, a small function) and needing to find it, check what it contains and start the deploy. The page is one heading over one band: a single search and filter control, then the templates grouped by category. A tile opens a preview drawer with the facts and the README, and the drawer's Deploy hands off to the deploy template flow, which owns the run and its outcome.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/console`), which owns the rail, the header and the `main`.

## When to use

- Use template-browser for the catalog of templates a project starts from; it is the one product template catalog.
- A gallery of starting points (framework starters, sample sites, small functions) people pick one of and deploy.
- People choose by recognising a framework mark and a name, then confirm by reading what the template contains.
- The catalog is tens of items, small enough to show every match grouped by category without paging.
- The deploy itself happens elsewhere (`create/deploy-template`), so this screen ends on a link.

## When not to use

- The first screen of creation, where templates are one option among import, upload and blank: use `create/create-hub`.
- Installing integrations or extensions into an existing resource: use `view/marketplace`.
- The resources a person already created, as cards: use `view/card-view`.
- Configuring and running the deploy of the chosen template: use `create/deploy-template`.
- Hundreds of items that need paging, sorting and saved preferences: use `view/card-view` with `CardList`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size with the title "Templates" and one sentence of purpose. Its actions slot holds only the outlined medium Documentation `Button`, opening the docs in a new tab. There is no Create action: every template is its own way in.

### B. Search and filter — `PropertyFilter` (required)

One `PropertyFilter` bound with `v-bind="propertyFilterProps"` from `useCollection`, at full width above the sections. Free text searches the name and the description; Category and Framework are properties with `options`, in catalog order. Every token lives in the URL (`url: true`), so a filtered catalog survives a reload and can be shared. There is no second search field and no filter popover.

### C. Category sections — `Card` (required)

One `section` per category that still has matches, labelled by its `h2` in the muted small label style (Frameworks, Starters, Functions), each with a `ul` grid of one to four tiles a row by the width of the content (container queries on the `@container/templates` section, so an open rail does not overstate the room). A tile is a `Card variant="integration"`: the framework mark as its `logo` (colour marks use `ai-color`, and the black Next.js mark inverts in dark), the name as an `h3` holding a button that emits `select` and opens the preview, two lines of description and the framework as a secondary badge. The title's stretched target makes the whole tile one target with the hover wash and the focus ring inside the tile; the markup lives in `Card`, not in the block. Tiles in a row share a height.

### D. No matching templates — `EmptyState`, `Button` (required)

When `status` is `no-match`, the sections give way to a medium `EmptyState` with the filter-slash glyph, "No matching templates", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`. The filter keeps its tokens, so the person can see what hid the tiles.

### E. Preview drawer — `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `PanelBody`, `PanelFooter` (required)

A large right `Drawer` controlled by `v-model:open`, opened by the tile. `PanelHeader` carries the mark, the template name as `DrawerTitle` and the drawer's own close button; `PanelBody` scrolls; `PanelFooter` holds the actions at the end: View repository (outlined, trailing external-link icon, new tab) and the primary Deploy. Deploy is a link to the deploy template flow with the template's id; the drawer never runs the deploy itself.

### F. Template facts — `KeyValueList` (required)

Under the description, a two-column `KeyValueList` named "Template details": Framework, Category, Repository (in `bdi`) and Updated. Keep it to facts that help choose; settings belong to the deploy form.

### G. README — `Card`, `DocProse` (required)

A `section` labelled by its "README" heading, with the template's README in a `Card` through `DocProse`, so markdown rendered to plain HTML gets the documentation type scale. Headings inside start at `h4`, under the drawer's own headings.

### H. Loading catalog — `Card`, `Skeleton` (required)

While `loading` is set, the band is `aria-busy` and named Loading templates: the filter is disabled and two sections of `Card`s holding `Skeleton` shapes (mark, name, two lines, the tag) hold the layout, under a `Skeleton` in place of each category heading.

### I. Failed catalog — `Alert`, `EmptyState`, `Button` (required)

When `error` is set, the sections give way to a danger `Alert` with the message and Retry, and a medium `EmptyState`, "Templates are unavailable", whose secondary small Import from Git `Button` still starts a project.

## Data

The block takes its records through props and emits every action; it fetches nothing. `TemplateBrowserTemplate` and `TemplateBrowserProps` are exported from `template-browser.vue`, and `sample.ts` holds the sample catalog the block renders when `templates` is left out (and never while `loading` or `error` is set).

| Prop             | Type                        | What it does                                                                                           |
| ---------------- | --------------------------- | ------------------------------------------------------------------------------------------------------ |
| `templates`      | `TemplateBrowserTemplate[]` | The catalog; the search, the properties and the category sections run on it in the browser.            |
| `loading`        | `boolean`                   | The catalog is loading: the filter disables and two sections of skeleton tiles hold the layout.        |
| `error`          | `string`                    | Why the catalog failed to load, shown in the danger `Alert` with Retry over the Import from Git state. |
| `defaultText`    | `string`                    | Search text the filter starts with.                                                                    |
| `defaultPreview` | `string`                    | Id of the template whose preview drawer starts open.                                                   |

| Event    | Payload             | When                                     |
| -------- | ------------------- | ---------------------------------------- |
| `select` | `(event, template)` | A tile was activated; its preview opens. |
| `retry`  | `(event)`           | Retry in the error alert.                |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import TemplateBrowser from './template-browser.vue'

  const { data, pending, error, refresh } = useTemplates()
  const loadError = "Couldn't load templates. Check your connection and retry."
</script>

<template>
  <TemplateBrowser
    :templates="data ?? []"
    :loading="pending"
    :error="error ? loadError : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Run the catalog on one `useCollection` call with `filtering`, `propertyFiltering` and `url: true`, and bind `propertyFilterProps`.
- Group the matches by category in a fixed order and drop a category with no match.
- Make the tile's name the only interactive element, and stretch it over the tile.
- Show the framework on the tile as text in a badge, not only as the mark.
- Open the preview in a drawer, so the catalog and the filter stay where they were.
- End the preview on Deploy, a link into `create/deploy-template`, and let that flow run the deploy and raise the async-submit toast.
- Keep README headings below the drawer title (`h4` and down).

## Don't

- Don't deploy from the tile or the drawer without the deploy flow; the template needs a scope, a repository name and its settings.
- Don't put a Deploy button on every tile; the preview is where a person confirms the choice.
- Don't page the catalog or add preferences; a grouped list of tens of items reads better whole.
- Don't colour the tile per framework; the surface stays neutral and the brand shows only in the mark.
- Don't hide the filter while loading or after a failure; disable it, so the page keeps its shape.
- Don't show the README as raw markdown or in a code block.

## Copy

- **Title:** "Templates". Description: one sentence with a period, e.g. "Start a project from a template and deploy it in a few steps."
- **Filter:** placeholder and `aria-label` "Search templates".
- **Sections:** the category in title case, plural: "Frameworks", "Starters", "Functions".
- **Tile:** the template name as its owner writes it, e.g. "Next.js Starter"; a description of one sentence, under two lines.
- **Drawer actions:** "View repository", "Deploy".
- **No match:** "No matching templates", then "No template matches this search. Remove a filter to widen the results.", and "Clear filters".
- **Failure:** "Couldn't load templates. Check your connection and retry." with "Retry"; the empty state "Templates are unavailable" with "Import from Git".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The layout owns the one `main` landmark; the `PageHeader` title is the only `h1`, each category is an `h2`, each tile name an `h3`.
- Each category is a `section` labelled by its heading and holds a `ul`, so the count of templates is announced.
- The tile's target is a real `button` named by the template name; the description and the framework follow it in reading order.
- The focus ring is drawn inside the tile on the stretched target, so it is never clipped by the grid.
- The drawer traps focus, is named by `DrawerTitle`, closes on Escape and returns focus to the tile that opened it.
- The `PropertyFilter` is named by its `aria-label` and announces the match count after each change.
- The loading band is `aria-busy`; the failure `Alert` is announced and its Retry is a button.

## States

- Default: `templates`, or the sample; the catalog is loaded; the filter, the three category sections of tiles and the preview drawer are wired, and filtering to nothing shows No matching templates with Clear filters.
- Preview: `defaultPreview="next-starter"`; the drawer is open on Next.js Starter with its details, the README, View repository and Deploy.
- NoMatch: `defaultText="kubernetes"`; the search "kubernetes" matches nothing; the token stays and the empty state offers Clear filters.
- Loading: `loading`; the filter is disabled and two sections of `Skeleton` tiles (mark, name, two lines, tag) hold the layout in a band that is `aria-busy` and named Loading templates.
- Error: `error`; the catalog could not load; a danger `Alert` shows the message, e.g. Couldn't load templates with Retry, and a medium empty state offers Import from Git so a project can still start.

## Related

- `create/deploy-template` — where Deploy leads; it owns the form, the run and the async-submit toast.
- `state/async-submit` — the toast and inline outcome every deploy follows.
- `view/marketplace` — installable integrations into an existing resource; it lists no templates.
- `create/create-hub` — the creation hub that links here for "Start from a template".
- `Card` and `useCollection` — see `skills/webkit-lists`.

## Variants

- `Default` — primary (the code below)
- `Preview` — The preview drawer open on Next.js Starter: details, the README and the Deploy entry into the deploy template flow.
- `NoMatch` — A search that matches no template: the filter keeps the token and a medium EmptyState offers Clear filters.
- `Loading` — The catalog is loading: the filter is disabled and two sections of skeleton tiles hold the layout.
- `Error` — The catalog failed to load: a danger Alert with Retry, and an EmptyState that points to Import from Git.

Each variant is the same screen in another state: `get_block("view/template-browser", { variant })`, or the file under `blocks/view/template-browser/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DocProse from '@aziontech/webkit/doc-prose'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  import { sampleTemplates } from './sample'

  /** Where a template is grouped in the catalog. */
  export type TemplateBrowserCategory = 'frameworks' | 'starters' | 'functions'

  /** The framework a template is built on, shown as its badge and in the preview. */
  export type TemplateBrowserFramework =
    'next' | 'astro' | 'nuxt' | 'angular' | 'hugo' | 'vite' | 'hono' | 'javascript'

  /** One template of the catalog. */
  export interface TemplateBrowserTemplate {
    /** Stable slug, passed to the deploy flow. */
    id: string
    /** The name on the tile and the drawer title. */
    title: string
    /** The section the tile is listed in. */
    category: TemplateBrowserCategory
    /** The framework badge and fact. */
    framework: TemplateBrowserFramework
    /** Icon classes of the framework mark. */
    icon: string
    /** One sentence on the tile and in the preview. */
    description: string
    /** When the template changed last, as display text. */
    updated: string
    /** Repository path, linked from View repository. */
    repository: string
  }

  export interface TemplateBrowserProps {
    /** The catalog; filtered in the browser. Left out, the sample renders. */
    templates?: TemplateBrowserTemplate[]
    /** The catalog is loading: the filter disables and skeleton tiles hold the layout. */
    loading?: boolean
    /** Why the catalog could not load, shown in the danger alert with Retry. */
    error?: string
    /** Search text the filter starts with. */
    defaultText?: string
    /** Id of the template whose preview starts open. */
    defaultPreview?: string
  }

  const props = withDefaults(defineProps<TemplateBrowserProps>(), {
    templates: undefined,
    loading: false,
    error: '',
    defaultText: '',
    defaultPreview: ''
  })

  const emit = defineEmits<{
    select: [event: MouseEvent, template: TemplateBrowserTemplate]
    retry: [event: MouseEvent]
  }>()

  const CATEGORIES: { id: TemplateBrowserCategory; label: string }[] = [
    { label: 'Frameworks', id: 'frameworks' },
    { label: 'Starters', id: 'starters' },
    { label: 'Functions', id: 'functions' }
  ]

  const FRAMEWORKS: Record<TemplateBrowserFramework, string> = {
    next: 'Next.js',
    astro: 'Astro',
    nuxt: 'Nuxt',
    angular: 'Angular',
    hugo: 'Hugo',
    vite: 'Vite',
    hono: 'Hono',
    javascript: 'JavaScript'
  }

  const MARKS: Partial<Record<TemplateBrowserFramework, string>> = {
    next: '[[data-theme=dark]_&]:invert'
  }

  const templates = computed<TemplateBrowserTemplate[]>(
    () => props.templates ?? (props.loading || props.error ? [] : sampleTemplates)
  )
  const blocked = computed(() => props.loading || props.error !== '')

  const properties = [
    { key: 'title', label: 'Name' },
    {
      key: 'category',
      label: 'Category',
      options: CATEGORIES.map((category) => ({ value: category.id, label: category.label }))
    },
    {
      key: 'framework',
      label: 'Framework',
      options: Object.entries(FRAMEWORKS).map(([value, label]) => ({ value, label }))
    }
  ]

  const { items, propertyFilterProps, status, clearFilters } = useCollection({
    items: templates,
    filtering: { fields: ['title', 'description'], defaultText: props.defaultText },
    propertyFiltering: { properties },
    url: true
  })

  const sections = computed(() =>
    CATEGORIES.map((category) => ({
      ...category,
      items: items.value.filter((item) => item.category === category.id)
    })).filter((section) => section.items.length)
  )

  const loadingSections = [
    { tiles: 6, id: 'frameworks' },
    { tiles: 3, id: 'starters' }
  ]

  const initial = templates.value.find((item) => item.id === props.defaultPreview)
  const selected = ref<TemplateBrowserTemplate | undefined>(initial ?? templates.value[0])
  const previewOpen = ref(initial !== undefined)
  const openPreview = (event: MouseEvent, item: TemplateBrowserTemplate) => {
    selected.value = item
    previewOpen.value = true
    emit('select', event, item)
  }
  const categoryLabel = (id: string) =>
    CATEGORIES.find((category) => category.id === id)?.label ?? id
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Templates"
        description="Start a project from a template and deploy it in a few steps."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="ai ai-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/templates"
            target="_blank"
          />
        </template>
      </PageHeader>

      <section
        class="@container/templates layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
        :aria-busy="loading || undefined"
        :aria-label="loading ? 'Loading templates' : undefined"
      >
        <PropertyFilter
          v-bind="propertyFilterProps"
          placeholder="Search templates"
          aria-label="Search templates"
          :disabled="blocked"
        />

        <template v-if="loading">
          <div
            v-for="section in loadingSections"
            :key="section.id"
            class="flex min-w-0 flex-col gap-(--layout-group-gap)"
          >
            <Skeleton
              width="6rem"
              height="1rem"
            />
            <ul
              class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 @xl/templates:grid-cols-2 @4xl/templates:grid-cols-3 @7xl/templates:grid-cols-4"
            >
              <li
                v-for="tile in section.tiles"
                :key="tile"
                class="flex min-w-0"
              >
                <Card class="w-full">
                  <template #default>
                    <div class="flex flex-col items-start gap-(--spacing-md)">
                      <Skeleton
                        width="2.5rem"
                        height="2.5rem"
                      />
                      <div class="flex w-full flex-col gap-(--spacing-xs)">
                        <Skeleton
                          width="60%"
                          height="1rem"
                        />
                        <Skeleton height="0.875rem" />
                        <Skeleton
                          width="80%"
                          height="0.875rem"
                        />
                      </div>
                      <Skeleton
                        width="4rem"
                        height="1.25rem"
                      />
                    </div>
                  </template>
                </Card>
              </li>
            </ul>
          </div>
        </template>

        <template v-else-if="error">
          <Alert
            severity="danger"
            :label="error"
            action-label="Retry"
            @action="(event: MouseEvent) => emit('retry', event)"
          />
          <EmptyState
            size="medium"
            icon="ai ai-layout-grid"
            title="Templates are unavailable"
            description="The catalog shows here once it loads. You can still deploy from your own repository."
          >
            <template #actions>
              <Button
                label="Import from Git"
                icon="ai ai-github"
                variant="secondary"
                size="small"
                href="/create/import"
              />
            </template>
          </EmptyState>
        </template>

        <EmptyState
          v-else-if="status === 'no-match'"
          size="medium"
          icon="ai ai-filter-off"
          title="No matching templates"
          description="No template matches this search. Remove a filter to widen the results."
        >
          <template #actions>
            <Button
              label="Clear filters"
              variant="outline"
              size="small"
              @click="clearFilters"
            />
          </template>
        </EmptyState>

        <template v-else>
          <section
            v-for="section in sections"
            :key="section.id"
            class="flex min-w-0 flex-col gap-(--layout-group-gap)"
            :aria-labelledby="`templates-${section.id}`"
          >
            <h2
              :id="`templates-${section.id}`"
              class="text-label-sm text-(--text-muted)"
            >
              {{ section.label }}
            </h2>
            <ul
              class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 @xl/templates:grid-cols-2 @4xl/templates:grid-cols-3 @7xl/templates:grid-cols-4"
            >
              <li
                v-for="item in section.items"
                :key="item.id"
                class="flex min-w-0"
              >
                <Card
                  variant="integration"
                  class="w-full"
                  :title="item.title"
                  :logo="[item.icon, MARKS[item.framework]].filter(Boolean).join(' ')"
                  :description="item.description"
                  :badges="[{ label: FRAMEWORKS[item.framework], severity: 'neutral' }]"
                  @select="(event: MouseEvent) => openPreview(event, item)"
                />
              </li>
            </ul>
          </section>
        </template>
      </section>
    </div>

    <Drawer
      v-if="selected"
      v-model:open="previewOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)">
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
            >
              <i
                :class="[selected.icon, MARKS[selected.framework]]"
                class="text-body-lg leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </span>
            <DrawerTitle>{{ selected.title }}</DrawerTitle>
          </div>
        </PanelHeader>

        <PanelBody>
          <div class="flex flex-col gap-(--layout-section-gap)">
            <p class="m-0 text-body-sm text-(--text-muted)">{{ selected.description }}</p>

            <KeyValueList
              :columns="2"
              aria-label="Template details"
            >
              <KeyValueList.Item label="Framework">{{
                FRAMEWORKS[selected.framework]
              }}</KeyValueList.Item>
              <KeyValueList.Item label="Category">{{
                categoryLabel(selected.category)
              }}</KeyValueList.Item>
              <KeyValueList.Item label="Repository"
                ><bdi>{{ selected.repository }}</bdi></KeyValueList.Item
              >
              <KeyValueList.Item label="Updated">{{ selected.updated }}</KeyValueList.Item>
            </KeyValueList>

            <section
              class="flex flex-col gap-(--layout-group-gap)"
              aria-labelledby="template-readme"
            >
              <h3
                id="template-readme"
                class="text-heading-2xs text-(--text-default)"
              >
                README
              </h3>
              <Card>
                <template #default>
                  <DocProse>
                    <p>{{ selected.description }}</p>
                    <h4>Deploy</h4>
                    <p>
                      Deploy creates a copy of this repository in your Git account, builds it and
                      publishes it. Every push to the main branch deploys again.
                    </p>
                    <h4>Run it locally</h4>
                    <pre><code>npm install
npm run dev</code></pre>
                    <h4>Settings</h4>
                    <ul>
                      <li>The build command and the output folder are read from the project.</li>
                      <li>Environment variables can be added after the first deploy.</li>
                    </ul>
                  </DocProse>
                </template>
              </Card>
            </section>
          </div>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              label="View repository"
              icon="ai ai-external-link"
              icon-position="trailing"
              variant="outline"
              size="medium"
              :href="`https://example.com/${selected.repository}`"
              target="_blank"
            />
            <Button
              label="Deploy"
              icon="ai ai-cloud-upload"
              variant="primary"
              size="medium"
              :href="`/create/deploy?template=${selected.id}`"
            />
          </div>
        </PanelFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
```

## `sample.ts`

```ts
import type {
  TemplateBrowserCategory,
  TemplateBrowserFramework,
  TemplateBrowserTemplate
} from './template-browser.vue'

const template = (
  slug: string,
  title: string,
  category: TemplateBrowserCategory,
  framework: TemplateBrowserFramework,
  icon: string,
  description: string,
  updated: string
): TemplateBrowserTemplate => ({
  id: slug,
  title,
  category,
  framework,
  icon,
  description,
  updated,
  repository: `example-org/templates/${slug}`
})

export const sampleTemplates: TemplateBrowserTemplate[] = [
  template(
    'next-starter',
    'Next.js Starter',
    'frameworks',
    'next',
    'ai-color ai-nextjs',
    'A Next.js app with server rendering and static pages, ready to deploy.',
    'Oct 28, 2026'
  ),
  template(
    'astro-blog',
    'Astro Blog',
    'frameworks',
    'astro',
    'ai-color ai-astro',
    'A content-first blog with Markdown posts, an RSS feed and a sitemap.',
    'Oct 21, 2026'
  ),
  template(
    'nuxt-store',
    'Nuxt Storefront',
    'frameworks',
    'nuxt',
    'ai-color ai-nuxt',
    'A product catalog with a cart, rendered on the server and cached close to buyers.',
    'Oct 14, 2026'
  ),
  template(
    'angular-dashboard',
    'Angular Dashboard',
    'frameworks',
    'angular',
    'ai-color ai-angular',
    'A single-page admin dashboard with routing and lazy-loaded modules.',
    'Sep 30, 2026'
  ),
  template(
    'hugo-docs',
    'Hugo Docs',
    'frameworks',
    'hugo',
    'ai ai-hugo',
    'A documentation site with search, versioned sections and dark mode.',
    'Sep 22, 2026'
  ),
  template(
    'static-site',
    'Static Site',
    'starters',
    'vite',
    'ai ai-edge-storage',
    'Publish a folder of built files and serve it from the closest location.',
    'Nov 2, 2026'
  ),
  template(
    'reverse-proxy',
    'Reverse Proxy',
    'starters',
    'javascript',
    'ai ai-edge-connectors',
    'Front an origin you already run and pass every request on to it.',
    'Oct 30, 2026'
  ),
  template(
    'rest-api',
    'REST API',
    'starters',
    'hono',
    'ai ai-hono',
    'A small JSON API with routing, validation and a key-value store.',
    'Oct 18, 2026'
  ),
  template(
    'hello-function',
    'Hello Function',
    'functions',
    'javascript',
    'ai ai-edge-functions',
    'The smallest function that answers a request, to see how a deploy works.',
    'Nov 4, 2026'
  ),
  template(
    'ab-test',
    'A/B Test',
    'functions',
    'javascript',
    'ai ai-edge-functions',
    'Split traffic between two versions of a page with a sticky cookie.',
    'Oct 9, 2026'
  ),
  template(
    'geo-redirect',
    'Geo Redirect',
    'functions',
    'javascript',
    'ai ai-edge-functions',
    'Send visitors to the regional version of a site from their location.',
    'Sep 27, 2026'
  )
]
```
