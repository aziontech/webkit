<script setup>
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Select from "@aziontech/webkit/select";
import TabView from "@aziontech/webkit/tab-view";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import CreationHeader from "./ui/CreationHeader.vue";

const route = useRoute();
const router = useRouter();

// Carry the signed-in user across the flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

const goToDashboard = () =>
  router.push({ path: "/dashboard", query: { email: userEmail.value } });

// Map a chosen template to a catalog slug, then hand it to the deploy flow.
const slugFor = (title) => {
  const t = title.toLowerCase();
  if (t.includes("react") || t.includes("gatsby")) return "react-boilerplate";
  if (t.includes("turso")) return "turso-starter";
  if (t.includes("nuxt")) return "nuxt-ecommerce";
  if (t.includes("vue") || t.includes("svelte") || t.includes("angular"))
    return "vue-boilerplate";
  return "nuxt-ecommerce";
};

const deployTemplate = (tpl) =>
  router.push({
    path: "/deploy",
    query: { email: userEmail.value, template: slugFor(tpl.title) },
  });

const activeTab = ref("git");
const search = ref("");

// GitHub is the only connected provider in this prototype. Account scopes are
// the GitHub accounts the user has linked; the Select lets them add another.
const scopes = reactive([{ label: "cesaroeduardo", value: "cesaroeduardo" }]);
const scope = ref(scopes[0].value);

// Sentinel value for the trailing "Add GitHub Account" option — selecting it
// runs the connect flow instead of becoming the chosen scope.
const ADD_ACCOUNT = "__add-account__";

// Mock "connect another GitHub account": append a linked account and select it,
// standing in for the GitHub OAuth flow.
let linkedCount = 0;
const onSelectScope = (value) => {
  if (value !== ADD_ACCOUNT) {
    scope.value = value;
    return;
  }
  linkedCount += 1;
  const account = `github-account-${linkedCount}`;
  scopes.push({ label: account, value: account });
  scope.value = account;
};

// Mock repositories for the selected account, carrying the colored brand logo
// (`ai-cor ai-*`) of the framework each was scaffolded from.
const repos = [
  { name: "next-js-boilerplate", age: "2 hours ago", icon: "ai-cor ai-next" },
];

const filteredRepos = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return repos;
  return repos.filter((r) => r.name.toLowerCase().includes(q));
});

// Recommended templates shown alongside the importer.
// Colored brand logos from @aziontech/icons. Gatsby and Turso ship only a
// monochrome glyph (`ai ai-*`, tinted with the text token); the rest use the
// multicolor `ai-cor ai-*` logos.
const templates = [
  {
    title: "Angular Boilerplate",
    description:
      "Automate your Angular.js deployment process with this template.",
    icon: "ai-cor ai-angular",
  },
  {
    title: "Gatsby Blog Starter",
    description:
      "Deploy a blog page based on the Gatsby framework in a few steps.",
    icon: "ai ai-gatsby",
  },
  {
    title: "React Boilerplate",
    description: "Automate your React.js deployment process on the edge.",
    icon: "ai-cor ai-react",
  },
  {
    title: "Svelte Boilerplate",
    description:
      "Accelerate the deployment of Svelte static applications to run directly on the edge.",
    icon: "ai-cor ai-svelte",
  },
  {
    title: "Turso Starter Kit",
    description:
      "Integrate a Turso database, created using Turso's LibSQL SDK, into an edge application.",
    icon: "ai ai-turso",
  },
  {
    title: "Vue.js Quick Setup",
    description:
      "A lightweight template to rapidly build Vue.js applications on the edge.",
    icon: "ai-cor ai-vue",
  },
];

