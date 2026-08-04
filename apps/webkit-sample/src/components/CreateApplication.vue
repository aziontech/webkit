<script setup>
// The Applications module "create" flow — a dedicated PAGE (route
// /applications/new), sidebar hidden so the form is the only focus.
//
// WHERE SAVE LEADS. Creating an application creates a CHAIN: the application plus
// the Workload that publishes it, the Connector it reads from and the Storage bucket
// holding its assets (src/lib/provisioning.js — the four resources `azion deploy`
// creates). Nothing about that chain is serving traffic until a DEPLOYMENT binds it,
// so Save does not end on a list: it provisions the chain, starts a deployment of it
// under Azion Default (the platform's strategy) and lands on that deployment's page,
// where the pipeline is running. That is the whole journey in one click — create,
// deploy, watch — instead of dropping the user on a list with a resource that does
// not answer yet.
//
// The FIELDS are exactly the body of POST /v4/workspace/applications — `name`,
// the four `modules` toggles, `active` and `debug`, nothing else. `form` is keyed
// by the API's own names (snake_case inside `modules`) because this object IS the
// request body; `payload()` only nests each module flag into its `{ enabled }`
// object, so the shape sent is readable straight off the state.
//
// Layout is Cards + ItemGroups (the `/form` skill, Approach A): a single centered
// column of sections, each an section title over a flush CardBox whose body is an
// Item.List. Every field is a small Item row (`size="small"`) — in an ItemGroup the
// Item.Title IS the label (name in Item.Title, guidance in Item.Description) on the
// left via Item.Content, the control on the right via Item.Actions.
//
// Accessibility (the `/form` skill):
//   - the Item.Title names each field; the control carries an aria-label so it has
//     an accessible name (no <Label for> — that's reserved for Fields-separated);
//   - validation runs on submit only; with no Label the feedback is a HelperText
//     under the control. `name` is the only required field, so the state is amber
//     `required` (required is NOT an error — never the red `invalid`), rendered on
//     submit and cleared as the user edits. No error-summary;
//   - one `submitting` flag locks the whole scope (the /webkit-ui-states Pattern 1
//     lock): the outer <fieldset :disabled> is the NATIVE safety net, and every
//     control ALSO takes :disabled off the same flag — a fieldset blocks
//     interaction for the whole subtree but each webkit control renders its
//     disabled VISUAL from its own prop, so the fieldset alone would leave the
//     controls looking live mid-submit. The lock is the PROP everywhere; no page
//     ever hand-styles a locked control. Save carries :loading (webkit Button
//     suppresses its own click while loading); request errors toast.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import HelperText from "@aziontech/webkit/helper-text";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Switch from "@aziontech/webkit/switch";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { startResourceDeployRun } from "../lib/deploy-runs";
import { azionDefaultStrategy } from "../lib/deployment-strategies";
import { provisionDeployment } from "../lib/provisioning";
import CreationHeader from "./ui/CreationHeader.vue";
import PageHeading from "./ui/PageHeading.vue";
import SectionHeading from "./ui/SectionHeading.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// --- Form state ----------------------------------------------------------
// One property per field the create endpoint accepts. The defaults are the
// endpoint's own defaults: Cache and Functions ship on, the two paid-feature
// modules ship off, the application is created active and undebugged.
const form = reactive({
  name: "",
  modules: {
    cache: true,
    functions: true,
    application_accelerator: false,
    image_processor: false,
  },
  active: true,
  debug: false,
});

// The module rows, ordered the way the Main Settings tab lists them so a created
// application reads the same when it is edited. `key` indexes `form.modules`.
const moduleFields = [
  {
    key: "application_accelerator",
    title: "Application Accelerator",
    description: "Optimize protocols and manage dynamic content delivery.",
  },
  {
    key: "cache",
    title: "Cache",
    description: "Customize advanced cache settings.",
  },
  {
    key: "functions",
    title: "Functions",
    description: "Build ultra-low latency functions that run on the edge.",
  },
  {
    key: "image_processor",
    title: "Image Processor",
    description: "Enable dynamic image editing options.",
  },
];

// Per-field error messages. Empty string = valid.
const errors = reactive({
  name: "",
});

// One flag locks the whole scope while the request is in flight.
const submitting = ref(false);

// --- Validation ----------------------------------------------------------
// Runs on submit only. A non-empty error flag drives the field's `required`
// indicator — the feedback IS the field, rendered as a result of the submit and
// cleared as the user edits. `name` is the endpoint's only required field.
const validate = () => {
  errors.name = form.name.trim() ? "" : "This field is required.";
  return !errors.name;
};

