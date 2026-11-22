<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onMounted, ref, useAttrs, watch } from 'vue'

  import Button from '../../../components/action/button/button.vue'
  import Card from '../../../components/content/card/card.vue'
  import ConsoleMockupShell from '../../../components/content/console-mockup/parts/console-mockup-shell.vue'
  import ItemList from '../../../components/content/item/item-list.vue'
  import Tag from '../../../components/content/tag/tag.vue'
  import DataTable from '../../../components/data/data-table/data-table.vue'
  import TableCellStatus from '../../../components/data/table/table-cell-status/table-cell-status.vue'
  import Input from '../../../components/input/input/input.vue'
  import Switch from '../../../components/input/switch/switch.vue'
  import SaveBar from '../../../components/layout/save-bar/save-bar.vue'
  import SettingsRow from '../../../components/layout/settings-row/settings-row.vue'
  import TabsRoot from '../../../components/navigation/tabs/tabs.vue'
  import TabsList from '../../../components/navigation/tabs/tabs-list.vue'
  import TabsTrigger from '../../../components/navigation/tabs/tabs-trigger.vue'
  import {
    CONSOLE_APPLICATION_STEPS,
    type ConsoleApplicationFormRow,
    type ConsoleApplicationSceneTab
  } from './console-application-data'
  import ConsoleApplicationDrawer from './console-application-drawer.vue'

  defineOptions({ name: 'ConsoleApplicationScene', inheritAttrs: false })

  export type { ConsoleApplicationSceneTab } from './console-application-data'

  interface Props {
    /** Tab of the Application page the scene shows; empty or unknown shows the first, `build`. */
    tab?: ConsoleApplicationSceneTab | string
    /** Whether this scene is the one showing; its second move replays each time it turns back on. */
    active?: boolean
    /** Design width of the screen from the medium breakpoint up; the picture scales to fit its host, so a wider design draws smaller type. */
    width?: number
    /** Plays the page entrance and the second move; off draws the settled frame, drawer open and save bar up. */
    animated?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    tab: '',
    active: true,
    width: 1200,
    animated: true
  })

  const attrs = useAttrs()

  const SECOND_MOVE_MS = 900
  const POSITIVE = new Set(['Enabled', 'Active', 'Ready'])

  const second = ref(!props.animated)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'assets-console-application-scene'
  )

  const step = computed(
    () =>
      CONSOLE_APPLICATION_STEPS.find((entry) => entry.value === props.tab) ??
      CONSOLE_APPLICATION_STEPS[0]
  )

  const pageKey = computed(() => `${step.value.value}-${props.active}`)

  const counter = computed(
    () =>
      `0${CONSOLE_APPLICATION_STEPS.indexOf(step.value) + 1}/0${CONSOLE_APPLICATION_STEPS.length}`
  )

  const columns = computed(() =>
    (step.value.table?.columns ?? []).map((header, index) => ({
      accessorKey: `c${index}`,
      header,
      principal: index === 0
    }))
  )

  const rows = computed(() =>
    (step.value.table?.rows ?? []).map((row, index) => ({
      id: `${step.value.value}-${index}`,
      ...Object.fromEntries(row.map((cell, column) => [`c${column}`, cell]))
    }))
  )

  const statusKey = computed(() =>
    step.value.table?.statusColumn === undefined ? '' : `c${step.value.table.statusColumn}`
  )

  const drawer = computed(() => (step.value.second.kind === 'drawer' ? step.value.second : null))
  const saveBar = computed(() => (step.value.second.kind === 'save-bar' ? step.value.second : null))

  onMounted(() => {
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
    watch(
      () => [step.value.value, props.active, props.animated] as const,
      ([, active, animated], _previous, onCleanup) => {
        if (reduced || !animated) {
          second.value = true
          return
        }
        second.value = false
        if (!active) return
        const timer = globalThis.setTimeout(() => {
          second.value = true
        }, SECOND_MOVE_MS)
        onCleanup(() => globalThis.clearTimeout(timer))
      },
      { immediate: true }
    )
  })

  function severityOf(value: string): 'success' | 'neutral' {
    return POSITIVE.has(value) ? 'success' : 'neutral'
  }

  function bandDelay(index: number): Record<string, string> {
    return {
      '--content-enter-delay': `${globalThis.parseFloat(duration['fast-01']) * (index + 1)}ms`
    }
  }

  function rowValue(row: ConsoleApplicationFormRow): string {
    return 'value' in row ? row.value : ''
  }

  function rowTag(row: ConsoleApplicationFormRow): string {
    return 'tag' in row ? row.tag : ''
  }

  function rowOn(row: ConsoleApplicationFormRow): boolean {
    return 'on' in row ? row.on : false
  }
</script>

