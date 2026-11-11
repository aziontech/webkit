# ui-craft review — Milestone 1 components

ROADMAP M1.10 row 16 (components). The mandatory `ui-craft` progression (`.claude/skills/ui-craft/SKILL.md`, routed to the consumer skills under `skills/`) ran on every component Milestone 1 added or changed: `git diff --name-only dcc918675 HEAD -- packages/webkit/src/components | cut -d/ -f5-6 | sort -u` (173 folders). The new components got a full pass; for the components that already existed, the pass covered what Milestone 1 changed (renames, direction and RTL, container queries, built-in strings moved to the locale catalogs). `data/table` and `content/illustration` belong to the performance lane and are not in this review.

Each entry lists the findings, what was fixed (spec first, checksum recomputed, then the `.vue`, then a test), and what is not a defect and why. Real defects that could not be fixed here are new rows in the M1.10 table (listed at the end).

## Inputs and forms

### Field (Field, Field.Label, Field.Description, Field.Error, Field.Title, Field.Content, Field.Set, Field.Legend, Field.Group, Field.Separator)

- Finding: the root is `role="group"` with no accessible name. Not a defect: it follows the shadcn Field contract. The label names the control through `for`, and axe does not flag an unnamed group.
- Finding: the Required marker reads `* (Required)` next to the label, and the microcopy skill bans parentheses in labels. Not a defect: `webkit-form` requires a persistent Required tag, the tag is a separate span (not part of the label text), and all three catalogs translate it (`(Obligatorio)`, `(Obrigatório)`).
- Finding: `Field.Error` is `role="alert"` and is also referenced by `aria-describedby`, so it can be read twice. Not a defect: the error mounts only after a failed submit, which is the moment the announcement is needed. Reading it again on focus is the documented `webkit-form` behaviour.
- Tokens, typography (`text-label-sm` label, `text-body-sm` title, `text-label-md` legend), spacing (`xs` inside a field, `lg` between fields), logical properties and the `@container` responsive orientation: no findings.

### Removed field-* wrappers (field-text, field-textarea, field-select, field-password, field-phone-number, field-checkbox(-block), field-radio(-block), field-switch(-block), field-text-switch, field-time, field-file-upload, field-input-group)

- No findings. Milestone 1 deleted these wrappers and replaced them with `Field` plus the bare control (codemod entries exist), so there is nothing left to review.

### PhoneInput

- Finding: on a right-to-left page the national number and each option's `+NN` dial code went through bidi reordering (the `+` jumped behind the digits). Fixed: the tel input and the option dial-code tag render `dir="ltr"`, and the typed number still sits at the page's inline start (`rtl:text-end`). The spec gained a Direction line, and a test checks both `dir` attributes.
- Finding: the closed trigger's `+55` has the same bidi problem. Not fixed: the value span belongs to `SelectTrigger` and has no `dir` hook (see leftovers).
- Built-in strings (`Country dial code`, `Search country`, `No country found`) in en, es and pt-BR: no findings. Lazy flag sprite, Field wiring, states delegated to InputGroup: no findings.

### PasswordRequirements

- Finding: whether a rule is met was shown only by colour and an `aria-hidden` check icon, so a screen reader heard the same chips before and after typing (WCAG 1.3.1 / 1.4.1). Fixed: each chip ends with visually hidden state text from new catalog keys `passwordRequirements.met` / `unmet` (en `met` / `not met`, es `cumplido` / `no cumplido`, pt-BR `atendido` / `não atendido`). Spec, `.vue` and a new test cover it.
- Finding: the check icon slid in from the physical left (`-translate-x-1`). Fixed: it is mirrored under `rtl:`.
- Finding: the caption `Must contain:` ends with a colon. Not a defect: the microcopy skill allows a colon that introduces a list.

### InputGroup and InputGroup.Input / InputGroup.Addon

- No findings. It uses tokens only, logical `border-e` and `rounded-s/e`, has a `focus-within` ring, the invalid and required tones, the disabled surface, and a `motion-reduce` escape. `InputGroup.Input` reads the Field context.

### Input

- No findings in the Milestone 1 change (rename from InputText, Field wiring).

### PasswordInput

- No findings. The show and hide labels are in all three catalogs, and the change only wires Field.

### NumberInput

- Finding: the disabled lock glyph was gated on the `disabled` prop, so a NumberInput disabled through its `Field` lost the lock while every other disabled treatment applied. Fixed: it now reads the resolved `isDisabled`.
- Finding: the stepper chevrons use `text-[0.625rem]`. Not a defect: it is an icon size, not a typography token.

### Slider

- No findings. It uses token custom properties for every tone, mirrors the RTL fill, ticks and reference labels, mirrors the arrow keys under RTL, has `aria-valuetext` with the unit, a focusable readonly state, and `motion-reduce` on the thumb transitions.

