<script setup>
// Dashboard — the console home. The app shell (single sidebar + GlobalHeader
// with the module breadcrumb) comes from AppLayout; this page renders only its
// overview content: a welcome header, a metrics strip, the Resources and Recent
// Activity tables, and a right rail with Monthly Usage + Marketplace Trends.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import IconButton from "@aziontech/webkit/icon-button";
import Link from "@aziontech/webkit/link";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed } from "vue";
import { useRoute } from "vue-router";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "gabriel.mendonca@azion.com");

// A friendly display name derived from the email local part.
const displayName = computed(() => {
  const local = String(userEmail.value).split("@")[0];
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
});

// Account-level metrics. `value` is the big number; `unit` sits beside it.
const metrics = [
  {
    label: "Total Data Transferred",
    value: "0",
    unit: "Bytes",
    hint: "Total bytes delivered across all your edge applications.",
  },
  {
    label: "Requests per Second",
    value: "0",
    unit: "/s",
    hint: "Average requests handled per second in the selected window.",
  },
  {
    label: "Bandwidth Saving",
    value: "0",
    unit: "Bytes/s",
    hint: "Bytes served from cache instead of your origin.",
  },
  {
    label: "Data Transf. Offload",
    value: "0",
    unit: "",
    hint: "Share of traffic offloaded from your origin to the edge.",
  },
];

// The metrics window shown to the right of the strip.
const metricsRange = "Jul 14, 2026, 06:56:46 PM - Jul 14, 2026, 07:56:46 PM";

// Resources preview — Edge DNS zones. `status` renders a Tag; the trailing
// action column opens a per-row menu.
const resources = [
  {
    id: "zone-1",
    zoneName: "aasdasdasdas",
    domain: "r72xyxc3d9.map.azionedge.net",
    status: "Active",
    lastModified: "",
  },
  {
    id: "zone-2",
    zoneName: "MyFunction",
    domain: "domain.com",
    status: "Active",
    lastModified: "",
  },
];

const resourceColumns = [
  { accessorKey: "zoneName", header: "Zone Name", principal: true },
  { accessorKey: "domain", header: "Domain", grow: 2 },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "lastModified", header: "Last Modified", grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];

// Recent Activity preview. Each row carries the acting user's email.
const activity = computed(() => [
  {
    id: "act-1",
    date: "Jul 13, 2026, 01:52:58 PM",
    operation: "Created",
    type: "User Login",
    resource: "User Login 11108 - Gabriel Lisboa",
    email: userEmail.value,
  },
  {
    id: "act-2",
    date: "Jun 30, 2026, 06:54:59 PM",
    operation: "Deleted",
    type: "Dns Zone",
    resource: "Dns Zone extat.com",
    email: userEmail.value,
  },
  {
    id: "act-3",
    date: "Jun 30, 2026, 06:54:30 PM",
    operation: "Created",
    type: "Dns Zone",
    resource: "Dns Zone extat.com",
    email: userEmail.value,
  },
  {
    id: "act-4",
    date: "Jun 30, 2026, 06:53:15 PM",
    operation: "Created",
    type: "User Login",
    resource: "User Login 11108 - Gabriel Lisboa",
    email: userEmail.value,
  },
  {
    id: "act-5",
    date: "Jun 24, 2026, 01:55:58 AM",
    operation: "Edited",
    type: "Application Response Rule",
    resource: "Application Response Rule Set Storage Origin for App",
    email: userEmail.value,
  },
]);

const activityColumns = [
  { accessorKey: "date", header: "Date", principal: true },
  { accessorKey: "operation", header: "Operation" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "resource", header: "Resource", grow: 2 },
  { accessorKey: "email", header: "Author Email", grow: 2 },
];

// Created/Deleted carry a colored Tag; neutral operations (Edited) show as
// plain text, so this returns null for them.
const operationSeverity = (operation) => {
  if (operation === "Created") return "success";
  if (operation === "Deleted") return "danger";
  return null;
};

// Monthly usage rollup shown in the right rail.
const monthlyUsage = [{ label: "Edge DNS DNS - Zones", value: "2" }];

// The marketplace template featured in the right-rail carousel.
const featuredTemplate = {
  name: "JWT",
  description:
    "Streamline authentication by processing and validating JSON Web Tokens (JWTs).",
  author: "Azion",
  version: "1.1.0",
};

const inviteUser = () =>
  toast.info("Invite sent", { description: "Your teammate will receive an email." });

const openZoneActions = (event, row) =>
  toast.info(`Actions for ${row.zoneName}`, { description: "Zone ID " + row.id });
</script>

