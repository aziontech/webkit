<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import SummaryFact from '../parts/summary-fact.vue'
  import SummaryFacts from '../parts/summary-facts.vue'
  import SummaryStateBand from '../parts/summary-state-band.vue'
  import SummarySubjectBand from '../parts/summary-subject-band.vue'
  import { policyModules } from '../sample'

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')

  const menu = [
    [{ value: 'copy-id', label: 'Copy ID', icon: 'az az-copy' }],
    [{ value: 'settings', label: 'Settings', icon: 'az az-settings' }]
  ]
</script>

<template>
  <Card :padded="false">
    <template #default>
      <SummarySubjectBand
        icon="az az-box"
        label="web-app"
        href="/resources/3344556677"
        destination="Resources"
        actions-label="Policy actions"
        :menu="menu"
      >
        <template #actions>
          <Button
            label="Rules"
            variant="secondary"
            size="medium"
            icon="az az-list"
          />
        </template>
      </SummarySubjectBand>

      <SummaryFacts columns="sm:grid-cols-2 lg:grid-cols-4">
        <SummaryFact
          label="Status"
          value-class=""
        >
          <StatusIndicator
            severity="success"
            label="Active"
          />
        </SummaryFact>
        <SummaryFact
          label="Environment"
          value-class=""
        >
          <Tag
            label="Production"
            severity="neutral"
            size="small"
            class="shrink-0"
          />
        </SummaryFact>
        <SummaryFact
          label="Rules"
          value-class=""
        >
          <Button
            variant="link"
            label="14 rules"
          />
        </SummaryFact>
        <SummaryFact label="Last modified">
          <span class="truncate text-body-sm text-(--text-default)">
            {{ ago('2026-11-04T12:00:00Z') }} by Ethan Brooks
          </span>
          <Avatar
            alt="Ethan Brooks"
            label="Ethan Brooks"
            size="small"
            variant="square"
            class="shrink-0"
          />
        </SummaryFact>
        <SummaryFact
          label="Modules"
          value-class="flex-wrap gap-(--spacing-xs)"
          class="sm:col-span-2 lg:col-span-4"
        >
          <Tag
            v-for="module in policyModules"
            :key="module"
            :label="module"
            severity="neutral"
            size="small"
            class="shrink-0"
          />
        </SummaryFact>
      </SummaryFacts>

      <SummaryStateBand docs="https://example.com/docs/policies">
        <p
          class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
        >
          Every request passes through these modules before it reaches web-app. The rules run in
          order, and the first one that refuses a request ends it.
        </p>
      </SummaryStateBand>
    </template>
  </Card>
</template>
