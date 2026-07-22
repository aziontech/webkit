<script setup>
// Object Storage — the Azion Console "Object Storage" module (Store area). Like
// SQL Database, the app shell (sidebar + GlobalHeader with the module
// breadcrumb) comes from AppLayout; this page renders only its content: a
// PageHeading (title + description + "Create Bucket") over a data-driven
// <Table> of buckets. Opening a bucket enters its file navigator
// (BucketBrowser.vue), where the objects live.
//
// Empty = one clear next action: with no buckets the content region swaps to an
// EmptyState with the single "Create Bucket" action (/ux-heuristics).
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
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

// The buckets that back the table (data-driven mode). Object counts / sizes are
// mock figures; the file navigator inside a bucket (BucketBrowser.vue) owns the
// actual object tree.
const buckets = ref(
  [
    {
      id: "webkit-storybook-dev",
      name: "webkit-storybook-dev",
      access: "Public",
      objects: 128,
      size: "412.6 MB",
      lastModified: "Jun 22, 2026, 07:21:21 PM",
    },
    {
      id: "azion-assets-prod",
      name: "azion-assets-prod",
      access: "Public",
      objects: 4210,
      size: "18.4 GB",
      lastModified: "Jul 19, 2026, 11:04:00 AM",
    },
    {
      id: "user-uploads",
      name: "user-uploads",
      access: "Private",
      objects: 902,
      size: "2.1 GB",
      lastModified: "Jul 20, 2026, 03:47:00 PM",
    },
  ].map((bucket, index) => {
    const person = authorAt(index);
    return { ...bucket, author: person.name, authorAvatar: person.avatar };
  }),
);

const columns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true, grow: 2 },
  { accessorKey: "access", header: "Access", enableSorting: true },
  { accessorKey: "objects", header: "Objects", enableSorting: true },
  { accessorKey: "size", header: "Size", enableSorting: true },
  { accessorKey: "lastModified", header: "Last Modified", enableSorting: true, grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];

const createBucket = () => toast.info("Create Bucket", { description: "Demo action." });

// Opening a bucket enters its file navigator, carrying the bucket name so the
// browser reads it from the route without a round-trip.
const openBucket = (event, row) =>
  router.push({
    path: `/object-storage/${row.id}`,
    query: { email: userEmail.value, name: row.name },
  });

const onRowAction = (event, value, row) => {
  if (value === "open") {
    openBucket(event, row);
    return;
  }
  if (value === "delete") {
    buckets.value = buckets.value.filter((b) => b.id !== row.id);
    toast.success(`Bucket "${row.name}" deleted.`);
    return;
  }
  toast.info(`Editing ${row.name}`, { description: `Bucket ID ${row.id}` });
};
</script>

<template>
  <AppLayout
    active="object-storage"
    :breadcrumb="[{ label: 'Object Storage' }]"
  >
    <main class="flex h-full flex-col gap-[var(--spacing-lg)]">
      <PageHeading
        title="Object Storage"
        description="Store and serve static objects at the edge — buckets, folders, and files accessed by Applications, Functions, and APIs."
      >
        <template #actions>
          <Button
            label="Documentation"
            kind="outlined"
            size="medium"
            icon="pi pi-book"
            href="https://www.azion.com/en/documentation/products/store/object-storage/"
            target="_blank"
          />
          <Button
            label="Create Bucket"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="createBucket"
          />
        </template>
      </PageHeading>

      <!-- Empty = one clear next action; otherwise the borderless Table in a
           flush CardBox, framed edge-to-edge. -->
      <section
        v-if="!buckets.length"
        class="flex min-h-0 flex-1 items-center justify-center"
      >
        <CardBox class="w-full max-w-[var(--container-2xl)]">
          <template #content>
            <EmptyState
              size="large"
              title="No buckets yet"
              description="Create your first bucket to store and serve static objects at the edge."
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
                      class="ai ai-edge-storage text-[1rem] leading-none text-[var(--text-default)]"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </template>
              <template #actions>
                <Button
                  label="Create Bucket"
                  kind="secondary"
                  size="large"
                  icon="pi pi-plus"
                  @click="createBucket"
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
              :data="buckets"
              :columns="columns"
              row-key="id"
              enable-sorting
              paginated
              :page-size="8"
              :border="false"
              @row-click="openBucket"
            >
              <template #toolbar>
                <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                  <Table.Search
                    size="large"
                    placeholder="Search buckets..."
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
                    class="ai ai-edge-storage shrink-0 text-[1.15em] text-[var(--text-muted)]"
                    aria-hidden="true"
                  />
                  <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                </div>
              </template>

              <template #cell-access="{ value }">
                <Tag
                  :label="value"
                  :severity="value === 'Public' ? 'success' : 'neutral'"
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
                    <Dropdown.Option value="open" label="Browse files">
                      <template #left><i class="pi pi-folder-open" aria-hidden="true" /></template>
                    </Dropdown.Option>
                    <Dropdown.Option value="edit" label="Settings">
                      <template #left><i class="pi pi-cog" aria-hidden="true" /></template>
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
