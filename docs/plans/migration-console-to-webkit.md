# Migration Plan: Console → Webkit Component Library

> **Last updated:** 2026-03-18
> **Status:** In Progress
> **Scope:** Migrate reusable UI patterns from `azion-console-kit` to `@aziontech/webkit`

---

## Table of Contents

1. [Overview](#overview)
2. [Current State](#current-state)
3. [Migration Phases](#migration-phases)
4. [Phase 1 — Auth Flow Components](#phase-1--auth-flow-components)
5. [Phase 2 — Form Input Migration (Mixed Files)](#phase-2--form-input-migration-mixed-files)
6. [Phase 3 — New Webkit Components (High Reuse)](#phase-3--new-webkit-components-high-reuse)
7. [Phase 4 — Template Consolidation](#phase-4--template-consolidation)
8. [Phase 5 — Advanced Patterns](#phase-5--advanced-patterns)
9. [Migration Checklist per Component](#migration-checklist-per-component)
10. [Best Practices](#best-practices)
11. [Appendix: Full File Inventory](#appendix-full-file-inventory)

---

## Overview

The Console project (`azion-console-kit`) has **318 files** importing PrimeVue directly, while only **105 files** use `@aziontech/webkit`. Many files have **mixed usage** — importing both webkit fields and raw PrimeVue components side by side. This creates inconsistency in API patterns, accessibility, and maintainability.

### Goals

- **Centralize reusable UI patterns** in `@aziontech/webkit`
- **Reduce direct PrimeVue coupling** in Console views/templates
- **Ensure consistency** in form validation, accessibility, and design tokens
- **Eliminate duplication** (e.g., advanced-filter system exists in 2 locations)
- **Improve DX** — consumers import one thing from webkit instead of wiring PrimeVue + vee-validate + accessibility attrs manually

### What NOT to Migrate

- **Business-logic components** tightly coupled to Console APIs, stores, or routing
- **One-off layouts** that are page-specific and unlikely to be reused
- **PrimeVue Button** (`primevue/button`, 187 imports) — intentionally used directly, no wrapper needed
- **PrimeVue DataTable** — too complex for immediate extraction; evaluate later

---

## Current State

| Metric | Count |
|--------|-------|
| Files importing PrimeVue directly | **318** |
| Files using `@aziontech/webkit` | **105** |
| Files with mixed usage (webkit + raw PrimeVue) | **~30** |
| PrimeVue form inputs replaceable by webkit | **72 files** |
| Webkit component exports available | **22** |
| Duplicated component systems | **1** (advanced-filter, ~26 files in 2 locations) |

### Webkit Components Already Available

| Export | Maps to PrimeVue |
|--------|-----------------|
| `field-text` | `InputText` |
| `field-text-area` | `Textarea` |
| `field-password` | `Password` (no strength meter) |
| `field-password-strength` | `Password` (with strength meter) — **NEW** |
| `field-text-privacy` | `InputText` (masked, copy) |
| `field-text-icon` | `InputText` (with icon) |
| `field-number` | `InputNumber` |
| `field-dropdown` | `Dropdown` |
| `field-dropdown-icon` | `Dropdown` (with icons) |
| `field-dropdown-lazy-loader` | `Dropdown` (async loading) |
| `field-multi-select` | `MultiSelect` |
| `field-switch` | `InputSwitch` |
| `field-switch-block` | `InputSwitch` (with label block) |
| `field-checkbox-block` | `Checkbox` (with label block) |
| `field-group-checkbox` | `Checkbox` (group) |
| `field-group-radio` | `RadioButton` (group) |
| `field-radio-block` | `RadioButton` (with label block) |
| `field-auto-complete` | `AutoComplete` |
| `field-phone-number` | Custom phone input |
| `selector-block` | Custom selector |
| `testimonials-carousel` | `Carousel` (testimonials) — **NEW** |
| `azion-system-status` | Custom status component |

---

## Migration Phases

```
Phase 1 ─── Auth Flow (5 files)          ← Quick, high-visibility
Phase 2 ─── Mixed Files (30 files)       ← Low risk, pattern already in file
Phase 3 ─── New Webkit Components (8)    ← Create reusable wrappers
Phase 4 ─── Template Consolidation (26)  ← Deduplicate advanced-filter
Phase 5 ─── Advanced Patterns            ← DataTable, DateRange (evaluate)
```

---

## Phase 1 — Auth Flow Components

**Priority:** HIGH
**Risk:** LOW (isolated pages, no cross-dependencies)
**Estimated files:** 5

The auth flow (login, signup, password reset) uses raw PrimeVue `Password` and `InputText` instead of webkit fields. These are high-visibility pages and should use the design system.

### 1.1 `sign-in-block/index.vue`

- **Path:** `src/templates/sign-in-block/index.vue`
- **Current:** Raw `InputText` (email) + `Password` (no strength)
- **Target:** `field-text` + `field-password`
- **Plan:**
  1. Replace `import InputText from 'primevue/inputtext'` → `import FieldText from '@aziontech/webkit/field-text'`
  2. Replace `import Password from 'primevue/password'` → `import FieldPassword from '@aziontech/webkit/field-password'`
  3. Update template to use webkit props (`name`, `label`, `placeholder`)
  4. Remove manual `<label>` and error `<small>` — webkit handles these
  5. Test login flow end-to-end

### 1.2 `sign-in-block/reset-password.vue`

- **Path:** `src/templates/sign-in-block/reset-password.vue`
- **Current:** Raw `Password` with strength indicators
- **Target:** `field-password-strength`
- **Plan:**
  1. Replace with `field-password-strength`
  2. Pass existing `strongRegex` and requirements via props
  3. Wire `@submit` emit to form submission
  4. Test password reset flow

### 1.3 `sign-in-block/forgot-password.vue`

- **Path:** `src/templates/sign-in-block/forgot-password.vue`
- **Current:** Raw `InputText` (email)
- **Target:** `field-text`
- **Plan:**
  1. Replace with `field-text`
  2. Keep existing vee-validate schema
  3. Test forgot password flow

### 1.4 `signup-block/login-with-email-block.vue`

- **Path:** `src/templates/signup-block/login-with-email-block.vue`
- **Current:** Raw `InputText` (email) + `Password` (with strength meter)
- **Target:** `field-text` + `field-password-strength`
- **Note:** This is the file we already partially addressed with `testimonials-carousel`
- **Plan:**
  1. Replace email field with `field-text`
  2. Replace password field with `field-password-strength`
  3. Move password validation logic to form level (vee-validate schema)
  4. Wire `@submit` on password field to trigger signup
  5. Test signup flow

### 1.5 `signup-block/additional-data-form-block.vue`

- **Path:** `src/templates/signup-block/additional-data-form-block.vue`
- **Current:** Raw `InputText` fields for additional user data
- **Target:** `field-text`
- **Plan:**
  1. Replace all `InputText` instances with `field-text`
  2. Keep existing validation
  3. Test additional data form

---

## Phase 2 — Form Input Migration (Mixed Files)

**Priority:** HIGH
**Risk:** LOW (webkit pattern already used in these files)
**Estimated files:** ~30

These files already import webkit fields for some inputs but still use raw PrimeVue for others. The migration pattern is already established — just extend it to the remaining fields.

### Target Files (by PrimeVue component)

#### 2.1 Replace `InputText` → `field-text` (~15 files)

| File | Fields to migrate |
|------|-------------------|
| `views/YourSettings/FormFields/FormFieldsYourSettings.vue` | Name, phone, email fields |
| `views/EdgeDNS/FormFields/FormFieldsRecords.vue` | Record value, TTL |
| `views/Workload/FormFields/FormFieldsEditDomains.vue` | Domain name inputs |
| `views/Billing/FormFields/FormFieldsDrawerCredit.vue` | Credit description |
| `views/Domains/FormFields/blocks/CnameBlock.vue` | CNAME input |
| `views/EdgeApplications/FormFields/blocks/OriginsBlock.vue` | Origin address |
| `views/EdgeApplications/FormFields/blocks/DeviceGroupsBlock.vue` | User-agent string |
| `views/NetworkLists/FormFields/blocks/NetworkListBlock.vue` | List entries |
| `views/Credentials/FormFields/FormFieldsCredentials.vue` | Credential fields |
| `views/EdgeNode/FormFields/FormFieldsEdgeNodeService.vue` | Service config |

#### 2.2 Replace `Password` → `field-password` (~5 files)

| File | Fields to migrate |
|------|-------------------|
| `views/YourSettings/FormFields/FormFieldsYourSettings.vue` | Old/new/confirm password |
| `views/IdentityProviders/FormFields/FormFieldsCreateIdentityProvider.vue` | IdP secret |
| `views/EdgeConnectors/FormFields/blocks/hmac.vue` | HMAC key |
| `views/DataStream/FormFields/blocks/OutputSection.vue` | Output credentials |

#### 2.3 Replace `Dropdown` → `field-dropdown` (~10 files)

| File | Fields to migrate |
|------|-------------------|
| `views/YourSettings/FormFields/FormFieldsYourSettings.vue` | Timezone, language |
| `views/Users/FormsFields/FormFieldsUsers.vue` | Role selector |
| `views/WafRules/Drawer/index.vue` | WAF config |
| `views/ActivityHistory/components/DateRangeSelector.vue` | Date range presets |
| `views/RealTimeMetrics/blocks/interval-filter-block.vue` | Interval selector |

#### 2.4 Replace `InputNumber` → `field-number` (~8 files)

| File | Fields to migrate |
|------|-------------------|
| `views/EdgeApplicationsCacheSettings/FormFields/blocks/EdgeCache.vue` | TTL values |
| `views/EdgeApplicationsCacheSettings/FormFields/blocks/BrowserCache.vue` | Browser cache TTL |
| `views/Billing/FormFields/FormFieldsDrawerCredit.vue` | Credit amount |
| `views/EdgeApplications/FormFields/blocks/CacheByQueryString.vue` | Query string params |

### Migration Steps per File

1. Read the file and identify raw PrimeVue imports
2. Map each to its webkit equivalent
3. Replace import statements
4. Update template — remove manual `<label>`, error `<small>`, and wrapper divs
5. Pass `name`, `label`, `placeholder`, `description` as props
6. Keep vee-validate `validationSchema` at form level (no changes needed)
7. Run existing tests
8. Visual regression check in Storybook (if story exists) or manual browser check

---

## Phase 3 — New Webkit Components (High Reuse)

**Priority:** MEDIUM-HIGH
**Risk:** MEDIUM (new API design required)
**Estimated components:** 8

These are generic UI patterns used on every page of the Console that should be centralized in webkit.

### 3.1 Action Bar (`action-bar`)

- **Console source:** `src/templates/action-bar-block/` (4 files: index, go-back, accordion, skit-config)
- **Used on:** Every create/edit page
- **Scope:** Save, cancel, back buttons with consistent positioning
- **Plan:**
  1. Analyze all 4 variants to find the common API
  2. Design a single `action-bar` component with slots for left/right actions
  3. Props: `showBack`, `showSave`, `showCancel`, `loading`, `disabled`
  4. Emits: `@save`, `@cancel`, `@back`
  5. Create in webkit with Storybook stories
  6. Migrate Console to use it

### 3.2 Page Heading (`page-heading`)

- **Console source:** `src/templates/page-heading-block/index.vue`
- **Used on:** Every page
- **Scope:** Breadcrumb + page title with skeleton loading
- **Plan:**
  1. Extract breadcrumb + heading pattern
  2. Props: `breadcrumbs` (array), `title`, `loading`
  3. Slot for action buttons on the right
  4. Create in webkit

### 3.3 Drawer Wrapper (`drawer`)

- **Console source:** `src/templates/create-drawer-block/`, `edit-drawer-block/`, `info-drawer-block/`, `empty-drawer/`
- **Used on:** ~14 files
- **Scope:** Standardized sidebar drawer with header, body, footer
- **Plan:**
  1. Unify 4 variants into one component with `variant` prop
  2. Props: `visible`, `title`, `size`, `variant` (`create` | `edit` | `info` | `empty`)
  3. Slots: `header`, `default` (body), `footer`
  4. Emits: `@close`, `@save`
  5. Wraps `primevue/sidebar`

### 3.4 Delete Confirmation Dialog (`dialog-delete`)

- **Console source:** `src/templates/list-table-block/dialog/delete-dialog.vue`
- **Used on:** Every list page with delete action
- **Scope:** Type-to-confirm deletion pattern
- **Plan:**
  1. Props: `visible`, `title`, `confirmText`, `loading`
  2. Emits: `@confirm`, `@cancel`
  3. Built-in text matching validation
  4. Accessibility: focus trap, aria-labels

### 3.5 Empty Results (`empty-results`)

- **Console source:** `src/templates/empty-results-block/index.vue`
- **Used on:** Every list page (when no data)
- **Scope:** Empty state with icon, message, and action button
- **Plan:**
  1. Props: `title`, `description`, `icon`, `actionLabel`
  2. Emits: `@action`
  3. Slot for custom content

### 3.6 Toast Block (`toast-block`)

- **Console source:** `src/templates/toast-block/index.vue`
- **Used on:** App-wide
- **Scope:** Standardized toast notifications
- **Plan:**
  1. Evaluate if this should be a component or a composable
  2. If component: wrap `primevue/toast` with standard styling
  3. If composable: provide `useToast()` with preset severity styles

### 3.7 Unsaved Changes Dialog (`dialog-unsaved`)

- **Console source:** `src/templates/dialog-unsaved/DialogUnsaved.vue`
- **Used on:** Every form page
- **Scope:** "You have unsaved changes" confirmation before navigation
- **Plan:**
  1. Props: `visible`, `title`, `message`
  2. Emits: `@discard`, `@stay`
  3. Integrate with Vue Router navigation guards (composable)

### 3.8 Copy Block (`copy-block`)

- **Console source:** `src/templates/copy-block/copy-block.vue`, `dialog-copy-key/index.vue`
- **Used on:** Multiple pages (tokens, credentials, keys)
- **Scope:** Copy-to-clipboard with visual feedback
- **Plan:**
  1. Props: `value`, `label`, `masked`
  2. Emits: `@copy`
  3. Built-in clipboard API integration
  4. Success feedback (toast or inline)

---

## Phase 4 — Template Consolidation

**Priority:** MEDIUM
**Risk:** MEDIUM-HIGH (wide impact, needs careful testing)
**Estimated files:** ~26

### 4.1 Deduplicate Advanced Filter System

The advanced filter system exists in **two separate locations** with near-identical code:

| Location 1 | Location 2 |
|-----------|-----------|
| `src/templates/advanced-filter/` (13 files) | `src/components/base/advanced-filter-system/` (13+ files) |
| `dialog-filter.vue` | `filterFields/temp/dialog-filter.vue` |
| `component/fields/text-filter.vue` | `filterFields/filterRow/component/fields/text-filter.vue` |
| `component/fields/number-filter.vue` | Same structure |
| `component/fields/select-filter.vue` | Same structure |

**Plan:**
1. Diff both implementations to identify divergences
2. Choose the more complete/modern implementation as the base
3. Consolidate into one location (either `templates/` or a new webkit component)
4. Update all consumers to use the consolidated version
5. Delete the duplicate
6. Create unit tests for the consolidated filter system

### 4.2 Consolidate Skeleton Components

- **Console source:** `src/templates/skeleton-block/` — FormSkeleton, BreadcrumbSkeleton, ActionBarSkeleton
- **Plan:** If `action-bar` and `page-heading` move to webkit (Phase 3), their skeleton states should be built-in via a `loading` prop, eliminating separate skeleton components.

---

## Phase 5 — Advanced Patterns (Evaluate)

**Priority:** LOW
**Risk:** HIGH (complex, many consumers)
**Timeline:** Future evaluation

### 5.1 DataTable System

- **Console source:** `src/components/DataTable/` (10+ files)
- **Scope:** Wrapper around PrimeVue DataTable with search, filter, export, column selector, row actions
- **Decision:** Evaluate whether this should be a webkit component or remain in Console
- **Criteria:**
  - Is it used by other projects besides Console? → If yes, migrate
  - Is the API stable? → If no, keep in Console until stable

### 5.2 DateTimeRange Picker

- **Console source:** `src/components/base/dataTimeRange/` (3 files)
- **Scope:** Complex date/time range picker with Calendar + Dropdown + InputNumber + TabView
- **Decision:** Evaluate after Phases 1-4

### 5.3 Template Engine

- **Console source:** `src/templates/template-engine-block/` (engine-azion, engine-jsonform)
- **Scope:** Dynamic form rendering for Marketplace integrations
- **Decision:** Too coupled to Console's marketplace system; keep in Console

---

## Migration Checklist per Component

Use this checklist for every component migrated from Console to webkit:

### Before Starting

- [ ] Read the Console component source code completely
- [ ] Identify all props, emits, slots, and dependencies
- [ ] Check if webkit already has a similar component
- [ ] Review `docs/ARCHITECTURE.md` for patterns

### Webkit Side (Create)

- [ ] Create component in `packages/webkit/src/core/` or `packages/webkit/src/components/`
- [ ] Follow naming convention: `kebab-case` directory and file
- [ ] Create `package.json` in the component directory
- [ ] Add export to `packages/webkit/package.json`
- [ ] Add vee-validate integration (for form fields)
- [ ] Add accessibility attributes (`aria-invalid`, `aria-describedby`, `role="alert"`)
- [ ] Add all emits with proper typing
- [ ] Add prop validators where appropriate
- [ ] Create Storybook story with all variants
- [ ] Map emits to Storybook actions
- [ ] Run `pnpm build:dts` to verify TypeScript declarations
- [ ] Test in Storybook visually

### Console Side (Migrate)

- [ ] Create feature branch: `feat/ENG-XXXXX-migrate-component-name`
- [ ] Replace imports (PrimeVue → webkit)
- [ ] Update template to use webkit API (props instead of manual wiring)
- [ ] Remove manual labels, error messages, and wrappers now handled by webkit
- [ ] Keep vee-validate schema unchanged at form level
- [ ] Run existing unit tests
- [ ] Run existing E2E tests (if applicable)
- [ ] Visual check in browser
- [ ] Create PR with dependency note on webkit PR

### Release

- [ ] Merge webkit PR first
- [ ] Wait for npm publish (`semantic-release`)
- [ ] Update `@aziontech/webkit` version in Console's `package.json`
- [ ] Merge Console PR

---

## Best Practices

### Component Design

1. **Props over slots for simple content** — Use props for labels, descriptions, and error messages. Reserve slots for complex custom content.

2. **Emit everything** — Every user interaction should emit an event. At minimum: `input`, `blur`, `focus`. For fields with submit behavior: `submit` (on Enter).

3. **Prevent double-submit** — Always `event.preventDefault()` on Enter key handlers to avoid browser form submission + emit collision.

4. **Guard disabled/readonly** — Never emit `submit`, `input`, or action events when `disabled` or `readonly` is true.

5. **Validate props** — Add validators for array items (check shape), regex strings (check parseable), and required combinations.

### Accessibility

6. **`aria-invalid`** — Set on inputs when there's a validation error. Screen readers rely on this, not CSS classes.

7. **`role="alert"` + `aria-live="assertive"`** — On error messages so screen readers announce them when they appear.

8. **`aria-describedby`** — Link inputs to their error and description elements via IDs.

9. **`aria-label`** — On lists and interactive elements that lack visible labels.

10. **Focus management** — Trap focus in dialogs/drawers. Return focus to trigger element on close.

### Naming

11. **Form fields:** `field-{type}` (e.g., `field-text`, `field-dropdown`, `field-password-strength`)
12. **Blocks/sections:** `{name}-block` (e.g., `testimonials-carousel`, `action-bar`)
13. **Dialogs:** `dialog-{action}` (e.g., `dialog-delete`, `dialog-unsaved`)
14. **Composables:** `use-{name}` (e.g., `use-toast`, `use-clipboard`)

### Testing

15. **Storybook first** — Every component must have a story before being considered done.
16. **Action mapping** — Map all emits to Storybook actions in `argTypes`.
17. **Variant coverage** — Create story variants for: default, disabled, readonly, with error, empty state, i18n (pt-BR labels).
18. **Visual check** — Dark theme + light theme in Storybook before merge.

### Migration Process

19. **One PR per component in webkit, one PR per migration in Console** — Keep changes atomic and reviewable.
20. **Webkit PR merges first** — Console PR depends on the published webkit version.
21. **No mixed PRs** — Don't combine component creation with unrelated refactors.
22. **Preserve behavior** — The migrated component must behave identically to the original. No "while we're at it" improvements unless explicitly planned.

---

## Appendix: Full File Inventory

### Files Using Raw PrimeVue Form Inputs (Candidates for webkit migration)

#### `primevue/inputtext` (45 files)

**Templates:**
- `src/templates/sign-in-block/index.vue`
- `src/templates/sign-in-block/forgot-password.vue`
- `src/templates/signup-block/login-with-email-block.vue`
- `src/templates/signup-block/additional-data-form-block.vue`
- `src/templates/mfa-setup-block/index.vue`
- `src/templates/mfa-authenticate-block/index.vue`
- `src/templates/create-modal-block/index.vue`
- `src/templates/add-payment-method-block/index.vue`
- `src/templates/search-block/index.vue`
- `src/templates/list-table-block/index.vue`
- `src/templates/list-table-block/dialog/delete-dialog.vue`
- `src/templates/list-table-block/folder-list.vue`
- `src/templates/switch-account-block/index.vue`
- `src/templates/activity-history-block/index.vue`

**Views (mixed usage — already have some webkit imports):**
- `src/views/YourSettings/FormFields/FormFieldsYourSettings.vue`
- `src/views/EdgeDNS/FormFields/FormFieldsRecords.vue`
- `src/views/Workload/FormFields/FormFieldsEditDomains.vue`
- `src/views/Billing/FormFields/FormFieldsDrawerCredit.vue`
- `src/views/Domains/FormFields/blocks/CnameBlock.vue`
- `src/views/EdgeApplications/FormFields/blocks/OriginsBlock.vue`
- `src/views/NetworkLists/FormFields/blocks/NetworkListBlock.vue`
- `src/views/Credentials/FormFields/FormFieldsCredentials.vue`
- `src/views/EdgeNode/FormFields/FormFieldsEdgeNodeService.vue`
- *(+ ~17 more view files)*

#### `primevue/password` (10 files)

- `src/templates/sign-in-block/index.vue`
- `src/templates/sign-in-block/reset-password.vue`
- `src/templates/signup-block/login-with-email-block.vue`
- `src/templates/template-engine-block/engine-azion.vue`
- `src/views/YourSettings/FormFields/FormFieldsYourSettings.vue`
- `src/views/IdentityProviders/FormFields/FormFieldsCreateIdentityProvider.vue`
- `src/views/EdgeConnectors/FormFields/blocks/hmac.vue`
- `src/views/DataStream/FormFields/blocks/OutputSection.vue`
- `src/views/PersonalTokens/Dialog/CopyTokenDialog.vue`
- `src/views/EdgeStorage/Dialog/CopyCredentialDialog.vue`

#### `primevue/dropdown` (28 files)

- `src/templates/switch-account-block/index.vue`
- `src/templates/template-engine-block/engine-jsonform.vue`
- `src/templates/advanced-filter/dialog-filter.vue`
- `src/templates/advanced-filter/component/fields/select-filter.vue`
- `src/views/YourSettings/FormFields/FormFieldsYourSettings.vue`
- `src/views/Users/FormsFields/FormFieldsUsers.vue`
- `src/views/WafRules/Drawer/index.vue`
- `src/views/ActivityHistory/components/DateRangeSelector.vue`
- `src/views/RealTimeMetrics/blocks/interval-filter-block.vue`
- `src/components/base/dataTimeRange/` (3 files)
- `src/components/DataTable/DataTableFilter.vue`
- *(+ ~17 more)*

#### `primevue/inputnumber` (16 files)

- `src/templates/list-table-block/v2/index.vue`
- `src/templates/advanced-filter/component/fields/number-filter.vue`
- `src/templates/advanced-filter/component/fields/number-range-filter.vue`
- `src/templates/advanced-filter/component/fields/float-filter.vue`
- `src/templates/advanced-filter/component/fields/float-range-filter.vue`
- `src/views/EdgeApplicationsCacheSettings/FormFields/blocks/EdgeCache.vue`
- `src/views/EdgeApplicationsCacheSettings/FormFields/blocks/BrowserCache.vue`
- `src/views/Billing/FormFields/FormFieldsDrawerCredit.vue`
- *(+ ~8 more)*

#### `primevue/multiselect` (15 files)

- Advanced filter components and view FormFields across Workload, NetworkLists, EdgeNode, Credentials, WafRules, IdentityProviders, EdgeApplications

#### Other (6 files)

- `primevue/textarea` — 2 files
- `primevue/inputswitch` — 3 files
- `primevue/radiobutton` — 1 file

### Duplicated Systems

| System | Location 1 | Location 2 | Files |
|--------|-----------|-----------|-------|
| Advanced Filter Fields | `src/templates/advanced-filter/component/fields/` | `src/components/base/advanced-filter-system/filterFields/filterRow/component/fields/` | ~26 total |
| Filter Dialog | `src/templates/advanced-filter/dialog-filter.vue` | `src/components/base/advanced-filter-system/filterFields/temp/dialog-filter.vue` | 2 |
| Text Filter | `src/templates/advanced-filter/component/fields/text-filter.vue` | `src/components/DataTable/filters/text-filter-field.vue` | 2 |
