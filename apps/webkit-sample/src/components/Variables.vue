<script setup>
// The Variables module — the Azion Console "Variables" list. Unlike Applications
// (whose create flow is a dedicated PAGE), Variables creates inline: the "Create
// Variable" button opens a medium Drawer whose body is a single flush CardBox
// (`:padded="false"`) wrapping an Item.List — the "Item as a Group" pattern.
// Item.List draws the dividers between rows automatically, so each field reads as
// a divided row inside one box: the field's Label + HelperText on the left
// (Item.Content), the control on the right (Item.Actions).
//
// Accessibility follows the `/form` skill (Approach A, Cards + ItemGroups) even
// though the flow is a drawer, not a page: in an ItemGroup the Item.Title IS the
// label (field name in Item.Title, guidance in Item.Description); the control
// carries an aria-label for its accessible name (no <Label for> — that's reserved
// for Fields-separated forms). Validation runs on submit only; since an ItemGroup
// has no Label (and thus no required tag), the feedback is a HelperText under the
// control carrying the message — amber `required` for an empty field (required is
// NOT an error), red `invalid` for a filled-but-malformed value — with the control's
// matching `:required`/`:invalid` state. It renders on submit and clears as the user
// edits. There is no error-summary block and no Message callout. The scope is one
// native `<form novalidate @submit.prevent>` (Enter submits via the sr-only submit);
// one `submitting` flag locks the whole scope (fieldset :disabled + Save
// :loading). Only a request-level failure toasts (with Retry) — never silent.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import CopyButton from "@aziontech/webkit/copy-button";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import Dropdown from "@aziontech/webkit/dropdown";
import HelperText from "@aziontech/webkit/helper-text";
import IconButton from "@aziontech/webkit/icon-button";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import Switch from "@aziontech/webkit/switch";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { authorAt } from "../lib/people";
import AppLayout from "./ui/AppLayout.vue";
import LastModifiedCell from "./ui/LastModifiedCell.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");
const editorName = computed(() => userEmail.value.split("@")[0]);

// --- The records that back the table (data-driven mode) -------------------
const variables = ref([
  {
    id: "v-001",
    key: "API_BASE_URL",
    value: "https://api.example.com",
    secret: false,
    lastEditor: authorAt(0).name,
    lastEditorAvatar: authorAt(0).avatar,
    lastModified: "June 28, 2026, 10:12:00 AM",
  },
  {
    id: "v-002",
    key: "STRIPE_SECRET_KEY",
    value: "sk_live_51H8sX2eZv...",
    secret: true,
    lastEditor: authorAt(1).name,
    lastEditorAvatar: authorAt(1).avatar,
    lastModified: "June 12, 2026, 04:45:00 PM",
  },
  {
    id: "v-003",
    key: "FEATURE_FLAGS",
    value: "checkout_v2,dark_mode",
    secret: false,
    lastEditor: authorAt(2).name,
    lastEditorAvatar: authorAt(2).avatar,
    lastModified: "May 30, 2026, 09:05:00 AM",
  },
  {
    id: "v-004",
    key: "DATABASE_PASSWORD",
    value: "p4ssw0rd-r0t4t3d",
    secret: true,
    lastEditor: authorAt(3).name,
    lastEditorAvatar: authorAt(3).avatar,
    lastModified: "May 18, 2026, 02:20:00 PM",
  },
  {
    id: "v-005",
    key: "MAX_UPLOAD_MB",
    value: "25",
    secret: false,
    lastEditor: authorAt(4).name,
    lastEditorAvatar: authorAt(4).avatar,
    lastModified: "April 22, 2026, 11:38:00 AM",
  },
]);

