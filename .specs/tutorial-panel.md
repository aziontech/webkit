---
name: tutorial-panel
category: content
structure: composition
status: implemented
spec_version: 7
template: 2
checksum: 09be7d0b10263a5923db3655a1ed9e7a91c7e0dda781ea3da83f12b6c44156f9
created: 2026-11-11
last_updated: 2026-11-15
---

# TutorialPanel — Component Spec

## Purpose

The guide that runs tutorials beside the real product. It lives in the page's tools or help region,
lists the tutorials a reader can take, and while one runs it shows the tutorial's tasks and the
reader's place in them. The steps themselves happen on the page: each step points at a `Hotspot`
placed beside the real control, and the current step opens there in a popover. `TutorialPanel.Provider`
wraps the whole page (the content and the tools region), holds the running tutorial and the current
step, and is what the panel and every `Hotspot` read.

It is the stateful layer over `help-panel`: the panel is a `HelpPanel` with its `Header`, and draws
each tutorial with its own internal task list (6.0 moved the former `HelpPanel.TutorialPanelTutorial` and
`HelpPanel.Task` here; `HelpPanel` no longer has a tutorial mode). Design call (M2.9, WP
app-layout): neither the design sample nor the Console Kit has a guided tutorial, so the model is
Cloudscape's tutorial panel, hotspot and annotation context, rebuilt on WebKit parts.

## When to use

- Use TutorialPanel for guided tutorials whose steps point at real controls through Hotspot.
- A reader learns a product task by doing it on the real screen, step by step, with the instructions pointing at the control they need next.
- A product offers several tutorials in its help region and records which ones the reader finished.
- A first-run or onboarding flow guides the reader through a real create and deploy, not a mock.

## When NOT to use

- Static help beside the page, with no guided run → use `help-panel`.
- The step rail of a multi-step task in the app → use `stepper`, or `wizard` for a create flow with its footer.
- A multi-step create flow whose steps are forms in one surface → use `wizard`.
- Ordered steps the reader navigates inside a page → use `stepper`.
- A single tip pinned to one control → use `popover` or `hint`.
- An empty page that needs one call to action → use `empty-state`.

## Related

- `hotspot` — the marker beside a real control; the current step opens from it. Every step names one by `hotspotId`.
- `help-panel` — the parts the panel draws with; use it alone for help without a guided run.
- `popover` — what a hotspot opens; the step's title, content and Previous / Next live in it.
- `drawer` — the host of the tools region on narrow screens; the panel goes inside it.

## Best practices

- Wrap the whole page in `TutorialPanel.Provider`, so the panel and every hotspot share one state.
- Keep tutorials as data (`TutorialPanelTutorial[]`): the panel lists them and the hotspots on the page read the same steps. This is the one place a config array is right — the step content is shown away from where it is declared.
- One step, one control. Write the step title as the action (`Name the service`) and the content as one or two sentences.
- Place every `Hotspot` a tutorial names on the page that runs it. A step whose hotspot is missing still shows in the panel, and focus moves to it there.
- Set `completed` on a tutorial from what the product recorded (the `complete` event), not from a click.
- Bind `v-model:active` and `v-model:step` and persist them when a tutorial must survive a navigation.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Button from '@aziontech/webkit/button'
  import Hotspot from '@aziontech/webkit/hotspot'
  import TutorialPanel from '@aziontech/webkit/tutorial-panel'

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
  const active = ref(null)
  const step = ref(0)
</script>

<template>
  <TutorialPanel.Provider
    v-model:active="active"
    v-model:step="step"
    :tutorials="tutorials"
  >
    <main>
      <Hotspot hotspot-id="new-service">
        <Button label="New service" />
      </Hotspot>
      <Hotspot hotspot-id="deploy">
        <Button
          label="Deploy"
          variant="primary"
        />
      </Hotspot>
    </main>
    <aside>
      <TutorialPanel />
    </aside>
  </TutorialPanel.Provider>
</template>
```

Tree-shaking alternative — the standalone panel and provider from their own entries:

```vue
<script setup>
  import TutorialPanel from '@aziontech/webkit/tutorial-panel-root'
  import TutorialPanelProvider from '@aziontech/webkit/tutorial-panel-provider'
