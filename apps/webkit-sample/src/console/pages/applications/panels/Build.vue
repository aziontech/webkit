<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
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

  interface Props {
    application: Record<string, unknown>
  }

  const props = defineProps<Props>()

  const isCli = computed(() => !props.application?.repository)

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const repository = ref(props.application?.repository || '')
  const apiTokenName = `${props.application?.name || 'application'} build token`

  const buildConfig = reactive({
    preset: props.application?.preset || 'vue',
    buildCommand: 'azion build',
    deployCommand: 'azion deploy --local'
  })

  const productionBranch = props.application?.branch || 'main'
  const branch = reactive({
    productionBranch,
    previewBranch: productionBranch === 'develop' ? 'staging' : 'develop'
  })

  const saving = ref(false)
  const { dirty: buildConfigDirty, commit: commitBuildConfig } = useBaseline(buildConfig)
  const { dirty: branchDirty, commit: commitBranch } = useBaseline(branch)
  const dirty = computed(() => buildConfigDirty.value || branchDirty.value)

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

  const comingSoon = (what) => toast.info(what, { description: 'Not available in this demo.' })

  const deploy = () => {
    router.push({
      path: '/deployments/releases/new',
      query: {
        email: userEmail.value,
        scopedType: 'application',
        resourceId: props.application.name
      }
    })
  }

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
            kind="outlined"
            icon="pi pi-cloud-upload"
            @click="deploy"
          />
        </template>
      </PageHeading>

      <div class="mt-(--layout-section-gap) flex min-w-0 flex-col">
        <Section key="section-1"
          v-if="isCli"
          stacked
          anchor
          :divided="false"
          title="Git repository"
          hint="Connect a provider to build this application from a repository."
        >
          <GitProviderConnect
            title="Connect your repository"
            description="Choose a Git provider, then pick the repository Azion builds this application from. Until then, new code reaches it from the CLI only."
          />
        </Section>

        <Section key="section-2"
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
                          class="text-body-md"
                          :title="presetLabel(buildConfig.preset)"
                          aria-hidden="true"
                        />
                        <i
                          class="pi pi-github"
                          aria-hidden="true"
                        />
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

        <Section
          stacked
          anchor
          :divided="false"
          title="Build configuration"
          hint="How the Azion CLI builds this application."
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
                <Item size="small">
                  <Item.Content>
                    <Item.Title>API token</Item.Title>
                    <Item.Description>
                      Stored as the AZION_PERSONAL_TOKEN GitHub secret.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                    <InputGroupRoot class="w-full">
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
                    </InputGroupRoot>
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>
      </div>
    </div>

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
