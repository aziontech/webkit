<script setup>
  // Application → Build. The UI face of the repo's GitHub Actions deploy workflow
  // (azion-deploy.yml): each row maps to a workflow step, and the "Latest deployment"
  // section mirrors azion/azion.json — the platform state the Azion CLI commits back
  // after every deploy. The Deploy action is the workflow_dispatch analog: it
  // simulates a build+deploy and bumps the prefix live, closing the
  // deploy → azion.json → UI loop. Its BUTTON is on the page's tab row
  // (ApplicationDetail owns that row); the flow and its pending flag stay here and
  // are reached through `defineExpose`.
  //
  // The editable configuration is split into topic groups, each a flush ItemGroup
  // owning its OWN footer Save that locks and dirties INDEPENDENTLY: `buildConfig`
  // (preset + the CLI commands the workflow runs) and `branch` (the
  // workflow_dispatch branch inputs). The repository connection and the deployment
  // rows are informational/action-only, so they carry no group Save.
  //
  // LAYOUT — this band picks its own measure, and it picks the FORM one
  // (`.layout-column-form`), matching Main Settings: every band here is a stacked row
  // of label-plus-control, so the same argument applies — past the form measure the
  // extra width lands inside the controls and separates each label from the field it
  // names. Per layout.css the unit that picks a class is the BAND, not the file, so
  // this can differ from the list tabs without inconsistency.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import InputGroup from '@aziontech/webkit/input-group'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'

  import DeployResourceDrawer from '../../components/ui/DeployResourceDrawer.vue'
  import PageHeading from '../../components/ui/PageHeading.vue'
  import SectionHeading from '../../components/ui/SectionHeading.vue'
  import { saveGroup, useBaseline } from '../../lib/forms'
  import { presetIcon, presetLabel } from '../../lib/presets'

  const props = defineProps({
    // The application being built — `{ id, name }`.
    application: { type: Object, required: true }
  })

  // ── Git repository — the connection (actions/checkout in the workflow) ─────
  const repository = ref('gab-az/webkit-sample-vue')
  const apiTokenName = 'webkit-sample-vue build token'

  // ── Group 1 — Build configuration (preset + build/deploy commands + paths) ──
  const buildConfig = reactive({
    preset: 'vue',
    buildCommand: 'azion build',
    deployCommand: 'azion deploy --local',
    rootDirectory: '/',
    watchPaths: '*'
  })
  const savingBuildConfig = ref(false)
  const { dirty: buildConfigDirty, commit: commitBuildConfig } = useBaseline(buildConfig)
  const saveBuildConfig = () =>
    saveGroup(savingBuildConfig, 'Build configuration saved.', commitBuildConfig)

  // ── Group 2 — Branch control (the workflow_dispatch branch inputs) ─────────
  const branch = reactive({
    productionBranch: 'main',
    nonProdBuilds: true
  })
  const savingBranch = ref(false)
  const { dirty: branchDirty, commit: commitBranch } = useBaseline(branch)
  const saveBranch = () => saveGroup(savingBranch, 'Branch settings saved.', commitBranch)

  // Row affordances that don't mutate anything in this demo.
  const comingSoon = (what) => toast.info(what, { description: 'Not available in this demo.' })

  // ── Deployment — API token + build cache ──────────────────────────────────
  const buildCacheEnabled = ref(true)
  // Build-cache options, revealed below the toggle when the cache is on. Applied
  // live (the Deployment section has no group Save), like the appearance prefs
  // elsewhere.
  const buildCacheScopeOptions = [
    { label: 'Per branch', value: 'branch' },
    { label: 'Shared across branches', value: 'shared' }
  ]
  const buildCache = reactive({
    scope: 'branch',
    autoInvalidate: true
  })
  const buildCacheScopeLabel = (value) =>
    buildCacheScopeOptions.find((option) => option.value === value)?.label ?? ''

  // ── Platform state — the mirror of azion/azion.json ───────────────────────
  const azionState = reactive({
    applicationId: props.application.id,
    domainUrl: 'https://e7b4verynr.map.azionedge.net',
    domainName: 'e7b4verynr.map.azionedge.net',
    env: 'production',
    prefix: '20260720130245'
  })

  // prefix (YYYYMMDDHHMMSS) → a readable "last deploy" timestamp.
  const lastDeploy = computed(() => {
    const p = azionState.prefix
    if (!/^\d{14}$/.test(p)) return p
    const date = new Date(
      `${p.slice(0, 4)}-${p.slice(4, 6)}-${p.slice(6, 8)}T${p.slice(8, 10)}:${p.slice(10, 12)}:${p.slice(12, 14)}`
    )
    return Number.isNaN(date.getTime())
      ? p
      : date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  })

  // ── Deploy ────────────────────────────────────────────────────────────────
  // The page's Deploy button opens the ONE deploy interaction every resource page
  // uses (components/ui/DeployResourceDrawer.vue), with this application already
  // chosen. It used to run its own private simulation — a toast, a sleep, a bumped
  // prefix — which meant a deploy from here left no deployment anywhere: no row in
  // the Deployments module, no page, no history on the workload. Now it starts the
  // same run every other entry point does, and this tab keeps what only it can show:
  // the azion.json state that comes back when the run lands.
  //
  // `deploying` still exists for the tab row's spinner, but it only covers the moment
  // the drawer is opening. The RUN itself is not this component's to own: it lives at
  // module scope (src/lib/deploy-runs.js) and outlives the whole page.
  const deployOpen = ref(false)
  const deploying = ref(false)

  const deployTarget = computed(() => ({
    kind: 'application',
    id: props.application.id,
    name: props.application.name
  }))

  const deploy = () => {
    deployOpen.value = true
  }

  // What the run leaves on THIS tab: the storage prefix the upload step rotated, so
  // "Last deploy" reads the deploy that just happened — the azion.json ⇆ UI loop this
  // section exists to close.
  const onDeployed = (run) => {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    azionState.prefix = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
    toast.info(`Deployment ${run.deployId} started`, {
      description: `Building ${repository.value} (${branch.productionBranch}) with the ${presetLabel(buildConfig.preset)} preset.`
    })
  }

  // Deploy is triggered from the page's tab row (ApplicationDetail), which also
  // mirrors `deploying` onto the button so the spinner stays with the work.
  defineExpose({ deploy, deploying })
