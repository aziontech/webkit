<script setup>
// Applications list — the Azion Console "Applications" module. The app shell
// (single sidebar + GlobalHeader with the module breadcrumb) comes from
// AppLayout; this page renders only its content: a PageHeading (title +
// description + primary actions) over a data-driven <Table> whose row actions
// open a Dropdown menu. As a first-level module list it carries no navigation
// tabs.
//
// Narrowing is a SELECTOR PER COLUMN, not a generic field/operator/value builder:
// Authors (multiple Select), Last Modified (Calendar — a shortcut rail beside a
// month grid for a custom range), Status (multiple Select). Each is always visible in
// the toolbar, which is what a console list wants; the table's own filter state
// could not host them (its `#filters` band only renders once a filter exists,
// and `author` is not a column at all — it renders inside the Last Modified
// cell). So the three refs pre-filter `:data` and the table sees only the rows
// that survive. Table.Search still narrows further, through the table's own
// global filter.
import Avatar from "@aziontech/webkit/avatar";
import Button from "@aziontech/webkit/button";
import Calendar from "@aziontech/webkit/calendar";
import CardBox from "@aziontech/webkit/card-box";
import CopyButton from "@aziontech/webkit/copy-button";
import Dropdown from "@aziontech/webkit/dropdown";
import IconButton from "@aziontech/webkit/icon-button";
import InputText from "@aziontech/webkit/input-text";
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
import { provisionedApplications, removeDeployment } from "../lib/provisioning";
import AppLayout from "./ui/AppLayout.vue";
import LastModifiedCell from "./ui/LastModifiedCell.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// Framework preset → colored glyph (ai-cor ai-<icon>) + human label. The preset
// is what the repo's azion.config declares (build.preset) and what azion.json
// echoes back — so the framework icon on a row IS the app's build preset. Colored
// glyphs shipped by @aziontech/icons: vue react next angular nuxt astro svelte.
const presetMeta = {
  vue: { label: "Vue", icon: "ai-vue" },
  react: { label: "React", icon: "ai-react" },
  next: { label: "Next.js", icon: "ai-next" },
  angular: { label: "Angular", icon: "ai-angular" },
  nuxt: { label: "Nuxt", icon: "ai-nuxt" },
  astro: { label: "Astro", icon: "ai-astro" },
  svelte: { label: "Svelte", icon: "ai-svelte" },
};
const presetLabel = (preset) => presetMeta[preset]?.label ?? preset;
const presetIcon = (preset) => presetMeta[preset]?.icon ?? "";

