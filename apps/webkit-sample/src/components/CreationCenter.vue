<script setup>
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import EmptyState from "@aziontech/webkit/empty-state";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Link from "@aziontech/webkit/link";
import Select from "@aziontech/webkit/select";
import Skeleton from "@aziontech/webkit/skeleton";
import TabView from "@aziontech/webkit/tab-view";
import { toast } from "@aziontech/webkit/toast";
import { computed, onBeforeUnmount, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import CreationHeader from "./ui/CreationHeader.vue";
import PageHeading from "./ui/PageHeading.vue";
import TemplateBrowser from "./ui/TemplateBrowser.vue";

const route = useRoute();
const router = useRouter();

// Carry the signed-in user across the flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

const goHome = () =>
  router.push({ path: "/home", query: { email: userEmail.value } });

// Map a chosen template to a deploy-flow catalog slug. The template's precise
// `tech` drives the mapping; techs without a dedicated demo template fall back to
// the closest available boilerplate.
const TECH_TO_SLUG = {
  next: "next-boilerplate",
  react: "react-boilerplate",
  vue: "vue-boilerplate",
  angular: "angular-boilerplate",
  astro: "astro-starter",
  svelte: "svelte-boilerplate",
  nuxt: "nuxt-ecommerce",
  solidjs: "solidjs-starter",
  redwood: "redwood-boilerplate",
  flutter: "flutter-web",
};

// Clicking a template card opens the deploy flow with its catalog slug.
const deployTemplate = (tpl) =>
  router.push({
    path: "/deploy",
    query: {
      email: userEmail.value,
      template: TECH_TO_SLUG[tpl.tech] ?? "nuxt-ecommerce",
    },
  });

// Importing a repository routes into the same deploy flow, cloning the selected
// repo under the current account scope instead of a catalog template.
const importRepo = (repo) =>
  router.push({
    path: "/deploy",
    query: { email: userEmail.value, repo: repo.name, owner: scope.value },
  });

const activeTab = ref("git");
const search = ref("");

// Git provider connection. Starts disconnected, showing the "Connect your
// Repository" empty state; clicking "Continue with GitHub" runs a brief loading
// state that simulates the OAuth handshake, then reveals the connected importer
// (account scope + repos).
const gitConnected = ref(false);
const connecting = ref(false);

// Once connected (or when the account scope changes), the repository list is
// "fetched": the scope + search chrome appear immediately, but the list itself
// shows Skeleton rows for a beat so the reveal never pops in blank.
const reposLoading = ref(false);

let connectTimer = null;
let reposTimer = null;

const loadRepos = () => {
  reposLoading.value = true;
  if (reposTimer) clearTimeout(reposTimer);
  reposTimer = setTimeout(() => {
    reposLoading.value = false;
  }, 900);
};

const connectGit = () => {
  connecting.value = true;
  connectTimer = setTimeout(() => {
    connecting.value = false;
    gitConnected.value = true;
    loadRepos();
  }, 1500);
};

// GitHub is the only connected provider in this prototype. Account scopes are
// the GitHub accounts the user has linked; the Select lets them add another.
const scopes = reactive([{ label: "cesaroeduardo", value: "cesaroeduardo" }]);
const scope = ref(scopes[0].value);

// Sentinel value for the trailing "Add GitHub Account" option — selecting it
// runs the connect flow instead of becoming the chosen scope.
const ADD_ACCOUNT = "__add-account__";

// Mock "connect another GitHub account": append a linked account and select it,
// standing in for the GitHub OAuth flow. Switching scope re-fetches the repos.
let linkedCount = 0;
const onSelectScope = (value) => {
  if (value !== ADD_ACCOUNT) {
    if (value === scope.value) return;
    scope.value = value;
    loadRepos();
    return;
  }
  linkedCount += 1;
  const account = `github-account-${linkedCount}`;
  scopes.push({ label: account, value: account });
  scope.value = account;
  loadRepos();
};

onBeforeUnmount(() => {
  if (connectTimer) clearTimeout(connectTimer);
  if (reposTimer) clearTimeout(reposTimer);
});

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

// Recommended templates — the full Marketplace framework set. Colored brand
// logos from @aziontech/icons (`ai-cor ai-*`), each with the framework's brand
// hex for the soft hover glow. Rendered via the shared TemplateBrowser module.
const templates = [
  {
    title: "Next.js Boilerplate",
    description:
      "Deploy a full-stack Next.js application to the edge in a few steps.",
    icon: "ai-cor ai-next",
    color: "#0070f3",
    tech: "next",
    useCases: ["ai", "ecommerce", "marketing"],
  },
  {
    title: "React Boilerplate",
    description: "Automate your React.js deployment process on the edge.",
    icon: "ai-cor ai-react",
    color: "#61dafb",
    tech: "react",
    useCases: ["ai", "marketing"],
  },
  {
    title: "Vue.js Quick Setup",
    description:
      "A lightweight template to rapidly build Vue.js applications on the edge.",
    icon: "ai-cor ai-vue",
    color: "#42b883",
    tech: "vue",
    useCases: ["blog", "marketing"],
  },
  {
    title: "Angular Boilerplate",
    description: "Automate your Angular deployment process with this template.",
    icon: "ai-cor ai-angular",
    color: "#dd0031",
    tech: "angular",
    useCases: ["multi-tenant"],
  },
  {
    title: "Astro Starter",
    description: "Ship a content-driven Astro site that renders at the edge.",
    icon: "ai-cor ai-astro",
    color: "#ff5d01",
    tech: "astro",
    useCases: ["blog", "marketing"],
  },
  {
    title: "Svelte Boilerplate",
    description:
      "Accelerate the deployment of Svelte applications to run on the edge.",
    icon: "ai-cor ai-svelte",
    color: "#ff3e00",
    tech: "svelte",
    useCases: ["blog"],
  },
  {
    title: "Nuxt E-commerce",
    description: "Launch a Nuxt e-commerce or content app on the edge.",
    icon: "ai-cor ai-nuxt",
    color: "#00dc82",
    tech: "nuxt",
    useCases: ["ecommerce", "multi-tenant"],
  },
  {
    title: "SolidJS Starter",
    description: "Build a fine-grained reactive SolidJS app on the edge.",
    icon: "ai-cor ai-solidjs",
    color: "#4f88c6",
    tech: "solidjs",
    useCases: ["ai"],
  },
  {
    title: "RedwoodJS Boilerplate",
    description: "Deploy a full-stack RedwoodJS application on the edge.",
    icon: "ai-cor ai-redwood",
    color: "#bf4722",
    tech: "redwood",
    useCases: ["ecommerce", "multi-tenant"],
  },
  {
    title: "Flutter Web",
    description: "Serve a cross-platform Flutter web build from the edge.",
    icon: "ai-cor ai-flutter",
    color: "#54c5f8",
    tech: "flutter",
    useCases: ["marketing"],
  },
];

// Template filter options — two labelled groups (Use Cases / Technology) fed to
// the TemplateBrowser module's Filter Dropdown. Option values are unique across
// both groups, so the group a value belongs to is recoverable from them.
const useCaseOptions = [
  { value: "ai", label: "AI/Agent", icon: "pi pi-star" },
  { value: "ecommerce", label: "Ecommerce", icon: "pi pi-shopping-cart" },
  { value: "blog", label: "Blog", icon: "pi pi-pencil" },
  { value: "marketing", label: "Marketing sites", icon: "pi pi-megaphone" },
  { value: "multi-tenant", label: "Multi-tenant platforms", icon: "pi pi-sitemap" },
];
const technologyOptions = [
  { value: "next", label: "Next.js", icon: "ai-cor ai-next" },
  { value: "react", label: "React", icon: "ai-cor ai-react" },
  { value: "vue", label: "Vue.js", icon: "ai-cor ai-vue" },
  { value: "angular", label: "Angular", icon: "ai-cor ai-angular" },
  { value: "astro", label: "Astro", icon: "ai-cor ai-astro" },
  { value: "svelte", label: "Svelte", icon: "ai-cor ai-svelte" },
  { value: "nuxt", label: "Nuxt", icon: "ai-cor ai-nuxt" },
  { value: "solidjs", label: "SolidJS", icon: "ai-cor ai-solidjs" },
  { value: "redwood", label: "RedwoodJS", icon: "ai-cor ai-redwood" },
  { value: "flutter", label: "Flutter", icon: "ai-cor ai-flutter" },
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

const createResource = (res) =>
  toast.info(res.label, {
    description: `Starting a new ${res.label} flow.`,
  });
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <!-- Global header: back to console, brand + breadcrumb. -->
    <CreationHeader
      :breadcrumb="[{ label: 'Creation Center', current: true }]"
      back-label="Back to Home"
      @back="goHome"
    />

    <!-- Flow content -->
    <main class="min-w-0 flex-1 overflow-auto">
      <div
        class="mx-auto flex w-full flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]"
      >
        <PageHeading
          size="large"
          title="Build on the most reliable network on earth"
          description="Start from a repository, use a template, or create resources from scratch."
        />

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
                class="grid grid-cols-1 items-start gap-[var(--spacing-lg)] lg:grid-cols-2"
              >
                <!-- Importer: an empty state until a Git provider is connected,
                     then the account scope + repository list. A solid CardBox
                     framing a dashed, raised EmptyState surface (per Figma). -->
                <CardBox v-if="!gitConnected">
                  <template #content>
                    <EmptyState
                      size="large"
                      title="Connect your Repository"
                      description="Choose a Git provider to connect your repository and start the deployment process."
                      class=" flex-1 rounded-[var(--shape-card)] border border-dashed border-[var(--border-default)] bg-[var(--bg-surface-raised)]"
                    >
                      <template #icon>
                        <!-- Featured icon: a solid GitHub tile framed by two
                             concentric translucent squares. -->
                        <span
                          class="relative flex size-10 items-center justify-center"
                        >
                          <span
                            aria-hidden="true"
                            class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-5"
                          />
                          <span
                            aria-hidden="true"
                            class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-[var(--shape-card)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-10"
                          />
                          <span
                            class="relative flex size-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)]"
                          >
                            <i
                              class="pi pi-github text-[1rem] leading-none text-[var(--text-default)]"
                              aria-hidden="true"
                            />
                          </span>
                        </span>
                      </template>
                      <template #actions>
                        <Button
                          label="Continue with Github"
                          icon="pi pi-github"
                          kind="secondary"
                          size="large"
                          :loading="connecting"
                          @click="connectGit"
                        />
                        <Link
                          label="Manage connected providers"
                          href="#"
                          size="small"
                          @click.prevent
                        />
                      </template>
                    </EmptyState>
                  </template>
                </CardBox>

                <section v-else class="flex flex-col gap-[var(--spacing-lg)]">
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
                      <!-- Fetching the account's repositories: reserve the row
                           layout with Skeleton rows so the list never pops in
                           blank once the connection settles. -->
                      <Item.List v-if="reposLoading" key="repos-loading" aria-busy="true">
                        <Item
                          v-for="n in 3"
                          :key="`repo-skeleton-${n}`"
                          size="small"
                        >
                          <Item.Media>
                            <Skeleton
                              kind="shape"
                              width="1.75rem"
                              height="1.75rem"
                            />
                          </Item.Media>
                          <Item.Content>
                            <Skeleton width="40%" height="0.875rem" />
                            <Skeleton width="25%" height="0.75rem" />
                          </Item.Content>
                          <Item.Actions>
                            <Skeleton width="4.5rem" height="1.75rem" />
                          </Item.Actions>
                        </Item>
                      </Item.List>
                      <Item.List v-else-if="filteredRepos.length" key="repos-list">
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
                            <Button
                              label="Import"
                              kind="secondary"
                              size="small"
                              @click="importRepo(repo)"
                            />
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

                <!-- Recommended templates — the same TemplateBrowser module as
                     the "Start from Template" tab (title + filter dropdown +
                     grid), dropped to two columns for the narrower column. -->
                <TemplateBrowser
                  title="Recommended Templates"
                  :templates="templates"
                  :use-case-options="useCaseOptions"
                  :technology-options="technologyOptions"
                  browse-label="Browse Templates"
                  grid-class="grid-cols-1 sm:grid-cols-2"
                  @select="deployTemplate"
                />
              </div>
            </TabView.Panel>

            <!-- Start from Template -->
            <TabView.Panel value="template">
              <TemplateBrowser
                title="Clone Template"
                :templates="templates"
                :use-case-options="useCaseOptions"
                :technology-options="technologyOptions"
                @select="deployTemplate"
              />
            </TabView.Panel>

            <!-- Create Resources — same card logic as the Marketplace vendor
                 cards: a clickable CardBox with a left icon tile, title and
                 description. -->
            <TabView.Panel value="resources">
              <div
                class="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2"
              >
                <CardBox
                  v-for="res in resources"
                  :key="res.id"
                  class="cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                  role="button"
                  tabindex="0"
                  @click="createResource(res)"
                  @keydown.enter="createResource(res)"
                  @keydown.space.prevent="createResource(res)"
                >
                  <template #content>
                    <div class="flex items-start gap-[var(--spacing-md)]">
                      <span
                        class="flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)] text-[var(--primary)]"
                      >
                        <i :class="res.icon" aria-hidden="true" />
                      </span>
                      <div class="flex flex-col gap-[var(--spacing-xxs)]">
                        <h3 class="text-label-md text-[var(--text-default)]">
                          {{ res.label }}
                        </h3>
                        <p class="text-pretty text-body-sm text-[var(--text-muted)]">
                          {{ res.description }}
                        </p>
                      </div>
                    </div>
                  </template>
                </CardBox>
              </div>
            </TabView.Panel>
          </TabView.Content>
        </TabView>
      </div>
    </main>
  </div>
</template>
