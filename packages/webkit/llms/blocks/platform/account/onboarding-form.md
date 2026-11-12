# OnboardingForm (`platform/account/onboarding-form`)

> The /signup/onboarding screen, frame included: the signed-out `GlobalHeader` over a two-column grid whose left column is a `Card` with a flat `Progress`, the step counter and heading, the step’s fields and a Back / Continue row, and whose right column, from `lg` up, is a wireframe of the app the new organization will open into. The flow shows one step at a time; each story here is one of the three. Built from `Field` with `Input`, `RadioCards` in a `fieldset` under a `Field.Legend` with a `HelperText`, a `Field.Label` choice card around a `Switch`, `Tag`, `Avatar` and `Button`; picking a paid plan opens the upgrade `Drawer` with `ToggleGroup`, `Field` with `Input`, `Select` and `Checkbox`, `Link` and `Alert`. A full page routed outside ConsoleLayout.

- Surface: product
- Source: `blocks/platform/account/onboarding-form/onboarding-form.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/account/onboarding-form")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [Checkbox](../../../components/checkbox.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, [Field](../../../components/field.md), [GlobalHeader](../../../components/global-header.md), [HelperText](../../../components/helper-text.md), [Input](../../../components/input.md), [Link](../../../components/link.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [PaymentBrand](../../../components/payment-brand.md), [Progress](../../../components/progress.md), [RadioCards](../../../components/radio-cards.md), [Select](../../../components/select.md), [Separator](../../../components/separator.md), [Switch](../../../components/switch.md), [Tag](../../../components/tag.md), [ToggleGroup](../../../components/toggle-group.md)
- Skills: `webkit-form`, `webkit-errors`, `webkit-microcopy`

## Asked as

onboarding; onboarding form; signup onboarding; create organization; organization setup; choose plan step; multi-step onboarding; onboarding wizard; welcome flow; first access setup; cadastro da organização; criar organização; onboarding da conta

The `/signup/onboarding` screen, frame included. A new user has an account but no organization yet, and needs to create one with as few questions as possible: one step at a time in a card (organization, plan, profile), with a live wireframe beside it from `lg` showing the app the organization will open into, named and colored by what they type. It is a full page with its own focused header: the app routes it outside `ConsoleLayout`, never into the layout's default slot.

## When to use

- The first run after sign-up, before the user has an organization.
- Any short, linear setup of two to four steps that must finish before the product is usable.

## When not to use

- Signing in or creating the account itself: use `platform/auth`.
- Creating a resource inside the console: use `platform/create/multipage-create` or `platform/create/provision-wizard`.
- Changing an existing plan: use `platform/account/change-plan-drawer`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

The signed-out bar (`headers/auth-header`): brand at the start, Documentation at the end.

### B. Brand — `Brand` (required)

In the bar, linked home with `aria-label="Azion home"`.

### C. Actions — `Button` (required)

Documentation in the bar; the step's `Continue` (primary, large, `type="submit"`). Later steps add `Back`, and the last step ends on `Create Organization`.

### D. Step card — `Card` (required)

Flush card capped at `--container-xl`, holding the progress bar and the form.

### E. Progress — `Progress` (required)

Flat, small, `value` of `max` steps, with `aria-label="Step 1 of 3"`. The visible `Step 1 of 3` line repeats it in text.

### F. Fields — `Field` (required)

Full name and organization name, each with `Field.Label` and `Field.Description`. On submit, an empty value sets `required` (amber) and the description becomes `This field is required.`

### G. Text inputs — `Input` (required)

Large; full name with `autocomplete="name"`.

### H. Group label — `Field.Legend` (required)

`Organization mark`, the `kind="label"` legend of the `fieldset` that holds the radio cards.

### I. Mark picker — `RadioCards` (required)

Seven colors, `aria-label="Organization mark"`, each card showing the generated mark.

### J. Mark — `Avatar` (required)

Square avatars: the generated marble in each radio card, and in the wireframe the organization and workspace.

### K. Picker hint — `HelperText` (required)

Under the picker: `Generated from the organization's name. Select its color.`

