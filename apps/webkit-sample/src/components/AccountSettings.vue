<script setup>
import Button from "@aziontech/webkit/button";
import ButtonHighlight from "@aziontech/webkit/button-highlight";
import CardBox from "@aziontech/webkit/card-box";
import GlobalHeader from "@aziontech/webkit/global-header";
import IconButton from "@aziontech/webkit/icon-button";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import MenuItem from "@aziontech/webkit/menu-item";
import Select from "@aziontech/webkit/select";
import SidebarGroup from "@aziontech/webkit/sidebar-group";
import Switch from "@aziontech/webkit/switch";
import Tag from "@aziontech/webkit/tag";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppSidebar from "./ui/AppSidebar.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

const goToDashboard = () =>
  router.push({ path: "/dashboard", query: { email: userEmail.value } });

const openCreationCenter = () =>
  router.push({ path: "/create", query: { email: userEmail.value } });

// Left rail: a single "Account Settings" group. General is the page we're on.
const sections = [
  { id: "general", label: "General", icon: "pi pi-cog" },
  { id: "settings", label: "Settings", icon: "pi pi-sliders-h" },
  { id: "billing", label: "Billing", icon: "pi pi-credit-card" },
];
const activeSection = ref("general");
const sidebarSearch = ref("");

// Azion Agent — pick the workload the account provisions applications into.
const agentOptions = [
  { label: "Default Workload", value: "default" },
  { label: "Production", value: "production" },
  { label: "Staging", value: "staging" },
];
const agent = ref("");

// Login settings — account-wide auth toggles.
const loginSettings = reactive([
  {
    key: "social",
    title: "Allow Social Login",
    description:
      "When enabled, users linked to the account can log in using their social network credentials.",
    enabled: true,
  },
  {
    key: "mfa",
    title: "Enforce Multi-Factor Authentication",
    description:
      "When enabled, MFA will be enforced upon login for all users linked to this account.",
    enabled: true,
  },
]);

// Source control providers. GitHub is connected; GitLab can be linked.
const sourceControls = [
  {
    key: "github",
    name: "Github",
    icon: "pi pi-github",
    status: "Active",
    description:
      "Connected as rafael.umman to repositories in organizations: azion-tech, rafael-personal.",
    action: "Manage",
  },
  {
    key: "gitlab",
    name: "Gitlab",
    icon: "ai-cor ai-gitlab",
    description: "Connect GitLab for Cloud Agents, and enhanced codebase control.",
    action: "Connect",
  },
];

