<script setup>
// Marketplace — the Azion Console "Marketplace" landing, structured like the
// real product (azion.com/.../products/marketplace): two top-level offerings,
// TEMPLATES (pre-built starter projects) and INTEGRATIONS (functions that
// improve/compose an application). The centered TabView at the top switches
// between them. Templates shows a framework grid whose colored logo is
// grayscale until hover, with a soft brand-color glow. Integrations are grouped
// by execution context — Applications-based and Firewall-based. The app shell
// (sidebar + GlobalHeader breadcrumb) comes from AppLayout.
import CardBox from "@aziontech/webkit/card-box";
import EmptyState from "@aziontech/webkit/empty-state";
import InputText from "@aziontech/webkit/input-text";
import AzionLogoMin from "@aziontech/webkit/svg/azion/min";
import TabView from "@aziontech/webkit/tab-view";
import Tag from "@aziontech/webkit/tag";
import { toast } from "@aziontech/webkit/toast";
import { computed, ref } from "vue";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

// The two top-level Marketplace offerings.
const activeTab = ref("templates");

// Independent search per offering.
const templateQuery = ref("");
const integrationQuery = ref("");

// ── Templates: pre-built framework starters ──
// `icon` is a COLORED brand logo (compound `ai-cor ai-*`), grayscale until
// hover; `color` is the framework's brand hex for the soft hover glow.
const templates = [
  {
    id: "next",
    name: "Next.js Boilerplate",
    description: "Deploy a full-stack Next.js application to the edge in a few steps.",
    icon: "ai-cor ai-next",
    color: "#0070f3",
  },
  {
    id: "react",
    name: "React Boilerplate",
    description: "Automate your React.js deployment process on the edge.",
    icon: "ai-cor ai-react",
    color: "#61dafb",
  },
  {
    id: "vue",
    name: "Vue.js Quick Setup",
    description: "A lightweight template to rapidly build Vue.js applications on the edge.",
    icon: "ai-cor ai-vue",
    color: "#42b883",
  },
  {
    id: "angular",
    name: "Angular Boilerplate",
    description: "Automate your Angular deployment process with this template.",
    icon: "ai-cor ai-angular",
    color: "#dd0031",
  },
  {
    id: "astro",
    name: "Astro Starter",
    description: "Ship a content-driven Astro site that renders at the edge.",
    icon: "ai-cor ai-astro",
    color: "#ff5d01",
  },
  {
    id: "svelte",
    name: "Svelte Boilerplate",
    description: "Accelerate the deployment of Svelte applications to run on the edge.",
    icon: "ai-cor ai-svelte",
    color: "#ff3e00",
  },
  {
    id: "nuxt",
    name: "Nuxt E-commerce",
    description: "Launch a Nuxt e-commerce or content app on the edge.",
    icon: "ai-cor ai-nuxt",
    color: "#00dc82",
  },
  {
    id: "solid",
    name: "SolidJS Starter",
    description: "Build a fine-grained reactive SolidJS app on the edge.",
    icon: "ai-cor ai-solidjs",
    color: "#4f88c6",
  },
  {
    id: "redwood",
    name: "RedwoodJS Boilerplate",
    description: "Deploy a full-stack RedwoodJS application on the edge.",
    icon: "ai-cor ai-redwood",
    color: "#bf4722",
  },
  {
    id: "flutter",
    name: "Flutter Web",
    description: "Serve a cross-platform Flutter web build from the edge.",
    icon: "ai-cor ai-flutter",
    color: "#54c5f8",
  },
];

// Soft radial glow from the framework's brand color, revealed on hover.
const glow = (color) => `radial-gradient(120% 90% at 50% 0%, ${color}33, transparent 62%)`;