// "Create Resources" tab options.
const resources = [
  {
    id: "app",
    label: "Edge Application",
    description: "Build and deliver applications at the edge.",
    icon: "pi pi-server",
  },
  {
    id: "fn",
    label: "Edge Function",
    description: "Run serverless code close to your users.",
    icon: "pi pi-bolt",
  },
  {
    id: "domain",
    label: "Domain",
    description: "Connect a custom domain to your workloads.",
    icon: "pi pi-globe",
  },
  {
    id: "waf",
    label: "WAF Rule Set",
    description: "Protect your applications from web threats.",
    icon: "pi pi-shield",
  },
];
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <!-- Global header: back to console, brand + breadcrumb. -->
    <CreationHeader
      :breadcrumb="[{ label: 'Creation Center', current: true }]"
      back-label="Back to dashboard"
      @back="goToDashboard"
    />

    <!-- Flow content -->
    <main class="min-w-0 flex-1 overflow-auto">
      <div
        class="mx-auto flex w-full max-w-[var(--container-7xl)] flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]"
      >
        <header>
          <h1 class="sr-only">Creation Center</h1>
          <p class="text-heading-xs text-[var(--text-default)]">
            Start from a repository, use a template, or create resources from
            scratch.
          </p>
        </header>

        <TabView v-model:value="activeTab">
          <TabView.List class="mb-[var(--spacing-lg)]">
            <TabView.Item value="git" label="Import from Git" />
            <TabView.Item value="template" label="Start from Template" />
            <TabView.Item value="resources" label="Create Resources" />
          </TabView.List>

          <TabView.Content>
            <!-- Import from Git -->
            <TabView.Panel value="git">
              <div
                class="grid grid-cols-1 gap-[var(--spacing-lg)] lg:grid-cols-2"
              >
                <!-- Importer -->
                <section class="flex flex-col gap-[var(--spacing-lg)]">
                  <!-- Account scope + search -->
                  <div
                    class="flex flex-col gap-[var(--spacing-sm)] sm:flex-row"
                  >
                    <Select
                      :model-value="scope"
                      aria-label="Git account scope"
                      size="large"
                      :display-value="
                        (v) => scopes.find((s) => s.value === v)?.label ?? ''
                      "
                      @update:model-value="onSelectScope"
                      class="shrink-0 sm:w-[var(--container-3xs)]"
                    >
                      <Select.Trigger>
                        <template #iconLeft>
                          <i
                            class="pi pi-github text-[1rem] leading-none shrink-0 text-[var(--text-default)]"
                            aria-hidden="true"
                          />
                        </template>
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Option
                          v-for="s in scopes"
                          :key="s.value"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </Select.Option>
                        <Select.Option :value="ADD_ACCOUNT" icon="pi pi-plus-circle">
                          Add GitHub Account
                        </Select.Option>
                      </Select.Content>
                    </Select>

                    <InputText
                      v-model="search"
                      size="large"
                      placeholder="Search project or enter a Git Repository URL"
                      aria-label="Search project or enter a Git Repository URL"
                      class="w-full flex-1"
                    >
                    <template #iconLeft>
                      <i class="pi pi-search" />
                    </template>
                  </InputText>
                  </div>

                  <!-- Repository list — Item.List inside a flush CardBox so the
                       row dividers span edge to edge. -->
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List v-if="filteredRepos.length">
                        <Item
                          v-for="(repo, i) in filteredRepos"
                          :key="`${repo.name}-${i}`"
                          size="small"
                        >
                          <Item.Media>
                            <span
                              class="flex size-7 shrink-0 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                            >
                              <i
                                :class="repo.icon"
                                class="text-[1rem] leading-none text-[var(--text-default)]"
                                aria-hidden="true"
                              />
                            </span>
                          </Item.Media>
                          <Item.Content>
                            <Item.Title>{{ repo.name }}</Item.Title>
                            <Item.Description
                              class="flex items-center gap-[var(--spacing-xxs)] text-body-xs"
                            >
                              <i class="pi pi-history" aria-hidden="true" />
                              {{ repo.age }}
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions>
                            <Button label="Import" kind="secondary" size="small" />
                          </Item.Actions>
                        </Item>
                      </Item.List>
                      <p
                        v-else
                        class="px-[var(--spacing-md)] py-[var(--spacing-lg)] text-center text-body-sm text-[var(--text-muted)]"
                      >
                        No repositories match “{{ search }}”.
                      </p>
                    </template>
                  </CardBox>
                </section>

                <!-- Recommended templates -->
                <CardBox  class="h-full">
                  <template #header>
                    <h2 class="text-heading-xs text-[var(--text-default)]">
                      Recommended Templates
                    </h2>
                  </template>
                  <template #content>
                    <div
                      class="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-3"
                    >
                      <button
                        v-for="(tpl, i) in templates"
                        :key="`${tpl.title}-${i}`"
                        type="button"
                        class="flex flex-col gap-[var(--spacing-md)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-md)] text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
                        @click="deployTemplate(tpl)"
                      >
                        <span
                          class="flex size-8 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                        >
                          <i
                            :class="tpl.icon"
                            class="text-[1.125rem] leading-none text-[var(--text-default)]"
                            aria-hidden="true"
                          />
                        </span>
                        <span class="flex flex-col gap-[var(--spacing-xs)]">
                          <span
                            class="text-label-md text-[var(--text-default)]"
                            >{{ tpl.title }}</span
                          >
                          <span
                            class="line-clamp-2 text-body-xs text-[var(--text-muted)]"
                          >
                            {{ tpl.description }}
                          </span>
                        </span>
                      </button>
                    </div>
                  </template>
                  <template #footer>
                    <div class="flex justify-end">
                      <Button
                        label="Browse Templates"
                        kind="outlined"
                        size="medium"
                      />
                    </div>
                  </template>
                </CardBox>
              </div>
            </TabView.Panel>

            <!-- Start from Template -->
            <TabView.Panel value="template">
              <div
                class="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-3"
              >
                <button
                  v-for="(tpl, i) in templates"
                  :key="`grid-${tpl.title}-${i}`"
                  type="button"
                  class="flex flex-col gap-[var(--spacing-md)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-lg)] text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
                  @click="deployTemplate(tpl)"
                >
                  <span
                    class="flex size-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                  >
                    <i
                      :class="tpl.icon"
                      class="text-[1.375rem] leading-none text-[var(--text-default)]"
                      aria-hidden="true"
                    />
                  </span>
                  <span class="flex flex-col gap-[var(--spacing-xs)]">
                    <span class="text-label-md text-[var(--text-default)]">{{
                      tpl.title
                    }}</span>
                    <span class="text-body-xs text-[var(--text-muted)]">{{
                      tpl.description
                    }}</span>
                  </span>
                </button>
              </div>
            </TabView.Panel>

            <!-- Create Resources -->
            <TabView.Panel value="resources">
              <div
                class="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2"
              >
                <button
                  v-for="res in resources"
                  :key="res.id"
                  type="button"
                  class="flex items-start gap-[var(--spacing-md)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-lg)] text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
                >
                  <span
                    class="flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)] text-[var(--primary)]"
                  >
                    <i :class="res.icon" aria-hidden="true" />
                  </span>
                  <span class="flex flex-col gap-[var(--spacing-xxs)]">
                    <span class="text-label-md text-[var(--text-default)]">{{
                      res.label
                    }}</span>
                    <span class="text-body-xs text-[var(--text-muted)]">{{
                      res.description
                    }}</span>
                  </span>
                </button>
              </div>
            </TabView.Panel>
          </TabView.Content>
        </TabView>
      </div>
    </main>
  </div>
</template>