// The request body, exactly as POST /v4/workspace/applications expects it: each
// module flag nested under its own `{ enabled }` object.
const payload = () => ({
  name: form.name.trim(),
  modules: Object.fromEntries(
    Object.entries(form.modules).map(([key, enabled]) => [key, { enabled }]),
  ),
  active: form.active,
  debug: form.debug,
});

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
    const application = payload();
    await new Promise((resolve) => setTimeout(resolve, 900));

    // CREATING AN APPLICATION CREATES A CHAIN. An application is code and
    // configuration; on its own it serves nobody. What makes it reachable is the
    // rest of what Azion provisions around it — a Workload (the public entry point:
    // domain, TLS, infrastructure), a Connector (where it reads from) and a Storage
    // bucket (its static assets) — the same four resources `azion deploy` creates
    // and the same registry every list in this console reads
    // (src/lib/provisioning.js). So Save does not end on a list: it ends on a
    // running deployment.
    const record = provisionDeployment({
      repoName: application.name,
      framework: "vue",
      templateTitle: application.name,
    });

    // An application created INACTIVE has nothing to publish — it is created and
    // parked on purpose — so the journey stops at the module list rather than
    // deploying something the user just said should not serve traffic.
    if (!application.active) {
      toast.success(`Application "${application.name}" created.`, {
        description: "Inactive, so nothing was deployed. Deploy it when you activate it.",
      });
      router.push({ path: "/applications", query: { email: userEmail.value } });
      return;
    }

    // THE HAPPY PATH CONTINUES INTO A DEPLOY. Same run every resource page starts
    // (src/lib/deploy-runs.js), applying Azion Default — the platform's strategy,
    // which binds the application being deployed and nothing else. It is `current`,
    // so the workload just created starts serving it the moment it is Ready.
    const run = startResourceDeployRun({
      workload: record.workload,
      application: record.application,
      strategy: { id: azionDefaultStrategy.id, name: azionDefaultStrategy.name },
      deploymentName: `${record.application.name}-deploy`,
      current: true,
      environment: record.workload.environment,
      preset: record.application.preset,
    });

    toast.success(`Application "${application.name}" created.`, {
      description: `Workload ${record.workload.name} and its chain were created. Deploying now.`,
    });

    // The deployment's own page: the pipeline it is running, live. The run outlives
    // this navigation — and every other one the user makes from here.
    router.push({
      path: `/deployments/${run.deployId}`,
      query: { email: userEmail.value },
    });
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
        aria-labelledby="create-application-title"
        novalidate
        @submit.prevent="submit"
      >
      <!-- Scrollable form body: heading + ONE element below it. The `<fieldset>`
           IS that element — the bands wrapper — so it carries the band step and
           spaces its sections with the band gap (see src/styles/layout.css). -->
      <div class="layout-form-create layout-boundary flex flex-1 flex-col">
        <!-- Same small PageHeading every other page in the module carries. It
             titles the form, so `titleId` wires the form's accessible name to
             this h1 instead of repeating the label in aria-label. -->
        <PageHeading
          title="Create Application"
          description="Name the application, choose the modules it runs with, and whether it starts active."
          title-id="create-application-title"
        />

        <!-- One flag locks every control while the request is in flight. -->
        <fieldset
          class="layout-section-start mx-0 flex min-w-0 flex-col gap-[var(--layout-section-gap)] border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">Create application</legend>

          <!-- Section: General — the request body's top-level fields (`name`,
               `active`, `debug`). The nested `modules` object is the section
               below; a one-row "Debug" section titled the same as its only row
               would just say the word twice. -->
          <section class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading title="General" />
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
                    <Item.Actions class="layout-field-control">
                      <!-- Empty-required → amber `required` HelperText (not red). -->
                      <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                        <InputText
                          v-model="form.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          placeholder="My Application"
                          :disabled="submitting"
                          :required="!!errors.name"
                          :aria-describedby="errors.name ? 'app-name-error' : undefined"
                          @update:model-value="errors.name = ''"
                        />
                        <HelperText
                          v-if="errors.name"
                          id="app-name-error"
                          kind="required"
                          :label="errors.name"
                        />
                      </div>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Active</Item.Title>
                      <Item.Description>
                        When disabled, the Application is created but stops serving
                        traffic at the edge.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end">
                      <Switch
                        v-model="form.active"
                        aria-label="Active"
                        :disabled="submitting"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Debug</Item.Title>
                      <Item.Description>
                        Expose executed rules in $traceback and $stacktrace.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end">
                      <Switch
                        v-model="form.debug"
                        aria-label="Debug"
                        :disabled="submitting"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Modules — the nested `modules` object, one row per flag. -->
          <section class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading title="Modules" />
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item
                    v-for="mod in moduleFields"
                    :key="mod.key"
                    size="small"
                  >
                    <Item.Content>
                      <Item.Title>{{ mod.title }}</Item.Title>
                      <Item.Description>{{ mod.description }}</Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end">
                      <Switch
                        v-model="form.modules[mod.key]"
                        :aria-label="mod.title"
                        :disabled="submitting"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>
        </fieldset>
      </div>

      <!-- Sticky action bar. The webkit Button renders a native type="button" and
           does not forward a type, so submit is driven from its click; the sr-only
           submit below keeps Enter working. The scope stays locked while the
           request is in flight. -->
      <footer
        class="sticky bottom-0 border-t-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]"
      >
        <div
          class="layout-form-create layout-boundary-inline flex items-center justify-end gap-[var(--spacing-sm)] py-[var(--spacing-md)]"
        >
          <Button
            type="button"
            label="Cancel"
            kind="outlined"
            size="medium"
            :disabled="submitting"
            @click="cancel"
          />
          <Button
            label="Save"
            kind="primary"
            size="medium"
            :loading="submitting"
            @click="submit"
          />
        </div>
      </footer>
      <button
        type="submit"
        class="sr-only"
        tabindex="-1"
        aria-hidden="true"
      >
        Save
      </button>
      </form>
    </main>
  </div>
</template>
