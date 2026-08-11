// Organizations store — the tenancy ABOVE the account tree.
//
// An organization owns the whole Brand → Reseller → Group → Client hierarchy
// that accounts.js models: switching organization changes WHICH tree the
// account switcher is browsing, the way switching account changes which tenant
// every page reads. Module-level singleton (like accounts.js / sidebar.js /
// theme.js) so the header switcher and anything downstream share one truth.
//
// Each org carries an `accent` — the colour family its generated mark is
// painted in. It is the only place the console lets a tenant colour itself, and
// it exists for one reason: an operator who lives in three organizations must
// tell them apart in the header before reading a single character. The accent is
// chosen when the org is created — at signup (components/Onboarding.vue) or in
// the console's Create Organization flow — and the seeds below carry the choice
// for the organizations the demo opens with.
import { computed, ref } from "vue";

import { azionPlans } from "./plans.js";

// The accents an organization may wear.
//
// `colors` is a three-stop palette in theme tokens, handed to the marble
// avatar: the generator picks which stop paints the field and which paints each
// blob, from the org's name. The three stops are deliberately far apart in
// LIGHTNESS (a pale step, a saturated mid, a deep one) — the blobs are heavily
// blurred, so two neighbouring steps of one ramp dissolve into a plain gradient
// and the marbling disappears. Two stops stay in the accent's own hue; the
// third is its warm/cool neighbour, which is what gives the mark a second
// colour to marble against. Tokens, not hex, so the art follows the theme.
// One entry per primitive hue family the theme ships (plus gray, for an
// organization that wants no colour at all). Seven is deliberate: enough that a
// person operating three organizations can give each an unmistakable mark, few
// enough to stay one glanceable row instead of a colour grid nobody reads.
export const orgAccents = [
  {
    value: "orange",
    label: "Orange",
    colors: ["var(--color-orange-200)", "var(--color-orange-700)", "var(--color-yellow-400)"],
  },
  {
    value: "yellow",
    label: "Yellow",
    colors: ["var(--color-yellow-200)", "var(--color-orange-600)", "var(--color-yellow-600)"],
  },
  {
    value: "red",
    label: "Red",
    colors: ["var(--color-red-200)", "var(--color-red-700)", "var(--color-orange-500)"],
  },
  {
    value: "green",
    label: "Green",
    colors: ["var(--color-green-200)", "var(--color-green-700)", "var(--color-blue-500)"],
  },
  {
    value: "blue",
    label: "Blue",
    colors: ["var(--color-blue-200)", "var(--color-blue-700)", "var(--color-violet-500)"],
  },
  {
    value: "violet",
    label: "Violet",
    colors: ["var(--color-violet-200)", "var(--color-violet-700)", "var(--color-blue-500)"],
  },
  {
    value: "gray",
    label: "Gray",
    colors: ["var(--color-gray-200)", "var(--color-gray-700)", "var(--color-slate-500)"],
  },
];

// Look up an accent by value; an unknown value falls back to the first one
// rather than rendering an unpainted mark.
export const accentOf = (value) =>
  orgAccents.find((accent) => accent.value === value) ?? orgAccents[0];

// The organization's lifecycle statuses.
//
// Two things vary per status and both are recorded here, because the UI reads
// them in two different places: `severity` paints the status tag, and `access`
// is the sentence that says what the user can still reach — a suspended
// organization keeps its services running but locks the console down to support
// and payments, and a blocked one takes the services off the air too. Only
// `active` is reachable from onboarding; the rest arrive from billing or from
// an administrative action, so they are modelled and not offered.
export const orgStatuses = [
  {
    value: "active",
    label: "Active",
    severity: "success",
    services: true,
    access: "Full access, according to each user's roles.",
  },
  {
    value: "default_suspense",
    label: "Payment pending",
    severity: "warning",
    services: true,
    access: "Services keep running; users reach only support and payments.",
  },
  {
    value: "default_block",
    label: "Payment blocked",
    severity: "danger",
    services: false,
    access: "Services are off the air; users reach only support and payments.",
  },
  {
    value: "abuse_block",
    label: "Abuse block",
    severity: "danger",
    services: false,
    access: "Suspended for policy violations; users reach only support.",
  },
  {
    value: "temporary_suspense",
    label: "Temporarily suspended",
    severity: "warning",
    services: true,
    access: "Administrative or security hold; users reach only support.",
  },
  {
    value: "canceled",
    label: "Canceled",
    severity: "secondary",
    services: false,
    access: "The account is closed; users have no access.",
  },
];

// Look up a status descriptor; an unknown value reads as active rather than
// rendering an unlabelled tag.
export const statusOf = (value) =>
  orgStatuses.find((status) => status.value === value) ?? orgStatuses[0];

