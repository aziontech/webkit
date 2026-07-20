<script setup>
// Add Domain — the sub-drawer opened from the Domains section of Create Workload.
// A MEDIUM drawer whose body chooses between a free azion.app subdomain and a
// custom ("bring your own") domain, then captures the domain, the environment it
// serves, and an optional digital certificate. On save it emits the domain
// record back to the parent, which appends it to the Domains list.
//
// Same discipline as every form drawer here: one `submitting` flag locks the
// scope, validation runs on submit only (amber `required` HelperText, cleared on
// edit), and the drawer resets when it closes.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import FieldRadioBlock from "@aziontech/webkit/field-radio-block";
import HelperText from "@aziontech/webkit/helper-text";
import InputGroup, { InputGroupAddon } from "@aziontech/webkit/input-group";
import InputText from "@aziontech/webkit/input-text";
import Label from "@aziontech/webkit/label";
import Message from "@aziontech/webkit/message";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import Select from "@aziontech/webkit/select";
import { toast } from "@aziontech/webkit/toast";
import { reactive, ref, watch } from "vue";

// Two-way open state; the parent binds v-model:open.
const open = defineModel("open", { type: Boolean, default: false });

// `save` carries the finished domain record (event-free — it's a form commit,
// not a DOM activation).
const emit = defineEmits(["save"]);

const kindOptions = [
  {
    value: "free",
    label: "Get a free Azion Domain",
    description: "You can use a free azion.app domain.",
  },
  {
    value: "own",
    label: "Bring my own Domain",
    description: "Use your own DNS and point it to your Azion workload.",
  },
];

const environmentOptions = [
  { value: "Production", label: "Production" },
  { value: "Stage", label: "Stage" },
];
const certificateOptions = [
  { value: "azion", label: "Azion (SAN)" },
  { value: "lets-encrypt", label: "Let's Encrypt" },
  { value: "none", label: "No certificate" },
];

const labelFor = (list) => (value) =>
  list.find((option) => option.value === value)?.label ?? "";

const form = reactive({
  kind: "free",
  domain: "",
  environment: "Production",
  certificate: "azion",
});
const errors = reactive({ domain: "" });
const submitting = ref(false);

// Reset every field when the drawer closes so the next open starts clean.
watch(open, (isOpen) => {
  if (isOpen) return;
  form.kind = "free";
  form.domain = "";
  form.environment = "Production";
  form.certificate = "azion";
  errors.domain = "";
});

const validate = () => {
  errors.domain = form.domain.trim() ? "" : "This field is required.";
  return !errors.domain;
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
    const suffix = form.kind === "free" ? ".azion.app" : "";
    emit("save", {
      id: `domain-${Date.now()}`,
      domain: `${form.domain.trim()}${suffix}`,
      environment: form.environment,
      certificate: labelFor(certificateOptions)(form.certificate),
    });
    open.value = false;
  } catch (error) {
    // Request-level failure surfaces here (the parent only sees a successful
    // `save`), so report it where the user is looking — never silently.
    toast.error("Couldn't add the domain.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false; // release on success AND failure
  }
};
</script>

<template>
  <Drawer v-model:open="open" size="medium" side="right">
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Add Domain"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
              <DrawerTitle>Add Domain</DrawerTitle>
              <p class="text-body-sm text-[var(--text-muted)]">
                Attach a domain to this workload and choose the environment it serves.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Add Domain</legend>

              <!-- Domain source -->
              <fieldset class="flex flex-col gap-[var(--spacing-sm)]">
                <legend class="sr-only">Domain source</legend>
                <FieldRadioBlock
                  v-for="option in kindOptions"
                  :key="option.value"
                  v-model="form.kind"
                  :value="option.value"
                  name="domain-kind"
                  :input-id="`domain-kind-${option.value}`"
                  :label="option.label"
                  :description="option.description"
                  :disabled="submitting"
                />
              </fieldset>

              <!-- Domain + environment + certificate -->
              <CardBox :padded="false">
                <template #content>
                  <div class="flex flex-col gap-[var(--spacing-lg)] p-[var(--spacing-md)]">
                    <div class="flex flex-col gap-[var(--spacing-xs)]">
                      <Label for="add-domain-input" required>Domain</Label>
                      <InputGroup :disabled="submitting">
                        <InputText
                          id="add-domain-input"
                          v-model="form.domain"
                          size="large"
                          class="flex-1"
                          placeholder="my-workload"
                          :disabled="submitting"
                          :required="!!errors.domain"
                          :aria-describedby="errors.domain ? 'add-domain-error' : undefined"
                          @update:model-value="errors.domain = ''"
                        />
                        <InputGroupAddon v-if="form.kind === 'free'">.azion.app</InputGroupAddon>
                      </InputGroup>
                      <HelperText
                        v-if="errors.domain"
                        id="add-domain-error"
                        kind="required"
                        :label="errors.domain"
                      />
                    </div>

                    <Message
                      severity="info"
                      title="Your workload is always accessible at an azion.app subdomain based on the workload name."
                      description="Custom domains allow visitors to reach your project at your own domain."
                    />

                    <div class="flex flex-col gap-[var(--spacing-xs)]">
                      <Label for="add-domain-environment">Environment</Label>
                      <Select
                        v-model="form.environment"
                        size="large"
                        class="w-full"
                        :disabled="submitting"
                        :display-value="labelFor(environmentOptions)"
                      >
                        <Select.Trigger id="add-domain-environment" />
                        <!-- Select.Content teleports to <body> at z-50; inside the
                             Drawer panel (z-[1001]) it needs a higher z to show. -->
                        <Select.Content class="!z-[1002]">
                          <Select.Option
                            v-for="option in environmentOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </div>

                    <div class="flex flex-col gap-[var(--spacing-xs)]">
                      <Label for="add-domain-certificate">Digital Certificate</Label>
                      <Select
                        v-model="form.certificate"
                        size="large"
                        class="w-full"
                        :disabled="submitting"
                        :display-value="labelFor(certificateOptions)"
                      >
                        <Select.Trigger id="add-domain-certificate" />
                        <Select.Content class="!z-[1002]">
                          <Select.Option
                            v-for="option in certificateOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </div>
                  </div>
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
</template>
