# TemplateBrowser (`platform/view/template-browser`)

> The template catalog people start a project from: a medium page heading with the outlined Documentation action, one `PropertyFilter` that searches the name and the description and filters by Category and Framework, then one section per category (Frameworks, Starters, Functions) with a grid of template tiles. Each tile is a `Card` with the framework mark, the name as a button that opens the preview, two lines of description and the framework `Tag`; the whole tile is the target. The preview is a medium right `Drawer`: the mark and the name in the header, the description, a `KeyValuePairs` of framework, category, repository and last update, and the template's README in a `Card` through `DocProse`; its footer holds View repository and the primary Deploy, which leads to the deploy template flow (`platform/create/deploy-template`), where the deploy runs and reports by toast. The filter lives in the URL through `useCollection`. A search that matches nothing shows No matching templates with Clear filters; while the catalog loads the tiles are skeletons; a catalog that fails to load shows a danger `Alert` with Retry and an Import from Git way out. Built from `PageHeader`, `Button`, `PropertyFilter`, `Card`, `Tag`, `EmptyState`, `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `DrawerTitle`, `DrawerClose`, `PanelHeader`, `PanelContent`, `PanelFooter`, `KeyValuePairs` and `DocProse`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/view/template-browser/template-browser.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/view/template-browser")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [DocProse](../../../components/doc-prose.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, [EmptyState](../../../components/empty-state.md), [KeyValuePairs](../../../components/key-value-pairs.md), [PageHeader](../../../components/page-header.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [PropertyFilter](../../../components/property-filter.md), [Skeleton](../../../components/skeleton.md), [Tag](../../../components/tag.md), `use-collection`
- Skills: `webkit-lists`, `webkit-create-surface`, `webkit-ui-states`

## Asked as

template browser; template gallery; template catalog; start from a template; browse templates; templates by framework; template preview; template readme; deploy a template; starter templates; galeria de templates; catálogo de templates; navegar templates; começar a partir de um template; pré-visualizar template

The catalog of templates a person starts a project from. They arrive from the creation hub, the marketplace or a "Start from a template" link, already knowing roughly what they want (a framework, a kind of site, a small function) and needing to find it, check what it contains and start the deploy. The page is one heading over one band: a single search and filter control, then the templates grouped by category. A tile opens a preview drawer with the facts and the README, and the drawer's Deploy hands off to the deploy template flow, which owns the run and its outcome.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- A gallery of starting points (framework starters, sample sites, small functions) people pick one of and deploy.
- People choose by recognising a framework mark and a name, then confirm by reading what the template contains.
- The catalog is tens of items, small enough to show every match grouped by category without paging.
- The deploy itself happens elsewhere (`platform/create/deploy-template`), so this screen ends on a link.

## When not to use

- The first screen of creation, where templates are one option among import, upload and blank: use `platform/create/create-hub`.
- Installing integrations or extensions into an existing resource: use `platform/view/marketplace`.
- The resources a person already created, as cards: use `platform/view/card-view`.
- Configuring and running the deploy of the chosen template: use `platform/create/deploy-template`.
- Hundreds of items that need paging, sorting and saved preferences: use `platform/view/card-view` with `Cards`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size with the title "Templates" and one sentence of purpose. Its actions slot holds only the outlined medium Documentation `Button`, opening the docs in a new tab. There is no Create action: every template is its own way in.

### B. Search and filter — `PropertyFilter` (required)

One `PropertyFilter` bound with `v-bind="propertyFilterProps"` from `useCollection`, at full width above the sections. Free text searches the name and the description; Category and Framework are properties with `options`, in catalog order. Every token lives in the URL (`url: true`), so a filtered catalog survives a reload and can be shared. There is no second search field and no filter popover.

### C. Category sections — `Card`, `Tag` (required)

One `section` per category that still has matches, labelled by its `h2` in the muted small label style (Frameworks, Starters, Functions), each with a `ul` grid of one to four tiles a row by width. A tile is a `Card` with the framework mark in a 40 px raised box (grey until hover, the `grayscale` to colour shift of the design), the name as an `h3` that holds a button with `aria-haspopup="dialog"`, two lines of description and a small secondary `Tag` with the framework. The button's stretched `after` box makes the whole tile one target, draws the translucent hover wash and the focus ring inside the tile, and leaves the `Card` surface untouched. Tiles in a row share a height.

### D. No matching templates — `EmptyState`, `Button` (required)

