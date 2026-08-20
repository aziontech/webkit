<script setup>
  // Application → Build. The UI face of the repo's GitHub Actions deploy workflow
  // (azion-deploy.yml): each row maps to a workflow step, and the "Latest deployment"
  // section mirrors azion/azion.json — the platform state the Azion CLI commits back
  // after every deploy. The Deploy action is the workflow_dispatch analog: it opens the
  // release page, which is where a deploy is reviewed and run. Its BUTTON is IN THIS
  // TAB'S HEADING, not on the page's tab row it used to ride: a tab is its own page, so
  // its primary action belongs beside the heading that names it.
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
  import { latestConsoleDeployForApplication } from '@shared/lib/azion-deploys'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { saveGroup, useBaseline } from '../../../lib/behavior/forms'
  import { useTabDirty } from '../../../lib/behavior/tab-dirty'
  import { presetIcon, presetLabel } from '../../../lib/format/presets'

  const props = defineProps({
    // The application being built — `{ id, name }`.
    application: { type: Object, required: true }
  })

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

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

  // ── Group 2 — Branch control (the workflow_dispatch branch inputs) ─────────
  const branch = reactive({
    productionBranch: 'main',
    nonProdBuilds: true
  })

  // ── ONE commit for the tab ─────────────────────────────────────────────────
  // These bands used to own a Save each, sitting disabled in every card footer
  // until that card was touched. Two problems with that: the reader had to notice
  // WHICH card their edit belonged to before they could commit it, and a page of
  // permanently-greyed buttons advertises work nobody has started. The tab is one
  // build configuration, so it commits as one — and the bar that commits it does
  // not exist until something has been edited, the same model as Main Settings,
  // the account, and a workload's settings.
  const saving = ref(false)
  const { dirty: buildConfigDirty, commit: commitBuildConfig } = useBaseline(buildConfig)
  const { dirty: branchDirty, commit: commitBranch } = useBaseline(branch)
  const dirty = computed(() => buildConfigDirty.value || branchDirty.value)

  // What Discard restores. JSON snapshots rather than reactive copies, so restoring
  // cannot alias the live objects and re-dirty them.
  const snapshot = ref({
    buildConfig: JSON.parse(JSON.stringify(buildConfig)),
    branch: JSON.parse(JSON.stringify(branch))
  })

  const save = () =>
    saveGroup(saving, 'Build settings saved.', () => {
      commitBuildConfig()
      commitBranch()
      snapshot.value = {
        buildConfig: JSON.parse(JSON.stringify(buildConfig)),
        branch: JSON.parse(JSON.stringify(branch))
      }
    })

  const discard = () => {
    Object.assign(buildConfig, JSON.parse(JSON.stringify(snapshot.value.buildConfig)))
    Object.assign(branch, JSON.parse(JSON.stringify(snapshot.value.branch)))
  }

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

  // The most recent deployment of THIS application started in this session, if there is
  // one. That is what closes the deploy → azion.json → UI loop now that the deploy itself
  // happens on the release page: the run rotates the storage prefix on the record
  // (src/lib/azion-deploys.js), and this section reads it back. With no session deploy it
  // falls back to the prefix committed in azion.json.
  const latestRecord = computed(() => latestConsoleDeployForApplication(props.application.id))

  // prefix (YYYYMMDDHHMMSS) → a readable "last deploy" timestamp.
  const lastDeploy = computed(() => {
    const p = latestRecord.value?.edge.prefix ?? azionState.prefix
    if (!/^\d{14}$/.test(p)) return p
    const date = new Date(
      `${p.slice(0, 4)}-${p.slice(4, 6)}-${p.slice(6, 8)}T${p.slice(8, 10)}:${p.slice(10, 12)}:${p.slice(12, 14)}`
    )
    return Number.isNaN(date.getTime())
      ? p
      : date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  })

  // ── Deploy ────────────────────────────────────────────────────────────────
  // The page's Deploy button opens the RELEASE PAGE (components/ReleaseComposer.vue),
  // the console's one deploy surface, SCOPED to this application: only its version
  // changes, every Deployment setting the release lands on keeps the firewall and the
  // custom page it binds, and the scope rides the query string so the review is
  // linkable and survives a reload. It is the same entry an Applications row uses —
  // deploying this application is one act with one screen, wherever it is started.
  //
  // It used to open a deploy DRAWER instead, which made this the one place where a
  // deploy was reviewed less than everywhere else. Before that it ran a private
  // simulation and left no deployment anywhere. What the tab keeps is the half only it
  // can show: the azion.json state the deploy writes back.
  const deploy = () => {
    router.push({
      path: '/deployments/releases/new',
      query: {
        email: userEmail.value,
        scopedType: 'application',
        // A Deployment setting binds resources by NAME, so a release is scoped by name
        // too — the same key on both sides, never translated.
        resourceId: props.application.name
      }
    })
  }

  // Deploy is triggered from the page's tab row (ApplicationDetail).
  // The shell marks this tab and asks before letting the reader leave it with the
  // build configuration uncommitted (../../lib/tab-dirty.js).
  useTabDirty('build', { dirty, saving }, { label: 'Build configuration changed.', save, discard })
