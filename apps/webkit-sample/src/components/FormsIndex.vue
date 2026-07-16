<script setup>
// The Forms hub — an index of the form types the `/form` skill documents, each a
// live example under a /forms sub-route. A form's Fields, spacing, and hierarchy
// (the shared Form Layout) are constant; a "type" only changes the container it
// lives in and its save model. This page is navigation only.
//
// Every form linked here follows `/ui-craft` (webkit components + tokens only) and
// `/usability` Pattern 1: the async save locks its scope off one `submitting` flag
// — Save shows :loading and every field is :disabled — releasing in finally, and
// reports request failures via toast. Multi-save forms lock per card.
import Tag from "@aziontech/webkit/tag";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// The form types, each with a live sub-route example. `save` states the save
// model (one unit vs. one-per-section); `surface` names the container.
const examples = [
  {
    id: "in-page",
    title: "In Page create",
    description:
      "The module create for a long form — a dedicated page with its own creation header and a sticky footer, sidebar hidden so the form is the only focus. Section-titled ItemGroup sections, one save. Approach A.",
    icon: "pi pi-file-edit",
    surface: "Page",
    save: "One save",
    path: "/forms/in-page",
  },
  {
    id: "fields-separated",
    title: "Fields separated",
    description:
      "Standalone field-* triads stacked in a column — a Git + template configuration built as one page with a single save. Approach B.",
    icon: "pi pi-align-left",
    surface: "Page",
    save: "One save",
    path: "/forms/fields-separated",
  },
  {
    id: "drawer",
    title: "Drawer form",
    description:
      "In-context creation — create a resource without leaving the list. One scoped save in the drawer footer.",
    icon: "pi pi-window-maximize",
    surface: "Drawer",
    save: "One save",
    path: "/forms/drawer",
  },
  {
    id: "drawer-itemgroups",
    title: "ItemGroups in a Drawer",
    description:
      "In-context create whose body is several section-titled ItemGroup sections — the settings layout in a drawer. One scoped save. Approach A.",
    icon: "pi pi-clone",
    surface: "Drawer",
    save: "One save",
    path: "/forms/drawer-itemgroups",
  },
  {
    id: "dialog",
    title: "Dialog form",
    description:
      "A short, blocking decision — a destructive delete guarded by a typed confirmation. Approach B.",
    icon: "pi pi-exclamation-triangle",
    surface: "Dialog",
    save: "One confirm",
    path: "/forms/dialog",
  },
  {
    id: "itemgroup",
    title: "ItemGroup settings",
    description:
      "Account-level settings as Item rows in a single flush block. One save. Approach A.",
    icon: "pi pi-list",
    surface: "Page",
    save: "One save",
    path: "/forms/itemgroup",
  },
  {
    id: "cardbox",
    title: "CardBox with independent saves",
    description:
      "A long configuration page split into cards, where each card owns its own save. Approach A inside each card.",
    icon: "pi pi-th-large",
    surface: "Page",
    save: "Save per card",
    path: "/forms/cardbox",
  },
  {
    id: "itemgroup-saves",
    title: "ItemGroup with independent saves",
    description:
      "The ItemGroup surface (Item rows in a flush card) split by topic — each group owns its own save. Approach A.",
    icon: "pi pi-server",
    surface: "Page",
    save: "Save per group",
    path: "/forms/itemgroup-saves",
  },
];

const open = (example) =>
  router.push({ path: example.path, query: { email: userEmail.value } });
</script>

<template>
  <AppLayout active="forms" :breadcrumb="[{ label: 'Forms' }]">
    <main class="flex h-full flex-col gap-[var(--spacing-lg)]">
      <PageHeading
        title="Forms"
        description="The form types on @aziontech/webkit. Every form shares the same Form Layout (spacing + hierarchy); a type only changes the container and its save model. Open an example to see it in a real flow."
      />

      <div
        class="grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-3"
      >
        <button
          v-for="example in examples"
          :key="example.id"
          type="button"
          class="flex w-full flex-col gap-[var(--spacing-md)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-lg)] text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
          @click="open(example)"
        >
          <div class="flex w-full items-center justify-between gap-[var(--spacing-sm)]">
            <span
              class="flex size-2 p-3 bg-[var(--bg-surface-raised)] shrink-0 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-default)]  text-[var(--primary)]"
            >
              <i class="text-body-xs" :class="example.icon" aria-hidden="true" />
            </span>
            <div class="flex items-center gap-[var(--spacing-xxs)]">
              <Tag :value="example.surface" severity="secondary" size="medium" />
              <Tag :value="example.save" severity="info" size="medium" />
            </div>
          </div>
          <span class="flex w-full flex-col gap-[var(--spacing-xs)]">
            <span class="text-label-md text-[var(--text-default)]">
              {{ example.title }}
            </span>
            <span class="text-body-xs text-[var(--text-muted)]">
              {{ example.description }}
            </span>
          </span>
        </button>
      </div>
    </main>
  </AppLayout>
</template>
