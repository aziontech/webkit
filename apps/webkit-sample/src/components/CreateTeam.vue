<script setup>
// Create / Edit Team — a focused PAGE (routes /teams/new and /teams/:id) for a
// team and its permission set. Same route serves both: with an :id it hydrates
// from the shared teams.js store (edit); without, it starts empty (create).
//
// Layout follows the console's focused create flow (sidebar hidden, sticky
// footer): a two-column "General" CardBox (name / description / status), then a
// full-width "Permissions" CardBox holding the Vercel-style selector — each
// product area is a table section whose rows are resources and whose right-hand
// columns are View / Edit checkboxes. A resource that only carries a single
// action (e.g. Real-Time Purge) shows one checkbox in the column its label
// implies. A group header row select-all (tri-state) toggles the whole area.
//
// Usability: one `submitting` flag locks the scope while the (simulated) save
// runs; Name is required and the permission set must be non-empty.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Checkbox from "@aziontech/webkit/checkbox";
import FieldText from "@aziontech/webkit/field-text";
import FieldTextarea from "@aziontech/webkit/field-textarea";
import InputText from "@aziontech/webkit/input-text";
import Label from "@aziontech/webkit/label";
import Message from "@aziontech/webkit/message";
import Switch from "@aziontech/webkit/switch";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  allPermissionIds,
  permissionGroups,
  resourcePermissions,
  useTeams,
} from "../teams.js";
import CreationHeader from "./ui/CreationHeader.vue";

const route = useRoute();
const router = useRouter();

const userEmail = computed(() => route.query.email || "myemail@azion.com");
// The Teams Permissions list now lives as a tab under Account Settings; the
// focused create/edit flow returns there.
const goToList = () =>
  router.push({
    path: "/account",
    query: { email: userEmail.value, tab: "teams-permissions" },
  });

// Breadcrumb crumbs carry their own query (e.g. /account?tab=teams-permissions);
// split it out and merge so the target tab is preserved alongside the email.
const onCrumb = (event, href) => {
  if (href && href !== "#") {
    const [path, queryString] = href.split("?");
    const extra = Object.fromEntries(new URLSearchParams(queryString || ""));
    router.push({ path, query: { email: userEmail.value, ...extra } });
  }
};

const { getTeam, createTeam, updateTeam, removeTeam } = useTeams();

// Edit when the route carries an :id and the team exists; otherwise create.
const editing = getTeam(route.params.id);
if (route.params.id && !editing) goToList();

const form = reactive({
  name: editing?.name ?? "",
  description: editing?.description ?? "",
  active: editing ? editing.status === "Active" : true,
});

// Selected permission ids — array so each Checkbox toggles membership directly.
const selected = ref(editing ? [...editing.permissions] : []);

const errors = reactive({ name: "", permissions: "" });
const submitting = ref(false);

// --- Permission selector helpers ----------------------------------------
// The permission that belongs in a resource's View / Edit column (or null when
// the resource has no such capability). For a single-action resource the one
// permission is routed to the column its label implies.
const columnPermission = (resource, column) => {
  const permissions = resourcePermissions(resource);
  if (resource.single) {
    const only = permissions[0];
    const implied = only.label.startsWith("View") ? "view" : "edit";
    return implied === column ? only : null;
  }
  return permissions.find((permission) => permission.action === column) ?? null;
};

const groupPermissionIds = (group) =>
  group.resources.flatMap((resource) =>
    resourcePermissions(resource).map((permission) => permission.id),
  );

// Tri-state of a group's select-all: fully / partially / not selected.
const groupChecked = (group) => {
  const ids = groupPermissionIds(group);
  return ids.every((id) => selected.value.includes(id));
};
const groupIndeterminate = (group) => {
  const ids = groupPermissionIds(group);
  const count = ids.filter((id) => selected.value.includes(id)).length;
  return count > 0 && count < ids.length;
};

const toggleGroup = (group, checked) => {
  const ids = new Set(groupPermissionIds(group));
  if (checked) {
    selected.value = [...new Set([...selected.value, ...ids])];
  } else {
    selected.value = selected.value.filter((id) => !ids.has(id));
  }
  errors.permissions = "";
};

const selectAll = () => {
  selected.value = [...allPermissionIds];
  errors.permissions = "";
};
const clearAll = () => {
  selected.value = [];
};

// --- Search filter -------------------------------------------------------
const filterText = ref("");

const matches = (resource, group) => {
  const query = filterText.value.trim().toLowerCase();
  if (!query) return true;
  if (group.label.toLowerCase().includes(query)) return true;
  return resourcePermissions(resource).some((permission) =>
    permission.label.toLowerCase().includes(query),
  );
};

