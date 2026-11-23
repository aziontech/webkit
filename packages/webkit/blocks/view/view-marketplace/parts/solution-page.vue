<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable from '@aziontech/webkit/data-table'
  import Field from '@aziontech/webkit/field'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'

  import {
    sampleSolution,
    sampleSolutionApplications,
    sampleSolutionChangelog,
    sampleSolutionInstalls
  } from '../sample'

  const integration = sampleSolution
  const changelog = sampleSolutionChangelog

  const installs = ref(sampleSolutionInstalls.map((item) => ({ ...item })))
  const APPLICATIONS = sampleSolutionApplications
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

  const HEADING_CLASS = 'm-0 text-heading-2xs text-(--text-default)'
  const TEXT_CLASS = 'm-0 text-body-md text-(--text-default)'
  const CODE_CLASS = 'text-label-code-sm text-(--text-default)'

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
        />
      </nav>
      <PageHeader
        :title="integration.name"
        :description="integration.description"
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/marketplace/waiting-room"
            target="_blank"
          />
        </template>
      </PageHeader>

      <div
        class="layout-section-start grid min-w-0 grid-cols-1 gap-(--layout-section-gap) lg:grid-cols-[minmax(0,1fr)_var(--container-2xs)]"
      >
        <Tabs v-model="activeTab">
          <Tabs.List>
            <Tabs.Trigger
              value="overview"
              label="Overview"
            />
            <Tabs.Trigger
              value="usage"
              label="Usage"
            />
            <Tabs.Trigger
              value="changelog"
              label="Changelog"
            />
            <Tabs.Trigger
              value="applications"
              label="Applications"
            />
          </Tabs.List>
          <div class="relative isolate w-full">
            <Tabs.Content value="overview">
              <div class="flex max-w-(--container-md) flex-col gap-(--spacing-md)">
                <p :class="TEXT_CLASS">
                  When the requests per second pass the capacity you set, new visitors see a queue
                  page with their place and the estimated wait. Visitors already inside are never
                  queued.
                </p>
                <section class="flex flex-col gap-(--spacing-xs)">
                  <h2 :class="HEADING_CLASS">What it needs</h2>
                  <ul class="m-0 flex list-disc flex-col gap-(--spacing-2xs) ps-(--spacing-lg)">
                    <li :class="TEXT_CLASS">Read the visitor's session cookie.</li>
                    <li :class="TEXT_CLASS">Answer requests with the queue page.</li>
                  </ul>
                </section>
              </div>
            </Tabs.Content>
            <Tabs.Content value="usage">
              <div class="flex max-w-(--container-md) flex-col gap-(--spacing-md)">
                <section class="flex flex-col gap-(--spacing-xs)">
                  <h2 :class="HEADING_CLASS">Set the capacity</h2>
                  <p :class="TEXT_CLASS">
                    Open Configure on the application and set
                    <code :class="CODE_CLASS">capacity</code> to the requests per second your origin
                    serves comfortably. Start at 80 percent of your measured peak.
                  </p>
                </section>
                <section class="flex flex-col gap-(--spacing-xs)">
                  <h2 :class="HEADING_CLASS">Let people in faster</h2>
                  <p :class="TEXT_CLASS">
                    Lower <code :class="CODE_CLASS">session_minutes</code> so visitors who left free
                    their place sooner.
                  </p>
                </section>
                <section class="flex flex-col gap-(--spacing-xs)">
                  <h2 :class="HEADING_CLASS">Test it</h2>
                  <p :class="TEXT_CLASS">
                    Set the capacity to 1 on a preview environment and open the application in two
                    browsers; the second one sees the queue page.
                  </p>
                </section>
              </div>
            </Tabs.Content>
            <Tabs.Content value="changelog">
              <ol
                class="m-0 flex list-none flex-col gap-(--layout-group-gap) p-0"
                aria-label="Version history"
              >
                <li
                  v-for="(entry, index) in changelog"
                  :key="entry.version"
                  class="flex flex-col gap-(--spacing-xs) border-b border-(--border-muted) pb-(--layout-group-gap) last:border-b-0"
                >
                  <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                    <h2 class="m-0 text-heading-2xs text-(--text-default)">
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
                  <ul class="m-0 flex flex-col gap-(--spacing-2xs) ps-(--spacing-lg)">
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
            </Tabs.Content>
            <Tabs.Content value="applications">
              <div>
                <Card :padded="false">
                  <template #default>
                    <DataTable
                      :data="installs"
                      :columns="columns"
                      row-key="application"
                      :bordered="false"
                      aria-label="Applications running this integration"
                    >
                      <template #cell-state="{ row }">
                        <TableCellStatus
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
                          variant="outline"
                          size="small"
                          :loading="running === row.application"
                          :disabled="Boolean(running) && running !== row.application"
                          @click="runOn(row.application)"
                        />
                      </template>
                    </DataTable>
                  </template>
                </Card>
              </div>
            </Tabs.Content>
          </div>
        </Tabs>

        <aside
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
          aria-label="Install"
        >
          <Card>
            <template #default>
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
                      <Select.Item
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
                      </Select.Item>
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
                  variant="primary"
                  :loading="Boolean(running)"
                />
              </form>
            </template>
          </Card>
          <KeyValueList aria-label="Integration details">
            <KeyValueList.Item label="Publisher"
              ><bdi>{{ integration.vendor }}</bdi></KeyValueList.Item
            >
            <KeyValueList.Item label="Category">{{ integration.category }}</KeyValueList.Item>
            <KeyValueList.Item label="Context">{{ integration.context }}</KeyValueList.Item>
            <KeyValueList.Item label="Latest version">{{ integration.version }}</KeyValueList.Item>
            <KeyValueList.Item label="Updated">{{ integration.updated }}</KeyValueList.Item>
          </KeyValueList>
        </aside>
      </div>
    </div>
  </div>
</template>
