# Production checklist

A service that is live on its generated hostname is not yet ready for real traffic. This card tells the user what stands between the service and production (a custom domain, a security policy, custom error pages), how many of those gates are done and which one to take next. It expands into a drawer where each gate explains itself and offers its action, and it shrinks to a single line once every gate is done.

## When to use

- Use production-checklist inside a resource's Overview tab for the few setup gates left before production traffic; it is a card, not a page.
- On the Overview tab of a service or resource that is deployed but still has setup gates before it should take production traffic.
- When the gates are few (three to five), independent and each completed by one action elsewhere in the console.

## When not to use

- Commands to build and deploy a resource for the first time: use `detail/get-started`.
- Ordered steps the user must complete before the resource exists: use `create/create-wizard`.
- A list of resources already bound to this one: use `detail/domains-card`.
- A module the account has never used: use `state/first-use`.

## Building blocks

### A. Checklist card — `Card` (required)

`Card :padded="false"` whose header holds the "Ship to production" title as an `h2` and the progress, and whose content holds the rows. When every gate is done the content is removed and the card carries `data-complete`, so it closes down to its header.

### B. Progress tag — `Tag` (required)

A small `Tag` beside the title: secondary with the count, "1 of 3", while gates remain; success with "Ready for production" when all are done. It is the only progress signal on the card.

### C. Expand button — `IconButton`, `Tooltip` (required)

A small outlined `IconButton` with the maximize icon at the header's end, `aria-label="Expand the production checklist"`, named on hover by a `Tooltip` reading Expand. It opens the drawer with the same steps, their descriptions and their actions.

### D. Gate rows — `Item` (required)

One small `Item` per gate, rendered as a full-width button: the gate's icon, its title and, at the end, a check when done. A done row takes the primary mask fill and a primary icon. Each row carries a screen-reader status, "Done" or "Not started", and opens the drawer like the expand button.

### E. Checklist drawer — `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `PanelBody`, `PanelFooter`, `Button` (required)

A large right-side `Drawer` that the expand button and every row open. `PanelHeader` repeats the title with the progress `Tag` and one sentence on where the service stands, beside the drawer's own close button; `PanelBody` lists every gate as a medium `Item` with its description and either its outlined action `Button` or, once done, a Done `Tag` with what it now serves; `PanelFooter` ends with a primary Done `Button` that closes it.

## Data

The block takes its gates through props and emits every action; it fetches nothing. `ProductionChecklistStep` and `ProductionChecklistProps` are exported from `production-checklist.vue`, and `sample.ts` holds the sample gates the block renders when `steps` is left out.

| Prop          | Type                        | What it does                                                                    |
| ------------- | --------------------------- | ------------------------------------------------------------------------------- |
| `steps`       | `ProductionChecklistStep[]` | The gates, in order; the count and the success state follow their `done` flags. |
| `defaultOpen` | `boolean`                   | Opens the drawer on mount, as the expand button or a row does.                  |

| Event         | Payload         | When                                                                             |
| ------------- | --------------- | -------------------------------------------------------------------------------- |
| `step-action` | `(event, step)` | A gate's action in the drawer (Add Domain, Attach Policy...); the drawer closes. |
| `done`        | `(event)`       | The drawer's Done button; the drawer closes.                                     |

To go live, render the block from the Overview tab that knows which gates are done:

```vue
<script setup lang="ts">
  import ProductionChecklist, { type ProductionChecklistStep } from './production-checklist.vue'

  const { data } = useServiceReadiness()
  const router = useRouter()

  const onStepAction = (_event: MouseEvent, step: ProductionChecklistStep) =>
    router.push(`/service/setup/${step.id}`)
</script>

<template>
  <ProductionChecklist
    :steps="data?.steps ?? []"
    @step-action="onStepAction"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Order the gates by how much they matter for production; domain first.
- Count done gates in the tag and keep the count in step with the rows.
- In the drawer, give each open gate one outlined action named for what it adds, and replace it once done with a Done `Tag` and a muted sentence naming what it now serves.
- Collapse the card when every gate is done; keep the title, the success tag and the expand button.

## Don't

- Don't block the rest of the page or nag with an alert banner; the checklist is guidance, not an error.
- Don't put the gate actions on the card rows; the card only lists, the drawer explains and acts.
- Don't show a percentage or a progress bar next to the count.
- Don't remove the card once complete; the success tag confirms the service is ready.

## Copy

- **Title:** "Ship to production".
- **Progress:** "<done> of <total>", e.g. "1 of 3"; when complete, "Ready for production".
- **Gate titles:** verb first, sentence case, no period, e.g. "Add a custom domain", "Enable a security policy".
- **Gate descriptions (drawer):** one or two sentences on what the gate gives the service, e.g. "Answer 4xx and 5xx with your own page instead of the default response."
- **Gate actions (drawer):** `Add <Module>` or a verb and noun, three words or fewer, e.g. "Add Domain", "Attach Policy", "Add Error Page".
- **Done note:** a muted sentence beside the Done tag naming what the gate now serves, ending with a period, e.g. "Serving shop.example.com."; the tag itself reads "Done".
- **Drawer description:** one plain sentence on where the service stands, e.g. "This service is live on a generated hostname. These steps take it to production."
- Follow `skills/webkit-microcopy`: no em dash, no "please", no exclamation marks.

## Accessibility

- The card title is an `h2` under the page `h1`; the drawer has its own title.
- The expand button has an `aria-label` that names what it expands.
- Gate icons and the done check are `aria-hidden`; each row announces "Done" or "Not started" in visually hidden text, so status never relies on color.
- Rows are real buttons, reachable by keyboard in reading order.
- The drawer returns focus to the expand button when it closes.

## States

- Card: `steps` with some gates done; the card lists every gate with the count in its tag, and the expand button and every row open the drawer.
- Success: `steps` with every gate done; the tag reads Ready for production and the rows are gone.
- DrawerDetail: `defaultOpen`, as when the expand button opened the right-side drawer with every step, its description and its action or its Done tag and note, over a Done footer; a card row opens the same drawer.

## Related

- `detail/resource-detail` — the service Overview tab that renders this card under the summary.
- `detail/get-started` — onboarding before the first deployment, for a resource made from the CLI.
- `detail/domains-card` — where an attached policy or error page shows up once added.
- `Item` — the row primitive for each gate; see `skills/webkit-ui-states` for the done and empty states.
