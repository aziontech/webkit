# Job Posting

> The body of a careers posting page, under the posting's title band: the description in rows, one per section of the posting (a heading, then its paragraphs and bullet lists), beside a sticky rail that restates the posting (its area, its title and its facets such as department, location and contract) with the link to the application; then the application form, and a dialog that confirms a sent application with a way back to the open positions. From the design sample's careers job page. It is a page section — the site places it from a `{ _id: 'job-posting', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `section-title`, `overline`, `button`, `field`, `label`, `input`, `phone-input`, `file-dropzone`, `file-token-group`, `alert`, `dialog` and `panel`. It collects data, so it follows the forms exception of the page-section contract: it validates on submit only and emits `submit`; the site sends the application and hands the outcome back through `loading`, `submitted` and `failed`.

- Import: `import JobPosting from '@aziontech/webkit/job-posting'`
- Category: sections · Surface: site · Structure: monolithic
- API as JSON: [job-posting.json](https://github.com/aziontech/webkit/blob/main/.specs/job-posting.json)

## When to use

- On the page of one open position, under a `hero-band` (`kind: 'title-band'`) that carries the posting's title and its apply link.

## Do

- Write each section as a short heading and its `blocks`: a `text` block per paragraph, a `list` block per bullet list, in the posting's order.
- Keep `facets` to the four the listing states (department, location, work arrangement, contract), each with a glyph.
- Set `form.anchor` (for example `apply`) and point the title band's action at `#apply`; the rail's apply button links there too.
- Put the format and size limits of a `file` field in its `helper`, and the accepted types in `accept`.
- Mark only what the team needs as `required`; say "Optional." in the `helper` of the rest.
- Send the application from the `submit` handler, read the file from `new FormData(event.target)`, and set `loading`, then `submitted` or `failed`.

## Don’t

- For the list of open positions → use `listing-browser`.
- For a lead or contact form at the top of a landing page → use `hero-form`.
- For a newsletter sign-up at the end of a page → use `closing-call-to-action-newsletter`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [hero-band](hero-band.md) — the title band above the posting; its action links to `#` plus `form.anchor`.
- [hero-form](hero-form.md) — the sibling page section that also emits `submit` and takes `loading`, `submitted` and `failed`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `form` | `JobPostingForm` | `—` | true | The application form: `{ title, description?, submitLabel, anchor?, ariaLabel?, fields }`, where `anchor` is the id of the apply section the rail button links to and a field is `{ name, kind, label, required?, helper?, placeholder?, accept?, autocomplete?, country? }`. |
| `messages` | `JobPostingMessages` | `—` | true | Copy of the form and its outcomes: `{ missing, invalidEmail, invalidUrl, error, successTitle, successDescription, done, browse }`. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `area` | `string` | `''` | false | Area the posting is filed under, the overline of the rail. |
| `title` | `string` | `''` | false | Title of the posting, restated at the top of the rail; the band renders nothing when empty. |
| `facets` | `JobPostingFacet[]` | `[]` | false | Facts about the posting listed in the rail, in order; each is `{ label, icon? }`. |
| `applyLabel` | `string` | `''` | false | Label of the rail button that links to the application form; the button is left out when empty. |
| `sections` | `JobPostingSection[]` | `[]` | false | The description, one row per section in order; each is `{ title, blocks }` where a block is `{ kind: 'text', text }` or `{ kind: 'list', items }`. |
| `secondaryAction` | `JobPostingAction` | `undefined` | false | Link in the confirmation dialog back to the open positions; `{ label, href }`. Omitted when absent. |
| `loading` | `boolean` | `false` | false | The site is sending the application: the submit button shows its loading state, every control is disabled and a submit is ignored. |
| `submitted` | `boolean` | `false` | false | The site sent the application: the confirmation dialog opens. |
| `failed` | `boolean` | `false` | false | The site could not send the application: `messages.error` shows under the submit button. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `submit` | `(event: SubmitEvent, values: Record<string, string>)` |  |

## States