// The application records that back the table (data-driven mode). Each app is
// git-backed: it points at a `repository` + `branch` and is built from a
// framework `preset`, deployed by GitHub Actions running the Azion CLI. The
// first row mirrors the real reference repo gab-az/webkit-sample-vue (id, preset,
// domain from its azion/azion.json). The Last Modified avatar comes from the
// shared team roster (src/lib/people.js), assigned round-robin per row.
//
// `modifiedAt` is the real instant — the Last Modified filter compares it, the
// cell renders it relative, and `lastModified` (the sortable / exportable
// display string) is derived from it by one formatter instead of being
// hand-written per row.
const applications = ref([
  {
    id: "1784552864",
    name: "webkit-sample-vue",
    preset: "vue",
    repository: "gab-az/webkit-sample-vue",
    branch: "main",
    domainName: "e7b4verynr.map.azionedge.net",
    infrastructure: "Production",
    status: "Active",
    modifiedAt: daysAgo(2),
  },
  {
    id: "9823746510",
    name: "react-dashboard",
    preset: "react",
    repository: "acme/react-dashboard",
    branch: "main",
    domainName: "d9m8j2k4l5.map.azion.com",
    infrastructure: "Staging",
    status: "Active",
    modifiedAt: daysAgo(375),
  },
  {
    id: "7658392017",
    name: "analytics-pro",
    preset: "next",
    repository: "acme/analytics-pro",
    branch: "main",
    domainName: "q7w8e9r0t1.map.azion.com",
    infrastructure: "Production",
    status: "Active",
    modifiedAt: daysAgo(320),
  },
  {
    id: "4532109876",
    name: "ecommerce-v2",
    preset: "nuxt",
    repository: "shopco/ecommerce-v2",
    branch: "develop",
    domainName: "y6u7i8o9p0.map.azion.com",
    infrastructure: "Development",
    status: "Inactive",
    modifiedAt: daysAgo(250),
  },
  {
    id: "1122334455",
    name: "mobile-app",
    preset: "svelte",
    repository: "acme/mobile-app",
    branch: "main",
    domainName: "a1s2d3f4g5.map.azion.com",
    infrastructure: "Production",
    status: "Active",
    modifiedAt: daysAgo(190),
  },
  {
    id: "9988776655",
    name: "marketing-site",
    preset: "astro",
    repository: "acme/marketing-site",
    branch: "main",
    domainName: "z9x8c7v6b5.map.azion.com",
    infrastructure: "Production",
    status: "Active",
    modifiedAt: daysAgo(141),
  },
  {
    id: "3344556677",
    name: "internal-tools",
    preset: "angular",
    repository: "acme/internal-tools",
    branch: "develop",
    domainName: "n0m9b8v7c6.map.azion.com",
    infrastructure: "Development",
    status: "Active",
    modifiedAt: daysAgo(88),
  },
  {
    id: "5566778899",
    name: "blog-platform",
    preset: "astro",
    repository: "acme/blog-platform",
    branch: "main",
    domainName: "k1l2m3n4o5.map.azion.com",
    infrastructure: "Staging",
    status: "Inactive",
    modifiedAt: daysAgo(63),
  },
  {
    id: "6677889900",
    name: "docs-portal",
    preset: "vue",
    repository: "acme/docs-portal",
    branch: "main",
    domainName: "p9o8i7u6y5.map.azion.com",
    infrastructure: "Production",
    status: "Active",
    modifiedAt: daysAgo(47),
  },
  {
    id: "7788990011",
    name: "status-page",
    preset: "svelte",
    repository: "acme/status-page",
    branch: "main",
    domainName: "m4n5b6v7c8.map.azion.com",
    infrastructure: "Staging",
    status: "Active",
    modifiedAt: daysAgo(21),
  },
  {
    id: "8899001122",
    name: "auth-service",
    preset: "next",
    repository: "acme/auth-service",
    branch: "main",
    domainName: "t1r2e3w4q5.map.azion.com",
    infrastructure: "Production",
    status: "Active",
    modifiedAt: daysAgo(12),
  },
  {
    id: "9900112233",
    name: "legacy-api",
    preset: "react",
    repository: "acme/legacy-api",
    branch: "develop",
    domainName: "g6h7j8k9l0.map.azion.com",
    infrastructure: "Development",
    status: "Inactive",
    modifiedAt: daysAgo(5),
  },
].map((app, index) => {
  const person = authorAt(index);
  return {
    ...app,
    author: person.name,
    authorAvatar: person.avatar,
    lastModified: formatListDate(app.modifiedAt),
  };
}));

// Column model. `name` is the principal (emphasized) column; the trailing
// `actions` column (kind: 'action') is auto-pinned to the right edge.
const columns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true },
  { accessorKey: "repository", header: "Repository", grow: 2 },
  { accessorKey: "id", header: "ID", enableSorting: true },
  // Domain is shown in full (no truncation) — give it the widest flexible share.
  { accessorKey: "domainName", header: "Domain Name", grow: 3 },
  { accessorKey: "infrastructure", header: "Infrastructure", enableSorting: true },
  { accessorKey: "status", header: "Status", enableSorting: true },
  { accessorKey: "lastModified", header: "Last Modified", enableSorting: true, grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];

// ── Column selectors ──────────────────────────────────────────────────────
// Authors options come from the data itself, so the selector can never offer a
// person who has nothing in the list. Each option carries that person's photo,
// so the filter identifies them the same way the Last Modified cell does — by
// face first, name second.
const authorOptions = [
  ...new Map(applications.value.map((app) => [app.author, app.authorAvatar])),
]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([author, avatar]) => ({ value: author, label: author, avatar }));

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
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

// The Calendar's shortcut rail. Picking one applies a range in a single click;
// the month grid beside it fine-tunes the same range value.
const periodPresets = [
  { label: "Last 7 Days", value: { start: daysAgo(7), end: new Date() } },
  { label: "Last 30 Days", value: { start: daysAgo(30), end: new Date() } },
  { label: "Last 3 Months", value: { start: monthsAgo(3), end: new Date() } },
  { label: "Last 12 Months", value: { start: monthsAgo(12), end: new Date() } },
];

const authorFilter = ref([]);
const statusFilter = ref([]);
const modifiedRange = ref(null);

// Applications provisioned by the deploy flow lead the list, newest first — the
// second link of the chain a deploy creates (src/lib/provisioning.js).
const allApplications = computed(() => [
  ...provisionedApplications.value,
  ...applications.value,
]);

