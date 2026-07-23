// Accounts store — a module-level singleton (like teams.js / sidebar.js /
// theme.js) so the sidebar's account switcher and the Switch Account dialog
// share one source of truth. Switching the current account persists for the
// session, so the top-rail pill reflects the choice across every page.
//
// The Azion console is multi-tenant: a Brand owns Resellers, a Reseller owns
// Groups, and a Group owns Client accounts. The switcher lets an operator move
// across that tree by browsing one type at a time.
import { computed, ref } from "vue";

// The four levels of the hierarchy, top → bottom. `value` drives the type
// Select; `singular` matches an account's `type`; `icon` + `severity` render
// the per-row Type tag. Order mirrors the ownership chain.
export const accountTypes = [
  {
    value: "brands",
    label: "Brands",
    singular: "brand",
    typeLabel: "Brand",
    icon: "pi pi-globe",
    severity: "accent",
  },
  {
    value: "resellers",
    label: "Resellers",
    singular: "reseller",
    typeLabel: "Reseller",
    icon: "pi pi-sitemap",
    severity: "info",
  },
  {
    value: "groups",
    label: "Groups",
    singular: "group",
    typeLabel: "Group",
    icon: "pi pi-users",
    severity: "warning",
  },
  {
    value: "clients",
    label: "Clients",
    singular: "client",
    typeLabel: "Client",
    icon: "pi pi-box",
    severity: "secondary",
  },
];

// The synthetic root of the resource tree — the organization every top-level
// brand sits under (mirrors the console's "No organization" node). Kept out of
// `accountTypes` so it never appears as a switch target in the account drawer.
export const organizationType = {
  value: "organization",
  label: "Organization",
  singular: "organization",
  typeLabel: "Organization",
  icon: "pi pi-building",
  severity: "contrast",
};

// Look up the type descriptor for an account's `type` (the singular form).
export const accountTypeOf = (type) =>
  type === "organization"
    ? organizationType
    : (accountTypes.find((entry) => entry.singular === type) ?? accountTypes[3]);

// The account the operator is logged into by default — the first (root) Azion
// account. Also present in the Clients list, so it shows a "Current Logged"
// marker when that type is browsed.
const FIRST_ACCOUNT_ID = 6;

// Seeded tenants across all four levels, linked into one tree by `parentId`
// (null = a root under the organization). Client names include the quirky,
// real-world test accounts an operator actually sees in the console. A few
// carry resource metadata (last accessed, status, labels, monthly charges) so
// the Manage Resources table reads like the console; the rest render "—".
const ORG_ID = 0;

const seedAccounts = [
  // The organization root.
  { id: ORG_ID, name: "No organization", clientId: "—", type: "organization", parentId: null },

  // Brands
  { id: 1, name: "Azion Brand", clientId: "0001b", type: "brand", parentId: ORG_ID, labels: ["primary"] },
  { id: 812, name: "Nebula Partners", clientId: "0204c", type: "brand", parentId: ORG_ID },

  // Resellers
  { id: 4471, name: "LatAm Reseller Network", clientId: "1180d", type: "reseller", parentId: 1 },
  { id: 4519, name: "EMEA Distribution", clientId: "2330k", type: "reseller", parentId: 1 },
  { id: 4602, name: "APAC Cloud Partners", clientId: "2515m", type: "reseller", parentId: 812 },

  // Groups
  { id: 9032, name: "Enterprise Accounts", clientId: "4500p", type: "group", parentId: 4471 },
  { id: 9088, name: "SMB Portfolio", clientId: "4710q", type: "group", parentId: 4471 },
  { id: 9140, name: "Public Sector", clientId: "4881r", type: "group", parentId: 4519 },

  // Clients
  {
    id: FIRST_ACCOUNT_ID,
    name: "Azion - Engineering (First Account)",
    clientId: "0001a",
    type: "client",
    parentId: 9032,
    lastAccessed: "2 hours ago",
    status: "active",
    charges: "1,284.00",
    labels: ["engineering", "prod"],
  },
  { id: 33024, name: "김직진", clientId: "1860h", type: "client", parentId: 9032, lastAccessed: "Yesterday", status: "active" },
  { id: 29025, name: "~", clientId: "4797u", type: "client", parentId: 9088, lastAccessed: "3 days ago", status: "active", charges: "42.10" },
  { id: 5791, name: "?", clientId: "4151o", type: "client", parentId: 9088, status: "suspended" },
  { id: 31204, name: "☺", clientId: "4206r", type: "client", parentId: 9088 },
  { id: 28836, name: "[-_-]", clientId: "3493x", type: "client", parentId: 9140, lastAccessed: "1 month ago", status: "active" },
  { id: 19736, name: "**********", clientId: "2173f", type: "client", parentId: 9140, status: "suspended" },
];

const accounts = ref(seedAccounts);
const currentAccountId = ref(FIRST_ACCOUNT_ID);

const currentAccount = computed(
  () => accounts.value.find((account) => account.id === currentAccountId.value) ?? accounts.value[0],
);

// Switch the logged-in account. Idempotent — re-selecting the current account
// is a no-op the caller can treat as "already here".
const switchAccount = (account) => {
  const changed = account.id !== currentAccountId.value;
  currentAccountId.value = account.id;
  return changed;
};

// Direct children of a node (by parent id; `null` for the roots).
export const accountChildren = (parentId) =>
  accounts.value.filter((account) => (account.parentId ?? null) === parentId);

// Flatten the tree into the rows a table renders, honoring which nodes are
// expanded: a node's children are emitted only when its id is in `expandedIds`.
// Each row is tagged with `depth` (indentation), `hasChildren` (chevron), and
// `typeLabel` (Type column + search).
export function flattenTree(expandedIds) {
  const out = [];
  const walk = (parentId, depth) => {
    for (const account of accountChildren(parentId)) {
      const children = accountChildren(account.id);
      out.push({
        ...account,
        depth,
        hasChildren: children.length > 0,
        typeLabel: accountTypeOf(account.type).typeLabel,
      });
      if (children.length && expandedIds.has(account.id)) walk(account.id, depth + 1);
    }
  };
  walk(null, 0);
  return out;
}

// One shared instance across every import (module-level singleton).
export function useAccounts() {
  return { accounts, currentAccount, currentAccountId, switchAccount };
}