<template>
  <AppLayout active="home" :breadcrumb="[{ label: 'Home' }]">
    <main class="min-w-0 flex-1">
      <div class="flex flex-col gap-[var(--spacing-lg)] xl:flex-row xl:items-start">
        <!-- Primary column -->
        <div class="flex min-w-0 flex-1 flex-col gap-[var(--spacing-lg)]">
          <!-- Welcome + Invite User -->
          <PageHeading size="large" :title="`Welcome, ${displayName}`">
            <template #actions>
              <Button
                label="Invite User"
                kind="outlined"
                size="small"
                icon="pi pi-user-plus"
                @click="inviteUser"
              />
            </template>
          </PageHeading>

          <!-- Metrics -->
          <section class="flex flex-col gap-[var(--spacing-md)]">
            <div class="flex items-center gap-[var(--spacing-xs)]">
              <h2 class="text-heading-xs text-[var(--text-default)]">Metrics</h2>
              <IconButton
                icon="pi pi-question-circle"
                kind="transparent"
                size="small"
                aria-label="About metrics"
              />
            </div>

            <div
              class="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2 xl:grid-cols-4"
            >
              <CardBox v-for="metric in metrics" :key="metric.label">
                <template #content>
                  <div class="flex flex-col gap-[var(--spacing-md)]">
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
                      <span
                        class="text-big-number-sm tabular-nums text-[var(--text-default)]"
                      >
                        {{ metric.value }}
                      </span>
                      <span
                        v-if="metric.unit"
                        class="text-body-xs text-[var(--text-muted)]"
                      >
                        {{ metric.unit }}
                      </span>
                    </div>
                  </div>
                </template>
              </CardBox>
            </div>

            <p class="text-pretty text-right text-body-xxs text-[var(--text-muted)]">
              {{ metricsRange }}
            </p>
          </section>

          <!-- Resources -->
          <section class="flex flex-col gap-[var(--spacing-md)]">
            <div class="flex items-center gap-[var(--spacing-xs)]">
              <h2 class="text-heading-xs text-[var(--text-default)]">Resources</h2>
              <IconButton
                icon="pi pi-question-circle"
                kind="transparent"
                size="small"
                aria-label="About resources"
              />
            </div>

            <CardBox :padded="false">
              <template #content>
                <Table :data="resources" :columns="resourceColumns" row-key="id">
                  <template #cell-status="{ value }">
                    <Tag :value="value" severity="success" size="small" />
                  </template>
                  <template #cell-actions="{ row }">
                    <IconButton
                      icon="pi pi-ellipsis-h"
                      kind="transparent"
                      size="small"
                      aria-label="Zone actions"
                      @click="(event) => openZoneActions(event, row)"
                    />
                  </template>
                </Table>
              </template>
              <template #footer>
                <Link
                  label="View all Edge DNS..."
                  size="medium"
                  :show-icon="false"
                  href="#"
                />
              </template>
            </CardBox>
          </section>

          <!-- Recent Activity -->
          <section class="flex flex-col gap-[var(--spacing-md)]">
            <h2 class="text-heading-xs text-[var(--text-default)]">Recent Activity</h2>

            <CardBox :padded="false">
              <template #content>
                <Table :data="activity" :columns="activityColumns" row-key="id">
                  <template #cell-operation="{ value }">
                    <Tag
                      v-if="operationSeverity(value)"
                      :value="value"
                      :severity="operationSeverity(value)"
                      size="small"
                    />
                    <span v-else class="text-[var(--text-default)]">{{ value }}</span>
                  </template>
                </Table>
              </template>
              <template #footer>
                <Link
                  label="View all Activity..."
                  size="medium"
                  :show-icon="false"
                  href="#"
                />
              </template>
            </CardBox>
          </section>
        </div>

        <!-- Right rail -->
        <aside
          class="flex w-full flex-col gap-[var(--spacing-lg)] xl:max-w-[var(--container-xs)] xl:shrink-0"
        >
          <!-- Monthly Usage -->
          <CardBox>
            <template #header>
              <h2 class="text-heading-xs text-[var(--text-default)]">Monthly Usage</h2>
            </template>
            <template #content>
              <ul class="flex flex-col gap-[var(--spacing-sm)]">
                <li
                  v-for="usage in monthlyUsage"
                  :key="usage.label"
                  class="flex items-center justify-between gap-[var(--spacing-md)]"
                >
                  <span class="min-w-0 truncate text-body-sm text-[var(--text-muted)]">
                    {{ usage.label }}
                  </span>
                  <span
                    class="shrink-0 text-label-sm tabular-nums text-[var(--text-default)]"
                  >
                    {{ usage.value }}
                  </span>
                </li>
              </ul>
            </template>
            <template #footer>
              <Link label="View all Usage..." size="medium" :show-icon="false" href="#" />
            </template>
          </CardBox>

          <!-- Marketplace Trends -->
          <CardBox>
            <template #header>
              <h2 class="text-heading-xs text-[var(--text-default)]">
                Marketplace Trends
              </h2>
            </template>
            <template #content>
              <article class="flex flex-col gap-[var(--spacing-sm)]">
                <div class="flex items-center gap-[var(--spacing-sm)]">
                  <span
                    class="flex size-6 shrink-0 items-center justify-center rounded-[var(--shape-elements)] bg-[var(--bg-surface-raised)] text-[var(--primary)]"
                  >
                    <i class="ai ai-marketplace text-body-sm" aria-hidden="true" />
                  </span>
                  <Link
                    :label="featuredTemplate.name"
                    size="medium"
                    :show-icon="false"
                    href="#"
                  />
                </div>
                <p class="text-pretty text-body-xs text-[var(--text-muted)]">
                  {{ featuredTemplate.description }}
                </p>
                <p class="flex items-center gap-[var(--spacing-md)] text-body-xxs text-[var(--text-muted)]">
                  <span>
                    By
                    <span class="text-[var(--text-default)]">{{ featuredTemplate.author }}</span>
                  </span>
                  <span>
                    Version
                    <span class="text-[var(--text-default)]">{{ featuredTemplate.version }}</span>
                  </span>
                </p>
              </article>
            </template>
            <template #footer>
              <div class="flex items-center gap-[var(--spacing-sm)]">
                <IconButton
                  icon="pi pi-chevron-left"
                  kind="transparent"
                  size="small"
                  aria-label="Previous trend"
                />
                <div class="flex items-center gap-[var(--spacing-xs)]">
                  <span class="size-2 rounded-full bg-[var(--text-default)]" />
                  <span class="size-2 rounded-full bg-[var(--border-default)]" />
                  <span class="size-2 rounded-full bg-[var(--border-default)]" />
                </div>
                <IconButton
                  icon="pi pi-chevron-right"
                  kind="transparent"
                  size="small"
                  aria-label="Next trend"
                />
              </div>
            </template>
          </CardBox>
        </aside>
      </div>
    </main>
  </AppLayout>
</template>
