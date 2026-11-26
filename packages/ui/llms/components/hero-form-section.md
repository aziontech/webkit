# Hero Form Section

> The opening band of a lead-capture page, where the form is the reason for the page: the hero copy and a list of highlights on one side, the form on the other, above the fold, with the client strip on the floor. It is a page section — the site places it from a `{ _id: 'hero-form-section', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `feature-item`, `field`, `input`, `select`, `phone-input`, `textarea`, `button` and `alert`. The fields are data: each entry of `fields` picks its control by `type`, so the Contact page and the Under attack page are the same block with different `fields`. The block never sends: it validates the fields locally (required fields and the email format, with the messages from `messages`) and on a valid submit emits `submit` with the event and the values keyed by field `name`; the site posts them and reports the outcome back through `loading`, `submitted` and `failed`.

- Import: `import HeroFormSection from '@aziontech/webkit/hero-form-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [hero-form-section.json](hero-form-section.json)

## When to use

- Use HeroFormSection when the page exists to capture a lead and the form sits above the fold.
- To open a page whose purpose is a lead form, such as Contact sales or Under attack.

## Do

- Give every field a unique `name`; it is the key of the submitted value.
- Mark half-width fields in pairs so each row stays full.
- Set `visuallyHiddenLabel` on a field the page labels by its placeholder alone (azion.com's phone field): the label stays the control's accessible name for assistive tech but is not drawn, so give that field a `placeholder` that says what to type.
- Keep the headline to a short phrase; the band sets it on a narrower measure than the description (`--container-md`), so "Grow as an Azion Partner" breaks over two lines as on the site. There is no width prop to tune.
- Set `loading` while the values are sent, then `submitted` or `failed` with the outcome.

## Don’t

- For a newsletter sign-up with one email field → use `newsletter-section`.
- For an opening band with calls to action and no form → use `hero-section`, which takes every other marketing page opening.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [newsletter-section](newsletter-section.md) — the other form section; same `submit` and state contract.
- [alert](alert.md) — renders the failure message.
- [empty-state](empty-state.md) — renders the confirmation that replaces the form once the values are sent.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `messages` | `HeroFormSectionMessages` | `—` | true | Copy of the form outcomes: `{ missing, invalidEmail, success, successDescription?, error }`. |
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `titleHighlight` | `string` | `''` | false | Opening words of the headline, painted in the brand accent. |
| `title` | `string` | `''` | false | Page headline, rendered as the page `h1`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `descriptionLink` | `HeroFormSectionLink` | `undefined` | false | A link continuing the description inline, such as a phone line; `{ label, href }`. Omitted when absent. |
| `descriptionAfter` | `string` | `''` | false | Copy after the inline link, closing the description's sentence. |
| `primaryAction` | `ModuleHeaderAction` | `undefined` | false | First button under the copy; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `secondaryAction` | `ModuleHeaderAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `items` | `HeroFormSectionItem[]` | `[]` | false | The highlights under the description, in order; each is `{ icon, title, description }`. The list renders only when there are items. |
| `formAriaLabel` | `string` | `''` | false | Accessible name of the field group, read as its legend. |
| `fields` | `HeroFormSectionField[]` | `[]` | false | The form fields in order; each is `{ name, type, label, placeholder?, required?, half?, options?, country?, visuallyHiddenLabel?, autocomplete? }`; `visuallyHiddenLabel` keeps the label as the accessible name but does not draw it, `autocomplete` is the autofill hint of a text control. |
| `submitLabel` | `string` | `''` | false | Label of the submit button. |
| `marqueeLabel` | `string` | `''` | false | Eyebrow above the client marquee. |
| `marqueeMarks` | `string[]` | `[]` | false | Registry names of the client marks, in order; the marquee renders only when there are marks. |
| `loading` | `boolean` | `false` | false | The site is sending the values: the button shows its loading state and a submit is ignored. |
| `submitted` | `boolean` | `false` | false | The site sent the values: the form gives way to a confirmation of `messages.success`, in the form's footprint. |
| `failed` | `boolean` | `false` | false | The site could not send the values: `messages.error` shows under the form. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `submit` | `(event: SubmitEvent, values: Record<string, string>)` | Fired on a valid submit, not while `loading`; `values` holds every field by `name`, trimmed, with a phone number prefixed by its dial code. The block never sends it. |

## Assets

- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Marquee` prints it as a typographic wordmark, the quote components show no mark.

## States

- Visual states: `default`, `invalid`, `loading`, `submitted`, `failed`
- `invalid`: on submit, an empty required field shows `messages.missing` and a malformed email `messages.invalidEmail` under the field; focus moves to the first field in error; editing the field clears it; nothing is emitted
- `loading` (prop): the button shows its loading state, every field is disabled (the scope locks off the one flag) and a submit emits nothing; `data-loading` on the root
- `submitted` (prop): the form is replaced by a bordered `EmptyState` (success icon, `messages.success` as its title, `messages.successDescription` under it) that keeps at least the height the form had, so the band does not collapse; it takes focus when focus was in the form; `data-submitted` on the root
- `failed` (prop): a danger `Alert` with `messages.error` shows under the button; the form stays editable; `data-failed` on the root
- A field with `visuallyHiddenLabel` renders its `Field.Label` visually hidden (`sr-only`), so the control keeps its accessible name and the page shows only the placeholder
- The headline caps at `--container-md` while the description and highlights keep the `lg` column
- `descriptionLink` renders inline after `description`, underlined, followed by `descriptionAfter`, so the copy reads as one sentence
- Without `items`, the copy block is sticky from `lg` (it stays in view while the taller form scrolls past); with `items` it scrolls with the highlights
- `loading` also sets `disabled` on the `fieldset`, so the browser locks every control in it
- Empty: when `title` is empty the band renders nothing but its root; when `items` is empty the list is omitted; when `marqueeMarks` is empty the strip is omitted

## Accessibility

- Visible focus: owned by the field controls and `button`.
- Keyboard map: `Tab` reaches the inline description link and the actions under the copy, then walks the fields in order and the button; `Enter` in a text field or on the button submits.
- ARIA: the band is the `hero` `<section>` named by the title (`aria-label`); the root is a plain `div`. The fields sit in a `fieldset` whose visually hidden `legend` is `formAriaLabel`; each control is labelled through its own `Field.Label` with an id from `useId`; each label is a `Field.Label` rendered by the band, carrying the persistent Required tag of a `required` field from first render. An `email` field is an `<input type="email">` with `autocomplete="email"` and `spellcheck="false"`; a text field takes its `autocomplete` hint (`given-name`, `family-name`, `organization`, `url`) so phone autofill fills the form. Validation runs on submit only: a required field carries `required` and `aria-required` from the first render, and a submit that finds it empty or malformed sets the red `invalid` state (`aria-invalid`); the message is the field's helper text, and editing the field clears it. The success message is a `status` region and the failure message an `alert`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none` on the inline description link's colour transition; the composed components carry their own fallback.
- Touch target ≥40×40 px — the text fields and the button are large.

## Right-to-left

- Layout: logical utilities only; the copy and the form swap sides under `dir="rtl"`.
- Icons: the action chevrons mirror with `button`; highlight icons are not mirrored.
- Keyboard: no arrow-key handling beyond the select's own.
- User data: email and phone values render as typed.

## Internationalization

No built-in strings: every label, placeholder, message and action is a prop from the page JSON (`fields`, `messages`, `submitLabel`, `formAriaLabel`).

- Formatting: none of its own; the phone field formats the number for its country (owned by `phone-input`).

## Responsive

- Container queries: none; the copy and the form sit side by side from `lg` and stack below it.
- Narrow (below `lg`): the copy, the form and then the highlights stack, so the form starts right under the headline on a phone and the highlights read as proof under the submit button; below `sm` every field takes the full row (`half` fields stop pairing).
- Touch: the fields and the buttons are large; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import HeroFormSection from '@aziontech/webkit/hero-form-section'

  const items = [
    {
      icon: 'az az-ai-inference',
      title: 'Build AI applications',
      description: 'Run AI agents and inference close to your users.'
    },
    {
      icon: 'az az-build-pillar',
      title: 'Modernize applications',
      description: 'Go from commit to a live URL in minutes.'
    },
    {
      icon: 'az az-secure-pillar',
      title: 'Protect applications and APIs',
      description: 'Block DDoS attacks, malicious bots, and API abuse.'
    },
    {
      icon: 'az az-application-accelerator',
      title: 'Speed up every workload',
      description: '100+ data centers, with a 30 ms median latency.'
    }
  ]

  const fields = [
    {
      name: 'firstname',
      autocomplete: 'given-name',
      type: 'text',
      label: 'First name',
      half: true,
      required: true
    },
    {
      name: 'lastname',
      autocomplete: 'family-name',
      type: 'text',
      label: 'Last name',
      half: true,
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Work email',
      placeholder: 'm@example.com',
      required: true
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      placeholder: 'Select your role',
      half: true,
      required: true,
      options: [
        'Administrator',
        'Advisor',
        'Analyst',
        'Architect',
        'Assistant',
        'Auditor',
        'Buyer',
        'CDO - Chief Data Officer',
        'CDO - Chief Digital Officer',
        'CEO – Chief Executive Officer',
        'CFO – Chief Financial Officer',
        'CHRO – Chief Human Resources Officer',
        'CIO - Chief Information Officer',
        'CISO - Chief Information Security Officer',
        'CMO – Chief Marketing Officer',
        'Consultant',
        'Controller',
        'COO – Chief Operating Officer',
        'Coordinator',
        'CPO - Chief Product Owner',
        'CRO - Chief Revenue Officer',
        'CTO - Chief Technology Officer',
        'CXO - Chief Experience officer',
        'Dean',
        'Designer',
        'Developer',
        'Director',
        'Engineer',
        'Expert',
        'Founder',
        'Head',
        'Manager',
        'Owner',
        'Partner',
        'President',
        'Secretary',
        'Specialist',
        'Superintendent',
        'Supervisor',
        'Vice President'
      ]
    },
    {
      name: 'company',
      autocomplete: 'organization',
      type: 'text',
      label: 'Company',
      half: true,
      required: true
    },
    {
      name: 'mobilephone',
      type: 'phone',
      label: 'Phone',
      country: 'US',
      required: true
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'How can we help?',
      placeholder:
        'Tell us about your current stack, your use case, and what you want to run on Azion.',
      required: true
    }
  ]

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    success: 'Thanks, we received your request.',
    successDescription: 'A specialist will reply by email within one business day.',
    error: 'We could not send your message. Try again.'
  }

  const marqueeMarks = [
    'global-fashion-group',
    'herospark',
    'itau',
    'nzn',
    'netshoes',
    'caixa',
    'agibank',
    'prime-video',
    'america-movil',
    'gpa',
    'fourbank'
  ]

  const onSubmit = (_event, _values) => {}
