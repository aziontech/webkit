import IconButton from '@aziontech/webkit/icon-button'
import Tag from '@aziontech/webkit/tag'
import Tree from '@aziontech/webkit/tree'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Tree from '@aziontech/webkit/tree'"
const REF_IMPORT = "import { ref } from 'vue'"

const folder = (id, label, children) => ({ id, label, icon: 'pi pi-folder', children })
const file = (id, label, description) => ({ id, label, icon: 'pi pi-file', description })

const bucketItems = [
  folder('assets', 'assets', [
    folder('assets/images', 'images', [
      file('assets/images/hero.webp', 'hero.webp', '248 KB'),
      file('assets/images/logo.svg', 'logo.svg', '12 KB')
    ]),
    folder('assets/fonts', 'fonts', [file('assets/fonts/rubik.woff2', 'rubik.woff2', '64 KB')]),
    file('assets/styles.css', 'styles.css', '18 KB')
  ]),
  folder('reports', 'reports', [
    file('reports/2026-10.csv', '2026-10.csv', '1.2 MB'),
    file('reports/2026-11.csv', '2026-11.csv', '840 KB')
  ]),
  file('index.html', 'index.html', '4 KB'),
  file('robots.txt', 'robots.txt', '1 KB')
]

const statuses = {
  'assets/styles.css': { label: 'Modified', severity: 'warning' },
  'index.html': { label: 'Published', severity: 'success' },
  'robots.txt': { label: 'Draft', severity: 'secondary' }
}

const DEFAULT_EXPANDED = ['assets', 'assets/images']
const DEFAULT_SELECTED = 'assets/images/hero.webp'

const indent = (depth) => '  '.repeat(depth)

const toLiteral = (value, depth = 0) => {
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const entries = value.map((entry) => `${indent(depth + 1)}${toLiteral(entry, depth + 1)}`)
    return `[\n${entries.join(',\n')}\n${indent(depth)}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .map(([key, entry]) => {
        const name = /^[A-Za-z_$][\w$]*$/.test(key) ? key : `'${key}'`
        return `${indent(depth + 1)}${name}: ${toLiteral(entry, depth + 1)}`
      })
    return `{\n${entries.join(',\n')}\n${indent(depth)}}`
  }
  return typeof value === 'string' ? `'${value}'` : String(value)
}

const ITEMS_SOURCE = `const items = ${toLiteral(bucketItems)}`
const EXPANDED_SOURCE = `const expanded = ref(${toLiteral(DEFAULT_EXPANDED)})`

const statefulSource = (imports, extraLines, markup) =>
  toSfc([...imports, REF_IMPORT, '', ITEMS_SOURCE, '', EXPANDED_SOURCE, ...extraLines], markup)

const meta = {
  title: 'Components/Primitives/Data/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A hierarchical list of nodes, each row a name with an optional glyph and one line of detail, where a parent row folds its children open and closed under a chevron. It renders a nested `items` structure on its own and follows the WAI-ARIA tree pattern, so it fits file and object browsers: the objects of a bucket, the source files of a deployment, the routes of an application. Unlike `Menu` it navigates data, not the app, and unlike `Accordion` its nodes are rows of the same kind at any depth, not panels of free content.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'Nodes to render; each is `{ id, label, icon?, description?, disabled?, children? }`. A node with a non-empty `children` array is a parent.',
      table: { type: { summary: 'TreeItem[]' }, defaultValue: { summary: '[]' }, category: 'props' }
    },
    selectable: {
      control: 'boolean',
      description:
        'Enables single selection: activating a node writes its id to `v-model:selected` and marks it `aria-selected`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    loading: {
      control: 'boolean',
      description: 'Renders Skeleton rows in place of the tree and sets `aria-busy`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    emptyTitle: {
      control: 'text',
      description: 'Title of the default empty state shown when `items` is empty.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'No items'" },
        category: 'props'
      }
    },
    emptyDescription: {
      control: 'text',
      description: 'Supporting line under the empty title.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the tree.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    expanded: {
      control: false,
      description: 'Ids of the expanded parents (`v-model:expanded`). Uncontrolled when unbound.',
      table: { type: { summary: 'string[]' }, defaultValue: { summary: '[]' }, category: 'v-model' }
    },
    selected: {
      control: false,
      description:
        'Id of the selected node (`v-model:selected`), read and written only while `selectable`. An empty string means nothing is selected.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'v-model' }
    },
    onItemClick: {
      action: 'item-click',
      description:
        'A node activated by a click on its row or Enter / Space on the focused node. Not fired for a disabled node, the chevron, or the actions region.',
      table: {
        type: { summary: '(event: MouseEvent | KeyboardEvent, item: TreeItem)' },
        category: 'events'
      }
    },
    'onUpdate:expanded': {
      action: 'update:expanded',
      description: 'Emitted with the new array of expanded parent ids.',
      table: { type: { summary: 'string[]' }, category: 'events' }
    },
    'onUpdate:selected': {
      action: 'update:selected',
      description: 'Emitted with the id of the newly selected node while `selectable`.',
      table: { type: { summary: 'string' }, category: 'events' }
    },
    item: {
      control: false,
      description:
        'Replaces the label region of every row (glyph, label, description). The chevron, indentation, row states and actions region stay owned by the tree.',
      table: {
        type: { summary: '{ item: TreeItem; level: number; expanded: boolean }' },
        category: 'slots'
      }
    },
    actions: {
      control: false,
      description:
        'Trailing per-row controls, end-aligned in the row. Clicks and keys inside it do not activate the row.',
      table: { type: { summary: '{ item: TreeItem; level: number }' }, category: 'slots' }
    },
    empty: {
      control: false,
      description: 'Replaces the default empty state.',
      table: { type: { summary: '—' }, category: 'slots' }
    }
  },
  args: {
    items: bucketItems,
    selectable: false,
    loading: false,
    emptyTitle: 'No items',
    emptyDescription: '',
    ariaLabel: 'Bucket objects'
  }
}

export default meta

const Template = (args) => ({
  components: { Tree },
  setup() {
    const expanded = ref([...DEFAULT_EXPANDED])
    const selected = ref(DEFAULT_SELECTED)
    return { args, expanded, selected }
  },
  template: `
    <div class="max-w-(--container-sm)">
      <Tree v-bind="args" v-model:expanded="expanded" v-model:selected="selected" />
    </div>
  `
})

const DEFAULT_MARKUP = `<div class="max-w-(--container-sm)">
  <Tree
    v-model:expanded="expanded"
    :items="items"
    aria-label="Bucket objects"
  />
</div>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A bucket-like file tree three levels deep, with glyphs and size descriptions. Two folders are seeded in `v-model:expanded`; the chevron and ArrowRight / ArrowLeft fold the rest.'
      },
      source: { code: statefulSource([IMPORT], [], DEFAULT_MARKUP) }
    }
  }
}

