<script setup>
// The Personal Tokens module — the LIST that anchors the token flow, now with an
// inline create DRAWER (List → Creation → Back to list, all on one page). Built
// on @aziontech/webkit per /ui-craft.
//
// Create is a medium Drawer whose body is Cards + ItemGroups (the /form skill,
// Approach A): two flush CardBoxes (General, Token), each an Item.List where the
// Item.Title IS the label, guidance is Item.Description, and the control sits on
// the right in Item.Actions with an aria-label. Validation runs on submit only;
// with no <Label>, the feedback is a HelperText under the control (amber
// `required` — required is NOT an error). One `submitting` flag locks the whole
// drawer scope (fieldset :disabled + Save :loading) per /usability.
//
// The generated token is shown ONCE, in a Dialog after the drawer closes: a
// warning Message, the token in a readonly reveal field (FieldPassword's built-in
// visibility toggle), a Copy action, and Confirm. Closing it is terminal — the
// plaintext can't be retrieved again; only the new row remains in the list.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import CopyButton from "@aziontech/webkit/copy-button";
import Dialog from "@aziontech/webkit/dialog";
import DialogClose from "@aziontech/webkit/dialog-close";
import DialogContent from "@aziontech/webkit/dialog-content";
import DialogDescription from "@aziontech/webkit/dialog-description";
import DialogOverlay from "@aziontech/webkit/dialog-overlay";
import DialogPortal from "@aziontech/webkit/dialog-portal";
import DialogTitle from "@aziontech/webkit/dialog-title";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import Dropdown from "@aziontech/webkit/dropdown";
import FieldPassword from "@aziontech/webkit/field-password";
import HelperText from "@aziontech/webkit/helper-text";
import IconButton from "@aziontech/webkit/icon-button";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Label from "@aziontech/webkit/label";
import Message from "@aziontech/webkit/message";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import Select from "@aziontech/webkit/select";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import Textarea from "@aziontech/webkit/textarea";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// Seeded tokens — a personal token's plaintext is shown only once at creation,
// so the list never stores it; it tracks identity, lifecycle, and status.
const tokens = ref([
  {
    id: "pt-1",
    name: "CLI local",
    description: "Local development machine",
    created: "June 02, 2026",
    expires: "September 02, 2026",
    lastUsed: "2 hours ago",
    status: "Active",
  },
  {
    id: "pt-2",
    name: "CI / CD Pipeline",
    description: "GitHub Actions deploy token",
    created: "May 18, 2026",
    expires: "August 18, 2026",
    lastUsed: "Yesterday",
    status: "Active",
  },
  {
    id: "pt-3",
    name: "Terraform provider",
    description: "Infrastructure automation",
    created: "March 09, 2026",
    expires: "March 09, 2026",
    lastUsed: "1 month ago",
    status: "Expired",
  },
  {
    id: "pt-4",
    name: "Legacy script",
    description: "Retired nightly export",
    created: "November 21, 2025",
    expires: "February 21, 2026",
    lastUsed: "5 months ago",
    status: "Revoked",
  },
]);

const columns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true },
  { accessorKey: "description", header: "Description", grow: 2 },
  { accessorKey: "created", header: "Created", enableSorting: true },
  { accessorKey: "expires", header: "Expires", enableSorting: true },
  { accessorKey: "lastUsed", header: "Last Used" },
  { accessorKey: "status", header: "Status" },
  { id: "actions", kind: "action", hideable: false },
];

const statusSeverity = (status) =>
  ({ Active: "success", Expired: "warning", Revoked: "danger" })[status] ??
  "secondary";

const onTokenAction = (event, value, row) => {
  if (value === "revoke") {
    tokens.value = tokens.value.map((token) =>
      token.id === row.id ? { ...token, status: "Revoked" } : token,
    );
    toast.success(`Personal token "${row.name}" revoked.`);
    return;
  }
  if (value === "delete") {
    tokens.value = tokens.value.filter((token) => token.id !== row.id);
    toast.success(`Personal token "${row.name}" deleted.`);
    return;
  }
  toast.info(row.name, { description: row.description });
};

// --- Create Drawer state -------------------------------------------------
// Suggested expiration ranges. The token is only available right after it's
// created, so a short default (1 day) is the safe pick.
const expiryOptions = [
  { label: "1 day", value: "1d", days: 1 },
  { label: "7 days", value: "7d", days: 7 },
  { label: "15 days", value: "15d", days: 15 },
  { label: "30 days", value: "30d", days: 30 },
  { label: "60 days", value: "60d", days: 60 },
  { label: "90 days", value: "90d", days: 90 },
  { label: "1 year", value: "1y", days: 365 },
];
const expiryLabel = (value) =>
  expiryOptions.find((option) => option.value === value)?.label ?? "";

