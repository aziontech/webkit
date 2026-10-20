<script setup lang="ts">
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import ResourceLink from '../resource/ResourceLink.vue'

  interface Workload {
    id: string
    name: string
  }

  interface Props {
    workloads?: Workload[]
  }

  const props = withDefaults(defineProps<Props>(), {
    workloads: () => []
  })

  const first = computed(() => props.workloads[0] ?? null)
  const hiddenCount = computed(() => Math.max(0, props.workloads.length - 1))
  const summary = computed(() =>
    props.workloads.length === 1 ? '1 workload' : `${props.workloads.length} workloads`
  )
</script>

<template>
  <span
    v-if="!first"
    class="text-body-sm text-(--text-muted)"
    >—</span
  >

  <span
    v-else
    class="flex min-w-0 items-center gap-(--spacing-xs)"
  >
    <ResourceLink
      :label="first.name"
      :to="`/workloads/${first.id}`"
      module="Workloads"
    />

    <Popover
      v-if="hiddenCount"
      placement="bottom-start"
      width="small"
    >
      <Popover.Trigger @click.stop>
        <Tooltip :text="`Show all ${summary}`">
          <Tag
            :label="`+${hiddenCount}`"
            :aria-label="`Show all ${summary}`"
            severity="secondary"
            size="small"
            class="shrink-0 cursor-pointer"
          />
        </Tooltip>
      </Popover.Trigger>

      <Popover.Content @click.stop>
        <p
          class="border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-overline-sm text-(--text-muted)"
        >
          {{ summary }}
        </p>

        <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
          <router-link
            v-for="workload in workloads"
            :key="workload.id"
            :to="`/workloads/${workload.id}`"
            class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) no-underline hover:bg-(--bg-hover) hover:underline"
            @click.stop
          >
            <span class="truncate">{{ workload.name }}</span>
            <i
              class="pi pi-external-link ml-auto shrink-0 text-body-xs leading-none"
              aria-hidden="true"
            />
          </router-link>
        </div>
      </Popover.Content>
    </Popover>
  </span>
</template>
