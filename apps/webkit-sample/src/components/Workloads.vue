<script setup>
// Workloads list — the Azion Console "Workloads" module. The app shell (sidebar +
// GlobalHeader breadcrumb) comes from AppLayout; this page renders a PageHeading
// (title + description + "Documentation" / "+ Workload") over a data-driven <Table>
// whose rows open the workload detail view. As a first-level module list it
// carries no navigation tabs.
//
// Narrowing is a SELECTOR PER COLUMN (the same model as Applications): Authors,
// Last Modified (Calendar — a shortcut rail beside a month grid for a custom range), and
// Status, all always visible in the toolbar. They pre-filter `:data`; the table's
// own Search narrows what is left. See Applications.vue for why the table's
// filter state cannot host them.
import Button from "@aziontech/webkit/button";
import Calendar from "@aziontech/webkit/calendar";
import CardBox from "@aziontech/webkit/card-box";
import CopyButton from "@aziontech/webkit/copy-button";
import Dropdown from "@aziontech/webkit/dropdown";
import IconButton from "@aziontech/webkit/icon-button";
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
      status: n % 9 === 0 ? "Inactive" : "Active",
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
const authorOptions = [...new Set(workloads.value.map((workload) => workload.owner))]
  .sort((a, b) => a.localeCompare(b))
  .map((owner) => ({ value: owner, label: owner }));

const statusOptions = [
  { value: "Active", label: "Active" },
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

const filteredWorkloads = computed(() =>
  workloads.value.filter((workload) => {
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

const openWorkload = (event, row) =>
  router.push({ path: `/workloads/${row.id}`, query: { email: userEmail.value } });

const onRowAction = (event, value, row) => {
  if (value === "delete") {
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
    <main class="flex h-full flex-col gap-[var(--layout-section-gap)]">
      <PageHeading
        title="Workloads"
        description="View and manage your workloads."
      >
        <template #actions>
          <Button
            label="Documentation"
            kind="outlined"
            size="medium"
            icon="pi pi-book"
            target="_blank"
            href="https://www.azion.com/en/documentation/"
          />
          <Button
            label="Workload"
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
                <!-- One selector per column, always visible: Authors, Last Modified,
                     Status. Search takes the remaining width. -->
                <div class="flex w-full flex-wrap items-center gap-[var(--spacing-xs)]">
                  <!-- Width lives on the wrapper: the Select root declares w-full in its own
                       static class, which wins over a consumer w-[…] on a specificity tie. -->
                  <div class="w-[var(--container-2xs)] shrink-0">
                    <Select
                      v-model="authorFilter"
                      multiple
                      size="medium"
                      placeholder="All Authors"
                      :display-value="filterDisplay('All Authors', authorOptions)"
                    >
                      <Select.Trigger aria-label="Filter by author" />
                      <Select.Content>
                        <Select.Option
                          v-for="option in authorOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
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
                    size="medium"
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
                      size="medium"
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

                  <Table.Search
                    placeholder="Search workloads..."
                    class="min-w-[var(--container-3xs)] flex-1"
                  />
                  <Table.RefreshButton />
                  <Table.Export />
                  <Table.ColumnSelector />
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
                  :severity="value === 'Active' ? 'success' : 'secondary'"
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
