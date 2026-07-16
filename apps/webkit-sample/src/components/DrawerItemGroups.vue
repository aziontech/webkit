<script setup>
// Form type: DRAWER + MULTIPLE ITEMGROUPS (the `/form` skill, "Form types"). A
// drawer create whose body is NOT one group (that's Variables.vue) nor stacked
// field-* triads (that's DrawerForm.vue), but SEVERAL section-titled ItemGroup
// SECTIONS — the Account Settings layout (Approach A: each section a flush CardBox
// wrapping an Item.List), hosted in a Drawer instead of a page. It is still ONE
// logical create, so it has ONE scoped save (the drawer's primary action) — the
// sections group the topic, not the save.
//
// Accessibility follows /form Approach A even in a drawer: the section title is an
// section title above a header-less flush CardBox; in an ItemGroup the Item.Title IS the
// label (guidance in Item.Description), and each control carries an aria-label (no
// <Label for>). Validation runs on submit only; with no Label (so no required tag),
// feedback is a HelperText under the control — amber `required` for an empty field
// (required is NOT an error), red `invalid` for a filled-but-malformed value — plus
// the control's matching state, cleared as the user edits — no error-summary, no
// Message callout. The
// scope is one native `<form novalidate @submit.prevent>` (Enter submits via the
// sr-only submit); one `submitting` flag locks the whole scope (fieldset :disabled +
// every control :disabled + Save :loading, the /usability contract). Only a
// request-level failure toasts (with Retry).
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import HelperText from "@aziontech/webkit/helper-text";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import Select from "@aziontech/webkit/select";
import Switch from "@aziontech/webkit/switch";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref, watch } from "vue";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const runtimes = [
  { label: "Node.js 20", value: "node20" },
  { label: "Python 3.12", value: "python312" },
  { label: "Go 1.22", value: "go122" },
];
const runtimeLabel = (value) =>
  runtimes.find((option) => option.value === value)?.label ?? "";

const regions = [
  { label: "US East (Washington)", value: "us-east" },
  { label: "South America (São Paulo)", value: "sa-east" },
  { label: "Europe (Frankfurt)", value: "eu-west" },
];
const regionLabel = (value) =>
  regions.find((option) => option.value === value)?.label ?? "";

// The list this drawer creates into (kept in memory for the demo).
const services = ref([
  { id: "svc-1", name: "checkout-api", runtime: "node20" },
  { id: "svc-2", name: "image-resizer", runtime: "go122" },
]);

const drawerOpen = ref(false);

const form = reactive({
  name: "",
  description: "",
  runtime: "",
  region: "us-east",
  active: true,
  logging: false,
});

// Per-field error messages. Empty string = valid; populated ONLY by validate().
const errors = reactive({ name: "", runtime: "" });

// One flag locks the whole drawer scope while the request is in flight.
const submitting = ref(false);

const openCreate = () => {
  drawerOpen.value = true;
};

// Reset the form + errors whenever the drawer closes (cancel, overlay, Escape, or a
// successful create) so the next open is pristine.
watch(drawerOpen, (open) => {
  if (open) return;
  form.name = "";
  form.description = "";
  form.runtime = "";
  form.region = "us-east";
  form.active = true;
  form.logging = false;
  errors.name = "";
  errors.runtime = "";
});

const NAME_PATTERN = /^[a-z0-9-]+$/;

const validate = () => {
  const name = form.name.trim();
  if (!name) errors.name = "Name is required.";
  else if (!NAME_PATTERN.test(name))
    errors.name = "Use lower-case letters, numbers, and hyphen only.";
  else errors.name = "";

  errors.runtime = form.runtime ? "" : "Runtime is required.";

  return !errors.name && !errors.runtime;
};

