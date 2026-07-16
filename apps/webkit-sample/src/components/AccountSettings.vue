<script setup>
// The Settings module — the account's identity, team, billing, security, and
// personal preferences. Rendered inside the shared AppLayout (nav sidebar +
// header); the header avatar and the sidebar account-menu "Settings" entry both
// route here (/account).
//
// Layout: a fluid full-bleed TabView bar (the second-level nav pattern, as in
// ApplicationDetail) sits at the top of the content zone and splits the module
// into the six account categories that used to live in the account menu —
// Account Settings, Users Management, Billing, Credentials, Activity History,
// Teams Permissions. The active tab's body scrolls below the bar; only the
// "Account Settings" form pins the Save bar at the bottom. Within that form,
// every section is a section title over a flush CardBox whose body is an
// Item.List — one Item row per field. One `submitting` flag locks the whole
// form scope on save.
import Avatar from "@aziontech/webkit/avatar";
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import CopyButton from "@aziontech/webkit/copy-button";
import Dropdown from "@aziontech/webkit/dropdown";
import IconButton from "@aziontech/webkit/icon-button";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Popover from "@aziontech/webkit/popover";
import Select from "@aziontech/webkit/select";
import Switch from "@aziontech/webkit/switch";
import TabView from "@aziontech/webkit/tab-view";
import Table from "@aziontech/webkit/table";
import Tag from "@aziontech/webkit/tag";
import Textarea from "@aziontech/webkit/textarea";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useFont } from "../font.js";
import { permissionLabel, permissionLabelsFor, useTeams } from "../teams.js";
import { useTheme } from "../theme.js";
import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const route = useRoute();
const router = useRouter();

// --- Tabs ----------------------------------------------------------------
// The six account categories. The active tab is seedable from a `?tab=` query
// (falls back to the first tab) so a deep link can land on any category.
const tabs = [
  { value: "account-settings", label: "Account Settings" },
  { value: "users-management", label: "Users Management" },
  { value: "billing", label: "Billing" },
  { value: "credentials", label: "Credentials" },
  { value: "activity-history", label: "Activity History" },
  { value: "teams-permissions", label: "Teams Permissions" },
];
const activeTab = ref(
  tabs.some((tab) => tab.value === route.query.tab)
    ? route.query.tab
    : "account-settings",
);

// Appearance preferences apply LIVE (they drive module-level singletons and are
// persisted to localStorage), so they sit outside the `submitting` save scope.
const { font, fonts } = useFont();
const { theme } = useTheme();
const appearances = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

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

// --- Account Settings form state -----------------------------------------
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

// --- Users Management ----------------------------------------------------
const users = ref([
  {
    id: "u-1",
    name: "Gabriel Lisboa",
    email: "gabriel@cerne.digital",
    role: "Owner",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "u-2",
    name: "Rafael Umman",
    email: "rafael.umman@azion.com",
    role: "Admin",
    status: "Active",
    lastActive: "2 hours ago",
  },
  {
    id: "u-3",
    name: "Marina Costa",
    email: "marina.costa@azion.com",
    role: "Developer",
    status: "Active",
    lastActive: "Yesterday",
  },
  {
    id: "u-4",
    name: "Lucas Pereira",
    email: "lucas.pereira@azion.com",
    role: "Developer",
    status: "Pending",
    lastActive: "—",
  },
  {
    id: "u-5",
    name: "Ana Rodrigues",
    email: "ana.rodrigues@azion.com",
    role: "Viewer",
    status: "Active",
    lastActive: "3 days ago",
  },
  {
    id: "u-6",
    name: "Carlos Mendes",
    email: "carlos.mendes@azion.com",
    role: "Viewer",
    status: "Inactive",
    lastActive: "2 months ago",
  },
]);

const userColumns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true },
  { accessorKey: "email", header: "Email", grow: 2 },
  { accessorKey: "role", header: "Role", enableSorting: true },
  { accessorKey: "status", header: "Status", enableSorting: true },
  { accessorKey: "lastActive", header: "Last Active" },
  { id: "actions", kind: "action", hideable: false },
];

const roleSeverity = (role) =>
  ({ Owner: "accent", Admin: "info", Developer: "secondary", Viewer: "secondary" })[
    role
  ] ?? "secondary";

const statusSeverity = (status) =>
  ({ Active: "success", Pending: "warning", Inactive: "secondary" })[status] ??
  "secondary";