### FileDropzone

- No findings. The inline kind is a named `group` (title and description). The overlay kind is `aria-hidden` and has no pointer events while idle. Fade in and out use `motion-reduce:animate-none`, and every state uses role tokens.

### Select / MultiSelect (and their Trigger, Content, Option)

- No findings in the Milestone 1 change (Field wiring, lazy mounting of long option lists with keyboard reveal). See PhoneInput for the trigger value direction leftover.

### Checkbox

- Finding: `aria-invalid` is set from the Field, but there is no visual invalid tone on the box. Not a defect: the spec defines no invalid visual, and the Field's error text carries the state (the form skill puts validation feedback in the field message).

### RadioButton

- No findings. The indicator is centred with `left-1/2 -translate-x-1/2`, which is direction-neutral.

### RadioCards

- Finding: each option's `aria-label` replaced its text, so the item `description` was never announced. Fixed: the option points `aria-describedby` at the rendered description when the default slot is not overridden. Spec, `.vue` and a new test cover it.

### Switch

- Finding: the checked handle slid with a physical `translate-x-3.5`. Under `dir="rtl"` the handle starts at the right end, so checking it pushed it out of the track. Fixed: `rtl:group-data-[checked]:-translate-x-3.5`. Spec motion section and a test cover it.
- Finding: the checked handle and the privacy lock use primitive `--color-base-white` / `--color-base-black`. Not a defect: the spec documents a knob that stays white in both themes on the `--accent` track.

### Textarea

- No findings in the Milestone 1 change (Field wiring).

### Calendar (Calendar, CalendarGrid, CalendarPeriod, CalendarFields, CalendarTimezone, CalendarPreset)

- Finding: English built-in strings were in Title Case (`Select a Date Range`, `Select Period`, `Apply Range`, `Last 3 Days`, `Last Week`, `Last Month`, `Last Quarter`, `Last Year`), which breaks the sentence-case rule. Fixed: they are now sentence case in `en.ts` (es and pt-BR were already sentence case), along with the spec, the prop docs, the calendar tests and the `with-presets` example labels.
- Finding: the month strip always slid in from the physical right for "next", while under RTL the next chevron points left. Fixed: the enter and leave classes carry `rtl:` mirrors, and the spec's Right-to-left section says so. Not covered by a unit test, because `<Transition>` classes are only visible mid-transition.
- Finding: the period list and the presets popover use `min-w-(--container-4xs)`, but `@aziontech/theme` has no `--container-4xs` (the scale starts at `--container-3xs`, 256px), so the minimum width is silently dropped. Not fixed: choosing the intended width is a design decision (see leftovers).
- Finding: the popover `transform-origin` falls back to `top left`. Not a defect: `usePlacement` always sets `--popup-origin` from the resolved placement.

### Chip

- No findings. The remove label is now in the catalog (`Remove {label}`) in all three languages.

### Label

- No findings. The Required text is in the catalog.

### ThemeSwitcher

- No findings. It is a radiogroup with roving tabindex, the labels are in the catalog, the indicator offset is measured in physical pixels (correct in RTL), and the indicator slide has `motion-reduce`.

### inputs/presets (interactive-states)

- No findings.

## Group B: page layout, navigation, overlays

### PageHeader

- No findings. The h1 scale is set by `size`, the description is muted body copy, the actions stretch to full width below `md` through a container query, and every value is a token.

### SectionHeader

- Finding: at `size="small"` the h2 was `text-label-md` in `--text-muted`, which is the same 14px size and the same colour as its `text-body-sm` muted description, so the title and the description could not be told apart. — Fixed: small is now `text-heading-xxs` in `--text-default`, the canonical section title from `webkit-baseline-ui`. Spec tokens table and JSDoc updated, and the test asserts the title is never a muted label.
- Finding: the copy-link is computed from `location` during render. — Not a defect: on the server it renders as `#anchor` and is only used when clicked, so nothing mismatches on hydration.

### SettingsSection

- Finding: the gutter copy-link button gave no feedback after a copy. SectionHeader's CopyButton says "Link copied", but this button stayed silent, so the user got no sign that anything happened (visibility of system status). — Fixed: after a successful copy the glyph becomes a check and the button's name becomes "Link copied" for 2 s. A new catalog key `settingsSection.linkCopied` was added in en, es and pt-BR. Spec updated and a test added.
- Finding: the copy-link target is 20px. — Not a defect: it sits alone in the gutter with no target within 24px, which meets the WCAG 2.5.8 spacing exception.

### SettingRow

- No findings. It is built from Item parts, the control column is capped with `max-w-(--container-3xs)` and drops under the copy below `md`, and the nested-level rule uses logical `border-s` / `ps-`.

### SaveBar

