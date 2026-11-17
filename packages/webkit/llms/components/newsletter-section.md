# Newsletter Section

> The closing band whose ask is a newsletter sign-up: the overline and a large headline on the lead side, a subscribe form labelled by the ask on the other, over a strip lit by the pixelated primary wave, then the hatched closing frame. It is a page section — the site places it from a `{ _id: 'newsletter-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, `registration-frame`, `eyebrow`, `field`, `input`, `button` and `texture`. The block never sends: it validates the address locally (an empty field and a malformed address each show their message under the field) and on a valid submit emits `submit` with the event and `{ email }`; the site posts the address and reports the outcome back through `loading`, `submitted` and `failed`, which the band renders with the messages from `form`.

- Import: `import NewsletterSection from '@aziontech/webkit/newsletter-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [newsletter-section.json](newsletter-section.json)

## When to use

- Use NewsletterSection when the closing ask is an email field.
- To close the Blog or the Resource Hub on a newsletter subscription.

## Do

- Set `loading` while the address is sent, then `submitted` or `failed` with the outcome.
- Keep `description` to one sentence; it is set as the large headline.
- Write `form.invalidMessage` with an example address so the fix is obvious.
- Place it last on the page, right above `site-footer-section`, after a hatched `section-gap`. It draws the hatched closing frame itself, so nothing follows it inside the page column: no trailing `SectionGap` and no closing `RegistrationFrame` + `Texture` (the `shell/site` close is for a page that ends on any other band). `webkit/no-gap-after-closing-section` flags the doubled close.

## Don’t

- For a close on one or two link actions or a command → use `closing-call-to-action-section`.
- For a close that lists deployable templates → use `template-gallery-section` with `closing`.
- For a lead form with several fields → use `hero-form-section`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [closing-call-to-action-section](closing-call-to-action-section.md) — the closing band whose ask is a link action.
- [alert](alert.md) — renders the success and failure messages.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `form` | `NewsletterSectionForm` | `—` | true | Copy of the subscribe form: `{ placeholder, submitLabel, successMessage, errorMessage, requiredMessage, invalidMessage }`. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Eyebrow on the lead side, closed by the blinking cursor. |
| `title` | `string` | `''` | false | The ask, rendered as the label of the email field; it also names the band. Empty, the field keeps a visually hidden built-in label. |
| `description` | `string` | `''` | false | The pitch, rendered as the band's large `h2` on the lead side. |
| `loading` | `boolean` | `false` | false | The site is sending the address: the field is disabled, the button shows its loading state and a submit is ignored. |
| `submitted` | `boolean` | `false` | false | The site sent the address: the form gives way to `form.successMessage`. |
| `failed` | `boolean` | `false` | false | The site could not send the address: `form.errorMessage` shows under the form. |
| `hatch` | `boolean` | `true` | false | Draws the hatched closing frame under the band; turn it off when another closing band stacks directly below and draws the shared frame. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `submit` | `(event: SubmitEvent, values: Record<string, string>)` | Fired on a valid submit, not while `loading`; `values` is `{ email }` with the trimmed address. The block never sends it. |

## States

- Visual states: `default`, `invalid`, `loading`, `submitted`, `failed`
- `invalid`: the field is `invalid` with `form.requiredMessage` when empty or `form.invalidMessage` when malformed, under the field; the field is `required` from the first render, so only a failed submit turns it red; focus returns to the field; typing clears it; nothing is emitted
- `loading` (prop): the field is disabled, the button shows its loading state and a submit emits nothing
- `submitted` (prop): the form is replaced by a success `Alert` with `form.successMessage`, which takes focus when focus was in the form
- `failed` (prop): a danger `Alert` with `form.errorMessage` shows under the form, which stays editable
- `hatch` off: the band renders without its closing frame, so the closing band stacked below draws the page's one close
- The eyebrow is plain text with no `//` prefix: that prefix belongs to the hero and the pricing sections only.

