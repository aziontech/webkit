# Project intake

The surfaces a project passes through when the user drops it on the page. The user's job is to deploy a folder they already have without filling in a form: while a folder hovers over the page, a dashed drop target fills it and says what will happen; once it is dropped, a full-screen Initializing overlay reads like the deploy logs, one row per received file, until the upload is done and the deploy takes over.

DropZone is a page-body overlay inside the default slot of `ConsoleLayout` (`shells/console`); Initializing covers the whole screen.

## When to use

- Pages where dropping a project is a shortcut to deploying it: Home, its empty state, a creation hub, and a project detail page.
- Showing upload progress per file, when the files are few enough to list.

## When not to use

- Choosing a single file as a form value: use a file upload field inside the form (`skills/webkit-form`).
- Browsing or managing stored files: use `platform/view/file-browser`.
- The build and deploy that follow the upload: use `platform/states/async-submit` and `platform/create/deployment-flow`.
- Importing from a repository: use the From GitHub method in `platform/states/first-use` or `platform/create/source-wizard`.

## Building blocks

The primary SFC (the drop target) imports no WebKit component; it is plain elements on theme tokens inside Vue's `Transition`. The Initializing variant adds `Card` and `Spinner`.

### A. Drop target — plain elements (required while dragging)

A layer that covers the page inset by the layout boundary, with a 2px dashed `--border-selected` border on `--bg-canvas`, `pointer-events-none` so the drop still reaches the page, and `z-40` over the content. It fades in and out with `animate-fade-in` / `animate-fade-out`, both `motion-reduce:animate-none`.

### B. Drop message — plain elements (required while dragging)

Centred and sticky to the viewport, so it stays in view on a long page: an upload glyph in a bordered frame, a heading-sized line that says what dropping does, and one muted line on what is accepted. A project page swaps the line for the version it builds.

### C. Initializing overlay — plain elements (Initializing)

A full-screen `role="status"`, `aria-live="polite"` layer with a heading (`Initializing`), the progress in words (`Setting up your deployment. 2 of 5 files.`), a `Card` of step rows and the upload summary under it. Each row is a step: a status glyph (a check once uploaded, a `Spinner` while it runs, a dashed ring while queued), the path and its size, advancing row by row, with the step-row anatomy of `platform/detail/deployment-logs`.

## Do

- Show the drop target only while a folder is dragged over the page, and remove it on drop or drag leave.
- Say what dropping does, not how to drop: the user is already dragging.
- Render Initializing over the page the drop came from (Home, its empty state, the creation hub), so the user keeps their place.
- Advance the rows in order and keep finished rows visible; the list is the progress.
- Offer an upload or import action elsewhere on the page; drag and drop is a shortcut, never the only way.

## Don't

- Don't intercept the drop with the overlay; it is `pointer-events-none`.
- Don't use a percentage bar alone for a handful of files; the per-file rows say more.
- Don't show the drop target on pages where a drop does nothing.
- Don't keep the overlay up after the upload ends; hand over to the deploy's own progress.

## Copy

- **Drop heading:** what the drop does, one line: `Drop your project to deploy it`. On a project page: `We build a new version of web-app, then you choose where it goes live.`
- **Drop lead:** what is accepted, full sentences: `A project folder, or the files inside one. We detect what it is built with.`
- **Overlay heading:** one word for the phase: `Initializing`.
- **Overlay progress:** what is happening and how far, with a period: `Setting up your deployment. 2 of 5 files.`
- **Summary:** count and total size: `5 files, 8.17 KB`.

## Accessibility

- The drop target is `aria-hidden="true"`: it is a pointer affordance. Keyboard and screen reader users need the page's own upload or import action.
- The Initializing overlay is `role="status"` with `aria-live="polite"`, so progress is announced without stealing focus; announce the count, not every row.
- Status glyphs are decorative; the row text and the progress line carry the state.
- Every fade and the row advance honour `prefers-reduced-motion`.

## States

- DropZone: a folder hovers over the page; the dashed drop target fills it with the drop message.
- Initializing: the overlay mid-upload, two files uploaded, the third running, two queued, each row with its status glyph, path and size.

## Related

- `platform/states/first-use` — an empty list page that can also render the drop target.
- `platform/create/create-hub` — a creation hub that renders the drop target and Initializing.
- `platform/dashboard/home-dashboard` — Home and its empty state, which render both surfaces.
- `platform/detail/deployment-logs` — the step-row anatomy the Initializing rows reuse.
- `platform/states/async-submit` — how the deploy that follows reports back.
