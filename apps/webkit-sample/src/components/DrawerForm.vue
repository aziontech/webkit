<script setup>
// Form type: DRAWER form (the `/form` skill, "Form types"). In-context creation —
// the user stays on the list and creates a resource in a side Drawer with one
// scoped save (the drawer's primary action). Fields are stacked field-* triads
// (Approach B, a short create). Validation runs on submit; the scope locks off one
// `submitting` flag (the /usability contract); request errors toast.
import Button from "@aziontech/webkit/button";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import FieldText from "@aziontech/webkit/field-text";
import FieldTextarea from "@aziontech/webkit/field-textarea";
import HelperText from "@aziontech/webkit/helper-text";
import Label from "@aziontech/webkit/label";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import Select from "@aziontech/webkit/select";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref, watch } from "vue";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const regions = [
  { label: "US East (Washington)", value: "us-east" },
  { label: "South America (São Paulo)", value: "sa-east" },
  { label: "Europe (Frankfurt)", value: "eu-west" },
];
const regionLabel = (value) =>
  regions.find((option) => option.value === value)?.label ?? "";

// The list this drawer creates into (kept in memory for the demo).
const environments = ref([
  { id: "env-1", name: "production", region: "us-east" },
  { id: "env-2", name: "staging", region: "sa-east" },
]);

const drawerOpen = ref(false);
const form = reactive({ name: "", region: "", description: "" });
const submitted = ref(false);
const submitting = ref(false);

const nameEmpty = computed(() => !form.name.trim());
const regionEmpty = computed(() => !form.region);
const isValid = computed(() => !nameEmpty.value && !regionEmpty.value);

// Reset to a clean slate whenever the drawer closes.
watch(drawerOpen, (open) => {
  if (open) return;
  form.name = "";
  form.region = "";
  form.description = "";
  submitted.value = false;
});

const openCreate = () => {
  drawerOpen.value = true;
};

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock
  submitted.value = true; // reveal field feedback
  if (!isValid.value) return;

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    environments.value = [
      { id: `env-${Date.now()}`, name: form.name.trim(), region: form.region },
      ...environments.value,
    ];
    toast.success(`Environment "${form.name.trim()}" created.`);
    drawerOpen.value = false; // watch() resets the form
  } catch (error) {
    toast.error("Could not create the environment.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'Drawer form' }]"
  >
    <main class="flex h-full flex-col">
      <PageHeading
        title="Environments"
        description="Drawer form — create a resource in context without leaving the list. The drawer owns one scoped save."
      >
        <template #actions>
          <Button
            label="Create Environment"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="openCreate"
          />
        </template>
      </PageHeading>

      <!-- The list the drawer creates into -->
      <ul class="mt-[var(--spacing-md)] flex flex-col gap-[var(--spacing-xs)]">
        <li
          v-for="env in environments"
          :key="env.id"
          class="flex items-center justify-between rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
        >
          <span class="text-label-code-sm text-[var(--text-default)]">{{ env.name }}</span>
          <span class="text-body-xs text-[var(--text-muted)]">{{ regionLabel(env.region) }}</span>
        </li>
      </ul>
    </main>

    <!-- Drawer form — one scoped save. Enter submits via the sr-only button. -->
    <Drawer v-model:open="drawerOpen" size="medium" side="right">
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Environment"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <DrawerTitle>Create Environment</DrawerTitle>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <!-- compact modal body: fields --spacing-md apart -->
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--spacing-md)] border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Create environment</legend>

                <!-- The Label carries the required tag ALWAYS (rendered here, so
                     the wrapper gets no `label`); the field's amber :required only
                     fires on an empty submit — required is a prompt, never red. -->
                <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                  <Label for="env-name" required>Name</Label>
                  <FieldText
                    v-model="form.name"
                    input-id="env-name"
                    name="name"
                    placeholder="my-environment"
                    size="large"
                    :disabled="submitting"
                    :required="submitted && nameEmpty"
                    :helper-text="
                      submitted && nameEmpty
                        ? 'This field is required.'
                        : 'A unique, lower-case identifier for the environment.'
                    "
                  />
                </div>

                <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                  <Label for="env-region" required>Region</Label>
                  <!-- Label required ALWAYS; the empty-required Select uses
                       :required (amber semantics), never :invalid (red). Select has
                       no amber border, so the amber HelperText below carries the cue. -->
                  <Select
                    v-model="form.region"
                    size="large"
                    :disabled="submitting"
                    placeholder="Select a region"
                    :required="submitted && regionEmpty"
                    :display-value="regionLabel"
                  >
                    <Select.Trigger
                      id="env-region"
                      :aria-describedby="submitted && regionEmpty ? 'env-region-error' : undefined"
                    />
                    <!-- TEMPORARY WORKAROUND for a webkit bug: Select.Content
                         teleports to <body> at z-50, so inside the Drawer panel
                         (z-[1001]) the dropdown renders behind it and is invisible.
                         Remove this override once webkit stacks overlay popups
                         above Drawer/Dialog. -->
                    <Select.Content class="!z-[1002]">
                      <Select.Option
                        v-for="option in regions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>
                  <HelperText
                    v-if="submitted && regionEmpty"
                    id="env-region-error"
                    kind="required"
                    label="This field is required."
                  />
                </div>

                <FieldTextarea
                  v-model="form.description"
                  input-id="env-description"
                  name="description"
                  label="Description"
                  placeholder="Optional"
                  :disabled="submitting"
                  helper-text="A short note about what this environment is for."
                />
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
                @click="drawerOpen = false"
              />
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
  </AppLayout>
</template>