## Accessibility

- Visible focus: owned by `input` and `button`.
- Keyboard map: `Tab` reaches the field then the button; `Enter` in the field or on the button submits.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the ask is a `<label for>` bound to the field with `useId`, and without a title a visually hidden label ("Email address") keeps the field named; the field is an `<input type="email">` with `autocomplete="email"` and `spellcheck="false"`; the validation message is the field's helper text, the field carries `aria-required` from the first render, and an empty or malformed submit sets `aria-invalid`. The success message is a `status` region and the failure message an `alert`. The texture strip is `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): headline and ask `var(--text-default)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the texture and the button carry their own fallback.
- Touch target ≥40×40 px — the field and the button are large.

## Right-to-left

- Layout: logical utilities only; the lead side and the form mirror under `dir="rtl"`.
- Icons: the button glyph follows `button`; the texture and the mark are not mirrored.
- Keyboard: no arrow-key handling.
- User data: the email field is `type="email"` and renders the address as typed.

## Internationalization

| Key                       | English source  | Override prop |
| ------------------------- | --------------- | ------------- |
| `newsletterSection.email` | `Email address` | `title`       |

The ask, the button label and every message are props from the page JSON (`title`, `form.*`); the built-in label names the field only when `title` is empty.

- Formatting: none.

## Responsive

- Container queries: none; the lead side and the form stack below `lg`.
- Narrow (below `lg`): the headline sits over the form, the field and the button share the row and the message drops under them.
- Touch: the field and the button are large; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import NewsletterSection from '@aziontech/webkit/newsletter-section'
  import { ref } from 'vue'

  const form = {
    placeholder: 'Your email',
    submitLabel: 'Subscribe',
    successMessage: 'Thanks for subscribing to the Azion newsletter',
    errorMessage: 'We could not subscribe you. Try again.',
    requiredMessage: 'Enter your email address.',
    invalidMessage: 'Enter an email address like name@example.com.'
  }

  const subscribedEmail = ref('')

  const onSubmit = (event, values) => {
    subscribedEmail.value = values.email
  }
</script>

<template>
  <NewsletterSection
    anchor="contact"
    eyebrow="Stay up to date"
    title="Subscribe to our newsletter"
    description="Product updates, event highlights, and industry insights, delivered to your inbox."
    :form="form"
    :submitted="subscribedEmail !== ''"
    @submit="onSubmit"
  />
</template>
```

### Loading

```vue
<script setup>
  import NewsletterSection from '@aziontech/webkit/newsletter-section'

  const form = {
    placeholder: 'Your email',
    submitLabel: 'Subscribe',
    successMessage: 'Thanks for subscribing to the Azion newsletter',
    errorMessage: 'We could not subscribe you. Try again.',
    requiredMessage: 'Enter your email address.',
    invalidMessage: 'Enter an email address like name@example.com.'
  }
</script>

<template>
  <NewsletterSection
    anchor="contact"
    eyebrow="Stay up to date"
    title="Subscribe to our newsletter"
    description="Product updates, event highlights, and industry insights, delivered to your inbox."
    :form="form"
    :loading="true"
  />
</template>
```

### Submitted

```vue
<script setup>
  import NewsletterSection from '@aziontech/webkit/newsletter-section'

  const form = {
    placeholder: 'Your email',
    submitLabel: 'Subscribe',
    successMessage: 'Thanks for subscribing to the Azion newsletter',
    errorMessage: 'We could not subscribe you. Try again.',
    requiredMessage: 'Enter your email address.',
    invalidMessage: 'Enter an email address like name@example.com.'
  }
</script>

<template>
  <NewsletterSection
    anchor="contact"
    eyebrow="Stay up to date"
    title="Subscribe to our newsletter"
    description="Product updates, event highlights, and industry insights, delivered to your inbox."
    :form="form"
    :submitted="true"
  />
</template>
```
