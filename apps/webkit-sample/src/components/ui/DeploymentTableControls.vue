<script setup>
  // The deployment table's CONTROLS — the FILTER POPOVER holding one selector per
  // column (Status, Type, Environment, Authors) plus whatever the page adds, then the
  // search. The COLUMNS decide the fields: every enumerable column of
  // DeploymentsTable gets a multiple Select here, and Version / Resource — free text —
  // are covered by the search instead of a field each.
  //
  // Those selectors used to stand always-visible in the row. Four of them (five on the
  // module list, which adds Deployed) never fit one 40px band beside the search: every
  // field ended up truncated, and there was no room for a sixth. They now sit stacked
  // in the popover (ui/FilterPopover.vue) behind one IconButton whose badge reports how
  // many are set — the same filter the Applications and Workloads lists carry, which is
  // what makes narrowing feel the same everywhere in the console.
  //
  // It lives in its own file because the same fields have to render in two PLACES
  // depending on the nav level, and neither may be a copy of the other:
  //
  //   first level (the Deployments module) — hoisted into the page's ControlsHeader,
  //     above the card, beside the module's own actions (`:controls="false"` on
  //     DeploymentsTable, which then renders no toolbar of its own);
  //   internal levels (a workload's Version History / Deployments tab) — inside the
  //     table's own `#toolbar`, where DeploymentsTable renders this component for them.
  //
  // So the state does NOT live here: every field is a `defineModel`, and the owner —
  // DeploymentsTable when it renders its own toolbar, the page when it hoists them —
  // holds the refs and does the filtering. That is what lets one set of fields drive a
  // table from inside or outside it.
  //
  // The search is a plain InputText bound to the table's `v-model:globalFilter` (via
  // the `search` model) rather than `Table.Search`: that sub-component is context-aware
  // and only works inside `<Table>`, so it cannot be hoisted.
  import Avatar from '@aziontech/webkit/avatar'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { computed, ref, watch } from 'vue'

  import {
    environmentOptions,
    resourceMeta,
    resourceTypeOptions,
    statusMeta,
    statusOptions
  } from '../../lib/deployments'
  import { filterDisplay } from '../../lib/filters'
  import FilterPopover from './FilterPopover.vue'

  const props = defineProps({
    /** The rows the Authors selector derives its people from. */
    deployments: { type: Array, default: () => [] },
    /** Placeholder for the search field. */
    searchPlaceholder: { type: String, default: 'Search...' },
    /**
     * How many of the fields the OWNER renders in `#selectors` are set. It cannot be
     * counted here — those fields belong to the page — and the trigger badge has to
     * report the whole panel, not just the four columns this component holds.
     */
    extraCount: { type: Number, default: 0 }
  })

  // `clear` asks the OWNER to reset every selector, including the ones the page added
  // through `#selectors`.
  const emit = defineEmits(['clear'])

  const search = defineModel('search', { type: String, default: '' })
  const statusFilter = defineModel('statusFilter', { type: Array, default: () => [] })
  const typeFilter = defineModel('typeFilter', { type: Array, default: () => [] })
  const environmentFilter = defineModel('environmentFilter', { type: Array, default: () => [] })
  const authorFilter = defineModel('authorFilter', { type: Array, default: () => [] })

  // The trigger badge counts FIELDS that are narrowing the table, not selected values —
  // three statuses is one filter on Status. The search is not counted: it stays visible
  // in the row, so it is never a hidden filter.
  const activeFilterCount = computed(
    () =>
      Number(statusFilter.value.length > 0) +
      Number(typeFilter.value.length > 0) +
      Number(environmentFilter.value.length > 0) +
      Number(authorFilter.value.length > 0) +
      props.extraCount
  )

  // Author options come from the rows themselves, so the selector can never offer a
  // person who has nothing in this table. Each option carries that person's photo, so
  // the filter identifies them the same way the Deployed cell does — face first.
  const authorOptions = computed(() =>
    [
      ...new Map(
        props.deployments.map((deployment) => [
          deployment.authorEmail,
          { name: deployment.author, avatar: deployment.authorAvatar }
        ])
      )
    ]
      .sort(([, a], [, b]) => a.name.localeCompare(b.name))
      .map(([email, person]) => ({ value: email, label: person.name, avatar: person.avatar }))
  )

  // The roster can be long enough that scanning it beats reading it, so the panel gets
  // its own search field (Select.Content's `#search` slot). Cleared on close so it never
  // reopens pre-filtered.
  const authorQuery = ref('')
  const authorOpen = ref(false)
  watch(authorOpen, (open) => {
    if (!open) authorQuery.value = ''
  })
  const visibleAuthorOptions = computed(() => {
    const query = authorQuery.value.trim().toLowerCase()
    if (!query) return authorOptions.value
    return authorOptions.value.filter(
      (option) =>
        option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query)
    )
  })
