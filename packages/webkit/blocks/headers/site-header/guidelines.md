# Site header

The sticky top bar of the marketing site. A visitor is deciding whether to try Azion, so the bar keeps the decision one click away (Start for free, Login) while letting them explore (the product navigation and its mega-menus, Contact, search). Its surface runs to the window edges while its regions are capped at the site measure, so it lines up with the framed page under it.

## When to use

- On every marketing page, inside `shells/website`.

## When not to use

- Documentation: use `headers/docs-header`. Console: use `headers/resource-header`. Signed-out console screens: use `headers/auth-header`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

`kind="site"`, `aria-label="Azion"`, in a `sticky top-0` wrapper. Start in `GlobalHeader.Left`, navigation in `GlobalHeader.Middle`, actions in `GlobalHeader.Right`.

### B. Navigation trigger — `IconButton` (required)

Below `xl`, an outlined `pi-bars` icon button opens the navigation sheet.

### C. Brand — `Brand` (required)

Inside `GlobalHeader.Brand`, linked home with `aria-label="Azion home"`.

### D. Primary navigation — `NavigationMenu` (required from xl)

Five top-level links (`Solutions`, `Products`, `Developer`, `Resources`, `Pricing`) with a `contrast` popup for the mega-menus. Hidden below `xl`. The menus and the sheet are specified on the SiteNav story.

### E. Actions — `Button` (required)

Contact (`transparent`, from `xl` only), Login (`secondary`) and Start for free (`primary`). One primary in the bar.

### F. Search — `SearchTrigger` (required)

The header search, last in the end cluster as on azion.com: `collapsible` with no `@container` around the bar, so it stays the magnifier at every width. It still announces and binds ⌘K / Ctrl K and emits `open`, which opens the `Command` palette. Never a bare magnifier `IconButton` (rule `webkit-header-search`).

### G. Search palette — `Command` (required)

The ⌘K palette the header search opens: `Command.Input`, one group of pages, and `Command.Empty` for no match. It owns the ⌘K / Ctrl K shortcut while mounted.

## Do

- Keep Start for free as the only primary action, and visible at every width.
- Let Contact leave first when space runs out; Login and Start for free stay.

## Don't

- Don't add a second primary (Book a demo) next to Start for free.
- Don't put the console's account controls here; a signed-in visitor goes to Console.

## Copy

- **Navigation:** nouns, sentence case: `Solutions`, `Pricing`.
- **Actions:** short verbs: `Contact`, `Login`, `Start for free`. Keep the same capitalization on every page and in the hero.

## Accessibility

- Sticky bar: make sure in-page anchors scroll with an offset so the target is not hidden under it.
- `NavigationMenu` triggers are keyboard operable and the popup closes on Escape; the mobile trigger has `aria-label="Open navigation"`.
- At 320 px only the trigger, brand, Login, Start for free and search remain, without horizontal scroll.

## States

- Default: the only state; navigation from `xl`, trigger below it.

## Related

- `shells/website` — the shell this bar heads.
- `headers/docs-header` — the documentation counterpart.
