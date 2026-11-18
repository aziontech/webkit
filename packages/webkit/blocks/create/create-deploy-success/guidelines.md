# Deploy success

The screen a create flow ends on. The user has just watched a deploy finish and needs three answers before leaving: is it live and where, what exactly was created or bound along the way, and what to do next. The page answers them in that order in the terminal column of the wizard, then offers one way out to manage the resource.

## When to use

- A create flow (a template deploy, an import from Git, a source or provision wizard) has finished and the resource is serving, or was created for the first time.
- The flow created or bound more than one resource and the user should see each one.
- A resource was made from the CLI and nothing serves it yet: the CliCreated state shows how to deploy it.

## When not to use

- The run is still going or has failed: keep the create-flow card of `detail/detail-deployment-logs` (InCreateFlow) on screen.
- A resource created from a form that does not deploy: end on the resource's page with a success toast that names it, as `skills/webkit-create-surface` describes; there is no outcome screen.
- An item added inside a resource from a drawer: use `create/create-drawer` and close it on save.
- The onboarding steps for a CLI resource on its Overview tab: use `detail/detail-get-started`.

## Building blocks

### A. Outcome heading — `Tag` (required)

A large `h1` stating the outcome and one muted lead sentence under it. For a Git source the lead ends with the scope as a secondary `Tag` with the provider glyph; without a Git source there is no scope tag. The heading enters with the content animation and respects reduced motion.

### B. Deployment card — `Card`, `Tag`, `Button`, `Link`, `Tooltip` (required)

The live service: a decorative preview tile (hidden from assistive technology; Visit site is the link), the service name as an `h2` with a small success `Tag` reading Live, and its creation time. An outlined medium `Button` Visit site opens the domain in a new tab. Under it, one row for the domain (a small `Link` with `target="_blank"`) with Add custom domain beside it (a small `Button variant="link"` with `href`), and one row for the repository (a small `Link`) with its branch. Each external `Link` carries a `Tooltip` naming where it goes and its external-link glyph. Never hand-roll the anchors. Leave the card out when nothing serves the resource yet.

### C. Resources list — `Card`, `Item`, `Tag` (required)

A small heading, "Resources", over `Card :padded="false"` holding an `Item` list, one small row per resource: kind glyph, name, its ID or contents as the description, and a small `Tag` reading Created or Bound. Bound marks a resource that already existed and was attached, so the user can tell new things from reused ones.

### D. Next steps — `IntegrationCard` (required)

`IntegrationCard` tiles in a row from the small breakpoint, each with a glyph (`logo`), a title and one sentence. A step with `href` is a link stretched over the tile; a step that acts in place (Deploy this resource) has no `href`, and its title is a button that emits `select`. Mark at most one with a primary Recommended badge (`badges`). Docs steps open in the same tab, so no new-tab notice is needed.

### E. Get started — `Subheader`, `ToggleGroup`, `CodeBlock`, `Card` (optional)

Only for a resource nothing serves yet (`getStarted` set to its name): a `Subheader` with a link to the CLI docs and a large `ToggleGroup` between the CLI and GitHub Actions paths, then three numbered step `Card`s, each with its commands in a `CodeBlock` without line numbers. The Link your project command names the resource.

### F. Manage — `Button` (required)

One full-width secondary large `Button`, "Manage service", at the end of the column that opens the resource. It is the only exit; do not add a second.

## Data

The block takes what the flow made through props and emits its actions; it fetches nothing. `DeploySuccessProps`, `DeploySuccessDeployment`, `DeploySuccessResource` and `DeploySuccessNextStep` are exported from `create-deploy-success.vue`, and `sample.ts` holds the sample deployment, resources and next steps the block renders when a data prop is left out.

| Prop          | Type                              | What it does                                                                                      |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| `title`       | `string`                          | The outcome heading, "Resource deployed" by default.                                              |
| `description` | `string`                          | The lead sentence; "Source:" and the scope tag follow it when the deployment has a Git `source`.  |
| `deployment`  | `DeploySuccessDeployment \| null` | The live service of the deployment card. `null` leaves the card out when nothing serves it.       |
| `resources`   | `DeploySuccessResource[]`         | One row per resource the flow created or bound.                                                   |
| `nextSteps`   | `DeploySuccessNextStep[]`         | The next-step tiles; a step without `href` is a button that emits `next-step`.                    |
| `getStarted`  | `string`                          | The resource name the Get started commands link; set it to show the CLI and GitHub Actions paths. |

| Event       | Payload         | When                                           |
| ----------- | --------------- | ---------------------------------------------- |
| `next-step` | `(event, step)` | A next-step tile without `href` was activated. |
| `manage`    | `(event)`       | Manage service.                                |

To go live, render the block from the page the create flow ends on and pass what the flow returned:

```vue
<script setup lang="ts">
  import CreateDeploySuccess from './create-deploy-success.vue'

  const { deployment, resources, nextSteps } = useCreateFlowResult()
</script>

<template>
  <CreateDeploySuccess
    :deployment="deployment"
    :resources="resources"
    :next-steps="nextSteps"
    @manage="openService"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Lead with the outcome and the live address; the user came to see it work.
- Tag every resource Created or Bound so the list doubles as a receipt of what the flow touched.
- Open the domain and the repository in a new tab with `Link target="_blank"`, and a `Tooltip` saying so.
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
- **Exit:** "Manage service", the verb and its object.
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no ampersand, no "please".

## Accessibility

- The heading is the page's only `h1`; the service name and the section titles are `h2`.
- The preview tile is decorative (`aria-hidden`); Visit site names the address.
- Links that open a new tab say so in their `Tooltip`, not only with the external-link glyph.
- Glyphs in rows and cards are decorative and carry `aria-hidden="true"`; the Created or Bound tag gives the state in words.
- A next-step card is one focusable link or button with a visible focus ring; its title and description are its name.
- Focus order follows reading order: heading, deployment card, resources, next steps, Manage.

## States

- Default: a deployed service from a Git source (`deployment` with a `source`), with the scope, the deployment card, four `resources` and three `nextSteps`.
- CliCreated: a resource made from the CLI that nothing serves yet; `:deployment="null"` leaves out the deployment card, one resource row, next steps to deploy it here or on a new service, and `get-started` shows the Get started paths.

## Related

- `detail/detail-deployment-logs` — the run this screen follows (InCreateFlow).
- `create/create-deploy-template` — a flow that ends here.
- `create/create-wizard` — its CreateAndDeploy variant ends here with its own title.
- `detail/detail-get-started` — the source of the CLI and GitHub Actions steps the CliCreated state embeds; CliCreated copies its section verbatim, so change the command copy there first and copy it here.
- `detail/detail-resource` — where Manage leads.
