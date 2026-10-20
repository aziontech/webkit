<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import Divider from '@aziontech/webkit/divider'

  import DeployDependencies from './DeployDependencies.vue'
  import DeployResourceRow from './DeployResourceRow.vue'

  interface VersionChoice {
    id: string
    name: string
    author?: string
    active?: boolean
    fresh?: boolean
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

  interface Resource {
    key: string
    name: string
    label: string
    icon: string
    versions: VersionChoice[]
    note?: string
    change?: { label: string; severity: string } | null
    source: string
    owner: boolean
    dependencies: Dependency[]
  }

  interface Props {
    resources?: Resource[]
    emptyLabel?: string
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    resources: () => [],
    emptyLabel: 'Nothing to deploy.',
    disabled: false
  })

  const resourcePicks = defineModel<Record<string, string>>('resourcePicks', {
    default: () => ({})
  })

  const dependencyPicks = defineModel<Record<string, string>>('dependencyPicks', {
    default: () => ({})
  })

  const pick = (resource, id) => {
    resourcePicks.value = { ...resourcePicks.value, [resource.key]: id }
  }
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <template
        v-for="(resource, index) in resources"
        :key="resource.key"
      >
        <Divider v-if="index" />
        <DeployResourceRow
          :model-value="resourcePicks[resource.key] ?? ''"
          :name="resource.name"
          :label="resource.label"
          :icon="resource.icon"
          :versions="resource.versions"
          :status="resource.change ?? null"
          :note="resource.note ?? ''"
          :disabled="disabled"
          class="px-(--spacing-sm) py-(--spacing-sm)"
          @update:model-value="(id) => pick(resource, id)"
        />
        <template v-if="resource.owner">
          <Divider />
          <DeployDependencies
            v-model="dependencyPicks"
            :dependencies="resource.dependencies"
            :source="resource.source"
            :disabled="disabled"
            :empty-label="`${resource.name} references no other resources.`"
          />
        </template>
      </template>

      <p
        v-if="!resources.length"
        class="px-(--spacing-sm) py-(--spacing-sm) text-body-sm text-(--text-muted)"
      >
        {{ emptyLabel }}
      </p>
    </template>
  </CardBox>
</template>
