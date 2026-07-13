<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import GlobalHeader from "@aziontech/webkit/global-header";
import Button from "@aziontech/webkit/button";
import IconButton from "@aziontech/webkit/icon-button";
import Avatar from "@aziontech/webkit/avatar";
import CardBox from "@aziontech/webkit/card-box";
import Breadcrumb from "@aziontech/webkit/breadcrumb";
import Label from "@aziontech/webkit/label";
import InputText from "@aziontech/webkit/input-text";
import InputGroup, { InputGroupAddon } from "@aziontech/webkit/input-group";
import Select from "@aziontech/webkit/select";
import Switch from "@aziontech/webkit/switch";
import Skeleton from "@aziontech/webkit/skeleton";
import Tooltip from "@aziontech/webkit/tooltip";
import Tag from "@aziontech/webkit/tag";
import Item from "@aziontech/webkit/item";

import { curve, duration } from "@aziontech/theme/animations";

import TemplatePreview from "./ui/TemplatePreview.vue";
import DeploymentFlow from "./ui/DeploymentFlow.vue";
import { getTemplate } from "../templates.js";

const route = useRoute();
const router = useRouter();

// Carry the signed-in user across the flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// Resolve the template from the query — this drives the preview AND the
// per-template "Template Settings" fields below.
const template = computed(() => getTemplate(route.query.template));

const goToCreationCenter = () =>
  router.push({ path: "/create", query: { email: userEmail.value } });

const goToDashboard = () =>
  router.push({ path: "/dashboard", query: { email: userEmail.value } });

// Breadcrumb trail: clickable root back to the Creation Center, then the
// current template as the active (last) crumb.
const breadcrumbItems = computed(() => [
  { label: "Start from a Template" },
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
    <!-- Header: back + brand + breadcrumb + help + avatar -->
    <GlobalHeader aria-label="Azion Console">
      <GlobalHeader.Brand>
        <div class="flex items-center gap-[var(--spacing-md)]">
          <IconButton
            v-if="status !== 'success'"
            icon="pi pi-chevron-left"
            aria-label="Back to Creation Center"
            kind="outlined"
            size="small"
            @click="goToCreationCenter"
          />
          <span class="text-[var(--primary)]">
            <svg
              viewBox="0 0 90 18"
              fill="currentColor"
              role="img"
              aria-label="Azion"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M86.637 0L85.1445 7.79033L87.861 11.1671L90 0H86.637ZM72.5099 0L69.1465 17.561H72.5111L74.8163 5.52224L84.5333 17.561H86.637L87.0518 15.4112L74.6131 0H72.5099Z"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M51.6563 0L48.293 17.561H65.7833L69.1466 0H51.6563ZM54.3884 3.31794H65.1392L63.0467 14.243H52.296L54.3884 3.31794Z"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M45.0001 0L41.707 17.561H44.9994L48.2924 0H45.0001Z"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M24.217 0L23.5814 3.31801H35.1962L21.3511 14.9756L20.8535 17.561H38.3437L38.9793 14.243H27.3646L41.2126 2.58289L41.7072 0H24.217Z"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z"
              />
            </svg>
          </span>
        </div>
      </GlobalHeader.Brand>

      <GlobalHeader.Middle>
        <Breadcrumb
          v-if="status !== 'success'"
          :items="breadcrumbItems"
          @navigate="onBreadcrumbNavigate"
        />
      </GlobalHeader.Middle>

      <GlobalHeader.Right>
        <IconButton
          icon="pi pi-question-circle"
          aria-label="Help"
          kind="outlined"
          size="medium"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
        <Avatar :label="userEmail" size="medium" kind="square" />
      </GlobalHeader.Right>
    </GlobalHeader>

    <!-- Centered single-column flow. Phases cross-fade with a translate-y
         offset using the theme easing tokens. -->
    <main class="min-w-0 flex-1 overflow-auto">
      <div
        class="mx-auto flex w-full max-w-[var(--container-3xl)] flex-col items-center gap-[var(--spacing-xl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)]"
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
                        <Label value="Scope" required for="scope" />
                        <Select
                          v-model="scope"
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
                        <Label :value="repoLabel" required for="repoName" />
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
                            placeholder="my-repository"
                            class="flex-1"
                            :disabled="submitting"
                          />
                          <InputGroupAddon>
                            <Tooltip text="Toggle repository visibility (public or private)">
                              <Switch
                                v-model:isToggled="isPublic"
                                type="privacy"
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
                        <Label
                          :value="field.label"
                          :required="field.required"
                          :for="field.name"
                        />
                        <InputText
                          :id="field.name"
                          v-model="settingsValues[field.name]"
                          :placeholder="field.placeholder"
                          :disabled="submitting"
                        />
                        <small
                          v-if="field.description"
                          class="text-body-xs text-[var(--text-muted)]"
                        >
                          {{ field.description }}
                        </small>
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
                        :value="scope"
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
                    @click="goToDashboard"
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
