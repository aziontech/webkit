<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import DomainOverflowPopover from '../list/DomainOverflowPopover.vue'
  import ResourceLink from '../resource/ResourceLink.vue'

  interface WorkloadDomain {
    domain: string
    environment: string
    generated?: boolean
  }

  interface Props {
    domains?: WorkloadDomain[]
  }

  const props = withDefaults(defineProps<Props>(), {
    domains: () => []
  })

  const groups = computed(() => {
    const byEnvironment = new Map()
    props.domains.forEach((entry) => {
      const list = byEnvironment.get(entry.environment) ?? []
      byEnvironment.set(entry.environment, [...list, entry.domain])
    })
    return [...byEnvironment].map(([environment, domains]) => ({
      environment,
      primary: domains[0],
      domains,
      overflow: domains.length - 1
    }))
  })
</script>

<template>
  <ul class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xxs) p-0">
    <li
      v-for="group in groups"
      :key="group.environment"
      class="flex min-w-0 items-center gap-(--spacing-xs)"
    >
      <Tag
        :label="group.environment"
        severity="secondary"
        size="small"
        class="shrink-0"
      />
      <ResourceLink
        :label="group.primary"
        :href="`https://${group.primary}`"
      />
      <DomainOverflowPopover
        v-if="group.overflow"
        :domains="group.domains"
        :count="group.overflow"
      />
    </li>
  </ul>
</template>
