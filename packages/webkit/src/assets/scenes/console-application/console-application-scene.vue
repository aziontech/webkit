<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onMounted, ref, useAttrs, watch } from 'vue'

  import Button from '../../../components/actions/button/button.vue'
  import IconButton from '../../../components/actions/icon-button/icon-button.vue'
  import CodeBlock from '../../../components/code/code-block/code-block.vue'
  import Card from '../../../components/content/card/card.vue'
  import ItemList from '../../../components/content/item/item-list.vue'
  import ShellMockup from '../../../components/content/shell-mockup/shell-mockup.vue'
  import Tag from '../../../components/content/tag/tag.vue'
  import Table from '../../../components/data/table/table.vue'
  import TableCellStatus from '../../../components/data/table/table-cell-status/table-cell-status.vue'
  import Field from '../../../components/inputs/field/field.vue'
  import FieldLabel from '../../../components/inputs/field/field-label/field-label.vue'
  import Input from '../../../components/inputs/input/input.vue'
  import RadioCards from '../../../components/inputs/radio-cards/radio-cards.vue'
  import Select from '../../../components/inputs/select/select.vue'
  import SelectTrigger from '../../../components/inputs/select/select-trigger/select-trigger.vue'
  import Switch from '../../../components/inputs/switch/switch.vue'
  import Textarea from '../../../components/inputs/textarea/textarea.vue'
  import SaveBar from '../../../components/layout/save-bar/save-bar.vue'
  import SettingRow from '../../../components/layout/setting-row/setting-row.vue'
  import TabsItem from '../../../components/navigation/tabs/tabs-item.vue'
  import TabsList from '../../../components/navigation/tabs/tabs-list.vue'
  import TabsRoot from '../../../components/navigation/tabs/tabs-root.vue'
  import Panel from '../../../components/overlay/panel/panel.vue'
  import PanelContent from '../../../components/overlay/panel/panel-content.vue'
  import PanelFooter from '../../../components/overlay/panel/panel-footer.vue'
  import PanelHeader from '../../../components/overlay/panel/panel-header.vue'
  import {
    CONSOLE_APPLICATION_STEPS,
    type ConsoleApplicationFormRow,
    type ConsoleApplicationSceneTab
  } from './console-application-data'

  defineOptions({ name: 'ConsoleApplicationScene', inheritAttrs: false })

  export type { ConsoleApplicationSceneTab } from './console-application-data'

  interface Props {
    /** Tab of the Application page the scene shows; empty or unknown shows the first, `build`. */
    tab?: ConsoleApplicationSceneTab | string
    /** Whether this scene is the one showing; its second move replays each time it turns back on. */
    active?: boolean
    /** Plays the page entrance and the second move; off draws the settled frame, drawer open and save bar up. */
    animated?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    tab: '',
    active: true,
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

  function severityOf(value: string): 'success' | 'secondary' {
    return POSITIVE.has(value) ? 'success' : 'secondary'
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

  function displayAs(value: string): () => string {
    return () => value
  }
</script>

<template>
  <ShellMockup
    v-bind="$attrs"
    :data-testid="testId"
    :data-tab="step.value"
    :width="1040"
    :chrome="false"
    :active="active"
    :animated="animated"
  >
    <div class="flex h-full min-w-0 flex-col">
      <div
        class="flex shrink-0 items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs)"
      >
        <span class="flex min-w-0 items-center gap-(--spacing-xxs) text-label-sm">
          <i
            class="ai ai-edge-application shrink-0 leading-none text-(--primary)"
            aria-hidden="true"
          />
          <span class="text-(--text-muted)">Applications</span>
          <span class="text-(--text-disabled)">/</span>
          <span class="truncate text-(--text-default)">storefront-vue</span>
        </span>
        <span class="shrink-0 text-label-code-sm text-(--text-muted)">{{ counter }}</span>
      </div>

      <div class="shrink-0 border-b border-(--border-default) px-(--spacing-md)">
        <TabsRoot :model-value="step.value">
          <TabsList>
            <TabsItem
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
            kind="outlined"
            size="medium"
            icon="pi pi-plus"
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
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
            <Button
              label="Filter"
              kind="outlined"
              size="medium"
              icon="pi pi-filter"
              class="shrink-0"
            />
          </div>

          <Table
            :data="rows"
            :columns="columns"
            :reorderable="Boolean(step.table.reorderable)"
            :data-testid="`${testId}__table`"
            row-key="id"
            header-kind="compact"
            enable-sorting
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
          </Table>
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
            <template #content>
              <ItemList>
                <SettingRow
                  v-for="row in band.rows"
                  :key="row.label"
                  :title="row.label"
                  kind="compact"
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
                </SettingRow>
              </ItemList>
            </template>
          </Card>
        </div>

        <SaveBar
          v-if="second && saveBar"
          kind="centered"
          :data-animated="animated || null"
          :data-testid="`${testId}__save-bar`"
          class="mt-auto data-animated:animate-content-enter motion-reduce:animate-none"
        >
          <template #leading>
            <i
              class="pi pi-info-circle shrink-0 text-(--text-muted)"
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
              kind="outlined"
              size="medium"
            />
            <Button
              label="Save"
              kind="primary"
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
      <div
        :key="step.value"
        :data-animated="animated || null"
        :data-testid="`${testId}__drawer`"
        class="absolute inset-y-0 end-0 flex w-[62%] data-animated:animate-slide-in-right rtl:data-animated:animate-slide-in-left motion-reduce:animate-none"
      >
        <Panel
          data-fluid
          class="h-full max-h-none rounded-(--shape-flat) border-y-0 border-e-0"
        >
          <PanelHeader>
            <span class="min-w-0 truncate text-heading-xs text-(--text-default)">{{
              drawer.title
            }}</span>
            <IconButton
              icon="pi pi-times"
              aria-label="Close"
              kind="transparent"
              size="small"
              class="shrink-0"
            />
          </PanelHeader>
          <PanelContent>
            <div class="flex flex-col gap-(--spacing-xl)">
              <section
                v-for="section in drawer.sections"
                :key="section.title"
                class="flex flex-col gap-(--spacing-sm)"
              >
                <span class="text-label-md text-(--text-default)">{{ section.title }}</span>
                <div
                  :data-columns="section.columns ?? 1"
                  class="grid items-end gap-(--spacing-sm) data-[columns=2]:grid-cols-2 data-[columns=3]:grid-cols-3"
                >
                  <template
                    v-for="field in section.fields"
                    :key="field.label"
                  >
                    <RadioCards
                      v-if="field.kind === 'choice'"
                      :model-value="field.value"
                      :items="field.options.map((option) => ({ value: option, label: option }))"
                      :aria-label="field.label"
                      class="grid-cols-2"
                    />
                    <Field
                      key="field-1"
                      v-else-if="field.kind === 'switch'"
                      orientation="horizontal"
                    >
                      <Switch
                        :model-value="field.on"
                        :aria-label="field.label"
                      />
                      <FieldLabel>{{ field.label }}</FieldLabel>
                    </Field>
                    <Field
                      key="field-2"
                      v-else
                    >
                      <FieldLabel>{{ field.label }}</FieldLabel>
                      <Input
                        v-if="field.kind === 'text'"
                        :model-value="field.value"
                        size="medium"
                        readonly
                      />
                      <Textarea
                        v-else-if="field.kind === 'textarea'"
                        :model-value="field.value"
                        readonly
                      />
                      <Select
                        v-else-if="field.kind === 'select'"
                        :model-value="field.value"
                        :display-value="displayAs(field.value)"
                        size="medium"
                      >
                        <SelectTrigger
                          class="w-full"
                          :aria-label="field.label"
                        />
                      </Select>
                      <CodeBlock
                        v-else
                        :tabs="[
                          {
                            label: field.label,
                            value: field.label,
                            code: field.value,
                            language: 'json'
                          }
                        ]"
                        :copyable="false"
                      />
                    </Field>
                  </template>
                </div>
              </section>
            </div>
          </PanelContent>
          <PanelFooter>
            <Button
              :label="drawer.action"
              kind="primary"
              size="medium"
            />
          </PanelFooter>
        </Panel>
      </div>
    </template>
  </ShellMockup>
</template>
