# Get started

The first thing a user reads about a resource they created from the CLI and have not deployed yet. They need the exact commands to build and ship it, in order, for the path they work with: the CLI on their own machine or a GitHub Actions workflow. The block names the two paths, lets them pick one and walks them through three numbered steps, each with commands they can copy.

## When to use

- Under the summary card on the Overview tab of a resource made from the CLI that has no deployment yet.
- At the end of a create wizard, on the deploy success screen, when the next move happens in a terminal.
- Any onboarding that comes down to three ordered steps with commands per step.

## When not to use

- A resource that already serves traffic: show the summary and its deployments in `platform/detail/details-page` instead.
- A list of gates to pass before going to production (domain, policy, error pages): use `platform/detail/production-checklist`.
- A module the account has never used: use `platform/states/first-use`, which explains the module before any resource exists.
- Connecting a repository or editing build commands: that is the Build tab of `platform/detail/details-page`.

## Building blocks

### A. Section heading — `SectionHeader` (required)

`SectionHeader` titled "Get started" with a one-sentence description that ends on a link to the CLI docs. It is a section inside the page, never the page title.

### B. Path switch — `ToggleGroup` (required)

A large `ToggleGroup` in the heading's actions slot, `aria-label="Deploy with"`, with two options: CLI and GitHub Actions. Switching swaps all three steps at once; the heading and the layout stay put.

### C. Step cards — `Card` (required)

Three `Card`s with `:padded="false"`, one per step, each led by a round step number, an `h3` title and one sentence of context. They sit in one column and go to three columns from the `@4xl` container width (1024 px, where each step card fits its commands), joined by a dashed connector that is hidden from assistive technology.

### D. Commands — `CodeBlock` (required)

One `CodeBlock` per step with `:show-line-numbers="false"` and a `copy-aria-label` that names the step. A step with alternatives (npm, yarn, pnpm, brew) carries them as tabs of the same block; a workflow file shows its `fileName`.

## Do

- Keep exactly three steps per path, in the order the user runs them: install or authenticate, connect, deploy.
- Make every command copyable and runnable as shown, with the resource name already filled in.
- Keep the two paths parallel: same number of steps, same card shape, same last step that ends in a live deployment.
- Point to the docs from the description, not from a separate button.

## Don't

- Don't add a primary button to the block; the action happens in the terminal or the repository.
- Don't put secrets or real tokens in a command; refer to the repository secret by name.
- Don't nest cards or put more than one `CodeBlock` in a step.
- Don't let a long command push the page sideways; the code block scrolls inside its card.

## Copy

- **Section title:** "Get started".
- **Description:** one sentence that names the choice, then the docs link, e.g. "Two ways to build and deploy this resource. Select one and follow the steps, or read the CLI docs."
- **Path options:** the tool names as their makers write them, e.g. "CLI", "GitHub Actions".
- **Step titles:** verb first, sentence case, no period, e.g. "Install the CLI", "Link your project", "Push to deploy".
- **Step descriptions:** one or two sentences that say what the step does and why, e.g. "Authenticate, then link the local project to this resource so every deploy lands on it."
- **Copy button label:** names the step, e.g. "Copy the commands for Install the CLI".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The section title is a heading below the page `h1`; each step title is an `h3`.
- The toggle group carries `aria-label="Deploy with"`, so the switch reads as a choice of path.
- The step number is visible text, so the order is announced; the dashed connector is `aria-hidden`.
- Each copy button names its step, so several copy buttons on the page stay distinguishable.
- The docs link opens in a new tab with `rel="noopener noreferrer"` and keeps a visible focus ring.

## States

- Cli: the CLI path, install the CLI, link the project, then deploy and sync.
- Ci: the GitHub Actions path, store a personal token as a repository secret, add the deploy workflow, then push to the production branch.

## Related

- `platform/detail/details-page` — the resource Overview tab this block sits on, under the summary card.
- `platform/create/deploy-success` — the end of a create flow that can show these steps.
- `platform/detail/production-checklist` — the next set of tasks once the resource is live.
- `CodeBlock` — tabs, file name and copy for each step's commands.
