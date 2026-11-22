<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import Link from '@aziontech/webkit/link'
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { DeployDrawerDomainGroup } from '../types'

  export interface DomainGroupItemProps {
    /** The domains of a project in one environment. */
    group: DeployDrawerDomainGroup
  }

  defineProps<DomainGroupItemProps>()
</script>

<template>
  <li class="flex min-w-0 items-center gap-(--spacing-xs)">
    <Tag
      :label="group.environment"
      severity="neutral"
      size="small"
      class="shrink-0"
    />
    <div class="flex min-w-0">
      <Tooltip
        :content="`Open ${group.domains[0]} in a new tab`"
        class="w-full"
      >
        <Link
          class="max-w-full"
          :href="`https://${group.domains[0]}`"
          target="_blank"
          size="small"
        >
          <span class="grid grid-cols-1">
            <span class="truncate">{{ group.domains[0] }}</span>
          </span>
        </Link>
      </Tooltip>
    </div>
    <Popover
      v-if="group.total > 1"
      side="bottom"
      align="start"
      size="small"
    >
      <Popover.Trigger :aria-label="`${group.total - 1} more domains`">
        <div class="shrink-0 cursor-pointer">
          <Tag
            :label="`+${group.total - 1}`"
            severity="neutral"
            size="small"
          />
        </div>
      </Popover.Trigger>
      <Popover.Content>
        <div
          class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
        >
          <p class="text-label-sm text-(--text-muted)">
            {{ group.summary }}
          </p>
          <Input
            v-if="group.total > 10"
            size="medium"
            placeholder="Search domains"
            aria-label="Search domains"
          >
            <template #leading>
              <i
                class="az az-search"
                aria-hidden="true"
              />
            </template>
          </Input>
        </div>

        <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-2xs)">
          <div
            v-for="domain in group.domains"
            :key="domain"
            class="flex min-w-0 px-(--spacing-xs) py-(--spacing-2xs)"
          >
            <Link
              :label="domain"
              :href="`https://${domain}`"
              target="_blank"
              size="small"
            />
          </div>
        </div>

        <div
          v-if="group.total > group.domains.length"
          class="border-t border-(--border-default) p-(--spacing-2xs)"
        >
          <Button
            :label="`Load ${Math.min(10, group.total - group.domains.length)} more`"
            variant="ghost"
            size="small"
            class="w-full"
          />
        </div>

        <span
          class="sr-only"
          role="status"
        >
          {{ group.summary }}
        </span>
      </Popover.Content>
    </Popover>
  </li>
</template>
