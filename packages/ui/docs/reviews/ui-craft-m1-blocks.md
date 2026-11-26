# ui-craft review of the Milestone 1 blocks

M1.10 row 16, for `packages/webkit/blocks`: the mandatory `ui-craft` progression
(`.claude/skills/ui-craft/SKILL.md`) run on all 61 blocks, primary and variant SFCs, with each child
skill in `skills/<name>/SKILL.md` (usage, ux-heuristics, ui-states, form, create-surface, errors,
tables, lists, navigation, layout, microcopy, baseline-ui, theming-dark-mode, data-viz,
motion-polish, impeccable-polish). The verify phase is the browser suite (`copyable-sfcs`, `rtl`,
`reflow`) over every block story, plus the pattern gates (`check-patterns`, consumer lint, guideline
and summary checks).

Each block lists its **Findings**, what was **Fixed** in the block files, and what is **Not a
defect** and why. A finding that needs a component change, or a larger rework than the block's own
files, is not fixed here: it is an M1.10 row (30–38 in `ROADMAP.md`).

## Cross-block

- The console shell copied into the platform blocks now reads one way everywhere: `Build and
deployment`, `Account settings`, `Personal tokens`, `Home page`, `Activity history`,
  `Expand sidebar` / `Collapse sidebar`, `Switch to light theme` / `Switch to dark theme`
  (`webkit-microcopy`: sentence case, no `&`).
- Filter-field placeholders in `detail/record-table` and `edit/attribute-editor` read
  `Search fields` / `Search <field>` without a trailing `…`.
- Every `block.json` summary names only components its SFCs import (new `checkSummaryComponents`).

## Headers, shells, auth and account (13 blocks)

### headers/auth-header

- **Findings:** none.
- **Fixed:** nothing.
- **Not a defect:** the Documentation button is the only end action. A signed-out bar has nothing else to offer (`webkit-navigation`).

### headers/creation-header

- **Findings:** none.
- **Fixed:** nothing.
- **Not a defect:** the back `IconButton` has no `Tooltip`. Its `aria-label` names the destination, and the guidelines do not ask for a tooltip. The Terminal variant drops the back button and the crumb on purpose: the screens it covers are terminal.

### headers/docs-header

- **Findings:** none blocking.
- **Fixed:** nothing.
- **Not a defect:** `NavigationMenu.Positioner :side-offset="12"` is a numeric prop of the component, not a style value. `Docs` in the brand plate uses the overline token, so it is uppercase by design.

### headers/resource-header

- **Findings:** (1) FirstLevel showed no crumb, against `webkit-navigation` (one unlinked crumb on every first-level page). (2) SecondLevel crumbs read `Build › Applications`, not `module › resource name`. (3) The guidelines and summary promise that search widens into a ⌘K field from `--container-2xl` and that Create and Agent collapse below `md`; the SFC did neither. (4) The search had no `aria-keyshortcuts`. (5) The icon-only controls had no tooltips.
- **Fixed:** all five. Both files now: `@container` bar, `[{ label: 'Applications' }]` / `Applications › webkit-sample-vue` crumbs, `@2xl:` field-button with `Kbd`, collapsed Create and Agent `IconButton`s inside `Tooltip`s, and `aria-keyshortcuts="Meta+K"`. Guidelines (new blocks H `Kbd` and I `Tooltip`, the G Breadcrumb now required, FirstLevel state) and summary updated. Known gap removed.
- **Not a defect:** the brand is always visible in the standalone bar, because no rail carries it here.

### headers/site-header

- **Findings:** the guideline noted a casing mismatch with the website hero (the parent fixed it in row 20).
- **Fixed:** nothing more in the SFC.
- **Not a defect:** `Login` as a noun and title-case nav entries. This is the marketing surface, which `webkit-microcopy` excludes from its scope.

### shells/console

- **Findings:** (1) The ListPage had a `PageHeader` on a first-level list, and the header showed no crumb (`webkit-navigation`). (2) Create Resource was outlined and medium; for an untabbed list, the skill puts the primary action on the controls row as primary and large. (3) `Build & Deployment` had an ampersand. (4) Title-case nav and menu items: `Personal Tokens`, `Activity History`, `Account Settings`, `Home Page`. (5) The container breakpoint was the raw `@min-[47rem]`, while the guidelines say thresholds come from tokens.
- **Fixed:** all five. The `Resources` crumb is in the header from `md`. `PageHeader` is removed and its import with it. Documentation (outlined, medium) and Create Resource (primary, large) now sit on the controls row. Nav items read `Build and deployment`, `Personal tokens`, `Activity history`, `Account settings`, `Home page`. `@2xl:` replaces `@min-[47rem]:` in both files. Guidelines (O is now `Breadcrumb`, the ListPage state, Copy) and summary updated. Known gap removed.
- **Not a defect:** the stand-in table body (`Table` text in a flush Card). The block documents it as a stand-in for `platform/view/table-view`.

### shells/documentation

- **Findings:** the status label read `All Systems Operational` in title case.
- **Fixed:** changed to `All systems operational`.
- **Not a defect:** the footer columns keep marketing title case (outside the microcopy scope).

### shells/website

- **Findings:** `All Systems Operational` in title case (the parent already fixed `Start for free`).
- **Fixed:** changed to `All systems operational`, matching the documentation shell.
- **Not a defect:** the marketing headings and footer links keep their casing: this is the marketing surface.

### platform/auth

- **Findings:** (1) After a 401, focus did not return to the password (`webkit-errors`, row 19). (2) Title-case sign-up copy: `Sign Up for a Free Account`, `Work Email`, `Resend Email`. (3) No submit moved focus to the first field in error, though the guidelines promise it. (4) Silent submits: a valid Sign in on the Login card and a valid Sign up showed nothing (`Nothing silent`). (5) The notice transitions in five variants used `duration-150 ease-out` / `duration-100 ease-in`, which are not motion tokens.
- **Fixed:** all five. The password input gets an explicit `id` with `Field.Label for`, and `focusField` (nextTick) focuses it after a 401. Focus also moves to the first field in error on every step in auth.vue, session-expired, the five failure variants and sign-up. A `Signed in.` / `Account created. …` success `Alert` now shows in the card's notice slot. The casing is sentence case, and the transitions use `duration-moderate-01 ease-productive-entrance` / `duration-fast-02 ease-productive-exit`. Guidelines (Copy, the 401 line, States) updated. Both Known gaps removed.
- **Not a defect:** the variants head the card with `PageHeader` while the primary uses an `h1` and a paragraph. Both render an `h1` with a muted lead, and `checkGuidelines` checks the primary only.

### platform/account/change-plan-drawer

