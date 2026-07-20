<script setup>
import { curve, duration } from "@aziontech/theme/animations";
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import HelperText from "@aziontech/webkit/helper-text";
import InputGroup, { InputGroupAddon } from "@aziontech/webkit/input-group";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Label from "@aziontech/webkit/label";
import Select from "@aziontech/webkit/select";
import Skeleton from "@aziontech/webkit/skeleton";
import Switch from "@aziontech/webkit/switch";
import Tag from "@aziontech/webkit/tag";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { getTemplate } from "../templates.js";
import CreationHeader from "./ui/CreationHeader.vue";
import DeploymentFlow from "./ui/DeploymentFlow.vue";
import TemplatePreview from "./ui/TemplatePreview.vue";

const route = useRoute();
const router = useRouter();

// Carry the signed-in user across the flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// A deploy starts either from a catalog template (?template=slug) or from
// importing an existing Git repository (?repo=name&owner=account). A repo import
// synthesizes a template-shaped source (no template-specific settings) so the
// rest of the flow — preview, form, deployment, success — is identical.
const isRepoImport = computed(() => Boolean(route.query.repo));

const template = computed(() => {
  if (isRepoImport.value) {
    const name = String(route.query.repo);
    const owner = String(route.query.owner || "gab-az");
    return {
      slug: `repo:${owner}/${name}`,
      title: name,
      description: `Import and deploy the ${name} repository directly from GitHub.`,
      framework: String(route.query.framework || ""),
      repoOwner: owner,
      repoPath: name,
      defaultRepoName: name,
      settings: [],
    };
  }
  return getTemplate(route.query.template);
});

const goToCreationCenter = () =>
  router.push({ path: "/create", query: { email: userEmail.value } });

const goHome = () =>
  router.push({ path: "/home", query: { email: userEmail.value } });

// Breadcrumb trail: clickable root back to the Creation Center, then the
// current template as the active (last) crumb.
const breadcrumbItems = computed(() => [
  { label: isRepoImport.value ? "Import from Git" : "Start from a Template" },
  { label: template.value.title, current: true },
]);
const onBreadcrumbNavigate = () => goToCreationCenter();

// Git scope (account / organization the repo will be created under).
const scopes = [
  { label: "gab-az", value: "gab-az" },
  { label: "aziontech", value: "aziontech" },
  { label: "azion-templates", value: "azion-templates" },
];
const scope = ref(scopes[0].value);

// Repository visibility. Public is the default ("lock out"); flipping the
// switch off makes the repository private ("lock in").
const isPublic = ref(true);
const repoLabel = computed(() =>
  isPublic.value ? "Public Repository Name" : "Private Repository Name",
);

// Repo name + template-specific setting values are seeded from the template
// and reset whenever a different template is opened in place.
const repoName = ref("");
const settingsValues = reactive({});

// Entering a template (or switching to another one in place) briefly "fetches"
// its per-template settings schema — while it loads we swap the fields for
// Skeleton placeholders so the layout never jumps.
const settingsLoading = ref(false);
let settingsTimer = null;

// Number of Skeleton rows to reserve while the settings load; at least two so
// the placeholder reads as a form even for templates with no extra fields.
const skeletonFieldCount = computed(() =>
  Math.max(template.value.settings.length, 2),
);

const initFromTemplate = (t) => {
  repoName.value = t.defaultRepoName;
  Object.keys(settingsValues).forEach((k) => delete settingsValues[k]);
  t.settings.forEach((s) => (settingsValues[s.name] = ""));

  settingsLoading.value = true;
  if (settingsTimer) clearTimeout(settingsTimer);
  settingsTimer = setTimeout(() => {
    settingsLoading.value = false;
  }, 900);
};
initFromTemplate(template.value);
watch(
  () => template.value.slug,
  () => initFromTemplate(template.value),
);

