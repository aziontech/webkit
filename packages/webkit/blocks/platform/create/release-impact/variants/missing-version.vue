<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Field from '@aziontech/webkit/field'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

  const SCENARIO = {
    impact: 'ready',
    missingVersion: true,
    failFirstRun: false
  }

  const RUN_TOAST = 'release-impact-run'
  const RUN_MS = 3000
  const IMPACT_MS = 1200
  const LATEST = 'latest'

  const resourceTypes = {
    service: { label: 'Service', icon: 'pi pi-server' },
    policy: { label: 'Policy', icon: 'pi pi-shield' },
    storage: { label: 'Storage', icon: 'pi pi-inbox' },
    errorPage: { label: 'Error page', icon: 'pi pi-file' },
    module: { label: 'Modules', icon: 'pi pi-code' },
    integration: { label: 'Integrations', icon: 'pi pi-link' }
  }

  const cards = reactive([
    {
      type: 'service',
      name: 'web-app',
      required: true,
      enabled: true,
      versionId: 'AG1VVDJP',
      versions: [
        { id: 'AG1VVDJP', current: true, age: '2 hours ago' },
        { id: 'AF3K2L9Q', age: '1 day ago' },
        { id: 'AD7M1X4R', age: '4 days ago' }
      ],
      groups: [
        {
          type: 'module',
          rows: [
            {
              name: 'auth-gateway',
              versionId: 'AB2C9D1E',
              versions: [
                { id: 'AB2C9D1E', current: true, age: '3 days ago' },
                { id: 'AA8F3G2H', age: '2 weeks ago' }
              ],
              sharedWith: ['checkout', 'admin-panel']
            },
            {
              name: 'geo-redirect',
              versionId: LATEST,
              versions: [{ id: 'AC4J6K8L', current: true, age: '5 days ago' }]
            }
          ]
        },
        {
          type: 'integration',
          rows: [
            {
              name: 'payments-api',
              versionId: 'AE5N7P9Q',
              versions: [{ id: 'AE5N7P9Q', current: true, age: '1 week ago' }]
            }
          ]
        }
      ]
    },
    {
      type: 'policy',
      name: 'edge-policy',
      canToggle: true,
      enabled: true,
      versionId: SCENARIO.missingVersion ? '' : LATEST,
      versions: SCENARIO.missingVersion
        ? []
        : [
            { id: 'AH3R5T7V', current: true, age: '6 hours ago' },
            { id: 'AG9W1X3Y', age: '3 days ago' }
          ],
      groups: []
    },
    {
      type: 'storage',
      name: 'web-app-assets',
      readonly: true,
      enabled: true,
      versionId: 'AJ2B4D6F',
      versions: [{ id: 'AJ2B4D6F', current: true, age: '2 weeks ago' }],
      groups: []
    },
    {
      type: 'errorPage',
      name: 'web-app-errors',
      canToggle: true,
      enabled: false,
      note: 'Left out of this release. The error page serving now keeps serving.',
      versionId: LATEST,
      versions: [{ id: 'AK8M2P4R', current: true, age: '1 month ago' }],
      groups: []
    }
  ])

  const impactTree = [
    {
      id: 'production-settings',
      name: 'production-settings',
      domainsCount: 6,
      environments: [
        {
          id: 'production',
          name: 'Production',
          projects: [
            { id: 'web-app', name: 'web-app', domainsCount: 2 },
            { id: 'storefront', name: 'storefront', domainsCount: 3 }
          ]
        },
        {
          id: 'preview',
          name: 'Preview',
          projects: [{ id: 'web-app-preview', name: 'web-app-preview', domainsCount: 1 }]
        }
      ]
    },
    {
      id: 'staging-settings',
      name: 'staging-settings',
      domainsCount: 0,
      environments: []
    }
  ]

  const impactViews = [
    { label: 'Tree', value: 'tree' },
    { label: 'Flow', value: 'flow' }
  ]

  const impactState = ref(SCENARIO.impact)
  const impactView = ref('tree')
  const confirmOpen = ref(false)
  const deploying = ref(false)
  const outcome = ref('')
  const failNext = ref(SCENARIO.failFirstRun)
  const resourcesHeading = ref(null)

  let impactTimer = 0
  let runTimer = 0

  const plural = (count, one, other) => `${count} ${count === 1 ? one : other}`

  const versionLabel = (card, id) => {
    if (id === LATEST) return 'Track latest Ready'
    return card.versions.find((version) => version.id === id)?.id ?? id
  }

  const resolvedVersion = (card) =>
    card.versionId === LATEST
      ? (card.versions.find((version) => version.current)?.id ?? '')
      : card.versionId

  const dependencyCount = (card) =>
    card.groups.reduce((total, group) => total + group.rows.length, 0)

  const included = computed(() => cards.filter((card) => card.enabled))

  const missing = computed(() =>
    included.value.filter((card) => !card.readonly && !card.versions.length)
  )

  const projects = computed(() =>
    impactTree.flatMap((settings) =>
      settings.environments.flatMap((environment) => environment.projects)
    )
  )

  const environments = computed(() =>
    impactTree.flatMap((settings) => settings.environments.map((environment) => environment.name))
  )

  const impactSummary = computed(
    () =>
      `This release reaches ${plural(projects.value.length, 'project', 'projects')} in ${plural(environments.value.length, 'environment', 'environments')} through ${plural(impactTree.length, 'Deployment Setting', 'Deployment Settings')}.`
  )

  const blocker = computed(() => {
    if (missing.value.length)
      return `${missing.value[0].name} has no Ready version, so the release cannot be deployed.`
    if (impactState.value === 'loading') return 'Computing impact…'
    return ''
  })

  const canDeploy = computed(() => !deploying.value && !missing.value.length)

  const releaseLine = computed(() =>
    included.value
      .filter((card) => !card.readonly)
      .map((card) => `${card.name} ${resolvedVersion(card)}`)
      .join(', ')
  )

  const confirmBody = computed(
    () =>
      `${releaseLine.value} go into traffic on ${plural(projects.value.length, 'project', 'projects')} in ${environments.value.join(' and ')}. Resources left out keep the version they serve now.`
  )

  const unavailableMessage = computed(() =>
    impactState.value === 'partial'
      ? 'The projects list was truncated, so these numbers may be incomplete. You can still deploy.'
      : 'The projects that deploy with these settings could not be read, so the impact is unknown. Retry, or deploy without the preview.'
  )

  const loadImpact = () => {
    clearTimeout(impactTimer)
    impactState.value = 'loading'
    impactTimer = setTimeout(() => {
      impactState.value = SCENARIO.impact === 'unavailable' ? 'partial' : 'ready'
    }, IMPACT_MS)
  }

  const edit = async () => {
    toast.dismiss(RUN_TOAST)
    outcome.value = ''
    await nextTick()
    resourcesHeading.value?.focus()
  }

  const finishRun = () => {
    deploying.value = false
    const actions = [
      { label: 'Edit', onClick: edit },
      { label: 'Redeploy', onClick: startRun }
    ]
    if (failNext.value) {
      failNext.value = false
      outcome.value = 'failed'
      toast.error("The release wasn't deployed.", {
        id: RUN_TOAST,
        description:
          'edge-policy was refused: a rule points at an integration that does not exist.',
        duration: 0,
        closable: true,
        actions
      })
      return
    }
    outcome.value = 'succeeded'
    toast.success('Release deployed.', {
      id: RUN_TOAST,
      description: `${releaseLine.value} serve ${plural(projects.value.length, 'project', 'projects')} now.`,
      duration: 0,
      closable: true,
      actions
    })
  }

  const startRun = () => {
    clearTimeout(runTimer)
    deploying.value = true
    outcome.value = ''
    toast.loading('Deploying release…', {
      id: RUN_TOAST,
      description: `${releaseLine.value}. It keeps running if you leave.`
    })
    runTimer = setTimeout(finishRun, RUN_MS)
  }

  const confirmDeploy = () => {
    confirmOpen.value = false
    startRun()
  }

  onMounted(() => {
    if (SCENARIO.failFirstRun) finishRun()
  })

  onBeforeUnmount(() => {
    clearTimeout(impactTimer)
    clearTimeout(runTimer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
    <main class="flex min-h-0 flex-1 flex-col">
      <div
        class="layout-column-focused layout-boundary flex min-w-0 flex-1 flex-col gap-(--layout-section-gap)"
      >
        <header class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <h1 class="text-balance text-heading-lg text-(--text-default)">Review and deploy</h1>
          <p class="text-body-md text-(--text-muted)">
            Check the resources this release deploys and everything it reaches, then deploy it.
          </p>
        </header>

        <Alert
          key="alert-1"
          v-if="outcome === 'failed'"
          severity="danger"
          label="The release wasn't deployed. edge-policy was refused: a rule points at an integration that does not exist. Nothing changed in traffic."
        >
          <template #action>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                kind="outlined"
                size="small"
                @click="edit"
              />
              <Button
                label="Redeploy"
                kind="outlined"
                size="small"
                icon="pi pi-refresh"
                @click="startRun"
              />
            </div>
          </template>
        </Alert>
        <Alert
          key="alert-2"
          v-else-if="outcome === 'succeeded'"
          severity="success"
          :label="`Release deployed. ${releaseLine} serve ${plural(projects.length, 'project', 'projects')} now.`"
        >
          <template #action>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                kind="outlined"
                size="small"
                @click="edit"
              />
              <Button
                label="Redeploy"
                kind="outlined"
                size="small"
                icon="pi pi-refresh"
                @click="startRun"
              />
            </div>
          </template>
        </Alert>

        <div
          class="grid min-w-0 items-start gap-(--layout-section-gap) xl:grid-cols-[minmax(0,1fr)_minmax(var(--container-xs),var(--container-sm))]"
        >
          <section
            aria-labelledby="release-impact-resources"
            class="flex min-w-0 flex-col gap-(--layout-group-gap)"
          >
            <h2
              id="release-impact-resources"
              ref="resourcesHeading"
              tabindex="-1"
              class="text-heading-xs text-(--text-default) focus-visible:outline-none"
            >
              Resources
            </h2>

            <section
              v-for="card in cards"
              :key="card.type"
              :aria-label="`${resourceTypes[card.type].label} ${card.name}`"
              :data-included="card.enabled || null"
              class="flex min-w-0 flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
            >
              <header
                class="flex min-h-14 min-w-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
              >
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    :class="resourceTypes[card.type].icon"
                    class="shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate text-label-md text-(--text-default)">
                    {{ resourceTypes[card.type].label }}
                  </span>
                </span>
                <span class="flex shrink-0 items-center gap-(--spacing-xs)">
                  <Tag
                    key="tag-1"
                    v-if="card.readonly"
                    label="Read-only"
                    severity="secondary"
                    icon="pi pi-lock"
                    size="small"
                  />
                  <Tag
                    key="tag-2"
                    v-else-if="card.required"
                    label="Required"
                    severity="warning"
                    size="small"
                  />
                  <Tooltip
                    v-if="card.canToggle"
                    :text="
                      card.enabled
                        ? `Leave ${card.name} out of this release`
                        : `Include ${card.name} in this release`
                    "
                  >
                    <Switch
                      v-model="card.enabled"
                      :disabled="deploying"
                      :aria-label="`Include ${card.name} in this release`"
                    />
                  </Tooltip>
                </span>
              </header>

              <p
                v-if="!card.enabled"
                class="p-(--spacing-md) text-body-sm text-(--text-muted)"
              >
                {{ card.note }}
              </p>

              <div
                v-else
                class="flex min-w-0 flex-col gap-(--spacing-md) p-(--spacing-md)"
              >
                <p
                  v-if="card.readonly"
                  class="text-body-sm text-(--text-muted)"
                >
                  Kept from the active release.
                </p>

                <div class="grid min-w-0 gap-(--spacing-sm) sm:grid-cols-2">
                  <Field>
                    <Field.Label>Resource</Field.Label>
                    <div
                      class="flex min-h-9 min-w-0 items-center justify-between gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised) px-(--spacing-sm)"
                    >
                      <span class="truncate text-body-sm text-(--text-default)">
                        {{ card.name }}
                      </span>
                      <i
                        v-if="card.readonly"
                        class="pi pi-lock shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </div>
                  </Field>

                  <Field :invalid="!card.versions.length">
                    <Field.Label>Version</Field.Label>
                    <Select
                      v-model="card.versionId"
                      size="medium"
                      placeholder="Select a version"
                      :disabled="deploying || card.readonly || !card.versions.length"
                      :invalid="!card.versions.length"
                      :display-value="(value) => versionLabel(card, value)"
                    >
                      <Select.Trigger class="w-full" />
                      <Select.Content>
                        <Select.Option
                          :value="LATEST"
                          icon="pi pi-sync"
                        >
                          Track latest Ready
                          <template #tag>
                            <span class="shrink-0 text-body-xs text-(--text-muted)">
                              resolves at deploy
                            </span>
                          </template>
                        </Select.Option>
                        <Select.Group label="Pin a ready version">
                          <Select.Option
                            v-for="version in card.versions"
                            :key="version.id"
                            :value="version.id"
                          >
                            {{ version.id }}
                            <template #tag>
                              <span class="flex shrink-0 items-center gap-(--spacing-xs)">
                                <Tag
                                  v-if="version.current"
                                  label="Current"
                                  severity="success"
                                  size="small"
                                />
                                <span class="text-body-xs text-(--text-muted)">
                                  {{ version.age }}
                                </span>
                              </span>
                            </template>
                          </Select.Option>
                        </Select.Group>
                      </Select.Content>
                    </Select>
                    <Field.Error v-if="!card.versions.length">
                      {{ card.name }} has no Ready version, so it cannot be deployed.
                    </Field.Error>
                    <Field.Description v-else-if="card.versionId === LATEST">
                      Resolves to {{ resolvedVersion(card) }} when the release deploys.
                    </Field.Description>
                  </Field>
                </div>

                <Button
                  v-if="!card.versions.length"
                  class="self-start"
                  label="Build a version"
                  kind="transparent"
                  size="small"
                  icon="pi pi-external-link"
                  href="/services/edge-policy/versions"
                />

                <div
                  v-if="card.groups.length"
                  class="flex min-w-0 flex-col rounded-(--shape-card) border border-(--border-default)"
                >
                  <div
                    class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
                  >
                    <h3 class="truncate text-label-md text-(--text-default)">Dependencies</h3>
                    <Badge
                      :label="String(dependencyCount(card))"
                      severity="secondary"
                      size="small"
                    />
                  </div>
                  <Accordion
                    type="multiple"
                    size="small"
                    :default-value="card.groups.map((group) => group.type)"
                  >
                    <Accordion.Item
                      v-for="group in card.groups"
                      :key="group.type"
                      :value="group.type"
                    >
                      <Accordion.Trigger>
                        <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                          <i
                            :class="resourceTypes[group.type].icon"
                            class="shrink-0 text-(--text-muted)"
                            aria-hidden="true"
                          />
                          <span class="truncate text-label-md text-(--text-default)">
                            {{ resourceTypes[group.type].label }}
                          </span>
                          <Badge
                            :label="String(group.rows.length)"
                            severity="secondary"
                            size="small"
                          />
                        </span>
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <div
                          class="flex min-w-0 flex-col gap-(--spacing-sm) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-md)"
                        >
                          <Alert
                            v-if="group.rows.some((row) => row.sharedWith?.length)"
                            severity="info"
                            size="small"
                            label="A shared dependency deploys at one version. Changing it here changes it under every resource in this release that references it."
                          />
                          <div
                            v-for="row in group.rows"
                            :key="row.name"
                            class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-muted) p-(--spacing-sm)"
                          >
                            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                              <span class="truncate text-label-sm text-(--text-default)">
                                {{ row.name }}
                              </span>
                              <Tooltip
                                v-if="row.sharedWith?.length"
                                :text="`Also referenced by ${row.sharedWith.join(' and ')}.`"
                              >
                                <span
                                  tabindex="0"
                                  class="inline-flex shrink-0 rounded-(--shape-elements) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                >
                                  <Tag
                                    label="Shared"
                                    severity="info"
                                    icon="pi pi-link"
                                    size="small"
                                  />
                                </span>
                              </Tooltip>
                            </div>
                            <Field>
                              <Field.Label class="sr-only">Version of {{ row.name }}</Field.Label>
                              <Select
                                v-model="row.versionId"
                                size="medium"
                                :disabled="deploying"
                                :display-value="(value) => versionLabel(row, value)"
                              >
                                <Select.Trigger class="w-full" />
                                <Select.Content>
                                  <Select.Option
                                    :value="LATEST"
                                    icon="pi pi-sync"
                                  >
                                    Track latest Ready
                                  </Select.Option>
                                  <Select.Group label="Pin a ready version">
                                    <Select.Option
                                      v-for="version in row.versions"
                                      :key="version.id"
                                      :value="version.id"
                                    >
                                      {{ version.id }}
                                      <template #tag>
                                        <span class="flex shrink-0 items-center gap-(--spacing-xs)">
                                          <Tag
                                            v-if="version.current"
                                            label="Current"
                                            severity="success"
                                            size="small"
                                          />
                                          <span class="text-body-xs text-(--text-muted)">
                                            {{ version.age }}
                                          </span>
                                        </span>
                                      </template>
                                    </Select.Option>
                                  </Select.Group>
                                </Select.Content>
                              </Select>
                            </Field>
                          </div>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </section>
          </section>

          <div class="min-w-0 xl:sticky xl:top-(--layout-boundary-start)">
            <Card>
              <template #header>
                <div class="flex min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)">
                  <h2 class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-bullseye shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-(--text-default)">Impact</span>
                  </h2>
                  <ToggleGroup
                    v-if="impactState === 'ready' || impactState === 'partial'"
                    v-model="impactView"
                    :options="impactViews"
                    aria-label="Impact view"
                    size="small"
                    class="shrink-0"
                  />
                </div>
              </template>
              <template #content>
                <div
                  :aria-busy="impactState === 'loading' || undefined"
                  class="flex min-w-0 flex-col gap-(--spacing-sm)"
                >
                  <div
                    v-if="impactState === 'loading'"
                    class="flex min-w-0 flex-col gap-(--spacing-sm)"
                  >
                    <span class="flex items-center gap-(--spacing-xs)">
                      <Spinner class="size-4 shrink-0 text-(--text-muted)" />
                      <span class="text-body-sm text-(--text-muted)">Computing impact…</span>
                    </span>
                    <Skeleton height="var(--size-4)" />
                    <Skeleton
                      height="var(--size-4)"
                      width="80%"
                    />
                    <Skeleton
                      height="var(--size-4)"
                      width="60%"
                    />
                  </div>

                  <div
                    v-else-if="impactState === 'unavailable'"
                    class="flex min-w-0 flex-col items-start gap-(--spacing-sm)"
                  >
                    <Alert
                      severity="warning"
                      size="small"
                      :label="unavailableMessage"
                    />
                    <span class="text-body-xs text-(--text-muted)">
                      {{ plural(impactTree.length, 'Deployment Setting', 'Deployment Settings') }}
                      selected
                    </span>
                    <Button
                      label="Retry"
                      kind="outlined"
                      size="small"
                      icon="pi pi-refresh"
                      @click="loadImpact"
                    />
                  </div>

                  <template v-else>
                    <Alert
                      v-if="impactState === 'partial'"
                      severity="warning"
                      size="small"
                      :label="unavailableMessage"
                    />

                    <ul
                      v-if="impactView === 'tree'"
                      aria-label="Deployment Settings this release reaches"
                      class="m-0 flex min-w-0 list-none flex-col p-0 [--tree-indent:calc(var(--spacing-sm)*2)] [--tree-rail:var(--spacing-sm)]"
                    >
                      <li
                        v-for="settings in impactTree"
                        :key="settings.id"
                        class="flex min-w-0 flex-col"
                      >
                        <span
                          class="flex min-h-8 min-w-0 items-center justify-between gap-(--spacing-xs)"
                        >
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <i
                              class="pi pi-sliders-h shrink-0 text-(--text-muted)"
                              aria-hidden="true"
                            />
                            <span class="truncate text-label-md text-(--text-default)">
                              {{ settings.name }}
                            </span>
                          </span>
                          <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                            {{ plural(settings.domainsCount, 'domain', 'domains') }}
                          </span>
                        </span>
                        <p
                          v-if="!settings.environments.length"
                          class="ps-(--tree-indent) text-body-xs text-(--text-muted)"
                        >
                          No projects deploy with these settings yet.
                        </p>
                        <ul
                          v-else
                          class="m-0 flex min-w-0 list-none flex-col p-0 ps-(--tree-indent)"
                        >
                          <li
                            v-for="environment in settings.environments"
                            :key="environment.id"
                            class="relative flex min-w-0 flex-col before:absolute before:top-0 before:-start-(--tree-rail) before:h-4 before:w-(--tree-rail) before:rounded-es-(--shape-elements) before:border-b before:border-s before:border-(--border-default) before:content-[''] after:absolute after:top-4 after:bottom-0 after:-start-(--tree-rail) after:border-s after:border-(--border-default) after:content-[''] last:after:hidden"
                          >
                            <span
                              class="flex min-h-8 min-w-0 items-center justify-between gap-(--spacing-xs)"
                            >
                              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                <i
                                  class="pi pi-sitemap shrink-0 text-(--text-muted)"
                                  aria-hidden="true"
                                />
                                <span class="truncate text-label-md text-(--text-default)">
                                  {{ environment.name }}
                                </span>
                              </span>
                              <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                                {{ plural(environment.projects.length, 'project', 'projects') }}
                              </span>
                            </span>
                            <ul class="m-0 flex min-w-0 list-none flex-col p-0 ps-(--tree-indent)">
                              <li
                                v-for="project in environment.projects"
                                :key="project.id"
                                class="relative flex min-w-0 before:absolute before:top-0 before:-start-(--tree-rail) before:h-4 before:w-(--tree-rail) before:rounded-es-(--shape-elements) before:border-b before:border-s before:border-(--border-default) before:content-[''] after:absolute after:top-4 after:bottom-0 after:-start-(--tree-rail) after:border-s after:border-(--border-default) after:content-[''] last:after:hidden"
                              >
                                <span
                                  class="flex min-h-8 min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)"
                                >
                                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                    <i
                                      class="pi pi-folder shrink-0 text-(--text-muted)"
                                      aria-hidden="true"
                                    />
                                    <span class="truncate text-body-sm text-(--text-default)">
                                      {{ project.name }}
                                    </span>
                                  </span>
                                  <span
                                    class="shrink-0 text-body-xs tabular-nums text-(--text-muted)"
                                  >
                                    {{ plural(project.domainsCount, 'domain', 'domains') }}
                                  </span>
                                </span>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>

                    <ul
                      v-else
                      aria-label="Deployment Settings this release reaches"
                      class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-md) p-0"
                    >
                      <li
                        v-for="settings in impactTree"
                        :key="settings.id"
                        class="flex min-w-0 flex-col items-stretch gap-(--spacing-xs) sm:flex-row sm:items-center"
                      >
                        <span
                          class="flex min-w-0 shrink-0 flex-col gap-(--spacing-xxs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs) sm:w-(--size-40)"
                        >
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <i
                              class="pi pi-sliders-h shrink-0 text-(--text-muted)"
                              aria-hidden="true"
                            />
                            <span class="truncate text-label-md text-(--text-default)">
                              {{ settings.name }}
                            </span>
                          </span>
                          <span class="text-body-xs tabular-nums text-(--text-muted)">
                            {{ plural(settings.domainsCount, 'domain', 'domains') }}
                          </span>
                        </span>
                        <i
                          class="pi pi-arrow-right hidden shrink-0 text-body-xs text-(--text-muted) sm:block"
                          aria-hidden="true"
                        />
                        <span
                          v-if="!settings.environments.length"
                          class="flex rounded-(--shape-card) border border-dashed border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs) text-body-xs text-(--text-muted)"
                        >
                          No projects yet
                        </span>
                        <ul
                          v-else
                          :aria-label="`Environments of ${settings.name}`"
                          class="m-0 flex min-w-0 flex-1 list-none flex-col gap-(--spacing-xs) p-0"
                        >
                          <li
                            v-for="environment in settings.environments"
                            :key="environment.id"
                            class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
                          >
                            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                              <i
                                class="pi pi-sitemap shrink-0 text-(--text-muted)"
                                aria-hidden="true"
                              />
                              <span class="truncate text-label-md text-(--text-default)">
                                {{ environment.name }}
                              </span>
                              <Tag
                                :label="plural(environment.projects.length, 'project', 'projects')"
                                severity="secondary"
                                size="small"
                              />
                            </span>
                            <span
                              v-for="project in environment.projects"
                              :key="project.id"
                              class="flex min-w-0 items-center gap-(--spacing-xs)"
                            >
                              <i
                                class="pi pi-folder shrink-0 text-(--text-muted)"
                                aria-hidden="true"
                              />
                              <span class="truncate text-body-sm text-(--text-muted)">
                                {{ project.name }}
                              </span>
                            </span>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </template>
                  <span
                    class="sr-only"
                    role="status"
                  >
                    {{ impactState === 'loading' ? 'Computing impact' : '' }}
                  </span>
                </div>
              </template>
              <template
                v-if="impactState === 'ready' || impactState === 'partial'"
                #footer
              >
                <p class="text-body-sm text-(--text-muted)">{{ impactSummary }}</p>
              </template>
            </Card>
          </div>
        </div>
      </div>

      <footer class="sticky bottom-0 shrink-0 border-t border-(--border-muted) bg-(--bg-surface)">
        <div
          class="layout-column-focused layout-boundary-inline flex flex-col gap-(--spacing-sm) py-(--spacing-md) md:flex-row md:items-center md:justify-between"
        >
          <p class="text-body-sm text-(--text-muted)">
            Deploying puts every included resource into traffic at the version shown.
          </p>
          <div class="flex flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end">
            <p
              v-if="blocker"
              class="flex items-center gap-(--spacing-xs) text-body-sm text-(--warning-contrast)"
            >
              <i
                class="pi pi-exclamation-triangle shrink-0"
                aria-hidden="true"
              />
              {{ blocker }}
            </p>
            <div class="flex flex-col gap-(--spacing-sm) md:flex-row md:items-center">
              <Button
                class="w-full md:w-auto"
                label="Cancel"
                kind="outlined"
                size="medium"
                href="/services/web-app"
                :disabled="deploying"
              />
              <ConfirmDialog
                v-model:open="confirmOpen"
                title="Deploy this release?"
                :description="confirmBody"
                confirm-label="Deploy release"
                kind="primary"
                size="small"
                :disabled="!canDeploy"
                @confirm="confirmDeploy"
              >
                <template #trigger>
                  <Button
                    class="w-full md:w-auto"
                    :label="deploying ? 'Deploying…' : 'Deploy release'"
                    kind="primary"
                    size="medium"
                    icon="pi pi-cloud-upload"
                    :disabled="!canDeploy"
                    :loading="deploying"
                  />
                </template>
              </ConfirmDialog>
            </div>
          </div>
        </div>
      </footer>
    </main>
    <Toaster position="bottom-right" />
  </div>
</template>