- No findings. The safe-area bottom padding is present, Save sits on top on a phone (column reversed), the bar uses `layout-boundary-inline`, and every value is a token.
- Finding: the status sentence is not a live region. — Not a defect: the bar appears because of the user's own edit, and Save is the next stop in tab order.

### ConfirmDialog

- Finding: while `loading` was true, Cancel, the close button, Esc and the overlay could all still dismiss the dialog in the middle of the action. This breaks the `webkit-ui-states` scope lock. — Fixed: Dialog gets `:dismissible="!loading"`, Cancel is `:disabled="loading"`, and `cancel` is not emitted while loading. Spec (props, v-model, events) updated and a test added.
- Finding: below `md` the buttons stacked Cancel above the confirm button, the opposite of SaveBar (Save on top). — Fixed: the actions row is `flex-col-reverse` below `md`. Spec best practice added, plus a test.

### Dialog (supporting fix for ConfirmDialog)

- Finding: the `dismissible` value in the injected context was read once at setup, so `DialogClose` and the overlay/Esc guards never followed a change to the prop. — Fixed: the context exposes `dismissible` through a getter, so the close button disables and enables live.

### WebkitProvider

- Finding (real, not fixed here): the provider sets `dir` and `lang` on its own `div`. The 21 overlays that teleport to `body` (Dialog, Drawer, Popover, Tooltip, DropdownMenu, Select, …) render outside that div, so under a provider that sets `dir="rtl"` or a non-English `lang` on a subtree they lay out left-to-right and carry the document's `lang`. Their strings are still translated, because they use the injected context. — Leftover row below.

### PageTabs

- Finding: PageTabs renders only a `TabsList` (the panels are routed elsewhere), so `aria-controls` could point at a missing element. — Not a defect: `TabsItem` already sets `aria-controls` only when the matching `Tabs.Panel` has registered with the root (`context.panels`), so PageTabs tabs carry no `aria-controls`.

### Wizard

- No findings. Focus moves to the step heading on every later step change. Below `@2xl` a polite `Step n of N` line replaces the hidden rail. The whole scope (Cancel, Previous, the rail) locks off `loading`. Built-in strings are present in all three catalogs.

### Stepper

- Finding: an `sr-only` "Current step" sits next to `aria-current="step"`. — Not a defect: it is the only state cue on the AT/browser pairs that ignore `aria-current="step"`, and it keeps the state words consistent with complete, error and in progress.

### HelpPanel

- No findings. The heading hierarchy runs h2 header, then h3 sections. The tutorial progress line is polite. While loading the panel sets `aria-busy` and the skeleton is hidden from AT. The 4px gap between the task marker and its title is what the spec specifies.

### KeyValuePairs

- No findings. It uses `dl`/`dt`/`dd`. An empty value shows a muted, `aria-hidden` dash plus an `sr-only` "Not set" (in all three catalogs). Columns collapse by container width.

### SeverityTag

- Finding: the default label was built in code as `Critical`, `High`, `Medium`, `Low` or `Info`. It was English-only and skipped the catalogs, so a pt-BR app showed "Critical". — Fixed: a new `severityTag` catalog (en `Critical/High/Medium/Low/Info`, es `Crítica/Alta/Media/Baja/Informativa`, pt-BR `Crítica/Alta/Média/Baixa/Informativa`) is read through `useLocale`. Spec updated and a pt-BR test added.
- Finding: the glyph bars use `rounded-[1px]`. — Not a defect: this is the geometry of a 2px-wide glyph, not a component shape token.

### Sidebar

- Finding: in a right-to-left subtree the rail mirrors (`border-e`, `start-0`), but its behaviour did not. Arrow keys on both separators were physical, so `ArrowRight` narrowed a rail sitting on the right. The drag delta used raw `clientX`, so dragging toward the content shrank the rail. The peek translate, the collapse slide (`-translate-x-full`) and the expand affordance's slide-in all moved toward the content. The expand tooltip opened `right`, off-screen. — Fixed: `useSidebarRail` reads `useDirection(railEl)`. The drag and the peek translate flip sign under `rtl`. The keys go through `logicalArrowKey`. `rtl:` variants mirror the collapse and the expand slide, and the tooltip opens on the left. Spec Accessibility section updated. Tests added: keys and drag in `sidebar.test.ts`, and computed translates with the theme loaded in `sidebar-rtl.test.ts`.

### Drawer

- Finding: `side="left"` anchors on `start-0`, but the closed state used a physical `-translate-x-full`. In an `rtl` document the panel therefore entered and left across the whole viewport instead of through its own edge (the same was true for `right`). — Fixed: `rtl:md:data-[state=closed]:±translate-x-full` was added to both sides. The spec's Motion section now describes the mirroring, and `drawer-rtl.test.ts` checks the computed translate with the theme loaded at 1280px.

### NavigationMenu

