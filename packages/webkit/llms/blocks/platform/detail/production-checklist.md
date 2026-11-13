# ProductionChecklist (`platform/detail/production-checklist`)

> A production checklist on a resource overview: a card that names the gates between the generated hostname and production, counts how many are done and lists each as a row, with an expand button that opens the same list as a drawer where every step carries its description and its action. Once every gate is done the card collapses to its title with a Ready for production Tag. Rendered on a resource’s Overview tab. Built from `Card`, `Item`, `Tag`, `IconButton`, `Drawer`, `PanelHeader`, `PanelContent`, `PanelFooter` and `Button`.

- Surface: product
- Source: `blocks/platform/detail/production-checklist/production-checklist.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/detail/production-checklist")`
- Components: [Button](../../../components/button.md), [Card](../../../components/card.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, [IconButton](../../../components/icon-button.md), [Item](../../../components/item.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [Tag](../../../components/tag.md)
- Skills: `webkit-ui-states`, `webkit-microcopy`

## Asked as

production checklist; go-live checklist; checklist; setup progress; launch steps; onboarding checklist; checklist de produção; lista de verificação; passos para produção

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

One small `Item` per gate, rendered as a full-width button: the gate's icon, its title and, at the end, a check when done. A done row takes the primary mask fill and a primary icon. Each row carries a screen-reader status, "Done" or "Not started", and opens the drawer like the expand button.

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

- Card: some gates done; the card lists every gate with the count in its tag.
- Complete: every gate done; the tag reads Ready for production and the rows are gone.
- DrawerDetail: the expand button opened the right-side drawer with every step, its description and its action or its Done tag and note, over a Done footer; a card row opens the same drawer.

## Related

- `platform/detail/details-page` — the service Overview tab that renders this card under the summary.
- `platform/detail/get-started` — onboarding before the first deployment, for a resource made from the CLI.
- `platform/detail/attached-resources` — where an attached policy or error page shows up once added.
- `Item` — the row primitive for each gate; see `skills/webkit-ui-states` for the done and empty states.

## Variants

- `Card` — primary (the code below)
- `Complete` — Every gate done: the Tag turns into a success Ready for production, the rows are gone and the header loses its bottom border, so the card closes down to its title and the expand button.
- `DrawerDetail` — The expand button opens a right-side drawer with the same progress Tag, the checklist description, every step with its description, and either its action or, once done, a Tag with what it now serves, over a Done footer.

Each variant is the same screen in another state: `get_pattern("platform/detail/production-checklist", { variant })`, or the file under `blocks/platform/detail/production-checklist/variants/`.

## Code (`Card`)

```vue
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  const steps = [
    {
      id: 'domain',
      icon: 'pi pi-globe',
      title: 'Add a custom domain',
      description:
        'Serve this service on a domain of your own, with a free HTTPS certificate, instead of the generated hostname.',
      actionLabel: 'Add Domain',
      done: true,
      doneNote: 'Serving shop.example.com.'
    },
    {
      id: 'policy',
      icon: 'pi pi-shield',
      title: 'Enable a security policy',
      description:
        'Attach a policy so requests are inspected before they reach the service. Rate limiting, access rules, and IP allowlists.',
      actionLabel: 'Attach Policy',
      done: false,
      doneNote: ''
    },
    {
      id: 'customPage',
      icon: 'pi pi-file',
      title: 'Set custom error pages',
      description: 'Answer 4xx and 5xx with your own page instead of the default response.',
      actionLabel: 'Add Error Page',
      done: false,
      doneNote: ''
    }
  ]

  const doneCount = computed(() => steps.filter((step) => step.done).length)
  const complete = computed(() => steps.length > 0 && doneCount.value === steps.length)
</script>

<template>
  <Card
    :padded="false"
    :data-complete="complete || null"
  >
    <template #header>
      <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
        <h2 class="truncate text-label-md text-(--text-default)">Ship to production</h2>

        <Tag
          :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
          :severity="complete ? 'success' : 'secondary'"
          size="small"
          class="shrink-0"
        />
      </div>

      <IconButton
        icon="pi pi-window-maximize"
        aria-label="Expand the production checklist"
        kind="outlined"
        size="small"
        class="shrink-0"
      />
    </template>

    <template #content>
      <div
        v-if="!complete"
        class="flex flex-col"
      >
        <div
          v-for="step in steps"
          :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
          :data-done="step.done || null"
          class="group/step transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
        >
          <Item
            size="small"
            clickable
          >
            <Item.Media>
              <i
                :class="step.icon"
                class="text-body-sm leading-none text-(--text-muted) group-data-done/step:text-(--primary)"
                aria-hidden="true"
              />
            </Item.Media>

            <Item.Content>
              <Item.Title>
                {{ step.title }}
              </Item.Title>
            </Item.Content>

            <Item.Actions>
              <i
                v-if="step.done"
                class="pi pi-check text-body-sm leading-none text-(--primary)"
                aria-hidden="true"
              />
              <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
            </Item.Actions>
          </Item>
        </div>
      </div>
    </template>
  </Card>
</template>
```
