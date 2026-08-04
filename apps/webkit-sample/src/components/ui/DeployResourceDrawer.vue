<script setup>
  // Deploy — the ONE deploy interaction in the console.
  //
  // Every resource page runs this same drawer: an Application row, an application's
  // Build tab, a Workload row, a workload's page, and the Deployments module's "New
  // Deployment". The subject changes; the form does not. That is the point — a deploy
  // is one action with one shape, so it cannot mean something slightly different per
  // module.
  //
  // The FIELDS are the body of the one request Azion has for this:
  //
  //   POST /v4/workspace/workloads/{workload_id}/deployments
  //   { name, active, current, strategy: { type, attributes: { application, firewall, custom_page } } }
  //
  //   Workload            → the path parameter. A deployment belongs to exactly one
  //                         workload, so this is never a multi-select and never blank.
  //   Application         → strategy.attributes.application (mandatory).
  //   Deployment Settings → the `strategy` itself: which application / firewall /
  //                         custom page combination this deployment binds. Authored
  //                         once in the Settings tab and applied here, from any
  //                         resource — "Azion Default" is the platform's own.
  //   Name                → `name`.
  //   Set as current      → `current`. THE PUBLISH: the deployment that is current
  //                         is the one serving traffic, so one per workload.
  //
  // What is deliberately NOT here:
  //
  //   • an Environment field — Production / Staging is the WORKLOAD's own
  //     infrastructure, not a property of a deployment, so it is reported under the
  //     workload rather than chosen again here;
  //   • a Version field — the deployment IS the version (its id is what the CLI, the
  //     URL and a support thread refer to);
  //   • a strategy TYPE field — `default` is the only type the platform exposes, so
  //     it rides in the body as a constant instead of as a Select with one option;
  //   • the firewall / custom page as editable rows — they belong to the strategy,
  //     which is the thing meant to be reused. Changing them per deploy is what the
  //     Select's "Create Deployment Settings" quick-add is for.
  //
  // FORM — Drawer form, FIELDS SEPARATED (`/webkit-form` Approach B), the same shape
  // as ./AddVariableDrawer.vue: the fields sit directly on the panel surface, each a
  // triad of a real `<Label for>`, the control, and (only after a failed submit) its
  // own message wired through `aria-describedby`. A single full-bleed `Divider` splits
  // the two halves of the task — WHERE this deployment goes, above; WHAT the
  // deployment itself is, below — so the sections read as sections without a title or
  // a CardBox to announce them. A composed `Select` labels its TRIGGER (the focusable
  // element), never the wrapper. Fields sit at the compact modal-body step
  // (`--spacing-md`); an empty required field is amber `required` (a prompt, never the
  // red `invalid`), one `submitting` flag locks the scope (fieldset `:disabled` + Save
  // `:loading`), and the `sr-only` submit keeps Enter working.
  //
  // NESTED DRAWER — the Deployment Settings Select points at a resource the user may
  // not have created yet, so its footer carries a "Create Deployment Settings"
  // quick-add that opens the settings drawer STACKED over this one. The two are
  // independent forms with their own `submitting` flags; on save the new strategy is
  // selected back into this form and everything already filled in is still here.
  //
  // Submitting starts the run and closes. The run itself lives at module scope
  // (src/lib/deploy-runs.js): the deployment record exists Building from the first
  // second, this drawer unmounting cancels nothing, and the progress rides a toast
  // through whatever the user does next.
  import Button from '@aziontech/webkit/button'
  import Divider from '@aziontech/webkit/divider'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import FieldText from '@aziontech/webkit/field-text'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import { computed, reactive, ref, useId, watch } from 'vue'

  import { APPLICATIONS } from '../../lib/applications'
  import { startResourceDeployRun } from '../../lib/deploy-runs'
  import {
    AZION_DEFAULT_ID,
    bindingLabel,
    strategyById,
    strategyOptions
  } from '../../lib/deployment-strategies'
  import {
    findDeploymentByApplication,
    provisionedApplications,
    provisionedWorkloads
  } from '../../lib/provisioning'
  import { WORKLOADS } from '../../lib/workloads'
  import DeploymentSettingsDrawer from './DeploymentSettingsDrawer.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  const props = defineProps({
    // The resource the drawer was opened from, when it was opened from one:
    // `{ kind: 'application' | 'workload', id, name }`. That field is then FIXED —
    // the user came here to deploy this, so the drawer reports it instead of asking
    // again. Opened from the Deployments module there is no subject, and both Selects
    // are free.
    resource: { type: Object, default: null }
  })

  const emit = defineEmits(['deployed'])

  // One id namespace per instance, so every `for` ↔ control pair stays unique even
  // with a second instance mounted (a resource page and the module both host one).
  const scope = useId()
  const workloadFieldId = `${scope}-workload`
  const applicationFieldId = `${scope}-application`
  const strategyFieldId = `${scope}-strategy`
  const nameFieldId = `${scope}-name`

  // Everything this workspace can deploy: what the session created (newest first, the
  // same order the module lists show) then the seed. One source, so the drawer offers
  // exactly what the lists offer.
  const workloadRecords = computed(() => [...provisionedWorkloads.value, ...WORKLOADS])
  const applicationRecords = computed(() => [...provisionedApplications.value, ...APPLICATIONS])

  const workloadOptions = computed(() =>
    workloadRecords.value.map((workload) => ({ value: workload.id, label: workload.name }))
  )
  const applicationOptions = computed(() =>
    applicationRecords.value.map((application) => ({
      value: application.id,
      label: application.name
    }))
  )

  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''

  const form = reactive({
    workloadId: '',
    applicationId: '',
    strategyId: AZION_DEFAULT_ID,
    name: '',
    current: true
  })

  const errors = reactive({ workloadId: '', applicationId: '', name: '' })
  const submitting = ref(false)

  // Which fields the subject already answers. Opened from a workload the workload is
  // fixed; opened from an application the application is — and if that application was
  // provisioned as part of a chain, the workload publishing it is known too, so it is
  // preselected (still changeable: the same application can go to another workload).
  const lockedWorkload = computed(() => props.resource?.kind === 'workload')
  const lockedApplication = computed(() => props.resource?.kind === 'application')

  const workload = computed(() =>
    workloadRecords.value.find((record) => record.id === form.workloadId)
  )
  const application = computed(() =>
    applicationRecords.value.find((record) => record.id === form.applicationId)
  )
  const strategy = computed(() => strategyById(form.strategyId))

  // Production / Staging comes from the workload, so it is REPORTED, never asked: the
  // deployment lands wherever its workload lives (`infrastructure` in the API).
  const environment = computed(() => workload.value?.environment || 'Production')

  // The workload field's resting guidance: where this deployment will land. It replaces
  // nothing — on a failed submit the amber message takes the row instead.
  const workloadHint = computed(() =>
    workload.value
      ? `Lands on ${workload.value.domain} · ${environment.value}`
      : 'The public entry point that will serve this deployment.'
  )

  // The deployment's default name. `<application>-deploy` reads as what it is in the
  // list, and stays editable because `name` is the field a team uses to say what a
  // deployment was for ("black-friday", "rollback-1420").
  const defaultName = computed(() =>
    application.value?.name ? `${application.value.name}-deploy` : ''
  )

  const subjectLine = computed(() => {
    if (props.resource?.kind === 'application') {
      return `Deploying the application ${props.resource.name}.`
    }
    if (props.resource?.kind === 'workload') {
      return `Deploying onto the workload ${props.resource.name}.`
    }
    return 'Pick what to deploy and where it lands.'
  })

  // What "Set as current" commits to, named: the domain it will start serving.
  const currentDescription = computed(() =>
    workload.value
      ? `Starts serving ${workload.value.domain} once it is Ready, replacing the workload's current deployment.`
      : "Starts serving the workload once it is Ready, replacing the workload's current deployment."
  )

  // Opening seeds the form from the subject; closing resets it. Both run off the same
  // watcher so the drawer can never open holding the last deploy's answers.
  watch(open, (isOpen) => {
    if (!isOpen) {
      submitting.value = false
      return
    }

    form.workloadId = lockedWorkload.value ? String(props.resource.id) : ''
    form.applicationId = lockedApplication.value ? String(props.resource.id) : ''

    if (lockedApplication.value) {
      const chain = findDeploymentByApplication(props.resource.id)
      if (chain) form.workloadId = chain.workload.id
    }

    form.strategyId = AZION_DEFAULT_ID
    form.current = true
    form.name = defaultName.value
    errors.workloadId = ''
    errors.applicationId = ''
    errors.name = ''
  })

  // Picking the application fills the name, until the user has typed their own.
  watch(
    () => form.applicationId,
    () => {
      if (!form.name || form.name.endsWith('-deploy')) form.name = defaultName.value
      errors.applicationId = ''
    }
  )

  // ── The nested settings drawer ─────────────────────────────────────────────
  // A sentinel Select value for the quick-add. The Select is CONTROLLED
  // (`:model-value`), so picking the sentinel never commits a strategy that does not
  // exist — it opens the child instead.
  const CREATE_STRATEGY = '__create-strategy__'
  const strategySelectOpen = ref(false)
  const settingsOpen = ref(false)

  const onStrategyModel = (value) => {
    if (value === CREATE_STRATEGY) {
      strategySelectOpen.value = false // close the dropdown …
      settingsOpen.value = true // … then open the child over this panel
      return
    }
    form.strategyId = value
  }

  // The child's save wires the new strategy back in: it is already in the store, so
  // the Select offers it — this only selects it. Everything else the user filled in is
  // untouched, because this form never unmounted.
  const onStrategyCreated = (created) => {
    form.strategyId = created.id
  }

  const validate = () => {
    errors.workloadId = form.workloadId ? '' : 'Select the workload this deployment belongs to.'
    errors.applicationId = form.applicationId ? '' : 'Select the application to deploy.'
    errors.name = form.name.trim() ? '' : 'This field is required.'
    return !errors.workloadId && !errors.applicationId && !errors.name
  }

  const cancel = () => {
    open.value = false
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      // The run owns everything from here: the record, the pipeline, the toast, and
      // surviving this drawer being unmounted a moment from now.
      const run = startResourceDeployRun({
        workload: {
          id: workload.value.id,
          name: workload.value.name,
          domain: workload.value.domain
        },
        application: { id: application.value.id, name: application.value.name },
        strategy: strategy.value ? { id: strategy.value.id, name: strategy.value.name } : null,
        deploymentName: form.name.trim(),
        current: form.current,
        environment: environment.value,
        preset: application.value.preset || 'vue'
      })
      open.value = false
      emit('deployed', run)
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="medium"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="New Deployment"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
              <DrawerTitle>New Deployment</DrawerTitle>
              <p class="text-body-sm text-[var(--text-muted)]">
                {{ subjectLine }} The run keeps going if you leave this page.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <!-- Compact modal body: fields --spacing-md apart. One flag locks the
                 whole scope while the request is in flight. -->
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-[var(--spacing-md)] border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">New Deployment</legend>

              <!-- WHERE this deployment goes: the workload (the request's path
                   parameter) and the application it publishes. -->
              <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                <Label
                  :for="workloadFieldId"
                  required
                  >Workload</Label
                >
                <!-- Label required ALWAYS; the empty-required Select uses :required
                     (amber semantics), never :invalid (red). Select has no amber
                     border, so the HelperText below carries the cue. -->
                <Select
                  v-model="form.workloadId"
                  size="large"
                  class="w-full"
                  placeholder="Select a workload"
                  :disabled="submitting || lockedWorkload"
                  :required="!!errors.workloadId"
                  :display-value="labelFor(workloadOptions)"
                  @update:model-value="errors.workloadId = ''"
                >
                  <Select.Trigger
                    :id="workloadFieldId"
                    :aria-describedby="`${workloadFieldId}-message`"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in workloadOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
                <!-- The helper row is the guidance row: where this lands at rest, the
                     amber prompt after an empty submit. Production / Staging is the
                     workload's own infrastructure, so it is reported, never asked. -->
                <HelperText
                  :id="`${workloadFieldId}-message`"
                  :kind="errors.workloadId ? 'required' : 'helper'"
                  :label="errors.workloadId || workloadHint"
                />
              </div>

              <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                <Label
                  :for="applicationFieldId"
                  required
                  >Application</Label
                >
                <Select
                  v-model="form.applicationId"
                  size="large"
                  class="w-full"
                  placeholder="Select an application"
                  :disabled="submitting || lockedApplication"
                  :required="!!errors.applicationId"
                  :display-value="labelFor(applicationOptions)"
                  @update:model-value="errors.applicationId = ''"
                >
                  <Select.Trigger
                    :id="applicationFieldId"
                    :aria-describedby="`${applicationFieldId}-message`"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in applicationOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
                <HelperText
                  :id="`${applicationFieldId}-message`"
                  :kind="errors.applicationId ? 'required' : 'helper'"
                  :label="
                    errors.applicationId ||
                    'The resource being deployed. A deployment always binds one.'
                  "
                />
              </div>

              <!-- Full-bleed boundary: WHERE it goes, above; WHAT the deployment is,
                   below. The wrapper carries the negative inset so the Divider itself
                   stays untouched (a `w-full` flex item with negative margins would
                   shift rather than stretch). -->
              <div class="-mx-[var(--spacing-lg)]">
                <Divider />
              </div>

              <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                <Label :for="strategyFieldId">Deployment Settings</Label>
                <!-- CONTROLLED + intercepted: the footer's sentinel option opens the
                     nested drawer instead of committing a value. -->
                <Select
                  v-model:open="strategySelectOpen"
                  :model-value="form.strategyId"
                  size="large"
                  class="w-full"
                  :disabled="submitting"
                  :display-value="labelFor(strategyOptions)"
                  @update:model-value="onStrategyModel"
                >
                  <Select.Trigger
                    :id="strategyFieldId"
                    :aria-describedby="`${strategyFieldId}-message`"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in strategyOptions"
                      :key="option.value"
                      :value="option.value"
                      :disabled="option.disabled"
                    >
                      {{ option.label }}
                    </Select.Option>
                    <template #footer>
                      <Select.Option
                        :value="CREATE_STRATEGY"
                        icon="pi pi-plus-circle"
                        class="w-full"
                      >
                        Create Deployment Settings
                      </Select.Option>
                    </template>
                  </Select.Content>
                </Select>
                <!-- What the chosen strategy binds — the two nullable attributes of
                     the request body, read back. -->
                <HelperText
                  :id="`${strategyFieldId}-message`"
                  :label="
                    strategy
                      ? `Firewall: ${bindingLabel(strategy.firewall)} · Custom Page: ${bindingLabel(strategy.customPage)}`
                      : 'The strategy this deployment applies.'
                  "
                />
              </div>

              <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                <Label
                  :for="nameFieldId"
                  required
                  >Name</Label
                >
                <FieldText
                  v-model="form.name"
                  :input-id="nameFieldId"
                  name="name"
                  size="large"
                  placeholder="my-application-deploy"
                  :disabled="submitting"
                  :required="!!errors.name"
                  :helper-text="
                    errors.name || 'What this deployment was for — how it reads in the history.'
                  "
                  @update:model-value="errors.name = ''"
                />
              </div>

              <!-- The publish, as a block: the switch, what it commits to, and the
                   domain it will start serving. -->
              <FieldSwitchBlock
                v-model="form.current"
                label="Set as current"
                :description="currentDescription"
                :disabled="submitting"
              />
            </fieldset>
          </PanelContent>

          <PanelFooter class="flex-col md:flex-row md:justify-end">
            <Button
              class="w-full md:w-auto"
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="cancel"
            />
            <Button
              class="w-full md:w-auto"
              label="Deploy"
              kind="primary"
              size="medium"
              icon="pi pi-cloud-upload"
              :loading="submitting"
              @click="submit"
            />
            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              Deploy
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>

  <!-- The CHILD drawer: its own form, its own scoped save, stacked above this panel.
       This form stays mounted underneath, so nothing filled in here is lost. -->
  <DeploymentSettingsDrawer
    v-model:open="settingsOpen"
    nested
    @create="onStrategyCreated"
  />
</template>