const filteredApplications = computed(() =>
  allApplications.value.filter((app) => {
    if (authorFilter.value.length && !authorFilter.value.includes(app.author)) return false;
    if (statusFilter.value.length && !statusFilter.value.includes(app.status)) return false;
    return withinRange(app.modifiedAt, modifiedRange.value);
  }),
);

// Filtering `:data` from outside the table does not trip TanStack's
// `autoResetPageIndex`, so narrowing to fewer rows than the current page's
// offset would render an empty table. Own the pagination state and rewind it.
const pagination = ref({ pageIndex: 0, pageSize: 8 });
watch([authorFilter, statusFilter, modifiedRange], () => {
  pagination.value = { ...pagination.value, pageIndex: 0 };
});

// Entering the module and choosing "create" opens the dedicated create PAGE
// (a form route), not a modal — see CreateApplication.vue.
const createApplication = () =>
  router.push({ path: "/applications/new", query: { email: userEmail.value } });

// Opening an application enters its resource-detail view (the PageHeading +
// nav-tabs pattern), landing on the Overview sub-page.
const openApp = (event, row) =>
  router.push({
    path: `/applications/${row.id}`,
    query: { email: userEmail.value },
  });

// Row action menu — Dropdown emits (event, value); `delete` removes the row.
const onRowAction = (event, value, row) => {
  if (value === "delete") {
    removeDeployment(row.id);
    applications.value = applications.value.filter((app) => app.id !== row.id);
    toast.success(`${row.name} deleted`);
    return;
  }
  if (value === "view") {
    openApp(event, row);
    return;
  }
  const copy = {
    edit: `Editing ${row.name}`,
    duplicate: `Duplicating ${row.name}`,
  };
  toast.info(copy[value] ?? row.name, { description: `Application ID ${row.id}` });
};
</script>

<template>
  <AppLayout active="applications" :breadcrumb="[{ label: 'Applications' }]">
    <main class="layout-column layout-list h-full">
      <!-- First-level module list. The module name lives in the header breadcrumb
           crumb (AppLayout); the PageHeading sits OUT of the card (consistent with
           every list view) and carries the primary actions. The borderless Table
           lives in a flush CardBox (padded=false), framed edge-to-edge. -->
      <PageHeading
        size="large"
        title="Applications"
        description="Build, deploy, and manage your edge applications."
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
            label="New Application"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="createApplication"
          />
        </template>
      </PageHeading>

      <section class="flex min-h-0 flex-col">
        <CardBox :padded="false">
          <template #content>
        <Table
          v-model:pagination="pagination"
          :data="filteredApplications"
          :columns="columns"
          row-key="id"
          enable-sorting
          paginated
          :page-size="8"
          :border="false"
          @row-click="openApp"
        >
          <template #toolbar>
            <!-- Search first, then one selector per column — Authors, Last Modified,
                 Status — all always visible. Every field is `large`, so the row is
                 one 40px band. -->
            <div class="flex w-full flex-wrap items-center gap-[var(--spacing-xs)]">
              <Table.Search
                size="large"
                placeholder="Search..."
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

          <template #cell-name="{ value, row }">
            <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
              <i
                :class="`ai-cor ${presetIcon(row.preset)}`"
                class="shrink-0 text-[1.15em]"
                :title="presetLabel(row.preset)"
                aria-hidden="true"
              />
              <!-- Principal column opens the detail view — underline on hover. -->
              <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
            </div>
          </template>

          <template #cell-repository="{ value }">
            <!-- One rounded chip for the git repo. The label goes through the
                 default slot with `truncate` so a long repo shrinks with an
                 ellipsis instead of overflowing the Tag (whose justify-center +
                 overflow-hidden would otherwise clip the leading GitHub icon).
                 `max-w-full` keeps the chip inside its cell. -->
            <Tag
              severity="secondary"
              size="medium"
              icon="pi pi-github"
              rounded
              class="max-w-full"
            >
              <span class="min-w-0 truncate">{{ value }}</span>
            </Tag>
          </template>

          <template #cell-domainName="{ value }">
            <!-- Domain link (truncates) + external-redirect arrow; copy button pinned to the cell's right edge so it aligns across rows. -->
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
              :author="row.author"
              :avatar-src="row.authorAvatar"
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
                <Dropdown.Option value="edit" label="Edit">
                  <template #left>
                    <i class="pi pi-pencil" aria-hidden="true" />
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