const drawerOpen = ref(false);

const form = reactive({
  name: "",
  description: "",
  expiresWithin: "1d", // preselected — Expires within is required but never empty
});

// Per-field error messages. Empty string = valid. Populated only by validate().
const errors = reactive({ name: "" });

// One flag locks the whole drawer scope while the create request is in flight.
const submitting = ref(false);

const openCreate = () => {
  drawerOpen.value = true;
};

// Reset the form + errors whenever the drawer closes (cancel, overlay, Escape,
// or a successful create) so the next open is pristine.
watch(drawerOpen, (open) => {
  if (open) return;
  form.name = "";
  form.description = "";
  form.expiresWithin = "1d";
  errors.name = "";
});

const cancel = () => {
  drawerOpen.value = false;
};

const validate = () => {
  errors.name = form.name.trim() ? "" : "This field is required.";
  return !errors.name;
};

// --- The generated token, shown once in the dialog ----------------------
const dialogOpen = ref(false);
const generatedToken = ref("");

// A realistic, one-time token value. crypto is preferred; a zero-fill fallback
// keeps the demo working where it's unavailable.
const generateToken = () => {
  const bytes = new Uint8Array(30);
  globalThis.crypto?.getRandomValues?.(bytes);
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `azion_pat_${hex}`;
};

