<script setup>
// Workload detail — the resource-detail view for a single workload. Its identity
// (name) is the breadcrumb; below the header a full-bleed TabView (Overview /
// Deployments / Settings) drives the active sub-page, with the active tab held in
// the URL (`?tab=`) so it survives reload and is linkable.
//
//  - Overview: an "Active Deployment" CardBox whose deployment topology is a Flow
//    diagram (Resources/Domains node → Live workload node) inside an Accordion, and
//    a "Version History" borderless Table.
//  - Deployments: the same deployment Table with its filter toolbar.
//  - Settings: a General ItemGroup with an independent Save + a danger delete row.
//
// A deployment row (in either table) opens the read-only WorkloadDeploymentDrawer.
import Accordion from "@aziontech/webkit/accordion";
import Avatar from "@aziontech/webkit/avatar";
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import CopyButton from "@aziontech/webkit/copy-button";
import Dropdown from "@aziontech/webkit/dropdown";
import Flow from "@aziontech/webkit/flow";
import IconButton from "@aziontech/webkit/icon-button";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Select from "@aziontech/webkit/select";
import StatusIndicator from "@aziontech/webkit/status-indicator";
import TabView from "@aziontech/webkit/tab-view";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";
import WorkloadDeploymentDrawer from "./ui/WorkloadDeploymentDrawer.vue";

const route = useRoute();
const router = useRouter();

const userEmail = computed(() => route.query.email || "myemail@azion.com");

// A tiny stand-in "record" — in a real app this comes from the route id.
const workload = {
  id: route.params.id || "1082318",
  name: "Workload Name",
};

// --- Tabs (URL-synced) ---------------------------------------------------
const tabs = [
  { value: "overview", label: "Overview" },
  { value: "deployments", label: "Deployments" },
  { value: "settings", label: "Settings" },
];
const activeTab = computed({
  get: () =>
    tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : "overview",
  set: (value) => router.replace({ query: { ...route.query, tab: value } }),
});

// --- Active deployment (Overview) ----------------------------------------
const activeEnvironment = ref("Production");
const environmentOptions = [
  { value: "Production", label: "Production" },
  { value: "Stage", label: "Stage" },
];
const environmentLabel = (value) =>
  environmentOptions.find((option) => option.value === value)?.label ?? value;

const domainsByEnvironment = {
  Production: "w114823432.map.azion.net",
  Stage: "stage.console.azion.com",
};

// --- Deployments ---------------------------------------------------------
// Maps a deployment status to a StatusIndicator severity + spinner state.
const STATUS_SEVERITY = {
  Ready: { severity: "success", loading: false },
  Error: { severity: "danger", loading: false },
  Queued: { severity: "warning", loading: false },
  Building: { severity: "info", loading: true },
  Draft: { severity: "neutral", loading: false },
};
const statusMeta = (status) =>
  STATUS_SEVERITY[status] ?? { severity: "neutral", loading: false };