- Finding: the popup arrow is a `rotate-45` square that hides two borders with logical utilities (`border-e-0`, `border-s-0`). Under `rtl` the opposite border hides, and the visible corner pointed sideways. — Fixed: the arrow adds `rtl:-scale-x-100`, which mirrors it before the rotation. Spec Right-to-left section updated, and `navigation-menu-rtl.test.ts` checks the computed border and scale.

### Separator

- Finding: a labelled separator ("Or") kept `role="separator"`, and the spec said its text was exposed. A separator's children are presentational, though, so the label never reached assistive technology. — Fixed: the label span gets an id and the root `aria-labelledby` it. Spec corrected and a test added (`getByRole('separator', { name: 'Or' })`).

### Command

- Finding: the built-in placeholder was title case, "Search Everything" (`webkit-microcopy` §2). — Fixed: en is now "Search everything", and the spec, the prop JSDoc, the default example item and the Storybook story were aligned. es and pt-BR were already sentence case.

### Link

- Finding: the built-in label was title case, "Learn More". — Fixed: en is now "Learn more", with the spec and JSDoc aligned. es and pt-BR were already correct. Note for the actions lane: `mini-button`'s own catalog default is also "Learn More".

### BreadcrumbItem

- Finding: the `label` prop default is "Page Name" (title case). — Not a defect for this pass: it is a sample default that a consumer always overrides, not a catalog string. Leave it to the codemod/prop-default cleanup.

### Breadcrumb, Menu, DropdownMenu, Popover, Panel, Footer, FrameBox, GlobalHeader, Resizable

- No findings. The M1 changes (catalog strings, logical properties, `logicalArrowKey`, directional icons, `defaultDocument` for SSR, the mobile full-height overlay and footer) are correct. Resizable already mirrors its drag and keys, which is the pattern Sidebar now follows.

### Tabs / TabView

- Finding (row 24/25 lane, ROADMAP M1.10 row 25): on the server the active panel rendered at `opacity-0`, because its enter motion started from `opacity-0` on mount and only became visible after a client `requestAnimationFrame`; without JS the panel was blank. — Fixed: the spec Motion table says the panel active at first render is visible at once; `TabsPanel` starts visible and runs the enter motion only when the active value changes later. Tested in `tabs.test.ts` (first panel visible on mount, the next one enters from `opacity-0` to `opacity-100`) and in `src/test/ssr.test.mjs` (the active panel of `examples/tabs/default.vue` has no `opacity-0` in the server HTML).
- TabView was merged into Tabs in Milestone 1; no further findings.

## Group C: data, charts, feedback, code

### PropertyFilter

- Finding: the group hint in each suggestion ("Properties", "Values") used `text-label-xs`, which is not a theme typography token, so it inherited its size by accident. Fixed: `text-label-sm`.
- Finding: `disabled` did not reach the Match all / Match any `ToggleGroup`, so a disabled filter could still change how its tokens combine. The spec says "Disables the field and the tokens". Fixed: the toggle now takes `:disabled`.
- Finding: the match count is a `role="status"` that only renders once there are tokens. Not a defect: the count changes on every token change, and it is announced from then on; with no tokens there is nothing to count.

### CollectionPreferences

- Finding: the "Always shown" hint on a locked column used the non-existent `text-label-xs`. Fixed: `text-body-xs` (smaller than the `text-body-sm` row label).
- Finding: the description under the Columns legend ("Choose which columns show, and their order.") was not tied to the fieldset, so screen readers skipped it. Fixed: the fieldset now has `aria-describedby` pointing at it.
- Finding: Cancel is `transparent` next to a primary Confirm. Not a defect: this is the panel-footer pattern Dialog and Drawer use.

### Cards

- Finding: cards and their skeletons used `rounded-(--shape-elements)`, while baseline-ui requires `--shape-card` for cards. Fixed: spec token table and SFC now use `var(--shape-card)`.
- Finding: the empty state's built-in copy has no action. Not a defect: `Cards` cannot know the create action. The `empty` slot is where a screen puts it, and the lists skill makes the screen own that action.

### Tree

- Finding: the nested group's indent guide sat at `--spacing-sm` (12px), while the parent chevron's center is at the 8px row inset plus half of the 16px box (16px). The guide was 3.5px off the chevron, and the spec wrongly said it was centered. Fixed: the spec was rewritten first, then the group indent changed to `ms-(--spacing-md)` with no padding-start. The guide now sits under the chevron's center, in the gutter before the nested rows' box edge. A new browser test measures both (guide within 1px of the chevron center; guide never over a nested row).
- Finding: a leaf keeps an empty chevron box. Not a defect: the chevron column is the tree's own structure. Dropping it on leaves would move a leaf's glyph and label off the column that its parent siblings use, which breaks the one-content-column rule in mixed sibling sets. The spec states this on purpose.

