# Doc Steps

> The ordered walkthrough from the docs frame: a column of `DocStep` children joined by a rail. Each step registers itself through the context this root provides and reads its number back, so the numbering is a fact of the document order — an author writes titles, never numbers, and reordering the page renumbers it. The final registered step is marked last, which is what drops its connector and trailing space.

- Import: `import DocSteps from '@aziontech/webkit/doc-steps'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-steps.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-steps.json)

## When to use

- A procedure the reader performs in order: install, link, deploy.
- Any "follow these steps" band in documentation prose, however short.

## Do

- Start each step title with the verb; keep the how in the step's body.
- Let the numbering be the document order — never encode a number into a title.
- Give a step a body only when the heading alone does not carry it; the rail stretches to cover whatever the body holds.

## Don’t

- For a wizard or form flow inside the application — that is the console's own stepper surface, not documentation chrome.
- For an unordered list of options or features — order is the whole claim this component makes; a list that has none is a plain list or `DocItem` rows.
- For a single instruction — one step is a sentence, not a walkthrough.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocStep` — the sibling root this numbers; a step registers with this context on mount and throws when rendered outside one.
- DocProse` — the contract around it. The column marks itself `data-doc-block`, so it takes the block rung of the prose ladder.

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The `DocStep` children, in the order they should be numbered. |

## States

- Visual states: `default` (the column is not interactive and holds no visual state of its own)
- Provides the numbering context: each `DocStep` registers on mount and deregisters on unmount; `index` is the 1-based document order and `last` marks the final registration, which suppresses that step's connector
- `data-doc-block` is the `DocProse` contract (the column takes the block rung of the ladder)

## Accessibility

- Visible focus: the column is not focusable; `Tab` reaches only interactive content nested inside a step's body.
- Keyboard map: none of its own.
- ARIA: the column is a plain block. The circled indices and the rail are decorative (`aria-hidden`, owned by `DocStep`), so assistive tech reads the step headings and bodies in document order — the same order the numbers claim.
- Contrast: inherited from `DocStep`; the column paints nothing.
- Touch target: not applicable; the component is not interactive.

## Examples

### Default

```vue
<script setup>
  import DocStep from '@aziontech/webkit/doc-step'
  import DocSteps from '@aziontech/webkit/doc-steps'
</script>

<template>
  <DocSteps>
    <DocStep title="Access Azion Console." />
    <DocStep title="Click + Create on the homepage." />
    <DocStep title="Select your preferred template to start your project." />
    <DocStep title="Fill in the fields the template asks for." />
    <DocStep title="Customize the elements using the sidebar tools." />
  </DocSteps>
</template>
```

### WithBody

```vue
<script setup>
  import DocStep from '@aziontech/webkit/doc-step'
  import DocSteps from '@aziontech/webkit/doc-steps'
</script>

<template>
  <DocSteps>
    <DocStep title="Install the Azion CLI">
      <p>
        Homebrew is the shortest path on macOS; every other platform is documented in the CLI
        reference.
      </p>
    </DocStep>
    <DocStep title="Link the project">
      <p>
        Reads your project, picks a preset, and writes the <code>azion/</code> folder that describes
        the workload.
      </p>
    </DocStep>
    <DocStep title="Deploy" />
  </DocSteps>
</template>
```
