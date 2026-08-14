<script setup>
  // The Workloads module "create" flow — a dedicated PAGE (route /workloads/new),
  // sidebar hidden so the form is the only focus. Layout follows the same Cards +
  // stacked sections shape as Create Application: a centered column of section-
  // titled flush CardBoxes, one `submitting` flag locking the whole scope, a sticky
  // action bar.
  //
  // Two of the sections open sub-drawers rather than inlining their editors:
  //   - Domains → AddDomainDrawer appends a domain record to the list.
  //   - Environments → LinkDeploymentSettingsDrawer flips an environment row from
  //     "unlinked" to "linked", carrying the Application / Firewall / Custom Page
  //     bundle it selected.
  //
  // Two submit paths: "Save as Draft" persists without deploying; "Save and Deploy"
  // is the primary commit. Both require a name (validation runs on submit only,
  // amber `required`, cleared on edit). webkit Button renders type="button", so
  // submit is driven from @click with a hidden sr-only submit button for Enter.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { useBaseline } from '../lib/forms'
  import AddDomainDrawer from './ui/AddDomainDrawer.vue'
  import CreatePage from './ui/CreatePage.vue'
  import FieldRow from './ui/FieldRow.vue'
  import LinkDeploymentSettingsDrawer from './ui/LinkDeploymentSettingsDrawer.vue'
  import Section from './ui/Section.vue'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // --- Form state ----------------------------------------------------------
  // `active` is a property of POST /workspace/workloads with a default of true, and the
  // only one of that endpoint's optional properties this page should ask for: `tls` is
  // already asked per DOMAIN in the table below (each row carries its certificate), and
  // `protocols`, `mtls`, `ciphers` and `infrastructure` belong to the workload's own
  // settings once it exists, not to the six seconds before it does.
  const form = reactive({ name: '', active: true })
  const errors = reactive({ name: '' })
  const submitting = ref(false)

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue, mounted by CreatePage): dirty
  // while the form diverges from the state it opened on. `commit` re-snapshots it, and is
  // called on the way OUT of a successful create — the page's own navigation must not be
  // stopped by the guard that exists to protect the input that create just consumed.
  const { dirty, commit } = useBaseline(form)

  // Domains added through the Add Domain drawer. Rendered as a data-driven Table —
  // the same pattern as the Teams Permissions list (flush CardBox + toolbar with a
  // primary "add" action + row-action Dropdown).
  const domains = ref([])
  const domainColumns = [
    { accessorKey: 'domain', header: 'Domain', principal: true, grow: 2 },
    { accessorKey: 'environment', header: 'Environment' },
    { accessorKey: 'certificate', header: 'Digital Certificate', grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // The two environments a workload ships to. Each is either unlinked (no bundle
  // yet) or linked (carries an Application / Firewall / Custom Page).
  const environments = ref([
    {
      name: 'Production',
      linked: false,
      bundle: '',
      application: null,
      firewall: null,
      customPage: null
    },
    {
      name: 'Stage',
      linked: false,
      bundle: '',
      application: null,
      firewall: null,
      customPage: null
    }
  ])

  // True until at least one environment has a deployment settings bundle linked —
  // drives the "link settings to enable workloads" warning banner.
  const anyLinked = computed(() => environments.value.some((env) => env.linked))

  // --- Sub-drawers ---------------------------------------------------------
  const addDomainOpen = ref(false)
  const linkOpen = ref(false)
  const linkEnvironment = ref('Production')

  const openAddDomain = () => {
    addDomainOpen.value = true
  }
  const onDomainSaved = (domain) => {
    domains.value = [...domains.value, domain]
    toast.success(`Domain "${domain.domain}" added.`)
  }
  const removeDomain = (id) => {
    domains.value = domains.value.filter((domain) => domain.id !== id)
  }
  const onDomainAction = (event, value, row) => {
    if (value === 'delete') {
      removeDomain(row.id)
      toast.success(`Domain "${row.domain}" removed.`)
      return
    }
    toast.info(`Editing ${row.domain}`)
  }

  const openLink = (environmentName) => {
    linkEnvironment.value = environmentName
    linkOpen.value = true
  }
  const onSettingsLinked = (payload) => {
    environments.value = environments.value.map((env) =>
      env.name === payload.environment
        ? {
            ...env,
            linked: true,
            bundle: payload.bundle,
            application: payload.application,
            firewall: payload.firewall,
            customPage: payload.customPage
          }
        : env
    )
    toast.success(`Deployment settings linked to ${payload.environment}.`)
  }
  const unlink = (environmentName) => {
    environments.value = environments.value.map((env) =>
      env.name === environmentName
        ? { ...env, linked: false, bundle: '', application: null, firewall: null, customPage: null }
        : env
    )
  }

  // --- Validation + submit -------------------------------------------------
  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    return !errors.name
  }

  const cancel = () => router.push({ path: '/workloads', query: { email: userEmail.value } })

  // CREATING IS NOT DEPLOYING. This page used to offer "Save as Draft" beside "Save
  // and Deploy", which made publishing a choice buried in a button label: one of the
  // two spends real infrastructure and the other does not, and nothing on the bar
  // said which. Every create in the console now commits and stops — the workload
  // exists, serves nothing, and deploying stays an explicit act from the workload
  // itself. The toast is what carries the reader there.
  const save = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      const name = form.name.trim()
      toast.success(`Workload "${name}" created.`, {
        description: anyLinked.value
          ? 'Deploy it when you are ready to serve traffic.'
          : 'Link deployment settings to an environment before deploying it.',
        action: {
          label: 'Open Workloads',
          onClick: () => router.push({ path: '/workloads', query: { email: userEmail.value } })
        }
      })
      commit() // the create landed — the leave guard stands down
      router.push({ path: '/workloads', query: { email: userEmail.value } })
    } catch (error) {
      toast.error('Could not save the workload.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => save() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <CreatePage
    :breadcrumb="[{ label: 'Workloads', href: '/workloads' }, { label: 'Create Workload' }]"
    back-label="Back to Workloads"
    title="Create Workload"
    description="A workload is the public entry point: the domains traffic arrives on, and the deployment settings each environment serves. Saving creates it; nothing is published until you deploy."
    title-id="create-workload-title"
    :submitting="submitting"
    :dirty="dirty"
    @cancel="cancel"
    @submit="save"
  >
    <Section
      stacked
      :divided="false"
      title="General"
      hint="The only field this endpoint requires. Everything below it can be added after the workload exists."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              title="Name"
              description="Identifies the workload in the list and in every deployment that targets it."
              :message="errors.name"
              message-kind="required"
            >
              <template #default="{ messageId }">
                <InputText
                  v-model="form.name"
                  size="large"
                  class="w-full"
                  aria-label="Name"
                  placeholder="My workload name"
                  autocomplete="off"
                  :disabled="submitting"
                  :required="!!errors.name"
                  :aria-describedby="messageId"
                  @update:model-value="errors.name = ''"
                />
              </template>
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <!-- A table needs the whole measure, so the band is stacked and the card is
         flush around it. -->
    <Section
      stacked
      :divided="false"
      title="Domains"
      hint="The addresses traffic arrives on. A workload can be created without one and answer on its Azion domain until a domain is linked."
    >
      <CardBox :padded="false">
        <template #content>
        <Table
          :data="domains"
          :columns="domainColumns"
          row-key="id"
          :border="false"
        >
          <template #toolbar>
            <div class="flex w-full items-center gap-[var(--spacing-xs)]">
              <Table.Search
                size="large"
                placeholder="Search domains..."
                class="flex-1"
              />
              <Button
                type="button"
                label="Add new Domain"
                kind="primary"
                size="large"
                icon="pi pi-plus"
                @click="openAddDomain"
              />
            </div>
          </template>

          <template #empty>
            <EmptyState
              title="No domains yet"
              description="Add a domain to link it to your workload."
            >
              <template #actions>
                <Button
                  type="button"
                  label="Add new Domain"
                  kind="secondary"
                  size="large"
                  icon="pi pi-plus"
                  @click="openAddDomain"
                />
              </template>
            </EmptyState>
          </template>

          <template #cell-domain="{ row }">
            <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
              <i
                class="pi pi-globe text-[var(--text-muted)]"
                aria-hidden="true"
              />
              <span class="truncate">{{ row.domain }}</span>
            </div>
          </template>

          <template #cell-environment="{ value }">
            <Tag
              :label="value"
              severity="secondary"
              size="medium"
            />
          </template>

          <template #cell-actions="{ row }">
            <Dropdown
              placement="bottom-end"
              @select="(event, value) => onDomainAction(event, value, row)"
            >
              <Dropdown.Trigger>
                <Tooltip text="Domain actions">
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="outlined"
                    size="small"
                    aria-label="Domain actions"
                  />
                </Tooltip>
              </Dropdown.Trigger>
              <Dropdown.Group>
                <Dropdown.Option
                  value="edit"
                  label="Edit"
                >
                  <template #left>
                    <i
                      class="pi pi-pencil"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
              <Dropdown.Group>
                <Dropdown.Option
                  value="delete"
                  label="Delete"
                >
                  <template #left>
                    <i
                      class="pi pi-trash"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
            </Dropdown>
          </template>
        </Table>
        </template>
      </CardBox>
    </Section>

    <Section
      stacked
      :divided="false"
      title="Environments"
      hint="Deployment Settings centralize what an environment serves — application, firewall policy and custom pages — so the same bundle can be reused by every workload that needs it."
    >
      <CardBox :padded="false">
        <template #content>
        <div class="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-md)]">
          <Message
            severity="info"
            label="Workloads use Deployment Settings, which centralize the configuration shared across your environments, including applications, firewall policies, and custom pages."
          />
          <Message
            v-if="!anyLinked"
            severity="warning"
            label="Link Deployment Settings to enable workloads."
          />

          <div class="flex flex-col gap-[var(--spacing-sm)]">
            <div
              v-for="env in environments"
              :key="env.name"
              class="rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-md)]"
            >
              <div class="flex items-start justify-between gap-[var(--spacing-md)]">
                <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                  <span class="text-overline-sm uppercase text-[var(--text-muted)]">
                    Environment
                  </span>
                  <span class="text-label-lg text-[var(--text-default)]">
                    {{ env.name }}
                  </span>
                </div>

                <!-- Unlinked: prompt to link. Linked: show the bundle. -->
                <div class="flex shrink-0 items-center gap-[var(--spacing-sm)]">
                  <template v-if="env.linked">
                    <span class="text-label-md text-[var(--text-default)]">
                      {{ env.bundle }}
                    </span>
                    <Tag
                      label="Linked"
                      severity="success"
                      size="medium"
                    />
                    <Tooltip text="Edit deployment settings">
                      <IconButton
                        icon="pi pi-pencil"
                        kind="outlined"
                        size="small"
                        aria-label="Edit deployment settings"
                        @click="openLink(env.name)"
                      />
                    </Tooltip>
                    <Tooltip text="Unlink deployment settings">
                      <IconButton
                        icon="pi pi-times"
                        kind="transparent"
                        size="small"
                        aria-label="Unlink deployment settings"
                        @click="unlink(env.name)"
                      />
                    </Tooltip>
                  </template>
                  <template v-else>
                    <span class="text-body-sm text-[var(--text-muted)]">
                      Deployment Settings --
                    </span>
                    <Button
                      type="button"
                      label="Link Settings"
                      kind="outlined"
                      size="small"
                      icon="pi pi-plus"
                      @click="openLink(env.name)"
                    />
                  </template>
                </div>
              </div>

              <!-- Linked resources summary -->
              <div
                v-if="env.linked"
                class="mt-[var(--spacing-md)] grid grid-cols-1 gap-[var(--spacing-md)] border-t border-[var(--border-muted)] pt-[var(--spacing-md)] sm:grid-cols-3"
              >
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <span class="text-overline-sm uppercase text-[var(--text-muted)]">
                    Application
                  </span>
                  <span class="text-body-sm text-[var(--text-default)]">
                    {{ env.application.name }}
                    <span class="text-[var(--text-muted)]">{{
                      env.application.version
                    }}</span>
                  </span>
                </div>
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <span class="text-overline-sm uppercase text-[var(--text-muted)]">
                    Firewall
                  </span>
                  <span class="text-body-sm text-[var(--text-default)]">
                    {{ env.firewall.name }}
                    <span class="text-[var(--text-muted)]">{{
                      env.firewall.version
                    }}</span>
                  </span>
                </div>
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <span class="text-overline-sm uppercase text-[var(--text-muted)]">
                    Custom Page
                  </span>
                  <span class="text-body-sm text-[var(--text-default)]">
                    {{ env.customPage.name }}
                    <span class="text-[var(--text-muted)]">{{
                      env.customPage.version
                    }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </template>
      </CardBox>
    </Section>

    <!-- `active` is optional and already defaults on. -->
    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              kind="compact"
              title="Active"
              description="An inactive workload keeps its domains and stops answering on them."
            >
              <Switch
                v-model="form.active"
                aria-label="Active"
                :disabled="submitting"
              />
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <!-- The two in-resource creates this page opens. Both are drawers, because both
         are steps inside work already underway: the workload being defined is the
         context, and a page would throw it away. -->
    <AddDomainDrawer
      v-model:open="addDomainOpen"
      @save="onDomainSaved"
    />
    <LinkDeploymentSettingsDrawer
      v-model:open="linkOpen"
      :environment="linkEnvironment"
      @link="onSettingsLinked"
    />
  </CreatePage>
</template>
