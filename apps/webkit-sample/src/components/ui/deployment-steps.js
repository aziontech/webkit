// Canonical Azion deploy steps used by DeploymentLogs — each owns its slice of
// the deploy log and how long it takes (per-step feedback in static mode,
// measured live). Kept in a plain module so it can seed the `steps` prop
// default without tripping the <script setup> hoisting rules.
export const DEFAULT_DEPLOYMENT_STEPS = [
  {
    key: "build",
    title: "Build",
    description: "Install dependencies and build the project",
    duration: 17,
    logs: [
      ["13:47:33", "[TASK] - #. Deploy started successfully!"],
      ["13:47:33", "[TASK] - #. Creating Azion token!"],
      ["13:47:33", "[TASK] - #. Add to Azion CLI!"],
      ["13:47:34", "[TASK] - # Current directory: vue/vue3-vite-static/"],
      ["13:47:34", "[TASK] - #. Cloning template!"],
      ["13:47:38", "[TASK] - # Build template"],
      ["13:47:47", "added 478 packages, and audited 479 packages in 9s"],
      ["13:47:47", "24 vulnerabilities (5 low, 7 moderate, 10 high, 2 critical)"],
      ["13:47:50", "[TASK] - # Build completed successfully!"],
    ],
  },
  {
    key: "upload",
    title: "Upload",
    description: "Upload static assets to the edge",
    duration: 5,
    logs: [
      ["13:47:51", "[TASK] - # Uploading static assets to Edge Storage"],
      ["13:47:52", "create mode 100644 src/main.js"],
      ["13:47:52", "create mode 100644 src/router/index.js"],
      ["13:47:55", "[TASK] - # 24 files uploaded (1.2 MB)"],
      ["13:47:56", "[TASK] - # Upload completed successfully!"],
    ],
  },
  {
    key: "deploy",
    title: "Configure Application",
    description: "Set up the edge application, rules and domain",
    duration: 8,
    logs: [
      ["13:47:57", "[TASK] - # Creating Edge Application"],
      ["13:47:58", "[TASK] - # Configuring Rules Engine and cache policies"],
      ["13:48:01", "branch 'main' set up to track 'origin/main'."],
      ["13:48:02", "[TASK] - #. Set Azion Personal Token in the repository."],
      ["13:48:04", "[TASK] - #. Deploy finalized successfully!"],
    ],
  },
];
