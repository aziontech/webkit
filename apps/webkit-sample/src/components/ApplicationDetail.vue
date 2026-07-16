<script setup>
// Application detail — the resource-detail view for a single application. Its
// identity (name) is the breadcrumb; the header's bottom is a FLUID navigation
// tab bar (Main Settings / Device Groups / …) with the tab's primary "create"
// action trailing on the same row, and the active sub-page renders below.
//
// CREATION PATTERN for second-level resources: every tab's "create" opens a
// LARGE Drawer whose body is section-titled ItemGroup sections (Approach A of
// the /form skill), committed by one scoped save — never a full page.
//
// NESTED creation: when a form has a Select for a RELATED resource, a "create
// new" affordance next to it opens a second, MEDIUM Drawer to create that
// related resource; on save it is appended to the Select's options and selected
// back in the parent form. Simulated here on "Create Functions Instance", whose
// Function Select can spawn a "Create Function" medium drawer.
//
// Validation runs on submit only (Item.Title is the label; a HelperText under
// the control carries the message — amber `required` for empty, red `invalid`
// for malformed). Each drawer locks its own scope off one `submitting` flag, and
// only request-level failures toast.
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
import TabView from "@aziontech/webkit/tab-view";
import Table from "@aziontech/webkit/table";
import Textarea from "@aziontech/webkit/textarea";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppLayout from "./ui/AppLayout.vue";
import CreateRuleDrawer from "./CreateRuleDrawer.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();

const userEmail = computed(() => route.query.email || "myemail@azion.com");

// A tiny stand-in "record" — in a real app this comes from the route id.
const application = {
  id: route.params.id || "1779806653",
  name: "teste",
};

// The resource's sub-pages. Each tab is a navigation destination, not a filter.
const tabs = [
  { value: "main-settings", label: "Main Settings" },
  { value: "device-groups", label: "Device Groups" },
  { value: "cache-settings", label: "Cache Settings" },
  { value: "functions-instances", label: "Functions Instances" },
  { value: "rules-engine", label: "Rules Engine" },
];

// The resource each tab creates (main-settings has no create).
const createLabels = {
  "device-groups": "Device Group",
  "cache-settings": "Cache Setting",
  "functions-instances": "Functions Instance",
  "rules-engine": "Rule",
};

// Active tab lives in the URL (`?tab=`) so it survives reload and is linkable.
const activeTab = computed({
  get: () =>
    tabs.some((t) => t.value === route.query.tab) ? route.query.tab : "main-settings",
  set: (value) => router.replace({ query: { ...route.query, tab: value } }),
});

const activeLabel = computed(
  () => tabs.find((t) => t.value === activeTab.value)?.label ?? "Main Settings",
);

const canCreate = computed(() => Boolean(createLabels[activeTab.value]));
const createButtonLabel = computed(() => createLabels[activeTab.value] ?? "");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Device Groups is the tab whose list the create drawer mutates; it seeds a
// couple of rows so the tab lands on a populated table like every other tab.
const deviceGroups = ref([
  { id: "dg-mobile", name: "Mobile", regex: "(Mobile|iPhone|Android|BlackBerry)" },
  { id: "dg-desktop", name: "Desktop", regex: "Mozilla.*(Windows|Macintosh)" },
]);

