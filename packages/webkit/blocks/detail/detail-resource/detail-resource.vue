<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed } from 'vue'

  import ResourceGetStarted from './parts/resource-get-started.vue'
  import ResourceSummaryCard from './parts/resource-summary-card.vue'
  import ResourceTabBar from './parts/resource-tab-bar.vue'
  import TabRouteEmpty from './parts/tab-route-empty.vue'
  import { resourceTabs, sampleResource } from './sample'

  /** A tab of the resource page. */
  export type ResourceDetailTab = 'overview' | 'versions' | 'build' | 'deployments'

  /** The resource the page shows. */
  export interface ResourceDetailResource {
    /** Slug name, used in the tab routes and the CLI link command. */
    name: string
    /** The live address, without the scheme; Visit and both address links open it. */
    domain: string
    /** The deployment that serves the address, linked to its page; empty when it was never deployed, which shows the Not deployed yet state. */
    deploymentId: string
    /** The environment of that deployment, shown as a tag. */
    environment: string
    /** The status label. */
    status: string
    /** The status color. */
    statusSeverity: StatusIndicatorSeverity
    /** When the resource was created, shown as a relative time. */
    createdAt: Date
    /** Who created it, shown with an avatar. */
    createdBy: string
    /** The framework preset label. */
    framework: string
    /** The framework icon class, a colored icon such as az-color az-nextjs. */
    frameworkIcon: string
  }

  export interface ResourceDetailProps {
    /** The resource the page shows. Left out, the sample renders. */
    resource?: ResourceDetailResource
  }

  const props = withDefaults(defineProps<ResourceDetailProps>(), {
    resource: undefined
  })

  const emit = defineEmits<{
    'resource-action': [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: DropdownMenuItemValue
    ]
    'connect-repository': [event: MouseEvent]
  }>()

  const activeTab = defineModel<ResourceDetailTab>('tab', { default: 'overview' })

  const resource = computed<ResourceDetailResource>(() => props.resource ?? sampleResource)

  const { formatRelativeTime } = useLocale()
  const created = computed(
    () => `${formatRelativeTime(resource.value.createdAt)} by ${resource.value.createdBy}`
  )

  const tabLabel = computed(
    () => resourceTabs.find((tab) => tab.value === activeTab.value)?.label ?? ''
  )
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <h1 class="sr-only">{{ resource.name }}</h1>
    <ResourceTabBar
      v-model="activeTab"
      :tabs="resourceTabs"
    />

    <div
      v-if="activeTab === 'overview'"
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <section class="min-h-0 flex-1">
        <div class="flex min-h-full flex-col">
          <div class="layout-column layout-boundary flex min-w-0 flex-col">
            <section
              class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
            >
              <ResourceSummaryCard
                :resource="resource"
                :created="created"
                @action="(event, value) => emit('resource-action', event, value)"
              >
                <template #source>
                  <Button
                    variant="link"
                    label="Connect Git repository"
                    @click="(event: MouseEvent) => emit('connect-repository', event)"
                  />
                </template>
                <p
                  class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
                >
                  To deploy to Production, drop your project anywhere on this page, connect Git, or
                  run
                  <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)"
                    >platform deploy</code
                  >
                  via the CLI.
                </p>
              </ResourceSummaryCard>

              <ResourceGetStarted :name="resource.name" />
            </section>
          </div>
        </div>
      </section>
    </div>
    <div
      v-else
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <TabRouteEmpty
        :label="tabLabel"
        :href="`/resources/${resource.name}/${activeTab}`"
      />
    </div>
  </div>
</template>
