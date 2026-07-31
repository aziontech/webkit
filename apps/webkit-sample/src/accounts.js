// Accounts store — a module-level singleton (like organizations.js /
// sidebar.js / theme.js) so the header's account switcher and the Switch
// Account drawer share one source of truth. Switching the current account
// persists for the session, so the header pill reflects the choice across
// every page. The organization that owns this tree lives in organizations.js.
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

// Initials for an account's avatar.
//
// The design system's Avatar takes the first two CHARACTERS of the label, which
// is right for one-word names and wrong the moment two customers share a stem:
// "Magalu" and "Madeira Madeira" both come out "MA", in the same list, which is
// exactly what the mark exists to prevent. So a multi-word name is initialled by
// word ("Madeira Madeira" → MM, "Caixa Econômica Federal" → CE) and a one-word
// name keeps the two-character form ("Magalu" → MA, "iFood" → IF).
export const accountInitials = (name) => {
  const words = String(name ?? "")
    .trim()
    .split(/\s+/)
    // A word has to START with a letter or digit to lend an initial, or
    // "Retail & Marketplace" comes out "R&".
    .filter((word) => /^[\p{L}\p{N}]/u.test(word));
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0] ?? "").slice(0, 2).toUpperCase();
};

// The account the operator is logged into by default — the first (root) Azion
// account. Also present in the Clients list, so it shows a "Current Logged"
// marker when that type is browsed. Exported because it is also the middle link
// of the scope that owns every seeded resource row (see lib/tenancy-scope.js):
// the app boots into the full lists, and switching away projects them.
export const FIRST_ACCOUNT_ID = 6;

// Seeded tenants across all four levels, linked into one tree by `parentId`
// (null = a root under the organization). Client accounts are named after the
// COMPANY that owns them, because that is what a client account is in the
// console: one customer's traffic, storage and bill. The groups above them are
// the segments those customers are managed in, so a switcher row reads as a
// real place ("Magalu", under Retail & Marketplace) rather than a test fixture.
// A few carry resource metadata (last accessed, labels, monthly charges) so the
// Manage Resources table reads like the console; the rest render "—".
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

  // Groups — the segment each set of customer accounts is managed in.
  { id: 9032, name: "Retail & Marketplace", clientId: "4500p", type: "group", parentId: 4471 },
  { id: 9088, name: "Digital Commerce", clientId: "4710q", type: "group", parentId: 4471 },
  { id: 9140, name: "Enterprise Accounts", clientId: "4881r", type: "group", parentId: 4519 },

  // Clients — one per customer. The five with a `lastAccessed` are the ones the
  // header's switcher offers as "recently accessed" (it caps at five, current
  // included); the rest are reachable through the full tree in the Switch
  // Account drawer. Every one is `active`: these are real companies, and a
  // seeded "suspended" against a real name states something about them that
  // isn't ours to state.
  {
    id: FIRST_ACCOUNT_ID,
    name: "Magalu",
    clientId: "0001a",
    type: "client",
    parentId: 9032,
    lastAccessed: "2 hours ago",
    status: "active",
    charges: "1,284.00",
    labels: ["retail", "prod"],
  },
  { id: 33024, name: "Madeira Madeira", clientId: "1860h", type: "client", parentId: 9032, lastAccessed: "Yesterday", status: "active", charges: "612.40" },
  // Tray is LWSA's commerce platform, so the two sit in the same segment.
  { id: 29025, name: "Tray", clientId: "4797u", type: "client", parentId: 9088, lastAccessed: "3 days ago", status: "active", charges: "42.10" },
  { id: 5791, name: "LWSA", clientId: "4151o", type: "client", parentId: 9088, status: "active" },
  { id: 31204, name: "iFood", clientId: "4206r", type: "client", parentId: 9140, lastAccessed: "1 week ago", status: "active", labels: ["delivery"] },
  { id: 28836, name: "Caixa Econômica Federal", clientId: "3493x", type: "client", parentId: 9140, lastAccessed: "1 month ago", status: "active", charges: "3,910.75" },
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
