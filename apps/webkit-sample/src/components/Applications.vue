<script setup>
// Applications list — the Azion Console "Applications" module. The app shell
// (single sidebar + GlobalHeader with the module breadcrumb) comes from
// AppLayout; this page renders only its content: a TabView + data-driven
// <Table> whose row actions open a Dropdown menu and whose toolbar composes the
// table's own context-aware filter / search / refresh / export / column controls.
import Button from "@aziontech/webkit/button";
import CopyButton from "@aziontech/webkit/copy-button";
import Dropdown from "@aziontech/webkit/dropdown";
import IconButton from "@aziontech/webkit/icon-button";
import TabView from "@aziontech/webkit/tab-view";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// Infrastructure tabs filter the list — the "List with Tabs" pattern.
const tabs = [
  { value: "all", label: "All" },
  { value: "Production", label: "Production" },
  { value: "Staging", label: "Staging" },
  { value: "Development", label: "Development" },
];
const activeTab = ref("all");

// The application records that back the table (data-driven mode).
const applications = ref([
  {
    id: "1779806653",
    name: "vue-3-teste",
    domains: "--",
    domainName: "bc8bxjmyix.map.azion.com",
    infrastructure: "Production",
    status: "Active",
    lastModified: "May 26, 2026, 01:49:00 PM",
  },
  {
    id: "9823746510",
    name: "react-dashboard",
    domains: "--",
    domainName: "d9m8j2k4l5.map.azion.com",
    infrastructure: "Staging",
    status: "Active",
    lastModified: "July 15, 2025, 11:30:00 AM",
  },
  {
    id: "7658392017",
    name: "analytics-pro",
    domains: "--",
    domainName: "q7w8e9r0t1.map.azion.com",
    infrastructure: "Production",
    status: "Active",
    lastModified: "August 12, 2025, 09:15:00 AM",
  },
  {
    id: "4532109876",
    name: "ecommerce-v2",
    domains: "--",
    domainName: "y6u7i8o9p0.map.azion.com",
    infrastructure: "Development",
    status: "Inactive",
    lastModified: "September 03, 2025, 04:45:00 PM",
  },
  {
    id: "1122334455",
    name: "mobile-app",
    domains: "--",
    domainName: "a1s2d3f4g5.map.azion.com",
    infrastructure: "Production",
    status: "Active",
    lastModified: "October 20, 2025, 02:10:00 PM",
  },
  {
    id: "9988776655",
    name: "marketing-site",
    domains: "--",
    domainName: "z9x8c7v6b5.map.azion.com",
    infrastructure: "Production",
    status: "Active",
    lastModified: "November 14, 2025, 08:00:00 AM",
  },
  {
    id: "3344556677",
    name: "internal-tools",
    domains: "--",
    domainName: "n0m9b8v7c6.map.azion.com",
    infrastructure: "Development",
    status: "Active",
    lastModified: "December 01, 2025, 03:30:00 PM",
  },
  {
    id: "5566778899",
    name: "blog-platform",
    domains: "--",
    domainName: "k1l2m3n4o5.map.azion.com",
    infrastructure: "Staging",
    status: "Inactive",
    lastModified: "January 18, 2026, 12:20:00 PM",
  },
  {
    id: "6677889900",
    name: "docs-portal",
    domains: "--",
    domainName: "p9o8i7u6y5.map.azion.com",
    infrastructure: "Production",
    status: "Active",
    lastModified: "February 22, 2026, 10:05:00 AM",
  },
  {
    id: "7788990011",
    name: "status-page",
    domains: "--",
    domainName: "m4n5b6v7c8.map.azion.com",
    infrastructure: "Staging",
    status: "Active",
    lastModified: "March 09, 2026, 06:40:00 PM",
  },
  {
    id: "8899001122",
    name: "auth-service",
    domains: "--",
    domainName: "t1r2e3w4q5.map.azion.com",
    infrastructure: "Production",
    status: "Active",
    lastModified: "April 17, 2026, 09:55:00 AM",
  },
  {
    id: "9900112233",
    name: "legacy-api",
    domains: "--",
    domainName: "g6h7j8k9l0.map.azion.com",
    infrastructure: "Development",
    status: "Inactive",
    lastModified: "May 02, 2026, 01:15:00 PM",
  },
]);