- **Findings:** (1) No failure path for the upgrade (Known gap). (2) No success feedback: the drawers closed silently. (3) Title case and parentheses in labels and copy: `Change Plan`, `Payment Method`, `Expiration Date (MM/YY)`, `Security Code (CVC/CVV)`, `Country/Region`, `State/Region`, `Postal Code`, `Next Charge Value`, `Yearly Discount`, `Learn more about Pricing`, `Compare Plans`, `All Features Included.`, and feature titles such as `100 Resources`. (4) Optionality written as a `placeholder="Optional"`. (5) The card form never validated, and focus was not managed on Change, Cancel or Update. (6) `Ended with 8888`.
- **Fixed:** all six. A `Toaster` is mounted. A new card ending 0002 is declined: a danger `Alert` at the top of the Payment method card, the number field invalid and focused. A card ending 0119 fails the payment service: `toast.error` with Retry, and the drawer stays open. Success shows `toast.success('The account was upgraded to Pro.')`. The card fields validate on submit (required vs invalid) and the format moved into `Field.Description`. Labels are sentence case without parentheses. `Address line 2` carries `Optional. …` in its description. Focus moves into the form on Change and back to Change on Cancel or Update. The row reads `Ending in 8888`. Guidelines (blocks S and V `Toaster`, Copy, Accessibility, States) and summary updated. Both Known gaps removed.
- **Not a defect:** `Capacity Reservation` and `Savings Plan` stay capitalized. They name commercial products.

### platform/account/payment-method-card

- **Findings:** (1) Title case and parentheses in labels (Known gap). (2) The guidelines promise validation on Update, focus moves and a decline `Alert`; the SFC had none of them. (3) `Ended with`.
- **Fixed:** all three, in all three files (Default, Editing, Disabled). The form is now a real `<form novalidate>` with per-field required/invalid states, linked labels and focus on the first error. A number ending 0002 declines, with a danger `Alert` and the field invalid. Focus moves to the first field on Change and back to Change on Cancel or Update. Guidelines and summary updated. Known gap removed.
- **Not a defect:** the inline Visa SVG. Webkit ships no card-brand asset, and the summary documents this.

### platform/account/profile

- **Findings:** (1) No save failure path. (2) `Remove personal account` beside `Delete account`. (3) `Github`/`Gitlab`. (4) Title-case rows `Account Name`, `Company Name`, `Postal Code`, `Login Settings`, `Danger Zone`, `State/Region`. (5) `Apartment, floor, etc.` as a label. (6) A duplicate `rubik` option labelled `Rubik (Default)`, which duplicated the key and used parentheses. (7) A garbled GitHub description. (8) No client validation of Account name or Billing emails, and Save was silent on success.
- **Fixed:** all eight. A `Toaster` is mounted. An unscoped save failure (Account name `Offline`) shows `toast.error("The profile wasn't saved.")` with Retry and keeps the changes; a successful save shows `Profile saved.` Account name and Billing emails validate on submit with `HelperText` and focus. The danger row reads `Delete personal account` with `Delete account`. The other strings are fixed. Guidelines (blocks M `HelperText` and N `Toaster`, Copy, States) and summary updated. Known gap removed.
- **Not a defect:** Delete account does not open a dialog in this block. Its confirmation is `platform/delete/delete-with-confirmation`, which the guidelines link to.

### platform/account/onboarding-form

- **Findings:** (1) The Plan step's upgrade drawer repeated change-plan-drawer's title-case labels with parentheses and `Ended with`. (2) Create Organization on step 3 had no loading state, no success and no failure, though the guidelines say a failure lands in an `Alert` in the card.
- **Fixed:** (1) The same label, charge-row and feature-title fixes as change-plan-drawer, with the formats moved into `Field.Description`. (2) Create Organization now locks the step (`:loading`, disabled fieldset and Back). It answers in one card `Alert`: `Organization created.`, or a danger notice with Retry when the request fails (offline). States updated.
- **Not a defect:** on the Plan step, Upgrade only selects the plan; nothing is charged at that step, so it has no payment failure path of its own. Back has no handler: each step is its own story.

## Create (11 blocks)

### platform/create/create-hub

- **Findings:** em dashes in four template descriptions (primary and both variants); "Choose a Git provider…" and "or choose a file" use the banned verb; title case in "Start from Template" (heading and results `aria-label`), "All Frameworks", "Starter Templates", "Add GitHub Account"; search placeholder "Search project or enter a Git Repository URL" (singular collection, title-case "Repository"); the Hugo template description says "Publish" where the product verb is Deploy; the inline "file" and "folder" actions in the heading description are native `button`s with the `text-link` class.
- **Fixed:** every string above in `create-hub.vue`, `variants/connected.vue`, `variants/loading-repositories.vue` ("Start from template", "All frameworks", "Starter templates", "Add GitHub account", "Search projects or enter a Git repository URL", "Select a Git provider…", "or select a file", dashes replaced by a colon or a comma, "Deploy a Hugo site…"); the Copy section's search example now matches the SFC.
- **Not a defect:** template names ("Astro Starter", "Landing Page", "AI Inference") are product data, not interface copy; "Creation Center" is the destination's name and matches the breadcrumb of every page that returns to it; the inline file and folder actions keep the browser focus outline and no webkit component renders an inline text action (`Link` is an anchor), so the native `button` is the right element.

### platform/create/create-in-drawer

- **Findings:** the ItemRows and NestedDrawer footers carried an outlined Cancel next to the commit, against the drawer commit model (`skills/webkit-create-surface` §4) and this block's own Don't list; commit labels differed from the drawer titles (NestedDrawer "Save" under Add Instance and under Create Service, ItemRows "Create", AddRecord "Save" under Add Record), against the one-string rule; drawer titles and legends read "Create service" while the trigger reads "Create Service"; required messages "Name is required." and "Runtime is required." against the Copy section's "This field is required."; em dashes in four descriptions (Instances `PageHeader`, Add Instance, Create Service and ItemRows Create Service drawers); "pick" twice; "Build & Deployment" (ampersand) in the shell nav; title case in "Bring my own Domain", the account menu ("Account Settings", "Activity History", "Personal Tokens") and the DNS record type options; "TTL (seconds)" and "Platform (free)" put parentheses in a label; the Weight helper text used an en dash range "(0–255)".
- **Fixed:** removed the three Cancel buttons and their handlers; commit labels now repeat the title ("Add Instance", "Create Service", "Add Record"); titles and legends read "Create Service"; required messages unified; descriptions split into two sentences ("…Select an existing service or create one inline."); "Build and Deployment"; "Bring my own domain"; account menu and record-type options in sentence case; "TTL in seconds"; "Free platform certificate"; "Relative weight for this record within the weighted set, from 0 to 255."; the AddRecord States line updated.
- **Not a defect:** "Add Domain", "Add Environment", "Add Record", "Edit Domain", "Save Domain" keep entity capitalization after the verb, as section 5 of the microcopy skill asks; "Europe (Frankfurt)" and the other region options are data values, not labels.
- **Not fixed (new row):** ItemRows opens a Create Service drawer from a Services list page. A service is a first-level resource (it creates on a page in `provision-wizard`), so the variant breaks the surface rule; it needs an in-resource object or a move to `single-page-create`.

### platform/create/deploy-drawer

