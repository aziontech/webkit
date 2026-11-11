# Suggestion Group

> A group of prompts the reader can send without typing (Cloudscape support prompt group, AI Elements Suggestion): support prompts on an empty conversation, follow-up questions after a response, or the choices of a clarifying question. Each prompt is a button; choosing one emits `select` with the item, and the owner either sends it or places it in the prompt input to edit.

- Import: `import SuggestionGroup from '@aziontech/webkit/suggestion-group'`
- Category: ai · Surface: product · Structure: monolithic
- API as JSON: [suggestion-group.json](https://github.com/aziontech/webkit/blob/main/.specs/suggestion-group.json)

## When to use

- The empty state of an assistant, to show what it can do (vertical, up to five).
- After a broad response, to narrow it (horizontal chips, up to five, most likely first).
- A follow-up question with predefined answers.

## Do

- Five or fewer, ordered by likelihood.
- Write prompts as the reader would ask them, under 72 characters, sentence case, no end punctuation needed for questions you send verbatim.
- Disable the group while a response is generating.
- Remove follow-ups once the reader sends anything else.

## Don’t

- Navigation or filters → `tabs`, `toggle-group`, `property-filter`.
- Choices that are a form value → `radio-group` / `radio-cards`.
- More than five options → let the reader type; the prompt input stays available.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [prompt-input](prompt-input.md) — the open-ended alternative that must stay reachable.
- [empty-state](empty-state.md) — hosts the vertical support prompts before the first message.
- [chip](chip.md), `button` — visual cousins; prompts are their own control because they send text.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `SuggestionItem[]` | `[]` | false | Up to five prompts, most likely first. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the group. Empty uses the locale catalog (`Suggested prompts`). |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | false | horizontal` wraps chips in a row (follow-up questions under a response); `vertical` stacks them (support prompts on an empty conversation). |
| `disabled` | `boolean` | `false` | false | Disables every prompt, while a response is being generated. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `select` | `SuggestionItem` |  |

## Sub-components

_None. Data-driven (`items`), like Cloudscape's support prompt group. Exports: `"./suggestion-group"`;
types `SuggestionItem`, `SuggestionGroupOrientation`._

## States

- `data-orientation`, `data-disabled`; renders nothing when `items` is empty.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` moves between prompts (each is a native button; five at most keeps the tab order short); `Enter` / `Space` chooses.
- ARIA: `role="group"` with `aria-label`; icons `aria-hidden`; native `disabled`.
- Touch target: 32 px rows, 44 px on coarse pointers.

## Right-to-left

- Layout: logical utilities, `text-start`.
- Icons: product icons are not mirrored.
- Keyboard: none beyond Tab.
- User data: prompt labels follow the document direction.

## Internationalization

| Key                     | English source      | Override prop |
| ----------------------- | ------------------- | ------------- |
| `suggestionGroup.label` | `Suggested prompts` | `ariaLabel`   |

- Formatting: none.

## Responsive

- Container queries: none.
- Narrow: horizontal chips wrap; vertical prompts fill the width.
- Touch: 44 px on coarse pointers.
- Reflow: wraps, no horizontal scroll.

## Examples

### FollowUpQuestions

```vue
<script setup>
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'
  import { ref } from 'vue'

  const sent = ref('')
  const items = [
    { id: 'ttl', label: 'What TTL should my images use?' },
    { id: 'wildcard', label: 'How do I purge a whole folder?' },
    { id: 'origin', label: 'Why does the origin still get requests?' }
  ]
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <SuggestionGroup
      :items="items"
      aria-label="Follow-up questions"
      @select="(item) => (sent = item.label)"
    />
    <p
      v-if="sent"
      class="text-body-sm text-(--text-muted)"
    >
      Sent: {{ sent }}
    </p>
  </div>
</template>
```

### SupportPrompts

```vue
<script setup>
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'

  const items = [
    { id: 'deploy', label: 'Deploy a Next.js app from GitHub', icon: 'pi pi-github' },
    { id: 'waf', label: 'Protect my site with a WAF', icon: 'pi pi-shield' },
    { id: 'cache', label: 'Explain why my cache hit ratio dropped', icon: 'pi pi-chart-line' },
    { id: 'domain', label: 'Point my domain to a workload', icon: 'pi pi-globe' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-sm)">
    <SuggestionGroup
      :items="items"
      orientation="vertical"
    />
  </div>
</template>
```