const SELECTABLE_MARKUP = `<div class="flex max-w-(--container-sm) flex-col gap-(--spacing-md)">
  <Tree
    v-model:expanded="expanded"
    v-model:selected="selected"
    :items="items"
    selectable
    aria-label="Bucket objects"
  />
  <p class="text-body-sm text-(--text-muted)">Selected: {{ selected || 'none' }}</p>
</div>`

export const Selectable = {
  args: { selectable: true },
  render: (args) => ({
    components: { Tree },
    setup() {
      const expanded = ref([...DEFAULT_EXPANDED])
      const selected = ref(DEFAULT_SELECTED)
      return { args, expanded, selected }
    },
    template: `
      <div class="flex max-w-(--container-sm) flex-col gap-(--spacing-md)">
        <Tree v-bind="args" v-model:expanded="expanded" v-model:selected="selected" />
        <p class="text-body-sm text-(--text-muted)">Selected: {{ selected || 'none' }}</p>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'With `selectable`, activating a node writes its id to `v-model:selected`, marks the row selected and sets `aria-selected`. The bound id is shown under the tree.'
      },
      source: {
        code: statefulSource(
          [IMPORT],
          [`const selected = ref('${DEFAULT_SELECTED}')`],
          SELECTABLE_MARKUP
        )
      }
    }
  }
}

const CUSTOM_ITEM_SLOTS = `  <template #item="{ item }">
    <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
      <i :class="item.icon" aria-hidden="true" />
      <span class="min-w-0 truncate text-label-md text-(--text-default)">{{ item.label }}</span>
      <Tag
        v-if="statuses[item.id]"
        :label="statuses[item.id].label"
        :severity="statuses[item.id].severity"
        size="small"
      />
    </span>
  </template>
  <template #actions="{ item }">
    <IconButton
      icon="pi pi-ellipsis-h"
      kind="transparent"
      size="small"
      :aria-label="'More actions for ' + item.label"
    />
  </template>`

const CUSTOM_ITEM_MARKUP = `<div class="max-w-(--container-sm)">
  <Tree
    v-model:expanded="expanded"
    :items="items"
    aria-label="Bucket objects"
  >
  ${CUSTOM_ITEM_SLOTS.split('\n').join('\n  ')}
  </Tree>
</div>`

export const CustomItem = {
  name: 'Custom Item',
  render: (args) => ({
    components: { Tree, Tag, IconButton },
    setup() {
      const expanded = ref([...DEFAULT_EXPANDED])
      const selected = ref(DEFAULT_SELECTED)
      return { args, expanded, selected, statuses }
    },
    template: `
      <div class="max-w-(--container-sm)">
        <Tree v-bind="args" v-model:expanded="expanded" v-model:selected="selected">
        ${CUSTOM_ITEM_SLOTS}
        </Tree>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The `item` slot replaces the label region of every row, here adding a status `Tag`; the `actions` slot adds an end-aligned `IconButton` per row. The chevron, indentation and row states stay owned by the tree.'
      },
      source: {
        code: statefulSource(
          [
            IMPORT,
            "import Tag from '@aziontech/webkit/tag'",
            "import IconButton from '@aziontech/webkit/icon-button'"
          ],
          ['', `const statuses = ${toLiteral(statuses)}`],
          CUSTOM_ITEM_MARKUP
        )
      }
    }
  }
}

const LOADING_MARKUP = `<div class="max-w-(--container-sm)">
  <Tree loading aria-label="Bucket objects" />
</div>`

export const Loading = {
  args: { loading: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'While `loading`, the tree renders Skeleton rows in its place and sets `aria-busy` on the root.'
      },
      source: { code: toSfc(IMPORT, LOADING_MARKUP) }
    }
  }
}

const EMPTY_TITLE = 'No objects yet'
const EMPTY_DESCRIPTION = 'Objects added to this bucket appear here.'

const EMPTY_MARKUP = `<div class="max-w-(--container-sm)">
  <Tree
    :items="[]"
    empty-title="${EMPTY_TITLE}"
    empty-description="${EMPTY_DESCRIPTION}"
    aria-label="Bucket objects"
  />
</div>`

export const Empty = {
  args: { items: [], emptyTitle: EMPTY_TITLE, emptyDescription: EMPTY_DESCRIPTION },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'With an empty `items` array the tree shows the default `EmptyState`, titled by `emptyTitle` with `emptyDescription`. Pass the `empty` slot to replace it.'
      },
      source: { code: toSfc(IMPORT, EMPTY_MARKUP) }
    }
  }
}
