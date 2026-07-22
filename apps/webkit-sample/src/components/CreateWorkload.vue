<script setup>
// The Workloads module "create" flow — a dedicated PAGE (route /workloads/new),
// sidebar hidden so the form is the only focus. Layout follows the same Cards +
// stacked sections shape as Create Application: a centered column of section-
// titled flush CardBoxes, one `submitting` flag locking the whole scope, a sticky
// action bar.
//
// Two of the sections open sub-drawers rather than inlining their editors:
//   - Domains → AddDomainDrawer appends a domain record to the list.
//   - Environments → LinkDeploymentSettingsDrawer flips an environment row from
//     "unlinked" to "linked", carrying the Application / Firewall / Custom Page
//     bundle it selected.
//
// Two submit paths: "Save as Draft" persists without deploying; "Save and Deploy"
// is the primary commit. Both require a name (validation runs on submit only,
// amber `required`, cleared on edit). webkit Button renders type="button", so
// submit is driven from @click with a hidden sr-only submit button for Enter.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Dropdown from "@aziontech/webkit/dropdown";
import EmptyState from "@aziontech/webkit/empty-state";
import HelperText from "@aziontech/webkit/helper-text";
import IconButton from "@aziontech/webkit/icon-button";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Message from "@aziontech/webkit/message";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AddDomainDrawer from "./ui/AddDomainDrawer.vue";
import CreationHeader from "./ui/CreationHeader.vue";
import LinkDeploymentSettingsDrawer from "./ui/LinkDeploymentSettingsDrawer.vue";

const route = useRoute();
const router = useRouter();

const userEmail = computed(() => route.query.email || "myemail@azion.com");

// --- Form state ----------------------------------------------------------
const form = reactive({ name: "" });
const errors = reactive({ name: "" });
const submitting = ref(false);

// Domains added through the Add Domain drawer. Rendered as a data-driven Table —
// the same pattern as the Teams Permissions list (flush CardBox + toolbar with a
// primary "add" action + row-action Dropdown).
const domains = ref([]);
const domainColumns = [
  { accessorKey: "domain", header: "Domain", principal: true, grow: 2 },
  { accessorKey: "environment", header: "Environment" },
  { accessorKey: "certificate", header: "Digital Certificate", grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];

// The two environments a workload ships to. Each is either unlinked (no bundle
// yet) or linked (carries an Application / Firewall / Custom Page).
const environments = ref([
  { name: "Production", linked: false, bundle: "", application: null, firewall: null, customPage: null },
  { name: "Stage", linked: false, bundle: "", application: null, firewall: null, customPage: null },
]);

// True until at least one environment has a deployment settings bundle linked —
// drives the "link settings to enable workloads" warning banner.
const anyLinked = computed(() => environments.value.some((env) => env.linked));

// --- Sub-drawers ---------------------------------------------------------
const addDomainOpen = ref(false);
const linkOpen = ref(false);
const linkEnvironment = ref("Production");

const openAddDomain = () => {
  addDomainOpen.value = true;
};
const onDomainSaved = (domain) => {
  domains.value = [...domains.value, domain];
  toast.success(`Domain "${domain.domain}" added.`);
};
const removeDomain = (id) => {
  domains.value = domains.value.filter((domain) => domain.id !== id);
};
const onDomainAction = (event, value, row) => {
  if (value === "delete") {
    removeDomain(row.id);
    toast.success(`Domain "${row.domain}" removed.`);
    return;
  }
  toast.info(`Editing ${row.domain}`);
};

const openLink = (environmentName) => {
  linkEnvironment.value = environmentName;
  linkOpen.value = true;
};
const onSettingsLinked = (payload) => {
  environments.value = environments.value.map((env) =>
    env.name === payload.environment
      ? {
          ...env,
          linked: true,
          bundle: payload.bundle,
          application: payload.application,
          firewall: payload.firewall,
          customPage: payload.customPage,
        }
      : env,
  );
  toast.success(`Deployment settings linked to ${payload.environment}.`);
};
const unlink = (environmentName) => {
  environments.value = environments.value.map((env) =>
    env.name === environmentName
      ? { ...env, linked: false, bundle: "", application: null, firewall: null, customPage: null }
      : env,
  );
};

// --- Validation + submit -------------------------------------------------
const validate = () => {
  errors.name = form.name.trim() ? "" : "This field is required.";
  return !errors.name;
};

const cancel = () =>
  router.push({ path: "/workloads", query: { email: userEmail.value } });

const persist = async ({ deploy }) => {
  if (submitting.value) return;
  if (!validate()) return;

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success(
      deploy
        ? `Workload "${form.name.trim()}" created and deploying.`
        : `Workload "${form.name.trim()}" saved as draft.`,
    );
    router.push({ path: "/workloads", query: { email: userEmail.value } });
  } catch (error) {
    toast.error("Could not save the workload.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => persist({ deploy }) },
    });
  } finally {
    submitting.value = false;
  }
};

