<script setup>
// Form type: CARDBOX WITH INDEPENDENT SAVES (the `/form` skill, "Form types"). A
// long configuration page split into CardBox sections where EACH CARD OWNS ITS OWN
// SAVE — the user commits changes in parts instead of one giant submit. Approach A
// inside each card. Each card locks INDEPENDENTLY off its own `submitting` flag (the
// /usability loading pattern, scoped to the saved block): that card's fields and its
// right-side controls disable and its Save shows loading, while the other cards stay
// live. The save reports via toast. Each card's name is the
// CardBox `title` (its Heading, in the header) — never a title inside the content;
// the card's guidance is a Message (title + description). A per-card Save is
// `secondary` (the page has no primary), and the first card keeps the Azion Toolbar
// layout (Save in the box footer, with a Learn-more link).
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Label from "@aziontech/webkit/label";
import Link from "@aziontech/webkit/link";
import Message from "@aziontech/webkit/message";
import Select from "@aziontech/webkit/select";
import Switch from "@aziontech/webkit/switch";
import { toast } from "@aziontech/webkit/toast";
import { reactive, ref } from "vue";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

// --- Card 1: Azion Toolbar ----------------------------------------------
const toolbarOptions = [
  { label: "Default (controlled at the team level)", value: "default" },
  { label: "Enabled", value: "enabled" },
  { label: "Disabled", value: "disabled" },
];
const toolbarLabel = (value) =>
  toolbarOptions.find((option) => option.value === value)?.label ?? "";
const toolbar = reactive({ preprod: "default", prod: "default" });
const savingToolbar = ref(false);

// --- Card 2: Deployment Protection --------------------------------------
const protectionOptions = [
  { label: "Standard Protection", value: "standard" },
  { label: "Only Preview Deployments", value: "preview" },
  { label: "All Deployments", value: "all" },
];
const protectionLabel = (value) =>
  protectionOptions.find((option) => option.value === value)?.label ?? "";
const protection = reactive({ level: "standard", shareableLinks: true });
const savingProtection = ref(false);

// Each card commits independently through the same one-flag lock.
const saveCard = async (flag, message) => {
  if (flag.value) return; // per-card re-entrancy lock
  flag.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success(message);
  } catch (error) {
    toast.error("Could not save.", {
      description: error?.message ?? "Check your connection and try again.",
    });
  } finally {
    flag.value = false;
  }
};

const saveToolbar = () => saveCard(savingToolbar, "Azion Toolbar settings saved.");
const saveProtection = () =>
  saveCard(savingProtection, "Deployment Protection settings saved.");
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'CardBox with independent saves' }]"
  >
    <main class="flex w-full flex-col gap-[var(--spacing-lg)]">
      <PageHeading
        title="Project Settings"
        description="A long configuration page split into cards — each card owns its own save, so changes commit in parts."
      />

      <!-- Card 1 — Azion Toolbar (title = CardBox Heading; Save in the box footer). -->
      <CardBox title="Azion Toolbar" class="w-full">
        <template #content>
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
            :disabled="savingToolbar"
          >
            <legend class="sr-only">Azion Toolbar</legend>

            <Message
              severity="info"
              title="Enable the Azion Toolbar on your Deployments."
              description="To use the toolbar in production your team members need the Chrome extension or to enable the toolbar for that domain in the toolbar menu."
            />

            <div class="grid grid-cols-1 gap-[var(--spacing-lg)] sm:grid-cols-2">
              <div class="flex flex-col gap-[var(--spacing-xs)]">
                <Label for="tb-preprod">Pre-Production Deployments</Label>
                <Select v-model="toolbar.preprod" size="large" :disabled="savingToolbar" :display-value="toolbarLabel">
                  <Select.Trigger id="tb-preprod" />
                  <Select.Content>
                    <Select.Option
                      v-for="option in toolbarOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </div>
              <div class="flex flex-col gap-[var(--spacing-xs)]">
                <Label for="tb-prod">Production Deployments</Label>
                <Select v-model="toolbar.prod" size="large" :disabled="savingToolbar" :display-value="toolbarLabel">
                  <Select.Trigger id="tb-prod" />
                  <Select.Content>
                    <Select.Option
                      v-for="option in toolbarOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </div>
            </div>
          </fieldset>
        </template>
        <template #footer>
          <div class="flex w-full items-center justify-between gap-[var(--spacing-sm)]">
            <Link href="#" label="Learn more about the Azion Toolbar" size="medium" />
            <Button
              label="Save"
              kind="secondary"
              size="medium"
              :loading="savingToolbar"
              @click="saveToolbar"
            />
          </div>
        </template>
      </CardBox>

      <!-- Card 2 — Deployment Protection (title = CardBox Heading; its own save). -->
      <CardBox title="Deployment Protection" class="w-full">
        <template #content>
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
            :disabled="savingProtection"
          >
            <legend class="sr-only">Deployment Protection</legend>

            <Message
              severity="info"
              title="Control who can access your Deployments."
              description="Standard Protection challenges every visitor before a Deployment loads; shareable links let you grant bypass access with a generated URL."
            />

            <div class="flex flex-col gap-[var(--spacing-xs)]">
              <Label for="dp-level">Azion Authentication</Label>
              <Select
                v-model="protection.level"
                size="large"
                :disabled="savingProtection"
                class="sm:max-w-[var(--container-sm)]"
                :display-value="protectionLabel"
              >
                <Select.Trigger id="dp-level" />
                <Select.Content>
                  <Select.Option
                    v-for="option in protectionOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </div>

            <div class="flex items-center justify-between gap-[var(--spacing-md)]">
              <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                <Label id="dp-links-label">Shareable Links</Label>
                <p class="text-body-sm text-[var(--text-muted)]">
                  Allow bypassing protection with a generated link.
                </p>
              </div>
              <Switch
                v-model:isToggled="protection.shareableLinks"
                aria-labelledby="dp-links-label"
                :disabled="savingProtection"
              />
            </div>
          </fieldset>
        </template>
        <template #footer>
          <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
            <Button
              label="Save"
              kind="secondary"
              size="medium"
              :loading="savingProtection"
              @click="saveProtection"
            />
          </div>
        </template>
      </CardBox>
    </main>
  </AppLayout>
</template>