const visibleGroups = computed(() =>
  permissionGroups
    .map((group) => ({
      ...group,
      resources: group.resources.filter((resource) => matches(resource, group)),
    }))
    .filter((group) => group.resources.length > 0),
);

const selectedCount = computed(() => selected.value.length);
const totalCount = allPermissionIds.length;

// --- Submit --------------------------------------------------------------
const validate = () => {
  errors.name = form.name.trim() ? "" : "This field is required.";
  errors.permissions = selected.value.length ? "" : "Select at least one permission.";
  return !errors.name && !errors.permissions;
};

const nameHelper = computed(() =>
  errors.name ? errors.name : "A short, descriptive name to identify the team.",
);

const submit = async () => {
  if (submitting.value) return;
  if (!validate()) return;

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.active ? "Active" : "Inactive",
      permissions: selected.value,
    };
    if (editing) {
      updateTeam(editing.id, payload);
      toast.success(`Team "${payload.name}" updated.`);
    } else {
      createTeam(payload);
      toast.success(`Team "${payload.name}" created.`);
    }
    goToList();
  } catch (error) {
    toast.error("Could not save the team.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false;
  }
};

// Delete is available only when editing an existing team; it removes the team
// from the store and returns to the list.
const deleteTeam = () => {
  if (!editing || submitting.value) return;
  removeTeam(editing.id);
  toast.success(`Team "${editing.name}" deleted.`);
  goToList();
};