const deployments = ref([
  { id: "d1", versionId: "1293183210", environment: "Production", current: true, status: "Building", duration: "", date: "May 15, 2026, 11:00:25 am", author: "rafael.umman@azion.com", application: "App name", firewall: "firewall_name", customPage: "Application" },
  { id: "d2", versionId: "1293183211", environment: "Production", current: false, status: "Ready", duration: "99s", date: "May 15, 2026, 10:41:12 am", author: "rafael.umman@azion.com", application: "App name", firewall: "firewall_name", customPage: "Application" },
  { id: "d3", versionId: "1293183212", environment: "Production", current: false, status: "Building", duration: "", date: "May 15, 2026, 10:22:07 am", author: "julia.costa@azion.com", application: "App name", firewall: "firewall_name", customPage: "Application" },
  { id: "d4", versionId: "1293183213", environment: "Stage", current: false, status: "Error", duration: "", date: "May 15, 2026, 09:58:44 am", author: "marco.silva@azion.com", application: "App name", firewall: "firewall_name", customPage: "Application" },
  { id: "d5", versionId: "1293183214", environment: "Stage", current: false, status: "Queued", duration: "", date: "May 15, 2026, 09:40:31 am", author: "julia.costa@azion.com", application: "App name", firewall: "firewall_name", customPage: "Application" },
  { id: "d6", versionId: "1293183215", environment: "Production", current: false, status: "Ready", duration: "99s", date: "May 14, 2026, 06:12:09 pm", author: "rafael.umman@azion.com", application: "App name", firewall: "firewall_name", customPage: "Application" },
  { id: "d7", versionId: "1293183216", environment: "Production", current: false, status: "Building", duration: "", date: "May 14, 2026, 05:51:52 pm", author: "ana.pereira@azion.com", application: "App name", firewall: "firewall_name", customPage: "Application" },
  { id: "d8", versionId: "1293183217", environment: "Stage", current: false, status: "Draft", duration: "", date: "May 14, 2026, 05:30:18 pm", author: "marco.silva@azion.com", application: "App name", firewall: "firewall_name", customPage: "Application" },
  { id: "d9", versionId: "1293183218", environment: "Stage", current: false, status: "Queued", duration: "", date: "May 14, 2026, 05:02:47 pm", author: "ana.pereira@azion.com", application: "App name", firewall: "firewall_name", customPage: "Application" },
]);

// The current (active) deployment drives the Active Deployment card.
const activeDeployment = computed(
  () => deployments.value.find((deployment) => deployment.current) ?? deployments.value[0],
);

const columns = [
  { accessorKey: "versionId", header: "Version", enableSorting: true, principal: true },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "date", header: "Last Modified", enableSorting: true, grow: 2 },
  { accessorKey: "author", header: "Author", grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];
const filterFields = [
  {
    id: "status",
    label: "Status",
    type: "select",
    options: ["Building", "Ready", "Error", "Queued", "Draft"].map((value) => ({
      label: value,
      value,
    })),
  },
  {
    id: "environment",
    label: "Environment",
    type: "select",
    options: environmentOptions,
  },
];

// --- Deployment details drawer -------------------------------------------
const drawerOpen = ref(false);
const selectedDeployment = ref(null);
const openDeployment = (event, row) => {
  selectedDeployment.value = row;
  drawerOpen.value = true;
};
const onRowAction = (event, value, row) => {
  if (value === "details") {
    openDeployment(event, row);
    return;
  }
  if (value === "redeploy") {
    toast.info(`Redeploying version ${row.versionId}.`);
    return;
  }
  toast.info(`Promoting version ${row.versionId}.`);
};

// --- Header actions ------------------------------------------------------
const newDeployment = () =>
  router.push({ path: "/deploy", query: { email: userEmail.value } });
const visit = () => toast.info("Opening the workload in a new tab.");

// --- Settings ------------------------------------------------------------
const settings = reactive({ name: workload.name });
const savingSettings = ref(false);
const settingsBaseline = ref(JSON.stringify(settings));
const settingsDirty = computed(() => JSON.stringify(settings) !== settingsBaseline.value);
const saveSettings = async () => {
  if (savingSettings.value) return;
  savingSettings.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));
    settingsBaseline.value = JSON.stringify(settings);
    toast.success("Workload settings saved.");
  } finally {
    savingSettings.value = false;
  }
};
const deleteWorkload = () => {
  toast.warning("Delete workload is disabled in the demo.");
};
</script>

