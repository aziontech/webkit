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
import CopyButton from "@aziontech/webkit/copy-button";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import HelperText from "@aziontech/webkit/helper-text";
import IconButton from "@aziontech/webkit/icon-button";
import InputGroup from "@aziontech/webkit/input-group";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import Select from "@aziontech/webkit/select";
import Switch from "@aziontech/webkit/switch";
import TabView from "@aziontech/webkit/tab-view";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import Textarea from "@aziontech/webkit/textarea";
import Tooltip from "@aziontech/webkit/tooltip";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import CreateRuleDrawer from "./CreateRuleDrawer.vue";
import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();

// A tiny stand-in "record" — in a real app this comes from the route id. Mirrors
// the reference repo gab-az/webkit-sample-vue so the Build tab is coherent.
const application = {
  id: route.params.id || "1784552864",
  name: "webkit-sample-vue",
};

// The resource's sub-pages. Each tab is a navigation destination, not a filter.
// "Build" is the UI face of the repo's GitHub Actions deploy workflow (azion-deploy.yml).
const tabs = [
  { value: "main-settings", label: "Main Settings" },
  { value: "build", label: "Build" },
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

// --- Build tab: git integration + azion.json mirror ---------------------
// The Build tab is the UI face of the repo's GitHub Actions deploy workflow.
// `build` = the build intent (repo/branch/preset/commands = azion.config +
// the workflow steps). `azionState` = the platform state the CLI writes back to
// azion/azion.json after each deploy (the API, mirrored). The framework icon is
// the preset, exactly like the Applications list.
const presetMeta = {
  vue: { label: "Vue", icon: "ai-vue" },
  react: { label: "React", icon: "ai-react" },
  next: { label: "Next.js", icon: "ai-next" },
  angular: { label: "Angular", icon: "ai-angular" },
  nuxt: { label: "Nuxt", icon: "ai-nuxt" },
  astro: { label: "Astro", icon: "ai-astro" },
  svelte: { label: "Svelte", icon: "ai-svelte" },
};
const presetLabel = (preset) => presetMeta[preset]?.label ?? preset;
const presetIcon = (preset) => presetMeta[preset]?.icon ?? "";

// Build intent, partitioned for INDEPENDENT saves (the /form "ItemGroup with
// independent saves" pattern — the same shape Main Settings uses below). The
// editable configuration is split into two topic groups, each a flush ItemGroup
// owning its OWN footer Save that locks and dirties INDEPENDENTLY: `buildConfig`
// (preset + the CLI commands the workflow runs) and `branch` (the
// workflow_dispatch branch inputs). The repository connection and the advanced
// deploy rows stay informational/action-only — they carry no group Save.
const repository = ref("gab-az/webkit-sample-vue");
const apiTokenName = "webkit-sample-vue build token";
const buildCacheEnabled = ref(true);
// Build-cache options, revealed below the toggle when the cache is on. Applied
// live (the Deployment section has no group Save), like the appearance prefs
// elsewhere.
const buildCacheScopeOptions = [
  { label: "Per branch", value: "branch" },
  { label: "Shared across branches", value: "shared" },
];
const buildCache = reactive({
  scope: "branch",
  autoInvalidate: true,
});
const buildCacheScopeLabel = (value) =>
  buildCacheScopeOptions.find((option) => option.value === value)?.label ?? "";

// Group 1 — Build configuration (preset + build/deploy commands + paths). Save
// stays disabled until a field diverges from the saved baseline.
const buildConfig = reactive({
  preset: "vue",
  buildCommand: "azion build",
  deployCommand: "azion deploy --local",
  rootDirectory: "/",
  watchPaths: "*",
});
const savingBuildConfig = ref(false);
const buildConfigBaseline = ref(JSON.stringify(buildConfig));
const buildConfigDirty = computed(
  () => JSON.stringify(buildConfig) !== buildConfigBaseline.value,
);

// Group 2 — Branch control (the workflow_dispatch branch inputs).
const branch = reactive({
  productionBranch: "main",
  nonProdBuilds: true,
});
const savingBranch = ref(false);
const branchBaseline = ref(JSON.stringify(branch));
const branchDirty = computed(
  () => JSON.stringify(branch) !== branchBaseline.value,
);

// Environment variables & secrets injected into the build (the AZION_* set +
// app config). Rendered as a data-driven Table (AccountSettings pattern), not an
// italic "None" row.
const variables = ref([
  { id: "v-1", key: "AZION_ENV", value: "production", secret: false },
  { id: "v-2", key: "API_BASE_URL", value: "https://api.azion.com", secret: false },
  { id: "v-3", key: "AZION_PERSONAL_TOKEN", value: "azion_prod_9f3a1c7e", secret: true },
]);
const variableColumns = [
  { accessorKey: "key", header: "Key", principal: true, enableSorting: true },
  { accessorKey: "value", header: "Value", grow: 2 },
  { accessorKey: "secret", header: "Type" },
  { id: "actions", kind: "action", hideable: false },
];

const addVariable = () =>
  comingSoon("Add variable or secret");
const removeVariable = (event, row) => {
  variables.value = variables.value.filter((item) => item.id !== row.id);
  toast.success(`Variable "${row.key}" removed.`);
};

// Platform state — the mirror of azion/azion.json the CLI commits back after deploy.
const azionState = reactive({
  applicationId: application.id,
  domainUrl: "https://e7b4verynr.map.azionedge.net",
  domainName: "e7b4verynr.map.azionedge.net",
  env: "production",
  prefix: "20260720130245",
});

// prefix (YYYYMMDDHHMMSS) → a readable "last deploy" timestamp.
const lastDeploy = computed(() => {
  const p = azionState.prefix;
  if (!/^\d{14}$/.test(p)) return p;
  const date = new Date(
    `${p.slice(0, 4)}-${p.slice(4, 6)}-${p.slice(6, 8)}T${p.slice(8, 10)}:${p.slice(10, 12)}:${p.slice(12, 14)}`,
  );
  return Number.isNaN(date.getTime())
    ? p
    : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
});

// The "Deploy" button is the workflow_dispatch analog: it simulates a CLI
// build+deploy and bumps the azion.json prefix so the status strip updates live —
// closing the deploy → azion.json → UI loop.
const deploying = ref(false);
const deploy = async () => {
  if (deploying.value) return;
  deploying.value = true;
  toast.info("Deploy triggered", {
    description: `Building ${repository.value} (${branch.productionBranch}) with the ${presetLabel(buildConfig.preset)} preset.`,
  });
  try {
    await sleep(1500);
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    azionState.prefix = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    toast.success("Deploy finished", {
      description: `Live at ${azionState.domainUrl}`,
    });
  } catch (error) {
    toast.error("Deploy failed.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => deploy() },
    });
  } finally {
    deploying.value = false;
  }
};

