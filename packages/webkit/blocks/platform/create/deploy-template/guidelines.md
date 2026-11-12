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

The creation header from `headers/creation-header`: a small outlined back `IconButton` to the Creation Center, the `Brand` linking home, a `Breadcrumb` whose last crumb is the template and is current, and the account `Avatar` alone on the right. No sidebar, no search.

### B. Template and Git step — `Card`, `EmptyState`, `Button`, `Link` (required)

Above the step, a preview card names the template, its one-sentence description and the repository and path it clones from; it stays on screen for the whole flow. Without a Git provider the step is a `Card` holding a medium `EmptyState` on a dashed surface: the provider glyph, the title, one sentence on what happens to the clone, then Continue with GitHub as the secondary large `Button`, Continue without Git as a transparent `Button` and Manage connected providers as a `Link`. Once a provider is connected the same `Card` becomes the Deploy your project form: the scope and the repository name side by side, a privacy switch on the name, then the template settings stacked, and a full-width primary Deploy in the footer that stays disabled until every required setting is filled.

### C. Browse templates — `Button` (optional)

An outlined medium `Button` under the step that returns to the template list. It is the way back to choose another template; the header's back control leaves the flow.

## Do

- Keep the template preview card at the top of the column through every phase, so the user always sees what is being deployed.
- Ask for Git first; show the form only once a provider is connected.
- Disable Deploy until the repository name and every required template setting have a value.
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
- **Commit:** "Deploy", the same verb on the button and in the run that follows.
- Follow `skills/webkit-microcopy`: sentence case, no em dash in labels or `aria-label`s, no parentheses in labels.

## Accessibility

- One `main` landmark under the header; the step title is an `h2` and the settings group an `h3`.
- The back `IconButton`, the brand link and the account button each have an `aria-label`.
- The repository name has a visible `Field.Label` tied to its input by its `Field`; the privacy switch is labelled Public repository and announces its on or off state.
- Settings use `Field` labels and descriptions, so each input announces its name and constraint.
- A disabled Deploy is explained by the required markers on the fields, not by the button alone.
- The page enter animation stops under reduced motion.

## States

- ConnectGit: no Git provider yet; the template preview over the Connect a Git provider card and Browse templates.
- Form: GitHub connected; scope and repository name side by side, public by default, over the template settings, with Deploy disabled until the access token is filled.

## Related

- `platform/create/create-hub` — where the user picks the template.
- `platform/create/deployment-flow` — the build card the column shows after Deploy.
- `platform/create/deploy-success` — the outcome the column ends on.
- `headers/creation-header` — the header this page uses.
- `platform/states/project-intake` — the upload path that reaches this page with files instead of a template.
