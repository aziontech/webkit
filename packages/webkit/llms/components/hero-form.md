# Hero Form

> The opening band of a lead-capture page, where the form is the reason for the page: the hero copy and a list of highlights on one side, the form on the other, above the fold, with the client strip on the floor. It is a page section — the site places it from a `{ _id: 'hero-form', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `topic`, `field`, `input`, `select`, `phone-input`, `textarea`, `button` and `alert`. The fields are data: each entry of `fields` picks its control by `kind`, so the Contact page and the Under attack page are the same block with different `fields`. The block never sends: it validates the fields locally (required fields and the email format, with the messages from `messages`) and on a valid submit emits `submit` with the event and the values keyed by field `name`; the site posts them and reports the outcome back through `loading`, `submitted` and `error`.

- Import: `import HeroForm from '@aziontech/webkit/hero-form'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [hero-form.json](https://github.com/aziontech/webkit/blob/main/.specs/hero-form.json)

## When to use

- To open a page whose purpose is a lead form, such as Contact sales or Under attack.

## Do

- Give every field a unique `name`; it is the key of the submitted value.
- Mark half-width fields in pairs so each row stays full.
- Set `loading` while the values are sent, then `submitted` or `error` with the outcome.

## Don’t

- For a newsletter sign-up with one email field → use `closing-call-to-action-newsletter`.
- For an opening band with calls to action and no form → use `hero-band` or `hero-with-opening`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [closing-call-to-action-newsletter](closing-call-to-action-newsletter.md) — the other form section; same `submit` and state contract.
- [alert](alert.md) — renders the success and failure messages.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `messages` | `HeroFormMessages` | `—` | true | Copy of the form outcomes: `{ missing, invalidEmail, success, error }`. |
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `highlight` | `string` | `''` | false | Opening words of the headline, painted in the brand accent. |
| `title` | `string` | `''` | false | Page headline, rendered as the page `h1`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `items` | `HeroFormItem[]` | `[]` | false | The highlights under the description, in order; each is `{ icon, title, description }`. The list renders only when there are items. |
| `formAriaLabel` | `string` | `''` | false | Accessible name of the field group, read as its legend. |
| `fields` | `HeroFormField[]` | `[]` | false | The form fields in order; each is `{ name, kind, label, placeholder?, required?, half?, options?, country? }`. |
| `submitLabel` | `string` | `''` | false | Label of the submit button. |
| `carouselLabel` | `string` | `''` | false | Overline above the client strip. |
| `carouselMarks` | `string[]` | `[]` | false | Registry names of the client marks, in order; the strip renders only when there are marks. |
| `loading` | `boolean` | `false` | false | The site is sending the values: the button shows its loading state and a submit is ignored. |
| `submitted` | `boolean` | `false` | false | The site sent the values: the form gives way to `messages.success`. |
| `error` | `boolean` | `false` | false | The site could not send the values: `messages.error` shows under the form. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `submit` | `(event: SubmitEvent, values: Record<string, string>)` | Fired on a valid submit, not while `loading`; `values` holds every field by `name`, trimmed, with a phone number prefixed by its dial code. The block never sends it. |

## Assets

- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Ticker` prints it as a typographic wordmark, the quote components show no mark.

## States

- Visual states: `default`, `invalid`, `loading`, `submitted`, `error`
- `invalid`: on submit, an empty required field shows `messages.missing` and a malformed email `messages.invalidEmail` under the field; focus moves to the first field in error; editing the field clears it; nothing is emitted
- `loading` (prop): the button shows its loading state, every field is disabled (the scope locks off the one flag) and a submit emits nothing; `data-loading` on the root
- `submitted` (prop): the form is replaced by a success `Alert` with `messages.success`, which takes focus when focus was in the form; `data-submitted` on the root
- `error` (prop): a danger `Alert` with `messages.error` shows under the button; the form stays editable; `data-error` on the root
- Empty: when `title` is empty the band renders nothing but its root; when `items` is empty the list is omitted; when `carouselMarks` is empty the strip is omitted

## Accessibility

- Visible focus: owned by the field controls and `button`.
- Keyboard map: `Tab` walks the fields in order then the button; `Enter` in a text field or on the button submits.
- ARIA: the band is the `hero` `<section>` named by the title (`aria-label`); the root is a plain `div`. The fields sit in a `fieldset` whose visually hidden `legend` is `formAriaLabel`; each control is labelled through its own `Label` with an id from `useId`; each label is a `Label` rendered by the band, carrying the persistent Required tag of a `required` field from first render. An `email` field is an `<input type="email">` with `autocomplete="email"` and `spellcheck="false"`. Validation runs on submit only: a required field left empty takes the field's amber `required` state (warning border, `kind=required` helper, `aria-required`), a malformed email the red `invalid` state (`aria-invalid`), never both at once; the message is the field's helper text, and editing the field clears it. The success message is a `status` region and the failure message an `alert`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the composed components carry their own fallback.
- Touch target ≥40×40 px — the text fields and the button are large.

## Examples

### Default

```vue
<script setup>
  import HeroForm from '@aziontech/webkit/hero-form'

  const items = [
    {
      icon: 'ai ai-edge-ai',
      title: 'Build AI applications',
      description: 'Run AI agents and inference close to your users.'
    },
    {
      icon: 'ai ai-build-pillar',
      title: 'Modernize applications',
      description: 'Go from commit to a live URL in minutes.'
    },
    {
      icon: 'ai ai-secure-pillar',
      title: 'Protect applications and APIs',
      description: 'Block DDoS attacks, malicious bots, and API abuse.'
    },
    {
      icon: 'ai ai-app-accelerator',
      title: 'Speed up every workload',
      description: '100+ data centers, with a 30 ms median latency.'
    }
  ]

  const fields = [
    {
      name: 'firstname',
      kind: 'text',
      label: 'First name',
      half: true,
      required: true
    },
    {
      name: 'lastname',
      kind: 'text',
      label: 'Last name',
      half: true,
      required: true
    },
    {
      name: 'email',
      kind: 'email',
      label: 'Work email',
      placeholder: 'name@company.com',
      required: true
    },
    {
      name: 'role',
      kind: 'select',
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
      kind: 'text',
      label: 'Company',
      half: true,
      required: true
    },
    {
      name: 'mobilephone',
      kind: 'phone',
      label: 'Phone',
      country: 'US',
      required: true
    },
    {
      name: 'message',
      kind: 'textarea',
      label: 'How can we help?',
      placeholder:
        'Tell us about your current stack, your use case, and what you want to run on Azion.',
      required: true
    }
  ]

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    success: 'We will be in touch.',
    error: 'We could not send your message. Try again.'
  }

  const carouselMarks = [
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
    console.log(event.type, values)
  }