When `status` is `no-match`, the sections give way to a medium `EmptyState` with the filter-slash glyph, "No matching templates", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`. The filter keeps its tokens, so the person can see what hid the tiles.

### E. Preview drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `DrawerTitle`, `DrawerClose`, `PanelHeader`, `PanelContent`, `PanelFooter` (required)

A medium right `Drawer` controlled by `v-model:open`, opened by the tile. `PanelHeader` carries the mark, the template name as `DrawerTitle` and `DrawerClose`; `PanelContent` scrolls; `PanelFooter` holds the actions at the end: View repository (outlined, trailing external-link icon, new tab) and the primary Deploy. Deploy is a link to the deploy template flow with the template's id; the drawer never runs the deploy itself.

### F. Template facts — `KeyValuePairs` (required)

Under the description, a two-column `KeyValuePairs` named "Template details": Framework, Category, Repository (in `bdi`) and Updated. Keep it to facts that help choose; settings belong to the deploy form.

### G. README — `Card`, `DocProse` (required)

A `section` labelled by its "README" heading, with the template's README in a `Card` through `DocProse`, so markdown rendered to plain HTML gets the documentation type scale. Headings inside start at `h4`, under the drawer's own headings.

## Do

- Run the catalog on one `useCollection` call with `filtering`, `propertyFiltering` and `url: true`, and bind `propertyFilterProps`.
- Group the matches by category in a fixed order and drop a category with no match.
- Make the tile's name the only interactive element, and stretch it over the tile.
- Show the framework on the tile as text in a `Tag`, not only as the mark.
- Open the preview in a drawer, so the catalog and the filter stay where they were.
- End the preview on Deploy, a link into `platform/create/deploy-template`, and let that flow run the deploy and raise the async-submit toast.
- Keep README headings below the drawer title (`h4` and down).

## Don't

- Don't deploy from the tile or the drawer without the deploy flow; the template needs a scope, a repository name and its settings.
- Don't put a Deploy button on every tile; the preview is where a person confirms the choice.
- Don't page the catalog or add preferences; a grouped list of tens of items reads better whole.
- Don't colour the tile per framework; the mark carries the brand and the surface stays neutral.
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
- The tile's target is a real `button` with `aria-haspopup="dialog"`, named by the template name; the description and the framework follow it in reading order.
- The focus ring is drawn inside the tile on the stretched target, so it is never clipped by the grid.
- The drawer traps focus, is named by `DrawerTitle`, closes on Escape and returns focus to the tile that opened it.
- The `PropertyFilter` is named by its `aria-label` and announces the match count after each change.
- The loading band is `aria-busy`; the failure `Alert` is announced and its Retry is a button.

## States

- Default: the catalog is loaded; the filter, the three category sections of tiles and the preview drawer are wired, and filtering to nothing shows No matching templates with Clear filters.
- Preview: the drawer is open on Next.js Starter with its details, the README, View repository and Deploy.
- NoMatch: the search "kubernetes" matches nothing; the token stays and the empty state offers Clear filters.
- Loading: the filter is disabled and two sections of `Skeleton` tiles (mark, name, two lines, tag) hold the layout in a band that is `aria-busy` and named Loading templates.
- Failed: the catalog could not load; a danger `Alert` reads Couldn't load templates with Retry, and a medium empty state offers Import from Git so a project can still start.

## Related

- `platform/create/deploy-template` — where Deploy leads; it owns the form, the run and the async-submit toast.
- `platform/states/async-submit` — the toast and inline outcome every deploy follows.
- `platform/view/marketplace` — the marketplace page whose Templates tab opens this catalog, and its integrations.
- `platform/create/create-hub` — the creation hub that links here for "Start from a template".
- `Card` and `useCollection` — see `skills/webkit-lists`.

## Variants

- `Default` — primary (the code below)
- `Preview` — The preview drawer open on Next.js Starter: details, the README and the Deploy entry into the deploy template flow.
- `NoMatch` — A search that matches no template: the filter keeps the token and a medium EmptyState offers Clear filters.
- `Loading` — The catalog is loading: the filter is disabled and two sections of skeleton tiles hold the layout.
- `Failed` — The catalog failed to load: a danger Alert with Retry, and an EmptyState that points to Import from Git.

Each variant is the same screen in another state: `get_pattern("platform/view/template-browser", { variant })`, or the file under `blocks/platform/view/template-browser/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Tag from '@aziontech/webkit/tag'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  const CATEGORIES = [
    { id: 'frameworks', label: 'Frameworks' },
    { id: 'starters', label: 'Starters' },
    { id: 'functions', label: 'Functions' }
  ]

  const FRAMEWORKS = {
    next: 'Next.js',
    astro: 'Astro',
    nuxt: 'Nuxt',
    angular: 'Angular',
    hugo: 'Hugo',
    vite: 'Vite',
    hono: 'Hono',
    javascript: 'JavaScript'
  }

  const template = (slug, title, category, framework, icon, description, updated) => ({
    id: slug,
    title,
    category,
    framework,
    icon,
    description,
    updated,
    repository: `example-org/templates/${slug}`
  })

  const templates = [
    template(
      'next-starter',
      'Next.js Starter',
      'frameworks',
      'next',
      'ai ai-next',
      'A Next.js app with server rendering and static pages, ready to deploy.',
      'Oct 28, 2026'
    ),
    template(
      'astro-blog',
      'Astro Blog',
      'frameworks',
      'astro',
      'ai ai-astro',
      'A content-first blog with Markdown posts, an RSS feed and a sitemap.',
      'Oct 21, 2026'
    ),
    template(
      'nuxt-store',
      'Nuxt Storefront',
      'frameworks',
      'nuxt',
      'ai ai-nuxt',
      'A product catalog with a cart, rendered on the server and cached close to buyers.',
      'Oct 14, 2026'
    ),
    template(
      'angular-dashboard',
      'Angular Dashboard',
      'frameworks',
      'angular',
      'ai ai-angular',
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
    filtering: { fields: ['title', 'description'] },
    propertyFiltering: { properties },
    url: true
  })

  const sections = computed(() =>
    CATEGORIES.map((category) => ({
      ...category,
      items: items.value.filter((item) => item.category === category.id)
    })).filter((section) => section.items.length)
  )

  const selected = ref(templates[0])
  const previewOpen = ref(false)
  const openPreview = (item) => {
    selected.value = item
    previewOpen.value = true
  }
  const categoryLabel = (id) => CATEGORIES.find((category) => category.id === id)?.label ?? id
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
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/templates"
            target="_blank"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <PropertyFilter
          v-bind="propertyFilterProps"
          placeholder="Search templates"
          aria-label="Search templates"
        />

        <EmptyState
          v-if="status === 'no-match'"
          size="medium"
          icon="pi pi-filter-slash"
          title="No matching templates"
          description="No template matches this search. Remove a filter to widen the results."
        >
          <template #actions>
            <Button
              label="Clear filters"
              kind="outlined"
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
              class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            >
              <li
                v-for="item in section.items"
                :key="item.id"
                class="group flex min-w-0"
              >
                <Card class="w-full">
                  <template #content>
                    <div class="flex flex-col items-start gap-(--spacing-md)">
                      <span
                        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                      >
                        <i
                          :class="item.icon"
                          class="text-body-lg leading-none text-(--text-default) grayscale transition group-hover:grayscale-0 motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                      </span>
                      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                        <h3 class="text-label-md text-(--text-default)">
                          <button
                            type="button"
                            class="cursor-pointer border-0 bg-transparent p-0 text-start text-(--text-default) outline-none after:absolute after:inset-0 after:transition-colors after:content-[''] hover:after:bg-(--bg-hover) focus-visible:after:ring-2 motion-reduce:after:transition-none focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
                            aria-haspopup="dialog"
                            @click="openPreview(item)"
                          >
                            {{ item.title }}
                          </button>
                        </h3>
                        <p class="m-0 line-clamp-2 text-pretty text-body-sm text-(--text-muted)">
                          {{ item.description }}
                        </p>
                      </div>
                      <Tag
                        :label="FRAMEWORKS[item.framework]"
                        severity="secondary"
                        size="small"
                      />
                    </div>
                  </template>
                </Card>
              </li>
            </ul>
          </section>
        </template>
      </section>
    </div>

    <Drawer
      v-model:open="previewOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <PanelHeader class="w-full">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  :class="selected.icon"
                  class="text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <DrawerTitle>{{ selected.title }}</DrawerTitle>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <div class="flex flex-col gap-(--layout-section-gap)">
              <p class="m-0 text-body-sm text-(--text-muted)">{{ selected.description }}</p>

              <KeyValuePairs
                :columns="2"
                aria-label="Template details"
              >
                <KeyValuePairs.Item label="Framework">{{
                  FRAMEWORKS[selected.framework]
                }}</KeyValuePairs.Item>
                <KeyValuePairs.Item label="Category">{{
                  categoryLabel(selected.category)
                }}</KeyValuePairs.Item>
                <KeyValuePairs.Item label="Repository"
                  ><bdi>{{ selected.repository }}</bdi></KeyValuePairs.Item
                >
                <KeyValuePairs.Item label="Updated">{{ selected.updated }}</KeyValuePairs.Item>
              </KeyValuePairs>

              <section
                class="flex flex-col gap-(--layout-group-gap)"
                aria-labelledby="template-readme"
              >
                <h3
                  id="template-readme"
                  class="text-heading-xxs text-(--text-default)"
                >
                  README
                </h3>
                <Card>
                  <template #content>
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
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
              <Button
                label="View repository"
                icon="pi pi-external-link"
                icon-position="trailing"
                kind="outlined"
                size="medium"
                :href="`https://example.com/${selected.repository}`"
                target="_blank"
              />
              <Button
                label="Deploy"
                icon="pi pi-cloud-upload"
                kind="primary"
                size="medium"
                :href="`/create/deploy?template=${selected.id}`"
              />
            </div>
          </PanelFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
```