</script>

<template>
  <div class="flex min-w-0 flex-col">
    <div
      class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
    >
      <PageHeading
        title="Build"
        description="Connect your application to a Git repository for automatic builds and deployments."
        size="small"
      >
        <template #actions>
          <HeadingAction
            label="Deploy"
            kind="primary"
            icon="pi pi-cloud-upload"
            @click="deploy"
          />
        </template>
      </PageHeading>

      <div class="mt-(--layout-section-gap) flex min-w-0 flex-col">
        <!-- Git repository — the connection (actions/checkout in the workflow).
         A connection, not editable config, so this ItemGroup has no Save. -->
        <Section
          stacked
          anchor
          :divided="false"
          title="Git repository"
          hint="The repository Azion builds from — the checkout step of the workflow. A connection, not configuration, so there is nothing to save here."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Connected repository</Item.Title>
                    <Item.Description>
                      <span class="inline-flex items-center gap-(--spacing-xxs)">
                        <i
                          :class="presetIcon(buildConfig.preset)"
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
                          class="inline-flex items-center gap-(--spacing-xxs) whitespace-nowrap text-label-sm text-(--text-default) hover:underline"
                        >
                          <span>{{ repository }}</span>
                          <i
                            class="pi pi-arrow-up-right shrink-0 text-(--text-muted)"
                            aria-hidden="true"
                          />
                        </a>
                      </span>
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end gap-(--spacing-xs)">
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
        </Section>

        <!-- Group 1 — Build configuration. Editable ItemGroup (Item.Title is the
         label; controls carry an aria-label) owning its OWN footer Save; the whole
         group locks off the page's one `saving` flag and stays disabled until a field
         diverges from its saved baseline. -->
        <Section
          stacked
          anchor
          :divided="false"
          title="Build configuration"
          hint="How the Azion CLI builds this application. The framework preset is detected from azion.config and cannot be changed here."
        >
          <form
            aria-label="Build configuration"
            novalidate
            @submit.prevent="saveBuildConfig"
          >
            <CardBox :padded="false">
              <template #content>
                <fieldset
                  class="m-0 flex min-w-0 flex-col border-0 p-0"
                  :disabled="saving"
                >
                  <legend class="sr-only">Build configuration</legend>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Framework preset</Item.Title>
                        <Item.Description> The preset the Azion CLI builds with. </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
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
                        <Item.Description
                          >The command that builds the application.</Item.Description
                        >
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputText
                          v-model="buildConfig.buildCommand"
                          size="large"
                          :disabled="saving"
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
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputText
                          v-model="buildConfig.deployCommand"
                          size="large"
                          :disabled="saving"
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
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputText
                          v-model="buildConfig.rootDirectory"
                          size="large"
                          :disabled="saving"
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
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputText
                          v-model="buildConfig.watchPaths"
                          size="large"
                          :disabled="saving"
                          class="w-full font-code"
                          aria-label="Build watch paths"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </fieldset>
              </template>
            </CardBox>
          </form>
        </Section>

        <!-- Group 2 — Branch control. Its own ItemGroup, its own independent Save
         (locks off the page's one `saving` flag, disabled until it is dirty). -->
        <Section
          stacked
          anchor
          :divided="false"
          title="Branch control"
          hint="Which branch is production, and whether pushes to other branches build at all."
        >
          <form
            aria-label="Branch control"
            novalidate
            @submit.prevent="saveBranch"
          >
            <CardBox :padded="false">
              <template #content>
                <fieldset
                  class="m-0 flex min-w-0 flex-col border-0 p-0"
                  :disabled="saving"
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
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputText
                          v-model="branch.productionBranch"
                          size="large"
                          :disabled="saving"
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
                          :disabled="saving"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </fieldset>
              </template>
            </CardBox>
          </form>
        </Section>

        <!-- Deployment — the API token + build cache affordances (single values /
         toggles, so an ItemGroup rather than a table). -->
        <Section
          stacked
          anchor
          :divided="false"
          title="Deployment"
          hint="The token the pipeline deploys with, and whether builds reuse a cache."
        >
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
                  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
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
        </Section>

        <!-- Revealed only when the build cache is on: its options as a standard
         ItemGroup section (same anatomy as every other section — a section title
         over a flush CardBox whose body is an Item.List, one Item row per option,
         control on the right). Applied live; the Deployment section carries no
         group Save. -->
        <Section
          v-if="buildCacheEnabled"
          stacked
          anchor
          :divided="false"
          title="Build cache settings"
          hint="How long build artifacts are reused before a clean build runs."
        >
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
                  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
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
        </Section>

        <!-- Latest deployment — mirrors azion/azion.json (API ⇆ UI). Wrapped in a
         section like every band above: without it the title sat a SECTION gap from
         the card it names instead of the group gap, reading as detached. -->
        <Section
          stacked
          anchor
          :divided="false"
          title="Latest deployment"
          hint="The manifest of the most recent deployment, mirroring azion/azion.json field for field."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Domain</Item.Title>
                    <Item.Description>The edge domain serving this application.</Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end gap-(--spacing-xs)">
                    <!-- Same view-details logic + external-redirect arrow. -->
                    <a
                      :href="azionState.domainUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-(--spacing-xxs) whitespace-nowrap text-label-sm text-(--text-default) hover:underline"
                    >
                      <span>{{ azionState.domainName }}</span>
                      <i
                        class="pi pi-arrow-up-right shrink-0 text-(--text-muted)"
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
                  <Item.Actions class="justify-end gap-(--spacing-xs)">
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
                    <span class="text-(--text-muted)">{{ lastDeploy }}</span>
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>
      </div>
    </div>

    <!-- ONE bar for the tab, and it exists only once something has been edited. It
         slides up on the first change and leaves again on Discard, so a tab nobody
         has touched spends no height advertising a commit that has nothing to do. -->
    <!-- THE SAME BAR EVERY COMMITTING SURFACE IN THE CONSOLE USES
         (../../components/ui/SettingsSaveBar.vue). This tab used to hand-roll its own
         footer: the same two buttons and the same entrance, but no leave guard and no
         way for the page around it to know this tab was holding work. Both of those
         come with the shared component.

         `route-guard="false"` because the SHELL holds the guard for this page — it has
         to ask about the tab being LEFT, which is not always the tab that is active by
         the time the reader answers (../../components/ApplicationDetail.vue). -->
    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      :route-guard="false"
      label="Build configuration changed."
      hint="Saving applies it to the next build of this application."
      @save="save"
      @discard="discard"
    />
  </div>
</template>
