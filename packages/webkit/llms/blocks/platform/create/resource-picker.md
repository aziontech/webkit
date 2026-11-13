# ResourcePicker (`platform/create/resource-picker`)

> The card a create flow uses to bind one resource to another: a lead, a ToggleGroup choosing between an existing resource and a new one, then either a hint over a searchable list of the existing resources with a selected mark, paged five at a time with skeleton rows while the next page loads and a polite status line for screen readers, or a Name `Field` around an `Input` whose helper text carries the allowed characters and turns into the required message once Next is pressed empty. The ToggleGroup disappears and the card opens on New when nothing exists to bind. ProvisionWizard binds its project with it on the first step, and its second step reuses the same paged list to pick an existing deployment. Built from `Card`, `ToggleGroup`, `Field`, `Input`, `HelperText`, `Item`, `Skeleton` and `Button`.

- Surface: product
- Source: `blocks/platform/create/resource-picker/resource-picker.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/create/resource-picker")`
- Components: [Button](../../../components/button.md), [Card](../../../components/card.md), [Field](../../../components/field.md), [HelperText](../../../components/helper-text.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [Skeleton](../../../components/skeleton.md), [ToggleGroup](../../../components/toggle-group.md)
- Skills: `webkit-form`, `webkit-ui-states`

## Asked as

resource picker; select existing or new; choose resource; bind resource; searchable picker; pick application; seletor de recurso; escolher recurso; existente ou novo

The band a create flow uses when the resource being created needs another resource that may already exist. The user either reuses one of theirs or makes a new one on the spot, and answers it in one place: an Existing / New choice, then a searchable, paged list of what exists or the few fields that create a new one. The chosen row is marked, every search and load is announced, and a missing answer is flagged above the list where it is seen first.

## When to use

- A create flow binds a whole resource that the user may reuse or create: the project a service serves, the deployment a release is cut against, the firewall that protects a workload.
- The candidates can run past seven, so the list needs search, paging and a no-match line.
- Creating the bound resource takes one or a few fields that fit in the same card.

## When not to use

- A single field that references an existing resource (a certificate, an environment, a function): use a select row inside the form, as `platform/create/provision-wizard` does for Environment.
- Choosing where a resource runs as a step of its own, with module tags and an inline create row: use the chooser in `platform/create/multipage-create` or `platform/create/source-wizard`.
- Browsing or managing the resources themselves: use `platform/view/table-view`.
- Creating the bound resource needs its own full form: link to its create page (`platform/create/single-page-create`) instead of nesting it here.

## Building blocks

### A. Band card — `Card` (required)

`Card :padded="false"` titled with the bound noun ("Project"), opening with one muted sentence on what the binding does. The card is flush so the list rows run edge to edge; text and controls carry their own padding. It sits in the form column (`layout-column-form`) like any other band.

### B. Existing / New choice — `ToggleGroup` (required when something exists)

A `ToggleGroup` at `size="large"`, `fluid`, with two options, `Existing <noun>` and `New <noun>`, and an `aria-label` that names the question. Existing is the default when at least one resource exists. When none exist the toggle is not rendered and the card opens on New. Switching modes keeps both answers: going to New and back finds the same row still chosen.

### C. New resource fields — `Field`, `Input` (required in New)

New swaps the list for the fields that create the resource, usually one Name `Field` with a large `Input` and a placeholder in the resource's own format. The `Field.Description` carries the allowed characters and becomes the required message once Next is pressed with it empty (`Field :required`). Nothing is judged while the user types.

### D. Search and required message — `Input`, `HelperText` (optional)

A large `Input` with a search icon, placeholder and matching `aria-label`, shown only when the list pages (more than one batch). It matches name and description. A `HelperText kind="required"` sits under the search and above the rows when Next is pressed with nothing chosen, and the wrapper takes `data-field-invalid`.

### E. Resource list — `Item`, `Skeleton` (required in Existing)

`Item.List` of small `clickable` `Item`s (native `button`s), one per resource: an icon in `Item.Media`, name in `Item.Title`, a secondary fact in `Item.Description`, and a check in `Item.Actions` on the chosen row. The chosen row takes `aria-pressed`, which fills it. While a batch loads, `Skeleton` rows in the same shape follow the visible ones, `aria-hidden`, with staggered widths. A value chosen beyond the first batch is revealed on open, never hidden behind Load more.

### F. Load more — `Button` (optional)

A transparent small full-width `Button` under the list while more matches remain, labelled with the size of the next batch and spinning with `:loading` while it fetches. The list pages five at a time. A no-match line replaces the rows when the search finds nothing, and a visually hidden `role="status"` line reports the count after every search and load.

## Do

- Default to Existing when anything exists, and drop the toggle entirely when nothing does.
- Mark the chosen row three ways: background, trailing check and `aria-pressed`.
- Keep the required message above the rows, under the search, so it is read before the list is scanned.
- Offer the other mode in the no-match line, so an empty search leads to creating one.
- Keep the chosen value when the user switches to New and back.
- Build the band once and pass the noun, icon and options; every flow that binds a resource reads the same (see `skills/webkit-create-surface`).

## Don't

- Don't use radio buttons or a select for a whole resource the user may also create; that is this band.
- Don't show the search for a list that fits in one batch.
- Don't validate the Name while it is being typed, or show required and invalid together.
- Don't render a loading spinner in place of the rows; show skeleton rows in the row shape and keep the visible ones.
- Don't put the create fields in a dialog or a second page; they belong in the same card.

## Copy

- **Card title:** the bound noun, singular, e.g. "Project".
- **Lead:** one sentence on what the binding does, e.g. "What this service serves on each environment, so one service can serve different projects on Production and Preview."
- **Toggle options:** `Existing <noun>` and `New <noun>`, e.g. "Existing project", "New project".
- **Search:** placeholder and `aria-label` name the collection, e.g. "Search projects".
- **Load more:** the verb and the batch size, e.g. "Load 5 more".
- **No match:** the fact, then both ways out, e.g. "No project matches “api”. Create one instead, or clear the search."
- **Required:** what to do, as a sentence, e.g. "Select the project this service serves, or create a new one."
- **Name guidance:** the allowed characters, e.g. "Lowercase letters, numbers, and hyphens."
- Follow `skills/webkit-microcopy`: "Select", never "Pick" or "Choose"; sentence case; no em dash.

## Accessibility

- The `ToggleGroup` has an `aria-label` that states the question, e.g. "Where the project comes from".
- Each row is a native `button` with `aria-pressed` reflecting the selection; the check icon is `aria-hidden`.
- Search has an `aria-label` that matches its placeholder.
- A `role="status"` region announces the count after every search, load and no-match, e.g. "5 of 19 projects".
- Skeleton rows are `aria-hidden`; the Load more `Button` carries `:loading` so its busy state is announced.
- The required message is tied to the search group by `data-field-invalid`, and focus stays where it was when it appears.

## States

- Existing: resources exist; the toggle sits on Existing with a row already chosen in the first batch.
- New: the user switched to New; the list gives way to the Name field with the allowed characters as helper text.
- Loading: Load more was pressed; five skeleton rows follow the visible ones and the button spins.
- Required: Next was pressed with nothing chosen; the required message sits under the search, above the list.

## Related

- `platform/create/provision-wizard` — binds its project with this band on the first step and reuses the list for the deployment.
- `platform/create/multipage-create` — the step wizard whose Where it runs chooser follows the same list rules.
- `platform/states/form-validation` — how required and invalid messages appear on submit.
- `Item` — the selectable row the list is built from; see `skills/webkit-form`.
- `ToggleGroup` — the Existing / New segment; see `skills/webkit-create-surface`.

## Variants

- `Existing` — primary (the code below)
- `New` — New project: the list gives way to a Name field with the allowed characters as helper text. It only reads as required once Next is pressed with it empty.
- `Loading` — Loading the next page: five skeleton rows with staggered wire widths follow the visible projects while the load button spins.
- `Required` — Next pressed with no project selected: the required message sits under the search, above the list.

Each variant is the same screen in another state: `get_pattern("platform/create/resource-picker", { variant })`, or the file under `blocks/platform/create/resource-picker/variants/`.

## Code (`Existing`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, reactive, ref } from 'vue'

  interface PickerOption {
    value: string
    label: string
    description?: string
  }

  interface PickerInitial {
    chosen?: string
    message?: string
    loading?: boolean
  }

  const projectModes = [
    { label: 'Existing project', value: 'existing' },
    { label: 'New project', value: 'new' }
  ]
  const projects: PickerOption[] = [
    { value: 'web-app', label: 'web-app', description: 'Astro · acme/web-app' },
    {
      value: 'black-friday-2025',
      label: 'black-friday-2025',
      description: 'Next.js · acme/black-friday-2025'
    },
    {
      value: 'black-friday-2026',
      label: 'black-friday-2026',
      description: 'Next.js · acme/black-friday-2026'
    },
    { value: 'docs-site', label: 'docs-site', description: 'Astro · acme/docs-site' },
    { value: 'docs-next', label: 'docs-next', description: 'Next.js · acme/docs-next' },
    { value: 'vue-sample', label: 'vue-sample', description: 'Vue · jane-doe/vue-sample' },
    { value: 'hello-world', label: 'hello-world', description: 'JavaScript · ' },
    { value: 'company-site', label: 'company-site', description: 'HTML · acme/company-site' },
    { value: 'company-docs', label: 'company-docs', description: 'HTML · ' },
    { value: 'analytics-pro', label: 'analytics-pro', description: 'Next.js · acme/analytics-pro' },
    { value: 'analytics-api', label: 'analytics-api', description: 'Next.js · ' },
    {
      value: 'react-dashboard',
      label: 'react-dashboard',
      description: 'React · acme/react-dashboard'
    },
    { value: 'docs-portal', label: 'docs-portal', description: 'Vue · ' },
    { value: 'ecommerce-v2', label: 'ecommerce-v2', description: 'Nuxt · shopco/ecommerce-v2' },
    { value: 'ecommerce-storefront', label: 'ecommerce-storefront', description: 'Nuxt · ' },
    {
      value: 'marketing-site',
      label: 'marketing-site',
      description: 'Astro · acme/marketing-site'
    },
    { value: 'blog-platform', label: 'blog-platform', description: 'Astro · ' },
    { value: 'status-page', label: 'status-page', description: 'Svelte · acme/status-page' },
    { value: 'mobile-app', label: 'mobile-app', description: 'Svelte · ' }
  ]
  const PAGE_SIZE = 5
  const wireWidths = ['62%', '48%', '70%', '54%', '44%']
  const wireSubWidths = ['84%', '66%', '78%', '58%', '72%']

  const usePicker = (options: PickerOption[], noun: string, initial: PickerInitial = {}) => {
    const query = ref('')
    const chosen = ref(initial.chosen ?? '')
    const message = ref(initial.message ?? '')
    const shown = ref(PAGE_SIZE)
    const loading = ref(initial.loading ?? false)

    const chosenIndex = options.findIndex((option) => option.value === chosen.value)
    if (chosenIndex >= PAGE_SIZE) shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE

    const paged = computed(() => options.length > PAGE_SIZE)
    const matches = computed(() => {
      const text = query.value.trim().toLowerCase()
      if (!text) return options
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(text) ||
          String(option.description ?? '')
            .toLowerCase()
            .includes(text)
      )
    })
    const visible = computed(() => matches.value.slice(0, shown.value))
    const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))
    const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

    const summary = computed(() => {
      if (loading.value) return 'Loading ' + nextBatch.value + ' more ' + noun + 's'
      if (query.value.trim() && !matches.value.length)
        return 'No ' + noun + ' matches ' + query.value
      if (remaining.value)
        return visible.value.length + ' of ' + matches.value.length + ' ' + noun + 's'
      return query.value.trim()
        ? matches.value.length + ' of ' + options.length + ' ' + noun + 's'
        : options.length + ' ' + noun + 's'
    })

    const loadMore = () => {
      if (loading.value || !remaining.value) return
      loading.value = true
      setTimeout(() => {
        shown.value += PAGE_SIZE
        loading.value = false
      }, 420)
    }

    return reactive({
      query,
      chosen,
      message,
      loading,
      paged,
      matches,
      visible,
      remaining,
      nextBatch,
      summary,
      loadMore
    })
  }

  const mode = ref('existing')
  const name = ref('')
  const projectPicker = usePicker(projects, 'project', {
    chosen: 'web-app',
    loading: false,
    message: ''
  })