const inviteUser = () =>
  toast.success("Invite sent (demo).", {
    description: "The teammate will receive an email to join this account.",
  });

const onUserAction = (event, value, row) => {
  if (value === "remove") {
    users.value = users.value.filter((user) => user.id !== row.id);
    toast.success(`${row.name} removed from the account.`);
    return;
  }
  toast.info(value === "edit" ? `Editing ${row.name}` : `${row.name}`, {
    description: row.email,
  });
};

// --- Billing -------------------------------------------------------------
const plan = {
  name: "Business",
  price: "$300",
  cadence: "/ month",
  renews: "August 1, 2026",
  features: [
    "Unlimited applications",
    "Priority support",
    "Advanced observability",
  ],
};

const paymentMethod = {
  brand: "Visa",
  last4: "4242",
  expires: "08 / 2028",
};

const invoices = ref([
  { id: "INV-2026-07", date: "July 01, 2026", amount: "$300.00", status: "Paid" },
  { id: "INV-2026-06", date: "June 01, 2026", amount: "$300.00", status: "Paid" },
  { id: "INV-2026-05", date: "May 01, 2026", amount: "$300.00", status: "Paid" },
  {
    id: "INV-2026-04",
    date: "April 01, 2026",
    amount: "$300.00",
    status: "Refunded",
  },
]);

const invoiceColumns = [
  { accessorKey: "id", header: "Invoice", principal: true },
  { accessorKey: "date", header: "Date", enableSorting: true },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "status", header: "Status", grow: 2 },
  { id: "actions", kind: "action", hideable: false },
];

const invoiceStatusSeverity = (status) =>
  ({ Paid: "success", Refunded: "secondary", Overdue: "danger" })[status] ??
  "secondary";

const upgradePlan = () => toast.info("Plan management is disabled in the demo.");
const updatePayment = () =>
  toast.info("Payment method management is disabled in the demo.");
const downloadInvoice = (event, invoice) =>
  toast.success(`Downloading ${invoice.id}…`);

// --- Credentials ---------------------------------------------------------
const credentials = ref([
  {
    id: "c-1",
    name: "Production API",
    token: "azion_prod_9f3a1c7e",
    created: "January 12, 2026",
    lastUsed: "2 hours ago",
    status: "Active",
  },
  {
    id: "c-2",
    name: "CI / CD Pipeline",
    token: "azion_ci_4b8d2f0a",
    created: "March 03, 2026",
    lastUsed: "Yesterday",
    status: "Active",
  },
  {
    id: "c-3",
    name: "Staging Sandbox",
    token: "azion_stg_1e6c9a4d",
    created: "May 21, 2026",
    lastUsed: "1 week ago",
    status: "Active",
  },
  {
    id: "c-4",
    name: "Legacy Integration",
    token: "azion_leg_7d2f5b8c",
    created: "November 08, 2025",
    lastUsed: "3 months ago",
    status: "Revoked",
  },
]);

const credentialColumns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true },
  { accessorKey: "token", header: "Token", grow: 2 },
  { accessorKey: "created", header: "Created", enableSorting: true },
  { accessorKey: "lastUsed", header: "Last Used" },
  { accessorKey: "status", header: "Status" },
  { id: "actions", kind: "action", hideable: false },
];

const credentialStatusSeverity = (status) =>
  status === "Active" ? "success" : "danger";

const createCredential = () =>
  toast.success("Credential created (demo).", {
    description: "Copy the token now — it won't be shown again.",
  });

const onCredentialAction = (event, value, row) => {
  if (value === "revoke") {
    credentials.value = credentials.value.map((credential) =>
      credential.id === row.id ? { ...credential, status: "Revoked" } : credential,
    );
    toast.success(`${row.name} revoked.`);
    return;
  }
  toast.info(`${row.name}`, { description: row.token });
};