</script>

<template>
  <HeroFormSection
    eyebrow="Sales"
    title-highlight=""
    title="Talk to our sales team"
    description="Get a custom demo, plan your migration, and explore plans and pricing built for your company."
    :items="items"
    form-aria-label="Contact sales"
    :fields="fields"
    submit-label="Contact sales"
    :messages="messages"
    marquee-label="Trusted by teams running critical workloads"
    :marquee-marks="marqueeMarks"
    @submit="onSubmit"
  />
</template>
```

### UnderAttack

```vue
<script setup>
  import HeroFormSection from '@aziontech/webkit/hero-form-section'

  const items = [
    {
      icon: 'az az-security-team',
      title: 'Help before you become a customer',
      description: 'Emergency mitigation for an attack in progress.'
    },
    {
      icon: 'az az-secure-pillar',
      title: '265B attacks blocked',
      description: 'Stopped on the Azion network since 2022.'
    },
    {
      icon: 'az az-build-pillar',
      title: '35B functions a month',
      description: 'Edge functions run every month for security controls.'
    },
    {
      icon: 'az az-application-accelerator',
      title: 'Over 90% of requests served from cache',
      description: 'Customer requests answered close to your users.'
    }
  ]

  const fields = [
    {
      name: 'firstname',
      autocomplete: 'given-name',
      type: 'text',
      label: 'First name',
      half: true,
      required: true
    },
    {
      name: 'lastname',
      autocomplete: 'family-name',
      type: 'text',
      label: 'Last name',
      half: true,
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Business email',
      required: true
    },
    {
      name: 'company',
      autocomplete: 'organization',
      type: 'text',
      label: 'Company',
      half: true,
      required: true
    },
    {
      name: 'domain',
      autocomplete: 'url',
      type: 'text',
      label: 'Website',
      half: true
    },
    {
      name: 'mobilephone',
      type: 'phone',
      label: 'Phone',
      country: 'US',
      required: true
    }
  ]

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    success: 'Thanks, we received your request.',
    successDescription: 'A specialist will reply by email within one business day.',
    error: 'We could not send your message. Try again.'
  }

  const marqueeMarks = [
    'global-fashion-group',
    'herospark',
    'itau',
    'nzn',
    'netshoes',
    'caixa',
    'agibank',
    'prime-video',
    'america-movil',
    'gpa',
    'fourbank'
  ]

  const onSubmit = (event, values) => {
    console.warn(event.type, values)
  }
