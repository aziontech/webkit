<script setup>
  // Application → Build. How code gets into this application, and with what.
  //
  // AZION HAS NO BUILD SERVICE, so this tab does not present one. A build is the Azion
  // CLI running — in the reader's terminal, or in a workflow in their repository — and
  // this tab holds only what the platform actually stores about that: the repository
  // this application is connected to and the branch that ships, the azion.config preset
  // and the commands the CLI runs, and the personal token the workflow authenticates
  // with. The build-service inventions that used to sit here — a root directory, build
  // watch paths, per-branch preview builds, a build cache with a scope and an
  // invalidation policy — described a product we do not ship, and a demo that shows
  // fields nobody can set is worse than one that shows fewer.
  //
  // WHAT IT NO LONGER SHOWS: the azion.json mirror — the domain, the application id,
  // the environment and the last deploy — and the "Get started" commands. Those are
  // what the application IS and how code first reaches it, not how it builds, so both
  // open the Overview tab now (./Overview.vue): the card that names the record, and,
  // for an application with no repository, the steps under it.
  //
  // The Deploy action opens the release page, where a deploy is reviewed and run. Its
  // BUTTON is IN THIS TAB'S HEADING, not on the page's tab row it used to ride: a tab is
  // its own page, so its primary action belongs beside the heading that names it.
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
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import GitProviderConnect from '../../../components/creation/GitProviderConnect.vue'
  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import ResourceLink from '../../../components/resource/ResourceLink.vue'
  import { saveGroup, useBaseline } from '../../../lib/behavior/forms'
  import { useTabDirty } from '../../../lib/behavior/tab-dirty'
  import { presetIcon, presetLabel } from '../../../lib/format/presets'

  const props = defineProps({
    // The application being built — `{ id, name }`.
    application: { type: Object, required: true }
  })

  // An application with no repository is built and shipped from the reader's own terminal
  // (../../../lib/data/applications.js). Every band on this tab that names a repository,
  // a branch or a workflow is a band it does not have.
  const isCli = computed(() => !props.application?.repository)

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // ── Git repository — the connection (actions/checkout in the workflow) ─────
  const repository = ref(props.application?.repository || '')
  const apiTokenName = `${props.application?.name || 'application'} build token`

  // ── Group 1 — Build configuration (preset + build/deploy commands + paths) ──
  const buildConfig = reactive({
    // Seeded from the record, not from the reference repo: the preset is what the Azion
    // CLI builds this application with, and hard-coding `vue` made an HTML site's Build tab
    // claim a framework it does not use (../../../lib/data/applications.js).
    preset: props.application?.preset || 'vue',
    buildCommand: 'azion build',
    deployCommand: 'azion deploy --local'
  })

  // ── Group 2 — the branches the workflow deploys from ──────────────────────
  const productionBranch = props.application?.branch || 'main'
  const branch = reactive({
    productionBranch,
    previewBranch: productionBranch === 'develop' ? 'staging' : 'develop'
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
        :description="
          isCli
            ? 'This application has no repository. Connect one here, or keep deploying from your terminal.'
            : 'How code reaches this application, and what the Azion CLI builds it with.'
        "
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
        <!-- NO REPOSITORY, SO NO CONNECTION TO REPORT — the band offers the connection
             instead of describing one. -->
        <Section
          v-if="isCli"
          stacked
          anchor
          :divided="false"
          title="Git repository"
          hint="Connect a provider to build this application from a repository. Until one is connected, new code reaches it from the CLI only."
        >
          <GitProviderConnect
            title="Connect your repository"
            description="Choose a Git provider, then pick the repository Azion builds this application from."
          />
        </Section>

        <!-- Git repository — the connection (actions/checkout in the workflow).
         A connection, not editable config, so this ItemGroup has no Save. -->
        <Section
          v-else
          stacked
          anchor
          :divided="false"
          title="Git repository"
          hint="The repository Azion builds from — the checkout step of the workflow — and the branches a push deploys."
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
                        <!-- Same shape as the Domain link below, and as every other
                             name in the console that leaves the page
                             (../../../components/resource/ResourceLink.vue). -->
                        <ResourceLink
                          :label="repository"
                          :href="`https://github.com/${repository}`"
                        />
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

                <!-- The one thing about the connection that IS a setting: which branch
                     the workflow deploys from. It rides the tab's single save bar. -->
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Production branch</Item.Title>
                    <Item.Description>
                      Pushes to this branch build and deploy to Production.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                    <InputText
                      v-model="branch.productionBranch"
                      size="large"
                      :disabled="saving"
                      class="w-full font-(family-name:--font-code)"
                      aria-label="Production branch"
                    />
                  </Item.Actions>
                </Item>

                <Item size="small">
                  <Item.Content>
                    <Item.Title>Preview branch</Item.Title>
                    <Item.Description>
                      Pushes to this branch deploy a preview with its own URL. Production is
                      untouched.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                    <InputText
                      v-model="branch.previewBranch"
                      size="large"
                      :disabled="saving"
                      class="w-full font-(family-name:--font-code)"
                      aria-label="Preview branch"
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
            @submit.prevent="save"
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
                          class="w-full font-(family-name:--font-code)"
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
                          class="w-full font-(family-name:--font-code)"
                          aria-label="Deploy command"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </fieldset>
              </template>
            </CardBox>
          </form>
        </Section>

        <!-- Deployment — the personal token the workflow authenticates with. -->
        <Section
          stacked
          anchor
          :divided="false"
          title="Deployment"
          hint="The personal token the workflow authenticates with, kept as a repository secret."
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
