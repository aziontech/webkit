import { curve, duration } from '../primitives/animations/animate.js'
import { fontFamily } from '../primitives/typography/font-family.js'
import { fontSize } from '../primitives/typography/font-size.js'
import { fontWeight } from '../primitives/typography/font-weight.js'
import { leading } from '../primitives/typography/leading.js'
import { tracking } from '../primitives/typography/tracking.js'

export const textsData = {
  'text-big-number-md': {
    fontSize: { _: fontSize.xl, sm: fontSize['2xl'], md: fontSize['4xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    fontFamily: fontFamily.display
  },
  'text-big-number-sm': {
    fontSize: { _: fontSize.base, sm: fontSize.xl },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    fontFamily: fontFamily.display
  },
  'text-big-number-lg': {
    fontSize: { _: fontSize['2xl'], sm: fontSize['4xl'], md: fontSize['6xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    fontFamily: fontFamily.display
  },
  'text-amount-lg': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize['3xl'], sm: fontSize['5xl'], md: fontSize['6xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    letterSpacing: '-0.08em'
  },
  'text-amount-md': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize.base, sm: fontSize.xl, md: fontSize['2xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    letterSpacing: '-0.08em'
  },
  'text-amount-sm': {
    fontSize: fontSize.base,
    lineHeight: leading.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: '-0.08em'
  },
  'text-heading-3xl': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize['3xl'], sm: fontSize['5xl'], md: fontSize['6xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.tighter
  },
  'text-heading-2xl': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize['3xl'], sm: fontSize['4xl'], md: fontSize['5xl'] },
    lineHeight: leading.none,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.tighter
  },
  'text-heading-xl': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize.xl, sm: fontSize['3xl'], md: fontSize['4xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.normal
  },
  'text-heading-lg': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize.lg, md: fontSize['3xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.normal
  },
  'text-heading-md': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize.base, sm: fontSize.xl, md: fontSize['2xl'] },
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.normal
  },
  'text-heading-sm': {
    textWrapStyle: 'balance',
    fontSize: { _: fontSize.sm, sm: fontSize.base, md: fontSize.lg },
    lineHeight: leading.snug,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.normal
  },
  'text-heading-xs': {
    textWrapStyle: 'balance',
    fontSize: fontSize.base,
    lineHeight: leading.snug,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.normal
  },
  'text-heading-xxs': {
    textWrapStyle: 'balance',
    fontSize: fontSize.sm,
    lineHeight: leading.snug,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.normal
  },
  'text-label-lg': {
    fontSize: fontSize.base,
    lineHeight: leading.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.tight
  },
  'text-label-md': {
    fontSize: fontSize.sm,
    lineHeight: leading.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.tight
  },
  'text-label-sm': {
    fontSize: fontSize.xs,
    lineHeight: leading.normal,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.tight
  },
  'text-label-code-sm': {
    fontFamily: fontFamily.code,
    fontSize: fontSize.xs,
    lineHeight: leading.none,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.wide
  },
  'text-body-code-sm': {
    textWrapStyle: 'pretty',
    fontFamily: fontFamily.code,
    fontSize: fontSize.xs,
    lineHeight: leading.relaxed,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.wide
  },
  'text-label-code-md': {
    fontFamily: fontFamily.code,
    fontSize: fontSize.sm,
    lineHeight: leading.none,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.wide
  },
  'text-label-code-lg': {
    fontFamily: fontFamily.code,
    fontSize: fontSize.base,
    lineHeight: leading.none,
    fontWeight: fontWeight.normal,
    letterSpacing: tracking.wide
  },
  'text-body-lg': {
    textWrapStyle: 'pretty',
    fontSize: { _: fontSize.base, md: fontSize.lg },
    fontWeight: fontWeight.normal,
    lineHeight: leading.snug
  },
  'text-body-md': {
    textWrapStyle: 'pretty',
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: leading.snug
  },
  'text-body-prose-md': {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: leading.relaxed
  },
  'text-body-sm': {
    textWrapStyle: 'pretty',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: leading.snug
  },
  'text-body-xs': {
    textWrapStyle: 'pretty',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: leading.snug
  },
  'text-body-xxs': {
    textWrapStyle: 'pretty',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: leading.normal
  },
  'text-tag-sm': {
    fontSize: fontSize.xs,
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal
  },
  'text-tag-md': {
    fontSize: fontSize.xs,
    lineHeight: leading.tight,
    fontWeight: fontWeight.normal
  },
  'text-overline-md': {
    fontFamily: fontFamily.display,
    fontSize: { _: fontSize.xs, sm: fontSize.sm },
    lineHeight: leading.snug,
    letterSpacing: tracking.widest,
    textTransform: 'uppercase'
  },
  'text-overline-sm': {
    fontFamily: fontFamily.display,
    fontSize: fontSize.xs,
    lineHeight: leading.snug,
    letterSpacing: tracking.widest,
    textTransform: 'uppercase'
  },
  'text-overline-xs': {
    fontFamily: fontFamily.display,
    fontSize: fontSize.xs,
    lineHeight: leading.snug,
    letterSpacing: tracking.widest,
    textTransform: 'uppercase'
  },
  'text-button-lg': {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: leading.tight,
    letterSpacing: tracking.normal
  },
  'text-button-md': {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: leading.tight,
    letterSpacing: tracking.normal
  },
  'text-link': {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'var(--text-link)',
    borderRadius: 'var(--shape-elements)',
    transition: `all ${duration['fast-02']} ${curve['productive-entrance']}`,
    states: {
      hover: {
        color: 'var(--text-link-hover)',
        textDecoration: 'underline'
      },
      'focus-visible': {
        outline: '2px solid var(--ring-color)',
        outlineOffset: '2px'
      }
    }
  }
}

export default { textsData }
