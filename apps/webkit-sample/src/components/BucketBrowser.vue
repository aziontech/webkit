<script setup>
// Object Storage — bucket file navigator. The console app shell (sidebar +
// GlobalHeader with the module breadcrumb "Object Storage › <bucket>") comes
// from AppLayout; following the resource-detail convention (SqlDatabaseDetail),
// this page carries NO PageHeading — the bucket name lives in the header
// breadcrumb, so the content is just the CardBox whose Table lists the objects
// in the current folder.
//
// Navigation is path-only (no folder tree): a <Breadcrumb> inside the toolbar
// is the sole "where am I" surface. Descending is a folder row-click (or the
// synthetic ".." row that steps up one level); a crumb click jumps straight to
// that ancestor. Files aren't navigable — clicking one is a demo download.
import Breadcrumb from "@aziontech/webkit/breadcrumb";
import CardBox from "@aziontech/webkit/card-box";
import Dropdown from "@aziontech/webkit/dropdown";
import EmptyState from "@aziontech/webkit/empty-state";
import IconButton from "@aziontech/webkit/icon-button";
import SplitButton from "@aziontech/webkit/split-button";
import Table from "@aziontech/webkit/table";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { authorAt } from "../lib/people";
import AppLayout from "./ui/AppLayout.vue";
import LastModifiedCell from "./ui/LastModifiedCell.vue";

const route = useRoute();
const router = useRouter();

const userEmail = computed(() => route.query.email || "myemail@azion.com");

// Bucket identity from the route (id in the path, display name carried in the
// query by the buckets list; falls back to the id).
const bucketId = computed(() => route.params.bucket);
const bucketName = computed(() => route.query.name || bucketId.value);

// ── Mock object tree ────────────────────────────────────────────────────────
// A folder is `{ children }`; a file is `{ size, lastModified, ext }`. The
// navigator resolves the current folder's entries from `folderPath` below.
const file = (size, ext) => ({ size, ext, lastModified: "Jun 22, 2026, 07:21:21 PM" });

const STORYBOOK_BUILD = {
  "assets/": { children: {} },
  "sb-addons/": { children: {} },
  "sb-common-assets/": { children: {} },
  "sb-manager/": { children: {} },
  "favicon.svg": file("1.25 KB", "svg"),
  "iframe.html": file("17.75 KB", "html"),
  "index.html": file("6.03 KB", "html"),
  "index.json": file("183.1 KB", "json"),
  "nunito-sans-bold-italic.woff2": file("49.46 KB", "woff2"),
  "nunito-sans-bold.woff2": file("47.14 KB", "woff2"),
  "nunito-sans-italic.woff2": file("49.62 KB", "woff2"),
  "nunito-sans-regular.woff2": file("47.07 KB", "woff2"),
  "project.json": file("1.01 KB", "json"),
};

// Per-bucket root. `webkit-storybook-dev` mirrors the reference bucket; any other
// bucket gets a small representative tree so the navigator always has content.
const BUCKET_TREES = {
  "webkit-storybook-dev": {
    "20260622162046/": { children: STORYBOOK_BUILD },
    "20260610093012/": { children: STORYBOOK_BUILD },
    "logs/": {
      children: {
        "access.log": file("2.4 MB", "log"),
        "error.log": file("128 KB", "log"),
      },
    },
    "robots.txt": file("64 B", "txt"),
  },
};

const FALLBACK_TREE = {
  "images/": {
    children: {
      "hero.png": file("842 KB", "png"),
      "logo.svg": file("3.2 KB", "svg"),
    },
  },
  "docs/": { children: { "readme.md": file("4.1 KB", "md") } },
  "config.json": file("512 B", "json"),
};

const tree = computed(() => BUCKET_TREES[bucketId.value] ?? FALLBACK_TREE);

// Current folder as an array of segment names (relative to the bucket root).
const folderPath = ref([]);

// Resolve the node map for the current folder.
const currentFolder = computed(() => {
  let node = tree.value;
  for (const segment of folderPath.value) {
    node = node?.[segment]?.children;
    if (!node) return {};
  }
  return node;
});

const isFolder = (entry) => Boolean(entry && entry.children);

