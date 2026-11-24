<script setup lang="ts">
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { DeployDrawerImpact } from '../types'
  import DomainGroupItem from './domain-group-item.vue'
  import ProjectMedia from './project-media.vue'

  export interface ImpactedProjectsProps {
    /** The projects reached through shared Deployment Settings, per environment. */
    impacted: DeployDrawerImpact[]
    /** The projects are reloading; skeleton rows stand in. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<ImpactedProjectsProps>(), { loading: false })

  const impactedCount = computed(() =>
    props.impacted.reduce((total, group) => total + group.projects.length, 0)
  )

  const projectsLabel = (count: number) => `${count} ${count === 1 ? 'project' : 'projects'}`
</script>

<template>
  <div
    v-if="loading"
    aria-busy="true"
    class="flex min-w-0 flex-col gap-(--spacing-xs)"
  >
    <div
      v-for="row in impactedCount"
      :key="row"
      aria-hidden="true"
      class="flex min-w-0 items-center gap-(--spacing-sm) rounded-(--shape-control) border border-(--border-default) p-(--spacing-sm)"
    >
      <Skeleton
        width="var(--size-7)"
        height="var(--size-7)"
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
    </div>
  </div>
  <div
    v-else
    class="flex min-w-0 flex-col gap-(--spacing-md)"
  >
    <div
      v-for="group in impacted"
      :key="group.environment"
      class="flex min-w-0 flex-col gap-(--spacing-xs)"
    >
      <p
        v-if="impacted.length > 1"
        class="flex items-center gap-(--spacing-xs) text-label-sm text-(--text-muted)"
      >
        <i
          class="az az-sitemap text-body-xs"
          aria-hidden="true"
        />
        <span>{{ group.environment }} · {{ projectsLabel(group.projects.length) }}</span>
      </p>
      <ul
        class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xs) p-0"
        :aria-label="`Projects impacted in ${group.environment} (${group.projects.length})`"
      >
        <li
          v-for="target in group.projects"
          :key="target.id"
          class="min-w-0"
        >
          <Item
            variant="outline"
            size="small"
          >
            <ProjectMedia />
            <Item.Content>
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <Item.Title>{{ target.name }}</Item.Title>
                <Tag
                  v-if="target.selected"
                  label="Selected"
                  severity="neutral"
                  size="small"
                  class="shrink-0"
                />
              </span>
              <ul class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-2xs) p-0">
                <DomainGroupItem
                  v-for="domainGroup in target.domains"
                  :key="domainGroup.environment"
                  :group="domainGroup"
                />
              </ul>
            </Item.Content>
          </Item>
        </li>
      </ul>
    </div>
  </div>
</template>
