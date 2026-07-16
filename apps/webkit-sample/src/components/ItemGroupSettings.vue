<script setup>
// Form type: ITEMGROUP settings (the `/form` skill, "Form types"). Account-level
// configuration built from Item rows (Approach A), grouped into topic SECTIONS —
// each section is an section title over a flush CardBox whose body is an Item.List
// (the Account Settings pattern; see `/form` § Section title). The whole surface is
// still ONE logical form saved as a single unit (one Save in the sticky footer) —
// that's distinct from "CardBox with independent saves", where each card owns its
// own Save. Every Item is size="small"; in an ItemGroup the Item.Title is the label.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import HelperText from "@aziontech/webkit/helper-text";
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

const timezones = [
  { label: "(UTC-03:00) São Paulo", value: "america-sao_paulo" },
  { label: "(UTC+00:00) London", value: "europe-london" },
  { label: "(UTC-05:00) New York", value: "america-new_york" },
];
const languages = [
  { label: "English", value: "en" },
  { label: "Português", value: "pt" },
  { label: "Español", value: "es" },
];
const labelOf = (list) => (value) =>
  list.find((option) => option.value === value)?.label ?? "";

const form = reactive({
  fullName: "Gabriel Lisboa",
  email: userEmail.value,
  timezone: "america-sao_paulo",
  language: "en",
  productUpdates: true,
});

const submitted = ref(false);
const submitting = ref(false);

const nameEmpty = computed(() => !form.fullName.trim());
const emailEmpty = computed(() => !form.email.trim());
// emailInvalid is true for an empty value too (the regex fails on ""); the template
// splits the two — empty → amber `required`, filled-but-malformed → red `invalid`.
const emailInvalid = computed(
  () => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()),
);
const isValid = computed(() => !nameEmpty.value && !emailInvalid.value);

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock
  submitted.value = true;
  if (!isValid.value) return;

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success("Profile settings saved.");
  } catch (error) {
    toast.error("Could not save profile settings.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <AppLayout
    active="forms"
    :padded="false"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'ItemGroup settings' }]"
  >
    <form
      class="flex min-h-full flex-col"
      aria-labelledby="profile-title"
      novalidate
      @submit.prevent="submit"
    >
      <div
        class="flex w-full flex-1 flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]"
      >
        <PageHeading
          title-id="profile-title"
          title="Profile"
          description="Define and manage personal account preferences and profile config. Topic sections of Item rows, each titled by a section heading, saved as a single unit."
        />

        <!-- One flag locks every control while the request is in flight. -->
        <fieldset
          class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">Profile settings</legend>

          <!-- Section: General — an section title over a flush CardBox. -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              General
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Full Name</Item.Title>
                      <Item.Description>The name shown across the console.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <!-- No Label in an ItemGroup: the required feedback is an
                           amber `required` HelperText under the control (not red —
                           an empty required field is a prompt, not an error). -->
                      <div class="flex w-full max-w-[var(--container-2xs)] flex-col gap-[var(--spacing-xs)]">
                        <InputText
                          v-model="form.fullName"
                          size="large"
                          :disabled="submitting"
                          class="w-full"
                          aria-label="Full Name"
                          :required="submitted && nameEmpty"
                          :aria-describedby="submitted && nameEmpty ? 'full-name-error' : undefined"
                        />
                        <HelperText
                          v-if="submitted && nameEmpty"
                          id="full-name-error"
                          kind="required"
                          value="This field is required."
                        />
                      </div>
                    </Item.Actions>
                  </Item>

                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Email</Item.Title>
                      <Item.Description>Used for sign-in and notifications.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <!-- Empty → amber `required`; filled but malformed → red
                           `invalid`. The two are distinct states, never both. -->
                      <div class="flex w-full max-w-[var(--container-2xs)] flex-col gap-[var(--spacing-xs)]">
                        <InputText
                          v-model="form.email"
                          type="email"
                          size="large"
                          :disabled="submitting"
                          class="w-full"
                          aria-label="Email"
                          :required="submitted && emailEmpty"
                          :invalid="submitted && !emailEmpty && emailInvalid"
                          :aria-describedby="submitted && emailInvalid ? 'email-error' : undefined"
                        />
                        <HelperText
                          v-if="submitted && emailInvalid"
                          id="email-error"
                          :kind="emailEmpty ? 'required' : 'invalid'"
                          :value="emailEmpty ? 'This field is required.' : 'Enter a valid email address.'"
                        />
                      </div>
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Preferences -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Preferences
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Timezone</Item.Title>
                      <Item.Description>Times across the console are shown in this zone.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Select
                        v-model="form.timezone"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        :display-value="labelOf(timezones)"
                      >
                        <Select.Trigger id="profile-timezone" aria-label="Timezone" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in timezones"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </Item.Actions>
                  </Item>

                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Language</Item.Title>
                      <Item.Description>The console interface language.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Select
                        v-model="form.language"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        :display-value="labelOf(languages)"
                      >
                        <Select.Trigger id="profile-language" aria-label="Language" />
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
              </template>
            </CardBox>
          </section>

          <!-- Section: Notifications -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Notifications
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Product updates</Item.Title>
                      <Item.Description>Occasional emails about new features and changes.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Switch
                        v-model:isToggled="form.productUpdates"
                        aria-label="Product updates"
                        :disabled="submitting"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>
        </fieldset>
      </div>

      <!-- Single scoped save (one unit). -->
      <footer
        class="sticky bottom-0 border-t-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]"
      >
        <div
          class="flex w-full items-center justify-end gap-[var(--spacing-sm)] p-[var(--spacing-lg)]"
        >
          <Button
            type="button"
            label="Cancel"
            kind="outlined"
            size="medium"
            :disabled="submitting"
            @click="router.push({ path: '/forms', query: { email: userEmail } })"
          />
          <Button
            label="Save"
            kind="primary"
            size="medium"
            :loading="submitting"
            @click="submit"
          />
        </div>
      </footer>
    </form>
  </AppLayout>
</template>
