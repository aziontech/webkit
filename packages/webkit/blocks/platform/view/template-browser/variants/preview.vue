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
  const previewOpen = ref(true)
  const openPreview = (item) => {
    selected.value = item
    previewOpen.value = true
  }
  const categoryLabel = (id) => CATEGORIES.find((category) => category.id === id)?.label ?? id
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-h-full flex-col">
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
    </main>

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