### Chart family (Chart, BarList, ChartCard, DonutChart, StatTile, Tracker, _lib)

- Finding (BarList, Tracker): the focus ring had `ring-offset-1` with no offset color, so Tailwind's white offset showed as a white gap in the dark theme. Fixed: `focus-visible:ring-offset-(--bg-surface)` in both specs and SFCs.
- Finding (DonutChart): in the table view, the Value and Share headers and cells were start-aligned, so numbers did not line up. Fixed: numeric headers and cells are `text-end` (the name column stays `text-start`), matching `Chart`'s table view.
- Finding (Chart, ChartLine, ChartArea, ChartLegend, DonutChart): opacity transitions name a duration token but no easing token. Not a defect: Tailwind's default transition curve applies, the change is a dim or fade only, and every one has `motion-reduce:transition-none`.
- Finding (Tracker): the strip uses `gap-0.5` (2px). Not a defect: it is a hairline gap between blocks, and the smallest spacing token (`--spacing-xxs`, 4px) would break the strip into separate pills.
- Finding (StatTile): the "No data" tag is centered with `left-1/2 -translate-x-1/2`. Not a defect: centering is the same in both directions.
- No other findings in ChartCard (drag and resize keys already map through `logicalArrowKey`) or `_lib`.

### Pagination

- Finding: page-number buttons did not use tabular figures, so the pager's width jumped between pages such as 1 and 11. Fixed: `tabular-nums` on `PaginationButton`.
- Finding: the page-size select pads its end with `pe-7`. Not a defect: it reserves the chevron's 28px. No spacing token is that size, and `--spacing-xl` changes at breakpoints.

### PickList

- No findings. The M1 change moved its four aria-labels into the catalogs, and all three catalogs have them.

### Flow

- Finding (RTL): M1.5 made the ports logical (`start-0` / `end-0`) but kept the physical `translate-x` that pushes them outside the node. The connector geometry also always ran from a node's right edge to the next node's left edge. Under `dir="rtl"` the ports sat inside the nodes and the connectors crossed them. Fixed: the spec gained a right-to-left line. `connectors.ts` now reads the container's direction and draws from the inline-end edge to the inline-start edge, with the elbow bus and corner radii mirrored. The ports get `rtl:` translate overrides. A new browser test checks the connector endpoints and the port position in RTL.

### Alert, EmptyState, Progress, Toast

- No findings. The M1 changes were renames (Message → Alert, ProgressBar → Progress), catalog close labels and logical margins; all were checked against the catalogs and the RTL rules.
- Finding (EmptyState): when bordered, it uses `rounded-(--shape-button)`. Not a defect for M1: this predates M1, and the dashed drop-zone look is shared with FileDropzone. It is left as is.

### StatusIndicator

- Finding: the loading label added three periods (`Deploying...`); webkit-microcopy requires the ellipsis character. Fixed: the spec now says `…`, the SFC appends `…`, and the test was updated.

### CodeBlock

- No findings. The M1 diff (lazy line chunks, logical `end-` / `me-` / `pe-` placement, the code kept `dir="ltr"`, catalog copy label) follows the spec. Every transition has `motion-reduce`.

### LogView (other than the live region)

- Finding: the built-in English strings broke sentence case and ellipsis: "Find in Logs", "1 Warning" / "N Warnings", "Loading...". Fixed: "Find in logs", "{count} warning(s)" and "Loading…". The Spanish and Portuguese catalogs were already correct. The spec, the prop JSDoc, the stories and the test were updated to match.

### LogView (live region, ROADMAP M1.10 row 24)

- Finding: the scrolling log body was the `role="log"` polite live region, so the chunks `useLazyChunks` mounts as the reader scrolls (and the whole log at mount) could be read out as new lines. — Fixed: the spec Accessibility section now says a visually hidden `role="log"` region holds only the lines appended to `lines` since the last update (filtered by the current search and warnings-only view); the scrolling body is no longer a live region, and replacing `lines` with a different log clears the region. `LogViewContent` tracks the previous length and first/last ids, so in-place pushes and new arrays both count as appends. Tested in `log-view.test.ts`: the region starts empty, scrolling a chunk into view mounts more lines and leaves it empty, an appended line is announced, a replaced log clears it.

## Group D: actions, content, documentation

### Button

- Finding: `kind="text"` became `transparent`; directional icons mirror; hover nudge flips under RTL; 44px coarse-pointer hit area. Not a defect: the change matches the spec, uses tokens and has `motion-reduce:` escapes.
- Finding: the touch-target inset `calc(50%-22px)` is a raw px value. Not a defect: it encodes the 44px WCAG target. No spacing token holds that value.

### ButtonHighlight

- No findings. The only change is directional-icon mirroring.

### CopyButton

- No findings. The labels now come from the catalog (`Copy` / `Copied`), and all three catalogs agree.

### IconButton

