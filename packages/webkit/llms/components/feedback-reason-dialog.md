# Feedback Reason Dialog

> Asks why an assistant response was not helpful, right after the thumbs-down in `ChatMessage.Feedback`: a small dialog with one required reason (radio buttons) and optional details, then Send feedback. It turns a bare thumbs-down into a signal the team can act on, without a page or a form of the owner's own. The owner opens it, sends the payload it emits and closes it.

- Import: `import FeedbackReasonDialog from '@aziontech/webkit/feedback-reason-dialog'`
- Category: ai · Surface: product · Structure: monolithic
- API as JSON: [feedback-reason-dialog.json](https://github.com/aziontech/webkit/blob/main/.specs/feedback-reason-dialog.json)

## When to use

- After a thumbs-down on an AI response, to collect the reason.
- Any rating of generated content that needs a short, categorised reason.

## Do

- Open it only after a thumbs-down; a thumbs-up needs no reason.
- Keep the reasons short and mutually exclusive; the last is `Other`, and details stay optional.
- Close it from the `submit` handler once the request succeeds; keep it open with `loading` while it is sent.

## Don’t

- General product feedback with several fields → a page or `Drawer` form.
- A confirmation with no input → `ConfirmDialog`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [chat-message](chat-message.md) — `ChatMessage.Feedback` holds the thumbs that open it.
- [confirm-dialog](confirm-dialog.md) — the same dialog anatomy for a yes/no decision.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `reasons` | `{ value: string; label: string }[]` | `[]` | false | Reasons offered, in order. Empty uses the catalog's five: inaccurate, not helpful, did not follow the request, unsafe or harmful, other. |
| `loading` | `boolean` | `false` | false | The feedback is being sent: Send feedback shows a spinner and the form is locked. |
| `title` | `string` | `''` | false | Dialog title. Empty uses the locale catalog (`What went wrong?`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `submit` | `{ reason: string; details: string }` |  |

## v-model

| Model          | Type      | Default | Emits         | Notes                                                              |
| -------------- | --------- | ------- | ------------- | ------------------------------------------------------------------ |
| `v-model:open` | `boolean` | `false` | `update:open` | Opens the dialog; the reason and details reset each time it opens. |

## States

- Idle (open): no reason chosen, Send feedback enabled.
- Invalid: submitted without a reason; the fieldset is invalid and its error is announced.
- Loading: Send feedback spinner, radios, details and Cancel disabled.
- `data-state` on the dialog mirrors `open` / `closed` (from `Dialog`).

## Accessibility

- A modal `Dialog` named by its title and described by its one-line description; focus moves into it and returns to the thumbs-down on close.
- The reasons are a `fieldset` with a `legend` (`Reason`), one `RadioButton` per reason with its label; the details `Textarea` is labelled `Details (optional)`.
- Submitting without a reason marks the fieldset invalid, shows the error text and focuses the first radio; nothing is sent.
- Keyboard: `Tab` through radios (arrows within the group), details, Cancel, Send feedback; `Enter` in a radio submits; `Escape` closes.

## Right-to-left

- Layout: logical spacing only; the footer actions sit at the inline end.
- Icons: none.
- Keyboard: radio arrows follow the page direction (native).
- User data: details render with `dir="auto"` through `Textarea`.

## Internationalization

| Key                                                                            | English source                                                                                    | Override prop |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ------------- |
| `feedbackReason.title`                                                         | `What went wrong?`                                                                                | `title`       |
| `feedbackReason.description`                                                   | `Your answer helps improve future responses.`                                                     | —             |
| `feedbackReason.reason`                                                        | `Reason`                                                                                          | —             |
| `feedbackReason.details`                                                       | `Details (optional)`                                                                              | —             |
| `feedbackReason.detailsPlaceholder`                                            | `What did you expect instead?`                                                                    | —             |
| `feedbackReason.required`                                                      | `Choose a reason.`                                                                                | —             |
| `feedbackReason.cancel`                                                        | `Cancel`                                                                                          | —             |
| `feedbackReason.send`                                                          | `Send feedback`                                                                                   | —             |
| `feedbackReason.inaccurate`, `notHelpful`, `ignoredRequest`, `unsafe`, `other` | `Inaccurate or made up`, `Not helpful`, `Did not follow my request`, `Unsafe or harmful`, `Other` | `reasons`     |

## Responsive

- Container queries: the dialog body is the `@container/panel` from `PanelContent`.
- Narrow: the dialog is the `small` size and becomes full width under `sm`; the footer buttons stretch (from `PanelFooter`).
- Touch: radios and buttons keep their 40 px targets.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import ChatMessage from '@aziontech/webkit/chat-message'
  import FeedbackReasonDialog from '@aziontech/webkit/feedback-reason-dialog'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { ref } from 'vue'

  const answer =
    'Turn on **Image Optimization** in the application settings, then add `?ims=300x` to the image URL.'
  const feedback = ref(null)
  const reasonOpen = ref(false)
  const sending = ref(false)

  const onFeedback = (value) => {
    feedback.value = value
    if (value === 'down') reasonOpen.value = true
  }

  const sendReason = () => {
    sending.value = true
    setTimeout(() => {
      sending.value = false
      reasonOpen.value = false
    }, 600)
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ChatMessage timestamp="10:44">
      <StreamingResponse :content="answer" />
      <template #actions>
        <ChatMessage.Actions>
          <ChatMessage.Feedback
            :model-value="feedback"
            @update:model-value="onFeedback"
          />
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
    <FeedbackReasonDialog
      v-model:open="reasonOpen"
      :loading="sending"
      @submit="sendReason"
    />
  </div>
</template>
```