</script>

<template>
  <div class="layout-column-form">
    <Card
      :padded="false"
      title="Project"
    >
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
          <p class="text-body-sm text-(--text-muted)">
            What this service serves on each environment, so one service can serve different
            projects on Production and Preview.
          </p>
          <ToggleGroup
            v-model="mode"
            :options="projectModes"
            size="large"
            fluid
            aria-label="Where the project comes from"
          />

          <p
            v-if="mode === 'existing'"
            class="text-body-sm text-(--text-muted)"
          >
            The release serves the latest ready version of the selected project, and an older one
            can be pinned from the deployment.
          </p>

          <div
            v-if="mode === 'new'"
            class="pb-(--spacing-md)"
          >
            <Field :required="!!projectPicker.message">
              <Field.Label>Name</Field.Label>
              <Input
                v-model="name"
                size="large"
                placeholder="my-project"
              />
              <Field.Description>{{
                projectPicker.message || 'Lowercase letters, numbers, and hyphens.'
              }}</Field.Description>
            </Field>
          </div>
        </div>

        <div
          v-if="mode === 'existing'"
          class="min-w-0 pt-(--spacing-md)"
        >
          <div
            v-if="projectPicker.paged || projectPicker.message"
            :data-field-invalid="projectPicker.message || null"
            class="flex flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-md)"
          >
            <Input
              v-if="projectPicker.paged"
              v-model="projectPicker.query"
              size="large"
              class="w-full"
              placeholder="Search projects"
              aria-label="Search projects"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>

            <HelperText
              v-if="projectPicker.message"
              kind="required"
              >{{ projectPicker.message }}</HelperText
            >
          </div>

          <div class="border-t border-(--border-default)">
            <Item.List>
              <Item
                v-for="option in projectPicker.visible"
                :key="option.value"
                size="small"
                clickable
                :aria-pressed="option.value === projectPicker.chosen"
                @click="projectPicker.chosen = option.value"
              >
                <Item.Media>
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      class="pi pi-box text-body-md leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ option.label }}</Item.Title>
                  <Item.Description>{{ option.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <i
                    v-if="option.value === projectPicker.chosen"
                    class="pi pi-check shrink-0 text-(--text-default)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </Item>

              <template v-if="projectPicker.loading">
                <Item
                  v-for="index in projectPicker.nextBatch"
                  :key="'wire-' + index"
                  size="small"
                  aria-hidden="true"
                >
                  <Item.Media>
                    <Skeleton
                      kind="shape"
                      width="2rem"
                      height="2rem"
                    />
                  </Item.Media>
                  <Item.Content>
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Skeleton
                        :width="wireWidths[(index - 1) % wireWidths.length]"
                        height="0.875rem"
                      />
                      <Skeleton
                        :width="wireSubWidths[(index - 1) % wireSubWidths.length]"
                        height="0.75rem"
                      />
                    </div>
                  </Item.Content>
                </Item>
              </template>
            </Item.List>

            <div
              v-if="projectPicker.remaining"
              class="border-t border-(--border-default) p-(--spacing-xxs)"
            >
              <Button
                type="button"
                :label="'Load ' + projectPicker.nextBatch + ' more'"
                kind="transparent"
                size="small"
                class="w-full"
                :loading="projectPicker.loading"
                @click="projectPicker.loadMore"
              />
            </div>

            <p
              v-if="!projectPicker.matches.length"
              class="px-(--spacing-md) py-(--spacing-md) text-body-sm text-(--text-muted)"
            >
              No project matches “{{ projectPicker.query }}”. Create one instead, or clear the
              search.
            </p>

            <span
              class="sr-only"
              role="status"
              >{{ projectPicker.summary }}</span
            >
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
```