- No findings. The changes are directional-icon mirroring and the coarse-pointer hit area. Same touch-target note as Button.

### MiniButton

- Finding: the built-in label was `Learn More` in title case, which breaks the sentence-case rule for catalog strings. The spec's own Purpose section already said "Learn more". Fixed: the `en` catalog, the spec and the prop doc now say `Learn more`. es (`Más información`) and pt-BR (`Saiba mais`) were already correct.
- Finding: the ghost surface was moved to `-start/-end`. Not a defect: RTL-correct.

### SplitButton

- Finding: the toggle's accessible name `{label} — more actions` has an em dash in all three catalogs, which `webkit-microcopy` bans. Fixed: `More actions for {label}`, `Más acciones para {label}`, `Mais ações para {label}`. Tests updated.
- Finding: the spec still pointed to the removed `navigation/dropdown` / `dropdown` in Purpose, When NOT to use, Related and Motion. Fixed: it now names `dropdown-menu` (spec only; checksum recomputed).
- Finding: `DropdownMenu.Trigger` renders a focusable `span[role=button]` that wraps the IconButton `<button>`. The result is nested interactive controls and two tab stops, and the axe test stays skipped. Not fixed here: the defect lives in `navigation/dropdown-menu` (another group). Leftover below.

### ToggleGroup (was SegmentedButton)

- Finding: every segment was its own tab stop. Arrow keys moved the selection but left focus on the old segment, so screen readers never announced the newly checked radio. The `radiogroup` pattern expects one tab stop with focus following the selection. Fixed: the spec Accessibility section now describes roving `tabindex`. In the `.vue`, the selected segment (or the first enabled one) gets `tabindex=0`, the others `-1`, and arrow navigation focuses the new segment. New test: one tab stop, focus follows the selection.
- Finding: the indicator uses a physical `left: 0` plus `offsetLeft`. Not a defect: both are physical, so it lands on the right segment in RTL (the spec says so).

### Accordion

- No findings. It moved to `v-model`, `text-start` and a `min-w-0` label, all correct.

### Avatar

- Finding: without an image, the root `role="img"` was named by the two initials ("JD") even when `alt` was set. A screen reader heard letters instead of the person. Fixed: the spec (best practice and `alt` row) now says `alt` names the initials and icon fallbacks too. `accessibleLabel` now prefers `alt`. New test.
- Finding: the kind/size/typography class maps live in JS. Not a defect for the user: this is an older styling-rule debt with no visual or a11y effect. Left as is to keep this pass surgical.

### Badge

- No findings. `dir="auto"` on user text is correct.

### BrowserFrame

- No findings. Catalog strings, RTL-aware drag and arrow keys, logical handles.

### Card (was CardBox)

- Finding: the header action is revealed with `transition-opacity` and Tailwind's default duration. Not a defect: Tailwind's default 150 ms matches the inline `duration-150 ease-out` catalog value other components use, with a `motion-reduce:` escape. Keyboard reveal works through `group-focus-within`, and on touch it is always visible (`hover:none`).
- Finding: a content-sized flex item collapses to zero width. Not handled here: this is ROADMAP M1.10 row 8, which has its own owner.

### CardPricing

- No findings. Only an import path changed.

### Item

- No findings. The kind was renamed `outline` → `outlined`.

### Kbd

- Finding: `isMac` is read during render, so SSR prints `Ctrl` and a macOS client then patches the text to `⌘`. Not a defect: Vue patches the text on hydration with no layout change. The `kbd` keycaps stay `dir="ltr"`.
- No other findings. The key names come from the catalog in all three languages.

### Overline

- Finding: the label used `text-primary` and the prefix `text-default`. Neither utility exists in the theme (`@aziontech/theme` defines no `--color-primary` / `--color-default`), so both inherited whatever color surrounded them instead of the brand primary and default text tokens. This hit every marketing eyebrow (section-title, hero-title, call-to-action, media-split, ticker) in both themes. Fixed: the spec Tokens table now gives the real utilities. The `.vue` uses `text-(--primary)` and `text-(--text-default)`. New test.

### ProductWidget

- No findings. The 68 files are mechanical renames (Input, NumberInput, Card, ToggleGroup, Field, `ms-auto`). No physical-direction utilities remain in the group (grep).

### ShellMockup

- Finding: the scaled frame is anchored at `start-0` but always scaled from `origin-top-left`. Under `dir="rtl"` the frame sits at the right edge and shrinks toward its left edge, so it drifts out of its host. Fixed: the spec RTL section now covers it, and the `.vue` adds `rtl:origin-top-right`. New test.

### Tag

- No findings. Every severity uses role tokens and the label has `dir="auto"`.

### DocCallout

- No findings. Message became Alert, with logical list padding.

### DocCard / DocCardGroup / DocItem

