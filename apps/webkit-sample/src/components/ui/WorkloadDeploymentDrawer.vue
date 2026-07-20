<script setup>
// Deployment Details — a READ-ONLY drawer opened from a deployment row (in the
// Overview's Version History or the Deployments tab). Unlike the create/edit
// drawers, it captures nothing: it presents the deployment's metadata as
// label/value blocks and streams its build output through the LogView component.
// The header carries "Visit" and "Redeploy" affordances plus the close button.
import Avatar from "@aziontech/webkit/avatar";
import Button from "@aziontech/webkit/button";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import Link from "@aziontech/webkit/link";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelHeader from "@aziontech/webkit/panel-header";
import StatusIndicator from "@aziontech/webkit/status-indicator";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import { computed } from "vue";

import DeploymentLogs from "./DeploymentLogs.vue";

const open = defineModel("open", { type: Boolean, default: false });

const props = defineProps({
  // The deployment record to present. Null while nothing is selected.
  deployment: { type: Object, default: null },
});

// Maps a deployment status to a StatusIndicator severity + spinner state.
const STATUS_SEVERITY = {
  Ready: { severity: "success", loading: false },
  Error: { severity: "danger", loading: false },
  Queued: { severity: "warning", loading: false },
  Building: { severity: "info", loading: true },
  Draft: { severity: "neutral", loading: false },
};
const statusMeta = computed(
  () => STATUS_SEVERITY[props.deployment?.status] ?? { severity: "neutral", loading: false },
);

// A deployment still building streams its output live; anything else is a
// finished deployment shown in full.
const isBuilding = computed(() => props.deployment?.status === "Building");

const redeploy = () => {
  toast.info(`Redeploying version ${props.deployment?.versionId ?? ""}.`);
};

// The label/value metadata blocks, in the drawer's grid order.
const metaBlocks = computed(() => {
  const d = props.deployment;
  if (!d) return [];
  return [
    { key: "application", label: "Application", icon: "ai ai-edge-application", value: d.application ?? "App name", version: "latest" },
    { key: "firewall", label: "Firewall", icon: "ai ai-edge-firewall", value: d.firewall ?? "firewall_name", version: "latest" },
    { key: "customPage", label: "Custom Page", icon: "ai ai-custom-pages", value: d.customPage ?? "Application", version: "latest" },
  ];
});
</script>

<template>
  <Drawer v-model:open="open" size="large" side="right">
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <div class="flex min-h-0 flex-1 flex-col">
          <PanelHeader class="w-full">
            <DrawerTitle>Deployment Details</DrawerTitle>
            <div class="flex items-center gap-[var(--spacing-sm)]">
              <Link label="Visit" href="#" target="_blank" @click.prevent />
              <Button
                type="button"
                label="Redeploy"
                kind="outlined"
                size="medium"
                icon="pi pi-refresh"
                @click="redeploy"
              />
              <DrawerClose />
            </div>
          </PanelHeader>

          <PanelContent>
            <div v-if="deployment" class="flex flex-col gap-[var(--spacing-lg)]">
              <!-- Metadata grid: environment / status / created, then resources -->
              <div
                class="grid grid-cols-1 gap-[var(--spacing-lg)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-md)] sm:grid-cols-3"
              >
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <span class="text-overline-sm uppercase text-[var(--text-muted)]">Environment</span>
                  <div class="flex items-center gap-[var(--spacing-xs)]">
                    <span class="text-body-sm text-[var(--text-default)]">{{ deployment.environment }}</span>
                    <Tag v-if="deployment.current" label="Current" severity="info" size="small" />
                  </div>
                </div>
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <span class="text-overline-sm uppercase text-[var(--text-muted)]">Status</span>
                  <div class="flex items-center gap-[var(--spacing-xs)]">
                    <StatusIndicator
                      :severity="statusMeta.severity"
                      :loading="statusMeta.loading"
                      :label="deployment.status"
                    />
                    <span v-if="deployment.duration" class="text-body-sm text-[var(--text-muted)]">
                      {{ deployment.duration }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <span class="text-overline-sm uppercase text-[var(--text-muted)]">Created</span>
                  <div class="flex items-center gap-[var(--spacing-xs)]">
                    <Avatar :label="deployment.author" size="small" />
                    <span class="text-body-sm text-[var(--text-default)]">{{ deployment.author }}</span>
                  </div>
                </div>

                <div
                  v-for="block in metaBlocks"
                  :key="block.key"
                  class="flex flex-col gap-[var(--spacing-xxs)]"
                >
                  <span class="text-overline-sm uppercase text-[var(--text-muted)]">{{ block.label }}</span>
                  <div class="flex items-center gap-[var(--spacing-xs)]">
                    <i :class="[block.icon, 'text-[var(--text-muted)]']" aria-hidden="true" />
                    <span class="text-body-sm text-[var(--text-default)]">{{ block.value }}</span>
                    <span class="text-body-xs text-[var(--text-muted)]">{{ block.version }}</span>
                  </div>
                </div>
              </div>

              <!-- Deployment Logs — the shared step view, keyed so it resets
                   when a different deployment is opened. -->
              <div
                class="overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)]"
              >
                <DeploymentLogs
                  :key="deployment.versionId"
                  :live="isBuilding"
                />
              </div>
            </div>
          </PanelContent>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
