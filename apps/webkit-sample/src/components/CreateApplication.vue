<script setup>
// The Applications module "create" flow — a dedicated PAGE (route
// /applications/new), sidebar hidden so the form is the only focus.
//
// Layout is Cards + ItemGroups (the `/form` skill, Approach A): a single centered
// column of sections, each an section title over a flush CardBox whose body is an
// Item.List. Every field is a small Item row (`size="small"`) — in an ItemGroup the
// Item.Title IS the label (name in Item.Title, guidance in Item.Description) on the
// left via Item.Content, the control on the right via Item.Actions. Richer controls
// that don't fit a one-line row — the radio groups — stay as full-width blocks.
//
// Accessibility (the `/form` skill):
//   - the Item.Title names each field; the control carries an aria-label so it has
//     an accessible name (no <Label for> — that's reserved for Fields-separated);
//   - validation runs on submit only; with no Label the feedback is a HelperText
//     under the control. These fields are required-only, so the state is amber
//     `required` (required is NOT an error — never the red `invalid`), rendered on
//     submit and cleared as the user edits. No error-summary;
//   - one `submitting` flag locks the whole scope (outer <fieldset :disabled> +
//     Save :loading); request/API errors surface via toast.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import FieldRadioBlock from "@aziontech/webkit/field-radio-block";
import HelperText from "@aziontech/webkit/helper-text";
import InputNumber from "@aziontech/webkit/input-number";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import MultiSelect from "@aziontech/webkit/multi-select";
import Switch from "@aziontech/webkit/switch";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import CreationHeader from "./ui/CreationHeader.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// --- Field option models -------------------------------------------------
const protocolUsageOptions = [
  {
    value: "http",
    label: "HTTP support",
    description:
      "Use only the HTTP protocol. Choose from the available HTTP ports.",
  },
  {
    value: "https",
    label: "HTTP and HTTPS support",
    description:
      "Use both HTTP and HTTPS protocols. Choose from the available HTTP and HTTPS ports.",
  },
  {
    value: "http3",
    label: "HTTP/3 support",
    description:
      "Use both HTTP and HTTPS protocols and enable HTTP/3 support. Only available for HTTP port 80 and HTTPS port 443.",
  },
];
const httpPortOptions = [
  { label: "80 (Default)", value: "80" },
  { label: "8080", value: "8080" },
  { label: "8008", value: "8008" },
];
const httpsPortOptions = [
  { label: "443 (Default)", value: "443" },
  { label: "8443", value: "8443" },
];
const protocolPolicyOptions = [
  { value: "preserve", label: "Preserve HTTP/HTTPS" },
  { value: "http", label: "Enforce HTTP" },
  { value: "https", label: "Enforce HTTPS" },
];
const browserCacheOptions = [
  { value: "override", label: "Override cache settings" },
  {
    value: "honor",
    label: "Honor cache policies",
    description:
      "Honor cache policies from the origin or define a new maximum cache TTL for browsers.",
  },
];
const edgeCacheOptions = [
  { value: "override", label: "Override cache settings" },
  {
    value: "honor",
    label: "Honor cache policies",
    description:
      "Honor cache policies from the origin or define a new maximum cache TTL for the edge. If a TTL isn't received from the origin, cache will be maintained at a default TTL.",
  },
];

// Trigger label for the port multi-selects (maps stored values → labels).
const portsLabel = (list) => (values) =>
  (values ?? [])
    .map((value) => list.find((option) => option.value === value)?.label ?? value)
    .join(", ");

// --- Form state ----------------------------------------------------------
const form = reactive({
  name: "",
  protocolUsage: "http",
  httpPorts: ["80"],
  httpsPorts: ["443"],
  protocolPolicy: "preserve",
  address: "",
  hostHeader: "${host}",
  browserCache: "override",
  browserMaxTtl: 0,
  edgeCache: "override",
  edgeMaxTtl: 60,
  debugRules: false,
});

// HTTPS ports only apply when the app serves HTTPS.
const httpsEnabled = computed(() => form.protocolUsage !== "http");

// Per-field error messages. Empty string = valid.
const errors = reactive({
  name: "",
  httpPorts: "",
  address: "",
  hostHeader: "",
});

// One flag locks the whole scope while the request is in flight.
const submitting = ref(false);

// --- Validation ----------------------------------------------------------
// Runs on submit only. A non-empty error flag drives the field's `required`
// indicator and `:invalid` state — the feedback IS the field, rendered as a
// result of the submit and cleared as the user edits.
const validate = () => {
  errors.name = form.name.trim() ? "" : "This field is required.";
  errors.httpPorts = form.httpPorts.length ? "" : "Select at least one HTTP port.";
  errors.address = form.address.trim() ? "" : "This field is required.";
  errors.hostHeader = form.hostHeader.trim() ? "" : "This field is required.";
  return !errors.name && !errors.httpPorts && !errors.address && !errors.hostHeader;
};

