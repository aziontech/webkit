// Teams & Permissions store — a module-level singleton (like sidebar.js /
// theme.js) so the Teams Permissions LIST and the Create/Edit Team flow share
// one source of truth. Mutations (create / update / delete a team) persist for
// the session, so creating a team on the form immediately shows up in the list
// and editing one reflects back — the demo behaves like a real console.
//
// A permission is addressed by a stable id:
//   - resource with capabilities → `${resource.key}.view` / `${resource.key}.edit`
//   - single-action permission    → `${resource.key}` (the label is the action)
//
// The catalog groups resources by product area (mirroring the console), which
// drives the Vercel-style selector: each group is a table section whose rows are
// resources and whose right-hand columns are the View / Edit checkboxes.
import { ref } from "vue";

// --- Permissions catalog -------------------------------------------------
// Each group renders as one section of the selector. A resource with `actions`
// exposes View / Edit checkbox columns; a `single` resource is one checkbox
// whose label already reads as a full action (e.g. "Real-Time Purge").
export const permissionGroups = [
  {
    label: "Content Delivery",
    resources: [
      { key: "content-delivery", label: "Content Delivery Settings", actions: ["view", "edit"] },
      { key: "applications", label: "Applications", actions: ["view", "edit"] },
      { key: "workloads", label: "Workloads", actions: ["view", "edit"] },
      { key: "connectors", label: "Connectors", actions: ["view", "edit"] },
      { key: "custom-pages", label: "Custom Pages", actions: ["view", "edit"] },
      { key: "dns", label: "DNS", actions: ["view", "edit"] },
    ],
  },
  {
    label: "Security",
    resources: [
      { key: "security", label: "Security Settings", actions: ["view", "edit"] },
      { key: "firewall", label: "Firewall", actions: ["view", "edit"] },
      { key: "network-lists", label: "Network Lists", actions: ["view", "edit"] },
      { key: "policies", label: "Policies", actions: ["view", "edit"] },
    ],
  },
  {
    label: "Edge Functions",
    resources: [{ key: "functions", label: "Functions", actions: ["view", "edit"] }],
  },
  {
    label: "Storage",
    resources: [
      { key: "storage-bucket", label: "Storage Bucket", actions: ["view", "edit"] },
      { key: "storage-object", label: "Storage Object", actions: ["view", "edit"] },
    ],
  },
  {
    label: "Observability",
    resources: [
      { key: "data-stream", label: "Data Stream", actions: ["view", "edit"] },
      { key: "analytics", label: "View Analytics", single: true },
      { key: "events", label: "View Events", single: true },
    ],
  },
  {
    label: "Deploy & Automation",
    resources: [
      { key: "orchestrator-nodes", label: "Orchestrator Nodes", actions: ["view", "edit"] },
      { key: "orchestrator-services", label: "Orchestrator Services", actions: ["view", "edit"] },
      { key: "vcs-continuous-deployment", label: "VCS Continuous Deployment", actions: ["view", "edit"] },
      { key: "vcs-integrations", label: "VCS Integrations", actions: ["view", "edit"] },
    ],
  },
  {
    label: "Billing",
    resources: [
      { key: "subscriptions", label: "Subscriptions", actions: ["view", "edit"] },
      { key: "payment-methods", label: "Payment Methods", actions: ["view", "edit"] },
      { key: "bills", label: "View Bills", single: true },
    ],
  },
  {
    label: "Account & Users",
    resources: [
      { key: "users", label: "Users", actions: ["view", "edit"] },
      { key: "marketplace-publisher", label: "Marketplace Publisher", actions: ["view", "edit"] },
      { key: "mfa", label: "Edit Multi-Factor Authentication", single: true },
      { key: "scim", label: "SCIM Integration", single: true },
    ],
  },
  {
    label: "Tools",
    resources: [
      { key: "real-time-purge", label: "Real-Time Purge", single: true },
      { key: "wildcard-purge", label: "Wildcard Purge", single: true },
    ],
  },
];

// The individual permissions a resource contributes, each with its id + the
// human label used in the list's overflow popover.
export const resourcePermissions = (resource) => {
  if (resource.single) return [{ id: resource.key, label: resource.label, action: "single" }];
  return resource.actions.map((action) => ({
    id: `${resource.key}.${action}`,
    action,
    label: `${action === "view" ? "View" : "Edit"} ${resource.label}`,
  }));
};

// id → label, built once, for the list's "+N" overflow popover.
const permissionLabels = new Map();
for (const group of permissionGroups) {
  for (const resource of group.resources) {
    for (const permission of resourcePermissions(resource)) {
      permissionLabels.set(permission.id, permission.label);
    }
  }
}

export const permissionLabel = (id) => permissionLabels.get(id) ?? id;

// Every permission id in the catalog (used to seed a fully-privileged team and
// to compute "X of Y selected").
export const allPermissionIds = [...permissionLabels.keys()];

// A team's permission labels, catalog order preserved — the order the overflow
// popover lists them in.
export const permissionLabelsFor = (ids) => {
  const set = new Set(ids);
  return allPermissionIds.filter((id) => set.has(id)).map(permissionLabel);
};

// --- Teams store ---------------------------------------------------------
const viewOnlyIds = allPermissionIds.filter((id) => id.endsWith(".view") || !id.includes("."));

const teams = ref([
  {
    id: "default-team",
    name: "Default Team",
    description: "Full access to every resource in the account.",
    status: "Active",
    permissions: [...allPermissionIds],
  },
  {
    id: "read-only",
    name: "Read Only",
    description: "View access across the console — no write operations.",
    status: "Active",
    permissions: viewOnlyIds,
  },
  {
    id: "billing-admins",
    name: "Billing Admins",
    description: "Manage subscriptions, payment methods, and invoices.",
    status: "Inactive",
    permissions: [
      "subscriptions.view",
      "subscriptions.edit",
      "payment-methods.view",
      "payment-methods.edit",
      "bills",
    ],
  },
]);

let nextId = teams.value.length + 1;

const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function useTeams() {
  const getTeam = (id) => teams.value.find((team) => team.id === id) ?? null;

  const createTeam = ({ name, description, status, permissions }) => {
    const id = `${slugify(name) || "team"}-${nextId++}`;
    const team = { id, name, description, status, permissions: [...permissions] };
    teams.value = [...teams.value, team];
    return team;
  };

  const updateTeam = (id, patch) => {
    teams.value = teams.value.map((team) =>
      team.id === id ? { ...team, ...patch, permissions: [...patch.permissions] } : team,
    );
    return getTeam(id);
  };

  const removeTeam = (id) => {
    teams.value = teams.value.filter((team) => team.id !== id);
  };

  return { teams, getTeam, createTeam, updateTeam, removeTeam };
}
