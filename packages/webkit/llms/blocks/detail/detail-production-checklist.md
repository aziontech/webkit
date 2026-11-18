# DetailProductionChecklist (`detail/detail-production-checklist`)

> A production checklist on a resource overview: a card that names the gates between the generated hostname and production, counts how many are done and lists each as a row, with an expand button (named by a `Tooltip`) and clickable rows that open the same list as a drawer where every step carries its description and its action. Once every gate is done the card collapses to its title with a Ready for production Tag. Rendered on a resource’s Overview tab. Built from `Card`, `Item`, `Tag`, `IconButton`, `Tooltip`, `Drawer`, `PanelHeader`, `PanelBody`, `PanelFooter` and `Button`.

- Surface: app
- Source: `blocks/detail/detail-production-checklist/detail-production-checklist.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/detail-production-checklist")`
- Components: [Button](../../components/button.md), [Card](../../components/card.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [IconButton](../../components/icon-button.md), [Item](../../components/item.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [Tag](../../components/tag.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-ui-states`, `webkit-microcopy`

## Asked as

production checklist; go-live checklist; checklist; setup progress; launch steps; onboarding checklist; checklist de produção; lista de verificação; passos para produção

A service that is live on its generated hostname is not yet ready for real traffic. This card tells the user what stands between the service and production (a custom domain, a security policy, custom error pages), how many of those gates are done and which one to take next. It expands into a drawer where each gate explains itself and offers its action, and it shrinks to a single line once every gate is done.

## When to use

- Use detail-production-checklist inside a resource's Overview tab for the few setup gates left before production traffic; it is a card, not a page.
- On the Overview tab of a service or resource that is deployed but still has setup gates before it should take production traffic.
- When the gates are few (three to five), independent and each completed by one action elsewhere in the console.

## When not to use

- Commands to build and deploy a resource for the first time: use `detail/detail-get-started`.
- Ordered steps the user must complete before the resource exists: use `create/create-wizard`.
- A list of resources already bound to this one: use `detail/detail-domains-card`.
- A module the account has never used: use `state/state-first-use`.

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

The block takes its gates through props and emits every action; it fetches nothing. `ProductionChecklistStep` and `ProductionChecklistProps` are exported from `detail-production-checklist.vue`, and `sample.ts` holds the sample gates the block renders when `steps` is left out.

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
  import DetailProductionChecklist, {
    type ProductionChecklistStep
  } from './detail-production-checklist.vue'

  const { data } = useServiceReadiness()
  const router = useRouter()

  const onStepAction = (_event: MouseEvent, step: ProductionChecklistStep) =>
    router.push(`/service/setup/${step.id}`)
</script>

<template>
  <DetailProductionChecklist
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

- `detail/detail-resource` — the service Overview tab that renders this card under the summary.
- `detail/detail-get-started` — onboarding before the first deployment, for a resource made from the CLI.
- `detail/detail-domains-card` — where an attached policy or error page shows up once added.
- `Item` — the row primitive for each gate; see `skills/webkit-ui-states` for the done and empty states.

## Variants

- `Card` — primary (the code below)
- `Success` — Every gate done: the Tag turns into a success Ready for production, the rows are gone and the header loses its bottom border, so the card closes down to its title and the expand button.
- `DrawerDetail` — The drawer open, as the expand button or a row opens it: a right-side drawer with the same progress Tag, the checklist description, every step with its description, and either its action or, once done, a Tag with what it now serves, over a Done footer.

Each variant is the same screen in another state: `get_block("detail/detail-production-checklist", { variant })`, or the file under `blocks/detail/detail-production-checklist/variants/`.

## Code (`Card`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import { sampleSteps } from './sample'

  /** One gate between the generated hostname and production. */
  export interface ProductionChecklistStep {
    /** Stable id of the gate. */
    id: string
    /** Icon class of the gate. */
    icon: string
    /** Verb-first gate title. */
    title: string
    /** What the gate gives the service, shown in the drawer. */
    description: string
    /** Label of the drawer action; empty uses the title. */
    actionLabel: string
    /** Whether the gate is done. */
    done: boolean
    /** What the gate now serves, shown beside the Done tag. */
    doneNote: string
  }

  export interface ProductionChecklistProps {
    /** The gates, in order. Left out, the sample renders. */
    steps?: ProductionChecklistStep[]
    /** Opens the drawer on mount. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<ProductionChecklistProps>(), {
    steps: undefined,
    defaultOpen: false
  })

  const emit = defineEmits<{
    /** A gate action in the drawer was pressed. */
    'step-action': [event: MouseEvent, step: ProductionChecklistStep]
    /** The drawer Done button was pressed. */
    done: [event: MouseEvent]
  }>()

  const open = ref(props.defaultOpen)

  const steps = computed(() => props.steps ?? sampleSteps)

  const onStepAction = (event: MouseEvent, step: ProductionChecklistStep) => {
    open.value = false
    emit('step-action', event, step)
  }

  const onDone = (event: MouseEvent) => {
    open.value = false
    emit('done', event)
  }

  const doneCount = computed(() => steps.value.filter((step) => step.done).length)
  const complete = computed(() => steps.value.length > 0 && doneCount.value === steps.value.length)
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
          :severity="complete ? 'success' : 'neutral'"
          size="small"
          class="shrink-0"
        />
      </div>

      <Tooltip
        content="Expand"
        class="shrink-0"
      >
        <IconButton
          icon="az az-app-window"
          aria-label="Expand the production checklist"
          variant="outline"
          size="small"
          @click="open = true"
        />
      </Tooltip>
    </template>

    <template #default>
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
            @click="open = true"
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
                class="az az-check text-body-sm leading-none text-(--primary)"
                aria-hidden="true"
              />
              <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
            </Item.Actions>
          </Item>
        </div>
      </div>
    </template>
  </Card>

  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)">
            <DrawerTitle>Ship to production</DrawerTitle>
            <Tag
              :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
              :severity="complete ? 'success' : 'neutral'"
              size="small"
              class="shrink-0"
            />
          </div>
          <p class="text-body-sm text-(--text-muted)">
            This service is live on a generated hostname. These steps take it to production.
          </p>
        </div>
      </PanelHeader>

      <PanelBody>
        <div class="flex flex-col gap-(--spacing-sm)">
          <Item
            v-for="step in steps"
            :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
            size="medium"
            :data-done="step.done || null"
          >
            <Item.Media>
              <span
                class="flex size-8 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-data-done/item:border-(--primary) group-data-done/item:bg-transparent group-data-done/item:text-(--primary) motion-reduce:transition-none"
                aria-hidden="true"
              >
                <i
                  :class="step.done ? 'az az-check' : step.icon"
                  class="text-body-sm leading-none"
                />
              </span>
            </Item.Media>

            <Item.Content>
              <Item.Title>
                {{ step.title }}
              </Item.Title>
              <Item.Description>
                {{ step.description }}
              </Item.Description>
            </Item.Content>

            <Item.Footer>
              <div
                v-if="step.done"
                class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
              >
                <Tag
                  icon="az az-check"
                  label="Done"
                  severity="neutral"
                  size="medium"
                />
                <span
                  v-if="step.doneNote"
                  class="min-w-0 text-body-sm text-(--text-muted)"
                  >{{ step.doneNote }}</span
                >
              </div>
              <Button
                v-else
                :label="step.actionLabel || step.title"
                variant="outline"
                size="small"
                @click="onStepAction($event, step)"
              />
            </Item.Footer>
          </Item>
        </div>
      </PanelBody>

      <PanelFooter>
        <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
          <Button
            label="Done"
            variant="primary"
            size="medium"
            @click="onDone"
          />
        </div>
      </PanelFooter>
    </DrawerContent>
  </Drawer>
</template>
```

## `sample.ts`

```ts
import type { ProductionChecklistStep } from './detail-production-checklist.vue'

export const sampleSteps: ProductionChecklistStep[] = [
  {
    id: 'domain',
    icon: 'az az-globe',
    title: 'Add a custom domain',
    description:
      'Serve this service on a domain of your own, with a free HTTPS certificate, instead of the generated hostname.',
    actionLabel: 'Add Domain',
    done: true,
    doneNote: 'Serving shop.example.com.'
  },
  {
    id: 'policy',
    icon: 'az az-shield',
    title: 'Enable a security policy',
    description:
      'Attach a policy so requests are inspected before they reach the service. Rate limiting, access rules, and IP allowlists.',
    actionLabel: 'Attach Policy',
    done: false,
    doneNote: ''
  },
  {
    id: 'customPage',
    icon: 'az az-file',
    title: 'Set custom error pages',
    description: 'Answer 4xx and 5xx with your own page instead of the default response.',
    actionLabel: 'Add Error Page',
    done: false,
    doneNote: ''
  }
]

export const sampleCompletedSteps: ProductionChecklistStep[] = [
  { ...sampleSteps[0] },
  { ...sampleSteps[1], done: true, doneNote: 'Protected by policy-production.' },
  { ...sampleSteps[2], done: true, doneNote: 'Serving Branded 404.' }
]
```
