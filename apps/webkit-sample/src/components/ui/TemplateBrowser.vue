<script setup>
// TemplateBrowser — the reusable "browse templates" module: a section title
// beside its controls (a two-dimension Filter Dropdown + a Browse link), then a
// responsive grid of TemplateCards with an EmptyState fallback. Used both by the
// "Start from Template" tab and the "Recommended Templates" section so the two
// stay identical. Owns its own filter state, so each instance filters on its own.
import Button from "@aziontech/webkit/button";
import Dropdown from "@aziontech/webkit/dropdown";
import EmptyState from "@aziontech/webkit/empty-state";
import SegmentedButton from "@aziontech/webkit/segmented-button";
import { computed, reactive, ref } from "vue";

import TemplateCard from "./TemplateCard.vue";

const props = defineProps({
  title: { type: String, required: true },
  templates: { type: Array, default: () => [] },
  useCaseOptions: { type: Array, default: () => [] },
  technologyOptions: { type: Array, default: () => [] },
  browseLabel: { type: String, default: "Browse All" },
  browseHref: {
    type: String,
    default: "https://www.azion.com/en/marketplace/",
  },
  // Grid density — overridable so a narrow column can drop to fewer columns.
  gridClass: {
    type: String,
    default: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6",
  },
});

const emit = defineEmits(["select"]);

// A SegmentedButton at the top of the dropdown switches which dimension's
// options are listed below.
const filterSegments = [
  { label: "Use Cases", value: "use-cases" },
  { label: "Technology", value: "technology" },
];
const filterTab = ref("use-cases");
const activeOptions = computed(() =>
  filterTab.value === "use-cases" ? props.useCaseOptions : props.technologyOptions,
);

// Option values are unique across both groups, so the group a value belongs to
// is recovered from this set.
const useCaseValues = computed(
  () => new Set(props.useCaseOptions.map((o) => o.value)),
);

const selectedFilters = reactive([]);
const totalFilters = computed(() => selectedFilters.length);
const isFilterActive = (value) => selectedFilters.includes(value);

// Dropdown emits (event, value); toggle that value in/out of the selection.
const toggleFilter = (_event, value) => {
  const i = selectedFilters.indexOf(value);
  if (i === -1) selectedFilters.push(value);
  else selectedFilters.splice(i, 1);
};
const clearFilters = () => {
  selectedFilters.length = 0;
};

// A template matches when it satisfies every non-empty group (OR within a group).
const filteredTemplates = computed(() => {
  if (!selectedFilters.length) return props.templates;
  const useCases = selectedFilters.filter((v) => useCaseValues.value.has(v));
  const tech = selectedFilters.filter((v) => !useCaseValues.value.has(v));
  return props.templates.filter(
    (t) =>
      (!tech.length || tech.includes(t.tech)) &&
      (!useCases.length || t.useCases.some((c) => useCases.includes(c))),
  );
});
</script>

<template>
  <section class="flex flex-col gap-[var(--spacing-sm)]">
    <!-- Section title beside its controls: a Filter Dropdown (Use Cases /
         Technology groups) and a Browse link. -->
    <div
      class="flex min-h-[var(--size-8)] flex-wrap items-center justify-between gap-[var(--spacing-md)]"
    >
      <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
        {{ title }}
      </p>

      <div class="flex items-center gap-[var(--spacing-sm)]">
        <Dropdown placement="bottom-end" @select="toggleFilter">
          <Dropdown.Trigger>
            <Button
              :label="totalFilters ? `Filter (${totalFilters})` : 'Filter'"
              kind="text"
              size="medium"
              icon="pi pi-chevron-down"
            />
          </Dropdown.Trigger>

          <!-- Dimension switch pinned above the option list. -->
          <template #top>
            <SegmentedButton
              v-model="filterTab"
              :options="filterSegments"
              aria-label="Filter dimension"
            />
          </template>

          <Dropdown.Group>
            <Dropdown.Option
              v-for="opt in activeOptions"
              :key="opt.value"
              :value="opt.value"
              :label="opt.label"
              :selected="isFilterActive(opt.value)"
            >
              <template #left>
                <i
                  :class="opt.icon"
                  class="text-[var(--text-muted)]"
                  aria-hidden="true"
                />
              </template>
              <template v-if="isFilterActive(opt.value)" #right>
                <i
                  class="pi pi-check text-[var(--text-default)]"
                  aria-hidden="true"
                />
              </template>
            </Dropdown.Option>
          </Dropdown.Group>
        </Dropdown>

        <Button
          :label="browseLabel"
          kind="outlined"
          size="medium"
          target="_blank"
          :href="browseHref"
        />
      </div>
    </div>

    <!-- Filtered template grid -->
    <div
      v-if="filteredTemplates.length"
      class="grid gap-[var(--spacing-md)]"
      :class="gridClass"
    >
      <TemplateCard
        v-for="(tpl, i) in filteredTemplates"
        :key="`${tpl.title}-${i}`"
        :icon="tpl.icon"
        :title="tpl.title"
        :description="tpl.description"
        :color="tpl.color"
        @select="emit('select', tpl)"
      />
    </div>
    <EmptyState
      v-else
      size="medium"
      title="No templates match your filters"
      description="Try removing a filter to widen the results."
    >
      <template #actions>
        <Button
          label="Clear filters"
          kind="outlined"
          size="medium"
          @click="clearFilters"
        />
      </template>
    </EmptyState>
  </section>
</template>
