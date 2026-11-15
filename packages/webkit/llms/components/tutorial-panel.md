# Tutorial Panel

> The guide that runs tutorials beside the real product. It lives in the page's tools or help region, lists the tutorials a reader can take, and while one runs it shows the tutorial's tasks and the reader's place in them. The steps themselves happen on the page: each step points at a `Hotspot` placed beside the real control, and the current step opens there in a popover. `TutorialPanel.Provider` wraps the whole page (the content and the tools region), holds the running tutorial and the current step, and is what the panel and every `Hotspot` read. It is the stateful layer over `help-panel`: the panel is a `HelpPanel` with its `Header`, and draws each tutorial with its own internal task list (6.0 moved the former `HelpPanel.Tutorial` and `HelpPanel.Task` here; `HelpPanel` no longer has a tutorial mode). Design call (M2.9, WP app-layout): neither the design sample nor the Console Kit has a guided tutorial, so the model is Cloudscape's tutorial panel, hotspot and annotation context, rebuilt on WebKit parts.

- Import: `import TutorialPanelRoot from '@aziontech/webkit/tutorial-panel-root'`
- Compound import (dot notation, not tree-shakeable): `import TutorialPanel from '@aziontech/webkit/tutorial-panel'`
- Category: content · Surface: app · Structure: composition
- API as JSON: [tutorial-panel.json](https://github.com/aziontech/webkit/blob/main/.specs/tutorial-panel.json)

## When to use

- Use TutorialPanel for guided tutorials whose steps point at real controls through Hotspot.
- A reader learns a product task by doing it on the real screen, step by step, with the instructions pointing at the control they need next.
- A product offers several tutorials in its help region and records which ones the reader finished.
- A first-run or onboarding flow guides the reader through a real create and deploy, not a mock.

## Do

- Wrap the whole page in `TutorialPanel.Provider`, so the panel and every hotspot share one state.
- Keep tutorials as data (`Tutorial[]`): the panel lists them and the hotspots on the page read the same steps. This is the one place a config array is right — the step content is shown away from where it is declared.
- One step, one control. Write the step title as the action (`Name the service`) and the content as one or two sentences.
- Place every `Hotspot` a tutorial names on the page that runs it. A step whose hotspot is missing still shows in the panel, and focus moves to it there.
- Set `completed` on a tutorial from what the product recorded (the `complete` event), not from a click.
- Bind `v-model:active` and `v-model:step` and persist them when a tutorial must survive a navigation.

## Don’t

- Static help beside the page, with no guided run → use `help-panel`.
- The step rail of a multi-step task in the app → use `stepper`, or `wizard` for a create flow with its footer.
- A multi-step create flow whose steps are forms in one surface → use `wizard`.
- Ordered steps the reader navigates inside a page → use `stepper`.
- A single tip pinned to one control → use `popover` or `hint`.
- An empty page that needs one call to action → use `empty-state`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [hotspot](hotspot.md) — the marker beside a real control; the current step opens from it. Every step names one by `hotspotId`.
- [help-panel](help-panel.md) — the parts the panel draws with; use it alone for help without a guided run.
- [popover](popover.md) — what a hotspot opens; the step's title, content and Previous / Next live in it.
- [drawer](drawer.md) — the host of the tools region on narrow screens; the panel goes inside it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | The panel's heading. Empty uses the locale catalog (`Tutorials`). |
| `description` | `string` | `''` | false | One line under the heading. Empty uses the locale catalog. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the panel's landmark. Empty uses the title. |
| `loading` | `boolean` | `false` | false | Renders skeleton lines in place of the content while the tutorials load. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `completion` | { tutorial: Tutorial } | Extra content on the completion screen, such as a feedback link. |

## Sub-component imports

- `@aziontech/webkit/tutorial-panel-provider`

## Sub-components

The root ships a **compound API**: `index.ts` attaches the provider to the panel, so
`<TutorialPanel.Provider>` resolves from the same import. The panel has no open state (the tools region
that hosts it owns that), so there is no `Trigger` / `Content`. State flows through `provide`/`inject`
(`injection-key.ts`, provided by the provider): the panel reads it through
`composables/use-tutorial-panel-context.ts`, which throws outside a provider, and `Hotspot` reads it through
the optional variant, which returns null so a hotspot outside a provider renders only its content.

- `tutorial-panel-provider/tutorial-panel-provider.vue` — Holds the tutorials, the running tutorial (`v-model:active`), the current step (`v-model:step`, flat across tasks), whether the reader dismissed the current step, and the hotspots on the page. Renders only its slot (no element).
  - Props: `tutorials?: Tutorial[]` (default `[]`).
  - Models (`defineModel`): `v-model:active` (`string \| null`, default `null` — the parent owns it when bound, the provider keeps it locally when not), `v-model:step` (`number`, default `0`, same rule; equals the step count once the tutorial is finished).
  - Events: `update:active` (`string \| null`) and `update:step` (`number`) from the models; `start` (`(event: Event, id: string)` — the tutorial id, on Start and Restart), `exit` (`(event: Event, id: string)` — on Exit or Back to tutorials), `complete` (`(event: Event, id: string)` — on Finish of the last step). Each fires from a button the reader activated (in the panel or a `Hotspot` popover, through the context), so the DOM event comes first and the tutorial id second.
  - Slot: `default` — the page, with the panel and every hotspot inside.

- `tutorial-panel-tasks/tutorial-panel-tasks.vue` — internal, not exported: a tutorial's title, description, a progress line derived from the registered tasks (`2 of 3 complete`, `aria-live="polite"`), the ordered task `<ol>` and an actions row. Provides the task registry (`TutorialTasksInjectionKey`) to its tasks. `data-testid` fallback `content-tutorial-panel-tasks`; the panel passes `<testId>__tutorial`. `data-completed` mirrors its `completed` prop.
- `tutorial-panel-task/tutorial-panel-task.vue` — internal, not exported: one task, a numbered marker, a title and its steps. An `<li>` that registers with the task list on mount (ordinal + `status`), `data-status` mirrors `status` (`pending` / `success`), the `active` task (boolean prop) carries `data-active` and `aria-current="step"`, and an `sr-only` status word (`Not started`, `Current task`, `Complete`). Throws outside the task list. `data-testid` fallback `content-tutorial-panel-task`.

Exported types: `Tutorial` (`id`, `title`, `description?`, `completed?`, `tasks`), `TutorialTask` (`title`, `steps`), `TutorialStep` (`title`, `content`, `hotspotId`).

```
packages/webkit/src/components/content/tutorial-panel/
├── tutorial-panel.vue                    (root; the panel views)
├── tutorial-panel.test.ts
├── index.ts                              (compound: attaches Provider)
├── injection-key.ts                      (types + TutorialContext)
├── composables/
│   ├── use-tutorial-panel-context.ts           (strict and optional injectors)
│   └── use-tutorial-panel-tasks-context.ts     (task registry; throws outside the task list)
├── tutorial-panel-provider/
│   └── tutorial-panel-provider.vue
├── tutorial-panel-tasks/
│   └── tutorial-panel-tasks.vue          (internal)
└── tutorial-panel-task/
    └── tutorial-panel-task.vue           (internal)
```

Exports:

```jsonc
"./tutorial-panel": "./src/components/content/tutorial-panel/index.ts",
"./tutorial-panel-root": "./src/components/content/tutorial-panel/tutorial-panel.vue",
"./tutorial-panel-provider": "./src/components/content/tutorial-panel/tutorial-panel-provider/tutorial-panel-provider.vue"
```

Composed DS components (relative imports): `help-panel` (root, `Header`), `button`, `empty-state`, `tag`.

## States

- Visual states: `list`, `running`, `complete`, `empty` (no tutorials, rendered by a small `EmptyState` titled with `tutorialPanel.empty`), `loading`
- `data-view` on the root: `list` | `running` | `complete`
- `data-completed` on each list item mirrors the tutorial's `completed`
- In `running`, each task's status is derived from the current step: `success` when every step of the task is behind it, `pending` otherwise; the task that holds the current step is `active`. The current step's row carries `aria-current="step"`.
- `complete` shows a completion section (check icon, `Tutorial complete`, `You finished <title>.`, the `completion` slot, Restart and Back to tutorials) above the task list, every task complete.

## Accessibility

- Visible focus: the composed `Button`s carry the standard ring; focus targets that are not controls (the list heading, the completion heading, the current step row) take `tabindex="-1"` and `outline-none` because they receive focus only programmatically.
- Keyboard map: `Tab` moves through Start / Restart, Exit, Restart and Back. Focus management: Start moves focus to the current step's popover (through its hotspot) or, when that hotspot is not on the page, to the step's row in the panel; Finish moves focus to the `Tutorial complete` heading; Exit and Back move focus to the list's heading.
- ARIA: the panel is a `HelpPanel` complementary landmark named by `ariaLabel` or the title. Each list item's Start button is described by its tutorial's heading (`aria-describedby`), so repeated buttons are distinct. The task progress line is `aria-live="polite"`. The current step row carries `aria-current="step"`.
- Contrast ≥4.5:1 on muted ink over `--bg-surface` in both themes.
- Touch target: the composed `Button`s (small) meet 24 px; the panel adds no other control.

## Right-to-left

- Layout: logical utilities only; every row is a flex row that follows `dir`.
- Icons: `ai ai-circle-check` (not mirrored), `ai ai-log-out` on Exit (not mirrored; it names the action, not a direction).
- Keyboard: no arrow keys.
- User data: none.

## Internationalization

| Key                                  | English source                                                | Override prop |
| ------------------------------------ | ------------------------------------------------------------- | ------------- |
| `tutorialPanel.title`                | `Tutorials`                                                   | `title`       |
| `tutorialPanel.description`          | `Learn the product by doing a real task, one step at a time.` | `description` |
| `tutorialPanel.listLabel`            | `Available tutorials`                                         | —             |
| `tutorialPanel.empty`                | `No tutorials yet.`                                           | —             |
| `tutorialPanel.start`                | `Start tutorial`                                              | —             |
| `tutorialPanel.restart`              | `Restart tutorial`                                            | —             |
| `tutorialPanel.exit`                 | `Exit tutorial`                                               | —             |
| `tutorialPanel.back`                 | `Back to tutorials`                                           | —             |
| `tutorialPanel.completed`            | `Completed`                                                   | —             |
| `tutorialPanel.completedTitle`       | `Tutorial complete`                                           | —             |
| `tutorialPanel.completedDescription` | `You finished {title}.`                                       | —             |
| `tutorialPanel.taskCount`            | `{count} task` / `{count} tasks`                              | —             |
| `tutorialPanel.stepCount`            | `{count} step` / `{count} steps`                              | —             |

- Formatting: plurals through `Intl.PluralRules` (the catalog's plural messages); tutorial content is the consumer's own text.

## Responsive

- Container queries: inherits `@container/help-panel` from `HelpPanel`; no breakpoint of its own — the list and the task rows stack at every width.
- Narrow: the panel goes inside a `Drawer` (the tools region on phones); its content reflows to the drawer width.
- Touch: targets are the composed small `Button`s (≥ 24 px; the drawer host gives them room).
- Reflow: no horizontal scroll at 320 px; titles wrap.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Hotspot from '@aziontech/webkit/hotspot'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import TutorialPanel from '@aziontech/webkit/tutorial-panel'
  import { ref } from 'vue'

  const tutorials = [
    {
      id: 'first-service',
      title: 'Create your first service',
      description: 'Two tasks, about three minutes.',
      tasks: [
        {
          title: 'Create a service',
          steps: [
            {
              title: 'Start a new service',
              content: 'Select New service. The form opens below the list.',
              hotspotId: 'new-service'
            },
            {
              title: 'Name the service',
              content: 'Type a name your team will recognize, such as storefront-api.',
              hotspotId: 'service-name'
            }
          ]
        },
        {
          title: 'Publish it',
          steps: [
            {
              title: 'Deploy',
              content: 'Select Deploy. The service keeps deploying if you leave this page.',
              hotspotId: 'deploy'
            }
          ]
        }
      ]
    },
    {
      id: 'find-service',
      title: 'Find a service',
      description: 'One task, under a minute.',
      completed: true,
      tasks: [
        {
          title: 'Search the list',
          steps: [
            {
              title: 'Search by name',
              content: 'Type part of a name. The list filters as you type.',
              hotspotId: 'search'
            }
          ]
        }
      ]
    }
  ]

  const active = ref(null)
  const step = ref(0)
  const name = ref('')
  const query = ref('')
</script>

<template>
  <TutorialPanel.Provider
    v-model:active="active"
    v-model:step="step"
    :tutorials="tutorials"
  >
    <div class="@container flex w-full flex-wrap items-start gap-(--spacing-lg)">
      <main class="flex min-w-0 flex-1 basis-(--container-xs) flex-col gap-(--spacing-md)">
        <PageHeader
          title="Services"
          description="Everything your team runs, in one list."
        />
        <div class="flex flex-wrap items-center gap-(--spacing-xs)">
          <div class="min-w-0 flex-1">
            <Hotspot
              hotspot-id="search"
              class="w-full"
            >
              <Input
                v-model="query"
                aria-label="Search services"
                placeholder="Search services"
              />
            </Hotspot>
          </div>
          <Hotspot hotspot-id="new-service">
            <Button
              label="New service"
              icon="ai ai-plus"
              size="medium"
            />
          </Hotspot>
        </div>
        <section
          aria-labelledby="new-service-title"
          class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
        >
          <h2
            id="new-service-title"
            class="text-heading-2xs text-(--text-default)"
          >
            New service
          </h2>
          <Hotspot hotspot-id="service-name">
            <Input
              v-model="name"
              aria-label="Service name"
              placeholder="storefront-api"
            />
          </Hotspot>
          <div class="flex justify-end">
            <Hotspot
              hotspot-id="deploy"
              side="start"
            >
              <Button
                label="Deploy"
                variant="primary"
                size="medium"
              />
            </Hotspot>
          </div>
        </section>
      </main>
      <div
        class="w-full rounded-(--shape-card) border border-(--border-default) @3xl:w-(--container-2xs)"
      >
        <TutorialPanel />
      </div>
    </div>
  </TutorialPanel.Provider>
</template>
```

### Completed

```vue
<script setup>
  import TutorialPanel from '@aziontech/webkit/tutorial-panel'
  import { ref } from 'vue'

  const tutorials = [
    {
      id: 'first-service',
      title: 'Create your first service',
      description: 'Two tasks, about three minutes.',
      tasks: [
        {
          title: 'Create a service',
          steps: [
            {
              title: 'Start a new service',
              content: 'Select New service.',
              hotspotId: 'new-service'
            },
            {
              title: 'Name the service',
              content: 'Type a name your team will recognize.',
              hotspotId: 'service-name'
            }
          ]
        },
        {
          title: 'Publish it',
          steps: [{ title: 'Deploy', content: 'Select Deploy.', hotspotId: 'deploy' }]
        }
      ]
    }
  ]

  const active = ref('first-service')
  const step = ref(3)
</script>

<template>
  <div class="max-w-(--container-xs) rounded-(--shape-card) border border-(--border-default)">
    <TutorialPanel.Provider
      v-model:active="active"
      v-model:step="step"
      :tutorials="tutorials"
    >
      <TutorialPanel>
        <template #completion>
          <a
            href="#feedback"
            class="text-link w-fit"
          >
            Tell us how this tutorial went
          </a>
        </template>
      </TutorialPanel>
    </TutorialPanel.Provider>
  </div>
</template>
```

### Loading

```vue
<script setup>
  import TutorialPanel from '@aziontech/webkit/tutorial-panel'
</script>

<template>
  <div class="max-w-(--container-xs) rounded-(--shape-card) border border-(--border-default)">
    <TutorialPanel.Provider>
      <TutorialPanel loading />
    </TutorialPanel.Provider>
  </div>
</template>
```