- No findings. They are renames (`eyebrow`, `linkLabel`, `mobileColumns`), and the hover nudge flips under RTL.

### DocFrame

- No findings. Catalog strings, SSR-safe `defaultDocument`, logical positions.

### DocOnThisPage

- Finding: the rail SVG path is drawn in physical x and steps right for deeper entries. Under RTL the SVG moved to the start edge (right), but its bends still stepped right, out of the box. Fixed: the spec (Accessibility/ARIA) now covers the mirror, and the svg gets `rtl:-scale-x-100`. New test.
- Finding: `ps-[17px]` is a raw literal. Not a defect: it matches the rail's computed geometry (stroke plus indent constants in `toc-rail.ts`) and is not a spacing step.

### DocPageHeader

- No findings. `formatDate` follows the locale; Divider became Separator; `kind="transparent"`.

### DocPagination

- No findings. Catalog strings, and the chevrons both mirror and nudge in the reading direction.

### DocPrompt

- No findings. Catalog strings; edge fades swap gradient direction under RTL.

### DocProse

- Finding: when the clipboard is refused, the fallback tooltip said `Press ⌘C to copy` on every platform, which is wrong on Windows and Linux. Fixed: the spec now names both forms. The catalog strings in all three languages take a `{shortcut}` placeholder. The `.vue` passes `⌘C` on macOS and `<kbd.ctrl>+C` elsewhere. New test.
- Finding: body text `--text-muted` is 3.78:1 in light mode. Not fixed: the spec already records it as a known contract gap that needs a theme token change. It already exists as a documented gap, not a new leftover.

### DocTooltip

- No findings. The props were renamed (`title`, `linkLabel`) and `text-start` is used.

### DocUpdate

- Finding: the titled entry's node is placed at `start-[-xl]` and centred with `-translate-x-1/2`. Under RTL the shift pushed it off the rule. Fixed: the spec now covers both directions, and the `.vue` adds `rtl:translate-x-1/2`. New test.

## Marketing and sections

Scope: every component under `marketing/*` and `sections/*` that Milestone 1 changed. Except for
`sections/hero-form`, which is new, the M1 changes were mechanical: renamed imports
(`Overline`, `Tag`, `Avatar`, `Separator`, `ToggleGroup`, `Input`, `Alert`, `Field`), `autoPlay` →
`autoplay`, physical → logical sides, RTL arrow keys and marquee direction, and built-in strings
moved to the locale catalogs. The review covers each of those diffs, plus a full ui-craft pass
on the two form sections.

### HeroForm (new)

- Finding: a failed submit left focus on the button, so keyboard and screen-reader users did not land on the field in error (`webkit-form`: "a failed submit focuses the first field in error") — Fixed: focus moves to the first field in error. Spec States updated and tested.
- Finding: the `email` field rendered as `type="text"` with no `autocomplete` and with spellcheck on (`webkit-form` native hints) — Fixed: it is now `type="email"` with `autocomplete="email"` and `:spellcheck="false"`. Spec ARIA updated and tested.
- Finding: while `loading`, the fields stayed editable, so an edit made during the send was silently dropped (`webkit-ui-states` scope lock) — Fixed: every `Field` is `:disabled="loading"`. Spec updated; the loading test now asserts the fields are disabled.
- Finding: on `submitted` the form, including the focused button, unmounted, and focus fell to `<body>` — Fixed: when focus was inside the form, the success `Alert` (`tabindex="-1"`) takes it. Spec and test updated.
- Finding: the spec named a `message` component that no longer exists (it is `alert`), and the `HeroFormMessages` JSDoc said "Alert under a required field" for what is helper text — Fixed: spec and JSDoc corrected.
- Finding: the select search empty state "No results found" had no period (`webkit-microcopy` gives "No results found." as the canonical built-in) — Fixed in `heroForm.empty` in en, es and pt-BR.
- Not a defect: `:required` is bound to the empty-after-submit state while `Label` carries the persistent Required tag. This is the documented Approach B pattern (`webkit-form`).
- Not a defect: the search icon inside `HeroFormSelect` is already `aria-hidden`, through the `Input` icon slot wrapper.

### ClosingCallToActionNewsletter

- Finding: an empty submit showed the red `invalid` state ("required is not an error": `webkit-form`/`webkit-errors`) — Fixed: empty → amber `required` (`aria-required`), malformed → red `invalid` (`aria-invalid`), never both at once. Spec and test updated.
- Finding: a failed submit did not return focus to the field — Fixed (spec and test).
- Finding: the email input kept spellcheck on — Fixed: `:spellcheck="false"` (spec and test).
- Finding: on `submitted`, focus was lost when the form unmounted — Fixed: the success `Alert` takes focus (spec and test).
- Finding: the spec's Related section still pointed to `message`, and the field-message JSDoc said "Alert shown under the field" (left over from the M1.2 rename) — Fixed.