<template>
  <ConsoleMockupShell
    v-bind="$attrs"
    :data-testid="testId"
    :data-tab="step.value"
    :width="width"
    :chrome="false"
    :active="active"
    :animated="animated"
  >
    <div class="flex h-full min-w-0 flex-col">
      <div
        class="flex shrink-0 items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs)"
      >
        <span class="flex min-w-0 items-center gap-(--spacing-2xs) text-label-sm">
          <i
            class="az az-applications shrink-0 leading-none text-(--primary)"
            aria-hidden="true"
          />
          <span class="text-(--text-muted)">Applications</span>
          <span class="text-(--text-disabled)">/</span>
          <span class="truncate text-(--text-default)">storefront-vue</span>
        </span>
        <span class="shrink-0 text-label-code-sm text-(--text-muted)">{{ counter }}</span>
      </div>

      <div class="shrink-0 border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)">
        <TabsRoot :model-value="step.value">
          <TabsList>
            <TabsTrigger
              v-for="entry in CONSOLE_APPLICATION_STEPS"
              :key="entry.value"
              :value="entry.value"
              :label="entry.label"
            />
          </TabsList>
        </TabsRoot>
      </div>

      <div
        :key="pageKey"
        :data-animated="animated || null"
        :data-testid="`${testId}__page`"
        class="flex min-h-0 flex-1 flex-col gap-(--spacing-lg) p-(--spacing-md) [--page-enter-distance:var(--spacing-lg)] data-animated:animate-page-enter motion-reduce:animate-none"
      >
        <div class="flex min-w-0 shrink-0 items-center justify-between gap-(--spacing-sm)">
          <span class="truncate text-heading-xs text-(--text-default)">{{ step.heading }}</span>
          <Button
            v-if="step.action"
            :label="step.action"
            variant="outline"
            size="medium"
            icon="az az-plus"
            class="shrink-0"
          />
        </div>

        <template v-if="step.table">
          <div class="flex min-w-0 shrink-0 items-center gap-(--spacing-xs)">
            <Input
              size="medium"
              placeholder="Search"
              aria-label="Search"
              class="min-w-36 grow basis-(--container-2xs)"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
            <Button
              label="Filter"
              variant="outline"
              size="medium"
              icon="az az-filter"
              class="shrink-0"
            />
          </div>

          <DataTable
            :data="rows"
            :columns="columns"
            :reorderable="Boolean(step.table.reorderable)"
            :data-testid="`${testId}__table`"
            row-key="id"
            density="compact"
            sortable
            :aria-label="step.heading"
          >
            <template
              v-if="statusKey"
              #[`cell-${statusKey}`]="{ value }"
            >
              <TableCellStatus
                :label="String(value)"
                :severity="severityOf(String(value))"
              />
            </template>
          </DataTable>
        </template>

        <div
          v-else
          class="flex min-h-0 min-w-0 flex-1 flex-col gap-(--spacing-sm) overflow-hidden"
        >
          <Card
            v-for="(band, index) in step.form"
            :key="band.title"
            :title="band.title"
            :padded="false"
            :data-animated="animated || null"
            :style="bandDelay(index)"
            class="data-animated:animate-content-enter motion-reduce:animate-none"
          >
            <template #default>
              <ItemList>
                <SettingsRow
                  v-for="row in band.rows"
                  :key="row.label"
                  :title="row.label"
                  variant="compact"
                >
                  <span
                    v-if="rowValue(row)"
                    class="truncate text-body-sm text-(--text-muted)"
                    >{{ rowValue(row) }}</span
                  >
                  <Tag
                    v-else-if="rowTag(row)"
                    :label="rowTag(row)"
                    :severity="severityOf(rowTag(row))"
                    size="medium"
                  />
                  <Switch
                    v-else
                    :model-value="rowOn(row)"
                    :aria-label="row.label"
                  />
                </SettingsRow>
              </ItemList>
            </template>
          </Card>
        </div>

        <SaveBar
          v-if="second && saveBar"
          variant="centered"
          :data-animated="animated || null"
          :data-testid="`${testId}__save-bar`"
          class="mt-auto data-animated:animate-content-enter motion-reduce:animate-none"
        >
          <template #leading>
            <i
              class="az az-circle-info shrink-0 text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="min-w-0">
              {{ saveBar.label }}
              <span class="text-(--text-muted)">{{ saveBar.hint }}</span>
            </span>
          </template>
          <template #actions>
            <Button
              label="Discard"
              variant="outline"
              size="medium"
            />
            <Button
              label="Save"
              variant="primary"
              size="medium"
            />
          </template>
        </SaveBar>
      </div>
    </div>

    <template
      v-if="second && drawer"
      #overlay
    >
      <div
        :data-animated="animated || null"
        class="absolute inset-0 bg-(--bg-backdrop) data-animated:animate-fade-in motion-reduce:animate-none"
      />
      <ConsoleApplicationDrawer
        :key="step.value"
        :drawer="drawer"
        :animated="animated"
        :data-testid="`${testId}__drawer`"
      />
    </template>
  </ConsoleMockupShell>
</template>
