// Shareable Stylelint config — the styles-side complement to the eslint plugin (which
// owns JS/TS and template class strings): forbids hardcoded colors and motion timing
// in CSS/SCSS and Vue style blocks, steering authors to theme tokens via var(--*).
// Zero runtime deps (built-in rules only); the consumer wires custom syntaxes via overrides.
const USE_TOKEN =
  'Use a design token from @aziontech/theme via var(--*) instead of a hardcoded color.'

const USE_MOTION_TOKEN =
  'Motion timing lives in the theme tokens: use the animate-* utilities or var(--duration-*/--ease-*) — never a literal ms/s, a raw cubic-bezier(), or transition: all.'

export default {
  rules: {
    'color-no-hex': [true, { message: USE_TOKEN }],

    'length-zero-no-unit': [
      true,
      { message: 'A zero length takes no unit — write `0`, not `0px` / `0rem` / `0em`.' }
    ],

    // A color from a raw color function is a hardcoded value, not a token reference.
    'function-disallowed-list': [
      ['rgb', 'rgba', 'hsl', 'hsla'],
      { message: `${USE_TOKEN} Raw color functions (rgb/rgba/hsl/hsla) are not allowed.` }
    ],

    // Named colors, deliberately conservative: a value already using a token passes,
    // and the list is limited to unambiguous palette words (transparent, currentColor,
    // inherit stay allowed). Extend the list in a consumer override for a stricter palette.
    'declaration-property-value-disallowed-list': [
      {
        '/^(color|background|background-color|border|border-color|outline|outline-color|fill|stroke|box-shadow|text-shadow)$/':
          [
            '/^(?!.*var\\().*\\b(black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|gold)\\b/i'
          ],
        // Motion timing (styles-side of webkit/no-hardcoded-motion): literal durations,
        // raw easing functions, and an un-named transition target; a value reading its
        // timing from a token passes untouched.
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
