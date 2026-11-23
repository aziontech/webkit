<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Link from '@aziontech/webkit/link'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import type { DeploySuccessDeployment } from '../types'

  export interface DeploymentCardProps {
    /** The deployment that went live. */
    deployment: DeploySuccessDeployment
  }

  const props = defineProps<DeploymentCardProps>()

  const source = computed(() => props.deployment.source)
</script>

<template>
  <Card>
    <template #default>
      <div class="flex flex-col gap-(--spacing-md) sm:flex-row">
        <div
          aria-hidden="true"
          class="relative flex aspect-16/10 w-full shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-canvas) sm:w-56"
        >
          <span
            class="relative flex size-10 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface)"
          >
            <i
              class="az az-globe text-body-md leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </span>
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
          <div class="flex flex-wrap items-start justify-between gap-(--spacing-sm)">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <h2 class="min-w-0 truncate text-heading-xs text-(--text-default)">
                  {{ deployment.name }}
                </h2>
                <Tag
                  label="Live"
                  severity="success"
                  size="small"
                />
              </div>
              <span class="text-body-sm text-(--text-muted)">{{ deployment.created }}</span>
            </div>

            <Button
              label="Visit site"
              aria-label="Visit site (opens in a new tab)"
              variant="outline"
              size="medium"
              icon="az az-external-link"
              icon-position="trailing"
              :href="deployment.url"
              target="_blank"
            />
          </div>

          <ul class="flex flex-col gap-(--spacing-xs)">
            <li class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)">
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="az az-globe shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <div class="min-w-0">
                  <Tooltip
                    :content="`Open ${deployment.domain} in a new tab`"
                    class="w-full"
                  >
                    <Link
                      :label="deployment.domain"
                      :href="deployment.url"
                      target="_blank"
                      size="small"
                    />
                  </Tooltip>
                </div>
              </span>
              <Button
                label="Add custom domain"
                variant="link"
                size="small"
                icon="az az-circle-plus"
                :href="deployment.addDomainHref"
              />
            </li>
            <li
              v-if="source"
              class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)"
            >
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  :class="source.icon"
                  class="shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <div class="min-w-0">
                  <Tooltip
                    :content="`Open ${source.repository} in a new tab`"
                    class="w-full"
                  >
                    <Link
                      :label="source.repository"
                      :href="source.href"
                      target="_blank"
                      size="small"
                    />
                  </Tooltip>
                </div>
              </span>
              <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                <i
                  class="az az-git-branch shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-body-sm text-(--text-default)">{{ source.branch }}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </Card>
</template>
