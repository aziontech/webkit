<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import type { FilterMenuValue } from '@aziontech/webkit/filter-menu'
  import Input from '@aziontech/webkit/input'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref, watch } from 'vue'

  import { canFilterField, countFieldValues, type EventRow } from '../lib/event-log'
  import type {
    EventsExplorerField,
    EventsExplorerFieldCategory,
    EventsExplorerFilters
  } from '../view-events-explorer.vue'
  import FieldRow from './field-row.vue'

  export interface FieldsPanelProps {
    /** Every field, in order. */
    fields: EventsExplorerField[]
    /** The categories that group the hidden fields. */
    categories: EventsExplorerFieldCategory[]
    /** The matching events, the source of the value counts. */
    events: EventRow[]
    /** Ids of the optional fields shown as columns. */
    shownColumns: string[]
    /** Whether the value counts are known: the events are loading, or failed to load. */
    countState?: 'ready' | 'loading' | 'unknown'
  }

  const props = withDefaults(defineProps<FieldsPanelProps>(), { countState: 'ready' })

  const emit = defineEmits<{
    'toggle-column': [id: string]
  }>()

  const filters = defineModel<EventsExplorerFilters>('filters', { required: true })
  const open = defineModel<boolean>('open', { required: true })
  const width = defineModel<number>('width', { required: true })

  const fieldSearch = ref('')

  const matchesFieldSearch = (field: EventsExplorerField) => {
    const term = fieldSearch.value.trim().toLowerCase()
    if (!term) return true
    return field.label.toLowerCase().includes(term) || field.id.toLowerCase().includes(term)
  }

  const coreFields = computed(() => props.fields.filter((field) => field.core))
  const optionalFields = computed(() => props.fields.filter((field) => !field.core))

  const shownFields = computed<Array<EventsExplorerField & { locked?: boolean }>>(() => [
    ...coreFields.value.filter(matchesFieldSearch).map((field) => ({ ...field, locked: true })),
    ...optionalFields.value.filter(
      (field) => props.shownColumns.includes(field.id) && matchesFieldSearch(field)
    )
  ])

  const fieldCategories = computed(() =>
    props.categories
      .map((category) => ({
        ...category,
        fields: optionalFields.value.filter(
          (field) =>
            field.category === category.id &&
            !props.shownColumns.includes(field.id) &&
            matchesFieldSearch(field)
        )
      }))
      .filter((category) => category.fields.length)
  )

  const hasFieldMatches = computed(
    () => shownFields.value.length > 0 || fieldCategories.value.length > 0
  )

  const categoryFilterCount = (category: { fields: EventsExplorerField[] }) =>
    category.fields.filter((field) => filters.value[field.id]?.length).length

  const defaultCategories = () => props.categories.slice(0, 1).map(({ id }) => id)

  const openCategories = ref(defaultCategories())

  watch(
    () => props.fields.map((field) => field.id).join(' '),
    () => {
      openCategories.value = defaultCategories()
    }
  )

  const collapsedBeforeSearch = ref<string[] | null>(null)
  watch(fieldSearch, (term, previous) => {
    const searching = Boolean(term.trim())
    if (searching && !previous.trim()) collapsedBeforeSearch.value = [...openCategories.value]
    if (searching) {
      openCategories.value = fieldCategories.value.map((category) => category.id)
      return
    }
    openCategories.value = collapsedBeforeSearch.value ?? defaultCategories()
    collapsedBeforeSearch.value = null
  })

  const fieldCounts = computed(() =>
    Object.fromEntries(
      props.fields.map((field) => [field.id, countFieldValues(props.events, field.id)])
    )
  )

  const toggleFieldValue = (id: string, value: FilterMenuValue) => {
    const current = filters.value[id] ?? []
    const next = current.includes(value)
      ? current.filter((applied) => applied !== value)
      : [...current, value]
    filters.value = { ...filters.value, [id]: next }
  }
</script>

<template>
  <Sidebar
    v-model:open="open"
    v-model:width="width"
    resizable
    collapsible
    aria-label="Fields"
    collapse-aria-label="Hide the fields panel"
    expand-aria-label="Show the fields panel"
    resize-aria-label="Resize the fields panel"
  >
    <template #header>
      <div class="px-(--spacing-xs)">
        <Input
          v-model="fieldSearch"
          size="medium"
          class="w-full"
          placeholder="Search fields"
          aria-label="Search fields"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
    </template>

    <div>
      <div
        class="flex items-baseline justify-between gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-2xs) pt-(--spacing-2xs)"
      >
        <span class="text-label-sm text-(--text-muted)">Shown</span>
        <span class="text-label-sm text-(--text-muted)">Values</span>
      </div>

      <FieldRow
        v-for="field in shownFields"
        :key="field.id"
        :field="field"
        checked
        :count="fieldCounts[field.id]"
        :filterable="canFilterField(field)"
        :events="events"
        :applied="filters[field.id] ?? []"
        :count-state="countState"
        @toggle-column="emit('toggle-column', field.id)"
        @toggle-value="(value) => toggleFieldValue(field.id, value)"
      />

      <div
        v-if="fieldCategories.length"
        class="mt-(--spacing-xs)"
      >
        <Accordion
          v-model="openCategories"
          type="multiple"
          size="medium"
          icon-position="leading"
        >
          <Accordion.Item
            v-for="category in fieldCategories"
            :key="category.id"
            :value="category.id"
          >
            <Accordion.Trigger>
              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                <span class="truncate text-label-sm text-(--text-default)">
                  {{ category.label }}
                </span>
                <Tag
                  v-if="categoryFilterCount(category)"
                  :label="String(categoryFilterCount(category))"
                  severity="info"
                  size="small"
                />
              </span>
            </Accordion.Trigger>

            <Accordion.Content :padded="false">
              <FieldRow
                v-for="field in category.fields"
                :key="field.id"
                :field="field"
                :checked="false"
                :count="fieldCounts[field.id]"
                :filterable="canFilterField(field)"
                :events="events"
                :applied="filters[field.id] ?? []"
                :count-state="countState"
                @toggle-column="emit('toggle-column', field.id)"
                @toggle-value="(value) => toggleFieldValue(field.id, value)"
              />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      <p
        v-if="!hasFieldMatches"
        class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
      >
        No fields match "{{ fieldSearch }}".
      </p>
    </div>
  </Sidebar>
</template>