// Row affordances that don't mutate anything in this demo.
const comingSoon = (what) =>
  toast.info(what, { description: "Not available in this demo." });

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
// Main Settings is NOT here — it's two independently-saved ItemGroups (see the
// `general` / `modules` blocks below).
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

// --- Main Settings — two ItemGroups with INDEPENDENT saves ---------------
// Each topic group (General, Modules) owns its OWN Save in the card footer and
// locks INDEPENDENTLY off its own submitting flag: that group's fields and its
// Save disable while the request runs, and the other group stays live. Separate
// from the create-drawer flag below.
//
// A group's Save stays DISABLED until that group is actually edited: each group
// keeps a JSON baseline of its saved state, and `*Dirty` is true only when the
// live values diverge from it. Saving commits the new baseline, so Save disables
// again until the next edit — an unchanged group has nothing to save.
const general = reactive({
  name: application.name,
  active: true,
});
const savingGeneral = ref(false);
const generalBaseline = ref(JSON.stringify(general));
const generalDirty = computed(() => JSON.stringify(general) !== generalBaseline.value);

const modules = reactive({
  applicationAccelerator: true,
  cache: true,
  deviceDetection: false,
  functions: true,
  imageProcessor: false,
  loadBalancer: false,
  webSocketProxy: false,
});
const savingModules = ref(false);
const modulesBaseline = ref(JSON.stringify(modules));
const modulesDirty = computed(() => JSON.stringify(modules) !== modulesBaseline.value);

