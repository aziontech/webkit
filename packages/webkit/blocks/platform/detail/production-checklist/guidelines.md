# Production checklist

A service that is live on its generated hostname is not yet ready for real traffic. This card tells the user what stands between the service and production (a custom domain, a security policy, custom error pages), how many of those gates are done and which one to take next. It expands into a drawer where each gate explains itself and offers its action, and it shrinks to a single line once every gate is done.

## When to use

- On the Overview tab of a service or resource that is deployed but still has setup gates before it should take production traffic.
- When the gates are few (three to five), independent and each completed by one action elsewhere in the console.

## When not to use

- Commands to build and deploy a resource for the first time: use `platform/detail/get-started`.
- Ordered steps the user must complete before the resource exists: use `platform/create/provision-wizard` or `platform/create/multipage-create`.
- A list of resources already bound to this one: use `platform/detail/attached-resources`.
- A module the account has never used: use `platform/states/first-use`.

## Building blocks

### A. Checklist card — `Card` (required)

`Card :padded="false"` whose header holds the "Ship to production" title as an `h2` and the progress, and whose content holds the rows. When every gate is done the content is removed and the card carries `data-complete`, so it closes down to its header.

### B. Progress tag — `Tag` (required)

A small `Tag` beside the title: secondary with the count, "1 of 3", while gates remain; success with "Ready for production" when all are done. It is the only progress signal on the card.

### C. Expand button — `IconButton` (required)

A small outlined `IconButton` with the maximize icon at the header's end, `aria-label="Expand the production checklist"`. It opens the drawer with the same steps, their descriptions and their actions.

### D. Gate rows — `Item` (required)

One small `Item` per gate, rendered as a full-width button: the gate's icon, its title and, at the end, a check when done. A done row takes the primary mask fill and a primary icon. Each row carries a screen-reader status, "Done" or "Not started".

## Do

- Order the gates by how much they matter for production; domain first.
- Count done gates in the tag and keep the count in step with the rows.
- In the drawer, give each open gate one outlined action named for what it adds, and replace it with a `Tag` naming what it now serves once done.
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
- **Done note:** what the gate now serves, ending with a period, e.g. "Serving shop.example.com."
- Follow `skills/webkit-microcopy`: no em dash, no "please", no exclamation marks.

## Accessibility

- The card title is an `h2` under the page `h1`; the drawer has its own title.
- The expand button has an `aria-label` that names what it expands.
- Gate icons and the done check are `aria-hidden`; each row announces "Done" or "Not started" in visually hidden text, so status never relies on color.
- Rows are real buttons, reachable by keyboard in reading order.
- The drawer returns focus to the expand button when it closes.

## States

- Card: some gates done; the card lists every gate with the count in its tag.
- Complete: every gate done; the tag reads Ready for production and the rows are gone.
- DrawerDetail: the expand button opened the right-side drawer with every step, its description and its action or done tag, over a Done footer.

## Related

- `platform/detail/details-page` — the service Overview tab that renders this card under the summary.
- `platform/detail/get-started` — onboarding before the first deployment, for a resource made from the CLI.
- `platform/detail/attached-resources` — where an attached policy or error page shows up once added.
- `Item` — the row primitive for each gate; see `skills/webkit-ui-states` for the done and empty states.