// --- Activity History ----------------------------------------------------
const activity = ref([
  {
    id: "a-1",
    action: "Signed in",
    category: "Auth",
    user: "gabriel@cerne.digital",
    ip: "189.6.44.12",
    date: "July 16, 2026, 09:12 AM",
  },
  {
    id: "a-2",
    action: "Updated billing email",
    category: "Billing",
    user: "gabriel@cerne.digital",
    ip: "189.6.44.12",
    date: "July 15, 2026, 04:48 PM",
  },
  {
    id: "a-3",
    action: "Created credential “CI / CD Pipeline”",
    category: "Security",
    user: "rafael.umman@azion.com",
    ip: "201.17.88.3",
    date: "July 14, 2026, 11:03 AM",
  },
  {
    id: "a-4",
    action: "Invited marina.costa@azion.com",
    category: "Users",
    user: "gabriel@cerne.digital",
    ip: "189.6.44.12",
    date: "July 10, 2026, 02:20 PM",
  },
  {
    id: "a-5",
    action: "Deployed vue-3-teste",
    category: "Deploy",
    user: "lucas.pereira@azion.com",
    ip: "177.92.10.55",
    date: "July 08, 2026, 06:41 PM",
  },
]);

const activityColumns = [
  { accessorKey: "action", header: "Event", principal: true, grow: 2 },
  { accessorKey: "category", header: "Category", enableSorting: true },
  { accessorKey: "user", header: "User" },
  { accessorKey: "ip", header: "IP Address" },
  { accessorKey: "date", header: "Date", enableSorting: true },
];

const categorySeverity = (category) =>
  ({
    Auth: "info",
    Billing: "accent",
    Security: "warning",
    Users: "secondary",
    Deploy: "success",
  })[category] ?? "secondary";

// --- Teams Permissions ---------------------------------------------------
// Backed by the shared teams.js store so this tab stays in sync with the focused
// Create/Edit Team flow (/teams/new · /teams/:id), which returns here. The
// Permissions cell shows the first permission plus a "+N" pill that opens a
// Popover (with a "Show all permissions" Tooltip) listing the rest.
const { teams, createTeam: addTeam, removeTeam } = useTeams();

const teamColumns = [
  { accessorKey: "name", header: "Name", enableSorting: true, principal: true, grow: 2 },
  { accessorKey: "permissions", header: "Permissions", grow: 3 },
  { accessorKey: "status", header: "Status" },
  { id: "actions", kind: "action", hideable: false },
];

const teamStatusSeverity = (status) =>
  ({ Active: "success", Inactive: "secondary" })[status] ?? "secondary";

const firstPermission = (row) =>
  row.permissions.length ? permissionLabel(row.permissions[0]) : "No permissions";
const overflowCount = (row) => Math.max(row.permissions.length - 1, 0);
const permissionList = (row) => permissionLabelsFor(row.permissions);

const teamsQuery = () => ({ email: userEmail.value });
const createTeam = () => router.push({ path: "/teams/new", query: teamsQuery() });

const onTeamAction = (event, value, row) => {
  if (value === "edit") {
    router.push({ path: `/teams/${row.id}`, query: teamsQuery() });
    return;
  }
  if (value === "duplicate") {
    const copy = addTeam({
      name: `${row.name} (copy)`,
      description: row.description,
      status: row.status,
      permissions: row.permissions,
    });
    toast.success(`Team "${copy.name}" created.`);
    return;
  }
  if (value === "delete") {
    removeTeam(row.id);
    toast.success(`Team "${row.name}" deleted.`);
  }
};
</script>

