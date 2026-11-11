# Doc Step

> One numbered step of a `DocSteps` walkthrough: the circled index, the rail that continues to the next step, the step heading, and any content the author nests underneath. The number and the last-step mark come from the `DocSteps` context — the step registers itself during setup and reads its reactive index back, so an author writes a title and never a number. Rendered outside a `DocSteps` provider it throws (`useDocStepsContext must be used within DocSteps.`) instead of rendering unnumbered.

- Import: `import DocStep from '@aziontech/webkit/doc-step'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-step.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-step.json)

## When to use

- Only as a direct child of `DocSteps`, one per instruction the reader performs.

## Do

- Lead the title with the verb and keep it to one line of instruction.
- Put elaboration — prose, a code block, another component — in the body slot, not in the title.
- Never restate the number in the title; the circle carries it.

## Don’t

- Anywhere outside a `DocSteps` column — the context composable throws by design.
- For a checklist entry or a feature bullet — a step claims an order and a number.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocSteps` — the sibling root that numbers this; it provides the context this step registers with.
- DocProse` — the step heading marks itself `data-doc-chrome`, so prose rules stop at its edge.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | The step heading. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Optional body under the step heading: prose, code, or another component. |

## States

- Visual states: `default` (the step is not interactive)
- The final step drops its connector rail and trailing space through a last-child CSS variant, not through state. "Am I last?" is a question about DOM order, and a registration count answers it wrong: the count grows while the parent is still rendering, so every step would read it as it stood at its own setup
- `data-step-connector` marks the rail element, so its presence is testable structurally
- `data-doc-chrome` on the heading is the `DocProse` contract (prose rules stop here)

## Accessibility

- Visible focus: the step is not focusable; `Tab` reaches only interactive content nested in its body.
- Keyboard map: none of its own.
- ARIA: the circled index and the rail are decorative (`aria-hidden`); the heading text and the body are the step's accessible content, read in document order — the same order the numbers claim.
- Contrast ≥4.5:1 (text): the heading and the index use `var(--text-default)` on the page and `var(--bg-surface)` respectively, the same pairing the rest of the layer measures AA on.
- Touch target: not applicable; the component is not interactive.

## Usage

```vue
<script setup>
  import DocStep from '@aziontech/webkit/doc-step'
  import DocSteps from '@aziontech/webkit/doc-steps'
</script>

<template>
  <DocSteps>
    <DocStep title="Install the Azion CLI"> Homebrew is the shortest path on macOS. </DocStep>
    <DocStep title="Deploy" />
  </DocSteps>
</template>
```
