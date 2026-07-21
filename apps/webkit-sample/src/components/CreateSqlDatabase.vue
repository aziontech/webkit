<script setup>
// SQL Database — create flow. A focused creation shell (the /navigation skill):
// the console sidebar is dropped so the single task owns the screen, and the
// only chrome is one CreationHeader (back + brand + breadcrumb + account
// avatar). The module create for a resource with a start and an end lands on a
// dedicated PAGE (route /sql-database/new), not a modal, so it is linkable and
// back-button-safe.
//
// The form is a single "General" section: the section title + guidance on the
// left, the Name field (a Fields-separated triad — Label + control + helper) on
// the right, inside one bordered CardBox. Validation runs on submit only; the
// Name is required, so an empty submit reveals the amber `required` state (a
// prompt to fill, NOT the red `invalid` — required is not an error). One
// `submitting` flag locks the whole scope (fieldset :disabled + every control
// :disabled + Save :loading, the /usability Pattern 1 lock); request-level
// failures surface via toast, never silently.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import HelperText from "@aziontech/webkit/helper-text";
import InputText from "@aziontech/webkit/input-text";
import Label from "@aziontech/webkit/label";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import CreationHeader from "./ui/CreationHeader.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

const form = reactive({ name: "" });
const errors = reactive({ name: "" });

// One flag locks the whole scope while the create request is in flight.
const submitting = ref(false);

// Validation runs on submit only. An empty error string means valid; a populated
// one drives the field's amber `required` state and its HelperText message.
const validate = () => {
  errors.name = form.name.trim() ? "" : "This field is required.";
  return !errors.name;
};

const cancel = () =>
  router.push({ path: "/sql-database", query: { email: userEmail.value } });

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock
  if (!validate()) return; // feedback is now on the field itself

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const name = form.name.trim();
    const id = `db-${Date.now().toString(36)}`;
    toast.success(`Database "${name}" created.`);
    // Land on the new database's detail view, carrying its name so the header
    // reads it without a round-trip.
    router.push({
      path: `/sql-database/${id}`,
      query: { email: userEmail.value, name },
    });
  } catch (error) {
    toast.error("Could not create the database.", {
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
        { label: 'SQL Database', href: '/sql-database' },
        { label: 'Create' },
      ]"
      back-label="Back to SQL Database"
      @back="cancel"
      @navigate="cancel"
    />

    <main class="min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        aria-label="Create SQL Database"
        novalidate
        @submit.prevent="submit"
      >
        <!-- Scrollable form body -->
        <div
          class="mx-auto flex w-full max-w-[var(--container-7xl)] flex-1 flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]"
        >
          <p class="text-body-sm text-[var(--text-muted)]">
            Configure a SQL Database instance that can be accessed by
            Applications, Functions, and APIs.
          </p>

          <!-- One flag locks every control while the request is in flight. -->
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create SQL Database</legend>

            <!-- General: section title + guidance on the left, the field on the
                 right — one bordered CardBox. -->
            <CardBox>
              <template #content>
                <div
                  class="grid grid-cols-1 gap-[var(--spacing-lg)] md:grid-cols-2"
                >
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <h2 class="text-heading-xs text-[var(--text-default)]">
                      General
                    </h2>
                    <p class="text-body-sm text-[var(--text-muted)]">
                      Set up your new SQL Database with basic configuration.
                    </p>
                  </div>

                  <!-- Fields-separated triad: a persistent required Label, the
                       control, and a HelperText that carries guidance until a
                       failed submit swaps it for the amber required message. -->
                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <Label for="db-name" required>Name</Label>
                    <InputText
                      id="db-name"
                      v-model="form.name"
                      size="large"
                      class="w-full"
                      placeholder="my-new-database"
                      autocomplete="off"
                      :required="!!errors.name"
                      :aria-describedby="errors.name ? 'db-name-error' : 'db-name-help'"
                      @update:model-value="errors.name = ''"
                    />
                    <HelperText
                      v-if="errors.name"
                      key="db-name-error"
                      id="db-name-error"
                      kind="required"
                      :label="errors.name"
                    />
                    <HelperText
                      v-else
                      key="db-name-help"
                      id="db-name-help"
                      label="Give a unique and descriptive name to identify the database."
                    />
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
