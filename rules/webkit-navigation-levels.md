# Rule: navigation levels — one owner per level, a destination once per screen

A console screen has at most three navigation levels, and each has one owner. When two controls list
the same pages, their active rows disagree, the reader cannot tell which one says "where I am", and
the extra column squeezes the content.

| Level | Owner                                                        | Lists                                            |
| ----- | ------------------------------------------------------------ | ------------------------------------------------ |
| 1     | the rail: `ConsoleLayout` `navigation`, its drill levels too | modules and first-level pages                    |
| 2     | `PageTabs` of a resource or of a split module                | the pages of that resource or module             |
| 3     | the `platform/detail/sectioned-resource` block, in one tab   | more than 7 sibling pages of that tab, in groups |

The breadcrumb is not a level: it names where the reader is.

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
  tab carry a local navigation, and only as the `platform/detail/sectioned-resource` block: a
  `--container-3xs` column that folds into a labelled `Select` below `@3xl` of the tab body.
- Derive every active row from the route. Each level marks exactly one row `aria-current="page"`,
  the marked rows of all levels describe the same place, and a level whose rows do not hold the
  current page marks none.

## Do not

- Do not render a free `Menu` in a page body, least of all one whose rows repeat the rail.
- Do not add rail rows that route into a resource, not even as shortcuts into a default resource.
  When a module needs a shortcut, the rail row opens the resource list or the resource itself.
- Do not add a fourth level, or a second local navigation in one tab.
- Do not set an active row by hand (`activeId`, a hard-coded `aria-current`) on a page whose route
  already matches a row.

## Correct

The rail lists the module and opens the resource list; the policy's own pages live in its tabs and,
past 7, in the block:

```ts
const navigation = [
  {
    label: 'Security',
    items: [
      { id: 'policies', label: 'Policies', icon: 'pi pi-shield', href: '/policies' },
      { id: 'certificates', label: 'Certificates', icon: 'pi pi-lock', href: '/certificates' }
    ]
  }
]
```

## Wrong

A rail drill level whose rows route into one default policy, repeated by a `Menu` inside that
policy's tab:

```ts
const navigation = [
  {
    label: 'Security',
    items: [
      {
        id: 'private-access',
        label: 'Private access',
        icon: 'pi pi-lock',
        kind: 'drill',
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

- `webkit/no-page-navigation-menu` (ESLint, warning) flags a `Menu` rendered in a page body (under
  `views/` or `pages/`, or with a `PageHeader` / `PageTabs` import) outside a navigation host
  (`Sidebar`, `ConsoleLayout`, `DocLayout`, `AppLayout`), unless the file is the
  `platform/detail/sectioned-resource` block or carries `/* webkit-local-navigation */`. It is
  static and approximate, so it warns.
- `ConsoleLayout` warns in development when a `Menu` in its default slot has a row whose `href`
  matches a rail row, naming both labels and the route.
- `npx @aziontech/webkit check --url <url,...>` and `/webkit-ui-verify` fail a visited route with a duplicate
  destination, more than one `aria-current="page"` in one control, or two controls whose current rows
  point at different routes.
- `/webkit-navigation` reviews the levels by hand.
