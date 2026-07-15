<script setup>
// The Account Settings module — account-level identity, address, auth, and
// integrations. Rendered inside the shared AppLayout (nav sidebar + header);
// the avatar in the GlobalHeader routes here (/account).
//
// Layout: a single centered column of sections. Each section is an OVERLINE
// title over a flush CardBox whose body is an Item.List — every field is an Item
// row (divided by the list's row borders) using the default Item anatomy: the
// field name in Item.Title, its guidance in Item.Description, and the control on
// the right in Item.Actions. The group of field rows is the section's body;
// there is no separate section-description paragraph. One `submitting` flag
// locks the whole scope on save.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Select from "@aziontech/webkit/select";
import Switch from "@aziontech/webkit/switch";
import Tag from "@aziontech/webkit/tag";
import Textarea from "@aziontech/webkit/textarea";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder).
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// --- Field option models -------------------------------------------------
const countries = [
  { label: "Brazil", value: "br" },
  { label: "United States", value: "us" },
  { label: "Portugal", value: "pt" },
];
const states = [
  { label: "Rio Grande do Sul", value: "rs" },
  { label: "São Paulo", value: "sp" },
  { label: "Rio de Janeiro", value: "rj" },
];
const cities = [
  { label: "Porto Alegre", value: "poa" },
  { label: "São Paulo", value: "sao" },
  { label: "Rio de Janeiro", value: "rio" },
];

// A display-value resolver for each Select (maps stored value → visible label).
const labelOf = (list) => (value) =>
  list.find((option) => option.value === value)?.label ?? "";

// --- Form state ----------------------------------------------------------
const form = reactive({
  accountName: "Gabriel Lisboa",
  clientId: "9757a",
  companyName: "",
  companyId: "",
  billingEmails: "gabriel.mendonca@azion.com",
  postalCode: "00000-000",
  country: "br",
  state: "rs",
  city: "poa",
  address: "n",
  apartment: "",
  allowSocialLogin: true,
  enforceMfa: false,
});

// One flag locks the whole scope while the request is in flight: Save shows
// :loading and the outer <fieldset> is :disabled off it.
const submitting = ref(false);

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success("Account settings saved.");
  } catch (error) {
    // Request-level failure → toast, with a way to recover. Never silent.
    toast.error("Could not save account settings.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false; // release on success AND failure
  }
};

// Source control providers. GitHub is connected; GitLab and Bitbucket can be
// linked. GitHub has no colored glyph, so it uses the monochrome PrimeIcon.
const sourceControls = [
  {
    key: "github",
    name: "Github",
    icon: "pi pi-github",
    connected: true,
    tag: "Active",
    description:
      "Connected as rafael.umman: to repositories in organizations: azion-tech, rafael-personal.",
    action: "Manage",
  },
  {
    key: "gitlab",
    name: "Gitlab",
    icon: "ai-cor ai-gitlab",
    connected: false,
    description: "Connect GitLab for Cloud Agents, and enhanced codebase control.",
    action: "Connect",
  },
  {
    key: "bitbucket",
    name: "Bitbucket",
    icon: "ai-cor ai-bitbucket",
    connected: false,
    description:
      "Connect Bitbucket for Cloud Agents, and enhanced codebase control.",
    action: "Connect",
  },
];

const onProviderAction = (provider) =>
  provider.connected
    ? toast.success(`Opening ${provider.name} integration settings…`)
    : toast.success(`Connecting to ${provider.name}…`);

const deleteAccount = () =>
  toast.error("This action is disabled in the demo.", {
    description: "Deleting an account is irreversible.",
  });
</script>

