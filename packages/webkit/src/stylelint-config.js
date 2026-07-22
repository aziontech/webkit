// Shareable Stylelint config for the @aziontech/webkit design system.
//
// It forbids hardcoded colors in CSS/SCSS and Vue <style> blocks and steers
// authors to design tokens from @aziontech/theme, referenced as `var(--*)`.
// This is the styles-side complement to @aziontech/eslint-plugin-webkit, which
// owns JS/TS and Vue <template> class strings.
//
// Zero runtime dependencies: only Stylelint's BUILT-IN rules are used. Stylelint
// itself is a peerDependency. `.vue` / `.scss` need a custom syntax
// (postcss-html / postcss-scss); the consumer wires those via `overrides` — see
// README. This config ships only the rules, never a syntax dependency.

// One shared line every message points to, so the fix is always obvious.
const USE_TOKEN =
  'Use a design token from @aziontech/theme via var(--*) instead of a hardcoded color.'

const USE_MOTION_TOKEN =
  'Motion timing lives in the theme tokens: use the animate-* utilities or var(--duration-*/--ease-*) — never a literal ms/s, a raw cubic-bezier(), or transition: all.'

export default {
  rules: {
    // Bans hex colors: `#fff`, `#ffffff`, `#ffffffff`. The message tells the
    // author to reach for a token instead of the literal.
    'color-no-hex': [true, { message: USE_TOKEN }],

    // Bans raw color functions. A color coming out of `rgb()` / `hsl()` (and
    // their alpha variants) is a hardcoded value, not a token reference. Tokens
    // are consumed as `var(--*)`, so these functions have no place in authored
    // styles.
    'function-disallowed-list': [
      ['rgb', 'rgba', 'hsl', 'hsla'],
      { message: `${USE_TOKEN} Raw color functions (rgb/rgba/hsl/hsla) are not allowed.` }
    ],

    // Catches the most common named CSS colors on color-bearing properties.
    // Deliberately conservative: the negative lookahead `(?!.*var\()` lets any
    // value that already uses a token through untouched, and the list is limited
    // to unambiguous palette words to avoid false positives (e.g. `transparent`,
    // `currentColor`, `inherit` are intentionally allowed). Extend the value
    // list in a consumer override if a project needs a stricter palette.
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