// ── Integrations: functions that improve/compose an application, grouped by
// execution context (Azion's taxonomy): Application Functions and Firewall
// Functions. Names follow the Marketplace integrations catalog; every listing
// is published by Azion, so the vendor avatar is the Azion mark. ──
const integrations = [
  // Application Functions
  {
    id: "ab-tests",
    name: "A/B Tests",
    description: "Run A/B tests to validate addresses, interfaces, or entire workflows at the edge.",
    tag: "Performance",
    icon: "pi pi-chart-bar",
    vendor: "Azion",
    context: "applications",
  },
  {
    id: "hello-world",
    name: "Hello World",
    description: "A minimal edge function that demonstrates how Azion edge technology works.",
    tag: "Getting Started",
    icon: "pi pi-code",
    vendor: "Azion",
    context: "applications",
  },
  {
    id: "send-to-queue",
    name: "Send Messages to a Queue",
    description: "Enable asynchronous message processing between the components of your system.",
    tag: "Messaging",
    icon: "pi pi-send",
    vendor: "Azion",
    context: "applications",
  },
  {
    id: "content-targeting",
    name: "Content Targeting",
    description: "Manipulate cookies and headers to build flexible content-targeting logic.",
    tag: "Personalization",
    icon: "pi pi-bullseye",
    vendor: "Azion",
    context: "applications",
  },
  {
    id: "signed-cookies",
    name: "Signed Cookies",
    description: "Add enhanced security to your cookie implementation with signed cookies.",
    tag: "Security",
    icon: "pi pi-lock",
    vendor: "Azion",
    context: "applications",
  },
  // Firewall Functions
  {
    id: "bot-manager-lite",
    name: "Azion Bot Manager Lite",
    description: "Analyze incoming requests and assign a threat score to block bad bots.",
    tag: "Security",
    icon: "pi pi-android",
    vendor: "Azion",
    context: "firewall",
  },
  {
    id: "radware-bot-manager",
    name: "Radware Bot Manager",
    description: "Defend your applications against sophisticated bot-based attacks.",
    tag: "Security",
    icon: "pi pi-shield",
    vendor: "Azion",
    context: "firewall",
  },
];

const filteredTemplates = computed(() => {
  const term = templateQuery.value.trim().toLowerCase();
  if (!term) return templates;
  return templates.filter((t) => `${t.name} ${t.description}`.toLowerCase().includes(term));
});

const matchIntegration = (context) => {
  const term = integrationQuery.value.trim().toLowerCase();
  return integrations.filter(
    (item) =>
      item.context === context &&
      (!term || `${item.name} ${item.description}`.toLowerCase().includes(term)),
  );
};
const appsIntegrations = computed(() => matchIntegration("applications"));
const firewallIntegrations = computed(() => matchIntegration("firewall"));
const noIntegrations = computed(
  () => !appsIntegrations.value.length && !firewallIntegrations.value.length,
);

const openTemplate = (template) =>
  toast.info(`${template.name} template`, { description: "Opening the framework template." });
const openIntegration = (item) =>
  toast.info(item.name, { description: "Opening integration details." });
</script>

