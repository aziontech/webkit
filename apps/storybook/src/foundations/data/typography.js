/**
 * Storybook typography catalog — class list from `.claude/docs/DESIGN.md` § Available text styles.
 * Token values compile from `packages/theme/src/tokens/semantic/texts.data.js` via `build-tokens.mjs`.
 */

/** @typedef {{ className: string; sample: string }} TypographyCatalogItem */

/** @type {TypographyCatalogItem[]} */
export const typographyCatalog = [
  { className: 'text-big-number-lg', sample: 'Big number lg' },
  { className: 'text-big-number-md', sample: 'Big number md' },
  { className: 'text-big-number-sm', sample: 'Big number sm' },
  { className: 'text-heading-2xl', sample: 'Heading 2xl' },
  { className: 'text-heading-xl', sample: 'Heading xl' },
  { className: 'text-heading-lg', sample: 'Heading lg' },
  { className: 'text-heading-md', sample: 'Heading md' },
  { className: 'text-heading-sm', sample: 'Heading sm' },
  { className: 'text-body-lg', sample: 'Body lg' },
  { className: 'text-body-md', sample: 'Body md' },
  { className: 'text-body-sm', sample: 'Body sm' },
  { className: 'text-body-xs', sample: 'Body xs' },
  { className: 'text-body-xxs', sample: 'Body xxs' },
  { className: 'text-label-lg', sample: 'Label lg' },
  { className: 'text-label-md', sample: 'Label md' },
  { className: 'text-label-sm', sample: 'Label sm' },
  { className: 'text-overline-md', sample: 'Overline md' },
  { className: 'text-overline-sm', sample: 'Overline sm' },
  { className: 'text-overline-xs', sample: 'Overline xs' },
  { className: 'text-button-lg', sample: 'Button lg' },
  { className: 'text-button-md', sample: 'Button md' }
]

/** Inline link demo — DESIGN.md § Inline links vs navigation `Link` */
export const typographyLinkDemo = {
  parentClass: 'text-body-md',
  beforeLink: 'Read the ',
  linkClass: 'text-link',
  linkLabel: 'documentation',
  afterLink: '.'
}

export {
  breakpointRows,
  breakpoints,
  buildTypographyTokens,
  getActiveBreakpoint,
  resolveResponsiveValue,
  typographyGroups,
  typographyTokens
} from '../utils/from-tokens.js'