// Per-tab resource model for the LIST tabs. Each renders the SAME shape — a flush
// CardBox whose small PageHeading header (title + description + the tab's create
// action) sits over a borderless data-driven <Table>. `columns`/`rows` differ per
// tab; `activeResource` selects the model for the active tab (Device Groups pulls
// its rows from the reactive ref above so drawer-created groups appear live).
// Main Settings is NOT here — it's an ItemGroup form (see the `settings` block).
const resourceMeta = {
  "device-groups": {
    description: "Group requests by User-Agent to apply custom application behaviors.",
    columns: [
      { accessorKey: "name", header: "Name", principal: true, enableSorting: true },
      { accessorKey: "regex", header: "User-Agent Match", grow: 2 },
    ],
  },
  "cache-settings": {
    description: "Define how content is cached at the edge and in browsers.",
    columns: [
      { accessorKey: "name", header: "Name", principal: true, enableSorting: true },
      { accessorKey: "browserTtl", header: "Browser TTL" },
      { accessorKey: "edgeTtl", header: "Edge TTL" },
    ],
    rows: [
      { id: "cs-default", name: "Default Cache", browserTtl: "0s", edgeTtl: "60s" },
      { id: "cs-static", name: "Static Assets", browserTtl: "7 days", edgeTtl: "30 days" },
    ],
  },
  "functions-instances": {
    description: "Edge functions instantiated on this application.",
    columns: [
      { accessorKey: "name", header: "Name", principal: true, enableSorting: true },
      { accessorKey: "edgeFunction", header: "Function" },
      { accessorKey: "args", header: "Arguments", grow: 2 },
    ],
    rows: [
      { id: "fi-auth", name: "auth-guard", edgeFunction: "auth-handler", args: "{}" },
      { id: "fi-img", name: "img-resize", edgeFunction: "image-optimizer", args: '{ "quality": 80 }' },
    ],
  },
  "rules-engine": {
    description: "Conditional rules applied to requests and responses.",
    columns: [
      { accessorKey: "name", header: "Name", principal: true, enableSorting: true },
      { accessorKey: "phase", header: "Phase" },
      { accessorKey: "criteria", header: "Criteria", grow: 2 },
      { accessorKey: "status", header: "Status" },
    ],
    rows: [
      { id: "re-www", name: "Redirect www", phase: "Request", criteria: "host = www.*", status: "Active" },
      { id: "re-api", name: "Cache bypass", phase: "Response", criteria: "path ~ /api", status: "Active" },
    ],
  },
};

const activeResource = computed(() => {
  const meta = resourceMeta[activeTab.value] ?? { description: "", columns: [], rows: [] };
  const rows = activeTab.value === "device-groups" ? deviceGroups.value : meta.rows;
  return { ...meta, rows };
});

// --- Main Settings — the ItemGroup form (like Account Settings) ----------
// Section-titled flush CardBoxes of Item rows; one scoped Save commits the ENTIRE
// block. Its own submitting flag, separate from the create-drawer flag below.
const settings = reactive({
  name: application.name,
  active: true,
  applicationAccelerator: true,
  edgeFunctions: false,
  debugRules: false,
});
const settingsSubmitting = ref(false);

const saveSettings = async () => {
  if (settingsSubmitting.value) return; // re-entrancy lock
  settingsSubmitting.value = true;
  try {
    await sleep(900);
    toast.success("Main settings saved.");
  } catch (error) {
    toast.error("Could not save the settings.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => saveSettings() },
    });
  } finally {
    settingsSubmitting.value = false; // release on success AND failure
  }
};

// Edge functions available to a Functions Instance. The nested medium drawer
// appends to this list.
const functions = ref([
  { value: "fn-auth", label: "auth-handler" },
  { value: "fn-img", label: "image-optimizer" },
]);
const functionLabel = (value) =>
  functions.value.find((fn) => fn.value === value)?.label ?? "";

// Sentinel value for the "Create Function" option in the Select footer. The
// Select is controlled (`:model-value`), so picking it never commits — we open
// the nested drawer instead and leave the real selection untouched.
const CREATE_FUNCTION = "__create-function__";
const onFunctionModel = (value) => {
  if (value === CREATE_FUNCTION) {
    openFunctionCreate();
    return;
  }
  form.functionId = value;
  errors.functionId = "";
};

// ── LARGE create drawer — shared by every tab's create ──
const createOpen = ref(false);
const createType = ref(""); // which resource is being created
const createTitle = computed(() => `Create ${createLabels[createType.value] ?? ""}`);
const form = reactive({ name: "", regex: "", functionId: "" });
const errors = reactive({ name: "", regex: "", functionId: "" });
const submitting = ref(false);

// Rules Engine has its own rich create (repeater form) in a dedicated drawer.
const ruleDrawerOpen = ref(false);

const openCreate = () => {
  if (activeTab.value === "rules-engine") {
    ruleDrawerOpen.value = true;
    return;
  }
  createType.value = activeTab.value;
  createOpen.value = true;
};
const cancelCreate = () => {
  createOpen.value = false;
};

watch(createOpen, (open) => {
  if (open) return;
  form.name = "";
  form.regex = "";
  form.functionId = "";
  errors.name = "";
  errors.regex = "";
  errors.functionId = "";
});

const validateCreate = () => {
  errors.name = form.name.trim() ? "" : "Name is required.";
  errors.regex =
    createType.value === "device-groups" && !form.regex.trim()
      ? "A regular expression is required."
      : "";
  errors.functionId =
    createType.value === "functions-instances" && !form.functionId
      ? "Select a function."
      : "";
  return !errors.name && !errors.regex && !errors.functionId;
};

