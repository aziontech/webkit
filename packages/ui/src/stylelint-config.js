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

    'function-disallowed-list': [
      ['rgb', 'rgba', 'hsl', 'hsla'],
      { message: `${USE_TOKEN} Raw color functions (rgb/rgba/hsl/hsla) are not allowed.` }
    ],

    'declaration-property-value-disallowed-list': [
      {
        '/^(color|background|background-color|border|border-color|outline|outline-color|fill|stroke|box-shadow|text-shadow)$/':
          [
            '/^(?!.*var\\().*\\b(black|white|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|gold)\\b/i'
          ],
        '/^(transition|transition-duration|transition-delay|animation|animation-duration|animation-delay)$/':
          ['/(?<!var\\([^)]*)\\b\\d+(\\.\\d+)?m?s\\b/', '/cubic-bezier\\(/'],
        '/^transition$/': ['/^all\\b/']
      },
      {
        message: (prop) =>
          /^(transition|animation)/.test(prop)
            ? USE_MOTION_TOKEN
            : `${USE_TOKEN} Named colors are not allowed.`
      }
    ]
  }
}
