<script setup>
import Avatar from "@aziontech/webkit/avatar";
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import GlobalHeader from "@aziontech/webkit/global-header";
import MenuItem from "@aziontech/webkit/menu-item";
import SidebarGroup from "@aziontech/webkit/sidebar-group";
import SidebarHeader from "@aziontech/webkit/sidebar-header";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppSidebar from "./ui/AppSidebar.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

const active = ref("home");

// Azion Console navigation, grouped by product area. Icons are Azion brand
// glyphs (`ai ai-*`) except Domains, which uses a PrimeIcon.
const navGroups = [
  {
    items: [
      { id: "home", label: "Home", icon: "ai ai-home" },
      { id: "marketplace", label: "Marketplace", icon: "ai ai-marketplace" },
      { id: "domains", label: "Domains", icon: "pi pi-globe" },
    ],
  },
  {
    label: "Build",
    items: [
      { id: "applications", label: "Applications", icon: "ai ai-edge-application" },
      { id: "variables", label: "Variables", icon: "ai ai-variables" },
    ],
  },
  {
    label: "Secure",
    items: [
      { id: "edge-dns", label: "Edge DNS", icon: "ai ai-edge-dns" },
      { id: "firewalls", label: "Firewalls", icon: "ai ai-edge-firewall" },
    ],
  },
  {
    label: "Store",
    items: [
      { id: "object-storage", label: "Object Storage", icon: "ai ai-edge-storage" },
      {
        id: "sql-database",
        label: "SQL Database",
        icon: "ai ai-edge-sql",
        tag: "Preview",
      },
    ],
  },
  {
    label: "Deploy",
    items: [{ id: "edge-nodes", label: "Edge Nodes", icon: "ai ai-edge-nodes" }],
  },
  {
    label: "Observe",
    items: [
      { id: "data-stream", label: "Data Stream", icon: "ai ai-data-stream" },
      { id: "edge-pulse", label: "Edge Pulse", icon: "ai ai-edge-pulse" },
      {
        id: "real-time-metrics",
        label: "Real-Time Metrics",
        icon: "ai ai-real-time-metrics",
      },
      {
        id: "real-time-events",
        label: "Real-Time Events",
        icon: "ai ai-real-time-events",
      },
    ],
  },
  {
    label: "Tools",
    items: [
      { id: "real-time-purge", label: "Real-Time Purge", icon: "ai ai-real-time-purge" },
    ],
  },
  {
    label: "Edge Libraries",
    items: [
      {
        id: "certificate-manager",
        label: "Certificate Manager",
        icon: "ai ai-digital-certificates",
      },
      { id: "edge-services", label: "Edge Services", icon: "ai ai-edge-services" },
      { id: "functions", label: "Functions", icon: "ai ai-edge-functions" },
      { id: "network-lists", label: "Network Lists", icon: "ai ai-network-lists" },
      { id: "waf-rules", label: "WAF Rules", icon: "ai ai-waf-rules" },
    ],
  },
];

const stats = [
  { label: "Total Requests", value: "1.24M" },
  { label: "Data Transferred", value: "842 GB" },
  { label: "Edge Functions", value: "17" },
  { label: "Avg. Response", value: "38 ms" },
];

const openCreationCenter = () =>
  router.push({ path: "/create", query: { email: userEmail.value } });

const openAccountSettings = () =>
  router.push({ path: "/account", query: { email: userEmail.value } });

const signOut = () => router.push("/login");
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <!-- Global header -->
    <GlobalHeader aria-label="Azion Console">
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
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Create"
          kind="primary"
          size="small"
          icon="pi pi-plus"
          @click="openCreationCenter"
        />
        <Button
          label="Documentation"
          kind="outlined"
          size="small"
          icon="pi pi-book"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] motion-reduce:transition-none"
          @click="openAccountSettings"
        >
          <Avatar :label="userEmail" size="small" />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

    <!-- Body: sidebar + content -->
    <div class="flex min-h-0 flex-1">
      <AppSidebar
        :user="userEmail"
        aria-label="Main navigation"
        @overflow="signOut"
      >
        <template #header>
          <SidebarHeader>
            <p class="text-overline-sm text-[var(--text-muted)]">Workspace</p>
            <p class="truncate text-label-sm text-[var(--text-default)]">
              Azion Edge
            </p>
          </SidebarHeader>
        </template>

        <SidebarGroup
          v-for="(group, i) in navGroups"
          :key="group.label ?? `group-${i}`"
          :label="group.label"
        >
          <MenuItem
            v-for="item in group.items"
            :key="item.id"
            :label="item.label"
            :icon="item.icon"
            :selected="active === item.id"
            :tag-value="item.tag"
            @click="active = item.id"
          />
        </SidebarGroup>
      </AppSidebar>

      <!-- Main content -->
      <main class="min-w-0 flex-1 overflow-auto p-[var(--spacing-xl)]">
        <header
          class="mb-[var(--spacing-sm)] flex flex-col gap-[var(--spacing-xxs)]"
        >
          <h1 class="text-heading-lg text-[var(--text-default)]">Dashboard</h1>
          <p class="text-body-md text-[var(--text-muted)]">
            Welcome back, {{ userEmail }}.
          </p>
        </header>

        <!-- Stat cards -->
        <section
          class="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-4"
        >
          <CardBox v-for="stat in stats" :key="stat.label">
            <template #content>
              <div
                class="flex flex-col gap-[var(--spacing-xs)] p-[var(--spacing-lg)]"
              >
                <span class="text-overline-sm text-[var(--text-muted)]">{{
                  stat.label
                }}</span>
                <span
                  class="text-big-number-sm tabular-nums text-[var(--text-default)]"
                  >{{ stat.value }}</span
                >
              </div>
            </template>
          </CardBox>
        </section>
      </main>
    </div>
  </div>
</template>
