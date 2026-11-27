<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import DocProse from '@aziontech/ui/doc-prose'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import EmptyState from '@aziontech/ui/empty-state'
  import IntegrationCard from '@aziontech/ui/integration-card'
  import KeyValueList from '@aziontech/ui/key-value-list'
  import PageHeader from '@aziontech/ui/page-header'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import PropertyFilter from '@aziontech/ui/property-filter'
  import Skeleton from '@aziontech/ui/skeleton'
  import { useCollection } from '@aziontech/ui/use-collection'
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
    /** Search text the filter starts with, shown as a free-text token. */
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
    filtering: { fields: ['title', 'description'] },
    propertyFiltering: {
      properties,
      defaultQuery: {
        tokens: props.defaultText ? [{ operator: ':', value: props.defaultText }] : [],
        operation: 'and'
      }
    },
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
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
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
            icon="az az-layout-grid"
            title="Templates are unavailable"
            description="The catalog shows here once it loads. You can still deploy from your own repository."
          >
            <template #actions>
              <Button
                label="Import from Git"
                icon="az az-github"
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
          icon="az az-filter-off"
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
                <IntegrationCard
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
              aria-label="View repository (opens in a new tab)"
              icon="az az-external-link"
              icon-position="trailing"
              variant="outline"
              size="medium"
              :href="`https://example.com/${selected.repository}`"
              target="_blank"
            />
            <Button
              label="Deploy"
              icon="az az-cloud-upload"
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
