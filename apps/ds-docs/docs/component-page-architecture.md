# Component Page Architecture

This document describes the architecture of the component documentation page layout, including the tab-based content structure, content ownership model, and authoring conventions.

## Overview

The component documentation page has been refactored to support a clear **tab-based content structure** with three tabs:

1. **Overview** - Component introduction, import, playground, states, anatomy, accessibility
2. **Usage** - When to use, do's and don'ts, examples
3. **API** - Props table, slots table, events table

## Architecture

### Component Hierarchy

```
ComponentPageLayout.astro
├── PageHeader.vue (title, description, status, metadata links)
├── ComponentTabs.astro
│   ├── ComponentOverviewTab.astro (slot="overview")
│   │   ├── Default slot (markdown content)
│   │   ├── AnatomyBlock (from frontmatter.anatomy)
│   │   └── AccessibilityChecklist (from frontmatter.accessibility)
│   ├── ComponentUsageTab.astro (slot="usage")
│   │   └── Structured usage data (from frontmatter.usage)
│   └── ComponentApiTab.astro (slot="api")
│       ├── PropsTable (from frontmatter.api.props)
│       ├── SlotsTable (from frontmatter.api.slots)
│       └── EventsTable (from frontmatter.api.events)
└── RelatedLinks.astro
```

### Content Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Header Area (above tabs)                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Title: Button                                           ││
│  │ Description: Buttons trigger actions and events...      ││
│  │ [Stable] [Source] [Storybook] [Figma]                   ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Tab Navigation                                              │
│  [Overview] [Usage] [API]                                    │
├─────────────────────────────────────────────────────────────┤
│  Tab Content                                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Overview Tab (default)                                  ││
│  │ - Overview section (markdown)                           ││
│  │ - Import code snippet (markdown)                        ││
│  │ - Playground (component)                                ││
│  │ - States (component)                                    ││
│  │ - Anatomy (from frontmatter.anatomy)                    ││
│  │ - Accessibility (from frontmatter.accessibility)        ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Usage Tab                                               ││
│  │ - When to Use (from frontmatter.usage.whenToUse)        ││
│  │ - When Not to Use (from frontmatter.usage.whenNotToUse) ││
│  │ - Do's and Don'ts (from frontmatter.usage.doDonts)      ││
│  │ - Examples (from frontmatter.usage.examples)            ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ API Tab                                                 ││
│  │ - Props Table (from frontmatter.api.props)              ││
│  │ - Slots Table (from frontmatter.api.slots)              ││
│  │ - Events Table (from frontmatter.api.events)            ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Related Links (below tabs)                                  │
│  Related: Input, Select, IconButton                          │
└─────────────────────────────────────────────────────────────┘
```

## Content Ownership by Tab

### Overview Tab

| Section | Source | Description |
|---------|--------|-------------|
| Overview | Markdown body | Component introduction and description |
| Import | Markdown body | Code snippet showing how to import |
| Playground | Markdown body | Interactive component playground |
| States | Markdown body | Visual states grid |
| Anatomy | `frontmatter.anatomy` | Structured anatomy parts |
| Accessibility | `frontmatter.accessibility` | Keyboard, ARIA, WCAG info |

### Usage Tab

| Section | Source | Description |
|---------|--------|-------------|
| When to Use | `frontmatter.usage.whenToUse` | List of use cases |
| When Not to Use | `frontmatter.usage.whenNotToUse` | List of anti-patterns |
| Do's and Don'ts | `frontmatter.usage.doDonts` | Structured do/don't items |
| Examples | `frontmatter.usage.examples` | Usage examples with code |

### API Tab

| Section | Source | Description |
|---------|--------|-------------|
| Props Table | `frontmatter.api.props` | Component props |
| Slots Table | `frontmatter.api.slots` | Component slots |
| Events Table | `frontmatter.api.events` | Component events |

## Frontmatter Schema

### Component Frontmatter

```yaml
---
# Basic metadata
title: Button
description: Buttons trigger actions and events when users interact with them.
navLabel: Button
order: 1
type: component
category: form
status: stable
since: 1.0.0

# Component identifiers
component: AzButton
source: https://github.com/aziontech/webkit/tree/main/packages/components/src/Button
storybook: https://storybook.azion.com/components/button
figma: https://figma.com/file/azion-design-system/components/button

# Related components
related:
  - Input
  - Select
  - IconButton

# Tags for search
tags:
  - action
  - form
  - interactive

# Anatomy (Overview tab)
anatomy:
  - label: Container
    description: The clickable area with background styling and border
  - label: Label
    description: The text content describing the action

# Accessibility (Overview tab)
accessibility:
  keyboard:
    - keys: Tab
      action: Moves focus to the button
    - keys: Enter
      action: Activates the button when focused
  aria:
    - attribute: aria-disabled="true"
      usage: Use instead of disabled attribute for screen readers
  wcag:
    - "2.1.1 Keyboard"
    - "4.1.2 Name, Role, Value"