- **Findings:** "Change Version" (12 occurrences across the four files) and the "Projects Impacted" section title in title case, while the guidelines' Copy section already reads "Change version"; the version and dependency lists inside the Change version popovers are native `button`s that re-type a row's hover, focus ring and padding.
- **Fixed:** "Change version" and "Projects impacted" in all four SFCs and the guidelines.
- **Not a defect:** "Build and Deployment" is the title the guidelines sanction while a build runs; the `aria-label` "Projects impacted in Production (3)" carries a count, not an aside in a visible label; one Deploy alone in the footer with no Cancel matches the drawer commit model.
- **Not fixed (new row):** the popover version rows should become `Item` `as-child` rows like `resource-picker`; the rewrite touches nested version, author and tag markup in four files, so it is listed for a follow-up.

### platform/create/deployment-flow

- **Findings:** "Clone Template" step title; "Routing Rules" step title and "Failed on Routing Rules" tag in title case, while the Copy section asks for "Routing rules"; "Never ran — the deployment stopped at Routing Rules." splices with an em dash.
- **Fixed:** "Clone template", "Routing rules", "Failed on routing rules", "Never ran. The deployment stopped at routing rules." in the three variants.
- **Not a defect:** the `[TASK]` lines with exclamation marks, parentheses and title case are captured CLI output rendered in a `LogView`-style panel; they are data, and rewriting them would misrepresent the tool's real output.

### platform/create/deploy-success

- **Findings:** the lead read "You deployed a new resource. into" before the source `Tag`, a dangling fragment after a period; CliCreated says "Pick one and follow the steps".
- **Fixed:** the lead is now "You deployed a new resource. Source:" followed by the source `Tag` (a full sentence, then a colon introducing the value); "Select one and follow the steps"; the Copy section describes the new lead.
- **Not a defect:** "Created just now" uses "just" as a time adverb, not as the minimizing word the skill bans; "GitHub Actions" is a product name.

### platform/create/deploy-template

- **Findings:** the privacy `Switch` `aria-label` spliced two clauses with an em dash and changed with the state ("Repository is public — toggle to make it private"); its `Tooltip` put an aside in parentheses; the repository name in the Form variant was a hand-rolled native `input` inside `InputGroupRoot`, re-typing `InputGroupInput`'s classes; title case in "Start from a Template" (breadcrumb), "Browse Templates", "Template Settings", "Access Token", "Store Access Token", "Store Domain", "Public Repository Name"; "Github" misspelled in the splash line.
- **Fixed:** the switch is labelled "Public repository" (the switch itself announces on or off) and the tooltip reads "Repository visibility"; the native input is now `InputGroupInput` with `required`; all labels in sentence case; "Cloning from GitHub"; the summary names `InputGroupInput`; the Accessibility line describes the new switch label.
- **Not a defect:** "Back to Creation Center" names the destination page; the account `button` around the `Avatar` is the shell recipe every console header uses.

### platform/create/multipage-create

- **Findings:** "Choose a policy to continue"; "… more — type to narrow."; the module `Alert` and the paragraph under it used em dashes, and the paragraph used "simply"; the last submit read "Create access list" while the title and breadcrumb read "Create Access List"; the search placeholder ended in "…" ("Find policy…") with a different `aria-label`; the chooser rows were native `button`s re-typing a list row's padding, hover and focus ring.
- **Fixed:** "Select a policy to continue"; "{n} more. Type to narrow the list."; "…has IP filtering off, so nothing reads this one until the module is on."; "Leaving it off still creates the access list. It is not read until someone turns IP filtering on."; "Create Access List" on the last submit; placeholder and `aria-label` "Search policies"; the rows are small `Item`s rendered `as-child` on the native `button` (the `resource-picker` recipe), keeping `aria-pressed` and the selected surface; guidelines updated (block D names `Item`, Copy example "Search policies").
- **Not a defect:** the wizard footer (Back, Next, Create Access List) is markup rather than `SaveBar`, because `SaveBar` has no leading slot for Back (see the new row).

### platform/create/provision-wizard

- **Findings:** em dash in the Deployment card lead (three files); certificate options "Let’s Encrypt (issued and renewed automatically)" and "Shared (SAN)" put asides in parentheses.
- **Fixed:** "…cut against: what it binds, and how versions are promoted into it."; options "Let’s Encrypt" and "Shared SAN".
- **Not a defect:** "Cache Settings" and "Live Ingest" are Azion product module names; the project and deployment chooser rows already use `Item` `as-child`; the step footer is markup for the same `SaveBar` reason as multipage-create.

### platform/create/resource-picker

- **Findings:** none. Copy, the Existing or New toggle, search with Load more, the required message and the `Item` `as-child` rows match `webkit-form`, `webkit-errors` and `webkit-microcopy`.
- **Fixed:** nothing.
- **Not a defect:** the rows are native `button`s inside `Item` `as-child`, which is the component's documented way to make a row interactive.

### platform/create/single-page-create

- **Findings:** title case in labels, legends and section titles ("Delivery Settings", "Protocol Usage", "Origin Type", "Protocol Policy", "Cache Expiration Policies", "Browser Cache Settings", "Debug Rules", "Purge Type", "Cache Key", "Domain Name", "Private Repository Name", "Deploy Key"); ampersands in "Build &amp; Runtime" and "Notifications &amp; Alerts"; parentheses in labels and placeholders ("Maximum TTL (seconds)", "80 (Default)", "443 (Default)", "…(optional)."); "Choose" in four descriptions and purge messages; breadcrumb "In Page create"; the CreatePurge variant hand-rolled its commit footer while CreateService and RequiredFields use `SaveBar kind="plain"`.
- **Fixed:** every label in sentence case; "Build and runtime", "Notifications and alerts"; "Maximum TTL" with "In seconds." moved into the row description; port options "80, default" and "443, default", the port placeholder "443", the notes placeholder without "(optional)"; "Select" in place of "Choose"; "In-page create"; CreatePurge commits through `SaveBar kind="plain"`.
- **Not a defect:** "Tiered Cache", "Node.js 20 (LTS)" and the region names are product names and data values; the hidden file `input` behind Import is the only way to open the file picker; "Create Domain", "Create Purge" keep entity case.
- **Not fixed (new row):** the primary's commit bar is hand-rolled because it carries Import and a hint on the leading side, which `SaveBar` cannot hold.

### platform/create/source-wizard

- **Findings:** "Choose a service to continue"; "… more — type to narrow."; "Find service…" placeholder with a different `aria-label`; the service rows and the Create Service row were native `button`s re-typing row styles.
- **Fixed:** "Select a service to continue"; "{n} more. Type to narrow the list."; placeholder and `aria-label` "Search services"; both row kinds are now small `Item`s `as-child`; guidelines updated (block D names `Item`, Copy examples).
- **Not a defect:** the method rows already use `Item` `as-child`; the footer is markup for the `SaveBar` reason above.

## Dashboards (13 blocks)

