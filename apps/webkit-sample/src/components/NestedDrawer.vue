<script setup>
// Form type: NESTED DRAWER (the `/form` skill, "Form types"). A drawer create
// whose Select points at a RELATED resource that may not exist yet. Rather than
// sending the user away to create it — and losing everything they've typed — a
// "Create …" quick-add in the Select's footer opens a SECOND, smaller drawer
// stacked over the first. The child creates the resource, appends it to the
// Select's options, selects it back into the parent, and closes; the parent form
// is exactly as the user left it. This is a self-contained copy of the real
// Functions Instance → Edge Function → Create Function flow in ApplicationDetail.
//
// Three decisions make it safe:
// 1. INDEPENDENT SCOPES — parent and child are separate <form>s, each with its own
//    `submitting` flag, <fieldset :disabled>, and Save :loading (the /usability
//    Pattern 1 lock, per drawer). Neither save locks the other.
// 2. CONTROLLED SELECT + SENTINEL — the parent Select is controlled (:model-value,
//    not v-model) so picking the quick-add never commits a real value; a sentinel
//    option in the #footer slot opens the child instead.
// 3. EXPLICIT STACKING — a Drawer panel is z-[1001] and Select.Content teleports to
//    <body> at z-50, so each layer opts its overlay/content/popups above the one
//    beneath it (child overlay z-[1002] / content z-[1003] / nested Select z-[1004];
//    the parent's Select z-[1002]). TEMPORARY workaround for a webkit bug where an
//    overlay popup renders behind a Drawer — remove once webkit stacks them above.
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
import { toast } from "@aziontech/webkit/toast";
import { reactive, ref, watch } from "vue";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

// Stable ids for the demo, without Date.now() churn in templates.
let nextId = 0;
const uid = () => (nextId += 1);

// The related resource the parent Select picks from. The child drawer appends here.
const functions = ref([
  { value: "fn-auth", label: "auth-handler" },
  { value: "fn-img", label: "image-optimizer" },
]);
const functionLabel = (value) =>
  functions.value.find((fn) => fn.value === value)?.label ?? "";

const runtimes = [
  { value: "azion-js", label: "Azion Runtime (JavaScript)" },
  { value: "node20", label: "Node.js 20" },
];
const runtimeLabel = (value) =>
  runtimes.find((r) => r.value === value)?.label ?? "";

// The list the PARENT drawer creates into (kept in memory for the demo).
const instances = ref([
  { id: "fi-1", name: "auth-guard", functionId: "fn-auth" },
]);

// ── PARENT large drawer — Create Functions Instance ──
const parentOpen = ref(false);
const form = reactive({ name: "", functionId: "" });
const errors = reactive({ name: "", functionId: "" });
const submitting = ref(false);

// Sentinel value for the "Create Function" quick-add. The parent Select is
// CONTROLLED (:model-value), so selecting the sentinel never commits — it opens
// the child drawer and leaves the real selection untouched.
const CREATE_FUNCTION = "__create-function__";
// Controls the parent Select's dropdown so the quick-add can close it before the
// child drawer opens over the top.
const functionSelectOpen = ref(false);

const onFunctionModel = (value) => {
  if (value === CREATE_FUNCTION) {
    functionSelectOpen.value = false; // close the dropdown …
    childOpen.value = true; //           … then open the child over the parent
    return;
  }
  form.functionId = value;
  errors.functionId = "";
};

const openParent = () => {
  parentOpen.value = true;
};
const cancelParent = () => {
  parentOpen.value = false;
};

// Reset the parent scope whenever it closes (cancel, overlay, Escape, success).
watch(parentOpen, (open) => {
  if (open) return;
  form.name = "";
  form.functionId = "";
  errors.name = "";
  errors.functionId = "";
});

const validateParent = () => {
  errors.name = form.name.trim() ? "" : "Name is required.";
  errors.functionId = form.functionId ? "" : "Select a function.";
  return !errors.name && !errors.functionId;
};

const submitParent = async () => {
  if (submitting.value) return; // re-entrancy lock, on the PARENT's flag
  if (!validateParent()) return;

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    instances.value = [
      { id: `fi-${uid()}`, name: form.name.trim(), functionId: form.functionId },
      ...instances.value,
    ];
    toast.success(`Functions Instance "${form.name.trim()}" created.`);
    parentOpen.value = false; // watch() resets the form
  } catch (error) {
    toast.error("Could not create the functions instance.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submitParent() },
    });
  } finally {
    submitting.value = false; // release on success AND failure
  }
};

