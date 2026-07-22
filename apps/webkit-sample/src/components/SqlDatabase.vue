<script setup>
// SQL Database list — the Azion Console "SQL Database" module (Store area). The
// app shell (sidebar + GlobalHeader with the module breadcrumb) comes from
// AppLayout; this page renders only its content: a PageHeading (title +
// description + the primary "Create Database" action) over a data-driven
// <Table>. As a first-level module list it carries no navigation tabs — the
// table's own search narrows the set.
//
// When there are no databases the table's own empty body would read as a blank
// grid, so the whole content region swaps to an EmptyState with the single next
// action (the /ux-heuristics "empty = one clear action" rule).
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import CopyButton from "@aziontech/webkit/copy-button";
import Dropdown from "@aziontech/webkit/dropdown";
import EmptyState from "@aziontech/webkit/empty-state";
import IconButton from "@aziontech/webkit/icon-button";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { authorAt } from "../lib/people";
import AppLayout from "./ui/AppLayout.vue";
import LastModifiedCell from "./ui/LastModifiedCell.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// The database records that back the table (data-driven mode). The Last Modified
// avatar comes from the shared team roster (src/lib/people.js), assigned
// round-robin per row.
const databases = ref(
  [
    {
      id: "db-store-sessions",
      name: "store-sessions",
      status: "Created",
      tables: 4,
      lastModified: "July 20, 2026, 01:03:00 PM",
    },
    {
      id: "db-analytics-events",
      name: "analytics-events",
      status: "Created",
      tables: 12,
      lastModified: "July 12, 2026, 09:41:00 AM",
    },
    {
      id: "db-feature-flags",
      name: "feature-flags",
      status: "Creating",
      tables: 0,
      lastModified: "July 21, 2026, 08:15:00 AM",
    },
  ].map((db, index) => {
    const person = authorAt(index);
    return { ...db, author: person.name, authorAvatar: person.avatar };
  }),
);

const columns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true },
  { accessorKey: "id", header: "ID", enableSorting: true, grow: 2 },
  { accessorKey: "tables", header: "Tables", enableSorting: true },
  { accessorKey: "status", header: "Status", enableSorting: true },
  { accessorKey: "lastModified", header: "Last Modified", enableSorting: true, grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];

// Entering the module and choosing "create" opens the dedicated create PAGE (a
// focused creation shell at /sql-database/new), not a modal — see
// CreateSqlDatabase.vue.
const createDatabase = () =>
  router.push({ path: "/sql-database/new", query: { email: userEmail.value } });

// Opening a database enters its detail view (Tables / Editor tabs), carrying its
// name so the header reads it without a round-trip.
const openDatabase = (event, row) =>
  router.push({
    path: `/sql-database/${row.id}`,
    query: { email: userEmail.value, name: row.name },
  });

const onRowAction = (event, value, row) => {
  if (value === "open") {
    openDatabase(event, row);
    return;
  }
  if (value === "delete") {
    databases.value = databases.value.filter((db) => db.id !== row.id);
    toast.success(`Database "${row.name}" deleted.`);
    return;
  }
  toast.info(`Editing ${row.name}`, { description: `Database ID ${row.id}` });
};
</script>

<template>
  <AppLayout
    active="sql-database"
    :breadcrumb="[{ label: 'SQL Database' }]"
  >
    <main class="flex h-full flex-col gap-[var(--spacing-lg)]">
      <PageHeading
        title="SQL Database"
        description="Create and manage SQL Database instances accessed by Applications, Functions, and APIs."
      >
        <template #actions>
          <Button
            label="Documentation"
            kind="outlined"
            size="medium"
            icon="pi pi-book"
            href="https://www.azion.com/en/documentation/products/store/edge-sql/"
            target="_blank"
          />
          <Button
            label="Create Database"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="createDatabase"
          />
        </template>
      </PageHeading>

      <!-- Empty = one clear next action; otherwise the borderless Table in a
           flush CardBox, framed edge-to-edge. -->
      <section
        v-if="!databases.length"
        class="flex min-h-0 flex-1 items-center justify-center"
      >
        <CardBox class="w-full max-w-[var(--container-2xl)]">
          <template #content>
            <!-- Empty-state pattern (CreationCenter): a solid CardBox framing a
                 dashed, raised EmptyState surface with a featured icon tile
                 (concentric translucent squares) + one clear action. -->
            <EmptyState
              size="large"
              title="No databases yet"
              description="Create your first SQL Database to store relational and vector data at the edge."
              class="flex-1 rounded-[var(--shape-card)] border border-dashed border-[var(--border-default)] bg-[var(--bg-surface-raised)]"
            >
              <template #icon>
                <span class="relative flex size-10 items-center justify-center">
                  <span
                    aria-hidden="true"
                    class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-5"
                  />
                  <span
                    aria-hidden="true"
                    class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-[var(--shape-card)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-10"
                  />
                  <span
                    class="relative flex size-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)]"
                  >
                    <i
                      class="ai ai-edge-sql text-[1rem] leading-none text-[var(--text-default)]"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </template>
              <template #actions>
                <Button
                  label="Create Database"
                  kind="secondary"
                  size="large"
                  icon="pi pi-plus"
                  @click="createDatabase"
                />
              </template>
            </EmptyState>
          </template>
        </CardBox>
      </section>

      <section v-else class="flex min-h-0 flex-col">
        <CardBox :padded="false">
          <template #content>
            <Table
              :data="databases"
              :columns="columns"
              row-key="id"
              enable-sorting
              paginated
              :page-size="8"
              :border="false"
              @row-click="openDatabase"
            >
              <template #toolbar>
                <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                  <Table.Search
                    size="large"
                    placeholder="Search databases..."
                    class="flex-1"
                  />
                  <Table.RefreshButton />
                  <Table.Export />
                  <Table.ColumnSelector />
                </div>
              </template>

              <template #cell-name="{ value }">
                <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                  <i
                    class="ai ai-edge-sql shrink-0 text-[1.15em] text-[var(--text-muted)]"
                    aria-hidden="true"
                  />
                  <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                </div>
              </template>

              <template #cell-id="{ value }">
                <div class="flex w-full min-w-0 items-center gap-[var(--spacing-xs)]">
                  <span class="min-w-0 truncate text-label-code-sm text-[var(--text-muted)]">
                    {{ value }}
                  </span>
                  <CopyButton
                    kind="outlined"
                    :value="value"
                    aria-label="Copy database ID"
                    class="ml-auto shrink-0"
                    @click.stop
                  />
                </div>
              </template>

              <template #cell-status="{ value }">
                <Tag
                  :label="value"
                  :severity="value === 'Created' ? 'success' : 'warning'"
                  size="medium"
                />
              </template>

              <template #cell-lastModified="{ value, row }">
                <LastModifiedCell
                  :author="row.author"
                  :avatar-src="row.authorAvatar"
                  :date="value"
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
                    <Dropdown.Option value="open" label="Open">
                      <template #left><i class="pi pi-arrow-up-right" aria-hidden="true" /></template>
                    </Dropdown.Option>
                    <Dropdown.Option value="edit" label="Edit">
                      <template #left><i class="pi pi-pencil" aria-hidden="true" /></template>
                    </Dropdown.Option>
                  </Dropdown.Group>

                  <Dropdown.Group>
                    <Dropdown.Option value="delete" label="Delete">
                      <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
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