// The rows shown under the active infrastructure tab.
const visibleApplications = computed(() =>
  activeTab.value === "all"
    ? applications.value
    : applications.value.filter((app) => app.infrastructure === activeTab.value),
);

// Column model. `name` is the principal (emphasized) column; the trailing
// `actions` column (kind: 'action') is auto-pinned to the right edge.
const columns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true },
  { accessorKey: "id", header: "ID", enableSorting: true },
  { accessorKey: "domains", header: "Domains" },
  { accessorKey: "domainName", header: "Domain Name" },
  { accessorKey: "infrastructure", header: "Infrastructure", enableSorting: true },
  { accessorKey: "status", header: "Status", enableSorting: true },
  { accessorKey: "lastModified", header: "Last Modified", enableSorting: true, grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];

// Fields the built-in Table.Filter builder offers.
const filterFields = [
  { id: "name", label: "Name", type: "text" },
  { id: "domainName", label: "Domain Name", type: "text" },
  {
    id: "infrastructure",
    label: "Infrastructure",
    type: "select",
    options: [
      { label: "Production", value: "Production" },
      { label: "Staging", value: "Staging" },
      { label: "Development", value: "Development" },
    ],
  },
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

// Entering the module and choosing "create" opens the dedicated create PAGE
// (a form route), not a modal — see CreateApplication.vue.
const createApplication = () =>
  router.push({ path: "/applications/new", query: { email: userEmail.value } });

const openApp = (event, row) => {
  toast.info(`Opening ${row.name}`, { description: `Application ID ${row.id}` });
};

// Row action menu — Dropdown emits (event, value); `delete` removes the row.
const onRowAction = (event, value, row) => {
  if (value === "delete") {
    applications.value = applications.value.filter((app) => app.id !== row.id);
    toast.success(`${row.name} deleted`);
    return;
  }
  const copy = {
    view: `Opening ${row.name}`,
    edit: `Editing ${row.name}`,
    duplicate: `Duplicating ${row.name}`,
  };
  toast.info(copy[value] ?? row.name, { description: `Application ID ${row.id}` });
};
</script>

<template>
  <AppLayout active="applications" :breadcrumb="[{ label: 'Applications' }]">
    <main class="flex h-full flex-col">
      <!-- Module intro + primary actions -->
      <PageHeading
        title="Applications"
        description="Define and manage applications that control request processing and application logic on Azion's global infrastructure."
      >
        <template #actions>
          <Button
            label="Examples"
            kind="outlined"
            size="medium"
            icon="pi pi-github"
            href="https://github.com/aziontech"
            target="_blank"
          />
          <Button
            label="New Resource"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="createApplication"
          />
        </template>
      </PageHeading>

      <!-- Infrastructure tabs -->
      <div class="pt-[var(--spacing-md)]">
        <TabView v-model:value="activeTab">
          <TabView.List>
            <TabView.Item
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              :label="tab.label"
            />
          </TabView.List>
        </TabView>
      </div>

      <!-- Applications table -->
      <section class="flex min-h-0 flex-col pt-[var(--spacing-md)]">
        <Table
          :data="visibleApplications"
          :columns="columns"
          :filter-fields="filterFields"
          row-key="id"
          enable-sorting
          paginated
          :page-size="8"
          border
          @row-click="openApp"
        >
          <template #toolbar>
            <div class="flex w-full items-center gap-[var(--spacing-xs)]">
              <Table.Filter :fields="filterFields" />
              <Table.Search size="large" placeholder="Search..." class="flex-1" />
              <Table.RefreshButton />
              <Table.Export />
              <Table.ColumnSelector />
            </div>
          </template>

          <template #filters>
            <Table.AppliedFilters />
          </template>

          <template #cell-domainName="{ value }">
            <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
              <span class="truncate">{{ value }}</span>
              <CopyButton kind="outlined" :value="value" aria-label="Copy domain name" />
            </div>
          </template>

          <template #cell-status="{ value }">
            <Tag
              :value="value"
              :severity="value === 'Active' ? 'success' : 'secondary'"
              size="medium"
            />
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
                <Dropdown.Option value="view" label="View details" />
                <Dropdown.Option value="edit" label="Edit" />
                <Dropdown.Option value="duplicate" label="Duplicate" />
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
      </section>
    </main>
  </AppLayout>
</template>
