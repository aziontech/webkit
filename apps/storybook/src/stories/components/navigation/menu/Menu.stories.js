import Menu from '@aziontech/webkit/menu'
import MenuBack from '@aziontech/webkit/menu-back'
import MenuGroup from '@aziontech/webkit/menu-group'
import MenuItem from '@aziontech/webkit/menu-item'
import MenuSub from '@aziontech/webkit/menu-sub'
import MenuSubContent from '@aziontech/webkit/menu-sub-content'
import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'

import { toSfc } from '../../../_shared/story-source'

// Every runtime template below uses FLAT sub-component tags (<MenuGroup>, <MenuSub>, …)
// registered in `components`. Dot-notation (Menu.Group) does not resolve in a Storybook
// runtime template string, so the canvas would render nothing and clicks would do nothing.
// The snippets use the very same flat imports, so "Show code" stays paste-and-run.
const IMPORT_ROOT = "import Menu from '@aziontech/webkit/menu'"
const IMPORT_BACK = "import MenuBack from '@aziontech/webkit/menu-back'"
const IMPORT_GROUP = "import MenuGroup from '@aziontech/webkit/menu-group'"
const IMPORT_ITEM = "import MenuItem from '@aziontech/webkit/menu-item'"
const IMPORT_SUB = "import MenuSub from '@aziontech/webkit/menu-sub'"
const IMPORT_SUB_CONTENT = "import MenuSubContent from '@aziontech/webkit/menu-sub-content'"
const IMPORT_SUB_TRIGGER = "import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'"

const menuStoryComponents = {
  Menu,
  MenuBack,
  MenuGroup,
  MenuItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger
}

// The menu owns no shell: it fills the width the host gives it and paints no surface.
// This wrapper is the host and nothing more — a width so the rows are realistic, and
// `overflow-hidden` so a drill level is clipped as it slides. Deliberately no border, no
// radius and no fill: dressing the box would read as the menu's own chrome, and the menu
// is raw. A real host (Sidebar, a drawer) brings its own surface.
const HOST_CLASS = 'w-[264px] overflow-hidden'

/** @type {import('@storybook/vue3').Meta<typeof Menu>} */
const meta = {
  title: 'Components/Navigation/Menu',
  component: Menu,
  subcomponents: {
    MenuGroup,
    MenuItem,
    MenuSub,
    MenuSubTrigger,
    MenuSubContent,
    MenuBack
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'A vertical, hierarchical navigation menu. It owns no shell and no layout of its own — it is injected into a host (usually Sidebar, but any scroll container works) and renders three structures through one compound: groups that separate rows under a static title, condensed rows that own children and expand in place behind an indent rail, and drill rows that replace the menu with a second-level menu. A row that owns children always carries a trailing transparent `IconButton` arrow, and reveals its children from its whole width — unless it carries an `href` of its own, in which case its label becomes a link and the arrow alone reveals, so reaching the children never costs the reader the destination. Every row is typed the same (`.text-label-md`); only a first-level group title is smaller and muted, so hierarchy is carried by the indent and the rail rather than by shrinking each level. An inline trigger heads the rows it expands beneath it and leaves the icon column to them; a drill trigger sits amongst the destinations it is listed with and takes an icon like they do. Inside a `Sidebar` — which already renders the `<nav>` landmark — pass `role="presentation"`, and the menu drops its own role and accessible name together. Every sub-component is attached to the root for dot-notation (`Menu.Group`, `Menu.Sub`, …) and is also importable on its own — the snippets below use the standalone imports.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    groups: {
      control: 'object',
      description:
        'Data-driven navigation tree; each entry renders through `Menu.Group` and its items through `Menu.Item` / `Menu.Sub`. Composes with the default slot rather than replacing it.',
      table: {
        category: 'props',
        type: { summary: 'MenuGroupNode[]' },
        defaultValue: { summary: '[]' }
      }
    },
    activeId: {
      control: 'text',
      description: 'Id of the node rendered as selected in data-driven mode.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    enterOnMount: {
      control: 'boolean',
      description:
        'Plays the level entrance when the stack is already populated at mount, for a restored stack whose arrival is an entrance rather than a move inside a level the user was already in.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name for the navigation region. Not rendered when the host owns the landmark (`role="presentation"`), since a presentational element takes no name.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Menu'" }
      }
    },
    onNavigate: {
      action: 'navigate',
      description:
        'A leaf row — or the LINK of a row that owns children AND carries an `href` — was activated in data-driven mode; `node` is the activated tree node. A container with no `href` emits nothing at all, because it has nowhere to go, and revealing children never emits: that is a move inside the menu, not a navigation.',
      table: { category: 'events', type: { summary: '(event: MouseEvent, node: MenuNode)' } }
    },
    'onUpdate:path': {
      action: 'update:path',
      description:
        'The drill stack as ancestor node ids, outermost first. Empty at the root level (`v-model:path`).',
      table: { category: 'events', type: { summary: 'string[]' } }
    },
    'onUpdate:expanded': {
      action: 'update:expanded',
      description:
        'Ids of the inline subs currently open (`v-model:expanded`). Persist it when the host remounts, or expansion resets and one sub appears to close another.',
      table: { category: 'events', type: { summary: 'string[]' } }
    },
    default: {
      control: false,
      description:
        'The composed anatomy. Rendered before the `groups` tree, not instead of it — so a `Menu.Back` can accompany a data-driven menu.',
      table: { category: 'slots' }
    }
  },
  args: {
    groups: [],
    activeId: '',
    enterOnMount: false,
    ariaLabel: 'Console navigation'
  }
}