</script>

<template>
  <HeroForm
    eyebrow="Sales"
    highlight=""
    title="Talk to our sales team"
    description="Get a custom demo, plan your migration, and explore plans and pricing built for your company."
    :items="items"
    form-aria-label="Contact sales"
    :fields="fields"
    submit-label="Contact sales"
    :messages="messages"
    carousel-label="Trusted by teams running critical workloads"
    :carousel-marks="carouselMarks"
    @submit="onSubmit"
  />
</template>
```

### UnderAttack

```vue
<script setup>
  import HeroForm from '@aziontech/webkit/hero-form'

  const items = [
    {
      icon: 'ai ai-security-team',
      title: 'Help before you become a customer',
      description: 'Emergency mitigation for an attack in progress.'
    },
    {
      icon: 'ai ai-secure-pillar',
      title: '265B attacks blocked',
      description: 'Stopped on the Azion network since 2022.'
    },
    {
      icon: 'ai ai-build-pillar',
      title: '35B functions a month',
      description: 'Edge functions run every month for security controls.'
    },
    {
      icon: 'ai ai-app-accelerator',
      title: '+90% of requests served instantly',
      description: 'Customer requests answered close to your users.'
    }
  ]

  const fields = [
    {
      name: 'firstname',
      kind: 'text',
      label: 'Name',
      half: true,
      required: true
    },
    {
      name: 'lastname',
      kind: 'text',
      label: 'Last name',
      half: true,
      required: true
    },
    {
      name: 'email',
      kind: 'email',
      label: 'Business email',
      required: true
    },
    {
      name: 'company',
      kind: 'text',
      label: 'Company',
      half: true,
      required: true
    },
    {
      name: 'domain',
      kind: 'text',
      label: 'Website',
      half: true
    },
    {
      name: 'mobilephone',
      kind: 'phone',
      label: 'Phone',
      country: 'US',
      required: true
    }
  ]

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    success: 'We will be in touch.',
    error: 'We could not send your message. Try again.'
  }

  const carouselMarks = [
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
    console.log(event.type, values)
  }
