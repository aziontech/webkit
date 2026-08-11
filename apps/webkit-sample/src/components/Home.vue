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
import EmptyState from "@aziontech/webkit/empty-state";
import IconButton from "@aziontech/webkit/icon-button";
import Item from "@aziontech/webkit/item";
import ProgressBar from "@aziontech/webkit/progress-bar";
import Skeleton from "@aziontech/webkit/skeleton";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, onMounted, onUnmounted, ref } from "vue";

import { useTenancyReload } from "../lib/tenancy-reload";
import AppLayout from "./ui/AppLayout.vue";
import ContrastBanner from "./ui/ContrastBanner.vue";
import HomeWire from "./ui/HomeWire.vue";

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
// Switching organization, account or workspace reloads Home: usage is metered for
// the scope in force and the resources below are that scope's, so both go to
// skeletons and come back re-read (src/lib/tenancy-reload.js).
const { tenancyReloading } = useTenancyReload();

// THE COLD ARRIVAL. Overview is the console's landing page and nothing on it is
// held: account usage is metered per scope and the resource list is a query. So
// the page opens as its own WIRE (./ui/HomeWire.vue) and settles once, which is a
// different window from the tenancy re-read below and deliberately handled
// differently — arriving there is no page yet to leave standing, whereas a scope
// switch has a page on screen whose readings are merely stale, so that one keeps
// the page and swaps only its numbers for skeletons.
//
// Long enough to read as a fetch, short enough that nobody waits for it. Shorter
// than the tenancy reload's 900ms on purpose: this window lands on a first paint,
// where the shell's own entrance is still arriving underneath it.
const LOAD_MS = 620;
const arriving = ref(true);
let arrivalTimer;
onMounted(() => {
  arrivalTimer = setTimeout(() => {
    arriving.value = false;
  }, LOAD_MS);
});
onUnmounted(() => clearTimeout(arrivalTimer));

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
  <AppLayout active="overview" :breadcrumb="[{ label: 'Overview' }]">
    <!-- Overview is a short page — two stacked blocks that never fill a desktop
         viewport — so it centers in the scroll area instead of hanging from the
         top edge with a void below. `min-h-full`, never `h-full`: min-height
         resolves against the padded scroll box, and once the content does
         exceed it the box grows, justify-center runs out of free space, and
         nothing gets clipped above the scroll origin. -->
    <div
      class="layout-column-focused flex min-h-full flex-col justify-center"
    >
      <!-- THE COLD ARRIVAL: the page's own wire, in the page's own column.
           Everything below is read rather than held — usage is metered per
           tenancy scope, the resource list is a query — so Overview opens as its
           own shape in placeholder fill and settles once the read lands. The wire
           is the same component the session teardown draws for this route family
           (./ui/HomeWire.vue), so the layout the reader sees for that beat is
           exactly the layout that resolves: nothing shifts on arrival.

           A wire and not in-place skeletons, for THIS window only: on a cold
           arrival there is no page yet to leave standing. A tenancy switch is the
           other case — the page is already there and only its readings are stale,
           so that window keeps the numbers' own skeletons (bound to
           `tenancyReloading` below) instead of tearing the page down. -->
      <HomeWire v-if="arriving" />

      <template v-else>
      <div class="flex justify-center">
        <ContrastBanner />
      </div>

      <!-- Two columns that terminate at the same y. No `items-start`: the row
           keeps `align-items: stretch`, so its height is max(aside, section) and
           both columns stretch to it. Each column then needs one internal grow
           target (the metric grid; the resources CardBox) or the slack would
           pile up below the cards. `grow`, never `flex-1` — a zero flex-basis
           makes a column's intrinsic height contribution ill-defined, and that
           contribution is exactly what the row height derives from. -->
      <!--
        THE ENTRANCE. Replacing the wire MOUNTS these two columns, so each one
        rises into place as it arrives (`.content-enter`, src/styles/motion.css) —
        usage first, resources one beat behind it, so the page assembles in
        reading order instead of popping as one slab. Simultaneous arrival reads
        as a swap; a stagger reads as choreography (the same reasoning as the
        signed-out screens' entrance, ../lib/auth-entrance.js).

        It rises rather than travelling sideways: the page itself already arrived
        from the left a beat ago (the route transition), and only what is inside
        it changed now. The delay token is one fast-01 (70ms) — long enough to
        read as an order, short enough that the two still land together.
      -->
      <main
        class="layout-section-start flex flex-col gap-[var(--layout-boundary-start)] lg:flex-row lg:gap-[var(--layout-section-gap)]"
      >
        <!-- Left (minor): account usage — one metric per card, its reading beside a
             small progress bar showing plan consumption. On mobile it spans the
             full width above the resources; on `md`+ it becomes the narrow rail. -->
        <aside
          class="content-enter flex w-full shrink-0 flex-col gap-[var(--layout-group-gap)] lg:max-w-[var(--container-xs)]"
        >
          <div class="flex min-h-[var(--size-8)] items-center px-[var(--spacing-xs)]">
            <h2 class="text-heading-xxs text-[var(--text-default)]">Usage</h2>
          </div>

          <!-- 2-up on mobile where the aside is full width; single column once it
               narrows into the desktop rail. -->
          <div class="grid grow auto-rows-fr grid-cols-2 gap-[var(--layout-group-gap)] lg:grid-cols-1">
            <CardBox
              v-for="metric in metrics"
              :key="metric.label"
              :padded="false"
            >
              <template #content>
                <div class="flex grow flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
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
                    <!-- A reading from the scope we just left is worse than no
                         reading: while the switch reloads, the number is a
                         placeholder the size of the number it replaces. -->
                    <Skeleton
                      v-if="tenancyReloading"
                      width="4.5rem"
                      height="1.75rem"
                    />
                    <template v-else>
                      <span class="text-big-number-sm tabular-nums text-[var(--text-default)]">
                        {{ metric.value }}
                      </span>
                      <span
                        v-if="metric.unit"
                        class="text-body-xs text-[var(--text-muted)]"
                      >{{ metric.unit }}</span>
                    </template>
                  </div>
                </div>
                <!-- Progress reads as a flush bar on the card's bottom edge — a
                     consumption "border" that costs no inline space. -->
                <ProgressBar
                  :value="tenancyReloading ? 0 : metric.percent"
                  :max="100"
                  size="small"
                  shape="flat"
                  class="w-full shrink-0"
                  :aria-label="`${metric.label} usage`"
                />
              </template>
            </CardBox>
          </div>
        </aside>

        <!-- Right (major): resources with a filter Dropdown whose selected option
             carries the checkmark; choosing one swaps the card below.
             The entrance's follower — one fast-01 behind the usage column. -->
        <section
          class="content-enter flex w-full min-w-0 flex-col gap-[var(--layout-group-gap)] lg:flex-1 [--content-enter-delay:var(--transition-duration-fast-01)]"
        >
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

        <!-- Empty state (Workloads on a fresh account): one CardBox holding the
             EmptyState lead and an Item.List of the ways to create a first
             resource — each row an Item with a left icon, its title/description,
             and action. -->
        <!-- Not while reloading: "nothing here yet" is a claim about the new
             scope, and we have not finished reading it. The table below takes
             that window and shows its skeleton instead. -->
        <CardBox
          v-if="isEmpty && !tenancyReloading"
          key="resource-empty"
          :padded="false"
          class="grow"
        >
          <template #content>
            <EmptyState
              :icon="current.empty.icon"
              :title="current.empty.title"
              :description="current.empty.description"
              class="grow"
            />

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
          class="grow"
        >
          <template #content>
            <!-- `page-size` on an unpaginated table is only read for the skeleton:
                 it is how many placeholder rows the reload window shows. -->
            <Table
              :data="current.rows"
              :columns="current.columns"
              row-key="id"
              enable-sorting
              :loading="tenancyReloading"
              :page-size="6"
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
      </template>
    </div>
  </AppLayout>
</template>
