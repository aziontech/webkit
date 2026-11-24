<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Separator from '@aziontech/webkit/separator'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { reactive } from 'vue'

  import { listFormat } from '../lib/list-format'
  import type { DeployDrawerDependency, DeployDrawerResource } from '../types'
  import VersionPicker from './version-picker.vue'

  export interface DeployResourcesCardProps {
    /** The resources the deployment sends live, each with the resources it references. */
    resources: DeployDrawerResource[]
    /** Opens every Dependencies disclosure. */
    dependenciesOpen?: boolean
    /** Keys of the resources whose dependencies are reloading; skeleton rows stand in. */
    dependenciesLoadingKeys?: string[]
  }

  const props = withDefaults(defineProps<DeployResourcesCardProps>(), {
    dependenciesOpen: false,
    dependenciesLoadingKeys: () => []
  })

  /** The picked version id per resource key; a resource with no pick shows its first version. */
  const picks = defineModel<Record<string, string>>('picks', { default: () => ({}) })

  const versionOpen = reactive<Record<string, boolean>>({})

  const versionOf = (row: DeployDrawerDependency) =>
    row.versions.find((entry) => entry.id === picks.value[row.key]) ?? row.versions[0]

  const pickVersion = (row: DeployDrawerDependency, id: string) => {
    picks.value = { ...picks.value, [row.key]: id }
    versionOpen[row.key] = false
  }

  const sharedDependency = (row: DeployDrawerResource) =>
    row.dependencies.find((dependency) => dependency.sharedWith?.length)

  const sharedDependencyLabel = (row: DeployDrawerResource) => {
    const shared = sharedDependency(row)
    return (
      `${shared?.name} is shared, so it deploys at one version. ` +
      `Changing it here changes it for ${listFormat(shared?.sharedWith ?? [])} too.`
    )
  }

  const dependenciesLoading = (row: DeployDrawerResource) =>
    props.dependenciesLoadingKeys.includes(row.key)
</script>

<template>
  <Card :padded="false">
    <template #default>
      <template
        v-for="(row, index) in resources"
        :key="row.key"
      >
        <Separator v-if="index" />
        <Item
          size="small"
          data-testid="deploy-resources-card__row"
        >
          <Item.Media>
            <span
              class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
            >
              <i
                :class="row.icon"
                class="text-body-xs text-(--text-default)"
                aria-hidden="true"
              />
            </span>
          </Item.Media>
          <Item.Content>
            <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
              <span class="shrink-0 text-body-sm text-(--text-muted)">
                {{ row.label }}
              </span>
              <Item.Title>{{ row.name }}</Item.Title>
              <Tag
                v-if="!row.note"
                :label="row.versions.length ? 'Ready' : 'No ready version'"
                :severity="row.versions.length ? 'success' : 'warning'"
                size="small"
                class="shrink-0"
              />
            </span>
            <Item.Description>
              {{ row.note || versionOf(row)?.name }}
            </Item.Description>
          </Item.Content>
          <Item.Actions
            v-if="!row.note"
            class="basis-full sm:basis-auto"
          >
            <VersionPicker
              v-model:open="versionOpen[row.key]"
              :row="row"
              :selected-id="versionOf(row)?.id"
              @pick="(id: string) => pickVersion(row, id)"
            />
          </Item.Actions>
        </Item>
        <template v-if="row.owner">
          <Separator />
          <Accordion
            type="single"
            collapsible
            size="medium"
            :default-value="dependenciesOpen ? 'dependencies' : undefined"
          >
            <Accordion.Item value="dependencies">
              <Accordion.Trigger>
                <span class="text-label-sm text-(--text-default)">Dependencies</span>
              </Accordion.Trigger>
              <Accordion.Content>
                <div class="min-w-0">
                  <div
                    v-if="dependenciesLoading(row)"
                    aria-busy="true"
                    class="flex flex-col gap-(--spacing-sm)"
                  >
                    <div
                      v-for="line in row.dependencies.length"
                      :key="line"
                      aria-hidden="true"
                      class="flex min-w-0 items-center gap-(--spacing-sm)"
                    >
                      <Skeleton
                        variant="circle"
                        width="var(--size-4)"
                        height="var(--size-4)"
                      />
                      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
                        <Skeleton
                          width="40%"
                          height="var(--size-3)"
                        />
                        <Skeleton
                          width="70%"
                          height="var(--size-3)"
                        />
                      </div>
                      <Skeleton
                        width="var(--size-24)"
                        height="var(--size-7)"
                      />
                    </div>
                  </div>
                  <p
                    v-else-if="!row.dependencies.length"
                    class="text-body-sm text-(--text-muted)"
                  >
                    {{ row.name }} references no other resources.
                  </p>
                  <div
                    v-else
                    class="flex flex-col gap-(--spacing-sm)"
                  >
                    <Alert
                      v-if="sharedDependency(row)"
                      severity="info"
                      size="small"
                      :label="sharedDependencyLabel(row)"
                    />
                    <Item.Group>
                      <Item
                        v-for="dependency in row.dependencies"
                        :key="dependency.key"
                        variant="inline"
                        size="small"
                      >
                        <Item.Media>
                          <span class="flex size-5 items-center justify-center">
                            <i
                              :class="dependency.icon"
                              class="text-body-xs text-(--text-muted)"
                              aria-hidden="true"
                            />
                          </span>
                        </Item.Media>
                        <Item.Content>
                          <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                            <span class="shrink-0 text-body-sm text-(--text-muted)">
                              {{ dependency.label }}
                            </span>
                            <Item.Title>{{ dependency.name }}</Item.Title>
                            <Tooltip
                              v-if="dependency.sharedWith?.length"
                              :content="`Also referenced by ${listFormat(dependency.sharedWith ?? [])}.`"
                            >
                              <span
                                tabindex="0"
                                class="inline-flex shrink-0 rounded-(--shape-button) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                :aria-label="`Shared, also referenced by ${listFormat(dependency.sharedWith ?? [])}`"
                              >
                                <Tag
                                  label="Shared"
                                  severity="info"
                                  size="small"
                                  icon="az az-link"
                                />
                              </span>
                            </Tooltip>
                            <Tag
                              v-if="!dependency.note"
                              :label="dependency.versions.length ? 'Ready' : 'No ready version'"
                              :severity="dependency.versions.length ? 'success' : 'warning'"
                              size="small"
                              class="shrink-0"
                            />
                          </span>
                          <Item.Description>
                            {{
                              dependency.note ||
                              versionOf(dependency)?.name ||
                              'Build a version to deploy it.'
                            }}
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions v-if="!dependency.note">
                          <VersionPicker
                            v-model:open="versionOpen[dependency.key]"
                            :row="dependency"
                            :selected-id="versionOf(dependency)?.id"
                            @pick="(id: string) => pickVersion(dependency, id)"
                          />
                        </Item.Actions>
                      </Item>
                    </Item.Group>
                  </div>
                  <span
                    class="sr-only"
                    role="status"
                  >
                    {{ dependenciesLoading(row) ? 'Loading dependencies' : '' }}
                  </span>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </template>
      </template>
    </template>
  </Card>
</template>