Shared finding (every dashboard except home): no error state. `webkit-data-viz` and `webkit-ui-states` ask each chart to render a failed fetch in its own box (`Alert severity="danger"` with Retry); the blocks ship Default, Loading and Empty only. Not fixed here: proposed as a new M1.10 row (a Failed variant per dashboard).

### platform/dashboard/activity-outcomes-dashboard

- **Findings:** chart empty titles read `No request in this time range` (grammar, and the table says `No requests`); no error state.
- **Fixed:** `No requests in this time range` on the three charts in all three files and the guidelines.
- **Not a defect:** the requests table is `TableRoot` with `:data`/`:columns`, the data-driven API `webkit-tables` asks for; per-tile `inverse` matches which rises are bad.

### platform/dashboard/alerts-dashboard

- **Findings:** `Choose a longer period` (two strings, `webkit-microcopy` verb table); `No entity has risk yet` reads awkwardly; no error state.
- **Fixed:** `Select a longer period`; `No entities at risk yet` (SFCs and guidelines).
- **Not a defect:** every rising alert count is `inverse`.

### platform/dashboard/analytics-dashboard

- **Findings:** the page has no heading and no page container (`layout-boundary`/`layout-column`), unlike eight sibling dashboards, though its guidelines call it the reference grammar; two repeated `EmptyState`s under `v-if`/`v-else` without keys (`vue/v-if-else-key`); no error state.
- **Fixed:** `PageHeader` (`Analytics` + one-sentence description) inside `layout-boundary` > `layout-column` main with `--layout-group-gap`, story layout `fullscreen`; keys on the repeated `EmptyState`s; guidelines building block A + Copy, summary.
- **Not a defect:** the Hint `Switch to Bar to stack the classes.` names the toggle's own label, not a position.

### platform/dashboard/composition-dashboard

- **Findings:** unsorted imports (lint); no error state.
- **Fixed:** imports sorted.
- **Not a defect:** the semicolon in the stacked-area Hint joins two clauses, not two sentences; `Total spend` is `inverse`.

### platform/dashboard/configurable-dashboard

- **Findings:** no page heading or page container, like analytics; no error state.
- **Fixed:** `PageHeader` (`Traffic overview`) in the standard container, story `fullscreen`, guidelines A + Copy, summary.
- **Not a defect:** `Drag a card by its handle…` is valid on touch and the same sentence gives the keyboard path; the live region announces moves.

### platform/dashboard/data-dashboard

- **Findings:** no page heading or page container; no error state.
- **Fixed:** `PageHeader` (`Data usage`) in the standard container, story `fullscreen`, guidelines A + Copy, summary.
- **Not a defect:** the `+`/`-` change Tag is data formatting.

### platform/dashboard/executive-summary-dashboard

- **Findings:** `Choose a later quarter`; no error state.
- **Fixed:** `Select a later quarter`.
- **Not a defect:** `−25.0%` uses the true minus sign, which is correct typography for a figure.

### platform/dashboard/funnel-cohort-dashboard

- **Findings:** `Choose another segment or widen the period.` (three places); no error state.
- **Fixed:** `Select another segment or widen the period.`
- **Not a defect:** `—` for a null cohort cell is the empty-value glyph, not a dash splicing two sentences.

### platform/dashboard/health-score-dashboard

- **Findings:** `Choose a longer period` (two strings); the null overall score renders an en dash `–` while every other dashboard uses `—`; no error state.
- **Fixed:** `Select a longer period`; null score glyph `—`.
- **Not a defect:** the per-hour `aria-label`s (`00:00 · 62 · Fair`) are data, not copy.

### platform/dashboard/home-dashboard

- **Findings:** known gap: tile labels `Data Transferred`, `Requests / Second`, `Bandwidth Saving`, `Data Offload` and account and nav items `Account Settings`, `Personal Tokens`, `Activity History`, `Home Page` in title case; `Build & Deployment` uses an ampersand; `Expand Sidebar`/`Collapse Sidebar` in title case; the header's search trigger is a hand-styled `<button>` that looks like an input.
- **Fixed:** `Data transferred`, `Requests per second`, `Bandwidth saving`, `Data offload`, `Account settings`, `Personal tokens`, `Activity history`, `Home page`, `Build and Deployment`, `Expand sidebar`/`Collapse sidebar` (primary, Empty variant, guidelines); Known gap line removed, Copy updated.
- **Not a defect:** the greeting is the documented muted heading, not a `PageHeader`; `Create Resource`/`Create Project` follow the create-button entity casing. The search trigger is shell markup the console shell owns (see `shells/console`); left to that block's owner.

### platform/dashboard/project-status-dashboard

- **Findings:** known gaps: a hand-written `h1` and paragraph instead of `PageHeader`; sprint ranges with an en dash (`Oct 13 – Oct 24`); main gap `--spacing-lg` where the siblings use `--layout-group-gap`; no error state.
- **Fixed:** `PageHeader` with the Project and Sprint selects in its actions; `Sprint 5 · Oct 13 to Oct 24`; `--layout-group-gap`; guidelines building block A added, both Known gap lines removed; summary names `PageHeader`.
- **Not a defect:** the owners table stays `TableRoot` with `:data`/`:columns` (data-driven), so it does not need to become `Table`.

### platform/dashboard/scan-results-dashboard

- **Findings:** `No item yet` (number); no error state.
- **Fixed:** `No items yet` (SFCs and guidelines).
- **Not a defect:** `—` as the empty category and score glyph.

### platform/dashboard/security-dashboard

- **Findings:** no page heading or page container; three chart and breakdown empty titles read `No data available` (the bare "No data" `webkit-microcopy` §6 rejects); the Loading variant declares an unused `attention` array (lint); no error state.
- **Fixed:** `PageHeader` (`Security`) in the standard container, story `fullscreen`; `No matched requests in this period` and `No blocked requests in this period`; unused array removed; guidelines A, Copy and empty-region text, summary.
- **Not a defect:** `-0.03%` in a delta Tag is data formatting.

### platform/dashboard/service-monitoring-dashboard

- **Findings:** known gap: the alert rail scrolls on its own with no `tabindex` and no name; no error state.
- **Fixed:** the rail scroller is `role="region"` `aria-labelledby="open-alerts-title"` `tabindex="0"` with a token focus ring; the Known gap line became an Accessibility statement.
- **Not a defect:** no `PageHeader`: a full-height split surface kept open on call, whose height goes to tiles, charts and the rail; latency figures get `tabular-nums` from `StatTile`.

## Detail and delete (8 blocks)

### platform/detail/attached-resources

**Findings**

- Certificate tag value `Managed (free)` puts a parenthetical in a tag (webkit-microcopy 1, 3).
- Guidelines said "edit, remove or add" and "edited or removed" while the row menu says Delete (one word per concept).
- Hand-composed `TableRoot` rows instead of a data-driven `Table :data :columns`, so the table never stacks in a narrow settings column; three chips per row against "only one chip per row" (webkit-tables).

**Fixed**

- Tag value is `Managed`; guidelines Copy example updated.
- Guidelines say delete everywhere.

**Not a defect**

