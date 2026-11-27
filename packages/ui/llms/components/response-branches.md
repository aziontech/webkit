# Response Branches

> Pages through alternative versions of one assistant response or one edited prompt: after Try again, after the reader edits a prompt, or when the model returned several candidates, the message shows one version at a time with a `‹ 2/3 ›` pager under it, or alone in the message's action row when no slot is given. The owner keeps every version and renders the active one in the default slot; the component owns only the position and the pager. It is the AI Elements `Branch` pattern, rebuilt on Azion UI's `IconButton` and tokens.

- Import: `import ResponseBranches from '@aziontech/ui/response-branches'`
- Category: ai · Surface: app · Structure: monolithic
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- API as JSON: [response-branches.json](response-branches.json)

## When to use

- Use ResponseBranches to page through alternative versions of one AI response; rows of a table or list use Pagination.
- A response was regenerated and the earlier versions stay available to compare.
- A model returned several candidates and the person picks the one to keep reading.

## Do

- Move to the new version when Regenerate finishes (set `v-model` to the last index) so the person sees what they asked for.
- Keep the versions in the order they were made; the newest is last.
- Do not render the pager inside the slot; it belongs to the component so its position and labels stay the same across versions.

## Don’t

- Pages of one long list → use `Pagination`.
- Steps of a flow → use `Stepper`.
- Different documents side by side → use `Tabs`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [chat-message](chat-message.md) — the message whose body the branches wrap; its actions hold Regenerate.
- [streaming-response](streaming-response.md) — a new version streams in the slot while the pager already counts it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `count` | `number` | `—` | true | How many versions exist. With one or none the pager is not drawn. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the pager group. Empty uses the locale catalog (`Response versions`). |
| `disabled` | `boolean` | `false` | false | Locks the pager, for example while a new version streams. |
| `modelValue` | `number` | `0` | false | Two-way value (`v-model`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | { index: number } | Optional. The active version. Rendered once; the owner switches its content by `index`. Left out, only the pager renders, as in `ChatMessage.Actions`' `#leading` slot. |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                              |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------ |
| `v-model` | `number` | `0`     | `update:modelValue` | Zero-based index of the version shown, clamped to `0 … count - 1`. |

## States

- `data-count` on the root; `data-index` mirrors the clamped index.
- First version: Previous is disabled; last version: Next is disabled.
- `disabled`: both buttons are disabled and the counter is muted.
- `count` ≤ 1: only the slot renders.

## Accessibility

- The pager is `role="group"` named by `ariaLabel` (`Response versions`); Previous and Next are `IconButton`s named `Previous version` / `Next version`.
- The visible counter (`2/3`, `__position`) is `aria-hidden`; a visually hidden polite live region (`__status`, `Version 2 of 3`) announces the new position once; the slot is not live.
- Keyboard: `Tab` reaches Previous and Next; `Enter`/`Space` move; a disabled end button leaves the tab order. When the focused arrow reaches an end and turns disabled, focus moves to the other arrow instead of falling to the page.

## Right-to-left

- Layout: logical spacing only; the pager sits at the inline start.
- Icons: the chevrons mirror under `dir="rtl"` through `IconButton`'s directional icons, so Previous always points to the inline start.
- Keyboard: none beyond the buttons.
- User data: the slot follows the page direction.

## Internationalization

| Key                              | English source                 | Override prop |
| -------------------------------- | ------------------------------ | ------------- |
| `responseBranches.label`         | `Response versions`            | `ariaLabel`   |
| `responseBranches.previous`      | `Previous version`             | —             |
| `responseBranches.next`          | `Next version`                 | —             |
| `responseBranches.position`      | `{current}/{total}`            | —             |
| `responseBranches.positionLabel` | `Version {current} of {total}` | —             |

- Numbers in the counter use the locale's digits through the catalog template.

## Responsive

- Container queries: none.
- Narrow: the pager stays one row (two 28 px buttons and a short `2/3` counter, written left to right in every direction).
- Touch: buttons are `IconButton` small, with the 40 px touch target from `IconButton`.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import ChatMessage from '@aziontech/ui/chat-message'
  import CopyButton from '@aziontech/ui/copy-button'
  import IconButton from '@aziontech/ui/icon-button'
  import ResponseBranches from '@aziontech/ui/response-branches'
  import StreamingResponse from '@aziontech/ui/streaming-response'
  import { ref } from 'vue'

  const versions = ref([
    'Purge the cache from **Cache › Purge**: choose *URL*, paste the paths and confirm.',
    'Use a **wildcard purge** (`/assets/*`) when many files changed at once; it clears every match in one request.',
    'If the files change on every deploy, add a **version to the file name** instead of purging: the new name is a new cache entry.'
  ])
  const active = ref(2)
  const regenerating = ref(false)

  const regenerate = () => {
    if (regenerating.value) return
    regenerating.value = true
    setTimeout(() => {
      versions.value = [
        ...versions.value,
        'Purge by **cache key** from the API (`POST /purge/cachekey`) to automate it in your pipeline.'
      ]
      active.value = versions.value.length - 1
      regenerating.value = false
    }, 800)
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ChatMessage timestamp="10:44">
      <ResponseBranches
        v-model="active"
        :count="versions.length"
        :disabled="regenerating"
      >
        <template #default="{ index }">
          <StreamingResponse :content="versions[index]" />
        </template>
      </ResponseBranches>
      <template #actions>
        <ChatMessage.Actions>
          <CopyButton
            size="small"
            :value="versions[active]"
          />
          <IconButton
            icon="az az-refresh"
            aria-label="Regenerate response"
            variant="ghost"
            size="small"
            :loading="regenerating"
            @click="regenerate"
          />
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
  </div>
</template>
```