const cancel = () => {
  drawerOpen.value = false;
};

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock
  if (!validate()) return; // feedback is now on the fields (:invalid)

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    services.value = [
      { id: `svc-${Date.now()}`, name: form.name.trim(), runtime: form.runtime },
      ...services.value,
    ];
    toast.success(`Service "${form.name.trim()}" created.`);
    drawerOpen.value = false; // watch() resets the form
  } catch (error) {
    toast.error("Could not create the service.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false; // release on success AND failure
  }
};
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'ItemGroups in a Drawer' }]"
  >
    <main class="flex h-full flex-col">
      <PageHeading
        title="Services"
        description="Drawer create whose body is several section-titled ItemGroup sections — the settings layout, in context, with one scoped save."
      >
        <template #actions>
          <Button
            label="Create Service"
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
          v-for="service in services"
          :key="service.id"
          class="flex items-center justify-between rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
        >
          <span class="font-code text-label-sm text-[var(--text-default)]">{{ service.name }}</span>
          <span class="text-body-xs text-[var(--text-muted)]">{{ runtimeLabel(service.runtime) }}</span>
        </li>
      </ul>
    </main>

    <!-- Create flow — a large Drawer whose body is several ItemGroup sections
         (section title + flush CardBox + Item.List), all committed by one scoped save. -->
    <Drawer v-model:open="drawerOpen" size="large" side="right">
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <!-- One native form owns the scope: Enter submits (via the sr-only submit,
               since the styled Button can't be type=submit); the fieldset + per-control
               :disabled lock every field while the request is in flight. -->
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Service"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                <DrawerTitle>Create Service</DrawerTitle>
                <p class="text-body-sm text-[var(--text-muted)]">
                  Define a service across grouped sections — all saved together.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <!-- Sections are --spacing-lg apart; each section title sits --spacing-sm
                   above its flush CardBox (the Approach A section rhythm). -->
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Create service</legend>

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
                              A unique identifier. Lower-case letters, numbers, and hyphen.
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
                                v-model="form.name"
                                size="large"
                                :disabled="submitting"
                                class="w-full font-code"
                                aria-label="Name"
                                placeholder="my-service"
                                :required="!!errors.name && !form.name.trim()"
                                :invalid="!!errors.name && !!form.name.trim()"
                                :aria-describedby="errors.name ? 'service-name-error' : undefined"
                                @update:model-value="errors.name = ''"
                              />
                              <HelperText
                                v-if="errors.name"
                                id="service-name-error"
                                :kind="form.name.trim() ? 'invalid' : 'required'"
                                :value="errors.name"
                              />
                            </div>
                          </Item.Actions>
                        </Item>

                        <Item size="small" class="items-start">
                          <Item.Content>
                            <Item.Title>Description</Item.Title>
                            <Item.Description>
                              A short note about what this service does.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <InputText
                              v-model="form.description"
                              size="large"
                              :disabled="submitting"
                              class="w-full max-w-[var(--container-xs)]"
                              aria-label="Description"
                              placeholder="Optional"
                            />
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>

                <!-- Section: Runtime -->
                <section class="flex flex-col gap-[var(--spacing-sm)]">
                  <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                    Runtime
                  </p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item size="small" class="items-start">
                          <Item.Content>
                            <Item.Title>Runtime</Item.Title>
                            <Item.Description>The language the service runs on.</Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <div class="flex w-full max-w-[var(--container-xs)] flex-col gap-[var(--spacing-xs)]">
                              <!-- Runtime is required-only: empty → amber required
                                   (no red). Select has no amber border, so the amber
                                   HelperText below carries the cue. -->
                              <Select
                                v-model="form.runtime"
                                size="large"
                                :disabled="submitting"
                                class="w-full"
                                placeholder="Select a runtime"
                                :required="!!errors.runtime"
                                :display-value="runtimeLabel"
                                @update:model-value="errors.runtime = ''"
                              >
                                <Select.Trigger
                                  id="service-runtime"
                                  aria-label="Runtime"
                                  :aria-describedby="errors.runtime ? 'service-runtime-error' : undefined"
                                />
                                <!-- TEMPORARY WORKAROUND for a webkit bug: Select.Content
                                     teleports to <body> at z-50, so inside the Drawer panel
                                     (z-[1001]) the dropdown renders behind it and is invisible.
                                     Remove once webkit stacks overlay popups above Drawer/Dialog. -->
                                <Select.Content class="!z-[1002]">
                                  <Select.Option
                                    v-for="option in runtimes"
                                    :key="option.value"
                                    :value="option.value"
                                  >
                                    {{ option.label }}
                                  </Select.Option>
                                </Select.Content>
                              </Select>
                              <HelperText
                                v-if="errors.runtime"
                                id="service-runtime-error"
                                kind="required"
                                :value="errors.runtime"
                              />
                            </div>
                          </Item.Actions>
                        </Item>

                        <Item size="small" class="items-start">
                          <Item.Content>
                            <Item.Title>Region</Item.Title>
                            <Item.Description>Where the service is deployed.</Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <Select
                              v-model="form.region"
                              size="large"
                              :disabled="submitting"
                              class="w-full max-w-[var(--container-xs)]"
                              :display-value="regionLabel"
                            >
                              <Select.Trigger id="service-region" aria-label="Region" />
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
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>

                <!-- Section: Options -->
                <section class="flex flex-col gap-[var(--spacing-sm)]">
                  <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                    Options
                  </p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item size="small">
                          <Item.Content>
                            <Item.Title>Active</Item.Title>
                            <Item.Description>Start the service immediately after creation.</Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <Switch
                              v-model:isToggled="form.active"
                              aria-label="Active"
                              :disabled="submitting"
                            />
                          </Item.Actions>
                        </Item>

                        <Item size="small">
                          <Item.Content>
                            <Item.Title>Request logging</Item.Title>
                            <Item.Description>Record incoming requests for this service.</Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <Switch
                              v-model:isToggled="form.logging"
                              aria-label="Request logging"
                              :disabled="submitting"
                            />
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
                   so drive submit from its click; the sr-only submit gives the form
                   real Enter-to-submit. -->
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
