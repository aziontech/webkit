<script setup>
// Edge DNS — the zone list for the Azion Console "Edge DNS" module (Secure
// area). The app shell (sidebar + GlobalHeader with the module breadcrumb)
// comes from AppLayout; this page renders only its content: a PageHeading
// (title + description + the module's primary actions) over a data-driven
// <Table> of authoritative DNS zones.
//
// The header carries three actions: "Copy Nameserver Values" (copies Azion's
// authoritative nameservers so the user can delegate any domain), a "Get Help"
// docs link, and the primary "Zone" create. When there are no zones the whole
// content region swaps to an EmptyState with the single next action (the
// /ux-heuristics "empty = one clear action" rule).
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import CopyButton from "@aziontech/webkit/copy-button";
import Dropdown from "@aziontech/webkit/dropdown";
import EmptyState from "@aziontech/webkit/empty-state";
import IconButton from "@aziontech/webkit/icon-button";
import Link from "@aziontech/webkit/link";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { NAMESERVERS } from "../lib/edge-dns";
import { authorAt } from "../lib/people";
import AppLayout from "./ui/AppLayout.vue";
import LastModifiedCell from "./ui/LastModifiedCell.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// The zones that back the table (data-driven mode). The Last Modified avatar
// comes from the shared team roster (src/lib/people.js), assigned round-robin.
const zones = ref(
  [
    {
      id: "6442",
      name: "test",
      domain: "edgeflow.com",
      status: "Active",
      dnssec: false,
      lastModified: "July 20, 2026, 01:03:00 PM",
    },
    {
      id: "6463",
      name: "Azion Design",
      domain: "azion.design",
      status: "Active",
      dnssec: true,
      lastModified: "July 12, 2026, 09:41:00 AM",
    },
  ].map((zone, index) => {
    const person = authorAt(index);
    return { ...zone, author: person.name, authorAvatar: person.avatar };
  }),
);

const columns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true },
  { accessorKey: "id", header: "ID", enableSorting: true },
  { accessorKey: "domain", header: "Domain", enableSorting: true, grow: 3 },
  { accessorKey: "status", header: "Status", enableSorting: true },
  { accessorKey: "lastModified", header: "Last Modified", enableSorting: true, grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];

// The Filter builder's fields (status is the one enumerable dimension).
const filterFields = [
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

// Copy Azion's authoritative nameservers so the user can delegate a domain
// without opening a zone first.
const copyNameservers = async () => {
  try {
    await navigator.clipboard.writeText(NAMESERVERS.join("\n"));
    toast.success("Nameserver values copied.", {
      description: "Add them in your domain provider to delegate the domain.",
    });
  } catch (error) {
    toast.error("Could not copy the nameservers.", {
      description: error?.message ?? "Copy them manually from a zone's settings.",
    });
  }
};

// Entering the module and choosing "create" opens the dedicated create PAGE (a
// focused creation shell at /edge-dns/new), not a modal — see CreateZone.vue.
const createZone = () =>
  router.push({ path: "/edge-dns/new", query: { email: userEmail.value } });

// Opening a zone enters its detail view (Main Settings / Records tabs), carrying
// its name + domain so the header and Records drawer read them without a
// round-trip.
const openZone = (event, row) =>
  router.push({
    path: `/edge-dns/${row.id}`,
    query: { email: userEmail.value, name: row.name, domain: row.domain },
  });

const onRowAction = (event, value, row) => {
  if (value === "open") {
    openZone(event, row);
    return;
  }
  if (value === "delete") {
    zones.value = zones.value.filter((zone) => zone.id !== row.id);
    toast.success(`Zone "${row.name}" deleted.`);
    return;
  }
  toast.info(`Editing ${row.name}`, { description: `Zone ID ${row.id}` });
};
</script>

<template>
  <AppLayout
    active="edge-dns"
    :breadcrumb="[{ label: 'Edge DNS' }]"
  >
    <main class="flex h-full flex-col gap-[var(--spacing-lg)]">
      <PageHeading
        title="Edge DNS"
        description="Host authoritative DNS zones and serve authoritative DNS responses used to resolve domain names."
      >
        <template #actions>
          <Button
            label="Copy Nameserver Values"
            kind="outlined"
            size="medium"
            icon="pi pi-copy"
            @click="copyNameservers"
          />
          <Link
            label="Get Help"
            size="medium"
            href="https://www.azion.com/en/documentation/products/secure/edge-dns/"
            target="_blank"
          />
          <Button
            label="Zone"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="createZone"
          />
        </template>
      </PageHeading>

      <!-- Empty = one clear next action; otherwise the borderless Table in a
           flush CardBox, framed edge-to-edge. -->
      <section
        v-if="!zones.length"
        class="flex min-h-0 flex-1 items-center justify-center"
      >
        <CardBox class="w-full max-w-[var(--container-2xl)]">
          <template #content>
            <EmptyState
              size="large"
              title="No zones yet"
              description="Create your first zone to host a domain on Azion's authoritative DNS."
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
                      class="ai ai-edge-dns text-[1rem] leading-none text-[var(--text-default)]"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </template>
              <template #actions>
                <Button
                  label="Create Zone"
                  kind="secondary"
                  size="large"
                  icon="pi pi-plus"
                  @click="createZone"
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
              :data="zones"
              :columns="columns"
              :filter-fields="filterFields"
              row-key="id"
              enable-sorting
              paginated
              :page-size="8"
              :border="false"
              @row-click="openZone"
            >
              <template #toolbar>
                <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                  <Table.Filter :fields="filterFields" />
                  <Table.Search
                    size="large"
                    placeholder="Search zones..."
                    class="flex-1"
                  />
                  <Table.RefreshButton />
                  <Table.Export />
                  <Table.ColumnSelector />
                </div>
              </template>

              <template #filters>
                <Table.AppliedFilters />
              </template>

              <template #cell-name="{ value }">
                <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                  <i
                    class="ai ai-edge-dns shrink-0 text-[1.15em] text-[var(--text-muted)]"
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
                    aria-label="Copy zone ID"
                    class="ml-auto shrink-0"
                    @click.stop
                  />
                </div>
              </template>

              <!-- Domain cell: link + external arrow, copy button pinned to the
                   cell's right edge so it aligns across rows. -->
              <template #cell-domain="{ value }">
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
                  <CopyButton
                    kind="outlined"
                    :value="value"
                    aria-label="Copy domain name"
                    class="ml-auto shrink-0"
                    @click.stop
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