// ── CHILD medium drawer — Create Function (its own, SEPARATE scope) ──
const childOpen = ref(false);
const childForm = reactive({ name: "", runtime: "" });
const childErrors = reactive({ name: "", runtime: "" });
const childSubmitting = ref(false);

const cancelChild = () => {
  childOpen.value = false;
};

watch(childOpen, (open) => {
  if (open) return;
  childForm.name = "";
  childForm.runtime = "";
  childErrors.name = "";
  childErrors.runtime = "";
});

const validateChild = () => {
  childErrors.name = childForm.name.trim() ? "" : "Name is required.";
  childErrors.runtime = childForm.runtime ? "" : "Runtime is required.";
  return !childErrors.name && !childErrors.runtime;
};

const submitChild = async () => {
  if (childSubmitting.value) return; // re-entrancy lock, on the CHILD's flag
  if (!validateChild()) return;

  childSubmitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const value = `fn-${uid()}`;
    functions.value = [{ value, label: childForm.name.trim() }, ...functions.value];
    form.functionId = value; // select the new resource back into the parent
    errors.functionId = "";
    toast.success(`Function "${childForm.name.trim()}" created.`);
    childOpen.value = false;
  } catch (error) {
    toast.error("Could not create the function.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submitChild() },
    });
  } finally {
    childSubmitting.value = false; // release on success AND failure
  }
};
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'Nested drawer' }]"
  >
    <main class="flex h-full flex-col">
      <PageHeading
        title="Functions Instances"
        description="Create a resource whose Select needs a related resource that may not exist yet — the quick-add opens a second drawer, then selects the new resource back into the parent. Each drawer is its own scoped save."
      >
        <template #actions>
          <Button
            label="Functions Instance"
            kind="primary"
            size="medium"
            icon="pi pi-plus"
            @click="openParent"
          />
        </template>
      </PageHeading>

      <!-- The list the parent drawer creates into -->
      <ul class="mt-[var(--spacing-md)] flex flex-col gap-[var(--spacing-xs)]">
        <li
          v-for="instance in instances"
          :key="instance.id"
          class="flex items-center justify-between rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
        >
          <span class="text-label-code-sm text-[var(--text-default)]">{{ instance.name }}</span>
          <span class="text-body-xs text-[var(--text-muted)]">{{ functionLabel(instance.functionId) }}</span>
        </li>
      </ul>
    </main>

    <!-- PARENT — LARGE create drawer; one scoped save on `submitting` -->
    <Drawer v-model:open="parentOpen" size="large" side="right">
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Functions Instance"
            novalidate
            @submit.prevent="submitParent"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                <DrawerTitle>Create Functions Instance</DrawerTitle>
                <p class="text-body-sm text-[var(--text-muted)]">
                  Instantiate an edge function on this application — pick an existing
                  function or create a new one inline.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Create functions instance</legend>

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
                              Give a unique and descriptive name to identify the instance.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                              <InputText
                                v-model="form.name"
                                size="large"
                                :disabled="submitting"
                                class="w-full"
                                aria-label="Name"
                                placeholder="my-instance"
                                :required="!!errors.name && !form.name.trim()"
                                :invalid="!!errors.name && !!form.name.trim()"
                                :aria-describedby="errors.name ? 'instance-name-error' : undefined"
                                @update:model-value="errors.name = ''"
                              />
                              <HelperText
                                v-if="errors.name"
                                id="instance-name-error"
                                :kind="form.name.trim() ? 'invalid' : 'required'"
                                :label="errors.name"
                              />
                            </div>
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>

                <!-- Section: Function — the nested-create case -->
                <section class="flex flex-col gap-[var(--spacing-sm)]">
                  <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                    Function
                  </p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item size="small" class="items-start">
                          <Item.Content>
                            <Item.Title>Edge Function</Item.Title>
                            <Item.Description>
                              Pick the function to instantiate, or create a new one.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                              <!-- CONTROLLED (:model-value) so the sentinel never
                                   commits; @update:model-value routes the sentinel to
                                   the child drawer and otherwise assigns the value. -->
                              <Select
                                :model-value="form.functionId"
                                v-model:open="functionSelectOpen"
                                size="large"
                                :disabled="submitting"
                                class="w-full"
                                placeholder="Select a function"
                                :required="!!errors.functionId"
                                :display-value="functionLabel"
                                @update:model-value="onFunctionModel"
                              >
                                <Select.Trigger
                                  id="instance-function"
                                  aria-label="Edge Function"
                                  :aria-describedby="errors.functionId ? 'instance-function-error' : undefined"
                                />
                                <!-- z-[1002]: above the parent Drawer panel (z-[1001]). -->
                                <Select.Content class="!z-[1002]">
                                  <Select.Option
                                    v-for="fn in functions"
                                    :key="fn.value"
                                    :value="fn.value"
                                  >
                                    {{ fn.label }}
                                  </Select.Option>
                                  <!-- Quick-add: a normal option in the footer slot
                                       carrying the sentinel value. -->
                                  <template #footer>
                                    <Select.Option
                                      :value="CREATE_FUNCTION"
                                      icon="pi pi-plus-circle"
                                      class="w-full"
                                    >
                                      Create Function
                                    </Select.Option>
                                  </template>
                                </Select.Content>
                              </Select>
                              <HelperText
                                v-if="errors.functionId"
                                id="instance-function-error"
                                kind="required"
                                :label="errors.functionId"
                              />
                            </div>
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
                @click="cancelParent"
              />
              <Button
                class="w-full md:w-auto"
                label="Save"
                kind="primary"
                size="medium"
                :loading="submitting"
                @click="submitParent"
              />
              <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">
                Save
              </button>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <!-- CHILD — MEDIUM nested drawer; its own scope on `childSubmitting`. On save it
         appends the new function to the parent Select and selects it back. Stacks
         above the parent (overlay z-[1002], content z-[1003]). -->
    <Drawer v-model:open="childOpen" size="medium" side="right">
      <DrawerPortal>
        <DrawerOverlay class="z-[1002]" />
        <DrawerContent class="z-[1003]">
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Function"
            novalidate
            @submit.prevent="submitChild"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                <DrawerTitle>Create Function</DrawerTitle>
                <p class="text-body-sm text-[var(--text-muted)]">
                  Create a function to instantiate — it becomes available in the
                  selector when saved.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
                :disabled="childSubmitting"
              >
                <legend class="sr-only">Create function</legend>

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
                            <Item.Description>A unique name for the function.</Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <div class="flex w-full max-w-[var(--container-xs)] flex-col gap-[var(--spacing-xs)]">
                              <InputText
                                v-model="childForm.name"
                                size="large"
                                :disabled="childSubmitting"
                                class="w-full"
                                aria-label="Name"
                                placeholder="my-function"
                                :required="!!childErrors.name && !childForm.name.trim()"
                                :invalid="!!childErrors.name && !!childForm.name.trim()"
                                :aria-describedby="childErrors.name ? 'fn-name-error' : undefined"
                                @update:model-value="childErrors.name = ''"
                              />
                              <HelperText
                                v-if="childErrors.name"
                                id="fn-name-error"
                                :kind="childForm.name.trim() ? 'invalid' : 'required'"
                                :label="childErrors.name"
                              />
                            </div>
                          </Item.Actions>
                        </Item>

                        <Item size="small" class="items-start">
                          <Item.Content>
                            <Item.Title>Runtime</Item.Title>
                            <Item.Description>The language the function runs on.</Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <div class="flex w-full max-w-[var(--container-xs)] flex-col gap-[var(--spacing-xs)]">
                              <Select
                                v-model="childForm.runtime"
                                size="large"
                                :disabled="childSubmitting"
                                class="w-full"
                                placeholder="Select a runtime"
                                :required="!!childErrors.runtime"
                                :display-value="runtimeLabel"
                                @update:model-value="childErrors.runtime = ''"
                              >
                                <Select.Trigger
                                  id="fn-runtime"
                                  aria-label="Runtime"
                                  :aria-describedby="childErrors.runtime ? 'fn-runtime-error' : undefined"
                                />
                                <!-- z-[1004]: above the nested drawer's content (z-[1003]). -->
                                <Select.Content class="!z-[1004]">
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
                                v-if="childErrors.runtime"
                                id="fn-runtime-error"
                                kind="required"
                                :label="childErrors.runtime"
                              />
                            </div>
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
                :disabled="childSubmitting"
                @click="cancelChild"
              />
              <Button
                class="w-full md:w-auto"
                label="Save"
                kind="primary"
                size="medium"
                :loading="childSubmitting"
                @click="submitChild"
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