- Visual states: `default`, `invalid`, `loading`, `submitted`, `failed`
- `invalid`: on submit, an empty required field shows `messages.missing`, a malformed email `messages.invalidEmail` and a URL that does not start with `http://` or `https://` `messages.invalidUrl` under the field; focus moves to the first field in error; editing the field (or picking a file) clears its message; nothing is emitted
- `loading` (prop): the submit button shows its loading state, the `fieldset` and every control are disabled and a submit emits nothing; `data-loading` on the root
- `submitted` (prop): when it turns on, the confirmation dialog opens with `messages.successTitle`, `messages.successDescription`, the `secondaryAction` link and a `messages.done` button; closing the dialog (Done, the close button, `Escape` or the overlay) clears the form; `data-submitted` on the root
- `failed` (prop): a danger `Alert` with `messages.error` shows under the submit button; the form stays editable; `data-failed` on the root
- File field: an inline `file-dropzone` with a browse button takes one file; once picked, the file shows in a `file-token-group` whose remove button clears it and brings the dropzone back
- Description: each section row after the first draws a rule above it (`data-ruled`); a `list` block is a bulleted list
- Rail: shown from the large breakpoint up, sticky under the site header while the description scrolls; the apply button renders only when `applyLabel` is set
- Disabled, readonly: not states of the band; `loading` is the only lock
- Empty: when `title` is empty the band renders nothing but its root; with no `sections` the description column is empty and the rail still renders; with no `facets` the facet list is left out

## Accessibility