</script>
```

## Sub-components

The root ships a **compound API**: `index.ts` attaches the provider to the panel, so
`<TutorialPanel.Provider>` resolves from the same import. The panel has no open state (the tools region
that hosts it owns that), so there is no `Trigger` / `Content`. State flows through `provide`/`inject`
(`injection-key.ts`, provided by the provider): the panel reads it through
`composables/use-tutorial-panel-context.ts`, which throws outside a provider, and `Hotspot` reads it through
the optional variant, which returns null so a hotspot outside a provider renders only its content.

- `tutorial-panel-provider/tutorial-panel-provider.vue` — Holds the tutorials, the running tutorial (`v-model:active`), the current step (`v-model:step`, flat across tasks), whether the reader dismissed the current step, and the hotspots on the page. Renders only its slot (no element).
  - Props: `tutorials?: TutorialPanelTutorial[]` (default `[]`).
  - Models (`defineModel`): `v-model:active` (`string \| null`, default `null` — the parent owns it when bound, the provider keeps it locally when not), `v-model:step` (`number`, default `0`, same rule; equals the step count once the tutorial is finished).
  - Events: `update:active` (`string \| null`) and `update:step` (`number`) from the models; `start` (`(event: Event, id: string)` — the tutorial id, on Start and Restart), `exit` (`(event: Event, id: string)` — on Exit or Back to tutorials), `complete` (`(event: Event, id: string)` — on Finish of the last step). Each fires from a button the reader activated (in the panel or a `Hotspot` popover, through the context), so the DOM event comes first and the tutorial id second.
  - Slot: `default` — the page, with the panel and every hotspot inside.

- `parts/tutorial-panel-tasks.vue` — internal, not exported: a tutorial's title, description, a progress line derived from the registered tasks (`2 of 3 complete`, `aria-live="polite"`), the ordered task `<ol>` and an actions row. Provides the task registry (`TutorialTasksInjectionKey`) to its tasks. `data-testid` fallback `content-tutorial-panel-tasks`; the panel passes `<testId>__tutorial`. `data-completed` mirrors its `completed` prop.
- `parts/tutorial-panel-task.vue` — internal, not exported: one task, a numbered marker, a title and its steps. An `<li>` that registers with the task list on mount (ordinal + `status`), `data-status` mirrors `status` (`pending` / `success`), the `active` task (boolean prop) carries `data-active` and `aria-current="step"`, and an `sr-only` status word (`Not started`, `Current task`, `Complete`). Throws outside the task list. `data-testid` fallback `content-tutorial-panel-task`.

Exported types: `TutorialPanelTutorial` (`id`, `title`, `description?`, `completed?`, `tasks`), `TutorialPanelTaskData` (`title`, `steps`), `TutorialPanelStep` (`title`, `content`, `hotspotId`).

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

## Props

| Prop          | Type      | Default | Required | JSDoc                                                                    |
| ------------- | --------- | ------- | -------- | ------------------------------------------------------------------------ |
| `title`       | `string`  | `''`    | false    | The panel's heading. Empty uses the locale catalog (`Tutorials`).        |
| `description` | `string`  | `''`    | false    | One line under the heading. Empty uses the locale catalog.               |
| `ariaLabel`   | `string`  | `''`    | false    | Accessible name for the panel's landmark. Empty uses the title.          |
| `loading`     | `boolean` | `false` | false    | Renders skeleton lines in place of the content while the tutorials load. |

## Events

_No events on the panel — every action goes through the provider, which emits `start`, `exit`, `complete`, `update:active` and `update:step`._

## Slots

| Slot         | Scope                                 | Notes                                                            |
| ------------ | ------------------------------------- | ---------------------------------------------------------------- |
| `completion` | `{ tutorial: TutorialPanelTutorial }` | Extra content on the completion screen, such as a feedback link. |

## States

- Visual states: `list`, `running`, `complete`, `empty` (no tutorials, rendered by a small `EmptyState` titled with `tutorialPanel.emptyTitle`), `loading`
- `data-view` on the root: `list` | `running` | `complete`
- `data-completed` on each list item mirrors the tutorial's `completed`
- In `running`, each task's status is derived from the current step: `success` when every step of the task is behind it, `pending` otherwise; the task that holds the current step is `active`. The current step's row carries `aria-current="step"`.
- `complete` shows a completion section (check icon, `TutorialPanelTutorial complete`, `You finished <title>.`, the `completion` slot, Restart and Back to tutorials) above the task list, every task complete.

## Motion & Animations

| Trigger            | Animation / Transition                                           | Token                                                    | Reduced-motion fallback         |
| ------------------ | ---------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------- |
| task status change | `transition-colors` on the task marker and title (internal task) | inline · `duration-fast-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| loading            | owned by `HelpPanel` (`Skeleton`)                                | component                                                | handled by `Skeleton`           |

## Tokens