// The module catalog, rendered as a card grid. `defaultModules` ship on every
// plan; `subscriptionModules` are paid add-ons closed by a "Contact sales" CTA.
// A `locked` module (Cache) is force-enabled account-wide — its Switch stays on
// and disabled, and the card shows a lock badge instead of the active-highlight
// border. Toggle state lives in the `modules` object above, so the group's dirty
// tracking and independent Save keep working unchanged.
const defaultModules = [
  {
    key: "applicationAccelerator",
    title: "Application Accelerator",
    description: "Optimize protocols and manage dynamic content delivery.",
  },
  {
    key: "cache",
    title: "Cache",
    description: "Customize advanced cache settings.",
    locked: true,
    lockLabel: "Automatically enabled in all accounts.",
  },
  {
    key: "deviceDetection",
    title: "Device Detection",
    description: "Activate DeviceAtlas variables to configure responsive rules.",
  },
  {
    key: "functions",
    title: "Functions",
    description: "Build ultra-low latency functions that run on the edge.",
  },
  {
    key: "imageProcessor",
    title: "Image Processor",
    description: "Enable dynamic image editing options.",
  },
  {
    key: "loadBalancer",
    title: "Load Balancer",
    description:
      "Balance traffic to your origins ensuring reliability and network congestion control.",
  },
];
const subscriptionModules = [
  {
    key: "webSocketProxy",
    title: "WebSocket Proxy",
    description:
      "Enhance real-time data exchange between your Application and backend services using the WebSocket protocol.",
  },
];
const moduleSections = [
  { id: "default", label: "Default Modules", modules: defaultModules },
  { id: "subscription", label: "Subscription modules", modules: subscriptionModules },
];

// Each group commits independently through the same one-flag lock. On success the
// baseline is refreshed (via `commit`) so the group is no longer dirty.
const saveGroup = async (flag, message, commit) => {
  if (flag.value) return; // per-group re-entrancy lock
  flag.value = true;
  try {
    await sleep(900);
    commit();
    toast.success(message);
  } catch (error) {
    toast.error("Could not save the settings.", {
      description: error?.message ?? "Check your connection and try again.",
    });
  } finally {
    flag.value = false; // release on success AND failure
  }
};

const saveGeneral = () =>
  saveGroup(savingGeneral, "General settings saved.", () => {
    generalBaseline.value = JSON.stringify(general);
  });
const saveModules = () =>
  saveGroup(savingModules, "Module settings saved.", () => {
    modulesBaseline.value = JSON.stringify(modules);
  });

// Build tab groups — same independent-save helper as Main Settings. Each commits
// its own baseline so its footer Save disables again until the next edit.
const saveBuildConfig = () =>
  saveGroup(savingBuildConfig, "Build configuration saved.", () => {
    buildConfigBaseline.value = JSON.stringify(buildConfig);
  });
