<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'

  /** The branches a push deploys. */
  export interface ResourceBuildBranches {
    /** Pushes to it deploy to Production. */
    productionBranch: string
    /** Pushes to it deploy a preview. */
    previewBranch: string
  }

  export interface ResourceBuildRepositoryProps {
    /** A repository is connected: the band lists it with its branches instead of the connect card. */
    connected: boolean
    /** A save is in flight. */
    saving: boolean
  }

  defineProps<ResourceBuildRepositoryProps>()

  const settings = defineModel<ResourceBuildBranches>('settings', { required: true })

  const repository = 'acme/analytics-app'
</script>

<template>
  <SettingsGroup
    label="Git repository"
    :hint="
      connected
        ? 'The repository this resource builds from, and the branches a push deploys.'
        : 'Connect a provider to build this resource from a repository.'
    "
    anchor="git-repository"
  >
    <Card
      key="repository"
      v-if="connected"
      :padded="false"
    >
      <template #default>
        <fieldset
          class="m-0 flex min-w-0 flex-col border-0 p-0"
          :disabled="saving"
        >
          <legend class="sr-only">Git repository</legend>
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
                  <Link
                    inline
                    :label="repository"
                    :href="`https://github.example.com/${repository}`"
                    target="_blank"
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
              <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                <Input
                  v-model="settings.productionBranch"
                  size="large"
                  :disabled="saving"
                  class="w-full"
                  aria-label="Production branch"
                  monospace
                  :spellcheck="false"
                />
              </div>
            </SettingsRow>

            <SettingsRow
              title="Preview branch"
              description="Pushes to this branch deploy a preview with its own URL. Production is untouched."
              stackable
            >
              <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                <Input
                  v-model="settings.previewBranch"
                  size="large"
                  :disabled="saving"
                  class="w-full"
                  aria-label="Preview branch"
                  monospace
                  :spellcheck="false"
                />
              </div>
            </SettingsRow>
          </Item.List>
        </fieldset>
      </template>
    </Card>
    <Card
      v-else
      key="connect"
    >
      <template #default>
        <div
          class="flex rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) lg:min-h-0 lg:flex-1"
        >
          <EmptyState
            size="medium"
            title="Connect Git repository"
            description="Select a Git provider, then select the repository this resource builds from. Until then, new code reaches it from the CLI only."
            class="w-full"
          >
            <template #icon>
              <span class="relative flex size-10 items-center justify-center">
                <span
                  aria-hidden="true"
                  class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                />
                <span
                  aria-hidden="true"
                  class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                />
                <span
                  class="relative flex size-10 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface)"
                >
                  <i
                    class="az az-github text-body-md leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </template>
            <template #actions>
              <Button
                label="Continue with GitHub"
                icon="az az-github"
                variant="secondary"
                size="large"
              />
              <Link
                label="Manage connected providers"
                href="#"
                size="large"
              />
            </template>
          </EmptyState>
        </div>
      </template>
    </Card>
  </SettingsGroup>
</template>