</script>

<template>
  <!-- No wrapper of its own: the fields are direct children of whatever row hosts
       them (the page's ControlsHeader, or the table's `#toolbar`), so the host owns the
       gap and the flex behaviour. `display: contents` is what makes that true for a
       component root. -->
  <div class="contents">
    <!-- One selector per enumerable column, stacked in the filter panel, with the
         page's own fields (`#selectors`) after them so the panel reads one list. -->
    <FilterPopover
      :count="activeFilterCount"
      description="Narrow deployments by status, type, environment, author or date."
      @clear="emit('clear')"
    >
      <Select
        v-model="statusFilter"
        multiple
        size="large"
        placeholder="Status"
        :display-value="filterDisplay('Status', statusOptions)"
      >
        <Select.Trigger aria-label="Filter by status" />
        <Select.Content>
          <Select.Option
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            <template #left>
              <StatusIndicator
                :severity="statusMeta(option.value).severity"
                :loading="statusMeta(option.value).loading"
              />
            </template>
            {{ option.label }}
          </Select.Option>
        </Select.Content>
      </Select>

      <!-- Type is a column too, so it is a selector like the rest. Each option carries
           its product glyph, the same one the Type cell renders — so the filter and the
           cell identify a resource the same way. -->
      <Select
        v-model="typeFilter"
        multiple
        size="large"
        placeholder="Type"
        :display-value="filterDisplay('Type', resourceTypeOptions)"
      >
        <Select.Trigger aria-label="Filter by resource type" />
        <Select.Content>
          <Select.Option
            v-for="option in resourceTypeOptions"
            :key="option.value"
            :value="option.value"
          >
            <template #left>
              <i
                :class="resourceMeta(option.value).icon"
                aria-hidden="true"
              />
            </template>
            {{ option.label }}
          </Select.Option>
        </Select.Content>
      </Select>

      <Select
        v-model="environmentFilter"
        multiple
        size="large"
        placeholder="Environment"
        :display-value="filterDisplay('Environment', environmentOptions)"
      >
        <Select.Trigger aria-label="Filter by environment" />
        <Select.Content>
          <Select.Option
            v-for="option in environmentOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </Select.Option>
        </Select.Content>
      </Select>

      <Select
        v-model="authorFilter"
        v-model:open="authorOpen"
        multiple
        size="large"
        placeholder="Authors"
        :display-value="filterDisplay('Authors', authorOptions)"
      >
        <Select.Trigger aria-label="Filter by author" />
        <Select.Content>
          <!-- `#search` renders above the scrolling list, so the field stays put while
               the options move. `@keydown.stop` keeps the panel's Arrow/Home/End
               handler from pulling focus onto an option while the user is typing. -->
          <template #search>
            <InputText
              v-model="authorQuery"
              size="medium"
              class="w-full"
              placeholder="Search authors..."
              aria-label="Search authors"
              @keydown.stop
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>
          </template>
          <Select.Option
            v-for="option in visibleAuthorOptions"
            :key="option.value"
            :value="option.value"
          >
            <template #left>
              <Avatar
                :src="option.avatar || undefined"
                :alt="option.label"
                :label="option.label"
                size="small"
                kind="square"
              />
            </template>
            {{ option.label }}
          </Select.Option>
          <!-- A search that matches nothing must say so; an empty panel reads as a
               broken filter. -->
          <p
            v-if="!visibleAuthorOptions.length"
            class="px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-body-sm text-[var(--text-muted)]"
          >
            No author matches “{{ authorQuery }}”.
          </p>
        </Select.Content>
      </Select>

      <!-- What only THIS surface narrows by (the module list's date range). -->
      <slot name="selectors" />
    </FilterPopover>

    <!-- The search absorbs the row's slack (`grow`); with the selectors behind the
         filter icon it only has to leave room for that one 40px button, so it stays
         readable at any width instead of compressing to a truncated placeholder
         (see ui/ControlsHeader.vue). -->
    <InputText
      v-model="search"
      size="large"
      :placeholder="searchPlaceholder"
      aria-label="Search deployments"
      class="min-w-36 grow basis-[var(--container-2xs)]"
    >
      <template #iconLeft>
        <i
          class="pi pi-search"
          aria-hidden="true"
        />
      </template>
    </InputText>
  </div>
</template>