const submitCreate = async () => {
  if (submitting.value) return;
  if (!validateCreate()) return;

  submitting.value = true;
  try {
    await sleep(900);
    if (createType.value === "device-groups") {
      deviceGroups.value = [
        { id: `dg-${Date.now()}`, name: form.name.trim(), regex: form.regex.trim() },
        ...deviceGroups.value,
      ];
    }
    toast.success(`${createLabels[createType.value]} "${form.name.trim()}" created.`);
    createOpen.value = false;
  } catch (error) {
    toast.error(`Could not create the ${createLabels[createType.value]?.toLowerCase()}.`, {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submitCreate() },
    });
  } finally {
    submitting.value = false;
  }
};

// ── MEDIUM nested drawer — Create Function (opened from the Function Select) ──
const runtimes = [
  { value: "azion-js", label: "Azion Runtime (JavaScript)" },
  { value: "node20", label: "Node.js 20" },
];
const runtimeLabel = (value) =>
  runtimes.find((r) => r.value === value)?.label ?? "";

const functionOpen = ref(false);
const functionForm = reactive({ name: "", runtime: "" });
const functionErrors = reactive({ name: "", runtime: "" });
const functionSubmitting = ref(false);

// Controls the Function Select's dropdown so the quick-add (its footer slot) can
// close it before the nested drawer opens over the top.
const functionSelectOpen = ref(false);

const openFunctionCreate = () => {
  functionSelectOpen.value = false;
  functionOpen.value = true;
};
const cancelFunction = () => {
  functionOpen.value = false;
};

watch(functionOpen, (open) => {
  if (open) return;
  functionForm.name = "";
  functionForm.runtime = "";
  functionErrors.name = "";
  functionErrors.runtime = "";
});

const validateFunction = () => {
  functionErrors.name = functionForm.name.trim() ? "" : "Name is required.";
  functionErrors.runtime = functionForm.runtime ? "" : "Runtime is required.";
  return !functionErrors.name && !functionErrors.runtime;
};

const submitFunction = async () => {
  if (functionSubmitting.value) return;
  if (!validateFunction()) return;

  functionSubmitting.value = true;
  try {
    await sleep(700);
    const value = `fn-${Date.now()}`;
    functions.value = [{ value, label: functionForm.name.trim() }, ...functions.value];
    form.functionId = value; // select the newly created function back in the parent
    errors.functionId = "";
    toast.success(`Function "${functionForm.name.trim()}" created.`);
    functionOpen.value = false;
  } catch (error) {
    toast.error("Could not create the function.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submitFunction() },
    });
  } finally {
    functionSubmitting.value = false;
  }
};
</script>

