<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Checkbox from '@aziontech/webkit/checkbox'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import OverflowCount from '@aziontech/webkit/overflow-count'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  interface DeploymentSetting {
    id: string
    name: string
    policy: string
    environments: string[]
    workloads: number | null
    shared?: boolean
    managed?: boolean
  }

  interface SettingsGroup {
    key: string
    label: string
    selectable: boolean
    notice?: string
    action?: string
    href?: string
    items: DeploymentSetting[]
  }

  const ENVIRONMENT_LIMIT = 3

  const groups: SettingsGroup[] = [
    {
      key: 'yours',
      label: 'Your Deployment Settings',
      selectable: true,
      items: [
        {
          id: 'storefront-shared',
          name: 'storefront-shared',
          policy: 'Flexible binding · Deploys on release',
          environments: ['Production', 'Staging', 'Preview', 'QA', 'Load test'],
          workloads: 4,
          shared: true
        },
        {
          id: 'web-app-production',
          name: 'web-app-production',
          policy: 'Strict binding · Deploys on release',
          environments: ['Production'],
          workloads: 1
        },
        {
          id: 'api-staging',
          name: 'api-staging',
          policy: 'Flexible binding · Manual approval',
          environments: ['Staging'],
          workloads: 0
        },
        {
          id: 'docs-preview',
          name: 'docs-preview',
          policy: 'Flexible binding · Deploys on release',
          environments: ['Preview'],
          workloads: null
        }
      ]
    },
    {
      key: 'managed',
      label: 'Managed',
      selectable: true,
      items: [
        {
          id: 'default-settings',
          name: 'default-settings',
          policy: 'Flexible binding · Deploys on release',
          environments: ['Production', 'Preview'],
          workloads: 12,
          managed: true
        }
      ]
    },
    {
      key: 'inactive',
      label: 'Inactive',
      selectable: false,
      notice: 'Activate this Deployment Setting before a release can deploy with it.',
      action: 'Activate in Deployment Settings',
      href: 'https://example.com/deployment-settings/legacy-checkout',
      items: [
        {
          id: 'legacy-checkout',
          name: 'legacy-checkout',
          policy: 'Strict binding · Manual approval',
          environments: ['Production'],
          workloads: 2
        }
      ]
    }
  ]

  const search = ref('')
  const selected = ref<string[]>(['storefront-shared'])

  const total = groups.reduce((sum, group) => sum + group.items.length, 0)

  const visibleGroups = computed(() => {
    const query = search.value.trim().toLowerCase()
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((entry) => entry.name.toLowerCase().includes(query))
      }))
      .filter((group) => group.items.length)
  })

  const selectableIds = computed(() =>
    visibleGroups.value
      .filter((group) => group.selectable)
      .flatMap((group) => group.items.map((entry) => entry.id))
  )

  const allSelected = computed(
    () =>
      selectableIds.value.length > 0 &&
      selectableIds.value.every((id) => selected.value.includes(id))
  )

  const selectAll = () => {
    selected.value = [...new Set([...selected.value, ...selectableIds.value])]
  }

  const extraEnvironments = (entry: DeploymentSetting) =>
    entry.environments.slice(ENVIRONMENT_LIMIT)

  const workloadsLine = (count: number) =>
    count
      ? `${count} ${count === 1 ? 'workload' : 'workloads'} affected`
      : 'No workloads deploy with it yet'
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
    <main class="flex min-h-0 flex-1 flex-col">
      <div
        class="layout-column-focused layout-boundary flex min-w-0 flex-1 flex-col gap-(--layout-section-gap)"
      >
        <PageHeader
          title="Select Deployment Settings"
          description="A Deployment Setting binds a service, and optionally a firewall and an error page. Selecting one deploys into every environment and workload that uses it."
          size="large"
        />

        <section
          aria-labelledby="release-impact-settings"
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
        >
          <h2
            id="release-impact-settings"
            class="sr-only"
          >
            Deployment Settings
          </h2>

          <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
            <Input
              v-model="search"
              size="large"
              :placeholder="`Search ${total} Deployment Settings`"
              aria-label="Search Deployment Settings"
              class="min-w-0 grow basis-(--container-2xs)"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <span
                class="text-body-sm text-(--text-muted)"
                aria-live="polite"
              >
                {{ selected.length }} selected
              </span>
              <Button
                label="Select all"
                variant="ghost"
                size="small"
                :disabled="allSelected"
                @click="selectAll"
              />
              <Button
                label="Clear"
                variant="ghost"
                size="small"
                :disabled="!selected.length"
                @click="selected = []"
              />
            </div>
          </div>

          <EmptyState
            v-if="!visibleGroups.length"
            size="small"
            icon="az az-search"
            title="No Deployment Settings match"
            :description="`Nothing is named like “${search}”.`"
          >
            <template #actions>
              <Button
                label="Clear search"
                variant="outline"
                size="small"
                @click="search = ''"
              />
            </template>
          </EmptyState>

          <div
            v-else
            class="flex min-w-0 flex-col gap-(--spacing-lg)"
          >
            <div
              v-for="group in visibleGroups"
              :key="group.key"
              role="group"
              :aria-labelledby="`release-impact-group-${group.key}`"
              class="flex min-w-0 flex-col gap-(--spacing-xs)"
            >
              <h3
                :id="`release-impact-group-${group.key}`"
                class="text-label-sm text-(--text-muted)"
              >
                {{ group.label }}
              </h3>

              <template v-if="group.selectable">
                <div
                  v-for="entry in group.items"
                  :key="entry.id"
                  class="min-w-0"
                >
                  <Field.Label>
                    <Field orientation="horizontal">
                      <Checkbox
                        v-model="selected"
                        :value="entry.id"
                        name="release-deployment-settings"
                      />
                      <Field.Content>
                        <Field.Title>
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <i
                              class="az az-sitemap shrink-0 text-(--text-muted)"
                              aria-hidden="true"
                            />
                            <span class="truncate">{{ entry.name }}</span>
                            <Tag
                              v-if="entry.shared || entry.managed"
                              :label="entry.shared ? 'Shared' : 'Managed'"
                              :severity="entry.shared ? 'warning' : 'neutral'"
                              size="small"
                              class="shrink-0"
                            />
                          </span>
                        </Field.Title>
                        <Field.Description>{{ entry.policy }}</Field.Description>
                        <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-2xs)">
                          <Tag
                            v-for="name in entry.environments.slice(0, ENVIRONMENT_LIMIT)"
                            :key="name"
                            :label="name"
                            severity="neutral"
                            size="small"
                          />
                          <OverflowCount
                            v-if="extraEnvironments(entry).length"
                            :items="extraEnvironments(entry)"
                            :noun="{ one: 'environment', other: 'environments' }"
                          />
                        </span>
                        <span
                          v-if="entry.workloads === null"
                          class="flex"
                        >
                          <span
                            class="flex"
                            aria-hidden="true"
                          >
                            <Skeleton
                              width="var(--size-32)"
                              height="var(--size-4)"
                            />
                          </span>
                          <span class="sr-only">Loading the workloads it affects</span>
                        </span>
                        <span
                          v-else
                          class="text-body-xs text-(--text-muted)"
                        >
                          {{ workloadsLine(entry.workloads) }}
                        </span>
                      </Field.Content>
                    </Field>
                  </Field.Label>
                </div>
              </template>

              <template v-else>
                <div
                  v-for="entry in group.items"
                  :key="entry.id"
                  class="flex min-w-0 flex-col items-start gap-(--spacing-xs) rounded-(--shape-control) border border-dashed border-(--border-muted) p-(--spacing-sm)"
                >
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="az az-circle-alert shrink-0 text-(--warning-foreground)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-(--text-default)">
                      {{ entry.name }}
                    </span>
                    <Tag
                      label="Inactive"
                      severity="neutral"
                      size="small"
                      class="shrink-0"
                    />
                  </span>
                  <p class="text-body-sm text-(--text-muted)">{{ group.notice }}</p>
                  <Button
                    :label="group.action ?? ''"
                    :href="group.href ?? ''"
                    variant="ghost"
                    size="small"
                    icon="az az-external-link"
                  />
                </div>
              </template>
            </div>
          </div>
        </section>
      </div>

      <SaveBar variant="docked">
        <template #leading>
          <p
            id="release-impact-settings-hint"
            class="text-body-sm text-(--text-muted)"
          >
            {{
              selected.length
                ? 'Next, review the resources and everything this release reaches.'
                : 'Select at least one Deployment Setting to continue.'
            }}
          </p>
        </template>
        <template #actions>
          <Button
            label="Cancel"
            variant="outline"
            size="medium"
            href="/services/web-app"
          />
          <Button
            label="Continue"
            variant="primary"
            size="medium"
            icon="az az-arrow-right"
            icon-position="trailing"
            :disabled="!selected.length"
            aria-describedby="release-impact-settings-hint"
          />
        </template>
      </SaveBar>
    </main>
  </div>
</template>