const saveDraft = () => persist({ deploy: false });
const saveAndDeploy = () => persist({ deploy: true });
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <CreationHeader
      :breadcrumb="[
        { label: 'Workloads', href: '/workloads' },
        { label: 'Create Workload' },
      ]"
      back-label="Back to Workloads"
      @back="cancel"
      @navigate="cancel"
    />
    <main class="min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        aria-label="Create Workload"
        novalidate
        @submit.prevent="saveAndDeploy"
      >
        <div
          class="mx-auto flex w-full max-w-[var(--container-7xl)] flex-1 flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]"
        >
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create workload</legend>

            <!-- Section: General -->
            <section class="flex flex-col gap-[var(--spacing-sm)]">
              <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                General
              </p>
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Name</Item.Title>
                        <Item.Description>
                          Create a workload with Azion to build an application and
                          serve it up securely with digital certificates.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                          <InputText
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            placeholder="My workload name"
                            :required="!!errors.name"
                            :aria-describedby="errors.name ? 'workload-name-error' : undefined"
                            @update:model-value="errors.name = ''"
                          />
                          <HelperText
                            v-if="errors.name"
                            id="workload-name-error"
                            kind="required"
                            :label="errors.name"
                          />
                          <p class="text-body-xs text-[var(--text-muted)]">
                            Type your workload name.
                          </p>
                        </div>
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <!-- Section: Domains — the Teams Permissions pattern: a flush CardBox
                 whose borderless Table carries a search + primary "add" toolbar and
                 a row-action Dropdown; empty state prompts the first domain. -->
            <section class="flex flex-col gap-[var(--spacing-sm)]">
              <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                Domains
              </p>
              <CardBox :padded="false">
                <template #content>
                  <Table
                    :data="domains"
                    :columns="domainColumns"
                    row-key="id"
                    :border="false"
                  >
                    <template #toolbar>
                      <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                        <Table.Search
                          size="large"
                          placeholder="Search domains..."
                          class="flex-1"
                        />
                        <Button
                          type="button"
                          label="Add new Domain"
                          kind="primary"
                          size="medium"
                          icon="pi pi-plus"
                          @click="openAddDomain"
                        />
                      </div>
                    </template>

                    <template #empty>
                      <EmptyState
                        title="No domains yet"
                        description="Add a domain to link it to your workload."
                      >
                        <template #actions>
                          <Button
                            type="button"
                            label="Add new Domain"
                            kind="secondary"
                            size="medium"
                            icon="pi pi-plus"
                            @click="openAddDomain"
                          />
                        </template>
                      </EmptyState>
                    </template>

                    <template #cell-domain="{ row }">
                      <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                        <i class="pi pi-globe text-[var(--text-muted)]" aria-hidden="true" />
                        <span class="truncate">{{ row.domain }}</span>
                      </div>
                    </template>

                    <template #cell-environment="{ value }">
                      <Tag :label="value" severity="secondary" size="medium" />
                    </template>

                    <template #cell-actions="{ row }">
                      <Dropdown
                        placement="bottom-end"
                        @select="(event, value) => onDomainAction(event, value, row)"
                      >
                        <Dropdown.Trigger>
                          <Tooltip text="Domain actions">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="outlined"
                              size="small"
                              aria-label="Domain actions"
                            />
                          </Tooltip>
                        </Dropdown.Trigger>
                        <Dropdown.Group>
                          <Dropdown.Option value="edit" label="Edit">
                            <template #left>
                              <i class="pi pi-pencil" aria-hidden="true" />
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

            <!-- Section: Environments -->
            <section class="flex flex-col gap-[var(--spacing-sm)]">
              <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                Environments
              </p>
              <CardBox :padded="false">
                <template #content>
                  <div class="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-md)]">
                    <Message
                      severity="info"
                      title="Workloads use Deployment Settings"
                      description="Deployment Settings centralize the configuration shared across your environments, including applications, firewall policies, and custom pages."
                    />
                    <Message
                      v-if="!anyLinked"
                      severity="warning"
                      title="Link Deployment Settings to enable workloads."
                    />

                    <div class="flex flex-col gap-[var(--spacing-sm)]">
                      <div
                        v-for="env in environments"
                        :key="env.name"
                        class="rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-md)]"
                      >
                        <div class="flex items-start justify-between gap-[var(--spacing-md)]">
                          <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                            <span class="text-overline-sm uppercase text-[var(--text-muted)]">
                              Environment
                            </span>
                            <span class="text-label-lg text-[var(--text-default)]">
                              {{ env.name }}
                            </span>
                          </div>

                          <!-- Unlinked: prompt to link. Linked: show the bundle. -->
                          <div class="flex shrink-0 items-center gap-[var(--spacing-sm)]">
                            <template v-if="env.linked">
                              <span class="text-label-md text-[var(--text-default)]">
                                {{ env.bundle }}
                              </span>
                              <Tag label="Linked" severity="success" size="medium" />
                              <Tooltip text="Edit deployment settings">
                                <IconButton
                                  icon="pi pi-pencil"
                                  kind="outlined"
                                  size="small"
                                  aria-label="Edit deployment settings"
                                  @click="openLink(env.name)"
                                />
                              </Tooltip>
                              <Tooltip text="Unlink deployment settings">
                                <IconButton
                                  icon="pi pi-times"
                                  kind="transparent"
                                  size="small"
                                  aria-label="Unlink deployment settings"
                                  @click="unlink(env.name)"
                                />
                              </Tooltip>
                            </template>
                            <template v-else>
                              <span class="text-body-sm text-[var(--text-muted)]">
                                Deployment Settings --
                              </span>
                              <Button
                                type="button"
                                label="Link Settings"
                                kind="outlined"
                                size="small"
                                icon="pi pi-plus"
                                @click="openLink(env.name)"
                              />
                            </template>
                          </div>
                        </div>

                        <!-- Linked resources summary -->
                        <div
                          v-if="env.linked"
                          class="mt-[var(--spacing-md)] grid grid-cols-1 gap-[var(--spacing-md)] border-t border-[var(--border-muted)] pt-[var(--spacing-md)] sm:grid-cols-3"
                        >
                          <div class="flex flex-col gap-[var(--spacing-xxs)]">
                            <span class="text-overline-sm uppercase text-[var(--text-muted)]">
                              Application
                            </span>
                            <span class="text-body-sm text-[var(--text-default)]">
                              {{ env.application.name }}
                              <span class="text-[var(--text-muted)]">{{ env.application.version }}</span>
                            </span>
                          </div>
                          <div class="flex flex-col gap-[var(--spacing-xxs)]">
                            <span class="text-overline-sm uppercase text-[var(--text-muted)]">
                              Firewall
                            </span>
                            <span class="text-body-sm text-[var(--text-default)]">
                              {{ env.firewall.name }}
                              <span class="text-[var(--text-muted)]">{{ env.firewall.version }}</span>
                            </span>
                          </div>
                          <div class="flex flex-col gap-[var(--spacing-xxs)]">
                            <span class="text-overline-sm uppercase text-[var(--text-muted)]">
                              Custom Page
                            </span>
                            <span class="text-body-sm text-[var(--text-default)]">
                              {{ env.customPage.name }}
                              <span class="text-[var(--text-muted)]">{{ env.customPage.version }}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </CardBox>
            </section>
          </fieldset>
        </div>

        <!-- Sticky action bar: Cancel · Save as Draft · Save and Deploy. -->
        <footer
          class="sticky bottom-0 border-t-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]"
        >
          <div
            class="flex w-full items-center justify-end gap-[var(--spacing-sm)] p-[var(--spacing-lg)]"
          >
            <Button
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="cancel"
            />
            <Button
              type="button"
              label="Save as Draft"
              kind="secondary"
              size="medium"
              :disabled="submitting"
              @click="saveDraft"
            />
            <Button
              label="Save and Deploy"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="saveAndDeploy"
            />
            <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">
              Save and Deploy
            </button>
          </div>
        </footer>
      </form>
    </main>

    <!-- Sub-drawers -->
    <AddDomainDrawer v-model:open="addDomainOpen" @save="onDomainSaved" />
    <LinkDeploymentSettingsDrawer
      v-model:open="linkOpen"
      :environment="linkEnvironment"
      @link="onSettingsLinked"
    />
  </div>
</template>
