// Deployment vocabulary — the single table of statuses, resource types and
// environments every deployment surface reads from.
//
// A deployment shows up in three places (the Deployments module, a workload's
// Version History and its Deployments tab) plus the details drawer. Each of
// them used to re-declare its own STATUS_SEVERITY map and its own environment
// list, so the same status could drift into a different severity per screen.
// One module, one answer: a status, a resource type and an environment read
// identically wherever they appear.

import { DATE_PRESETS, formatDateRange, matchDate } from "./filter-bar";

/** Deployment status → StatusIndicator severity + spinner state. */
export const STATUS_SEVERITY = {
  Ready: { severity: "success", loading: false },
  Building: { severity: "info", loading: true },
  Queued: { severity: "warning", loading: false },
  Error: { severity: "danger", loading: false },
  Draft: { severity: "neutral", loading: false },
};

/**
 * The severity + spinner state for a status, falling back to a neutral dot for
 * anything the table above does not name.
 *
 * @param {string} status
 * @returns {{ severity: string, loading: boolean }}
 */
export const statusMeta = (status) =>
  STATUS_SEVERITY[status] ?? { severity: "neutral", loading: false };

/** Status options for a Select / filter field, in the order above. */
export const statusOptions = Object.keys(STATUS_SEVERITY).map((value) => ({
  value,
  label: value,
}));

// A deployment targets exactly ONE resource — deploying an application, a
// firewall or a custom page each triggers its own deployment — so a row carries
// the resource's NAME and its TYPE. The label, the glyph, the module page it
// links to and the field the details drawer reads it under are all derived from
// the type, so the tag, the filter options and the drawer can never disagree.
export const RESOURCE_TYPES = {
  application: {
    label: "Application",
    icon: "ai ai-edge-application",
    // Only Applications has a module page in this sample; the Firewall and
    // Custom Pages modules are nav-only, so their rows render the resource name
    // as plain text (the same rule the workload topology follows).
    path: "/applications",
    drawerField: "application",
  },
  firewall: {
    label: "Firewall",
    icon: "ai ai-edge-firewall",
    path: "",
    drawerField: "firewall",
  },
  "custom-page": {
    label: "Custom Page",
    icon: "ai ai-custom-pages",
    path: "",
    drawerField: "customPage",
  },
};

/**
 * The label / glyph / route for a resource type.
 *
 * @param {string} type
 * @returns {{ label: string, icon: string, path: string, drawerField?: string }}
 */
export const resourceMeta = (type) =>
  RESOURCE_TYPES[type] ?? { label: type, icon: "", path: "" };

/** Resource-type options for a Select / filter field. */
export const resourceTypeOptions = Object.entries(RESOURCE_TYPES).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

/**
 * The deployed resource's own page, or `''` when its module has none.
 *
 * @param {{ resourceType: string, resourceId?: string }} row
 * @returns {string}
 */
export const resourceHref = (row) => {
  const { path } = resourceMeta(row.resourceType);
  return path && row.resourceId ? `${path}/${row.resourceId}` : "";
};

export const environmentOptions = [
  { value: "Production", label: "Production" },
  // Preview is the environment a workload deployment lands in before it is
  // promoted (`azion.json#env`); it is an option here so the Environment selector
  // can narrow to it.
  { value: "Preview", label: "Preview" },
  { value: "Stage", label: "Stage" },
];

/** Production is the live environment (info); everything else is a rehearsal (secondary). */
export const environmentSeverity = (environment) =>
  environment === "Production" ? "info" : "secondary";

// ── The filter catalog every deployment surface shares ──────────────────────
// A deployment table renders in three places (the Deployments module, a
// workload's Version History, its Deployments tab), and each one is narrowed by
// the same four columns. The catalog is built here rather than per page so a
// status that gains a value, or an environment that gains a name, reaches every
// surface at once — the same reason STATUS_SEVERITY lives in this file.
//
// AUTHORS COME FROM THE ROWS, so a surface can never offer someone with nothing
// in it: a workload's history lists the two people who deployed that workload,
// while the module list lists everyone. The value is the email (what a row
// carries) and the label is the name (what a person reads).

/**
 * The fields a deployment table can be narrowed by, in column order.
 *
 * @param {Array<object>} rows The rows this surface shows — the Author options come from them.
 * @param {{ deployed?: boolean }} [options] `deployed` adds the date field. The module
 *   list wants it (it spans every deployment ever made); a workload's own history is
 *   already short enough that a date window narrows nothing worth the chip.
 */
export const deploymentFilterFields = (rows = [], { deployed = false } = {}) => {
  const authorOptions = [
    ...new Map(rows.map((row) => [row.authorEmail, row])).values(),
  ]
    .filter((row) => row.authorEmail)
    .map((row) => ({
      value: row.authorEmail,
      label: row.author || row.authorEmail,
      avatar: row.authorAvatar,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return [
    {
      id: "status",
      label: "Status",
      kind: "options",
      options: statusOptions,
      match: (row, values) => values.includes(row.status),
    },
    {
      id: "resourceType",
      label: "Type",
      kind: "options",
      options: resourceTypeOptions,
      match: (row, values) => values.includes(row.resourceType),
    },
    {
      id: "environment",
      label: "Environment",
      kind: "options",
      options: environmentOptions,
      match: (row, values) => values.includes(row.environment),
    },
    {
      id: "author",
      label: "Author",
      kind: "options",
      options: authorOptions,
      match: (row, values) => values.includes(row.authorEmail),
    },
    ...(deployed
      ? [
          {
            id: "deployed",
            label: "Deployed",
            kind: "range",
            options: DATE_PRESETS,
            formatValue: formatDateRange,
            match: (row, values) => matchDate(row.date, values),
          },
        ]
      : []),
  ];
};
