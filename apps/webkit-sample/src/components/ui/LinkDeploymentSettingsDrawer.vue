<script setup>
// Link Deployment Settings — the sub-drawer opened from an environment row in the
// Environments section of Create Workload. It binds a Deployment Settings bundle
// to one environment, and the resources it carries (Application, Firewall, and a
// Custom Page) each at a chosen version. On save it emits the linked bundle back
// to the parent, which flips that environment row from "unlinked" to "linked".
//
// Same discipline as every form drawer: one `submitting` flag locks the scope,
// validation runs on submit only, and the drawer resets when it closes.
import Button from "@aziontech/webkit/button";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import HelperText from "@aziontech/webkit/helper-text";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import Select from "@aziontech/webkit/select";
import { computed, reactive, ref, watch } from "vue";

const open = defineModel("open", { type: Boolean, default: false });

const props = defineProps({
  // The environment this bundle links to; drives the title and the emitted record.
  environment: { type: String, default: "Production" },
});

const emit = defineEmits(["link"]);

const title = computed(() => `Link Deployment Settings to ${props.environment}`);

const bundleOptions = [
  { value: "default", label: "Default Deployment" },
  { value: "azion", label: "Azion Deployment" },
  { value: "custom", label: "Custom Bundle" },
];
const applicationOptions = [
  { value: "my-app", label: "My app" },
  { value: "web", label: "web-frontend" },
  { value: "api", label: "api-gateway" },
];
const firewallOptions = [
  { value: "default-fw", label: "Default Firewall" },
  { value: "edge-fw", label: "edge-firewall" },
];
const customPageOptions = [
  { value: "default-page", label: "Default Custom Page" },
  { value: "maintenance", label: "maintenance-page" },
];
const versionOptions = [
  { value: "latest", label: "Latest" },
  { value: "v2", label: "v2.0.0" },
  { value: "v1", label: "v1.0.0" },
];

const labelFor = (list) => (value) =>
  list.find((option) => option.value === value)?.label ?? "";

const form = reactive({
  bundle: "",
  application: "",
  applicationVersion: "latest",
  firewall: "",
  firewallVersion: "latest",
  customPage: "",
  customPageVersion: "latest",
});
const errors = reactive({
  bundle: "",
  application: "",
  firewall: "",
  customPage: "",
});
const submitting = ref(false);

watch(open, (isOpen) => {
  if (isOpen) return;
  form.bundle = "";
  form.application = "";
  form.applicationVersion = "latest";
  form.firewall = "";
  form.firewallVersion = "latest";
  form.customPage = "";
  form.customPageVersion = "latest";
  errors.bundle = "";
  errors.application = "";
  errors.firewall = "";
  errors.customPage = "";
});

const validate = () => {
  errors.bundle = form.bundle ? "" : "Select a deployment settings bundle.";
  errors.application = form.application ? "" : "Select an application.";
  errors.firewall = form.firewall ? "" : "Select a firewall.";
  errors.customPage = form.customPage ? "" : "Select a custom page.";
  return !errors.bundle && !errors.application && !errors.firewall && !errors.customPage;
};

const cancel = () => {
  open.value = false;
};

const submit = async () => {
  if (submitting.value) return;
  if (!validate()) return;

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));
    emit("link", {
      environment: props.environment,
      bundle: labelFor(bundleOptions)(form.bundle),
      application: {
        name: labelFor(applicationOptions)(form.application),
        version: labelFor(versionOptions)(form.applicationVersion),
      },
      firewall: {
        name: labelFor(firewallOptions)(form.firewall),
        version: labelFor(versionOptions)(form.firewallVersion),
      },
      customPage: {
        name: labelFor(customPageOptions)(form.customPage),
        version: labelFor(versionOptions)(form.customPageVersion),
      },
    });
    open.value = false;
  } finally {
    submitting.value = false;
  }
};

