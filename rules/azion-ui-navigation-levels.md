# Rule: navigation levels — the rail navigates, the page has only tabs

A console screen navigates in two places: the rail, which holds up to two levels, and the
`PageTabs` of the page. Nothing else inside a page navigates: no menu, no side list of pages, no
second row of tabs. When a page carries its own navigation, it repeats the rail, the reader cannot
tell which control says "where I am", and the extra column squeezes the content.

| Where         | Control                                       | Lists                                                                     |
| ------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| Rail, level 1 | `ConsoleLayout` `navigation`                  | products, and the resources of a product that has 3 or fewer, right there |
| Rail, level 2 | a drill level of the rail (`type: 'drill'`)   | the resources of a product that has more than 3                           |
| Page          | `PageTabs` of a resource or of a split module | the pages of that resource or module                                      |

The breadcrumb is not a level: it names where the reader is.

A drawer is not a level either. It has no route, and it opens only at the end of the path, over the
screen that owns its item: `rail (level 1 → level 2) → resource list → resource page → tab → drawer
(large) → nested drawer (medium)`.

## Do

- Put every product in the rail at level 1. A product with 3 or fewer resources lists them as rows
  under its name, on level 1. A product with more than 3 resources is one row that drills into
  level 2, where its resources are listed.
- Point each rail row at a page that needs no resource: a first-level page or a resource list.
- Give a resource page one `PageTabs` row for its own pages, and nothing else that navigates.
- Keep a resource to 7 or fewer tabs. More pages than that are grouped: related pages become
  sections of one tab's page, under headings, not a menu.
- Offer each destination once per screen. Compare the `href`s (path without query and hash) of the
  rail rows, the open drill level included, and the tabs: no route appears twice.
- Derive every active row from the route. The rail and the tabs each mark exactly one row
  `aria-current="page"`, the marked rows describe the same place, and a control whose rows do not
  hold the current page marks none.
- Navigate to the resource's page when the reader opens, configures or edits a product or a
  resource (Configure, Settings, Edit), on the tab that holds it (`?tab=settings`).
- Open a drawer only over the screen that owns its item: a tab of the resource, or the list that
  holds it. The first drawer is `size="large"`; a nested drawer is `size="medium"`, and there is at
  most one. The AI assistant drawer (`ai/ai-chat-drawer`) is the one first drawer that
  stays `medium`.
- Offer `Create <noun>` on every field that needs a resource that may not exist yet. It opens a
  drawer with that resource's create form over the form that needs it (`large` from a page, `medium`
  from a drawer), and saving selects the new resource. This holds for first-level resources too.

## Don't

- Do not render a navigation inside a page body: no `SidebarMenu`, no side list or column of pages,
  no `ToggleGroup`, `Select` or second tab row that switches between pages. Page navigation is the
  rail; a page has only its `PageTabs`.
- Do not add a third rail level, or a drill level for a product with 3 or fewer resources.
- Do not add rail rows that route into one resource, not even as shortcuts into a default resource.
  The rail opens the resource list; the resource's own pages are its tabs.
- Do not set an active row by hand (`activeId`, a hard-coded `aria-current`) on a page whose route
  already matches a row.
- Do not open a drawer as the first surface of a product or a resource, or over a screen that does
  not own its item (configuring a product from the product list, a dashboard or the rail).
- Do not stack a third drawer, or a nested drawer as wide as its parent. A flow that needs a third
  layer is a page: open it in a new tab.
- Do not send the reader to another page to create a missing resource and come back. Only a create
  of several steps opens its page, in a new tab, with a `Refresh` on the field.
- Do not put `PageTabs`, a breadcrumb or any other navigation inside a drawer. A drawer that needs
  one is a page.

## Example

### Do

Edge DNS has 2 resources, so they sit on level 1. Security has more than 3, so it drills into
level 2. Every row opens a list; a policy's own pages are its tabs:

```ts
const navigation = [
  {
    label: 'Edge DNS',
    items: [
      { id: 'zones', label: 'Zones', icon: 'az az-edge-dns', href: '/dns/zones' },
      { id: 'secondary', label: 'Secondary zones', icon: 'az az-edge-dns', href: '/dns/secondary' }
    ]
  },
  {
    label: 'Products',
    items: [
      {
        id: 'security',
        label: 'Security',
        icon: 'az az-shield',
        type: 'drill',
        groups: [
          {
            label: 'Security',
            items: [
              { id: 'policies', label: 'Policies', href: '/policies' },
              { id: 'certificates', label: 'Certificates', href: '/certificates' },
              { id: 'network-lists', label: 'Network lists', href: '/network-lists' },
              { id: 'waf', label: 'WAF rule sets', href: '/waf' }
            ]
          }
        ]
      }
    ]
  }
]
```

### Don't

A rail drill level whose rows route into one default policy; the same pages repeated by a
`SidebarMenu` inside that policy's tab would be wrong too:

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
  (`Sidebar`, `ConsoleLayout`, `DocLayout`, `AppLayout`). It has no exception. It is static and
  approximate, so it warns.
- `ConsoleLayout` warns in development when a `SidebarMenu` in its default slot has a row whose `href`
  matches a rail row, naming both labels and the route.
- `npx @aziontech/webkit check --url <url,...>` and `/webkit-ui-verify` fail a visited route with a duplicate
  destination, more than one `aria-current="page"` in one control, or two controls whose current rows
  point at different routes.
- `/webkit-navigation` reviews the levels by hand.
