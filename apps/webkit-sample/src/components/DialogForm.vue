<script setup>
// Form type: DIALOG form (the `/form` skill, "Form types"). A short, blocking
// decision — here a destructive delete guarded by a typed confirmation. Few fields,
// a single confirm action (Approach B). Delete stays disabled until the exact
// phrase is typed (error prevention, not a toast); the async delete locks the
// action off one `submitting` flag and reports via toast (the /usability contract).
import Button from "@aziontech/webkit/button";
import Dialog from "@aziontech/webkit/dialog";
import DialogClose from "@aziontech/webkit/dialog-close";
import DialogContent from "@aziontech/webkit/dialog-content";
import DialogOverlay from "@aziontech/webkit/dialog-overlay";
import DialogPortal from "@aziontech/webkit/dialog-portal";
import DialogTitle from "@aziontech/webkit/dialog-title";
import DialogTrigger from "@aziontech/webkit/dialog-trigger";
import FieldText from "@aziontech/webkit/field-text";
import Item from "@aziontech/webkit/item";
import Message from "@aziontech/webkit/message";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import { toast } from "@aziontech/webkit/toast";
import { computed, ref, watch } from "vue";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

// The application this dialog would delete.
const application = { name: "webkit-storybook-dev" };

const open = ref(false);
const confirmation = ref("");
const submitting = ref(false);

// The destructive action is gated on an exact-match confirmation.
const canDelete = computed(() => confirmation.value.trim() === application.name);
const confirmLabel = computed(
  () => `To confirm, type "${application.name}" in the box below:`,
);

// Reset the confirmation field whenever the dialog closes.
watch(open, (isOpen) => {
  if (!isOpen) confirmation.value = "";
});

const remove = async () => {
  if (!canDelete.value || submitting.value) return;
  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    toastDeleted();
    open.value = false; // watch() clears the field
  } catch (error) {
    toastFailed(error);
  } finally {
    submitting.value = false;
  }
};

// Split out so the template stays lean; both go through @aziontech/webkit/toast.
const toastDeleted = () => toast.success(`Application "${application.name}" deleted.`);
const toastFailed = (error) =>
  toast.error("Could not delete the application.", {
    description: error?.message ?? "Check your connection and try again.",
    action: { label: "Retry", onClick: () => remove() },
  });
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'Dialog form' }]"
  >
    <main class="flex h-full flex-col gap-[var(--spacing-lg)]">
      <PageHeading
        title="Dialog form"
        description="A short, blocking decision in a modal. This destructive delete stays disabled until the exact application name is typed."
      />

      <!-- The trigger context: an outlined item with the delete action. -->
      <Item kind="outline">
        <Item.Content>
          <Item.Title>Delete this Application</Item.Title>
          <Item.Description>
            Permanently removes
            <span class="font-code">{{ application.name }}</span> and all associated
            settings. This cannot be undone.
          </Item.Description>
        </Item.Content>

        <Item.Actions class="flex-1 justify-end">
          <Dialog v-model:open="open" size="medium">
            <DialogTrigger>
              <Button label="Delete Application" kind="danger" size="medium" icon="pi pi-trash" />
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <PanelHeader class="w-full">
                  <DialogTitle>Delete Application</DialogTitle>
                  <DialogClose />
                </PanelHeader>

                <!-- compact modal body: blocks --spacing-md apart -->
                <PanelContent class="flex flex-col gap-[var(--spacing-md)]">
                  <Message
                    severity="warning"
                    title="Once confirmed, this action can't be reversed."
                    description="The selected Application will be deleted, along with all associated settings or instances. Check the Help Center for more details."
                  />
                  <FieldText
                    v-model="confirmation"
                    input-id="confirm-delete"
                    :label="confirmLabel"
                    :disabled="submitting"
                  />
                </PanelContent>

                <PanelFooter class="flex-col md:flex-row md:justify-end">
                  <Button
                    class="w-full md:w-auto"
                    type="button"
                    label="Cancel"
                    kind="outlined"
                    size="medium"
                    :disabled="submitting"
                    @click="open = false"
                  />
                  <Button
                    class="w-full md:w-auto"
                    label="Delete"
                    kind="danger"
                    size="medium"
                    :disabled="!canDelete"
                    :loading="submitting"
                    @click="remove"
                  />
                </PanelFooter>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </Item.Actions>
      </Item>
    </main>
  </AppLayout>
</template>