// Deploy is enabled once the repo name and every required setting are filled.
const canDeploy = computed(() => {
  if (!repoName.value.trim()) return false;
  return template.value.settings
    .filter((s) => s.required)
    .every((s) => (settingsValues[s.name] || "").trim());
});

// Flow status: form -> deploying -> success. The deployment card runs its own
// internal states and emits `finished`, which advances us to the success view.
const status = ref("form");

// Brief loading state on the Deploy button before the deployment view opens.
const submitting = ref(false);
let submitTimer = null;

const runDeploy = () => {
  if (!canDeploy.value || submitting.value) return;
  submitting.value = true;
  submitTimer = setTimeout(() => {
    status.value = "deploying";
    submitting.value = false;
  }, 1500);
};

onBeforeUnmount(() => {
  if (submitTimer) clearTimeout(submitTimer);
  if (settingsTimer) clearTimeout(settingsTimer);
});

// Phase cross-fade motion. Timing comes from the theme's motion primitives
// (animate.js): moderate-in / fast-out durations + productive entrance/exit
// curves. Only timing goes inline — transform + opacity live in the Transition
// classes (design.md Drawer pattern); a reduced-motion important class disables
// it. Set imperatively per direction so out-in picks the right curve.
const timing = (d, c) => `opacity ${d} ${c}, transform ${d} ${c}`;
const onBeforeEnter = (el) => {
  el.style.transition = timing(
    duration["moderate-02"],
    curve["productive-entrance"],
  );
};
const onBeforeLeave = (el) => {
  el.style.transition = timing(duration["fast-02"], curve["productive-exit"]);
};

const onDeployFinished = () => {
  status.value = "success";
};