export default meta

// The composed anatomy shared by the canvas and the snippet, so the two cannot drift:
// the canvas binds `args` (Controls drive the root), the snippet shows concrete props.
const DEFAULT_BODY = `    <MenuGroup label="User agents">
      <MenuItem label="End User" icon="pi pi-user" href="/end-user" selected />
      <MenuItem label="Web Browser" icon="ai ai-domains" href="/web-browser" />
      <MenuItem label="Device Groups" icon="pi pi-mobile" href="/device-groups" />
    </MenuGroup>
    <MenuGroup label="Azion platform">
      <MenuItem label="Applications" icon="pi pi-th-large" href="/applications" />
      <MenuItem label="Edge Firewall" icon="pi pi-shield" href="/edge-firewall" tag-value="Beta" />
      <MenuItem label="Real-Time Metrics" icon="pi pi-chart-bar" href="/metrics" />
    </MenuGroup>`

const DEFAULT_RENDER_TEMPLATE = `<div class="${HOST_CLASS}">
  <Menu v-bind="args">
${DEFAULT_BODY}
  </Menu>
</div>`

const Template = (args) => ({
  components: menuStoryComponents,
  setup() {
    return { args }
  },
  template: DEFAULT_RENDER_TEMPLATE
})

const DEFAULT_SNIPPET = `<div class="${HOST_CLASS}">
  <Menu aria-label="Console navigation">
${DEFAULT_BODY}
  </Menu>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Menu>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A console-style menu: two titled groups and a selected row carrying `aria-current="page"`. A group title is static text — it separates rows without folding them, so it never competes with the rows it labels; folding belongs to a condensed row, which has a chevron and a rail to say which rows it owns. The host supplies the width, the surface and the scrolling; the menu adds no outer margin. Paste a tree into the `groups` control to switch the same root into data-driven mode — `groups` then renders through these very sub-components, with `navigate` firing per activated leaf.'
      },
      source: {
        code: toSfc([IMPORT_ROOT, IMPORT_GROUP, IMPORT_ITEM], DEFAULT_SNIPPET)
      }
    }
  }
}

// One template const per story: it renders the canvas AND builds the snippet.
const TYPES_TEMPLATE = `<div class="flex flex-wrap items-start gap-(--spacing-md)">
  <div class="${HOST_CLASS}">
    <Menu aria-label="Expands in place">
      <MenuGroup label="Expands in place">
        <MenuSub default-open>
          <MenuSubTrigger label="Getting started" kind="inline" />
          <MenuSubContent>
            <MenuItem label="Installation" icon="" href="/docs/install" />
            <MenuItem label="Quick start" icon="" href="/docs/quick-start" />
          </MenuSubContent>
        </MenuSub>
      </MenuGroup>
    </Menu>
  </div>
  <div class="${HOST_CLASS}">
    <Menu aria-label="Replaces the menu">
      <MenuBack />
      <MenuGroup label="Replaces the menu">
        <MenuSub>
          <MenuSubTrigger label="Settings" kind="drill" icon="pi pi-cog" />
          <MenuSubContent>
            <MenuItem label="General" icon="" href="/settings/general" />
            <MenuItem label="Members" icon="" href="/settings/members" />
          </MenuSubContent>
        </MenuSub>
      </MenuGroup>
    </Menu>
  </div>