// File-type glyph. Folders/parent are handled in the cell template.
const fileIcon = (ext) => {
  const map = {
    svg: "pi pi-image",
    png: "pi pi-image",
    jpg: "pi pi-image",
    jpeg: "pi pi-image",
    html: "pi pi-code",
    json: "pi pi-database",
    md: "pi pi-file-edit",
    txt: "pi pi-file",
    log: "pi pi-align-left",
    woff2: "pi pi-star",
  };
  return map[ext] ?? "pi pi-file";
};

// Rows for the Table: a synthetic ".." parent when nested, then folders, then
// files — folders first, each block alphabetical (console convention).
const rows = computed(() => {
  const entries = Object.entries(currentFolder.value);
  // Folders carry no modifier/timestamp — the Last Modified cell stays empty
  // (the tables skill forbids a raw date, and there is no author for a prefix).
  const folders = entries
    .filter(([, entry]) => isFolder(entry))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name]) => ({ id: name, name, kind: "folder", size: "-", lastModified: "" }));
  // Files get a round-robin author from the shared roster so the Last Modified
  // cell shows an avatar (name on tooltip) + relative time.
  const files = entries
    .filter(([, entry]) => !isFolder(entry))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, entry], index) => {
      const person = authorAt(index);
      return {
        id: name,
        name,
        kind: "file",
        ext: entry.ext,
        size: entry.size,
        lastModified: entry.lastModified,
        author: person.name,
        authorAvatar: person.avatar,
      };
    });

  const list = [...folders, ...files];
  if (folderPath.value.length) {
    list.unshift({ id: "..", name: "..", kind: "parent", size: "-", lastModified: "" });
  }
  return list;
});

const columns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true, grow: 3 },
  { accessorKey: "size", header: "Size", enableSorting: true },
  { accessorKey: "lastModified", header: "Last Modified", enableSorting: true, grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];

// ── Navigation ────────────────────────────────────────────────────────────
const enterFolder = (name) => {
  folderPath.value = [...folderPath.value, name];
};

const goUp = () => {
  folderPath.value = folderPath.value.slice(0, -1);
};

const onRowClick = (event, row) => {
  if (row.kind === "parent") {
    goUp();
    return;
  }
  if (row.kind === "folder") {
    enterFolder(row.name);
    return;
  }
  toast.info(`Downloading ${row.name}`, { description: row.size });
};

// Folder-path breadcrumb: the bucket root, then each folder segment. `href`
// carries the target depth so a crumb click truncates the path to that ancestor.
const pathCrumbs = computed(() => [
  { label: bucketName.value, href: "0" },
  ...folderPath.value.map((segment, index) => ({ label: segment, href: String(index + 1) })),
]);

const onCrumb = (event, href) => {
  // The crumbs are real <a> elements whose href carries the target depth, not a
  // route — stop the native navigation and truncate the path to that ancestor.
  event.preventDefault();
  const depth = Number(href);
  if (Number.isFinite(depth)) folderPath.value = folderPath.value.slice(0, depth);
};

const onRowAction = (event, value, row) => {
  if (value === "open") {
    onRowClick(event, row);
    return;
  }
  if (value === "download") {
    toast.info(`Downloading ${row.name}`, { description: row.size });
    return;
  }
  if (value === "delete") {
    toast.success(`Deleted "${row.name}".`);
    return;
  }
  toast.info(`${row.name}`, { description: `Object in ${bucketName.value}` });
};

// "Add to files" is a SplitButton: the primary command uploads a file (the
// common action); the attached menu offers both "Upload a File" and
// "Add a Folder". Actions are keyed by `value` so the primary click and the
// menu rows route through one dispatcher.
const addToFilesActions = [
  { label: "Upload a File", value: "upload", icon: "pi pi-upload" },
  { label: "Add a Folder", value: "folder", icon: "pi pi-folder-plus" },
];

const runAddAction = (value) => {
  if (value === "folder") {
    toast.info("Add a folder", { description: `New folder in ${bucketName.value}` });
    return;
  }
  toast.info("Upload a file", { description: `Upload into ${bucketName.value}` });
};

// Primary segment click → the default (upload) action.
const onAddPrimary = () => runAddAction("upload");
// Menu row click → route by the selected action's value.
const onAddAction = (event, item) => runAddAction(item.value);
</script>