const saveBranch = () =>
  saveGroup(savingBranch, "Branch settings saved.", () => {
    branchBaseline.value = JSON.stringify(branch);
  });

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

      <!-- Sub-page content. Main Settings is TWO ItemGroups (General, Modules),
           each a section-titled flush CardBox of Item rows owning its OWN footer
           Save so the two topic groups commit independently; every other tab
           renders the card + small-PageHeading + borderless Table pattern. Only
           this region scrolls. -->
      <section class="min-h-0 flex-1 overflow-auto p-[var(--spacing-md)]">
        <!-- Main Settings — two ItemGroups, each with its own independent Save. -->
        <div
          v-if="activeTab === 'main-settings'"
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
        >
          <PageHeading
            title="Main Settings"
            description="Core configuration for this edge application."
            size="small"
          />

          <!-- Group 1 — General (section title, its own footer save). -->
          <form
            class="flex flex-col gap-[var(--spacing-sm)]"
            aria-label="General settings"
            novalidate
            @submit.prevent="saveGeneral"
          >
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              General
            </p>
            <CardBox :padded="false">
              <template #content>
                <fieldset
                  class="m-0 flex min-w-0 flex-col border-0 p-0"
                  :disabled="savingGeneral"
                >
                  <legend class="sr-only">General</legend>
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
                          v-model="general.name"
                          size="large"
                          :disabled="savingGeneral"
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
                          v-model="general.active"
                          aria-label="Active"
                          :disabled="savingGeneral"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </fieldset>
              </template>
              <template #footer>
                <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
                  <Button
                    label="Save"
                    kind="secondary"
                    size="medium"
                    :loading="savingGeneral"
                    :disabled="!generalDirty"
                    @click="saveGeneral"
                  />
                </div>
              </template>
            </CardBox>
          </form>

          <!-- Group 2 — Modules (its own independent Save). Keeps the ItemGroup
               pattern (Item.Title label + description left, Switch right), split
               into two section-titled CardBoxes: Default modules ship on every
               plan; Subscription modules are paid add-ons closed by a "Contact
               sales" CTA in the card footer. A locked module (Cache) is
               force-enabled account-wide, so its Switch stays on and disabled and
               its row carries a lock badge. One footer Save commits the group. -->
          <form
            class="flex flex-col gap-[var(--spacing-sm)]"
            aria-label="Module settings"
            novalidate
            @submit.prevent="saveModules"
          >
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Modules
            </p>

            <div class="flex min-w-0 flex-col gap-[var(--spacing-lg)]">
              <section
                v-for="group in moduleSections"
                :key="group.id"
                class="flex flex-col gap-[var(--spacing-sm)]"
              >
                <p class="px-[var(--spacing-xs)] text-label-md text-[var(--text-muted)]">
                  {{ group.label }}
                </p>
                <CardBox :padded="false">
                  <template #content>
                    <fieldset
                      class="m-0 flex min-w-0 flex-col border-0 p-0"
                      :disabled="savingModules"
                    >
                      <legend class="sr-only">{{ group.label }}</legend>
                      <Item.List>
                        <Item
                          v-for="mod in group.modules"
                          :key="mod.key"
                          size="small"
                        >
                          <Item.Content>
                            <Item.Title>
                              {{ mod.title }}
                              <Tag
                                v-if="mod.locked"
                                :label="mod.lockLabel"
                                icon="pi pi-lock"
                                severity="secondary"
                                size="small"
                              />
                            </Item.Title>
                            <Item.Description>{{ mod.description }}</Item.Description>
                          </Item.Content>
                          <Item.Actions class="flex-1 justify-end">
                            <!-- Subscription modules can't be toggled directly —
                                 activation is sales-driven, surfaced as a tooltip on
                                 the (disabled) switch. -->
                            <Tooltip
                              v-if="group.id === 'subscription'"
                              text="Contact sales to activate this module."
                            >
                              <Switch
                                v-model="modules[mod.key]"
                                disabled
                                :aria-label="mod.title"
                              />
                            </Tooltip>
                            <Switch
                              v-else
                              v-model="modules[mod.key]"
                              :disabled="mod.locked || savingModules"
                              :aria-label="mod.title"
                            />
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </fieldset>
                  </template>
                  <!-- Only the Default modules are user-toggleable, so the group's
                       Save lives in the Default card footer (same footer-Save
                       pattern as General). The Subscription card has no footer —
                       activation is sales-driven (see the switch tooltip). -->
                  <template v-if="group.id === 'default'" #footer>
                    <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
                      <Button
                        label="Save"
                        kind="secondary"
                        size="medium"
                        :loading="savingModules"
                        :disabled="!modulesDirty"
                        @click="saveModules"
                      />
                    </div>
                  </template>
                </CardBox>
              </section>
            </div>
          </form>
        </div>

        <!-- Build tab — the UI face of the repo's GitHub Actions deploy workflow
             (azion-deploy.yml). Each row maps to a workflow step; the "Latest
             deployment" card below mirrors azion/azion.json (the platform state
             the CLI commits back). The Deploy action is the workflow_dispatch
             analog: it simulates a build+deploy and bumps the prefix live. -->
        <div
          v-else-if="activeTab === 'build'"
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
        >
          <PageHeading
            title="Build"
            description="Connect your application to a Git repository for automatic builds and deployments."
            size="small"
          >
            <template #actions>
              <Button
                label="Deploy"
                kind="primary"
                size="medium"
                icon="pi pi-cloud-upload"
                :loading="deploying"
                @click="deploy"
              />
            </template>
          </PageHeading>

          <!-- Git repository — the connection (actions/checkout in the workflow).
               A connection, not editable config, so this ItemGroup has no Save. -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Git repository
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Connected repository</Item.Title>
                      <Item.Description>
                        <span class="inline-flex items-center gap-[var(--spacing-xxs)]">
                          <i
                            :class="`ai-cor ${presetIcon(buildConfig.preset)}`"
                            class="text-[1.05em]"
                            :title="presetLabel(buildConfig.preset)"
                            aria-hidden="true"
                          />
                          <i class="pi pi-github" aria-hidden="true" />
                          <!-- Same interaction as the Domain link below: the value is
                               the external link (hover underline + redirect arrow). -->
                          <a
                            :href="`https://github.com/${repository}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-[var(--spacing-xxs)] whitespace-nowrap text-label-sm text-[var(--text-default)] hover:underline"
                          >
                            <span>{{ repository }}</span>
                            <i class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
                          </a>
                        </span>
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end gap-[var(--spacing-xs)]">
                      <Button
                        label="Disconnect"
                        kind="danger"
                        size="small"
                        @click="comingSoon('Disconnect repository')"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Group 1 — Build configuration. Editable ItemGroup (Item.Title is the
               label; controls carry an aria-label) owning its OWN footer Save; the
               whole group locks off `savingBuildConfig` and stays disabled until a
               field diverges from its saved baseline. -->
          <form
            class="flex flex-col gap-[var(--spacing-sm)]"
            aria-label="Build configuration"
            novalidate
            @submit.prevent="saveBuildConfig"
          >
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Build configuration
            </p>
            <CardBox :padded="false">
              <template #content>
                <fieldset
                  class="m-0 flex min-w-0 flex-col border-0 p-0"
                  :disabled="savingBuildConfig"
                >
                  <legend class="sr-only">Build configuration</legend>
                  <Item.List>
                    <Item size="small" class="items-start">
                      <Item.Content>
                        <Item.Title>Framework preset</Item.Title>
                        <Item.Description>
                          The preset the Azion CLI builds with.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <!-- Detected from azion.config — not editable here. Disabled
                             control + a disabled HelperText explaining why. Width
                             matches the editable command fields below (container-sm)
                             so the group's right-column inputs share one edge — a
                             disabled field is not an excuse to collapse narrower. -->
                        <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                          <InputText
                            :model-value="presetLabel(buildConfig.preset)"
                            size="large"
                            disabled
                            class="w-full"
                            aria-label="Framework preset"
                          />
                          <HelperText
                            kind="disabled"
                            label="Detected from azion.config and can't be changed here."
                          />
                        </div>
                      </Item.Actions>
                    </Item>

                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Build command</Item.Title>
                        <Item.Description>The command that builds the application.</Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <InputText
                          v-model="buildConfig.buildCommand"
                          size="large"
                          :disabled="savingBuildConfig"
                          class="w-full max-w-[var(--container-sm)] font-code"
                          aria-label="Build command"
                        />
                      </Item.Actions>
                    </Item>

                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Deploy command</Item.Title>
                        <Item.Description>The command that deploys the build to the edge.</Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <InputText
                          v-model="buildConfig.deployCommand"
                          size="large"
                          :disabled="savingBuildConfig"
                          class="w-full max-w-[var(--container-sm)] font-code"
                          aria-label="Deploy command"
                        />
                      </Item.Actions>
                    </Item>

                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Root directory</Item.Title>
                        <Item.Description>The directory the build runs from.</Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <InputText
                          v-model="buildConfig.rootDirectory"
                          size="large"
                          :disabled="savingBuildConfig"
                          class="w-full max-w-[var(--container-2xs)] font-code"
                          aria-label="Root directory"
                        />
                      </Item.Actions>
                    </Item>

                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Build watch paths</Item.Title>
                        <Item.Description>Only changes to these paths trigger a build.</Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <InputText
                          v-model="buildConfig.watchPaths"
                          size="large"
                          :disabled="savingBuildConfig"
                          class="w-full max-w-[var(--container-2xs)] font-code"
                          aria-label="Build watch paths"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </fieldset>
              </template>
              <template #footer>
                <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
                  <Button
                    label="Save"
                    kind="secondary"
                    size="medium"
                    :loading="savingBuildConfig"
                    :disabled="!buildConfigDirty"
                    @click="saveBuildConfig"
                  />
                </div>
              </template>
            </CardBox>
          </form>

          <!-- Group 2 — Branch control. Its own ItemGroup, its own independent Save
               (locks off `savingBranch`, disabled until `branchDirty`). -->
          <form
            class="flex flex-col gap-[var(--spacing-sm)]"
            aria-label="Branch control"
            novalidate
            @submit.prevent="saveBranch"
          >
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Branch control
            </p>
            <CardBox :padded="false">
              <template #content>
                <fieldset
                  class="m-0 flex min-w-0 flex-col border-0 p-0"
                  :disabled="savingBranch"
                >
                  <legend class="sr-only">Branch control</legend>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Production branch</Item.Title>
                        <Item.Description>
                          Pushes to this branch deploy to production.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <InputText
                          v-model="branch.productionBranch"
                          size="large"
                          :disabled="savingBranch"
                          class="w-full max-w-[var(--container-2xs)] font-code"
                          aria-label="Production branch"
                        />
                      </Item.Actions>
                    </Item>

                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Builds for non-production branches</Item.Title>
                        <Item.Description>
                          Build and preview pushes to branches other than production.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <Switch
                          v-model="branch.nonProdBuilds"
                          aria-label="Builds for non-production branches"
                          :disabled="savingBranch"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </fieldset>
              </template>
              <template #footer>
                <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
                  <Button
                    label="Save"
                    kind="secondary"
                    size="medium"
                    :loading="savingBranch"
                    :disabled="!branchDirty"
                    @click="saveBranch"
                  />
                </div>
              </template>
            </CardBox>
          </form>

          <!-- Variables and secrets — the AZION_* set + app config injected into
               the build. Data-driven Table with a compact header and its action on
               the right (the AccountSettings list pattern), not an italic empty row. -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Variables and secrets
            </p>
            <CardBox :padded="false">
              <template #content>
                <Table
                  :data="variables"
                  :columns="variableColumns"
                  row-key="id"
                  enable-sorting
                  header-kind="compact"
                  :border="false"
                >
                  <template #toolbar>
                    <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                      <Table.Search
                        size="large"
                        placeholder="Search variables..."
                        class="flex-1"
                      />
                      <Button
                        label="Add Variable"
                        kind="primary"
                        size="medium"
                        icon="pi pi-plus"
                        @click="addVariable"
                      />
                    </div>
                  </template>

                  <template #cell-value="{ row }">
                    <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                      <span class="truncate text-label-code-sm text-[var(--text-muted)]">
                        {{ row.secret ? "••••••••••••" : row.value }}
                      </span>
                      <CopyButton kind="outlined" :value="row.value" aria-label="Copy value" />
                    </div>
                  </template>

                  <template #cell-secret="{ value }">
                    <Tag
                      :label="value ? 'Secret' : 'Variable'"
                      :severity="value ? 'warning' : 'secondary'"
                      size="medium"
                    />
                  </template>

                  <template #cell-actions="{ row }">
                    <Tooltip text="Remove variable">
                      <IconButton
                        icon="pi pi-trash"
                        kind="outlined"
                        size="small"
                        aria-label="Remove variable"
                        @click="(event) => removeVariable(event, row)"
                      />
                    </Tooltip>
                  </template>
                </Table>
              </template>
            </CardBox>
          </section>

          <!-- Deployment — the API token + build cache affordances (single values /
               toggles, so an ItemGroup rather than a table). -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Deployment
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <!-- API token — the AZION_PERSONAL_TOKEN GitHub secret. The
                       token name is the field VALUE on the right: a readonly
                       InputText with a copy addon (InputGroup), not buried in the
                       description. -->
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>API token</Item.Title>
                      <Item.Description>
                        Stored as the AZION_PERSONAL_TOKEN GitHub secret.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputGroup class="w-full max-w-[var(--container-sm)]">
                        <InputText
                          :model-value="apiTokenName"
                          size="large"
                          class="flex-1"
                          aria-label="API token"
                          readonly
                        />
                        <CopyButton
                          kind="transparent"
                          :value="apiTokenName"
                          aria-label="Copy API token"
                        />
                      </InputGroup>
                    </Item.Actions>
                  </Item>

                  <!-- Build cache — a switch on the right (field-on-right
                       pattern). When on, its options are revealed in the group
                       below. -->
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Build cache</Item.Title>
                      <Item.Description>
                        Reuse cached build artifacts across deploys to speed up
                        builds.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Switch
                        v-model="buildCacheEnabled"
                        aria-label="Build cache"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Revealed only when the build cache is on: its options as a standard
               ItemGroup section (same anatomy as every other section — a section
               title over a flush CardBox whose body is an Item.List, one Item row
               per option, control on the right). Applied live; the Deployment
               section carries no group Save. -->
          <section
            v-if="buildCacheEnabled"
            class="flex flex-col gap-[var(--spacing-sm)]"
          >
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Build cache settings
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Cache scope</Item.Title>
                      <Item.Description>
                        Whether each branch keeps its own cache or all branches
                        share one.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Select
                        v-model="buildCache.scope"
                        size="large"
                        class="w-full max-w-[var(--container-sm)]"
                        :display-value="buildCacheScopeLabel"
                      >
                        <Select.Trigger aria-label="Cache scope" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in buildCacheScopeOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Auto-invalidate on config change</Item.Title>
                      <Item.Description>
                        Discard the cache automatically when the build
                        configuration changes.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Switch
                        v-model="buildCache.autoInvalidate"
                        aria-label="Auto-invalidate on config change"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Clear cache</Item.Title>
                      <Item.Description>
                        Remove all cached build artifacts; the next deploy rebuilds
                        from scratch.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Button
                        type="button"
                        label="Clear cache"
                        kind="outlined"
                        size="medium"
                        icon="pi pi-refresh"
                        @click="comingSoon('Clear build cache')"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Latest deployment — mirrors azion/azion.json (API ⇆ UI) -->
          <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
            Latest deployment
          </p>
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Domain</Item.Title>
                    <Item.Description>The edge domain serving this application.</Item.Description>
                  </Item.Content>
                  <Item.Actions class="flex-1 justify-end gap-[var(--spacing-xs)]">
                    <!-- Same view-details logic + external-redirect arrow. -->
                    <a
                      :href="azionState.domainUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-[var(--spacing-xxs)] whitespace-nowrap text-label-sm text-[var(--text-default)] hover:underline"
                    >
                      <span>{{ azionState.domainName }}</span>
                      <i class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
                    </a>
                    <CopyButton
                      kind="outlined"
                      :value="azionState.domainUrl"
                      aria-label="Copy domain URL"
                    />
                  </Item.Actions>
                </Item>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Application ID</Item.Title>
                  </Item.Content>
                  <Item.Actions class="flex-1 justify-end gap-[var(--spacing-xs)]">
                    <span class="text-label-code-sm">{{ azionState.applicationId }}</span>
                    <CopyButton
                      kind="outlined"
                      :value="azionState.applicationId"
                      aria-label="Copy application ID"
                    />
                  </Item.Actions>
                </Item>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Environment</Item.Title>
                  </Item.Content>
                  <Item.Actions class="flex-1 justify-end">
                    <Tag :label="azionState.env" severity="secondary" size="medium" />
                  </Item.Actions>
                </Item>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Last deploy</Item.Title>
                  </Item.Content>
                  <Item.Actions class="flex-1 justify-end">
                    <span class="text-[var(--text-muted)]">{{ lastDeploy }}</span>
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </div>

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
                                :label="errors.name"
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
                                :label="errors.regex"
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
                                :label="functionErrors.name"
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
                                :label="functionErrors.runtime"
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
