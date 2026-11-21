# Rule: use the webkit component before building your own

Before you write UI, check whether the design system already has it. It almost always does — and its version is themed, accessible, and consistent with the rest of the product.

## Do

1. Check the catalog: the webkit MCP (`suggest_component` with a plain description of what you need), `node_modules/@aziontech/webkit/llms/llms.txt` (a page per block and component, for agents without the MCP) or `node_modules/@aziontech/webkit/catalog.json` (the `imports` object lists every component).
2. If a component exists, use it. Compose it, pass its props, fill its slots.
3. If it almost fits, prefer configuring/composing the webkit component over forking it.

## Don't

- Do not hand-roll a button, input, modal, table, tooltip, badge, or any common UI when webkit already ships one.
- Do not print a typed value as a hand-made string: a moment in time is `Timestamp`, money is `CurrencyAmount`, a number or a file size goes through the `useLocale()` formatters. The full table is in the `webkit-usage` skill, "Pick the component for the job".
- Do not use a plain `Input` for a value that has its own control: a date or a date and time is `DatePicker` (`show-time`), a range `DateRangePicker`, a number `NumberInput`, a phone `PhoneInput`, a secret `PasswordInput`, a one-time code `OtpInput`. No field asks the person to type a format such as ISO 8601. The full table is in the `webkit-form` skill, "Pick the control from the kind of value".
- Do not pull in another component library (a third-party UI kit, a headless UI kit, a random npm widget) for something webkit covers.
- Do not copy a component's markup into your own file to tweak it — use the real component so it stays themed and accessible.

## When webkit genuinely lacks it

- Build the smallest custom piece you need, using `@aziontech/theme` tokens for all color/spacing/typography (see the tokens rule).
- Keep it composable with webkit components rather than reinventing their look.
- Consider raising the gap with the design-system team so it can be added once for everyone.

## Enforcement

- `webkit/prefer-webkit-component` (ESLint) flags an import from another UI library.
- `webkit/prefer-value-control` (ESLint, `error`) flags an `Input` with a native `type` of `number`, `date`, `datetime-local`, `time`, `tel` or `password`, or with a date format in its placeholder.

The goal: your UI looks and behaves like the rest of the product because it is built from the same parts.