</div>`

export const Types = {
  render: () => ({ components: menuStoryComponents, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Both `SubTrigger` kinds side by side. Every row that owns children is a box holding a label control and a transparent `IconButton` arrow — the arrow is always there, because it is the affordance that says the row owns children. What `href` decides is what the LABEL does, and so how much of the row reveals them. WITHOUT one — the common case, and the two rows here — the label reveals the children too, so the whole row does; the arrow stays as a redundant pointer target (`tabindex="-1"`, `aria-hidden`), because leaving it as the ONLY live target is 28px, 7% of the row\'s area, which on a phone reads as a broken menu. WITH an `href` the label becomes a real `<a>` and the arrow alone reveals, so reaching the children does not cost the reader the destination. `aria-expanded` + `aria-controls` always sit on whichever control expands them, never on both. `kind="inline"` gives the arrow a rotating `chevron-down`; `kind="drill"` a static `chevron-right` that replaces the menu with the pushed level and carries no `aria-expanded` — nothing expands. `ArrowRight` / `ArrowLeft` work from the row either way. The icon rule is unchanged: `icon` is honoured for `kind="drill"` only, and an inline trigger handed one still renders none.'
      },
      source: {
        code: toSfc(
          [
            IMPORT_ROOT,
            IMPORT_BACK,
            IMPORT_GROUP,
            IMPORT_ITEM,
            IMPORT_SUB,
            IMPORT_SUB_TRIGGER,
            IMPORT_SUB_CONTENT
          ],
          TYPES_TEMPLATE
        )
      }
    }
  }
}

const CONDENSED_TEMPLATE = `<div class="${HOST_CLASS}">
  <Menu aria-label="Documentation">
    <MenuGroup label="Documentation">
      <MenuSub default-open>
        <MenuSubTrigger label="Build" kind="inline" />
        <MenuSubContent>
          <MenuItem label="Overview" icon="" href="/build" />
          <MenuSub default-open>
            <MenuSubTrigger label="Edge Application" kind="inline" />
            <MenuSubContent>
              <MenuItem label="Rules Engine" icon="" href="/build/rules-engine" />
              <MenuItem label="Cache Settings" icon="" href="/build/cache-settings" />
            </MenuSubContent>
          </MenuSub>
          <MenuSub>
            <MenuSubTrigger label="Edge Functions" kind="inline" />
            <MenuSubContent>
              <MenuItem label="Runtime APIs" icon="" href="/build/runtime-apis" />
            </MenuSubContent>
          </MenuSub>
        </MenuSubContent>
      </MenuSub>
    </MenuGroup>
  </Menu>