const cancel = () =>
  router.push({ path: "/applications", query: { email: userEmail.value } });

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock

  // Validation feedback is now on the fields themselves (required + :invalid).
  if (!validate()) return;

  // Lock the scope off one flag (usability Pattern 1): Save shows :loading and
  // every field is :disabled while the create request is in flight.
  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success(`Application "${form.name}" created.`);
    router.push({ path: "/applications", query: { email: userEmail.value } });
  } catch (error) {
    // Request-level failure → toast with a way to recover. Never silent.
    toast.error("Could not create the application.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false; // release on success AND failure
  }
};
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <CreationHeader
      :breadcrumb="[
        { label: 'Applications', href: '/applications' },
        { label: 'Create Application' },
      ]"
      back-label="Back to Applications"
      @back="cancel"
      @navigate="cancel"
    />
    <main class="min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        aria-label="Create Application"
        novalidate
        @submit.prevent="submit"
      >
      <!-- Scrollable form body -->
      <div
        class="mx-auto flex w-full max-w-[var(--container-7xl)] flex-1 flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]"
      >
        <!-- One flag locks every control while the request is in flight. -->
        <fieldset
          class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">Create application</legend>

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
                        Give a unique and descriptive name to identify the Application.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <!-- Empty-required → amber `required` HelperText (not red). -->
                      <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                        <InputText
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          placeholder="My Application"
                          :required="!!errors.name"
                          :aria-describedby="errors.name ? 'app-name-error' : undefined"
                          @update:model-value="errors.name = ''"
                        />
                        <HelperText
                          v-if="errors.name"
                          id="app-name-error"
                          kind="required"
                          :value="errors.name"
                        />
                      </div>
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Delivery Settings -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Delivery Settings
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small" class="items-start">
                    <Item.Content>
                      <Item.Title>Protocol Usage</Item.Title>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <fieldset class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-sm)]">
                        <legend class="sr-only">Protocol Usage</legend>
                        <FieldRadioBlock
                          v-for="option in protocolUsageOptions"
                          :key="option.value"
                          v-model="form.protocolUsage"
                          :value="option.value"
                          name="protocolUsage"
                          :input-id="`app-protocolUsage-${option.value}`"
                          :label="option.label"
                          :description="option.description"
                        />
                      </fieldset>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>HTTP Ports</Item.Title>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                        <MultiSelect
                          v-model="form.httpPorts"
                          size="large"
                          class="w-full"
                          placeholder="Select ports"
                          :required="!!errors.httpPorts"
                          :display-value="portsLabel(httpPortOptions)"
                          @update:model-value="errors.httpPorts = ''"
                        >
                          <MultiSelect.Trigger
                            id="app-httpPorts"
                            aria-label="HTTP Ports"
                            :aria-describedby="errors.httpPorts ? 'app-httpPorts-error' : undefined"
                          />
                          <MultiSelect.Content>
                            <MultiSelect.Option
                              v-for="option in httpPortOptions"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </MultiSelect.Option>
                          </MultiSelect.Content>
                        </MultiSelect>
                        <HelperText
                          v-if="errors.httpPorts"
                          id="app-httpPorts-error"
                          kind="required"
                          :value="errors.httpPorts"
                        />
                      </div>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>HTTPS Ports</Item.Title>
                      <Item.Description>
                        Applies when the Application serves HTTPS traffic.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <MultiSelect
                        v-model="form.httpsPorts"
                        size="large"
                        class="w-full max-w-[var(--container-sm)]"
                        placeholder="443 (Default)"
                        :disabled="!httpsEnabled"
                        :display-value="portsLabel(httpsPortOptions)"
                      >
                        <MultiSelect.Trigger aria-label="HTTPS Ports" />
                        <MultiSelect.Content>
                          <MultiSelect.Option
                            v-for="option in httpsPortOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Option>
                        </MultiSelect.Content>
                      </MultiSelect>
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Origins -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Origins
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Origin Type</Item.Title>
                      <Item.Description>
                        The origin type is pre-defined and can't be customized.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText
                        model-value="Single Origin"
                        size="large"
                        class="w-full max-w-[var(--container-sm)]"
                        aria-label="Origin Type"
                        readonly
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small" class="items-start">
                    <Item.Content>
                      <Item.Title>Protocol Policy</Item.Title>
                      <Item.Description>
                        Select the protocol usage between the edge nodes and the
                        origin.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <fieldset class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-sm)]">
                        <legend class="sr-only">Protocol Policy</legend>
                        <FieldRadioBlock
                          v-for="option in protocolPolicyOptions"
                          :key="option.value"
                          v-model="form.protocolPolicy"
                          :value="option.value"
                          name="protocolPolicy"
                          :input-id="`app-protocolPolicy-${option.value}`"
                          :label="option.label"
                        />
                      </fieldset>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Address</Item.Title>
                      <Item.Description>
                        Define an origin for the content in FQDN format or an IPv4/IPv6 address.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                        <InputText
                          v-model="form.address"
                          size="large"
                          class="w-full"
                          aria-label="Address"
                          placeholder="example.com"
                          :required="!!errors.address"
                          :aria-describedby="errors.address ? 'app-address-error' : undefined"
                          @update:model-value="errors.address = ''"
                        />
                        <HelperText
                          v-if="errors.address"
                          id="app-address-error"
                          kind="required"
                          :value="errors.address"
                        />
                      </div>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Host Header</Item.Title>
                      <Item.Description>
                        Identify a virtualhost sent in the Host header to the origin.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                        <InputText
                          v-model="form.hostHeader"
                          size="large"
                          class="w-full"
                          aria-label="Host Header"
                          :required="!!errors.hostHeader"
                          :aria-describedby="errors.hostHeader ? 'app-hostHeader-error' : undefined"
                          @update:model-value="errors.hostHeader = ''"
                        />
                        <HelperText
                          v-if="errors.hostHeader"
                          id="app-hostHeader-error"
                          kind="required"
                          :value="errors.hostHeader"
                        />
                      </div>
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Cache Expiration Policies -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Cache Expiration Policies
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small" class="items-start">
                    <Item.Content>
                      <Item.Title>Browser Cache Settings</Item.Title>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <fieldset class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-sm)]">
                        <legend class="sr-only">Browser Cache Settings</legend>
                        <FieldRadioBlock
                          v-for="option in browserCacheOptions"
                          :key="option.value"
                          v-model="form.browserCache"
                          :value="option.value"
                          name="browserCache"
                          :input-id="`app-browserCache-${option.value}`"
                          :label="option.label"
                          :description="option.description"
                        />
                      </fieldset>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Maximum TTL (seconds)</Item.Title>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputNumber
                        v-model="form.browserMaxTtl"
                        size="large"
                        class="w-full max-w-[var(--container-sm)]"
                        :min="0"
                        aria-label="Browser maximum TTL in seconds"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small" class="items-start">
                    <Item.Content>
                      <Item.Title>Cache Settings</Item.Title>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <fieldset class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-sm)]">
                        <legend class="sr-only">Cache Settings</legend>
                        <FieldRadioBlock
                          v-for="option in edgeCacheOptions"
                          :key="option.value"
                          v-model="form.edgeCache"
                          :value="option.value"
                          name="edgeCache"
                          :input-id="`app-edgeCache-${option.value}`"
                          :label="option.label"
                          :description="option.description"
                        />
                      </fieldset>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Maximum TTL (seconds)</Item.Title>
                      <Item.Description>
                        Enable Application Accelerator in the Main Settings tab to
                        use values lower than 60 seconds. Tiered Cache requires
                        cache TTL to be equal to or greater than 3 seconds.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputNumber
                        v-model="form.edgeMaxTtl"
                        size="large"
                        class="w-full max-w-[var(--container-sm)]"
                        :min="0"
                        aria-label="Edge maximum TTL in seconds"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Debug Rules -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Debug Rules
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Active</Item.Title>
                      <Item.Description>
                        Rules that were successfully executed will be shown under
                        the $traceback field in Data Streaming and Real-Time
                        Events or the $stacktrace variable in GraphQL.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Switch
                        v-model:isToggled="form.debugRules"
                        aria-label="Active"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>
        </fieldset>
      </div>

      <!-- Sticky action bar. Save is the native submit (Enter works); the
           scope stays locked while the request is in flight. -->
      <footer
        class="sticky bottom-0 border-t-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]"
      >
        <div
          class="flex w-full items-center justify-end gap-[var(--spacing-sm)] p-[var(--spacing-lg)]"
        >
          <Button
            type="button"
            label="Cancel"
            kind="outlined"
            size="medium"
            :disabled="submitting"
            @click="cancel"
          />
          <!-- webkit Button renders a native type="button" and does not forward
               a type prop, so it can't submit the form implicitly — drive submit
               from its click event instead. -->
          <Button
            label="Save"
            kind="primary"
            size="medium"
            :loading="submitting"
            @click="submit"
          />
        </div>
      </footer>
      </form>
    </main>
  </div>
</template>
