<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Subheader from '@aziontech/webkit/subheader'
  import TableCellLink from '@aziontech/webkit/table-cell-link'

  /** The build settings of the application. */
  export interface ApplicationBuildSettings {
    /** Pushes to it deploy to Production. */
    productionBranch: string
    /** Pushes to it deploy a preview. */
    previewBranch: string
    /** The command that builds the application. */
    buildCommand: string
    /** The command that deploys the build. */
    deployCommand: string
  }

  export interface ApplicationBuildFormProps {
    /** The application name, used in the token. */
    name: string
    /** The connected repository, owner and name. */
    repository: string
    /** The settings differ from the saved ones. */
    dirty: boolean
    /** A save is in flight. */
    saving: boolean
  }

  defineProps<ApplicationBuildFormProps>()

  const build = defineModel<ApplicationBuildSettings>('form', { required: true })

  const emit = defineEmits<{
    save: []
    discard: []
    'save-shortcut': []
  }>()
</script>

<template>
  <div
    class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
  >
    <Subheader
      title="Build"
      description="How code reaches this application, and what the CLI builds it with."
      size="small"
    />

    <form
      class="mt-(--layout-section-gap) flex min-w-0 flex-col"
      aria-label="Build settings"
      novalidate
      @submit.prevent="emit('save')"
    >
      <fieldset
        class="m-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="saving"
      >
        <legend class="sr-only">Build settings</legend>
        <SettingsGroup
          label="Git repository"
          hint="The repository this application builds from, and the branches a push deploys."
          anchor="git-repository"
        >
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingsRow
                  title="Connected repository"
                  variant="compact"
                >
                  <template #description>
                    <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
                      <i
                        class="az az-github shrink-0"
                        aria-hidden="true"
                      />
                      <TableCellLink
                        :label="repository"
                        :href="`https://github.com/${repository}`"
                      />
                    </span>
                  </template>
                  <Button
                    type="button"
                    label="Disconnect"
                    variant="danger"
                    size="small"
                  />
                </SettingsRow>
                <SettingsRow
                  title="Production branch"
                  description="Pushes to this branch build and deploy to Production."
                  stackable
                >
                  <Input
                    v-model="build.productionBranch"
                    size="large"
                    class="w-full"
                    aria-label="Production branch"
                    monospace
                    :spellcheck="false"
                  />
                </SettingsRow>
                <SettingsRow
                  title="Preview branch"
                  description="Pushes to this branch deploy a preview with its own URL. Production is untouched."
                  stackable
                >
                  <Input
                    v-model="build.previewBranch"
                    size="large"
                    class="w-full"
                    aria-label="Preview branch"
                    monospace
                    :spellcheck="false"
                  />
                </SettingsRow>
              </Item.List>
            </template>
          </Card>
        </SettingsGroup>

        <SettingsGroup
          label="Build configuration"
          hint="How the CLI builds this application."
          anchor="build-configuration"
        >
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingsRow
                  title="Build command"
                  description="The command that builds the application."
                  stackable
                >
                  <Input
                    v-model="build.buildCommand"
                    size="large"
                    class="w-full"
                    aria-label="Build command"
                    monospace
                    :spellcheck="false"
                  />
                </SettingsRow>
                <SettingsRow
                  title="Deploy command"
                  description="The command that deploys the build."
                  stackable
                >
                  <Input
                    v-model="build.deployCommand"
                    size="large"
                    class="w-full"
                    aria-label="Deploy command"
                    monospace
                    :spellcheck="false"
                  />
                </SettingsRow>
              </Item.List>
            </template>
          </Card>
        </SettingsGroup>

        <SettingsGroup
          label="Deployment"
          hint="The personal token the workflow authenticates with, kept as a repository secret."
          anchor="deployment"
        >
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingsRow
                  title="API token"
                  description="Stored as the PLATFORM_TOKEN GitHub secret."
                  stackable
                >
                  <InputGroupRoot class="w-full">
                    <div class="flex flex-1">
                      <Input
                        :model-value="`${name} build token`"
                        size="large"
                        class="w-full"
                        aria-label="API token"
                        monospace
                        readonly
                      />
                    </div>
                    <CopyButton
                      variant="ghost"
                      :value="`${name} build token`"
                      aria-label="Copy API token"
                      size="small"
                    />
                  </InputGroupRoot>
                </SettingsRow>
              </Item.List>
            </template>
          </Card>
        </SettingsGroup>
      </fieldset>
    </form>

    <Transition
      enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
      leave-to-class="translate-y-2 opacity-0"
    >
      <SaveBar
        v-if="dirty || saving"
        @save="emit('save-shortcut')"
      >
        Build settings changed.
        <span class="text-(--text-muted)">Saving applies them to the next build.</span>
        <template #actions>
          <Button
            type="button"
            label="Discard"
            variant="outline"
            size="medium"
            :disabled="saving"
            @click="emit('discard')"
          />
          <Button
            variant="primary"
            size="medium"
            :loading="saving"
            @click="emit('save')"
            aria-keyshortcuts="Meta+S Control+S"
          >
            Save
            <Kbd
              meta
              size="small"
              aria-hidden="true"
              >S</Kbd
            >
          </Button>
        </template>
      </SaveBar>
    </Transition>
  </div>
</template>