## Do

- Validate on submit, not on every keystroke; required fields show the amber prompt, not the red error.
- Explain the step under its heading before the fields (what an organization is, that it is created once).
- Keep every value when the user goes Back.
- Hide the wireframe below `lg`; it is decoration (`aria-hidden`).

## Don't

- Don't toast on this screen; a server failure creating the organization lands in one `Alert` in the card, as on the auth screens.
- Don't ask for anything the console can ask later.
- Don't show the stepper as navigation; steps are reached by Continue and Back only.

## Copy

- **Step line:** `Step 1 of 3`. **Heading:** the task: `Create your organization`.
- **Field descriptions:** why it is asked: `How the app will greet you.`, `Usually your company. Everyone you invite will see it.`
- **Required:** `This field is required.`
- **Final action:** names what is created: `Create Organization`.

## Accessibility

- The form is labelled by the step heading (`aria-labelledby`); on step change move focus to the heading (it has `tabindex="-1"`).
- The fields sit in a `fieldset` with a hidden legend.
- The progress bar's label and the visible step line say the same thing.

## States

- Organization: step 1 of 3, name fields and the organization mark.
- Plan: step 2 of 3, the plans as rows; Free selects directly, Pro or Enterprise opens the upgrade drawer and selects only once Upgrade is pressed.
- Profile: step 3 of 3, the usage and role questions, the onboarding-session switch and Create Organization, which locks the step while the request runs and answers in one `Alert` in the card: `Organization created.`, or, when the request fails (offline), `The organization wasn't created. Check your connection, then retry. Your answers are kept.` with Retry.

## Related

- `headers/auth-header` — the bar this screen renders.
- `platform/auth` — the screen before it.
- `platform/account/change-plan-drawer` — the upgrade drawer the Plan step opens.
- `platform/states/first-use` — what the new organization lands on.

## Steps

- organization
- plan
- profile

## Variants

- `Organization` — primary (the code below)
- `Plan` — Step 2 of 3: the three plans as full-width rows; Free selects directly, while Pro or Enterprise opens the upgrade drawer and only selects once Upgrade is pressed.
- `Profile` — Step 3 of 3: the usage and role questions, the onboarding-session switch and the Create Organization action.

Each variant is the same screen in another state: `get_pattern("platform/account/onboarding-form", { variant })`, or the file under `blocks/platform/account/onboarding-form/variants/`.

## Code (`Organization`)