<template>
  <AppLayout
    active="applications"
    :padded="false"
    :breadcrumb="[
      { label: 'Applications', href: '/applications' },
      { label: application.name },
    ]"
  >
    <main class="flex h-full flex-col">
      <!-- Nav pattern (no PageHeading): the tabs form the bottom of the header —
           a fluid full-bleed bar. The tab's create action now lives in the card
           header below, so the bar carries only the nav tabs. -->
      <div class="border-b border-[var(--border-default)] px-[var(--spacing-md)]">
        <div class="flex items-end py-[var(--spacing-sm)]">
          <TabView
            v-model:value="activeTab"
            class="min-w-0 flex-1"
          >
            <TabView.List>
              <TabView.Item
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
            </TabView.List>
          </TabView>
        </div>
      </div>

      <!-- Sub-page content. Main Settings is an ItemGroup FORM (section-titled
           flush CardBoxes of Item rows) saved as one block by the pinned Save bar
           below; every other tab renders the card + small-PageHeading + borderless
           Table pattern. Only this region scrolls. -->
      <section class="min-h-0 flex-1 overflow-auto p-[var(--spacing-md)]">
        <!-- Main Settings — the ItemGroup form; one scoped Save commits it all. -->
        <form
          v-if="activeTab === 'main-settings'"
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
          aria-label="Main settings"
          novalidate
          @submit.prevent="saveSettings"
        >
          <PageHeading
            title="Main Settings"
            description="Core configuration for this edge application."
            size="small"
          />

          <fieldset
            class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
            :disabled="settingsSubmitting"
          >
            <legend class="sr-only">Main settings</legend>

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
                          A unique and descriptive name to identify the application.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <InputText
                          v-model="settings.name"
                          size="large"
                          :disabled="settingsSubmitting"
                          class="w-full max-w-[var(--container-sm)]"
                          aria-label="Name"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Active</Item.Title>
                        <Item.Description>
                          When disabled, the application stops serving traffic at the edge.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <Switch
                          v-model:isToggled="settings.active"
                          aria-label="Active"
                          :disabled="settingsSubmitting"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <!-- Section: Modules -->
            <section class="flex flex-col gap-[var(--spacing-sm)]">
              <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                Modules
              </p>
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Application Accelerator</Item.Title>
                        <Item.Description>
                          Accelerate dynamic content and enable advanced caching and rules.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <Switch
                          v-model:isToggled="settings.applicationAccelerator"
                          aria-label="Application Accelerator"
                          :disabled="settingsSubmitting"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Edge Functions</Item.Title>
                        <Item.Description>
                          Run serverless functions at the edge on this application.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <Switch
                          v-model:isToggled="settings.edgeFunctions"
                          aria-label="Edge Functions"
                          :disabled="settingsSubmitting"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Debug Rules</Item.Title>
                        <Item.Description>
                          Log the rules executed for each request under $traceback.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <Switch
                          v-model:isToggled="settings.debugRules"
                          aria-label="Debug Rules"
                          :disabled="settingsSubmitting"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>
          </fieldset>
        </form>

        <!-- Every other tab: a small PageHeading OUT of the card (matching Main
             Settings), then the flush CardBox wrapping the borderless Table. -->
        <div v-else class="flex min-w-0 flex-col gap-[var(--spacing-lg)]">
          <PageHeading
            :title="activeLabel"
            :description="activeResource.description"
            size="small"
          >
            <template v-if="canCreate" #actions>
              <Button
                :label="createButtonLabel"
                kind="primary"
                size="medium"
                icon="pi pi-plus"
                @click="openCreate"
              />
            </template>
          </PageHeading>

          <CardBox :padded="false">
            <template #content>
              <Table
                :data="activeResource.rows"
                :columns="activeResource.columns"
                row-key="id"
                enable-sorting
                :border="false"
              >
                <template #toolbar>
                  <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                    <Table.Search
                      size="large"
                      :placeholder="'Search ' + activeLabel.toLowerCase() + '...'"
                      class="flex-1"
                    />
                  </div>
                </template>
              </Table>
            </template>
          </CardBox>
        </div>
      </section>

      <!-- Save bar — pinned below the scroll region; only Main Settings has a save
           scope, committed as ONE block. Stays locked while the request runs. -->
      <footer
        v-if="activeTab === 'main-settings'"
        class="shrink-0 border-t-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]"
      >
        <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)] p-[var(--spacing-lg)]">
          <Button
            type="button"
            label="Cancel"
            kind="outlined"
            size="medium"
            :disabled="settingsSubmitting"
            @click="router.push({ path: '/applications', query: { email: userEmail } })"
          />
          <!-- webkit Button renders a native type="button" and doesn't forward a
               type prop, so drive submit from its click event. -->
          <Button
            label="Save"
            kind="primary"
            size="medium"
            :loading="settingsSubmitting"
            @click="saveSettings"
          />
        </div>
      </footer>
    </main>

    <!-- Rules Engine create — its own rich, repeater-driven large drawer -->
    <CreateRuleDrawer v-model:open="ruleDrawerOpen" />

    <!-- LARGE create drawer — one scoped save; body switches by createType -->
    <Drawer v-model:open="createOpen" size="large" side="right">
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            :aria-label="createTitle"
            novalidate
            @submit.prevent="submitCreate"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                <DrawerTitle>{{ createTitle }}</DrawerTitle>
                <p class="text-body-sm text-[var(--text-muted)]">
                  Configure the resource across grouped sections — all saved together.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">{{ createTitle }}</legend>

                <!-- Section: General (all resources) -->
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
                              Give a unique and descriptive name to identify the resource.
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
                                placeholder="My resource"
                                :required="!!errors.name && !form.name.trim()"
                                :invalid="!!errors.name && !!form.name.trim()"
                                :aria-describedby="errors.name ? 'create-name-error' : undefined"
                                @update:model-value="errors.name = ''"
                              />
                              <HelperText
                                v-if="errors.name"
                                id="create-name-error"
                                :kind="form.name.trim() ? 'invalid' : 'required'"
                                :value="errors.name"
                              />
                            </div>
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>

                <!-- Section: Match to User-Agent (Device Group) -->
                <section
                  v-if="createType === 'device-groups'"
                  class="flex flex-col gap-[var(--spacing-sm)]"
                >
                  <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                    Match to User-Agent
                  </p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item size="small" class="items-start">
                          <Item.Content>
                            <Item.Title>Regular Expression</Item.Title>
                            <Item.Description>
                              Add the regular expression you want to match to the content
                              of the User-Agent header.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                              <Textarea
                                v-model="form.regex"
                                :disabled="submitting"
                                class="w-full font-code"
                                aria-label="Regular Expression"
                                placeholder="(Mobile|iP(hone|od)|BlackBerry|IEMobile)"
                                :required="!!errors.regex"
                                :aria-describedby="errors.regex ? 'create-regex-error' : undefined"
                                @update:model-value="errors.regex = ''"
                              />
                              <HelperText
                                v-if="errors.regex"
                                id="create-regex-error"
                                kind="required"
                                :value="errors.regex"
                              />
                            </div>
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>

                <!-- Section: Function (Functions Instance) — the nested-create case -->
                <section
                  v-if="createType === 'functions-instances'"
                  class="flex flex-col gap-[var(--spacing-sm)]"
                >
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
                                  id="fi-function"
                                  aria-label="Edge Function"
                                  :aria-describedby="errors.functionId ? 'fi-function-error' : undefined"
                                />
                                <!-- TEMPORARY WORKAROUND (webkit bug): Select.Content
                                     teleports to <body> at z-50, so inside the Drawer
                                     panel (z-[1001]) it renders behind and is invisible.
                                     Remove once webkit stacks overlay popups above Drawer. -->
                                <Select.Content class="!z-[1002]">
                                  <Select.Option
                                    v-for="fn in functions"
                                    :key="fn.value"
                                    :value="fn.value"
                                  >
                                    {{ fn.label }}
                                  </Select.Option>
                                  <!-- Quick-add lives in the Select's bottom (footer)
                                       slot as a normal option; picking it opens the
                                       nested drawer instead of committing a value. -->
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
                                id="fi-function-error"
                                kind="required"
                                :value="errors.functionId"
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
                @click="cancelCreate"
              />
              <Button
                class="w-full md:w-auto"
                label="Save"
                kind="primary"
                size="medium"
                :loading="submitting"
                @click="submitCreate"
              />
              <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">
                Save
              </button>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <!-- MEDIUM nested drawer — Create Function, spawned from the Function Select.
         On save the new function is added to the Select and selected in the
         parent form. It stacks above the large drawer. -->
    <Drawer v-model:open="functionOpen" size="medium" side="right">
      <DrawerPortal>
        <!-- Raise the nested drawer above the large drawer's content (z-[1001]):
             its overlay covers the first drawer, and clicking it (or Escape)
             dismisses the nested drawer (closeable is true by default). -->
        <DrawerOverlay class="z-[1002]" />
        <DrawerContent class="z-[1003]">
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Function"
            novalidate
            @submit.prevent="submitFunction"
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
                :disabled="functionSubmitting"
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
                                v-model="functionForm.name"
                                size="large"
                                :disabled="functionSubmitting"
                                class="w-full"
                                aria-label="Name"
                                placeholder="my-function"
                                :required="!!functionErrors.name && !functionForm.name.trim()"
                                :invalid="!!functionErrors.name && !!functionForm.name.trim()"
                                :aria-describedby="functionErrors.name ? 'fn-name-error' : undefined"
                                @update:model-value="functionErrors.name = ''"
                              />
                              <HelperText
                                v-if="functionErrors.name"
                                id="fn-name-error"
                                :kind="functionForm.name.trim() ? 'invalid' : 'required'"
                                :value="functionErrors.name"
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
                                v-model="functionForm.runtime"
                                size="large"
                                :disabled="functionSubmitting"
                                class="w-full"
                                placeholder="Select a runtime"
                                :required="!!functionErrors.runtime"
                                :display-value="runtimeLabel"
                                @update:model-value="functionErrors.runtime = ''"
                              >
                                <Select.Trigger
                                  id="fn-runtime"
                                  aria-label="Runtime"
                                  :aria-describedby="functionErrors.runtime ? 'fn-runtime-error' : undefined"
                                />
                                <!-- Above the nested drawer's content (z-[1003]) so
                                     this Select shows on top of the medium drawer. -->
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
                                v-if="functionErrors.runtime"
                                id="fn-runtime-error"
                                kind="required"
                                :value="functionErrors.runtime"
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
                :disabled="functionSubmitting"
                @click="cancelFunction"
              />
              <Button
                class="w-full md:w-auto"
                label="Save"
                kind="primary"
                size="medium"
                :loading="functionSubmitting"
                @click="submitFunction"
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
