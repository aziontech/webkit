# Deploy template

A focused page, outside the console shell, where the user turns a template into a running project. They chose a template in the Creation Center and now need to see what it clones, connect a Git provider if they have none, name the repository it creates, fill the settings the template requires and deploy. The same column then shows the build and the outcome, so the user never leaves the page.

## When to use

- The user picked a template, a Git import or an upload from `platform/create/create-hub`, and the next step is to deploy it.
- The flow creates a repository from a source in the user's Git account and deploys from it on every push.
- The template needs a few settings (tokens, a domain) before its first build can run.

## When not to use

- Choosing what to start from: use `platform/create/create-hub`.
- A first-level resource created from a form with no source code: use `platform/create/single-page-create`.
- A source that needs several steps (where it runs, how it builds): use `platform/create/source-wizard`.
- Provisioning a resource and binding it to another: use `platform/create/provision-wizard`.

## Building blocks

### A. Creation header — `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

The creation header from `top-bars/creation-bar`: a small outlined back `IconButton` to the Creation Center, the `Brand` linking home, a `Breadcrumb` whose last crumb is the template and is current, and the account `Avatar` alone on the right. No sidebar, no search.

### B. Template and Git step — `Card`, `EmptyState`, `Button`, `Link` (required)

Above the step, a preview `Card` names the template, its one-sentence description and the repository and path it clones from; it stays on screen for the whole flow. Without a Git provider the step is a medium `bordered` `EmptyState` (its own dashed surface, no wrapper): the provider glyph, the title, one sentence on what happens to the clone, then Continue with GitHub as the secondary large `Button`, Continue without Git as a transparent `Button` and Manage connected providers as a `Link`. Once a provider is connected the step becomes the Deploy your project form in a `Card`: the scope and the repository name side by side, a privacy switch on the name, then the template settings, and a full-width primary Deploy in the footer. While the template settings load, three `Skeleton` field bands stand in for them in an `aria-busy` region and Deploy is disabled.

**Advanced settings (when the source builds).** Under the template settings, two collapsible groups, each a large single `Accordion` with the chevron on the start side inside a bordered frame. **Build and output settings** holds the build fields filled with their defaults (root directory, install command), led by a Build preset `Select` when the framework was detected or must be picked. **Environment variables** holds one row pair per variable: a disabled Key row with the variable name, then a Value row with a show or hide `IconButton` for a secret and a locked Secret `Checkbox` whose `Tooltip` says whether the template keeps it secret. A group opens on its own when it holds a required value. Deploy checks the form: each missing required value shows its `Field.Error` and the group that holds it opens.

**Uploaded project (Upload only).** Reached from a dropped folder there is no Git: the form asks for the project name and a Build preset, then a Project files card shows the folder summary (name, file count and total size, formatted with `Intl.NumberFormat` from the files themselves) and a scrollable list with each file's glyph, monospace path and size. The list shows the first 100 files and an "and N more" line counts the rest; its scroll region is focusable so a keyboard can scroll it. A static project with no `index.html` adds a required Root (/) `Select` of the top-level files, and Deploy waits for it.

### C. Browse templates — `Button` (optional)

An outlined medium `Button` under the step that returns to the template list. It is the way back to choose another template; the header's back control leaves the flow.

## Do

- Keep the template preview card at the top of the column through every phase, so the user always sees what is being deployed.
- Ask for Git first; show the form only once a provider is connected.
- Let Deploy check the form: show each missing required value under its field and open the collapsed group that holds it. Disable Deploy only while the settings load, or on an upload until a Root (/) is picked.
- Keep build and variable settings in their collapsible groups, prefilled with defaults, so a template that needs nothing more deploys in one press.
- Mark a secret variable with the locked Secret checkbox and mask its value, with a show control beside it.
- Hand the same column to `platform/create/deployment-flow` on Deploy, then to `platform/create/deploy-success`.
- Trim the form to the repository fields for Import from Git, and to the uploaded files for Upload a Project.

## Don't

- Don't open this flow inside the console shell or a drawer; it is a page with its own header.
- Don't ask for settings the template does not use, or move a required setting out of view.
- Don't create the repository before Deploy is pressed.
- Don't replace the page with a new route for the build; the column changes, the page stays.
- Don't put a Cancel next to Deploy; the back control and Browse templates already leave.

## Copy

- **Breadcrumb:** the entry point, then the template name, e.g. "Start from a template" then "Nuxt E-commerce".
- **Back control:** `aria-label` names the destination, e.g. "Back to Creation Center".
- **Git step:** title states the task, e.g. "Connect a Git provider"; description one sentence saying what happens, e.g. "Nuxt E-commerce is cloned into a repository in your account, then deployed from it on every push."
- **Provider buttons:** verb first, e.g. "Continue with GitHub"; the link names the place, e.g. "Manage connected providers".
- **Form heading:** e.g. "Deploy your project"; settings labels 1 to 3 words with the constraint in the description, e.g. "You can find this token in the API credentials of your store."
- **Groups:** "Build and output settings", "Environment variables"; rows "Key", "Value", "Secret"; the reveal control "Show value" or "Hide value".
- **Errors:** "<label> is required.", e.g. "Root directory is required."
- **Upload:** breadcrumb "Upload a project"; "Project files"; "Root (/)" with "Select a file".
- **Import:** breadcrumb "Import from Git"; preview "Import and deploy the acme-web repository from GitHub."
- **Commit:** "Deploy", the same verb on the button and in the run that follows.
- Follow `skills/webkit-microcopy`: sentence case, no em dash in labels or `aria-label`s, no parentheses in labels.

## Accessibility

- One `main` landmark under the header; the step title is an `h2` and the settings group an `h3`.
- The back `IconButton`, the brand link and the account button each have an `aria-label`.
- The repository name has a visible `Field.Label` tied to its input by its `Field`; the privacy switch is labelled Public repository and announces its on or off state.
- Settings use `Field` labels and descriptions, so each input announces its name and constraint.
- Required fields carry the Required marker; a failed Deploy puts each error in a `Field.Error` (`role="alert"`) tied to its input.
- Each `Accordion` trigger is a button that announces its expanded state; the Value input is labelled by its Value label, the Key row by its Key label, and the show control is a toggle with `aria-pressed`.
- The uploaded files list is a `ul` named by the folder, inside a focusable scroll region (`role="region"`, `tabindex="0"`) so it scrolls from the keyboard; while settings load the region is `aria-busy` with one status line.
- The page enter animation stops under reduced motion.

## States

- ConnectGit: no Git provider yet; the template preview over the Connect a Git provider card and Browse templates.
- Form: GitHub connected; scope and repository name side by side, public by default, over the store domain setting and the Build and output settings and Environment variables groups; Deploy shows the missing access token under its field.
- BuildSettings: after a failed Deploy; both groups open, a Build preset on the detected Nuxt preset, and the required access token in error.
- LoadingSettings: the template settings loading as Skeleton bands, Deploy disabled.
- ImportFromGit: a repository imported from GitHub; scope and repository name over one collapsed Build and output settings group.
- Upload: a dropped folder; project name and build preset, the Project files card and a required Root (/) for a static project with no index.

## Related

- `platform/create/create-hub` — where the user picks the template.
- `platform/create/deployment-flow` — the build card the column shows after Deploy.
- `platform/create/deploy-success` — the outcome the column ends on.
- `top-bars/creation-bar` — the header this page uses.
- `platform/states/project-intake` — the upload path that reaches this page with files instead of a template.
