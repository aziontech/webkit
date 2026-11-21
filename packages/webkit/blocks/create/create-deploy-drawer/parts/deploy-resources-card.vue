<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Separator from '@aziontech/webkit/separator'
  import Tag from '@aziontech/webkit/tag'
  import { reactive } from 'vue'

  import type { DeployDrawerDependency, DeployDrawerResource } from '../create-deploy-drawer.vue'

  export interface DeployResourcesCardProps {
    /** The resources the deployment sends live, each with the resources it references. */
    resources: DeployDrawerResource[]
  }

  defineProps<DeployResourcesCardProps>()

  /** The picked version id per resource key; a resource with no pick shows its first version. */
  const picks = defineModel<Record<string, string>>('picks', { default: () => ({}) })

  type Dependency = DeployDrawerDependency

  const versionOpen = reactive<Record<string, boolean>>({})

  const versionOf = (row: Dependency) =>
    row.versions.find((entry) => entry.id === picks.value[row.key]) ?? row.versions[0]

  const versionSummary = (row: Dependency) =>
    row.total > row.versions.length
      ? `${row.versions.length} of ${row.total} Ready versions`
      : `${row.total} Ready versions`

  const pickVersion = (row: Dependency, id: string) => {
    picks.value = { ...picks.value, [row.key]: id }
    versionOpen[row.key] = false
  }
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
          variant="inline"
          size="small"
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
              {{ row.note || versionOf(row).name }}
            </Item.Description>
          </Item.Content>
          <Item.Actions
            v-if="!row.note"
            class="basis-full sm:basis-auto"
          >
            <DropdownMenu
              v-model:open="versionOpen[row.key]"
              side="bottom"
              align="end"
              @select="(_event, id) => pickVersion(row, String(id))"
            >
              <DropdownMenu.Trigger>
                <Button
                  label="Change version"
                  :aria-label="`Change version of ${row.name}`"
                  variant="outline"
                  size="small"
                  icon="az az-chevron-down"
                  icon-position="trailing"
                  :disabled="!row.versions.length"
                />
              </DropdownMenu.Trigger>
              <template #header>
                <div class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)">
                  <p class="text-label-sm text-(--text-muted)">
                    {{ versionSummary(row) }}
                  </p>
                  <Input
                    v-if="row.total > row.versions.length"
                    size="medium"
                    placeholder="Search versions"
                    aria-label="Search versions"
                  >
                    <template #leading>
                      <i
                        class="az az-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
              </template>
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  v-for="entry in row.versions"
                  :key="entry.id"
                  :value="entry.id"
                  :label="entry.name"
                  :selected="entry.id === versionOf(row).id"
                  :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                >
                  <template #leading>
                    <Avatar
                      :alt="entry.author"
                      :label="entry.author"
                      size="small"
                      variant="square"
                    />
                  </template>
                  <span class="inline-flex min-w-0 items-center gap-(--spacing-xs)">
                    <span class="truncate">{{ entry.name }}</span>
                    <Tag
                      v-if="entry.active"
                      label="Active"
                      severity="success"
                      size="small"
                      class="shrink-0"
                    />
                  </span>
                  <template #trailing>
                    <span class="text-body-xs text-(--text-muted)">{{ entry.createdAgo }}</span>
                  </template>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
              <template
                v-if="row.total > row.versions.length"
                #bottom
              >
                <div
                  class="border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-2xs)"
                >
                  <Button
                    :label="`Load ${Math.min(row.versions.length, row.total - row.versions.length)} more`"
                    variant="ghost"
                    size="small"
                    class="w-full"
                  />
                </div>
              </template>
            </DropdownMenu>
          </Item.Actions>
        </Item>
        <template v-if="row.owner">
          <Separator />
          <Accordion
            type="single"
            collapsible
            size="medium"
          >
            <Accordion.Item value="dependencies">
              <Accordion.Trigger>
                <span class="text-label-sm text-(--text-default)">Dependencies</span>
              </Accordion.Trigger>
              <Accordion.Content>
                <div class="min-w-0">
                  <p
                    v-if="!row.dependencies.length"
                    class="text-body-sm text-(--text-muted)"
                  >
                    {{ row.name }} references no other resources.
                  </p>
                  <Item.Group v-else>
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
                          <Tag
                            v-if="!dependency.note"
                            :label="dependency.versions.length ? 'Ready' : 'No ready version'"
                            :severity="dependency.versions.length ? 'success' : 'warning'"
                            size="small"
                            class="shrink-0"
                          />
                        </span>
                        <Item.Description>
                          {{ dependency.note || versionOf(dependency).name }}
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions v-if="!dependency.note">
                        <DropdownMenu
                          v-model:open="versionOpen[dependency.key]"
                          side="bottom"
                          align="end"
                          @select="(_event, id) => pickVersion(dependency, String(id))"
                        >
                          <DropdownMenu.Trigger>
                            <Button
                              label="Change version"
                              :aria-label="`Change version of ${dependency.name}`"
                              variant="outline"
                              size="small"
                              icon="az az-chevron-down"
                              icon-position="trailing"
                              :disabled="!dependency.versions.length"
                            />
                          </DropdownMenu.Trigger>
                          <template #header>
                            <div
                              class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)"
                            >
                              <p class="text-label-sm text-(--text-muted)">
                                {{ versionSummary(dependency) }}
                              </p>
                              <Input
                                v-if="dependency.total > dependency.versions.length"
                                size="medium"
                                placeholder="Search versions"
                                aria-label="Search versions"
                              >
                                <template #leading>
                                  <i
                                    class="az az-search"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Input>
                            </div>
                          </template>
                          <DropdownMenu.Group>
                            <DropdownMenu.Item
                              v-for="entry in dependency.versions"
                              :key="entry.id"
                              :value="entry.id"
                              :label="entry.name"
                              :selected="entry.id === versionOf(dependency).id"
                              :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                            >
                              <template #leading>
                                <Avatar
                                  :alt="entry.author"
                                  :label="entry.author"
                                  size="small"
                                  variant="square"
                                />
                              </template>
                              <span class="inline-flex min-w-0 items-center gap-(--spacing-xs)">
                                <span class="truncate">{{ entry.name }}</span>
                                <Tag
                                  v-if="entry.active"
                                  label="Active"
                                  severity="success"
                                  size="small"
                                  class="shrink-0"
                                />
                              </span>
                              <template #trailing>
                                <span class="text-body-xs text-(--text-muted)">{{
                                  entry.createdAgo
                                }}</span>
                              </template>
                            </DropdownMenu.Item>
                          </DropdownMenu.Group>
                          <template
                            v-if="dependency.total > dependency.versions.length"
                            #bottom
                          >
                            <div
                              class="border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-2xs)"
                            >
                              <Button
                                :label="`Load ${Math.min(dependency.versions.length, dependency.total - dependency.versions.length)} more`"
                                variant="ghost"
                                size="small"
                                class="w-full"
                              />
                            </div>
                          </template>
                        </DropdownMenu>
                      </Item.Actions>
                    </Item>
                  </Item.Group>
                  <span
                    class="sr-only"
                    role="status"
                  />
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </template>
      </template>
    </template>
  </Card>
</template>
