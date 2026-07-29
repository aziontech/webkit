<script setup>
// Workloads list — the Azion Console "Workloads" module. The app shell (sidebar +
// GlobalHeader breadcrumb) comes from AppLayout; this page renders a PageHeading
// (title + description + "Documentation" / "New Workload") over a data-driven <Table>
// whose rows open the workload detail view. As a first-level module list it
// carries no navigation tabs.
//
// Narrowing is a SELECTOR PER COLUMN (the same model as Applications): Authors,
// Last Modified (Calendar — a shortcut rail beside a month grid for a custom range), and
// Status, all always visible in the toolbar. They pre-filter `:data`; the table's
// own Search narrows what is left. See Applications.vue for why the table's
// filter state cannot host them.
import Avatar from "@aziontech/webkit/avatar";
import Button from "@aziontech/webkit/button";
import Calendar from "@aziontech/webkit/calendar";
import CardBox from "@aziontech/webkit/card-box";
import CopyButton from "@aziontech/webkit/copy-button";
import Dropdown from "@aziontech/webkit/dropdown";
import IconButton from "@aziontech/webkit/icon-button";
import InputText from "@aziontech/webkit/input-text";
import Popover from "@aziontech/webkit/popover";
import Select from "@aziontech/webkit/select";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { daysAgo, formatListDate, monthsAgo, withinRange } from "../lib/dates";
import { filterDisplay } from "../lib/filters";
import { authorAt } from "../lib/people";
import { provisionedWorkloads, removeDeployment } from "../lib/provisioning";
import AppLayout from "./ui/AppLayout.vue";
import LastModifiedCell from "./ui/LastModifiedCell.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();

const userEmail = computed(() => route.query.email || "myemail@azion.com");

// The workload records that back the table (data-driven mode).
const workloads = ref(
  Array.from({ length: 20 }, (_, i) => {
    const n = i + 1;
    // The primary domain shown in the cell, plus the aliases revealed in the
    // "+N" Popover. `domainCount` is the overflow count (everything after the primary).
    const extraCount = (n * 7) % 99;
    const domains = [
      `my-workload-${n}.azion.app`,
      ...Array.from(
        { length: extraCount },
        (_, j) => `my-workload-${n}-alias-${j + 1}.azion.app`,
      ),
    ];
    const modified = daysAgo(i * 18);
    return {
      id: `10${(20482 + n * 173).toString()}`,
      name: `workload_${String(n).padStart(2, "0")}`,
      domain: domains[0],
      domains,
      domainCount: extraCount,
      status: n % 9 === 0 ? "Inactive" : "Live",
      // Spread across ~12 months (18 days apart) so the Last Modified filter has
      // something to narrow — every row used to carry the identical timestamp.
      modifiedAt: modified,
      lastModified: formatListDate(modified),
      owner: authorAt(i).name,
      ownerAvatar: authorAt(i).avatar,
    };
  }),
);

const columns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true },
  { accessorKey: "domain", header: "Domains", grow: 2 },
  { accessorKey: "status", header: "Status", enableSorting: true },
  { accessorKey: "lastModified", header: "Last Modified", enableSorting: true, grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];

// ── Column selectors ──────────────────────────────────────────────────────
// Authors come from the data, so the selector can never offer someone with no
// rows in the list. (The column is "Last Modified"; the person renders inside
// that cell as `owner`.)
// Each option carries that person's photo, so the filter identifies them the
// same way the Last Modified cell does — by face first, name second.
const authorOptions = [
  ...new Map(workloads.value.map((workload) => [workload.owner, workload.ownerAvatar])),
]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([owner, avatar]) => ({ value: owner, label: owner, avatar }));

// The roster is long enough that scanning it beats reading it: the panel gets
// its own search field (Select.Content's `#search` slot), narrowing the options
// by name. Cleared on close so the panel never reopens pre-filtered.
const authorQuery = ref("");
const authorOpen = ref(false);
watch(authorOpen, (open) => {
  if (!open) authorQuery.value = "";
});
const visibleAuthorOptions = computed(() => {
  const query = authorQuery.value.trim().toLowerCase();
  if (!query) return authorOptions;
  return authorOptions.filter((option) => option.label.toLowerCase().includes(query));
});

const statusOptions = [
  { value: "Live", label: "Live" },
  { value: "Inactive", label: "Inactive" },
];

// The Calendar's shortcut rail — one click applies a range; the grid beside it
// fine-tunes it.
const periodPresets = [
  { label: "Last 7 Days", value: { start: daysAgo(7), end: new Date() } },
  { label: "Last 30 Days", value: { start: daysAgo(30), end: new Date() } },
  { label: "Last 3 Months", value: { start: monthsAgo(3), end: new Date() } },
  { label: "Last 12 Months", value: { start: monthsAgo(12), end: new Date() } },
];