<template>
  <AppLayout
    active="account"
    :padded="false"
    :breadcrumb="[{ label: 'Settings' }]"
  >
    <main class="flex h-full flex-col">
      <!-- Second-level nav pattern (no PageHeading): the category tabs form a
           fluid full-bleed bar at the top of the content zone; the module is
           already named by the "Settings" breadcrumb above. -->
      <div class="border-b border-[var(--border-default)] px-[var(--spacing-md)]">
        <div class="flex items-end gap-[var(--spacing-md)] py-[var(--spacing-sm)]">
          <TabView
            v-model:value="activeTab"
            class="min-w-0 flex-1"
          >
            <TabView.List>
              <TabView.Item
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
            </TabView.List>
          </TabView>
        </div>
      </div>

      <!-- Active tab body: only this region scrolls, between the bar and the
           (Account Settings) Save bar pinned below. -->
      <div
        class="flex min-h-0 w-full flex-1 flex-col gap-[var(--spacing-lg)] overflow-auto p-[var(--spacing-md)]"
      >
        <!-- Tab: Account Settings — the account identity form. One flag locks
             every control while the request is in flight. -->
        <form
          v-if="activeTab === 'account-settings'"
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
          aria-label="Account settings"
          novalidate
          @submit.prevent="submit"
        >
          <PageHeading
            title="Account Settings"
            description="Manage your account's identity, company details, address, and login preferences."
          />

          <fieldset
            class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Account settings</legend>

            <!-- Section: General -->
            <section class="flex flex-col gap-[var(--spacing-sm)]">
              <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
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
              <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
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
              <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
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
              <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
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
              <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
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

            <!-- Section: Appearance — live preferences (font + theme), outside the
                 save scope. They drive the app singletons and persist on change. -->
            <section class="flex flex-col gap-[var(--spacing-sm)]">
              <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                Appearance
              </p>
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Font family</Item.Title>
                        <Item.Description>
                          The primary sans typeface used across the console. Applies
                          immediately; non-default faces load from Google Fonts.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <Select
                          v-model="font"
                          size="large"
                          class="w-full max-w-[var(--container-2xs)]"
                          :display-value="labelOf(fonts)"
                        >
                          <Select.Trigger aria-label="Font family" />
                          <Select.Content>
                            <Select.Option
                              v-for="option in fonts"
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
                        <Item.Title>System appearance</Item.Title>
                        <Item.Description>
                          Follow the operating system, or force a light or dark theme.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end">
                        <Select
                          v-model="theme"
                          size="large"
                          class="w-full max-w-[var(--container-2xs)]"
                          :display-value="labelOf(appearances)"
                        >
                          <Select.Trigger aria-label="System appearance" />
                          <Select.Content>
                            <Select.Option
                              v-for="option in appearances"
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

            <!-- Section: Danger Zone -->
            <section class="flex flex-col gap-[var(--spacing-sm)]">
              <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--danger-contrast)]">
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
        </form>

        <!-- Tab: Users Management — the teammates with access to this account. -->
        <section
          v-else-if="activeTab === 'users-management'"
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
        >
          <PageHeading
            title="Users Management"
            description="Manage the teammates who have access to this account and their roles."
          />

          <CardBox :padded="false">
            <template #content>
          <Table
            :data="users"
            :columns="userColumns"
            row-key="id"
            enable-sorting
            :border="false"
          >
            <template #toolbar>
              <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                <Table.Search size="large" placeholder="Search users..." class="flex-1" />
                <Button
                  label="Invite User"
                  kind="primary"
                  size="medium"
                  icon="pi pi-user-plus"
                  @click="inviteUser"
                />
              </div>
            </template>

            <template #cell-name="{ row }">
              <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                <Avatar :label="row.name" size="small" />
                <span class="truncate">{{ row.name }}</span>
              </div>
            </template>

            <template #cell-role="{ value }">
              <Tag :value="value" :severity="roleSeverity(value)" size="medium" />
            </template>

            <template #cell-status="{ value }">
              <Tag :value="value" :severity="statusSeverity(value)" size="medium" />
            </template>

            <template #cell-actions="{ row }">
              <Dropdown
                placement="bottom-end"
                @select="(event, value) => onUserAction(event, value, row)"
              >
                <Dropdown.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="outlined"
                    size="small"
                    aria-label="User actions"
                  />
                </Dropdown.Trigger>
                <Dropdown.Group>
                  <Dropdown.Option value="view" label="View profile" />
                  <Dropdown.Option value="edit" label="Edit role" />
                </Dropdown.Group>
                <Dropdown.Group>
                  <Dropdown.Option value="remove" label="Remove">
                    <template #left>
                      <i class="pi pi-trash" aria-hidden="true" />
                    </template>
                  </Dropdown.Option>
                </Dropdown.Group>
              </Dropdown>
            </template>
          </Table>
            </template>
          </CardBox>
        </section>

        <!-- Tab: Billing — current plan, payment method, and invoices. -->
        <section
          v-else-if="activeTab === 'billing'"
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
        >
          <PageHeading
            title="Billing"
            description="Review your current plan, payment method, and invoice history."
          />

          <!-- Current plan -->
          <div class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Current Plan
            </p>
            <CardBox>
              <template #content>
                <div class="flex flex-wrap items-start justify-between gap-[var(--spacing-md)]">
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
                    <div class="flex items-center gap-[var(--spacing-xs)]">
                      <span class="text-title-h3 text-[var(--text-default)]">
                        {{ plan.name }}
                      </span>
                      <Tag value="Current" severity="success" size="medium" />
                    </div>
                    <p class="text-body-sm text-[var(--text-muted)]">
                      <span class="text-title-h4 text-[var(--text-default)]">{{ plan.price }}</span>
                      {{ plan.cadence }} · renews {{ plan.renews }}
                    </p>
                    <ul class="mt-[var(--spacing-xs)] flex flex-col gap-[var(--spacing-xxs)]">
                      <li
                        v-for="feature in plan.features"
                        :key="feature"
                        class="flex items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)]"
                      >
                        <i class="pi pi-check text-[var(--success)]" aria-hidden="true" />
                        {{ feature }}
                      </li>
                    </ul>
                  </div>
                  <Button
                    label="Upgrade Plan"
                    kind="primary"
                    size="medium"
                    icon="pi pi-arrow-up-right"
                    @click="upgradePlan"
                  />
                </div>
              </template>
            </CardBox>
          </div>

          <!-- Payment method -->
          <div class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Payment Method
            </p>
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Media>
                      <span
                        class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[var(--shape-elements)] border-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                      >
                        <i class="pi pi-credit-card text-[18px] leading-none text-[var(--text-default)]" aria-hidden="true" />
                      </span>
                    </Item.Media>
                    <Item.Content>
                      <Item.Title>{{ paymentMethod.brand }} ending in {{ paymentMethod.last4 }}</Item.Title>
                      <Item.Description>Expires {{ paymentMethod.expires }}</Item.Description>
                    </Item.Content>
                    <Item.Actions class="flex-1 justify-end">
                      <Button
                        type="button"
                        label="Update"
                        kind="outlined"
                        size="medium"
                        @click="updatePayment"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </div>

          <!-- Invoices -->
          <div class="flex flex-col gap-[var(--spacing-sm)]">
            <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
              Invoices
            </p>
            <CardBox :padded="false">
              <template #content>
            <Table
              :data="invoices"
              :columns="invoiceColumns"
              row-key="id"
              enable-sorting
              :border="false"
            >
              <template #cell-status="{ value }">
                <Tag :value="value" :severity="invoiceStatusSeverity(value)" size="medium" />
              </template>
              <template #cell-actions="{ row }">
                <IconButton
                  icon="pi pi-download"
                  kind="outlined"
                  size="small"
                  aria-label="Download invoice"
                  @click="(event) => downloadInvoice(event, row)"
                />
              </template>
            </Table>
              </template>
            </CardBox>
          </div>
        </section>

        <!-- Tab: Credentials — the account's API tokens. -->
        <section
          v-else-if="activeTab === 'credentials'"
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
        >
          <PageHeading
            title="Credentials"
            description="Manage the API tokens used to authenticate against this account."
          />

          <CardBox :padded="false">
            <template #content>
          <Table
            :data="credentials"
            :columns="credentialColumns"
            row-key="id"
            enable-sorting
            :border="false"
          >
            <template #toolbar>
              <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                <Table.Search size="large" placeholder="Search credentials..." class="flex-1" />
                <Button
                  label="Create Credential"
                  kind="primary"
                  size="medium"
                  icon="pi pi-plus"
                  @click="createCredential"
                />
              </div>
            </template>

            <template #cell-token="{ value }">
              <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                <span class="truncate font-code text-body-xs text-[var(--text-muted)]">{{ value }}</span>
                <CopyButton kind="outlined" :value="value" aria-label="Copy token" />
              </div>
            </template>

            <template #cell-status="{ value }">
              <Tag :value="value" :severity="credentialStatusSeverity(value)" size="medium" />
            </template>

            <template #cell-actions="{ row }">
              <Dropdown
                placement="bottom-end"
                @select="(event, value) => onCredentialAction(event, value, row)"
              >
                <Dropdown.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="outlined"
                    size="small"
                    aria-label="Credential actions"
                  />
                </Dropdown.Trigger>
                <Dropdown.Group>
                  <Dropdown.Option value="view" label="View details" />
                </Dropdown.Group>
                <Dropdown.Group>
                  <Dropdown.Option value="revoke" label="Revoke">
                    <template #left>
                      <i class="pi pi-ban" aria-hidden="true" />
                    </template>
                  </Dropdown.Option>
                </Dropdown.Group>
              </Dropdown>
            </template>
          </Table>
            </template>
          </CardBox>
        </section>

        <!-- Tab: Activity History — the recent account audit log. -->
        <section
          v-else-if="activeTab === 'activity-history'"
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
        >
          <PageHeading
            title="Activity History"
            description="Review recent account activity and audit events."
          />

          <CardBox :padded="false">
            <template #content>
          <Table
            :data="activity"
            :columns="activityColumns"
            row-key="id"
            enable-sorting
            :border="false"
          >
            <template #toolbar>
              <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                <Table.Search size="large" placeholder="Search activity..." class="flex-1" />
                <Table.RefreshButton />
              </div>
            </template>

            <template #cell-category="{ value }">
              <Tag :value="value" :severity="categorySeverity(value)" size="medium" />
            </template>
          </Table>
            </template>
          </CardBox>
        </section>

        <!-- Tab: Teams Permissions — the account's teams and their access. -->
        <section
          v-else-if="activeTab === 'teams-permissions'"
          class="flex min-w-0 flex-col gap-[var(--spacing-lg)]"
        >
          <PageHeading
            title="Teams Permissions"
            description="Manage your account's teams and the access level each one grants."
          />

          <CardBox :padded="false">
            <template #content>
          <Table
            :data="teams"
            :columns="teamColumns"
            row-key="id"
            enable-sorting
            :border="false"
          >
            <template #toolbar>
              <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                <Table.Search size="large" placeholder="Search teams..." class="flex-1" />
                <Button
                  label="Create Team"
                  kind="primary"
                  size="medium"
                  icon="pi pi-plus"
                  @click="createTeam"
                />
              </div>
            </template>

            <template #cell-name="{ row }">
              <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                <Avatar :label="row.name" size="small" kind="square" />
                <span class="truncate">{{ row.name }}</span>
              </div>
            </template>

            <template #cell-permissions="{ row }">
              <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                <span class="truncate text-body-sm text-[var(--text-default)]">
                  {{ firstPermission(row) }}
                </span>

                <Popover
                  v-if="overflowCount(row)"
                  placement="bottom-start"
                  width="medium"
                >
                  <Popover.Trigger>
                    <Tooltip text="Show all permissions">
                      <button
                        type="button"
                        :aria-label="`Show all ${row.permissions.length} permissions`"
                        class="inline-flex shrink-0 items-center rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-label-xs text-[var(--text-default)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
                      >
                        +{{ overflowCount(row) }}
                      </button>
                    </Tooltip>
                  </Popover.Trigger>

                  <Popover.Content>
                    <div
                      class="flex max-h-[var(--container-xs)] flex-col overflow-auto p-[var(--spacing-xxs)]"
                    >
                      <p
                        class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-overline-sm text-[var(--text-muted)]"
                      >
                        {{ row.permissions.length }} permissions
                      </p>
                      <span
                        v-for="label in permissionList(row)"
                        :key="label"
                        class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-body-sm text-[var(--text-default)]"
                      >
                        {{ label }}
                      </span>
                    </div>
                  </Popover.Content>
                </Popover>
              </div>
            </template>

            <template #cell-status="{ value }">
              <Tag :value="value" :severity="teamStatusSeverity(value)" size="medium" />
            </template>

            <template #cell-actions="{ row }">
              <Dropdown
                placement="bottom-end"
                @select="(event, value) => onTeamAction(event, value, row)"
              >
                <Dropdown.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="outlined"
                    size="small"
                    aria-label="Team actions"
                  />
                </Dropdown.Trigger>
                <Dropdown.Group>
                  <Dropdown.Option value="edit" label="Edit">
                    <template #left>
                      <i class="pi pi-pencil" aria-hidden="true" />
                    </template>
                  </Dropdown.Option>
                  <Dropdown.Option value="duplicate" label="Duplicate">
                    <template #left>
                      <i class="pi pi-clone" aria-hidden="true" />
                    </template>
                  </Dropdown.Option>
                </Dropdown.Group>
                <Dropdown.Group>
                  <Dropdown.Option value="delete" label="Delete">
                    <template #left>
                      <i class="pi pi-trash" aria-hidden="true" />
                    </template>
                  </Dropdown.Option>
                </Dropdown.Group>
              </Dropdown>
            </template>
          </Table>
            </template>
          </CardBox>
        </section>
      </div>

      <!-- Save bar — pinned below the scrolling body; only the Account Settings
           form has a save scope. The scope stays locked while the request is in
           flight. -->
      <footer
        v-if="activeTab === 'account-settings'"
        class="shrink-0 border-t-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]"
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
            @click="router.push({ path: '/home', query: { email: userEmail } })"
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
    </main>
  </AppLayout>
</template>
