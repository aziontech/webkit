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
// tell them apart in the header before reading a single character. The accent
// is chosen when the org is created; the Create Organization module isn't built
// yet, so the seeds below carry the choice and `orgAccents` is the palette that
// module will offer.
import { computed, ref } from "vue";

// The three accents an organization may wear.
//
// `colors` is a three-stop palette in theme tokens, handed to the marble
// avatar: the generator picks which stop paints the field and which paints each
// blob, from the org's name. The three stops are deliberately far apart in
// LIGHTNESS (a pale step, a saturated mid, a deep one) — the blobs are heavily
// blurred, so two neighbouring steps of one ramp dissolve into a plain gradient
// and the marbling disappears. Two stops stay in the accent's own hue; the
// third is its warm/cool neighbour, which is what gives the mark a second
// colour to marble against. Tokens, not hex, so the art follows the theme.
export const orgAccents = [
  {
    value: "blue",
    label: "Blue",
    colors: ["var(--color-blue-200)", "var(--color-blue-700)", "var(--color-violet-500)"],
  },
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
];

// Look up an accent by value; an unknown value falls back to the first one
// rather than rendering an unpainted mark.
export const accentOf = (value) =>
  orgAccents.find((accent) => accent.value === value) ?? orgAccents[0];

// Seeded organizations. `accounts` is how many tenants live under the org (the
// count the switcher shows under the name) and `plan` is its contract tier —
// both are the two facts that tell two same-named orgs apart in a list.
const seedOrganizations = [
  // Azion wears orange — the brand's own colour, so the org an operator lives
  // in is the one mark that matches the product they are inside.
  { id: "azion", name: "Azion", accent: "orange", plan: "Enterprise", accounts: 12 },
  { id: "nebula", name: "Nebula Labs", accent: "blue", plan: "Business", accounts: 4 },
  { id: "northwind", name: "Northwind Retail", accent: "yellow", plan: "Business", accounts: 7 },
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

// One shared instance across every import (module-level singleton).
export function useOrganizations() {
  return { organizations, currentOrganization, currentOrganizationId, switchOrganization };
}
