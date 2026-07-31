// Deployment vocabulary — the single table of statuses, resource types and
// environments every deployment surface reads from.
//
// A deployment shows up in three places (the Deployments module, a workload's
// Version History and its Deployments tab) plus the details drawer. Each of
// them used to re-declare its own STATUS_SEVERITY map and its own environment
// list, so the same status could drift into a different severity per screen.
// One module, one answer: a status, a resource type and an environment read
// identically wherever they appear.

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