</script>

<template>
  <div class="layout-column-form layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Build"
      description="Connect your application to a Git repository for automatic builds and deployments."
      size="small"
    />

    <section class="layout-section-start flex flex-col gap-[var(--layout-section-gap)]">
      <!-- Git repository — the connection (actions/checkout in the workflow).
         A connection, not editable config, so this ItemGroup has no Save. -->
      <section class="flex flex-col gap-[var(--layout-group-gap)]">
        <SectionHeading
          title="Git repository"
          anchor
        />
        <CardBox :padded="false">
          <template #content>
            <Item.List>
              <Item size="small">
                <Item.Content>
                  <Item.Title>Connected repository</Item.Title>
                  <Item.Description>
                    <span class="inline-flex items-center gap-[var(--spacing-xxs)]">
                      <i
                        :class="`ai-cor ${presetIcon(buildConfig.preset)}`"
                        class="text-[1.05em]"
                        :title="presetLabel(buildConfig.preset)"
                        aria-hidden="true"
                      />
                      <i
                        class="pi pi-github"
                        aria-hidden="true"
                      />
                      <!-- Same interaction as the Domain link below: the value is
                         the external link (hover underline + redirect arrow). -->
                      <a
                        :href="`https://github.com/${repository}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-[var(--spacing-xxs)] whitespace-nowrap text-label-sm text-[var(--text-default)] hover:underline"
                      >
                        <span>{{ repository }}</span>
                        <i
                          class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]"
                          aria-hidden="true"
                        />
                      </a>
                    </span>
                  </Item.Description>
                </Item.Content>
                <Item.Actions class="justify-end gap-[var(--spacing-xs)]">
                  <Button
                    label="Disconnect"
                    kind="danger"
                    size="small"
                    @click="comingSoon('Disconnect repository')"
                  />
                </Item.Actions>
              </Item>
            </Item.List>
          </template>
        </CardBox>
      </section>

      <!-- Group 1 — Build configuration. Editable ItemGroup (Item.Title is the
         label; controls carry an aria-label) owning its OWN footer Save; the whole
         group locks off `savingBuildConfig` and stays disabled until a field
         diverges from its saved baseline. -->
      <form
        class="flex flex-col gap-[var(--layout-group-gap)]"
        aria-label="Build configuration"
        novalidate
        @submit.prevent="saveBuildConfig"
      >
        <SectionHeading
          title="Build configuration"
          anchor
          documentation="https://www.azion.com/en/documentation/"
        />
        <CardBox :padded="false">
          <template #content>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="savingBuildConfig"
            >
              <legend class="sr-only">Build configuration</legend>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Framework preset</Item.Title>
                    <Item.Description> The preset the Azion CLI builds with. </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                    <!-- Detected from azion.config — not editable here. The reason
                       rides on a Tooltip over the field itself instead of a
                       permanent HelperText: it is an explanation for one row's
                       exception, not standing guidance, so it should cost nothing
                       until asked for — and a sentence parked under the control also
                       made this row taller than its editable neighbours below.
                       `flex-1` on the Tooltip (its trigger span is `w-fit`) makes it
                       fill the cluster, so the field still lines up with the command
                       fields — a disabled field is not an excuse to collapse
                       narrower. `pointer-events-none` on the field is what makes the
                       Tooltip reachable at all: browsers dispatch no mouse events
                       over a disabled control, so hits have to fall through to the
                       trigger span, which then carries the `not-allowed` cursor. -->
                    <Tooltip
                      text="Detected from azion.config and can't be changed here."
                      class="flex-1 cursor-not-allowed"
                    >
                      <InputText
                        :model-value="presetLabel(buildConfig.preset)"
                        size="large"
                        disabled
                        class="pointer-events-none w-full"
                        aria-label="Framework preset"
                      />
                    </Tooltip>
                  </Item.Actions>
                </Item>

                <Item size="small">
                  <Item.Content>
                    <Item.Title>Build command</Item.Title>
                    <Item.Description>The command that builds the application.</Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                    <InputText
                      v-model="buildConfig.buildCommand"
                      size="large"
                      :disabled="savingBuildConfig"
                      class="w-full font-code"
                      aria-label="Build command"
                    />
                  </Item.Actions>
                </Item>

                <Item size="small">
                  <Item.Content>
                    <Item.Title>Deploy command</Item.Title>
                    <Item.Description
                      >The command that deploys the build to the edge.</Item.Description
                    >
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                    <InputText
                      v-model="buildConfig.deployCommand"
                      size="large"
                      :disabled="savingBuildConfig"
                      class="w-full font-code"
                      aria-label="Deploy command"
                    />
                  </Item.Actions>
                </Item>

                <Item size="small">
                  <Item.Content>
                    <Item.Title>Root directory</Item.Title>
                    <Item.Description>The directory the build runs from.</Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                    <InputText
                      v-model="buildConfig.rootDirectory"
                      size="large"
                      :disabled="savingBuildConfig"
                      class="w-full font-code"
                      aria-label="Root directory"
                    />
                  </Item.Actions>
                </Item>

                <Item size="small">
                  <Item.Content>
                    <Item.Title>Build watch paths</Item.Title>
                    <Item.Description
                      >Only changes to these paths trigger a build.</Item.Description
                    >
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                    <InputText
                      v-model="buildConfig.watchPaths"
                      size="large"
                      :disabled="savingBuildConfig"
                      class="w-full font-code"
                      aria-label="Build watch paths"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </fieldset>
          </template>
          <template #footer>
            <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
              <Button
                label="Save"
                kind="secondary"
                size="medium"
                :loading="savingBuildConfig"
                :disabled="!buildConfigDirty"
                @click="saveBuildConfig"
              />
            </div>
          </template>
        </CardBox>
      </form>

      <!-- Group 2 — Branch control. Its own ItemGroup, its own independent Save
         (locks off `savingBranch`, disabled until it is dirty). -->
      <form
        class="flex flex-col gap-[var(--layout-group-gap)]"
        aria-label="Branch control"
        novalidate
        @submit.prevent="saveBranch"
      >
        <SectionHeading
          title="Branch control"
          anchor
        />
        <CardBox :padded="false">
          <template #content>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="savingBranch"
            >
              <legend class="sr-only">Branch control</legend>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Production branch</Item.Title>
                    <Item.Description>
                      Pushes to this branch deploy to production.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                    <InputText
                      v-model="branch.productionBranch"
                      size="large"
                      :disabled="savingBranch"
                      class="w-full font-code"
                      aria-label="Production branch"
                    />
                  </Item.Actions>
                </Item>

                <Item size="small">
                  <Item.Content>
                    <Item.Title>Builds for non-production branches</Item.Title>
                    <Item.Description>
                      Build and preview pushes to branches other than production.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Switch
                      v-model="branch.nonProdBuilds"
                      aria-label="Builds for non-production branches"
                      :disabled="savingBranch"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </fieldset>
          </template>
          <template #footer>
            <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
              <Button
                label="Save"
                kind="secondary"
                size="medium"
                :loading="savingBranch"
                :disabled="!branchDirty"
                @click="saveBranch"
              />
            </div>
          </template>
        </CardBox>
      </form>

      <!-- Deployment — the API token + build cache affordances (single values /
         toggles, so an ItemGroup rather than a table). -->
      <section class="flex flex-col gap-[var(--layout-group-gap)]">
        <SectionHeading
          title="Deployment"
          anchor
        />
        <CardBox :padded="false">
          <template #content>
            <Item.List>
              <!-- API token — the AZION_PERSONAL_TOKEN GitHub secret. The token name
                 is the field VALUE on the right: a readonly InputText with a copy
                 addon (InputGroup), not buried in the description. -->
              <Item size="small">
                <Item.Content>
                  <Item.Title>API token</Item.Title>
                  <Item.Description>
                    Stored as the AZION_PERSONAL_TOKEN GitHub secret.
                  </Item.Description>
                </Item.Content>
                <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                  <InputGroup class="w-full">
                    <InputText
                      :model-value="apiTokenName"
                      size="large"
                      class="flex-1"
                      aria-label="API token"
                      readonly
                    />
                    <CopyButton
                      kind="transparent"
                      :value="apiTokenName"
                      aria-label="Copy API token"
                    />
                  </InputGroup>
                </Item.Actions>
              </Item>

              <!-- Build cache — a switch on the right (field-on-right pattern). When
                 on, its options are revealed in the section below. -->
              <Item size="small">
                <Item.Content>
                  <Item.Title>Build cache</Item.Title>
                  <Item.Description>
                    Reuse cached build artifacts across deploys to speed up builds.
                  </Item.Description>
                </Item.Content>
                <Item.Actions class="justify-end">
                  <Switch
                    v-model="buildCacheEnabled"
                    aria-label="Build cache"
                  />
                </Item.Actions>
              </Item>
            </Item.List>
          </template>
        </CardBox>
      </section>

      <!-- Revealed only when the build cache is on: its options as a standard
         ItemGroup section (same anatomy as every other section — a section title
         over a flush CardBox whose body is an Item.List, one Item row per option,
         control on the right). Applied live; the Deployment section carries no
         group Save. -->
      <section
        v-if="buildCacheEnabled"
        class="flex flex-col gap-[var(--layout-group-gap)]"
      >
        <SectionHeading
          title="Build cache settings"
          anchor
        />
        <CardBox :padded="false">
          <template #content>
            <Item.List>
              <Item size="small">
                <Item.Content>
                  <Item.Title>Cache scope</Item.Title>
                  <Item.Description>
                    Whether each branch keeps its own cache or all branches share one.
                  </Item.Description>
                </Item.Content>
                <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                  <Select
                    v-model="buildCache.scope"
                    size="large"
                    class="w-full"
                    :display-value="buildCacheScopeLabel"
                  >
                    <Select.Trigger aria-label="Cache scope" />
                    <Select.Content>
                      <Select.Option
                        v-for="option in buildCacheScopeOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>
                </Item.Actions>
              </Item>
              <Item size="small">
                <Item.Content>
                  <Item.Title>Auto-invalidate on config change</Item.Title>
                  <Item.Description>
                    Discard the cache automatically when the build configuration changes.
                  </Item.Description>
                </Item.Content>
                <Item.Actions class="justify-end">
                  <Switch
                    v-model="buildCache.autoInvalidate"
                    aria-label="Auto-invalidate on config change"
                  />
                </Item.Actions>
              </Item>
              <Item size="small">
                <Item.Content>
                  <Item.Title>Clear cache</Item.Title>
                  <Item.Description>
                    Remove all cached build artifacts; the next deploy rebuilds from scratch.
                  </Item.Description>
                </Item.Content>
                <Item.Actions class="justify-end">
                  <Button
                    type="button"
                    label="Clear cache"
                    kind="outlined"
                    size="medium"
                    icon="pi pi-refresh"
                    @click="comingSoon('Clear build cache')"
                  />
                </Item.Actions>
              </Item>
            </Item.List>
          </template>
        </CardBox>
      </section>

      <!-- Latest deployment — mirrors azion/azion.json (API ⇆ UI). Wrapped in a
         section like every band above: without it the title sat a SECTION gap from
         the card it names instead of the group gap, reading as detached. -->
      <section class="flex flex-col gap-[var(--layout-group-gap)]">
        <SectionHeading
          title="Latest deployment"
          anchor
        />
        <CardBox :padded="false">
          <template #content>
            <Item.List>
              <Item size="small">
                <Item.Content>
                  <Item.Title>Domain</Item.Title>
                  <Item.Description>The edge domain serving this application.</Item.Description>
                </Item.Content>
                <Item.Actions class="justify-end gap-[var(--spacing-xs)]">
                  <!-- Same view-details logic + external-redirect arrow. -->
                  <a
                    :href="azionState.domainUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-[var(--spacing-xxs)] whitespace-nowrap text-label-sm text-[var(--text-default)] hover:underline"
                  >
                    <span>{{ azionState.domainName }}</span>
                    <i
                      class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                  </a>
                  <CopyButton
                    kind="outlined"
                    :value="azionState.domainUrl"
                    aria-label="Copy domain URL"
                  />
                </Item.Actions>
              </Item>
              <Item size="small">
                <Item.Content>
                  <Item.Title>Application ID</Item.Title>
                </Item.Content>
                <Item.Actions class="justify-end gap-[var(--spacing-xs)]">
                  <span class="text-label-code-sm">{{ azionState.applicationId }}</span>
                  <CopyButton
                    kind="outlined"
                    :value="azionState.applicationId"
                    aria-label="Copy application ID"
                  />
                </Item.Actions>
              </Item>
              <Item size="small">
                <Item.Content>
                  <Item.Title>Environment</Item.Title>
                </Item.Content>
                <Item.Actions class="justify-end">
                  <Tag
                    :label="azionState.env"
                    severity="secondary"
                    size="medium"
                  />
                </Item.Actions>
              </Item>
              <Item size="small">
                <Item.Content>
                  <Item.Title>Last deploy</Item.Title>
                </Item.Content>
                <Item.Actions class="justify-end">
                  <span class="text-[var(--text-muted)]">{{ lastDeploy }}</span>
                </Item.Actions>
              </Item>
            </Item.List>
          </template>
        </CardBox>
      </section>
    </section>

    <!-- The one deploy interaction, opened by the tab row's Deploy button with this
         application already chosen. -->
    <DeployResourceDrawer
      v-model:open="deployOpen"
      :resource="deployTarget"
      @deployed="onDeployed"
    />
  </div>
</template>