// The generic `additional_data` model.
//
// An organization accumulates facts over time that are nobody's schema change:
// company size today, industry tomorrow, whatever the next campaign needs. So
// the model is key–value, with the ACCEPTED VALUES declared per key — a free
// text bag would make two organizations answer "51-200" and "about 100" to the
// same question and neither would ever be countable.
//
// Onboarding renders one field per entry below and stores the answers under
// `additionalData` on the organization. Adding a key here adds it to the form;
// nothing else changes.
export const additionalDataKeys = [
  {
    key: "company_size",
    label: "Company size",
    values: [
      { value: "1-10", label: "1–10 people" },
      { value: "11-50", label: "11–50 people" },
      { value: "51-200", label: "51–200 people" },
      { value: "201-1000", label: "201–1,000 people" },
      { value: "1000+", label: "More than 1,000 people" },
    ],
  },
  {
    key: "industry",
    label: "Industry",
    values: [
      { value: "ecommerce", label: "Ecommerce & Retail" },
      { value: "financial_services", label: "Financial Services" },
      { value: "media", label: "Media & Streaming" },
      { value: "saas", label: "SaaS & Technology" },
      { value: "gaming", label: "Gaming" },
      { value: "public_sector", label: "Public Sector" },
      { value: "other", label: "Other" },
    ],
  },
];

// Every organization is created with one workspace, and this is its name. A
// workspace groups the resources of one context (a team, an environment, a kind
// of application); a brand-new organization has exactly one context, so it gets
// one workspace instead of an empty state the user has to resolve before they
// can deploy anything.
export const DEFAULT_WORKSPACE_NAME = "My Workspace";

// Seeded organizations. `accounts` is how many tenants live under the org (the
// count the switcher shows under the name) and `plan` is its contract tier —
// both are the two facts that tell two same-named orgs apart in a list.
// `status` is the lifecycle state from `orgStatuses`; the seeds are all active,
// since a seeded suspension against a name states something that isn't ours to
// state.
const seedOrganizations = [
  // Azion wears orange — the brand's own colour, so the org an operator lives
  // in is the one mark that matches the product they are inside.
  { id: "azion", name: "Azion", accent: "orange", plan: "Enterprise", accounts: 12, status: "active" },
  { id: "nebula", name: "Nebula Labs", accent: "blue", plan: "Business", accounts: 4, status: "active" },
  { id: "northwind", name: "Northwind Retail", accent: "yellow", plan: "Business", accounts: 7, status: "active" },
];

// The organization the app opens in. Exported because it is also the top of the
// scope that owns every seeded resource row (see lib/tenancy-scope.js): the app
// boots into the full lists, and switching away projects them.
export const FIRST_ORGANIZATION_ID = "azion";

const organizations = ref(seedOrganizations);
const currentOrganizationId = ref(FIRST_ORGANIZATION_ID);

const currentOrganization = computed(
  () =>
    organizations.value.find((org) => org.id === currentOrganizationId.value) ??
    organizations.value[0],
);

// Switch the active organization. Idempotent — re-picking the current org is a
// no-op the caller can acknowledge instead of silently dismissing.
const switchOrganization = (organization) => {
  const changed = organization.id !== currentOrganizationId.value;
  currentOrganizationId.value = organization.id;
  return changed;
};

// A url-safe id from the organization's name, deduped against the roster: two
// people may name their organization the same thing, and the id is what every
// switch resolves against.
const idFor = (name) => {
  const base =
    String(name ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "organization";
  if (!organizations.value.some((org) => org.id === base)) return base;
  let suffix = 2;
  while (organizations.value.some((org) => org.id === `${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
};

// Create an organization, and enter it.
//
// The single path both doors go through — signup's onboarding
// (components/Onboarding.vue), which creates a user's FIRST organization from the
// name they gave, and the console's Create Organization flow
// (components/CreateOrganization.vue), which creates any further one. Organizations
// a user did not create arrive by invitation, which is what makes switch-account
// possible; those are not created here.
//
// One function rather than one per door, because three things are true of every
// organization the moment it exists no matter where it came from, and they are set
// here rather than trusted to the caller: the creator is its OWNER and its first
// Organization User, its status is `active`, and it holds one workspace.
//
// Creating also ENTERS the new organization: nobody creates one to stay where they
// were, and the caller would otherwise have to remember to switch.
export const createOrganization = ({
  name,
  accent = orgAccents[0].value,
  workspace = DEFAULT_WORKSPACE_NAME,
  plan = azionPlans[0].name,
  additionalData = {},
  owner = {},
}) => {
  const id = idFor(name);
  const organization = {
    id,
    name: String(name ?? "").trim(),
    accent,
    // The tier the organization starts on. Signup's onboarding asks for it (the
    // Plan step) and passes the answer; the console's own Create Organization
    // flow does not ask, so a further organization starts on the free tier —
    // the only plan it is safe to put someone on without asking.
    plan,
    // The organization is its own first tenant.
    accounts: 1,
    status: "active",
    // No Group: one is created only when there are workspaces to group.
    groups: [],
    // Namespaced by the organization, so a workspace id can never be mistaken
    // for the account-keyed seeds in workspaces.js.
    workspaces: [{ id: `${id}-primary`, name: String(workspace ?? "").trim(), workloads: 0 }],
    additionalData: { ...additionalData },
    // The creator, who cannot be an invited user: an invitation can never carry
    // ownership, so the Owner role only ever originates here.
    owner: { ...owner, role: "owner", organizationUser: true },
  };
  organizations.value = [organization, ...organizations.value];
  currentOrganizationId.value = organization.id;
  return organization;
};

// One shared instance across every import (module-level singleton).
export function useOrganizations() {
  return { organizations, currentOrganization, currentOrganizationId, switchOrganization };
}
