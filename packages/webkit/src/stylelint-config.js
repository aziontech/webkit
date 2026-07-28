// Shareable Stylelint config for the @aziontech/webkit design system: forbids
// hardcoded colors in CSS/SCSS and Vue <style> blocks, steering authors to
// @aziontech/theme tokens via `var(--*)`. Styles-side complement to
// @aziontech/eslint-plugin-webkit, which owns JS/TS and <template> classes.
//
// Built-in rules only — no runtime deps. `.vue` / `.scss` need a custom syntax
// (postcss-html / postcss-scss), wired by the consumer via `overrides`.

const USE_TOKEN =
  'Use a design token from @aziontech/theme via var(--*) instead of a hardcoded color.'

const USE_MOTION_TOKEN =
  'Motion timing lives in the theme tokens: use the animate-* utilities or var(--duration-*/--ease-*) — never a literal ms/s, a raw cubic-bezier(), or transition: all.'

export default {
  rules: {
    'color-no-hex': [true, { message: USE_TOKEN }],

    // `ignore: ['custom-properties']` is deliberately NOT set — a design system
    // is authored almost entirely as custom properties, which is exactly where
    // the drift showed up (`--tracking-normal: 0em`).
    'length-zero-no-unit': [
      true,
      { message: 'A zero length takes no unit — write `0`, not `0px` / `0rem` / `0em`.' }
    ],

    // A color out of `rgb()` / `hsl()` is a hardcoded value, not a token
    // reference — tokens are consumed as `var(--*)`.
    'function-disallowed-list': [
      ['rgb', 'rgba', 'hsl', 'hsla'],
      { message: `${USE_TOKEN} Raw color functions (rgb/rgba/hsl/hsla) are not allowed.` }
    ],

    // Named colors on color-bearing properties. Conservative by design: the
    // `(?!.*var\()` lookahead lets token-based values through, and the word list
    // stays unambiguous so `transparent` / `currentColor` / `inherit` pass.
    'declaration-property-value-disallowed-list': [
      {
        '/^(color|background|background-color|border|border-color|outline|outline-color|fill|stroke|box-shadow|text-shadow)$/':
          [
            '/^(?!.*var\\().*\\b(black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|gold)\\b/i'
          ],
        // Motion timing discipline (the styles-side of webkit/no-hardcoded-motion):
        //  - a literal duration (200ms / 1.5s) in transition/animation — tokens only;
        //  - a raw cubic-bezier() — the curves ship as --ease-* tokens;
        //  - bare `transition: all` — always name the animated properties.
        // A value that reads its timing from var(--…) passes untouched.
        '/^(transition|transition-duration|transition-delay|animation|animation-duration|animation-delay)$/':
          ['/(?<!var\\([^)]*)\\b\\d+(\\.\\d+)?m?s\\b/', '/cubic-bezier\\(/'],
        '/^transition$/': ['/^all\\b/']
      },
      {
        // One rule instance covers two disciplines; the message function routes each
        // violation to its own guidance (stylelint passes the property as message args).
        message: (prop) =>
          /^(transition|animation)/.test(prop)
            ? USE_MOTION_TOKEN
            : `${USE_TOKEN} Named colors are not allowed.`
      }
    ]
  }
}