| Region                              | Token (DESIGN.md)                                              |
| ----------------------------------- | -------------------------------------------------------------- |
| typography (tutorial title in list) | `.text-heading-2xs`                                            |
| typography (description, steps)     | `.text-body-sm`                                                |
| typography (counts, current step)   | `.text-label-sm`, `.text-label-md`                             |
| title ink                           | `var(--text-default)`                                          |
| muted ink                           | `var(--text-muted)`                                            |
| completion icon                     | `var(--text-success)`                                          |
| list item and completion surface    | `var(--bg-surface)`                                            |
| list item border                    | `var(--border-default)`                                        |
| shape                               | `var(--shape-card)`                                            |
| padding (item)                      | `var(--spacing-sm)`                                            |
| gap                                 | `var(--spacing-xs)`, `var(--spacing-sm)`, `var(--spacing-2xs)` |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the composed `Button`s carry the standard ring; focus targets that are not controls (the list heading, the completion heading, the current step row) take `tabindex="-1"` and `outline-none` because they receive focus only programmatically.
- Keyboard map: `Tab` moves through Start / Restart, Exit, Restart and Back. Focus management: Start moves focus to the current step's popover (through its hotspot) or, when that hotspot is not on the page, to the step's row in the panel; Finish moves focus to the `TutorialPanelTutorial complete` heading; Exit and Back move focus to the list's heading.
- ARIA: the panel is a `HelpPanel` complementary landmark named by `ariaLabel` or the title. Each list item's Start button is described by its tutorial's heading (`aria-describedby`), so repeated buttons are distinct. The task progress line is `aria-live="polite"`. The current step row carries `aria-current="step"`.
- Contrast ≥4.5:1 on muted ink over `--bg-surface` in both themes.
- Touch target: the composed `Button`s (small) meet 24 px; the panel adds no other control.

## Internationalization

| Key                                  | English source                                                | Override prop |
| ------------------------------------ | ------------------------------------------------------------- | ------------- |
| `tutorialPanel.title`                | `Tutorials`                                                   | `title`       |
| `tutorialPanel.description`          | `Learn the product by doing a real task, one step at a time.` | `description` |
| `tutorialPanel.listLabel`            | `Available tutorials`                                         | —             |
| `tutorialPanel.emptyTitle`           | `No tutorials yet.`                                           | —             |
| `tutorialPanel.start`                | `Start tutorial`                                              | —             |
| `tutorialPanel.restart`              | `Restart tutorial`                                            | —             |
| `tutorialPanel.exit`                 | `Exit tutorial`                                               | —             |
| `tutorialPanel.back`                 | `Back to tutorials`                                           | —             |
| `tutorialPanel.completed`            | `Completed`                                                   | —             |
| `tutorialPanel.completedTitle`       | `TutorialPanelTutorial complete`                              | —             |
| `tutorialPanel.completedDescription` | `You finished {title}.`                                       | —             |
| `tutorialPanel.taskCount`            | `{count} task` / `{count} tasks`                              | —             |
| `tutorialPanel.stepCount`            | `{count} step` / `{count} steps`                              | —             |

- Formatting: plurals through `Intl.PluralRules` (the catalog's plural messages); tutorial content is the consumer's own text.

## Right-to-left

- Layout: logical utilities only; every row is a flex row that follows `dir`.
- Icons: `ai ai-circle-check` (not mirrored), `ai ai-log-out` on Exit (not mirrored; it names the action, not a direction).
- Keyboard: no arrow keys.
- User data: none.

## Responsive

- Container queries: inherits `@container/help-panel` from `HelpPanel`; no breakpoint of its own — the list and the task rows stack at every width.
- Narrow: the panel goes inside a `Drawer` (the tools region on phones); its content reflows to the drawer width.
- Touch: targets are the composed small `Button`s (≥ 24 px; the drawer host gives them room).
- Reflow: no horizontal scroll at 320 px; titles wrap.

## Performance

- Bundle budget: `tutorial-panel` 9 KB, `tutorial-panel-root` 8.25 KB, `tutorial-panel-provider` 1.25 KB (gzip, `.size-limit.json`).
- Runtime budget: none: a tutorial holds tens of steps; derived state is computed per change.
- Heavy parts: none.

## Examples

- Default — the example page: the panel beside a page with hotspots; start a tutorial to see the run.
- Completed — the completion screen with the `completion` slot. Justified because the completion view is a different state of the provider, not an args delta of the panel.
- Loading — `loading` only.

## Open questions

- A step whose hotspot sits on another route: the panel shows it and focuses it, but the reader has no Next in the panel. Cloudscape behaves the same; revisit if a product needs cross-route tutorials.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
