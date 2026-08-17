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
  // One submit path: Save creates the workload and stops. Validation runs on submit
  // only (amber `required`, cleared on edit). webkit Button renders type="button", so
  // submit is driven from @click with a hidden sr-only submit button for Enter.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FieldRow from '../../components/form/FieldRow.vue'
  import CreatePage from '../../components/page/CreatePage.vue'
  import Section from '../../components/page/Section.vue'
  import AddDomainDrawer from '../../components/workload/AddDomainDrawer.vue'
  import LinkDeploymentSettingsDrawer from '../../components/workload/LinkDeploymentSettingsDrawer.vue'
  import { useBaseline } from '../../lib/behavior/forms'
  import { CERTIFICATE_OPTIONS, TLS_VERSION_OPTIONS } from '../../lib/data/create-resources'

  // Stored value → visible label, for every Select on the page. Without it the trigger
  // prints the raw API value (`tls_1_2` instead of "TLS 1.2").
  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // --- Form state ----------------------------------------------------------
  // The page mirrors the workload create request, and the split between the open bands
  // and Advanced is the endpoint's own required/defaulted split.
  //
  // NO INFRASTRUCTURE FIELD. It used to sit in General, argued for on the grounds that a
  // choice the reader can never revisit cannot be one a collapsed band answers for them.
  // The argument was sound and the field was still wrong: the versioned create flow does
  // not carry `infrastructure` at all — the environment a domain answers on is what
  // decides where it is served, and that is asked on the domain. A field with no request
  // behind it is not made better by putting it in the right band.
  //
  // TLS IS A PROPERTY OF THE WORKLOAD, not of a domain. The Add Domain drawer used to ask
  // for a certificate per row, which let two domains on one workload choose two different
  // certificates — a form with no valid request body behind it, since `tls.certificate` is
  // a single value. The certificate is asked once, here, and the drawer stopped asking.
  //
  // `protocols`, `mtls` and `ciphers` still belong to the workload's own settings once it
  // exists, not to the six seconds before it does.
  const form = reactive({
    name: '',
    // Advanced — every one of these already carries the endpoint's default.
    certificate: 'azion_san',
    minimumTlsVersion: 'tls_1_2',
    allowAzionDomain: true,
    active: true
  })
  const errors = reactive({ name: '' })
  const submitting = ref(false)

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue, mounted by CreatePage): dirty
  // while the form diverges from the state it opened on. `commit` re-snapshots it, and is
  // called on the way OUT of a successful create — the page's own navigation must not be
  // stopped by the guard that exists to protect the input that create just consumed.
  const { dirty, commit } = useBaseline(form)

  // Domains added through the Add Domain drawer.
  //
  // A LIST, NOT A TABLE. This band used to be a data-driven Table with a toolbar, a
  // header row and a row-action Dropdown — three columns of chrome around a list that
  // is empty on arrival and a handful of rows at most on save. A table is for rows the
  // reader SCANS and compares; these are rows they are WRITING, one at a time, and the
  // header row named two fields the rows already say for themselves. It also made this
  // one band read as a different product from the two around it, which are both
  // Item.List rows in a flush card (the ItemGroup anatomy every other create page uses).
  //
  // No certificate per row: the certificate is one workload-level answer (see the
  // form-state note above), asked once in Advanced rather than on every domain.
  const domains = ref([])

  // THE ENVIRONMENTS BAND IS A PROJECTION OF THE DOMAINS. It used to be a hardcoded pair
  // of rows — Production and Stage — always on screen, always asking to be linked, even
  // on a workload with no domain at all. That is not what the endpoint models: a domain
  // entry carries the environment it answers on (`{ name, environment, certificate }`),
  // and the request body groups those entries BY environment into one binding each
  // (`{ environment_id, deployment_id, certificate, domains: [...] }`). An environment
  // with no domain pointing at it has no binding to send, so a row for it is a field
  // with no request behind it.
  //
  // So the reader never picks an environment here. They pick it on the domain, in the Add
  // Domain drawer, and this band shows one row per DISTINCT environment their domains
  // reference — the same `environmentsInUse` derivation the console runs. No domains yet
  // means no rows, and the band says why instead of pretending there is work to do.
  //
  // Environments are also a real account resource (name + deployment policy), not the two
  // literals this sample carries; `ENVIRONMENT_OPTIONS` stands in for that list.

  // Deployment settings, keyed by environment name. Not derived — this is what the reader
  // linked. Kept even when the last domain on an environment is removed (the row simply
  // stops rendering): re-adding a domain there restores the link rather than silently
  // losing it, and an environment no domain references contributes no binding on submit.
  const deploymentByEnvironment = ref({})

  // One row per environment the domains actually reference, in first-seen order, each
  // carrying the domains that put it there and whatever is linked to it.
  const environmentsInUse = computed(() => {
    const seen = new Map()
    for (const row of domains.value) {
      if (!row.environment) continue
      if (!seen.has(row.environment)) {
        seen.set(row.environment, { name: row.environment, domains: [] })
      }
      seen.get(row.environment).domains.push(row.domain)
    }
    return Array.from(seen.values(), (env) => ({
      ...env,
      settings: deploymentByEnvironment.value[env.name] ?? null
    }))
  })

  // Whether every environment in use has something to serve. It used to drive a warning
  // banner pinned to the top of the band from first paint — a permanent nag for a
  // condition the form never actually enforced on submit, which is the worst of both: it
  // reads like validation and blocks nothing. A workload legitimately exists before it
  // serves anything, so the unlinked state is said once, quietly, by the row that is
  // unlinked, and the consequence is carried by the success toast, which is where the
  // reader is when it matters.
  const unlinkedEnvironments = computed(() =>
    environmentsInUse.value.filter((env) => !env.settings).map((env) => env.name)
  )

  // The one-line summary a linked row shows as its description: what this environment
  // actually serves, in the order the drawer asked for it.
  const bundleSummary = (settings) =>
    [
      `${settings.application.name} ${settings.application.version}`,
      `${settings.firewall.name} ${settings.firewall.version}`,
      `${settings.customPage.name} ${settings.customPage.version}`
    ].join(' · ')

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
  const onDomainRemove = (row) => {
    removeDomain(row.id)
    toast.success(`Domain "${row.domain}" removed.`)
  }
  const onDomainEdit = (row) => {
    toast.info(`Editing ${row.domain}`)
  }

  const openLink = (environmentName) => {
    linkEnvironment.value = environmentName
    linkOpen.value = true
  }
  const onSettingsLinked = (payload) => {
    deploymentByEnvironment.value = {
      ...deploymentByEnvironment.value,
      [payload.environment]: {
        bundle: payload.bundle,
        application: payload.application,
        firewall: payload.firewall,
        customPage: payload.customPage
      }
    }
    toast.success(`Deployment settings linked to ${payload.environment}.`)
  }
  const unlink = (environmentName) => {
    const next = { ...deploymentByEnvironment.value }
    delete next[environmentName]
    deploymentByEnvironment.value = next
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
      // THE TOAST OPENS THE THING IT NAMES. Its action used to push `/workloads` — the
      // same list `save` navigates to a line later — so the button did nothing, on the one
      // toast whose entire job is to save the reader from hunting for the row they just
      // made. It opens the workload.
      const id = `wl-${Date.now()}`
      toast.success(`Workload "${name}" created.`, {
        // What is missing is named, because the reader is leaving the form that could
        // have fixed it: no domain at all, or a domain whose environment serves nothing.
        description: !domains.value.length
          ? 'Add a domain to it, then link deployment settings to the environment it answers on.'
          : unlinkedEnvironments.value.length
            ? `Link deployment settings to ${unlinkedEnvironments.value.join(' and ')} before deploying it.`
            : 'Deploy it when you are ready to serve traffic.',
        action: {
          // The unit, not the name: a workload name is as long as the reader made it, and
          // a toast action has to keep its words at every width. Every create toast in the
          // console reads the same — Open workload, Open application, Open connector.
          label: 'Open workload',
          onClick: () =>
            router.push({ path: `/workloads/${id}`, query: { email: userEmail.value } })
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
      hint="The name the endpoint requires, and the one choice that cannot be revised later. Everything below can be added after the workload exists."
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

    <!-- The card needs the whole measure, so the band is stacked and the card is
         flush around it — the same shape as General and Environments. -->
    <Section
      stacked
      :divided="false"
      title="Domains"
      hint="The addresses traffic arrives on. A workload can be created without one and answer on its Azion domain until a domain is linked."
    >
      <!-- ONE ROW PER DOMAIN, in the anatomy every other band on this page uses. The
           row IS the record: the domain is the title, the environment it answers on is
           the tag beside its controls. No header row — two columns whose names the
           rows already say — and no toolbar: adding is the last row of the list, where
           the reader's eye already is after the row they just added.
           No globe glyph either. A list under a heading that says Domains does not need
           every row to say it again. -->
      <CardBox :padded="false">
        <template #content>
          <Item.List v-if="domains.length">
            <FieldRow
              v-for="row in domains"
              :key="row.id"
              kind="compact"
              :title="row.domain"
            >
              <div class="flex shrink-0 items-center gap-[var(--spacing-sm)]">
                <Tag
                  :label="row.environment"
                  severity="secondary"
                  size="medium"
                />
                <!-- Two controls, not a kebab over two options: a menu that hides
                     exactly what a pair of glyphs would have shown costs a click to
                     reveal nothing new. Same pair, same order, as the Environments
                     band below. -->
                <Tooltip :text="`Edit ${row.domain}`">
                  <IconButton
                    icon="pi pi-pencil"
                    kind="outlined"
                    size="small"
                    :aria-label="`Edit ${row.domain}`"
                    :disabled="submitting"
                    @click="onDomainEdit(row)"
                  />
                </Tooltip>
                <Tooltip :text="`Remove ${row.domain}`">
                  <IconButton
                    icon="pi pi-times"
                    kind="transparent"
                    size="small"
                    :aria-label="`Remove ${row.domain}`"
                    :disabled="submitting"
                    @click="onDomainRemove(row)"
                  />
                </Tooltip>
              </div>
            </FieldRow>

            <!-- Adding is the list's last row rather than a toolbar above it: this list
                 is being BUILT in this session, so "and another" belongs at the end of
                 what has been written, not in a band of chrome over it. The button is
                 pulled left by its own inline padding so its glyph starts on the same x
                 as the domain names above it. -->
            <Item size="small">
              <Item.Content>
                <Button
                  type="button"
                  label="Add domain"
                  kind="text"
                  size="small"
                  icon="pi pi-plus"
                  class="-ml-[var(--spacing-xs)] self-start"
                  :disabled="submitting"
                  @click="openAddDomain"
                />
              </Item.Content>
            </Item>
          </Item.List>

          <!-- Nothing yet. The empty state carries the add control itself, so the list
               above it does not also need its trailing row. -->
          <EmptyState
            v-else
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
                :disabled="submitting"
                @click="openAddDomain"
              />
            </template>
          </EmptyState>
        </template>
      </CardBox>
    </Section>

    <Section
      stacked
      :divided="false"
      title="Environments"
      hint="The environments your domains answer on. Each one needs Deployment Settings — the application, firewall policy and custom pages it serves — and the same bundle can be reused by every workload that needs it."
    >
      <!-- ONE ROW PER ENVIRONMENT THE DOMAINS REFERENCE, in the anatomy every other band
           on this page uses. This band used to hand-roll its own bordered cards inside the
           flush card — a card in a card, with overline/value grids standing in for rows —
           so it read as a different product from the two bands above it. An environment IS
           a row: the name is the label, what it serves is the guidance, and linking is the
           control. The prose that sat on top of it as an info Message is now the band's
           Hint, which is where guidance goes; it was saying the Hint's sentence twice.
           The rows come from the Domains band above (see `environmentsInUse`) — this band
           never asks which environments exist, only what each one in use should serve. -->
      <CardBox :padded="false">
        <template #content>
          <Item.List v-if="environmentsInUse.length">
            <FieldRow
              v-for="env in environmentsInUse"
              :key="env.name"
              kind="compact"
              :title="env.name"
              :description="
                env.settings
                  ? `${env.settings.bundle} — ${bundleSummary(env.settings)}`
                  : `No deployment settings linked. ${env.domains.join(', ')} serves nothing until one is.`
              "
            >
              <div class="flex shrink-0 items-center gap-[var(--spacing-sm)]">
                <template v-if="env.settings">
                  <Tag
                    label="Linked"
                    severity="success"
                    size="medium"
                  />
                  <Tooltip :text="`Edit the deployment settings for ${env.name}`">
                    <IconButton
                      icon="pi pi-pencil"
                      kind="outlined"
                      size="small"
                      :aria-label="`Edit the deployment settings for ${env.name}`"
                      :disabled="submitting"
                      @click="openLink(env.name)"
                    />
                  </Tooltip>
                  <Tooltip :text="`Unlink the deployment settings from ${env.name}`">
                    <IconButton
                      icon="pi pi-times"
                      kind="transparent"
                      size="small"
                      :aria-label="`Unlink the deployment settings from ${env.name}`"
                      :disabled="submitting"
                      @click="unlink(env.name)"
                    />
                  </Tooltip>
                </template>
                <Button
                  v-else
                  type="button"
                  label="Link Settings"
                  kind="outlined"
                  size="small"
                  icon="pi pi-plus"
                  :aria-label="`Link deployment settings to ${env.name}`"
                  :disabled="submitting"
                  @click="openLink(env.name)"
                />
              </div>
            </FieldRow>
          </Item.List>

          <!-- No domain, no environment — and NO CTA. An environment cannot be entered
               here at all: it is chosen on the domain, so the only control that would
               fill this band is the one the Domains band above already carries. A button
               here would be a second door onto the same drawer, one band away from it,
               implying this band has input of its own. It states the dependency and
               stops. -->
          <EmptyState
            v-else
            title="No environments yet"
            description="An environment appears here once a domain answers on it. Add a domain above and pick its environment."
          />
        </template>
      </CardBox>
    </Section>

    <!-- Every row here is optional at the endpoint AND already carries its default, so
         submitting the band untouched posts exactly what the API would have applied on
         its own. Nothing required is inside the disclosure — a failed submit can only
         ever point at a field already on screen. -->
    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
      hint="Optional settings that already carry the platform's defaults. Leave them as they are and the workload is created exactly as it would be without this band."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <!-- `tls.certificate` — ONE certificate per workload, which is why the Add
                 Domain drawer no longer asks per row. -->
            <FieldRow
              title="Digital certificate"
              description="Serves every domain on this workload over HTTPS. A managed certificate is issued and renewed for you."
            >
              <template #default="{ messageId }">
                <Select
                  v-model="form.certificate"
                  size="large"
                  :disabled="submitting"
                  :display-value="labelFor(CERTIFICATE_OPTIONS)"
                >
                  <Select.Trigger
                    class="w-full"
                    aria-label="Digital certificate"
                    :aria-describedby="messageId"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in CERTIFICATE_OPTIONS"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </template>
            </FieldRow>

            <FieldRow
              title="Minimum TLS version"
              description="Connections negotiating below this version are refused."
            >
              <template #default="{ messageId }">
                <Select
                  v-model="form.minimumTlsVersion"
                  size="large"
                  :disabled="submitting"
                  :display-value="labelFor(TLS_VERSION_OPTIONS)"
                >
                  <Select.Trigger
                    class="w-full"
                    aria-label="Minimum TLS version"
                    :aria-describedby="messageId"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in TLS_VERSION_OPTIONS"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </template>
            </FieldRow>

            <!-- `workload_domain_allow_access` — the hostname the platform mints for this
                 workload, which is what you test against before DNS moves. -->
            <FieldRow
              kind="compact"
              title="Keep the Azion domain answering"
              description="The workload stays reachable on its own azionedge.net hostname alongside any domain you add."
            >
              <Switch
                v-model="form.allowAzionDomain"
                aria-label="Keep the Azion domain answering"
                :disabled="submitting"
              />
            </FieldRow>

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