// Column model. `key` is the principal (emphasized) column; the trailing
// `actions` column (kind: 'action') auto-pins to the right edge.
const columns = [
  { accessorKey: "key", header: "Key", enableSorting: true, principal: true },
  { accessorKey: "value", header: "Value", grow: 2 },
  { accessorKey: "secret", header: "Type", enableSorting: true },
  { accessorKey: "lastModified", header: "Last Modified", enableSorting: true, grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];

const filterFields = [
  { id: "key", label: "Key", type: "text" },
  { id: "lastEditor", label: "Last Editor", type: "text" },
];

// Secret values are masked in the list — never render a stored secret in plain
// text once saved (mirrors the console).
const displayValue = (row) => (row.secret ? "••••••••••••" : row.value);

// --- Create Drawer state -------------------------------------------------
const drawerOpen = ref(false);

const form = reactive({
  key: "",
  value: "",
  secret: false,
});

// Per-field error messages. Empty string = valid.
const errors = reactive({
  key: "",
  value: "",
});

// One flag locks the whole drawer scope while the request is in flight.
const submitting = ref(false);

// Opening the drawer starts from a clean slate.
const openCreate = () => {
  drawerOpen.value = true;
};

// Reset the form + errors whenever the drawer closes (cancel, overlay, Escape,
// or a successful create) so the next open is pristine.
watch(drawerOpen, (open) => {
  if (open) return;
  form.key = "";
  form.value = "";
  form.secret = false;
  errors.key = "";
  errors.value = "";
});

// Keys accept only upper-case letters, numbers, and underscore.
const KEY_PATTERN = /^[A-Z0-9_]+$/;

const validate = () => {
  const key = form.key.trim();
  if (!key) errors.key = "Key is required.";
  else if (!KEY_PATTERN.test(key))
    errors.key = "Use upper-case letters, numbers, and underscore only.";
  else errors.key = "";

  errors.value = form.value.trim() ? "" : "Value is required.";

  return !errors.key && !errors.value;
};

const cancel = () => {
  drawerOpen.value = false;
};

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock

  // Validation feedback is now on the fields themselves (required + :invalid).
  if (!validate()) return;

  // Lock the scope off one flag: Save shows :loading and every field is
  // :disabled while the create request is in flight.
  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    variables.value = [
      {
        id: `v-${Date.now()}`,
        key: form.key.trim(),
        value: form.value,
        secret: form.secret,
        lastEditor: editorName.value,
        lastModified: new Date().toLocaleString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
      ...variables.value,
    ];
    toast.success(`Variable "${form.key.trim()}" created.`);
    drawerOpen.value = false; // watch() resets the form
  } catch (error) {
    // Request-level failure → toast with a way to recover. Never silent.
    toast.error("Could not create the variable.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false; // release on success AND failure
  }
};

const onRowAction = (event, value, row) => {
  if (value === "delete") {
    variables.value = variables.value.filter((item) => item.id !== row.id);
    toast.success(`${row.key} deleted`);
    return;
  }
  const copy = {
    edit: `Editing ${row.key}`,
    duplicate: `Duplicating ${row.key}`,
  };
  toast.info(copy[value] ?? row.key, { description: `Variable ${row.id}` });
};
</script>

<template>
  <AppLayout active="variables" :breadcrumb="[{ label: 'Variables' }]">
    <main class="flex h-full flex-col gap-[var(--spacing-lg)]">
      <!-- Module intro + primary action -->
      <PageHeading
        title="Variables"
        description="Configure variable names, values, and settings for use across Azion's products."
      >
        <template #actions>
          <Button
            label="Create Variable"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="openCreate"
          />
        </template>
      </PageHeading>

      <!-- Variables table -->
      <section class="flex min-h-0 flex-col">
        <CardBox :padded="false">
          <template #content>
        <Table
          :data="variables"
          :columns="columns"
          :filter-fields="filterFields"
          row-key="id"
          enable-sorting
          paginated
          :page-size="10"
          :border="false"
        >
          <template #toolbar>
            <div class="flex w-full items-center gap-[var(--spacing-xs)]">
              <Table.Filter :fields="filterFields" />
              <Table.Search size="large" placeholder="Search..." class="flex-1" />
              <Table.RefreshButton />
              <Table.ColumnSelector />
            </div>
          </template>

          <template #filters>
            <Table.AppliedFilters />
          </template>

          <template #cell-key="{ value }">
            <span class="text-label-code-sm">{{ value }}</span>
          </template>

          <template #cell-value="{ row }">
            <div class="flex w-full min-w-0 items-center gap-[var(--spacing-xs)]">
              <span class="truncate text-code-label-sm text-[var(--text-muted)]">
                {{ displayValue(row) }}
              </span>
              <CopyButton
                v-if="!row.secret"
                kind="outlined"
                :value="row.value"
                aria-label="Copy value"
                class="ml-auto shrink-0"
              />
            </div>
          </template>

          <template #cell-lastModified="{ value, row }">
            <LastModifiedCell :author="row.lastEditor" :avatar-src="row.lastEditorAvatar" :date="value" />
          </template>

          <template #cell-secret="{ value }">
            <Tag
              :label="value ? 'Secret' : 'Variable'"
              :severity="value ? 'warning' : 'secondary'"
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

    <!-- Create flow — a medium Drawer. Body is one flush CardBox + Item.List
         (the "Item as a Group" pattern); Item.List draws the row dividers. -->
    <Drawer v-model:open="drawerOpen" size="large" side="right">
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <!-- One native form owns the scope: Enter submits (via the sr-only
               submit control, since the styled Button can't be type=submit), the
               fieldset locks every field while the request is in flight. -->
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Variable"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                <DrawerTitle>Create Variable</DrawerTitle>
                <p class="text-body-sm text-[var(--text-muted)]">
                  Create environment variables or secrets to use with configured
                  Functions.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--spacing-md)] border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Create variable</legend>

                <CardBox :padded="false">
                  <template #content>
                    <Item.List>
                      <Item size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>Key</Item.Title>
                          <Item.Description>
                            Give a name or identifier for the variable. Accepts
                            upper-case letters, numbers, and underscore.
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <!-- No Label in an ItemGroup, so the validation message
                               is a HelperText under the control (--spacing-xs
                               apart); it appears on a failed submit and clears as
                               the user edits. Empty → required (amber); filled but
                               malformed → invalid (red). Required is NOT an error. -->
                          <div class="flex w-full max-w-[var(--container-xs)] flex-col gap-[var(--spacing-xs)]">
                            <InputText
                              v-model="form.key"
                              size="large"
                              class="w-full font-code"
                              aria-label="Key"
                              placeholder="VARIABLE_KEY_NAME"
                              :required="!!errors.key && !form.key.trim()"
                              :invalid="!!errors.key && !!form.key.trim()"
                              :aria-describedby="errors.key ? 'variable-key-error' : undefined"
                              @update:model-value="errors.key = ''"
                            />
                            <HelperText
                              v-if="errors.key"
                              id="variable-key-error"
                              :kind="form.key.trim() ? 'invalid' : 'required'"
                              :label="errors.key"
                            />
                          </div>
                        </Item.Actions>
                      </Item>

                      <Item size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>Value</Item.Title>
                          <Item.Description>
                            Enter the data associated with the variable key.
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <!-- Value is required-only (empty → amber required). -->
                          <div class="flex w-full max-w-[var(--container-xs)] flex-col gap-[var(--spacing-xs)]">
                            <InputText
                              v-model="form.value"
                              size="large"
                              class="w-full font-code"
                              aria-label="Value"
                              placeholder="VARIABLE_VALUE"
                              :required="!!errors.value"
                              :aria-describedby="errors.value ? 'variable-value-error' : undefined"
                              @update:model-value="errors.value = ''"
                            />
                            <HelperText
                              v-if="errors.value"
                              id="variable-value-error"
                              kind="required"
                              :label="errors.value"
                            />
                          </div>
                        </Item.Actions>
                      </Item>

                      <Item size="small">
                        <Item.Content>
                          <Item.Title>Secret</Item.Title>
                          <Item.Description>
                            Store the value encrypted and masked. Its behavior can't
                            be edited once saved.
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Switch
                            v-model="form.secret"
                            aria-label="Secret"
                          />
                        </Item.Actions>
                      </Item>
                    </Item.List>
                  </template>
                </CardBox>
              </fieldset>
            </PanelContent>

            <PanelFooter class="flex-col md:flex-row md:justify-end">
              <Button
                class="w-full md:w-auto"
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
                :disabled="submitting"
                @click="cancel"
              />
              <!-- webkit Button hardcodes type="button" and doesn't forward a
                   type, so drive submit from its click; the sr-only submit below
                   gives the form real Enter-to-submit. -->
              <Button
                class="w-full md:w-auto"
                label="Save"
                kind="primary"
                size="medium"
                :loading="submitting"
                @click="submit"
              />
              <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">
                Save
              </button>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </AppLayout>
</template>
