<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Field from '@aziontech/webkit/field'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'

  const integration = {
    id: 'waiting-room',
    name: 'Waiting Room',
    vendor: 'Tidewater',
    category: 'Traffic management',
    context: 'Application',
    version: '1.4.0',
    updated: 'Oct 30, 2026',
    description: 'Queue visitors during a traffic surge and let them in as capacity frees up.'
  }

  const changelog = [
    {
      version: '1.4.0',
      date: 'Oct 30, 2026',
      notes: [
        'Visitors keep their place when they reload the queue page.',
        'New setting: the queue page title.'
      ]
    },
    {
      version: '1.3.0',
      date: 'Aug 12, 2026',
      notes: ['Capacity can change without restarting the queue.']
    },
    {
      version: '1.2.1',
      date: 'Jun 3, 2026',
      notes: ['Fixed the estimated wait for queues above 10,000 visitors.']
    }
  ]

  const installs = ref([
    { application: 'storefront', version: '1.3.0' },
    { application: 'checkout', version: '1.4.0' }
  ])
  const APPLICATIONS = ['storefront', 'checkout', 'docs', 'api']
  const installedVersion = (app: string) =>
    installs.value.find((item) => item.application === app)?.version
  const outdated = (app: string) => {
    const version = installedVersion(app)
    return Boolean(version) && version !== integration.version
  }
  const options = computed(() =>
    APPLICATIONS.map((app) => ({
      value: app,
      installed: Boolean(installedVersion(app)),
      outdated: outdated(app)
    }))
  )

  const activeTab = ref('overview')
  const form = reactive({ application: '' })
  const showErrors = ref(false)
  const applicationInvalid = computed(() => showErrors.value && !form.application)
  const running = ref('')
  const RUN_TOAST = 'marketplace-solution-run'
  let timer: ReturnType<typeof setTimeout> | undefined

  const runOn = (app: string) => {
    const updating = outdated(app)
    running.value = app
    toast.loading(
      updating
        ? `Updating ${integration.name} on ${app} to ${integration.version}…`
        : `Installing ${integration.name} on ${app}…`,
      { id: RUN_TOAST, description: 'It keeps running if you leave this page.' }
    )
    clearTimeout(timer)
    timer = setTimeout(() => {
      const existing = installs.value.find((item) => item.application === app)
      if (existing) existing.version = integration.version
      else installs.value = [...installs.value, { application: app, version: integration.version }]
      running.value = ''
      form.application = ''
      showErrors.value = false
      toast.success(
        updating
          ? `${app} runs ${integration.name} ${integration.version}.`
          : `${integration.name} is installed on ${app}.`,
        {
          id: RUN_TOAST,
          description: 'It runs from the next request to the application.',
          closable: true,
          actions: [
            { label: 'Configure', onClick: () => toast.dismiss(RUN_TOAST) },
            { label: 'Open application', onClick: () => toast.dismiss(RUN_TOAST) }
          ]
        }
      )
    }, 2000)
  }

  const submit = () => {
    showErrors.value = true
    if (!form.application || running.value) return
    runOn(form.application)
  }

  const columns = [
    { accessorKey: 'application', header: 'Application', principal: true, hideable: false },
    { accessorKey: 'version', header: 'Version', minWidth: 100 },
    { id: 'state', header: 'Status', minWidth: 150 },
    { id: 'update', header: '', minWidth: 120, hideable: false }
  ]

  onBeforeUnmount(() => {
    clearTimeout(timer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <nav
        aria-label="Breadcrumb"
        class="pt-(--layout-group-gap)"
      >
        <Link
          href="/marketplace"
          label="Back to Marketplace"
          size="medium"
          :show-icon="false"
        />
      </nav>
      <PageHeader
        :title="integration.name"
        :description="integration.description"
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/marketplace/waiting-room"
            target="_blank"
          />
        </template>
      </PageHeader>

      <div
        class="layout-section-start grid min-w-0 grid-cols-1 gap-(--layout-section-gap) lg:grid-cols-[minmax(0,1fr)_var(--container-2xs)]"
      >
        <Tabs.Root v-model="activeTab">
          <Tabs.List>
            <Tabs.Item
              value="overview"
              label="Overview"
            />
            <Tabs.Item
              value="usage"
              label="Usage"
            />
            <Tabs.Item
              value="changelog"
              label="Changelog"
            />
            <Tabs.Item
              value="applications"
              label="Applications"
            />
          </Tabs.List>
          <Tabs.Content>
            <Tabs.Panel value="overview">
              <div class="pt-(--layout-group-gap)">
                <DocProse>
                  <p>{{ integration.description }}</p>
                  <p>
                    When the requests per second pass the capacity you set, new visitors see a queue
                    page with their place and the estimated wait. Visitors already inside are never
                    queued.
                  </p>
                  <h2>What it needs</h2>
                  <ul>
                    <li>Read the visitor's session cookie.</li>
                    <li>Answer requests with the queue page.</li>
                  </ul>
                </DocProse>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="usage">
              <div class="pt-(--layout-group-gap)">
                <DocProse>
                  <h2>Set the capacity</h2>
                  <p>
                    Open Configure on the application and set <code>capacity</code> to the requests
                    per second your origin serves comfortably. Start at 80 percent of your measured
                    peak.
                  </p>
                  <h2>Let people in faster</h2>
                  <p>
                    Lower <code>session_minutes</code> so visitors who left free their place sooner.
                  </p>
                  <h2>Test it</h2>
                  <p>
                    Set the capacity to 1 on a preview environment and open the application in two
                    browsers; the second one sees the queue page.
                  </p>
                </DocProse>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="changelog">
              <ol
                class="m-0 flex list-none flex-col gap-(--layout-group-gap) p-0 pt-(--layout-group-gap)"
                aria-label="Version history"
              >
                <li
                  v-for="(entry, index) in changelog"
                  :key="entry.version"
                  class="flex flex-col gap-(--spacing-xs) border-b border-(--border-muted) pb-(--layout-group-gap) last:border-b-0"
                >
                  <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                    <h2 class="m-0 text-heading-xxs text-(--text-default)">
                      {{ entry.version }}
                    </h2>
                    <Tag
                      v-if="index === 0"
                      label="Latest"
                      severity="info"
                      size="small"
                    />
                    <span class="text-body-sm text-(--text-muted)">{{ entry.date }}</span>
                  </div>
                  <ul class="m-0 flex flex-col gap-(--spacing-xxs) ps-(--spacing-lg)">
                    <li
                      v-for="note in entry.notes"
                      :key="note"
                      class="text-body-sm text-(--text-default)"
                    >
                      {{ note }}
                    </li>
                  </ul>
                </li>
              </ol>
            </Tabs.Panel>
            <Tabs.Panel value="applications">
              <div class="pt-(--layout-group-gap)">
                <Card :padded="false">
                  <template #content>
                    <Table
                      :data="installs"
                      :columns="columns"
                      row-key="application"
                      :bordered="false"
                      aria-label="Applications running this integration"
                    >
                      <template #cell-state="{ row }">
                        <Table.CellStatus
                          :label="outdated(row.application) ? 'Update available' : 'Up to date'"
                          :severity="outdated(row.application) ? 'warning' : 'success'"
                        />
                      </template>
                      <template #header-update>
                        <span class="sr-only">Update</span>
                      </template>
                      <template #cell-update="{ row }">
                        <Button
                          v-if="outdated(row.application)"
                          :label="`Update to ${integration.version}`"
                          kind="outlined"
                          size="small"
                          :loading="running === row.application"
                          :disabled="Boolean(running) && running !== row.application"
                          @click="runOn(row.application)"
                        />
                      </template>
                    </Table>
                  </template>
                </Card>
              </div>
            </Tabs.Panel>
          </Tabs.Content>
        </Tabs.Root>

        <aside
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
          aria-label="Install"
        >
          <Card>
            <template #content>
              <form
                class="flex flex-col gap-(--spacing-md)"
                novalidate
                aria-label="Install or update"
                @submit.prevent="submit"
              >
                <Field
                  required
                  :invalid="applicationInvalid"
                >
                  <Field.Label>Application</Field.Label>
                  <Select
                    v-model="form.application"
                    size="medium"
                    placeholder="Select an application"
                  >
                    <Select.Trigger class="w-full" />
                    <Select.Content>
                      <Select.Option
                        v-for="option in options"
                        :key="option.value"
                        :value="option.value"
                        :disabled="option.installed && !option.outdated"
                      >
                        {{ option.value }}
                        <template
                          v-if="option.installed"
                          #tag
                        >
                          <Tag
                            :label="option.outdated ? 'Update available' : 'Installed'"
                            :severity="option.outdated ? 'warning' : 'success'"
                            size="small"
                          />
                        </template>
                      </Select.Option>
                    </Select.Content>
                  </Select>
                  <Field.Error v-if="applicationInvalid">
                    Select the application to install {{ integration.name }} on.
                  </Field.Error>
                  <Field.Description v-else>
                    Applications on an older version show Update available.
                  </Field.Description>
                </Field>
                <Button
                  type="submit"
                  :label="form.application && outdated(form.application) ? 'Update' : 'Install'"
                  kind="primary"
                  :loading="Boolean(running)"
                />
              </form>
            </template>
          </Card>
          <KeyValuePairs aria-label="Integration details">
            <KeyValuePairs.Item label="Publisher"
              ><bdi>{{ integration.vendor }}</bdi></KeyValuePairs.Item
            >
            <KeyValuePairs.Item label="Category">{{ integration.category }}</KeyValuePairs.Item>
            <KeyValuePairs.Item label="Context">{{ integration.context }}</KeyValuePairs.Item>
            <KeyValuePairs.Item label="Latest version">{{
              integration.version
            }}</KeyValuePairs.Item>
            <KeyValuePairs.Item label="Updated">{{ integration.updated }}</KeyValuePairs.Item>
          </KeyValuePairs>
        </aside>
      </div>
    </div>

    <Toaster position="bottom-right" />
  </div>
</template>
