<script setup>
// Home — the console landing "Resources" view. The app shell (sidebar +
// GlobalHeader with the breadcrumb) comes from AppLayout; this page renders only
// its content: a heading with a resource FILTER Dropdown, a metrics-window date
// range, and a single CardBox that holds the selected resource's Table. When the
// selected resource has no rows (Workloads, by default) the same card shows an
// empty state with the three ways to create a first deploy.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Dropdown from "@aziontech/webkit/dropdown";
import IconButton from "@aziontech/webkit/icon-button";
import Item from "@aziontech/webkit/item";
import ProgressBar from "@aziontech/webkit/progress-bar";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, ref } from "vue";

import AppLayout from "./ui/AppLayout.vue";
import ContrastBanner from "./ui/ContrastBanner.vue";

// Account-level usage. `value` + `unit` is the reading; `percent` drives the
// small progress bar showing how much of the plan allowance is consumed.
const metrics = [
  {
    label: "Data Transferred",
    value: "0",
    unit: "GB",
    percent: 0,
    hint: "Total bytes delivered across all your resources.",
  },
  {
    label: "Requests / Second",
    value: "0",
    unit: "/s",
    percent: 0,
    hint: "Average requests handled per second in the selected window.",
  },
  {
    label: "Bandwidth Saving",
    value: "0",
    unit: "MB",
    percent: 0,
    hint: "Bytes served from cache instead of your origin.",
  },
  {
    label: "Data Offload",
    value: "0",
    unit: "%",
    percent: 0,
    hint: "Share of traffic offloaded from your origin to the edge.",
  },
];

// Fresh/empty account: every resource type has no rows yet, so each renders the
// create-your-first empty state. Columns are kept so the Table lights up as soon
// as rows arrive (swap a `rows` array back in to preview the populated view).
const resources = {
  workloads: {
    label: "Workloads",
    columns: [
      { accessorKey: "name", header: "Name", principal: true, enableSorting: true },
      { accessorKey: "domain", header: "Domain", grow: 2 },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "lastModified", header: "Last Modified", grow: 2, enableSorting: true },
      { id: "actions", kind: "action", hideable: false },
    ],
    rows: [],
    empty: {
      icon: "pi pi-box",
      title: "No Workloads created yet",
      description:
        "Create your first deploy starting from scratch, a template or importing your code.",
      actions: [
        {
          id: "github",
          title: "Import from GitHub",
          description: "Import a repository from GitHub.",
          button: "Import",
          icon: "pi pi-github",
        },
        {
          id: "template",
          title: "Start from a Template",
          description: "Choose a framework boilerplate.",
          button: "Templates",
          icon: "pi pi-clone",
        },
        {
          id: "scratch",
          title: "Start from Scratch",
          description: "Start from a blank Workload.",
          button: "Create",
          icon: "pi pi-file",
        },
      ],
    },
  },
  "edge-dns": {
    label: "Edge DNS",
    columns: [
      { accessorKey: "name", header: "Zone Name", principal: true, enableSorting: true },
      { accessorKey: "domain", header: "Domain", grow: 2 },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "lastModified", header: "Last Modified", grow: 2, enableSorting: true },
      { id: "actions", kind: "action", hideable: false },
    ],
    rows: [],
    empty: {
      icon: "pi pi-globe",
      title: "No DNS zones created yet",
      description:
        "Add a zone to manage records and route traffic through Azion Edge DNS.",
      actions: [
        {
          id: "create",
          title: "Create a Zone",
          description: "Set up a new DNS zone from scratch.",
          button: "Create",
          icon: "pi pi-plus",
        },
        {
          id: "import",
          title: "Import a Zone File",
          description: "Import records from a BIND zone file.",
          button: "Import",
          icon: "pi pi-upload",
        },
      ],
    },
  },
  "object-storage": {
    label: "Object Storage",
    columns: [
      { accessorKey: "name", header: "Bucket Name", principal: true, enableSorting: true },
      { accessorKey: "access", header: "Edge Access" },
      { accessorKey: "objects", header: "Objects" },
      { accessorKey: "lastModified", header: "Last Modified", grow: 2, enableSorting: true },
      { id: "actions", kind: "action", hideable: false },
    ],
    rows: [],
    empty: {
      icon: "pi pi-database",
      title: "No buckets created yet",
      description: "Create a bucket to store and serve static assets from the edge.",
      actions: [
        {
          id: "create",
          title: "Create a Bucket",
          description: "Provision a new storage bucket.",
          button: "Create",
          icon: "pi pi-plus",
        },
        {
          id: "upload",
          title: "Upload Files",
          description: "Add objects to an existing bucket.",
          button: "Upload",
          icon: "pi pi-upload",
        },
      ],
    },
  },
  functions: {
    label: "Functions",
    columns: [
      { accessorKey: "name", header: "Name", principal: true, enableSorting: true },
      { accessorKey: "language", header: "Language" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "lastModified", header: "Last Modified", grow: 2, enableSorting: true },
      { id: "actions", kind: "action", hideable: false },
    ],
    rows: [],
    empty: {
      icon: "pi pi-code",
      title: "No functions created yet",
      description: "Write an edge function to run serverless code close to your users.",
      actions: [
        {
          id: "scratch",
          title: "Start from Scratch",
          description: "Create a blank edge function.",
          button: "Create",
          icon: "pi pi-file",
        },
        {
          id: "template",
          title: "Start from a Template",
          description: "Use a function boilerplate.",
          button: "Templates",
          icon: "pi pi-clone",
        },
      ],
    },
  },
};