# Usage guidelines (Usage tab)
usage:
  whenToUse:
    - Trigger primary actions (Submit, Save, Continue)
    - Navigate to different views or pages
    - Toggle states or settings
  whenNotToUse:
    - Navigation to external links (use a link instead)
    - Displaying static content (use text or labels)
  doDonts:
    - type: do
      description: Use buttons for actionable items
      example: '<AzButton>Submit Form</AzButton>'
    - type: dont
      description: Don't use buttons for navigation
      example: '<AzButton>Go to Docs</AzButton>'
  examples:
    - title: Primary Button
      description: The default button style for primary actions
      code: '<AzButton variant="primary">Primary Button</AzButton>'

# API documentation (API tab)
api:
  props:
    - name: variant
      type: "'primary' | 'secondary' | 'destructive' | 'ghost'"
      default: "'primary'"
      required: false
      description: Visual style variant of the button
  slots:
    - name: default
      description: Button label content
  events:
    - name: click
      payload: "MouseEvent"
      description: Fired when button is clicked
---
```

## Authoring Model

### Recommended Approach

1. **Overview Content** - Write in markdown body
   - Component introduction
   - Import code snippet
   - Playground component
   - States visualization

2. **Usage Content** - Use structured frontmatter
   - `usage.whenToUse` - List of use cases
   - `usage.whenNotToUse` - List of anti-patterns
   - `usage.doDonts` - Structured do/don't items
   - `usage.examples` - Usage examples with code

3. **API Content** - Use structured frontmatter
   - `api.props` - Component props
   - `api.slots` - Component slots
   - `api.events` - Component events

4. **Anatomy & Accessibility** - Use structured frontmatter
   - `anatomy` - Component parts
   - `accessibility` - Keyboard, ARIA, WCAG info

### Why Structured Frontmatter?

Using structured frontmatter for Usage and API content provides:

1. **Consistent rendering** - Content always appears in the correct tab and order
2. **Type safety** - Schema validation ensures correct data structure
3. **Automation ready** - API documentation can be generated from component source
4. **Searchability** - Structured data is easier to index and search
5. **Maintainability** - Clear separation of concerns

### Markdown Body vs Frontmatter

| Content Type | Location | Reason |
|--------------|----------|--------|
| Overview prose | Markdown body | Rich formatting, flexibility |
| Import snippet | Markdown body | Code highlighting |
| Playground | Markdown body | Component embedding |
| States | Markdown body | Visual customization |
| Anatomy | Frontmatter | Structured data, consistent rendering |
| Accessibility | Frontmatter | Structured data, consistent rendering |
| Usage guidelines | Frontmatter | Consistent tab placement |
| API docs | Frontmatter | Can be auto-generated |

## Tab System Features

### URL Hash Sync

The tab system supports deep linking via URL hash fragments:

- `/components/button` - Opens Overview tab (default)
- `/components/button#usage` - Opens Usage tab
- `/components/button#api` - Opens API tab

### Keyboard Navigation

The tab system supports keyboard navigation:

- `Tab` - Move focus to active tab
- `Left/Right Arrow` - Navigate between tabs
- `Home` - Jump to first tab
- `End` - Jump to last tab
- `Enter/Space` - Activate focused tab

### ARIA Attributes

The tab system uses proper ARIA attributes:

- `role="tablist"` - Tab list container
- `role="tab"` - Tab buttons
- `role="tabpanel"` - Tab content panels
- `aria-selected` - Indicates active tab
- `aria-controls` - Links tab to panel
- `tabindex` - Focus management

## File Structure

```
apps/ds-docs/src/
├── components/docs/
│   ├── ComponentTabs.astro       # Tab container with 3 fixed tabs
│   ├── ComponentOverviewTab.astro # Overview tab content
│   ├── ComponentUsageTab.astro   # Usage tab content
│   ├── ComponentApiTab.astro     # API tab content
│   ├── AnatomyBlock.astro        # Anatomy section renderer
│   ├── AccessibilityChecklist.astro # Accessibility section renderer
│   ├── PropsTable.astro          # Props table renderer
│   ├── SlotsTable.astro          # Slots table renderer
│   └── EventsTable.astro         # Events table renderer
├── layouts/
│   └── ComponentPageLayout.astro # Main component page layout
├── pages/components/
│   └── [slug].astro              # Dynamic component page routing
└── content/v1/en/components/
    └── button.mdx                # Example component documentation
```

## Trade-offs

### Why Not Use Named Slots for All Tabs?

**Problem**: MDX Fragment slots don't propagate through Astro's Content component to nested layouts.

**Solution**: Use structured frontmatter for Usage and API content, which guarantees correct tab placement regardless of markdown authoring order.

### Why Keep Markdown for Overview?

**Reason**: Overview content benefits from rich markdown formatting (headings, paragraphs, code blocks, imported components). Structured frontmatter would be too restrictive for this content.

### Why Separate Anatomy/Accessibility from Overview Markdown?

**Reason**: 
1. Consistent rendering across all component pages
2. Structured data is easier to validate and query
3. Can be used for automated documentation generation
4. Clear separation between prose and structured data

## Future Enhancements

1. **Auto-generated API docs** - Extract API documentation from component source code
2. **Usage examples from Storybook** - Pull examples from Storybook stories
3. **Accessibility testing** - Automated accessibility validation
4. **Search integration** - Index structured frontmatter for better search
5. **i18n support** - Translate structured content
