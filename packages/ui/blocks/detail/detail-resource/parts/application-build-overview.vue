<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Card from '@aziontech/ui/card'
  import Link from '@aziontech/ui/link'
  import StatusIndicator from '@aziontech/ui/status-indicator'
  import Tag from '@aziontech/ui/tag'
  import { useLocale } from '@aziontech/ui/use-locale'

  import { buildApplication as APP } from '../sample'
  import SummaryStateBand from './summary-state-band.vue'
  import SummarySubjectBand from './summary-subject-band.vue'

  export interface ApplicationBuildOverviewProps {
    /** The production branch, named in the facts and the state band. */
    branch: string
  }

  defineProps<ApplicationBuildOverviewProps>()

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')

  const menu = [
    [{ value: 'copy-url', label: 'Copy URL', icon: 'az az-copy' }],
    [{ value: 'settings', label: 'Settings', icon: 'az az-settings' }]
  ]
</script>

<template>
  <section
    class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
  >
    <Card :padded="false">
      <template #default>
        <SummarySubjectBand
          icon="az az-globe"
          :label="APP.host"
          :href="`https://${APP.host}`"
          :visit="`https://${APP.host}`"
          actions-label="Application actions"
          :menu="menu"
        />

        <div
          class="grid grid-cols-1 gap-(--spacing-sm) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) sm:grid-cols-3 lg:grid-cols-6"
        >
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Deployment</span>
            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
              <Link
                :label="APP.deployment"
                :href="`/deployments/${APP.deployment}`"
                size="small"
              />
              <Tag
                label="Production"
                severity="neutral"
                size="small"
                class="shrink-0"
              />
            </div>
          </div>
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Domains</span>
            <div class="flex min-h-7 min-w-0 items-center">
              <span class="truncate text-body-sm text-(--text-default)">{{ APP.host }}</span>
            </div>
          </div>
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Status</span>
            <div class="flex min-h-7 min-w-0 items-center">
              <StatusIndicator
                severity="success"
                label="Ready"
              />
            </div>
          </div>
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Created</span>
            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate text-body-sm text-(--text-default)"
                >{{ ago('2026-11-10T09:00:00Z') }} by Priya Patel</span
              >
              <Avatar
                alt="Priya Patel"
                label="Priya Patel"
                size="small"
                variant="square"
                class="shrink-0"
              />
            </div>
          </div>
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Source</span>
            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-sm)">
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="az az-github shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-body-sm text-(--text-default)">{{
                  APP.repository
                }}</span>
              </span>
              <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                <i
                  class="az az-git-branch shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-body-sm text-(--text-default)">{{ branch }}</span>
              </span>
            </div>
          </div>
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <span class="text-label-sm text-(--text-muted)">Framework</span>
            <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
              <i
                class="az-color az-vue shrink-0 text-body-lg"
                aria-hidden="true"
              />
              <span class="truncate text-body-sm text-(--text-default)">Vue</span>
            </div>
          </div>
        </div>

        <SummaryStateBand docs="https://example.com/docs/cli">
          <p
            class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
          >
            Every push to
            <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)">{{
              branch
            }}</code>
            deploys this application to Production. To ship from your machine,
            <span class="hidden pointer-fine:inline"
              >drop your project anywhere on this page or
            </span>
            run
            <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)"
              >platform deploy</code
            >
            via the CLI.
          </p>
        </SummaryStateBand>
      </template>
    </Card>
  </section>
</template>