</div>`

export const Condensed = {
  render: () => ({ components: menuStoryComponents, template: CONDENSED_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A three-level tree, the documentation-navigation case. Indentation is the nested list’s `padding-left`, and each nested list draws the connector rail on its rows — an elbow into the row it points at, plus a continuation line that stops at the last child. Expand "Edge Functions" to see a level open in place. Do not nest past three levels: the indent then eats the rail’s readable width, and a drill row is the right restructure.'
      },
      source: {
        code: toSfc(
          [
            IMPORT_ROOT,
            IMPORT_GROUP,
            IMPORT_ITEM,
            IMPORT_SUB,
            IMPORT_SUB_TRIGGER,
            IMPORT_SUB_CONTENT
          ],
          CONDENSED_TEMPLATE
        )
      }
    }
  }
}

// Starts at the ROOT level, always. A story that forced a pushed level would stack every
// teleported level at the top of the Docs page and blank the other canvases — so the
// reader drills by clicking, exactly as a consumer does.
const DRILL_TEMPLATE = `<div class="${HOST_CLASS}">
  <Menu aria-label="Console navigation">
    <MenuBack />
    <MenuGroup label="Account">
      <MenuItem label="Overview" icon="pi pi-home" href="/overview" selected />
      <MenuSub>
        <MenuSubTrigger label="Settings" kind="drill" />
        <MenuSubContent>
          <MenuItem label="General" icon="" href="/settings/general" />
          <MenuItem label="Members" icon="" href="/settings/members" />
          <MenuItem label="Billing" icon="" href="/settings/billing" />
        </MenuSubContent>
      </MenuSub>
    </MenuGroup>
  </Menu>
</div>`

export const Drill = {
  render: () => ({ components: menuStoryComponents, template: DRILL_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The view stack, interactive. Activate the `chevron-right` row to push its level — the whole row, because this row carries no `href` of its own; give it one and the row splits into a link plus an arrow, and only the arrow pushes: the root slides out, the level slides in, focus moves to the Back button, and the level that is not current leaves both the accessibility tree and the tab order. Back is a compact button rather than another full-width row, so the one control that leaves the level does not read as one of the rows inside it, and its text names where it lands — a bare `Back` when that is the unnamed root, `Back to Settings` from a deeper level, or whatever `label` supplies. It is declared once at the root and renders nothing there, so it needs no `v-if`. Popping (Back, ArrowLeft or Escape) restores focus to the trigger that pushed. The stack is readable as node ids through `v-model:path`.'
      },
      source: {
        code: toSfc(
          [
            IMPORT_ROOT,
            IMPORT_BACK,
            IMPORT_GROUP,
            IMPORT_ITEM,
            IMPORT_SUB,
            IMPORT_SUB_TRIGGER,
            IMPORT_SUB_CONTENT
          ],
          DRILL_TEMPLATE
        )
      }
    }
  }
}

const DISABLED_TEMPLATE = `<div class="${HOST_CLASS}">
  <Menu aria-label="Console navigation">
    <MenuGroup label="Azion platform">
      <MenuItem label="Applications" icon="pi pi-th-large" href="/applications" />
      <MenuItem label="Real-Time Purge" icon="pi pi-refresh" disabled />
      <MenuSub>
        <MenuSubTrigger label="Settings" kind="inline" disabled />
        <MenuSubContent>
          <MenuItem label="General" icon="" href="/settings/general" />
        </MenuSubContent>
      </MenuSub>
    </MenuGroup>
  </Menu>
</div>`

export const Disabled = {
  render: () => ({ components: menuStoryComponents, template: DISABLED_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A disabled row and a disabled trigger alongside enabled ones. Both carry `aria-disabled`, drop their hover and active ghost layers, and are out of the tab order; a disabled trigger suppresses every control of the row — it neither reveals nor announces — so its children stay collapsed. Its arrow paints no fill either: `IconButton`\'s filled disabled box would make the arrow the brightest thing on a row whose label had dimmed away. A disabled row that would otherwise be a link drops its `href` outright, since an anchor with no destination is not a link.'
      },
      source: {
        code: toSfc(
          [
            IMPORT_ROOT,
            IMPORT_GROUP,
            IMPORT_ITEM,
            IMPORT_SUB,
            IMPORT_SUB_TRIGGER,
            IMPORT_SUB_CONTENT
          ],
          DISABLED_TEMPLATE
        )
      }
    }
  }
}