// Filter options for the Dropdown, derived from the resource map.
const filterOptions = Object.entries(resources).map(([value, { label }]) => ({
  value,
  label,
}));

// Workloads is selected by default, so the fresh-account empty state leads.
const selected = ref("workloads");
const current = computed(() => resources[selected.value]);
const isEmpty = computed(() => current.value.rows.length === 0);

const onFilter = (event, value) => {
  selected.value = value;
};

const createFrom = (action) =>
  toast.info(action.title, { description: `Starting a new ${current.value.label} flow.` });

// Colored Tag for Active; neutral for everything else.
const statusSeverity = (value) => (value === "Active" ? "success" : "secondary");

// Row action menu — Dropdown emits (event, value); routed per row.
const onRowAction = (event, value, row) => {
  if (value === "delete") {
    current.value.rows = current.value.rows.filter((item) => item.id !== row.id);
    toast.success(`${row.name} deleted`);
    return;
  }
  const copy = { view: `Viewing ${row.name}`, edit: `Editing ${row.name}` };
  toast.info(copy[value] ?? row.name, { description: `${current.value.label} · ${row.id}` });
};
</script>

<template>
  <AppLayout active="home" :breadcrumb="[{ label: 'Home' }]">
    <div class="mx-auto flex w-full max-w-[var(--container-7xl)] justify-center pb-[var(--spacing-xxl)] pt-[var(--spacing-xl)]">
      <ContrastBanner />
    </div>

    <main class="mx-auto flex w-full max-w-[var(--container-7xl)] flex-col items-start gap-[var(--spacing-lg)] md:flex-row">
      <!-- Left (minor): account usage — one metric per card, its reading beside a
           small progress bar showing plan consumption. On mobile it spans the
           full width above the resources; on `md`+ it becomes the narrow rail. -->
      <aside class="flex w-full shrink-0 flex-col gap-[var(--spacing-md)] md:max-w-[var(--container-xs)]">
        <div class="flex min-h-[var(--size-8)] items-center px-[var(--spacing-xs)]">
          <h2 class="text-heading-xxs text-[var(--text-default)]">Usage</h2>
        </div>

        <!-- 2-up on mobile where the aside is full width; single column once it
             narrows into the desktop rail. -->
        <div class="grid grid-cols-2 gap-[var(--spacing-md)] md:grid-cols-1">
          <CardBox
            v-for="metric in metrics"
            :key="metric.label"
            :padded="false"
          >
            <template #content>
              <div class="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
                <div class="flex items-center gap-[var(--spacing-xs)]">
                  <span class="min-w-0 truncate text-label-sm text-[var(--text-default)]">
                    {{ metric.label }}
                  </span>
                  <Tooltip :text="metric.hint">
                    <i
                      class="pi pi-info-circle text-body-sm text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                  </Tooltip>
                </div>
                <div class="flex items-baseline gap-[var(--spacing-xxs)]">
                  <span class="text-big-number-sm tabular-nums text-[var(--text-default)]">
                    {{ metric.value }}
                  </span>
                  <span
                    v-if="metric.unit"
                    class="text-body-xs text-[var(--text-muted)]"
                  >{{ metric.unit }}</span>
                </div>
              </div>
              <!-- Progress reads as a flush bar on the card's bottom edge — a
                   consumption "border" that costs no inline space. -->
              <ProgressBar
                :value="metric.percent"
                :max="100"
                size="small"
                shape="flat"
                class="w-full"
                :aria-label="`${metric.label} usage`"
              />
            </template>
          </CardBox>
        </div>
      </aside>

      <!-- Right (major): resources with a filter Dropdown whose selected option
           carries the checkmark; choosing one swaps the card below. -->
      <section class="flex w-full min-w-0 flex-col gap-[var(--spacing-md)] md:flex-1">
        <header class="flex min-h-[var(--size-8)] items-center gap-[var(--spacing-sm)] px-[var(--spacing-xs)]">
          <h2 class="text-heading-xxs text-[var(--text-default)]">Resources</h2>

        <Dropdown placement="bottom-start" @select="onFilter">
          <Dropdown.Trigger>
            <IconButton
              icon="pi pi-sliders-h"
              kind="outlined"
              size="medium"
              aria-label="Filter by resource"
            />
          </Dropdown.Trigger>

          <Dropdown.Group label="Filter by Resource">
            <Dropdown.Option
              v-for="option in filterOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
              :selected="selected === option.value"
            >
              <template
                v-if="selected === option.value"
                #right
              >
                <i
                  class="pi pi-check text-[var(--text-default)]"
                  aria-hidden="true"
                />
              </template>
            </Dropdown.Option>
          </Dropdown.Group>
        </Dropdown>
      </header>

      <!-- Empty state (Workloads on a fresh account): one CardBox holding a
           centered lead and an Item.List of the ways to create a first resource
           — each row an Item with a left icon, its title/description, and action. -->
      <CardBox
        v-if="isEmpty"
        key="resource-empty"
        :padded="false"
      >
        <template #content>
          <div class="flex flex-col items-center gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-xl)] text-center">
            <!-- Featured icon (same pattern as CreationCenter's Git-provider
                 tile): a solid box framed by two concentric translucent
                 squares. -->
            <span
              class="mb-[var(--spacing-xs)] relative flex size-10 items-center justify-center"
            >
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
                  :class="[
                    current.empty.icon,
                    'text-[1rem] leading-none text-[var(--text-default)]',
                  ]"
                  aria-hidden="true"
                />
              </span>
            </span>
            <h3 class="text-heading-xs text-[var(--text-default)]">
              {{ current.empty.title }}
            </h3>
            <p class="max-w-[var(--container-sm)] text-pretty text-body-sm text-[var(--text-muted)]">
              {{ current.empty.description }}
            </p>
          </div>

          <Item.List class="border-t border-[var(--border-muted)]">
            <Item
              v-for="action in current.empty.actions"
              :key="action.id"
            >
              <Item.Media>
                <!-- Icon frame: 32px square, surface-raised fill, muted
                     hairline border, shape-elements radius, 18px glyph. -->
                <span
                  class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[var(--shape-elements)] border-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                >
                  <i
                    :class="[
                      action.icon,
                      'text-[18px] leading-none text-[var(--text-default)]',
                    ]"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ action.title }}</Item.Title>
                <Item.Description>{{ action.description }}</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Button
                  :label="action.button"
                  kind="outlined"
                  size="medium"
                  @click="createFrom(action)"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>

      <!-- Populated resource: data-driven Table inside a flush CardBox, with a
           per-row action menu. -->
      <CardBox
        v-else
        key="resource-table"
        :padded="false"
      >
        <template #content>
          <Table
            :data="current.rows"
            :columns="current.columns"
            row-key="id"
            enable-sorting
          >
            <template #cell-status="{ value }">
              <Tag
                :label="value"
                :severity="statusSeverity(value)"
                size="medium"
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
                  <Dropdown.Option value="view" label="View details" />
                  <Dropdown.Option value="edit" label="Edit" />
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
