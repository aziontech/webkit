import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import FieldText from '@aziontech/webkit/field-text'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Skeleton from '@aziontech/webkit/skeleton'
import { computed, ref } from 'vue'

import { toSfc } from '../../_shared/story-source'

const quoted = (text) => `'${text.replaceAll("'", "\\'")}'`

const objectLiteral = (item) => {
  const entries = Object.entries(item).map(([key, value]) => `${key}: ${quoted(value)}`)
  const inline = `  { ${entries.join(', ')} }`
  return inline.length <= 100
    ? inline
    : `  {\n${entries.map((entry) => `    ${entry}`).join(',\n')}\n  }`
}

const listLine = (name, items) => `const ${name} = [\n${items.map(objectLiteral).join(',\n')}\n]`

const stringsLine = (name, items) => `const ${name} = [${items.map(quoted).join(', ')}]`

const PAGE_SIZE = 5
const LOAD_LATENCY_MS = 420

const MODES = [
  { label: 'Existing application', value: 'existing' },
  { label: 'New application', value: 'new' }
]

const APPLICATIONS = [
  { value: 'my-storefront', label: 'my-storefront', description: 'Next.js · acme/storefront' },
  { value: 'docs-site', label: 'docs-site', description: 'Astro · acme/docs' },
  { value: 'api-gateway', label: 'api-gateway', description: 'Hono · acme/api' },
  { value: 'marketing-site', label: 'marketing-site', description: 'Nuxt · acme/marketing' },
  { value: 'checkout', label: 'checkout', description: 'Remix · acme/checkout' },
  { value: 'status-page', label: 'status-page', description: 'Vite · acme/status' },
  { value: 'blog', label: 'blog', description: 'Hugo · acme/blog' }
]

const WIRE_WIDTHS = ['62%', '48%', '70%', '54%', '44%']
const WIRE_SUB_WIDTHS = ['84%', '66%', '78%', '58%', '72%']

const useBinding = ({ mode, loading }) => {
  const modeRef = ref(mode)
  const chosen = ref('my-storefront')
  const name = ref('')
  const submitted = ref(false)
  const query = ref('')
  const shown = ref(PAGE_SIZE)
  const loadingRef = ref(loading)

  const matches = computed(() => {
    const text = query.value.trim().toLowerCase()
    return text
      ? APPLICATIONS.filter((option) => option.label.toLowerCase().includes(text))
      : APPLICATIONS
  })
  const visible = computed(() => matches.value.slice(0, shown.value))
  const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))
  const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

  const loadMore = () => {
    loadingRef.value = true
    setTimeout(() => {
      shown.value += PAGE_SIZE
      loadingRef.value = false
    }, LOAD_LATENCY_MS)
  }

  return {
    submitted,
    modes: MODES,
    wireWidths: WIRE_WIDTHS,
    wireSubWidths: WIRE_SUB_WIDTHS,
    mode: modeRef,
    chosen,
    name,
    query,
    loading: loadingRef,
    matches,
    visible,
    remaining,
    nextBatch,
    loadMore
  }
}

const scriptFor = ({ mode, loading }) => [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import Skeleton from '@aziontech/webkit/skeleton'",
  "import { computed, ref } from 'vue'",
  '',
  `const PAGE_SIZE = ${PAGE_SIZE}`,
  listLine('modes', MODES),
  listLine('applications', APPLICATIONS),
  stringsLine('wireWidths', WIRE_WIDTHS),
  stringsLine('wireSubWidths', WIRE_SUB_WIDTHS),
  '',
  `const mode = ref('${mode}')`,
  "const chosen = ref('my-storefront')",
  "const name = ref('')",
  'const submitted = ref(false)',
  "const query = ref('')",
  'const shown = ref(PAGE_SIZE)',
  `const loading = ref(${loading})`,
  '',
  'const matches = computed(() => {',
  '  const text = query.value.trim().toLowerCase()',
  '  return text ? applications.filter((option) => option.label.toLowerCase().includes(text)) : applications',
  '})',
  'const visible = computed(() => matches.value.slice(0, shown.value))',
  'const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))',
  'const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))',
  '',
  'const loadMore = () => {',
  '  loading.value = true',
  '  setTimeout(() => {',
  '    shown.value += PAGE_SIZE',
  '    loading.value = false',
  `  }, ${LOAD_LATENCY_MS})`,
  '}'
]

const components = {
  Button,
  CardBox,
  FieldText,
  InputText,
  Item,
  'Item.List': Item.List,
  'Item.Media': Item.Media,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  SegmentedButton,
  Skeleton
}

