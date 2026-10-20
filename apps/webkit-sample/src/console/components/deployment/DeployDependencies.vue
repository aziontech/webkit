<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { onScopeDispose, ref, watch } from 'vue'

  import DeployResourceRow from './DeployResourceRow.vue'

  interface VersionChoice {
    id: string
    name: string
    author?: string
    active?: boolean
  }

  interface Dependency {
    key: string
    type: string
    name: string
    label: string
    icon: string
    note?: string
    versions: VersionChoice[]
  }

  interface Props {
    dependencies?: Dependency[]
    emptyLabel?: string
    disabled?: boolean
    source?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    dependencies: () => [],
    emptyLabel: 'No functions or connectors referenced.',
    disabled: false,
    source: ''
  })

  const picks = defineModel<Record<string, string>>({ default: () => ({}) })

  const RELOAD_MS = 600

  const reloading = ref(false)

  let reloadTimer = 0

  watch(
    () => props.source,
    () => {
      clearTimeout(reloadTimer)
      reloading.value = true
      reloadTimer = setTimeout(() => {
        reloading.value = false
      }, RELOAD_MS)
    }
  )

  onScopeDispose(() => clearTimeout(reloadTimer))

  const pick = (dependency, id) => {
    picks.value = { ...picks.value, [dependency.key]: id }
  }
</script>

<template>
  <Accordion
    type="single"
    collapsible
    size="small"
  >
    <Accordion.Item value="dependencies">
      <Accordion.Trigger>
        <span class="text-label-sm text-(--text-default)">Dependencies</span>
      </Accordion.Trigger>
      <Accordion.Content>
        <div class="min-w-0 px-(--spacing-md) py-(--spacing-md)">
          <p
            v-if="!reloading && !dependencies.length"
            class="text-body-sm text-(--text-muted)"
          >
            {{ emptyLabel }}
          </p>
          <Item.Group
            v-else
            :aria-busy="reloading || undefined"
            class="gap-(--spacing-sm)"
          >
            <template v-if="reloading">
              <Item
                v-for="row in Math.max(dependencies.length, 2)"
                :key="row"
                size="small"
                aria-hidden="true"
              >
                <Item.Media>
                  <span class="flex size-5 items-center justify-center">
                    <Skeleton
                      kind="circle"
                      width="var(--size-4)"
                      height="var(--size-4)"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <span class="flex h-5 items-center">
                    <Skeleton
                      height="var(--size-3)"
                      width="40%"
                    />
                  </span>
                  <span
                    data-slot="item-description"
                    class="flex items-center text-body-sm"
                  >
                    &#8203;<Skeleton
                      height="var(--size-3)"
                      width="70%"
                    />
                  </span>
                </Item.Content>
                <Item.Actions>
                  <Skeleton
                    kind="shape"
                    width="var(--size-24)"
                    height="var(--size-7)"
                  />
                </Item.Actions>
              </Item>
            </template>
            <template v-else>
              <DeployResourceRow
                v-for="dependency in dependencies"
                :key="dependency.key"
                :model-value="picks[dependency.key] ?? ''"
                :name="dependency.name"
                :label="dependency.label"
                nested
                :icon="dependency.icon"
                :note="dependency.note"
                :versions="dependency.versions"
                :disabled="disabled"
                @update:model-value="(id) => pick(dependency, id)"
              />
            </template>
          </Item.Group>
          <span
            class="sr-only"
            role="status"
          >
            {{ reloading ? 'Loading dependencies' : '' }}
          </span>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
</template>