<template>
  <AppLayout active="marketplace" :breadcrumb="[{ label: 'Marketplace' }]">
    <main class="mx-auto flex w-full max-w-[var(--container-7xl)] flex-col gap-[var(--spacing-lg)] pt-[var(--spacing-xl)]">
      <PageHeading
        size="large"
        title="Marketplace"
        description="Find, test, and deploy software that runs anywhere."
      />

      <!-- Top-level offerings: Templates | Integrations, centered. -->
      <TabView v-model:value="activeTab">
        <TabView.List class="justify-center mb-[var(--spacing-lg)]">
          <TabView.Item value="templates" label="Templates" />
          <TabView.Item value="integrations" label="Integrations" />
        </TabView.List>

        <TabView.Content>
          <!-- Templates: pre-built framework starters -->
          <TabView.Panel value="templates">
            <div class="flex flex-col gap-[var(--spacing-lg)]">
              <InputText
                v-model="templateQuery"
                size="large"
                placeholder="Search templates…"
                aria-label="Search templates"
                class="w-full"
              >
                <template #iconLeft>
                  <i class="pi pi-search" aria-hidden="true" />
                </template>
              </InputText>

              <EmptyState
                v-if="!filteredTemplates.length"
                bordered
                title="No templates found"
                description="No templates match your search. Try a different term."
              />

              <div
                v-else
                class="grid grid-cols-2 gap-[var(--spacing-md)] sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
              >
                <CardBox
                  v-for="template in filteredTemplates"
                  :key="template.id"
                  class="group relative cursor-pointer text-center"
                  role="button"
                  tabindex="0"
                  @click="openTemplate(template)"
                  @keydown.enter="openTemplate(template)"
                  @keydown.space.prevent="openTemplate(template)"
                >
                  <template #content>
                    <!-- Brand-color glow, faded in on hover (behind the content). -->
                    <span
                      aria-hidden="true"
                      class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance group-hover:opacity-100 motion-reduce:transition-none"
                      :style="{ background: glow(template.color) }"
                    />
                    <div class="relative z-10 flex flex-col items-center gap-[var(--spacing-md)] py-[var(--spacing-sm)]">
                      <i
                        :class="template.icon"
                        class="text-[2.5rem] leading-none grayscale transition duration-moderate-01 ease-productive-entrance group-hover:grayscale-0 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                      <div class="flex flex-col gap-[var(--spacing-xxs)]">
                        <h3 class="text-label-md text-[var(--text-default)]">{{ template.name }}</h3>
                        <p class="text-pretty text-body-sm text-[var(--text-muted)]">
                          {{ template.description }}
                        </p>
                      </div>
                    </div>
                  </template>
                </CardBox>
              </div>
            </div>
          </TabView.Panel>

          <!-- Integrations: grouped by execution context -->
          <TabView.Panel value="integrations">
            <div class="flex flex-col gap-[var(--spacing-lg)]">
              <InputText
                v-model="integrationQuery"
                size="large"
                placeholder="Search integrations…"
                aria-label="Search integrations"
                class="w-full"
              >
                <template #iconLeft>
                  <i class="pi pi-search" aria-hidden="true" />
                </template>
              </InputText>

              <EmptyState
                v-if="noIntegrations"
                bordered
                title="No integrations found"
                description="No integrations match your search. Try a different term."
              />

              <!-- Application Functions -->
              <section
                v-if="appsIntegrations.length"
                class="flex flex-col gap-[var(--spacing-md)]"
              >
                <PageHeading
                  size="small"
                  title="Application Functions"
                  description="Process data or run services on the edge, closer to the user."
                />
                <div class="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-3">
                  <CardBox
                    v-for="item in appsIntegrations"
                    :key="item.id"
                    class="cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                    role="button"
                    tabindex="0"
                    @click="openIntegration(item)"
                    @keydown.enter="openIntegration(item)"
                    @keydown.space.prevent="openIntegration(item)"
                  >
                    <template #content>
                      <div class="flex h-full flex-col gap-[var(--spacing-md)]">
                        <div class="flex items-start justify-between gap-[var(--spacing-sm)]">
                          <span
                            class="flex size-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                          >
                            <AzionLogoMin class="h-5 w-auto" aria-label="Azion" />
                          </span>
                          <Tag :value="item.tag" rounded severity="info" size="small" />
                        </div>
                        <div class="flex flex-col gap-[var(--spacing-xxs)]">
                          <h3 class="text-label-md text-[var(--text-default)]">{{ item.name }}</h3>
                          <p class="text-pretty text-body-sm text-[var(--text-muted)]">
                            {{ item.description }}
                          </p>
                        </div>
                        <span class="mt-auto pt-[var(--spacing-xs)] text-body-xs text-[var(--text-muted)]">
                          by {{ item.vendor }}
                        </span>
                      </div>
                    </template>
                  </CardBox>
                </div>
              </section>

              <!-- Firewall Functions -->
              <section
                v-if="firewallIntegrations.length"
                class="flex flex-col gap-[var(--spacing-md)]"
              >
                <PageHeading
                  size="small"
                  title="Firewall Functions"
                  description="Network security, authentication, and traffic control."
                />
                <div class="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-3">
                  <CardBox
                    v-for="item in firewallIntegrations"
                    :key="item.id"
                    class="cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                    role="button"
                    tabindex="0"
                    @click="openIntegration(item)"
                    @keydown.enter="openIntegration(item)"
                    @keydown.space.prevent="openIntegration(item)"
                  >
                    <template #content>
                      <div class="flex h-full flex-col gap-[var(--spacing-md)]">
                        <div class="flex items-start justify-between gap-[var(--spacing-sm)]">
                          <span
                            class="flex size-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                          >
                            <AzionLogoMin class="h-5 w-auto" aria-label="Azion" />
                          </span>
                          <Tag :value="item.tag" rounded severity="info" size="small" />
                        </div>
                        <div class="flex flex-col gap-[var(--spacing-xxs)]">
                          <h3 class="text-label-md text-[var(--text-default)]">{{ item.name }}</h3>
                          <p class="text-pretty text-body-sm text-[var(--text-muted)]">
                            {{ item.description }}
                          </p>
                        </div>
                        <span class="mt-auto pt-[var(--spacing-xs)] text-body-xs text-[var(--text-muted)]">
                          by {{ item.vendor }}
                        </span>
                      </div>
                    </template>
                  </CardBox>
                </div>
              </section>
            </div>
          </TabView.Panel>
        </TabView.Content>
      </TabView>
    </main>
  </AppLayout>
</template>