</script>

<template>
  <HeroForm
    eyebrow="Under Cyberattack?"
    highlight=""
    title="Mitigating Cyberattacks"
    description="Our digital security team is available to provide immediate assistance."
    :items="items"
    form-aria-label="Request immediate contact"
    :fields="fields"
    submit-label="Request immediate contact"
    :messages="messages"
    carousel-label="Trusted by teams running critical workloads"
    :carousel-marks="carouselMarks"
    @submit="onSubmit"
  />
</template>
```

### Loading

```vue
<script setup>
  import HeroForm from '@aziontech/webkit/hero-form'

  const items = [
    {
      icon: 'ai ai-edge-ai',
      title: 'Build AI applications',
      description: 'Run AI agents and inference close to your users.'
    },
    {
      icon: 'ai ai-build-pillar',
      title: 'Modernize applications',
      description: 'Go from commit to a live URL in minutes.'
    },
    {
      icon: 'ai ai-secure-pillar',
      title: 'Protect applications and APIs',
      description: 'Block DDoS attacks, malicious bots, and API abuse.'
    },
    {
      icon: 'ai ai-app-accelerator',
      title: 'Speed up every workload',
      description: '100+ data centers, with a 30 ms median latency.'
    }
  ]

  const fields = [
    {
      name: 'firstname',
      kind: 'text',
      label: 'First name',
      half: true,
      required: true
    },
    {
      name: 'lastname',
      kind: 'text',
      label: 'Last name',
      half: true,
      required: true
    },
    {
      name: 'email',
      kind: 'email',
      label: 'Work email',
      placeholder: 'name@company.com',
      required: true
    },
    {
      name: 'role',
      kind: 'select',
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
      kind: 'text',
      label: 'Company',
      half: true,
      required: true
    },
    {
      name: 'mobilephone',
      kind: 'phone',
      label: 'Phone',
      country: 'US',
      required: true
    },
    {
      name: 'message',
      kind: 'textarea',
      label: 'How can we help?',
      placeholder:
        'Tell us about your current stack, your use case, and what you want to run on Azion.',
      required: true
    }
  ]

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    success: 'We will be in touch.',
    error: 'We could not send your message. Try again.'
  }

  const carouselMarks = [
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
    console.log(event.type, values)
  }
</script>

<template>
  <HeroForm
    eyebrow="Sales"
    highlight=""
    title="Talk to our sales team"
    description="Get a custom demo, plan your migration, and explore plans and pricing built for your company."
    :items="items"
    form-aria-label="Contact sales"
    :fields="fields"
    submit-label="Contact sales"
    :messages="messages"
    carousel-label="Trusted by teams running critical workloads"
    :carousel-marks="carouselMarks"
    :loading="true"
    @submit="onSubmit"
  />
</template>
```
