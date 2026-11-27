<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Link from '@aziontech/ui/link'
  import StatusIndicator from '@aziontech/ui/status-indicator'
  import Tag from '@aziontech/ui/tag'
  import { useLocale } from '@aziontech/ui/use-locale'

  import { application as APP, applicationFacts as facts } from '../sample'
  import SummarySubjectBand from './summary-subject-band.vue'

  const emit = defineEmits<{
    'open-version': [event: MouseEvent]
  }>()

  const menu = [
    [{ value: 'copy-url', label: 'Copy URL', icon: 'az az-copy' }],
    [{ value: 'settings', label: 'Settings', icon: 'az az-settings' }]
  ]

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')
</script>

<template>
  <section
    class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
  >
    <Card :padded="false">
      <template #default>
        <SummarySubjectBand
          icon="az az-box"
          :label="APP.host"
          :href="`https://${APP.host}`"
          :visit="`https://${APP.host}`"
          actions-label="Application actions"
          :menu="menu"
          :show-menu-icons="false"
          :container="false"
        />

        <dl
          class="m-0 grid grid-cols-1 gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md) sm:grid-cols-3 lg:grid-cols-6"
        >
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <dt class="text-label-sm text-(--text-muted)">Deployment</dt>
            <dd class="m-0 flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
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
            </dd>
          </div>
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
            <dt class="text-label-sm text-(--text-muted)">Status</dt>
            <dd class="m-0 flex min-h-7 items-center">
              <StatusIndicator
                severity="success"
                label="Ready"
              />
            </dd>
          </div>
          <div
            v-for="fact in facts"
            :key="fact.label"
            class="flex min-w-0 flex-col gap-(--spacing-2xs)"
          >
            <dt class="text-label-sm text-(--text-muted)">{{ fact.label }}</dt>
            <dd class="m-0 flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
              <Avatar
                v-if="fact.author"
                :label="fact.author"
                size="small"
              />
              <span
                class="truncate text-body-sm text-(--text-default)"
                :class="fact.code && 'font-(family-name:--font-code)'"
                >{{
                  fact.createdAt ? `${ago(fact.createdAt)} by ${fact.author}` : fact.value
                }}</span
              >
            </dd>
          </div>
        </dl>

        <div
          class="flex flex-wrap items-center justify-between gap-(--spacing-sm) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-sm)"
        >
          <p class="m-0 text-body-sm text-(--text-muted)">
            Settings, cache and rules live on a version. Open the active version to change them,
            then deploy it.
          </p>
          <Button
            label="Open active version"
            variant="outline"
            size="small"
            @click="(event: MouseEvent) => emit('open-version', event)"
          />
        </div>
      </template>
    </Card>
  </section>
</template>