- Leaving the Environment and Policy cells empty for an environment-less domain is the guideline's rule, and an empty cell is not copy.
- The composed table and the per-row tags are left as they are. Every block in the package composes `TableRoot`, so moving to the data-driven `Table` is a change across all blocks. It is proposed as a new row, not done in this block alone.

### platform/detail/deployment-logs

**Findings**

- Skipped-step sentence `Never ran — the deployment stopped at Routing Rules.` splices with an em dash.
- Step titles in title case (`Access Token`, `Clone Template`); card heading `Deployment Logs` in title case.
- Step status was only in `aria-hidden` glyphs and colour. Done, running and pending steps had no status in words, though the guidelines claimed they did (webkit-ui-states, accessibility).
- The Running Logs row (`3/8 steps`, `Build`) changed without being announced.

**Fixed**

- `Never ran. The deployment stopped at Routing Rules.`. Also `Access token`, `Clone template`, `Deployment logs`.
- Every step trigger (primary and the 4 variants, plus the two details-page deployment variants that reuse it) now carries screen-reader text from `stepStatusLabels` (Done, Failed, Skipped, Running, Not started).
- The Running Logs row is a `role="status"` region.
- Guidelines Copy (step titles, skipped step) and Accessibility updated.

**Not a defect**

- `!` and `...` inside log `message` lines are CLI output shown as data, not interface copy.
- `Failed on Routing Rules` is a fragment status tag that the guidelines define. It names the failed step, which a bare `Failed` would lose.
- `Routing Rules` is kept as a product module name.

### platform/detail/details-page

**Findings**

- Em dashes in UI strings: the deployment-detail success Alert (`… — published to web-app (production) …`, which also has a parenthetical), the deployment-failed Alert, three skipped-step descriptions, a skipped-step empty line and a log line.
- `Build & Deployment` (ampersand) in tab and tooltip strings across 10 files.
- Title case in shell and page strings: `Account Settings`, `Personal Tokens`, `Home Page`, `Activity History`, `Switch to Light/Dark Theme`, `Expand/Collapse Sidebar`, `Deployment Details`, `Triggered By`, `Last Modified`, `Manage Domains`, `Connect Git Repository`, `Cache Purge`, `Deployment Logs`, `Static assets uploaded to Storage`.
- `New Version` (banned verb) on the Versions tab.
- `Choose a Git provider, then pick the repository…` (Choose/Pick).

**Fixed**

- All of the above, in every variant:
  - The success Alert is now `Published to the production environment of web-app in 1m 1s. Live at https://web-app-mh2saq.example.com.`
  - `Build and Deployment` replaces `Build & Deployment`.
  - Sentence case everywhere, except entity names in create and add actions (`Create Resource`, `Add Domain`, `Add Environment`).
  - `Add Version` replaces `New Version`, per the in-resource Add rule.
  - `Select a Git provider, then select the repository…`.
- block.json and guidelines updated to the new strings.

**Not a defect**

- The `—` empty-value glyph in the service-overview topology (`node.name || '—'`) is a placeholder glyph, not copy. `KeyValuePairs` and the workload overview widget in `src/components` render the same glyph.
- `(409 Conflict)` in a failure message puts the code at the end, as webkit-microcopy 6 allows. The parentheses ban covers labels.
- The raw `<button>` search trigger and avatar button are the console-shell recipe shared with `shells/console`.
- Inline `<a>` in running text: webkit `Link` is a button-height control, not an inline text link.

### platform/detail/get-started

**Findings**

- `Pick one and follow the steps` (Pick).
- `Account Settings` in a step description.

**Fixed**

- `Select one and follow the steps`, also in the guidelines Copy example.
- `Account settings`, in the primary, the Ci variant and the copy in details-page.

**Not a defect**

- Inline docs `<a>` in the description: no inline-text link component ships.
- The three-step cards and the CodeBlock tabs follow the guidelines.

### platform/detail/production-checklist

**Findings**

- The DrawerDetail done state put a full sentence (`Serving shop.example.com.`) inside a `Tag`. A tag is 1 to 2 words, never a sentence.
- Drawer description `The create put this service live on a generated hostname. These are the gates between that and production.` uses internal jargon ("the create", "gates").
- In DrawerDetail the card rows were buttons that did nothing (no handler).

**Fixed**

- The done state is a `Done` tag plus a muted sentence for the note.
- The description reads `This service is live on a generated hostname. These steps take it to production.`
- Card rows in DrawerDetail open the drawer.
- Guidelines (Do, Copy, D, States) updated.

**Not a defect**

- In the primary and Complete variants the rows stay inert buttons, because those stories render no drawer. The DrawerDetail story shows the wiring.
- The expand `IconButton` has an `aria-label`, which webkit-baseline-ui requires. A tooltip is not required.

### platform/detail/record-table

**Findings**

- Title case: `Main Settings` tab, `Domain Name` and `Digest Type` labels, `Key Tag and Digest values` in a description.
- `Pick a range` placeholder (Pick).

**Fixed**

- `Main settings`, `Domain name`, `Digest type`, `key tag and digest values` and `Select a range`, in the primary and the Records variant. block.json and guidelines updated.

**Not a defect**

- The `—` fallback glyph in Weight and Description cells is the empty-value glyph the summary documents and components use.
- The save bar's `Discard`: webkit-create-surface asks for Discard on a settings save bar while webkit-microcopy bans it for Cancel. That is a conflict between the skills, proposed as a row. The block keeps the edit-resource wording.
- Composed `TableRoot` (see attached-resources).

### platform/detail/version-detail

**Findings**

- Title case: `Save and Deploy`, `Save and Build`, `Read Only`, `Viewing a Deployed version`, `Create new Version`, `New Version`, plus the shell strings.
- The guidelines still said "Read Only", "New Version" and "Save and Deploy".

**Fixed**

- `Save and deploy`, `Save and build`, `Read-only`, `Viewing a deployed version` and `Add Version`, in the picker footer and the Deployed bar. The shell strings are sentence case. Guidelines and block.json are aligned.

**Not a defect**

- Application module names keep their capitalization as entities: `Cache Settings`, `Device Detection`, `Image Optimization`, `Load Balancing`, `Protocol Optimization`, `WebSocket Proxy`, `Custom Code`, `Routing Rules`.
- The Save and deploy run and its failure are not drawn here. The guidelines delegate them to `platform/states/async-submit`.

### platform/delete/delete-with-confirmation

**Findings**

- The prompt `To confirm, type … in the box below:` names a layout position (webkit-microcopy 1, 8). The LabelledField `Field` label ended in a colon and named the position too.
- The confirm button read `Delete` while the title read `Delete Resource` and the trigger `Delete resource`: one act under three labels. Also webkit-microcopy 5: the confirm button repeats the verb and names the object.
- The Help Center link used a non-token class `text-link`, so it had no link colour or focus ring.

**Fixed**

