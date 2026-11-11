# Deploy success

The screen a create flow ends on. The user has just watched a deploy finish and needs three answers before leaving: is it live and where, what exactly was created or bound along the way, and what to do next. The page answers them in that order in the terminal column of the wizard, then offers one way out to manage the resource.

## When to use

- A create flow (a template deploy, an import from Git, a source or provision wizard) has finished and the resource is serving, or was created for the first time.
- The flow created or bound more than one resource and the user should see each one.
- A resource was made from the CLI and nothing serves it yet: the CliCreated state shows how to deploy it.

## When not to use

- The run is still going or has failed: keep `platform/create/deployment-flow` on screen.
- A resource created from a form that does not deploy: end on the resource's page with a success toast that names it, as `skills/webkit-create-surface` describes; there is no outcome screen.
- An item added inside a resource from a drawer: use `platform/create/create-in-drawer` and close it on save.
- The onboarding steps for a CLI resource on its Overview tab: use `platform/detail/get-started`.

## Building blocks

### A. Outcome heading — `Tag` (required)

A large `h1` stating the outcome and one muted lead sentence under it. For a Git source the lead ends with the scope as a secondary `Tag` with the provider glyph; without a Git source there is no scope tag. The heading enters with the content animation and respects reduced motion.

### B. Deployment card — `Card`, `Tag`, `Button`, `Tooltip` (required)

The live service: a preview tile that opens the site, the service name as an `h2` with a small success `Tag` reading Live, and its creation time. An outlined medium `Button` Visit site opens the domain in a new tab. Under it, one row for the domain with Add custom domain beside it, and one row for the repository with its branch. Each external link carries a `Tooltip` naming where it goes and an external-link glyph. Leave the card out when nothing serves the resource yet.

### C. Resources list — `Card`, `Item`, `Tag` (required)

A small heading over `Card :padded="false"` holding an `Item` list, one small row per resource: kind glyph, name, its ID or contents as the description, and a small `Tag` reading Created or Bound. Bound marks a resource that already existed and was attached, so the user can tell new things from reused ones.

### D. Next steps — `Card`, `Tag` (required)

Three unpadded `Card`s in a row from the small breakpoint, each a whole-card link or button with a glyph, a title, one sentence and a trailing chevron or external-link glyph. Mark at most one with a primary `Tag` reading Recommended. External steps open the docs in a new tab; internal ones carry on in the console.

### E. Manage — `Button` (required)

One full-width secondary large `Button` at the end of the column that opens the resource. It is the only exit; do not add a second.

## Do

- Lead with the outcome and the live address; the user came to see it work.
- Tag every resource Created or Bound so the list doubles as a receipt of what the flow touched.
- Open external links in a new tab, with a `Tooltip` and a visually hidden note saying so.
- Drop the scope tag and the repository row when the flow had no Git source.
- In CliCreated, replace the deployment card with next steps that deploy the resource, and add the Get started paths for the CLI and GitHub Actions.

## Don't

- Don't celebrate: no confetti, no exclamation, no emoji. State the fact.
- Don't put more than one Recommended tag among the next steps.
- Don't add a Deploy again or Create another action; the user starts a new flow from the Creation Center.
- Don't leave the screen without a way into the resource; Manage is required.
- Don't repeat the resource list inside the deployment card.

## Copy

- **Heading:** the object and the past-tense result in sentence case, e.g. "Resource deployed", or "Resource created" when nothing serves it.
- **Lead:** one sentence with a period, e.g. "You deployed a new resource." followed by "Source:" and the source tag. Never a dangling fragment after the period.
- **Status tag:** one word, e.g. "Live"; resource tags "Created" or "Bound".
- **Links:** verb first, e.g. "Visit site", "Add custom domain"; tooltips name the target, e.g. "Open acme/web-app in a new tab".
- **Next steps:** title verb first in two or three words, e.g. "Customize domain", "View analytics"; description one sentence with a period.
- **Exit:** "Manage", a single verb.
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no ampersand, no "please".

## Accessibility

- The heading is the page's only `h1`; the service name and the section titles are `h2`.
- The preview tile and Visit site have an `aria-label` that names the address and says it opens in a new tab.
- Links that open a new tab say so in visually hidden text, not only with the external-link glyph.
- Glyphs in rows and cards are decorative and carry `aria-hidden="true"`; the Created or Bound tag gives the state in words.
- A next-step card is one focusable link or button with a visible focus ring; its title and description are its name.
- Focus order follows reading order: heading, deployment card, resources, next steps, Manage.

## States

- Default: a deployed service from a Git source, with the scope, the deployment card, four resources and three next steps.
- CliCreated: a resource made from the CLI that nothing serves yet; no deployment card, one resource row, next steps to deploy it here or on a new service, and the Get started paths.

## Related

- `platform/create/deployment-flow` — the run this screen follows.
- `platform/create/deploy-template` — a flow that ends here.
- `platform/create/source-wizard` — a wizard that ends here.
- `platform/create/provision-wizard` — a wizard that ends here with its own title.
- `platform/detail/get-started` — the CLI and GitHub Actions steps the CliCreated state embeds.
- `platform/detail/details-page` — where Manage leads.
