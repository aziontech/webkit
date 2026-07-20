<script setup>
// Workloads list — the Azion Console "Workloads" module. The app shell (sidebar +
// GlobalHeader breadcrumb) comes from AppLayout; this page renders a PageHeading
// (title + description + "Documentation" / "+ Workload") over a data-driven <Table>
// whose toolbar composes the table's own filter / search / refresh / export /
// column controls and whose rows open the workload detail view. As a first-level
// module list it carries no navigation tabs.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import CopyButton from "@aziontech/webkit/copy-button";
import Dropdown from "@aziontech/webkit/dropdown";
import IconButton from "@aziontech/webkit/icon-button";
import Popover from "@aziontech/webkit/popover";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

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
    return {
      id: `10${(20482 + n * 173).toString()}`,
      name: `workload_${String(n).padStart(2, "0")}`,
      domain: domains[0],
      domains,
      domainCount: extraCount,
      status: n % 9 === 0 ? "Inactive" : "Active",
      lastModified: "May 15, 2026, 11:00:25 am",
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

const filterFields = [
  { id: "name", label: "Name", type: "text" },
  { id: "domain", label: "Domain", type: "text" },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
  },
];

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
    <main class="flex h-full flex-col gap-[var(--spacing-lg)]">
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
              :data="workloads"
              :columns="columns"
              :filter-fields="filterFields"
              row-key="id"
              enable-sorting
              paginated
              :page-size="10"
              :border="false"
              @row-click="openWorkload"
            >
              <template #toolbar>
                <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                  <Table.Filter :fields="filterFields" />
                  <Table.Search size="large" placeholder="Search workloads..." class="flex-1" />
                  <Table.RefreshButton />
                  <Table.Export />
                  <Table.ColumnSelector />
                </div>
              </template>

              <template #filters>
                <Table.AppliedFilters />
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

              <template #cell-lastModified="{ value, row }">
                <LastModifiedCell :author="row.owner" :avatar-src="row.ownerAvatar" :date="value" />
              </template>

              <template #cell-actions="{ row }">
                <Dropdown
                  placement="bottom-end"
                  @select="(event, value) => onRowAction(event, value, row)"
                >
                  <Dropdown.Trigger>
                    <IconButton
                      icon="pi pi-ellipsis-h"
                      kind="outlined"
                      size="small"
                      aria-label="Row actions"
                    />
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