const authorFilter = ref([]);
const statusFilter = ref([]);
const modifiedRange = ref(null);

// Workloads provisioned by the deploy flow lead the list, newest first, so a
// just-deployed workload is the first thing on the page (src/lib/provisioning.js).
const allWorkloads = computed(() => [...provisionedWorkloads.value, ...workloads.value]);

const filteredWorkloads = computed(() =>
  allWorkloads.value.filter((workload) => {
    if (authorFilter.value.length && !authorFilter.value.includes(workload.owner)) return false;
    if (statusFilter.value.length && !statusFilter.value.includes(workload.status)) return false;
    return withinRange(workload.modifiedAt, modifiedRange.value);
  }),
);

// External `:data` filtering does not trip TanStack's `autoResetPageIndex`, so
// own the pagination state and rewind to the first page when a filter changes.
const pagination = ref({ pageIndex: 0, pageSize: 10 });
watch([authorFilter, statusFilter, modifiedRange], () => {
  pagination.value = { ...pagination.value, pageIndex: 0 };
});

const createWorkload = () =>
  router.push({ path: "/workloads/new", query: { email: userEmail.value } });

// The name rides along in the query so the detail view can title itself (and
// derive its resource chain) without a workload endpoint to read from.
const openWorkload = (event, row) =>
  router.push({
    path: `/workloads/${row.id}`,
    query: { email: userEmail.value, name: row.name },
  });

const onRowAction = (event, value, row) => {
  if (value === "delete") {
    removeDeployment(row.id);
    workloads.value = workloads.value.filter((workload) => workload.id !== row.id);
    toast.success(`${row.name} deleted`);
    return;
  }
  if (value === "view") {
    openWorkload(event, row);
    return;
  }
  toast.info(value === "duplicate" ? `Duplicating ${row.name}` : row.name, {
    description: `Workload ID ${row.id}`,
  });
};
</script>

