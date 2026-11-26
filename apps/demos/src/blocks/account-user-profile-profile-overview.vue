<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ContributionGraph from '@aziontech/webkit/contribution-graph'
  import EmptyState from '@aziontech/webkit/empty-state'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
  import Tag from '@aziontech/webkit/tag'
  import Timeline from '@aziontech/webkit/timeline'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, ref, watch } from 'vue'

  import {
    CATEGORY_OPTIONS,
    filterHistory,
    type UserProfileContributionCategory,
    type UserProfileYearActivity
  } from './account-user-profile.user-profile-model'

  export interface ProfileOverviewProps {
    /** Every year of activity, newest first. */
    years: UserProfileYearActivity[]
    /** The activity is loading. */
    loading: boolean
  }

  const props = defineProps<ProfileOverviewProps>()

  const selectedYear = defineModel<number>('selectedYear', { required: true })

  const category = ref<'all' | UserProfileContributionCategory>('all')
  const selectedDate = ref<string | null>(null)

  const activeYear = computed<UserProfileYearActivity | null>(
    () => props.years.find((entry) => entry.year === selectedYear.value) ?? props.years[0] ?? null
  )
  const yearOptions = computed(() =>
    props.years.map((entry) => ({ label: String(entry.year), value: String(entry.year) }))
  )
  const shownYear = computed(() => activeYear.value?.year ?? selectedYear.value)
  const yearValue = computed({
    get: () => String(shownYear.value),
    set: (value: string) => {
      selectedYear.value = Number(value)
    }
  })

  const graphItems = computed(() => {
    const items = activeYear.value?.items ?? []
    return category.value === 'all'
      ? items
      : items.filter((item) => item.category === category.value)
  })

  const history = computed(() =>
    filterHistory(activeYear.value?.months ?? [], category.value, selectedDate.value)
  )
  const filtered = computed(() => selectedDate.value !== null || category.value !== 'all')

  const { formatDate } = useLocale()
  const formatDay = (iso: string) => formatDate(iso, { dateStyle: 'medium', timeZone: 'UTC' })

  watch(selectedYear, () => {
    selectedDate.value = null
  })

  const graphEl = ref<HTMLElement | null>(null)

  async function showAllDays() {
    selectedDate.value = null
    await nextTick()
    graphEl.value?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')?.focus()
  }

  const emptyTitle = computed(() => {
    if (!filtered.value) return 'No contributions yet'
    if (selectedDate.value && category.value === 'all')
      return `Nothing in the history on ${formatDay(selectedDate.value)}`
    return 'Nothing matches these filters'
  })

  function resetFilters() {
    selectedDate.value = null
    category.value = 'all'
  }
</script>

<template>
  <div class="flex flex-col gap-(--layout-group-gap)">
    <div
      v-if="years.length > 1"
      class="flex"
    >
      <ToggleGroup
        v-model="yearValue"
        :options="yearOptions"
        size="small"
        aria-label="Contribution year"
      />
    </div>
    <div class="max-md:hidden">
      <StatTileGroup aria-label="Platform contribution metrics">
        <StatTile
          label="Contributions"
          :value="activeYear?.totalContributions ?? 0"
          :delta="activeYear?.contributionsDelta || null"
          delta-label="vs. last year"
          :loading="loading"
        />
        <StatTile
          label="Deployments"
          :value="activeYear?.deployments ?? 0"
          :loading="loading"
        />
        <StatTile
          label="AI Copilot tasks"
          :value="activeYear?.copilotTasks ?? 0"
          :loading="loading"
        />
        <StatTile
          label="Longest streak"
          :value="activeYear?.longestStreakDays ?? 0"
          unit="days"
          :loading="loading"
        />
        <StatTile
          label="Current streak"
          :value="activeYear?.currentStreakDays ?? 0"
          unit="days"
          :loading="loading"
        />
      </StatTileGroup>
    </div>

    <Card>
      <div class="flex flex-col gap-(--spacing-md)">
        <div class="flex flex-wrap items-start justify-between gap-(--spacing-sm)">
          <div class="flex flex-col gap-(--spacing-2xs)">
            <h2 class="text-heading-xs text-(--text-default)">
              Platform contributions in {{ shownYear }}
            </h2>
            <p class="text-body-sm text-(--text-muted)">
              Deploys, Functions, firewall rules and AI Copilot workflows, one square per day.
            </p>
          </div>
          <ToggleGroup
            v-model="category"
            :options="CATEGORY_OPTIONS"
            size="small"
            aria-label="Contribution category"
          />
        </div>

        <div
          ref="graphEl"
          class="min-w-0"
        >
          <ContributionGraph
            v-model:selected-date="selectedDate"
            :items="graphItems"
            :year="shownYear"
            :loading="loading"
            :aria-label="`Platform contributions in ${shownYear}`"
          />
        </div>
      </div>
    </Card>

    <Card>
      <div class="flex flex-col gap-(--spacing-md)">
        <div class="flex flex-wrap items-center gap-(--spacing-xs)">
          <h2 class="text-heading-xs text-(--text-default)">Contribution history</h2>
          <Tag
            v-if="selectedDate"
            :label="formatDay(selectedDate)"
          />
          <Button
            v-if="selectedDate"
            type="button"
            label="Show all days"
            variant="ghost"
            size="small"
            @click="showAllDays"
          />
        </div>

        <EmptyState
          v-if="!loading && history.length === 0"
          :title="emptyTitle"
          :description="
            filtered
              ? 'The history keeps the larger changes of each month. Pick another day or category, or show everything again.'
              : 'Deploys, Functions and firewall changes you make show up here.'
          "
          icon="az az-history"
          size="small"
        >
          <template
            v-if="filtered"
            #actions
          >
            <Button
              type="button"
              label="Reset filters"
              variant="outline"
              size="small"
              @click="resetFilters"
            />
          </template>
        </EmptyState>
        <Timeline
          v-else
          :loading="loading"
          aria-label="Contribution history"
        >
          <Timeline.Group
            v-for="month in history"
            :key="month.label"
            :label="month.label"
          >
            <Timeline.Item
              v-for="entry in month.entries"
              :key="entry.id"
              :title="entry.title"
              :description="entry.description"
              :severity="entry.severity"
              :icon="entry.icon"
              :time="entry.time"
            />
          </Timeline.Group>
        </Timeline>
      </div>
    </Card>
  </div>
</template>
