<script setup>
// Marketplace — the Azion Console "Marketplace" landing, structured like the
// real product (azion.com/.../products/marketplace): two top-level offerings,
// TEMPLATES (pre-built starter projects) and INTEGRATIONS (functions that
// improve/compose an application). The centered TabView at the top switches
// between them. Templates shows a framework grid whose colored logo is
// grayscale until hover, with a soft brand-color glow. Integrations are grouped
// by execution context — Applications-based and Firewall-based. The app shell
// (sidebar + GlobalHeader breadcrumb) comes from AppLayout.
import EmptyState from "@aziontech/webkit/empty-state";
import InputText from "@aziontech/webkit/input-text";
import Select from "@aziontech/webkit/select";
import TabView from "@aziontech/webkit/tab-view";
import { toast } from "@aziontech/webkit/toast";
import { computed, ref } from "vue";

import AppLayout from "./ui/AppLayout.vue";
import IntegrationCard from "./ui/IntegrationCard.vue";
import PageHeading from "./ui/PageHeading.vue";
import TemplateCard from "./ui/TemplateCard.vue";

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

// ── Integrations: functions that improve/compose an application. Azion's
// taxonomy splits them by execution context — Application Functions and Firewall
// Functions — and within each context by use case (the subcategories from the
// Marketplace integrations catalog). Each card uses a logo-left / text-right
// layout: the Azion Marketplace vendor mark, then the title with "by {vendor}"
// and the description. Vendors vary: Azion curates most, but partners publish
// the rest (Radware, Axur, Google, hCaptcha, Saffe, IPQualityScore, Upstash). ──
const integrations = [
  // ── Application Functions · Testing and validation ──
  {
    id: "ab-tests",
    name: "A/B Tests",
    description: "Validate addresses, interfaces, or entire workflows by splitting traffic at the edge.",
    vendor: "Azion",
    context: "applications",
    group: "Testing and validation",
  },
  {
    id: "hello-world",
    name: "Hello World",
    description: "A minimal edge function that displays a “Hello World” message to show how the edge works.",
    vendor: "Azion",
    context: "applications",
    group: "Testing and validation",
  },
  {
    id: "send-to-queue",
    name: "Send Messages to a Queue",
    description: "Add messages to a queue for asynchronous processing between the components of your system.",
    vendor: "Azion",
    context: "applications",
    group: "Testing and validation",
  },
  // ── Application Functions · Content segmentation and personalization ──
  {
    id: "content-targeting",
    name: "Content Targeting",
    description: "Manipulate cookies and headers to build flexible content-targeting logic.",
    vendor: "Azion",
    context: "applications",
    group: "Content segmentation and personalization",
  },
  {
    id: "signed-cookies",
    name: "Signed Cookies",
    description: "Implement cookies with an extra layer of security through cryptographic signing.",
    vendor: "Azion",
    context: "applications",
    group: "Content segmentation and personalization",
  },
  // ── Firewall Functions · Bot management ──
  {
    id: "bot-manager-lite",
    name: "Azion Bot Manager Lite",
    description: "Analyze incoming requests and assign a score based on rules and behaviors to block bad bots.",
    vendor: "Azion",
    context: "firewall",
    group: "Bot management",
  },
  {
    id: "radware-bot-manager",
    name: "Radware Bot Manager",
    description: "Defend your online assets against sophisticated bot-based attacks.",
    vendor: "Radware",
    context: "firewall",
    group: "Bot management",
  },
  // ── Firewall Functions · Security optimization and access control ──
  {
    id: "axur-cardstream",
    name: "Axur Cardstream",
    description: "Protect your e-commerce from fraud by detecting compromised payment cards in real time.",
    vendor: "Axur",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "axur-leakstream",
    name: "Axur Leakstream",
    description: "Monitor leaked credentials and protect your users from checker attacks.",
    vendor: "Axur",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "send-event-endpoint",
    name: "Send Event to Endpoint",
    description: "Stream request data to a user-defined HTTP endpoint via the JavaScript fetch API.",
    vendor: "Azion",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "recaptcha",
    name: "reCAPTCHA",
    description: "Protect your domains against bots and monitor traffic through the Google reCAPTCHA dashboard.",
    vendor: "Google",
    icon: "ai-cor ai-google",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "hcaptcha",
    name: "hCaptcha",
    description: "Protect your domains against bots and monitor traffic through the hCaptcha dashboard.",
    vendor: "hCaptcha",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "liveness-detection",
    name: "Liveness Detection",
    description: "Biometric facial recognition that prevents spoofing with photos or videos, powered by Saffe.",
    vendor: "Saffe",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "jwt",
    name: "JWT",
    description: "Grant and revoke privileges using KIDs and secrets, and set token expiration dates.",
    vendor: "Azion",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "secure-token",
    name: "Secure Token",
    description: "Make token-based, time-limited URLs to control access to protected content.",
    vendor: "Azion",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "scheduled-blocking",
    name: "Scheduled Blocking",
    description: "Control access to your application based on a time schedule, according to your needs.",
    vendor: "Azion",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "ip-address-reputation",
    name: "IP Address Reputation",
    description: "Score incoming IP addresses using a reputation database provided by IPQualityScore.",
    vendor: "IPQualityScore",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "ipqs-phone-validation",
    name: "IPQualityScore Phone Validation",
    description: "Validate phone numbers at the edge and detect fraudulent activity in real time.",
    vendor: "IPQualityScore",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "ipqs-url-validation",
    name: "IPQualityScore URL Validation",
    description: "Scan URLs for malware, phishing, and suspicious domains in real time at the edge.",
    vendor: "IPQualityScore",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "upstash-rate-limiting",
    name: "Upstash Rate Limiting",
    description: "Control incoming traffic right at the edge to protect your applications from abuse.",
    vendor: "Upstash",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "add-request-id",
    name: "Add Request ID",
    description: "Add an HTTP header that assigns a unique identifier to each incoming request.",
    vendor: "Azion",
    context: "firewall",
    group: "Security optimization and access control",
  },
  {
    id: "method-route-validator",
    name: "Method and Route Validator",
    description: "Control access to your application based on the request method and path.",
    vendor: "Azion",
    context: "firewall",
    group: "Security optimization and access control",
  },
  // ── Firewall Functions · Workloads and payloads ──
  {
    id: "limit-payload-size",
    name: "Limit Payload Size",
    description: "Evaluate request data and deny payloads that exceed a predefined limit.",
    vendor: "Azion",
    context: "firewall",
    group: "Workloads and payloads",
  },
  {
    id: "massive-redirect",
    name: "Massive Redirect",
    description: "Handle a massive quantity of domain redirects, such as during domain migrations.",
    vendor: "Azion",
    context: "firewall",
    group: "Workloads and payloads",
  },
  {
    id: "process-request-data-headers",
    name: "Process Request Data Into Headers",
    description: "Inspect request body fields and stop a request whenever a required field is empty.",
    vendor: "Azion",
    context: "firewall",
    group: "Workloads and payloads",
  },
  {
    id: "request-variation-controller",
    name: "Request Variation Controller",
    description: "Track argument variations across requests and block access once a limit is exceeded.",
    vendor: "Azion",
    context: "firewall",
    group: "Workloads and payloads",
  },
  {
    id: "upstash-waiting-room",
    name: "Upstash Waiting Room",
    description: "Manage traffic surges and prevent overload on your sites with a virtual waiting room.",
    vendor: "Upstash",
    context: "firewall",
    group: "Workloads and payloads",
  },
];