<template>
  <AppLayout
    active="object-storage"
    :breadcrumb="[
      { label: 'Object Storage', href: '/object-storage' },
      { label: bucketName },
    ]"
  >
    <main class="flex h-full min-h-0 flex-col">
      <section class="flex min-h-0 flex-col">
        <CardBox :padded="false">
          <template #content>
            <Table
              :data="rows"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
              @row-click="onRowClick"
            >
              <template #toolbar>
                <!-- Toolbar, matching the console: the bucket name is the first
                     element at the top of the table header; then search + table
                     controls; then the folder-path breadcrumb (the only
                     "where am I" surface) + "Add to files". -->
                <div class="flex w-full flex-col gap-[var(--spacing-sm)]">
                  <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                    <i
                      class="ai ai-edge-storage shrink-0 text-[1.15em] text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <span class="min-w-0 truncate text-heading-xxs text-[var(--text-default)]">
                      {{ bucketName }}
                    </span>
                  </div>

                  <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                    <Table.Search
                      size="large"
                      placeholder="Search in folder..."
                      class="flex-1"
                    />
                    <Table.RefreshButton />
                    <Table.Export />
                    <Table.ColumnSelector />
                  </div>

                  <div class="flex w-full items-center justify-between gap-[var(--spacing-xs)]">
                    <Breadcrumb
                      :items="pathCrumbs"
                      class="min-w-0"
                      @navigate="onCrumb"
                    />
                    <SplitButton
                      label="Add to files"
                      icon="pi pi-plus"
                      kind="primary"
                      size="medium"
                      :model="addToFilesActions"
                      class="shrink-0"
                      @click="onAddPrimary"
                      @item-click="onAddAction"
                    />
                  </div>
                </div>
              </template>

              <template #cell-name="{ value, row }">
                <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                  <i
                    v-if="row.kind === 'parent'"
                    class="pi pi-folder-open shrink-0 text-[1.15em] text-[var(--text-muted)]"
                    aria-hidden="true"
                  />
                  <i
                    v-else-if="row.kind === 'folder'"
                    class="pi pi-folder shrink-0 text-[1.15em] text-[var(--text-link)]"
                    aria-hidden="true"
                  />
                  <i
                    v-else
                    :class="fileIcon(row.ext)"
                    class="shrink-0 text-[1.15em] text-[var(--text-muted)]"
                    aria-hidden="true"
                  />
                  <span
                    class="truncate"
                    :class="row.kind !== 'file' ? 'cursor-pointer hover:underline' : ''"
                  >
                    {{ value }}
                  </span>
                </div>
              </template>

              <template #cell-size="{ value }">
                <span class="text-[var(--text-muted)]">{{ value }}</span>
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
                  v-if="row.kind !== 'parent'"
                  placement="bottom-end"
                  @select="(event, value) => onRowAction(event, value, row)"
                >
                  <Dropdown.Trigger>
                    <Tooltip text="Object actions">
                      <IconButton
                        icon="pi pi-ellipsis-h"
                        kind="outlined"
                        size="small"
                        aria-label="Object actions"
                      />
                    </Tooltip>
                  </Dropdown.Trigger>

                  <Dropdown.Group>
                    <Dropdown.Option
                      v-if="row.kind === 'folder'"
                      value="open"
                      label="Open"
                    >
                      <template #left><i class="pi pi-folder-open" aria-hidden="true" /></template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      v-else
                      value="download"
                      label="Download"
                    >
                      <template #left><i class="pi pi-download" aria-hidden="true" /></template>
                    </Dropdown.Option>
                  </Dropdown.Group>

                  <Dropdown.Group>
                    <Dropdown.Option value="delete" label="Delete">
                      <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                </Dropdown>
              </template>

              <!-- An empty folder reads as a blank grid otherwise. -->
              <template #empty>
                <EmptyState
                  size="medium"
                  title="This folder is empty"
                  description="Upload objects or create a folder to get started."
                >
                  <template #actions>
                    <SplitButton
                      label="Add to files"
                      icon="pi pi-plus"
                      kind="secondary"
                      size="medium"
                      :model="addToFilesActions"
                      @click="onAddPrimary"
                      @item-click="onAddAction"
                    />
                  </template>
                </EmptyState>
              </template>
            </Table>
          </template>
        </CardBox>
      </section>
    </main>
  </AppLayout>
</template>
