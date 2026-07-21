<script setup>
// Edge DNS — create zone flow. A focused creation shell (the /navigation skill):
// the console sidebar is dropped so the single task owns the screen, and the
// only chrome is one CreationHeader (back + brand + breadcrumb + account
// avatar). The module create for a resource with a start and an end lands on a
// dedicated PAGE (route /edge-dns/new), not a modal, so it is linkable and
// back-button-safe.
//
// Layout is section cards (the /form Fields-separated approach composed inside a
// CardBox two-column grid): each section puts its title + guidance on the left
// and the field(s) on the right. General (Name) and Domain Name are required;
// DNSSEC and Status are switches (the detailed DNSSEC key values are surfaced in
// the zone's Main Settings once it exists). Validation runs on submit only —
// empty required fields reveal the amber `required` state (a prompt, NOT the red
// `invalid` error). One `submitting` flag locks the whole scope (fieldset
// :disabled + every control :disabled + Save :loading, the /usability Pattern 1
// lock); request-level failures surface via toast.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import HelperText from "@aziontech/webkit/helper-text";
import InputText from "@aziontech/webkit/input-text";
import Label from "@aziontech/webkit/label";
import Switch from "@aziontech/webkit/switch";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import CreationHeader from "./ui/CreationHeader.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

const form = reactive({
  name: "",
  domain: "",
  dnssec: false,
  active: true,
});
const errors = reactive({ name: "", domain: "" });

// One flag locks the whole scope while the create request is in flight.
const submitting = ref(false);

// Validation runs on submit only. An empty error string means valid; a populated
// one drives the field's amber `required` state and its HelperText message.
const validate = () => {
  errors.name = form.name.trim() ? "" : "This field is required.";
  errors.domain = form.domain.trim() ? "" : "This field is required.";
  return !errors.name && !errors.domain;
};

const cancel = () =>
  router.push({ path: "/edge-dns", query: { email: userEmail.value } });

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock
  if (!validate()) return; // feedback is now on the fields themselves

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const name = form.name.trim();
    const domain = form.domain.trim();
    const id = String(Math.floor(1000 + Math.random() * 9000));
    toast.success(`Zone "${name}" created.`);
    // Land on the new zone's detail view, carrying its name + domain so the
    // header and Records drawer read them without a round-trip.
    router.push({
      path: `/edge-dns/${id}`,
      query: { email: userEmail.value, name, domain },
    });
  } catch (error) {
    toast.error("Could not create the zone.", {
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
        { label: 'Edge DNS', href: '/edge-dns' },
        { label: 'Zone', href: '/edge-dns' },
        { label: 'Create' },
      ]"
      back-label="Back to Edge DNS"
      @back="cancel"
      @navigate="cancel"
    />

    <main class="min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        aria-label="Create zone"
        novalidate
        @submit.prevent="submit"
      >
        <!-- Scrollable form body -->
        <div
          class="mx-auto flex w-full max-w-[var(--container-7xl)] flex-1 flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]"
        >
          <p class="text-body-sm text-[var(--text-muted)]">
            Configure DNS records and zone settings used for authoritative domain
            resolution.
          </p>

          <!-- One flag locks every control while the request is in flight. -->
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create zone</legend>

            <!-- Section: General -->
            <CardBox>
              <template #content>
                <div class="grid grid-cols-1 gap-[var(--spacing-lg)] md:grid-cols-2">
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <h2 class="text-heading-xs text-[var(--text-default)]">General</h2>
                    <p class="text-body-sm text-[var(--text-muted)]">
                      Create zones to host your domains on Azion's distributed
                      infrastructure.
                    </p>
                  </div>

                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <Label for="zone-name" required>Name</Label>
                    <InputText
                      id="zone-name"
                      v-model="form.name"
                      size="large"
                      class="w-full"
                      placeholder="My zone"
                      autocomplete="off"
                      :required="!!errors.name"
                      :aria-describedby="errors.name ? 'zone-name-error' : 'zone-name-help'"
                      @update:model-value="errors.name = ''"
                    />
                    <HelperText
                      v-if="errors.name"
                      id="zone-name-error"
                      kind="required"
                      :label="errors.name"
                    />
                    <HelperText
                      v-else
                      id="zone-name-help"
                      label="Give a unique and descriptive name to identify your zone."
                    />
                  </div>
                </div>
              </template>
            </CardBox>

            <!-- Section: Domain Name -->
            <CardBox>
              <template #content>
                <div class="grid grid-cols-1 gap-[var(--spacing-lg)] md:grid-cols-2">
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <h2 class="text-heading-xs text-[var(--text-default)]">Domain Name</h2>
                    <p class="text-body-sm text-[var(--text-muted)]">
                      Provide the domain name you want to host.
                    </p>
                  </div>

                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <Label for="zone-domain" required>Domain Name</Label>
                    <InputText
                      id="zone-domain"
                      v-model="form.domain"
                      size="large"
                      class="w-full"
                      placeholder="mydomain.com"
                      autocomplete="off"
                      :required="!!errors.domain"
                      :aria-describedby="errors.domain ? 'zone-domain-error' : 'zone-domain-help'"
                      @update:model-value="errors.domain = ''"
                    />
                    <HelperText
                      v-if="errors.domain"
                      id="zone-domain-error"
                      kind="required"
                      :label="errors.domain"
                    />
                    <HelperText
                      v-else
                      id="zone-domain-help"
                      label="Add the root domain name. Example: mydomain.com."
                    />
                  </div>
                </div>
              </template>
            </CardBox>

            <!-- Section: DNSSEC -->
            <CardBox>
              <template #content>
                <div class="grid grid-cols-1 gap-[var(--spacing-lg)] md:grid-cols-2">
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <h2 class="text-heading-xs text-[var(--text-default)]">DNSSEC</h2>
                    <p class="text-body-sm text-[var(--text-muted)]">
                      Enable DNSSEC to secure your DNS zone against cache poisoning
                      and spoofing attacks. Make sure to configure the Key Tag and
                      Digest values in your domain provider to complete the DNSSEC
                      setup.
                    </p>
                  </div>

                  <div class="flex items-center gap-[var(--spacing-sm)]">
                    <Switch v-model="form.dnssec" aria-label="Enable DNSSEC" />
                    <span class="text-label-sm text-[var(--text-default)]">Enable DNSSEC</span>
                  </div>
                </div>
              </template>
            </CardBox>

            <!-- Section: Status -->
            <CardBox>
              <template #content>
                <div class="grid grid-cols-1 gap-[var(--spacing-lg)] md:grid-cols-2">
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <h2 class="text-heading-xs text-[var(--text-default)]">Status</h2>
                    <p class="text-body-sm text-[var(--text-muted)]">
                      When active, the zone answers authoritative DNS queries for the
                      domain.
                    </p>
                  </div>

                  <div class="flex items-center gap-[var(--spacing-sm)]">
                    <Switch v-model="form.active" aria-label="Active" />
                    <span class="text-label-sm text-[var(--text-default)]">Active</span>
                  </div>
                </div>
              </template>
            </CardBox>
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
                 a type prop, so drive submit from its click event. -->
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