- The prompt is `Type [resource-01] to confirm.` and the Field label `Type resource-01 to confirm`.
- Title, trigger and confirm button all read `Delete resource`, in both files.
- The link uses the token link recipe (`text-(--text-link)`, hover, focus ring).
- Guidelines A, C, E, Do, Copy and States updated. The `ConfirmDialog` shape is unchanged, so card-view can still copy it.

**Not a defect**

- The click-to-copy name chip is a raw `<button>`. No shipped component renders a copyable inline name inside a sentence (`CopyButton` is icon-only). It has an `aria-label`, focus ring and reduced-motion.
- `navigator.clipboard.writeText` has no failure path. The input still accepts typing and paste, so a failed copy blocks nothing.

## Edit and settings (5 blocks)

### platform/edit/attribute-editor

**Findings**

- webkit-lists: the heading's Create Variable was outlined and medium (the skill asks for primary and large, the page's only large control), in the list and in the Create variant's trigger.
- webkit-form: a failed Save flagged the fields but left focus on Save; focus did not move to the first field in error.
- webkit-microcopy: the Last Modified column and filter field were title case.
- Guidelines purpose used "choose" (the verb table says "Select").
- The row menu's Edit, Clone and Delete do nothing, and Delete is not wired to `platform/delete/delete-with-confirmation`.
- webkit-lists: the list runs on hand-held `ref`s with a `TableRoot` and a filter `Popover` rather than `useCollection`, one `PropertyFilter` and the data-driven `Table`; there are no first-use and no-match empty states.

**Fixed**

- Create Variable is `kind="primary" size="large"` in the primary and the Create variant; guidelines A says so.
- Save moves focus to the first invalid or required input after it flags errors (`formEl` + `:is(input, textarea, button)[aria-invalid="true"], …[aria-required="true"]`); guidelines Do says so.
- `Last modified` in the column header, column picker and guidelines.
- Guidelines purpose: "select where they apply". The guidelines make no empty-state or `Hint` claim, so they match the trimmed block.json summary.

**Not a defect**

- The raw `<input>` elements inside `InputGroupRoot` and the hidden file `<input>`: the input group composes its own control, and the file input is `sr-only` and triggered by the Upload `Button`.
- The filter rows are plain `<button>`s inside the Popover: they pass the consumer lint baseline, and the Popover owns them.
- "Variables JSON": the entity name plus an acronym, which is correct sentence case.
- Inert row actions, and the list built off `useCollection`/`PropertyFilter`/`Table`: these need a list-recipe rewrite that matches `platform/view/table-view`. Proposed as a new row.

### platform/edit/code-editor

**Findings**

- webkit-microcopy: the default-format hint spliced two sentences with an em dash ("Only these are rewritten — anything else passes through untouched.") in the primary, Arguments and Settings.
- webkit-form: Save switched to the tab that holds the error but did not move focus to the field.

**Fixed**

- "Only these are rewritten. Anything else passes through untouched." in all three files.
- Save focuses Name (`id="service-name"`) on the Settings tab, or the Source code document (`id="service-source-code"`) on the Code tab, in all four files; guidelines Save bar paragraph says so.

**Not a defect**

- `Discard` on the save bar: `skills/webkit-create-surface` asks for Discard on a settings bar that mounts on the first edit. This conflicts with the microcopy verb table (`Cancel`, not `Discard`), so it goes in the skill-conflict row below.
- The shell's hand-rolled search and avatar `<button>`s: these are the shared console shell, reviewed under `shells/console`.
- Error copy "Letters, digits and underscore, not starting with a digit.": it states the constraint as the fix.

### platform/edit/edit-resource

**Findings**

- webkit-microcopy: title case in DeployableSettings (Protocol Settings, Mutual Authentication, Mutual Authentication mode, Trusted CA Certificate, Certificate Revocation List, HTTP/HTTPS/HTTP/3 Ports, Advanced Settings, Danger Zone, Delete Resource, "Select a Deployment Setting"), and "Debug Rules" in PolicySettings, Saving and UnsavedChanges.
- webkit-form / webkit-errors: Name could be saved empty in ProjectSettings, PolicySettings, Saving, UnsavedChanges and DeployableSettings. The guidelines say "Check every field when Save is pressed"; only ResourceSettings did.
- The DeployableSettings Danger zone `Delete resource` button did nothing. The guidelines say it opens `platform/delete/delete-with-confirmation`.

**Fixed**

- Sentence case for all of these in the SFCs, block.json and guidelines ("Delete resource", "Danger zone", "Advanced settings", "Mutual authentication", "Trusted CA certificate", "HTTP ports", "Select a deployment setting", "Debug rules").
- An empty Name flags `required` with a `HelperText` ("This field is required."), linked by `aria-describedby`, and takes focus on Save; the flag clears on edit. This is in five files, and guidelines D names `HelperText`.
- Delete resource opens a type-to-confirm `ConfirmDialog` (warning `Alert`, consequence sentence, "Type resource-01 to confirm.", Cancel + disabled-until-matched Delete resource). The DeployableSettings States line says so.

**Not a defect**

- `Discard` on the save bar: owned by `skills/webkit-create-surface` (see the skill-conflict row).
- "Deployment Settings", "Access Lists", "Image Optimization", "Load Balancing", "Device Detection", "Custom Code", "WebSocket Proxy": Console entity and module names (microcopy section 2, exception 2).
- `TLS v1.3 (Default)` and the other TLS and cipher option labels: they are option values that mirror the platform's TLS policy names, not field labels.
- No save-failure path: unscoped save failures are owned by `platform/states/form-validation` and `platform/states/async-submit`.

### platform/edit/rule-builder

**Findings**

- webkit-microcopy: "No variable matches — type the one you need." (em dash); the phase options were "Request Phase" and "Response Phase".
- webkit-form: a failed Save left focus on Save.

**Fixed**

- "No variable matches. Type the one you need."; "Request phase" and "Response phase", in the primary and Composed.
- Save moves focus to the first invalid or required input (`formEl` ref) in both files; guidelines Do says so.

**Not a defect**

- Behavior names ("Set Cache Policy", "Redirect To (301 Moved Permanently)", "Filter Request Header", "Bypass Cache", …): the Rules Engine's named behaviors, product vocabulary the reader matches against docs and the API.
- `Add Rule` and `Edit Rule`: the create-inside-a-resource label keeps entity capitalization (microcopy section 5), and the drawer title repeats the trigger.
- No Cancel beside Save: the guidelines' Don't rule; `DrawerClose` and the overlay close the drawer.

### platform/settings/settings-form

**Findings**

- SaveAll and Saving: Cancel had no handler, so it did nothing.
- webkit-form: SaveAll did not move focus to the first field in error. SavePerGroup and SavingOneGroup saved an empty Full name with no validation at all.
- webkit-microcopy and webkit-navigation: the page copy was demo prose an agent would copy verbatim. Breadcrumbs read "Forms › ItemGroup settings", "Forms › Card with independent saves" and "Forms › ItemGroup with independent saves", not the page title, and descriptions explained the layout ("Topic sections of Item rows…", "The same partitioned-save idea as Card, on the ItemGroup surface…"). `activeId` pointed at a nav item that does not exist.
- webkit-microcopy: "Full Name"; "Project Settings"; the options "Default (controlled at the team level)", "Standard Protection", "Only Preview Deployments" and "All Deployments"; the labels "Pre-Production Deployments", "Production Deployments" and "Shareable Links"; "Deployments" and "Deployment" capitalized mid-sentence in the Deployment Protection alert.

