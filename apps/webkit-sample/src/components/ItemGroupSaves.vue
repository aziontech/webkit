<script setup>
// Form type: ITEMGROUP WITH INDEPENDENT SAVES (the `/form` skill, "Form types") —
// the OTHER approach to partitioned saves. Where "CardBox with independent saves"
// composes Select/Label fields in each card, this uses the Account Settings surface
// (Approach A: Item rows in a flush CardBox + Item.List dividers, titled by an
// OVERLINE), but instead of ONE page-level save each topic group owns its OWN Save
// in the card footer. Each group locks INDEPENDENTLY off its own `submitting` flag
// (the /usability loading pattern, scoped to the saved block): that group's fields
// and its right-side controls disable and its Save shows loading, while the other
// groups stay live. The save reports via toast. In an ItemGroup the Item.Title is the
// field label; every Item is size="small".
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Select from "@aziontech/webkit/select";
import Switch from "@aziontech/webkit/switch";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();
const userEmail = computed(() => route.query.email || "myemail@azion.com");

const languages = [
  { label: "English", value: "en" },
  { label: "Português", value: "pt" },
  { label: "Español", value: "es" },
];
const languageLabel = (value) =>
  languages.find((option) => option.value === value)?.label ?? "";

// --- Group 1: General ---------------------------------------------------
const general = reactive({ fullName: "Gabriel Lisboa", language: "en" });
const savingGeneral = ref(false);

// --- Group 2: Notifications ---------------------------------------------
const notifications = reactive({ productUpdates: true, securityAlerts: true });
const savingNotifications = ref(false);

// Each group commits independently through the same one-flag lock.
const saveGroup = async (flag, message) => {
  if (flag.value) return; // per-group re-entrancy lock
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

const saveGeneral = () => saveGroup(savingGeneral, "General settings saved.");
const saveNotifications = () =>
  saveGroup(savingNotifications, "Notification settings saved.");
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'ItemGroup with independent saves' }]"
  >
    <main class="flex w-full flex-col gap-[var(--spacing-lg)]">
      <PageHeading
        title="Preferences"
        description="The same partitioned-save idea as CardBox, on the ItemGroup surface — Item rows in a flush card, each topic group owning its own save, so changes commit in parts."
      />

      <!-- Group 1 — General (overline title, its own footer save). -->
      <section class="flex flex-col gap-[var(--spacing-sm)]">
        <p class="px-[var(--spacing-xs)] text-overline-sm text-[var(--text-muted)]">
          General
        </p>
        <CardBox :padded="false">
          <template #content>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="savingGeneral"
            >
              <legend class="sr-only">General</legend>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Full Name</Item.Title>
                    <Item.Description>The name shown across the console.</Item.Description>
                  </Item.Content>
                  <Item.Actions class="flex-1 justify-end">
                    <InputText
                      v-model="general.fullName"
                      size="large"
                      :disabled="savingGeneral"
                      class="w-full max-w-[var(--container-2xs)]"
                      aria-label="Full Name"
                    />
                  </Item.Actions>
                </Item>

                <Item size="small">
                  <Item.Content>
                    <Item.Title>Language</Item.Title>
                    <Item.Description>The console interface language.</Item.Description>
                  </Item.Content>
                  <Item.Actions class="flex-1 justify-end">
                    <Select
                      v-model="general.language"
                      size="large"
                      :disabled="savingGeneral"
                      class="w-full max-w-[var(--container-2xs)]"
                      :display-value="languageLabel"
                    >
                      <Select.Trigger id="preferences-language" aria-label="Language" />
                      <Select.Content>
                        <Select.Option
                          v-for="option in languages"
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
            </fieldset>
          </template>
          <template #footer>
            <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
              <Button
                label="Save"
                kind="secondary"
                size="medium"
                :loading="savingGeneral"
                @click="saveGeneral"
              />
            </div>
          </template>
        </CardBox>
      </section>

      <!-- Group 2 — Notifications (overline title, its own footer save). -->
      <section class="flex flex-col gap-[var(--spacing-sm)]">
        <p class="px-[var(--spacing-xs)] text-overline-sm text-[var(--text-muted)]">
          Notifications
        </p>
        <CardBox :padded="false">
          <template #content>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="savingNotifications"
            >
              <legend class="sr-only">Notifications</legend>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Product updates</Item.Title>
                    <Item.Description>Occasional emails about new features and changes.</Item.Description>
                  </Item.Content>
                  <Item.Actions class="flex-1 justify-end">
                    <Switch
                      v-model:isToggled="notifications.productUpdates"
                      aria-label="Product updates"
                      :disabled="savingNotifications"
                    />
                  </Item.Actions>
                </Item>

                <Item size="small">
                  <Item.Content>
                    <Item.Title>Security alerts</Item.Title>
                    <Item.Description>Emails when a sign-in or key change is detected.</Item.Description>
                  </Item.Content>
                  <Item.Actions class="flex-1 justify-end">
                    <Switch
                      v-model:isToggled="notifications.securityAlerts"
                      aria-label="Security alerts"
                      :disabled="savingNotifications"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </fieldset>
          </template>
          <template #footer>
            <div class="flex w-full items-center justify-end gap-[var(--spacing-sm)]">
              <Button
                label="Save"
                kind="secondary"
                size="medium"
                :loading="savingNotifications"
                @click="saveNotifications"
              />
            </div>
          </template>
        </CardBox>
      </section>
    </main>
  </AppLayout>
</template>