<template>
  <AppLayout active="workloads" :breadcrumb="[{ label: 'Workloads' }]">
    <main class="layout-column layout-list h-full">
      <PageHeading
        size="large"
        title="Workloads"
        description="View and manage your workloads."
      >
        <template #actions>
          <Button
            label="Documentation"
            kind="outlined"
            size="medium"
            icon="pi pi-book"
            href="https://www.azion.com/en/documentation/"
            target="_blank"
          />
          <Button
            label="New Workload"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="createWorkload"
          />
        </template>
      </PageHeading>

      <section class="flex min-h-0 flex-col">
        <CardBox :padded="false">
          <template #content>
            <Table
              v-model:pagination="pagination"
              :data="filteredWorkloads"
              :columns="columns"
              row-key="id"
              enable-sorting
              paginated
              :page-size="10"
              :border="false"
              @row-click="openWorkload"
            >
              <template #toolbar>
                <!-- Search first, then one selector per column — Authors, Last Modified,
                     Status — all always visible. Every field is `large`, so the row is
                     one 40px band. -->
                <div class="flex w-full flex-wrap items-center gap-[var(--spacing-xs)]">
                  <Table.Search
                    size="large"
                    placeholder="Search workloads..."
                    class="min-w-0 grow basis-full xl:basis-0"
                  />

                  <!-- Width lives on the wrapper: the Select root declares w-full in its own
                       static class, which wins over a consumer w-[…] on a specificity tie. -->
                  <div class="w-[var(--container-3xs)] shrink-0">
                    <Select
                      v-model="authorFilter"
                      v-model:open="authorOpen"
                      multiple
                      size="large"
                      placeholder="All Authors"
                      :display-value="filterDisplay('All Authors', authorOptions)"
                    >
                      <Select.Trigger aria-label="Filter by author" />
                      <Select.Content>
                        <!-- `#search` renders above the scrolling list, so the field stays
                             put while the options move. `@keydown.stop` keeps the panel's
                             Arrow/Home/End handler from pulling focus onto an option while
                             the user is still typing. -->
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
                              <i class="pi pi-search" aria-hidden="true" />
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
                        <!-- A search that matches nothing must say so; an empty panel
                             reads as a broken filter. -->
                        <p
                          v-if="!visibleAuthorOptions.length"
                          class="px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-body-sm text-[var(--text-muted)]"
                        >
                          No author matches “{{ authorQuery }}”.
                        </p>
                      </Select.Content>
                    </Select>
                  </div>

                  <!-- The shortcut rail (Last 7 Days …) plus the month grid for a custom
                       range both come from :presets — with presets the component splits the
                       trigger into a preset dropdown + the range itself. NOT `period`: that
                       flag REPLACES the pair (`isTwoPart = hasPresets && !period`) with the
                       relative-span parser, and takes the placeholder with it. -->
                  <Calendar
                    v-model="modifiedRange"
                    mode="range"
                    size="large"
                    :presets="periodPresets"
                    placeholder="Last Modified"
                    class="shrink-0"
                  >
                    <!-- Resetting the filter is Calendar.Clear in the panel footer, not the
                         `clearable` prop: that renders an X on the trigger only in the
                         SINGLE-part branch, so alongside :presets it would be inert. Clear
                         empties the draft; Apply Range commits the empty range, which reads
                         as "no Last Modified filter". -->
                    <template #footer>
                      <Calendar.Clear>Clear</Calendar.Clear>
                    </template>
                  </Calendar>

                  <!-- Width lives on the wrapper: the Select root declares w-full in its own
                       static class, which wins over a consumer w-[…] on a specificity tie. -->
                  <div class="w-[var(--container-3xs)] shrink-0">
                    <Select
                      v-model="statusFilter"
                      multiple
                      size="large"
                      placeholder="All Statuses"
                      :display-value="filterDisplay('All Statuses', statusOptions)"
                    >
                      <Select.Trigger aria-label="Filter by status" />
                      <Select.Content>
                        <Select.Option
                          v-for="option in statusOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </div>

                </div>
              </template>

              <template #cell-domain="{ row, value }">
                <!-- Primary domain link (truncates) + arrow, then "+N" overflow Popover; copy button pinned to the cell's right edge so it aligns across rows. -->
                <div class="flex w-full min-w-0 items-center gap-[var(--spacing-xs)]">
                  <a
                    :href="`https://${value}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex min-w-0 items-center gap-[var(--spacing-xxs)] hover:underline"
                    @click.stop
                  >
                    <span class="truncate">{{ value }}</span>
                    <i class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
                  </a>
                  <Popover
                    v-if="row.domainCount"
                    placement="bottom-start"
                    width="medium"
                  >
                    <Popover.Trigger @click.stop>
                      <Tag
                        :label="`+${row.domainCount}`"
                        severity="secondary"
                        size="small"
                        class="shrink-0 cursor-pointer"
                      />
                    </Popover.Trigger>

                    <Popover.Content @click.stop>
                      <div
                        class="flex max-h-[var(--container-xs)] flex-col overflow-auto p-[var(--spacing-xxs)]"
                      >
                        <p
                          class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-overline-sm text-[var(--text-muted)]"
                        >
                          {{ row.domains.length }} domains
                        </p>
                        <span
                          v-for="domain in row.domains"
                          :key="domain"
                          class="truncate px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-body-sm text-[var(--text-default)]"
                        >
                          {{ domain }}
                        </span>
                      </div>
                    </Popover.Content>
                  </Popover>
                  <CopyButton
                    kind="outlined"
                    :value="value"
                    aria-label="Copy domain name"
                    class="ml-auto shrink-0"
                  />
                </div>
              </template>

              <template #cell-status="{ value }">
                <Tag
                  :label="value"
                  :severity="value === 'Live' ? 'success' : 'secondary'"
                  size="medium"
                />
              </template>

              <template #cell-lastModified="{ row }">
                <LastModifiedCell
                  :author="row.owner"
                  :avatar-src="row.ownerAvatar"
                  :date="row.modifiedAt"
                />
              </template>

              <template #cell-actions="{ row }">
                <Dropdown
                  placement="bottom-end"
                  @select="(event, value) => onRowAction(event, value, row)"
                >
                  <Dropdown.Trigger>
                    <Tooltip text="Row actions">
                      <IconButton
                        icon="pi pi-ellipsis-h"
                        kind="outlined"
                        size="small"
                        aria-label="Row actions"
                      />
                    </Tooltip>
                  </Dropdown.Trigger>

                  <Dropdown.Group>
                    <Dropdown.Option value="view" label="View details">
                      <template #left>
                        <i class="pi pi-eye" aria-hidden="true" />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option value="duplicate" label="Clone">
                      <template #left>
                        <i class="pi pi-clone" aria-hidden="true" />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>

                  <Dropdown.Group>
                    <Dropdown.Option value="delete" label="Delete">
                      <template #left>
                        <i class="pi pi-trash" aria-hidden="true" />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                </Dropdown>
              </template>
            </Table>
          </template>
        </CardBox>
      </section>
    </main>
  </AppLayout>
</template>