**Fixed**

- Cancel restores the last saved values and clears the errors. A successful save becomes the new saved snapshot.
- Save focuses the first field in error (`id="full-name"` / `id="email"`). The per-group General save validates Full name (required `HelperText`, `aria-describedby`, focus) in SavePerGroup and SavingOneGroup.
- Breadcrumbs: "Account settings › Profile", "Projects › Project settings" (nav Projects active) and "Account settings › Preferences". Descriptions are one plain sentence: "Define and manage personal account preferences.", "Configure how the deployments of this project are previewed and protected." and "Define the language and notifications of your account."
- Sentence case: "Full name", "Project settings", "Team default", "Standard protection", "Only preview deployments", "All deployments", "Pre-production deployments", "Production deployments", "Shareable links"; "your deployments… a deployment loads".
- Guidelines: Cancel behavior (E), focus on the first error (Do), Breadcrumb and Choices lines (Copy).

**Not a defect**

- "Preview Toolbar" and "Deployment Protection": named features (card titles and docs link topic), like a module name.
- `Cancel` in the SaveAll footer: this footer is persistent, not a bar that mounts on the first edit, so the microcopy `Cancel` rule applies.
- Timezone options "(UTC-03:00) São Paulo": data in the standard zone format, not a label.

### Cross-block (all five)

- The platform shell copied into every console block (47 files across all lanes) carries "Build & Deployment" (ampersand ban), "Account Settings", "Personal Tokens", "Home Page" and "Activity History" (title case), and the tooltips "Expand Sidebar" and "Collapse Sidebar". I left these as they are in my blocks so the shell stays identical across blocks. Proposed as one sweep row.

## States and views (10 blocks)

### platform/states/async-submit

- **Findings**
  - ui-states / errors: no `Toaster` was mounted, so the progress, failure and success toasts the pattern relies on were never shown (Known gap).
  - errors: the Failed `Alert` offered Redeploy and View deployments; the async-action pattern is Edit and Redeploy, on the toast and the page `Alert`. The Succeeded `Alert` carried only Open service.
  - microcopy: em dashes in the simulation heading, the simulation lead and the failure detail; "Pick one" (banned verb); "Never ran — …" in the skipped step; `...` in a log line; title-case step names (Access Token, Clone Template, Routing Rules) and the Failed on Routing Rules tag; title-case shell menu items (Account Settings, Personal Tokens, Home Page).
  - ui-states: `ToastOptions` takes one `action`, so a toast cannot carry Edit and Redeploy through `toast.*` alone.
- **Fixed**
  - Mounted one `Toast` region (`position="bottom-right"`) in all four frames; its default slot renders `Toast.Item` with two `Toast.Action`s (Edit, Redeploy) and `Toast.Close` on outcome toasts. Running raises the progress toast `Deploying web-app…`; Failed raises the permanent, closable `web-app wasn't deployed.` with Edit and Redeploy; Succeeded raises the closable `web-app is live.` with Edit and Redeploy. One toast id per run, dismissed on unmount.
  - Failed `Alert`: Edit + Redeploy (View deployments removed). Succeeded `Alert`: Edit, Redeploy and Open service. Both wired to the same handlers as the toast.
  - Copy: colon instead of dashes, Select instead of Pick, sentence-case step names and tag, `…` in the log line, sentence-case shell menu items.
  - guidelines.md: new building block X (`Toast`), Do/Copy/States updated, the three Known gap lines removed; block.json summary and variant summaries match.
- **Not a defect**
  - The Idle frame raises no toast: nothing has run, and its Deploy is a story device in a static frame.
  - Two actions are drawn through the `Toaster` slot rather than `toast()` options; the component limit is proposed as a new row.

### platform/states/first-use

- **Findings**
  - motion-polish / baseline-ui: raw `duration-150` and `ease-out` utilities on the template cards instead of motion tokens.
- **Fixed**
  - `duration-moderate-01` and `ease-productive-entrance`.
- **Not a defect**
  - The method row's bare `Create`: the row title (From scratch) names the object, and the module-level `Create <Object>` belongs to the list page's heading, not this panel.
  - No error state: the block is the empty state of a list that loaded; failures belong to the list page.

### platform/states/form-validation

- **Findings**
  - errors (row 2): the Conflict state put the message only on Key; a field-owned server rejection needs the section `Alert` as well (Known gap).
  - errors / form: the Rejected state neither scrolled to the Origin section nor focused the Origin select (Known gap); the section `Alert` spliced two sentences with an em dash.
  - microcopy: em dashes in the simulation panel; "Choose from the available … ports" (banned verb); title case and parentheses in labels (Delivery Settings, Protocol Usage, Debug Rules, Browser Maximum TTL (seconds), Cache Maximum TTL (seconds), 80 (Default)); generic "This field is required." messages that do not name the field.
  - motion-polish: raw `duration-150`/`duration-100`/`ease-out`/`ease-in` on the section `Alert` transition; baseline-ui: a `40px` Skeleton height.
- **Fixed**
  - The danger `Alert` above the fields in every short-form frame (primary and six variants) whenever the key matches one already taken; it closes once the key changes; Key keeps its `invalid` state, focus and message, and nothing toasts.
  - InSync, Rejected, Reloading and Reloaded: a rejected save scrolls the Origin heading into view (instant under `prefers-reduced-motion`) and focuses the Origin select; Rejected does it on mount. Alert copy now two sentences.
  - Copy: colons for the simulation dashes, Select for Choose, sentence-case labels with the unit moved into the description, `80 (default)`, `Name is required.`, `Host header is required.`, `Select an origin.`
  - Motion tokens (`duration-moderate-01`, `duration-fast-02`, `ease-productive-entrance`, `ease-productive-exit`) and `var(--size-10)`.
  - guidelines.md: new building block I (`Alert`), Do/Copy/States updated, both Known gap lines removed; summaries match.
- **Not a defect**
  - The Reloaded message `Select an origin to continue.` stays: it tells the user the save is blocked on that field, unlike the plain required message.

### platform/states/form-error (M2.9, split from form-validation)

- **Findings**
  - errors: the four long-form states (InSync, Rejected, Reloading, Reloaded) sat in `form-validation`
    beside the short-form states, so the section-scoped rule had no block of its own to point at.
  - Compared against the sample's `/forms/error-validation`: the layout, the danger `Alert` under the
    section heading with the recovery action, the `invalid` then `required` field reason, the
    `Skeleton` while reloading, the scroll and focus, and the dashed simulation panel all match. The
    only differences are the fictional names (origin and service instead of connector and Application,
    by the M1.1 convention) and the sample's em dash, which is two sentences here.