<template>
  <AppLayout
    active="workloads"
    :padded="false"
    :breadcrumb="[
      { label: 'Workloads', href: '/workloads' },
      { label: workload.name },
    ]"
  >
    <main class="flex h-full flex-col">
      <!-- Nav pattern (ApplicationDetail): no page heading — the workload name is the
           breadcrumb. The tabs are a full-bleed bar with a bottom border; the page's
           primary actions trail on the same row, aligned right. -->
      <div class="border-b border-[var(--border-default)] px-[var(--spacing-md)]">
        <div class="flex items-center gap-[var(--spacing-sm)] py-[var(--spacing-sm)]">
          <TabView v-model:value="activeTab" class="min-w-0 flex-1">
            <TabView.List>
              <TabView.Item
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
            </TabView.List>
          </TabView>
          <div class="flex shrink-0 items-center gap-[var(--spacing-xs)]">
            <Button
              label="Documentation"
              kind="outlined"
              size="medium"
              icon="pi pi-book"
              target="_blank"
              href="https://www.azion.com/en/documentation/"
            />
            <Button
              label="New Deployment"
              kind="secondary"
              size="medium"
              icon="pi pi-cloud-upload"
              @click="newDeployment"
            />
            <Button
              label="Visit"
              kind="primary"
              size="medium"
              icon="pi pi-arrow-up-right"
              @click="visit"
            />
          </div>
        </div>
      </div>

      <section class="min-h-0 flex-1 overflow-auto p-[var(--spacing-md)]">
        <!-- ── Overview ── -->
        <div
          v-if="activeTab === 'overview'"
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
        >
          <!-- Active Deployment -->
          <CardBox :padded="false">
            <template #header>
              <p class="text-heading-xs w-full text-[var(--text-default)]">Active Deployment</p>
              <Select
                v-model="activeEnvironment"
                size="medium"
                class="w-[var(--container-xs)]"
                :display-value="environmentLabel"
              >
                <Select.Trigger aria-label="Environment" />
                <Select.Content>
                  <Select.Option
                    v-for="option in environmentOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </template>

            <template #content>
              <div class="flex flex-col ">
                <!-- Meta row -->
                <div class="p-[var(--spacing-md)] grid grid-cols-2 gap-[var(--spacing-sm)] lg:grid-cols-4">
                  <div class="flex flex-col gap-[var(--spacing-xxs)]">
                    <span class="text-label-sm  text-[var(--text-muted)]">Version ID</span>
                    <div class="flex items-center gap-[var(--spacing-xs)]">
                      <span class="text-body-sm text-[var(--text-default)]">{{ activeDeployment.versionId }}</span>
                      <CopyButton
                        kind="outlined"
                        :value="activeDeployment.versionId"
                        aria-label="Copy version ID"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col gap-[var(--spacing-xxs)]">
                    <span class="text-label-sm  text-[var(--text-muted)]">Environment</span>
                    <div class="flex items-center gap-[var(--spacing-xs)]">
                      <span class="text-body-sm text-[var(--text-default)]">{{ activeEnvironment }}</span>
                      <Tag label="Current" severity="info" size="small" />
                    </div>
                  </div>
                  <div class="flex flex-col gap-[var(--spacing-xxs)]">
                    <span class="text-label-sm  text-[var(--text-muted)]">Status</span>
                    <StatusIndicator severity="success" label="Ready" />
                  </div>
                  <div class="flex items-start justify-between gap-[var(--spacing-xs)]">
                    <div class="flex flex-col gap-[var(--spacing-xxs)]">
                      <span class="text-label-sm  text-[var(--text-muted)]">Deployed</span>
                      <div class="flex items-center gap-[var(--spacing-xs)]">
                        <Avatar :label="activeDeployment.author" size="small" />
                        <span class="text-body-sm text-[var(--text-muted)]">3 days ago</span>
                      </div>
                    </div>
                    <IconButton
                      icon="pi pi-ellipsis-v"
                      kind="transparent"
                      size="small"
                      aria-label="Active deployment actions"
                    />
                  </div>
                </div>

                <!-- Deployment topology: a Flow diagram inside an Accordion. -->
                <Accordion type="single" collapsible default-value="topology">
                  <Accordion.Item value="topology">
                    <Accordion.Trigger>
                      <span class="text-label-sm text-[var(--text-muted)]">Deployment topology</span>
                    </Accordion.Trigger>
                    <Accordion.Content>
                      <Flow align="center">
                        <!-- Resources / Domains node -->
                        <Flow.Node unstyled>
                          <div
                            class="w-[var(--container-2xs)] overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)]"
                          >
                            <div class="border-b border-[var(--border-muted)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
                              <span class="text-label-md text-[var(--text-default)]">Resources</span>
                            </div>
                            <div class="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
                              <span class="text-overline-sm uppercase text-[var(--text-muted)]">Domains</span>
                              <div
                                v-for="(url, env) in domainsByEnvironment"
                                :key="env"
                                class="flex flex-col gap-[var(--spacing-xxs)]"
                              >
                                <span class="text-label-sm text-[var(--text-default)]">{{ env }}</span>
                                <div class="flex items-center gap-[var(--spacing-xs)]">
                                  <span class="truncate text-body-xs text-[var(--text-muted)]">{{ url }}</span>
                                  <CopyButton kind="outlined" :value="url" :aria-label="`Copy ${env} domain`" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Flow.Node>

                        <!-- Live workload node -->
                        <Flow.Node unstyled>
                          <div
                            class="w-[var(--container-2xs)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] p-[var(--spacing-md)]"
                          >
                            <div class="flex items-center gap-[var(--spacing-xs)]">
                              <StatusIndicator severity="success" label="Live" />
                              <span class="text-label-md text-[var(--text-default)]">{{ workload.name }}</span>
                            </div>
                            <div class="mt-[var(--spacing-md)] flex flex-col gap-[var(--spacing-sm)]">
                              <div class="flex flex-col gap-[var(--spacing-xxs)]">
                                <span class="text-overline-sm uppercase text-[var(--text-muted)]">ID</span>
                                <span class="text-label-code-sm text-[var(--text-default)]">{{ workload.id }}</span>
                              </div>
                              <div class="flex flex-col gap-[var(--spacing-xxs)]">
                                <span class="text-overline-sm uppercase text-[var(--text-muted)]">URL</span>
                                <a
                                  href="https://baseurl.azion.map.edge.net"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="inline-flex items-center gap-[var(--spacing-xxs)] whitespace-nowrap text-label-sm text-[var(--text-default)] hover:underline"
                                >
                                  <span>baseurl.azion.map.edge.net</span>
                                  <i class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </Flow.Node>
                      </Flow>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </div>
            </template>
          </CardBox>

          <!-- Version History -->
          <div class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Version History
            </p>
            <CardBox :padded="false">
              <template #content>
                <Table
                  :data="deployments"
                  :columns="columns"
                  :filter-fields="filterFields"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  @row-click="openDeployment"
                >
                  <template #toolbar>
                    <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                      <Table.Filter :fields="filterFields" />
                      <Table.Search size="large" placeholder="Search deployments..." class="flex-1" />
                      <Table.RefreshButton />
                    </div>
                  </template>
                  <template #filters>
                    <Table.AppliedFilters />
                  </template>

                  <template #cell-versionId="{ row, value }">
                    <div class="flex flex-col gap-[var(--spacing-xxs)]">
                      <span class="text-body-sm text-[var(--text-default)]">{{ value }}</span>
                      <div class="flex items-center gap-[var(--spacing-xs)]">
                        <span class="text-body-xs text-[var(--text-muted)]">{{ row.environment }}</span>
                        <Tag v-if="row.current" label="Current" severity="info" size="small" />
                      </div>
                    </div>
                  </template>

                  <template #cell-status="{ row }">
                    <StatusIndicator
                      :severity="statusMeta(row.status).severity"
                      :loading="statusMeta(row.status).loading"
                      :label="row.status"
                    />
                  </template>

                  <template #cell-author="{ value }">
                    <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                      <Avatar :label="value" size="small" />
                      <span class="truncate text-body-sm text-[var(--text-default)]">{{ value }}</span>
                    </div>
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
                          aria-label="Deployment actions"
                        />
                      </Dropdown.Trigger>
                      <Dropdown.Group>
                        <Dropdown.Option value="details" label="View details" />
                        <Dropdown.Option value="redeploy" label="Redeploy" />
                        <Dropdown.Option value="promote" label="Promote to Production" />
                      </Dropdown.Group>
                    </Dropdown>
                  </template>
                </Table>
              </template>
            </CardBox>
          </div>
        </div>

        <!-- ── Deployments ── -->
        <div
          v-else-if="activeTab === 'deployments'"
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
        >
          <CardBox :padded="false">
            <template #content>
              <Table
                :data="deployments"
                :columns="columns"
                :filter-fields="filterFields"
                row-key="id"
                enable-sorting
                paginated
                :page-size="8"
                :border="false"
                @row-click="openDeployment"
              >
                <template #toolbar>
                  <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                    <Table.Filter :fields="filterFields" />
                    <Table.Search size="large" placeholder="Search deployments..." class="flex-1" />
                    <Table.RefreshButton />
                    <Table.Export />
                    <Table.ColumnSelector />
                  </div>
                </template>
                <template #filters>
                  <Table.AppliedFilters />
                </template>

                <template #cell-versionId="{ row, value }">
                  <div class="flex flex-col gap-[var(--spacing-xxs)]">
                    <span class="text-body-sm text-[var(--text-default)]">{{ value }}</span>
                    <div class="flex items-center gap-[var(--spacing-xs)]">
                      <span class="text-body-xs text-[var(--text-muted)]">{{ row.environment }}</span>
                      <Tag v-if="row.current" label="Current" severity="info" size="small" />
                    </div>
                  </div>
                </template>

                <template #cell-status="{ row }">
                  <StatusIndicator
                    :severity="statusMeta(row.status).severity"
                    :loading="statusMeta(row.status).loading"
                    :label="row.status"
                  />
                </template>

                <template #cell-author="{ value }">
                  <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                    <Avatar :label="value" size="small" />
                    <span class="truncate text-body-sm text-[var(--text-default)]">{{ value }}</span>
                  </div>
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
                        aria-label="Deployment actions"
                      />
                    </Dropdown.Trigger>
                    <Dropdown.Group>
                      <Dropdown.Option value="details" label="View details" />
                      <Dropdown.Option value="redeploy" label="Redeploy" />
                      <Dropdown.Option value="promote" label="Promote to Production" />
                    </Dropdown.Group>
                  </Dropdown>
                </template>
              </Table>
            </template>
          </CardBox>
        </div>

        <!-- ── Settings ── -->
        <div
          v-else
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
        >
          <PageHeading
            title="Settings"
            description="Manage this workload's configuration."
            size="small"
          />

          <form
            class="flex flex-col gap-[var(--spacing-sm)]"
            aria-label="General settings"
            novalidate
            @submit.prevent="saveSettings"
          >
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              General
            </p>
            <CardBox :padded="false">
              <template #content>
                <fieldset
                  class="m-0 flex min-w-0 flex-col border-0 p-0"
                  :disabled="savingSettings"
                >
                  <legend class="sr-only">General</legend>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Name</Item.Title>
                        <Item.Description>
                          A unique and descriptive name to identify the workload.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <InputText
                          v-model="settings.name"
                          size="large"
                          :disabled="savingSettings"
                          class="w-full max-w-[var(--container-sm)]"
                          aria-label="Name"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </fieldset>
              </template>
              <template #footer>
                <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
                  <Button
                    label="Save"
                    kind="secondary"
                    size="medium"
                    :loading="savingSettings"
                    :disabled="!settingsDirty"
                    @click="saveSettings"
                  />
                </div>
              </template>
            </CardBox>
          </form>

          <!-- Danger zone -->
          <div class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Danger Zone
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Delete this workload</Item.Title>
                      <Item.Description>
                        Once deleted, the workload and its deployments cannot be recovered.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Button
                        label="Delete Workload"
                        kind="danger"
                        size="medium"
                        icon="pi pi-trash"
                        @click="deleteWorkload"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </div>
        </div>
      </section>
    </main>

    <!-- Read-only deployment details drawer, opened from either table. -->
    <WorkloadDeploymentDrawer v-model:open="drawerOpen" :deployment="selectedDeployment" />
  </AppLayout>
</template>
