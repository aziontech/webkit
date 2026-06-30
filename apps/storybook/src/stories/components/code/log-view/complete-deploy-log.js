/** Complete Azion deploy log mirroring Figma BuildLogs / LogLine variants. */
export const completeDeployLog = [
  { id: '1', time: '13:47:33', type: 'text', message: '[TASK] - #. Deploy started successfully!' },
  { id: '2', time: '13:47:33', type: 'text', message: '[TASK] - #. Creating Azion token!' },
  { id: '3', time: '13:47:33', type: 'text', message: '[TASK] - #. Add to Azion CLI!' },
  {
    id: '4',
    time: '13:47:33',
    type: 'text',
    message:
      "Please remember to login before running any commands. You can do this by running the following command: 'azion login'"
  },
  {
    id: '5',
    time: '13:47:33',
    type: 'text',
    message: 'Token saved in /root/.azion/default/settings.toml'
  },
  {
    id: '6',
    time: '13:47:33',
    type: 'text',
    message: 'This token will be used by default with all commands'
  },
  {
    id: '7',
    time: '13:47:33',
    type: 'text',
    message: '[TASK] - # Current directory: vue/vue3-vite-static/'
  },
  { id: '8', time: '13:47:33', type: 'text', message: '[TASK] - #. Cloning template!' },
  { id: '9', time: '13:47:38', type: 'text', message: '[TASK] - # Build template' },
  {
    id: '10',
    time: '13:47:47',
    type: 'text',
    message: 'added 478 packages, and audited 479 packages in 9s'
  },
  { id: '11', time: '13:47:47', type: 'text', message: '82 packages are looking for funding' },
  { id: '12', time: '13:47:47', type: 'text', message: 'run `npm fund` for details' },
  {
    id: '13',
    time: '13:47:47',
    type: 'warning',
    message: '24 vulnerabilities (5 low, 7 moderate, 10 high, 2 critical)'
  },
  {
    id: '14',
    time: '13:47:47',
    type: 'text',
    message: 'To address issues that do not require attention, run:'
  },
  { id: '15', time: '13:47:47', type: 'text', message: 'npm audit fix' },
  { id: '16', time: '13:47:47', type: 'text', message: 'To address all issues, run:' },
  { id: '17', time: '13:47:47', type: 'text', message: 'npm audit fix --force' },
  { id: '18', time: '13:47:47', type: 'text', message: 'Run `npm audit` for details.' },
  { id: '19', time: '13:47:47', type: 'text', message: '[TASK] - # Link template!' },
  { id: '20', time: '13:47:48', type: 'success', message: 'Project successfully configured' },
  {
    id: '21',
    time: '13:47:48',
    type: 'success',
    message: 'Successfully written to your .gitignore file'
  },
  {
    id: '22',
    time: '13:47:48',
    type: 'success',
    message: 'Successfully created GitHub Actions workflow file at .github/workflows/azion-deploy.yml'
  },
  { id: '23', time: '13:47:50', type: 'text', message: '[TASK] - #. Dump azion variables!' },
  { id: '24', time: '13:47:50', type: 'success', message: 'Variables file (.env) dumped successfully' },
  { id: '25', time: '13:47:50', type: 'text', message: '[TASK] - # Deploy template!' },
  {
    id: '26',
    time: '13:47:51',
    type: 'text',
    message: '2026-05-26T13:47:51.181Z DEBUG Verifying if an update is required'
  },
  { id: '27', time: '13:47:51', type: 'text', message: '2026-05-26T13:47:51.181Z DEBUG Exec Schedules' },
  { id: '28', time: '13:47:51', type: 'text', message: 'Running deploy command' },
  {
    id: '29',
    time: '13:47:51',
    type: 'text',
    message: '2026-05-26T13:47:51.181Z DEBUG Running build command'
  },
  {
    id: '30',
    time: '13:47:51',
    type: 'text',
    message: 'Building your Application. This process may take a few minutes'
  },
  { id: '31', time: '13:47:51', type: 'text', message: 'Running build step command:' },
  { id: '32', time: '13:47:51', type: 'text', message: '$ DEBUG=true npx --yes edge-functions@5.3.1 build' },
  { id: '33', time: '13:48:15', type: 'text', message: '[Azion] [Build] › ℹ info Using preset: vue' },
  { id: '34', time: '13:48:15', type: 'text', message: '[Azion] [Pre-Build] › ℹ info Starting pre-build...' },
  { id: '35', time: '13:48:15', type: 'text', message: '[Vue/Vite] › ℹ info' },
  { id: '36', time: '13:48:15', type: 'text', message: '> vue-vite-static@0.0.0 build' },
  { id: '37', time: '13:48:15', type: 'text', message: '> vite build' },
  {
    id: '38',
    time: '13:48:15',
    type: 'framework-version',
    message: 'vite v4.5.12',
    suffix: 'building for production...'
  },
  { id: '39', time: '13:48:15', type: 'text', message: '[Vue/Vite] › ℹ info transforming...' },
  {
    id: '40',
    time: '13:48:16',
    type: 'text',
    message: '[Vue/Vite] › ℹ info ✓ 42 modules transformed.'
  },
  { id: '41', time: '13:48:17', type: 'text', message: '[Vue/Vite] › ℹ info rendering chunks...' },
  {
    id: '42',
    time: '13:48:17',
    type: 'text',
    message: '[Vue/Vite] › ℹ info computing gzip size...'
  },
  {
    id: '43',
    time: '13:48:17',
    type: 'folder',
    message: 'dist/assets/',
    folderType: 'logo-277e0e97.svg',
    size: '0.28 kB',
    gzipSize: '0.19 kB'
  },
  {
    id: '44',
    time: '13:48:17',
    type: 'folder',
    message: 'dist/',
    folderType: 'index.html',
    size: '0.42 kB',
    gzipSize: '0.28 kB'
  },
  {
    id: '45',
    time: '13:48:17',
    type: 'folder',
    message: 'dist/assets/',
    folderType: 'AboutView-4d995ba2.css',
    size: '0.09 kB',
    gzipSize: '0.10 kB'
  },
  {
    id: '46',
    time: '13:48:17',
    type: 'folder',
    message: 'dist/assets/',
    folderType: 'index-efcb3133.css',
    size: '4.20 kB',
    gzipSize: '1.30 kB'
  },
  {
    id: '47',
    time: '13:48:17',
    type: 'folder',
    message: 'dist/assets/',
    folderType: 'AboutView-dc6b62c6.js',
    size: '0.22 kB',
    gzipSize: '0.20 kB'
  },
  {
    id: '48',
    time: '13:48:17',
    type: 'folder',
    message: 'dist/assets/',
    folderType: 'index-f51559af.js',
    size: '95.15 kB',
    gzipSize: '37.31 kB'
  },
  { id: '49', time: '13:48:17', type: 'success', message: 'built in 1.44s' },
  {
    id: '50',
    time: '13:48:17',
    type: 'text',
    message: '[Azion] [Pre-Build] › ℹ info Pre-build completed successfully'
  },
  {
    id: '51',
    time: '13:48:17',
    type: 'text',
    message: '[Azion] [Build] › ℹ info Using built-in handler from "vue" preset.'
  },
  {
    id: '52',
    time: '13:48:17',
    type: 'warning',
    message:
      '[Azion] [Build] › ⚠ warning DEPRECATED: Migrate handler to → export default { fetch: (request, env, ctx) => {...} }'
  },
  {
    id: '53',
    time: '13:48:17',
    type: 'text',
    message: '[Azion] [Build] › ℹ info Starting build...'
  },
  {
    id: '54',
    time: '13:48:18',
    type: 'success',
    message: '[Azion] [Build] › ✔ success Build completed successfully'
  },
  {
    id: '55',
    time: '13:48:18',
    type: 'text',
    message: '[Azion] [Post-Build] › ℹ info Starting post-build...'
  },
  {
    id: '56',
    time: '13:48:18',
    type: 'success',
    message: '[Azion] [Post-Build] › ✔ success Post-build completed successfully'
  },
  { id: '57', time: '13:48:18', type: 'text', message: 'Environment file copied to .edge/.env' },
  {
    id: '58',
    time: '13:48:18',
    type: 'success',
    message:
      '[Azion] [IaC] › ✔ success Manifest generated successfully at /azion-samples/templates/vue/vue3-vite-static/.edge/manifest.json'
  },
  { id: '59', time: '13:48:18', type: 'text', message: 'Your Application was built successfully' },
  {
    id: '60',
    time: '13:48:18',
    type: 'text',
    message: '2026-05-26T13:48:17.226Z DEBUG Create Edge Application'
  },
  { id: '61', time: '13:48:18', type: 'success', message: 'Created Application vue-3-teste with ID 1779802985' },
  {
    id: '62',
    time: '13:48:18',
    type: 'text',
    message: '2026-05-26T13:48:18.447Z DEBUG Update Edge Application'
  },
  { id: '63', time: '13:48:19', type: 'text', message: '2026-05-26T13:48:19.594Z DEBUG Create Origins' },
  { id: '64', time: '13:48:20', type: 'success', message: 'Created Origin for Application' },
  {
    id: '65',
    time: '13:48:20',
    type: 'text',
    message: '2026-05-26T13:48:20.541Z DEBUG Get Rules Engine Default'
  },
  { id: '66', time: '13:48:21', type: 'text', message: '2026-05-26T13:48:21.421Z DEBUG Update Rules Engine' },
  {
    id: '67',
    time: '13:48:22',
    type: 'text',
    message: '2026-05-26T13:48:22.814Z DEBUG Create Rules Engine Next Application'
  },
  {
    id: '68',
    time: '13:48:24',
    type: 'text',
    message: 'Using the same name as your project to create the bucket'
  },
  {
    id: '69',
    time: '13:48:24',
    type: 'text',
    message: '2026-05-26T13:48:24.066Z DEBUG Creating bucket {"name": "vue-3-teste"}'
  },
  { id: '70', time: '13:48:46', type: 'success', message: 'Created Bucket vue-3-teste' },
  { id: '71', time: '13:48:46', type: 'text', message: 'Uploading source files' },
  {
    id: '72',
    time: '13:48:46',
    type: 'text',
    message: '2026-05-26T13:48:46.835Z DEBUG Object_key: 20260526134817/assets/AboutView-4d995ba2.css'
  },
  {
    id: '73',
    time: '13:48:46',
    type: 'text',
    message: '2026-05-26T13:48:46.835Z DEBUG Object_key: 20260526134817/assets/index-efcb3133.css'
  },
  {
    id: '74',
    time: '13:48:46',
    type: 'text',
    message: '2026-05-26T13:48:46.835Z DEBUG Object_key: 20260526134817/assets/logo-277e0e97.svg'
  },
  {
    id: '75',
    time: '13:48:46',
    type: 'text',
    message: '2026-05-26T13:48:46.835Z DEBUG Object_key: 20260526134817/assets/index-f51559af.js'
  },
  {
    id: '76',
    time: '13:48:46',
    type: 'text',
    message: '2026-05-26T13:48:46.835Z DEBUG Object_key: 20260526134817/assets/AboutView-dc6b62c6.js'
  },
  {
    id: '77',
    time: '13:48:48',
    type: 'text',
    message: '2026-05-26T13:48:48.086Z DEBUG Object_key: 20260526134817/favicon.ico'
  },
  {
    id: '78',
    time: '13:48:48',
    type: 'text',
    message: 'Uploading files 14% |█████ | (1/7) [0s:0s]'
  },
  {
    id: '79',
    time: '13:48:48',
    type: 'text',
    message: '2026-05-26T13:48:48.258Z DEBUG Object_key: 20260526134817/index.html'
  },
  {
    id: '80',
    time: '13:48:48',
    type: 'text',
    message: 'Uploading files 28% |███████████ | (2/7) [0s:0s]'
  },
  {
    id: '81',
    time: '13:48:48',
    type: 'text',
    message: 'Uploading files 42% |█████████████████ | (3/7) [0s:0s]'
  },
  {
    id: '82',
    time: '13:48:49',
    type: 'text',
    message: 'Uploading files 57% |██████████████████████ | (4/7) [1s:1s]'
  },
  {
    id: '83',
    time: '13:48:49',
    type: 'text',
    message: 'Uploading files 71% |████████████████████████████ | (5/7) [1s:0s]'
  },
  {
    id: '84',
    time: '13:48:50',
    type: 'text',
    message: 'Uploading files 85% |██████████████████████████████████ | (6/7) [2s:0s]'
  },
  { id: '85', time: '13:48:51', type: 'text', message: 'Upload completed successfully!' },
  {
    id: '86',
    time: '13:48:51',
    type: 'text',
    message: '2026-05-26T13:48:51.362Z DEBUG Create Edge Function'
  },
  { id: '87', time: '13:48:53', type: 'success', message: 'Created Function vue-3-teste with ID 52818' },
  {
    id: '88',
    time: '13:48:53',
    type: 'text',
    message: '2026-05-26T13:48:53.939Z DEBUG Create Instance'
  },
  {
    id: '89',
    time: '13:48:53',
    type: 'text',
    message: '2026-05-26T13:48:53.939Z DEBUG Create Edge Function Instance'
  },
  { id: '90', time: '13:48:56', type: 'text', message: 'Reading manifest.json file' },
  { id: '91', time: '13:48:56', type: 'text', message: 'Creating resources found in manifest.json file' },
  { id: '92', time: '13:48:56', type: 'text', message: '2026-05-26T13:48:56.079Z DEBUG Create Origins' },
  {
    id: '93',
    time: '13:48:57',
    type: 'success',
    message: 'Origin origin-storage-default with id 261044 successfully created'
  },
  { id: '94', time: '13:48:57', type: 'text', message: '2026-05-26T13:48:57.257Z DEBUG Create Rules Engine' },
  {
    id: '95',
    time: '13:48:58',
    type: 'success',
    message: 'Rule Engine Set Storage Origin for All Requests with id 561537 successfully created'
  },
  { id: '96', time: '13:48:58', type: 'text', message: '2026-05-26T13:48:58.424Z DEBUG Create Rules Engine' },
  {
    id: '97',
    time: '13:48:58',
    type: 'success',
    message: 'Rule Engine Deliver Static Assets with id 561538 successfully created'
  },
  { id: '98', time: '13:48:59', type: 'text', message: '2026-05-26T13:48:59.557Z DEBUG Create Rules Engine' },
  {
    id: '99',
    time: '13:49:00',
    type: 'success',
    message: 'Rule Engine Redirect to index.html with id 561539 successfully created'
  },
  { id: '100', time: '13:49:00', type: 'text', message: '2026-05-26T13:49:00.700Z DEBUG Create Domain' },
  { id: '101', time: '13:49:05', type: 'success', message: 'Created Domain vue-3-teste with ID 1779806653' },
  { id: '102', time: '13:49:05', type: 'success', message: 'Your Application was deployed successfully' },
  {
    id: '103',
    time: '13:49:05',
    type: 'text',
    message: 'To visualize your application access the Domain: https://bc8bxjmyix.map.azionedge.net'
  },
  {
    id: '104',
    time: '13:49:05',
    type: 'text',
    message:
      'Your application is being deployed to all Azion Edge Locations and it might take a few minutes.'
  },
  { id: '105', time: '13:49:05', type: 'text', message: '[TASK] - #. Save output info.' },
  { id: '106', time: '13:49:05', type: 'text', message: '[TASK] - #. Creating repository!' },
  { id: '107', time: '13:49:07', type: 'text', message: '[TASK] - #. Commit template!' },
  {
    id: '108',
    time: '13:49:08',
    type: 'text',
    message: 'Initialized empty Git repository in /azion-samples/templates/vue/vue3-vite-static/.git/'
  },
  { id: '109', time: '13:49:08', type: 'success', message: '[master (root-commit) 3a184a9] [bot] Automated Config' },
  { id: '110', time: '13:49:08', type: 'text', message: '29 files changed, 7630 insertions(+)' },
  {
    id: '111',
    time: '13:49:08',
    type: 'text',
    message: 'create mode 100644 .github/workflows/azion-deploy.yml'
  },
  { id: '112', time: '13:49:08', type: 'text', message: 'create mode 100644 .github/workflows/main.yml' },
  { id: '113', time: '13:49:08', type: 'text', message: 'create mode 100644 .gitignore' },
  { id: '114', time: '13:49:08', type: 'text', message: 'create mode 100644 README.md' },
  { id: '115', time: '13:49:08', type: 'text', message: 'create mode 100644 azion.config.mjs' },
  { id: '116', time: '13:49:08', type: 'text', message: 'create mode 100644 azion/args.json' },
  { id: '117', time: '13:49:08', type: 'text', message: 'create mode 100644 azion/azion.json' },
  { id: '118', time: '13:49:08', type: 'text', message: 'create mode 100644 index.html' },
  { id: '119', time: '13:49:08', type: 'text', message: 'create mode 100644 info.json' },
  { id: '120', time: '13:49:08', type: 'text', message: 'create mode 100644 package-lock.json' },
  { id: '121', time: '13:49:08', type: 'text', message: 'create mode 100644 package.json' },
  { id: '122', time: '13:49:08', type: 'text', message: 'create mode 100644 public/favicon.ico' },
  { id: '123', time: '13:49:08', type: 'text', message: 'create mode 100644 src/App.vue' },
  { id: '124', time: '13:49:08', type: 'text', message: 'create mode 100644 src/assets/base.css' },
  { id: '125', time: '13:49:08', type: 'text', message: 'create mode 100644 src/assets/logo.svg' },
  { id: '126', time: '13:49:08', type: 'text', message: 'create mode 100644 src/assets/main.css' },
  { id: '127', time: '13:49:08', type: 'text', message: 'create mode 100644 src/components/HelloWorld.vue' },
  { id: '128', time: '13:49:08', type: 'text', message: 'create mode 100644 src/components/TheWelcome.vue' },
  { id: '129', time: '13:49:08', type: 'text', message: 'create mode 100644 src/components/WelcomeItem.vue' },
  {
    id: '130',
    time: '13:49:08',
    type: 'text',
    message: 'create mode 100644 src/components/icons/IconCommunity.vue'
  },
  {
    id: '131',
    time: '13:49:08',
    type: 'text',
    message: 'create mode 100644 src/components/icons/IconDocumentation.vue'
  },
  {
    id: '132',
    time: '13:49:08',
    type: 'text',
    message: 'create mode 100644 src/components/icons/IconEcosystem.vue'
  },
  {
    id: '133',
    time: '13:49:08',
    type: 'text',
    message: 'create mode 100644 src/components/icons/IconSupport.vue'
  },
  { id: '134', time: '13:49:08', type: 'text', message: 'create mode 100644 src/components/icons/IconTooling.vue' },
  { id: '135', time: '13:49:08', type: 'text', message: 'create mode 100644 src/main.js' },
  { id: '136', time: '13:49:08', type: 'text', message: 'create mode 100644 src/router/index.js' },
  { id: '137', time: '13:49:08', type: 'text', message: 'create mode 100644 src/views/AboutView.vue' },
  { id: '138', time: '13:49:08', type: 'text', message: 'create mode 100644 src/views/HomeView.vue' },
  { id: '139', time: '13:49:08', type: 'text', message: 'create mode 100644 vite.config.js' },
  { id: '140', time: '13:49:09', type: 'text', message: "branch 'main' set up to track 'origin/main'." },
  {
    id: '141',
    time: '13:49:09',
    type: 'text',
    message: '[TASK] - #. Set Azion Personal Token in the repository.'
  },
  { id: '142', time: '13:49:10', type: 'text', message: '[TASK] - #. Update repository info.' },
  { id: '143', time: '13:49:10', type: 'text', message: '[TASK] - #. Delete local azion-samples repository!' },
  {
    id: '144',
    time: '13:49:10',
    type: 'success',
    message: '[TASK] - #. Deploy finalized successfully!'
  },
]