const formatDate = (date) =>
  date.toLocaleString("en-US", { month: "long", day: "2-digit", year: "numeric" });

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock

  // Validation feedback is the field's own amber state + its HelperText.
  if (!validate()) return;

  // Lock the scope off one flag (usability Pattern 1): Save shows :loading and
  // every field is :disabled while the request is in flight.
  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const now = new Date();
    const days =
      expiryOptions.find((option) => option.value === form.expiresWithin)?.days ?? 1;
    // The new row joins the list immediately; only the plaintext is one-time.
    tokens.value = [
      {
        id: `pt-${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim() || "—",
        created: formatDate(now),
        expires: formatDate(new Date(now.getTime() + days * 86400000)),
        lastUsed: "Never",
        status: "Active",
      },
      ...tokens.value,
    ];

    generatedToken.value = generateToken();
    drawerOpen.value = false; // close the drawer (watch resets the form)
    dialogOpen.value = true; // reveal the token once
    toast.success(`Personal token "${form.name.trim()}" created.`);
  } catch (error) {
    // Request-level failure → toast with a way to recover. Never silent.
    toast.error("Could not create the personal token.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false; // release on success AND failure
  }
};

// CopyButton owns the clipboard write + copied state; we just acknowledge it.
const onTokenCopied = () => toast.success("Personal token copied to clipboard.");

// Closing the dialog is terminal: the plaintext can't be shown again, so clear it.
watch(dialogOpen, (open) => {
  if (!open) generatedToken.value = "";
});
</script>

<template>
  <AppLayout :breadcrumb="[{ label: 'Personal Tokens' }]">
    <main class="flex h-full flex-col gap-[var(--spacing-lg)]">
      <PageHeading
        title="Personal Tokens"
        description="Personal tokens securely access your account via API. Create one, then copy it — it's shown only once."
      >
        <template #actions>
          <Button
            label="Create Personal Token"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="openCreate"
          />
        </template>
      </PageHeading>

      <section class="flex min-h-0 flex-col">
        <CardBox :padded="false">
          <template #content>
        <Table
          :data="tokens"
          :columns="columns"
          row-key="id"
          enable-sorting
          :border="false"
        >
          <template #toolbar>
            <div class="flex w-full items-center gap-[var(--spacing-xs)]">
              <Table.Search
                size="large"
                placeholder="Search personal tokens..."
                class="flex-1"
              />
            </div>
          </template>

          <template #cell-status="{ value }">
            <Tag :label="value" :severity="statusSeverity(value)" size="medium" />
          </template>

          <template #cell-actions="{ row }">
            <Dropdown
              placement="bottom-end"
              @select="(event, value) => onTokenAction(event, value, row)"
            >
              <Dropdown.Trigger>
                <Tooltip text="Token actions">
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="outlined"
                    size="small"
                    aria-label="Token actions"
                  />
                </Tooltip>
              </Dropdown.Trigger>
              <Dropdown.Group>
                <Dropdown.Option value="view" label="View details" />
              </Dropdown.Group>
              <Dropdown.Group>
                <Dropdown.Option value="revoke" label="Revoke">
                  <template #left>
                    <i class="pi pi-ban" aria-hidden="true" />
                  </template>
                </Dropdown.Option>
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

    <!-- Create flow — a medium Drawer. Body is Cards + ItemGroups: two flush
         CardBoxes (General, Token), each an Item.List with divided rows. -->
    <Drawer v-model:open="drawerOpen" size="large" side="right">
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <!-- One native form owns the scope: the sr-only submit gives real
               Enter-to-submit; the fieldset locks every field while in flight. -->
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Personal Token"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                <DrawerTitle>Create Personal Token</DrawerTitle>
                <p class="text-body-sm text-[var(--text-muted)]">
                  Create a personal token to securely access your account via API.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Create personal token</legend>

                <!-- Section: General -->
                <section class="flex flex-col gap-[var(--spacing-sm)]">
                  <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                    General
                  </p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item size="small" class="items-start">
                          <Item.Content>
                            <Item.Title>Name</Item.Title>
                            <Item.Description>
                              Give a unique and descriptive name to identify the
                              personal token.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <!-- No Label in an ItemGroup → the validation message is
                                 a HelperText under the control; empty-required is
                                 amber (required is NOT an error). -->
                            <div class="flex w-full max-w-[var(--container-xs)] flex-col gap-[var(--spacing-xs)]">
                              <InputText
                                v-model="form.name"
                                size="large"
                                class="w-full"
                                aria-label="Name"
                                :disabled="submitting"
                                :required="!!errors.name"
                                :aria-describedby="errors.name ? 'pt-name-error' : undefined"
                                @update:model-value="errors.name = ''"
                              />
                              <HelperText
                                v-if="errors.name"
                                id="pt-name-error"
                                kind="required"
                                :label="errors.name"
                              />
                            </div>
                          </Item.Actions>
                        </Item>

                        <Item size="small" class="items-start">
                          <Item.Content>
                            <Item.Title>Description</Item.Title>
                            <Item.Description>
                              Include a description to specify the token's purpose or
                              usage.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <Textarea
                              v-model="form.description"
                              class="w-full max-w-[var(--container-xs)]"
                              aria-label="Description"
                              :disabled="submitting"
                            />
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>

                <!-- Section: Token -->
                <section class="flex flex-col gap-[var(--spacing-sm)]">
                  <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                    Token
                  </p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item size="small" class="items-start">
                          <Item.Content>
                            <Item.Title>Expires within</Item.Title>
                            <Item.Description>
                              Define the token expiration by selecting a suggested
                              range. For security, the token is only available right
                              after it's created.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <Select
                              v-model="form.expiresWithin"
                              size="large"
                              class="w-full max-w-[var(--container-xs)]"
                              :disabled="submitting"
                              :display-value="expiryLabel"
                            >
                              <Select.Trigger aria-label="Expires within" />
                              <!-- TEMPORARY WORKAROUND (webkit bug): Select.Content
                                   teleports to body at z-50 but the drawer panel is
                                   z-[1001], so the dropdown renders behind it. Lift
                                   it above the panel until the fix lands. -->
                              <Select.Content class="!z-[1002]">
                                <Select.Option
                                  v-for="option in expiryOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>
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
              <!-- webkit Button hardcodes type="button" and doesn't forward a type,
                   so drive submit from its click; the sr-only submit gives Enter. -->
              <Button
                class="w-full md:w-auto"
                label="Create"
                kind="primary"
                size="medium"
                :loading="submitting"
                @click="submit"
              />
              <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">
                Create
              </button>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <!-- One-time token reveal. Closing the dialog is terminal (watch clears it). -->
    <Dialog v-model:open="dialogOpen" size="medium">
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <DialogTitle>Personal Token has been created</DialogTitle>
            <DialogClose />
          </PanelHeader>

          <PanelContent class="flex flex-col gap-[var(--spacing-md)]">
            <DialogDescription class="sr-only">
              Copy and store your new personal token. It won't be shown again.
            </DialogDescription>

            <Message
              severity="warning"
              title="This token will only be displayed once."
              description="Make sure to copy and store it safely before closing this dialog."
            />

            <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
              <Label for="pt-token">Personal Token</Label>
              <FieldPassword
                input-id="pt-token"
                :model-value="generatedToken"
                readonly
                helper-text="Once the dialog is closed, the token cannot be retrieved. It'll be necessary to generate a new one."
              />
            </div>

            <div class="flex justify-end">
              <CopyButton
                :value="generatedToken"
                kind="outlined"
                size="large"
                aria-label="Copy personal token"
                @copy="onTokenCopied"
              />
            </div>
          </PanelContent>

          <PanelFooter class="justify-end">
            <Button label="Confirm" kind="primary" size="medium" @click="dialogOpen = false" />
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </AppLayout>
</template>