```vue
<script setup lang="ts">
  import { primitives } from '@aziontech/theme/colors'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Progress from '@aziontech/webkit/progress'
  import RadioCards from '@aziontech/webkit/radio-cards'
  import { computed, ref } from 'vue'

  interface Accent {
    value: string
    label: string
    ariaLabel: string
    colors: string[]
  }

  const accents: Accent[] = [
    {
      value: 'orange',
      label: 'Orange',
      ariaLabel: 'Orange mark',
      colors: ['var(--color-orange-200)', 'var(--color-orange-700)', 'var(--color-yellow-400)']
    },
    {
      value: 'yellow',
      label: 'Yellow',
      ariaLabel: 'Yellow mark',
      colors: ['var(--color-yellow-200)', 'var(--color-orange-600)', 'var(--color-yellow-600)']
    },
    {
      value: 'red',
      label: 'Red',
      ariaLabel: 'Red mark',
      colors: ['var(--color-red-200)', 'var(--color-red-700)', 'var(--color-orange-500)']
    },
    {
      value: 'green',
      label: 'Green',
      ariaLabel: 'Green mark',
      colors: ['var(--color-green-200)', 'var(--color-green-700)', 'var(--color-blue-500)']
    },
    {
      value: 'blue',
      label: 'Blue',
      ariaLabel: 'Blue mark',
      colors: ['var(--color-blue-200)', 'var(--color-blue-700)', 'var(--color-violet-500)']
    },
    {
      value: 'violet',
      label: 'Violet',
      ariaLabel: 'Violet mark',
      colors: ['var(--color-violet-200)', 'var(--color-violet-700)', 'var(--color-blue-500)']
    },
    {
      value: 'gray',
      label: 'Gray',
      ariaLabel: 'Gray mark',
      colors: ['var(--color-gray-200)', 'var(--color-gray-700)', 'var(--color-slate-500)']
    }
  ]
  const email = 'myemail@example.com'

  const fullName = ref('')
  const organizationName = ref('')
  const accent = ref('orange')
  const submitted = ref(false)

  const accountInitials = (name: string) => {
    const words = String(name ?? '')
      .trim()
      .split(/\s+/)
      .filter((word) => /^[\p{L}\p{N}]/u.test(word))
    if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
    return (words[0] ?? '').slice(0, 2).toUpperCase()
  }

  const palette: Record<string, Record<string, string | Record<string, string>>> = primitives

  const marbleOf = (name: string, colors: string[]) => {
    let seed = 0
    for (let index = 0; index < name.length; index += 1) {
      seed = (seed << 5) - seed + name.charCodeAt(index)
      seed |= 0
    }
    seed = Math.abs(seed)
    const unit = (value: number, range: number, position?: number) => {
      const magnitude = value % range
      if (position && Math.floor((value / 10 ** position) % 10) % 2 === 0) return -magnitude
      return magnitude
    }
    const paint = (color: string) => {
      const [, family, step] = color.match(/^var\(--color-([a-z]+)-(\d+)\)$/) ?? []
      return family ? palette[family][step] : color
    }
    const layers = [0, 1, 2].map((index) => {
      const value = seed * (index + 1)
      const scale = 1.2 + unit(value, 4) / 10
      return {
        fill: paint(colors[(seed + index) % colors.length]),
        transform: `translate(${unit(value, 8, 1)} ${unit(value, 8, 2)}) rotate(${unit(value, 360, 1)} 40 40) scale(${scale})`
      }
    })
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">',
      '<defs><filter id="blur" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="7" /></filter></defs>',
      `<rect width="80" height="80" fill="${layers[0].fill}" />`,
      `<path filter="url(#blur)" transform="${layers[1].transform}" fill="${layers[1].fill}" d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z" />`,
      `<path filter="url(#blur)" transform="${layers[2].transform}" fill="${layers[2].fill}" style="mix-blend-mode: overlay" d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z" />`,
      '</svg>'
    ].join('')
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

  const previewName = computed(() => organizationName.value.trim() || 'Your organization')
  const ownerName = computed(() => fullName.value.trim() || email.split('@')[0])
  const marble = computed(() =>
    marbleOf(
      previewName.value,
      (accents.find((item) => item.value === accent.value) ?? accents[0]).colors
    )
  )
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader
      aria-label="Console"
      class="shrink-0"
    >
      <GlobalHeader.Brand>
        <a
          href="/"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </a>
      </GlobalHeader.Brand>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-book"
          href="https://example.com/docs"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div
        class="mx-auto grid w-full max-w-(--container-7xl) flex-1 grid-cols-1 items-center gap-(--spacing-xxl) px-(--layout-boundary-inline) py-(--spacing-xl) lg:min-h-0 lg:grid-cols-2 lg:items-start lg:overflow-y-auto lg:px-(--spacing-xl)"
      >
        <div class="mx-auto flex w-full max-w-(--container-xl) flex-col lg:my-auto">
          <Card
            :padded="false"
            class="w-full"
          >
            <template #content>
              <Progress
                :value="1"
                :max="3"
                size="small"
                shape="flat"
                class="shrink-0"
                aria-label="Step 1 of 3"
              />

              <div
                class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
              >
                <form
                  class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)"
                  aria-labelledby="onboarding-title"
                  novalidate
                  @submit.prevent="submitted = true"
                >
                  <header class="flex flex-col gap-(--spacing-xs)">
                    <div class="flex flex-col gap-(--spacing-xxs)">
                      <p class="text-label-sm text-(--text-muted)">Step 1 of 3</p>
                      <h1
                        id="onboarding-title"
                        tabindex="-1"
                        class="text-heading-sm text-(--text-default) focus:outline-none"
                      >
                        Create your organization
                      </h1>
                    </div>
                    <p class="text-body-sm text-(--text-muted)">
                      Everything you deploy lives inside an organization. Yours is created once,
                      here, and you can invite people into it afterwards.
                    </p>
                  </header>

                  <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0">
                    <legend class="sr-only">Create your organization</legend>

                    <div class="animate-fade-in motion-reduce:animate-none">
                      <div class="flex flex-col gap-(--spacing-lg)">
                        <Field :required="submitted && !fullName.trim()">
                          <Field.Label>Your full name</Field.Label>
                          <Input
                            v-model="fullName"
                            name="fullName"
                            size="large"
                            placeholder="Jane Doe"
                            autocomplete="name"
                          />
                          <Field.Description>{{
                            submitted && !fullName.trim()
                              ? 'This field is required.'
                              : 'How the app will greet you.'
                          }}</Field.Description>
                        </Field>

                        <Field :required="submitted && !organizationName.trim()">
                          <Field.Label>Organization name</Field.Label>
                          <Input
                            v-model="organizationName"
                            name="organizationName"
                            size="large"
                            placeholder="Acme Inc."
                          />
                          <Field.Description>{{
                            submitted && !organizationName.trim()
                              ? 'This field is required.'
                              : 'Usually your company. Everyone you invite will see it.'
                          }}</Field.Description>
                        </Field>

                        <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
                          <Field.Legend kind="label">Organization mark</Field.Legend>
                          <RadioCards
                            v-model="accent"
                            :items="accents"
                            aria-label="Organization mark"
                            class="w-full"
                          >
                            <template #default="{ item }">
                              <span class="flex flex-col items-center gap-(--spacing-xs)">
                                <Avatar
                                  :src="marbleOf(previewName, item.colors)"
                                  :alt="item.label"
                                  size="medium"
                                  kind="square"
                                />
                                <span class="text-body-xs text-(--text-muted)">{{
                                  item.label
                                }}</span>
                              </span>
                            </template>
                          </RadioCards>
                          <HelperText
                            label="Generated from the organization's name. Select its color."
                          />
                        </fieldset>
                      </div>
                    </div>
                  </fieldset>

                  <div class="flex items-center gap-(--spacing-sm)">
                    <div class="flex flex-1">
                      <Button
                        label="Continue"
                        kind="primary"
                        size="large"
                        class="w-full"
                        type="submit"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </template>
          </Card>
        </div>

        <div class="lg:sticky lg:top-(--spacing-xl) lg:my-auto lg:-me-(--spacing-xl)">
          <div
            class="relative hidden h-[calc(100dvh-12rem)] max-h-(--container-xl) min-h-(--container-sm) overflow-hidden mask-r-from-72% mask-b-from-80% lg:block"
          >
            <figure
              class="pointer-events-none absolute inset-y-0 start-0 m-0 flex w-(--container-3xl) flex-col overflow-hidden rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) select-none"
              aria-hidden="true"
            >
              <div
                class="flex h-(--size-14) shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) px-(--spacing-md)"
              >
                <span
                  class="size-(--size-5) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                />

                <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Avatar
                    :src="marble"
                    :alt="previewName"
                    size="small"
                    kind="square"
                    class="shrink-0"
                  />
                  <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
                    {{ previewName }}
                  </span>
                </span>

                <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Avatar
                    label="MW"
                    size="small"
                    kind="square"
                    class="shrink-0"
                  />
                  <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
                    My Workspace
                  </span>
                </span>

                <span class="ms-auto flex shrink-0 items-center gap-(--spacing-sm)">
                  <span
                    class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
                  />
                  <span
                    class="h-(--size-8) w-(--size-20) rounded-(--shape-button) bg-(--bg-placeholder)"
                  />
                  <span class="size-(--size-8) rounded-(--shape-button) bg-(--bg-placeholder)" />
                </span>
              </div>

              <div class="flex min-h-0 flex-1">
                <div
                  class="flex w-(--size-60) shrink-0 flex-col gap-(--spacing-md) overflow-hidden border-e-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
                >
                  <span
                    class="h-(--size-9) w-full shrink-0 rounded-(--shape-button) bg-(--bg-placeholder)"
                  />

                  <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
                    <span
                      v-for="width in ['58%', '76%', '48%', '66%']"
                      :key="width"
                      class="flex items-center gap-(--spacing-sm)"
                    >
                      <span
                        class="size-(--size-4) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                      />
                      <span
                        class="h-(--size-2) rounded-(--shape-elements) bg-(--bg-placeholder)"
                        :style="{ width }"
                      />
                    </span>
                  </div>

                  <span class="h-px w-full shrink-0 bg-(--border-muted)" />

                  <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
                    <span class="h-1.5 w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)" />
                    <span
                      v-for="width in ['70%', '44%', '80%', '54%']"
                      :key="width"
                      class="flex items-center gap-(--spacing-sm)"
                    >
                      <span
                        class="size-(--size-4) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                      />
                      <span
                        class="h-(--size-2) rounded-(--shape-elements) bg-(--bg-placeholder)"
                        :style="{ width }"
                      />
                    </span>
                  </div>

                  <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
                    <span class="h-1.5 w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)" />
                    <span
                      v-for="width in ['62%', '78%', '50%']"
                      :key="width"
                      class="flex items-center gap-(--spacing-sm)"
                    >
                      <span
                        class="size-(--size-4) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                      />
                      <span
                        class="h-(--size-2) rounded-(--shape-elements) bg-(--bg-placeholder)"
                        :style="{ width }"
                      />
                    </span>
                  </div>

                  <div
                    class="mt-auto flex min-w-0 shrink-0 items-center gap-(--spacing-xs) border-t-(length:--border-width-default) border-(--border-muted) pt-(--spacing-md)"
                  >
                    <Avatar
                      :label="accountInitials(ownerName)"
                      size="medium"
                      kind="square"
                    />
                    <span class="flex min-w-0 flex-col">
                      <span class="truncate text-label-sm text-(--text-default)">{{
                        ownerName
                      }}</span>
                      <span class="truncate text-body-xs text-(--text-muted)"
                        >myemail@example.com</span
                      >
                    </span>
                  </div>
                </div>

                <div class="min-w-0 flex-1 overflow-hidden bg-(--bg-canvas)">
                  <div
                    class="flex min-h-(--container-2xl) flex-col gap-(--spacing-lg) p-(--spacing-lg)"
                  >
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <p class="truncate text-heading-sm text-(--text-default)">
                        Hello, {{ ownerName }}
                      </p>
                      <p class="truncate text-body-sm text-(--text-muted)">
                        My Workspace · no projects yet
                      </p>
                    </div>

                    <div class="grid grid-cols-4 gap-(--spacing-md)">
                      <span
                        v-for="tile in 4"
                        :key="tile"
                        class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
                      >
                        <span
                          class="h-(--size-2) w-2/3 rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-3) w-1/2 rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                      </span>
                    </div>

                    <div
                      class="flex flex-1 flex-col rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
                    >
                      <span
                        class="flex shrink-0 items-center justify-between border-b-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
                      >
                        <span
                          class="h-(--size-2) w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-8) w-(--size-24) rounded-(--shape-button) bg-(--bg-placeholder)"
                        />
                      </span>
                      <span
                        v-for="row in 7"
                        :key="row"
                        class="flex shrink-0 items-center gap-(--spacing-lg) px-(--spacing-md) py-(--spacing-md)"
                      >
                        <span
                          class="h-(--size-2) flex-1 rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-2) w-[18%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                        <span
                          class="h-(--size-2) w-[10%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
```