</script>

<template>
  <HeroFormSection
    eyebrow="Under Cyberattack?"
    title-highlight=""
    title="Mitigate a cyberattack now"
    description="Our digital security team is available to provide immediate assistance."
    :items="items"
    form-aria-label="Request immediate contact"
    :fields="fields"
    submit-label="Request immediate contact"
    :messages="messages"
    marquee-label="Trusted by teams running critical workloads"
    :marquee-marks="marqueeMarks"
    @submit="onSubmit"
  />
</template>
```

### ScaleUp

```vue
<script setup>
  import HeroFormSection from '@aziontech/webkit/hero-form-section'

  const fields = [
    {
      name: 'firstname',
      autocomplete: 'given-name',
      type: 'text',
      label: 'First name',
      half: true,
      required: true
    },
    {
      name: 'lastname',
      autocomplete: 'family-name',
      type: 'text',
      label: 'Last name',
      half: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Work email',
      placeholder: 'm@example.com',
      required: true
    },
    {
      name: 'company',
      autocomplete: 'organization',
      type: 'text',
      label: 'Company',
      half: true,
      required: true
    },
    {
      name: 'mobilephone',
      type: 'phone',
      label: 'Phone',
      placeholder: '555-0100',
      country: 'US',
      visuallyHiddenLabel: true
    }
  ]

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    success: 'Thanks, we received your request.',
    successDescription: 'A specialist will reply by email within one business day.',
    error: 'We could not send your message. Try again.'
  }

  const onSubmit = (event, values) => {
    console.warn(event.type, values)
  }

  const DESCRIPTION =
    'Up to $120,000 in service credits for your company. Azion Scale Up gives startups free credits, onboarding with Azion experts and 24/7 technical support while they build on the ' +
    'platform.'
</script>

<template>
  <HeroFormSection
    title="Azion Scale Up Credit Program"
    :description="DESCRIPTION"
    form-aria-label="Request immediate contact"
    :fields="fields"
    submit-label="Request immediate contact"
    :messages="messages"
    @submit="onSubmit"
  />
</template>
```
