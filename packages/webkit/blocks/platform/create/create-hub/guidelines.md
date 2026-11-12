# Create hub

The Creation Center, where a new project starts. The user arrives from Home or a Create action with something to deploy and needs to pick its source in one look: a repository from their Git account, a template, or a file or folder from their machine. The page puts the two main sources side by side, Import from GitHub and Start from template, under one heading, and accepts a dropped folder anywhere.

## When to use

- The entry point of every new project, before the user has decided where the code comes from.
- The user may import an existing repository, start from a framework or starter template, or upload local files.
- The choice leads to a focused flow outside the console shell, such as `platform/create/deploy-template`.

## When not to use

- Creating a first-level resource that has no source code: use `platform/create/single-page-create`.
- A guided multi-step creation once the source is known: use `platform/create/source-wizard`.
- Adding something inside an existing resource: use `platform/create/create-in-drawer`.
- The drop target and upload progress after a folder is dropped: those are `platform/states/project-intake`.
- Teaching a module to a new account: use `platform/states/first-use`.

## Building blocks

### A. Creation header — `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

The creation header from `headers/creation-header`: a small outlined back `IconButton` to Home, the `Brand` linking home, a `Breadcrumb` with Creation Center as the single current crumb, and the account `Avatar` alone on the right. No sidebar.

### B. Page heading — `PageHeader` (required)

`PageHeader` at `size="large"`. The description says what the page offers in one sentence and ends with inline file and folder buttons that open the system picker, the keyboard path to the drag and drop it mentions.

### C. Git connect — `Card`, `EmptyState`, `Button`, `Link` (required until connected)

Under the Import from GitHub heading, a `Card` with a medium `EmptyState` on a dashed surface: the provider glyph, a title, one sentence, Continue with GitHub as a secondary large `Button` and Manage connected providers as a large `Link`. It shows only while no account is connected.

### D. Repository search — `Select`, `Input` (required once connected)

A large `Select` of the connected scopes with the scope avatar in the trigger and Add GitHub account as the last option, beside a large search `Input` that filters by name and also accepts a repository URL. Picking a scope reloads the list.

### E. Repository list — `Card`, `Item`, `Button`, `Skeleton` (required once connected)

A flush `Card` with an `Item` list, one small row per repository: glyph, name, its last push as the description and a small secondary Import `Button`. While a scope loads, six `Skeleton` rows in the shape of the `Item` stand in and the list carries `aria-busy`. Repositories are ordered most recently pushed first.

### F. Template gallery — `Button`, `ScrollArea`, `Card` (required)

Under the Start from template heading, an outlined medium Filter `Button`, then a faded `ScrollArea` with an `aria-label`. Inside, sections in fixed order: Recommended framework cards in three columns from the large breakpoint, the starter templates one per kind of resource, then every other framework in two columns with the vendor beside the title. Each template is a whole `Card` acting as a button with its glyph, title and one sentence.

## Do

- Keep both sources visible at once from the large breakpoint, the Git column first.
- Show the connect state only until an account exists, then go straight to the list.
- Let the search accept a pasted repository URL, so the user does not have to find it in the list.
- Keep template sections in the same order on every visit; Recommended first.
- Offer file and folder buttons in the heading so uploading works without a mouse.

## Don't

- Don't put the hub inside the console shell or open it in a drawer; it is a focused page.
- Don't replace the list with a spinner while a scope loads; use skeleton rows in its shape.
- Don't add a Continue or Next button; each Import and each template card starts its flow.
- Don't let the template gallery push the page into a long scroll on large screens; it scrolls inside its own area.
- Don't show templates as a dense table; the glyph and sentence are what the user scans.

## Copy

- **Heading:** a verb phrase for the task, e.g. "Start a new project"; description one sentence with a period, e.g. "Start from a repository or use a framework template."
- **Column titles:** short fragments, e.g. "Import from GitHub".
- **Connect state:** title states the task, e.g. "Connect your repository"; description one sentence, e.g. "Select a Git provider to connect your repository and start the deployment process."
- **Buttons:** verb first, three words or fewer, e.g. "Continue with GitHub", "Import", "Filter".
- **Search:** placeholder and `aria-label` name what it takes, e.g. "Search projects or enter a Git repository URL".
- **Template cards:** title is the template name; description one sentence, e.g. "Compile Rust to WebAssembly and run it."
- Follow `skills/webkit-microcopy`: sentence case, select rather than choose or pick, no em dash.

## Accessibility

- The `PageHeader` title is the page's only `h1`; column titles are `h2`, template titles `h3`.
- The back `IconButton`, the brand link, the account button, the scope `Select` and the search each have an `aria-label`.
- Template cards are focusable with `role="button"` and `tabindex="0"`, and respond to Enter and Space.
- The loading list sets `aria-busy="true"`; skeleton rows are hidden from assistive technology.
- Drag and drop always has a keyboard alternative: the file and folder buttons in the description.
- The `ScrollArea` is named so screen reader users know which region scrolls.

## States

- Default: no Git account connected; the connect state beside the template gallery.
- Connected: jane-doe is the selected scope and its seven repositories are listed, most recently pushed first.
- LoadingRepositories: a scope was just picked; six skeleton rows stand in for the repositories.

## Related

- `platform/create/deploy-template` — where a template card or Import leads.
- `platform/states/project-intake` — the drop target and upload overlay for a dropped folder.
- `platform/create/source-wizard` — the guided flow once a source is chosen.
- `headers/creation-header` — the header this page uses.
- `platform/dashboard/home-dashboard` — Home, where the back control returns.