// Post-deploy "Next Steps" shown on the success screen.
const nextSteps = [
  {
    icon: "pi pi-globe",
    title: "Customize Domain",
    description:
      "Associate a custom domain and subdomains to Azion to handle user access.",
  },
  {
    icon: "pi pi-sitemap",
    title: "Point Traffic",
    description:
      "Redirect the traffic of a domain to Azion and take advantage of the distributed network.",
  },
  {
    icon: "pi pi-chart-line",
    title: "View Analytics",
    description:
      "Gain powerful insights into your performance, availability, and security.",
  },
];
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-[var(--bg-canvas)]">
    <!-- Single creation header: back + brand + breadcrumb (hidden on success). -->
    <CreationHeader
      :show-back="status !== 'success'"
      :breadcrumb="status !== 'success' ? breadcrumbItems : []"
      back-label="Back to Creation Center"
      @back="goToCreationCenter"
      @navigate="onBreadcrumbNavigate"
    />

    <!-- Centered single-column flow. Phases cross-fade with a translate-y
         offset using the theme easing tokens. -->
    <main class="min-w-0 flex-1 overflow-auto">
      <div
        class="mx-auto flex w-full max-w-[var(--container-2xl)] flex-col items-center gap-[var(--spacing-xl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)]"
      >
        <!-- Preview strip for the form/deploy phases. On success it gives way
             to the in-card preview shown on the Congratulations card. -->
        <Transition
          @before-enter="onBeforeEnter"
          @before-leave="onBeforeLeave"
          enter-from-class="opacity-0 translate-y-[var(--spacing-lg)]"
          leave-to-class="opacity-0 -translate-y-[var(--spacing-md)]"
        >
          <TemplatePreview
            v-if="status !== 'success'"
            class="!max-w-none motion-reduce:!transition-none motion-reduce:!transform-none"
            :title="template.title"
            :description="template.description"
            :repo-owner="template.repoOwner"
            :repo-path="template.repoPath"
            thumbnail="/template-nextjs-thumb.png"
          />
        </Transition>

        <Transition
          mode="out-in"
          @before-enter="onBeforeEnter"
          @before-leave="onBeforeLeave"
          enter-from-class="opacity-0 translate-y-[var(--spacing-lg)]"
          leave-to-class="opacity-0 -translate-y-[var(--spacing-md)]"
        >
          <div
            :key="status"
            class="flex w-full flex-col items-center gap-[var(--spacing-xl)] motion-reduce:!transition-none motion-reduce:!transform-none"
          >
            <!-- Configure repository + template settings -->
            <template v-if="status === 'form'">
              <!-- Configuration card -->
              <CardBox  class="w-full">
                <template #content>
                  <div
                    class="flex flex-col gap-[var(--spacing-lg)]"
                  >
                    <p class="text-body-sm text-pretty text-[var(--text-muted)]">
                      Configure your Git repository to integrate your codebase
                      and automate deployments directly from your version
                      control system.
                    </p>

                    <!-- Scope + repository name -->
                    <div
                      class="grid grid-cols-1 items-start gap-[var(--spacing-lg)] sm:grid-cols-2"
                    >
                      <div class="flex flex-col gap-[var(--spacing-xs)]">
                        <Label label="Scope" required for="scope" />
                        <Select
                          v-model="scope"
                          size="large"
                          placeholder="Select a scope"
                          :disabled="submitting"
                          :display-value="
                            (v) =>
                              scopes.find((s) => s.value === v)?.label ?? ''
                          "
                        >
                          <Select.Trigger />
                          <Select.Content>
                            <Select.Option
                              v-for="s in scopes"
                              :key="s.value"
                              :value="s.value"
                            >
                              {{ s.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </div>

                      <div class="flex flex-col gap-[var(--spacing-xs)]">
                        <Label :label="repoLabel" required for="repoName" />
                        <!-- Repo name joined with the visibility toggle in a
                             single InputGroup: the input is the middle control
                             and the trailing addon carries the Public/Private
                             label + a privacy Switch (lock / lock-open). -->
                        <InputGroup
                          :disabled="submitting"
                          class="[&_[role=switch]]:!rounded-full"
                        >
                          <InputText
                            id="repoName"
                            v-model="repoName"
                            size="large"
                            placeholder="my-repository"
                            class="flex-1"
                            :disabled="submitting"
                          />
                          <InputGroupAddon>
                            <Tooltip text="Toggle repository visibility (public or private)">
                              <Switch
                                v-model="isPublic"
                                kind="privacy"
                                :disabled="submitting"
                                :aria-label="
                                  isPublic
                                    ? 'Repository is public — toggle to make it private'
                                    : 'Repository is private — toggle to make it public'
                                "
                              />
                            </Tooltip>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                    </div>

                    <!-- Template-specific settings -->
                    <p class="text-heading-xxs text-[var(--text-default)]">
                      Template Settings
                    </p>
                    <!-- While the template's settings schema loads, reserve the
                         layout with Skeleton placeholders (label + field +
                         helper text) so nothing jumps when it resolves. -->
                    <div
                      v-if="settingsLoading"
                      class="flex flex-col gap-[var(--spacing-lg)]"
                      aria-busy="true"
                    >
                      <div
                        v-for="n in skeletonFieldCount"
                        :key="n"
                        class="flex flex-col gap-[var(--spacing-xs)]"
                      >
                        <Skeleton width="30%" height="1rem" />
                        <Skeleton width="100%" height="2rem" />
                        <Skeleton width="55%" height="0.75rem" />
                      </div>
                    </div>
                    <div
                      v-else-if="template.settings.length"
                      class="flex flex-col gap-[var(--spacing-lg)]"
                    >
                      <div
                        v-for="field in template.settings"
                        :key="field.name"
                        class="flex flex-col gap-[var(--spacing-xs)]"
                      >
                        <!-- Field triad: the Label's required tag is persistent
                             (bound to the schema, not to submit); guidance is a
                             HelperText, not a bare <small>. Deploy is gated on
                             canDeploy (error prevention), so there is no red
                             required-error state to surface here. -->
                        <Label
                          :label="field.label"
                          :required="field.required"
                          :for="field.name"
                        />
                        <InputText
                          :id="field.name"
                          v-model="settingsValues[field.name]"
                          size="large"
                          :placeholder="field.placeholder"
                          :disabled="submitting"
                          :aria-describedby="field.description ? `${field.name}-helper` : undefined"
                        />
                        <HelperText
                          v-if="field.description"
                          :id="`${field.name}-helper`"
                          :label="field.description"
                        />
                      </div>
                    </div>
                    <p v-else class="text-body-sm text-[var(--text-muted)]">
                      This template has no additional settings.
                    </p>
                  </div>
                </template>

                <template #footer>
                  <Button
                    class="w-full"
                    label="Deploy"
                    kind="primary"
                    size="large"
                    :disabled="!canDeploy"
                    :loading="submitting"
                    @click="runDeploy"
                  />
                </template>
              </CardBox>

              <!-- Browse other templates -->
              <Button
                label="Browse Templates"
                kind="outlined"
                size="medium"
                @click="goToCreationCenter"
              />
            </template>

            <!-- Deploy in progress: only the Deployment card renders here -->
            <template v-else-if="status === 'deploying'">
              <DeploymentFlow
                :repo-owner="template.repoOwner"
                :repo-path="template.repoPath"
                :scope="scope"
                @finished="onDeployFinished"
              />
            </template>

            <!-- Success: Congratulations + deployed preview + Next Steps -->
            <template v-else>
              <CardBox class="w-full">
                <template #header>
                  <div class="flex flex-col gap-[var(--spacing-xxs)]">
                    <p class="text-heading-sm text-[var(--text-default)]">
                      Congratulations!
                    </p>
                    <p
                      class="flex flex-wrap items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-muted)]"
                    >
                      You just deployed a new application into
                      <Tag
                        :label="scope"
                        severity="secondary"
                        icon="pi pi-github"
                      />
                    </p>
                  </div>
                </template>

                <template #content>
                  <div
                    class="flex flex-col gap-[var(--spacing-lg)] "
                  >
                    <!-- Deployed application preview -->
                    <div
                      class="h-[360px] w-full overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)]"
                    >
                      <img
                        src="/template-nextjs-thumb.png"
                        alt=""
                        class="size-full object-cover"
                      />
                    </div>

                    <!-- Next Steps -->
                    <div class="flex flex-col gap-[var(--spacing-md)]">
                      <p class="text-label-sm text-[var(--text-default)]">
                        Next Steps
                      </p>
                      <CardBox :padded="false">
                        <template #content>
                          <Item.List>
                            <!-- as-child: the row shell (layout + hover/active
                                 ghost + focus ring) is merged onto the anchor,
                                 so each Next Step is one real navigable <a>
                                 instead of a <div> wrapping a link. -->
                            <Item
                              v-for="step in nextSteps"
                              :key="step.title"
                              as-child
                              size="small"
                            >
                              <a
                                href="https://www.azion.com/en/documentation/"
                                target="_blank"
                                rel="noopener"
                                class="text-left no-underline"
                              >
                                <Item.Media>
                                  <span
                                    class="flex size-8 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface)]"
                                  >
                                    <i
                                      :class="step.icon"
                                      class="text-[14px] leading-none text-[var(--text-default)]"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Item.Media>
                                <Item.Content>
                                  <Item.Title>{{ step.title }}</Item.Title>
                                  <Item.Description>{{
                                    step.description
                                  }}</Item.Description>
                                </Item.Content>
                                <Item.Actions>
                                  <i
                                    class="pi pi-chevron-right text-[var(--text-muted)]"
                                    aria-hidden="true"
                                  />
                                </Item.Actions>
                              </a>
                            </Item>
                          </Item.List>
                        </template>
                      </CardBox>
                    </div>
                  </div>
                </template>

                <template #footer>
                  <Button
                    class="w-full"
                    label="Manage"
                    kind="secondary"
                    size="large"
                    @click="goHome"
                  />
                </template>
              </CardBox>
            </template>
          </div>
        </Transition>
      </div>
    </main>
  </div>
</template>