const filteredTemplates = computed(() => {
  const term = templateQuery.value.trim().toLowerCase();
  if (!term) return templates;
  return templates.filter((t) => `${t.name} ${t.description}`.toLowerCase().includes(term));
});

// Human labels for each execution context; also used as the card's corner Tag.
const contextLabels = { applications: "Application", firewall: "Firewall" };

// The spotlight row at the top of the panel — a curated few, rendered in the
// featured card anatomy.
const featuredIds = new Set(["ab-tests", "bot-manager-lite", "recaptcha"]);
const featuredIntegrations = integrations.filter((item) => featuredIds.has(item.id));

// ── Filters (multiple selection, no label, no checkbox) ──
// Each filter is a MultiSelect whose trigger reads "Publisher: All" until the
// user narrows it. Empty = no constraint on that axis.
const selectedPublishers = ref([]);
const selectedCategories = ref([]);
const selectedContexts = ref([]);

const publisherOptions = [...new Set(integrations.map((i) => i.vendor))]
  .sort((a, b) => a.localeCompare(b))
  .map((vendor) => ({ value: vendor, label: vendor }));

const categoryOptions = [...new Set(integrations.map((i) => i.group))].map((group) => ({
  value: group,
  label: group,
}));

const contextOptions = Object.entries(contextLabels).map(([value, label]) => ({ value, label }));

// Trigger label: no selection means "all", so the placeholder ("All X") shows.
// Once something is picked, show the single label or "N selected".
const filterDisplay = (allLabel, options) => (values) => {
  if (!values.length) return allLabel;
  if (values.length === 1) {
    const match = options.find((o) => o.value === values[0]);
    return match ? match.label : values[0];
  }
  return `${values.length} selected`;
};

