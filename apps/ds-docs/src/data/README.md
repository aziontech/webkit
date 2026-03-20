# Component Status Data

This directory contains the data source for the Components Status table displayed in the documentation.

## Overview

The Components Status table provides visibility into the progress of each component across design and development phases. This helps teams track:

- Which components are ready for use
- Which components are in progress
- Which components are planned for future releases

## Data File

**Location:** [`src/data/component-status.ts`](./component-status.ts)

This file exports:

- `ComponentStatusItem` - TypeScript interface for each component entry
- `ProgressStatus` - Type for design/code status values
- `componentStatusData` - Array of all component status entries
- `PROGRESS_STATUS_CONFIG` - Configuration mapping status to labels and styles
- Helper functions for sorting and filtering

## How to Update Component Status

### Adding a New Component

Add a new entry to the `componentStatusData` array in [`component-status.ts`](./component-status.ts):

```typescript
{
  name: 'ComponentName',           // Required: Display name
  slug: 'component-name',          // Optional: URL-friendly identifier
  href: '/components/component-name', // Optional: Link to documentation
  designStatus: 'done',            // Required: Design progress status
  codeStatus: 'queued',            // Required: Code progress status
  launchVersion: null,             // Required: Version when launched (null if not launched)
  planned: false,                  // Optional: Mark as planned (not in development)
  category: 'form',                // Optional: Component category
}
```

### Updating an Existing Component

Find the component in the `componentStatusData` array and update the relevant fields:

1. **Design Status** - Update `designStatus` when design work progresses
2. **Code Status** - Update `codeStatus` when development progresses
3. **Launch Version** - Set `launchVersion` when the component is released

### Status Values

| Status | Label | Description |
|--------|-------|-------------|
| `done` | Done | Completed and ready for use |
| `documenting` | Documenting | Currently being documented |
| `queued` | Queued | Waiting to be worked on |
| `handoff` | Handoff | Ready for handoff to development |
| `planned` | Planned | Planned for future development |
| `not-started` | Not started | Not yet started |

### Example: Marking a Component as Launched

When a component is released:

```typescript
{
  name: 'NewComponent',
  slug: 'new-component',
  href: '/components/new-component',
  designStatus: 'done',      // Design is complete
  codeStatus: 'done',        // Code is complete
  launchVersion: 'v.1.1',    // Set the release version
  category: 'feedback',
}
```

### Example: Adding a Planned Component

For components that are planned but not yet in development:

```typescript
{
  name: 'FutureComponent',
  designStatus: 'planned',
  codeStatus: 'not-started',
  launchVersion: null,
  planned: true,             // Mark as planned
  category: 'navigation',
}
```

## Sorting Behavior

The table supports interactive column sorting:

- **Click any column header** to sort by that column
- **Click again** to reverse the sort direction
- **Sort icon** indicates the current sort column and direction

### Sort Logic by Column

| Column | Sort Logic |
|--------|------------|
| Component | Alphabetical (A-Z or Z-A) |
| Design | By status priority (Done → Not started) |
| Code | By status priority (Done → Not started) |
| Launch Version | Alphabetical, empty values at end |

### Status Priority Order

1. Done (highest priority)
2. Documenting
3. Handoff
4. Queued
5. Planned
6. Not started (lowest priority)

## Categories

Components can be grouped by category. Standard categories include:

- `form` - Form components (inputs, buttons, etc.)
- `navigation` - Navigation components (menus, breadcrumbs, etc.)
- `feedback` - Feedback components (alerts, toasts, etc.)
- `data-display` - Data display components (tables, cards, etc.)
- `layout` - Layout components (containers, grids, etc.)
- `utility` - Utility components (icons, dividers, etc.)

## Best Practices

1. **Keep status current** - Update status as work progresses
2. **Use consistent naming** - Match component names with documentation titles
3. **Include href when available** - Link to component documentation
4. **Set launchVersion on release** - This moves the component to the "launched" section
5. **Use planned flag** - Mark components that are planned but not yet in active development

## Architecture

```
src/data/
├── component-status.ts    # Data source and types
└── README.md              # This documentation

src/components/docs/
├── ProgressStatusBadge.vue    # Badge component for status display
├── ComponentsStatusTable.astro # Table component
└── Tabs.astro                  # Tabs for Overview/Status views

src/pages/components/
└── index.astro             # Components page consuming the data
```

## Future Enhancements

The data structure supports future features:

- **Filtering by category** - Use `getCategories()` to get unique categories
- **Filtering by status** - Use `getComponentsByLaunchStatus()` for grouped views
- **Sorting options** - Use `getComponentsSorted()` for custom sort orders
- **Version filtering** - Use `getLaunchVersions()` to filter by release version