- Visible focus: owned by the composed `button`, `input`, `phone-input`, `file-token-group` and `dialog` controls.
- Keyboard map: `Tab` walks the rail's apply link, then the fields in order (the file field's browse button, or its remove button once a file is picked), then the submit button; `Enter` in a text field or on the submit button submits; `Enter` or `Space` on the browse button opens the file picker. In the confirmation dialog `Tab` cycles the secondary action, Done and the close button (focus is trapped), and `Escape` closes it and returns focus (`dialog`'s Dialog (Modal) pattern).
- ARIA: the root is a plain `div` (the posting's title is the title band's heading); each description section heads with an `h2` through `section-title`; the rail restates the title as a paragraph, not a heading, so the outline lists the posting once. The fields sit in a `fieldset` whose visually hidden `legend` is `form.ariaLabel`, or `form.title`; each control is labelled through its own `Field.Label` with an id from `useId`, carrying the persistent Required tag of a `required` field from first render. An `email` field is an `<input type="email">` with `autocomplete="email"` and `spellcheck="false"`, a `url` field a text input with `inputmode="url"`. The file field's dropzone is a named `group`; its browse button is named `messages.browse` followed by the field label. Validation runs on submit only: a required field left empty takes the amber `required` state, a malformed value the red `invalid` state (`aria-invalid`), never both at once; the message is the field's helper text. The failure message is an `alert`; the confirmation is a modal `dialog` named by its title and described by its description.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components; copy uses the text tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the composed button, dropzone and dialog carry their own fallback.
- Touch target ≥40×40 px — the text fields, the buttons and the dialog actions are large or medium controls at least 40 px tall.

## Right-to-left

- Layout: logical utilities only (`border-s` on the rail, `ps-` on the bullet lists, `text-start`); the rail sits at the inline end.
- Icons: the apply button's `ai ai-chevron-right` is mirrored by `button`; facet glyphs are not mirrored.
- Keyboard: no arrow-key interaction of its own.
- User data: the posting copy is passed as props and inherits the page direction; field values are typed by the reader.

## Internationalization

No built-in strings: every visible string and accessible name comes from the props (`title`, `area`, `facets`, `applyLabel`, `sections`, `form`, `messages`, `secondaryAction`). The composed `dialog` close button and `file-dropzone` title keep their own locale catalogs.

| Key | English source | Override prop |
| --- | -------------- | ------------- |
| —   | —              | —             |

- Formatting: none; the file size in the file token is formatted by `file-token-group` with `Intl.NumberFormat`.

## Responsive

- Container queries: none; the band follows the page breakpoints.
- Narrow (below `lg`): the rail is hidden and the description takes the full width; the title band's apply link and the form remain. Below `sm` the form's fields stack in one column; from `sm` they sit two to a row, the file field across both.
- Touch: targets ≥ 40 px; no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the description holds a reading measure and wraps.

## Examples

### Default

```vue
<script setup>
  import JobPosting from '@aziontech/webkit/job-posting'
  import { nextTick, ref } from 'vue'

  const facets = [
    {
      label: 'Engineering',
      icon: 'ai ai-sitemap'
    },
    {
      label: 'San Francisco, California',
      icon: 'ai ai-map-pin'
    },
    {
      label: 'Hybrid',
      icon: 'ai ai-building'
    },
    {
      label: 'Full-time',
      icon: 'ai ai-clock'
    }
  ]

  const sections = [
    {
      title: 'About Acme',
      blocks: [
        {
          kind: 'text',
          text: 'Acme builds the platform teams use to ship and run their applications worldwide. We are a small team with a big footprint, and we care about tools that get out of the way.'
        }
      ]
    },
    {
      title: 'About the role',
      blocks: [
        {
          kind: 'text',
          text: 'As a Senior Platform Engineer you will turn quality into a built-in capability of our engineering platform: automation, internal tools and standards that remove manual steps from the delivery cycle.'
        },
        {
          kind: 'text',
          text: 'You will work with the development, platform and infrastructure teams on self-service tools, standard pipelines and automated release checks.'
        }
      ]
    },
    {
      title: 'What you will do',
      blocks: [
        {
          kind: 'list',
          items: [
            'Build and evolve standard CI/CD pipelines for tests, checks and releases.',
            'Write internal frameworks and tools for test automation.',
            'Automate functional, integration and end-to-end tests.',
            'Guide engineers in testing and automation practices.'
          ]
        }
      ]
    },
    {
      title: 'What you bring',
      blocks: [
        {
          kind: 'list',
          items: [
            'Experience with test automation and quality engineering.',
            'Solid experience with CI/CD and pipeline automation.',
            'Tooling written in TypeScript, Python or Go.',
            'Working knowledge of Linux and containers.'
          ]
        }
      ]
    }
  ]

  const form = {
    anchor: 'apply',
    title: 'Do you want to build with us?',
    description: 'Fill in the form to apply for this position.',
    submitLabel: 'Submit application',
    fields: [
      {
        name: 'name',
        kind: 'text',
        label: 'Name',
        required: true,
        autocomplete: 'name'
      },
      {
        name: 'email',
        kind: 'email',
        label: 'Email address',
        required: true,
        helper: 'We answer every application at this address.'
      },
      {
        name: 'phone',
        kind: 'phone',
        label: 'Contact number',
        required: true
      },
      {
        name: 'linkedin',
        kind: 'url',
        label: 'LinkedIn profile URL',
        helper: 'Optional.'
      },
      {
        name: 'resume',
        kind: 'file',
        label: 'Resume',
        required: true,
        accept: 'application/pdf,.docx,.doc',
        helper: '.pdf, .docx or .doc, up to 5 MB'
      }
    ]
  }

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter an email address like name@example.com.',
    invalidUrl: 'Enter the full URL, starting with https://.',
    error: 'We could not send your application. Try again in a few minutes.',
    successTitle: 'Application sent',
    successDescription:
      'Thank you for applying. We read every application and will reply by email.',
    done: 'Done',
    browse: 'Browse files'
  }

  const submitted = ref(false)

  const send = async () => {
    submitted.value = false
    await nextTick()
    submitted.value = true
  }
</script>

<template>
  <JobPosting
    area="Engineering"
    title="Senior Platform Engineer"
    apply-label="Apply for this position"
    :facets="facets"
    :sections="sections"
    :form="form"
    :messages="messages"
    :secondary-action="{ label: 'See open positions', href: '/careers' }"
    :submitted="submitted"
    @submit="send"
  />
</template>
```

### States

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import JobPosting from '@aziontech/webkit/job-posting'
  import { nextTick, ref } from 'vue'

  const form = {
    anchor: 'apply',
    title: 'Do you want to build with us?',
    description: 'Fill in the form to apply for this position.',
    submitLabel: 'Submit application',
    fields: [
      {
        name: 'name',
        kind: 'text',
        label: 'Name',
        required: true,
        autocomplete: 'name'
      },
      {
        name: 'email',
        kind: 'email',
        label: 'Email address',
        required: true,
        helper: 'We answer every application at this address.'
      }
    ]
  }

  const messages = {
    missing: 'This field is required.',
    invalidEmail: 'Enter an email address like name@example.com.',
    invalidUrl: 'Enter the full URL, starting with https://.',
    error: 'We could not send your application. Try again in a few minutes.',
    successTitle: 'Application sent',
    successDescription:
      'Thank you for applying. We read every application and will reply by email.',
    done: 'Done',
    browse: 'Browse files'
  }

  const submitted = ref(false)

  const confirm = async () => {
    submitted.value = false
    await nextTick()
    submitted.value = true
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div class="flex">
      <Button
        label="Show the confirmation"
        kind="outlined"
        size="medium"
        @click="confirm"
      />
    </div>
    <JobPosting
      area="Engineering"
      title="Senior Platform Engineer"
      apply-label="Apply for this position"
      :facets="[{ label: 'Engineering', icon: 'ai ai-sitemap' }]"
      :sections="[
        {
          title: 'About the role',
          blocks: [{ kind: 'text', text: 'You will build the tools our engineers ship with.' }]
        }
      ]"
      :form="form"
      :messages="messages"
      :secondary-action="{ label: 'See open positions', href: '/careers' }"
      :submitted="submitted"
      failed
    />
  </div>
</template>
```