const breadcrumb = [
  { label: "Settings", href: "/account" },
  { label: "Teams Permissions", href: "/account?tab=teams-permissions" },
  { label: editing ? "Edit" : "Create" },
];
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <CreationHeader
      :breadcrumb="breadcrumb"
      back-label="Back to Teams Permissions"
      @back="goToList"
      @navigate="onCrumb"
    />
    <main class="min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        :aria-label="editing ? 'Edit Team' : 'Create Team'"
        novalidate
        @submit.prevent="submit"
      >
      <div
        class="mx-auto flex w-full max-w-[var(--container-7xl)] flex-1 flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]"
      >
        <div class="flex flex-col gap-[var(--spacing-xxs)]">
          <h1 class="text-heading-xs text-[var(--text-default)]">
            {{ editing ? "Edit Team" : "Create Team" }}
          </h1>
          <p class="text-body-sm text-[var(--text-muted)]">
            Determine the access level of accounts and assign permissions according
            to their team. Teams can be based on the role and tasks of account users.
          </p>
        </div>

        <fieldset
          class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">Team details</legend>

          <!-- Section: General -->
          <CardBox>
            <template #content>
              <div
                class="grid grid-cols-1 gap-[var(--spacing-lg)] lg:grid-cols-2 lg:gap-[var(--spacing-xl)]"
              >
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <h2 class="text-heading-xs text-[var(--text-default)]">General</h2>
                  <p class="text-body-sm text-[var(--text-muted)]">
                    Identify the team and describe what it's responsible for.
                  </p>
                </div>

                <div class="flex flex-col gap-[var(--spacing-lg)]">
                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <Label for="team-name" required>Name</Label>
                    <FieldText
                      v-model="form.name"
                      input-id="team-name"
                      name="name"
                      size="large"
                      :required="!!errors.name"
                      :helper-text="nameHelper"
                      @update:model-value="errors.name = ''"
                    />
                  </div>

                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <Label for="team-description">Description</Label>
                    <FieldTextarea
                      v-model="form.description"
                      input-id="team-description"
                      name="description"
                      size="large"
                      helper-text="Optionally describe what this team is responsible for."
                    />
                  </div>
                </div>
              </div>
            </template>
          </CardBox>

          <!-- Section: Status -->
          <CardBox>
            <template #content>
              <div
                class="grid grid-cols-1 gap-[var(--spacing-lg)] lg:grid-cols-2 lg:gap-[var(--spacing-xl)]"
              >
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <h2 class="text-heading-xs text-[var(--text-default)]">Status</h2>
                  <p class="text-body-sm text-[var(--text-muted)]">
                    Control whether this team can be assigned to accounts.
                  </p>
                </div>

                <div class="flex items-start justify-between gap-[var(--spacing-md)]">
                  <div class="flex flex-col">
                    <Label for="team-active">Active</Label>
                    <span class="text-body-sm text-[var(--text-muted)]">
                      Inactive teams keep their permissions but can't be assigned.
                    </span>
                  </div>
                  <Switch id="team-active" v-model="form.active" />
                </div>
              </div>
            </template>
          </CardBox>

          <!-- Section: Permissions — the Vercel-style selector -->
          <CardBox>
            <template #content>
              <div class="flex flex-col gap-[var(--spacing-md)]">
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <h2 class="text-heading-xs text-[var(--text-default)]">Permissions</h2>
                  <p class="text-body-sm text-[var(--text-muted)]">
                    {{ selectedCount }} of {{ totalCount }} permissions selected.
                  </p>
                </div>

                <div class="flex flex-wrap items-center gap-[var(--spacing-xs)]">
                  <InputText
                    v-model="filterText"
                    size="large"
                    placeholder="Filter permissions..."
                    aria-label="Filter permissions"
                    class="min-w-[var(--container-2xs)] flex-1"
                  >
                    <template #iconLeft>
                      <i class="pi pi-search" aria-hidden="true" />
                    </template>
                  </InputText>
                  <Button
                    type="button"
                    label="Select all"
                    kind="outlined"
                    size="large"
                    @click="selectAll"
                  />
                  <Button
                    type="button"
                    label="Clear"
                    kind="text"
                    size="large"
                    @click="clearAll"
                  />
                </div>

                <Message
                  v-if="errors.permissions"
                  severity="danger"
                  :title="errors.permissions"
                />

                <div
                  class="overflow-hidden rounded-[var(--shape-elements)] border-[length:var(--border-width-default)] border-[var(--border-muted)]"
                >
                  <div
                    v-for="group in visibleGroups"
                    :key="group.label"
                    class="border-b-[length:var(--border-width-default)] border-[var(--border-muted)] last:border-b-0"
                  >
                    <!-- Group header: select-all + name on the left, column
                         headers on the right. -->
                    <div
                      class="flex items-center gap-[var(--spacing-sm)] bg-[var(--bg-surface-raised)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
                    >
                      <Checkbox
                        binary
                        :model-value="groupChecked(group)"
                        :indeterminate="groupIndeterminate(group)"
                        :aria-label="`Select all ${group.label} permissions`"
                        @update:model-value="(checked) => toggleGroup(group, checked)"
                      />
                      <span class="flex-1 text-label-md text-[var(--text-default)]">
                        {{ group.label }}
                      </span>
                      <span class="w-16 text-center text-label-code-sm text-[var(--text-muted)]">
                        View
                      </span>
                      <span class="w-16 text-center text-label-code-sm text-[var(--text-muted)]">
                        Edit
                      </span>
                    </div>

                    <!-- Resource rows -->
                    <div
                      v-for="resource in group.resources"
                      :key="resource.key"
                      class="flex items-center gap-[var(--spacing-sm)] border-t-[length:var(--border-width-default)] border-[var(--border-muted)] px-[var(--spacing-md)] py-[var(--spacing-sm)] hover:bg-[var(--bg-hover)]"
                    >
                      <span class="flex-1 pl-[var(--spacing-lg)] text-body-sm text-[var(--text-default)]">
                        {{ resource.label }}
                      </span>

                      <div class="flex w-16 justify-center">
                        <Checkbox
                          v-if="columnPermission(resource, 'view')"
                          v-model="selected"
                          :value="columnPermission(resource, 'view').id"
                          :aria-label="columnPermission(resource, 'view').label"
                        />
                      </div>
                      <div class="flex w-16 justify-center">
                        <Checkbox
                          v-if="columnPermission(resource, 'edit')"
                          v-model="selected"
                          :value="columnPermission(resource, 'edit').id"
                          :aria-label="columnPermission(resource, 'edit').label"
                        />
                      </div>
                    </div>
                  </div>

                  <p
                    v-if="!visibleGroups.length"
                    class="px-[var(--spacing-md)] py-[var(--spacing-lg)] text-center text-body-sm text-[var(--text-muted)]"
                  >
                    No permissions match "{{ filterText }}".
                  </p>
                </div>
              </div>
            </template>
          </CardBox>
        </fieldset>
      </div>

      <footer
        class="sticky bottom-0 border-t-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]"
      >
        <div
          class="mx-auto flex w-full max-w-[var(--container-7xl)] items-center gap-[var(--spacing-sm)] p-[var(--spacing-lg)]"
        >
          <Button
            v-if="editing"
            type="button"
            label="Delete team"
            kind="danger"
            size="medium"
            icon="pi pi-trash"
            :disabled="submitting"
            @click="deleteTeam"
          />
          <div class="flex flex-1 items-center justify-end gap-[var(--spacing-sm)]">
            <Button
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="goToList"
            />
            <Button
              :label="editing ? 'Save changes' : 'Create'"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
            />
          </div>
        </div>
      </footer>
      </form>
    </main>
  </div>
</template>
