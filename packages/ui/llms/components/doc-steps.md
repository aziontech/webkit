# Doc Steps

> The ordered walkthrough from the docs frame: a column of `DocSteps.Step` children joined by a rail. Each step registers itself through the context this root provides and reads its number back, so the numbering is a fact of the document order — an author writes titles, never numbers, and reordering the page renumbers it. The final registered step is marked last, which is what drops its connector and trailing space.

- Import: `import DocStepsRoot from '@aziontech/webkit/doc-steps-root'`
- Compound import (dot notation, not tree-shakeable): `import DocSteps from '@aziontech/webkit/doc-steps'`
- Category: docs · Surface: docs · Structure: composition
- API as JSON: [doc-steps.json](doc-steps.json)

## When to use

- Use DocSteps only inside documentation prose for numbered instructions read top to bottom.
- A procedure the reader performs in order: install, link, deploy.
- Any "follow these steps" band in documentation prose, however short.

## Do

- Start each step title with the verb; keep the how in the step's body.
- Let the numbering be the document order — never encode a number into a title.
- Give a step a body only when the heading alone does not carry it; the rail stretches to cover whatever the body holds.

## Don’t

- For a wizard or form flow inside the application — that is `Stepper` (or `Wizard`), not documentation chrome.
- For an unordered list of options or features — order is the whole claim this component makes; a list that has none is a plain list or `DocItem` rows.
- For a single instruction — one step is a sentence, not a walkthrough.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `Stepper` — the app's interactive step rail. Both number their steps with the same shared step registry (`useStepRegistry`), which reads the order from the page, so a step inserted between two others takes its place in the count.
- `DocProse` — the contract around it. The column marks itself `data-doc-block`, so it takes the block rung of the prose ladder.

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The `DocSteps.Step` children, in the order they should be numbered. |

## Sub-components

- `doc-steps.vue` — the root column; provides the numbering context.
- `doc-steps-step.vue` — `DocSteps.Step`, one numbered step: the circled index, the rail that continues to the next step, the step heading (`title` prop, `''` default) and an optional body in its default slot. It registers with the root's context during setup and reads its index back, so an author writes a title and never a number; rendered outside `DocSteps` it throws (`useDocStepsContext must be used within DocSteps.`). The circle and the rail are `aria-hidden`; the heading carries `data-doc-chrome`, the rail `data-step-connector`, the body `data-step-body`; the final step drops its rail through a last-child CSS variant. Test id `doc-steps-step`. It has no standalone export: it only renders inside `DocSteps`, so it ships attached to the compound.

## States

- Visual states: `default` (the column is not interactive and holds no visual state of its own)
- Provides the numbering context (the shared step registry): each `DocSteps.Step` registers in setup, hands over its element on mount and deregisters on unmount; `index` is the 1-based position on the page; the final step's connector is suppressed by a last-child CSS variant
- `data-doc-block` is the `DocProse` contract (the column takes the block rung of the ladder)

## Accessibility

- Visible focus: the column is not focusable; `Tab` reaches only interactive content nested inside a step's body.
- Keyboard map: none of its own.
- ARIA: the column is an ordered list (`ol`, its markers removed) and each `DocSteps.Step` a list item (`li`), so assistive tech announces the step count and each step's position ("2 of 5"). The circled indices and the rail are decorative (`aria-hidden`, owned by `DocSteps.Step`): the list position already says the number, so it is not read twice. The step title stays text, not a heading: a heading level would need a new prop.
- Contrast: inherited from `DocSteps.Step`; the column paints nothing.
- Touch target: not applicable; the component is not interactive.

## Examples

### Default

```vue
<script setup>
  import DocSteps from '@aziontech/webkit/doc-steps'
</script>

<template>
  <DocSteps>
    <DocSteps.Step title="Access Azion Console." />
    <DocSteps.Step title="Click + Create on the homepage." />
    <DocSteps.Step title="Select your preferred template to start your project." />
    <DocSteps.Step title="Fill in the fields the template asks for." />
    <DocSteps.Step title="Customize the elements using the sidebar tools." />
  </DocSteps>
</template>
```

### WithBody

```vue
<script setup>
  import DocSteps from '@aziontech/webkit/doc-steps'
</script>

<template>
  <DocSteps>
    <DocSteps.Step title="Install the Azion CLI">
      <p>
        Homebrew is the shortest path on macOS; every other platform is documented in the CLI
        reference.
      </p>
    </DocSteps.Step>
    <DocSteps.Step title="Link the project">
      <p>
        Reads your project, picks a preset, and writes the <code>azion/</code> folder that describes
        the workload.
      </p>
    </DocSteps.Step>
    <DocSteps.Step title="Deploy" />
  </DocSteps>
</template>
```