- **Fixed**
  - The states moved to `platform/states/form-error`, with their own `block.json`, intents and
    `guidelines.md`. `form-validation` keeps the short-form states and points at the new block. The v6
    block map sends `platform/forms/server-validation` to the new block. The webkit-errors and
    webkit-form skills name the block.
- **Not a defect**
  - `aria-label="Create Service"` on the form: it matches the `Create Variable` heading rule in
    `form-validation` (`Create` plus the entity name).

### platform/states/async-submit (M2.9)

- **Findings**
  - Compared against the sample's `/forms/async-deployment`: same anatomy (a status `Tag` in the
    heading, the simulation `aside`, an `EmptyState` while idle, the logs while running, the outcome
    `Alert`, one toast id per run). The sample's progress toast has a description and the block's did
    not. The sample's failure toast and `Message` offer _View deployments_.
- **Fixed**
  - The progress toast description is now `acme/web-app. It keeps running if you leave.`
- **Not a defect**
  - _View deployments_ is not carried over. The roadmap rule for every build and deploy outcome is
    **Edit** and **Redeploy**, and it overrides the sample.

### platform/states/page-wires

- **Findings**
  - ui-states / accessibility: the Overview and Onboarding wires hid their bands from assistive technology but had no `role="status"` region, so nothing was announced (Known gap).
- **Fixed**
  - Overview: the wire root is `role="status"`, `aria-live="polite"`, `aria-busy="true"` with the sr-only `Loading the overview.` Onboarding: `aria-busy` on `main` (which keeps its landmark role) and an sr-only `role="status"` paragraph, `Loading Home.`
  - guidelines.md: Do, Copy updated; Known gap removed.
- **Not a defect**
  - Fixed `170px`/`128px` stage on the Onboarding door cards: it mirrors the illustration stage of the real page so nothing shifts when it lands.
  - The `1px` in `calc(var(--spacing-md)+1px)`: border compensation so the bands align with the rows' content column.

### platform/states/project-intake

- **Findings**
  - None that break a skill.
- **Fixed**
  - Nothing.
- **Not a defect**
  - The drop target is `aria-hidden`: dragging is a pointer-only shortcut, and the page's own upload control is the keyboard path. The Initializing overlay does announce (`role="status"`).

### platform/view/card-view

- **Findings**
  - lists (row 29): Create Application was outlined and medium; `skills/webkit-lists` makes the heading's create the page's only large, primary control.
  - lists / delete (row 29): Delete (n) was not wired to the `platform/delete/delete-with-confirmation` pattern.
  - microcopy: `Requests (24h)` field label used parentheses.
- **Fixed**
  - Create Application: `kind="primary"`, `size="large"` (primary and Empty).
  - Delete (n) is the trigger of a medium `ConfirmDialog`: title with the count, warning `Alert`, a consequence sentence listing the selected names, an `Input` that must read `delete`, Cancel and a danger `Delete applications` (singular for one). Confirming removes the items and clears the selection; the input resets each open.
  - `Requests in 24h`. guidelines.md: building block D (`ConfirmDialog`, `Alert`, `Input`), A/C/Do/Copy/Accessibility/States updated; block.json summary matches.
- **Not a defect**
  - Delete (n) keeps the count in parentheses: the guideline's bulk-action label convention, a count rather than an aside.
  - Bulk confirmation asks for the word `delete` instead of a name: several names cannot be retyped; the names are listed in the body.

### platform/view/file-browser

- **Findings**
  - lists / delete: the row menu's Delete opened nothing, though the guidelines point at `delete-with-confirmation`; Open in the menu did nothing.
  - microcopy: `Last Modified` column header in title case.
- **Fixed**
  - The root's `select` event drives the row: Open enters the folder; Delete opens a medium `ConfirmDialog` (`Delete file` / `Delete folder`, warning `Alert`, consequence, `Input` that must match the name); confirming removes the entry from the listing.
  - `Last modified` in SFCs, guidelines and summary. guidelines.md: building block H, Copy updated; summary names the dialog.
- **Not a defect**
  - `-` in Size for folders: a size does not apply to a folder, and the hyphen keeps the column scannable.

### platform/view/query-editor

- **Findings**
  - ui-states: a statement the database rejects had no failure state; every run ended in success.
  - microcopy: title-case template names (Select All, Join Tables, Insert Related Rows, Top Customers …), `Run Query`, `SQL Quick Templates`, `Json` (acronym), a `…` used as list truncation in the filter placeholder.
  - baseline-ui: `rounded-[var(--radius-xl,12px)]`, a hard-coded fallback.
- **Fixed**
  - Runs whose verb is not SQL end in a danger `Alert` in the Results band (`The statement wasn't executed: near "SELEC", a syntax error. Check the statement and run it again.`), keeping the statement in the editor.
  - Sentence-case template names, `Run query`, `SQL quick templates`, `JSON`; placeholder without the ellipsis; `rounded-(--radius-xl)`. Guidelines and summaries match.
- **Not a defect**
  - `Create Table` on the empty-database action keeps entity capitalization (the create-button rule); the template title became `Create table` because it names a snippet, not the action.
  - `—` for an empty result cell: the table convention for a missing value, not a sentence dash.

### platform/view/split-view

- **Findings**
  - microcopy: en dash in the period range, `Custom…` (ellipsis not for progress), `Filter by…` and `Filter <field>…` placeholders, an em dash in the field filter `aria-label`, `Pick a range`, title-case field labels (Request Time, Bytes Sent, Cache Status, Remote Address, Service Duration, User Agent).
  - ui-states: no frame for a log request that fails (only Default, Filtered, Empty).
- **Fixed**
  - `from to end` ranges, `Custom range`, placeholders without the ellipsis, `Filter by Status, 3 values`, `Select a range`, sentence-case field labels, in all three files.
- **Not a defect**
  - `—` for a missing summary value and empty cell: the missing-value convention.
  - `Build & Deployment` in the shell's nav: shell copy owned by `shells/console`; changing it in one block would split the shell. Left for the shell sweep.
- **Not fixed (proposed row)**
  - The failed-load frame (an error `Alert` with Retry over the kept filters) needs a new variant; proposed as a new M1.10 row.

### platform/view/table-view

- **Findings**
  - lists (row 29): Create Resource outlined and medium instead of primary and large.
  - lists / delete: the row menu's Delete opened nothing, though the guidelines name `delete-with-confirmation` as the dialog behind it.
  - microcopy: the empty listing's `Docs` beside the heading's `Documentation` (two words for one concept).
- **Fixed**
  - Create Resource: `kind="primary"`, `size="large"` (primary and Empty).
  - The row menu's `select` opens a medium `ConfirmDialog` (`Delete resource`, warning `Alert`, consequence, `Input` that must match the row's name, danger `Delete resource`); confirming removes the row.
  - `Documentation` on the empty listing. guidelines.md: building block H, A/Do/Accessibility/States updated; summaries match.
- **Not a defect**
  - The Documentation button stays outlined medium beside the large Create: the skill makes only the create action large.