### MediaSplit

- Finding: the chevron affordance enters from `translate-x-1`, which in RTL, where the badge sits at the left (`end`), slides it in from the inside, toward start — Fixed: added `rtl:-translate-x-1` with its `rtl:group-hover`/`rtl:group-focus-visible` resets. Spec Motion row updated; a test asserts both classes are present. The unit env loads no CSS, so the offset is checked by class.

### StoryLibrary, ArticleIndexResourceHub, ArticleIndexBlog

- Finding: the search empty state "No results found" had no period, in all three catalogs (`storyLibrary.empty`, `articleIndex.empty`) — Fixed in en, es and pt-BR.
- Finding: StoryLibrary's empty-state JSDoc said "Alert of the empty state." (the rename codemod turned "Message" into "Alert") — Fixed back to "Message of the empty state."

### No findings

- BentoGrid, BigNumbers, CallToAction, CardGrid, Carousel (Item/Next/Previous), Diagram (Node), Hero (Title), LogoWall, MediaTabs, QuoteCarousel, QuoteTabs, Quote, SectionTitle, StickyStack, TextureMaterial, Ticker, Topic: the M1 changes are import renames, logical sides (`ms`/`me`/`ps`/`pe`/`start`/`end`/`border-s`/`border-e`/`text-start`), mirrored chevrons (`rtl:-scale-x-100`), RTL-aware arrow keys (`logicalArrowKey`), RTL-reversed marquee and fade masks, and catalog-backed defaults (`carousel.*`, `logoWall.link`). Each was checked against `webkit-baseline-ui`, `webkit-theming-dark-mode` and `webkit-motion-polish`: tokens only, every motion class pairs with `motion-reduce:*`, and no per-theme edits. No defects.
- ArchitectureTabs, ArticleBody, ArticleHighlight, ClosingCallToActionAgents, CodeSplit, ComparePlans, CompareSupportTiers, ComparisonTable, ComplianceBadges, ContactHub, FaqSection, FeatureTabs, HeroCopyOnTopArt, ListingBrowser, ListingTable, PhotoMarquee, PricingPlans, RecognitionMarquee, SiteFooter, SiteNav, UseCases: the same mechanical renames, logical sides and catalog strings. Checked; no defects.
  - Not a defect: the `—` glyphs in the ComparePlans and CompareSupportTiers cells are `aria-hidden` table marks with an `sr-only` label, not microcopy.
  - Not a defect: `aria-label="Azion"` on the SiteNav and ComparisonTable logo is a brand name, which is not translated.
- Not a defect: Topic and StoryLibrary keep the `pi-arrow-up-right` "opens elsewhere" glyph unmirrored. This is the same convention the rest of the system follows for external links. Only their hover nudge is direction-aware.

## Cross-group fixes

- `phoneInput.empty` had no closing period in any catalog, unlike every other empty message: now `No country found.` / `No se encontró ningún país.` / `Nenhum país encontrado.` (spec and prop doc updated).
- `skills/webkit-form`: the sample `submit()` said "no focus dance" while the rules require moving focus to the first field in error; the sample now focuses the first field in error.
- `link.label` (en) was "Learn More"; now "Learn more" (fixed in group B).

## Leftovers added to M1.10

| From | Leftover                                                                                                                                                  | How it closes                                                                                                  |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| M1.4 | Overlays teleported to `body` leave the `WebkitProvider` element, so a provider that sets `dir`/`lang` on a subtree does not reach them                   | One shared portal sets `dir` and `lang` from the locale context; RTL test under `<WebkitProvider locale="ar">` |
| M1.2 | `DropdownMenu.Trigger` wraps a slotted button in a focusable `span[role=button]` (nested controls, two tab stops); the SplitButton axe test stays skipped | The Trigger forwards ARIA, ref and handlers to the slotted control; unskip the axe test                        |
| M1.4 | Calendar uses `min-w-(--container-4xs)`, a token the theme does not define                                                                                | Add the token or use `--container-3xs` (design decision)                                                       |
| M1.5 | `SelectTrigger` value has no direction isolation, so PhoneInput's closed trigger shows `+55` as `55+` in RTL                                              | A `dir` passthrough (or `dir="ltr"` for dial codes) on the value span, asserted in the RTL test                |

## Additions requested by the blocks review

- Toast: `toast()` took one `action`, so a failed deploy could not offer **Edit** and **Redeploy** together. Fixed: `actions` (the first two render) beside `action`, which keeps working; spec, then `use-toast-store.ts` and `toaster.vue`, then a test.
- SaveBar: no place for a status (Saving…, Saved, an unsaved-changes count). Fixed: a `leading` slot that replaces the icon and sentence in every kind; spec, `.vue`, test.
- GlobalHeader story: "Start for Free" is now "Start for free".
