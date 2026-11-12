# Hotspot

> Marks a real control as a step of a tutorial. It wraps the control and, while a tutorial that names its `hotspotId` runs, draws a small marker beside it. The current step's marker pulses and opens the step in a popover: the step's title, `Step n of N` with the task's name, the instructions, and Previous / Next (Finish on the last step). Outside a running tutorial, or outside a `TutorialPanel.Provider`, it renders only the wrapped control, so hotspots can stay on a page for good.

- Import: `import Hotspot from '@aziontech/webkit/hotspot'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [hotspot.json](https://github.com/aziontech/webkit/blob/main/.specs/hotspot.json)

## When to use

- A tutorial step is about one control on the page, and the reader should see where it is.
- The page runs inside a `TutorialPanel.Provider` and offers guided tutorials from its help region.

## Do

- Wrap exactly the control the step is about; keep the marker beside it, not inside a long row.
- Use `side="start"` when the control sits at the end of a row and the marker would overflow.
- One `hotspotId` per control and per page. The same id on two elements opens two popovers.
- Keep step content short: the popover is a small surface over the real UI.

## Don’t

- A permanent tip on a control → use `hint` or `popover`.
- A new feature announcement with no tutorial behind it → use `popover` or an `alert`.
- Help text for a form field → use the field's `helper-text`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tutorial-panel](tutorial-panel.md) — the provider holds the steps a hotspot shows; the panel lists and runs the tutorials.
- [popover](popover.md) — the overlay the current step opens in.
- [help-panel](help-panel.md) — static help without a guided run.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `hotspotId` | `string` | `—` | true | Matches the `hotspotId` of a tutorial step; the marker shows while that step's tutorial runs. |
| `side` | `'start' \| 'end'` | `'end'` | false | Which side of the wrapped control the marker sits on, in reading direction. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The real control the step is about. |

## States

- Visual states: `inactive` (no marker), `active` (static marker: the step belongs to the running tutorial), `current` (marker filled and pulsing, popover open), `dismissed` (current step closed by the reader: marker filled, no pulse, popover closed)
- `data-active` on the root when the marker shows; `data-current` on the root and on the marker for the current step
- `data-side` mirrors `side`
- The popover's `data-state` is `open` | `closed` (owned by `Popover`)

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the marker.
- Keyboard map: the marker is a `button` in the tab order after the wrapped control (before it with `side="start"`); `Enter` / `Space` opens its step (and makes it current). Inside the popover `Tab` cycles Close, Previous and Next (the `Popover` loop); `Esc` closes the step and returns focus to the marker. Next, Previous and the marker move focus into the new step's popover; Finish moves focus to the panel's completion heading.
- ARIA: the marker is named `Tutorial step: <title>` and carries `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls` (from `Popover.Trigger`). The popover is a non-modal `dialog` labelled by the step title and described by `Step n of N`. The pulse ring and dot are `aria-hidden`.
- Contrast: the marker's `--primary` against the canvas ≥3:1 (non-text) in both themes.
- Touch target: the visible marker is 24 px; a `before:` pseudo-element extends the hit area by 8 px on each side (40 px).

## Right-to-left

- Layout: the root is a flex row that follows `dir`; `side="start"` renders the marker before the control in the DOM, so reading, tab and visual order agree in both directions. The popover placement mirrors through `usePlacement`.
- Icons: none in the marker.
- Keyboard: no arrow keys.
- User data: none.

## Internationalization

| Key                | English source              | Override prop |
| ------------------ | --------------------------- | ------------- |
| `hotspot.label`    | `Tutorial step: {title}`    | —             |
| `hotspot.stepOf`   | `Step {current} of {total}` | —             |
| `hotspot.previous` | `Previous`                  | —             |
| `hotspot.next`     | `Next`                      | —             |
| `hotspot.finish`   | `Finish`                    | —             |

- Formatting: none (integers interpolated). The close button's name comes from `popover.close`.

## Responsive

- Container queries: none: fixed-size marker.
- Narrow: the root has `max-w-full` and the popover is `width="small"` (`--container-xs`), clamped by `Popover` to the viewport.
- Touch: 40 px hit area through the pseudo-element.
- Reflow: no horizontal scroll at 320 px; the popover wraps its text.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Hotspot from '@aziontech/webkit/hotspot'
  import TutorialPanel from '@aziontech/webkit/tutorial-panel'
  import { ref } from 'vue'

  const tutorials = [
    {
      id: 'publish',
      title: 'Publish a change',
      tasks: [
        {
          title: 'Review and deploy',
          steps: [
            {
              title: 'Preview the change',
              content: 'Open the preview to check the change before anyone else sees it.',
              hotspotId: 'preview'
            },
            {
              title: 'Deploy',
              content: 'Select Deploy to send the change to production.',
              hotspotId: 'deploy'
            }
          ]
        }
      ]
    }
  ]

  const active = ref('publish')
  const step = ref(0)
</script>

<template>
  <TutorialPanel.Provider
    v-model:active="active"
    v-model:step="step"
    :tutorials="tutorials"
  >
    <div class="flex min-h-(--container-3xs) flex-wrap items-start gap-(--spacing-sm)">
      <Hotspot hotspot-id="preview">
        <Button
          label="Preview"
          kind="outlined"
          size="medium"
        />
      </Hotspot>
      <Hotspot hotspot-id="deploy">
        <Button
          label="Deploy"
          kind="primary"
          size="medium"
        />
      </Hotspot>
    </div>
  </TutorialPanel.Provider>
</template>
```