const TEMPLATE = `<div class="layout-form-create">
  <CardBox :padded="false" title="Application">
    <template #content>
      <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
        <p class="text-body-sm text-(--text-muted)">
          What this workload serves. Bindings are per environment, so one workload can serve different applications on Production and Stage.
        </p>
        <SegmentedButton v-model="mode" :options="modes" size="large" fluid aria-label="Where the application comes from" />

        <p v-if="mode === 'existing'" class="text-body-sm text-(--text-muted)">
          The latest ready version of the selected application is what the release serves. Pin an older one from the deployment once the workload exists.
        </p>

        <div v-else class="pb-(--spacing-md)">
          <FieldText
            v-model="name"
            label="Name"
            input-id="application-name"
            name="name"
            size="large"
            placeholder="my-application"
            :required="submitted && !name"
            :helper-text="submitted && !name ? 'Name is required.' : 'Lowercase letters, numbers, and hyphens. Created with the workload and built before the release is cut; every resource made alongside it takes this name too.'"
          />
        </div>
      </div>

      <div v-if="mode === 'existing'" class="min-w-0 pt-(--spacing-md)">
        <div class="flex flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-md)">
          <InputText v-model="query" size="large" placeholder="Search applications" aria-label="Search applications" class="w-full">
            <template #iconLeft>
              <i class="pi pi-search" aria-hidden="true" />
            </template>
          </InputText>
        </div>

        <div class="border-t border-(--border-default)">
          <Item.List>
            <Item v-for="option in visible" :key="option.value" as-child size="small">
              <button
                type="button"
                class="w-full text-left data-[selected]:bg-(--bg-selected)"
                :data-selected="option.value === chosen || null"
                :aria-pressed="option.value === chosen"
                @click="chosen = option.value"
              >
                <Item.Media>
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)">
                    <i class="ai ai-edge-application leading-none text-(--text-default)" aria-hidden="true" />
                  </span>
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ option.label }}</Item.Title>
                  <Item.Description>{{ option.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <i v-if="option.value === chosen" class="pi pi-check shrink-0 text-(--text-default)" aria-hidden="true" />
                </Item.Actions>
              </button>
            </Item>

            <template v-if="loading">
              <Item v-for="index in nextBatch" :key="'wire-' + index" size="small" aria-hidden="true">
                <Item.Media>
                  <Skeleton kind="shape" width="2rem" height="2rem" />
                </Item.Media>
                <Item.Content>
                  <Skeleton :width="wireWidths[(index - 1) % wireWidths.length]" height="0.875rem" />
                  <Skeleton :width="wireSubWidths[(index - 1) % wireSubWidths.length]" height="0.75rem" />
                </Item.Content>
              </Item>
            </template>
          </Item.List>

          <div v-if="remaining" class="border-t border-(--border-default) p-(--spacing-xxs)">
            <Button
              type="button"
              :label="'Load ' + nextBatch + ' more'"
              kind="text"
              size="small"
              class="w-full"
              :loading="loading"
              @click="loadMore"
            />
          </div>

          <p v-if="!matches.length" class="px-(--spacing-md) py-(--spacing-md) text-body-sm text-(--text-muted)">
            No application matches “{{ query }}”. Create one instead, or clear the search.
          </p>
        </div>
      </div>
    </template>
  </CardBox>
</div>`

const meta = {
  title: 'Templates/Platform/Creation/ResourcePicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The card a create flow uses to bind one resource to another: a SegmentedButton chooses between an existing resource and a new one, then either a searchable list of the existing resources with a selected mark, paged five at a time with skeleton rows while the next page loads, or a single required name field. The workload wizard binds its application with it, and the function flow picks its host the same way. Built from `CardBox`, `SegmentedButton`, `FieldText`, `InputText`, `Item`, `Skeleton` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const story = (state, description) => ({
  render: () => ({
    components,
    setup: () => useBinding(state),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(scriptFor(state), TEMPLATE) }
    }
  }
})

export const Existing = story(
  { mode: 'existing', loading: false },
  'Existing application: the search box over the first five applications, my-storefront selected with a check mark, and a text button that loads the remaining two.'
)

export const New = story(
  { mode: 'new', loading: false },
  'New application: the picker gives way to a required Name `FieldText` whose helper states the allowed characters and when the application is built.'
)

export const Loading = story(
  { mode: 'existing', loading: true },
  'Loading the next page: two skeleton rows with staggered wire widths follow the visible applications while the load button spins.'
)