<template>
  <AppLayout
    active="account"
    :padded="false"
    :breadcrumb="[{ label: 'Account Settings' }]"
  >
    <form
      class="flex min-h-full flex-col"
      aria-labelledby="account-title"
      novalidate
      @submit.prevent="submit"
    >
      <!-- Scrollable form body -->
      <div
        class="flex w-full flex-1 flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]"
      >
        <!-- Page header -->
        <PageHeading
          title-id="account-title"
          title="Account Settings"
          description="Manage account-level settings that control identity, access, billing, and organization usage."
        />

        <!-- One flag locks every control while the request is in flight. -->
        <fieldset
          class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">Account settings</legend>

          <!-- Section: General -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-overline-sm text-[var(--text-muted)]">
              General
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Account Name</Item.Title>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText
                        v-model="form.accountName"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        aria-label="Account Name"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Client ID</Item.Title>
                      <Item.Description>
                        ID of the associated account. Can't be changed. Use this
                        value to open support tickets for issues related to the
                        account.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText
                        v-model="form.clientId"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        aria-label="Client ID"
                        readonly
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Company Information -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-overline-sm text-[var(--text-muted)]">
              Company Information
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Company Name</Item.Title>
                      <Item.Description>
                        Name of the company associated with the account.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText
                        v-model="form.companyName"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        aria-label="Company Name"
                        placeholder="Company S.A."
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Company ID</Item.Title>
                      <Item.Description>
                        Personal or company ID number to identify account
                        ownership.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText
                        v-model="form.companyId"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        aria-label="Company ID"
                        placeholder="00.000.000/0001-00"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Billing Emails</Item.Title>
                      <Item.Description>
                        Billing information will be forwarded to all emails listed
                        in this field. Separate each email address with a
                        semicolon ( ; ).
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Textarea
                        v-model="form.billingEmails"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        aria-label="Billing Emails"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Address Information -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-overline-sm text-[var(--text-muted)]">
              Address Information
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Postal Code</Item.Title>
                      <Item.Description>
                        Postal code of the account owner.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText
                        v-model="form.postalCode"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        aria-label="Postal Code"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Country</Item.Title>
                      <Item.Description>Account owner's country.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Select
                        v-model="form.country"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        placeholder="Select an option..."
                        :display-value="labelOf(countries)"
                      >
                        <Select.Trigger aria-label="Country" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in countries"
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
                      <Item.Title>State/Region</Item.Title>
                      <Item.Description>
                        Account owner's state or region.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Select
                        v-model="form.state"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        placeholder="Select an option..."
                        :display-value="labelOf(states)"
                      >
                        <Select.Trigger aria-label="State/Region" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in states"
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
                      <Item.Title>City</Item.Title>
                      <Item.Description>Account owner's city.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Select
                        v-model="form.city"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        placeholder="Select an option..."
                        :display-value="labelOf(cities)"
                      >
                        <Select.Trigger aria-label="City" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in cities"
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
                      <Item.Title>Address</Item.Title>
                      <Item.Description>
                        Account owner's street address.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText
                        v-model="form.address"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        aria-label="Address"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Apartment, floor, etc.</Item.Title>
                      <Item.Description>
                        Additional information for the address.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <InputText
                        v-model="form.apartment"
                        size="large"
                        :disabled="submitting"
                        class="w-full max-w-[var(--container-2xs)]"
                        aria-label="Apartment, floor, etc."
                        placeholder="1st floor"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Login Settings -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-overline-sm text-[var(--text-muted)]">
              Login Settings
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Allow Social Login</Item.Title>
                      <Item.Description>
                        When enabled, users linked to the account can log in using
                        their social network credentials.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Switch
                        v-model:isToggled="form.allowSocialLogin"
                        aria-label="Allow Social Login"
                        :disabled="submitting"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Enforce Multi-Factor Authentication</Item.Title>
                      <Item.Description>
                        When enabled, MFA will be enforced upon login for all users
                        linked to this account.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Switch
                        v-model:isToggled="form.enforceMfa"
                        aria-label="Enforce Multi-Factor Authentication"
                        :disabled="submitting"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Multi-Factor Authentication Management</Item.Title>
                      <Item.Description>
                        Manage the authenticator devices and recovery codes for
                        this account.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Button
                        type="button"
                        label="Manage"
                        kind="outlined"
                        size="medium"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Source Control -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-overline-sm text-[var(--text-muted)]">
              Source Control
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small" v-for="provider in sourceControls" :key="provider.key">
                    <Item.Media>
                      <!-- Git-provider icon frame (Figma node 5831-26595):
                           32px square, surface-raised fill, muted hairline
                           border, shape-elements radius, 20px glyph. -->
                      <span
                        class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[var(--shape-elements)] border-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                      >
                        <i
                          :class="[
                            provider.icon,
                            'text-[18px] leading-none text-[var(--text-default)]',
                          ]"
                          aria-hidden="true"
                        />
                      </span>
                    </Item.Media>
                    <Item.Content>
                      <Item.Title>
                        {{ provider.name }}
                        <Tag
                          v-if="provider.tag"
                          :value="provider.tag"
                          severity="success"
                          size="small"
                        />
                      </Item.Title>
                      <Item.Description>{{ provider.description }}</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Button
                        type="button"
                        :label="provider.action"
                        kind="outlined"
                        size="medium"
                        :icon="provider.connected ? undefined : 'pi pi-external-link'"
                        @click="onProviderAction(provider)"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Danger Zone -->
          <section class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-overline-sm text-[var(--danger-contrast)]">
              Danger Zone
            </p>
            <Item kind="outline">
              <Item.Content>
                <Item.Title>Remove Personal Account</Item.Title>
                <Item.Description>
                  This action permanently deletes this Personal Account and all
                  associated data from Azion's platform. It cannot be undone.
                </Item.Description>
              </Item.Content>
              <Item.Actions class="flex-1 justify-end">
                <Button
                  type="button"
                  label="Delete account"
                  kind="danger"
                  size="medium"
                  icon="pi pi-trash"
                  @click="deleteAccount"
                />
              </Item.Actions>
            </Item>
          </section>
        </fieldset>
      </div>

      <!-- Sticky action bar. Save is the native submit (Enter works); the
           scope stays locked while the request is in flight. -->
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
            @click="router.push({ path: '/dashboard', query: { email: userEmail } })"
          />
          <!-- webkit Button renders a native type="button" and does not forward
               a type prop, so drive submit from its click event. -->
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
