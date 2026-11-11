# Closing Call To Action Newsletter

> The closing band whose ask is a newsletter sign-up: the overline and a large headline on the lead side, a subscribe form labelled by the ask on the other, over a strip lit by the pixelated primary wave, then the hatched closing frame. It is a page section — the site places it from a `{ _id: 'closing-call-to-action-newsletter', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `overline`, `field`, `input`, `button` and `texture-material`. The block never sends: it validates the address locally (an empty field and a malformed address each show their message under the field) and on a valid submit emits `submit` with the event and `{ email }`; the site posts the address and reports the outcome back through `loading`, `submitted` and `error`, which the band renders with the messages from `form`.

- Import: `import ClosingCallToActionNewsletter from '@aziontech/webkit/closing-call-to-action-newsletter'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [closing-call-to-action-newsletter.json](https://github.com/aziontech/webkit/blob/main/.specs/closing-call-to-action-newsletter.json)

## When to use

- To close the Blog or the Resource Hub on a newsletter subscription.

## Do

- Set `loading` while the address is sent, then `submitted` or `error` with the outcome.
- Keep `description` to one sentence; it is set as the large headline.
- Write `form.invalidMessage` with an example address so the fix is obvious.

## Don’t

- For a close on one or two link actions → use `closing-call-to-action`.
- For a lead form with several fields → use `hero-form`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [closing-call-to-action](closing-call-to-action.md) — the closing band whose ask is a link action.
- [alert](alert.md) — renders the success and failure messages.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `form` | `ClosingCallToActionNewsletterForm` | `—` | true | Copy of the subscribe form: `{ placeholder, submitLabel, successMessage, errorMessage, requiredMessage, invalidMessage }`. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Overline on the lead side, closed by the blinking cursor. |
| `title` | `string` | `''` | false | The ask, rendered as the label of the email field; it also names the band. |
| `description` | `string` | `''` | false | The pitch, rendered as the band's large `h2` on the lead side. |
| `loading` | `boolean` | `false` | false | The site is sending the address: the field is disabled, the button shows its loading state and a submit is ignored. |
| `submitted` | `boolean` | `false` | false | The site sent the address: the form gives way to `form.successMessage`. |
| `error` | `boolean` | `false` | false | The site could not send the address: `form.errorMessage` shows under the form. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `submit` | `(event: SubmitEvent, values: Record<string, string>)` | Fired on a valid submit, not while `loading`; `values` is `{ email }` with the trimmed address. The block never sends it. |

## States

- Visual states: `default`, `invalid`, `loading`, `submitted`, `error`
- `invalid`: an empty field takes the amber `required` state with `form.requiredMessage`, a malformed address the red `invalid` state with `form.invalidMessage`, under the field (never both at once); focus returns to the field; typing clears it; nothing is emitted
- `loading` (prop): the field is disabled, the button shows its loading state and a submit emits nothing
- `submitted` (prop): the form is replaced by a success `Alert` with `form.successMessage`, which takes focus when focus was in the form
- `error` (prop): a danger `Alert` with `form.errorMessage` shows under the form, which stays editable

## Accessibility

- Visible focus: owned by `input` and `button`.
- Keyboard map: `Tab` reaches the field then the button; `Enter` in the field or on the button submits.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the ask is a `<label for>` bound to the field with `useId`; the field is an `<input type="email">` with `autocomplete="email"` and `spellcheck="false"`; the validation message is the field's helper text, an empty submit sets `aria-required` and a malformed address `aria-invalid`. The success message is a `status` region and the failure message an `alert`. The texture strip is `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): headline and ask `var(--text-default)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the texture and the button carry their own fallback.
- Touch target ≥40×40 px — the field and the button are large.

## Examples

### Default

```vue
<script setup>
  import ClosingCallToActionNewsletter from '@aziontech/webkit/closing-call-to-action-newsletter'

  const form = {
    placeholder: 'Your email',
    submitLabel: 'Subscribe',
    successMessage: 'Thanks for subscribing to the Azion newsletter',
    errorMessage: 'We could not subscribe you. Try again.',
    requiredMessage: 'Enter your email address.',
    invalidMessage: 'Enter an email address like name@example.com.'
  }

  const onSubmit = (event, values) => {
    console.log(event.type, values)
  }
</script>

<template>
  <ClosingCallToActionNewsletter
    anchor="contact"
    eyebrow="Stay up to date"
    title="Subscribe to our newsletter"
    description="Product updates, event highlights, and industry insights, delivered to your inbox."
    :form="form"
    @submit="onSubmit"
  />
</template>
```

### Loading

```vue
<script setup>
  import ClosingCallToActionNewsletter from '@aziontech/webkit/closing-call-to-action-newsletter'

  const form = {
    placeholder: 'Your email',
    submitLabel: 'Subscribe',
    successMessage: 'Thanks for subscribing to the Azion newsletter',
    errorMessage: 'We could not subscribe you. Try again.',
    requiredMessage: 'Enter your email address.',
    invalidMessage: 'Enter an email address like name@example.com.'
  }

  const onSubmit = (event, values) => {
    console.log(event.type, values)
  }
</script>

<template>
  <ClosingCallToActionNewsletter
    anchor="contact"
    eyebrow="Stay up to date"
    title="Subscribe to our newsletter"
    description="Product updates, event highlights, and industry insights, delivered to your inbox."
    :form="form"
    :loading="true"
    @submit="onSubmit"
  />
</template>
```

### Submitted

```vue
<script setup>
  import ClosingCallToActionNewsletter from '@aziontech/webkit/closing-call-to-action-newsletter'

  const form = {
    placeholder: 'Your email',
    submitLabel: 'Subscribe',
    successMessage: 'Thanks for subscribing to the Azion newsletter',
    errorMessage: 'We could not subscribe you. Try again.',
    requiredMessage: 'Enter your email address.',
    invalidMessage: 'Enter an email address like name@example.com.'
  }

  const onSubmit = (event, values) => {
    console.log(event.type, values)
  }
</script>

<template>
  <ClosingCallToActionNewsletter
    anchor="contact"
    eyebrow="Stay up to date"
    title="Subscribe to our newsletter"
    description="Product updates, event highlights, and industry insights, delivered to your inbox."
    :form="form"
    :submitted="true"
    @submit="onSubmit"
  />
</template>
```
