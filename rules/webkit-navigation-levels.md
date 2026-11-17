# Rule: navigation levels — one owner per level, a destination once per screen

A console screen has at most three navigation levels, and each has one owner. When two controls list
the same pages, their active rows disagree, the reader cannot tell which one says "where I am", and
the extra column squeezes the content.

| Level | Owner                                                        | Lists                                            |
| ----- | ------------------------------------------------------------ | ------------------------------------------------ |
| 1     | the rail: `ConsoleLayout` `navigation`, its drill levels too | modules and first-level pages                    |
| 2     | `PageTabs` of a resource or of a split module                | the pages of that resource or module             |
| 3     | the `detail/sectioned-resource` block, in one tab            | more than 7 sibling pages of that tab, in groups |

The breadcrumb is not a level: it names where the reader is.

A drawer is not a level either. It has no route, and it opens only at the end of the path, over the
screen that owns its item: `rail → module list → resource page → tab → drawer (large) → nested
drawer (medium)`.

## Do

- Give each level one control. A screen shows the rail, at most one `PageTabs`, and at most one
  local navigation inside the active tab.
- Offer each destination once per screen. Compare the `href`s (path without query and hash) of the
  rail rows, the current drill level included, the tabs and the local navigation: no route appears
  twice.
- Point a rail row at a page that needs no resource: a module list, a first-level page, or the
  resource list. Pages that exist only inside a resource (the rule families of a policy, the records
  of a zone, the settings of one application) are reached through that resource: its list row, its
  tabs, its local navigation.
- Put 7 or fewer sibling pages on tabs, a `ToggleGroup` or sections of one page. Only past 7 does a
  tab carry a local navigation, and only as the `detail/sectioned-resource` block: a
  `--container-3xs` column that folds into a labelled `Select` below `@3xl` of the tab body.
- Derive every active row from the route. Each level marks exactly one row `aria-current="page"`,
  the marked rows of all levels describe the same place, and a level whose rows do not hold the
  current page marks none.
- Navigate to the resource's page when the reader opens, configures or edits a product or a
  resource (Configure, Settings, Edit), on the tab that holds it (`?tab=settings`).
- Open a drawer only over the screen that owns its item: a tab of the resource, or the list that
  holds it. The first drawer is `size="large"`; a nested drawer is `size="medium"`, and there is at
  most one. The AI assistant drawer (`ai/ai-chat-drawer`) is the one first drawer that
  stays `medium`.
- Offer `Create <noun>` on every field that needs a resource that may not exist yet. It opens a
  drawer with that resource's create form over the form that needs it (`large` from a page, `medium`
  from a drawer), and saving selects the new resource. This holds for first-level resources too.

## Do not

- Do not render a free `SidebarMenu` in a page body, least of all one whose rows repeat the rail.
- Do not add rail rows that route into a resource, not even as shortcuts into a default resource.
  When a module needs a shortcut, the rail row opens the resource list or the resource itself.
- Do not add a fourth level, or a second local navigation in one tab.
- Do not set an active row by hand (`activeId`, a hard-coded `aria-current`) on a page whose route
  already matches a row.
- Do not open a drawer as the first surface of a product or a resource, or over a screen that does
  not own its item (configuring a product from the product list, a dashboard or the rail).
- Do not stack a third drawer, or a nested drawer as wide as its parent. A flow that needs a third
  layer is a page: open it in a new tab.
- Do not send the reader to another page to create a missing resource and come back. Only a create
  of several steps opens its page, in a new tab, with a `Refresh` on the field.
- Do not put `PageTabs`, a breadcrumb or a local navigation inside a drawer. A drawer that needs one
  is a page.

## Correct

The rail lists the module and opens the resource list; the policy's own pages live in its tabs and,
past 7, in the block:

```ts
const navigation = [
  {
    label: 'Security',
    items: [
      { id: 'policies', label: 'Policies', icon: 'az az-shield', href: '/policies' },
      { id: 'certificates', label: 'Certificates', icon: 'az az-lock', href: '/certificates' }
    ]
  }
]
```

## Wrong

A rail drill level whose rows route into one default policy, repeated by a `SidebarMenu` inside that
policy's tab:

```ts
const navigation = [
  {
    label: 'Security',
    items: [
      {
        id: 'private-access',
        label: 'Private access',
        icon: 'az az-lock',
        type: 'drill',
        groups: [
          {
            label: 'Rules',
            items: [
              { id: 'segments', label: 'App segments', href: '/policies/default/segments' },
              { id: 'access-rules', label: 'Access rules', href: '/policies/default/access-rules' }
            ]
          }
        ]
      }
    ]
  }
]
```

## Enforced

- `webkit/no-page-navigation-menu` (ESLint, warning) flags a `SidebarMenu` rendered in a page body (under
  `views/` or `pages/`, or with a `PageHeader` / `PageTabs` import) outside a navigation host
  (`Sidebar`, `ConsoleLayout`, `DocLayout`, `AppLayout`), unless the file is the
  `detail/sectioned-resource` block or carries `/* webkit-local-navigation */`. It is
  static and approximate, so it warns.
- `ConsoleLayout` warns in development when a `SidebarMenu` in its default slot has a row whose `href`
  matches a rail row, naming both labels and the route.
- `npx @aziontech/webkit check --url <url,...>` and `/webkit-ui-verify` fail a visited route with a duplicate
  destination, more than one `aria-current="page"` in one control, or two controls whose current rows
  point at different routes.
- `/webkit-navigation` reviews the levels by hand.