// The three resource rows share one shape, so the template renders them from a
// small model to avoid repeating the Select markup four times.
const resourceRows = computed(() => [
  {
    key: "application",
    label: "Application",
    options: applicationOptions,
    valueKey: "application",
    versionKey: "applicationVersion",
    error: errors.application,
  },
  {
    key: "firewall",
    label: "Firewall",
    options: firewallOptions,
    valueKey: "firewall",
    versionKey: "firewallVersion",
    error: errors.firewall,
  },
  {
    key: "customPage",
    label: "Custom Page",
    options: customPageOptions,
    valueKey: "customPage",
    versionKey: "customPageVersion",
    error: errors.customPage,
  },
]);
</script>

<template>
  <Drawer v-model:open="open" size="medium" side="right">
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="title"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
              <DrawerTitle>{{ title }}</DrawerTitle>
              <p class="text-body-sm text-[var(--text-muted)]">
                Choose the Deployment Settings bundle for this environment.
                Application, Firewall, and Custom Pages will apply to this workload.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">{{ title }}</legend>

              <!-- Deployment Settings bundle -->
              <div class="flex flex-col gap-[var(--spacing-xs)]">
                <span class="text-label-md text-[var(--text-default)]">
                  Deployment Settings <span class="text-[var(--text-muted)]">(Required)</span>
                </span>
                <Select
                  v-model="form.bundle"
                  size="large"
                  class="w-full"
                  placeholder="Select an option..."
                  :required="!!errors.bundle"
                  :display-value="labelFor(bundleOptions)"
                  @update:model-value="errors.bundle = ''"
                >
                  <Select.Trigger
                    aria-label="Deployment Settings"
                    :aria-describedby="errors.bundle ? 'link-bundle-error' : undefined"
                  />
                  <Select.Content class="!z-[1002]">
                    <Select.Option
                      v-for="option in bundleOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
                <HelperText
                  v-if="errors.bundle"
                  id="link-bundle-error"
                  kind="required"
                  :label="errors.bundle"
                />
              </div>

              <!-- Resources -->
              <div class="flex flex-col gap-[var(--spacing-md)]">
                <p class="text-overline-sm uppercase text-[var(--text-muted)]">
                  Deployment Resources
                </p>

                <div
                  v-for="row in resourceRows"
                  :key="row.key"
                  class="flex flex-col gap-[var(--spacing-sm)] sm:flex-row sm:items-start"
                >
                  <!-- Resource select -->
                  <div class="flex flex-1 flex-col gap-[var(--spacing-xs)]">
                    <span class="text-label-md text-[var(--text-default)]">
                      {{ row.label }} <span class="text-[var(--text-muted)]">(Required)</span>
                    </span>
                    <Select
                      v-model="form[row.valueKey]"
                      size="large"
                      class="w-full"
                      placeholder="Select an option..."
                      :required="!!row.error"
                      :display-value="labelFor(row.options)"
                      @update:model-value="errors[row.key] = ''"
                    >
                      <Select.Trigger
                        :aria-label="row.label"
                        :aria-describedby="row.error ? `link-${row.key}-error` : undefined"
                      />
                      <Select.Content class="!z-[1002]">
                        <Select.Option
                          v-for="option in row.options"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                    <HelperText
                      v-if="row.error"
                      :id="`link-${row.key}-error`"
                      kind="required"
                      :label="row.error"
                    />
                  </div>

                  <!-- Version select -->
                  <div class="flex w-full flex-col gap-[var(--spacing-xs)] sm:w-[var(--container-3xs)]">
                    <span class="text-label-md text-[var(--text-default)]">Version</span>
                    <Select
                      v-model="form[row.versionKey]"
                      size="large"
                      class="w-full"
                      :display-value="labelFor(versionOptions)"
                    >
                      <Select.Trigger :aria-label="`${row.label} version`" />
                      <Select.Content class="!z-[1002]">
                        <Select.Option
                          v-for="option in versionOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </div>
                </div>
              </div>
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
            <Button
              class="w-full md:w-auto"
              label="Link Settings"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
            />
            <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">
              Link Settings
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