// Framework integrations available to connect.
const integrations = [
  {
    key: "vue",
    name: "Vue Integration",
    icon: "ai-cor ai-vue",
    description: "Deploy and manage Vue.js applications directly from the edge.",
  },
  {
    key: "react",
    name: "React Integration",
    icon: "ai-cor ai-react",
    description: "Deploy and manage React applications directly from the edge.",
  },
  {
    key: "svelte",
    name: "Svelte Integration",
    icon: "ai-cor ai-svelte",
    description: "Deploy and manage Svelte applications directly from the edge.",
  },
];
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <!-- Global header: menu + brand, then Create / Copilot / Feedback / Help. -->
    <GlobalHeader aria-label="Azion Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-bars"
          aria-label="Toggle menu"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
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
        </GlobalHeader.Brand>
      </GlobalHeader.Left>

      <GlobalHeader.Middle />

      <GlobalHeader.Right>
        <Button
          label="Create"
          kind="primary"
          size="medium"
          icon="pi pi-plus"
          @click="openCreationCenter"
        />
        <!-- Copilot: the design's gradient "ButtonHighlight" action. -->
        <ButtonHighlight label="Copilot" icon="ai ai-ask-azion" size="medium" />
        <Button label="Feedback" kind="outlined" size="medium" icon="pi pi-flag" />
        <IconButton
          icon="pi pi-question-circle"
          aria-label="Help"
          kind="outlined"
          size="medium"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <!-- Body: settings sidebar + centered content column. -->
    <div class="flex min-h-0 flex-1">
      <AppSidebar :user="userEmail" aria-label="Account settings navigation">
        <template #header>
          <div class="flex items-center gap-[var(--spacing-sm)]">
            <Button
              label="Back"
              kind="outlined"
              size="small"
              icon="pi pi-chevron-left"
              @click="goToDashboard"
            />
            <InputText
              v-model="sidebarSearch"
              placeholder="Search"
              aria-label="Search settings"
              class="min-w-0 flex-1"
            >
              <template #iconLeft>
                <i class="pi pi-search" aria-hidden="true" />
              </template>
            </InputText>
          </div>
        </template>

        <SidebarGroup label="Account Settings">
          <MenuItem
            v-for="section in sections"
            :key="section.id"
            :label="section.label"
            :icon="section.icon"
            :selected="activeSection === section.id"
            @click="activeSection = section.id"
          />
        </SidebarGroup>
      </AppSidebar>

      <!-- Content -->
      <main class="min-w-0 flex-1 overflow-auto px-[var(--spacing-lg)] py-[var(--spacing-xxl)]">
        <div
          class="mx-auto flex w-full max-w-[896px] flex-col gap-[var(--spacing-xl)]"
        >
          <!-- Page header -->
          <header class="flex flex-col gap-[var(--spacing-xxs)]">
            <h1 class="text-heading-sm text-[var(--text-default)]">
              Account Settings
            </h1>
            <p class="text-heading-xss text-[var(--text-muted)]">
              Manage account-level settings that control identity, access,
              billing, and organization usage.
            </p>
          </header>

          <!-- Azion Agent: single-row card with a workload picker. -->
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item>
                  <Item.Content>
                    <Item.Title>Azion Agent</Item.Title>
                    <Item.Description>
                      Create a Workload with Azion to launch an Application.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions>
                    <Select
                      v-model="agent"
                      placeholder="Select an option..."
                      class="w-[200px]"
                      :display-value="
                        (v) =>
                          agentOptions.find((o) => o.value === v)?.label ?? ''
                      "
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Option
                          v-for="option in agentOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>

          <!-- Login settings: account-wide auth toggles. -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-overline-sm text-[var(--text-muted)]">
              Login Settings
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item v-for="setting in loginSettings" :key="setting.key">
                    <Item.Content>
                      <Item.Title>{{ setting.title }}</Item.Title>
                      <Item.Description>{{ setting.description }}</Item.Description>
                    </Item.Content>
                    <Item.Actions>
                      <Switch
                        v-model:isToggled="setting.enabled"
                        :aria-label="setting.title"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Source control providers. -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-overline-sm text-[var(--text-muted)]">
              Source Control
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item v-for="provider in sourceControls" :key="provider.key">
                    <Item.Media>
                      <span
                        class="flex size-8 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                      >
                        <i
                          :class="provider.icon"
                          class="text-[20px] leading-none text-[var(--text-default)]"
                          aria-hidden="true"
                        />
                      </span>
                    </Item.Media>
                    <Item.Content>
                      <Item.Title>
                        <span class="flex items-center gap-[var(--spacing-xxs)]">
                          {{ provider.name }}
                          <Tag
                            v-if="provider.status"
                            :value="provider.status"
                            severity="success"
                            size="small"
                          />
                        </span>
                      </Item.Title>
                      <Item.Description>{{ provider.description }}</Item.Description>
                    </Item.Content>
                    <Item.Actions>
                      <Button
                        :label="provider.action"
                        kind="outlined"
                        size="small"
                        :icon="provider.action === 'Connect' ? 'pi pi-external-link' : undefined"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Framework integrations. -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-overline-sm text-[var(--text-muted)]">
              Integrations
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item v-for="integration in integrations" :key="integration.key">
                    <Item.Media>
                      <span
                        class="flex size-8 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                      >
                        <i
                          :class="integration.icon"
                          class="text-[20px] leading-none text-[var(--text-default)]"
                          aria-hidden="true"
                        />
                      </span>
                    </Item.Media>
                    <Item.Content>
                      <Item.Title>{{ integration.name }}</Item.Title>
                      <Item.Description>{{ integration.description }}</Item.Description>
                    </Item.Content>
                    <Item.Actions>
                      <Button
                        label="Connect"
                        kind="outlined"
                        size="small"
                        icon="pi pi-external-link"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