// Search across name/vendor/description, then apply each active filter axis.
const filteredIntegrations = computed(() => {
  const term = integrationQuery.value.trim().toLowerCase();
  return integrations.filter((item) => {
    if (term && !`${item.name} ${item.vendor} ${item.description}`.toLowerCase().includes(term)) {
      return false;
    }
    if (selectedPublishers.value.length && !selectedPublishers.value.includes(item.vendor)) {
      return false;
    }
    if (selectedCategories.value.length && !selectedCategories.value.includes(item.group)) {
      return false;
    }
    if (selectedContexts.value.length && !selectedContexts.value.includes(item.context)) {
      return false;
    }
    return true;
  });
});
const noIntegrations = computed(() => !filteredIntegrations.value.length);

const openTemplate = (template) =>
  toast.info(`${template.name} template`, { description: "Opening the framework template." });
const openIntegration = (item) =>
  toast.info(item.name, { description: "Opening integration details." });
</script>

<template>
  <AppLayout active="marketplace" :breadcrumb="[{ label: 'Marketplace' }]">
    <main class="mx-auto flex w-full flex-col gap-[var(--spacing-lg)]">
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
                <TemplateCard
                  v-for="template in filteredTemplates"
                  :key="template.id"
                  :icon="template.icon"
                  :title="template.name"
                  :description="template.description"
                  :color="template.color"
                  @select="openTemplate(template)"
                />
              </div>
            </div>
          </TabView.Panel>

          <!-- Integrations: a featured spotlight row, then a filterable grid -->
          <TabView.Panel value="integrations">
            <div class="flex flex-col gap-[var(--spacing-xl)]">
              <!-- Featured row: the same card in its spotlight anatomy. -->
              <section class="flex flex-col gap-[var(--spacing-md)]">
                <p class="text-heading-xxs text-[var(--text-default)]">Featured</p>
                <div class="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-3">
                  <IntegrationCard
                    v-for="item in featuredIntegrations"
                    :key="item.id"
                    featured
                    :title="item.name"
                    :description="item.description"
                    :vendor="item.vendor"
                    :icon="item.icon"
                    :badge="contextLabels[item.context]"
                    @select="openIntegration(item)"
                  />
                </div>
              </section>

              <!-- Search + the three filter axes on one row: no label, multiple
                   selection, no checkbox (selection shown by highlight). -->
              <div class="flex flex-col gap-[var(--spacing-sm)] md:flex-row md:items-center">
                <InputText
                  v-model="integrationQuery"
                  size="large"
                  placeholder="Search integrations…"
                  aria-label="Search integrations"
                  class="w-full md:flex-1"
                >
                  <template #iconLeft>
                    <i class="pi pi-search" aria-hidden="true" />
                  </template>
                </InputText>

                <Select
                  v-model="selectedPublishers"
                  multiple
                  size="large"
                  class="w-full md:w-[var(--container-3xs)]"
                  placeholder="All Publishers"
                  :display-value="filterDisplay('All Publishers', publisherOptions)"
                >
                  <Select.Trigger aria-label="Filter by publisher" />
                  <Select.Content>
                    <Select.Option
                      v-for="option in publisherOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>

                <Select
                  v-model="selectedCategories"
                  multiple
                  size="large"
                  class="w-full md:w-[var(--container-2xs)]"
                  placeholder="All Categories"
                  :display-value="filterDisplay('All Categories', categoryOptions)"
                >
                  <Select.Trigger aria-label="Filter by category" />
                  <Select.Content>
                    <Select.Option
                      v-for="option in categoryOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>

                <Select
                  v-model="selectedContexts"
                  multiple
                  size="large"
                  class="w-full md:w-[var(--container-3xs)]"
                  placeholder="All Contexts"
                  :display-value="filterDisplay('All Contexts', contextOptions)"
                >
                  <Select.Trigger aria-label="Filter by context" />
                  <Select.Content>
                    <Select.Option
                      v-for="option in contextOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </div>

              <EmptyState
                v-if="noIntegrations"
                bordered
                title="No integrations found"
                description="No integrations match your search or filters. Try clearing a filter."
              />

              <div
                v-else
                class="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-3"
              >
                <IntegrationCard
                  v-for="item in filteredIntegrations"
                  :key="item.id"
                  :title="item.name"
                  :description="item.description"
                  :vendor="item.vendor"
                  :icon="item.icon"
                  :badge="contextLabels[item.context]"
                  @select="openIntegration(item)"
                />
              </div>
            </div>
          </TabView.Panel>
        </TabView.Content>
      </TabView>
    </main>
  </AppLayout>
</template>
